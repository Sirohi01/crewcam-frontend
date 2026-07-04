'use client';

import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  Wallet, FileText, BadgeCheck, HandCoins, Medal, Search, Filter,
  Calendar, ChevronDown, Eye, MoreVertical, Download, ChevronLeft,
  ChevronRight, MessageCircleQuestion, FilePlus2, ClipboardList,
  CreditCard, FileDown, ArrowRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

const summaryStats = [
  {
    icon: Wallet,
    accent: 'bg-blue-50 text-blue-600',
    label: 'My Imprest Balance',
    value: '₹12,450.00',
    detail: 'Available to spend',
    link: 'View imprest details',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
  {
    icon: FileText,
    accent: 'bg-emerald-50 text-emerald-600',
    label: 'Pending Requests',
    value: '₹18,720.00',
    detail: '2 requests pending',
    link: 'View pending',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
  {
    icon: BadgeCheck,
    accent: 'bg-amber-50 text-amber-500',
    label: 'Approved (This Month)',
    value: '₹27,530.00',
    detail: '6 requests approved',
    link: 'View approved',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
  {
    icon: HandCoins,
    accent: 'bg-violet-50 text-violet-600',
    label: 'Total Reimbursed (FY 2024-25)',
    value: '₹1,02,450.00',
    detail: 'Till date',
    link: 'View summary',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
  {
    icon: Medal,
    accent: 'bg-sky-50 text-sky-600',
    label: 'Average Turnaround Time',
    value: '2.4 Days',
    detail: 'This month average',
    link: 'View report',
    linkColor: 'text-blue-600 hover:text-blue-700',
  },
];

const tabs = ['My Requests', 'Pending Approval', 'Approved', 'Rejected', 'All Requests', 'Imprest History'];

const STATUS_STYLE: Record<string, string> = {
  'Pending Approval': 'bg-amber-50 text-amber-600',
  Approved: 'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-rose-50 text-rose-600',
};

const requests = [
  { id: 'RIM-2024-045', purpose: 'Client Meeting - Travel', sub: 'Delhi to Jaipur visit', amount: '5,840.00', expenseDate: '23 May 2024', submitted: '24 May 2024', submittedTime: '10:30 AM', status: 'Pending Approval', action: 'view' },
  { id: 'RIM-2024-044', purpose: 'Office Supplies', sub: 'Stationery & printing', amount: '2,350.00', expenseDate: '20 May 2024', submitted: '21 May 2024', submittedTime: '09:15 AM', status: 'Pending Approval', action: 'view' },
  { id: 'RIM-2024-043', purpose: 'Team Lunch', sub: 'Team collaboration lunch', amount: '3,120.00', expenseDate: '18 May 2024', submitted: '18 May 2024', submittedTime: '03:20 PM', status: 'Approved', action: 'download' },
  { id: 'RIM-2024-042', purpose: 'Fuel Reimbursement', sub: 'Local travel', amount: '1,960.00', expenseDate: '16 May 2024', submitted: '17 May 2024', submittedTime: '11:45 AM', status: 'Approved', action: 'download' },
  { id: 'RIM-2024-041', purpose: 'Hotel Stay', sub: 'Client meeting - Mumbai', amount: '4,850.00', expenseDate: '12 May 2024', submitted: '13 May 2024', submittedTime: '09:40 AM', status: 'Rejected', action: 'view' },
  { id: 'RIM-2024-040', purpose: 'Internet & Mobile', sub: 'Reimbursement', amount: '1,250.00', expenseDate: '10 May 2024', submitted: '10 May 2024', submittedTime: '05:30 PM', status: 'Approved', action: 'download' },
];

const reimbursementBreakdown = [
  { key: 'Approved', value: 8245, pct: '8%', color: '#22c55e' },
  { key: 'Pending', value: 1872, pct: '18%', color: '#f59e0b' },
  { key: 'Rejected', value: 128, pct: '1%', color: '#ef4444' },
];

const quickActions = [
  { icon: FilePlus2, accent: 'bg-blue-50 text-blue-600', title: 'Submit New Request', detail: 'Raise a new reimbursement' },
  { icon: ClipboardList, accent: 'bg-emerald-50 text-emerald-600', title: 'My Requests', detail: 'View all my requests' },
  { icon: CreditCard, accent: 'bg-amber-50 text-amber-600', title: 'Imprest Details', detail: 'View imprest balance' },
  { icon: FileDown, accent: 'bg-violet-50 text-violet-600', title: 'Download Policy', detail: 'Reimbursement policy' },
];

const steps = [
  { n: 1, accent: 'bg-blue-600', title: 'Submit Request', detail: 'Submit your reimbursement request with bills' },
  { n: 2, accent: 'bg-emerald-600', title: 'Manager Review', detail: 'Your manager will review and approve' },
  { n: 3, accent: 'bg-amber-500', title: 'Finance Verification', detail: 'Finance team verifies documents' },
  { n: 4, accent: 'bg-violet-600', title: 'Payment Processed', detail: 'Amount credited to your bank account' },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  action?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
}

function Card({ title, action, className = '', children, titleExtra }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            {titleExtra}
            {action && (
              <button className="flex items-center gap-0.5 whitespace-nowrap text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                {action} <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header + breadcrumb
// ─────────────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[12px] text-zinc-400">
        <span className="text-zinc-400">Dashboard</span>
        <span>›</span>
        <span className="font-semibold text-zinc-700">Reimbursement (Imprest)</span>
      </p>
      <h1 className="mt-1 text-[24px] font-bold text-zinc-900">Reimbursement (Imprest)</h1>
      <p className="mt-0.5 text-[13px] text-zinc-400">Submit, track and manage your reimbursement requests.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: (typeof summaryStats)[number] }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${stat.accent}`}>
          <stat.icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-zinc-500">{stat.label}</p>
          <p className="mt-0.5 truncate text-[15px] font-bold leading-tight text-zinc-900">{stat.value}</p>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-zinc-400">{stat.detail}</p>
      {/* mt-auto pushes every card's link to the same bottom baseline regardless of detail text length */}
      <button className={`mt-auto flex items-center gap-1 pt-1.5 text-[11.5px] font-semibold ${stat.linkColor}`}>
        {stat.link} <ArrowRight size={12} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Requests table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function RequestsTableCard() {
  const [activeTab, setActiveTab] = useState('My Requests');

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap pb-2.5 text-[12.5px] font-semibold transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
          <Filter size={13} /> Filter
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
          <Calendar size={13} /> Date Range <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
          All Status <ChevronDown size={12} />
        </button>
      </div>

      {/* Table — contained scroll region only; does not affect page width */}
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-zinc-100 bg-white">
              {['Request ID', 'Purpose', 'Amount (₹)', 'Date of Expense', 'Submitted On', 'Status', 'Action'].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                <td className="px-3 py-1.5 text-[11px] font-medium text-zinc-700">{r.id}</td>
                <td className="px-3 py-1.5">
                  <p className="text-[11.5px] font-medium text-zinc-800">{r.purpose}</p>
                  <p className="text-[10px] text-zinc-400">{r.sub}</p>
                </td>
                <td className="px-3 py-1.5 text-[11px] font-medium text-zinc-800">{r.amount}</td>
                <td className="px-3 py-1.5 text-[11px] text-zinc-500">{r.expenseDate}</td>
                <td className="px-3 py-1.5">
                  <p className="text-[11px] text-zinc-500">{r.submitted}</p>
                  <p className="text-[10px] text-zinc-400">{r.submittedTime}</p>
                </td>
                <td className="px-3 py-1.5">
                  <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${
                    r.status === 'Pending Approval' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                    r.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' :
                    'border-rose-200 bg-rose-50 text-rose-600'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                      <Eye size={12} />
                    </button>
                    {r.action === 'download' ? (
                      <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Download size={12} />
                      </button>
                    ) : (
                      <button className="grid h-6 w-6 place-items-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
                        <MoreVertical size={12} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-[11.5px] text-zinc-400">Showing 1 to 6 of 12 requests</p>
        <div className="flex items-center gap-1.5">
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronLeft size={14} />
          </button>
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white">1</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">2</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-600">
          10 / page <ChevronDown size={12} />
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// How Reimbursement Works + Need Help
// ─────────────────────────────────────────────────────────────────────────

function HowItWorksCard() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm lg:grid-cols-[1.6fr_1fr]">
      <div className="min-w-0">
        <h3 className="mb-5 text-[13.5px] font-semibold text-zinc-900">How Reimbursement Works</h3>
        <div className="flex items-start">
          {steps.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex w-28 flex-col items-center text-center">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white ${s.accent}`}>
                  {s.n}
                </span>
                <p className="mt-2 text-[11.5px] font-semibold text-zinc-800">{s.title}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-zinc-400">{s.detail}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-[18px] h-px flex-1 border-t-2 border-dashed border-zinc-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
        <h4 className="text-[12.5px] font-semibold text-zinc-900">Need Help?</h4>
        <p className="mt-1 text-[11.5px] leading-snug text-zinc-500">
          Facing issues with reimbursement? Contact our HR Support Team.
        </p>
        <button className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <MessageCircleQuestion size={14} /> Contact Support
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function ImprestBalanceCard() {
  const total = 25000;
  const utilized = 12550;
  const pct = (utilized / total) * 100;
  return (
    <Card title="My Imprest Balance" action="View Details">
      <p className="text-[12px] font-medium text-zinc-500">Total Imprest Amount</p>
      <p className="text-[15px] font-semibold text-zinc-900">₹25,000.00</p>

      <p className="mt-3 text-[12px] font-medium text-zinc-500">Utilized Amount</p>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-semibold text-zinc-900">₹12,550.00</p>
        <p className="text-[11px] font-semibold text-zinc-500">{pct.toFixed(2)}%</p>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[12px] font-medium text-zinc-500">Available Balance</p>
        <p className="text-[15px] font-semibold text-emerald-600">₹12,450.00</p>
      </div>

      <button className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-blue-700">
        Request Imprest Top-up
      </button>
    </Card>
  );
}

function ReimbursementSummaryCard() {
  const totalAmount = reimbursementBreakdown.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card title="Reimbursement Summary" titleExtra={<span className="text-[10.5px] font-medium text-zinc-400">(FY 2024-25)</span>}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reimbursementBreakdown}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {reimbursementBreakdown.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10.5px] font-bold text-zinc-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-zinc-400">Total</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {reimbursementBreakdown.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.key}
              </span>
              <span className="shrink-0 text-right text-[11px] font-semibold text-zinc-800">
                ₹{d.value.toLocaleString('en-IN')} ({d.pct})
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View Full Summary <ArrowRight size={12} />
      </button>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-2 gap-2.5">
        {quickActions.map((a) => (
          <button
            key={a.title}
            className="flex min-w-0 flex-col items-start gap-2 rounded-xl border border-zinc-100 p-2 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${a.accent}`}>
              <a.icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold leading-tight text-zinc-800">{a.title}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-zinc-400">{a.detail}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function ReimbursementImprest() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader />

      {/* Row 1 — five summary stat cards, all footer links aligned to the same baseline */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — requests table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <RequestsTableCard />
          <HowItWorksCard />
        </div>
        <div className="min-w-0 space-y-2">
          <ImprestBalanceCard />
          <ReimbursementSummaryCard />
          <QuickActionsCard />
        </div>
      </div>
    </main>
  );
}