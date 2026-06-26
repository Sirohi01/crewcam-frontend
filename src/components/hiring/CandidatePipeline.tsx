'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import {
  Users, Send, FileSearch, Mail, UserCheck, XCircle,
  Search, Filter, Calendar, ChevronDown, Plus
} from 'lucide-react';

const STAGES = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

const STAGE_CONFIG: Record<string, { color: string; border: string; bg: string; icon: any; emptyDesc: string }> = {
  'Applied': {
    color: 'text-indigo-600', border: 'border-indigo-600', bg: 'bg-indigo-50',
    icon: Send, emptyDesc: 'Move candidates here when they apply.'
  },
  'Screening': {
    color: 'text-sky-500', border: 'border-sky-500', bg: 'bg-sky-50',
    icon: Filter, emptyDesc: 'Move candidates here to start screening.'
  },
  'Interviewing': {
    color: 'text-orange-500', border: 'border-orange-500', bg: 'bg-orange-50',
    icon: Users, emptyDesc: 'Move candidates here to schedule interviews.'
  },
  'Offered': {
    color: 'text-emerald-500', border: 'border-emerald-500', bg: 'bg-emerald-50',
    icon: Mail, emptyDesc: 'Move candidates here when offering the role.'
  },
  'Hired': {
    color: 'text-purple-500', border: 'border-purple-500', bg: 'bg-purple-50',
    icon: UserCheck, emptyDesc: 'Move candidates here once they join.'
  },
  'Rejected': {
    color: 'text-rose-500', border: 'border-rose-500', bg: 'bg-rose-50',
    icon: XCircle, emptyDesc: 'Move rejected candidates here for records.'
  }
};

function getInitials(firstName: string, lastName: string) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase() || 'U';
}

function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CandidatePipeline() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: candidates, isLoading } = useQuery<any[]>({
    queryKey: ['candidates'],
    queryFn: async () => (await api.get('/hiring/candidates')).data
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => (await api.put(`/hiring/candidates/${id}/status`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidates'] })
  });

  const allCandidates = candidates || [];
  const filteredCandidates = allCandidates.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.firstName || '').toLowerCase().includes(term) ||
      (c.lastName || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.jobRole || '').toLowerCase().includes(term)
    );
  });

  const totalCount = filteredCandidates.length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-1.5 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-1.5 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Candidate Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Track candidates by current hiring stage. Open a card for the full 24-step workflow.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm h-9 px-4 text-sm font-medium flex items-center gap-1.5"
          onClick={() => router.push('/dashboard/hiring/candidates/new')}
        >
          <Plus size={16} /> Add Candidate
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {/* Total Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-none mb-1.5">Total Candidates</p>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">{totalCount}</h3>
            </div>
          </div>
          {/* <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-2.5">Across all stages</p> */}
        </div>

        {/* Stage Cards */}
        {STAGES.map(stage => {
          const config = STAGE_CONFIG[stage];
          const count = filteredCandidates.filter(c => c.status === stage).length;
          const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
          const Icon = config.icon;

          return (
            <div key={stage} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color} dark:bg-zinc-800`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 leading-none mb-1.5">{stage}</p>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">{count}</h3>
                </div>
              </div>
              {/* <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-2.5">{percentage}% of total</p> */}
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-0.5">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px] max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or job role..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-[200px]">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <option value="">All Departments</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative w-[200px]">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
              <option value="">All Job Roles</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 h-10 px-4 border-slate-200 text-slate-700 dark:border-zinc-700 dark:text-zinc-300">
            <Filter size={16} /> Filters
          </Button>
          <button
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-240px)] min-h-[400px] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
        {isLoading ? (
          <div className="w-full py-20 text-center text-sm text-slate-500">Loading pipeline...</div>
        ) : (
          STAGES.map((stage) => {
            const config = STAGE_CONFIG[stage];
            const rows = filteredCandidates.filter((candidate) => candidate.status === stage);
            const Icon = config.icon;

            return (
              <section
                key={stage}
                className="flex w-[320px] shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/40 relative overflow-hidden"
              >
                {/* Colored Top Border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-current ${config.color}`} />

                {/* Column Header */}
                <div className="flex items-center justify-between p-4 pb-2 mt-1">
                  <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {stage}
                  </h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${config.bg} ${config.color} dark:bg-zinc-800`}>
                    {rows.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${config.bg} mb-4 dark:bg-zinc-800`}>
                        <Icon size={28} className={config.color} strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No candidates in this stage</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500 max-w-[200px]">
                        {config.emptyDesc}
                      </p>
                    </div>
                  ) : (
                    rows.map((candidate) => (
                      <article
                        key={candidate._id}
                        className="group flex flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300 hover:shadow transition-all dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        <div
                          className="flex items-start gap-2.5 cursor-pointer"
                          onClick={() => router.push(`/dashboard/hiring/${candidate._id}`)}
                        >
                          {/* Avatar */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-zinc-700 dark:text-zinc-300 overflow-hidden">
                            {candidate.profileImageUrl ? (
                              <img src={candidate.profileImageUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              getInitials(candidate.firstName, candidate.lastName)
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                              {candidate.firstName} {candidate.lastName}
                            </h3>
                            <p className="truncate text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 leading-tight">
                              {candidate.jobRole || 'Not specified'}
                            </p>
                            <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-tight">
                              {candidate.email}
                            </p>
                          </div>
                        </div>

                        {/* Badges / Date */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            <Calendar size={12} />
                            {formatDate(candidate.createdAt)}
                          </div>
                          <div className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${config.bg} ${config.color} dark:bg-zinc-700`}>
                            {stage}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-2.5 dark:border-zinc-700">
                          {stage !== 'Applied' && (
                            <button
                              className="flex-1 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                              onClick={() => updateStatus.mutate({ id: candidate._id, status: STAGES[STAGES.indexOf(stage) - 1] })}
                            >
                              Back
                            </button>
                          )}
                          {!['Hired', 'Rejected'].includes(stage) && (
                            <button
                              className="flex-1 rounded-md border border-slate-200 bg-white py-1 text-[11px] font-medium text-slate-800 hover:bg-slate-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 transition-colors"
                              onClick={() => updateStatus.mutate({ id: candidate._id, status: STAGES[STAGES.indexOf(stage) + 1] })}
                            >
                              Move
                            </button>
                          )}
                          {!['Hired', 'Rejected'].includes(stage) && (
                            <button
                              className="flex-1 rounded-md border border-red-100 bg-white py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                              onClick={() => updateStatus.mutate({ id: candidate._id, status: 'Rejected' })}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {/* Column Footer Add Button */}
                <div className="p-3 border-t border-slate-200/60 dark:border-zinc-800">
                  <button
                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium ${config.color} hover:${config.bg} transition-colors dark:hover:bg-zinc-800`}
                    onClick={() => router.push('/dashboard/hiring/candidates/new')}
                  >
                    <Plus size={14} /> Add Candidate
                  </button>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
