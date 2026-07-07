'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  ChevronRight,
  Plus,
  TreePine,
  Plane,
  HeartPulse,
  Home,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Headset,
  MoreVertical,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const leaveBalances = [
  {
    key: 'CL',
    label: 'Casual Leave (CL)',
    icon: TreePine,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    value: '8.5',
    valueColor: 'text-emerald-500',
    taken: '3.5 / 12 Days',
    barColor: 'bg-emerald-500',
    barPct: (3.5 / 12) * 100,
  },
  {
    key: 'PL',
    label: 'Privilege Leave (PL)',
    icon: Plane,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    value: '12',
    valueColor: 'text-blue-600',
    taken: '8 / 20 Days',
    barColor: 'bg-blue-600',
    barPct: (8 / 20) * 100,
  },
  {
    key: 'SL',
    label: 'Sick Leave (SL)',
    icon: HeartPulse,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    value: '6',
    valueColor: 'text-orange-500',
    taken: '2 / 8 Days',
    barColor: 'bg-orange-500',
    barPct: (2 / 8) * 100,
  },
  {
    key: 'WFH',
    label: 'Work From Home (WFH)',
    icon: Home,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    value: '4',
    valueColor: 'text-violet-600',
    taken: '2 / 6 Days',
    barColor: 'bg-violet-600',
    barPct: (2 / 6) * 100,
  },
  {
    key: 'CompOff',
    label: 'Comp Off',
    icon: Clock,
    iconBg: 'bg-zinc-100',
    iconColor: 'text-zinc-500',
    value: '3',
    valueColor: 'text-zinc-800',
    taken: '1 / 4 Days',
    barColor: 'bg-zinc-700',
    barPct: (1 / 4) * 100,
  },
];

const TYPE_BADGE: Record<string, string> = {
  CL: 'bg-emerald-50 text-emerald-600',
  PL: 'bg-blue-50 text-blue-600',
  SL: 'bg-orange-50 text-orange-600',
  WFH: 'bg-violet-50 text-violet-600',
};

const STATUS_BADGE: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Rejected: 'bg-rose-50 text-rose-600',
  Cancelled: 'bg-zinc-100 text-zinc-500',
};

const leaveHistory = [
  { type: 'CL', from: '12 May 2025', to: '12 May 2025', days: 1, reason: 'Personal Work', status: 'Approved', applied: '08 May 2025' },
  { type: 'PL', from: '05 May 2025', to: '09 May 2025', days: 5, reason: 'Family Vacation', status: 'Approved', applied: '28 Apr 2025' },
  { type: 'SL', from: '22 Apr 2025', to: '23 Apr 2025', days: 2, reason: 'Fever & Cold', status: 'Approved', applied: '21 Apr 2025' },
  { type: 'WFH', from: '18 Apr 2025', to: '18 Apr 2025', days: 1, reason: 'Work from Home', status: 'Approved', applied: '17 Apr 2025' },
  { type: 'CL', from: '10 Apr 2025', to: '10 Apr 2025', days: 1, reason: 'Personal Work', status: 'Rejected', applied: '09 Apr 2025' },
  { type: 'PL', from: '01 Apr 2025', to: '03 Apr 2025', days: 3, reason: 'Family Function', status: 'Cancelled', applied: '27 Mar 2025' },
];

const historyTabs = ['All', 'Approved', 'Pending', 'Rejected', 'Cancelled'];

const leaveSummary = [
  { label: 'Total Entitlement', value: '44 Days', color: '#3b82f6' },
  { label: 'Taken', value: '16.5 Days', color: '#22c55e' },
  { label: 'Approved', value: '16.5 Days', color: '#8b5cf6' },
  { label: 'Pending', value: '0 Days', color: '#f59e0b' },
  { label: 'Balance', value: '27.5 Days', color: '#d4d4d8' },
];

const summaryChartData = [
  { name: 'Utilized', value: 37.5, color: '#2563eb' },
  { name: 'Remaining', value: 62.5, color: '#e4e4e7' },
];

const policyHighlights = [
  'Casual Leave cannot be availed for more than 2 days continuously.',
  'Please apply for leave at least 2 days in advance.',
  'Sick Leave requires upload of medical certificate if more than 2 days.',
  'Comp Off must be availed within 3 months from the date of credit.',
];

