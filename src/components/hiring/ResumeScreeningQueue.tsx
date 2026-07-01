'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Briefcase, CalendarDays, ChevronLeft, ChevronRight, Clock, FileText,
  Filter, Loader2, MoreVertical, ScanSearch, Search, Sparkles, Star, TrendingUp, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

const APPLICATION_STATUSES = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

const STATUS_DOT: Record<string, string> = {
  Applied: 'bg-blue-500 text-blue-700 bg-blue-50',
  Screening: 'bg-zinc-500 text-zinc-700 bg-zinc-100',
  Interviewing: 'bg-amber-500 text-amber-700 bg-amber-50',
  Offered: 'bg-violet-500 text-violet-700 bg-violet-50',
  Hired: 'bg-emerald-500 text-emerald-700 bg-emerald-50',
  Rejected: 'bg-rose-500 text-rose-700 bg-rose-50',
};

const scoreColor = (score: number) =>
  score >= 85 ? 'text-emerald-600 bg-emerald-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
const matchLabel = (score: number) => (score >= 85 ? 'Excellent Match' : score >= 50 ? 'Good Match' : 'Poor Match');
const matchLabelColor = (score: number) => (score >= 85 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600');

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) return <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover border border-slate-200" />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center border border-indigo-200">{initials}</div>;
}

