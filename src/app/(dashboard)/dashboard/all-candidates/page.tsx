'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Users, FileText, Star, Briefcase, XCircle, UserCheck, Eye, MessageSquare, LayoutGrid, Loader2, Trash2 } from 'lucide-react';
import api from '@/lib/axios';

const PAGE_SIZE = 10;

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

const STATUS_STYLE: Record<string, string> = {
  'Applied': 'bg-slate-100 text-slate-700',
  'Screening': 'bg-blue-50 text-blue-700',
  'Interviewing': 'bg-amber-50 text-amber-700',
  'Offered': 'bg-purple-50 text-purple-700',
  'Hired': 'bg-emerald-50 text-emerald-700',
  'Rejected': 'bg-rose-50 text-rose-700',
};

const JOB_OPENINGS = [
  'All Openings',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
];

const LOCATIONS = [
  'All Locations',
  'Ghaziabad, UP',
  'Noida, UP',
  'Delhi, NCR',
  'Gurugram, HR',
  'Pune, MH',
];

const SOURCES = [
  'All Sources',
  'Direct',
  'LinkedIn',
  'Referral',
  'Job Portal',
  'Career Site',
  'Campus Hiring',
  'Consultant',
];

export default function CandidateRegisterUI() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [department, setDepartment] = useState('All Departments');
  const [experience, setExperience] = useState('All Experience');
  const [jobOpening, setJobOpening] = useState('All Openings');
  const [location, setLocation] = useState('All Locations');
  const [source, setSource] = useState('All Sources');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('newest');
  // ── Bulk selection ──
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // ── Locally deleted rows ──
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  // ── Confirm delete dialog ──
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAll = (checked: boolean, visibleIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const handleDeleteSelected = () => {
    // In a real app: call API to delete, then refetch
    setDeletedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
  };

  // ── Single row delete via API ──
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/hiring/candidates/${id}`);
    },
    onSuccess: (_, id) => {
      // Optimistically hide the row and refresh cache
      setDeletedIds((prev) => new Set([...prev, id]));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      queryClient.invalidateQueries({ queryKey: ['all-candidates'] });
      setConfirmDeleteId(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      setDeleteError(err?.response?.data?.message || 'Failed to delete candidate. Please try again.');
    },
  });

  const handleDeleteRow = (id: string) => {
    setDeleteError(null);
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setDeleteError(null);
  };

  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    contact: true,
    role: true,
    experience: true,
    skills: true,
    job: true,
    source: true,
    status: true,
    stage: true,
    addedOn: true
  });

  const toggleColumn = (col: keyof typeof visibleCols) => {
    setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  useEffect(() => setPage(1), [query, status, department, experience, jobOpening, location, source]);
  const params = {
    page,
    limit: PAGE_SIZE,
    ...(status !== 'All Status' ? { status } : {}),
    ...(query.trim() ? { search: query.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['all-candidates', params],
    queryFn: async () => unwrapList((await api.get('/hiring/candidates', { params })).data),
  });

  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const { data: departmentsRes } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.get('/companies/departments');
      return res.data;
    }
  });

  const departments = React.useMemo(() => {
    return Array.isArray(departmentsRes?.data) ? departmentsRes.data : (Array.isArray(departmentsRes) ? departmentsRes : []);
  }, [departmentsRes]);

  const { data: candidatesResponse, isLoading: isLoadingCandidates } = useQuery({
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
      totalExperience: c.applicationDetails?.totalExperience || 0,
      skills: c.skills?.length ? c.skills.slice(0, 3) : ['Skill 1', 'Skill 2'],
      jobAppliedFor: c.jobRole || 'N/A',
      jobId: 'N/A',
      department: c.department || c.applicationDetails?.department || c.jobRole || 'N/A',
      location: c.currentLocation || c.location || 'N/A',
      source: c.source || 'Direct',
      status: c.status || 'Applied',
      stage: 'N/A',
      addedOn: new Date(c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      addedDaysAgo: 'recently',
      createdAt: c.createdAt || Date.now(),
    }));
  }, [candidatesResponse]);

  const filteredCandidates = React.useMemo(() => {
    let result = candidates
      .filter((c: any) => !deletedIds.has(c.id))
      .filter((c: any) => {
        const matchStatus = status === 'All Status' || c.status === status;
        const matchDept = department === 'All Departments' || c.department === department;
        const matchJobOpening = jobOpening === 'All Openings' || c.jobAppliedFor === jobOpening;
        const matchLocation = location === 'All Locations' || c.location === location;
        const matchSource = source === 'All Sources' || c.source === source;

        let matchExp = true;
        const exp = parseFloat(c.totalExperience || 0);
        if (experience === 'Entry Level') matchExp = exp >= 0 && exp <= 2;
        if (experience === 'Mid Level') matchExp = exp > 2 && exp <= 6;
        if (experience === 'Senior Level') matchExp = exp > 6;

        const q = query.trim().toLowerCase();
        const matchQuery = !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.skills || []).some((s: string) => s.toLowerCase().includes(q)) ||
          c.jobAppliedFor.toLowerCase().includes(q);

        return matchStatus && matchDept && matchExp && matchQuery && matchJobOpening && matchLocation && matchSource;
      });

    if (sortField === 'newest') {
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortField === 'oldest') {
      result.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortField === 'name-asc') {
      result.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortField === 'name-desc') {
      result.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }

    return result;
  }, [candidates, deletedIds, status, department, experience, jobOpening, location, source, query, sortField]);

  const stats = React.useMemo(() => {
    const total = candidates.length;
    return [
      { label: 'Total Candidates', value: total.toString(), sub: 'In database', icon: Users, bg: 'bg-indigo-50', color: 'text-indigo-600' },
      { label: 'New This Week', value: total > 0 ? '1' : '0', sub: 'Recent applications', icon: FileText, bg: 'bg-emerald-50', color: 'text-emerald-600' },
      { label: 'Shortlisted', value: candidates.filter((c: any) => c.status === 'Screening' || c.status === 'Interviewing').length.toString(), sub: 'Progressing', icon: Star, bg: 'bg-amber-50', color: 'text-amber-600' },
      { label: 'Active in Process', value: candidates.filter((c: any) => c.status !== 'Rejected' && c.status !== 'Hired').length.toString(), sub: 'Currently active', icon: Briefcase, bg: 'bg-blue-50', color: 'text-blue-600' },
      { label: 'Rejected', value: candidates.filter((c: any) => c.status === 'Rejected').length.toString(), sub: 'Did not match', icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-600' },
      { label: 'Hired', value: candidates.filter((c: any) => c.status === 'Hired').length.toString(), sub: 'Joined team', icon: UserCheck, bg: 'bg-purple-50', color: 'text-purple-600' },
    ];
  }, [candidates]);

  const handleClearAll = () => {
    setQuery('');
    setStatus('All Status');
    setDepartment('All Departments');
    setExperience('All Experience');
    setJobOpening('All Openings');
    setLocation('All Locations');
    setSource('All Sources');
  };

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
              className="w-full text-[11px] pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors bg-zinc-50/50 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
            </button>
            <button
              onClick={handleClearAll}
              className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 pt-3 border-t border-zinc-100">
          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option>All Status</option>
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

          {/* Department */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Department</label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                <option value="All Departments">All Departments</option>
                {departments.map((d: any) => (
                  <option key={d._id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Job Opening */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Job Opening</label>
            <div className="relative">
              <select
                value={jobOpening}
                onChange={(e) => setJobOpening(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                {JOB_OPENINGS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Experience */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Experience</label>
            <div className="relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm">
                <option value="All Experience">All Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Current Location */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Current Location</label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                {LOCATIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Source</label>
            <div className="relative">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-gray-800 focus:outline-none focus:border-indigo-500 shadow-sm font-medium">
                {SOURCES.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-bold text-zinc-800">{filteredCandidates.length} Candidates Found</p>
            {selectedIds.size > 0 && (
              <span className="text-[11px] text-zinc-500 font-medium">· {selectedIds.size} selected</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0 relative">
            {selectedIds.size > 0 && (
              <button onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-100 shadow-sm transition-colors">
                <Trash2 size={12} /> Delete Selected ({selectedIds.size})
              </button>
            )}
            <button onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <LayoutGrid size={13} /> Columns
            </button>
            {showColumnsDropdown && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-zinc-200 rounded-md shadow-lg z-10 p-2 py-2 flex flex-col gap-1">
                {Object.keys(visibleCols).map((col) => (
                  <label key={col} className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-50 rounded cursor-pointer text-[11px] font-medium text-zinc-700 capitalize">
                    <input
                      type="checkbox"
                      checked={visibleCols[col as keyof typeof visibleCols]}
                      onChange={() => toggleColumn(col as keyof typeof visibleCols)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                    {col.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            )}
            <div className="relative">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-7 py-1.5 text-[10px] font-semibold text-zinc-700 focus:outline-none shadow-sm min-w-[120px]">
                <option value="newest">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] whitespace-nowrap">
            <thead>
              <tr className="bg-indigo-50/30 text-zinc-600 border-b border-zinc-100">
                <th className="px-2 py-2 font-bold w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredCandidates.length > 0 && filteredCandidates.every((c: any) => selectedIds.has(c.id))}
                    ref={(el) => {
                      if (el) el.indeterminate =
                        filteredCandidates.some((c: any) => selectedIds.has(c.id)) &&
                        !filteredCandidates.every((c: any) => selectedIds.has(c.id));
                    }}
                    onChange={(e) => handleToggleAll(e.target.checked, filteredCandidates.map((c: any) => c.id))}
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600" />
                </th>
                <th className="px-2 py-2 font-bold">Candidate</th>
                {visibleCols.contact && <th className="px-6 py-2 font-bold">Contact</th>}
                {visibleCols.role && <th className="px-2 py-2 font-bold">Current Role</th>}
                {visibleCols.experience && <th className="px-2 py-2 font-bold">Experience</th>}
                {visibleCols.skills && <th className="px-2 py-2 font-bold">Skills</th>}
                {visibleCols.job && <th className="px-2 py-2 font-bold">Job Applied For</th>}
                {visibleCols.source && <th className="px-2 py-2 font-bold">Source</th>}
                {visibleCols.status && <th className="px-2 py-2 font-bold">Status</th>}
                {visibleCols.stage && <th className="px-2 py-2 font-bold">Stage</th>}
                {visibleCols.addedOn && <th className="px-2 py-2 font-bold">Added On</th>}
                <th className="px-2 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {isLoadingCandidates ? (
                <tr><td colSpan={12} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : filteredCandidates.length === 0 ? (
                <tr><td colSpan={12} className="py-10 text-center text-[12px] text-zinc-500">No candidates found</td></tr>
              ) : filteredCandidates.map((c: any) => (
                <tr key={c.id} className={`transition-colors group ${selectedIds.has(c.id) ? 'bg-indigo-50/60' : 'hover:bg-indigo-50/30'}`}>
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => handleToggle(c.id)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600" />
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
                        </div>
                      </div>
                    </div>
                  </td>
                  {visibleCols.contact && (
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800 font-medium">{c.email}</span>
                        <span className="text-zinc-500">{c.phone}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.role && (
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800 font-medium">{c.currentRole || '-'}</span>
                        <span className="text-zinc-500">{c.company || '-'}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.experience && <td className="px-2 py-2 font-medium text-zinc-700">{c.experience || '-'}</td>}
                  {visibleCols.skills && (
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-1 w-40 whitespace-normal">
                        {(c.skills || []).slice(0, 3).map((skill: string, idx: number) => (
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
                  )}
                  {visibleCols.job && (
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800 font-medium">{c.jobAppliedFor || '-'}</span>
                        <span className="text-zinc-400 text-[9px]">{c.jobId || '-'}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.source && <td className="px-2 py-2 text-zinc-700">{c.source || '-'}</td>}
                  {visibleCols.status && (
                    <td className="px-2 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${STATUS_STYLE[c.status] || 'bg-zinc-100 text-zinc-700'}`}>
                        {c.status || 'Applied'}
                      </span>
                    </td>
                  )}
                  {visibleCols.stage && <td className="px-2 py-2 text-zinc-800 font-medium">{c.stage || '-'}</td>}
                  {visibleCols.addedOn && (
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-800">{c.addedOn || '-'}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View — same page as candidate name */}
                      <Link
                        href={`/dashboard/hiring/candidates/${c.id}`}
                        className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <Eye size={12} />
                      </Link>
                      {/* Message */}
                      <button className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <MessageSquare size={12} />
                      </button>
                      {/* Direct delete icon — no 3-dot dropdown */}
                      <button
                        onClick={() => handleDeleteRow(c.id)}
                        title="Delete"
                        className="h-6 w-6 flex items-center justify-center rounded border border-rose-100 text-rose-600 hover:bg-rose-50 bg-white shadow-sm transition-colors">
                        <Trash2 size={12} />
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
            Showing {filteredCandidates.length > 0 ? 1 : 0} to {Math.min(PAGE_SIZE, filteredCandidates.length)} of {filteredCandidates.length} entries
          </div>

          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm disabled:opacity-40">
              <ChevronLeft size={12} />
            </button>
            {Array.from({ length: Math.min(meta.totalPages || 1, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shadow-sm ${p === page ? 'bg-indigo-700 text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50 bg-white'}`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={page >= (meta.totalPages || 1) || isLoading}
              className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm disabled:opacity-40">
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Delete Dialog ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                <Trash2 size={20} className="text-rose-600" />
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-zinc-800">Delete Candidate?</h3>
                <p className="text-[12px] text-zinc-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            {/* Error */}
            {deleteError && (
              <div className="mx-6 mb-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-700 font-medium">
                {deleteError}
              </div>
            )}
            {/* Footer */}
            <div className="flex gap-2 px-6 pb-6 pt-2">
              <button
                onClick={cancelDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-lg border border-zinc-200 bg-white py-2 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-lg bg-rose-600 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deleteMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Deleting…</>
                ) : (
                  <><Trash2 size={14} /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}