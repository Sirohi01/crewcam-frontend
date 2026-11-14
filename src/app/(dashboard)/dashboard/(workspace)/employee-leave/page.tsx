'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
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
  ChevronLeft,
} from 'lucide-react';
import { useMyLeaveBalances, useMyLeaveRequests } from '@/hooks/useMyLeave';
import { requestDays, type LeaveBalance } from '@/services/leaveService';

// ─────────────────────────────────────────────────────────────────────────────
// Styling — the original card palette, applied to the company's leave types in order
// ─────────────────────────────────────────────────────────────────────────────

const PALETTE = [
  { icon: TreePine, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', valueColor: 'text-emerald-500', barColor: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
  { icon: Plane, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', valueColor: 'text-blue-600', barColor: 'bg-blue-600', badge: 'bg-blue-50 text-blue-600' },
  { icon: HeartPulse, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', valueColor: 'text-orange-500', barColor: 'bg-orange-500', badge: 'bg-orange-50 text-orange-600' },
  { icon: Home, iconBg: 'bg-violet-50', iconColor: 'text-violet-500', valueColor: 'text-violet-600', barColor: 'bg-violet-600', badge: 'bg-violet-50 text-violet-600' },
  { icon: Clock, iconBg: 'bg-zinc-100', iconColor: 'text-zinc-500', valueColor: 'text-zinc-800', barColor: 'bg-zinc-700', badge: 'bg-zinc-100 text-zinc-600' },
];
const styleAt = (i: number) => PALETTE[i % PALETTE.length];

const STATUS_BADGE: Record<string, string> = {
  Approved: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Rejected: 'bg-rose-50 text-rose-600',
  Cancelled: 'bg-zinc-100 text-zinc-500',
};

const historyTabs = ['All', 'Approved', 'Pending', 'Rejected'] as const;
const PAGE_SIZE = 6;

/** "Casual Leave" -> "CL", used for the compact type badge. */
const abbreviation = (name?: string) =>
  (name || '?').split(/\s+/).filter(Boolean).map((w) => w[0]?.toUpperCase()).join('').slice(0, 4);

const fmt = (d: string) => moment(d).format('DD MMM YYYY');
const daysLabel = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} Day${n === 1 ? '' : 's'}`;

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

function BalanceCard({ b, index }: { b: LeaveBalance; index: number }) {
  const style = styleAt(index);
  const Icon = style.icon;
  const entitlement = b.defaultDays + b.creditedDays;
  const pct = entitlement > 0 ? Math.min(100, (b.takenThisYear / entitlement) * 100) : 0;
  return (
    <Card className="p-2 min-w-0 flex flex-col justify-between">
      <div className="flex items-center gap-1.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${style.iconBg} ${style.iconColor}`}>
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate tracking-tight text-[11px] font-semibold text-zinc-600" title={b.leaveTypeName}>
            {b.leaveTypeName} ({abbreviation(b.leaveTypeName)})
          </p>
          <p className={`mt-1.5 text-[18px] font-bold leading-none ${style.valueColor}`}>{Math.max(0, b.balance)}</p>
          <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-zinc-500">Days Available</p>
        </div>
      </div>
      <div className="mt-1.5">
        <p className="mb-1.5 whitespace-nowrap text-[10.5px] font-semibold text-zinc-600">
          Taken: {b.takenThisYear} / {entitlement} Days{b.pendingDays > 0 && <span className="text-amber-600"> · {b.pendingDays} pending</span>}
        </p>
        <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
          <div className={`h-full rounded-full ${style.barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<(typeof historyTabs)[number]>('All');
  const [page, setPage] = useState(1);
  const { data: balances = [], isLoading: balancesLoading } = useMyLeaveBalances();
  const { data: requests = [], isLoading: requestsLoading } = useMyLeaveRequests();

  // Type badge colour follows the type's position in the balance cards.
  const typeStyle = useMemo(() => {
    const map = new Map<string, string>();
    balances.forEach((b, i) => map.set(String(b.leaveTypeId), styleAt(i).badge));
    return map;
  }, [balances]);

  const filtered = activeTab === 'All' ? requests : requests.filter((l) => l.status === activeTab);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const today = moment().startOf('day');
  const upcoming = requests
    .filter((r) => (r.status === 'Pending' || r.status === 'Approved') && moment(r.endDate).isSameOrAfter(today))
    .sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf())
    .slice(0, 3);

  const summary = useMemo(() => {
    const entitlement = balances.reduce((s, b) => s + b.defaultDays + b.creditedDays, 0);
    const taken = balances.reduce((s, b) => s + b.takenThisYear, 0);
    const pending = balances.reduce((s, b) => s + b.pendingDays, 0);
    const balance = Math.max(0, entitlement - taken);
    const utilized = entitlement > 0 ? Math.round((taken / entitlement) * 1000) / 10 : 0;
    return { entitlement, taken, pending, balance, utilized };
  }, [balances]);

  const leaveSummary = [
    { label: 'Total Entitlement', value: daysLabel(summary.entitlement), color: '#3b82f6' },
    { label: 'Taken (Approved)', value: daysLabel(summary.taken), color: '#22c55e' },
    { label: 'Pending', value: daysLabel(summary.pending), color: '#f59e0b' },
    { label: 'Balance', value: daysLabel(summary.balance), color: '#d4d4d8' },
  ];
  const summaryChartData = [
    { name: 'Utilized', value: summary.utilized, color: '#2563eb' },
    { name: 'Remaining', value: Math.max(0, 100 - summary.utilized), color: '#e4e4e7' },
  ];

  return (
    <main className=" space-y-1 pb-2 px-2 sm:px-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-zinc-400">
        <Link href="/dashboard" className="hover:text-zinc-600">Dashboard</Link>
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
        <h2 className="mb-1.5 text-[14px] font-bold text-zinc-900">My Leave Balance (as on {moment().format('DD MMM YYYY')})</h2>
        {balancesLoading ? (
          <p className="py-4 text-center text-[12px] text-zinc-400">Loading…</p>
        ) : balances.length === 0 ? (
          <p className="py-4 text-center text-[12px] text-zinc-500">No leave types are set up for your company yet. Please contact HR.</p>
        ) : (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
            {balances.map((b, i) => (
              <BalanceCard key={String(b.leaveTypeId)} b={b} index={i} />
            ))}
          </div>
        )}
      </Card>

      {/* History + right column */}
      <div className="grid w-full grid-cols-1 gap-1.5 xl:grid-cols-[1fr_340px]">
        {/* Leave History */}
        <Card className="min-w-0 p-2 h-fit">
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-zinc-900">Leave History</h2>
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
                </tr>
              </thead>
              <tbody>
                {requestsLoading && (
                  <tr><td colSpan={7} className="py-4 text-center text-[12px] text-zinc-400">Loading…</td></tr>
                )}
                {!requestsLoading && pageRows.length === 0 && (
                  <tr><td colSpan={7} className="py-4 text-center text-[12px] text-zinc-500">
                    {activeTab === 'All' ? "You haven't applied for any leave yet." : `No ${activeTab.toLowerCase()} requests.`}
                  </td></tr>
                )}
                {pageRows.map((row) => (
                  <tr key={row._id} className="border-t border-zinc-200 text-[12.5px]">
                    <td className="py-2 pr-2">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${typeStyle.get(String(row.leaveTypeId?._id)) || 'bg-zinc-100 text-zinc-600'}`}
                        title={row.leaveTypeId?.name}
                      >
                        {abbreviation(row.leaveTypeId?.name)}
                      </span>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{fmt(row.startDate)}</td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{fmt(row.endDate)}</td>
                    <td className="py-2 pr-2 text-zinc-600">
                      {requestDays(row)}{row.isHalfDay && <span className="text-zinc-400"> ({row.halfDaySession === 'first' ? '1st' : '2nd'} half)</span>}
                    </td>
                    <td className="py-2 pr-2 text-zinc-600 max-w-[220px] truncate" title={row.rejectionReason ? `${row.reason} — Rejected: ${row.rejectionReason}` : row.reason}>{row.reason}</td>
                    <td className="py-2 pr-2">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-zinc-600">{fmt(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[12px] text-zinc-400">
            <span>
              {filtered.length === 0
                ? 'No entries'
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} entries`}
            </span>
            {pageCount > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`grid h-7 w-7 place-items-center rounded-md text-[12px] font-semibold ${currentPage === n ? 'bg-blue-600 text-white' : 'border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  aria-label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="grid h-7 w-7 place-items-center rounded-md border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Right column */}
        <div className="min-w-0 space-y-1.5">
          {/* Upcoming Leaves */}
          <Card className="p-2">
            <h2 className="mb-1 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
              <Calendar size={16} className="text-blue-600" /> Upcoming Leaves
            </h2>
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-3 text-center">
                <span className="mb-1.5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-500">
                  <Calendar size={28} />
                </span>
                <p className="text-[13px] font-bold text-zinc-800">No Upcoming Leaves</p>
                <p className="mt-1 text-[12px] text-zinc-400">You don&apos;t have any upcoming leaves.</p>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                {upcoming.map((r) => (
                  <div key={r._id} className="flex items-center justify-between gap-2 rounded-lg border border-zinc-100 px-2 py-1.5">
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-zinc-800">{r.leaveTypeId?.name || 'Leave'}</p>
                      <p className="text-[11px] text-zinc-500">
                        {fmt(r.startDate)}{r.startDate.slice(0, 10) !== r.endDate.slice(0, 10) && ` – ${fmt(r.endDate)}`} · {daysLabel(requestDays(r))}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Leave Summary */}
          <Card className="min-w-0 p-3">
            <h2 className="mb-2 text-[14px] font-bold text-zinc-900">Leave Summary (Year {moment().year()})</h2>
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
                      {summaryChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-zinc-900">{summary.utilized}%</span>
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
        {/* Leave Policy Highlights — the company's configured entitlements */}
        <Card className="min-w-0 p-2">
          <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
            <ShieldCheck size={16} className="text-blue-600" /> Leave Policy Highlights
          </h2>
          <div className="space-y-1">
            {balances.length === 0 && <p className="text-[12.5px] text-zinc-500">Your company&apos;s leave policy will appear here once HR sets up leave types.</p>}
            {balances.map((b) => (
              <div key={String(b.leaveTypeId)} className="flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-[12.5px] text-zinc-600">
                  {b.leaveTypeName}: {b.defaultDays} days per year{b.creditedDays > 0 && `, plus ${b.creditedDays} credited to you`}.
                </span>
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
            href="/dashboard/helpdesk"
            className="mt-1.5 inline-block rounded-lg border border-zinc-200 px-4 py-2 text-[12.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Contact HR
          </Link>
        </Card>
      </div>
    </main>
  );
}
