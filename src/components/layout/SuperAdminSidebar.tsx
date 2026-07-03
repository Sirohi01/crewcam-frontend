'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  Bot,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { LEAD_STAGE_GROUPS, stageGroupQuery } from '@/lib/leadStages';

const LEADS_HREF = '/super-admin/leads';

const NAV_ITEMS: Array<{
  href: string; icon: React.ElementType; label: string; live: boolean;
  children?: { href: string; label: string }[];
}> = [
  { href: '/super-admin', icon: LayoutDashboard, label: 'Dashboard', live: true },
  { href: '/super-admin/crm', icon: Briefcase, label: 'CRM', live: true },
  {
    href: LEADS_HREF, icon: Target, label: 'Leads', live: true,
    children: [
      { href: `${LEADS_HREF}/new`, label: 'Add New Lead' },
      ...LEAD_STAGE_GROUPS.filter((g) => g.key === 'NEW').map((g) => ({ href: `${LEADS_HREF}?stage=${stageGroupQuery(g)}`, label: g.navLabel })),
      { href: `${LEADS_HREF}/follow-ups`, label: 'Follow Ups' },
      ...LEAD_STAGE_GROUPS.filter((g) => g.key !== 'NEW').map((g) => ({ href: `${LEADS_HREF}?stage=${stageGroupQuery(g)}`, label: g.navLabel })),
      { href: LEADS_HREF, label: 'Master Data' },
    ],
  },
  { href: '/super-admin/companies', icon: Building2, label: 'Companies', live: true },
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
  const searchParams = useSearchParams();
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
    <>
      <style>{`
        .sa-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sa-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sa-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .sa-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        .sa-sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; overflow-x: hidden; }
      `}</style>
      <aside
        className="w-64 flex-shrink-0 flex flex-col relative z-20"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
          borderRight: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div
          className="h-16 flex items-center px-6"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-600/30">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-base tracking-tight text-white">
              en<span className="text-red-400">Codency</span>
            </span>
          </div>
        </div>

        <div className="sa-sidebar-scroll flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/super-admin'
                ? pathname === '/super-admin'
                : pathname.startsWith(item.href);
              if (item.children) {
                return (
                  <NavGroup
                    key={item.href}
                    icon={<item.icon size={16} />}
                    label={item.label}
                    sectionActive={active}
                    items={item.children}
                    pathname={pathname}
                    searchParams={searchParams}
                  />
                );
              }
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

        <div className="p-4" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  href, icon, label, active = false, comingSoon = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; comingSoon?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
        ? 'bg-red-600/20 text-red-400 border border-red-500/20'
        : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {comingSoon && (
        <span className="text-[9px] font-medium uppercase tracking-wide text-white/30">Soon</span>
      )}
    </Link>
  );
}

function NavGroup({
  icon, label, sectionActive, items, pathname, searchParams,
}: {
  icon: React.ReactNode;
  label: string;
  sectionActive: boolean;
  items: { href: string; label: string }[];
  pathname: string;
  searchParams: URLSearchParams;
}) {
  const isChildActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?');
    if (pathname !== hrefPath) return false;
    return (hrefQuery || '') === searchParams.toString();
  };
  const [expanded, setExpanded] = React.useState(sectionActive);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${sectionActive
          ? 'bg-red-600/20 text-red-400 border border-red-500/20'
          : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {expanded && (
        <div className="ml-3 pl-3 space-y-1" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          {items.map((item) => {
            const active = isChildActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${active
                  ? 'bg-red-600/20 text-red-400 font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
