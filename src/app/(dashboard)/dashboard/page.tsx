'use client';

import React, { useMemo, useState } from 'react';
import {
  FolderClock, Briefcase, Clock, Tag, RefreshCw, Search, SlidersHorizontal,
  RotateCcw, Bookmark, Columns3, Download, ChevronDown, Eye, MessageSquare,
  MoreHorizontal, Mail, Plus, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/ui/pageLayout';

// ─── Types ──────────────────────────────────────────────────────────────────
type NoticePeriod = 'Immediate' | '1 Month' | '1 - 2 Months' | '2 Months' | '2 - 3 Months' | '3 Months';
type TabKey = 'all' | 'followup' | 'longterm' | 'ready';

interface DashboardConfig { scope: string; effectivePermissions: string[]; widgets: string[]; }

// Widget keys that a pure self-scope ("Employee") role gets by default — used to decide
// which dashboard variant to render, now that persona is derived from the actual widget
// set (driven by Role scope + per-role overrides) instead of a fixed category value.
const SELF_ONLY_WIDGETS = new Set(['my-attendance-today', 'my-leave-balance', 'my-todo']);

const performanceData = [
  { name: 'High Performers', value: 174, pct: '(13.92%)', color: '#22c55e' },
  { name: 'Meets Expectations', value: 802, pct: '(64.26%)', color: '#3b82f6' },
  { name: 'Needs Improvement', value: 164, pct: '(13.14%)', color: '#f59e0b' },
  { name: 'Poor Performers', value: 108, pct: '(8.67%)', color: '#ef4444' },
];

const leaveBalanceData = [
  { type: 'Casual Leave', balance: 10.5, color: '#38bdf8' },
  { type: 'Sick Leave', balance: 10, color: '#f59e0b' },
  { type: 'Privilege Leave', balance: 18, color: '#8b5cf6' },
  { type: 'Comp Off', balance: 5, color: '#22c55e' },
];

const ALERT_EMPLOYEES: Record<string, { name: string; dept: string }[]> = {
  birthday: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
    { name: 'Kavya Reddy', dept: 'Product' },
    { name: 'Rohit Das', dept: 'Engineering' },
    { name: 'Divya Iyer', dept: 'HR' },
    { name: 'Suresh Kumar', dept: 'Finance' },
  ],
  anniversary: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
  ],
  salary: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
    { name: 'Kavya Reddy', dept: 'Product' },
    { name: 'Rohit Das', dept: 'Engineering' },
  ],
  probation: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
  ],
  special: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
  ],
};

