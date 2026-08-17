'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown,
  Users, FileText, Star, Briefcase, XCircle, UserCheck, Eye, MessageSquare, MoreVertical, LayoutGrid, Loader2
} from 'lucide-react';
<<<<<<< HEAD
import api from '@/lib/axios';

const PAGE_SIZE = 10;

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}
=======
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
>>>>>>> 777a016f4c530ed434c7c00384bb420dac93a80e

const STATUS_STYLE: Record<string, string> = {
  'Applied':      'bg-slate-100 text-slate-700',
  'Screening':    'bg-blue-50 text-blue-700',
  'Interviewing': 'bg-amber-50 text-amber-700',
  'Offered':      'bg-purple-50 text-purple-700',
  'Hired':        'bg-emerald-50 text-emerald-700',
  'Rejected':     'bg-rose-50 text-rose-700',
};

export default function CandidateRegisterUI() {
<<<<<<< HEAD
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
    queryKey: ['all-candidates', params],
    queryFn: async () => unwrapList((await api.get('/hiring/candidates', { params })).data),
  });

  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  // Stats derived from API total (static breakdowns as placeholder until API exposes them)
  const STATS = [
    { label: 'Total Candidates',  value: meta.total?.toLocaleString() || '0',  sub: 'In database',           icon: Users,     bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'New This Week',      value: '-',   sub: '',                                icon: FileText,  bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Shortlisted',        value: '-',   sub: '',                                icon: Star,      bg: 'bg-amber-50',   color: 'text-amber-600' },
    { label: 'Active in Process',  value: '-',   sub: '',                                icon: Briefcase, bg: 'bg-blue-50',    color: 'text-blue-600' },
    { label: 'Rejected',           value: '-',   sub: '',                                icon: XCircle,   bg: 'bg-rose-50',    color: 'text-rose-600' },
    { label: 'Hired',              value: '-',   sub: '',                                icon: UserCheck, bg: 'bg-purple-50',  color: 'text-purple-600' },
  ];
=======
  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['all-candidates'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates');
      return res.data;
    }
  });

  const candidates = React.useMemo(() => {
    const rawCandidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse?.data || []);
    return rawCandidates.map((c: any) => ({
      id: c._id || c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
      rating: c.rating || 4.0,
      avatar: 'https://i.pravatar.cc/150?u=1', // Placeholder avatar
      email: c.email || 'N/A',
      phone: c.phone || 'N/A',
      currentRole: c.applicationDetails?.currentRole || 'N/A',
      company: c.applicationDetails?.currentCompany || 'N/A',
      experience: c.applicationDetails?.totalExperience ? `${c.applicationDetails.totalExperience} Years` : 'N/A',
      skills: c.skills?.length ? c.skills.slice(0, 3) : ['Skill 1', 'Skill 2'],
      jobAppliedFor: c.jobRole || 'N/A',
      jobId: 'N/A',
      source: c.source || 'Direct',
      status: c.status || 'Active',
      stage: 'N/A',
      addedOn: new Date(c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      addedDaysAgo: 'recently',
    }));
  }, [candidatesResponse]);

  const stats = React.useMemo(() => {
    const total = candidates.length;
    return [
      { label: 'Total Candidates', value: total.toString(), sub: 'In database', icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
      { label: 'New This Week', value: total > 0 ? '1' : '0', sub: 'Recent applications', subColor: 'text-emerald-500', icon: FileText, bg: 'bg-emerald-50', color: 'text-emerald-600' },
      { label: 'Shortlisted', value: candidates.filter((c: any) => c.status === 'Screening' || c.status === 'Interviewing').length.toString(), sub: 'Progressing', icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
      { label: 'Active in Process', value: candidates.filter((c: any) => c.status !== 'Rejected' && c.status !== 'Hired').length.toString(), sub: 'Currently active', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
      { label: 'Rejected', value: candidates.filter((c: any) => c.status === 'Rejected').length.toString(), sub: 'Did not match', icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-600' },
      { label: 'Hired', value: candidates.filter((c: any) => c.status === 'Hired').length.toString(), sub: 'Joined team', icon: UserCheck, bg: 'bg-purple-50', color: 'text-purple-600' },
    ];
  }, [candidates]);
>>>>>>> 777a016f4c530ed434c7c00384bb420dac93a80e

  return (
    <div className="w-full max-w-[1600px] px-1 py-0.5 lg:px-2 lg:py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">All Candidates</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Browse and manage all candidates in the database</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Upload size={13} /> Import
          </button>
          <Link href="/dashboard/hiring/candidates/new/create" className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Plus size={14} /> Add Candidate
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-start gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-medium text-zinc-500">{stat.label}</span>
              <span className="text-[18px] font-bold text-zinc-900 leading-tight my-0.5">{stat.value}</span>
              {stat.sub && <span className="text-[9px] text-zinc-400">{stat.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, skills or job title..."
              className="w-1/2 text-[11px] pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors bg-zinc-50/50 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
            </button>
            <button onClick={() => { setQuery(''); setStatus('All'); }} className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 pt-3 border-t border-zinc-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium"
              >
                <option value="All">All Status</option>
                <option>Applied</option>
                <option>Screening</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Hired</option>
                <option>Rejected</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
          {[
            { label: 'Job Opening',       value: 'All Openings' },
            { label: 'Department',        value: 'All Departments' },
            { label: 'Experience',        value: 'All Experience' },
            { label: 'Current Location',  value: 'All Locations' },
            { label: 'Source',            value: 'All Sources' },
          ].map((filter, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-zinc-700">{filter.label}</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                  <option>{filter.value}</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-zinc-100 bg-white">
          <p className="text-[12px] font-bold text-zinc-800">{meta.total} Candidates Found</p>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <LayoutGrid size={13} /> Columns
            </button>
            <div className="relative">
              <select className="appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-7 py-1.5 text-[10px] font-semibold text-zinc-700 focus:outline-none shadow-sm min-w-[120px]">
                <option>Recently Added</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] whitespace-nowrap">
            <thead>
              <tr className="bg-indigo-50/30 text-zinc-600 border-b border-zinc-100">
                <th className="px-2 py-2 font-bold w-10 text-center"><input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" /></th>
                <th className="px-2 py-2 font-bold">Candidate</th>
                <th className="px-6 py-2 font-bold">Contact</th>
                <th className="px-2 py-2 font-bold">Current Role</th>
                <th className="px-2 py-2 font-bold">Experience</th>
                <th className="px-2 py-2 font-bold">Skills</th>
                <th className="px-2 py-2 font-bold">Job Applied For</th>
                <th className="px-2 py-2 font-bold">Source</th>
                <th className="px-2 py-2 font-bold">Status</th>
                <th className="px-2 py-2 font-bold">Stage</th>
                <th className="px-2 py-2 font-bold">Added On</th>
                <th className="px-2 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
<<<<<<< HEAD
            <tbody className="divide-y divide-zinc-50">
              {isLoading && (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-zinc-500 text-sm">Loading candidates...</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-zinc-500 text-sm">No candidates found.</td></tr>
              )}
              {!isLoading && rows.map((c: any) => (
                <tr key={c._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.profilePictureUrl || `https://i.pravatar.cc/150?u=${c._id}`}
                        alt={c.firstName}
                        className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm object-cover"
                      />
                      <div className="flex flex-col">
                        <Link href={`/dashboard/hiring/candidates/${c._id}`} className="font-bold text-zinc-900 hover:text-indigo-600">
                          {c.firstName} {c.lastName}
                        </Link>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={9} className={s <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'} />
                          ))}
=======
            <tbody className="divide-y divide-zinc-100 bg-white">
              {isLoading ? (
                <tr><td colSpan={12} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={12} className="py-10 text-center text-[12px] text-zinc-500">No candidates found</td></tr>
              ) : candidates.map((c: any) => (
                <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-[9px] font-bold text-zinc-500 border border-zinc-200">
                        {c.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </span>
                      <div className="flex flex-col">
                        <Link href={`/dashboard/hiring/candidates/${c.id}`} className="text-indigo-700 font-bold hover:underline">{c.name}</Link>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={8} className="fill-amber-400 text-amber-400" />
                          <span className="text-[9px] font-medium text-zinc-600">{c.rating}</span>
>>>>>>> 777a016f4c530ed434c7c00384bb420dac93a80e
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800 font-medium">{c.email}</span>
                      <span className="text-zinc-500">{c.phone}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800 font-medium">{c.currentRole || c.jobRole || '-'}</span>
                      <span className="text-zinc-500">{c.currentCompany || '-'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 font-medium text-zinc-700">{c.totalExperience ? `${c.totalExperience} Yrs` : '-'}</td>
                  <td className="px-2 py-2">
                    <div className="flex flex-wrap gap-1 w-40 whitespace-normal">
<<<<<<< HEAD
                      {(c.skills || []).slice(0, 3).map((skill: string, idx: number) => (
=======
                      {c.skills.map((skill: string, idx: number) => (
>>>>>>> 777a016f4c530ed434c7c00384bb420dac93a80e
                        <span key={idx} className="bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                      {(c.skills || []).length > 3 && (
                        <span className="bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800 font-medium">{c.appliedJobTitle || c.jobRole || '-'}</span>
                      <span className="text-zinc-400 text-[9px]">{c.jobId || '-'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-zinc-700">{c.source || '-'}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${STATUS_STYLE[c.status] || 'bg-zinc-100 text-zinc-700'}`}>
                      {c.status || 'Applied'}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-zinc-800 font-medium">{c.currentStage || c.pipelineStage || '-'}</td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800">{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link href={`/dashboard/hiring/candidates/${c._id}`} className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <Eye size={12} />
                      </Link>
                      <button className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <MessageSquare size={12} />
                      </button>
                      <button className="h-6 w-6 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 bg-white shadow-sm transition-colors">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-zinc-100 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium">Show</span>
            <div className="relative">
              <select className="appearance-none rounded border border-zinc-200 bg-white pl-2 pr-6 py-1 text-[11px] font-medium text-zinc-700 focus:outline-none shadow-sm">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">entries</span>
          </div>

          <div className="text-[11px] text-zinc-500 font-medium mt-2 sm:mt-0">
<<<<<<< HEAD
            Showing {rows.length} of {meta.total} entries (Page {meta.page || page} of {meta.totalPages || 1})
=======
            Showing {candidates.length > 0 ? 1 : 0} to {Math.min(10, candidates.length)} of {candidates.length} entries
>>>>>>> 777a016f4c530ed434c7c00384bb420dac93a80e
          </div>

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm disabled:opacity-40"
            >
              <span className="text-[10px]">←</span>
            </button>
            {Array.from({ length: Math.min(meta.totalPages || 1, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shadow-sm ${p === page ? 'bg-indigo-700 text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50 bg-white'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={page >= (meta.totalPages || 1) || isLoading}
              className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm disabled:opacity-40"
            >
              <span className="text-[10px]">â†’</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
