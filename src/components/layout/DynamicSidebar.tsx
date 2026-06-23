'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  LayoutDashboard, Users, Building2, Settings, LogOut, Briefcase, UserCog, Plug, Palette,
  Shield, ShieldCheck, Clock, Calendar, MessageSquare, Scale, TrendingUp, UserPlus, IndianRupee,
  Receipt, FileSignature, ListTree, Wallet, Circle, Sparkles, ClipboardList, LucideIcon, ChevronRight, ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, Building2, Settings, LogOut, Briefcase, UserCog, Plug, Palette,
  Shield, ShieldCheck, Clock, Calendar, MessageSquare, Scale, TrendingUp, UserPlus, IndianRupee,
  Receipt, FileSignature, ListTree, Wallet, Circle, Sparkles, ClipboardList,
};

interface SidebarItem {
  _id: string;
  section: string;
  label: string;
  href: string;
  icon: string;
  order: number;
  parent?: string;
}

type GroupedItem = SidebarItem | { isGroup: true; label: string; children: SidebarItem[] };

export default function DynamicSidebar() {
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

  const { data: items } = useQuery<SidebarItem[]>({
    queryKey: ['sidebar', 'mine'],
    queryFn: async () => (await api.get('/permissions/sidebar-config/mine')).data,
    staleTime: 5 * 60 * 1000,
  });

  const sections: { section: string; items: GroupedItem[] }[] = [];
  (items || []).forEach((item) => {
    let group = sections.find((s) => s.section === item.section);
    if (!group) {
      group = { section: item.section, items: [] };
      sections.push(group);
    }

    if (item.parent) {
      let parentGroup = group.items.find((i) => 'isGroup' in i && i.label === item.parent) as { isGroup: true; label: string; children: SidebarItem[] } | undefined;
      if (!parentGroup) {
        parentGroup = { isGroup: true, label: item.parent, children: [] };
        group.items.push(parentGroup);
      }
      parentGroup.children.push(item);
    } else {
      group.items.push(item);
    }
  });

  return (
    <aside className="w-56 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="flex h-14 items-center border-b border-zinc-200 px-3 dark:border-zinc-800">
        <Image
          src="/crewcam.png"
          alt="Crewcam"
          width={1073}
          height={156}
          priority
          className="h-auto w-full max-w-[170px] object-contain"
        />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 space-y-4">
          {sections.map((group) => (
            <nav key={group.section} className="space-y-0.5">
              <SectionLabel>{group.section}</SectionLabel>
              {group.items.map((item, idx) => {
                if ('isGroup' in item) {
                  return <NavGroup key={item.label} label={item.label} items={item.children} pathname={pathname} />;
                }
                return (
                  <NavItem
                    key={item._id}
                    href={item.href}
                    icon={React.createElement(ICONS[item.icon] || Circle, { size: 14 })}
                    label={item.label}
                    active={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    disabled={item.href.includes('/coming-soon')}
                  />
                );
              })}
            </nav>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
        <nav className="space-y-0.5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/50 rounded-md transition-colors text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-2 pb-1 text-[10px] font-md uppercase tracking-wider text-zinc-400">{children}</div>;
}

function NavItem({
  href, icon, label, active = false, disabled = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <div
        title="Not built yet"
        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed select-none"
      >
        {icon}
        <span className="flex-1 truncate">{label}</span>
        <span className="text-[9px] font-md uppercase tracking-wide text-zinc-400 dark:text-zinc-600">Soon</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${active
        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function NavGroup({ label, items, pathname }: { label: string; items: SidebarItem[]; pathname: string }) {
  const isAnyChildActive = items.some(item => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
  const [expanded, setExpanded] = React.useState(isAnyChildActive);

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${isAnyChildActive ? 'text-indigo-600 dark:text-indigo-400 font-md bg-indigo-50/50 dark:bg-indigo-900/10' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
      >
        <div className="flex items-center gap-2">
          <Briefcase size={14} />
          <span>{label}</span>
        </div>
        {expanded ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
      </button>

      {expanded && (
        <div className="pl-6 space-y-0.5 border-l-2 border-zinc-100 dark:border-zinc-800/50 ml-3 py-1">
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.href}
              className={`block px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
