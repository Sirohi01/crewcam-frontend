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
  LayoutGrid, User, GraduationCap, ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Users, Building2, Settings, LogOut, Briefcase, UserCog, Plug, Palette,
  Shield, ShieldCheck, Clock, Calendar, MessageSquare, Scale, TrendingUp, UserPlus, IndianRupee,
  Receipt, FileSignature, ListTree, Wallet, Circle, Sparkles, ClipboardList, LayoutGrid, User, GraduationCap,
  ShieldAlert,
};

interface SidebarItem {
  _id: string;
  section: string;
  label: string;
  href: string;
  icon: string;
  order: number;
  parent?: string;
  subParent?: string;
}

type GroupedItem = SidebarItem | { isGroup: true; label: string; children: GroupedItem[] };

const STATIC_PEOPLE_ITEMS: SidebarItem[] = [
  { _id: 'e1', section: 'WORKSPACE', label: 'Dashboard', href: '/dashboard/employee', icon: 'LayoutDashboard', order: 1 },
  { _id: 'e2', section: 'WORKSPACE', label: 'My Profile', href: '/dashboard/my-profile-extension', icon: 'User', order: 2 },
  { _id: 'e3', section: 'WORKSPACE', label: 'Attendance', href: '/dashboard/attendance', icon: 'Clock', order: 3 },
  { _id: 'e4', section: 'WORKSPACE', label: 'Leave', href: '/dashboard/employee-leave', icon: 'Calendar', order: 4 },
  { _id: 'e5', section: 'WORKSPACE', label: 'My Performance', href: '/dashboard/my-performance', icon: 'TrendingUp', order: 5 },
  { _id: 'e6', section: 'WORKSPACE', label: 'Goals & OKRs', href: '/dashboard/goals-and-okrs', icon: 'Circle', order: 6 },
  { _id: 'e7', section: 'WORKSPACE', label: 'Payslip & Income Tax', href: '/dashboard/payslip-and-income-tax', icon: 'Receipt', order: 7 },
  { _id: 'e8', section: 'WORKSPACE', label: 'Reimbursement (Imprest)', href: '/dashboard/reimbursement', icon: 'Wallet', order: 8 },
  { _id: 'e9', section: 'WORKSPACE', label: 'My Requests', href: '/dashboard/my-requests', icon: 'ClipboardList', order: 9 },
  { _id: 'e10', section: 'WORKSPACE', label: 'My Tasks', href: '/dashboard/my-tasks', icon: 'ListTree', order: 10 },
  { _id: 'e11', section: 'WORKSPACE', label: 'Training & Development', href: '/dashboard/training-development', icon: 'GraduationCap', order: 11 },
  { _id: 'e12', section: 'WORKSPACE', label: 'Policies & Documents', href: '/dashboard/policies', icon: 'FileSignature', order: 12 },
  { _id: 'e13', section: 'WORKSPACE', label: 'Company Directory', href: '/dashboard/company-directory', icon: 'Users', order: 13 },
  { _id: 'e14', section: 'WORKSPACE', label: 'Announcements', href: '/dashboard/announcements', icon: 'MessageSquare', order: 14 },
  { _id: 'e15', section: 'WORKSPACE', label: 'Helpdesk / Support', href: '/dashboard/helpdesk', icon: 'ShieldCheck', order: 15 },
  { _id: 'e16', section: 'WORKSPACE', label: 'Settings', href: '/dashboard/settings', icon: 'Settings', order: 16 },
];

