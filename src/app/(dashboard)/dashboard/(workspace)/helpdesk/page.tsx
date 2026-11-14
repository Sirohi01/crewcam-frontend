'use client';

import React, { useMemo, useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
  Ticket,
  Wallet,
  Clock,
  CheckCircle2,
  Timer,
  Search,
  Eye,
  Plus,
  FileText,
  ChevronRight,
  Headphones,
  Laptop,
  Building2,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Shield,
  Star,
  ChevronDown,
  BookOpen,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RaiseTicketDialog } from '@/components/helpdesk/RaiseTicketDialog';
import { useMyTickets, useRateTicket } from '@/hooks/useMyTickets';
import { MyTicket, TICKET_CATEGORY_LABEL, TICKET_STATUS_LABEL, TicketStatus } from '@/services/helpdeskService';

const CATEGORY_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  IT: { icon: Laptop, color: 'text-blue-600 bg-blue-50' },
  HR: { icon: User, color: 'text-cyan-500 bg-cyan-50' },
  Finance: { icon: Wallet, color: 'text-emerald-600 bg-emerald-50' },
  Facility: { icon: Building2, color: 'text-orange-500 bg-orange-50' },
  Other: { icon: Ticket, color: 'text-purple-600 bg-purple-50' },
};

const PRIORITY_STYLE: Record<string, { icon: React.ElementType; color: string }> = {
  Urgent: { icon: Zap, color: 'text-red-600 bg-red-50 border-red-100' },
  High: { icon: ArrowUp, color: 'text-red-600 bg-red-50 border-red-100' },
  Medium: { icon: Minus, color: 'text-orange-500 bg-orange-50 border-orange-100' },
  Low: { icon: ArrowDown, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
};

const STATUS_STYLE: Record<TicketStatus, string> = {
  Open: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  In_Progress: 'text-blue-600 bg-blue-50 border-blue-200',
  Resolved: 'text-purple-600 bg-purple-50 border-purple-200',
  Closed: 'text-zinc-600 bg-zinc-50 border-zinc-200',
};

type Tab = 'all' | TicketStatus;
const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'My Tickets' },
  { id: 'Open', label: 'Open' },
  { id: 'In_Progress', label: 'In Progress' },
  { id: 'Resolved', label: 'Resolved' },
  { id: 'Closed', label: 'Closed' },
];

