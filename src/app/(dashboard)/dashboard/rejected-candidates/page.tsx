"use client"
import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Clock, FileText, Search, SlidersHorizontal, RotateCcw, Download, Mail, UserPlus, Eye, MoreHorizontal, ChevronLeft, ChevronRight, UserX, FileSearch, Filter, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// --- TypeScript Types ---
interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  subtext?: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  jobOpening: string;
  jobCode: string;
  department: string;
  experience: string;
  rejectedStage: 'After Interview' | 'After Assessment' | 'Screening Rejected';
  rejectionReason: string;
  rejectedOn: string;
  rejectedTime: string;
}

// --- Mock Data ---

export default function RejectedCandidatesPage() {
  // --- States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Rejected');
  const [selectedJob, setSelectedJob] = useState('All Openings');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedReason, setSelectedReason] = useState('All Reasons');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['rejected-candidates'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates', { params: { status: 'Rejected' } });
      return res.data;
    }
  });

  const initialCandidates: Candidate[] = React.useMemo(() => {
    const rawCandidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse?.data || []);
    return rawCandidates.map((c: any) => ({
      id: c._id || c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown',
      email: c.email || 'N/A',
      phone: c.phone || 'N/A',
      avatar: '',
      jobOpening: c.jobRole || 'N/A',
      jobCode: 'N/A',
      department: c.department?.name || 'N/A',
      experience: c.applicationDetails?.totalExperience || 'N/A',
      rejectedStage: 'Screening Rejected', // Mock stage
      rejectionReason: c.comments || 'Not a good fit',
      rejectedOn: new Date(c.updatedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      rejectedTime: new Date(c.updatedAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
  }, [candidatesResponse]);

  // ── Dynamic tab counts from real API data ──
  const tabCounts = useMemo(() => ({
    all: initialCandidates.length,
    screening: initialCandidates.filter((c) => c.rejectedStage === 'Screening Rejected').length,
    assessment: initialCandidates.filter((c) => c.rejectedStage === 'After Assessment').length,
    interview: initialCandidates.filter((c) => c.rejectedStage === 'After Interview').length,
    offerDeclined: initialCandidates.filter((c) => c.rejectedStage === 'Offer Declined' as any).length,
  }), [initialCandidates]);

  // ── Filtered rows based on active tab + search + filters ──
  const filteredCandidates = useMemo(() => {
    return initialCandidates.filter((c) => {
      // Tab filter
      if (activeTab === 'Screening Rejected' && c.rejectedStage !== 'Screening Rejected') return false;
      if (activeTab === 'After Assessment' && c.rejectedStage !== 'After Assessment') return false;
      if (activeTab === 'After Interview' && c.rejectedStage !== 'After Interview') return false;
      if (activeTab === 'Offer Declined' && (c.rejectedStage as any) !== 'Offer Declined') return false;
      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (![c.name, c.email, c.phone, c.jobOpening, c.department].some((f) => f.toLowerCase().includes(q))) return false;
      }
      // Department filter
      if (selectedDept !== 'All Departments' && c.department !== selectedDept) return false;
      // Reason filter
      if (selectedReason !== 'All Reasons' && c.rejectionReason !== selectedReason) return false;
      return true;
    });
  }, [initialCandidates, activeTab, searchTerm, selectedDept, selectedReason]);

  // --- Handlers ---
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedJob('All Openings');
    setSelectedDept('All Departments');
    setSelectedReason('All Reasons');
    setActiveTab('All Rejected');
  };

  const handleAction = (candidateName: string, actionType: string) => {
    alert(`${actionType} clicked for ${candidateName}`);
  };

  // --- Helper Badge Component ---
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'After Interview':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">After Interview</span>;
      case 'After Assessment':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">After Assessment</span>;
      case 'Screening Rejected':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">Screening Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-800">Rejected</span>;
    }
  };

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200/80 shadow-sm h-[10%]">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-slate-900">Rejected Candidates</h1>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1 rounded-full">✕</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Candidates who were not selected for the current openings</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleAction('All', 'Export')} className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Download size={14} className="text-slate-600" /> Export
          </button>
          <button onClick={() => handleAction('All', 'Email')} className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Mail size={14} className="text-slate-600" /> Email
          </button>
          <button onClick={() => handleAction('All', 'Add Candidate')} className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <UserPlus size={14} /> Add Candidate
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-6 gap-2 h-[12%]">
        <StatCard icon={<UserX size={16} />} count={86} label="Total Rejected" subtext="In database" borderColor="border-red-200" iconBg="bg-red-50" iconColor="text-red-600" />
        <StatCard icon={<Clock size={16} />} count={14} label="This Week" subtext="16.3% of rejected" borderColor="border-green-200" iconBg="bg-green-50" iconColor="text-green-600" />
        <StatCard icon={<FileSearch size={16} />} count={32} label="After Interview" subtext="37.2% of rejected" borderColor="border-amber-200" iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard icon={<FileText size={16} />} count={28} label="After Assessment" subtext="32.6% of rejected" borderColor="border-indigo-200" iconBg="bg-indigo-50" iconColor="text-indigo-600" />
        <StatCard icon={<Search size={16} />} count={26} label="Screening Rejected" subtext="30.2% of rejected" borderColor="border-blue-200" iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard icon={<ArrowLeftRight size={16} />} count={12} label="Re-applied" subtext="13.9% of rejected" borderColor="border-slate-200" iconBg="bg-slate-50" iconColor="text-slate-700" />
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-sm flex flex-col gap-1.5 justify-center h-[18%]">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by name, email, phone, job title or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white" />
        </div>

        <div className="grid grid-cols-6 gap-2 items-center">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Job Opening</label>
            <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="w-full bg-white border border-slate-200 px-1.5 py-1 rounded text-xs text-slate-800 focus:outline-none">
              <option>All Openings</option>
              <option>Marketing Executive</option>
              <option>Software Developer</option>
              <option>UI/UX Designer</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Department</label>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-full bg-white border border-slate-200 px-1.5 py-1 rounded text-xs text-slate-800 focus:outline-none">
              <option>All Departments</option>
              <option>Marketing</option>
              <option>IT Department</option>
              <option>Human Resources</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Experience</label>
            <select className="w-full bg-white border border-slate-200 px-1.5 py-1 rounded text-xs text-slate-800 focus:outline-none">
              <option>All Experience</option>
              <option>Entry Level</option>
              <option>Mid Level</option>
              <option>Senior Level</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Rejection Reason</label>
            <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} className="w-full bg-white border border-slate-200 px-1.5 py-1 rounded text-xs text-slate-800 focus:outline-none">
              <option>All Reasons</option>
              <option>Technical skills</option>
              <option>Cultural fit</option>
              <option>Salary issue</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Rejection Stage</label>
            <select className="w-full bg-white border border-slate-200 px-1.5 py-1 rounded text-xs text-slate-800 focus:outline-none">
              <option>All Stages</option>
              <option>Screening</option>
              <option>Assessment</option>
              <option>Interview</option>
            </select>
          </div>
          <div className="flex gap-1.5 h-full items-end">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={12} /> Filters <span className="bg-indigo-600 text-white text-[9px] px-1 rounded-full">0</span>
            </button>
            <button onClick={clearFilters} className="border border-slate-200 hover:bg-slate-50 text-slate-600 p-1.5 rounded text-xs font-semibold flex items-center justify-center h-[28px]" title="Clear All">
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE TABS & VIEWS */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm flex flex-col flex-1 overflow-hidden h-[50%]">

        {/* Sub-navigation Menu */}
        <div className="flex justify-between items-center border-b border-slate-100 px-2 bg-slate-50/50">
          <div className="flex gap-4">
            {[
              { key: 'All Rejected', label: 'All Rejected', count: tabCounts.all },
              { key: 'Screening Rejected', label: 'Screening Rejected', count: tabCounts.screening },
              { key: 'After Assessment', label: 'After Assessment', count: tabCounts.assessment },
              { key: 'After Interview', label: 'After Interview', count: tabCounts.interview },
              { key: 'Offer Declined', label: 'Offer Declined', count: tabCounts.offerDeclined },
            ].map(({ key, label, count }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-2 text-xs font-bold border-b-2 transition relative top-[1px] whitespace-nowrap ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600'
                    }`}
                >
                  {label} <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>({count})</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
              <SlidersHorizontal size={11} /> Columns
            </button>
            <select className="text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 px-2 py-0.5 rounded text-[11px] font-semibold focus:outline-none">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        {/* Scrollable Core Table Structure */}
        <div className="overflow-y-auto flex-1 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                <th className="p-2 w-8"><input type="checkbox" className="rounded text-indigo-600" /></th>
                <th className="p-2">Candidate</th>
                <th className="p-2">Job Opening</th>
                <th className="p-2">Department</th>
                <th className="p-2">Experience</th>
                <th className="p-2">Rejected Stage</th>
                <th className="p-2">Rejection Reason</th>
                <th className="p-2">Rejected On</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : filteredCandidates.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-xs text-slate-500">No candidates found</td></tr>
              ) : filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2"><input type="checkbox" className="rounded text-indigo-600" /></td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 border border-slate-200">
                        {cand.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{cand.name}</p>
                        <p className="text-[10px] text-slate-500">{cand.email}</p>
                        <p className="text-[9px] text-slate-400">{cand.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div>
                      <p className="font-semibold text-slate-800">{cand.jobOpening}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{cand.jobCode}</p>
                    </div>
                  </td>
                  <td className="p-2 text-slate-700 font-medium">{cand.department}</td>
                  <td className="p-2 text-slate-700 font-medium">{cand.experience}</td>
                  <td className="p-2">{getStageBadge(cand.rejectedStage)}</td>
                  <td className="p-2 text-slate-600 font-medium max-w-[200px] truncate" title={cand.rejectionReason}>
                    {cand.rejectionReason}
                  </td>
                  <td className="p-2">
                    <div>
                      <p className="font-semibold text-slate-800">{cand.rejectedOn}</p>
                      <p className="text-[10px] text-slate-500">{cand.rejectedTime}</p>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleAction(cand.name, 'View Details')} className="p-1 hover:bg-slate-100 text-indigo-600 rounded transition" title="View Details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleAction(cand.name, 'More Actions')} className="p-1 hover:bg-slate-100 text-slate-600 rounded transition" title="More">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPACT PAGINATION FOOTER */}
        <div className="border-t border-slate-200 p-2 flex justify-between items-center bg-slate-50 text-[11px] font-semibold text-slate-700 h-[40px]">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredCandidates.length > 0 ? 1 : 0} to {Math.min(pageSize, filteredCandidates.length)}</span> of <span className="font-bold text-slate-900">{filteredCandidates.length}</span> entries
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white border border-slate-200 px-1 py-0.5 rounded focus:outline-none">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-1">
              <button disabled className="p-1 border border-slate-200 bg-white text-slate-400 rounded cursor-not-allowed">
                <ChevronLeft size={12} />
              </button>
              <button onClick={() => setCurrentPage(1)} className={`px-2 py-0.5 rounded border ${currentPage === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'}`}>1</button>
              <button onClick={() => setCurrentPage(2)} className={`px-2 py-0.5 rounded border ${currentPage === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'}`}>2</button>
              <button onClick={() => setCurrentPage(3)} className={`px-2 py-0.5 rounded border ${currentPage === 3 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'}`}>3</button>
              <span className="px-1 text-slate-400">...</span>
              <button onClick={() => setCurrentPage(9)} className={`px-2 py-0.5 rounded border ${currentPage === 9 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-200'}`}>9</button>
              <button className="p-1 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Stat Card Sub-component ---
function StatCard({ icon, count, label, subtext, borderColor, iconBg, iconColor }: StatCardProps) {
  return (
    <div className={`bg-white p-1.5 rounded-lg shadow-sm flex items-center gap-2 transition hover:shadow-md`}>
      <div className={`${iconBg} ${iconColor} p-1.5 rounded-full flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black text-slate-900 leading-none">{count}</span>
          <span className="text-[10px] font-bold text-slate-800 truncate">{label}</span>
        </div>
        {subtext && <p className="text-[9px] text-slate-500 font-medium truncate mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}