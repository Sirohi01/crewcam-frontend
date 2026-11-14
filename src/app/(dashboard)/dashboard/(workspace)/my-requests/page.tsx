'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  FileText, CheckCircle2, Clock, XCircle, Undo2, Search,
  ChevronDown, Eye, ChevronLeft, ChevronRight,
  MessageCircleQuestion, Umbrella, Receipt, Headphones, UserCog,
  ArrowRight, Plus, Bell, Sparkles, Loader2, CalendarDays, MessageSquare,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RaiseTicketDialog } from '@/components/helpdesk/RaiseTicketDialog';
import { useMyRequests, useWithdrawRequest } from '@/hooks/useMyRequests';
import { MyRequest, REQUEST_KIND_LABEL, RequestKind, RequestStatus } from '@/services/myRequestsService';
import type { NewTicket } from '@/services/helpdeskService';

// ─────────────────────────────────────────────────────────────────────────
// Presentation maps
// ─────────────────────────────────────────────────────────────────────────

const KIND_STYLE: Record<RequestKind, { icon: React.ElementType; iconBg: string; typeStyle: string }> = {
  leave: { icon: CalendarDays, iconBg: 'bg-violet-50 text-violet-600', typeStyle: 'bg-violet-50 text-violet-600' },
  reimbursement: { icon: Receipt, iconBg: 'bg-amber-50 text-amber-600', typeStyle: 'bg-amber-50 text-amber-600' },
  'profile-change': { icon: UserCog, iconBg: 'bg-blue-50 text-blue-600', typeStyle: 'bg-blue-50 text-blue-600' },
  ticket: { icon: Headphones, iconBg: 'bg-emerald-50 text-emerald-600', typeStyle: 'bg-emerald-50 text-emerald-600' },
  query: { icon: MessageSquare, iconBg: 'bg-rose-50 text-rose-600', typeStyle: 'bg-rose-50 text-rose-600' },
};

const tabs = ['All Requests', 'In Progress', 'Approved', 'Rejected', 'Withdrawn'] as const;
type TabName = (typeof tabs)[number];

const INSIGHT_COLORS: Record<RequestStatus, string> = { Approved: '#22c55e', 'In Progress': '#3b82f6', Rejected: '#ef4444', Withdrawn: '#8b5cf6' };

const pct = (n: number, total: number) => (total ? `${Math.round((n / total) * 100)}% of total` : '—');
const PAGE_SIZES = [10, 20, 50];

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

