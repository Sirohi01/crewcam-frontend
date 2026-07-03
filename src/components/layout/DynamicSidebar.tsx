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
  Receipt, FileSignature, ListTree, Wallet, Circle, Sparkles, ClipboardList, LucideIcon, ChevronRight, ChevronDown,
  LayoutGrid,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, Building2, Settings, LogOut, Briefcase, UserCog, Plug, Palette,
  Shield, ShieldCheck, Clock, Calendar, MessageSquare, Scale, TrendingUp, UserPlus, IndianRupee,
  Receipt, FileSignature, ListTree, Wallet, Circle, Sparkles, ClipboardList, LayoutGrid,
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

// Static item injected under PEOPLE section
const STATIC_PEOPLE_ITEMS: SidebarItem[] = [];


export default function DynamicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    logout();
    router.replace('/login');
  };

  const { data: items } = useQuery<SidebarItem[]>({
    queryKey: ['sidebar', 'mine'],
    queryFn: async () => (await api.get('/permissions/sidebar-config/mine')).data,
    staleTime: 5 * 60 * 1000,
  });

  const sections: { section: string; items: GroupedItem[] }[] = [];
  // Merge dynamic items with static injected items, then sort by order
  const allItems = [...(items || []), ...STATIC_PEOPLE_ITEMS].sort((a, b) => a.order - b.order);
  allItems.forEach((item) => {
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
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) transparent;
          overflow-x: hidden;
        }
      `}</style>
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
          borderRight: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        {/* Logo */}
        <div
          className="flex h-14 items-center px-4"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}
        >
          <Image
            src="/crewcam.png"
            alt="Crewcam"
            width={1073}
            height={156}
            priority
            className="h-auto w-full max-w-[190px] object-contain"
          />
        </div>

        {/* Nav */}
        <div className="sidebar-scroll flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-4">
            {sections.map((group) => (
              <nav key={group.section} className="space-y-0.5">
                <SectionLabel>{group.section}</SectionLabel>
                {group.items.map((item) => {
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

        {/* Sign out */}
        <div className="p-2" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md transition-colors text-left"
            style={{ color: '#fca5a5' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(248,113,113,0.15)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    // was #818cf8 — bumped to #a5b4fc for better visibility
    <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a5b4fc' }}>
      {children}
    </div>
  );
}

function NavItem({
  href, icon, label, active = false, disabled = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  if (disabled) {
    return (
      <div
        title="Not built yet"
        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md opacity-50 cursor-not-allowed select-none"
        style={{ color: '#e2e8f0' }} // was #94a3b8
      >
        {icon}
        <span className="flex-1 truncate">{label}</span>
        <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#94a3b8' }}>Soon</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
      style={
        active
          ? { backgroundColor: 'rgba(99,102,241,0.3)', color: '#ffffff', borderLeft: '2px solid #a5b4fc' }
          : { color: '#e2e8f0' } // was #cbd5e1 — brighter now
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(99,102,241,0.15)';
          (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0';
        }
      }}
    >
      {icon}
      <span className="truncate">{label}</span>
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
        className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
        style={
          isAnyChildActive
            ? { color: '#c7d2fe', backgroundColor: 'rgba(99,102,241,0.15)' } // was #a5b4fc
            : { color: '#e2e8f0' } // was #cbd5e1
        }
        onMouseEnter={(e) => {
          if (!isAnyChildActive) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(99,102,241,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isAnyChildActive) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
          }
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Briefcase size={14} className="flex-shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <span className="flex-shrink-0 ml-1">
          {expanded
            ? <ChevronDown size={14} style={{ opacity: 0.6 }} />
            : <ChevronRight size={14} style={{ opacity: 0.6 }} />
          }
        </span>
      </button>

      {expanded && (
        <div
          className="pl-5 space-y-0.5 ml-3 py-1"
          style={{ borderLeft: '1px solid rgba(99,102,241,0.35)' }}
        >
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item._id}
                href={item.href}
                className="block px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={
                  isActive
                    ? { backgroundColor: 'rgba(99,102,241,0.3)', color: '#ffffff' }
                    : { color: '#e2e8f0' } // was #cbd5e1
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(99,102,241,0.15)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0';
                  }
                }}
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