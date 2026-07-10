'use client';

import React, { useMemo, useState } from 'react';
import {
  FolderClock, Briefcase, Clock, Tag, RefreshCw, Search, SlidersHorizontal,
  RotateCcw, Bookmark, Columns3, Download, ChevronDown, Eye, MessageSquare,
  MoreHorizontal, Mail, Plus, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
type NoticePeriod = 'Immediate' | '1 Month' | '1 - 2 Months' | '2 Months' | '2 - 3 Months' | '3 Months';
type TabKey = 'all' | 'followup' | 'longterm' | 'ready';

interface HoldCandidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  currentRole: string;
  company: string;
  experience: string;
  skills: string[];
  extraSkills: number;
  noticePeriod: NoticePeriod;
  reasonForHold: string;
  addedOn: string;
  lastContact: string;
  nextFollowUp: string;
  daysLeft: number;
  tab: TabKey;
  checked?: boolean;
}

// ─── Mock data (matches the reference screenshot) ──────────────────────────
const CANDIDATES: HoldCandidate[] = [
  { id: 'HC-001', name: 'Ananya Verma', avatar: '201', email: 'ananya.verma@email.com', phone: '+91 98765 43210', currentRole: 'Marketing Specialist', company: 'Wipro Technologies', experience: '3 Years', skills: ['Digital Marketing', 'SEO', 'Google Ads'], extraSkills: 2, noticePeriod: '2 Months', reasonForHold: 'Better Role Opportunity', addedOn: '14 Jun 2026', lastContact: '15 Jun 2026', nextFollowUp: '15 Jul 2026', daysLeft: 30, tab: 'followup' },
  { id: 'HC-002', name: 'Rohit Singh', avatar: '202', email: 'rohit.singh@email.com', phone: '+91 91234 56789', currentRole: 'Software Engineer', company: 'TCS', experience: '4 Years', skills: ['Java', 'Spring Boot', 'SQL'], extraSkills: 1, noticePeriod: '3 Months', reasonForHold: 'Higher Studies', addedOn: '12 Jun 2026', lastContact: '13 Jun 2026', nextFollowUp: '13 Jul 2026', daysLeft: 28, tab: 'longterm' },
  { id: 'HC-003', name: 'Pooja Mehta', avatar: '203', email: 'pooja.mehta@email.com', phone: '+91 99887 66554', currentRole: 'HR Executive', company: 'HCL Technologies', experience: '2.5 Years', skills: ['HR', 'Recruitment', 'Excel'], extraSkills: 1, noticePeriod: '1 Month', reasonForHold: 'Location Preference', addedOn: '10 Jun 2026', lastContact: '11 Jun 2026', nextFollowUp: '11 Jul 2026', daysLeft: 26, tab: 'ready' },
  { id: 'HC-004', name: 'Karan Malhotra', avatar: '204', email: 'karan.malhotra@email.com', phone: '+91 98712 34567', currentRole: 'UI/UX Designer', company: 'Infosys', experience: '3 Years', skills: ['Figma', 'UI Design', 'Adobe XD'], extraSkills: 1, noticePeriod: '2 Months', reasonForHold: 'Salary Expectation', addedOn: '08 Jun 2026', lastContact: '09 Jun 2026', nextFollowUp: '09 Jul 2026', daysLeft: 24, tab: 'followup' },
  { id: 'HC-005', name: 'Neha Yadav', avatar: '205', email: 'neha.yadav@email.com', phone: '+91 99111 22334', currentRole: 'Business Analyst', company: 'Deloitte', experience: '3.5 Years', skills: ['Business Analysis', 'Excel', 'Power BI'], extraSkills: 1, noticePeriod: '2 - 3 Months', reasonForHold: 'Waiting for Notice Buyout', addedOn: '06 Jun 2026', lastContact: '07 Jun 2026', nextFollowUp: '07 Jul 2026', daysLeft: 22, tab: 'longterm' },
  { id: 'HC-006', name: 'Vikas Sharma', avatar: '206', email: 'vikas.sharma@email.com', phone: '+91 98855 66778', currentRole: 'DevOps Engineer', company: 'Capgemini', experience: '4 Years', skills: ['AWS', 'Docker', 'Kubernetes'], extraSkills: 2, noticePeriod: '1 Month', reasonForHold: 'Relocation Constraint', addedOn: '04 Jun 2026', lastContact: '05 Jun 2026', nextFollowUp: '05 Jul 2026', daysLeft: 20, tab: 'ready' },
  { id: 'HC-007', name: 'Ritika Agarwal', avatar: '207', email: 'ritika.agarwal@email.com', phone: '+91 90012 34567', currentRole: 'Accountant', company: 'Genpact', experience: '2 Years', skills: ['Tally', 'Excel', 'GST'], extraSkills: 0, noticePeriod: 'Immediate', reasonForHold: 'Family Commitment', addedOn: '02 Jun 2026', lastContact: '03 Jun 2026', nextFollowUp: '03 Jul 2026', daysLeft: 18, tab: 'ready' },
  { id: 'HC-008', name: 'Saurabh Kumar', avatar: '208', email: 'saurabh.k@email.com', phone: '+91 91234 87654', currentRole: 'Data Analyst', company: 'Accenture', experience: '2.8 Years', skills: ['SQL', 'Python', 'Tableau'], extraSkills: 1, noticePeriod: '1 - 2 Months', reasonForHold: 'Exploring Opportunities', addedOn: '31 May 2026', lastContact: '01 Jun 2026', nextFollowUp: '01 Jul 2026', daysLeft: 16, tab: 'followup' },
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

// ─── Filters bar ────────────────────────────────────────────────────────────
function FiltersBar({
  search, onSearch, department, setDepartment, skill, setSkill,
  experience, setExperience, noticePeriod, setNoticePeriod, reason, setReason,
  sortBy, setSortBy, activeCount, onClear,
}: {
  search: string; onSearch: (v: string) => void;
  department: string; setDepartment: (v: string) => void;
  skill: string; setSkill: (v: string) => void;
  experience: string; setExperience: (v: string) => void;
  noticePeriod: string; setNoticePeriod: (v: string) => void;
  reason: string; setReason: (v: string) => void;
  sortBy: string; setSortBy: (v: string) => void;
  activeCount: number; onClear: () => void;
}) {
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
          className={`relative px-3 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors ${active === tab.key ? 'text-violet-700' : 'text-zinc-500 hover:text-zinc-700'
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
    <main className="mx-auto max-w-[1600px] w-full space-y-3 overflow-x-hidden pb-6 px-2 sm:px-3">
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

          <div className="p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="text-[13px] font-semibold text-zinc-900">
                {TABS.find((t) => t.key === activeTab)?.label} ({tabCount})
              </h3>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-violet-300 transition-colors">
                  <Columns3 size={13} />
                  Columns
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-sm hover:border-violet-300 transition-colors">
                  <Download size={13} />
                  Download List
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>

            <HoldCandidatesTable
              rows={filtered.slice((page - 1) * pageSize, page * pageSize)}
              checkedIds={checkedIds}
              onToggleCheck={toggleCheck}
              onToggleAll={toggleAll}
            />

            <TableFooter
              pageSize={pageSize} setPageSize={setPageSize}
              page={page} setPage={setPage}
              totalEntries={TOTAL_HOLD_CANDIDATES}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}