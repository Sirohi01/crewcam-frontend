'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Target,
  Receipt,
  CreditCard,
  FileText,
  Wrench,
  Rocket,
  Database,
  LifeBuoy,
  BarChart3,
  PieChart,
  Settings as SettingsIcon,
  ShieldAlert,
  Flag,
  Shield,
  LogOut,
  Workflow,
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/super-admin', icon: LayoutDashboard, label: 'Dashboard', live: true },
  { href: '/super-admin/companies', icon: Building2, label: 'Companies', live: true },
  { href: '/super-admin/crm', icon: Briefcase, label: 'CRM', live: true },
  { href: '/super-admin/leads', icon: Target, label: 'Leads', live: true },
  { href: '/super-admin/setup-fees', icon: Receipt, label: 'Setup Fees', live: true },
  { href: '/super-admin/subscriptions', icon: CreditCard, label: 'Subscriptions', live: true },
  { href: '/super-admin/invoices', icon: FileText, label: 'Invoices', live: true },
  { href: '/super-admin/implementations', icon: Wrench, label: 'Implementations', live: true },
  { href: '/super-admin/deployments', icon: Rocket, label: 'Deployments', live: true },
  { href: '/super-admin/workspace-provisioning', icon: Database, label: 'Workspace Provisioning', live: true },
  { href: '/super-admin/support', icon: LifeBuoy, label: 'Support', live: true },
  { href: '/super-admin/reports', icon: BarChart3, label: 'Reports', live: true },
  { href: '/super-admin/analytics', icon: PieChart, label: 'Analytics', live: true },
  { href: '/super-admin/settings', icon: SettingsIcon, label: 'Settings', live: true },
  { href: '/super-admin/audit-logs', icon: ShieldAlert, label: 'Audit Logs', live: true },
  { href: '/super-admin/automation', icon: Workflow, label: 'Automation', live: true },
  { href: '/super-admin/features', icon: Flag, label: 'Feature Flags', live: true },
  { href: '/super-admin/ai-providers', icon: Bot, label: 'AI Providers', live: true },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort server-side revoke; clear local session regardless.
    }
    logout();
    router.replace('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-md text-base tracking-tight text-slate-900">CREWCAM</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/super-admin'
              ? pathname === '/super-admin'
              : pathname.startsWith(item.href);
            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={<item.icon size={16} />}
                label={item.label}
                active={active}
                comingSoon={!item.live}
              />
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} />
            <span>Sign Out</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  href, icon, label, active = false, comingSoon = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; comingSoon?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {comingSoon && (
        <span className="text-[9px] font-md uppercase tracking-wide text-slate-400">Soon</span>
      )}
    </Link>
  );
}
