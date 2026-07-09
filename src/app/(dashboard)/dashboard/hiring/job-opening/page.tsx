'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, Send, UsersRound, Eye as EyeIcon, Clock, Search, SlidersHorizontal,
  ChevronDown, Pencil, MoreHorizontal, Download, Globe2, Plus,
  ChevronLeft, ChevronRight, Columns3,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Internship';
type OpeningStatus = 'Active' | 'Draft' | 'On Hold' | 'Closed' | 'Filled' | 'Cancelled';
type TabKey = 'active' | 'draft' | 'onhold' | 'closed' | 'filled' | 'cancelled';

interface Opening {
  id: string;
  jobTitle: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  department: string;
  location: string;
  positions: number;
  openPositions: number;
  experience: string;
  jobType: JobType;
  status: OpeningStatus;
  applications: number;
  isNew?: boolean;
  postedOn: string;
  postedAgo: string;
  tab: TabKey;
}

// ─── Mock data (Active Openings tab, matches the reference screenshot) ─────
const OPENINGS: Opening[] = [
  { id: 'JOB-2026-051', jobTitle: 'Sales Manager', initials: 'SM', avatarBg: 'bg-violet-100', avatarColor: 'text-violet-600', department: 'Sales & Marketing', location: 'Noida, UP', positions: 3, openPositions: 2, experience: '5 - 8 Years', jobType: 'Full Time', status: 'Active', applications: 24, isNew: true, postedOn: '15 Jun 2026', postedAgo: '2 days ago', tab: 'active' },
  { id: 'JOB-2026-050', jobTitle: 'HR Executive', initials: 'HR', avatarBg: 'bg-amber-100', avatarColor: 'text-amber-600', department: 'Human Resources', location: 'Noida, UP', positions: 2, openPositions: 1, experience: '2 - 5 Years', jobType: 'Full Time', status: 'Active', applications: 18, isNew: true, postedOn: '14 Jun 2026', postedAgo: '3 days ago', tab: 'active' },
  { id: 'JOB-2026-048', jobTitle: 'Digital Marketing Executive', initials: 'DM', avatarBg: 'bg-indigo-100', avatarColor: 'text-indigo-600', department: 'Marketing', location: 'Noida, UP', positions: 2, openPositions: 2, experience: '1 - 3 Years', jobType: 'Full Time', status: 'Active', applications: 15, isNew: true, postedOn: '12 Jun 2026', postedAgo: '5 days ago', tab: 'active' },
  { id: 'JOB-2026-047', jobTitle: 'Accounts Executive', initials: 'AE', avatarBg: 'bg-emerald-100', avatarColor: 'text-emerald-600', department: 'Finance & Accounts', location: 'Ghaziabad, UP', positions: 2, openPositions: 1, experience: '2 - 4 Years', jobType: 'Full Time', status: 'Active', applications: 11, postedOn: '10 Jun 2026', postedAgo: '7 days ago', tab: 'active' },
];

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: 'active', label: 'Active Openings', count: 17 },
  { key: 'draft', label: 'Draft', count: 3 },
  { key: 'onhold', label: 'On Hold', count: 2 },
  { key: 'closed', label: 'Closed', count: 23 },
  { key: 'filled', label: 'Filled', count: 45 },
  { key: 'cancelled', label: 'Cancelled', count: 6 },
];

