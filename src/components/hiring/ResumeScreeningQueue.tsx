'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, FileSearch, Loader2, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';

const scoreColor = (score: number) =>
  score >= 70 ? 'text-emerald-600 bg-emerald-50' : score >= 40 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={12} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

export default function ResumeScreeningQueue() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<'' | 'pending' | 'screened'>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, error } = useQuery<{ data: any[]; meta: { page: number; limit: number; total: number; totalPages: number } }>({
    queryKey: ['resume-screening-queue', page, debouncedSearch, status],
    queryFn: async () => (await api.get('/ai/hiring/resume-screenings', { params: { page, limit: 10, search: debouncedSearch, status } })).data,
  });
  const items = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const screen = useMutation({
    mutationFn: async (candidateId: string) => (await api.post(`/ai/hiring/resume-screen/${candidateId}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resume-screening-queue'] }),
  });

  const completedScores = items
    .map((item) => item.latestScreening)
    .filter((latest) => latest?.status === 'completed' && typeof latest.fitScore === 'number');
  const avgFitScore = completedScores.length
    ? Math.round(completedScores.reduce((sum, s) => sum + s.fitScore, 0) / completedScores.length)
    : null;

  return (
    <div className="space-y-4">
      <div className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
        <p className="text-[11px] font-md uppercase tracking-wider text-indigo-600">AI Hiring · advisory only</p>
        <h1 className="mt-1 text-xl font-md">AI Resume Screening Queue</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Every new or replaced resume appears here. AI never changes candidate status; HR reviews the result and decides.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">This page</p>
            <p className="mt-1 text-2xl font-md">{meta.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Pending screening</p>
            <p className="mt-1 text-2xl font-md">{items.filter((i) => i.needsScreening).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500">Average fit score (this page)</p>
            <p className="mt-1 text-2xl font-md">{avgFitScore !== null ? `${avgFitScore}/100` : '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col min-h-[400px]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <input
            type="text"
            placeholder="Search by name, email, or job role..."
            className="w-full sm:w-64 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as '' | 'pending' | 'screened'); setPage(1); }}
            className="w-full sm:w-44 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 bg-white dark:bg-zinc-900"
          >
            <option value="">All candidates</option>
            <option value="pending">Screening required</option>
            <option value="screened">Already screened</option>
          </select>
        </div>

        {error && (
          <div className="flex gap-2 m-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertTriangle size={16} />
            {(error as any).response?.data?.message || 'Could not load the AI screening queue.'}
          </div>
        )}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-medium">
              <tr>
                <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Candidate</th>
                <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Job Role</th>
                <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Status</th>
                <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">AI Screening</th>
                <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={5} className="p-8 text-center text-sm text-zinc-500">Loading resume queue…</td></tr>}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-sm text-zinc-500">No candidates match this view.</td></tr>
              )}
              {!isLoading && items.map((item) => {
                const latest = item.latestScreening;
                return (
                  <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{item.firstName} {item.lastName}</div>
                      <div className="text-xs text-zinc-500">{item.email}</div>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{item.jobRole}</td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{item.status}</td>
                    <td className="px-5 py-3">
                      {!latest && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-md text-amber-700">Screening required</span>
                      )}
                      {latest && latest.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-md px-1.5 py-0.5 rounded ${scoreColor(latest.fitScore)}`}>{latest.fitScore}/100</span>
                          {latest.starRating != null && <StarRating rating={latest.starRating} />}
                          {item.needsScreening && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-md text-amber-700">Resume updated</span>
                          )}
                        </div>
                      )}
                      {latest && latest.status === 'failed' && (
                        <span className="text-xs text-rose-600">Failed — {latest.failureReason || 'retry required'}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/hiring/${item._id}`}><FileSearch size={14} className="mr-1" /> Candidate</Link>
                        </Button>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={screen.isPending} onClick={() => screen.mutate(item._id)}>
                          {screen.isPending ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Sparkles size={14} className="mr-1" />}
                          {item.needsScreening ? 'Screen resume' : 'Re-screen'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <span className="text-xs text-zinc-500">
              Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === meta.page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className={p === meta.page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}>
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