const topAlertsData = [
  { key: 'birthday', icon: <Cake size={14} />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Birthday', subtitle: 'Celebrating birthday', count: 12, detail: 'Celebrating today', extra: 9, date: 'Jun 26, 2025', dateLabel: 'Today' },
  { key: 'anniversary', icon: <Star size={14} />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Anniversary', subtitle: 'Work anniversaries', count: 8, detail: 'Work anniversary', extra: 5, date: 'Jun 27 – Jul 3', dateLabel: 'This week' },
  { key: 'salary', icon: <Wallet2 size={14} />, color: '#22c55e', bg: '#f0fdf4', title: 'Salary Increment', subtitle: 'Upcoming increment', count: 10, detail: 'Awaiting review', extra: 7, date: 'Jun 30, 2025', dateLabel: 'in 4 days' },
  { key: 'probation', icon: <Shield size={14} />, color: '#f59e0b', bg: '#fffbeb', title: 'Probation Ending', subtitle: 'Probation ending', count: 6, detail: 'Need evaluation', extra: 3, date: 'Jul 5, 2025', dateLabel: 'in 9 days' },
  { key: 'special', icon: <PartyPopper size={14} />, color: '#ef4444', bg: '#fef2f2', title: 'Special Occasion', subtitle: 'Other occasions', count: 5, detail: 'Special occasion', extra: 2, date: 'Jun 28, 2025', dateLabel: 'in 2 days' },
];

const todaySchedule = [
  { time: '08:30 AM', title: 'Daily HR Standup', location: 'HR Cabin' },
  { time: '09:30 AM', title: 'HR Policy Review Meeting', location: 'Conference Room A' },
  { time: '10:15 AM', title: 'Employee Onboarding Session', location: 'Training Hall' },
  { time: '11:00 AM', title: 'Interview – Senior Developer', location: 'Panel Room 2' },
  { time: '12:30 PM', title: 'Lunch with New Joiners', location: 'Cafeteria' },
  { time: '02:00 PM', title: 'Performance Calibration', location: 'Conference Room B' },
  { time: '03:00 PM', title: 'Payroll Review Meeting', location: 'Finance Room' },
  { time: '04:00 PM', title: 'Townhall Meeting', location: 'Auditorium' },
  { time: '05:00 PM', title: 'Leave Approval Review', location: 'HR Department' },
  { time: '06:00 PM', title: 'Recruitment Planning', location: 'Meeting Room C' },
];

const todayTasks = [
  { id: 1, title: 'Review onboarding docs for 3 new joiners', priority: 'high', done: false },
  { id: 2, title: 'Approve pending leave requests (12)', priority: 'high', done: false },
  { id: 3, title: 'Send offer letter to Rohit Mehra', priority: 'medium', done: true },
  { id: 4, title: 'Update Q2 performance ratings', priority: 'medium', done: false },
  { id: 5, title: 'Schedule exit interview – Priya Shah', priority: 'low', done: false },
  { id: 6, title: 'Publish June payroll summary', priority: 'low', done: true },
];

const TOTAL_HOLD_CANDIDATES = 48;

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'all', label: 'All Hold Candidates', count: 48 },
  { key: 'followup', label: 'Follow Up Due', count: 12 },
  { key: 'longterm', label: 'Long Term Hold', count: 18 },
  { key: 'ready', label: 'Ready to Move', count: 8 },
];

