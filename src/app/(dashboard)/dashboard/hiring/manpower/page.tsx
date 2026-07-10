'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, FileText, Send, CheckCircle2, XCircle, Search, SlidersHorizontal,
  RotateCcw, Columns3, ArrowUpDown, ChevronDown, Eye, Pencil, MoreHorizontal,
  Download, BarChart3, Plus, Star, CalendarDays, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Open' | 'Pending Approval' | 'Approved' | 'Closed';

interface Requisition {
  id: string;
  jobTitle: string;
  employmentType: string;
  department: string;
  location: string;
  requestedBy: { name: string; role: string; avatar: string };
  positions: number;
  priority: Priority;
  status: Status;
  requestedOn: string;
  starred?: boolean;
}

// ─── Mock data ──────────────────────────────────────────────────────────────
const REQUISITIONS: Requisition[] = [
  { id: 'REQ-2026-058', jobTitle: 'Sales Manager', employmentType: 'Full Time', department: 'Sales & Marketing', location: 'Noida, UP', requestedBy: { name: 'Amit Verma', role: 'Sales Head', avatar: '101' }, positions: 1, priority: 'High', status: 'Approved', requestedOn: '15 Jun 2026', starred: true },
  { id: 'REQ-2026-057', jobTitle: 'HR Executive', employmentType: 'Full Time', department: 'Human Resources', location: 'Noida, UP', requestedBy: { name: 'Pooja Sharma', role: 'HR Manager', avatar: '102' }, positions: 2, priority: 'Medium', status: 'Pending Approval', requestedOn: '14 Jun 2026', starred: true },
  { id: 'REQ-2026-056', jobTitle: 'Software Developer', employmentType: 'Full Time', department: 'IT Department', location: 'Noida, UP (WFH)', requestedBy: { name: 'Rishav Singh', role: 'IT Manager', avatar: '103' }, positions: 3, priority: 'High', status: 'Open', requestedOn: '13 Jun 2026', starred: true },
  { id: 'REQ-2026-055', jobTitle: 'Digital Marketing Executive', employmentType: 'Full Time', department: 'Marketing', location: 'Noida, UP', requestedBy: { name: 'Nistha Arora', role: 'Marketing Head', avatar: '104' }, positions: 2, priority: 'Medium', status: 'Approved', requestedOn: '12 Jun 2026', starred: true },
  { id: 'REQ-2026-054', jobTitle: 'Accounts Executive', employmentType: 'Full Time', department: 'Finance & Accounts', location: 'Ghaziabad, UP', requestedBy: { name: 'Vikas Mittal', role: 'Finance Manager', avatar: '105' }, positions: 1, priority: 'Low', status: 'Open', requestedOn: '10 Jun 2026', starred: true },
];

const TOTAL_REQUISITIONS = 58;

