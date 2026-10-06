'use client';

import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  FileText, CheckCircle2, Clock, XCircle, Undo2, Search, Filter,
  ChevronDown, Eye, MoreVertical, ChevronLeft, ChevronRight,
  MessageCircleQuestion, Umbrella, Receipt, Home, Plane, Calendar,
  Monitor, ArrowRight, Plus, History, SlidersHorizontal, Sparkles,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

const summaryStats = [
  {
    icon: FileText,
    accent: 'bg-blue-50 text-blue-600',
    label: 'Total Requests',
    value: '24',
    detail: 'All time',
  },
  {
    icon: CheckCircle2,
    accent: 'bg-emerald-50 text-emerald-600',
    label: 'Approved',
    value: '14',
    detail: '58% of total',
    detailColor: 'text-emerald-600',
  },
  {
    icon: Clock,
    accent: 'bg-amber-50 text-amber-500',
    label: 'In Progress',
    value: '5',
    detail: '21% of total',
    detailColor: 'text-amber-500',
  },
  {
    icon: XCircle,
    accent: 'bg-rose-50 text-rose-600',
    label: 'Rejected',
    value: '2',
    detail: '8% of total',
    detailColor: 'text-rose-600',
  },
  {
    icon: Undo2,
    accent: 'bg-violet-50 text-violet-600',
    label: 'Withdrawn',
    value: '3',
    detail: '13% of total',
    detailColor: 'text-violet-600',
  },
];

const tabs = ['All Requests', 'In Progress', 'Approved', 'Rejected', 'Withdrawn'];

const requests = [
  {
    id: 'REQ-TR-2024-0156', icon: Plane, iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'Business Travel to Mumbai', sub: 'Travel Request | REQ-TR-2024-0156',
    type: 'Travel', typeStyle: 'bg-emerald-50 text-emerald-600',
    status: 'Approved', requestedOn: '20 May 2024', updated: '22 May 2024', updatedBy: 'by Ankit Sharma',
  },
  {
    id: 'REQ-RB-2024-0142', icon: Receipt, iconBg: 'bg-amber-50 text-amber-600',
    title: 'Laptop Purchase Reimbursement', sub: 'Reimbursement | REQ-RB-2024-0142',
    type: 'Reimbursement', typeStyle: 'bg-amber-50 text-amber-600',
    status: 'In Progress', requestedOn: '18 May 2024', updated: '21 May 2024', updatedBy: 'by Finance Team',
  },
  {
    id: 'REQ-LV-2024-0088', icon: Calendar, iconBg: 'bg-violet-50 text-violet-600',
    title: 'Casual Leave (2 Days)', sub: 'Leave Request | REQ-LV-2024-0088',
    type: 'Leave', typeStyle: 'bg-violet-50 text-violet-600',
    status: 'Approved', requestedOn: '17 May 2024', updated: '17 May 2024', updatedBy: 'by Neha Verma',
  },
  {
    id: 'REQ-WFH-2024-0075', icon: Monitor, iconBg: 'bg-blue-50 text-blue-600',
    title: 'Work From Home Request', sub: 'WFO Request | REQ-WFH-2024-0075',
    type: 'Work From Home', typeStyle: 'bg-blue-50 text-blue-600',
    status: 'In Progress', requestedOn: '16 May 2024', updated: '20 May 2024', updatedBy: 'by Manager',
  },
  {
    id: 'REQ-LV-2024-0072', icon: Calendar, iconBg: 'bg-rose-50 text-rose-600',
    title: 'Earned Leave (5 Days)', sub: 'Leave Request | REQ-LV-2024-0072',
    type: 'Leave', typeStyle: 'bg-violet-50 text-violet-600',
    status: 'Rejected', requestedOn: '14 May 2024', updated: '15 May 2024', updatedBy: 'by Rohan Mehta',
  },
  {
    id: 'REQ-SA-2024-0045', icon: FileText, iconBg: 'bg-amber-50 text-amber-600',
    title: 'Advance Salary Request', sub: 'Salary Advance | REQ-SA-2024-0045',
    type: 'Salary Advance', typeStyle: 'bg-amber-50 text-amber-600',
    status: 'Withdrawn', requestedOn: '10 May 2024', updated: '11 May 2024', updatedBy: 'by Rohan Mehta',
  },
];

const requestInsights = [
  { key: 'Approved', value: 14, pct: '58%', color: '#22c55e' },
  { key: 'In Progress', value: 5, pct: '21%', color: '#3b82f6' },
  { key: 'Rejected', value: 2, pct: '8%', color: '#ef4444' },
  { key: 'Withdrawn', value: 3, pct: '13%', color: '#8b5cf6' },
];

