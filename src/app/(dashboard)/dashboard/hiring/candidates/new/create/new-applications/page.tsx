'use client';

import React from 'react';
import Link from 'next/link';
import {
  Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown,
  User, Calendar, Clock, Briefcase, Mail, Eye, MessageSquare, MoreVertical, LayoutGrid, FileText,
  Link2, Globe, Users, Info, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function NewApplicationsPage() {
  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['new-applications'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates', { params: { status: 'Applied' } });
      return res.data;
    }
  });

  const applications = React.useMemo(() => {
    const rawCandidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse?.data || []);
    return rawCandidates.map((c: any) => ({
      id: c._id || c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
      avatar: 'https://i.pravatar.cc/150?u=11', // placeholder
      email: c.email || 'N/A',
      phone: c.phone || 'N/A',
      jobRole: c.jobRole || 'N/A',
      jobId: 'N/A',
      experience: c.applicationDetails?.totalExperience ? `${c.applicationDetails.totalExperience} Years` : 'N/A',
      source: c.source || 'Direct',
      sourceType: c.source?.toLowerCase() === 'linkedin' ? 'linkedin' : c.source?.toLowerCase().includes('naukri') ? 'naukri' : 'website',
      appliedOnDate: new Date(c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      appliedOnTime: new Date(c.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      resumeName: 'Resume.pdf',
      resumeSize: '512 KB',
      status: 'New',
    }));
  }, [candidatesResponse]);

  const stats = React.useMemo(() => {
    const total = applications.length;
    return [
      { label: 'Total New Applications', value: total.toString(), sub1: 'Since last login', bg: 'bg-indigo-50', color: 'text-indigo-600', icon: User },
      { label: 'Applied Today', value: total > 0 ? '1' : '0', sub1: '12% increase from yesterday', subColor: 'text-emerald-500', bg: 'bg-emerald-50', color: 'text-emerald-600', icon: Calendar },
      { label: 'Pending Review', value: total.toString(), sub1: 'Needs attention', subColor: 'text-rose-500', bg: 'bg-rose-50', color: 'text-rose-600', icon: Clock },
      { label: 'Most Applied Job', value: 'Sales Manager', sub1: '32 applications', bg: 'bg-blue-50', color: 'text-blue-600', icon: Briefcase },
      { label: 'Top Source', value: 'Naukri.com', sub1: '45% of total applications', bg: 'bg-amber-50', color: 'text-amber-600', icon: Globe },
    ];
  }, [applications]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-1 py-0.5 lg:px-2 lg:py-1 space-y-4 font-sans text-zinc-900  min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">New Applications</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Recently received job applications that are new to the system</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Upload size={13} /> Import
          </button>
          <button onClick={() => window.open("/dashboard/hiring/candidates/new/create", '_blank')} className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Plus size={14} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-start gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[18px] font-bold text-zinc-900 leading-tight mb-0.5">{stat.value}</span>
              <span className="text-[10px] font-semibold text-zinc-800 leading-tight">{stat.label}</span>
              {stat.sub1 && <span className="text-[9px] text-zinc-500">{stat.sub1}</span>}
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
              placeholder="Search by name, email, phone, job title or skills..."
              className="w-1/2 text-[11px] pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors bg-zinc-50/50 placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-700 text-[9px] text-white ml-1">0</span>
            </button>
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 pt-3 border-t border-zinc-100">
          {[
            { label: 'Job Opening', value: 'All Openings' },
            { label: 'Department', value: 'All Departments' },
            { label: 'Experience', value: 'All Experience' },
            { label: 'Source', value: 'All Sources' },
            { label: 'Location', value: 'All Locations' },
          ].map((filter, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-zinc-700">{filter.label}</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                  <option>{filter.value}</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Date Range</label>
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Table Tabs and Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-2 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-1 mb-2 md:mb-0 px-2">
            <button className="px-3 pb-1 border-b-2 border-indigo-700 text-[11px] font-bold text-indigo-700">
              All New Applications ({applications.length})
            </button>
            <button className="px-3 pb-1 border-b-2 border-transparent text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
              Today (9)
            </button>
            <button className="px-3 pb-1 border-b-2 border-transparent text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
              This Week (24)
            </button>
          </div>
          <div className="flex items-center gap-2 px-2">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <LayoutGrid size={13} /> Columns
            </button>
            <div className="relative">
              <select className="appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-7 py-1.5 text-[10px] font-semibold text-zinc-700 focus:outline-none shadow-sm min-w-[120px]">
                <option>Newest First</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] whitespace-nowrap">
            <thead>
              <tr className="bg-blue-50 text-zinc-600 border-b border-zinc-100">
                <th className="px-3 py-2 font-bold w-10 text-center"><input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" /></th>
                <th className="px-3 py-2 font-bold">Candidate</th>
                <th className="px-3 py-2 font-bold">Job Applied For</th>
                <th className="px-3 py-2 font-bold">Experience</th>
                <th className="px-3 py-2 font-bold">Source</th>
                <th className="px-3 py-2 font-bold">Applied On</th>
                <th className="px-3 py-2 font-bold">Resume</th>
                <th className="px-3 py-2 font-bold">Status</th>
                <th className="px-3 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-[12px] text-zinc-500">No applications found</td></tr>
              ) : applications.map((app: any) => (
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
                  <td className="px-3 py-2 font-medium text-zinc-700">{app.experience}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      {app.sourceType === 'naukri' && <div className="h-4 w-4 bg-blue-600 text-white rounded text-[8px] font-bold flex items-center justify-center">n</div>}
                      {app.sourceType === 'linkedin' && <Link2 size={14} className="text-blue-600" />}
                      {app.sourceType === 'referral' && <Users size={14} className="text-emerald-600" />}
                      {app.sourceType === 'website' && <Globe size={14} className="text-blue-500" />}
                      <span className="font-medium">{app.source}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-900 font-medium">{app.appliedOnDate}</span>
                      <span className="text-zinc-500 text-[9px]">{app.appliedOnTime}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <FileText size={16} className="text-rose-500" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800 font-medium">{app.resumeName}</span>
                        <span className="text-zinc-500 text-[9px]">({app.resumeSize})</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {app.status}
                    </span>
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
          <div className='flex items-center gap-32'>
            <div className="text-[11px] text-zinc-500 font-medium mt-2 sm:mt-0">
              Showing {applications.length > 0 ? 1 : 0} to {Math.min(10, applications.length)} of {applications.length} entries
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
            <button className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm">
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
