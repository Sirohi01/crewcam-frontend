'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Briefcase, CalendarClock, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Eye, Filter, Loader2, MessageSquareText, MoreVertical, Plus, Search, Star, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const inputClass = 'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';
const labelClass = 'mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300';

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
        <Star key={n} size={12} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) return <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0" />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-md flex items-center justify-center border border-indigo-200 shrink-0">
      {initials}
    </div>
  );
}

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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><CalendarClock size={16} /></div>
          <div>
            <h1 className="text-lg font-md leading-tight">{meta.title}</h1>
            <p className="text-xs text-zinc-500">{meta.description}</p>
          </div>
        </div>
        {view !== 'statistics' && (
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={openAddModal}>
            <Plus size={14} className="mr-1.5" /> Add New Interview
          </Button>
        )}
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

      {view !== 'statistics' && (
        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input className={`${inputClass} pl-8`} placeholder="Search by candidate name, role, round..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {!meta.rounds && (
              <select className={`rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 w-full sm:w-48 shrink-0`} value={round} onChange={(e) => setRound(e.target.value)}>
                <option value="All">All Rounds</option>
                {ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            )}
            <select className={`rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 w-full sm:w-48 shrink-0`} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>No_Show</option>
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline whitespace-nowrap shrink-0">Clear filters</button>
            )}
            <button className="sm:ml-auto h-9 w-9 shrink-0 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800" title="Filters">
              <Filter size={15} />
            </button>
          </div>
        </Card>
      )}

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-sm font-md flex items-center gap-2">
            Interview Register <span className="text-[11px] font-normal text-zinc-400">{pageMeta.total || visible.length} records</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
              <tr>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Candidate</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Role</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Round</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Interviewer</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Schedule</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Mode / Location</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Status</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">Rating / Feedback</th>
                <th className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={9} className="px-4 py-8 text-center text-zinc-500">Loading interviews...</td></tr>}
              {!isLoading && !visible.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-zinc-500">No interviews match this view.</td></tr>}
              {!isLoading && visible.map((item: any) => {
                const candidate = item.candidateId || {};
                const interviewer = item.interviewerId || {};
                const statusColors = (STATUS_DOT[item.status] || STATUS_DOT.Scheduled).split(' ');
                return (
                  <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={candidateName(candidate)} src={candidate.profileImageUrl} />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">{candidateName(candidate)}</p>
                          <p className="text-xs text-zinc-500 leading-tight">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1.5"><Briefcase size={13} className="text-zinc-400" /> {candidate.jobRole || '-'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-md text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{item.roundType}</span>
                    </td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{interviewer.firstName ? `${interviewer.firstName} ${interviewer.lastName || ''}` : 'Unassigned'}</td>
                    <td className="px-4 py-2 text-zinc-500">
                      <div className="flex items-center gap-1.5 text-xs"><CalendarDays size={12} /> {new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{new Date(item.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="block font-medium">{item.mode || '-'}</span>
                      <span className="block text-xs text-zinc-500">{item.location || item.meetingLink || '-'}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-md ${statusColors[2]} ${statusColors[1]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 max-w-[220px]">
                      {item.rating ? (
                        <div>
                          <div className="flex items-center gap-1.5"><span className="text-xs font-md">{item.rating}/5</span><StarRow rating={item.rating} /></div>
                          {item.feedback && <p className="mt-0.5 text-xs text-zinc-500 whitespace-normal">{item.feedback}</p>}
                        </div>
                      ) : <span className="text-zinc-400">—</span>}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" asChild>
                          <Link href={`/dashboard/hiring/${candidate._id}`}><Eye size={13} className="mr-1" /> View</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" asChild>
                          <Link href={`/dashboard/hiring/interviews/questions/${item._id}`}><MessageSquareText size={13} className="mr-1" /> Questions</Link>
                        </Button>
                        <button
                          onClick={(e) => toggleMenu(item._id, e)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <MoreVertical size={15} />
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
                    <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[100] w-44 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1 text-left">
                      {activeItem.status === 'Scheduled' ? (
                        <>
                          <button onClick={() => openEditModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">Edit interview</button>
                          <button onClick={() => openFeedbackModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">Add feedback</button>
                        </>
                      ) : (
                        <button onClick={() => openFeedbackModal(activeItem)} className="block w-full px-3 py-1.5 text-left text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">Edit feedback</button>
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
            {pageMeta.total === 0 ? 'No entries' : `Showing ${(pageMeta.page - 1) * limit + 1} to ${Math.min(pageMeta.page * limit, pageMeta.total)} of ${pageMeta.total} entries`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1 || isLoading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:text-indigo-600">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: pageMeta.totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-md border ${p === pageMeta.page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'}`}>
                {p}
              </button>
            ))}
            <button disabled={page >= (pageMeta.totalPages || 1) || isLoading} onClick={() => setPage((p) => p + 1)} className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 disabled:opacity-40 hover:text-indigo-600">
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            Rows per page
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border border-zinc-200 dark:border-zinc-700 rounded-md text-xs px-2 py-1 bg-white dark:bg-zinc-900">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CalendarClock size={16} className="text-indigo-600" /> {editingId ? 'Edit Interview' : 'Schedule Interview'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <label>
              <span className={labelClass}>Candidate</span>
              {editingId ? (
                <p className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
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
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={!form.candidateId || !form.interviewerId || !form.scheduledDate || create.isPending || update.isPending}
              onClick={() => (editingId ? update.mutate() : create.mutate())}
            >
              {(create.isPending || update.isPending) ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <CalendarClock size={14} className="mr-1.5" />}
              {editingId ? 'Save changes' : 'Schedule interview'}
            </Button>
          </div>
          {(create.isError || update.isError) && (
            <p className="flex items-center gap-1.5 text-xs text-rose-600"><AlertTriangle size={13} /> {(create.error as any)?.response?.data?.message || (update.error as any)?.response?.data?.message || 'Could not save this interview.'}</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(feedbackId)} onOpenChange={(open) => { if (!open) setFeedbackId(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Interview Outcome</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <label><span className={labelClass}>Status</span><select className={inputClass} value={feedback.status} onChange={(e) => setFeedback({ ...feedback, status: e.target.value })}><option>Completed</option><option>Cancelled</option><option>No_Show</option></select></label>
            <label><span className={labelClass}>Rating</span><select className={inputClass} value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}/5</option>)}</select></label>
            <label><span className={labelClass}>Feedback notes</span><textarea className={inputClass} rows={3} placeholder="Feedback notes" value={feedback.feedback} onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })} /></label>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setFeedbackId(null)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={saveFeedback.isPending} onClick={() => feedbackId && saveFeedback.mutate(feedbackId)}>
              {saveFeedback.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <CheckCircle2 size={14} className="mr-1.5" />}
              Save outcome
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
