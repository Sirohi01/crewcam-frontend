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

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10">

      {/* Header Section */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden ">
        <div className="bg-slate-50 px-3 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5">
              CANDIDATE REGISTER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="h-7 gap-2 bg-[#0d3c68] px-3 text-[11px] font-bold uppercase hover:bg-[#0a2e50] text-white rounded-[2px]">
              <Link href="/dashboard/hiring/candidates/new/create"><Plus size={12} /> Add Candidate</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden p-4 mx-2">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            {meta.total || rows.length} candidate{(meta.total || rows.length) === 1 ? '' : 's'}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68]">
              <option>All</option><option>Applied</option><option>Screening</option><option>Interviewing</option><option>Offered</option><option>Hired</option><option>Rejected</option>
            </select>

            <div className="relative">
              <span className="text-xs text-slate-600 font-medium mr-2">Search:</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68] w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-[2px]">
          <table className="w-full min-w-[950px] text-left text-[11px] whitespace-nowrap">
            <thead className="bg-[#111] text-white">
              <tr>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">Candidate</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">Contact</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">Role</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">Source</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333] text-center">Resume</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider border-r border-[#333]">Status</th>
                <th className="px-3 py-1.5 font-bold uppercase tracking-wider min-w-[100px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={7} className="px-4 py-7 text-center text-slate-500 text-sm">Loading candidates...</td></tr>}
              {!isLoading && !rows.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">No candidates match the selected filters.</td></tr>}
              {!isLoading && rows.map((candidate: any) => (
                <tr key={candidate._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 border-r border-slate-100">
                    <span className="font-medium text-slate-800">{candidate.firstName} {candidate.lastName}</span>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 text-slate-700">
                    <span className="block">{candidate.email}</span>
                    <span className="block text-slate-500">{candidate.phone}</span>
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 text-slate-700">{candidate.jobRole}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-slate-700">{candidate.source || '-'}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-700">{candidate.resumeUrl ? 'Attached' : '-'}</td>
                  <td className="px-3 py-2 border-r border-slate-100">
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">{candidate.status}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <Button size="sm" variant="outline" className="h-7 px-3 text-[10px] font-bold uppercase" asChild>
                        <Link href={`/dashboard/hiring/${candidate._id}`}>Open Workflow</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-600 font-medium">
            Showing {rows.length} of {meta.total || rows.length} entries (Page {meta.page || page} of {meta.totalPages || 1})
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || isLoading} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Previous
            </button>
            <button onClick={() => setPage((value) => value + 1)} disabled={page >= (meta.totalPages || 1) || isLoading} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
