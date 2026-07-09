'use client';

import React from 'react';
import {
  Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown,
  Users, Briefcase, Calendar, Hourglass, XCircle, Star, Eye, MessageSquare, MoreVertical, LayoutGrid, Mail
} from 'lucide-react';

const CANDIDATES = [
  {
    id: 1,
    name: 'Rahul Sharma',
    avatar: 'https://i.pravatar.cc/150?u=11',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    jobRole: 'Sales Manager',
    jobId: 'JOB-2026-051',
    department: 'Sales & Marketing',
    experience: '7 Years',
    rating: 4.6,
    matchLevel: 'Excellent Match',
    matchColor: 'text-emerald-500',
    shortlistedDate: '15 Jun 2026',
    shortlistedTime: '10:24 AM',
    nextStepStatus: 'Interview Scheduled',
    nextStepDesc: '16 Jun 2026, 11:00 AM',
    statusBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 2,
    name: 'Priya Singh',
    avatar: 'https://i.pravatar.cc/150?u=12',
    email: 'priya.singh@email.com',
    phone: '+91 91234 56789',
    jobRole: 'HR Executive',
    jobId: 'JOB-2026-050',
    department: 'Human Resources',
    experience: '6 Years',
    rating: 4.3,
    matchLevel: 'Very Good Match',
    matchColor: 'text-emerald-500',
    shortlistedDate: '14 Jun 2026',
    shortlistedTime: '03:45 PM',
    nextStepStatus: 'Awaiting Feedback',
    nextStepDesc: 'HR Interview',
    statusBg: 'bg-amber-50 text-amber-600',
  },
  {
    id: 3,
    name: 'Amit Patel',
    avatar: 'https://i.pravatar.cc/150?u=13',
    email: 'amit.patel@email.com',
    phone: '+91 99887 66554',
    jobRole: 'Software Developer',
    jobId: 'JOB-2026-049',
    department: 'IT Department',
    experience: '5 Years',
    rating: 4.7,
    matchLevel: 'Excellent Match',
    matchColor: 'text-emerald-500',
    shortlistedDate: '13 Jun 2026',
    shortlistedTime: '11:32 AM',
    nextStepStatus: 'Interview Scheduled',
    nextStepDesc: '17 Jun 2026, 02:00 PM',
    statusBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 4,
    name: 'Neha Gupta',
    avatar: 'https://i.pravatar.cc/150?u=14',
    email: 'neha.gupta@email.com',
    phone: '+91 90123 45678',
    jobRole: 'Digital Marketing Executive',
    jobId: 'JOB-2026-048',
    department: 'Marketing',
    experience: '4 Years',
    rating: 4.2,
    matchLevel: 'Very Good Match',
    matchColor: 'text-emerald-500',
    shortlistedDate: '12 Jun 2026',
    shortlistedTime: '04:20 PM',
    nextStepStatus: 'Awaiting Feedback',
    nextStepDesc: 'Managerial Interview',
    statusBg: 'bg-amber-50 text-amber-600',
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    avatar: 'https://i.pravatar.cc/150?u=15',
    email: 'vikram.mehta@email.com',
    phone: '+91 98712 34567',
    jobRole: 'UI/UX Designer',
    jobId: 'JOB-2026-046',
    department: 'IT Department',
    experience: '3 Years',
    rating: 4.1,
    matchLevel: 'Good Match',
    matchColor: 'text-blue-500',
    shortlistedDate: '10 Jun 2026',
    shortlistedTime: '09:15 AM',
    nextStepStatus: 'Interview Scheduled',
    nextStepDesc: '18 Jun 2026, 10:30 AM',
    statusBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 6,
    name: 'Saurabh Kumar',
    avatar: 'https://i.pravatar.cc/150?u=16',
    email: 'saurabh.k@email.com',
    phone: '+91 91234 87654',
    jobRole: 'Business Analyst',
    jobId: 'JOB-2026-045',
    department: 'IT Department',
    experience: '2 Years',
    rating: 4.0,
    matchLevel: 'Good Match',
    matchColor: 'text-blue-500',
    shortlistedDate: '09 Jun 2026',
    shortlistedTime: '02:10 PM',
    nextStepStatus: 'Interview Scheduled',
    nextStepDesc: '19 Jun 2026, 03:00 PM',
    statusBg: 'bg-blue-50 text-blue-600',
  },
  {
    id: 7,
    name: 'Ritika Agarwal',
    avatar: 'https://i.pravatar.cc/150?u=17',
    email: 'ritika.agarwal@email.com',
    phone: '+91 90012 34567',
    jobRole: 'Accountant',
    jobId: 'JOB-2026-043',
    department: 'Finance & Accounts',
    experience: '3 Years',
    rating: 4.3,
    matchLevel: 'Very Good Match',
    matchColor: 'text-emerald-500',
    shortlistedDate: '08 Jun 2026',
    shortlistedTime: '10:45 AM',
    nextStepStatus: 'Awaiting Feedback',
    nextStepDesc: 'Technical Assessment',
    statusBg: 'bg-amber-50 text-amber-600',
  }
];

const STATS = [
  { value: '32', label: 'Total Shortlisted', sub: '19.6% of total candidates', icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { value: '12', label: 'This Week', sub: '37.5% of shortlisted', icon: Briefcase, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { value: '18', label: 'Interview Scheduled', sub: '56.3% of shortlisted', icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-500' },
  { value: '6', label: 'Awaiting Feedback', sub: '18.8% of shortlisted', icon: Hourglass, bg: 'bg-amber-50', color: 'text-amber-500' },
  { value: '3', label: 'Moved to Hold', sub: '9.4% of shortlisted', icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-500' },
];

export default function ShortlistedCandidatesUI() {
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
        {STATS.map((stat, i) => (
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
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-700 text-[9px] text-white ml-1">0</span>
            </button>
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 pt-3 border-t border-zinc-100">
          {[
            { label: 'Job Opening', value: 'All Openings' },
            { label: 'Department', value: 'All Departments' },
            { label: 'Experience', value: 'All Experience' },
            { label: 'Current Location', value: 'All Locations' },
          ].map((filter, i) => (
            <div key={i} className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-zinc-700">{filter.label}</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                  <option>{filter.value}</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          ))}

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
              All Shortlisted (32)
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
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm">
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
              {CANDIDATES.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <img src={app.avatar} alt={app.name} className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm object-cover" />
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
            Showing 1 to 10 of 32 entries
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
