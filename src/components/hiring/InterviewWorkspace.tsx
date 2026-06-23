'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart3, CalendarClock, CheckCircle2, Filter, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

type View = 'new' | 'list' | 'statistics' | 'walk-in' | 'telephonic' | 'hr-hod' | 'final';
const ROUND_TYPES = ['Walk-In', 'Telephonic', 'Technical', 'HR', 'HR & HOD', 'Managerial', 'Final'];
const VIEW_META: Record<View, { title: string; description: string; rounds?: string[] }> = {
  new: { title: 'Add New Interview', description: 'Schedule a candidate interview with an owner, date and optional meeting link.' },
  list: { title: 'Interview List', description: 'Complete interview register with candidate, interviewer, round and feedback details.' },
  statistics: { title: 'Interview Statistics', description: 'Live operational summary of interview volume, outcomes and round performance.' },
  'walk-in': { title: 'Level 1 — Walk-In Round', description: 'Walk-in round queue and outcomes.', rounds: ['Walk-In'] },
  telephonic: { title: 'Level 1 — Telephonic Round', description: 'First-call screening queue and outcomes.', rounds: ['Telephonic'] },
  'hr-hod': { title: 'Level 2 — HR & HOD Round', description: 'HR, HOD and managerial evaluation queue.', rounds: ['HR', 'HR & HOD', 'Managerial'] },
  final: { title: 'Level 3 — HR Final Round', description: 'Final decision-round queue and outcomes.', rounds: ['Final'] },
};

const inputClass = 'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';
const labelClass = 'mb-1 block text-xs font-md text-zinc-700 dark:text-zinc-300';