const SUMMARY = [
  { key: 'total', label: 'Total Requisitions', value: TOTAL_REQUISITIONS, sub: 'All time', icon: <Briefcase size={18} />, color: 'text-indigo-700', bg: 'bg-violet-50' },
  { key: 'open', label: 'Open Requisitions', value: 23, sub: '39.66% of total', icon: <FileText size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'pending', label: 'Pending Approval', value: 8, sub: '13.79% of total', icon: <Send size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'approved', label: 'Approved', value: 19, sub: '32.76% of total', icon: <CheckCircle2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { key: 'closed', label: 'Closed', value: 8, sub: '13.79% of total', icon: <XCircle size={18} />, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const DEPARTMENTS = ['All Departments', 'Sales & Marketing', 'Human Resources', 'IT Department', 'Marketing', 'Finance & Accounts', 'Customer Support'];
const JOB_CATEGORIES = ['All Categories', 'Engineering', 'Design', 'Sales', 'Support', 'Finance', 'HR'];
const STATUSES: ('All Status' | Status)[] = ['All Status', 'Open', 'Pending Approval', 'Approved', 'Closed'];
const REQUESTERS = ['All Requesters', 'Amit Verma', 'Pooja Sharma', 'Rishav Singh', 'Nistha Arora', 'Vikas Mittal', 'Sandeep Kumar', 'Neha Gupta'];
const PRIORITIES: ('All Priorities' | Priority)[] = ['All Priorities', 'High', 'Medium', 'Low'];

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-rose-50 text-rose-600 border-rose-100',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100',
  Low: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const STATUS_STYLES: Record<Status, string> = {
  Open: 'bg-blue-50 text-blue-600 border-blue-100',
  'Pending Approval': 'bg-amber-50 text-amber-600 border-amber-100',
  Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Closed: 'bg-rose-50 text-rose-600 border-rose-100',
};

// ─── Small building blocks ─────────────────────────────────────────────────
function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[10.5px] font-medium text-zinc-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-zinc-200 bg-white px-2.5 py-1 pr-6 text-[11.5px] font-medium text-zinc-700 hover:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${PRIORITY_STYLES[priority]}`}>
      {priority}
    </span>
  );
}

// ─── Summary cards ──────────────────────────────────────────────────────────
function SummaryCards() {
  return (
    <section className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {SUMMARY.map((item) => (
        <Card key={item.key} className="rounded-2xl border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardContent className="flex items-center gap-3 p-3.5">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.bg} ${item.color}`}>
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
  search, onSearch, department, setDepartment, category, setCategory,
  status, setStatus, requester, setRequester, priority, setPriority,
  dateRange, setDateRange, activeCount, onClear,
}: {
  search: string; onSearch: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  requester: string; setRequester: (v: string) => void;
  priority: string; setPriority: (v: string) => void;
  dateRange: string; setDateRange: (v: string) => void;
  activeCount: number; onClear: () => void;
}) {
  return (
    <Card className="rounded-2xl border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <CardContent className="p-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by requisition ID, job title, department or requested by..."
              className="w-1/2 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-1.5 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <SlidersHorizontal size={13} className="text-indigo-700" />
            Filters
            {activeCount > 0 && (
              <span className="ml-0.5 grid h-4 w-4 place-items-center rounded-full bg-indigo-700 text-white text-[9px] font-bold">{activeCount}</span>
            )}
          </button>
          <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-500 shadow-sm hover:border-rose-300 hover:text-rose-600 transition-colors shrink-0">
            <RotateCcw size={13} />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
          <FilterSelect label="Department" value={department} options={DEPARTMENTS} onChange={setDepartment} />
          <FilterSelect label="Job Category" value={category} options={JOB_CATEGORIES} onChange={setCategory} />
          <FilterSelect label="Status" value={status} options={STATUSES} onChange={setStatus} />
          <FilterSelect label="Requested By" value={requester} options={REQUESTERS} onChange={setRequester} />
          <FilterSelect label="Priority" value={priority} options={PRIORITIES} onChange={setPriority} />
          <div className="flex flex-col gap-1 min-w-0 lg:col-span-2">
            <label className="text-[10.5px] font-medium text-zinc-500">Date Range</label>
            <div className="relative flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-zinc-700 hover:border-indigo-200 transition-colors cursor-pointer">
              <CalendarDays size={13} className="text-zinc-400 shrink-0" />
              <span className="whitespace-nowrap">{dateRange}</span>
              <ChevronDown size={13} className="ml-auto text-zinc-400 shrink-0" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function RequisitionsTable({ rows, onToggleStar }: { rows: Requisition[]; onToggleStar: (id: string) => void; }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 bg-[#f8fafc] text-center text-[11px] font-normal tracking-wide text-purple-900">
            <th className="w-4 py-1 pl-1"></th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Requisition ID</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Job Title</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Department</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Location</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Requested By</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Positions</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Priority</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Status</th>
            <th className="py-1.5 px-3 text-center whitespace-nowrap">Requested On</th>
            <th className="py-1.5 pr-3 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50/70 transition-colors">
              <td className="py-1.5 pl-1 text-center">
                <button onClick={() => onToggleStar(r.id)} className="text-zinc-300 hover:text-amber-400 transition-colors">
                  <Star size={14} fill={r.starred ? 'currentColor' : 'none'} className={r.starred ? 'text-amber-400' : ''} />
                </button>
              </td>
              <td className="py-1.5 px-3 text-center text-[10px] font-semibold text-violet-700 whitespace-nowrap">{r.id}</td>
              <td className="py-1.5 px-3 text-center whitespace-nowrap">
                <p className="text-[10px] font-semibold text-zinc-900 leading-tight">{r.jobTitle}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">{r.employmentType}</p>
              </td>
              <td className="py-1.5 px-3 text-center text-[10px] text-zinc-600 whitespace-nowrap">{r.department}</td>
              <td className="py-1.5 px-3 text-center text-[10px] text-zinc-600 whitespace-nowrap">{r.location}</td>
              <td className="py-1.5 px-3">
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={`https://i.pravatar.cc/150?u=${r.requestedBy.avatar}`}
                    alt={r.requestedBy.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-100 shrink-0"
                  />
                  <div className="text-left whitespace-nowrap">
                    <p className="text-[10px] font-semibold text-zinc-900 leading-tight">{r.requestedBy.name}</p>
                    <p className="text-[10px] text-zinc-400 leading-tight">{r.requestedBy.role}</p>
                  </div>
                </div>
              </td>
              <td className="py-1.5 px-3 text-center text-[10px] font-semibold text-zinc-800">{r.positions}</td>
              <td className="py-1.5 px-3 text-center"><PriorityBadge priority={r.priority} /></td>
              <td className="py-1.5 px-3 text-center"><StatusBadge status={r.status} /></td>
              <td className="py-1.5 px-3 text-center text-[10px] text-zinc-500 whitespace-nowrap">{r.requestedOn}</td>
              <td className="py-1.5 pr-1">
                <div className="flex items-center justify-center gap-1">
                  <Link href={`/dashboard/hiring/requisitions/${r.id}`} className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                    <Eye size={13} />
                  </Link>
                  <Link href={`/dashboard/hiring/requisitions/${r.id}/edit`} className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:text-indigo-700 transition-colors">
                    <Pencil size={13} />
                  </Link>
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
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalEntries);
  const pages = Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-1 pt-3">
      <div className="flex items-center gap-2 text-[12px] text-zinc-500">
        <span>Show</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="appearance-none rounded-lg border border-zinc-200 bg-white pl-2.5 pr-6 py-1 text-[12px] font-medium text-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
        <span>entries</span>
        <span className="hidden sm:inline text-zinc-300">•</span>
        <span className="hidden sm:inline">Showing {start} to {end} of {totalEntries} entries</span>
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
  );
}

// ─── Page header ────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <section className="flex flex-wrap items-start justify-between gap-3 py-1">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Job Requisitions</h1>
        <p className="text-[13px] text-zinc-500 mt-1">Create, track and manage all job requisitions</p>
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
        <Link href="/dashboard/hiring/requisitions/new" className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
          <Plus size={14} />
          New Requisition
        </Link>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function JobRequisitionsPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState<string>('All Status');
  const [requester, setRequester] = useState('All Requesters');
  const [priority, setPriority] = useState<string>('All Priorities');
  const [dateRange] = useState('01 May 2026 - 15 Jun 2026');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(REQUISITIONS);

  const activeCount = [
    department !== 'All Departments',
    category !== 'All Categories',
    status !== 'All Status',
    requester !== 'All Requesters',
    priority !== 'All Priorities',
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch = search.trim() === '' ||
        [r.id, r.jobTitle, r.department, r.requestedBy.name].some((f) => f.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = department === 'All Departments' || r.department === department;
      const matchesStatus = status === 'All Status' || r.status === status;
      const matchesRequester = requester === 'All Requesters' || r.requestedBy.name === requester;
      const matchesPriority = priority === 'All Priorities' || r.priority === priority;
      return matchesSearch && matchesDept && matchesStatus && matchesRequester && matchesPriority;
    });
  }, [rows, search, department, status, requester, priority]);

  const handleClear = () => {
    setSearch('');
    setDepartment('All Departments');
    setCategory('All Categories');
    setStatus('All Status');
    setRequester('All Requesters');
    setPriority('All Priorities');
  };

  const toggleStar = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)));
  };

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <PageHeader />
      <SummaryCards />
      <FiltersBar
        search={search} onSearch={setSearch}
        department={department} setDepartment={setDepartment}
        category={category} setCategory={setCategory}
        status={status} setStatus={setStatus}
        requester={requester} setRequester={setRequester}
        priority={priority} setPriority={setPriority}
        dateRange={dateRange} setDateRange={() => { }}
        activeCount={activeCount} onClear={handleClear}
      />

      <Card className="rounded-2xl border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <CardContent className="p-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-zinc-200 pb-2">
            <h3 className="text-[11px] font-semibold text-zinc-900">{filtered.length} Requisitions Found</h3>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:border-indigo-200 transition-colors">
                <Columns3 size={13} />
                Columns
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 hover:border-indigo-200 transition-colors">
                <ArrowUpDown size={13} />
                Latest First
              </button>
            </div>
          </div>

          <RequisitionsTable rows={filtered.slice((page - 1) * pageSize, page * pageSize)} onToggleStar={toggleStar} />

          <TableFooter
            pageSize={pageSize} setPageSize={setPageSize}
            page={page} setPage={setPage}
            totalEntries={TOTAL_REQUISITIONS}
          />
        </CardContent>
      </Card>
    </div>
  );
}