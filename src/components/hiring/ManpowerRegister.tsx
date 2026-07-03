'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileText,
  Filter, MapPin, MoreVertical, Pencil, Plus, Search, Send, User, Users, XCircle, ArrowUpDown, RefreshCw, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

const PAGE_SIZE_DEFAULT = 10;

const PRIORITY_COLOR: Record<string, string> = {
  Urgent: 'text-rose-600', High: 'text-orange-600', Medium: 'text-amber-600', Low: 'text-slate-500',
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

  const { data, isLoading, refetch } = useQuery({
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

  const refresh = () => { refetch(); qc.invalidateQueries({ queryKey: ['manpower-request-stats'] }); };
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
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-6">

      {/* Header Section */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-3 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5">
              MANPOWER REQUISITION REGISTER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-7 gap-2 px-3 text-[11px] font-bold uppercase rounded-[2px]" onClick={refresh}>
              <RefreshCw size={12} /> Refresh
            </Button>
            <Button asChild className="h-7 gap-2 bg-[#0d3c68] px-3 text-[11px] font-bold uppercase hover:bg-[#0a2e50] text-white rounded-[2px]">
              <Link href="/dashboard/hiring/manpower/new"><ExternalLink size={12} /> Add Manpower</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className=" rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mx-2">
        <div className="grid gap-2 sm:grid-cols-4 bg-slate-50/50">
          {cards.map((c, i) => (
            <div className='bg-white gap-4'>
              <div key={c.label} className={`p-4 flex items-center gap-3  ${i !== cards.length - 1 ? 'border-r border-slate-200' : ''}`}>
                < div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${c.cls}`}><c.icon size={15} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{c.label}</p>
                  <p className="text-lg font-semibold text-slate-800 leading-tight">{c.value}</p>
                </div>
              </div>
            </div>
          ))
          }
        </div >
      </div >

      {/* Table Section */}
      < div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden p-4 mx-2" >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            Show
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-slate-300 rounded px-1.5 py-1 outline-none focus:border-[#0d3c68]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68]">
              <option value="">All Departments</option>
              {departments.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68]">
              <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
            </select>

            <div className="relative">
              <span className="text-xs text-slate-600 font-medium mr-2">Search:</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68] w-[200px]"
              />
            </div>
            {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline font-medium">Clear</button>}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-[2px]">
          <table className="w-full min-w-[1200px] text-left text-[11px] whitespace-nowrap">
            <thead className="bg-[#111] text-white">
              <tr>
                <th className="px-3 py-1.5 border-r border-[#333] w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333] w-12 text-center">S.No</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Request Date <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Position <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Department <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Reporting To <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333] text-center">
                  <div className="flex items-center justify-between">Positions <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Priority <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">
                  <div className="flex items-center justify-between">Status <ArrowUpDown size={12} className="opacity-50" /></div>
                </th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider min-w-[100px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500 text-sm">Loading requisitions...</td></tr>}
              {!isLoading && !rows.length && <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500 text-sm">No requisitions match the selected filters.</td></tr>}
              {!isLoading && rows.map((request: any, index: number) => {
                const statusColors = (STATUS_DOT[request.status] || STATUS_DOT.Pending).split(' ');
                return (
                  <tr key={request._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 border-r border-slate-100 text-center">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-medium text-slate-500">
                      {(meta.page - 1) * limit + index + 1}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <span className="font-medium text-slate-800">{request.jobTitle}</span>
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700">{request.departmentId?.name || '-'}</td>
                    <td className="px-3 py-2 border-r border-slate-100 text-slate-700">
                      {request.reportingTo?.firstName ? `${request.reportingTo.firstName} ${request.reportingTo.lastName || ''}`.trim() : '-'}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-medium text-slate-800">{request.numberOfPositions}</td>
                    <td className={`px-3 py-2 border-r border-slate-100 font-semibold ${PRIORITY_COLOR[request.priority] || 'text-slate-500'}`}>{request.priority || '-'}</td>
                    <td className="px-3 py-2 border-r border-slate-100">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[2]} ${statusColors[1]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />{request.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/hiring/manpower/${request._id}`} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="View">
                          <Eye size={13} />
                        </Link>
                        <button disabled={generatePdf.isPending} onClick={() => generatePdf.mutate(request._id)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Generate PDF">
                          <FileText size={13} />
                        </button>
                        <button onClick={(e) => toggleMenu(request._id, e)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
                          <MoreVertical size={13} />
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
                    <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[100] w-36 rounded shadow-lg border border-slate-200 bg-white py-1 text-left overflow-hidden">
                      {activeItem.status === 'Pending' ? (
                        <>
                          <Link href={`/dashboard/hiring/manpower/${activeItem._id}/edit`} onClick={() => setOpenMenuId(null)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"><Pencil size={13} /> Edit</Link>
                          <button onClick={() => { changeStatus.mutate({ id: activeItem._id, nextStatus: 'Approved' }); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"><CheckCircle2 size={13} /> Approve</button>
                          <button onClick={() => { changeStatus.mutate({ id: activeItem._id, nextStatus: 'Rejected' }); setOpenMenuId(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"><XCircle size={13} /> Reject</button>
                        </>
                      ) : (
                        <span className="block px-3 py-2 text-xs text-slate-400">No further actions</span>
                      )}
                    </div>
                  );
                })(),
                document.body,
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-600 font-medium">
            Showing {meta.total === 0 ? 0 : (meta.page - 1) * limit + 1} to {Math.min(meta.page * limit, meta.total)} of {meta.total} entries
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Previous
            </button>
            <button onClick={() => setPage(p => Math.min(meta.totalPages || 1, p + 1))} disabled={page >= (meta.totalPages || 1)} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div >
    </div >
  );
}
