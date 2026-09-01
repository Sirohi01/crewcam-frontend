import React from 'react';
import CompanySidebar from '@/components/layout/CompanySidebar';
import OnboardingWizardPrompt from '@/components/layout/OnboardingWizardPrompt';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import AuthGuard from '@/components/auth/AuthGuard';
import SOSButton from '@/components/common/SOSButton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50 print:h-auto print:overflow-visible print:block">
        <OnboardingWizardPrompt />
        {/* Sidebar (Tight Layout) */}
        <CompanySidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 print:block print:h-auto print:overflow-visible">
          {/* Topbar (Tight Layout) */}
          <DashboardTopbar />

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-slate-50/20 p-2 print:overflow-visible print:h-auto print:p-0 print:bg-white print:block">
            {children}
          </div>
        </main>

        <SOSButton />
      </div>
    </AuthGuard>
  );
}


