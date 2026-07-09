'use client';

import React, { useMemo, useState } from 'react';
import {
  Briefcase, FileText, Loader2, CalendarCheck, XCircle, Rocket,
  Search, SlidersHorizontal, X, ChevronDown, Eye, MessageSquare,
  MoreHorizontal, Download, BarChart3, Plus, Columns3,
  ChevronLeft, ChevronRight, Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
type ApplicationStatus = 'New' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Hired';
type TabKey = 'all' | 'new' | 'underreview' | 'shortlisted' | 'rejected' | 'hired';

interface Application {
  id: string;
  candidateName: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  email: string;
  phone: string;
  jobTitle: string;
  jobId: string;
  department: string;
  experience: string;
  source: string;
  appliedOn: string;
  appliedAgo: string;
  status: ApplicationStatus;
  currentStage: string;
  currentStageBy: string;
  tab: TabKey;
}

// ─── Mock data ──────────────────────────
const APPLICATIONS: Application[] = [
  { id: 'APP-1051', candidateName: 'Rahul Sharma', initials: 'RS', avatarBg: 'bg-blue-100', avatarColor: 'text-blue-600', email: 'rahul.sharma@email.com', phone: '+91 98765 43210', jobTitle: 'Sales Manager', jobId: 'JOB-2026-051', department: 'Sales & Marketing', experience: '7 Years', source: 'Naukri.com', appliedOn: '15 Jun 2026', appliedAgo: '2 days ago', status: 'Under Review', currentStage: 'Resume Screening', currentStageBy: 'Amit Verma', tab: 'underreview' },
  { id: 'APP-1050', candidateName: 'Priya Singh', initials: 'PS', avatarBg: 'bg-rose-100', avatarColor: 'text-rose-600', email: 'priya.singh@email.com', phone: '+91 91234 56789', jobTitle: 'HR Executive', jobId: 'JOB-2026-050', department: 'Human Resources', experience: '6 Years', source: 'LinkedIn', appliedOn: '14 Jun 2026', appliedAgo: '3 days ago', status: 'Shortlisted', currentStage: 'HR Interview', currentStageBy: 'Pooja Sharma', tab: 'shortlisted' },
  { id: 'APP-1049', candidateName: 'Amit Patel', initials: 'AP', avatarBg: 'bg-violet-100', avatarColor: 'text-indigo-700', email: 'amit.patel@email.com', phone: '+91 99887 66554', jobTitle: 'Software Developer', jobId: 'JOB-2026-049', department: 'IT Department', experience: '5 Years', source: 'Company Website', appliedOn: '13 Jun 2026', appliedAgo: '4 days ago', status: 'Under Review', currentStage: 'Technical Assessment', currentStageBy: 'Rishav Singh', tab: 'underreview' },
  { id: 'APP-1048', candidateName: 'Neha Gupta', initials: 'NG', avatarBg: 'bg-amber-100', avatarColor: 'text-amber-600', email: 'neha.gupta@email.com', phone: '+91 90123 45678', jobTitle: 'Digital Marketing Executive', jobId: 'JOB-2026-048', department: 'Marketing', experience: '4 Years', source: 'Indeed', appliedOn: '12 Jun 2026', appliedAgo: '5 days ago', status: 'Shortlisted', currentStage: 'Managerial Interview', currentStageBy: 'Nistha Arora', tab: 'shortlisted' },
];

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'all', label: 'All Applications', count: 156 },
  { key: 'new', label: 'New', count: 24 },
  { key: 'underreview', label: 'Under Review', count: 48 },
  { key: 'shortlisted', label: 'Shortlisted', count: 32 },
  { key: 'rejected', label: 'Rejected', count: 38 },
  { key: 'hired', label: 'Hired', count: 14 },
];

