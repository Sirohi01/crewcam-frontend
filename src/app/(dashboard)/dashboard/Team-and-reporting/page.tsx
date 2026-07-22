'use client';
import React, { useState } from 'react';
import {
  ChevronRight, ArrowLeft, Eye, Pencil, Users, GitBranch, Building2,
  Wallet, UserCheck, Search, Filter, Plus, MoreVertical, ArrowRight,
  ShieldCheck, Bell,
} from 'lucide-react';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Structure', 'Sub Department Details', 'Team & Reporting'];

const INFO_CARDS = [
  { label: 'Sub Department', value: '3D Visualization Team', sub: 'DS-3D', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Parent Department', value: 'Design Studio (DS)', sub: '', icon: GitBranch, bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Business Unit', value: 'Design & Creative', sub: 'BU-DC', icon: Building2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Cost Center', value: 'CC-DS-3D02', sub: '', icon: Wallet, bg: 'bg-amber-50', color: 'text-amber-600' },
  { label: 'Team Size', value: '12', sub: 'Active Employees', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
];

const TABS = ['Team Members', 'Reporting Structure', 'Access & Permissions', 'Workflows', 'Documents', 'History'];

const TEAM_MEMBERS = [
  { id: 1, name: 'Neha Sethi', empId: 'EMP1024', designation: 'Manager', reportingTo: 'Aman Malhotra', reportingSub: 'Design Director', role: 'Team Head', status: 'Active', initials: 'NS', avatarBg: 'bg-rose-400' },
  { id: 2, name: 'Vivek Rana', empId: 'EMP1037', designation: 'Sr. 3D Visualizer', reportingTo: 'Neha Sethi', reportingSub: '', role: 'Senior Member', status: 'Active', initials: 'VR', avatarBg: 'bg-indigo-500' },
  { id: 3, name: 'Pooja Bansal', empId: 'EMP1042', designation: '3D Visualizer', reportingTo: 'Neha Sethi', reportingSub: '', role: 'Member', status: 'Active', initials: 'PB', avatarBg: 'bg-fuchsia-400' },
  { id: 4, name: 'Rohit Arora', empId: 'EMP1045', designation: '3D Visualizer', reportingTo: 'Neha Sethi', reportingSub: '', role: 'Member', status: 'Active', initials: 'RA', avatarBg: 'bg-sky-500' },
  { id: 5, name: 'Amit Kumar', empId: 'EMP1050', designation: '3D Artist', reportingTo: 'Neha Sethi', reportingSub: '', role: 'Member', status: 'Active', initials: 'AK', avatarBg: 'bg-teal-500' },
  { id: 6, name: 'Sunita Verma', empId: 'EMP1053', designation: '3D Artist', reportingTo: 'Neha Sethi', reportingSub: '', role: 'Member', status: 'Active', initials: 'SV', avatarBg: 'bg-orange-400' },
  { id: 7, name: 'Karan Singh', empId: 'EMP1058', designation: 'Lighting Artist', reportingTo: 'Vivek Rana', reportingSub: '', role: 'Member', status: 'Active', initials: 'KS', avatarBg: 'bg-violet-500' },
];

const INSIGHTS = [
  { label: 'Avg. Team Experience', value: '3.6 Yrs', color: '#6366f1', points: '0,18 8,14 16,16 24,10 32,12 40,6 48,4' },
  { label: 'Tenure (Avg.)', value: '2.1 Yrs', color: '#3b82f6', points: '0,8 8,12 16,6 24,14 32,10 40,16 48,12' },
  { label: 'Pending Tasks', value: '8', color: '#f59e0b', points: '0,16 8,14 16,10 24,12 32,6 40,8 48,4' },
  { label: 'Overdue Tasks', value: '2', color: '#f43f5e', points: '0,6 8,10 16,8 24,14 32,10 40,16 48,12' },
];

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === BREADCRUMB.length - 1 ? (
              <span className="text-indigo-600 font-normal">{crumb}</span>
            ) : (
              <span className="text-zinc-500 hover:underline cursor-pointer">{crumb}</span>
            )}
            {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Team & Reporting</h1>
          <p className="text-[13px] text-zinc-500">Manage team members, reporting relationships and access for this sub department.</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-normal text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <ArrowLeft size={13} /> Back to Sub Department
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-normal text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <Eye size={13} /> Overview
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-normal text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            <Pencil size={13} /> Edit Team & Reporting
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Info strip ──────────────────────────────────────────────────────────────
function InfoStrip() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-zinc-100">
        {INFO_CARDS.map((c) => (
          <div key={c.label} className="flex items-center gap-3 py-3 lg:py-0 lg:px-4 first:pl-0 first:pt-0 last:pr-0">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${c.bg} ${c.color}`}>
              <c.icon size={16} />
            </span>
            <div>
              <p className="text-[11px] text-zinc-400">{c.label}</p>
              <p className="text-[12px] font-normal text-zinc-900 leading-tight">{c.value}</p>
              {c.sub && <p className="text-[10.5px] text-zinc-400">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
function Tabs({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex items-center gap-6 border-b border-zinc-200 overflow-x-auto">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`shrink-0 pb-3 pt-1 text-[13px] font-normal whitespace-nowrap border-b-2 transition-colors ${
            active === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-normal text-emerald-600">
      {status}
    </span>
  );
}

function Avatar({ initials, bg, size = 8 }: { initials: string; bg: string; size?: number }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full ${bg} font-normal text-white`}
      style={{ height: `${size * 4}px`, width: `${size * 4}px`, fontSize: size >= 8 ? '10px' : '9px' }}
    >
      {initials}
    </span>
  );
}

// ─── Team Members table card ────────────────────────────────────────────────
function TeamMembersCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-[15px] font-normal text-zinc-900">Team Members (12)</h3>
          <p className="text-[12px] text-zinc-400 mt-0.5">List of employees working in this sub department.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search employee..."
              className="w-52 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-zinc-400"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-normal text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
            <Filter size={13} /> Filters
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[12px] font-normal text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <Plus size={13} /> Add Employee
          </button>
        </div>
      </div>

      <div className="mt-3">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
            <col className="w-[13%]" />
            <col className="w-[9%]" />
            <col className="w-[5%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="py-2 pr-2"><input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-300 text-indigo-600" /></th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Employee</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Employee ID</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Designation</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Reporting To</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Role in Team</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Status</th>
              <th className="text-left text-[11px] font-normal text-zinc-500 uppercase tracking-wide py-2 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {TEAM_MEMBERS.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-2 pr-2"><input type="checkbox" className="h-3 w-3 rounded border-zinc-300 text-indigo-600" /></td>
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-2">
                    <Avatar initials={m.initials} bg={m.avatarBg} />
                    <span className="text-[12.5px] font-normal text-zinc-900">{m.name}</span>
                  </div>
                </td>
                <td className="py-2 pr-2 text-[11px] text-zinc-500">{m.empId}</td>
                <td className="py-2 pr-2 text-[11px] text-zinc-600">{m.designation}</td>
                <td className="py-2 pr-2">
                  <p className="text-[11px] font-normal text-zinc-800">{m.reportingTo}</p>
                  {m.reportingSub && <p className="text-[10.5px] text-zinc-400">{m.reportingSub}</p>}
                </td>
                <td className="py-2 pr-2 text-[11px] text-zinc-600">{m.role}</td>
                <td className="py-2 pr-2"><StatusPill status={m.status} /></td>
                <td className="py-2 pr-2">
                  <button className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap mt-3 pt-3 border-t border-zinc-100">
        <p className="text-[12px] text-zinc-500">Showing 1 to 7 of 12 employees</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-[12px] font-normal text-white">1</button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-colors text-[12px] font-normal">2</button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-zinc-500">Rows per page:</span>
            <select className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] font-normal text-zinc-600 shadow-sm outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right rail: Reporting Summary ──────────────────────────────────────────
function ReportingSummaryCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-normal text-zinc-900 mb-2.5">Reporting Summary</h3>

      <div className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/60 p-2">
        <Avatar initials="AM" bg="bg-slate-600" />
        <div>
          <p className="text-[12px] font-normal text-zinc-900">Aman Malhotra</p>
          <p className="text-[10.5px] text-zinc-400">Design Director</p>
        </div>
      </div>

      <div className="ml-4 mt-1.5 h-2 w-px bg-zinc-200" />

      <div className="flex items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/60 p-2">
        <Avatar initials="NS" bg="bg-rose-400" />
        <div>
          <p className="text-[12px] font-normal text-zinc-900">Neha Sethi</p>
          <p className="text-[10.5px] text-zinc-400">Manager</p>
        </div>
      </div>

      <div className="ml-4 mt-1.5 h-2 w-px bg-zinc-200" />

      <div className="flex items-center gap-2 mt-1.5">
        <div className="flex -space-x-2">
          <Avatar initials="VR" bg="bg-indigo-500" size={7} />
          <Avatar initials="PB" bg="bg-fuchsia-400" size={7} />
          <Avatar initials="RA" bg="bg-sky-500" size={7} />
          <Avatar initials="AK" bg="bg-teal-500" size={7} />
        </div>
        <p className="text-[11px] text-zinc-500">
          <span className="font-normal text-zinc-800">9 Members</span> in this team
        </p>
      </div>

      <button className="mt-2 flex items-center gap-1 text-[12px] font-normal text-indigo-600 hover:underline">
        View Full Reporting Tree <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Mini sparkline ──────────────────────────────────────────────────────────
function Sparkline({ points, color }: { points: string; color: string }) {
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Right rail: Sub Department Insights ────────────────────────────────────
function SubDepartmentInsightsCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-normal text-zinc-900 mb-2">Sub Department Insights</h3>
      <div className="space-y-1">
        {INSIGHTS.map((i) => (
          <div key={i.label} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11.5px] text-zinc-500">{i.label}</p>
              <p className="text-[14px] font-normal text-zinc-900">{i.value}</p>
            </div>
            <Sparkline points={i.points} color={i.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Quick Actions ──────────────────────────────────────────────
function QuickActionsCard() {
  const actions = [
    { label: 'Add Employee', icon: Plus },
    { label: 'Assign Team Head', icon: UserCheck },
    { label: 'Manage Permissions', icon: ShieldCheck },
    { label: 'Send Team Notification', icon: Bell },
  ];
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-normal text-zinc-900 mb-2">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex items-center justify-between gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[11.5px] font-normal text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <a.icon size={13} className="text-indigo-600" /> {a.label}
            </span>
            <ArrowRight size={12} className="text-zinc-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function TeamAndReportingPage() {
  const [activeTab, setActiveTab] = useState('Team Members');

  return (
    <div className="space-y-2 font-sans text-zinc-900">
      <PageHeading />
      <InfoStrip />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-3 items-start">
        <div className="min-w-0 space-y-2">
          <TeamMembersCard />
        </div>

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <ReportingSummaryCard />
          <SubDepartmentInsightsCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}