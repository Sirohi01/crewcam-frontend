'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users, Clock3, FileText, CheckCircle2, UserCheck, XCircle, Search, ChevronDown,
  Filter, Table2, LayoutGrid, Star, Eye, MoreVertical, ChevronLeft, ChevronRight,
  Download, Phone, MapPin, Mail,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1.

const KPIS = [
  { label: 'Total Selected', value: '52', sub: 'This Month', icon: Users, accent: 'bg-violet-50 text-violet-600' },
  { label: 'Ready for Offer', value: '18', sub: '34.61%', icon: Clock3, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Offer Released', value: '12', sub: '23.08%', icon: FileText, accent: 'bg-amber-50 text-amber-600' },
  { label: 'Offer Accepted', value: '9', sub: '17.31%', icon: CheckCircle2, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Joined', value: '6', sub: '11.54%', icon: UserCheck, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Offer Declined', value: '3', sub: '5.77%', icon: XCircle, accent: 'bg-rose-50 text-rose-600' },
];

const tabs = [
  { label: 'All Selected', count: 52 },
  { label: 'Ready for Offer', count: 18 },
  { label: 'Offer Released', count: 12 },
  { label: 'Offer Accepted', count: 9 },
  { label: 'Joined', count: 6 },
  { label: 'Offer Declined', count: 3 },
  { label: 'On Hold', count: 4 },
];

const candidates = [
  { name: 'Amit Kumar Verma', email: 'amit.verma@email.com', phone: '+91 98765 43210', title: 'Sales Manager', code: 'SE-024', dept: 'Sales & Marketing', stage: 'Final Interview', score: 92, ctc: '₹ 8.50 LPA', status: 'Ready for Offer', selected: true },
  { name: 'Priya Singh', email: 'priya.singh@email.com', phone: '+91 91234 56789', title: 'HR Executive', code: 'HR-015', dept: 'Human Resources', stage: 'Assessment', score: 88, ctc: '₹ 4.20 LPA', status: 'Ready for Offer' },
  { name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '+91 99876 54321', title: 'Web Developer', code: 'IT-031', dept: 'Information Technology', stage: 'Final Interview', score: 90, ctc: '₹ 7.00 LPA', status: 'Offer Released' },
  { name: 'Neha Gupta', email: 'neha.gupta@email.com', phone: '+91 88776 65544', title: 'Graphic Designer', code: 'MK-012', dept: 'Marketing', stage: 'Final Interview', score: 85, ctc: '₹ 5.50 LPA', status: 'Offer Released' },
  { name: 'Deepak Yadav', email: 'deepak.yadav@email.com', phone: '+91 90011 22334', title: 'Accounts Executive', code: 'AC-018', dept: 'Finance', stage: 'Assessment', score: 82, ctc: '₹ 3.60 LPA', status: 'Offer Accepted' },
  { name: 'Anjali Mehta', email: 'anjali.mehta@email.com', phone: '+91 93456 77890', title: 'Sales Executive', code: 'SE-030', dept: 'Sales & Marketing', stage: 'HR Interview', score: 80, ctc: '₹ 3.20 LPA', status: 'Offer Accepted' },
  { name: 'Mohit Jain', email: 'mohit.jain@email.com', phone: '+91 94567 88901', title: 'Business Analyst', code: 'IT-026', dept: 'Information Technology', stage: 'Final Interview', score: 91, ctc: '₹ 9.00 LPA', status: 'Joined' },
  { name: 'Kavya Nair', email: 'kavya.nair@email.com', phone: '+91 87654 32109', title: 'Content Writer', code: 'MK-022', dept: 'Marketing', stage: 'Assessment', score: 78, ctc: '₹ 3.00 LPA', status: 'On Hold' },
  { name: 'Vikash Singh', email: 'vikash.singh@email.com', phone: '+91 99123 45678', title: 'Operations Executive', code: 'OP-017', dept: 'Operations', stage: 'HR Interview', score: 75, ctc: '₹ 3.80 LPA', status: 'On Hold' },
  { name: 'Sneha Patel', email: 'sneha.patel@email.com', phone: '+91 96321 78945', title: 'Customer Support Exec.', code: 'CS-008', dept: 'Customer Success', stage: 'Assessment', score: 76, ctc: '₹ 2.80 LPA', status: 'Offer Declined' },
];

const stageStyle: Record<string, string> = {
  'Final Interview': 'bg-blue-50 text-blue-600',
  Assessment: 'bg-amber-50 text-amber-600',
  'HR Interview': 'bg-indigo-50 text-indigo-600',
};

const statusStyle: Record<string, string> = {
  'Ready for Offer': 'bg-emerald-50 text-emerald-600',
  'Offer Released': 'bg-blue-50 text-blue-600',
  'Offer Accepted': 'bg-emerald-50 text-emerald-600',
  Joined: 'bg-violet-50 text-violet-600',
  'On Hold': 'bg-zinc-100 text-zinc-500',
  'Offer Declined': 'bg-rose-50 text-rose-600',
};

const inputCls = 'h-8 w-full rounded-[2px] border border-zinc-200 bg-white px-2.5 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Stars({ score }: { score: number }) {
  const filled = Math.round(score / 20);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < filled ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />
      ))}
    </div>
  );
}