const knowledgeBase = [
  { id: 1, title: 'How to apply for leave', subtitle: 'Balances, half days and approvals', href: '/employee-apply-leave', icon: Wallet, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 2, title: 'Company policies', subtitle: 'Read and acknowledge policies', href: '/dashboard/policies', icon: BookOpen, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 3, title: 'Claim a reimbursement', subtitle: 'Submit bills for approval', href: '/dashboard/reimbursement', icon: FileText, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 4, title: 'Update your profile', subtitle: 'Contact, address and documents', href: '/dashboard/my-profile-extension', icon: User, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
];

const PAGE_SIZES = [5, 10, 20];

const formatHours = (h: number | null) => (h === null ? '—' : h < 24 ? `${h}h` : `${Math.round((h / 24) * 10) / 10}d`);

export default function EmployeeHelpdesk() {
  const { data, isLoading } = useMyTickets();
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewing, setViewing] = useState<MyTicket | null>(null);

  const tickets = useMemo(() => data?.tickets ?? [], [data]);
  const stats = data?.stats;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) =>
      (tab === 'all' || t.status === tab) &&
      (!category || t.department === category) &&
      (!q || t.subject.toLowerCase().includes(q) || (t.ticketNumber || '').toLowerCase().includes(q)));
  }, [tickets, tab, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const showTab = (next: Tab) => { setTab(next); setPage(1); };

  const topStats = [
    { id: 1, title: 'Total Tickets', value: stats?.total ?? 0, subtitle: 'All time', linkText: 'View all tickets', tab: 'all' as Tab, icon: Ticket, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 2, title: 'Open', value: stats?.open ?? 0, subtitle: 'Waiting to be picked up', linkText: 'View open tickets', tab: 'Open' as Tab, icon: Wallet, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 3, title: 'In Progress', value: stats?.inProgress ?? 0, subtitle: 'Being worked on', linkText: 'View in progress', tab: 'In_Progress' as Tab, icon: Clock, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
    { id: 4, title: 'Resolved', value: stats?.resolvedThisMonth ?? 0, subtitle: 'This month', linkText: 'View resolved', tab: 'Resolved' as Tab, icon: CheckCircle2, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
    { id: 5, title: 'Avg. Resolution', value: formatHours(stats?.avgResolutionHours ?? null), subtitle: 'Across your resolved tickets', linkText: 'View closed', tab: 'Closed' as Tab, icon: Timer, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
  ];

  const quickActions = [
    { id: 1, title: 'Raise New Request', subtitle: 'Submit a new request', onClick: () => setRaiseOpen(true), icon: Plus, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 2, title: 'My Tickets', subtitle: 'View all my tickets', onClick: () => showTab('all'), icon: Ticket, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 3, title: 'Check Status', subtitle: 'Track open requests', onClick: () => showTab('In_Progress'), icon: FileText, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
    { id: 4, title: 'Policies', subtitle: 'Find answers yourself', href: '/dashboard/policies', icon: BookOpen, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Employee Helpdesk</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Employee Helpdesk</h1>
            <p className="text-[10px] text-zinc-500 mt-1">Raise a request, track status and get quick resolution.</p>
          </div>
          <div>
            <button onClick={() => setRaiseOpen(true)} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Raise New Request
            </button>
          </div>
        </div>

        {/* Top Stats Row — single card with dividers */}
        <div className="flex gap-2 mb-2">
          {topStats.map((stat) => (
            <div key={stat.id} className="flex-1 flex items-start gap-4 p-5 min-w-0 border border-zinc-200 bg-white rounded-xl shadow-sm">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.iconColor} />
              </div>
              <div className="flex flex-col justify-between min-w-0">
                <p className="text-[10px] font-semibold text-zinc-700 truncate">{stat.title}</p>
                <h3 className="mt-0.5 text-2xl font-bold text-zinc-900 leading-none">{isLoading ? '…' : stat.value}</h3>
                <p className="text-[9px] text-zinc-400 mt-1">{stat.subtitle}</p>
                <button onClick={() => showTab(stat.tab)} className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                  {stat.linkText} <ChevronRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

          {/* Left Column (Main Area) */}
          <div className="lg:col-span-8 flex flex-col gap-2">

            {/* Tickets Table Section */}
            <div className="rounded-xl border border-zinc-200 bg-blue-50/50  p-5 shadow-sm">
              {/* Tabs and Actions */}
              <div className="flex items-center justify-between border-b border-zinc-100 mb-4 pb-0">
                <div className="flex items-center gap-6 h-full">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => showTab(t.id)}
                      className={`border-b-2 pb-3 text-[10px] pt-1 ${tab === t.id ? 'border-[#1d4ed8] font-bold text-[#1d4ed8]' : 'border-transparent font-medium text-zinc-500 hover:text-zinc-800'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pb-3">
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 outline-none"
                  >
                    <option value="">All categories</option>
                    {Object.entries(TICKET_CATEGORY_LABEL).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                  </select>
                  <div className="relative w-48">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      placeholder="Search tickets..."
                      className="w-full rounded-md border border-zinc-200 py-1.5 pl-3 pr-8 text-[10px] outline-none focus:border-[#1d4ed8]"
                    />
                    <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-900">
                      <th className="pb-3 px-2 font-bold">Ticket Details</th>
                      <th className="pb-3 px-2 font-bold">Category</th>
                      <th className="pb-3 px-2 font-bold">Priority</th>
                      <th className="pb-3 px-2 font-bold">Status</th>
                      <th className="pb-3 px-2 font-bold">Raised On</th>
                      <th className="pb-3 px-2 font-bold">Updated On</th>
                      <th className="pb-3 px-2 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan={7} className="py-6 text-center text-zinc-500"><Loader2 size={14} className="mx-auto animate-spin" /></td></tr>
                    )}
                    {!isLoading && pageRows.length === 0 && (
                      <tr><td colSpan={7} className="py-6 text-center text-zinc-500">
                        {tickets.length === 0 ? 'You have not raised any tickets yet.' : 'No tickets match these filters.'}
                      </td></tr>
                    )}
                    {pageRows.map((ticket) => {
                      const cat = CATEGORY_ICON[ticket.department] || CATEGORY_ICON.Other;
                      const pri = PRIORITY_STYLE[ticket.priority] || PRIORITY_STYLE.Medium;
                      return (
                        <tr key={ticket._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${cat.color}`}>
                                <cat.icon size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900">{ticket.subject}</p>
                                <p className="text-[9px] text-zinc-500 font-medium">{ticket.ticketNumber ? `#${ticket.ticketNumber}` : '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 font-medium text-zinc-800">{TICKET_CATEGORY_LABEL[ticket.department] || ticket.department}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-semibold border ${pri.color}`}>
                              <pri.icon size={10} /> {ticket.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-semibold border ${STATUS_STYLE[ticket.status]}`}>
                              {TICKET_STATUS_LABEL[ticket.status]}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium text-zinc-800">{moment(ticket.createdAt).format('DD MMM YYYY')}</p>
                            <p className="text-[9px] text-zinc-500">{moment(ticket.createdAt).format('hh:mm A')}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="font-medium text-zinc-800">{moment(ticket.updatedAt).format('DD MMM YYYY')}</p>
                            <p className="text-[9px] text-zinc-500">{moment(ticket.updatedAt).format('hh:mm A')}</p>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setViewing(ticket)} title="View details" className="p-1.5 text-[#2d56c7] hover:text-[#1d4ed8] hover:bg-blue-50 rounded-md transition-colors border border-blue-100 bg-blue-50">
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
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-zinc-500 font-medium">
                  {filtered.length === 0 ? 'No tickets' : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} tickets`}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40">‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                      .map((n, i, arr) => (
                        <React.Fragment key={n}>
                          {i > 0 && n - arr[i - 1] > 1 && <span className="flex h-6 items-center justify-center text-zinc-400 px-1">...</span>}
                          <button
                            onClick={() => setPage(n)}
                            className={`flex h-6 w-6 items-center justify-center rounded font-medium ${n === currentPage ? 'bg-[#1d4ed8] text-white' : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                          >
                            {n}
                          </button>
                        </React.Fragment>
                      ))}
                    <button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40">›</button>
                  </div>
                  <div className="relative ml-2">
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                      className="appearance-none rounded border border-zinc-200 bg-white py-1 pl-2 pr-5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 outline-none"
                    >
                      {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
                    </select>
                    <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-2 ">

              {/* We're here to help! */}
              <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] shadow-sm p-5">
                <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1">We&apos;re here to help!</h3>
                <p className="text-[10px] text-zinc-500 mb-5">Every request reaches the team that can solve it.</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[#1d4ed8] shadow-sm">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">Right Team</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">Routed to IT, HR, Finance<br />or Facility</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[#1d4ed8] shadow-sm">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">Kept Informed</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">You&apos;re notified when<br />status changes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-emerald-600 shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">Private</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">Only you and support<br />staff see your tickets</p>
                    </div>
                  </div>
                </div>
              </div>

              <RatingCard prompt={data?.ratePrompt ?? null} />
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-2">

            {/* Quick Actions */}
            <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-[#1a1c21] mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const body = (
                    <>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${action.iconBg}`}>
                        <action.icon size={16} className={action.iconColor} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-[10px] font-bold text-[#1a1c21] group-hover:text-[#1d4ed8] transition-colors leading-tight mb-0.5">{action.title}</p>
                        <p className="text-[9px] text-zinc-500 leading-tight">{action.subtitle}</p>
                      </div>
                    </>
                  );
                  const cls = 'flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm hover:border-[#1d4ed8]/30 hover:bg-blue-50/30 transition-colors cursor-pointer group';
                  return action.href
                    ? <Link key={action.id} href={action.href} className={cls}>{body}</Link>
                    : <button key={action.id} type="button" onClick={action.onClick} className={cls}>{body}</button>;
                })}
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="rounded-xl border border-zinc-200 bg-blue-50/50  p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold text-zinc-900">Knowledge Base</h3>
                <Link href="/dashboard/policies" className="flex items-center gap-1 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                {knowledgeBase.map((kb) => (
                  <Link key={kb.id} href={kb.href} className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${kb.iconBg}`}>
                        <kb.icon size={14} className={kb.iconColor} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-800 group-hover:text-[#1d4ed8] transition-colors leading-tight">{kb.title}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{kb.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-400 group-hover:text-[#1d4ed8]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Need immediate help? */}
            <div className="rounded-xl bg-blue-50/50 p-5 border border-blue-100 flex flex-col items-start relative overflow-hidden">
              <div className="relative z-10 w-[75%]">
                <h3 className="text-[11px] font-bold text-zinc-900 mb-1">Need immediate help?</h3>
                <p className="text-[10px] text-zinc-600 mb-2 leading-relaxed">
                  Mark your request Urgent so<br />support sees it first.
                </p>
                <button onClick={() => setRaiseOpen(true)} className="flex items-center justify-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-4 py-2 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors">
                  <Headphones size={12} /> Contact Support Team
                </button>
              </div>

              {/* Illustration decoration */}
              <div className="absolute -right-4 bottom-0 h-32 w-32 translate-y-4">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100/50 opacity-50">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-200/50">
                    <Headphones size={48} className="text-[#1d4ed8] opacity-80" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <RaiseTicketDialog open={raiseOpen} onClose={() => setRaiseOpen(false)} />
      <TicketDetailDialog ticket={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

/** "How was your support experience?" — rates the latest resolved ticket not yet rated. */
function RatingCard({ prompt }: { prompt: { _id: string; subject: string; ticketNumber?: string } | null }) {
  const rate = useRateTicket();
  const [stars, setStars] = useState(0);

  const submit = async () => {
    if (!prompt || !stars) return;
    try {
      await rate.mutateAsync({ id: prompt._id, rating: stars });
      toast.success('Thanks for the feedback');
      setStars(0);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not save your rating');
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] shadow-sm p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1">How was your support experience?</h3>
        <p className="text-[10px] text-zinc-500 mb-5">
          {prompt ? <>Rate how &ldquo;{prompt.subject}&rdquo; was handled</> : 'No resolved tickets waiting for your feedback'}
        </p>

        <div className="flex items-center gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" disabled={!prompt} onClick={() => setStars(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`} className="disabled:cursor-not-allowed">
              <Star size={22} className={`transition-colors ${star <= stars ? 'fill-[#1d4ed8] text-[#1d4ed8]' : 'text-[#3b4758] hover:text-[#1d4ed8]'} ${!prompt ? 'opacity-40' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      <button onClick={submit} disabled={!prompt || !stars || rate.isPending} className="w-max text-[11px] font-bold text-[#1d4ed8] hover:underline disabled:opacity-40 disabled:no-underline">
        Submit Feedback
      </button>
    </div>
  );
}

function TicketDetailDialog({ ticket, onClose }: { ticket: MyTicket | null; onClose: () => void }) {
  return (
    <Dialog open={!!ticket} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{ticket?.subject}</DialogTitle>
        </DialogHeader>
        {ticket && (
          <div className="flex flex-col gap-3 text-[12px] text-zinc-700">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <p><span className="text-zinc-500">Reference:</span> {ticket.ticketNumber ? `#${ticket.ticketNumber}` : '—'}</p>
              <p><span className="text-zinc-500">Status:</span> {TICKET_STATUS_LABEL[ticket.status]}</p>
              <p><span className="text-zinc-500">Category:</span> {TICKET_CATEGORY_LABEL[ticket.department] || ticket.department}</p>
              <p><span className="text-zinc-500">Priority:</span> {ticket.priority}</p>
              <p><span className="text-zinc-500">Raised:</span> {moment(ticket.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
              <p><span className="text-zinc-500">Assigned to:</span> {ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName || ''}` : 'Not yet assigned'}</p>
            </div>
            {ticket.channel === 'platform' && (
              <p className="rounded-md bg-blue-50 p-2 text-[11px] text-blue-700">Reported to the CrewCam team through &ldquo;Report a problem&rdquo;.</p>
            )}
            <div>
              <p className="text-[11px] font-semibold text-zinc-500 mb-1">Description</p>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
            {ticket.attachmentUrl && (
              <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" className="w-max text-[11px] font-semibold text-blue-600 hover:text-blue-700">View attachment</a>
            )}
            {ticket.resolution && (
              <div className="rounded-md border border-emerald-100 bg-emerald-50/50 p-2">
                <p className="text-[11px] font-semibold text-emerald-700 mb-1">Resolution{ticket.resolvedAt ? ` · ${moment(ticket.resolvedAt).format('DD MMM YYYY')}` : ''}</p>
                <p className="whitespace-pre-wrap">{ticket.resolution}</p>
              </div>
            )}
            {ticket.rating && <p className="text-[11px] text-zinc-500">You rated this {ticket.rating}/5.</p>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
