'use client';

import React from 'react';
import Link from 'next/link';
import {
  Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown,
  Users, FileText, Star, Briefcase, XCircle, UserCheck, Eye, MessageSquare, MoreVertical, LayoutGrid
} from 'lucide-react';

const CANDIDATES = [
  {
    id: 1,
    name: 'Rahul Sharma',
    rating: 4.2,
    avatar: 'https://i.pravatar.cc/150?u=1',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    currentRole: 'Sales Executive',
    company: 'ABC Pvt. Ltd.',
    experience: '7 Years',
    skills: ['Sales', 'Negotiation', 'CRM', '+2'],
    jobAppliedFor: 'Sales Manager',
    jobId: 'JOB-2026-051',
    source: 'Naukri.com',
    status: 'Active',
    stage: 'Resume Screening',
    addedOn: '15 Jun 2026',
    addedDaysAgo: '2 days ago',
  },
  {
    id: 2,
    name: 'Priya Singh',
    rating: 4.0,
    avatar: 'https://i.pravatar.cc/150?u=2',
    email: 'priya.singh@email.com',
    phone: '+91 91234 56789',
    currentRole: 'HR Executive',
    company: 'XYZ Solutions',
    experience: '6 Years',
    skills: ['HR', 'Talent Acquisition', 'Employee Relations', '+1'],
    jobAppliedFor: 'HR Executive',
    jobId: 'JOB-2026-050',
    source: 'LinkedIn',
    status: 'Under Review',
    stage: 'HR Interview',
    addedOn: '14 Jun 2026',
    addedDaysAgo: '3 days ago',
  },
  {
    id: 3,
    name: 'Amit Patel',
    rating: 4.3,
    avatar: 'https://i.pravatar.cc/150?u=3',
    email: 'amit.patel@email.com',
    phone: '+91 99887 66554',
    currentRole: 'Software Engineer',
    company: 'TechNova',
    experience: '5 Years',
    skills: ['Java', 'Spring Boot', 'SQL', '+2'],
    jobAppliedFor: 'Software Developer',
    jobId: 'JOB-2026-049',
    source: 'Company Website',
    status: 'Active',
    stage: 'Technical Assessment',
    addedOn: '13 Jun 2026',
    addedDaysAgo: '4 days ago',
  },
  {
    id: 4,
    name: 'Neha Gupta',
    rating: 4.1,
    avatar: 'https://i.pravatar.cc/150?u=4',
    email: 'neha.gupta@email.com',
    phone: '+91 90123 45678',
    currentRole: 'Digital Marketing Exec.',
    company: 'Brandify',
    experience: '4 Years',
    skills: ['SEO', 'Google Ads', 'Social Media', '+1'],
    jobAppliedFor: 'Digital Marketing Executive',
    jobId: 'JOB-2026-048',
    source: 'Indeed',
    status: 'Shortlisted',
    stage: 'Managerial Interview',
    addedOn: '12 Jun 2026',
    addedDaysAgo: '5 days ago',
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    rating: 3.8,
    avatar: 'https://i.pravatar.cc/150?u=5',
    email: 'vikram.mehta@email.com',
    phone: '+91 98712 34567',
    currentRole: 'UI/UX Designer',
    company: 'Creative Minds',
    experience: '3 Years',
    skills: ['Figma', 'Adobe XD', 'UI Design', '+1'],
    jobAppliedFor: 'UI/UX Designer',
    jobId: 'JOB-2026-046',
    source: 'LinkedIn',
    status: 'Hold',
    stage: 'On Hold',
    addedOn: '09 Jun 2026',
    addedDaysAgo: '8 days ago',
  },
  {
    id: 6,
    name: 'Anjali Verma',
    rating: 4.0,
    avatar: 'https://i.pravatar.cc/150?u=6',
    email: 'anjali.verma@email.com',
    phone: '+91 98987 65432',
    currentRole: 'Business Analyst',
    company: 'InfoTech',
    experience: '2 Years',
    skills: ['Excel', 'SQL', 'Power BI', '+1'],
    jobAppliedFor: 'Business Analyst',
    jobId: 'JOB-2026-045',
    source: 'Referral',
    status: 'Rejected',
    stage: 'Not Selected',
    addedOn: '08 Jun 2026',
    addedDaysAgo: '9 days ago',
  },
  {
    id: 7,
    name: 'Saurabh Kumar',
    rating: 4.1,
    avatar: 'https://i.pravatar.cc/150?u=7',
    email: 'saurabh.k@email.com',
    phone: '+91 91234 87654',
    currentRole: 'Customer Support Exec.',
    company: 'HelpDesk Inc.',
    experience: '2 Years',
    skills: ['Support', 'Communication', 'MS Office'],
    jobAppliedFor: 'Customer Support Executive',
    jobId: 'JOB-2026-044',
    source: 'Naukri.com',
    status: 'Hired',
    stage: 'Offer Accepted',
    addedOn: '07 Jun 2026',
    addedDaysAgo: '10 days ago',
  },
  {
    id: 8,
    name: 'Ritika Agarwal',
    rating: 3.9,
    avatar: 'https://i.pravatar.cc/150?u=8',
    email: 'ritika.agarwal@email.com',
    phone: '+91 90012 34567',
    currentRole: 'Accountant',
    company: 'FinancePro',
    experience: '3 Years',
    skills: ['Tally', 'Excel', 'GST'],
    jobAppliedFor: 'Accounts Executive',
    jobId: 'JOB-2026-043',
    source: 'Company Website',
    status: 'Active',
    stage: 'Resume Screening',
    addedOn: '06 Jun 2026',
    addedDaysAgo: '11 days ago',
  }
];