const STATIC_RECRUITMENT_ITEMS: SidebarItem[] = [
  { _id: 'r1', section: 'WORKSPACE', label: 'HR Dashboard', href: '/dashboard/hr-dashboard', icon: 'LayoutDashboard', order: 2.01, parent: 'Requirement' },
  { _id: 'r2', section: 'WORKSPACE', label: 'Job Requisition', href: '/dashboard/hiring/manpower', icon: 'Briefcase', order: 2.02, parent: 'Requirement' },
  { _id: 'r3', section: 'WORKSPACE', label: 'Job Opening', href: '/dashboard/hiring/job-opening', icon: 'ListTree', order: 2.03, parent: 'Requirement' },
  { _id: 'r3b', section: 'WORKSPACE', label: 'Post New Job', href: '/dashboard/hiring/jobs/new', icon: 'PlusSquare', order: 2.04, parent: 'Requirement' },

  { _id: 'r4e', section: 'WORKSPACE', label: 'Job Applications', href: '/dashboard/hiring/applications', icon: 'FileText', order: 2.05, parent: 'Requirement' },
  // { _id: 'r4', section: 'WORKSPACE', label: 'Review and Edit', href: '/dashboard/hiring/candidates/new/create/review-and-edit', icon: 'FileSignature', order: 2.06, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4a', section: 'WORKSPACE', label: 'Submit Application', href: '/dashboard/hiring/candidates/new/create/submit-application-preview', icon: 'UserPlus', order: 2.07, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4a', section: 'WORKSPACE', label: 'AI Screening Evaluation', href: '/dashboard/hiring/candidates/new/create/ai-screening-application-evaluation', icon: 'Sparkles', order: 2.07, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4b', section: 'WORKSPACE', label: 'HOD Evaluation', href: '/dashboard/hiring/candidates/new/create/evaluation', icon: 'UserPlus', order: 2.08, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4c', section: 'WORKSPACE', label: 'Interview Round - 1', href: '/dashboard/hiring/candidates/new/create/interview-process', icon: 'UserPlus', order: 2.09, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4c', section: 'WORKSPACE', label: 'Interview Round - 2', href: '/dashboard/hiring/candidates/new/create/round-2', icon: 'UserPlus', order: 2.09, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4c', section: 'WORKSPACE', label: 'Interview Round - 3', href: '/dashboard/hiring/candidates/new/create/interview', icon: 'UserPlus', order: 2.09, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4d', section: 'WORKSPACE', label: 'Interview Round - 4', href: '/dashboard/hiring/candidates/new/create/assessment', icon: 'UserPlus', order: 2.10, parent: 'Requirement', subParent: 'Job Application' },
  // { _id: 'r4d', section: 'WORKSPACE', label: 'Interview Round - 5', href: '/dashboard/hiring/candidates/new/create/round-5', icon: 'UserPlus', order: 2.11, parent: 'Requirement', subParent: 'Job Application' },

  // { _id: 'r5', section: 'WORKSPACE', label: 'Application Submitted', href: '/dashboard/application-submitted', icon: 'FileSignature', order: 2.11, parent: 'Requirement', subParent: 'Job Application' },

  { _id: 'r6', section: 'WORKSPACE', label: 'All candidates', href: '/dashboard/all-candidates', icon: 'Users', order: 2.12, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r7', section: 'WORKSPACE', label: 'New Application', href: '/dashboard/hiring/candidates/new/create/new-applications', icon: 'User', order: 2.13, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r8', section: 'WORKSPACE', label: 'Shortlist candidates', href: '/dashboard/shortlisted-candidates-ui', icon: 'ShieldCheck', order: 2.14, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r9', section: 'WORKSPACE', label: 'Hold Candidates', href: '/dashboard/hiring/candidates/hold', icon: 'Clock', order: 2.15, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r10', section: 'WORKSPACE', label: 'Rejected candidates', href: '/dashboard/rejected-candidates', icon: 'Circle', order: 2.16, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r10', section: 'WORKSPACE', label: 'Selected candidates', href: '/dashboard/hiring/candidates/selected', icon: 'Circle', order: 2.16, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r11', section: 'WORKSPACE', label: 'Ai screening', href: '/dashboard/ai-screening', icon: 'Sparkles', order: 2.17, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r12', section: 'WORKSPACE', label: 'Assessments', href: '/dashboard/assessments', icon: 'ClipboardList', order: 2.19, parent: 'Requirement', subParent: 'Candidates' },
  { _id: 'r13', section: 'WORKSPACE', label: 'Interviews', href: '/dashboard/interviews', icon: 'MessageSquare', order: 2.20, parent: 'Requirement' },
  { _id: 'r14', section: 'WORKSPACE', label: 'Offers', href: '/dashboard/offers', icon: 'FileSignature', order: 2.21, parent: 'Requirement' },
  { _id: 'r15', section: 'WORKSPACE', label: 'Onboarding', href: '/dashboard/onboarding', icon: 'UserPlus', order: 2.22, parent: 'Requirement' },
  { _id: 'r16', section: 'WORKSPACE', label: 'Reports Analytics', href: '/dashboard/report-analytics', icon: 'TrendingUp', order: 2.23, parent: 'Requirement' },
];

export default function DynamicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch { }
    logout();
    router.replace('/login');
  };

  const { data, isLoading } = useQuery<{ items: SidebarItem[]; roleCategory: string }>({
    queryKey: ['sidebar', 'mine'],
    queryFn: async () => (await api.get('/permissions/sidebar-config/mine')).data,
    staleTime: 5 * 60 * 1000,
  });
  // The API returns an array directly, but previously the code expected { items, roleCategory }
  const items = Array.isArray(data) ? data : data?.items;
  const roleCategory = data?.roleCategory;

  const sections: { section: string; items: GroupedItem[] }[] = [];

  // If loading, we wait. Whether to merge the dynamic (role-permissioned) items with
  // the static employee items comes straight from the backend-resolved role category
  // (see resolveRoleCategory) — a plain 'employee' only gets the static self-service
  // items, every other category (company_admin, hr, hr_admin, hod, finance, admin,
  // developer, reporting_manager) gets both. This used to be guessed client-side from
  // which sidebar sections happened to come back, which broke for any admin whose role
  // didn't have the specific permissions gating those particular sections.
  const allItems = React.useMemo(() => {
    if (isLoading) return [];

    const safeItems = items || [];

    const isSuperAdminOrCompanyAdmin = ['company_admin', 'super_admin'].includes(roleCategory || '');

    const isHrRecruiter = ['hr_recruiter', 'hr', 'hr_admin', 'company_admin', 'hod'].includes(roleCategory || '') || safeItems.some(item =>
      ['Hiring Process', 'Requirement', 'Recruitment'].includes(item.section)
    );

    let merged = [...STATIC_PEOPLE_ITEMS];

    // Only show API sidebar data for super_admin and company_admin
    if (isSuperAdminOrCompanyAdmin) {
      merged = [...merged, ...safeItems];
    }

    if (isHrRecruiter) {
      merged = [...merged, ...STATIC_RECRUITMENT_ITEMS];
    }

    return merged.sort((a, b) => a.order - b.order);
    // return [...safeItems, ...STATIC_PEOPLE_ITEMS].sort((a, b) => a.order - b.order);
  }, [items, isLoading, roleCategory]);

  allItems.forEach((item) => {
    let group = sections.find((s) => s.section === item.section);
    if (!group) {
      group = { section: item.section, items: [] };
      sections.push(group);
    }
    if (item.parent) {
      let parentGroup = group.items.find((i) => 'isGroup' in i && i.label === item.parent) as { isGroup: true; label: string; children: GroupedItem[] } | undefined;
      if (!parentGroup) {
        parentGroup = { isGroup: true, label: item.parent, children: [] };
        group.items.push(parentGroup);
      }

      if (item.subParent) {
        let subParentGroup = parentGroup.children.find((i) => 'isGroup' in i && i.label === item.subParent) as { isGroup: true; label: string; children: GroupedItem[] } | undefined;
        if (!subParentGroup) {
          subParentGroup = { isGroup: true, label: item.subParent, children: [] };
          parentGroup.children.push(subParentGroup);
        }
        subParentGroup.children.push(item);
      } else {
        parentGroup.children.push(item);
      }
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
        className="hidden lg:flex w-64 flex-shrink-0 flex-col"
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
          // style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Nav */}
        <div className="sidebar-scroll flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-4">

            {sections.map((group) => (
              <nav key={group.section} className="space-y-0.5">
                {group.section !== 'WORKSPACE' && <SectionLabel>{group.section}</SectionLabel>}
                {group.items.map((item) => {
                  if ('isGroup' in item) {
                    return <NavGroup key={item.label} label={item.label} items={item.children} pathname={pathname} level={0} />;
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

function NavGroup({ label, items, pathname, level = 0 }: { label: string; items: GroupedItem[]; pathname: string, level?: number }) {
  const isAnyChildActive = items.some(item => {
    if ('isGroup' in item) {
      // Very naive check for nested active states, could be expanded
      return item.children.some(child => !('isGroup' in child) && (pathname === child.href || (child.href !== '/dashboard' && pathname.startsWith(child.href))));
    }
    return pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
  });
  const [expanded, setExpanded] = React.useState(isAnyChildActive);

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
        style={
          isAnyChildActive
            ? { color: '#c7d2fe', backgroundColor: 'rgba(99,102,241,0.15)' }
            : { color: '#e2e8f0' }
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
          {/* {label !== 'Job Application' && label !== 'Candidates' && (
            <Briefcase size={14} className="flex-shrink-0" />
          )} */}
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
          className="pl-2 space-y-0.5 ml-3 py-1"
          style={{ borderLeft: '1px solid rgba(99,102,241,0.35)' }}
        >
          {items.map((item) => {
            if ('isGroup' in item) {
              return <NavGroup key={item.label} label={item.label} items={item.children} pathname={pathname} level={level + 1} />;
            }

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
