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
import { useUIStore } from '@/store/uiStore';

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
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
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
  const items = Array.isArray(data) ? data : data?.items;
  const roleCategory = data?.roleCategory;

  const sections: { section: string; items: GroupedItem[] }[] = [];

  const allItems = React.useMemo(() => {
    if (isLoading) return [];

    const safeItems = items || [];

    const isSuperAdminOrCompanyAdmin = ['company_admin', 'super_admin'].includes(roleCategory || '');

    const isHrRecruiter = ['hr_recruiter', 'hr', 'hr_admin', 'company_admin', 'hod'].includes(roleCategory || '') || safeItems.some(item =>
      ['Hiring Process', 'Requirement', 'Recruitment'].includes(item.section)
    );

    let merged = [...STATIC_PEOPLE_ITEMS];

    if (isSuperAdminOrCompanyAdmin) {
      merged = [...merged, ...safeItems];
    }

    if (isHrRecruiter) {
      merged = [...merged, ...STATIC_RECRUITMENT_ITEMS];
    }

    return merged.sort((a, b) => a.order - b.order);
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
        className={`hidden lg:flex flex-shrink-0 flex-col transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-[68px]'}`}
        style={{
          background: 'rgba(0, 19, 51)',
          borderRight: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        {/* Logo */}
        <div
          className={`flex h-14 items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} overflow-hidden transition-all shrink-0`}
          style={{ borderBottom: '1px solid rgba(99,102,241,0.2)' }}
        >
          {isSidebarOpen ? (
            <Image
              src="/crewcam.png"
              alt="Crewcam"
              width={1073}
              height={156}
              priority
              className="h-auto w-full max-w-[190px] object-contain shrink-0"
            />
          ) : (
            <div className="text-xl font-black text-indigo-400">C</div>
          )}
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
        <div className={`p-2 flex ${isSidebarOpen ? '' : 'justify-center'}`} style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
          <button
            onClick={handleSignOut}
            title={!isSidebarOpen ? "Sign Out" : undefined}
            className={`flex items-center gap-2 py-1.5 text-xs font-medium transition-colors ${isSidebarOpen ? 'w-full px-2 rounded-md text-left' : 'w-9 h-9 justify-center rounded-xl'}`}
            style={{ color: '#fca5a5' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(248,113,113,0.15)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={14} className="shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  if (!isSidebarOpen) {
    return <div className="mx-4 my-3 h-px bg-indigo-400/20" />;
  }
  return (
    <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#a5b4fc' }}>
      {children}
    </div>
  );
}

function NavItem({
  href, icon, label, active = false, disabled = false,
}: { href: string; icon: React.ReactNode; label: string; active?: boolean; disabled?: boolean }) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  if (disabled) {
    return (
      <div
        title="Not built yet"
        className={`flex items-center gap-2 py-1.5 text-xs font-medium opacity-50 cursor-not-allowed select-none transition-all ${isSidebarOpen ? 'px-2 rounded-md' : 'px-0 justify-center mx-auto'}`}
        style={{ color: '#e2e8f0', width: isSidebarOpen ? 'auto' : '36px', height: isSidebarOpen ? 'auto' : '36px', borderRadius: isSidebarOpen ? '6px' : '12px' }}
      >
        <div className="shrink-0 flex items-center justify-center">{icon}</div>
        {isSidebarOpen && <span className="flex-1 truncate">{label}</span>}
        {isSidebarOpen && <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: '#94a3b8' }}>Soon</span>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      title={!isSidebarOpen ? label : undefined}
      className={`flex items-center gap-2 py-1.5 text-xs font-medium transition-all ${isSidebarOpen ? 'px-3' : 'justify-center px-0 mx-auto'}`}
      style={
        active
          ? { 
              background: 'linear-gradient(90deg, #d97706 0%, #92400e 100%)', 
              color: '#ffffff', 
              border: '1px solid rgba(251, 191, 36, 0.5)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
              borderRadius: isSidebarOpen ? '9999px' : '12px',
              width: isSidebarOpen ? 'auto' : '36px',
              height: isSidebarOpen ? 'auto' : '36px',
            }
          : { 
              color: '#e2e8f0', 
              borderRadius: isSidebarOpen ? '6px' : '12px',
              width: isSidebarOpen ? 'auto' : '36px',
              height: isSidebarOpen ? 'auto' : '36px',
            }
      }
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
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
      <div className="shrink-0 flex items-center justify-center">{icon}</div>
      {isSidebarOpen && <span className="truncate">{label}</span>}
    </Link>
  );
}

function NavGroup({ label, items, pathname, level = 0 }: { label: string; items: GroupedItem[]; pathname: string, level?: number }) {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const isAnyChildActive = items.some(item => {
    if ('isGroup' in item) {
      return item.children.some(child => !('isGroup' in child) && (pathname === child.href || (child.href !== '/dashboard' && pathname.startsWith(child.href))));
    }
    return pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
  });
  const [expanded, setExpanded] = React.useState(isAnyChildActive);

  return (
    <div className="space-y-0.5 flex flex-col">
      <button
        onClick={() => {
          if (!isSidebarOpen) {
            setSidebarOpen(true);
            setExpanded(true);
          } else {
            setExpanded(!expanded);
          }
        }}
        title={!isSidebarOpen ? label : undefined}
        className={`w-full flex items-center py-1.5 text-xs font-medium transition-colors ${isSidebarOpen ? 'justify-between px-3' : 'justify-center px-0 mx-auto'}`}
        style={{
          width: isSidebarOpen ? '100%' : '36px',
          height: isSidebarOpen ? 'auto' : '36px',
          borderRadius: isSidebarOpen ? '6px' : '12px',
          color: isAnyChildActive ? '#fde68a' : '#e2e8f0',
          backgroundColor: isAnyChildActive ? (isSidebarOpen ? 'rgba(0, 19, 51)' : 'rgba(245, 158, 11, 0.15)') : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isAnyChildActive || !isSidebarOpen) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isAnyChildActive || !isSidebarOpen) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = isAnyChildActive ? (isSidebarOpen ? 'rgba(0, 19, 51)' : 'rgba(245, 158, 11, 0.15)') : 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = isAnyChildActive ? '#fde68a' : '#e2e8f0';
          }
        }}
      >
        {isSidebarOpen ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">{label}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center font-bold text-[12px] opacity-80 shrink-0">
            {label.charAt(0)}
          </div>
        )}
        {isSidebarOpen && (
          <span className="flex-shrink-0 ml-1">
            {expanded
              ? <ChevronDown size={14} style={{ opacity: 0.6 }} />
              : <ChevronRight size={14} style={{ opacity: 0.6 }} />
            }
          </span>
        )}
      </button>

      {(expanded && isSidebarOpen) && (
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
                className="block px-3 py-1.5 text-xs font-medium transition-all"
                style={
                  isActive
                    ? { 
                        background: 'linear-gradient(90deg, #d97706 0%, #92400e 100%)', 
                        color: '#ffffff', 
                        border: '1px solid rgba(251, 191, 36, 0.5)',
                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
                        borderRadius: '9999px'
                      }
                    : { color: '#e2e8f0', borderRadius: '6px' }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
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
