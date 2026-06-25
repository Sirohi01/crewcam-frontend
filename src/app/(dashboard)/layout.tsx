import React from 'react';
import CompanySidebar from '@/components/layout/CompanySidebar';
import OnboardingWizardPrompt from '@/components/layout/OnboardingWizardPrompt';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import AuthGuard from '@/components/auth/AuthGuard';
import SOSButton from '@/components/common/SOSButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50">
      <OnboardingWizardPrompt />
      {/* Sidebar (Tight Layout) */}
      <CompanySidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Tight Layout) */}
        <DashboardTopbar />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-2">
          {children}
        </div>
      </main>
      
      <SOSButton />
    </div>
    </AuthGuard>
  );
}


