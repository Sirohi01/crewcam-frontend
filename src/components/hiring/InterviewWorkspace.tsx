'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Briefcase, CalendarClock, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Eye, Filter, Loader2, MessageSquareText, MoreVertical, Plus, Search, Star, Users, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/axios';

type View = 'new' | 'list' | 'statistics' | 'walk-in' | 'telephonic' | 'hr-hod' | 'final';

const ROUND_TYPES = ['Walk-In', 'Telephonic', 'Technical', 'HR', 'HR & HOD', 'Managerial', 'Final'];
const VIEW_META: Record<View, { title: string; description: string; rounds?: string[] }> = {
  new: { title: 'Add New Interview', description: 'Schedule a candidate interview with owner, date, mode and location.' },
  list: { title: 'Interview Register', description: 'A separate, candidate-linked interview table for all scheduling, feedback and outcomes.' },
  statistics: { title: 'Interview Statistics', description: 'Live operational summary of interview volume, outcomes and round performance.' },
  'walk-in': { title: 'Level 1 - Walk-In Round', description: 'Walk-in round queue and outcomes.', rounds: ['Walk-In'] },
  telephonic: { title: 'Level 1 - Telephonic Round', description: 'First-call screening queue and outcomes.', rounds: ['Telephonic'] },
  'hr-hod': { title: 'Level 2 - HR & HOD Round', description: 'HR, HOD and managerial evaluation queue.', rounds: ['HR', 'HR & HOD', 'Managerial'] },
  final: { title: 'Level 3 - HR Final Round', description: 'Final decision-round queue and outcomes.', rounds: ['Final'] },
};

const STATUS_DOT: Record<string, string> = {
  Scheduled: 'bg-blue-500 text-blue-700 bg-blue-50',
  In_Progress: 'bg-purple-500 text-purple-700 bg-purple-50',
  Completed: 'bg-emerald-500 text-emerald-700 bg-emerald-50',
  Cancelled: 'bg-rose-500 text-rose-700 bg-rose-50',
  No_Show: 'bg-amber-500 text-amber-700 bg-amber-50',
};

const inputClass = 'w-full rounded-[2px] border border-slate-200 bg-white px-3 py-2 text-xs focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] outline-none';
const labelClass = 'mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-700';

const EMPTY_FORM = { candidateId: '', interviewerId: '', roundType: 'Telephonic', scheduledDate: '', mode: 'Video', location: '', meetingLink: '' };

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

function toDatetimeLocal(value: string) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={12} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) return <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0" />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center border border-indigo-200 shrink-0">
      {initials}
    </div>
  );
}

const sel = 'border border-slate-200 rounded-[2px] text-xs px-2.5 py-1.5 bg-white outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68]';