export default function InterviewWorkspace({ view }: { view: View }) {
  const meta = VIEW_META[view];
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [round, setRound] = useState(meta.rounds?.[0] || 'All');
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ status: 'Completed', rating: 3, feedback: '' });
  const [form, setForm] = useState({ candidateId: '', interviewerId: '', roundType: meta.rounds?.[0] || 'Telephonic', scheduledDate: '', meetingLink: '' });

  const { data: interviews, isLoading } = useQuery<any[]>({ queryKey: ['interviews', 'all'], queryFn: async () => (await api.get('/hiring/interviews')).data });
  const { data: candidates } = useQuery<any[]>({ queryKey: ['candidates'], queryFn: async () => (await api.get('/hiring/candidates')).data });
  const { data: employees } = useQuery<any[]>({ queryKey: ['employees-picker'], queryFn: async () => (await api.get('/employees')).data.data || [] });

  const schedule = useMutation({
    mutationFn: async () => (await api.post('/hiring/interviews', form)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['interviews'] }); setForm({ candidateId: '', interviewerId: '', roundType: meta.rounds?.[0] || 'Telephonic', scheduledDate: '', meetingLink: '' }); },
  });
  const saveFeedback = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/interviews/${id}/feedback`, feedback)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['interviews'] }); setFeedbackId(null); setFeedback({ status: 'Completed', rating: 3, feedback: '' }); },
  });

  const visible = useMemo(() => (interviews || []).filter((item) => {
    const candidate = item.candidateId || {};
    const matchesText = `${candidate.firstName || ''} ${candidate.lastName || ''} ${candidate.jobRole || ''} ${item.roundType}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (status === 'All' || item.status === status) && (round === 'All' || item.roundType === round) && (!meta.rounds || meta.rounds.includes(item.roundType));
  }), [interviews, meta.rounds, query, round, status]);

  const metrics = useMemo(() => {
    const all = visible.length; const completed = visible.filter((i) => i.status === 'Completed').length; const scheduled = visible.filter((i) => i.status === 'Scheduled').length;
    const rated = visible.filter((i) => typeof i.rating === 'number'); const avg = rated.length ? (rated.reduce((sum, i) => sum + i.rating, 0) / rated.length).toFixed(1) : '—';
    return [{ label: 'Total interviews', value: all }, { label: 'Scheduled', value: scheduled }, { label: 'Completed', value: completed }, { label: 'Average rating', value: avg }];
  }, [visible]);

  const showSchedule = view === 'new';
  const showStats = view === 'statistics';
  return <div className="mx-auto flex max-w-[1400px] flex-col gap-4 pb-8">
    <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800"><p className="text-[11px] font-md uppercase tracking-wider text-indigo-600">Hiring process · interviews</p><h1 className="mt-1 text-xl font-md text-zinc-900 dark:text-zinc-50">{meta.title}</h1><p className="mt-1 text-sm text-zinc-500">{meta.description}</p></div>
    {showSchedule && <Card className="border-zinc-200/80 dark:border-zinc-800"><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Plus size={16} /> Schedule interview</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      <label><span className={labelClass}>Candidate</span><select className={inputClass} value={form.candidateId} onChange={(e) => setForm({ ...form, candidateId: e.target.value })}><option value="">Select candidate…</option>{(candidates || []).map((c) => <option key={c._id} value={c._id}>{c.firstName} {c.lastName} — {c.jobRole}</option>)}</select></label>
      <label><span className={labelClass}>Interviewer</span><select className={inputClass} value={form.interviewerId} onChange={(e) => setForm({ ...form, interviewerId: e.target.value })}><option value="">Select interviewer…</option>{(employees || []).map((e) => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}</select></label>
      <label><span className={labelClass}>Round</span><select className={inputClass} value={form.roundType} onChange={(e) => setForm({ ...form, roundType: e.target.value })}>{ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
      <label><span className={labelClass}>Schedule date & time</span><input className={inputClass} type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /></label>
      <label><span className={labelClass}>Meeting link (optional)</span><input className={inputClass} type="url" placeholder="https://…" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} /></label>
      <div className="flex items-end"><Button className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={!form.candidateId || !form.interviewerId || !form.scheduledDate || schedule.isPending} onClick={() => schedule.mutate()}>{schedule.isPending ? 'Scheduling…' : 'Schedule interview'}</Button></div>
    </CardContent></Card>}
    {showStats && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((metric) => <Card key={metric.label} className="border-zinc-200/80 dark:border-zinc-800"><CardContent className="p-4"><p className="text-xs text-zinc-500">{metric.label}</p><p className="mt-1 text-2xl font-md">{metric.value}</p></CardContent></Card>)}</div>}
    {!showSchedule && !showStats && <Card className="border-zinc-200/80 dark:border-zinc-800"><CardContent className="grid gap-2 p-3 md:grid-cols-3"><label className="relative"><Filter className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" /><input className={`${inputClass} pl-9`} placeholder="Search candidate, role or round…" value={query} onChange={(e) => setQuery(e.target.value)} /></label><select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option><option>Scheduled</option><option>Completed</option><option>Cancelled</option><option>No_Show</option></select><select className={inputClass} value={round} onChange={(e) => setRound(e.target.value)}><option>All</option>{ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}</select></CardContent></Card>}
    <Card className="border-zinc-200/80 dark:border-zinc-800"><CardHeader><CardTitle className="flex items-center gap-2 text-sm"><CalendarClock size={16} /> {showStats ? 'Round breakdown' : `${visible.length} interview${visible.length === 1 ? '' : 's'}`}</CardTitle></CardHeader><CardContent className="divide-y divide-zinc-100 p-0 dark:divide-zinc-800">
      {isLoading && <p className="p-5 text-sm text-zinc-500">Loading interviews…</p>}
      {visible.map((item) => { const candidate = item.candidateId || {}; const interviewer = item.interviewerId || {}; return <div key={item._id} className="p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-md">{candidate.firstName} {candidate.lastName} <span className="font-normal text-zinc-500">· {candidate.jobRole}</span></p><p className="mt-0.5 text-xs text-zinc-500">{item.roundType} · {new Date(item.scheduledDate).toLocaleString()} · with {interviewer.firstName || 'Unassigned'} {interviewer.lastName || ''}</p></div><span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-md text-zinc-600 dark:bg-zinc-800">{item.status}</span></div>{item.feedback && <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Feedback: {item.feedback}{item.rating ? ` · ${item.rating}/5` : ''}</p>}{item.status === 'Scheduled' && (feedbackId === item._id ? <div className="mt-3 grid gap-2 md:grid-cols-[150px_100px_1fr_auto]"><select className={inputClass} value={feedback.status} onChange={(e) => setFeedback({ ...feedback, status: e.target.value })}><option>Completed</option><option>Cancelled</option><option>No_Show</option></select><select className={inputClass} value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}/5</option>)}</select><input className={inputClass} placeholder="Feedback notes" value={feedback.feedback} onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })} /><Button disabled={saveFeedback.isPending} onClick={() => saveFeedback.mutate(item._id)}><CheckCircle2 size={14} className="mr-1" /> Save</Button></div> : <Button variant="outline" className="mt-3 h-7 text-xs" onClick={() => setFeedbackId(item._id)}>Submit feedback</Button>)}</div>; })}
      {!isLoading && !visible.length && <p className="p-6 text-center text-sm text-zinc-500">No interviews match this view.</p>}
    </CardContent></Card>
  </div>;
}