const quickActions = [
  { icon: Umbrella, accent: 'bg-amber-50 text-amber-600', title: 'Apply for Leave', detail: 'Request time off' },
  { icon: Receipt, accent: 'bg-blue-50 text-blue-600', title: 'Raise Reimbursement', detail: 'Submit expense claim' },
  { icon: Home, accent: 'bg-blue-50 text-blue-600', title: 'Request Work From Home', detail: 'Work remotely' },
  { icon: Plane, accent: 'bg-blue-50 text-blue-600', title: 'Raise Travel Request', detail: 'Request official travel' },
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
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-1.5 text-[12px] text-zinc-400">
          <span className="text-zinc-400">Dashboard</span>
          <span>›</span>
          <span className="font-semibold text-zinc-700">My Requests</span>
        </p>
        <h1 className="mt-1 text-[24px] font-bold text-zinc-900">My Requests</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">Track and manage all your requests in one place.</p>
      </div>
      <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
        <Plus size={14} /> Raise New Request
      </button>
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
      <p className={`mt-2 text-[11.5px] font-medium ${stat.detailColor ?? 'text-zinc-400'}`}>{stat.detail}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Requests table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  if (status === 'Approved') {
    return { cls: 'border-emerald-200 bg-emerald-50 text-emerald-600', Icon: CheckCircle2 };
  }
  if (status === 'In Progress') {
    return { cls: 'border-blue-200 bg-blue-50 text-blue-600', Icon: Clock };
  }
  if (status === 'Rejected') {
    return { cls: 'border-rose-200 bg-rose-50 text-rose-600', Icon: XCircle };
  }
  return { cls: 'border-zinc-200 bg-zinc-50 text-zinc-500', Icon: Undo2 };
}

function RequestsTableCard() {
  const [activeTab, setActiveTab] = useState('All Requests');

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap pb-2.5 text-[12.5px] font-semibold transition-colors ${activeTab === tab
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
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
          <Filter size={13} /> All Request Types <ChevronDown size={12} />
        </button>
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* Table — contained scroll region only; does not affect page width */}
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-zinc-100 bg-white">
              {['Request Details', 'Request Type', 'Status', 'Requested On', 'Last Updated', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              const { cls, Icon } = statusBadge(r.status);
              return (
                <tr key={r.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${r.iconBg}`}>
                        <r.icon size={14} />
                      </span>
                      <div className="min-w-0 max-w-[200px] xl:max-w-[300px]">
                        <p className="truncate text-[11.5px] font-medium text-zinc-800">{r.title}</p>
                        <p className="truncate text-[10px] text-zinc-400">{r.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${r.typeStyle}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
                      <Icon size={10} /> {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-zinc-500">{r.requestedOn}</td>
                  <td className="px-3 py-1.5">
                    <p className="text-[11px] text-zinc-500">{r.updated}</p>
                    <p className="text-[10px] text-zinc-400">{r.updatedBy}</p>
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Eye size={12} />
                      </button>
                      <button className="grid h-6 w-6 place-items-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-[11.5px] text-zinc-400">Showing 1 to 6 of 24 requests</p>
        <div className="flex items-center gap-1.5">
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronLeft size={14} />
          </button>
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white">1</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">2</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">3</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">4</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-600">
          10 / page <ChevronDown size={12} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-zinc-900">Stay Organized. Stay Ahead.</p>
            <p className="text-[11.5px] text-zinc-500">Track all your requests, get timely updates and stay informed.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <History size={14} /> View Request History
        </button>
      </div>

    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function QuickActionsCard() {
  return (
    <Card title="Quick Actions">
      <div className="space-y-1">
        {quickActions.map((a) => (
          <button
            key={a.title}
            className="flex w-full min-w-0 items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-zinc-50"
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.accent}`}>
              <a.icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-tight text-zinc-800">{a.title}</p>
              <p className="mt-0.5 text-[10.5px] leading-tight text-zinc-400">{a.detail}</p>
            </div>
          </button>
        ))}
      </div>
      <button className="mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View All Request Types <ArrowRight size={12} />
      </button>
    </Card>
  );
}

function RequestInsightsCard() {
  const total = requestInsights.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card title="Request Insights">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={requestInsights}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {requestInsights.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-bold text-zinc-900">{total}</span>
            <span className="text-[9px] text-zinc-400">Total</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {requestInsights.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.key}
              </span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                {d.value} ({d.pct})
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View Insights Report <ArrowRight size={12} />
      </button>
    </Card>
  );
}

function NeedHelpCard() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600">
          <MessageCircleQuestion size={16} />
        </span>
        <div className="min-w-0">
          <h4 className="text-[12.5px] font-semibold text-zinc-900">Need Help?</h4>
          <p className="mt-1 text-[11.5px] leading-snug text-zinc-500">
            For any issues related to your requests, contact HR Support.
          </p>
        </div>
      </div>
      <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-blue-700">
        Contact HR
      </button>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyRequests() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader />

      {/* Row 1 — five summary stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — requests table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <RequestsTableCard />
        </div>
        <div className="min-w-0 space-y-2">
          <QuickActionsCard />
          <RequestInsightsCard />
          <NeedHelpCard />
        </div>
      </div>
    </main>
  );
}