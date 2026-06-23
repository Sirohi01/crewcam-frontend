'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

const PAGE_SIZE = 20;

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

export default function CandidateRegister() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, status]);

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(status !== 'All' ? { status } : {}),
    ...(query.trim() ? { search: query.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', params],
    queryFn: async () => unwrapList((await api.get('/hiring/candidates', { params })).data),
  });
  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  return <div className="mx-auto max-w-[1500px] space-y-4 pb-10">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Hiring process · candidates</p>
        <h1 className="mt-1 text-xl font-semibold">Candidate Register</h1>
        <p className="mt-1 text-sm text-zinc-500">All applicant records linked to approved manpower requirements.</p>
      </div>
      <Button asChild className="bg-[#0e4778] hover:bg-[#073a69]"><Link href="/dashboard/hiring/candidates/new/create"><Plus size={15} className="mr-2" />Add Candidate</Link></Button>
    </div>

    <Card><CardContent className="grid gap-2 p-3 md:grid-cols-[1fr_180px]">
      <label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidate, email, phone or role..." className="h-9 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" /></label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"><option>All</option><option>Applied</option><option>Screening</option><option>Interviewing</option><option>Offered</option><option>Hired</option><option>Rejected</option></select>
    </CardContent></Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{meta.total || rows.length} candidate{(meta.total || rows.length) === 1 ? '' : 's'}</CardTitle>
        <span className="text-xs text-zinc-500">Page {meta.page || page} of {meta.totalPages || 1}</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900"><tr><th className="px-4 py-3 font-medium">Candidate</th><th className="px-4 py-3 font-medium">Contact</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Source</th><th className="px-4 py-3 font-medium">Resume</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Action</th></tr></thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={7} className="px-4 py-7 text-zinc-500">Loading candidates...</td></tr>}
              {rows.map((candidate: any) => <tr key={candidate._id}><td className="px-4 py-3 font-medium">{candidate.firstName} {candidate.lastName}</td><td className="px-4 py-3"><span className="block">{candidate.email}</span><span className="block text-zinc-500">{candidate.phone}</span></td><td className="px-4 py-3">{candidate.jobRole}</td><td className="px-4 py-3">{candidate.source || '-'}</td><td className="px-4 py-3">{candidate.resumeUrl ? 'Attached' : '-'}</td><td className="px-4 py-3"><span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold dark:bg-zinc-800">{candidate.status}</span></td><td className="px-4 py-3 text-right"><Button size="sm" variant="outline" asChild><Link href={`/dashboard/hiring/${candidate._id}`}>Open Workflow</Link></Button></td></tr>)}
              {!isLoading && !rows.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">No candidates match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs dark:border-zinc-800">
          <span className="text-zinc-500">Showing {rows.length} of {meta.total || rows.length}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || isLoading} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= (meta.totalPages || 1) || isLoading} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>;
}
