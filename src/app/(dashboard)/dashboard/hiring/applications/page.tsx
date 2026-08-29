'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, FileText, Loader2, CalendarCheck, XCircle, Rocket,
  Search, SlidersHorizontal, X, ChevronDown, Eye, MessageSquare,
  MoreHorizontal, Download, BarChart3, Plus, Columns3,
  ChevronLeft, ChevronRight, Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: 'bg-blue-100', color: 'text-blue-600' },
  { bg: 'bg-rose-100', color: 'text-rose-600' },
  { bg: 'bg-violet-100', color: 'text-indigo-700' },
  { bg: 'bg-amber-100', color: 'text-amber-600' },
  { bg: 'bg-emerald-100', color: 'text-emerald-700' },
  { bg: 'bg-teal-100', color: 'text-teal-700' },
];

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function mapStatus(raw: string): ApplicationStatus {
  const s = (raw || '').toLowerCase();
  if (s === 'new' || s === 'applied') return 'New';
  if (s === 'screening' || s === 'under review' || s === 'underreview') return 'Under Review';
  if (s === 'shortlisted' || s === 'interviewing') return 'Shortlisted';
  if (s === 'rejected') return 'Rejected';
  if (s === 'hired' || s === 'selected' || s === 'offer') return 'Hired';
  return 'New';
}

function mapTab(status: ApplicationStatus): TabKey {
  switch (status) {
    case 'New': return 'new';
    case 'Under Review': return 'underreview';
    case 'Shortlisted': return 'shortlisted';
    case 'Rejected': return 'rejected';
    case 'Hired': return 'hired';
  }
}

