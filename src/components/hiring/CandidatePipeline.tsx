'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import {
  Users, Send, Filter, Mail, UserCheck, XCircle,
  Search, Calendar, ChevronDown, Plus
} from 'lucide-react';

const STAGES = ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'];

const STAGE_CONFIG: Record<string, { color: string; border: string; bg: string; icon: any; emptyDesc: string }> = {
  'Applied': {
    color: 'text-indigo-600', border: 'border-indigo-600', bg: 'bg-indigo-50',
    icon: Send, emptyDesc: 'Move candidates here when they apply.'
  },
  'Screening': {
    color: 'text-sky-600', border: 'border-sky-500', bg: 'bg-sky-50',
    icon: Filter, emptyDesc: 'Move candidates here to start screening.'
  },
  'Interviewing': {
    color: 'text-orange-600', border: 'border-orange-500', bg: 'bg-orange-50',
    icon: Users, emptyDesc: 'Move candidates here to schedule interviews.'
  },
  'Offered': {
    color: 'text-emerald-600', border: 'border-emerald-500', bg: 'bg-emerald-50',
    icon: Mail, emptyDesc: 'Move candidates here when offering the role.'
  },
  'Hired': {
    color: 'text-purple-600', border: 'border-purple-500', bg: 'bg-purple-50',
    icon: UserCheck, emptyDesc: 'Move candidates here once they join.'
  },
  'Rejected': {
    color: 'text-rose-600', border: 'border-rose-500', bg: 'bg-rose-50',
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
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10 px-2 lg:px-4">
      {/* Header Section */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-3 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5">
              CANDIDATE PIPELINE
            </span>
            <span className="text-xs text-slate-500 ml-2 hidden sm:inline">Track candidates by current hiring stage.</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="h-7 gap-2 bg-[#0d3c68] px-3 text-[11px] font-bold uppercase hover:bg-[#0a2e50] text-white rounded-[2px]"
              onClick={() => router.push('/dashboard/hiring/candidates/new')}
            >
              <Plus size={12} /> Add Candidate
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mx-2">
        {/* Total Card */}
        <div className="flex flex-col justify-between rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] bg-slate-100 text-[#0d3c68]">
              <Users size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-1">Total</p>
              <h3 className="text-lg font-extrabold text-[#0d3c68] leading-none">{totalCount}</h3>
            </div>
          </div>
        </div>

        {/* Stage Cards */}
        {STAGES.map(stage => {
          const config = STAGE_CONFIG[stage];
          const count = filteredCandidates.filter(c => c.status === stage).length;
          const Icon = config.icon;

          return (
            <div key={stage} className="flex flex-col justify-between rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] ${config.bg} ${config.color}`}>
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-1">{stage}</p>
                  <h3 className="text-lg font-extrabold text-slate-800 leading-none">{count}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mx-2 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px] max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by name, email, or job role..."
                className="w-full rounded-[2px] border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0d3c68] focus:outline-none focus:ring-1 focus:ring-[#0d3c68]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-[180px]">
              <select className="w-full appearance-none rounded-[2px] border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-800 focus:border-[#0d3c68] focus:outline-none focus:ring-1 focus:ring-[#0d3c68]">
                <option value="">All Departments</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div className="relative w-[180px]">
              <select className="w-full appearance-none rounded-[2px] border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-800 focus:border-[#0d3c68] focus:outline-none focus:ring-1 focus:ring-[#0d3c68]">
                <option value="">All Job Roles</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2 h-7 px-3 rounded-[2px] border-slate-300 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <Filter size={12} /> Filters
            </Button>
            <button
              className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] hover:text-[#0a2e50]"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 mx-2 h-[calc(100vh-270px)] min-h-[400px] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300">
        {isLoading ? (
          <div className="w-full py-20 text-center text-sm font-medium text-slate-500">Loading pipeline...</div>
        ) : (
          STAGES.map((stage) => {
            const config = STAGE_CONFIG[stage];
            const rows = filteredCandidates.filter((candidate) => candidate.status === stage);
            const Icon = config.icon;

            return (
              <section
                key={stage}
                className="flex w-[320px] shrink-0 flex-col rounded-[4px] border border-slate-200 bg-slate-50 relative overflow-hidden shadow-sm"
              >
                {/* Colored Top Border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-current ${config.color}`} />

                {/* Column Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white mt-1">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    {stage}
                  </h2>
                  <span className={`rounded-[2px] px-2 py-0.5 text-[10px] font-bold ${config.bg} ${config.color}`}>
                    {rows.length}
                  </span>
                </div>

                {/* Column Body */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${config.bg} mb-3`}>
                        <Icon size={20} className={config.color} strokeWidth={2} />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">No candidates</p>
                      <p className="mt-1 text-[10px] text-slate-400 max-w-[200px]">
                        {config.emptyDesc}
                      </p>
                    </div>
                  ) : (
                    rows.map((candidate) => (
                      <article
                        key={candidate._id}
                        className="group flex flex-col rounded-[4px] border border-slate-200 bg-white p-3 shadow-sm hover:border-[#0d3c68]/30 transition-all"
                      >
                        <div
                          className="flex items-start gap-2.5 cursor-pointer"
                          onClick={() => router.push(`/dashboard/hiring/${candidate._id}`)}
                        >
                          {/* Avatar */}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 overflow-hidden">
                            {candidate.profileImageUrl ? (
                              <img src={candidate.profileImageUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              getInitials(candidate.firstName, candidate.lastName)
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="truncate text-xs font-bold text-slate-900 leading-tight">
                              {candidate.firstName} {candidate.lastName}
                            </h3>
                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#0d3c68] mt-1 leading-tight">
                              {candidate.jobRole || 'Not specified'}
                            </p>
                            <p className="truncate text-[10px] text-slate-500 mt-1 leading-tight">
                              {candidate.email}
                            </p>
                          </div>
                        </div>

                        {/* Badges / Date */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                            <Calendar size={10} />
                            {formatDate(candidate.createdAt)}
                          </div>
                          <div className={`rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${config.bg} ${config.color}`}>
                            {stage}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-2.5">
                          {stage !== 'Applied' && (
                            <button
                              className="flex-1 rounded-[2px] border border-slate-200 bg-white py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors"
                              onClick={() => updateStatus.mutate({ id: candidate._id, status: STAGES[STAGES.indexOf(stage) - 1] })}
                            >
                              Back
                            </button>
                          )}
                          {!['Hired', 'Rejected'].includes(stage) && (
                            <button
                              className="flex-1 rounded-[2px] border border-[#0d3c68] bg-[#0d3c68] py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#0a2e50] transition-colors"
                              onClick={() => updateStatus.mutate({ id: candidate._id, status: STAGES[STAGES.indexOf(stage) + 1] })}
                            >
                              Move
                            </button>
                          )}
                          {!['Hired', 'Rejected'].includes(stage) && (
                            <button
                              className="flex-1 rounded-[2px] border border-rose-200 bg-white py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors"
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
                <div className="p-2 border-t border-slate-200 bg-white">
                  <button
                    className={`flex w-full items-center justify-center gap-1.5 rounded-[2px] py-1.5 text-[10px] font-bold uppercase tracking-wider ${config.color} hover:${config.bg} transition-colors`}
                    onClick={() => router.push('/dashboard/hiring/candidates/new')}
                  >
                    <Plus size={12} /> Add Candidate
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
