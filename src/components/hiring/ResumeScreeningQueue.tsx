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
import { Card, CardContent } from '@/components/ui/card';
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
  if (src) return <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-md flex items-center justify-center border border-indigo-200">
      {initials}
    </div>
  );
}

function formatAddedOn(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

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

  // Debounce search so it doesn't fire a backend request on every keystroke.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
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
  const clearFilters = () => {
    setSearch(''); setScreeningStatus(''); setApplicationStatus('Applied'); setExperienceMatch(''); setMinStars(''); setPage(1);
  };

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
  const completedScores = items
    .map((item) => item.latestScreening)
    .filter((latest) => latest?.status === 'completed' && typeof latest.fitScore === 'number');
  const avgFitScore = completedScores.length
    ? Math.round(completedScores.reduce((sum, s) => sum + s.fitScore, 0) / completedScores.length)
    : null;
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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <ScanSearch size={16} />
        </div>
        <div>
          <h1 className="text-lg font-md leading-tight">AI Resume Screening Queue</h1>
          <p className="text-xs text-zinc-500">
            Every new or replaced resume appears here. AI never changes candidate status; HR reviews the result and decides.
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><FileText size={15} /></div>
            <div>
              <p className="text-[11px] text-zinc-500">This page</p>
              <p className="text-lg font-md leading-tight">{meta.total}</p>
              <p className="text-[10px] text-zinc-400">Total candidates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Clock size={15} /></div>
            <div>
              <p className="text-[11px] text-zinc-500">Pending screening</p>
              <p className="text-lg font-md leading-tight">{pendingCount}</p>
              <p className="text-[10px] text-zinc-400">Awaiting AI screening</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><TrendingUp size={15} /></div>
            <div>
              <p className="text-[11px] text-zinc-500">Average fit score (this page)</p>
              <p className="text-lg font-md leading-tight">{avgFitScore !== null ? `${avgFitScore}/100` : '—'}</p>
              <p className="text-[10px] text-zinc-400">Across {completedScores.length} candidates</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, email, or job role..."
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-md text-sm pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={screeningStatus}
            onChange={(e) => { setScreeningStatus(e.target.value as '' | 'pending' | 'screened'); setPage(1); }}
            className="border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 bg-white dark:bg-zinc-900"
          >
            <option value="">All screening status</option>
            <option value="pending">Screening required</option>
            <option value="screened">Already screened</option>
          </select>
          <select
            value={applicationStatus}
            onChange={(e) => { setApplicationStatus(e.target.value); setPage(1); }}
            className="border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 bg-white dark:bg-zinc-900"
          >
            <option value="">All application status</option>
            {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={experienceMatch}
            onChange={(e) => { setExperienceMatch(e.target.value as '' | 'under' | 'match' | 'over'); setPage(1); }}
            className="border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 bg-white dark:bg-zinc-900"
          >
            <option value="">All experience match</option>
            <option value="under">Under-experienced</option>
            <option value="match">Matches role</option>
            <option value="over">Over-experienced</option>
          </select>
          <select
            value={minStars}
            onChange={(e) => { setMinStars(e.target.value); setPage(1); }}
            className="border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 bg-white dark:bg-zinc-900"
          >
            <option value="">Any rating</option>
            <option value="5">5 stars</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={clearFilters}
              title="Clear filters"
              className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 relative"
            >
              <Filter size={14} />
              {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-600" />}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline">Clear</button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex gap-2 m-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertTriangle size={16} />
            {(error as any).response?.data?.message || 'Could not load the AI screening queue.'}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
              <tr>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">Candidate</th>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">Job Role</th>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">Status</th>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">AI Screening</th>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">Added On</th>
                <th className="px-5 py-2 border-b border-zinc-100 dark:border-zinc-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={6} className="p-10 text-center text-sm text-zinc-500">Loading resume queue…</td></tr>}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-sm text-zinc-500">No candidates match this view.</td></tr>
              )}
              {!isLoading && items.map((item) => {
                const latest = item.latestScreening;
                const badge = badgeFor(item);
                const added = formatAddedOn(item.createdAt);
                const statusColors = (STATUS_DOT[item.status] || STATUS_DOT.Applied).split(' ');
                return (
                  <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={`${item.firstName} ${item.lastName}`} src={item.profileImageUrl} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">{item.firstName} {item.lastName}</p>
                            <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-md ${badge.cls}`}>{badge.text}</span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-tight">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2 text-zinc-600 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1.5"><Briefcase size={13} className="text-zinc-400" /> {item.jobRole}</span>
                    </td>
                    <td className="px-5 py-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-md ${statusColors[2]} ${statusColors[1]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColors[0]}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-2">
                      {!latest && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-md text-amber-700">Screening required</span>
                      )}
                      {latest && latest.status === 'completed' && (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-md px-1.5 py-0.5 rounded ${scoreColor(latest.fitScore)}`}>{latest.fitScore}/100</span>
                            {latest.starRating != null && <StarRating rating={latest.starRating} />}
                          </div>
                          <p className={`mt-0.5 text-[11px] font-md ${matchLabelColor(latest.fitScore)}`}>- {matchLabel(latest.fitScore)}</p>
                        </div>
                      )}
                      {latest && latest.status === 'failed' && (
                        <span className="text-xs text-rose-600">Failed — {latest.failureReason || 'retry required'}</span>
                      )}
                    </td>
                    <td className="px-5 py-2 text-zinc-500">
                      <div className="flex items-center gap-1.5 text-xs"><CalendarDays size={12} /> {added.day}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{added.time}</div>
                    </td>
                    <td className="px-5 py-2 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" asChild>
                          <Link href={`/dashboard/hiring/${item._id}`}><FileText size={13} className="mr-1" /> View Profile</Link>
                        </Button>
                        <Button size="sm" className="h-7 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700" disabled={screen.isPending} onClick={() => screen.mutate(item._id)}>
                          {screen.isPending ? <Loader2 size={13} className="mr-1 animate-spin" /> : <Sparkles size={13} className="mr-1" />}
                          {item.needsScreening ? 'Screen resume' : 'Re-screen'}
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
                  const activeItem = items.find((i) => i._id === openMenuId);
                  if (!activeItem) return null;
                  return (
                    <div
                      ref={menuRef}
                      style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
                      className="z-[100] w-44 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1 text-left"
                    >
                      <Link
                        href={`/dashboard/hiring/${activeItem._id}`}
                        className="block px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        onClick={() => setOpenMenuId(null)}
                      >
                        View screening history
                      </Link>
                      <a
                        href={`mailto:${activeItem.email}`}
                        className="block px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Email candidate
                      </a>
                    </div>
                  );
                })(),
                document.body,
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <span className="text-xs text-zinc-500">
            {meta.total === 0 ? 'No candidates' : `Showing ${(meta.page - 1) * meta.limit + 1} to ${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total} candidates`}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 disabled:opacity-40 hover:text-indigo-600"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-md border ${p === meta.page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-700 hover:border-indigo-300'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 disabled:opacity-40 hover:text-indigo-600"
            >
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            Rows per page
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border border-zinc-200 dark:border-zinc-700 rounded-md text-xs px-2 py-1 bg-white dark:bg-zinc-900"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="border-indigo-100 bg-indigo-50/40 dark:border-indigo-900 dark:bg-indigo-950/20">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><ScanSearch size={18} /></div>
            <div>
              <p className="font-md text-sm text-zinc-900 dark:text-zinc-100">AI Screening is advisory only</p>
              <p className="text-xs text-zinc-500">AI provides a fit score and highlights. Final decisions are made by HR.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAbout((v) => !v)}>
            {showAbout ? <X size={14} className="mr-1.5" /> : null} {showAbout ? 'Close' : 'Learn how it works'}
          </Button>
          {showAbout && (
            <div className="w-full text-xs text-zinc-600 dark:text-zinc-400 border-t border-indigo-100 dark:border-indigo-900 pt-3">
              Every time a candidate's resume is added or replaced, it shows up here as pending. Clicking
              "Screen resume" sends the resume text to your tenant's configured AI provider, which returns a
              fit score (0-100), matched/missing skills, an experience-match read, pros &amp; cons, and a 1-5
              star rating. None of this changes the candidate's pipeline status automatically — HR always
              makes the final call.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
