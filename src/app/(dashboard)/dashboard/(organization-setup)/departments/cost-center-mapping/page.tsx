'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ArrowLeft, GitBranch, Plus, Search, Filter,
  Users, IndianRupee, Layers, Building, MoreVertical,
  ChevronLeft, FileText, Info, PieChartIcon, LayoutDashboard,
  Wallet, LineChart
} from 'lucide-react';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Structure', 'Sub Department Details', 'Cost Center Mapping'];

const INFO_CARDS = [
  { label: 'Sub Department', value: '3D Visualization Team', sub: 'DS-3D', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Parent Department', value: 'Design Studio (DS)', sub: 'DS', icon: Layers, bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Business Unit', value: 'Design & Creative', sub: 'BU-DC', icon: Building, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Total Cost Centers', value: '3', sub: 'Mapped', icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
  { label: 'Total Budget (FY 25-26)', value: '₹ 21,20,000', sub: 'Allocated', icon: IndianRupee, bg: 'bg-sky-50', color: 'text-sky-600' },
];

const TABS = ['Cost Center Mapping', 'Budget Allocation', 'Expense Tracking', 'Cost Center Details', 'History'];

const TABLE_DATA = [
  {
    id: 1,
    code: 'CC-DS-3D01',
    name: '3D Visualization - Internal',
    desc: 'Internal projects and visualization work',
    manager: 'Vivek Rana',
    role: 'Sr. 3D Visualizer',
    initials: 'VR',
    avatarBg: 'bg-indigo-500',
    budget: '₹ 8,40,000',
    status: 'Active',
  },
  {
    id: 2,
    code: 'CC-DS-3D02',
    name: '3D Visualization - Client Projects',
    desc: 'Client based 3D projects and presentations',
    manager: 'Neha Sethi',
    role: 'Manager',
    initials: 'NS',
    avatarBg: 'bg-rose-400',
    budget: '₹ 9,60,000',
    status: 'Active',
  },
  {
    id: 3,
    code: 'CC-DS-3D03',
    name: '3D Assets & Libraries',
    desc: '3D assets, plugins, models and resource library',
    manager: 'Amit Kumar',
    role: '3D Artist',
    initials: 'AK',
    avatarBg: 'bg-sky-500',
    budget: '₹ 3,20,000',
    status: 'Active',
  },
];

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-2">
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
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Cost Center Mapping</h1>
          <p className="text-[13px] text-zinc-500">Map and manage cost centers for this sub department to track budgets, expenses and financial performance.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/dashboard/departments/sub-department-details" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <ArrowLeft size={14} /> Back to Sub Department
          </Link>
          <Link href="/dashboard/departments/structure/view-in-tree" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <GitBranch size={14} /> View in Tree
          </Link>
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <Plus size={14} /> Add Cost Center Mapping
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

// ─── Main Content Area ──────────────────────────────────────────────────────
export default function CostCenterMappingPage() {
  const [activeTab, setActiveTab] = useState('Cost Center Mapping');

  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2 min-h-screen">
      <PageHeading />
      <InfoStrip />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        
        {/* LEFT SECTION */}
        <div className="xl:col-span-9 flex flex-col gap-3 min-w-0 pr-1">
          
          <div className="rounded-sm border border-zinc-200 bg-white shadow-sm p-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-[15px] font-bold text-zinc-900">Mapped Cost Centers (3)</h3>
                <p className="text-[12px] text-zinc-400 mt-0.5">List of cost centers mapped with this sub department.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search cost centers..."
                    className="w-56 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-2 text-[11px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-zinc-400"
                  />
                </div>
                <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
                  <Filter size={13} /> Filters
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="text-left text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Cost Center Code</th>
                    <th className="text-left text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Cost Center Name</th>
                    <th className="text-left text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Description</th>
                    <th className="text-left text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Manager</th>
                    <th className="text-center text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Budget (FY 25-26)</th>
                    <th className="text-center text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Status</th>
                    <th className="text-center text-[10.5px] font-bold text-zinc-900 py-2 pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {TABLE_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 pr-3 text-[11px] font-bold text-zinc-700">{row.code}</td>
                      <td className="py-3 pr-3 text-[11.5px] font-semibold text-zinc-900">{row.name}</td>
                      <td className="py-3 pr-3 text-[11px] text-zinc-500 max-w-[200px] leading-tight">{row.desc}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${row.avatarBg} text-[10px] font-bold text-white`}>
                            {row.initials}
                          </div>
                          <div className="leading-tight">
                            <p className="text-[11.5px] font-semibold text-zinc-900">{row.manager}</p>
                            <p className="text-[10px] text-zinc-500">{row.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-center text-[11.5px] font-bold text-zinc-700">{row.budget}</td>
                      <td className="py-3 pr-3 text-center"><StatusPill status={row.status} /></td>
                      <td className="py-3 pr-3 text-center">
                        <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Budget Summary Cards */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3">
                <p className="text-[10.5px] font-bold text-slate-600 mb-0.5">Total Budget Allocated</p>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-blue-600">₹ 21,20,000</span>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3">
                <p className="text-[10.5px] font-bold text-slate-600 mb-0.5">Utilized Amount</p>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-slate-900">₹ 7,85,400</span>
                  <span className="text-[10px] font-bold text-emerald-600">37.05%</span>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3">
                <p className="text-[10.5px] font-bold text-slate-600 mb-0.5">Available Budget</p>
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-slate-900">₹ 13,34,600</span>
                  <span className="text-[10px] font-bold text-purple-600">62.95%</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-[12px] font-bold text-blue-600 shadow-sm hover:bg-blue-100 transition-colors">
                <Plus size={14} /> Add Cost Center Mapping
              </button>
            </div>

            {/* Pagination Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-[11px] font-medium text-zinc-500">Showing 1 to 3 of 3 cost centers</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 disabled:opacity-50">
                    <ChevronLeft size={13} />
                  </button>
                  <button className="grid h-6 w-6 place-items-center rounded-md bg-blue-600 text-[11px] font-semibold text-white">
                    1
                  </button>
                  <button className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 disabled:opacity-50">
                    <ChevronRight size={13} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                  Rows per page:
                  <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-zinc-700">
                    10 <ChevronRight size={10} className="rotate-90 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-3 min-w-0 flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar pr-1 pb-1">
          
          {/* About Cost Hierarchy Card */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4 shrink-0">
            <div className="flex items-center gap-1.5 mb-4 text-[13.5px] font-bold text-zinc-900">
              <Info size={15} className="text-blue-600" /> About Cost Hierarchy
            </div>
            
            <div className="flex flex-col relative before:absolute before:left-[7px] before:top-2 before:bottom-6 before:w-px before:bg-slate-200">
              <div className="flex items-start gap-2 mb-3 relative z-10">
                <div className="w-3.5 h-3.5 rounded bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 mt-0.5">
                  <Building size={9} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-800">Design House India Pvt Ltd</p>
                  <p className="text-[9.5px] text-slate-500">Corporate</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 mb-3 relative z-10 pl-4 before:absolute before:left-[-9px] before:top-2.5 before:w-3 before:h-px before:bg-slate-200">
                <div className="w-3.5 h-3.5 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0 mt-0.5">
                  <LayoutDashboard size={9} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-800">Design & Creative <span className="text-[9.5px] font-normal text-slate-500">(Business Unit)</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 mb-3 relative z-10 pl-8 before:absolute before:left-[-5px] before:top-2.5 before:w-3 before:h-px before:bg-slate-200">
                <div className="w-3.5 h-3.5 rounded bg-purple-50 flex items-center justify-center border border-purple-100 shrink-0 mt-0.5">
                  <Layers size={9} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-800">Design Studio <span className="text-[9.5px] font-normal text-slate-500">(Department)</span></p>
                </div>
              </div>
              
              <div className="flex flex-col relative z-10 pl-12 before:absolute before:left-[-1px] before:top-2.5 before:w-3 before:h-px before:bg-slate-200">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-blue-200">
                    <Users size={9} className="text-white" />
                  </div>
                  <div className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <p className="text-[11px] font-bold text-blue-700">3D Visualization Team <span className="text-[9px] font-semibold text-blue-500">(Sub Dept)</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 pl-6 mt-1 relative before:absolute before:left-[6px] before:top-0 before:bottom-2 before:w-px before:bg-slate-200">
                  <div className="flex items-center gap-1.5 relative before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-slate-200">
                    <Users size={10} className="text-slate-400 shrink-0" />
                    <p className="text-[10px] font-semibold text-slate-600">CC-DS-3D01 <span className="text-[9px] font-medium text-slate-400">(Internal)</span></p>
                  </div>
                  <div className="flex items-center gap-1.5 relative before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-slate-200">
                    <Users size={10} className="text-slate-400 shrink-0" />
                    <p className="text-[10px] font-semibold text-slate-600">CC-DS-3D02 <span className="text-[9px] font-medium text-slate-400">(Client Projects)</span></p>
                  </div>
                  <div className="flex items-center gap-1.5 relative before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-slate-200">
                    <Users size={10} className="text-slate-400 shrink-0" />
                    <p className="text-[10px] font-semibold text-slate-600">CC-DS-3D03 <span className="text-[9px] font-medium text-slate-400">(Assets & Libraries)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4 shrink-0">
            <h3 className="text-[13.5px] font-bold text-zinc-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-slate-100 rounded-lg p-2 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group flex flex-col gap-1.5">
                <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                  <Plus size={12} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Add Cost Center</p>
                  <p className="text-[9px] text-slate-500">Create new cost center</p>
                </div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group flex flex-col gap-1.5">
                <div className="w-6 h-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Users size={12} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">View Cost Center</p>
                  <p className="text-[9px] text-slate-500">View cost center details</p>
                </div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group flex flex-col gap-1.5">
                <div className="w-6 h-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Wallet size={12} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Budget Allocation</p>
                  <p className="text-[9px] text-slate-500">Allocate budget</p>
                </div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group flex flex-col gap-1.5">
                <div className="w-6 h-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <FileText size={12} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-[10.5px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Expense Tracking</p>
                  <p className="text-[9px] text-slate-500">Track expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Reports Card */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4 shrink-0">
            <h3 className="text-[13.5px] font-bold text-zinc-900 mb-3">Related Reports</h3>
            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <LineChart size={14} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Cost Center Wise Report</p>
                  <p className="text-[9.5px] text-slate-500">View detailed cost center report</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