function formatAddedOn(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

const sel = 'border border-slate-200 rounded-[2px] text-xs px-2.5 py-1.5 bg-white outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68]';

export default function ResumeScreeningQueue() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [screeningStatus, setScreeningStatus] = useState<'' | 'pending' | 'screened'>('');
  const [applicationStatus, setApplicationStatus] = useState('Applied');
  const [experienceMatch, setExperienceMatch] = useState<'' | 'under' | 'match' | 'over'>('');
  const [minStars, setMinStars] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(handler);
  }, [search]);

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

  const hasActiveFilters = Boolean(search || screeningStatus || applicationStatus !== 'Applied' || experienceMatch || minStars);
  const clearFilters = () => { setSearch(''); setScreeningStatus(''); setApplicationStatus('Applied'); setExperienceMatch(''); setMinStars(''); setPage(1); };

  const { data, isLoading, error } = useQuery<{ data: any[]; meta: { page: number; limit: number; total: number; totalPages: number } }>({
    queryKey: ['resume-screening-queue', page, limit, debouncedSearch, screeningStatus, applicationStatus, experienceMatch, minStars],
    queryFn: async () => (await api.get('/ai/hiring/resume-screenings', {
      params: { page, limit, search: debouncedSearch, screeningStatus, applicationStatus, experienceMatch, minStars },
    })).data,
  });
  const items = data?.data || [];
  const meta = data?.meta || { page: 1, limit, total: 0, totalPages: 1 };

  const screen = useMutation({
    mutationFn: async (candidateId: string) => (await api.post(`/ai/hiring/resume-screen/${candidateId}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resume-screening-queue'] }),
  });

  const pendingCount = items.filter((i) => i.needsScreening).length;
  const completedScores = items.map((item) => item.latestScreening).filter((s) => s?.status === 'completed' && typeof s.fitScore === 'number');
  const avgFitScore = completedScores.length ? Math.round(completedScores.reduce((sum, s) => sum + s.fitScore, 0) / completedScores.length) : null;
  const topScoreOnPage = completedScores.length ? Math.max(...completedScores.map((s) => s.fitScore)) : null;
  const now = Date.now();

  const badgeFor = (item: any) => {
    if (item.needsScreening) return { text: 'Pending', cls: 'bg-amber-100 text-amber-700' };
    const createdAt = new Date(item.createdAt).getTime();
    if (now - createdAt < 1000 * 60 * 60 * 24) return { text: 'New', cls: 'bg-emerald-100 text-emerald-700' };
    if (item.latestScreening?.fitScore === topScoreOnPage && topScoreOnPage !== null) return { text: 'Top Match', cls: 'bg-violet-100 text-violet-700' };
    return { text: 'Reviewed', cls: 'bg-blue-100 text-blue-700' };
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10">

      {/* Header */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5 w-fit">AI RESUME SCREENING QUEUE</span>
          <p className="text-[11px] text-slate-500 mt-1">Every new or replaced resume appears here. AI never changes candidate status; HR reviews the result and decides.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-2 sm:grid-cols-3 mx-2">
        <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 p-3 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-[4px] bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><FileText size={15} /></div>
          <div>
            <p className="text-[11px] text-slate-500">This page</p>
            <p className="text-lg font-bold leading-tight text-slate-800">{meta.total}</p>
            <p className="text-[10px] text-slate-400">Total candidates</p>
          </div>
        </div>
        <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 p-3 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-[4px] bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Clock size={15} /></div>
          <div>
            <p className="text-[11px] text-slate-500">Pending screening</p>
            <p className="text-lg font-bold leading-tight text-slate-800">{pendingCount}</p>
            <p className="text-[10px] text-slate-400">Awaiting AI screening</p>
          </div>
        </div>
        <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 p-3 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-[4px] bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><TrendingUp size={15} /></div>
          <div>
            <p className="text-[11px] text-slate-500">Average fit score (this page)</p>
            <p className="text-lg font-bold leading-tight text-slate-800">{avgFitScore !== null ? `${avgFitScore}/100` : '—'}</p>
            <p className="text-[10px] text-slate-400">Across {completedScores.length} candidates</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <section className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mx-2">

        {/* Filter Bar */}
        <div className="bg-slate-50 px-3 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, email, or job role..." className="w-full border border-slate-200 rounded-[2px] text-xs pl-8 pr-3 py-1.5 outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={screeningStatus} onChange={(e) => { setScreeningStatus(e.target.value as '' | 'pending' | 'screened'); setPage(1); }} className={sel}>
            <option value="">All screening status</option>
            <option value="pending">Screening required</option>
            <option value="screened">Already screened</option>
          </select>
          <select value={applicationStatus} onChange={(e) => { setApplicationStatus(e.target.value); setPage(1); }} className={sel}>
            <option value="">All application status</option>
            {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={experienceMatch} onChange={(e) => { setExperienceMatch(e.target.value as '' | 'under' | 'match' | 'over'); setPage(1); }} className={sel}>
            <option value="">All experience match</option>
            <option value="under">Under-experienced</option>
            <option value="match">Matches role</option>
            <option value="over">Over-experienced</option>
          </select>
          <select value={minStars} onChange={(e) => { setMinStars(e.target.value); setPage(1); }} className={sel}>
            <option value="">Any rating</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={clearFilters} title="Clear filters" className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 hover:text-[#0d3c68] hover:border-[#0d3c68] relative">
              <Filter size={13} />
              {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#0d3c68]" />}
            </button>
            {hasActiveFilters && <button onClick={clearFilters} className="text-[11px] text-[#0d3c68] hover:underline">Clear</button>}
          </div>
        </div>

        {error && (
          <div className="flex gap-2 m-4 rounded-[2px] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertTriangle size={14} />{(error as any).response?.data?.message || 'Could not load the AI screening queue.'}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] whitespace-nowrap">
            <thead className="bg-[#0d3c68] text-white">
              <tr>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Candidate</th>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Job Role</th>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Status</th>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">AI Screening</th>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider border-r border-white/10">Added On</th>
                <th className="px-4 py-1.5 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">Loading resume queue…</td></tr>}
              {!isLoading && items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No candidates match this view.</td></tr>}
              {!isLoading && items.map((item) => {
                const latest = item.latestScreening;
                const badge = badgeFor(item);
                const added = formatAddedOn(item.createdAt);
                const statusColors = (STATUS_DOT[item.status] || STATUS_DOT.Applied).split(' ');
                return (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2 border-r border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={`${item.firstName} ${item.lastName}`} src={item.profileImageUrl} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-slate-800 leading-tight">{item.firstName} {item.lastName}</p>
                            <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.text}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 text-slate-600">
                      <span className="inline-flex items-center gap-1.5"><Briefcase size={12} className="text-slate-400" /> {item.jobRole}</span>
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[2]} ${statusColors[1]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />{item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100">
                      {!latest && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Screening required</span>}
                      {latest?.status === 'completed' && (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${scoreColor(latest.fitScore)}`}>{latest.fitScore}/100</span>
                            {latest.starRating != null && <StarRating rating={latest.starRating} />}
                          </div>
                          <p className={`mt-0.5 text-[11px] font-semibold ${matchLabelColor(latest.fitScore)}`}>— {matchLabel(latest.fitScore)}</p>
                        </div>
                      )}
                      {latest?.status === 'failed' && <span className="text-[10px] text-rose-600">Failed — {latest.failureReason || 'retry required'}</span>}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100 text-slate-500">
                      <div className="flex items-center gap-1.5"><CalendarDays size={11} /> {added.day}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{added.time}</div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-[2px] border-slate-300 text-[10px] font-bold uppercase text-slate-700" asChild>
                          <Link href={`/dashboard/hiring/${item._id}`}><FileText size={12} className="mr-1" />View</Link>
                        </Button>
                        <Button size="sm" className="h-7 px-2.5 rounded-[2px] text-[10px] font-bold uppercase bg-[#0d3c68] hover:bg-[#0a2e50] text-white" disabled={screen.isPending} onClick={() => screen.mutate(item._id)}>
                          {screen.isPending ? <Loader2 size={11} className="mr-1 animate-spin" /> : <Sparkles size={11} className="mr-1" />}
                          {item.needsScreening ? 'Screen' : 'Re-screen'}
                        </Button>
                        <button onClick={(e) => toggleMenu(item._id, e)} className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {openMenuId && menuPos && createPortal(
                (() => {
                  const activeItem = items.find((i) => i._id === openMenuId);
                  if (!activeItem) return null;
                  return (
                    <div ref={menuRef} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }} className="z-[100] w-44 rounded-[2px] border border-slate-200 bg-white shadow-lg py-1 text-left">
                      <Link href={`/dashboard/hiring/${activeItem._id}`} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50" onClick={() => setOpenMenuId(null)}>View screening history</Link>
                      <a href={`mailto:${activeItem.email}`} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50" onClick={() => setOpenMenuId(null)}>Email candidate</a>
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
            {meta.total === 0 ? 'No candidates' : `Showing ${(meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total} candidates`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={meta.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:text-[#0d3c68]"><ChevronLeft size={14} /></button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`h-7 w-7 flex items-center justify-center rounded-[2px] text-[11px] font-bold border ${p === meta.page ? 'bg-[#0d3c68] text-white border-[#0d3c68]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#0d3c68]'}`}>{p}</button>
            ))}
            <button disabled={meta.page >= meta.totalPages} onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} className="h-7 w-7 flex items-center justify-center rounded-[2px] border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:text-[#0d3c68]"><ChevronRight size={14} /></button>
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

      {/* Advisory Card */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mx-2">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-[4px] bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><ScanSearch size={17} /></div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68]">AI Screening is advisory only</p>
              <p className="text-xs text-slate-500">AI provides a fit score and highlights. Final decisions are made by HR.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-7 px-3 rounded-[2px] border-slate-300 text-[10px] font-bold uppercase text-slate-700" onClick={() => setShowAbout((v) => !v)}>
            {showAbout ? <X size={13} className="mr-1.5" /> : null}{showAbout ? 'Close' : 'Learn how it works'}
          </Button>
          {showAbout && (
            <div className="w-full text-xs text-slate-600 border-t border-slate-200 pt-3">
              Every time a candidate's resume is added or replaced, it shows up here as pending. Clicking "Screen resume" sends the resume text to your tenant's configured AI provider, which returns a fit score (0-100), matched/missing skills, an experience-match read, pros &amp; cons, and a 1-5 star rating. None of this changes the candidate's pipeline status automatically — HR always makes the final call.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
