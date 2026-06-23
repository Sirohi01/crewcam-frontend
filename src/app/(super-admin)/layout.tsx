import React from 'react';
import SuperAdminSidebar from '@/components/layout/SuperAdminSidebar';
import AuthGuard from '@/components/auth/AuthGuard';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50">

        {/* Modern Expandable Sidebar */}
        <SuperAdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">

          {/* Top Header */}
          <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-md text-slate-800">Encodency Portal</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-md text-slate-900">System Admin</p>
                  <p className="text-[10px] text-slate-500">admin@crewcam.app</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-md flex items-center justify-center text-xs border border-indigo-200">
                  SA
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-auto px-4 py-4">
            <div className="w-full h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
