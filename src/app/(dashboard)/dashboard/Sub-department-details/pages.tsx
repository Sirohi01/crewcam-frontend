'use client';
import React, { useState } from 'react';
import {
  ChevronRight, ArrowLeft, GitBranch, Plus, Search, Filter, Download,
  Users, IndianRupee, Box, Layers, Palette, FileImage, MoreVertical,
  Wallet, Layers3, ClipboardList, Upload, UserPlus,
} from 'lucide-react';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Structure', 'Sub Department Details'];

const INFO_CARDS = [
  { label: 'Department', value: 'Design Studio', sub: 'DS-3D', icon: Layers, bg: 'bg-orange-50', color: 'text-orange-600' },
  { label: 'Parent Division', value: 'Design & Planning', sub: 'DIV-DSPL', icon: GitBranch, bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Business Unit', value: 'Retail Interiors', sub: 'BU-RI', icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Total Sub Departments', value: '4', sub: 'Active', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Total Budget (FY 25-26)', value: '₹ 8,40,000', sub: 'Allocated', icon: IndianRupee, bg: 'bg-amber-50', color: 'text-amber-600' },
];

const TABS = ['Sub Departments', 'Budget Allocation', 'Expense Tracking', 'Team Members', 'Documents', 'History'];

const SUB_DEPARTMENTS = [
  {
    id: 1,
    name: '3D Visualization Team',
    code: 'CC-DS-3D01',
    description: '3D modeling, rendering and visualization',
    manager: 'Vivek Rana',
    role: 'Sr. 3D Visualizer',
    initials: 'VR',
    avatarBg: 'bg-indigo-500',
    employees: 12,
    costCenter: 'CC-DS-3D01',
    costCenterColor: 'bg-blue-50 text-blue-600',
    budget: '₹ 2,40,000',
    status: 'Active',
    icon: Box,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    name: 'Space Planning Team',
    code: 'CC-DS-3D02',
    description: 'Space planning, layouts and documentation',
    manager: 'Neha Sethi',
    role: 'Manager',
    initials: 'NS',
    avatarBg: 'bg-rose-400',
    employees: 10,
    costCenter: 'CC-DS-3D02',
    costCenterColor: 'bg-rose-50 text-rose-500',
    budget: '₹ 2,10,000',
    status: 'Active',
    icon: Layers3,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    id: 3,
    name: 'Creative Team',
    code: 'CC-DS-3D03',
    description: 'Concept design, visuals and presentations',
    manager: 'Amit Kumar',
    role: '3D Artist',
    initials: 'AK',
    avatarBg: 'bg-sky-500',
    employees: 11,
    costCenter: 'CC-DS-3D03',
    costCenterColor: 'bg-purple-50 text-purple-600',
    budget: '₹ 2,00,000',
    status: 'Active',
    icon: Palette,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    name: 'Design Support Team',
    code: 'CC-DS-3D04',
    description: 'Support, CAD files, libraries & resources',
    manager: 'Pooja Bansal',
    role: 'Sr. Executive',
    initials: 'PB',
    avatarBg: 'bg-fuchsia-400',
    employees: 9,
    costCenter: 'CC-DS-3D04',
    costCenterColor: 'bg-teal-50 text-teal-600',
    budget: '₹ 1,90,000',
    status: 'Active',
    icon: FileImage,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

const COST_CENTER_MAP = [
  { code: 'CC-DS-3D01', name: '3D Visualization Team' },
  { code: 'CC-DS-3D02', name: 'Space Planning Team' },
  { code: 'CC-DS-3D03', name: 'Creative Team' },
  { code: 'CC-DS-3D04', name: 'Design Support Team' },
];

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === BREADCRUMB.length - 1 ? (
              <span className="text-indigo-600 font-semibold">{crumb}</span>
            ) : (
              <span className="text-zinc-500 hover:underline cursor-pointer">{crumb}</span>
            )}
            {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Sub Department Details</h1>
          <p className="text-[13px] text-zinc-500">Manage and track all sub departments under this department.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <ArrowLeft size={14} /> Back to Department Structure
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <GitBranch size={14} /> View in Tree
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <Plus size={14} /> Add Sub Department
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
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${c.bg} ${c.color}`}>
              <c.icon size={12} />
            </span>
            <div>
              <p className="text-[11px] text-zinc-400">{c.label}</p>
              <p className="text-[12px] font-bold text-zinc-900 leading-tight">{c.value}</p>
              <p className="text-[10.5px] text-zinc-400">{c.sub}</p>
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
          className={`shrink-0 pb-3 pt-1 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
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
    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
      {status}
    </span>
  );
}

// ─── Sub Departments table card ─────────────────────────────────────────────
function SubDepartmentsTableCard() {
  return (
    <div className="rounded-sm border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900">Sub Departments (4)</h3>
          <p className="text-[12px] text-zinc-400 mt-0.5">List of all sub departments under Design Studio.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search sub departments..."
              className="w-56 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-2 text-[11px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-zinc-400"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
            <Filter size={13} /> Filters
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div className="mt-2">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[10%]" />
            <col className="w-[19%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
            <col className="w-[5%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Sub Department</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Code</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Description</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Manager</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Employees</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Cost Center</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Budget (FY 25-26)</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Status</th>
              <th className="text-center text-[10px] font-semibold text-zinc-900 uppercase tracking-wide py-2 pr-1">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {SUB_DEPARTMENTS.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`grid shrink-0 place-items-center rounded-lg ${row.iconBg} ${row.iconColor}`}>
                      {/* <row.icon size={10} /> */}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-900">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-2 text-[10px] text-zinc-500">{row.code}</td>
                <td className="py-3 pr-2 text-[10px] text-zinc-600">{row.description}</td>
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${row.avatarBg} text-[10px] font-bold text-white`}>
                      {row.initials}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-900">{row.manager}</p>
                      <p className="text-[10px] text-zinc-400">{row.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-2">
                  <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                    <Users size={12} className="text-zinc-400" /> {row.employees}
                  </span>
                </td>
                <td className="py-3 pr-2">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${row.costCenterColor}`}>
                    {row.costCenter}
                  </span>
                </td>
                <td className="py-3 pr-2 text-[10px] font-semibold text-zinc-900">{row.budget}</td>
                <td className="py-3 pr-2"><StatusPill status={row.status} /></td>
                <td className="py-3 pr-2">
                  <button className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-3 border-t border-zinc-100">
        <p className="text-[12px] text-zinc-500">Showing 1 to 4 of 4 sub departments</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-[#16234A] text-[12px] font-semibold text-white">1</button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-zinc-500">Rows per page:</span>
            <select className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-zinc-600 shadow-sm outline-none">
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

// ─── Budget allocation summary ──────────────────────────────────────────────
function BudgetAllocationSummary() {
  const utilizedPct = 43.15;
  const availablePct = 56.85;
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-2">Budget Allocation Summary (This Department)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
          <p className="text-[11px] text-zinc-500">Total Budget</p>
          <p className="text-[14px] font-semibold text-zinc-900 mt-1">₹ 8,40,000</p>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
          <p className="text-[11px] text-zinc-500">Allocated</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-[14px] font-semibold text-zinc-900 mt-1">₹ 8,40,000</p>
            <span className="text-[11px] font-bold text-indigo-600">100%</span>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
          <p className="text-[11px] text-zinc-500">Utilized</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-[14px] font-semibold text-zinc-900 mt-1">₹ 3,62,500</p>
            <span className="text-[11px] font-bold text-amber-600">43.15%</span>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
          <p className="text-[11px] text-zinc-500">Available</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-[14px] font-semibold text-zinc-900 mt-1">₹ 4,77,500</p>
            <span className="text-[11px] font-bold text-emerald-600">56.85%</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex h-6 w-full overflow-hidden rounded-full">
        <div
          className="flex items-center justify-center bg-indigo-600 text-[10.5px] font-bold text-white"
          style={{ width: `${utilizedPct}%` }}
        >
          {utilizedPct}%
        </div>
        <div
          className="flex items-center justify-center bg-emerald-500 text-[10.5px] font-bold text-white"
          style={{ width: `${availablePct}%` }}
        >
          {availablePct}%
        </div>
      </div>
    </div>
  );
}

// ─── Right rail: Sub Department Summary ─────────────────────────────────────
function SubDepartmentSummaryCard() {
  const rows = [
    { icon: Users, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', label: 'Total Employees', value: '42' },
    { icon: Users, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', label: 'Active Employees', value: '42' },
    { icon: Wallet, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', label: 'Total Cost Centers', value: '4' },
    { icon: ClipboardList, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Total Budget (FY 25-26)', value: '₹ 8,40,000' },
  ];
  return (
    <div className="rounded-sm border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Sub Department Summary</h3>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className={`grid h-7 w-7 place-items-center rounded-lg ${r.iconBg} ${r.iconColor}`}>
                <r.icon size={13} />
              </span>
              <span className="text-[12px] text-zinc-600">{r.label}</span>
            </span>
            <span className="text-[13px] font-semibold text-zinc-900">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Cost Center Mapping ────────────────────────────────────────
function CostCenterMappingCard() {
  return (
    <div className="rounded-sm border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Cost Center Mapping</h3>
      <div className="space-y-2">
        {COST_CENTER_MAP.map((c) => (
          <div key={c.code} className="flex items-center justify-between text-[12px]">
            <span className="font-semibold text-indigo-600">{c.code}</span>
            <span className="text-zinc-600">{c.name}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-indigo-600 hover:underline">
        View All Cost Centers <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─── Right rail: Quick Actions ──────────────────────────────────────────────
function QuickActionsCard() {
  return (
    <div className="rounded-sm border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[11.5px] font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors">
          <Plus size={13} /> Add Sub Department
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <IndianRupee size={13} /> Allocate Budget
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <Wallet size={13} /> Map Cost Center
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <Upload size={13} /> Upload Document
        </button>
      </div>
      <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
        <UserPlus size={13} /> View Team Members
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function SubDepartmentDetailsPage() {
  const [activeTab, setActiveTab] = useState('Sub Departments');

  return (
    <div className="space-y-2 font-sans text-zinc-900">
      <PageHeading />
      <InfoStrip />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-4 items-start">
        <div className="min-w-0 space-y-2">
          <SubDepartmentsTableCard />
          <BudgetAllocationSummary />
        </div>

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <SubDepartmentSummaryCard />
          <CostCenterMappingCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}