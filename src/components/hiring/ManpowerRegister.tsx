'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileText,
  Filter, MapPin, MoreVertical, Pencil, Plus, Search, Send, User, Users, XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

const PAGE_SIZE_DEFAULT = 10;

const PRIORITY_COLOR: Record<string, string> = {
  Urgent: 'text-rose-600', High: 'text-orange-600', Medium: 'text-amber-600', Low: 'text-zinc-500',
};
const STATUS_DOT: Record<string, string> = {
  Pending: 'bg-amber-500 text-amber-700 bg-amber-50',
  Approved: 'bg-emerald-500 text-emerald-700 bg-emerald-50',
  Rejected: 'bg-rose-500 text-rose-700 bg-rose-50',
};

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

function formatDate(date: any) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ManpowerRegister() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [departmentId, setDepartmentId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_DEFAULT);
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, 400);
    return () => clearTimeout(handler);
  }, [query]);
  useEffect(() => setPage(1), [status, departmentId, dateFrom, dateTo]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !menuTriggerRef.current?.contains(target)) setOpenMenuId(null);
      if (!dateRef.current?.contains(target)) setDateOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggleMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenuId === id) { setOpenMenuId(null); return; }
    menuTriggerRef.current = e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 176 });
    setOpenMenuId(id);
  };

  const params = {
    page, limit,
    ...(status !== 'All' ? { status } : {}),
    ...(departmentId ? { departmentId } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(debouncedQuery.trim() ? { search: debouncedQuery.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['manpower-requests', params],
    queryFn: async () => unwrapList((await api.get('/hiring/manpower-request', { params })).data),
  });
  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const { data: stats } = useQuery({
    queryKey: ['manpower-request-stats'],
    queryFn: async () => (await api.get('/hiring/manpower-request/stats')).data,
  });
  const { data: departments = [] } = useQuery<any[]>({ queryKey: ['departments'], queryFn: async () => (await api.get('/companies/departments')).data.data || [] });

  const refresh = () => { qc.invalidateQueries({ queryKey: ['manpower-requests'] }); qc.invalidateQueries({ queryKey: ['manpower-request-stats'] }); };
  const changeStatus = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: 'Approved' | 'Rejected' }) => (await api.put(`/hiring/manpower-request/${id}/status`, { status: nextStatus })).data,
    onSuccess: refresh,
  });
  const generatePdf = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data,
    onSuccess: (payload) => { refresh(); openFileUrl(payload.pdfUrl); },
  });

  const approvedPct = stats?.total ? Math.round((stats.approved / stats.total) * 100) : 0;
  const pendingPct = stats?.total ? Math.round((stats.pending / stats.total) * 100) : 0;
  const cards = [
    { label: 'Total Requisitions', sub: 'All time', value: stats?.total ?? '—', icon: FileText, cls: 'bg-indigo-100 text-indigo-600' },
    { label: 'Approved', sub: `${approvedPct}% of total`, value: stats?.approved ?? '—', icon: Send, cls: 'bg-blue-100 text-blue-600' },
    { label: 'Pending', sub: `${pendingPct}% of total`, value: stats?.pending ?? '—', icon: Clock, cls: 'bg-amber-100 text-amber-600' },
    { label: 'Total Positions', sub: 'Across all requisitions', value: stats?.totalPositions ?? '—', icon: Users, cls: 'bg-emerald-100 text-emerald-600' },
  ];

  const hasActiveFilters = Boolean(query || status !== 'All' || departmentId || dateFrom || dateTo);
  const clearFilters = () => { setQuery(''); setStatus('All'); setDepartmentId(''); setDateFrom(''); setDateTo(''); setPage(1); };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div>
          <p className="text-[11px] font-md uppercase tracking-wider text-indigo-600">Hiring process · Step 1</p>
          <h1 className="mt-1 text-lg font-md leading-tight">Manpower Requisition Register</h1>
          <p className="text-xs text-zinc-500">Review, approve and print requirements before candidate intake.</p>
        </div>
        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Link href="/dashboard/hiring/manpower/new"><Plus size={14} className="mr-1.5" />Add Manpower</Link></Button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-3 flex items-center gap-2.5">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${c.cls}`}><c.icon size={15} /></div>
              <div>
                <p className="text-[11px] text-zinc-500">{c.label}</p>
                <p className="text-lg font-md leading-tight">{c.value}</p>
                <p className="text-[10px] text-zinc-400">{c.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search position, designation, department or branch..." className="h-9 w-full rounded-md border border-zinc-300 bg-white pl-8 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <option value="">All Departments</option>
            {departments.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>

          <div className="relative" ref={dateRef}>
            <button onClick={() => setDateOpen((v) => !v)} className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900">
              <CalendarDays size={14} /> {dateFrom || dateTo ? `${dateFrom || '…'} → ${dateTo || '…'}` : 'Select date range'}
            </button>
            {dateOpen && (
              <div className="absolute z-20 mt-1 w-64 rounded-md border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                <label className="block text-[11px] text-zinc-500 mb-1">From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mb-2 h-8 w-full rounded border border-zinc-300 px-2 text-xs dark:border-zinc-700 dark:bg-zinc-900" />
                <label className="block text-[11px] text-zinc-500 mb-1">To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 w-full rounded border border-zinc-300 px-2 text-xs dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
            )}
          </div>

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>

          {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline">Clear</button>}
          <button className="ml-auto h-9 w-9 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500" title="Filters"><Filter size={14} /></button>
        </div>
      </Card>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-sm font-md">{meta.total || rows.length} Requisition{(meta.total || rows.length) === 1 ? '' : 's'}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
              <tr>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Request Date</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Position</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Department</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Work Location</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Reporting To</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Positions</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Salary Range (CTC)</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Priority</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Status</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-500">Loading requisitions...</td></tr>}
              {!isLoading && !rows.length && <tr><td colSpan={10} className="px-4 py-8 text-center text-zinc-500">No requisitions match the selected filters.</td></tr>}
              {!isLoading && rows.map((request: any) => {
                const statusColors = (STATUS_DOT[request.status] || STATUS_DOT.Pending).split(' ');
                return (
                  <tr key={request._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-2"><div className="flex items-center gap-1.5 text-xs text-zinc-500"><CalendarDays size={12} /> {formatDate(request.requestDate)}</div></td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100"><Briefcase size={13} className="text-zinc-400" /> {request.jobTitle}</div>
                      <p className="mt-0.5 text-xs text-zinc-500">{request.designation || '-'}</p>
                    </td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{request.departmentId?.name || '-'}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"><MapPin size={13} className="text-zinc-400" /> {request.workLocation || '-'}</div>
                      {request.locationBranchId?.name && <p className="mt-0.5 text-xs text-zinc-400">{request.locationBranchId.name}</p>}
                    </td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5"><User size={13} className="text-zinc-400" /> {request.reportingTo?.firstName ? `${request.reportingTo.firstName} ${request.reportingTo.lastName || ''}`.trim() : '-'}</span>
                    </td>
                    <td className="px-4 py-2"><span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-md text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{request.numberOfPositions}</span></td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{request.salaryCtcMin || request.salaryCtcMax ? `₹${Number(request.salaryCtcMin || 0).toLocaleString('en-IN')} – ₹${Number(request.salaryCtcMax || 0).toLocaleString('en-IN')}` : request.budgetCTC ? `₹${Number(request.budgetCTC).toLocaleString('en-IN')}` : '-'}</td>
                    <td className={`px-4 py-2 font-md ${PRIORITY_COLOR[request.priority] || 'text-zinc-500'}`}>{request.priority || '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-md ${statusColors[2]} ${statusColors[1]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />{request.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" asChild><Link href={`/dashboard/hiring/manpower/${request._id}`}><Eye size={13} className="mr-1" />View</Link></Button>
                        <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" disabled={generatePdf.isPending} onClick={() => generatePdf.mutate(request._id)}><FileText size={13} className="mr-1" />PDF</Button>
                        <button onClick={(e) => toggleMenu(request._id, e)} className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <MoreVertical size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {openMenuId && menuPos && createPortal(
                (() => {
                  const activeItem = rows.find((r: any) => r._id === openMenuId);
                  if (!activeItem) return null;
                  return (
                    <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[100] w-44 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1 text-left">
                      {activeItem.status === 'Pending' ? (
                        <>
                          <Link href={`/dashboard/hiring/manpower/${activeItem._id}/edit`} onClick={() => setOpenMenuId(null)} className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"><Pencil size={12} /> Edit</Link>
                          <button onClick={() => { changeStatus.mutate({ id: activeItem._id, nextStatus: 'Approved' }); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-emerald-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"><CheckCircle2 size={12} /> Approve</button>
                          <button onClick={() => { changeStatus.mutate({ id: activeItem._id, nextStatus: 'Rejected' }); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-rose-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"><XCircle size={12} /> Reject</button>
                        </>
                      ) : (
                        <span className="block px-3 py-1.5 text-xs text-zinc-400">No further actions</span>
                      )}
                    </div>
                  );
                })(),
                document.body,
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">
            {meta.total === 0 ? 'No entries' : `Showing ${(meta.page - 1) * limit + 1} to ${Math.min(meta.page * limit, meta.total)} of ${meta.total} entries`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1 || isLoading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:text-indigo-600">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-md border ${p === meta.page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'}`}>
                {p}
              </button>
            ))}
            <button disabled={page >= (meta.totalPages || 1) || isLoading} onClick={() => setPage((p) => p + 1)} className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:text-indigo-600">
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            Rows per page
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-zinc-200 dark:border-zinc-700 rounded-md text-xs px-2 py-1 bg-white dark:bg-zinc-900">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
