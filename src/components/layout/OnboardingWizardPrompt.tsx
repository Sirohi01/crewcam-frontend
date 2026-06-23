'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function OnboardingWizardPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes('/settings/company')) return;

    const checkProfile = async () => {
      try {
        const res = await api.get('/companies/profile');
        const profile = res.data;
        const isIncomplete = !profile.city || !profile.phone || profile.phone === 'N/A';

        if (isIncomplete) {
          setShowPrompt(true);
        }
      } catch (error: any) {
        console.error('Failed to check profile completion', error);
        if (error.response?.status === 404) {
          setShowPrompt(true);
        }
      }
    };

    checkProfile();
  }, [pathname]);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
          <Building2 size={24} />
        </div>
        <h2 className="text-lg font-md text-center text-zinc-900 mb-2">Complete Your Company Profile</h2>
        <p className="text-sm text-center text-zinc-500 mb-6">
          Welcome to the platform! Before you start adding employees, please complete your company's geographical and statutory compliance details.
        </p>
        <Button
          onClick={() => {
            setShowPrompt(false);
            router.push('/dashboard/settings/company');
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
        >
          Go to Settings Wizard <ArrowRight className="ml-2" size={16} />
        </Button>
      </div>
    </div>
  );
}
