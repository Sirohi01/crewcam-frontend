'use client';

import React from 'react';
import {
  Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown,
  Users, Briefcase, Calendar, Hourglass, XCircle, Star, Eye, MessageSquare, MoreVertical, LayoutGrid, Mail, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function ShortlistedCandidatesUI() {
  const [department, setDepartment] = React.useState('All Departments');

  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['shortlisted-candidates'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates');
      return res.data;
    }
  });

  const { data: departmentsRes } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/companies/departments');
      return res.data;
    }
  });

  const departmentsList = React.useMemo(() => {
    return Array.isArray(departmentsRes?.data) ? departmentsRes.data : [];
  }, [departmentsRes]);

  const candidates = React.useMemo(() => {
    const rawCandidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse?.data || []);
    return rawCandidates
      .filter((c: any) => c.status === 'Screening' || c.status === 'Interviewing')
      .filter((c: any) => department === 'All Departments' || c.department?.name === department)
      .map((c: any) => ({
        id: c._id || c.id,
        name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
        avatar: 'https://i.pravatar.cc/150?u=11',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        jobRole: c.jobRole || 'N/A',
        jobId: 'N/A',
        department: c.department?.name || 'N/A',
        experience: c.applicationDetails?.totalExperience ? `${c.applicationDetails.totalExperience} Years` : 'N/A',
        rating: c.rating || 4.0,
        matchLevel: c.rating > 4.5 ? 'Excellent Match' : c.rating > 4.0 ? 'Very Good Match' : 'Good Match',
        matchColor: c.rating > 4.0 ? 'text-emerald-500' : 'text-blue-500',
        shortlistedDate: new Date(c.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        shortlistedTime: new Date(c.updatedAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        nextStepStatus: c.status === 'Interviewing' ? 'Interview Scheduled' : 'Screening',
        nextStepDesc: 'Pending Action',
        statusBg: c.status === 'Interviewing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600',
      }));
  }, [candidatesResponse, department]);

  const stats = React.useMemo(() => {
    const total = candidates.length;
    const interviewing = candidates.filter((c: any) => c.nextStepStatus === 'Interview Scheduled').length;
    const screening = candidates.filter((c: any) => c.nextStepStatus === 'Screening').length;
    return [
      { value: total.toString(), label: 'Total Shortlisted', sub: 'In pipeline', icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
      { value: interviewing.toString(), label: 'Interview Scheduled', sub: total ? `${((interviewing / total) * 100).toFixed(1)}% of shortlisted` : '0%', icon: Calendar, bg: 'bg-emerald-50', color: 'text-emerald-500' },
      { value: screening.toString(), label: 'Awaiting Feedback', sub: total ? `${((screening / total) * 100).toFixed(1)}% of shortlisted` : '0%', icon: Hourglass, bg: 'bg-amber-50', color: 'text-amber-500' },
      { value: '0', label: 'Task Assigned', sub: '0% of shortlisted', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-500' },
      { value: '0', label: 'Moved to Hold', sub: '0% of shortlisted', icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-500' },
    ];
  }, [candidates]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-1 py-0.5 lg:px-2 lg:py-1 space-y-4 font-sans text-zinc-900 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            Shortlisted Candidates <Star size={16} className="text-zinc-400 fill-zinc-100" />
          </h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Candidates who have been shortlisted for the next round</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Upload size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Mail size={13} /> Email
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Plus size={14} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-start  gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-zinc-800 leading-tight mb-0.5">{stat.label}</span>
              <span className="text-[18px] font-bold text-zinc-900 leading-tight mb-1">{stat.value}</span>
              <span className="text-[9px] text-zinc-500">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, skills or job title..."
              className="w-1/2 text-[11px] pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors bg-zinc-50/50 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-700 text-[9px] text-white ml-1">0</span>
            </button>
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 pt-3 border-t border-zinc-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Job Opening</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option>All Openings</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Department</label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option value="All Departments">All Departments</option>
                {departmentsList.map((dept: any) => (
                  <option key={dept._id || dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Experience</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option>All Experience</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Current Location</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option>All Locations</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Shortlisted On</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-7 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm">
                <option>01 Jun 2026 - 15 Jun 2026</option>
              </select>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-[14px] w-[14px] border border-zinc-400 rounded-[3px] pointer-events-none">
                <span className="text-[7px] text-zinc-500">📅</span>
              </div>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Sort By</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm">
                <option>Latest Shortlisted</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Table Tabs and Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-2 border-b border-zinc-100 bg-white">
          <div className="flex flex-wrap items-center gap-1 mb-2 md:mb-0 px-2">
            <button className="px-3 pb-1 border-b-2 border-indigo-700 text-[11px] font-bold text-indigo-700">
              All Shortlisted ({candidates.length})
            </button>
            <button className="px-3 pb-1 border-b-2 border-transparent text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
              Interview Scheduled (18)
            </button>
            <button className="px-3 pb-1 border-b-2 border-transparent text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
              Awaiting Feedback (6)
            </button>
            <button className="px-3 pb-1 border-b-2 border-transparent text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
              Moved to Hold (3)
            </button>
          </div>
          <div className="flex items-center gap-2 px-2">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <LayoutGrid size={13} /> Columns
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Download size={13} /> Download List <ChevronDown size={12} className="ml-1 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-600 border-b border-zinc-100">
                <th className="px-3 py-2 font-bold w-10 text-center"><input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" /></th>
                <th className="px-3 py-2 font-bold">Candidate</th>
                <th className="px-3 py-2 font-bold">Job Opening</th>
                <th className="px-3 py-2 font-bold">Department</th>
                <th className="px-3 py-2 font-bold">Experience</th>
                <th className="px-3 py-2 font-bold">Overall Rating</th>
                <th className="px-3 py-2 font-bold">Shortlisted On</th>
                <th className="px-3 py-2 font-bold">Next Step</th>
                <th className="px-3 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-[12px] text-zinc-500">No shortlisted candidates</td></tr>
              ) : candidates.map((app: any) => (
                <tr key={app.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 border border-zinc-200">
                        {app.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-zinc-900">{app.name}</span>
                        <span className="text-[9px] font-medium text-zinc-800">{app.email}</span>
                        <span className="text-[9px] text-zinc-500">{app.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-900 font-bold">{app.jobRole}</span>
                      <span className="text-zinc-500 text-[9px]">{app.jobId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-zinc-700 font-medium">{app.department}</td>
                  <td className="px-3 py-2 font-medium text-zinc-700">{app.experience}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-900 font-bold">{app.rating}/5</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={9} className={star <= Math.floor(app.rating) ? "fill-amber-400 text-amber-400" : (star === Math.ceil(app.rating) ? "fill-amber-400/50 text-amber-400" : "fill-zinc-200 text-zinc-200")} />
                        ))}
                      </div>
                      <span className={`text-[9px] font-bold ${app.matchColor}`}>{app.matchLevel}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-900 font-medium">{app.shortlistedDate}</span>
                      <span className="text-zinc-500 text-[9px]">{app.shortlistedTime}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${app.statusBg}`}>
                        {app.nextStepStatus}
                      </span>
                      <span className="text-zinc-700 font-medium">{app.nextStepDesc}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <Eye size={12} />
                      </button>
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

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-t border-zinc-100 bg-white">
          <div className="text-[11px] text-zinc-500 font-medium">
            Showing {candidates.length > 0 ? 1 : 0} to {Math.min(10, candidates.length)} of {candidates.length} entries
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
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

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm">
              <span className="text-[10px]">←</span>
            </button>
            <button className="h-6 w-6 rounded bg-indigo-700 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="h-6 w-6 rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">
              2
            </button>
            <button className="h-6 w-6 rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">
              3
            </button>
            <button className="h-6 w-6 rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">
              4
            </button>
            <button className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm">
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
