'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHydrated(useAuthStore.persist.hasHydrated());
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mounted && hydrated && !isAuthenticated) {
      // Prevent aggressive logout during Next.js Fast Refresh
      // document.cookie = "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.replace('/login');
    }
  }, [mounted, hydrated, isAuthenticated, router, pathname]);

  if (!mounted || !hydrated) {
    return <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
