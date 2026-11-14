'use client';

import React, { useMemo, useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
  FilePlus,
  Book,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  RefreshCw,
  Download,
  Search,
  ChevronDown,
  Eye,
  ChevronRight,
  Info,
  Bell,
  ShieldCheck,
  Monitor,
  Landmark,
  CalendarDays,
  Clock,
  Gift,
  ArrowRight,
  Loader2,
  Headphones,
  Receipt,
  ListChecks,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import book from '../../../../../../public/assets/book.png'
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RaiseTicketDialog } from '@/components/helpdesk/RaiseTicketDialog';
import { useAcknowledgePolicy, useMyPolicies } from '@/hooks/useMyPolicies';
import { useMyTickets } from '@/hooks/useMyTickets';
import { MyPolicy } from '@/services/myPolicyService';
import { TICKET_STATUS_LABEL } from '@/services/helpdeskService';

// Category icons by keyword — categories are free text set by HR.
const CATEGORY_STYLES: { match: RegExp; icon: React.ElementType; iconColor: string; iconBg: string; chip: string }[] = [
  { match: /leave/i, icon: CalendarDays, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', chip: 'text-emerald-600 bg-emerald-50' },
  { match: /attendance|time/i, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', chip: 'text-amber-600 bg-amber-50' },
  { match: /financ|expense|travel/i, icon: Landmark, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', chip: 'text-orange-500 bg-orange-50' },
  { match: /\bit\b|it polic|security|tech/i, icon: Monitor, iconColor: 'text-purple-600', iconBg: 'bg-purple-50', chip: 'text-purple-600 bg-purple-50' },
  { match: /benefit/i, icon: Gift, iconColor: 'text-rose-500', iconBg: 'bg-rose-50', chip: 'text-rose-500 bg-rose-50' },
  { match: /complian|legal/i, icon: ShieldCheck, iconColor: 'text-teal-600', iconBg: 'bg-teal-50', chip: 'text-teal-600 bg-teal-50' },
];
const DEFAULT_STYLE = { icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', chip: 'text-blue-600 bg-blue-50' };
const styleFor = (category: string) => CATEGORY_STYLES.find((c) => c.match.test(category)) || DEFAULT_STYLE;

const fileBadge = (url?: string) => {
  const ext = url?.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return { label: 'PDF', cls: 'bg-red-50 text-red-500 border-red-100' };
  if (ext === 'docx' || ext === 'doc') return { label: 'DOCX', cls: 'bg-blue-50 text-[#1d4ed8] border-blue-100' };
  return { label: 'TEXT', cls: 'bg-zinc-50 text-zinc-500 border-zinc-200' };
};

const initials = (u?: { firstName: string; lastName?: string } | null) =>
  u ? `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() : '—';

type Tab = 'all' | 'pending' | 'updated';
const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All Policies' },
  { id: 'pending', label: 'Needs Acknowledgement' },
  { id: 'updated', label: 'Recently Updated' },
];

const PAGE_SIZES = [5, 10, 20];
const DOC_REQUEST_PREFIX = 'Document request:';

export default function PoliciesAndDocuments() {
  const { data, isLoading } = useMyPolicies();
  const { data: ticketData } = useMyTickets();
  const [tab, setTab] = useState<Tab>('all');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewing, setViewing] = useState<MyPolicy | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const policies = useMemo(() => data?.items ?? [], [data]);
  const summary = data?.summary;

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    policies.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [policies]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = policies.filter((p) =>
      (tab !== 'pending' || (p.requiresAck && !p.acknowledgedAt)) &&
      (!category || p.category === category) &&
      (!type || p.type === type) &&
      (!q || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)));
    return tab === 'updated' ? [...rows].sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf()) : rows;
  }, [policies, tab, category, type, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const show = (next: { tab?: Tab; category?: string; type?: string }) => {
    setTab(next.tab ?? 'all');
    setCategory(next.category ?? '');
    setType(next.type ?? '');
    setPage(1);
  };

  const documentRequests = (ticketData?.tickets ?? []).filter((t) => t.subject.startsWith(DOC_REQUEST_PREFIX)).slice(0, 3);

  const topStats = [
    { id: 1, title: 'Policies For You', value: summary?.total, linkText: 'View all policies', onClick: () => show({}), icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 2, title: 'Mandatory', value: summary?.mandatory, linkText: 'View mandatory', onClick: () => show({ type: 'Mandatory' }), icon: FileText, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 3, title: 'Pending Acknowledgement', value: summary?.pendingAck, linkText: 'Review now', onClick: () => show({ tab: 'pending' }), icon: ClipboardCheck, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
    { id: 4, title: 'Acknowledged', value: summary?.acknowledged, linkText: 'View policies', onClick: () => show({}), icon: CheckCircle2, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
    { id: 5, title: 'Updated (Last 30 Days)', value: summary?.updatedRecently, linkText: 'View recently updated', onClick: () => show({ tab: 'updated' }), icon: RefreshCw, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
  ];

  const quickLinks = [
    { id: 1, name: 'All Company Policies', onClick: () => show({}), icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 2, name: 'Policies to Acknowledge', onClick: () => show({ tab: 'pending' }), icon: ClipboardCheck, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
    { id: 3, name: 'My Requests', href: '/dashboard/my-requests', icon: ListChecks, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 4, name: 'Apply for Leave', href: '/employee-apply-leave', icon: CalendarDays, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
    { id: 5, name: 'Claim Reimbursement', href: '/dashboard/reimbursement', icon: Receipt, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { id: 6, name: 'Helpdesk', href: '/dashboard/helpdesk', icon: Headphones, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <Breadcrumb
  items={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Policies & Documents" },
  ]}
/>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Policies & Documents</h1>
            <p className="text-[10px] text-zinc-500 mt-1">Access company policies, guidelines, forms and important documents.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setRequestOpen(true)} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <FilePlus size={14} /> Request New Policy
            </button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
          {topStats.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
                  <stat.icon size={22} className={stat.iconColor} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-[#1a1c21] mb-0.5">{stat.title}</p>
                  <h3 className="text-xl font-black text-[#1a1c21] leading-none mb-1.5">{isLoading ? '…' : stat.value ?? 0}</h3>
                  <button onClick={stat.onClick} className="flex items-center gap-1 text-[9.5px] font-bold text-[#1d4ed8] hover:underline">
                    {stat.linkText} <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

          {/* Left Column (Main Area) */}
          <div className="lg:col-span-8 flex flex-col gap-2">

            {/* Browse by Category */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[12px] font-bold text-[#1a1c21]">Browse by Category</h3>
                <button onClick={() => show({})} className="flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] hover:underline">
                  View All Categories <ArrowRight size={10} />
                </button>
              </div>
              {categories.length === 0 ? (
                <p className="text-[10px] text-zinc-500">{isLoading ? 'Loading…' : 'No policies have been published for you yet.'}</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                  {categories.map(([name, count]) => {
                    const st = styleFor(name);
                    return (
                      <button key={name} type="button" onClick={() => show({ category: name })} className="flex items-center gap-3 cursor-pointer group text-left">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${st.iconBg} shadow-sm group-hover:shadow-md transition-shadow`}>
                          <st.icon size={18} className={st.iconColor} />
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold group-hover:text-[#1d4ed8] transition-colors leading-tight ${category === name ? 'text-[#1d4ed8]' : 'text-[#1a1c21]'}`}>{name}</p>
                          <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{count} {count === 1 ? 'Policy' : 'Policies'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Document List Section */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-zinc-100 mb-4">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTab(t.id); setPage(1); }}
                    className={`border-b-2 pb-3 text-[10px] ${tab === t.id ? 'border-[#1d4ed8] font-bold text-[#1d4ed8]' : 'border-transparent font-medium text-zinc-500 hover:text-zinc-800'}`}
                  >
                    {t.label}{t.id === 'pending' && summary?.pendingAck ? ` (${summary.pendingAck})` : ''}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search policies..."
                    className="w-full rounded-md border border-zinc-200 py-1.5 pl-8 pr-3 text-[10px] outline-none focus:border-[#1d4ed8]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={type}
                    onChange={(e) => { setType(e.target.value); setPage(1); }}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="Mandatory">Mandatory</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Informational">Informational</option>
                  </select>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50 outline-none"
                  >
                    <option value="">All Categories</option>
                    {[...new Set(policies.map((p) => p.category))].sort().map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-900">
                      <th className="pb-3 px-2 font-bold">Document Name</th>
                      <th className="pb-3 px-2 font-bold">Category</th>
                      <th className="pb-3 px-2 font-bold">Version</th>
                      <th className="pb-3 px-2 font-bold">Last Updated</th>
                      <th className="pb-3 px-2 font-bold">Updated By</th>
                      <th className="pb-3 px-2 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan={6} className="py-6 text-center text-zinc-400"><Loader2 size={14} className="mx-auto animate-spin" /></td></tr>
                    )}
                    {!isLoading && rows.length === 0 && (
                      <tr><td colSpan={6} className="py-6 text-center text-zinc-500">
                        {policies.length === 0 ? 'No policies have been published for you yet.' : tab === 'pending' ? 'Nothing left to acknowledge.' : 'No policies match these filters.'}
                      </td></tr>
                    )}
                    {rows.map((doc) => {
                      const badge = fileBadge(doc.documentUrl);
                      const due = doc.requiresAck && !doc.acknowledgedAt;
                      return (
                        <tr key={doc._id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded font-bold text-[8px] border ${badge.cls}`}>
                                {badge.label}
                              </div>
                              <div>
                                <p className="font-bold text-[#1a1c21]">{doc.title}</p>
                                <p className="text-[9px] text-zinc-500 mt-0.5">
                                  {doc.type}
                                  {doc.requiresAck && (due
                                    ? <span className="ml-1 font-semibold text-orange-500">· Acknowledgement due</span>
                                    : <span className="ml-1 font-semibold text-emerald-600">· Acknowledged</span>)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border border-transparent ${styleFor(doc.category).chip} bg-opacity-50`}>
                              {doc.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-medium text-zinc-700">v{doc.version}</td>
                          <td className="py-3 px-2 font-medium text-[#1a1c21]">{moment(doc.updatedAt).format('DD MMM YYYY')}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-[#1d4ed8]">{initials(doc.updatedBy)}</span>
                              <p className="font-bold text-[#1a1c21] leading-none">{doc.updatedBy ? `${doc.updatedBy.firstName} ${doc.updatedBy.lastName || ''}` : '—'}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setViewing(doc)} title={due ? 'Read and acknowledge' : 'View'} className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-[#f4f7ff] text-[#1d4ed8] hover:bg-blue-100 transition-colors">
                                <Eye size={12} />
                              </button>
                              {doc.documentUrl ? (
                                <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" title="Download" className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-[#f4f7ff] text-[#1d4ed8] hover:bg-blue-100 transition-colors">
                                  <Download size={12} />
                                </a>
                              ) : (
                                <span title="No attached document" className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-100 text-zinc-300">
                                  <Download size={12} />
                                </span>
                              )}
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
                <p className="text-[10px] text-zinc-500">
                  {filtered.length === 0 ? 'No policies' : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} policies`}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40">‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                      .map((n) => (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`flex h-6 w-6 items-center justify-center rounded font-medium ${n === currentPage ? 'bg-[#1d4ed8] text-white' : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
                        >
                          {n}
                        </button>
                      ))}
                    <button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40">›</button>
                  </div>
                  <div className="relative ml-2">
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                      className="appearance-none rounded border border-zinc-200 bg-white py-1 pl-2 pr-5 text-[10px] font-medium text-zinc-700 outline-none"
                    >
                      {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
                    </select>
                    <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Informed Banner */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
                  <Info size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-900">Stay Informed</h4>
                  <p className="text-[10px] text-zinc-600 mt-0.5">You&apos;re notified automatically whenever a policy that applies to you is published or updated.</p>
                </div>
              </div>
              <Link href="/dashboard/notifications" className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors">
                <Bell size={12} /> View Notifications
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-2">

            {/* Quick Links */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-[#1a1c21] mb-5">Quick Links</h3>
              <div className="flex flex-col gap-1">
                {quickLinks.map((link) => {
                  const body = (
                    <>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${link.iconBg}`}>
                          <link.icon size={14} className={link.iconColor} />
                        </div>
                        <span className="text-[11px] font-bold text-[#1a1c21] group-hover:text-[#1d4ed8] transition-colors">{link.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-zinc-400 group-hover:text-[#1a1c21]" />
                    </>
                  );
                  const cls = 'flex items-center justify-between p-1.5 hover:bg-zinc-50 transition-colors group rounded-md';
                  return link.href
                    ? <Link key={link.id} href={link.href} className={cls}>{body}</Link>
                    : <button key={link.id} type="button" onClick={link.onClick} className={`${cls} w-full`}>{body}</button>;
                })}
              </div>
            </div>

            {/* Document Requests */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[12px] font-bold text-[#1a1c21]">Document Requests</h3>
                <Link href="/dashboard/helpdesk" className="flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] hover:underline">
                  View All <ArrowRight size={10} />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {documentRequests.length === 0 && <p className="text-[10px] text-zinc-500">You haven&apos;t requested any documents.</p>}
                {documentRequests.map((req) => {
                  const done = req.status === 'Resolved' || req.status === 'Closed';
                  return (
                    <Link key={req._id} href="/dashboard/helpdesk" className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                          <FileText size={12} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#1a1c21] leading-tight mb-0.5">{req.subject.slice(DOC_REQUEST_PREFIX.length).trim() || req.subject}</p>
                          <p className="text-[9px] text-zinc-500">Requested on: {moment(req.createdAt).format('DD MMM YYYY')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${done ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                          {TICKET_STATUS_LABEL[req.status]}
                        </span>
                        <ChevronRight size={14} className="text-zinc-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Need a Document? */}
            <div className="rounded-xl bg-[#f4f7ff] p-5 border border-blue-100 flex items-center justify-between overflow-hidden">
              <div className="flex-1 pr-4">
                <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1.5">Need a Document?</h3>
                <p className="text-[10px] text-zinc-600 mb-4 leading-relaxed pr-2">
                  Can&apos;t find the document you&apos;re looking for? Raise a request and we&apos;ll get back to you.
                </p>
                <button onClick={() => setRequestOpen(true)} className="flex items-center justify-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-4 py-1.5 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors w-max">
                  <Bell size={12} /> Request Document
                </button>
              </div>

              {/* Illustration decoration */}
              <div className="w-[100px] h-[80px] relative shrink-0">
                <Image src={book} alt="Document Request" fill className="object-contain object-right" />
              </div>
            </div>

          </div>
        </div>
      </div>

      <PolicyDialog policy={viewing} onClose={() => setViewing(null)} />
      <RaiseTicketDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request a policy or document"
        defaults={{ department: 'HR', subject: `${DOC_REQUEST_PREFIX} `, priority: 'Low' }}
      />
    </div>
  );
}

/** Full policy text, the attached document, and — where required — acknowledgement. */
function PolicyDialog({ policy, onClose }: { policy: MyPolicy | null; onClose: () => void }) {
  return (
    <Dialog open={!!policy} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{policy?.title} <span className="font-normal text-zinc-400">v{policy?.version}</span></DialogTitle>
        </DialogHeader>
        {policy && <PolicyBody key={`${policy._id}-${policy.version}`} policy={policy} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function PolicyBody({ policy, onClose }: { policy: MyPolicy; onClose: () => void }) {
  const ack = useAcknowledgePolicy();
  const [agree, setAgree] = useState(false);
  const due = policy.requiresAck && !policy.acknowledgedAt;

  const submit = async () => {
    try {
      const res = await ack.mutateAsync(policy._id);
      toast.success(res?.message || 'Acknowledged');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not record your acknowledgement');
    }
  };

  return (
    <div className="flex flex-col gap-3 text-[12px] text-zinc-700">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500">
        <span>{policy.category}</span>
        <span>{policy.type}</span>
        <span>Effective {moment(policy.effectiveFrom).format('DD MMM YYYY')}</span>
        <span>Code {policy.code}</span>
      </div>
      <p className="font-medium text-zinc-800">{policy.shortDescription}</p>
      {policy.detailedDescription && (
        <div className="max-h-[45vh] overflow-y-auto whitespace-pre-wrap rounded-md border border-zinc-100 bg-zinc-50/60 p-3">{policy.detailedDescription}</div>
      )}
      {policy.documentUrl && (
        <a href={policy.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-max items-center gap-1 font-semibold text-blue-600 hover:text-blue-700">
          <Download size={13} /> Open the policy document
        </a>
      )}
      {policy.acknowledgedAt && (
        <p className="rounded-md bg-emerald-50 p-2 text-[11.5px] text-emerald-700">
          You acknowledged this version on {moment(policy.acknowledgedAt).format('DD MMM YYYY, hh:mm A')}.
        </p>
      )}
      {due && (
        <div className="flex flex-col gap-2 rounded-md border border-orange-100 bg-orange-50/50 p-3">
          <label className="flex items-start gap-2 text-[11.5px]">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-3.5 w-3.5" />
            I have read and understood this policy and agree to comply with it.
          </label>
          <button onClick={submit} disabled={!agree || ack.isPending} className="flex w-max items-center gap-1.5 rounded-md bg-[#1d4ed8] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {ack.isPending && <Loader2 size={13} className="animate-spin" />} Acknowledge
          </button>
        </div>
      )}
    </div>
  );
}