function mapCandidate(c: any, idx: number): Application {
  const palette = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
  const name = `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown';
  const status = mapStatus(c.status);
  const appliedDate = c.createdAt || c.appliedAt || Date.now();
  return {
    id: c._id || c.id || String(idx),
    candidateName: name,
    initials: initials(name),
    avatarBg: palette.bg,
    avatarColor: palette.color,
    email: c.email || 'N/A',
    phone: c.phone || 'N/A',
    jobTitle: c.jobRole || c.jobTitle || 'N/A',
    jobId: c.jobId || c.jobRequisitionId || 'N/A',
    department: c.department?.name || c.department || 'N/A',
    experience: c.applicationDetails?.totalExperience ? `${c.applicationDetails.totalExperience} Years` : (c.experience || 'N/A'),
    source: c.source || 'N/A',
    appliedOn: new Date(appliedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    appliedAgo: timeAgo(appliedDate),
    status,
    currentStage: c.currentStage || c.stage || status,
    currentStageBy: c.currentStageBy || c.assignedTo?.firstName || 'N/A',
    tab: mapTab(status),
  };
}

// ─── Static options ───────────────────────────────────────────────────────────
const STATUSES = ['All Status', 'New', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
const EXPERIENCE_LEVELS = ['All Experience', '0 - 2 Years', '2 - 5 Years', '5 - 8 Years', '8+ Years'];

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
function SummaryCards({ counts, total }: { counts: Record<string, number>; total: number }) {
  const summary = [
    { key: 'total', label: 'Total Applications', value: total, sub: 'All time', icon: <Briefcase size={20} />, color: 'text-indigo-700', bg: 'bg-indigo-50' },
    { key: 'new', label: 'New Applications', value: counts.new, sub: 'This Week', icon: <FileText size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'underreview', label: 'Under Review', value: counts.underreview, sub: total ? `${((counts.underreview / total) * 100).toFixed(2)}% of total` : '0%', icon: <Loader2 size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'shortlisted', label: 'Shortlisted', value: counts.shortlisted, sub: total ? `${((counts.shortlisted / total) * 100).toFixed(2)}% of total` : '0%', icon: <CalendarCheck size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'rejected', label: 'Rejected', value: counts.rejected, sub: total ? `${((counts.rejected / total) * 100).toFixed(2)}% of total` : '0%', icon: <XCircle size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { key: 'hired', label: 'Hired', value: counts.hired, sub: total ? `${((counts.hired / total) * 100).toFixed(2)}% of total` : '0%', icon: <Rocket size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <section className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {summary.map((item) => (
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
  dateRange, onClear, jobOpeningsList, departmentsList, sourcesList,
}: {
  search: string; onSearch: (v: string) => void;
  jobOpening: string; setJobOpening: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  source: string; setSource: (v: string) => void;
  experience: string; setExperience: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  dateRange: string; onClear: () => void;
  jobOpeningsList: string[]; departmentsList: string[]; sourcesList: string[];
}) {
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by candidate name, email, phone or job title..."
              className="w-full rounded-lg border border-zinc-200 bg-white pl-3.5 pr-9 py-2 text-[12px] text-zinc-700 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors" />
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <SlidersHorizontal size={13} />
            Filters
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <X size={13} className="text-zinc-400" />
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <FilterSelect label="Job Opening" value={jobOpening} options={['All Openings', ...jobOpeningsList]} onChange={setJobOpening} />
          <FilterSelect label="Department" value={department} options={['All Departments', ...departmentsList]} onChange={setDepartment} />
          <FilterSelect label="Application Source" value={source} options={['All Sources', ...sourcesList]} onChange={setSource} />
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
function TabsBar({ active, onChange, counts, total }: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  counts: Record<string, number>;
  total: number;
}) {
  const tabs = [
    { key: 'all' as TabKey, label: 'All Applications', count: total },
    { key: 'new' as TabKey, label: 'New', count: counts.new },
    { key: 'underreview' as TabKey, label: 'Under Review', count: counts.underreview },
    { key: 'shortlisted' as TabKey, label: 'Shortlisted', count: counts.shortlisted },
    { key: 'rejected' as TabKey, label: 'Rejected', count: counts.rejected },
    { key: 'hired' as TabKey, label: 'Hired', count: counts.hired },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-100 px-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-3 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors ${active === tab.key ? 'text-violet-700' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {tab.label} <span className={active === tab.key ? 'text-violet-400' : 'text-zinc-400'}>({tab.count})</span>
          {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-700 rounded-full" />}
        </button>
      ))}
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function ApplicationsTable({ rows, visibleCols }: { rows: Application[], visibleCols: Record<string, boolean> }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[19%]" />
          {visibleCols.jobTitle && <col className="hidden md:table-column md:w-[15%]" />}
          {visibleCols.department && <col className="hidden lg:table-column lg:w-[11%]" />}
          {visibleCols.experience && <col className="hidden sm:table-column sm:w-[8%]" />}
          {visibleCols.source && <col className="hidden md:table-column md:w-[10%]" />}
          {visibleCols.appliedOn && <col className="hidden sm:table-column sm:w-[10%]" />}
          {visibleCols.status && <col className="w-[10%]" />}
          {visibleCols.currentStage && <col className="w-[13%]" />}
          <col className="w-[84px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-100 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            <th className="py-2.5 pr-3">Candidate</th>
            {visibleCols.jobTitle && <th className="hidden md:table-cell py-2.5 pr-3">Job Opening</th>}
            {visibleCols.department && <th className="hidden lg:table-cell py-2.5 pr-3">Department</th>}
            {visibleCols.experience && <th className="hidden sm:table-cell py-2.5 pr-3">Experience</th>}
            {visibleCols.source && <th className="hidden md:table-cell py-2.5 pr-3">Source</th>}
            {visibleCols.appliedOn && <th className="hidden sm:table-cell py-2.5 pr-3">Applied On</th>}
            {visibleCols.status && <th className="py-2.5 pr-3">Status</th>}
            {visibleCols.currentStage && <th className="py-2.5 pr-3">Current Stage</th>}
            <th className="py-2.5 pr-1 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="py-10 text-center text-[12px] text-zinc-400">No applications found.</td>
            </tr>
          )}
          {rows.map((a) => (
            <tr key={a.id} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors">
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold ${a.avatarBg} ${a.avatarColor}`}>
                    {a.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-zinc-800 leading-tight truncate">{a.candidateName}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.email}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.phone}</p>
                  </div>
                </div>
              </td>
              {visibleCols.jobTitle && (
                <td className="hidden md:table-cell py-2.5 pr-3">
                  <p className="text-[12px] font-medium text-zinc-700 leading-tight truncate">{a.jobTitle}</p>
                  <p className="text-[10px] text-zinc-400 leading-tight truncate">{a.jobId}</p>
                </td>
              )}
              {visibleCols.department && <td className="hidden lg:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 truncate">{a.department}</td>}
              {visibleCols.experience && <td className="hidden sm:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 whitespace-nowrap">{a.experience}</td>}
              {visibleCols.source && <td className="hidden md:table-cell py-2.5 pr-3 text-[12px] text-zinc-600 truncate">{a.source}</td>}
              {visibleCols.appliedOn && (
                <td className="hidden sm:table-cell py-2.5 pr-3">
                  <p className="text-[12px] text-zinc-700 leading-tight whitespace-nowrap">{a.appliedOn}</p>
                  <p className="text-[10px] text-zinc-400 leading-tight">{a.appliedAgo}</p>
                </td>
              )}
              {visibleCols.status && <td className="py-2.5 pr-3"><StatusBadge status={a.status} /></td>}
              {visibleCols.currentStage && (
                <td className="py-2.5 pr-3">
                  <p className="text-[12px] font-medium text-zinc-700 leading-tight truncate">{a.currentStage}</p>
                  <p className="text-[10px] text-zinc-400 leading-tight truncate">by {a.currentStageBy}</p>
                </td>
              )}
              <td className="py-2.5 pr-1">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/dashboard/hiring/candidates/${a.id}`} className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                    <Eye size={13} />
                  </Link>
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
      <span className="text-[12px] text-zinc-500">Showing {start} to {end} of {totalEntries} entries</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[12px] text-zinc-500">
          <span>Show</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-6 py-1 text-[12px] font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-40 transition-colors">
            <ChevronLeft size={13} />
          </button>
          {pages.map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`h-7 w-7 rounded-md text-[12px] font-semibold transition-colors ${p === page ? 'bg-indigo-700 text-white' : 'border border-zinc-200 text-zinc-600 hover:border-indigo-200 hover:text-indigo-700'}`}>
              {p}
            </button>
          ))}
          {totalPages > 6 && <span className="px-1 text-zinc-400 text-[12px]">…</span>}
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 disabled:opacity-40 transition-colors">
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
          <Download size={14} /> Export
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:border-indigo-200 transition-colors">
          <BarChart3 size={14} /> Analytics
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
          <Plus size={14} /> Add Application
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
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    jobTitle: true,
    department: true,
    experience: true,
    source: true,
    appliedOn: true,
    status: true,
    currentStage: true,
  });

  const dateRange = '01 May 2026 - 15 Jun 2026';

  // ── Fetch all candidates from API ──
  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates');
      return res.data;
    },
  });

  // ── Map raw API data to Application objects ──
  const allApplications: Application[] = useMemo(() => {
    const raw = Array.isArray(candidatesResponse)
      ? candidatesResponse
      : (candidatesResponse?.data || []);
    return raw.map((c: any, idx: number) => mapCandidate(c, idx));
  }, [candidatesResponse]);

  // ── Dynamic filter option lists from real data ──
  const jobOpeningsList = useMemo(() =>
    [...new Set(allApplications.map((a) => a.jobTitle).filter((v) => v && v !== 'N/A'))],
    [allApplications]);

  const departmentsList = useMemo(() =>
    [...new Set(allApplications.map((a) => a.department).filter((v) => v && v !== 'N/A'))],
    [allApplications]);

  const sourcesList = useMemo(() =>
    [...new Set(allApplications.map((a) => a.source).filter((v) => v && v !== 'N/A'))],
    [allApplications]);

  // ── Per-tab counts from full dataset (not filtered) ──
  const counts = useMemo(() => ({
    new: allApplications.filter((a) => a.tab === 'new').length,
    underreview: allApplications.filter((a) => a.tab === 'underreview').length,
    shortlisted: allApplications.filter((a) => a.tab === 'shortlisted').length,
    rejected: allApplications.filter((a) => a.tab === 'rejected').length,
    hired: allApplications.filter((a) => a.tab === 'hired').length,
  }), [allApplications]);

  const handleClear = () => {
    setSearch('');
    setJobOpening('All Openings');
    setDepartment('All Departments');
    setSource('All Sources');
    setExperience('All Experience');
    setStatus('All Status');
  };

  // ── Apply tab + search + filter on top of real data ──
  const filtered = useMemo(() => {
    return allApplications.filter((a) => {
      if (activeTab !== 'all' && a.tab !== activeTab) return false;
      const matchesSearch = search.trim() === '' ||
        [a.candidateName, a.email, a.phone, a.jobTitle].some((f) =>
          f.toLowerCase().includes(search.toLowerCase())
        );
      const matchesJobOpening = jobOpening === 'All Openings' || a.jobTitle === jobOpening;
      const matchesDept = department === 'All Departments' || a.department === department;
      const matchesSource = source === 'All Sources' || a.source === source;
      const matchesStatus = status === 'All Status' || a.status === status;
      return matchesSearch && matchesJobOpening && matchesDept && matchesSource && matchesStatus;
    });
  }, [allApplications, activeTab, search, jobOpening, department, source, status]);

  // ── Active tab label for section heading ──
  const activeTabLabel = useMemo(() => {
    const labels: Record<TabKey, string> = {
      all: 'All Applications',
      new: 'New',
      underreview: 'Under Review',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired',
    };
    return labels[activeTab];
  }, [activeTab]);

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <PageHeader />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-indigo-600" size={24} />
        </div>
      ) : (
        <>
          <SummaryCards counts={counts} total={allApplications.length} />

          <FiltersBar
            search={search} onSearch={setSearch}
            jobOpening={jobOpening} setJobOpening={setJobOpening}
            department={department} setDepartment={setDepartment}
            source={source} setSource={setSource}
            experience={experience} setExperience={setExperience}
            status={status} setStatus={setStatus}
            dateRange={dateRange}
            onClear={handleClear}
            jobOpeningsList={jobOpeningsList}
            departmentsList={departmentsList}
            sourcesList={sourcesList}
          />

          <Card className="border-zinc-200/80 shadow-sm">
            <CardContent className="p-0">
              <TabsBar
                active={activeTab}
                onChange={(t) => { setActiveTab(t); setPage(1); }}
                counts={counts}
                total={allApplications.length}
              />
              <div className="p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-[13px] font-semibold text-zinc-900">
                    {activeTabLabel} ({filtered.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-indigo-200 transition-colors">
                        <Columns3 size={13} /> Columns
                      </button>
                      {showColumnsMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 p-2">
                          <div className="text-[10px] font-bold text-zinc-500 mb-2 px-1">Toggle Columns</div>
                          {Object.entries(visibleColumns).map(([key, isVisible]) => (
                            <label key={key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isVisible as boolean}
                                onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key as keyof typeof visibleColumns] }))}
                                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                              <span className="text-[11px] text-zinc-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <select
                        defaultValue="Applied Date (Newest)"
                        className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-7 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer">
                        <option>Applied Date (Newest)</option>
                        <option>Applied Date (Oldest)</option>
                        <option>Experience (High to Low)</option>
                        <option>Candidate Name (A-Z)</option>
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>
                </div>

                <ApplicationsTable rows={filtered.slice((page - 1) * pageSize, page * pageSize)} visibleCols={visibleColumns} />

                <TableFooter
                  pageSize={pageSize} setPageSize={setPageSize}
                  page={page} setPage={setPage}
                  totalEntries={filtered.length}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