export default function InterviewWorkspace({ view }: { view: View }) {
  const meta = VIEW_META[view];
  const roundFilter = meta.rounds?.join(',');
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [round, setRound] = useState(meta.rounds?.[0] || 'All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ status: 'Completed', rating: 3, feedback: '' });

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setPage(1), [query, status, round, view]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuTriggerRef.current?.contains(target)) return;
      setOpenMenuId(null);
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
    page,
    limit,
    ...(status !== 'All' && view !== 'statistics' ? { status } : {}),
    ...(round !== 'All' && view !== 'statistics' ? { roundType: round } : (roundFilter ? { roundType: roundFilter } : {})),
    ...(query.trim() && view !== 'statistics' ? { search: query.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['interviews', params],
    queryFn: async () => unwrapList((await api.get('/hiring/interviews', { params })).data),
  });
  const interviews = data?.rows || [];
  const pageMeta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const { data: stats } = useQuery({
    queryKey: ['interview-stats', roundFilter],
    queryFn: async () => (await api.get('/hiring/interviews/stats', { params: roundFilter ? { roundType: roundFilter } : {} })).data,
  });

  const { data: candidatePayload = [] } = useQuery<any>({ queryKey: ['candidates-picker'], queryFn: async () => (await api.get('/hiring/candidates')).data });
  const candidates = Array.isArray(candidatePayload) ? candidatePayload : candidatePayload?.data || [];
  const { data: employees = [] } = useQuery<any[]>({ queryKey: ['employees-picker'], queryFn: async () => (await api.get('/employees')).data.data || [] });
  const refresh = () => { queryClient.invalidateQueries({ queryKey: ['interviews'] }); queryClient.invalidateQueries({ queryKey: ['interview-stats'] }); };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  const create = useMutation({
    mutationFn: async () => (await api.post('/hiring/interviews', form)).data,
    onSuccess: () => { refresh(); closeModal(); },
  });
  const update = useMutation({
    mutationFn: async () => (await api.put(`/hiring/interviews/${editingId}`, form)).data,
    onSuccess: () => { refresh(); closeModal(); },
  });
  const saveFeedback = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/interviews/${id}/feedback`, feedback)).data,
    onSuccess: () => { refresh(); setFeedbackId(null); setFeedback({ status: 'Completed', rating: 3, feedback: '' }); },
  });

  const openAddModal = () => { setEditingId(null); setForm({ ...EMPTY_FORM, roundType: meta.rounds?.[0] || 'Telephonic' }); setModalOpen(true); };
  const openEditModal = (item: any) => {
    setEditingId(item._id);
    setForm({
      candidateId: item.candidateId?._id || item.candidateId || '',
      interviewerId: item.interviewerId?._id || item.interviewerId || '',
      roundType: item.roundType,
      scheduledDate: toDatetimeLocal(item.scheduledDate),
      mode: item.mode || 'Video',
      location: item.location || '',
      meetingLink: item.meetingLink || '',
    });
    setModalOpen(true);
    setOpenMenuId(null);
  };
  const openFeedbackModal = (item: any) => {
    setFeedbackId(item._id);
    setFeedback({ status: 'Completed', rating: item.rating || 3, feedback: item.feedback || '' });
    setOpenMenuId(null);
  };
  const visible = interviews;
  const candidateName = (c: any) => c?.firstName ? `${c.firstName} ${c.lastName || ''}`.trim() : 'Unknown candidate';

  const cards = [
    { label: 'Total Interviews', sub: 'All scheduled', value: stats?.total ?? '—', icon: CalendarClock, cls: 'bg-indigo-100 text-indigo-600' },
    { label: 'Upcoming', sub: 'Next 7 days', value: stats?.upcoming ?? '—', icon: Clock, cls: 'bg-amber-100 text-amber-600' },
    { label: 'Completed', sub: 'Interviews done', value: stats?.completed ?? '—', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-600' },
    { label: 'Interviewers', sub: 'Active users', value: stats?.interviewers ?? '—', icon: Users, cls: 'bg-violet-100 text-violet-600' },
  ];

  const hasActiveFilters = Boolean(query || status !== 'All' || (round !== 'All' && !meta.rounds));
  const clearFilters = () => { setQuery(''); setStatus('All'); setRound(meta.rounds?.[0] || 'All'); setPage(1); };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10">
      
      {/* Header */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5 w-fit uppercase">
              {meta.title}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">{meta.description}</p>
          </div>
          {view !== 'statistics' && (
            <Button size="sm" className="bg-[#0d3c68] hover:bg-[#0a2e50] text-white rounded-[2px] h-7 px-3 text-[10px] font-bold uppercase shrink-0" onClick={openAddModal}>
              <Plus size={14} className="mr-1.5" /> Add New Interview
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-2 sm:grid-cols-4 mx-2">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-[4px] shadow-sm border border-slate-200 p-3 flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded-[4px] flex items-center justify-center shrink-0 ${c.cls}`}><c.icon size={15} /></div>
            <div>
              <p className="text-[11px] text-slate-500">{c.label}</p>
              <p className="text-lg font-bold leading-tight text-slate-800">{c.value}</p>
              <p className="text-[10px] text-slate-400">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {view !== 'statistics' && (
        <section className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mx-2">
          
          {/* Filter Bar */}
          <div className="bg-slate-50 px-3 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by candidate name, role, round..." className="w-full border border-slate-200 rounded-[2px] text-xs pl-8 pr-3 py-1.5 outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] bg-white" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {!meta.rounds && (
              <select className={sel} value={round} onChange={(e) => setRound(e.target.value)}>
                <option value="All">All Rounds</option>
                {ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            )}
            <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>No_Show</option>
            </select>
            <div className="ml-auto flex items-center gap-2">
              <button title="Filters" className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 hover:text-[#0d3c68] hover:border-[#0d3c68] relative">
                <Filter size={13} />
                {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#0d3c68]" />}
              </button>
              {hasActiveFilters && <button onClick={clearFilters} className="text-[11px] text-[#0d3c68] hover:underline">Clear</button>}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-[11px] whitespace-nowrap">
              <thead className="bg-[#0d3c68] text-white">
                <tr>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Candidate</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Role</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Round</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Interviewer</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Schedule</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Mode / Location</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Status</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Rating / Feedback</th>
                  <th className="px-4 py-1.5 font-bold uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500 text-sm">Loading interviews...</td></tr>}
                {!isLoading && !visible.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500 text-sm">No interviews match this view.</td></tr>}
                {!isLoading && visible.map((item: any) => {
                  const candidate = item.candidateId || {};
                  const interviewer = item.interviewerId || {};
                  const statusColors = (STATUS_DOT[item.status] || STATUS_DOT.Scheduled).split(' ');
                  return (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 border-r border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={candidateName(candidate)} src={candidate.profileImageUrl} />
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{candidateName(candidate)}</p>
                            <p className="text-[11px] text-slate-500 leading-tight">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100 text-slate-600">
                        <span className="inline-flex items-center gap-1.5"><Briefcase size={12} className="text-slate-400" /> {candidate.jobRole || '-'}</span>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-700">{item.roundType}</span>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100 text-slate-600 font-medium">{interviewer.firstName ? `${interviewer.firstName} ${interviewer.lastName || ''}` : 'Unassigned'}</td>
                      <td className="px-4 py-2 border-r border-slate-100 text-slate-500">
                        <div className="flex items-center gap-1.5"><CalendarDays size={11} /> {new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{new Date(item.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100">
                        <span className="block font-semibold text-slate-800">{item.mode || '-'}</span>
                        <span className="block text-[10px] text-slate-500">{item.location || item.meetingLink || '-'}</span>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[2]} ${statusColors[1]}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-r border-slate-100 max-w-[220px]">
                        {item.rating ? (
                          <div>
                            <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-slate-700">{item.rating}/5</span><StarRow rating={item.rating} /></div>
                            {item.feedback && <p className="mt-0.5 text-[10px] text-slate-500 whitespace-normal">{item.feedback}</p>}
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-end items-center gap-1.5">
                          <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-[2px] border-slate-300 text-[10px] font-bold uppercase text-slate-700" asChild>
                            <Link href={`/dashboard/hiring/${candidate._id}`}><Eye size={12} className="mr-1" /> View</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-[2px] border-slate-300 text-[10px] font-bold uppercase text-slate-700" asChild>
                            <Link href={`/dashboard/hiring/interviews/questions/${item._id}`}><MessageSquareText size={12} className="mr-1" /> Questions</Link>
                          </Button>
                          <button
                            onClick={(e) => toggleMenu(item._id, e)}
                            className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {openMenuId && menuPos && createPortal(
                  (() => {
                    const activeItem = visible.find((i: any) => i._id === openMenuId);
                    if (!activeItem) return null;
                    return (
                      <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[100] w-44 rounded-[2px] border border-slate-200 bg-white shadow-lg py-1 text-left">
                        {activeItem.status === 'Scheduled' ? (
                          <>
                            <button onClick={() => openEditModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50">Edit interview</button>
                            <button onClick={() => openFeedbackModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50">Add feedback</button>
                          </>
                        ) : (
                          <button onClick={() => openFeedbackModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50">Edit feedback</button>
                        )}
                      </div>
                    );
                  })(),
                  document.body,
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-500">
              {pageMeta.total === 0 ? 'No entries' : `Showing ${(pageMeta.page - 1) * limit + 1} to ${Math.min(pageMeta.page * limit, pageMeta.total)} of ${pageMeta.total} entries`}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1 || isLoading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:text-[#0d3c68]">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: pageMeta.totalPages || 1 }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`h-7 w-7 flex items-center justify-center rounded-[2px] text-[11px] font-bold border ${p === pageMeta.page ? 'bg-[#0d3c68] text-white border-[#0d3c68]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0d3c68]'}`}>
                  {p}
                </button>
              ))}
              <button disabled={page >= (pageMeta.totalPages || 1) || isLoading} onClick={() => setPage((p) => p + 1)} className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:text-[#0d3c68]">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              Rows per page
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-slate-200 rounded-[2px] text-xs px-2 py-1 bg-white outline-none focus:border-[#0d3c68]">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl bg-white border border-slate-200 rounded-[4px]">
          <DialogHeader className="border-b border-slate-200 pb-3 mb-2">
            <DialogTitle className="flex items-center gap-2 text-[#0d3c68] text-sm font-bold uppercase tracking-wider"><CalendarClock size={16} /> {editingId ? 'Edit Interview' : 'Schedule Interview'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className={labelClass}>Candidate</span>
              {editingId ? (
                <p className="rounded-[2px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                  {candidates.find((c: any) => c._id === form.candidateId) ? `${candidates.find((c: any) => c._id === form.candidateId).firstName} ${candidates.find((c: any) => c._id === form.candidateId).lastName}` : 'Candidate'}
                </p>
              ) : (
                <select className={inputClass} value={form.candidateId} onChange={(e) => setForm({ ...form, candidateId: e.target.value })}>
                  <option value="">Select candidate...</option>
                  {candidates.map((c: any) => <option key={c._id} value={c._id}>{c.firstName} {c.lastName} - {c.jobRole}</option>)}
                </select>
              )}
            </label>
            <label><span className={labelClass}>Interviewer</span><select className={inputClass} value={form.interviewerId} onChange={(e) => setForm({ ...form, interviewerId: e.target.value })}><option value="">Select interviewer...</option>{employees.map((e: any) => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}</select></label>
            <label><span className={labelClass}>Round</span><select className={inputClass} value={form.roundType} onChange={(e) => setForm({ ...form, roundType: e.target.value })}>{ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label><span className={labelClass}>Schedule date & time</span><input className={inputClass} type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /></label>
            <label><span className={labelClass}>Mode</span><select className={inputClass} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}><option>Video</option><option>Phone</option><option>In-person</option></select></label>
            <label><span className={labelClass}>Location / venue</span><input className={inputClass} placeholder="Branch, room, city or call details" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label className="md:col-span-2"><span className={labelClass}>Meeting link</span><input className={inputClass} type="url" placeholder="https://..." value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} /></label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-2">
            <Button variant="outline" className="rounded-[2px] text-xs font-bold uppercase" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-[#0d3c68] hover:bg-[#0a2e50] text-white rounded-[2px] text-xs font-bold uppercase"
              disabled={!form.candidateId || !form.interviewerId || !form.scheduledDate || create.isPending || update.isPending}
              onClick={() => (editingId ? update.mutate() : create.mutate())}
            >
              {(create.isPending || update.isPending) ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <CalendarClock size={14} className="mr-1.5" />}
              {editingId ? 'Save changes' : 'Schedule interview'}
            </Button>
          </div>
          {(create.isError || update.isError) && (
            <p className="flex items-center gap-1.5 text-[11px] text-rose-600 font-medium"><AlertTriangle size={13} /> {(create.error as any)?.response?.data?.message || (update.error as any)?.response?.data?.message || 'Could not save this interview.'}</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(feedbackId)} onOpenChange={(open) => { if (!open) setFeedbackId(null); }}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-[4px]">
          <DialogHeader className="border-b border-slate-200 pb-3 mb-2">
            <DialogTitle className="flex items-center gap-2 text-[#0d3c68] text-sm font-bold uppercase tracking-wider"><CheckCircle2 size={16} /> Interview Outcome</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <label><span className={labelClass}>Status</span><select className={inputClass} value={feedback.status} onChange={(e) => setFeedback({ ...feedback, status: e.target.value })}><option>Completed</option><option>Cancelled</option><option>No_Show</option></select></label>
            <label><span className={labelClass}>Rating</span><select className={inputClass} value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}/5</option>)}</select></label>
            <label><span className={labelClass}>Feedback notes</span><textarea className={inputClass} rows={3} placeholder="Feedback notes" value={feedback.feedback} onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })} /></label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-2">
            <Button variant="outline" className="rounded-[2px] text-xs font-bold uppercase" onClick={() => setFeedbackId(null)}>Cancel</Button>
            <Button className="bg-[#0d3c68] hover:bg-[#0a2e50] text-white rounded-[2px] text-xs font-bold uppercase" disabled={saveFeedback.isPending} onClick={() => feedbackId && saveFeedback.mutate(feedbackId)}>
              {saveFeedback.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <CheckCircle2 size={14} className="mr-1.5" />}
              Save outcome
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
