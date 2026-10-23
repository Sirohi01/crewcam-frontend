import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id?: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  tenantId?: string;
}

interface AuthState {
  user: User | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tenantId?: string) => void;
  logout: () => void;
  setTenantId: (tenantId: string) => void;
}

// The real access/refresh tokens live only in httpOnly cookies set by the backend
// (see issueSession in authController.ts) — the API never hands them to JS, and this
// store never holds one. Every authenticated request goes through `api` (src/lib/axios.ts),
// which sends `withCredentials: true` so the cookie rides along automatically.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenantId: null,
      isAuthenticated: false,
      setAuth: (user, tenantId) => {
        if (typeof window !== 'undefined') {
          if (tenantId) localStorage.setItem('tenant_id', tenantId);
          // Named per-portal (not just "has_session") so logging out of crewcam-superadmin,
          // which runs on a different port of the same bare "localhost" in dev, can never
          // clear this app's session cookie — cookies aren't port-scoped, only host-scoped.
          document.cookie = "has_session_employer=true; path=/; max-age=86400; samesite=lax";
        }
        set({ user, tenantId: tenantId || null, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tenant_id');
          document.cookie = "has_session_employer=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, tenantId: null, isAuthenticated: false });
      },
      setTenantId: (tenantId) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenant_id', tenantId);
        }
        set({ tenantId });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