const SUMMARY = [
  { key: 'total', label: 'Total Openings', value: 23, sub: 'All Departments', icon: <Briefcase size={20} />, color: 'text-violet-600', bg: 'bg-violet-50' },
  { key: 'activeOpenings', label: 'Active Openings', value: 17, sub: '73.91% of total', icon: <Send size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'positions', label: 'Total Positions', value: 42, sub: 'All Departments', icon: <UsersRound size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'applications', label: 'Applications', value: 156, sub: 'Total received', icon: <EyeIcon size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'timeToFill', label: 'Avg. Time to Fill', value: '28 Days', sub: 'For active openings', icon: <Clock size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const DEPARTMENTS = ['All Departments', 'Sales & Marketing', 'Human Resources', 'IT Department', 'Marketing', 'Finance & Accounts', 'Customer Support'];
const LOCATIONS = ['All Locations', 'Noida, UP', 'Noida, UP (WFH)', 'Ghaziabad, UP'];
const JOB_TYPES = ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = ['All Experience', '0 - 2 Years', '2 - 5 Years', '3 - 6 Years', '5 - 8 Years'];
const OPENING_KINDS = ['All Openings', 'New Openings', 'Replacement', 'Backfill'];
const STATUSES = ['All Status', 'Active', 'Draft', 'On Hold', 'Closed', 'Filled', 'Cancelled'];

const STATUS_STYLES: Record<OpeningStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Draft: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  'On Hold': 'bg-amber-50 text-amber-600 border-amber-100',
  Closed: 'bg-rose-50 text-rose-600 border-rose-100',
  Filled: 'bg-blue-50 text-blue-600 border-blue-100',
  Cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

// ─── Small building blocks ─────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px] flex-1 basis-[140px]">
      <label className="text-[10px] font-medium text-zinc-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-sm border border-zinc-200 bg-white px-2 py-1 pr-7 text-[11px] font-medium text-zinc-700 shadow-none hover:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OpeningStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

// ─── Summary cards ──────────────────────────────────────────────────────────
function SummaryCards() {
  return (
    <section className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {SUMMARY.map((item) => (
        <Card key={item.key} className="border-zinc-200/80 shadow-none rounded-md">
          <CardContent className="flex items-center gap-3 p-3">
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
  search, onSearch, department, setDepartment, location, setLocation,
  jobType, setJobType, experience, setExperience, openingKind, setOpeningKind,
  status, setStatus,
}: {
  search: string; onSearch: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  jobType: string; setJobType: (v: string) => void;
  experience: string; setExperience: (v: string) => void;
  openingKind: string; setOpeningKind: (v: string) => void;
  status: string; setStatus: (v: string) => void;
}) {
  return (
    <Card className="border-zinc-200/80 shadow-none rounded-sm">
      <CardContent className="p-2 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-1/2">
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by job title, department or location..."
              className="w-full rounded-sm border border-zinc-200 bg-white pl-3 pr-8 py-1.5 text-[11px] text-zinc-700 placeholder:text-zinc-400 shadow-none focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
            />
            <Search size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-none hover:border-violet-300 transition-colors shrink-0">
            <SlidersHorizontal size={13} className="text-violet-600" />
            More Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <FilterSelect label="Department" value={department} options={DEPARTMENTS} onChange={setDepartment} />
          <FilterSelect label="Location" value={location} options={LOCATIONS} onChange={setLocation} />
          <FilterSelect label="Job Type" value={jobType} options={JOB_TYPES} onChange={setJobType} />
          <FilterSelect label="Experience" value={experience} options={EXPERIENCE_LEVELS} onChange={setExperience} />
          <FilterSelect label="Openings" value={openingKind} options={OPENING_KINDS} onChange={setOpeningKind} />
          <FilterSelect label="Status" value={status} options={STATUSES} onChange={setStatus} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────
function TabsBar({ active, onChange, actions }: { active: TabKey; onChange: (t: TabKey) => void; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 px-1">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
      {actions && (
        <div className="flex items-center gap-2 pr-2 py-1 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function OpeningsTable({ rows }: { rows: Opening[] }) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[19%]" />
          <col className="hidden md:table-column md:w-[13%]" />
          <col className="hidden lg:table-column lg:w-[12%]" />
          <col className="w-[9%]" />
          <col className="hidden sm:table-column sm:w-[11%]" />
          <col className="hidden md:table-column md:w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[10%]" />
          <col className="hidden sm:table-column sm:w-[10%]" />
          <col className="w-[84px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200 bg-[#f8fafc] text-left text-[11px] font-normal tracking-wide text-purple-900">
            <th className="py-1.5 px-3">Job Title</th>
            <th className="hidden md:table-cell py-1.5 px-3">Department</th>
            <th className="hidden lg:table-cell py-1.5 px-3">Location</th>
            <th className="py-1.5 px-3">Positions</th>
            <th className="hidden sm:table-cell py-1.5 px-3">Experience</th>
            <th className="hidden md:table-cell py-1.5 px-3">Job Type</th>
            <th className="py-1.5 px-3">Status</th>
            <th className="py-1.5 px-3">Applications</th>
            <th className="hidden sm:table-cell py-1.5 px-3">Posted On</th>
            <th className="py-1.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50/70 transition-colors">
              <td className="py-1.5 px-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${o.avatarBg} ${o.avatarColor}`}>
                    {o.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-zinc-800 leading-tight truncate">{o.jobTitle}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight truncate">{o.id}</p>
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell py-1.5 px-3 text-[11px] text-zinc-600 truncate">{o.department}</td>
              <td className="hidden lg:table-cell py-1.5 px-3 text-[11px] text-zinc-600 truncate">{o.location}</td>
              <td className="py-1.5 px-3">
                <p className="text-[11px] font-bold text-zinc-900 leading-tight">{o.positions}</p>
                <p className="text-[9px] text-emerald-600 font-medium leading-tight">{o.openPositions} Open</p>
              </td>
              <td className="hidden sm:table-cell py-1.5 px-3 text-[11px] text-zinc-600 whitespace-nowrap">{o.experience}</td>
              <td className="hidden md:table-cell py-1.5 px-3 text-[11px] text-zinc-600 truncate">{o.jobType}</td>
              <td className="py-1.5 px-3"><StatusBadge status={o.status} /></td>
              <td className="py-1.5 px-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-800">{o.applications}</span>
                  {o.isNew && (
                    <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 text-[9px] font-bold">
                      New
                    </span>
                  )}
                </div>
              </td>
              <td className="hidden sm:table-cell py-1.5 px-3">
                <p className="text-[11px] text-zinc-700 leading-tight whitespace-nowrap">{o.postedOn}</p>
                <p className="text-[9px] text-zinc-400 leading-tight">{o.postedAgo}</p>
              </td>
              <td className="py-1.5 px-3">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/dashboard/hiring/openings/${o.id}`} className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <EyeIcon size={11} />
                  </Link>
                  <Link href={`/dashboard/hiring/openings/${o.id}/edit`} className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <Pencil size={11} />
                  </Link>
                  <button className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <MoreHorizontal size={11} />
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-1 pt-3">
      <div className="flex items-center gap-2 text-[12px] text-zinc-500">
        <span>Show</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="appearance-none rounded-sm border border-zinc-200 bg-white pl-2.5 pr-6 py-1 text-[12px] font-medium text-zinc-700 shadow-none focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
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
          className="grid h-7 w-7 place-items-center rounded-sm border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
        >
          <ChevronLeft size={13} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`h-7 w-7 rounded-sm text-[12px] font-semibold transition-colors ${p === page ? 'bg-violet-600 text-white' : 'border border-zinc-200 text-zinc-600 hover:border-violet-300 hover:text-violet-600'}`}
          >
            {p}
          </button>
        ))}
        {totalPages > 6 && <span className="px-1 text-zinc-400 text-[12px]">…</span>}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-7 w-7 place-items-center rounded-sm border border-zinc-200 text-zinc-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:hover:border-zinc-200 disabled:hover:text-zinc-500 transition-colors"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Page header ────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="flex flex-wrap items-start justify-between gap-3 py-1">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Job Openings</h1>
        <p className="text-[13px] text-zinc-500 mt-1">View and manage all active job openings</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-2 py-1.5 text-[12px] font-semibold text-violet-600 hover:border-violet-300 transition-colors shadow-none">
          <Globe2 size={14} />
          Career Page
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-2 py-1.5 text-[12px] font-semibold text-violet-600 hover:border-violet-300 transition-colors shadow-none">
          <Download size={14} />
          Export
        </button>
        <Link href="/dashboard/hiring/openings/new" className="inline-flex items-center gap-1.5 rounded-sm bg-violet-600 px-2 py-1.5 text-[12px] font-semibold text-white shadow-none hover:bg-violet-700 transition-colors">
          <Plus size={14} />
          Create New Opening
        </Link>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function JobOpeningsPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [location, setLocation] = useState('All Locations');
  const [jobType, setJobType] = useState('All Types');
  const [experience, setExperience] = useState('All Experience');
  const [openingKind, setOpeningKind] = useState('All Openings');
  const [status, setStatus] = useState('All Status');
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const tabCount = TABS.find((t) => t.key === activeTab)?.count ?? 0;

  const filtered = useMemo(() => {
    return OPENINGS.filter((o) => {
      if (o.tab !== activeTab) return false;
      const matchesSearch = search.trim() === '' ||
        [o.jobTitle, o.department, o.location].some((f) => f.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = department === 'All Departments' || o.department === department;
      const matchesLocation = location === 'All Locations' || o.location === location;
      const matchesJobType = jobType === 'All Types' || o.jobType === jobType;
      const matchesExperience = experience === 'All Experience' || o.experience === experience;
      const matchesStatus = status === 'All Status' || o.status === status;
      return matchesSearch && matchesDept && matchesLocation && matchesJobType && matchesExperience && matchesStatus;
    });
  }, [activeTab, search, department, location, jobType, experience, status]);

  return (
    <main className="mx-auto max-w-[1600px] w-full space-y-3 overflow-x-hidden pb-6 px-2 sm:px-3">
      <PageHeader />
      <SummaryCards />
      <FiltersBar
        search={search} onSearch={setSearch}
        department={department} setDepartment={setDepartment}
        location={location} setLocation={setLocation}
        jobType={jobType} setJobType={setJobType}
        experience={experience} setExperience={setExperience}
        openingKind={openingKind} setOpeningKind={setOpeningKind}
        status={status} setStatus={setStatus}
      />

      <Card className="border-zinc-200/80 shadow-none rounded-sm">
        <CardContent className="p-0">
          <TabsBar
            active={activeTab}
            onChange={(t) => { setActiveTab(t); setPage(1); }}
            actions={
              <>
                <button className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-none hover:border-violet-300 transition-colors">
                  <Columns3 size={11} />
                  Columns
                </button>
                <div className="relative">
                  <select
                    defaultValue="Posted Date (Newest)"
                    className="appearance-none rounded-sm border border-zinc-200 bg-white pl-2.5 pr-7 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-none hover:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors cursor-pointer"
                  >
                    <option>Posted Date (Newest)</option>
                    <option>Posted Date (Oldest)</option>
                    <option>Applications (High to Low)</option>
                    <option>Job Title (A-Z)</option>
                  </select>
                  <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </>
            }
          />

          <div className="p-3 pt-4">
            <OpeningsTable rows={filtered.slice((page - 1) * pageSize, page * pageSize)} />

            <TableFooter
              pageSize={pageSize} setPageSize={setPageSize}
              page={page} setPage={setPage}
              totalEntries={filtered.length}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