// ─────────────────────────────────────────────────────────────────────────────
// Small pieces
// ─────────────────────────────────────────────────────────────────────────────

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function BalanceCard({ b }: { b: (typeof leaveBalances)[number] }) {
  const Icon = b.icon;
  return (
    <Card className="p-2 min-w-0 flex flex-col justify-between">
      <div className="flex items-center gap-1.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${b.iconBg} ${b.iconColor}`}>
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap tracking-tight text-[11px] font-semibold text-zinc-600">{b.label}</p>
          <p className={`mt-1.5 text-[18px] font-bold leading-none ${b.valueColor}`}>{b.value}</p>
          <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500">Days Available</p>
        </div>
      </div>
      <div className="mt-1.5">
        <p className="mb-1.5 whitespace-nowrap text-[10.5px] font-semibold text-zinc-600">Taken: {b.taken}</p>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div className={`h-full rounded-full ${b.barColor}`} style={{ width: `${b.barPct}%` }} />
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [page, setPage] = useState(1);

  const filtered =
    activeTab === 'All' ? leaveHistory : leaveHistory.filter((l) => l.status === activeTab);

  return (
    <main className="mx-auto max-w-[1600px] space-y-1 pb-2 px-2 sm:px-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-zinc-400">
        <Link href="/company" className="hover:text-zinc-600">Dashboard</Link>
        <ChevronRight size={13} />
        <span className="font-[13px] text-zinc-800">Leave Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-1.5">
        <div>
          <h1 className="text-[26px] font-bold text-zinc-900">Leave Management</h1>
          <p className="mt-0.5 text-[13px] text-zinc-400">
            Apply for leave, view balances and track your leave requests.
          </p>
        </div>
        <Link
          href="/employee-apply-leave"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={12} /> Apply Leave
        </Link>
      </div>

      {/* Leave Balance */}
      <Card className="p-2 min-w-0">
        <h2 className="mb-1.5 text-[14px] font-bold text-zinc-900">My Leave Balance (as on 24 May 2025)</h2>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
          {leaveBalances.map((b) => (
            <BalanceCard key={b.key} b={b} />
          ))}
        </div>
      </Card>

      {/* History + right column */}
      <div className="grid w-full grid-cols-1 gap-1.5 xl:grid-cols-[1fr_340px]">
        {/* Leave History */}
        <Card className="min-w-0 p-2 h-fit">
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-zinc-900">Leave History</h2>
            <Link href="/company/leaves" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:text-blue-700">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mb-1.5 flex items-center gap-1.5 border-b border-zinc-100">
            {historyTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`relative pb-2.5 text-[13px] font-semibold transition-colors ${activeTab === tab ? 'text-blue-600' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="text-left text-[11.5px] font-semibold text-zinc-400">
                  <th className="py-2 pr-2 font-semibold">Leave Type</th>
                  <th className="py-2 pr-2 font-semibold">From Date</th>
                  <th className="py-2 pr-2 font-semibold">To Date</th>
                  <th className="py-2 pr-2 font-semibold">Days</th>
                  <th className="py-2 pr-2 font-semibold">Reason</th>
                  <th className="py-2 pr-2 font-semibold">Status</th>
                  <th className="py-2 pr-2 font-semibold">Applied On</th>
                  <th className="py-2 pr-0 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={i} className="border-t border-zinc-200 text-[12.5px]">
                    <td className="py-2 pr-2">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${TYPE_BADGE[row.type]}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{row.from}</td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{row.to}</td>
                    <td className="py-2 pr-2 text-zinc-600">{row.days}</td>
                    <td className="py-2 pr-2 text-zinc-600">{row.reason}</td>
                    <td className="py-2 pr-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{row.applied}</td>
                    <td className="py-2 pr-0 text-right">
                      <button className="text-zinc-400 hover:text-zinc-600">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[12px] text-zinc-400">
            <span>Showing 1 to {filtered.length} of 12 entries</span>
            <div className="flex items-center gap-1.5">
              <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(1)}
                className={`grid h-7 w-7 place-items-center rounded-md text-[12px] font-semibold ${page === 1 ? 'bg-blue-600 text-white' : 'border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
              >
                1
              </button>
              <button
                onClick={() => setPage(2)}
                className={`grid h-7 w-7 place-items-center rounded-md text-[12px] font-semibold ${page === 2 ? 'bg-blue-600 text-white' : 'border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                  }`}
              >
                2
              </button>
              <button className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </Card>

        {/* Right column */}
        <div className="min-w-0 space-y-1.5">
          {/* Upcoming Leaves */}
          <Card className="p-2">
            <h2 className="mb-1 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
              <Calendar size={16} className="text-blue-600" /> Upcoming Leaves
            </h2>
            <div className="flex flex-col items-center justify-center py-3 text-center">
              <span className="mb-1.5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-500">
                <Calendar size={28} />
              </span>
              <p className="text-[13px] font-bold text-zinc-800">No Upcoming Leaves</p>
              <p className="mt-1 text-[12px] text-zinc-400">You don&apos;t have any upcoming leaves.</p>
            </div>
          </Card>

          {/* Leave Summary */}
          <Card className="min-w-0 p-3">
            <h2 className="mb-2 text-[14px] font-bold text-zinc-900">Leave Summary (Year 2025)</h2>
            <div className="flex items-center gap-2">
              <div className="relative h-[130px] w-[130px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryChartData}
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={62}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {summaryChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-zinc-900">37.5%</span>
                  <span className="text-[9.5px] text-zinc-400">Utilized</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                {leaveSummary.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-zinc-500">
                      <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="truncate">{s.label}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-zinc-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid w-full grid-cols-1 gap-1.5 lg:grid-cols-[1fr_340px]">
        {/* Leave Policy Highlights */}
        <Card className="min-w-0 p-2">
          <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
            <ShieldCheck size={16} className="text-blue-600" /> Leave Policy Highlights
          </h2>
          <div className="space-y-1">
            {policyHighlights.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-[12.5px] text-zinc-600">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Need Help */}
        <Card className="min-w-0 p-2">
          <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
            <Headset size={16} className="text-blue-600" /> Need Help?
          </h2>
          <p className="text-[12.5px] text-zinc-500">
            For any leave related queries, please contact HR Department.
          </p>
          <Link
            href="/company/helpdesk"
            className="mt-1.5 inline-block rounded-lg border border-zinc-200 px-4 py-2 text-[12.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Contact HR
          </Link>
        </Card>
      </div>
    </main>
  );
}