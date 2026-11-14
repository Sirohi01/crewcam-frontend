'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  Wallet, FileText, BadgeCheck, HandCoins, Medal, Search,
  Eye, Download, ChevronLeft, ChevronRight, MessageCircleQuestion, FilePlus2, ClipboardList,
  CreditCard, FileDown, ArrowRight, Loader2,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EXPENSE_TYPES, Expense, ExpenseType, expenseRef, getMyExpenses, submitExpense, withdrawExpense } from '@/services/expenseService';
import { uploadFile } from '@/services/uploadService';
import { currentFinancialYear, financialYearOf, inr } from '@/services/payslipService';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

// Imprest (cash-advance) accounts aren't modelled yet; they arrive with the finance
// ledger port (Phase 3). Claims below are live.
const IMPREST_SOON = 'Imprest accounts are coming soon. Reimbursement claims work today.';
const imprestSoon = () => toast(IMPREST_SOON, { icon: 'ℹ️' });

const tabs = ['My Requests', 'Pending Approval', 'Approved', 'Reimbursed', 'Rejected', 'Imprest History'] as const;
type Tab = (typeof tabs)[number];
const TAB_STATUS: Partial<Record<Tab, Expense['status']>> = {
  'Pending Approval': 'Pending',
  Approved: 'Approved',
  Reimbursed: 'Reimbursed',
  Rejected: 'Rejected',
};

const STATUS_LABEL: Record<Expense['status'], string> = {
  Pending: 'Pending Approval',
  Approved: 'Approved',
  Reimbursed: 'Reimbursed',
  Rejected: 'Rejected',
  Withdrawn: 'Withdrawn',
};
const STATUS_STYLE: Record<Expense['status'], string> = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-600',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  Reimbursed: 'border-violet-200 bg-violet-50 text-violet-600',
  Rejected: 'border-rose-200 bg-rose-50 text-rose-600',
  Withdrawn: 'border-zinc-200 bg-zinc-50 text-zinc-500',
};

const PAGE_SIZE = 10;

const steps = [
  { n: 1, accent: 'bg-blue-600', title: 'Submit Request', detail: 'Submit your claim with the bill attached' },
  { n: 2, accent: 'bg-emerald-600', title: 'Finance Review', detail: 'Finance reviews and approves or rejects it' },
  { n: 3, accent: 'bg-amber-500', title: 'Approved', detail: 'Approved claims are queued for payment' },
  { n: 4, accent: 'bg-violet-600', title: 'Reimbursed', detail: 'Amount credited to your bank account' },
];

const fmtDate = (d: string) => moment(d).format('DD MMM YYYY');

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  action?: string | React.ReactNode;
  onAction?: () => void;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
}

