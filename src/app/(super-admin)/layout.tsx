import React, { Suspense } from 'react';
import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar';
import AuthGuard from '@/components/auth/AuthGuard';
import ForceLight from '@/components/theme/ForceLight';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ForceLight />
      <div className="flex h-screen w-full bg-slate-100 overflow-hidden text-slate-900">

        {/* Dark gradient sidebar */}
        <Suspense fallback={null}>
          <SuperAdminSidebar />
        </Suspense>

        {/* Main Content Area – always light */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50">

          {/* Top Header */}
          <header 
            className="h-12 flex items-center justify-between px-5 shrink-0 gap-4 sticky top-0 z-10 shadow-sm"
            style={{
              background: 'rgba(0, 19, 51)',
              borderBottom: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-wide" style={{ color: '#e2e8f0' }}>Encodency Portal</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-medium text-slate-300">System Admin</p>
                <p className="text-[10px] text-slate-400">admin@crewcam.app</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-red-100 text-red-700 font-medium flex items-center justify-center text-xs border border-red-200">
                SA
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-auto p-2">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