function Card({
  title, action, children, className = '',
}: { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2px] border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 pb-2.5 pt-0.5">{children}</div>
    </div>
  );
}

function SelectBox({ placeholder, options }: { placeholder: string; options?: string[] }) {
  return (
    <div className="relative">
      <select className={selectCls} defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options?.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}

export default function SelectedCandidatesPage() {
  const [tab, setTab] = useState('All Selected');
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const active = candidates[0];

  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Selected Candidates</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Recruitment</span> <span>›</span> <span>Candidates</span> <span>›</span>
              <span className="font-semibold text-zinc-700">Selected Candidates</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="flex items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Download size={13} /> Export
            </button>
            <button type="button" className="flex items-center gap-1.5 rounded-[2px] border border-indigo-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50">
              Candidate Actions <ChevronDown size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-2">
            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {KPIS.map((s) => (
                <div key={s.label} className="rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[2px] ${s.accent}`}>
                      <s.icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] text-zinc-500 leading-tight">{s.label}</p>
                      <p className="text-base font-bold leading-tight text-zinc-900">{s.value}</p>
                      <p className="truncate text-[9px] font-medium leading-tight text-zinc-400">{s.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto rounded-[2px] border border-zinc-200 bg-white px-3 py-1.5">
              {tabs.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTab(t.label)}
                  className={`whitespace-nowrap border-b-2 py-1 text-[11.5px] font-semibold ${tab === t.label ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white p-1.5">
              <div className="relative min-w-[200px] flex-1">
                <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input className={`${inputCls} pl-7`} placeholder="Search by name, job title, email or mobile..." />
              </div>
              <div className="w-36"><SelectBox placeholder="Select Job Opening" /></div>
              <div className="w-36"><SelectBox placeholder="Select Department" /></div>
              <div className="w-32"><SelectBox placeholder="Select Status" /></div>
              <button type="button" className="flex h-8 items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50">
                <Filter size={12} /> More Filters
              </button>
              <button type="button" className="h-8 rounded-[2px] px-2.5 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50">Clear</button>
            </div>

            {/* Table toolbar */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[10.5px] text-zinc-500">Showing 1 to 10 of 52 candidates</p>
              <div className="flex overflow-hidden rounded-[2px] border border-zinc-200">
                <button
                  type="button"
                  onClick={() => setView('table')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[10.5px] font-semibold ${view === 'table' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-zinc-500'}`}
                >
                  <Table2 size={12} /> Table View
                </button>
                <button
                  type="button"
                  onClick={() => setView('kanban')}
                  className={`flex items-center gap-1.5 border-l border-zinc-200 px-2.5 py-1 text-[10.5px] font-semibold ${view === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-zinc-500'}`}
                >
                  <LayoutGrid size={12} /> Kanban View
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-[2px] border border-zinc-200 bg-white shadow-sm">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-[9.5px] font-semibold uppercase tracking-wide text-zinc-400">
                    <th className="w-8 py-0.5 pl-3"><input type="checkbox" className="h-3.5 w-3.5 rounded-[2px] accent-indigo-600" /></th>
                    <th className="py-0.5 pr-2">Candidate</th>
                    <th className="py-0.5 pr-2">Job Title</th>
                    <th className="py-0.5 pr-2">Department</th>
                    <th className="py-0.5 pr-2">Stage</th>
                    <th className="py-0.5 pr-2">Interview Score</th>
                    <th className="py-0.5 pr-2">Expected CTC</th>
                    <th className="py-0.5 pr-2">Status</th>
                    <th className="py-0.5 pr-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {candidates.map((c) => (
                    <tr key={c.email} className={c.selected ? 'bg-indigo-50/40' : 'hover:bg-zinc-50/60'}>
                      <td className="py-0.5 pl-3"><input type="checkbox" defaultChecked={c.selected} className="h-3.5 w-3.5 rounded-[2px] accent-indigo-600" /></td>
                      <td className="py-0.5 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] bg-zinc-100 text-[10px] font-bold text-zinc-500">
                            {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </span>
                          <div className="min-w-0">
                            <Link href={`/dashboard/hiring/candidates/${c.email.split('@')[0]}`} className="block truncate text-[11px] font-semibold text-indigo-600 hover:underline">{c.name}</Link>
                            <p className="truncate text-[9.5px] text-zinc-400">{c.email}</p>
                            <p className="truncate text-[9.5px] text-zinc-400">{c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-0.5 pr-2">
                        <p className="text-[11px] font-medium text-zinc-700">{c.title}</p>
                        <p className="text-[9.5px] text-zinc-400">{c.code}</p>
                      </td>
                      <td className="py-0.5 pr-2 text-[11px] text-zinc-600">{c.dept}</td>
                      <td className="py-0.5 pr-2">
                        <span className={`inline-block whitespace-nowrap rounded-[2px] px-2 py-0.5 text-[9.5px] font-semibold ${stageStyle[c.stage] || ''}`}>{c.stage}</span>
                      </td>
                      <td className="py-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-zinc-700">{c.score}%</span>
                          <Stars score={c.score} />
                        </div>
                      </td>
                      <td className="py-0.5 pr-2 text-[11px] font-semibold text-zinc-700">{c.ctc}</td>
                      <td className="py-0.5 pr-2">
                        <span className={`inline-block whitespace-nowrap rounded-[2px] px-2 py-0.5 text-[9.5px] font-semibold ${statusStyle[c.status] || ''}`}>{c.status}</span>
                      </td>
                      <td className="py-0.5 pr-3">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" className="grid h-6 w-6 place-items-center rounded-[2px] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><Eye size={13} /></button>
                          <button type="button" className="grid h-6 w-6 place-items-center rounded-[2px] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"><MoreVertical size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500">
                Show
                <div className="relative w-14">
                  <select className={`${selectCls} h-7 px-1.5 text-[10.5px]`} defaultValue="10">
                    <option>10</option><option>25</option><option>50</option>
                  </select>
                  <ChevronDown size={11} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
                entries
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="grid h-7 w-7 place-items-center rounded-[2px] border border-zinc-200 text-zinc-400 hover:bg-zinc-50"><ChevronLeft size={13} /></button>
                {[1, 2, 3, 4, 5, 6].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`grid h-7 w-7 place-items-center rounded-[2px] text-[11px] font-semibold ${p === 1 ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button type="button" className="grid h-7 w-7 place-items-center rounded-[2px] border border-zinc-200 text-zinc-400 hover:bg-zinc-50"><ChevronRight size={13} /></button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <Card
              title="Advanced Filters"
              action={<button type="button" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">Clear All</button>}
            >
              <div className="space-y-0.5">
                <label className="block"><span className={labelCls}>Job Opening</span><div><SelectBox placeholder="Select Job" /></div></label>
                <label className="block"><span className={labelCls}>Department</span><div><SelectBox placeholder="Select Department" /></div></label>
                <label className="block"><span className={labelCls}>Current Stage</span><div><SelectBox placeholder="Select Stage" /></div></label>
                <label className="block"><span className={labelCls}>Status</span><div><SelectBox placeholder="Select Status" /></div></label>
                <label className="block">
                  <span className={labelCls}>Interview Date</span>
                  <input type="date" className={inputCls} placeholder="Select Date Range" />
                </label>
                <label className="block">
                  <span className={labelCls}>Expected CTC Range</span>
                  <div className="flex items-center gap-1.5">
                    <input className={inputCls} placeholder="Min" />
                    <span className="text-[10px] text-zinc-400">to</span>
                    <input className={inputCls} placeholder="Max" />
                  </div>
                </label>
                <button type="button" className="mt-0.5 w-full rounded-[2px] bg-indigo-600 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700">Apply Filters</button>
                <button type="button" className="w-full rounded-[2px] border border-zinc-200 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50">Reset</button>
              </div>
            </Card>

            <Card title="Candidate Details">
              <div className="flex items-center gap-2">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[2px] bg-zinc-100 text-[11px] font-bold text-zinc-500">
                  {active.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-zinc-900">{active.name}</p>
                  <p className="truncate text-[10.5px] text-zinc-500">{active.title}</p>
                  <span className={`mt-0.5 inline-block whitespace-nowrap rounded-[2px] px-2 py-0.5 text-[9px] font-semibold ${statusStyle[active.status]}`}>{active.status}</span>
                </div>
              </div>

              <div className="mt-1.5 space-y-1 border-t border-zinc-100 pt-1.5">
                <p className="flex items-center gap-1.5 text-[10.5px] text-zinc-600"><Mail size={12} className="text-zinc-400" /> {active.email}</p>
                <p className="flex items-center gap-1.5 text-[10.5px] text-zinc-600"><Phone size={12} className="text-zinc-400" /> {active.phone}</p>
                <p className="flex items-center gap-1.5 text-[10.5px] text-zinc-600"><MapPin size={12} className="text-zinc-400" /> Noida, Uttar Pradesh</p>
              </div>

              <div className="mt-1.5 border-t border-zinc-100 pt-1.5">
                <p className={labelCls}>Resume</p>
                <div className="mt-0.5 flex items-center justify-between rounded-[2px] border border-zinc-200 px-2 py-1">
                  <span className="truncate text-[10.5px] text-zinc-600">Amit_Verma_Resume.pdf</span>
                  <Download size={13} className="shrink-0 text-zinc-400" />
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-2 gap-1.5 border-t border-zinc-100 pt-1.5 text-[10.5px]">
                <div><p className="text-zinc-400">Current Company</p><p className="font-semibold text-zinc-800">ABC Pvt. Ltd.</p></div>
                <div><p className="text-zinc-400">Notice Period</p><p className="font-semibold text-zinc-800">30 Days</p></div>
                <div><p className="text-zinc-400">Total Experience</p><p className="font-semibold text-zinc-800">5 Years</p></div>
                <div><p className="text-zinc-400">Expected CTC</p><p className="font-semibold text-zinc-800">{active.ctc}</p></div>
              </div>

              <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-[2px] bg-indigo-600 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700">
                Move to Next Stage <ChevronDown size={13} />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