const SUMMARY = [
  { key: 'total', label: 'Total Applications', value: 156, sub: 'All time', icon: <Briefcase size={20} />, color: 'text-indigo-700', bg: 'bg-violet-50' },
  { key: 'new', label: 'New Applications', value: 24, sub: 'This Week', icon: <FileText size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'underReview', label: 'Under Review', value: 48, sub: '30.77% of total', icon: <Loader2 size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'shortlisted', label: 'Shortlisted', value: 32, sub: '20.51% of total', icon: <CalendarCheck size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'rejected', label: 'Rejected', value: 38, sub: '24.36% of total', icon: <XCircle size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
  { key: 'hired', label: 'Hired', value: 14, sub: '8.97% of total', icon: <Rocket size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const JOB_OPENINGS = ['All Openings', 'Sales Manager', 'HR Executive', 'Software Developer', 'Digital Marketing Executive', 'UI/UX Designer', 'Business Analyst', 'Customer Support Executive'];
const DEPARTMENTS = ['All Departments', 'Sales & Marketing', 'Human Resources', 'IT Department', 'Marketing', 'Customer Support'];
const SOURCES = ['All Sources', 'Naukri.com', 'LinkedIn', 'Indeed', 'Company Website', 'Referral'];
const EXPERIENCE_LEVELS = ['All Experience', '0 - 2 Years', '2 - 5 Years', '5 - 8 Years'];
const STATUSES = ['All Status', 'New', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  New: 'bg-blue-50 text-blue-600 border-blue-100',
  'Under Review': 'bg-amber-50 text-amber-600 border-amber-100',
  Shortlisted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
  Hired: 'bg-teal-50 text-teal-600 border-teal-100',
};

// ─── Small building blocks ─────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px] flex-1 basis-[140px]">
      <label className="text-[11px] font-medium text-zinc-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 py-1.5 pr-7 text-[12px] font-medium text-zinc-700 shadow-sm hover:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ─── Summary cards ──────────────────────────────────────────────────────────
function SummaryCards() {
  return (
    <section className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {SUMMARY.map((item) => (
        <Card key={item.key} className="border-zinc-200/80 shadow-sm">
          <CardContent className="flex items-center gap-3 p-3.5">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${item.bg} ${item.color}`}>
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-zinc-500 leading-tight truncate">{item.label}</p>
              <p className="text-[20px] font-bold text-zinc-900 leading-tight">{item.value}</p>
              <p className="text-[10px] text-zinc-400 leading-tight">{item.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

// ─── Filters bar ────────────────────────────────────────────────────────────
function FiltersBar({
  search, onSearch, jobOpening, setJobOpening, department, setDepartment,
  source, setSource, experience, setExperience, status, setStatus,
  dateRange, onClear,
}: {
  search: string; onSearch: (v: string) => void;
  jobOpening: string; setJobOpening: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  source: string; setSource: (v: string) => void;
  experience: string; setExperience: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  dateRange: string; onClear: () => void;
}) {
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by candidate name, email, phone or job title..."
              className="w-full rounded-lg border border-zinc-200 bg-white pl-3.5 pr-9 py-2 text-[12px] text-zinc-700 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <SlidersHorizontal size={13} className="text-indigo-700" />
            Filters
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm"
          >
            <X size={13} className="text-zinc-400" />
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <FilterSelect label="Job Opening" value={jobOpening} options={JOB_OPENINGS} onChange={setJobOpening} />
          <FilterSelect label="Department" value={department} options={DEPARTMENTS} onChange={setDepartment} />
          <FilterSelect label="Application Source" value={source} options={SOURCES} onChange={setSource} />
          <FilterSelect label="Experience" value={experience} options={EXPERIENCE_LEVELS} onChange={setExperience} />
          <FilterSelect label="Application Status" value={status} options={STATUSES} onChange={setStatus} />
          <div className="flex flex-col gap-1 min-w-[180px] flex-1 basis-[180px]">
            <label className="text-[11px] font-medium text-zinc-500">Date Range</label>
            <button className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-700 shadow-sm hover:border-indigo-200 transition-colors">
              <span className="flex items-center gap-1.5 truncate">
                <Calendar size={13} className="text-zinc-400 shrink-0" />
                {dateRange}
              </span>
              <ChevronDown size={13} className="text-zinc-400 shrink-0" />
            </button>
          </div>
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
          {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-700 rounded-full" />}
        </button>
      ))}
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function ApplicationsTable({ rows }: { rows: Application[] }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[19%]" />
          <col className="hidden md:table-column md:w-[15%]" />
          <col className="hidden lg:table-column lg:w-[11%]" />
          <col className="hidden sm:table-column sm:w-[8%]" />
          <col className="hidden md:table-column md:w-[10%]" />
          <col className="hidden sm:table-column sm:w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[13%]" />
          <col className="w-[84px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            <th className="py-2.5 pr-3">Candidate</th>
            <th className="hidden md:table-cell py-2.5 pr-3">Job Opening</th>
            <th className="hidden lg:table-cell py-2.5 pr-3">Department</th>
            <th className="hidden sm:table-cell py-2.5 pr-3">Experience</th>
            <th className="hidden md:table-cell py-2.5 pr-3">Source</th>
            <th className="hidden sm:table-cell py-2.5 pr-3">Applied On</th>
            <th className="py-2.5 pr-3">Status</th>
            <th className="py-2.5 pr-3">Current Stage</th>
            <th className="py-2.5 pr-1 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors">
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${a.avatarBg} ${a.avatarColor}`}>
                    {a.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-zinc-800 leading-tight truncate">{a.candidateName}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.email}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.phone}</p>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell py-2.5 pr-3">
                <p className="text-[12px] font-medium text-zinc-700 leading-tight truncate">{a.jobTitle}</p>
                <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.jobId}</p>
              </td>
              <td className="hidden lg:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 truncate">{a.department}</td>
              <td className="hidden sm:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 whitespace-nowrap">{a.experience}</td>
              <td className="hidden md:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 truncate">{a.source}</td>
              <td className="hidden sm:table-cell py-2.5 pr-3">
                <p className="text-[12px] text-zinc-700 leading-tight whitespace-nowrap">{a.appliedOn}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">{a.appliedAgo}</p>
              </td>
              <td className="py-2.5 pr-3"><StatusBadge status={a.status} /></td>
              <td className="py-2.5 pr-3">
                <p className="text-[12px] font-medium text-zinc-700 leading-tight truncate">{a.currentStage}</p>
                <p className="text-[10px] text-zinc-400 leading-tight truncate">by {a.currentStageBy}</p>
              </td>
              <td className="py-2.5 pr-1">
                <div className="flex items-center justify-end gap-1">
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                    <Eye size={13} />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                    <MessageSquare size={13} />
                  </button>
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
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
  const pages = Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1);
  const start = totalEntries === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalEntries);

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
              className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-6 py-1 text-[12px] font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-7 w-7 rounded-md text-[12px] font-semibold transition-colors ${p === page ? 'bg-indigo-700 text-white' : 'border border-zinc-200 text-zinc-600 hover:border-indigo-200 hover:text-indigo-700'}`}
            >
              {p}
            </button>
          ))}
          {totalPages > 6 && <span className="px-1 text-zinc-400 text-[12px]">…</span>}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
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
        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Job Applications</h1>
        <p className="text-[13px] text-zinc-500 mt-1">View and manage all job applications</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
          <Download size={14} />
          Export
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:border-indigo-200 transition-colors">
          <BarChart3 size={14} />
          Analytics
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
          <Plus size={14} />
          Add Application
        </button>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function JobApplicationsPage() {
  const [search, setSearch] = useState('');
  const [jobOpening, setJobOpening] = useState('All Openings');
  const [department, setDepartment] = useState('All Departments');
  const [source, setSource] = useState('All Sources');
  const [experience, setExperience] = useState('All Experience');
  const [status, setStatus] = useState('All Status');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const dateRange = '01 May 2026 - 15 Jun 2026';
  const tabCount = TABS.find((t) => t.key === activeTab)?.count ?? 0;

  const handleClear = () => {
    setSearch('');
    setJobOpening('All Openings');
    setDepartment('All Departments');
    setSource('All Sources');
    setExperience('All Experience');
    setStatus('All Status');
  };

  const filtered = useMemo(() => {
    return APPLICATIONS.filter((a) => {
      if (activeTab !== 'all' && a.tab !== activeTab) return false;
      const matchesSearch = search.trim() === '' ||
        [a.candidateName, a.email, a.phone, a.jobTitle].some((f) => f.toLowerCase().includes(search.toLowerCase()));
      const matchesJobOpening = jobOpening === 'All Openings' || a.jobTitle === jobOpening;
      const matchesDept = department === 'All Departments' || a.department === department;
      const matchesSource = source === 'All Sources' || a.source === source;
      const matchesExperience = experience === 'All Experience' || a.experience === experience;
      const matchesStatus = status === 'All Status' || a.status === status;
      return matchesSearch && matchesJobOpening && matchesDept && matchesSource && matchesExperience && matchesStatus;
    });
  }, [activeTab, search, jobOpening, department, source, experience, status]);

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <PageHeader />
      <SummaryCards />
      <FiltersBar
        search={search} onSearch={setSearch}
        jobOpening={jobOpening} setJobOpening={setJobOpening}
        department={department} setDepartment={setDepartment}
        source={source} setSource={setSource}
        experience={experience} setExperience={setExperience}
        status={status} setStatus={setStatus}
        dateRange={dateRange}
        onClear={handleClear}
      />

      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="p-0">
          <TabsBar active={activeTab} onChange={(t) => { setActiveTab(t); setPage(1); }} />

          <div className="p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-[13px] font-semibold text-zinc-900">
                {TABS.find((t) => t.key === activeTab)?.label} ({tabCount})
              </h3>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-indigo-200 transition-colors">
                  <Columns3 size={13} />
                  Columns
                </button>
                <div className="relative">
                  <select
                    defaultValue="Applied Date (Newest)"
                    className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-7 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option>Applied Date (Newest)</option>
                    <option>Applied Date (Oldest)</option>
                    <option>Experience (High to Low)</option>
                    <option>Candidate Name (A-Z)</option>
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            <ApplicationsTable rows={filtered.slice((page - 1) * pageSize, page * pageSize)} />

            <TableFooter
              pageSize={pageSize} setPageSize={setPageSize}
              page={page} setPage={setPage}
              totalEntries={filtered.length}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}