const STATUS_STYLE: Record<string, string> = {
  'Active': 'bg-emerald-50 text-emerald-700',
  'Under Review': 'bg-blue-50 text-blue-700',
  'Shortlisted': 'bg-emerald-50 text-emerald-700',
  'Hold': 'bg-amber-50 text-amber-700',
  'Rejected': 'bg-rose-50 text-rose-700',
  'Hired': 'bg-emerald-50 text-emerald-700',
};

const STATS = [
  { label: 'Total Candidates', value: '1,248', sub: 'In database', icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { label: 'New This Week', value: '68', sub: '↑ 12.5% from last week', subColor: 'text-emerald-500', icon: FileText, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Shortlisted', value: '245', sub: '19.6% of total', icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
  { label: 'Active in Process', value: '312', sub: '25.0% of total', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Rejected', value: '386', sub: '30.9% of total', icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-600' },
  { label: 'Hired', value: '73', sub: '5.8% of total', icon: UserCheck, bg: 'bg-purple-50', color: 'text-purple-600' },
];

export default function CandidateRegisterUI() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-2 lg:p-4 space-y-4 font-sans text-zinc-900 bg-[#fbfbfe] min-h-screen">

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
          <button onClick={() => window.open("/dashboard/hiring/candidates/new/create", '_blank')} className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Plus size={14} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
        {STATS.map((stat, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-start gap-3">
            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-medium text-zinc-500">{stat.label}</span>
              <span className="text-[18px] font-bold text-zinc-900 leading-tight my-0.5">{stat.value}</span>
              <span className={`text-[9px] ${stat.subColor || 'text-zinc-400'}`}>{stat.sub}</span>
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

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 pt-3 border-t border-zinc-100">
          {[
            { label: 'Job Opening', value: 'All Openings' },
            { label: 'Department', value: 'All Departments' },
            { label: 'Experience', value: 'All Experience' },
            { label: 'Current Location', value: 'All Locations' },
            { label: 'Source', value: 'All Sources' },
            { label: 'Status', value: 'All Status' },
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

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Date Added</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-7 pr-6 py-1.5 text-[10px] text-gray-800 font-medium focus:outline-none focus:border-indigo-500 shadow-sm">
                <option>01 May 2026 - 15 Jun 2026</option>
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
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-zinc-100 bg-white">
          <p className="text-[12px] font-bold text-zinc-800">1,248 Candidates Found</p>
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

        {/* Table */}
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
            <tbody className="divide-y divide-zinc-50">
              {CANDIDATES.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-2 py-2 text-center">
                    <input type="checkbox" className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.name} className="h-8 w-8 rounded-full border border-zinc-200 shadow-sm object-cover" />
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{c.name}</span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={9} className={star <= Math.floor(c.rating) ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
                          ))}
                          <span className="text-[9px] text-zinc-500 ml-1">{c.rating}</span>
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
                      <span className="text-zinc-800 font-medium">{c.currentRole}</span>
                      <span className="text-zinc-500">{c.company}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 font-medium text-zinc-700">{c.experience}</td>
                  <td className="px-2 py-2">
                    <div className="flex flex-wrap gap-1 w-40 whitespace-normal">
                      {c.skills.map((skill, idx) => (
                        <span key={idx} className="bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800 font-medium">{c.jobAppliedFor}</span>
                      <span className="text-zinc-400 text-[9px]">{c.jobId}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-zinc-700">{c.source}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${STATUS_STYLE[c.status] || 'bg-zinc-100 text-zinc-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-zinc-800 font-medium">{c.stage}</td>
                  <td className="px-2 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-800">{c.addedOn}</span>
                      <span className="text-zinc-400 text-[9px]">{c.addedDaysAgo}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
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
            Showing 1 to 10 of 1,248 entries
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
            <span className="text-[10px] text-zinc-400 px-1">...</span>
            <button className="h-6 w-[28px] rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">
              125
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
