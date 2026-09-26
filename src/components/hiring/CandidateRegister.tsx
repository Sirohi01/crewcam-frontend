'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Download, Plus, Search, ChevronDown, Check, ChevronLeft, ChevronRight,
  Users, CheckCircle, XCircle, Video, Eye, Link as LinkIcon,
  Trash
} from 'lucide-react';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import { Breadcrumb } from '@/components/ui/breadCrumb';

const PAGE_SIZE = 10;

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

export default function CandidateRegister() {
  const router = useRouter();
  const filterRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter, pageSize]);

  const params = {
    page,
    limit: pageSize,
    ...(statusFilter !== 'All Status' ? { status: statusFilter } : {}),
    ...(debouncedQuery.trim() ? { search: debouncedQuery.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', params],
    queryFn: async () => unwrapList((await api.get('/hiring/candidates', { params })).data),
  });

  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };
  const totalEntries = meta.total || rows.length;
  const totalPages = meta.totalPages || Math.max(1, Math.ceil(totalEntries / pageSize));

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setStatusFilter('All Status');
  };

  const statusOptions = ['All Status', 'Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected', 'Hold'];

  const topCards = [
    { title: 'Total Candidates', value: totalEntries.toString(), subtitle: 'All Time', icon: Users, bg: 'bg-blue-50', text: 'text-blue-600' },
    { title: 'In Screening', value: '-', subtitle: 'Current active', icon: Search, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { title: 'Interviewing', value: '-', subtitle: 'In process', icon: Video, bg: 'bg-purple-50', text: 'text-purple-600' },
    { title: 'Offered / Hired', value: '-', subtitle: 'Successful', icon: CheckCircle, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { title: 'Rejected', value: '-', subtitle: 'Closed', icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-600' },
  ];

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
        <div>
          <Breadcrumb
            items={[
              { label: 'Hiring', href: '/dashboard/hiring' },
              { label: 'Candidates Register' },
            ]}
          />
          <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Add Candidates</h1>
          <p className="text-[11px] text-zinc-500">View, add, edit and manage all candidates in the system.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => router.push('/dashboard/hiring/candidates/new/create')}
            className="flex items-center gap-1.5 h-8 px-2.5 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Candidate
          </button>
        </div>
      </div>
      <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10 px-2 lg:px-4">
        <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-base uppercase">CANDIDATE REGISTER</CardTitle>
          </CardHeader>
          <CardContent className="w-full overflow-hidden">
            <div className="section-card shadow-sm border border-slate-200 rounded-[4px] overflow-hidden mt-4 bg-white">
              <div className="bg-white pb-3 pt-3 px-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                  <Users className="h-4 w-4 text-[#0d3c68]" />
                  Candidate List
                </h2>
                <div className="flex items-center gap-3">
                  <Button asChild className="h-7 gap-2 bg-[#0d3c68] px-3 text-[11px] font-bold uppercase hover:bg-[#0a2e50] text-white rounded-[2px] shadow-md hover:shadow-lg transition-all tracking-wide">
                    <Link href="/dashboard/hiring/candidates/new/create"><Plus size={12} /> Add Candidate</Link>
                  </Button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-1">
                {topCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="p-3 flex items-center gap-3 bg-white border border-zinc-200 shadow-sm rounded-xl">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.bg} ${card.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{card.title}</h3>
                        <span className="text-lg font-bold text-zinc-900 leading-tight">{card.value}</span>
                        <p className="text-[10px] text-zinc-400">{card.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    {meta.total || rows.length} candidate{(meta.total || rows.length) === 1 ? '' : 's'}
                  </div>

                  {/* FILTER BAR */}
                  <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search candidate name, email, or role..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-2.5 pr-7 h-8 w-full bg-white border border-zinc-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                      />
                      <Search className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                      <button
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-40 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        {statusFilter} <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                      {isStatusOpen && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                          {statusOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                              {opt} {statusFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                            </button>
                          ))}
                        </div>
                      )}
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

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={handleClear}
                      className="h-8 px-3 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* TABLE */}
                <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 bg-zinc-50">
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Candidate</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Contact</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Role</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Source</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Resume</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Status</th>
                          <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-zinc-500 font-medium">
                              Loading candidates...
                            </td>
                          </tr>
                        ) : rows.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-zinc-500 font-medium">
                              No candidates found.
                            </td>
                          </tr>
                        ) : rows.map((candidate: any) => (
                          <tr key={candidate._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-[10px]">
                                  {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                </div>
                                <div className="leading-tight">
                                  <Link href={`/dashboard/hiring/candidates/${candidate._id}`} className="font-bold text-zinc-800 text-[11px] hover:text-indigo-600 hover:underline">
                                    {candidate.firstName} {candidate.lastName}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="block font-medium text-zinc-700">{candidate.email}</span>
                              <span className="block text-zinc-400">{candidate.phone}</span>
                            </td>
                            <td className="py-2.5 px-3 text-zinc-700 font-medium">{candidate.jobRole || '-'}</td>
                            <td className="py-2.5 px-3 text-zinc-700">{candidate.source || '-'}</td>
                            <td className="py-2.5 px-3 text-center">
                              {candidate.resumeUrl ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                  <LinkIcon className="w-3 h-3" /> Attached
                                </span>
                              ) : (
                                <span className="text-zinc-400">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${candidate.status === 'Hired' || candidate.status === 'Offered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                candidate.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                  candidate.status === 'Interviewing' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                    'bg-zinc-100 text-zinc-600 border-zinc-200'
                                }`}>
                                {candidate.status || 'Applied'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => router.push(`/dashboard/hiring/${candidate._id}`)}
                                  className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-md transition-colors"
                                  title="Open Workflow"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  // onClick={() => router.push(`/dashboard/hiring/${candidate._id}`)}
                                  className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-red-50 hover:text-red-600 border border-zinc-200 hover:border-red-200 rounded-md transition-colors"
                                  title="Delete Candidate"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                              <Link href={`/dashboard/hiring/candidates/${candidate._id}`} className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                                {candidate.firstName} {candidate.lastName}
                              </Link>
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

                  {/* TABLE FOOTER */}
                  <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="pl-2">
                      Showing {totalEntries === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
                      {Math.min(page * pageSize, totalEntries)} of {totalEntries} entries
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (page > 3) {
                            pageNum = page - 2 + i;
                            if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                          }
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-6 h-6 flex items-center justify-center border rounded-md font-semibold ${page === pageNum
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages || totalPages === 0}
                        className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
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
          </CardContent>
        </Card>
      </div>
      );
}