function Card({ title, className = '', children }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header + breadcrumb
// ─────────────────────────────────────────────────────────────────────────

function PageHeader({ onRaise }: { onRaise: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
    <Breadcrumb
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Requests" },
  ]}
/>


        <h1 className="mt-1 text-[24px] font-bold text-zinc-900">My Requests</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">Track and manage all your requests in one place.</p>
      </div>
      <button onClick={onRaise} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
        <Plus size={14} /> Raise New Request
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

interface Stat { icon: React.ElementType; accent: string; label: string; value: number | string; detail: string; detailColor?: string }

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

function RequestsTableCard({ items, isLoading, onView }: { items: MyRequest[]; isLoading: boolean; onView: (r: MyRequest) => void }) {
  const [activeTab, setActiveTab] = useState<TabName>('All Requests');
  const [kind, setKind] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((r) =>
      (activeTab === 'All Requests' || r.status === activeTab) &&
      (!kind || r.kind === kind) &&
      (!q || r.title.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q)));
  }, [items, activeTab, kind, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
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
        <select
          value={kind}
          onChange={(e) => { setKind(e.target.value); setPage(1); }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50 focus:outline-none"
        >
          <option value="">All Request Types</option>
          {(Object.keys(REQUEST_KIND_LABEL) as RequestKind[]).map((k) => <option key={k} value={k}>{REQUEST_KIND_LABEL[k]}</option>)}
        </select>
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search requests..."
            className="w-full rounded-lg border border-zinc-200 py-2 pl-8 pr-3 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
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
            {isLoading && (
              <tr><td colSpan={6} className="py-6 text-center text-zinc-400"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-[12px] text-zinc-500">
                {items.length === 0 ? "You haven't made any requests yet." : 'No requests match these filters.'}
              </td></tr>
            )}
            {rows.map((r) => {
              const { cls, Icon } = statusBadge(r.status);
              const style = KIND_STYLE[r.kind];
              return (
                <tr key={`${r.kind}-${r.id}`} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${style.iconBg}`}>
                        <style.icon size={14} />
                      </span>
                      <div className="min-w-0 max-w-[200px] xl:max-w-[300px]">
                        <p className="truncate text-[11.5px] font-medium text-zinc-800">{r.title}</p>
                        <p className="truncate text-[10px] text-zinc-400">{REQUEST_KIND_LABEL[r.kind]} | {r.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${style.typeStyle}`}>
                      {REQUEST_KIND_LABEL[r.kind]}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
                      <Icon size={10} /> {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-zinc-500">{moment(r.requestedOn).format('DD MMM YYYY')}</td>
                  <td className="px-3 py-1.5">
                    <p className="text-[11px] text-zinc-500">{moment(r.updatedOn).format('DD MMM YYYY')}</p>
                    {r.decidedBy && <p className="text-[10px] text-zinc-400">by {r.decidedBy}</p>}
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onView(r)} title="View details" className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Eye size={12} />
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
        <p className="text-[11.5px] text-zinc-400">
          {filtered.length === 0 ? 'No requests' : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} requests`}
        </p>
        <div className="flex items-center gap-1.5">
          <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
            .map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`grid h-7 w-7 place-items-center rounded-lg text-[11.5px] font-semibold ${n === currentPage ? 'bg-blue-600 text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              >
                {n}
              </button>
            ))}
          <button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pl-2.5 pr-6 text-[11.5px] font-medium text-zinc-600 focus:outline-none"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-zinc-900">Stay Organized. Stay Ahead.</p>
            <p className="text-[11.5px] text-zinc-500">You&apos;re notified whenever a request is approved, rejected or resolved.</p>
          </div>
        </div>
        <Link href="/dashboard/notifications" className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <Bell size={14} /> View Updates
        </Link>
      </div>

    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function QuickActionsCard({ onTicket }: { onTicket: () => void }) {
  const actions = [
    { icon: Umbrella, accent: 'bg-amber-50 text-amber-600', title: 'Apply for Leave', detail: 'Request time off', href: '/employee-apply-leave' },
    { icon: Receipt, accent: 'bg-blue-50 text-blue-600', title: 'Raise Reimbursement', detail: 'Submit expense claim', href: '/dashboard/reimbursement' },
    { icon: Headphones, accent: 'bg-blue-50 text-blue-600', title: 'Raise Helpdesk Ticket', detail: 'IT, HR, finance or facility', onClick: onTicket },
    { icon: UserCog, accent: 'bg-blue-50 text-blue-600', title: 'Request Profile Change', detail: 'Name, PAN, bank account…', href: '/dashboard/my-profile-extension' },
  ];
  return (
    <Card title="Quick Actions">
      <div className="space-y-1">
        {actions.map((a) => {
          const body = (
            <>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.accent}`}>
                <a.icon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold leading-tight text-zinc-800">{a.title}</p>
                <p className="mt-0.5 text-[10.5px] leading-tight text-zinc-400">{a.detail}</p>
              </div>
            </>
          );
          const cls = 'flex w-full min-w-0 items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-zinc-50';
          return a.href
            ? <Link key={a.title} href={a.href} className={cls}>{body}</Link>
            : <button key={a.title} type="button" onClick={a.onClick} className={cls}>{body}</button>;
        })}
      </div>
    </Card>
  );
}

function RequestInsightsCard({ summary }: { summary?: { total: number; inProgress: number; approved: number; rejected: number; withdrawn: number } }) {
  const data = [
    { key: 'Approved' as const, value: summary?.approved ?? 0 },
    { key: 'In Progress' as const, value: summary?.inProgress ?? 0 },
    { key: 'Rejected' as const, value: summary?.rejected ?? 0 },
    { key: 'Withdrawn' as const, value: summary?.withdrawn ?? 0 },
  ];
  const total = summary?.total ?? 0;
  return (
    <Card title="Request Insights">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={total ? data : [{ key: 'none', value: 1 }]}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={total ? 2 : 0}
                stroke="none"
              >
                {(total ? data : [{ key: 'none' }]).map((d) => (
                  <Cell key={d.key} fill={d.key === 'none' ? '#e4e4e7' : INSIGHT_COLORS[d.key as RequestStatus]} />
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
          {data.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: INSIGHT_COLORS[d.key] }} />
                {d.key}
              </span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                {d.value} ({total ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function NeedHelpCard({ onContact }: { onContact: () => void }) {
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
      <button onClick={onContact} className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-blue-700">
        Contact HR
      </button>
    </Card>
  );
}

function RequestDetailDialog({ request, onClose }: { request: MyRequest | null; onClose: () => void }) {
  const withdraw = useWithdrawRequest();

  const doWithdraw = async () => {
    if (!request || !window.confirm('Withdraw this request? It will no longer be reviewed.')) return;
    try {
      await withdraw.mutateAsync(request);
      toast.success('Request withdrawn');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not withdraw the request');
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{request?.title}</DialogTitle>
        </DialogHeader>
        {request && (
          <div className="space-y-2 py-1 text-[12px] text-zinc-600">
            <div className="flex justify-between"><span>Reference</span><span className="font-medium text-zinc-800">{request.reference}</span></div>
            <div className="flex justify-between"><span>Type</span><span>{REQUEST_KIND_LABEL[request.kind]}</span></div>
            <div className="flex justify-between"><span>Status</span><span className={`rounded border px-2 py-0.5 text-[10px] font-medium ${statusBadge(request.status).cls}`}>{request.status}</span></div>
            <div className="flex justify-between"><span>Requested</span><span>{moment(request.requestedOn).format('DD MMM YYYY, hh:mm A')}</span></div>
            <div className="flex justify-between"><span>Last updated</span><span>{moment(request.updatedOn).format('DD MMM YYYY, hh:mm A')}{request.decidedBy ? ` · ${request.decidedBy}` : ''}</span></div>
            {request.note && <p className="whitespace-pre-wrap rounded-md bg-zinc-50 p-2 text-zinc-700">{request.note}</p>}
            <div className="flex items-center justify-between pt-1">
              <Link href={request.link} className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
                Open in {REQUEST_KIND_LABEL[request.kind]} <ArrowRight size={12} />
              </Link>
              {request.canWithdraw && (
                <button onClick={doWithdraw} disabled={withdraw.isPending} className="rounded-md border border-rose-200 px-3 py-1.5 text-[12px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60">
                  Withdraw
                </button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyRequests() {
  const { data, isLoading } = useMyRequests();
  const [viewing, setViewing] = useState<MyRequest | null>(null);
  const [ticket, setTicket] = useState<{ title: string; defaults?: Partial<NewTicket> } | null>(null);

  const s = data?.summary;
  const total = s?.total ?? 0;
  const summaryStats: Stat[] = [
    { icon: FileText, accent: 'bg-blue-50 text-blue-600', label: 'Total Requests', value: isLoading ? '…' : total, detail: 'All time' },
    { icon: CheckCircle2, accent: 'bg-emerald-50 text-emerald-600', label: 'Approved', value: isLoading ? '…' : s?.approved ?? 0, detail: pct(s?.approved ?? 0, total), detailColor: 'text-emerald-600' },
    { icon: Clock, accent: 'bg-amber-50 text-amber-500', label: 'In Progress', value: isLoading ? '…' : s?.inProgress ?? 0, detail: pct(s?.inProgress ?? 0, total), detailColor: 'text-amber-500' },
    { icon: XCircle, accent: 'bg-rose-50 text-rose-600', label: 'Rejected', value: isLoading ? '…' : s?.rejected ?? 0, detail: pct(s?.rejected ?? 0, total), detailColor: 'text-rose-600' },
    { icon: Undo2, accent: 'bg-violet-50 text-violet-600', label: 'Withdrawn', value: isLoading ? '…' : s?.withdrawn ?? 0, detail: pct(s?.withdrawn ?? 0, total), detailColor: 'text-violet-600' },
  ];

  return (
    <main className="mx-auto w-full space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader onRaise={() => setTicket({ title: 'Raise a new request' })} />

      {/* Row 1 — five summary stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — requests table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <RequestsTableCard items={data?.items ?? []} isLoading={isLoading} onView={setViewing} />
        </div>
        <div className="min-w-0 space-y-2">
          <QuickActionsCard onTicket={() => setTicket({ title: 'Raise a helpdesk ticket' })} />
          <RequestInsightsCard summary={s} />
          <NeedHelpCard onContact={() => setTicket({ title: 'Contact HR', defaults: { department: 'HR' } })} />
        </div>
      </div>

      <RequestDetailDialog request={viewing} onClose={() => setViewing(null)} />
      <RaiseTicketDialog open={!!ticket} onClose={() => setTicket(null)} title={ticket?.title} defaults={ticket?.defaults} />
    </main>
  );
}
