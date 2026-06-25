'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Server, Package, Shield, LogOut, Sparkles, UserCog2, CreditCard, ShieldAlert, FlaskConical, Plug, Image as ImageIcon } from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const comingSoon = (feature: string) => `/super-admin/coming-soon?feature=${encodeURIComponent(feature)}&module=${encodeURIComponent('Super Admin')}`;

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

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <h3 className="px-3 text-[10px] font-md uppercase tracking-wider text-slate-400 mb-2">Global System</h3>
          <nav className="space-y-1">
            <NavItem href="/super-admin" icon={<LayoutDashboard size={16} />} label="Dashboard" active={pathname === '/super-admin'} />
            <NavItem href="/super-admin/tenants" icon={<Server size={16} />} label="Tenant Companies" active={pathname.includes('/super-admin/tenants')} />
            <NavItem href="/super-admin/packages" icon={<Package size={16} />} label="Packages & Limits" active={pathname.includes('/super-admin/packages')} />
            <NavItem href="/super-admin/features" icon={<Shield size={16} />} label="Features & Permissions" active={pathname.includes('/super-admin/features')} />
            <NavItem href="/super-admin/banners" icon={<ImageIcon size={16} />} label="Dashboard Banners" active={pathname.includes('/super-admin/banners')} />
          </nav>
        </div>

        {/* docs/modules/3A_SUPER_ADMIN_REVIEW.md gaps — seeded now (static) so the full
            Super Admin scope is visible; each lands on a real page in Phase N. */}
        <div>
          <h3 className="px-3 text-[10px] font-md uppercase tracking-wider text-slate-400 mb-2">Platform Insight</h3>
          <nav className="space-y-1">
            <NavItem href={comingSoon('AI Usage & Cost')} icon={<Sparkles size={16} />} label="AI Usage & Cost" active={pathname.includes('/super-admin/ai-usage')} disabled />
            <NavItem href={comingSoon('Integration Health')} icon={<Plug size={16} />} label="Integration Health" active={pathname.includes('/super-admin/integration-health')} disabled />
            <NavItem href={comingSoon('Security Dashboard')} icon={<ShieldAlert size={16} />} label="Security Dashboard" active={pathname.includes('/super-admin/security')} disabled />
          </nav>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-md uppercase tracking-wider text-slate-400 mb-2">Platform Admin</h3>
          <nav className="space-y-1">
            <NavItem href={comingSoon('Tenant Impersonation')} icon={<UserCog2 size={16} />} label="Impersonation" active={pathname.includes('/super-admin/impersonation')} disabled />
            <NavItem href={comingSoon('Billing & Subscriptions')} icon={<CreditCard size={16} />} label="Billing & Subscriptions" active={pathname.includes('/super-admin/billing')} disabled />
            <NavItem href={comingSoon('Sandbox Mode')} icon={<FlaskConical size={16} />} label="Sandbox Mode" active={pathname.includes('/super-admin/sandbox')} disabled />
          </nav>
        </div>
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
  href, icon, label, active = false, disabled = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <div title="Not built yet" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 opacity-50 cursor-not-allowed select-none">
        {icon}
        <span className="flex-1 truncate">{label}</span>
        <span className="text-[9px] font-md uppercase tracking-wide text-slate-400">Soon</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
