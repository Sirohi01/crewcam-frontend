'use client';
import React, { useState } from 'react';
import {ChevronRight, ArrowLeft, GitBranch, Pencil, Users, Building2, Wallet, CalendarRange, Download, ChevronDown, MoreVertical, TrendingUp,ArrowRight, ShieldCheck, Plus, Receipt, CreditCard, Cpu, GraduationCap,Plane, Package, } from 'lucide-react';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Structure', 'Sub Department Details', 'Budget & Costing'];

const INFO_CARDS = [
  { label: 'Sub Department', value: '3D Visualization Team', sub: 'DS-3D', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Parent Department', value: 'Design Studio (DS)', sub: 'DS', icon: GitBranch, bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Business Unit', value: 'Design & Creative', sub: 'BU-DC', icon: Building2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Cost Center', value: 'CC-DS-3D02', sub: '', icon: Wallet, bg: 'bg-amber-50', color: 'text-amber-600' },
  { label: 'Financial Year', value: 'FY 2025-26', sub: '01 Apr 2025 – 31 Mar 2026', icon: CalendarRange, bg: 'bg-blue-50', color: 'text-blue-600' },
];

const TABS = ['Budget Overview', 'Budget Allocation', 'Expense Tracking', 'Cost Center Mapping', 'Approval Workflow', 'History'];

const SUMMARY_CARDS = [
  { label: 'Total Budget (INR)', value: '₹ 24,00,000', pct: null, pctColor: '' },
  { label: 'Allocated Budget', value: '₹ 18,40,000', pct: '76.67%', pctColor: 'text-indigo-600' },
  { label: 'Utilized Amount', value: '₹ 8,75,600', pct: '48.71%', pctColor: 'text-amber-600' },
  { label: 'Available Budget', value: '₹ 9,64,400', pct: '40.19%', pctColor: 'text-emerald-600' },
  { label: 'Projected Overrun', value: '₹ 0', pct: '0%', pctColor: 'text-zinc-400' },
];

const CATEGORIES = [
  { name: 'Salaries & Benefits', icon: Wallet, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', annual: '₹ 14,40,000', allocated: '₹ 14,40,000', utilized: '₹ 6,20,000', available: '₹ 8,20,000', pct: 43.06, barColor: 'bg-emerald-500' },
  { name: 'Tools & Software', icon: CreditCard, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', annual: '₹ 3,00,000', allocated: '₹ 2,40,000', utilized: '₹ 1,20,500', available: '₹ 1,19,500', pct: 50.21, barColor: 'bg-blue-500' },
  { name: 'Hardware & Equipment', icon: Cpu, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', annual: '₹ 2,50,000', allocated: '₹ 2,00,000', utilized: '₹ 90,000', available: '₹ 1,10,000', pct: 45.00, barColor: 'bg-orange-500' },
  { name: 'Training & Development', icon: GraduationCap, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', annual: '₹ 1,50,000', allocated: '₹ 1,00,000', utilized: '₹ 45,100', available: '₹ 54,900', pct: 45.10, barColor: 'bg-purple-500' },
  { name: 'Travel & Conveyance', icon: Plane, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', annual: '₹ 75,000', allocated: '₹ 40,000', utilized: '₹ 25,000', available: '₹ 15,000', pct: 62.50, barColor: 'bg-rose-500' },
  { name: 'Miscellaneous', icon: Package, iconBg: 'bg-teal-50', iconColor: 'text-teal-600', annual: '₹ 1,85,000', allocated: '₹ 1,20,000', utilized: '₹ 75,000', available: '₹ 45,000', pct: 62.50, barColor: 'bg-teal-500' },
];

const CATEGORY_TOTAL = { annual: '₹ 24,00,000', allocated: '₹ 21,20,000', utilized: '₹ 8,75,600', available: '₹ 12,44,400', pct: '48.71%' };

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const BUDGET_VS_ACTUAL = [
  { budget: 62, actual: 55 }, { budget: 68, actual: 60 }, { budget: 72, actual: 66 },
  { budget: 78, actual: 70 }, { budget: 82, actual: 74 }, { budget: 88, actual: 78 },
  { budget: 90, actual: 82 }, { budget: 94, actual: 86 }, { budget: 96, actual: 88 },
  { budget: 98, actual: 90 }, { budget: 92, actual: 84 }, { budget: 86, actual: 78 },
];

const TOP_EXPENSES = [
  { item: 'Autodesk 3ds Max License', amount: '₹ 1,35,000', pct: '15.43%' },
  { item: 'High End Workstation', amount: '₹ 1,20,000', pct: '13.71%' },
  { item: 'Adobe Creative Cloud', amount: '₹ 85,500', pct: '9.77%' },
  { item: 'Training Program', amount: '₹ 45,100', pct: '5.15%' },
  { item: 'Local Travel', amount: '₹ 32,000', pct: '3.66%' },
];

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-0.5">
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Budget & Costing</h1>
          <p className="text-[13px] text-zinc-500">Plan, allocate and track budgets and costs for this sub department.</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <ArrowLeft size={13} /> Back to Sub Department
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <GitBranch size={13} /> View in Tree
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
            <Pencil size={13} /> Edit Budget
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
          <div key={c.label} className="flex items-center gap-2.5 py-2 lg:py-0 lg:px-3 first:pl-0 first:pt-0 last:pr-0">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${c.bg} ${c.color}`}>
              <c.icon size={16} />
            </span>
            <div>
              <p className="text-[10.5px] text-zinc-400">{c.label}</p>
              <p className="text-[13px] font-medium text-zinc-800 leading-tight">{c.value}</p>
              {c.sub && <p className="text-[10px] text-zinc-400">{c.sub}</p>}
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
    <div className="flex items-center gap-4 border-b border-zinc-200 overflow-x-auto">
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

// ─── Budget summary card ────────────────────────────────────────────────────
function BudgetSummaryCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-[14px] font-semibold text-zinc-900">Budget Summary (FY 2025-26)</h3>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
          <Download size={13} /> Download Report <ChevronDown size={13} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {SUMMARY_CARDS.map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3">
            <p className="text-[11px] text-zinc-500">{s.label}</p>
            <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
              <p className="text-[14px] font-semibold text-zinc-900">{s.value}</p>
              {s.pct && <span className={`text-[10.5px] font-bold ${s.pctColor}`}>{s.pct}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Budget Allocation by Category table ────────────────────────────────────
function CategoryAllocationCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-semibold text-zinc-900 mb-2">Budget Allocation by Category</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <colgroup>
            <col style={{width:'22%'}} />
            <col style={{width:'14%'}} />
            <col style={{width:'14%'}} />
            <col style={{width:'13%'}} />
            <col style={{width:'14%'}} />
            <col style={{width:'15%'}} />
            <col style={{width:'8%'}} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Category</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Annual Budget (INR)</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Allocated (INR)</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Utilized (INR)</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Available (INR)</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2 pr-2">Utilization %</th>
              <th className="text-left text-[11px] font-semibold text-zinc-600 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {CATEGORIES.map((c) => (
              <tr key={c.name} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-2.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${c.iconBg} ${c.iconColor}`}>
                      <c.icon size={13} />
                    </span>
                    <span className="text-[12px] font-normal text-zinc-800">{c.name}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-2 text-[12px] font-normal text-zinc-700">{c.annual}</td>
                <td className="py-2.5 pr-2 text-[12px] font-normal text-zinc-700">{c.allocated}</td>
                <td className="py-2.5 pr-2 text-[12px] font-normal text-zinc-700">{c.utilized}</td>
                <td className="py-2.5 pr-2 text-[12px] font-normal text-zinc-700">{c.available}</td>
                <td className="py-2.5 pr-2">
                  <p className="text-[11px] font-semibold text-zinc-700">{c.pct.toFixed(2)}</p>
                  <div className="mt-1 h-1.5 w-20 rounded-full bg-zinc-100 overflow-hidden">
                    <div className={`h-full rounded-full ${c.barColor}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </td>
                <td className="py-2.5">
                  <button className="grid h-6 w-6 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors">
                    <MoreVertical size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-200">
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">Total</td>
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">{CATEGORY_TOTAL.annual}</td>
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">{CATEGORY_TOTAL.allocated}</td>
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">{CATEGORY_TOTAL.utilized}</td>
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">{CATEGORY_TOTAL.available}</td>
              <td className="py-2.5 pr-2 text-[12px] font-semibold text-zinc-900">{CATEGORY_TOTAL.pct}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mt-2 pt-2 border-t border-zinc-100">
        <p className="text-[12px] text-zinc-500">Showing 1 to 6 of 6 categories</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-[12px] font-semibold text-white">1</button>
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

// ─── Right rail: Budget vs Actual chart ─────────────────────────────────────
function BudgetVsActualCard() {
  const maxVal = 100;
  const chartHeight = 140;
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-[13px] font-semibold text-zinc-900">Budget vs Actual</h3>
        <div className="flex items-center gap-3 text-[10.5px]">
          <span className="flex items-center gap-1 text-zinc-500"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Budget (INR)</span>
          <span className="flex items-center gap-1 text-zinc-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Actual (INR)</span>
        </div>
      </div>

      <div className="mt-2 flex items-end gap-1" style={{ height: `${chartHeight}px` }}>
        {BUDGET_VS_ACTUAL.map((d, i) => (
          <div key={i} className="flex flex-1 items-end justify-center gap-[2px]">
            <div
              className="w-1.5 rounded-t bg-indigo-500"
              style={{ height: `${(d.budget / maxVal) * chartHeight}px` }}
            />
            <div
              className="w-1.5 rounded-t bg-emerald-500"
              style={{ height: `${(d.actual / maxVal) * chartHeight}px` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center text-[9px] text-zinc-400">{m}</span>
        ))}
      </div>

      <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
        <TrendingUp size={13} /> View Detailed Chart
      </button>
    </div>
  );
}

// ─── Right rail: Top Expenses ───────────────────────────────────────────────
function TopExpensesCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[13px] font-semibold text-zinc-900 mb-2">Top Expenses (This Year)</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-100">
            <th className="text-left text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide py-1.5 pr-2">Item</th>
            <th className="text-left text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide py-1.5 pr-2">Amount (INR)</th>
            <th className="text-left text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide py-1.5 pr-2">% of Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {TOP_EXPENSES.map((e) => (
            <tr key={e.item}>
              <td className="py-2 pr-2 text-[12px] text-zinc-700">{e.item}</td>
              <td className="py-2 pr-2 text-[12px] font-semibold text-zinc-900 whitespace-nowrap">{e.amount}</td>
              <td className="py-2 pr-2 text-[12px] text-zinc-500">{e.pct}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-3 flex items-center gap-1 text-[12.5px] font-semibold text-indigo-600 hover:underline">
        View All Expenses <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Right rail: Quick Actions ──────────────────────────────────────────────
function QuickActionsCard() {
  const actions = [
    { label: 'Add Budget Allocation', icon: Plus },
    { label: 'Add Expense', icon: Receipt },
    { label: 'Go to Cost Center', icon: Wallet },
    { label: 'View Approval Workflow', icon: ShieldCheck },
  ];
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[13px] font-semibold text-zinc-900 mb-2">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <a.icon size={13} className="text-indigo-600" /> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function BudgetAndCostingPage() {
  const [activeTab, setActiveTab] = useState('Budget Overview');

  return (
    <div className="space-y-2.5 font-sans text-zinc-900">
      <PageHeading />
      <InfoStrip />
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2.5 items-start">
        <div className="min-w-0 space-y-2.5">
          <BudgetSummaryCard />
          <CategoryAllocationCard />
        </div>

        <div className="space-y-2.5 min-w-0 xl:sticky xl:top-[20px]">
          <BudgetVsActualCard />
          <TopExpensesCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}