const SUMMARY = [
  { key: 'total', label: 'Total Hold Candidates', value: '48', sub: 'In database', icon: <FolderClock size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { key: 'addedThisWeek', label: 'Added This Week', value: '8', sub: '16.7% of hold candidates', icon: <Briefcase size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'mostAvailable', label: 'Most available in', value: '2 – 6 Months', sub: 'Current Notice Period', icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'keySkills', label: 'With Key Skills', value: '22', sub: 'High demand skills', icon: <Tag size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'reengagement', label: 'Re-engagement Due', value: '12', sub: 'Follow up pending', icon: <RefreshCw size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const DEPARTMENTS = ['All Departments', 'Marketing', 'IT Department', 'Human Resources', 'Design', 'Finance & Accounts', 'Sales'];
const SKILLS = ['All Skills', 'Digital Marketing', 'Java', 'HR', 'Figma', 'Excel', 'AWS', 'Python'];
const EXPERIENCE_LEVELS = ['All Experience', '0 - 2 Years', '2 - 4 Years', '4 - 6 Years'];
const NOTICE_PERIODS = ['All Notice Periods', 'Immediate', '1 Month', '1 - 2 Months', '2 Months', '2 - 3 Months', '3 Months'];
const REASONS = ['All Reasons', 'Better Role Opportunity', 'Higher Studies', 'Location Preference', 'Salary Expectation', 'Waiting for Notice Buyout', 'Relocation Constraint', 'Family Commitment', 'Exploring Opportunities'];
const SORT_OPTIONS = ['Recently Added', 'Oldest Added', 'Follow Up Date', 'Experience (High to Low)', 'Name (A-Z)'];

const NOTICE_STYLES: Record<NoticePeriod, string> = {
  Immediate: 'bg-violet-50 text-violet-600 border-violet-100',
  '1 Month': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  '1 - 2 Months': 'bg-blue-50 text-blue-600 border-blue-100',
  '2 Months': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  '2 - 3 Months': 'bg-violet-50 text-violet-600 border-violet-100',
  '3 Months': 'bg-amber-50 text-amber-600 border-amber-100',
};

// ─── Small building blocks ─────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px] flex-1 basis-[130px]">
      <label className="text-[11px] font-medium text-zinc-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-1.5 pr-7 text-[12px] font-medium text-zinc-700 shadow-sm hover:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

function NoticeBadge({ noticePeriod }: { noticePeriod: NoticePeriod }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${NOTICE_STYLES[noticePeriod]}`}>
      {noticePeriod}
    </span>
  );
}

// ─── Summary cards ──────────────────────────────────────────────────────────
function SummaryCards() {
  return (
    <section className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {SUMMARY.map((item) => (
        <Card key={item.key} className="border-zinc-200/80 shadow-sm">
          <CardContent className="flex items-center gap-3 p-3.5">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.bg} ${item.color}`}>
              {React.cloneElement(item.icon, { size: 16 })}
            </span>
            <div className="min-w-0">
              <p className="text-[18px] font-bold text-zinc-900 leading-tight">{item.value}</p>
              <p className="text-[11.5px] font-medium text-zinc-600 leading-tight">{item.label}</p>
              <p className="text-[10px] text-zinc-400 leading-tight">{item.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

   ───────────────────────────────────────────────────────────────────────── */

// ─── Welcome Header (replaces the banner) ─────────────────────────────────
function WelcomeHeader({ scope }: { scope?: string }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const customizeRef = useRef<HTMLDivElement>(null);

  // live clock, updates every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) {
        setShowCustomize(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let dashboardOptions = [
    { label: 'Admin Dashboard', href: '/dashboard/admin-dashboard' },
    { label: 'HR Dashboard', href: '/dashboard/hr-dashboard' },
    { label: 'Employee Dashboard', href: '/dashboard/employee' },
  ];

  if (scope === 'self' || scope === 'team') {
    dashboardOptions = [];
  } else if (scope === 'department') {
    dashboardOptions = [
      { label: 'HOD Dashboard', href: '/dashboard/hod-dashboard' },
      { label: 'Employee Dashboard', href: '/dashboard/employee' },
    ];
  }

  const displayDate = selectedDate || now;
  const dateStr = displayDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSelectDashboard = (href: string) => {
    setShowCustomize(false);
    router.push(href);
  };

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name, email, phone, skills or job title..."
              className="w-full rounded-lg border border-zinc-200 bg-white pl-3.5 pr-9 py-2 text-[12px] text-zinc-700 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:border-violet-300 transition-colors shrink-0">
            <SlidersHorizontal size={13} className="text-violet-600" />
            Filters
            <span className="ml-0.5 grid h-4 w-4 place-items-center rounded-full bg-violet-600 text-white text-[9px] font-bold">{activeCount}</span>
          </button>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:border-violet-300 transition-colors shrink-0"
          >
            <RotateCcw size={13} className="text-zinc-400" />
            Clear All
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <FilterSelect label="Department" value={department} options={DEPARTMENTS} onChange={setDepartment} />
          <FilterSelect label="Skills" value={skill} options={SKILLS} onChange={setSkill} />
          <FilterSelect label="Experience" value={experience} options={EXPERIENCE_LEVELS} onChange={setExperience} />
          <FilterSelect label="Notice Period" value={noticePeriod} options={NOTICE_PERIODS} onChange={setNoticePeriod} />
          <FilterSelect label="Reason for Hold" value={reason} options={REASONS} onChange={setReason} />
          <FilterSelect label="Sort By" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────
function TabsBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void; }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-100 px-1">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-3 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors ${
            active === tab.key ? 'text-violet-700' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          {tab.label} <span className={active === tab.key ? 'text-violet-400' : 'text-zinc-400'}>({tab.count})</span>
          {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-600 rounded-full" />}
        </button>
      ))}
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function HoldCandidatesTable({
  rows, checkedIds, onToggleCheck, onToggleAll,
}: {
  rows: HoldCandidate[]; checkedIds: Set<string>; onToggleCheck: (id: string) => void; onToggleAll: (checked: boolean) => void;
}) {
  const allChecked = rows.length > 0 && rows.every((r) => checkedIds.has(r.id));

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[28px]" />
          <col className="w-[17%]" />
          <col className="hidden md:table-column md:w-[13%]" />
          <col className="hidden sm:table-column sm:w-[8%]" />
          <col className="hidden lg:table-column lg:w-[16%]" />
          <col className="w-[10%]" />
          <col className="hidden md:table-column md:w-[13%]" />
          <col className="hidden sm:table-column sm:w-[8%]" />
          <col className="hidden lg:table-column lg:w-[8%]" />
          <col className="w-[11%]" />
          <col className="w-[84px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            <th className="py-2.5 pl-1">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => onToggleAll(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </th>
            <th className="py-2.5 pr-3">Candidate</th>
            <th className="hidden md:table-cell py-2.5 pr-3">Current Role</th>
            <th className="hidden sm:table-cell py-2.5 pr-3">Experience</th>
            <th className="hidden lg:table-cell py-2.5 pr-3">Key Skills</th>
            <th className="py-2.5 pr-3">Notice Period</th>
            <th className="hidden md:table-cell py-2.5 pr-3">Reason for Hold</th>
            <th className="hidden sm:table-cell py-2.5 pr-3">Added On</th>
            <th className="hidden lg:table-cell py-2.5 pr-3">Last Contact</th>
            <th className="py-2.5 pr-3">Next Follow Up</th>
            <th className="py-2.5 pr-1 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors">
              <td className="py-2.5 pl-1">
                <input
                  type="checkbox"
                  checked={checkedIds.has(c.id)}
                  onChange={() => onToggleCheck(c.id)}
                  className="h-3.5 w-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </td>
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={`https://i.pravatar.cc/150?u=${c.avatar}`}
                    alt={c.name}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-100 shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-zinc-800 leading-tight truncate">{c.name}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{c.email}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{c.phone}</p>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell py-2.5 pr-3">
                <p className="text-[12px] font-medium text-zinc-700 leading-tight truncate">{c.currentRole}</p>
                <p className="text-[10px] text-zinc-400 leading-tight truncate">{c.company}</p>
              </td>
              <td className="hidden sm:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 whitespace-nowrap">{c.experience}</td>
              <td className="hidden lg:table-cell py-2.5 pr-3">
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span key={s} className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-600 px-1.5 py-0.5 text-[9.5px] font-medium whitespace-nowrap">
                      {s}
                    </span>
                  ))}
                  {c.extraSkills > 0 && (
                    <span className="inline-flex items-center rounded-full bg-violet-50 text-violet-600 px-1.5 py-0.5 text-[9.5px] font-semibold">
                      +{c.extraSkills}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-2.5 pr-3"><NoticeBadge noticePeriod={c.noticePeriod} /></td>
              <td className="hidden md:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 truncate">{c.reasonForHold}</td>
              <td className="hidden sm:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 whitespace-nowrap">{c.addedOn}</td>
              <td className="hidden lg:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 whitespace-nowrap">{c.lastContact}</td>
              <td className="py-2.5 pr-3">
                <p className="text-[12px] text-zinc-700 leading-tight whitespace-nowrap">{c.nextFollowUp}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">({c.daysLeft} days left)</p>
              </td>
              <td className="py-2.5 pr-1">
                <div className="flex items-center justify-end gap-1">
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <Eye size={13} />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <MessageSquare size={13} />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination footer ──────────────────────────────────────────────────────
function TableFooter({ pageSize, setPageSize, page, setPage, totalEntries }: {
  pageSize: number; setPageSize: (n: number) => void; page: number; setPage: (n: number) => void; totalEntries: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const start = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalEntries);
  const pages = Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-1 pt-3">
      <div className="flex items-center gap-2 text-[12px] text-zinc-500">
        <span>Showing {start} to {end} of {totalEntries} entries</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[12px] text-zinc-500">
          <span>Show</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-6 py-1 text-[12px] font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
            >
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-7 w-7 rounded-md text-[12px] font-semibold transition-colors ${p === page ? 'bg-violet-600 text-white' : 'border border-zinc-200 text-zinc-600 hover:border-violet-300 hover:text-violet-600'}`}
            >
              {p}
            </button>
          ))}
          {totalPages > 6 && <span className="px-1 text-zinc-400 text-[12px]">…</span>}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page header ────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="flex flex-wrap items-start justify-between gap-3 py-1">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900 leading-tight">
          Hold Candidates
          <Bookmark size={16} className="text-violet-500" />
        </h1>
        <p className="text-[13px] text-zinc-500 mt-1">Talented candidates on hold for future opportunities</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:border-violet-300 transition-colors">
          <Download size={14} />
          Export
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:border-violet-300 transition-colors">
          <Mail size={14} />
          Email
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors">
          <Plus size={14} />
          Add Candidate
        </button>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function HoldCandidatesPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [skill, setSkill] = useState('All Skills');
  const [experience, setExperience] = useState('All Experience');
  const [noticePeriod, setNoticePeriod] = useState('All Notice Periods');
  const [reason, setReason] = useState('All Reasons');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const activeCount = [
    department !== 'All Departments',
    skill !== 'All Skills',
    experience !== 'All Experience',
    noticePeriod !== 'All Notice Periods',
    reason !== 'All Reasons',
  ].filter(Boolean).length;

  const tabCount = TABS.find((t) => t.key === activeTab)?.count ?? 0;

  const handleClear = () => {
    setSearch('');
    setDepartment('All Departments');
    setSkill('All Skills');
    setExperience('All Experience');
    setNoticePeriod('All Notice Periods');
    setReason('All Reasons');
  };

  const filtered = useMemo(() => {
    return CANDIDATES.filter((c) => {
      if (activeTab !== 'all' && c.tab !== activeTab) return false;
      const matchesSearch = search.trim() === '' ||
        [c.name, c.email, c.phone, c.currentRole, ...c.skills].some((f) => f.toLowerCase().includes(search.toLowerCase()));
      const matchesSkill = skill === 'All Skills' || c.skills.includes(skill);
      const matchesNotice = noticePeriod === 'All Notice Periods' || c.noticePeriod === noticePeriod;
      const matchesReason = reason === 'All Reasons' || c.reasonForHold === reason;
      return matchesSearch && matchesSkill && matchesNotice && matchesReason;
    });
  }, [activeTab, search, skill, noticePeriod, reason]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setCheckedIds(checked ? new Set(filtered.slice((page - 1) * pageSize, page * pageSize).map((c) => c.id)) : new Set());
  };

  return (
    <PageLayout>
    <main className="mx-auto max-w-[1600px] w-full space-y-3 overflow-x-hidden pb-6 px-2 sm:px-3 min-h-[calc(100vh-48px)]">
      <PageHeader />
      <SummaryCards />
      <FiltersBar
        search={search} onSearch={setSearch}
        department={department} setDepartment={setDepartment}
        skill={skill} setSkill={setSkill}
        experience={experience} setExperience={setExperience}
        noticePeriod={noticePeriod} setNoticePeriod={setNoticePeriod}
        reason={reason} setReason={setReason}
        sortBy={sortBy} setSortBy={setSortBy}
        activeCount={activeCount} onClear={handleClear}
      />

      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 pt-1">
            <TabsBar active={activeTab} onChange={(t) => { setActiveTab(t); setPage(1); }} />
          </div>

        {/* My Task / Team Task toggle buttons */}
        <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-zinc-100 p-1 shrink-0">
          <button
            onClick={() => setView('my')}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${view === 'my' ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            My Task
          </button>
          <button
            onClick={() => setView('team')}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${view === 'team' ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Team Task
          </button>
        </div>

        {view === 'my' ? (
          // ── My Task view: personal checklist ──
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200 space-y-1.5">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 hover:bg-zinc-50 transition-colors">
                <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-0.5">
                  {task.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-zinc-300" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-medium leading-tight ${task.done ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{task.title}</p>
                </div>
                <span className={`shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border capitalize ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // ── Team Task view: meeting/event timeline ──
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="shrink-0 w-[58px] pt-1">
                  <span className="text-[10px] font-medium text-zinc-400 tabular-nums leading-tight">{item.time}</span>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-400 group-hover:bg-violet-600 transition-colors mt-1 shrink-0 ring-2 ring-violet-100" />
                  {i < todaySchedule.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-300 mt-0.5" style={{ minHeight: '28px' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <p className="text-[12px] font-semibold text-zinc-800 leading-tight group-hover:text-violet-700 transition-colors">{item.title}</p>
                  {item.location && (
                    <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={9} className="shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-zinc-100 shrink-0">
          <Link href="/dashboard/meetings"
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            View Full Calendar <ArrowRight size={11} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: config, isLoading } = useQuery<DashboardConfig>({
    queryKey: ['dashboard', 'config'],
    queryFn: async () => (await api.get('/dashboard/config')).data,
  });

  const { data: attendance } = useQuery({
    queryKey: ['dashboard', 'widget', 'team-attendance-today'],
    queryFn: async () => (await api.get('/dashboard/widget-data/team-attendance-today')).data,
  });

  const topKpiKeys = ['org-headcount', 'team-attendance-today', 'absent-today', 'work-from-home', 'late-coming', 'on-leave-today', 'new-joinees'];

  if (config && config.widgets.length > 0 && config.widgets.every((w) => SELF_ONLY_WIDGETS.has(w))) {
    return <EmployeeDashboard />;
  }

  if (config && config.widgets.includes('hiring-pipeline-summary') && !config.effectivePermissions.includes('*')) {
    return <RecruiterDashboard />;
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-2 pb-4 px-2 sm:px-3">

      {/* Banner — commented out, replaced by WelcomeHeader (see comment block above) */}
      {/* <HeroSlider /> */}
      <WelcomeHeader scope={config?.scope} />

      {/* KPI Strip */}
      <section className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-zinc-100" />)
          : topKpiKeys.map((key) => <KpiCard key={key} widgetKey={key} />)
        }
      </section>

      {/* Important Alerts */}
      <ImportantAlertsCards />

      {/* Main Content */}
      <div className="grid gap-2 grid-cols-1 xl:grid-cols-12 items-start xl:items-stretch">

        {/* LEFT SIDE: Rows 1 & 2 */}
        <div className="xl:col-span-8 flex flex-col gap-2">
          {/* Row 1: Activity Log | Birthdays */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <MyPerformanceCard />
            <BirthdaysOverview />
          </div>

          {/* Row 2: Attendance Overview | Leave Overview */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <AttendanceOverview attendance={attendance} />
            <LeaveOverview />
          </div>
        </div>

        {/* RIGHT SIDE: Today's Schedule */}
        <div className="xl:col-span-4 relative min-h-[320px] xl:min-h-0">
          <div className="xl:absolute xl:inset-0 h-full w-full">
            <TodaySchedule />
          </div>
        </div>

        {/* FULL WIDTH: Row 2b — Leave Approvals | Top Late Comers | AI Insights */}
        <div className="xl:col-span-12 flex flex-col gap-2">
          <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
            <LeaveApprovalsCard />
            <TopLateComers />
            <AiInsightsCard />
          </div>
        </div>

        {/* FULL WIDTH: Row 3 — Performance | Team Performance (replaces Quick Actions) | Recent New Joiners */}
        <div className="xl:col-span-12 flex flex-col gap-2">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <ActivityLog />
            <TeamPerformanceCard />
            <RecentNewJoiners />
          </div>
        </div>

        {/* FULL WIDTH: Row 4 — Reports Shortcut */}
        {/* <div className="xl:col-span-12 flex flex-col gap-2">
          <ReportsShortcut />
        </div> */}

        {/* FULL WIDTH: Row 5 — Payroll | Compliance | Recruitment */}
        <div className="xl:col-span-12">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <PayrollOverview />
            <ComplianceOverview />
            <RecruitmentOverview />
          </div>
        </div>

        {/* FULL WIDTH: Bottom strip — Quick Actions */}
        <div className="xl:col-span-12">
          <QuickActions />
        </div>

      </div>
    </main>
    </PageLayout>
  );
}