function Card({ title, action, onAction, className = '', children, titleExtra }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            {titleExtra}
            {action && (
              <button onClick={onAction} className="flex items-center gap-0.5 whitespace-nowrap text-[11px] font-semibold text-blue-600 hover:text-blue-700">
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

function PageHeader({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
      <Breadcrumb
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reimbursement (Imprest)" },
  ]}
/>
      <h1 className="mt-1 text-[24px] font-bold text-zinc-900">Reimbursement (Imprest)</h1>
      <p className="mt-0.5 text-[13px] text-zinc-400">Submit, track and manage your reimbursement requests.</p>
      </div>
      <button onClick={onNew} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
        <FilePlus2 size={14} /> Submit New Request
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

interface Stat {
  icon: React.ElementType;
  accent: string;
  label: string;
  value: string;
  detail: string;
  link?: string;
  onClick?: () => void;
}

function StatCard({ stat }: { stat: Stat }) {
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
      {stat.link && stat.onClick && (
        <button onClick={stat.onClick} className="mt-auto flex items-center gap-1 pt-1.5 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
          {stat.link} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Requests table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function RequestsTableCard({ expenses, isLoading, activeTab, onTab, onView }: {
  expenses: Expense[];
  isLoading: boolean;
  activeTab: Tab;
  onTab: (t: Tab) => void;
  onView: (e: Expense) => void;
}) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const status = TAB_STATUS[activeTab];
  const term = search.trim().toLowerCase();
  const filtered = expenses
    .filter((e) => !status || e.status === status)
    .filter((e) => !term || [expenseRef(e), e.type, e.description].some((v) => v.toLowerCase().includes(term)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { onTab(tab); setPage(1); }}
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

      {activeTab === 'Imprest History' ? (
        <p className="px-4 py-8 text-center text-[12px] text-zinc-500">{IMPREST_SOON}</p>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2">
            <div className="relative min-w-[200px] flex-1">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by reference, type or description..."
                className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
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
                {isLoading && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-[11.5px] text-zinc-400">Loading…</td></tr>
                )}
                {!isLoading && rows.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-[11.5px] text-zinc-500">
                    {expenses.length === 0 ? "You haven't submitted any reimbursement requests yet." : 'No requests match.'}
                  </td></tr>
                )}
                {rows.map((r) => (
                  <tr key={r._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                    <td className="px-3 py-1.5 text-[11px] font-medium text-zinc-700">{expenseRef(r)}</td>
                    <td className="px-3 py-1.5">
                      <p className="text-[11.5px] font-medium text-zinc-800">{r.type}</p>
                      <p className="max-w-[260px] truncate text-[10px] text-zinc-400" title={r.description}>{r.description}</p>
                    </td>
                    <td className="px-3 py-1.5 text-[11px] font-medium text-zinc-800">{r.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 text-[11px] text-zinc-500">{fmtDate(r.date)}</td>
                    <td className="px-3 py-1.5">
                      <p className="text-[11px] text-zinc-500">{fmtDate(r.createdAt)}</p>
                      <p className="text-[10px] text-zinc-400">{moment(r.createdAt).format('hh:mm A')}</p>
                    </td>
                    <td className="px-3 py-1.5">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <button aria-label={`View ${expenseRef(r)}`} onClick={() => onView(r)} className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                          <Eye size={12} />
                        </button>
                        {r.receiptUrl && (
                          <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer" aria-label={`Download receipt for ${expenseRef(r)}`} className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                            <Download size={12} />
                          </a>
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
            <p className="text-[11.5px] text-zinc-400">
              {filtered.length === 0 ? 'No requests' : `Showing ${(current - 1) * PAGE_SIZE + 1} to ${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length} requests`}
            </p>
            {pageCount > 1 && (
              <div className="flex items-center gap-1.5">
                <button aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={n === current ? 'grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white' : 'grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50'}>
                    {n}
                  </button>
                ))}
                <button aria-label="Next page" disabled={current === pageCount} onClick={() => setPage(current + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
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
        <Link href="/dashboard/helpdesk" className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <MessageCircleQuestion size={14} /> Contact Support
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function ImprestBalanceCard() {
  return (
    <Card title="My Imprest Balance">
      <p className="text-[12px] text-zinc-500">{IMPREST_SOON}</p>
      <button onClick={imprestSoon} className="mt-3 w-full rounded-lg border border-zinc-200 py-2 text-[12px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-50">
        Request Imprest Top-up
      </button>
    </Card>
  );
}

function ReimbursementSummaryCard({ expenses }: { expenses: Expense[] }) {
  const fy = currentFinancialYear();
  const inYear = expenses.filter((e) => financialYearOf({ month: moment(e.date).month() + 1, year: moment(e.date).year() }) === fy);
  const total = inYear.reduce((sum, e) => sum + e.amount, 0);
  const sumOf = (...statuses: Expense['status'][]) => inYear.filter((e) => statuses.includes(e.status)).reduce((sum, e) => sum + e.amount, 0);
  const breakdown = [
    { key: 'Approved / Paid', value: sumOf('Approved', 'Reimbursed'), color: '#22c55e' },
    { key: 'Pending', value: sumOf('Pending'), color: '#f59e0b' },
    { key: 'Rejected', value: sumOf('Rejected'), color: '#ef4444' },
  ];
  const share = (v: number) => (total > 0 ? `${Math.round((v / total) * 100)}%` : '0%');
  return (
    <Card title="Reimbursement Summary" titleExtra={<span className="text-[10.5px] font-medium text-zinc-400">(FY {fy})</span>}>
      {total === 0 ? (
        <p className="py-3 text-center text-[11.5px] text-zinc-500">No claims this financial year yet.</p>
      ) : (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-24 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="key" innerRadius={32} outerRadius={46} startAngle={90} endAngle={-270} paddingAngle={2} stroke="none">
                  {breakdown.map((d) => <Cell key={d.key} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10.5px] font-bold text-zinc-900">{inr(total)}</span>
              <span className="text-[9px] text-zinc-400">Total</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            {breakdown.map((d) => (
              <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.key}
                </span>
                <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                  {inr(d.value)} ({share(d.value)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function QuickActionsCard({ onNew, onMyRequests }: { onNew: () => void; onMyRequests: () => void }) {
  const actions = [
    { icon: FilePlus2, accent: 'bg-blue-50 text-blue-600', title: 'Submit New Request', detail: 'Raise a new reimbursement', onClick: onNew },
    { icon: ClipboardList, accent: 'bg-emerald-50 text-emerald-600', title: 'My Requests', detail: 'View all my requests', onClick: onMyRequests },
    { icon: CreditCard, accent: 'bg-amber-50 text-amber-600', title: 'Imprest Details', detail: 'Coming soon', onClick: imprestSoon },
    { icon: FileDown, accent: 'bg-violet-50 text-violet-600', title: 'Reimbursement Policy', detail: 'Ask HR for the current policy', onClick: () => toast('Contact HR for your company\'s reimbursement policy.', { icon: 'ℹ️' }) },
  ];
  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a) => (
          <button
            key={a.title}
            onClick={a.onClick}
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

function NewRequestDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<ExpenseType | ''>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: submitExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'expenses'] });
      toast.success('Reimbursement request submitted');
      setType(''); setAmount(''); setDate(''); setDescription(''); setFile(null);
      onClose();
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!type || !amount || !date || !description.trim()) return setError('Type, amount, date and description are required.');
    if (!(Number(amount) > 0)) return setError('Amount must be greater than zero.');
    if (moment(date).isAfter(moment(), 'day')) return setError('The expense date cannot be in the future.');
    if (file && file.size > 5 * 1024 * 1024) return setError('Receipt must be 5 MB or smaller.');
    try {
      let receiptUrl: string | undefined;
      if (file) {
        setUploading(true);
        receiptUrl = await uploadFile(file);
        setUploading(false);
      }
      await mutation.mutateAsync({ type, amount: Number(amount), date, description: description.trim(), receiptUrl });
    } catch (err: any) {
      setUploading(false);
      setError(err?.response?.data?.message || 'Could not submit the request.');
    }
  };

  const busy = uploading || mutation.isPending;
  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500';

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !busy && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Submit Reimbursement Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3 py-1">
          <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Expense Type *
            <select value={type} onChange={(e) => setType(e.target.value as ExpenseType)} className={input}>
              <option value="">Select…</option>
              {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Amount (₹) *
            <input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className={input} />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Date of Expense *
            <input type="date" max={moment().format('YYYY-MM-DD')} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Description *
            <textarea rows={3} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Cab to client meeting, Noida to Gurugram" className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-blue-500" />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Receipt / Bill (PDF, JPG, PNG — max 5 MB)
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[11px]" />
          </label>
          {error && <p className="col-span-2 text-[11px] text-rose-500">{error}</p>}
          <div className="col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} disabled={busy} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
            <button type="submit" disabled={busy} className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {busy && <Loader2 size={13} className="animate-spin" />} {uploading ? 'Uploading…' : 'Submit'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Pending claims can be pulled back by the employee before Finance decides. */
function WithdrawClaimButton({ id, onDone }: { id: string; onDone: () => void }) {
  const queryClient = useQueryClient();
  const withdraw = useMutation({
    mutationFn: withdrawExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'requests'] });
      toast.success('Claim withdrawn');
      onDone();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not withdraw the claim'),
  });
  return (
    <div className="flex justify-end pt-1">
      <button
        type="button"
        disabled={withdraw.isPending}
        onClick={() => window.confirm('Withdraw this claim? Finance will no longer review it.') && withdraw.mutate(id)}
        className="rounded-md border border-rose-200 px-3 py-1.5 text-[12px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
      >
        Withdraw claim
      </button>
    </div>
  );
}

function RequestDetailDialog({ expense, onClose }: { expense: Expense | null; onClose: () => void }) {
  return (
    <Dialog open={!!expense} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{expense && expenseRef(expense)}</DialogTitle>
        </DialogHeader>
        {expense && (
          <div className="space-y-2 py-1 text-[12px] text-zinc-600">
            <div className="flex justify-between"><span>Type</span><span className="font-medium text-zinc-800">{expense.type}</span></div>
            <div className="flex justify-between"><span>Amount</span><span className="font-medium text-zinc-800">{inr(expense.amount)}</span></div>
            <div className="flex justify-between"><span>Date of expense</span><span>{fmtDate(expense.date)}</span></div>
            <div className="flex justify-between"><span>Submitted</span><span>{moment(expense.createdAt).format('DD MMM YYYY, hh:mm A')}</span></div>
            <div className="flex justify-between"><span>Status</span><span className={`rounded border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[expense.status]}`}>{STATUS_LABEL[expense.status]}</span></div>
            <p className="rounded-md bg-zinc-50 p-2 text-zinc-700">{expense.description}</p>
            {expense.approverComments && <p className="rounded-md bg-amber-50 p-2 text-amber-800">Reviewer: {expense.approverComments}</p>}
            {expense.receiptUrl && (
              <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
                <Download size={13} /> View receipt
              </a>
            )}
            {expense.status === 'Pending' && <WithdrawClaimButton id={expense._id} onDone={onClose} />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function ReimbursementImprest() {
  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['me', 'expenses'], queryFn: getMyExpenses });
  const [activeTab, setActiveTab] = useState<Tab>('My Requests');
  const [newOpen, setNewOpen] = useState(false);
  const [viewing, setViewing] = useState<Expense | null>(null);

  const summaryStats: Stat[] = useMemo(() => {
    const sum = (list: Expense[]) => list.reduce((acc, e) => acc + e.amount, 0);
    const pending = expenses.filter((e) => e.status === 'Pending');
    const startOfMonth = moment().startOf('month');
    const approvedThisMonth = expenses.filter((e) => (e.status === 'Approved' || e.status === 'Reimbursed') && moment(e.updatedAt).isSameOrAfter(startOfMonth));
    const fy = currentFinancialYear();
    const reimbursedFy = expenses.filter((e) => e.status === 'Reimbursed' && financialYearOf({ month: moment(e.updatedAt).month() + 1, year: moment(e.updatedAt).year() }) === fy);
    // Turnaround = submission to decision, for requests that have been decided.
    const decided = expenses.filter((e) => e.status !== 'Pending');
    const avgDays = decided.length ? decided.reduce((acc, e) => acc + moment(e.updatedAt).diff(moment(e.createdAt), 'hours') / 24, 0) / decided.length : null;
    return [
      { icon: Wallet, accent: 'bg-blue-50 text-blue-600', label: 'My Imprest Balance', value: '—', detail: 'Coming soon', link: 'Learn more', onClick: imprestSoon },
      { icon: FileText, accent: 'bg-emerald-50 text-emerald-600', label: 'Pending Requests', value: inr(sum(pending)), detail: `${pending.length} request${pending.length === 1 ? '' : 's'} pending`, link: 'View pending', onClick: () => setActiveTab('Pending Approval') },
      { icon: BadgeCheck, accent: 'bg-amber-50 text-amber-500', label: 'Approved (This Month)', value: inr(sum(approvedThisMonth)), detail: `${approvedThisMonth.length} request${approvedThisMonth.length === 1 ? '' : 's'} approved`, link: 'View approved', onClick: () => setActiveTab('Approved') },
      { icon: HandCoins, accent: 'bg-violet-50 text-violet-600', label: `Total Reimbursed (FY ${fy})`, value: inr(sum(reimbursedFy)), detail: 'Paid out this financial year', link: 'View reimbursed', onClick: () => setActiveTab('Reimbursed') },
      { icon: Medal, accent: 'bg-sky-50 text-sky-600', label: 'Average Turnaround Time', value: avgDays === null ? '—' : `${avgDays.toFixed(1)} Days`, detail: decided.length ? `Across ${decided.length} decided request${decided.length === 1 ? '' : 's'}` : 'No decisions yet' },
    ];
  }, [expenses]);

  return (
    <main className="mx-auto w-full space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader onNew={() => setNewOpen(true)} />

      {/* Row 1 — five summary stat cards, all footer links aligned to the same baseline */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — requests table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <RequestsTableCard expenses={expenses} isLoading={isLoading} activeTab={activeTab} onTab={setActiveTab} onView={setViewing} />
          <HowItWorksCard />
        </div>
        <div className="min-w-0 space-y-2">
          <ImprestBalanceCard />
          <ReimbursementSummaryCard expenses={expenses} />
          <QuickActionsCard onNew={() => setNewOpen(true)} onMyRequests={() => setActiveTab('My Requests')} />
        </div>
      </div>

      <NewRequestDialog open={newOpen} onClose={() => setNewOpen(false)} />
      <RequestDetailDialog expense={viewing} onClose={() => setViewing(null)} />
    </main>
  );
}
