'use client';
import React from 'react';
import Link from 'next/link';
import { Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown, User, Calendar, Clock, Briefcase, Mail, Eye, MessageSquare, MoreVertical, LayoutGrid, FileText, Link2, Globe, Users, Info, Loader2, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function NewApplicationsPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'today' | 'week'>('all');
  const [query, setQuery] = React.useState('');
  const [department, setDepartment] = React.useState('All Departments');
  const [experience, setExperience] = React.useState('All Experience');
  const [sortField, setSortField] = React.useState('newest');

  const [showColumnsDropdown, setShowColumnsDropdown] = React.useState(false);
  const [visibleCols, setVisibleCols] = React.useState({
    job: true,
    experience: true,
    source: true,
    appliedOn: true,
    resume: true,
    status: true,
  });

  // ── Selection State ──
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  // ── Locally deleted rows ──
  const [deletedIds, setDeletedIds] = React.useState<Set<string>>(new Set());
  // ── 3-dot menu dropdown state ──
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
    setDeletedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
  };

  const toggleColumn = (col: keyof typeof visibleCols) => {
    setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  };
  const { data: candidatesResponse, isLoading } = useQuery({
    queryKey: ['new-applications'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates', { params: { status: 'Applied' } });
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

  const departments = React.useMemo(() => {
    return Array.isArray(departmentsRes?.data) ? departmentsRes.data : (Array.isArray(departmentsRes) ? departmentsRes : []);
  }, [departmentsRes]);

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
      department: c.department || c.applicationDetails?.department || c.jobRole || 'N/A',
      experience: c.applicationDetails?.totalExperience ? `${c.applicationDetails.totalExperience} Years` : 'N/A',
      source: c.source || 'Direct',
      sourceType: c.source?.toLowerCase() === 'linkedin' ? 'linkedin' : c.source?.toLowerCase().includes('naukri') ? 'naukri' : 'website',
      appliedOnDate: new Date(c.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      appliedOnTime: new Date(c.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      resumeName: 'Resume.pdf',
      resumeSize: '512 KB',
      status: 'New',
      createdAt: c.createdAt || Date.now(),
    }));
  }, [candidatesResponse]);

  const stats = React.useMemo(() => {
    const activeApps = applications.filter((a: any) => !deletedIds.has(a.id));
    const total = activeApps.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    const todayCount = activeApps.filter((a: any) => new Date(a.appliedOnDate) >= todayStart).length;
    const weekCount = activeApps.filter((a: any) => new Date(a.appliedOnDate) >= weekStart).length;
    return [
      { label: 'Total New Applications', value: total.toString(), sub1: 'Since last login', subColor: '', bg: 'bg-indigo-50', color: 'text-indigo-600', icon: User },
      { label: 'Applied Today', value: total > 0 ? todayCount.toString() : '0', sub1: '12% increase from yesterday', subColor: 'text-emerald-500', bg: 'bg-emerald-50', color: 'text-emerald-600', icon: Calendar },
      { label: 'Pending Review', value: total.toString(), sub1: 'Needs attention', subColor: 'text-rose-500', bg: 'bg-rose-50', color: 'text-rose-600', icon: Clock },
      { label: 'Most Applied Job', value: 'Sales Manager', sub1: '32 applications', subColor: '', bg: 'bg-blue-50', color: 'text-blue-600', icon: Briefcase },
      { label: 'Top Source', value: 'Naukri.com', sub1: '45% of total applications', subColor: '', bg: 'bg-amber-50', color: 'text-amber-600', icon: Globe },
    ];
  }, [applications, deletedIds]);

  const filteredApplications = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());

    let result = applications
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => {
        // Tab filter
        let matchTab = true;
        const appliedDate = new Date(a.appliedOnDate);
        if (activeTab === 'today') matchTab = appliedDate >= todayStart;
        if (activeTab === 'week') matchTab = appliedDate >= weekStart;

        // Query filter
        const q = query.trim().toLowerCase();
        const matchQuery = !q ||
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.jobRole.toLowerCase().includes(q);

        // Dept filter
        const matchDept = department === 'All Departments' || a.department === department;

        // Experience filter
        let matchExp = true;
        const exp = parseFloat(a.experience || 0);
        if (experience === 'Entry Level') matchExp = !isNaN(exp) && exp >= 0 && exp <= 2;
        if (experience === 'Mid Level') matchExp = !isNaN(exp) && exp > 2 && exp <= 6;
        if (experience === 'Senior Level') matchExp = !isNaN(exp) && exp > 6;

        return matchTab && matchQuery && matchDept && matchExp;
      });

    if (sortField === 'newest') {
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortField === 'oldest') {
      result.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortField === 'name-asc') {
      result.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (sortField === 'name-desc') {
      result.sort((a: any, b: any) => b.name.localeCompare(a.name));
    }

    return result;
  }, [applications, deletedIds, activeTab, query, department, experience, sortField]);

  const todayCount = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return applications
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => new Date(a.appliedOnDate) >= todayStart).length;
  }, [applications, deletedIds]);

  const weekCount = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    return applications
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => new Date(a.appliedOnDate) >= weekStart).length;
  }, [applications, deletedIds]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-1 py-0.5 lg:px-2 lg:py-1 space-y-2.5 font-sans text-zinc-900  min-h-screen">
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
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm flex items-start gap-3">
            <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={15} className={stat.color} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-bold text-zinc-900 leading-tight mb-0.5">{stat.value}</span>
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, job title or skills..."
              className="w-1/2 text-[11px] pl-8 pr-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors bg-zinc-50/50 placeholder:text-slate-500" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
              <Filter size={13} /> Filters
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-700 text-[9px] text-white ml-1">0</span>
            </button>
            <button onClick={() => { setQuery(''); setDepartment('All Departments'); setActiveTab('all'); }} className="flex flex-1 md:flex-none items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50 shadow-sm">
              <RotateCcw size={13} /> Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 pt-3 border-t border-zinc-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Job Opening</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
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
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                <option value="All Departments">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept._id || dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Source</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                <option>All Sources</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Location</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                <option>All Locations</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

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
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 pb-1 border-b-2 text-[11px] font-bold transition-colors ${activeTab === 'all' ? 'border-indigo-700 text-indigo-700' : 'border-transparent text-zinc-500 hover:text-zinc-700'
                }`} >
              All New Applications
              ({applications.filter((a: any) => !deletedIds.has(a.id)).length})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 pb-1 border-b-2 text-[11px] font-semibold transition-colors ${activeTab === 'today' ? 'border-indigo-700 text-indigo-700' : 'border-transparent text-zinc-500 hover:text-zinc-700'
                }`} >
              Today ({todayCount})
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`px-3 pb-1 border-b-2 text-[11px] font-semibold transition-colors ${activeTab === 'week' ? 'border-indigo-700 text-indigo-700' : 'border-transparent text-zinc-500 hover:text-zinc-700'
                }`} >
              This Week ({weekCount})
            </button>
          </div>
          <div className="flex items-center gap-2 px-2 relative">
            {selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-100 shadow-sm transition-colors"
              >
                <Trash2 size={12} /> Delete Selected ({selectedIds.size})
              </button>
            )}
            <button
              onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
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
                <th className="px-3 py-2 font-bold w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredApplications.length > 0 && filteredApplications.every((app: any) => selectedIds.has(app.id))}
                    ref={(el) => {
                      if (el) el.indeterminate =
                        filteredApplications.some((app: any) => selectedIds.has(app.id)) &&
                        !filteredApplications.every((app: any) => selectedIds.has(app.id));
                    }}
                    onChange={(e) => handleToggleAll(e.target.checked, filteredApplications.map((app: any) => app.id))}
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
                  />
                </th>
                <th className="px-3 py-2 font-bold">Candidate</th>
                {visibleCols.job && <th className="px-3 py-2 font-bold">Job Applied For</th>}
                {visibleCols.experience && <th className="px-3 py-2 font-bold">Experience</th>}
                {visibleCols.source && <th className="px-3 py-2 font-bold">Source</th>}
                {visibleCols.appliedOn && <th className="px-3 py-2 font-bold">Applied On</th>}
                {visibleCols.resume && <th className="px-3 py-2 font-bold">Resume</th>}
                {visibleCols.status && <th className="px-3 py-2 font-bold">Status</th>}
                <th className="px-3 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : filteredApplications.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-[12px] text-zinc-500">
                  {activeTab === 'today' ? 'No applications received today' : activeTab === 'week' ? 'No applications this week' : 'No applications found'}
                </td></tr>
              ) : filteredApplications.map((app: any) => (
                <tr key={app.id} className={`transition-colors ${selectedIds.has(app.id) ? 'bg-indigo-50/60' : 'hover:bg-zinc-50/50'}`}>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.id)}
                      onChange={() => handleToggle(app.id)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 border border-zinc-200">
                        {app.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/dashboard/hiring/candidates/${app.id}`} className="font-bold text-indigo-700 hover:underline">{app.name}</Link>
                        <span className="text-[9px] font-medium text-zinc-800">{app.email}</span>
                        <span className="text-[9px] text-zinc-500">{app.phone}</span>
                      </div>
                    </div>
                  </td>
                  {visibleCols.job && (
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-900 font-bold">{app.jobRole}</span>
                        <span className="text-zinc-500 text-[9px]">{app.jobId}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.experience && <td className="px-3 py-2 font-medium text-zinc-700">{app.experience}</td>}
                  {visibleCols.source && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        {app.sourceType === 'naukri' && <div className="h-4 w-4 bg-blue-600 text-white rounded text-[8px] font-bold flex items-center justify-center">n</div>}
                        {app.sourceType === 'linkedin' && <Link2 size={14} className="text-blue-600" />}
                        {app.sourceType === 'referral' && <Users size={14} className="text-emerald-600" />}
                        {app.sourceType === 'website' && <Globe size={14} className="text-blue-500" />}
                        <span className="font-medium">{app.source}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.appliedOn && (
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-900 font-medium">{app.appliedOnDate}</span>
                        <span className="text-zinc-500 text-[9px]">{app.appliedOnTime}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.resume && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <FileText size={16} className="text-rose-500" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-800 font-medium">{app.resumeName}</span>
                          <span className="text-zinc-500 text-[9px]">({app.resumeSize})</span>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleCols.status && (
                    <td className="px-3 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {app.status}
                      </span>
                    </td>
                  )}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/dashboard/hiring/candidates/${app.id}`}
                        className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors"
                      >
                        <Eye size={12} />
                      </Link>
                      <button className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors">
                        <MessageSquare size={12} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === app.id ? null : app.id);
                          }}
                          className="h-6 w-6 flex items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 bg-white shadow-sm transition-colors"
                        >
                          <MoreVertical size={12} />
                        </button>
                        {openMenuId === app.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 z-50 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 text-[11px]"
                          >
                            <button
                              onClick={() => {
                                setDeletedIds((prev) => new Set([...prev, app.id]));
                                setSelectedIds((prev) => { const n = new Set(prev); n.delete(app.id); return n; });
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
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
              Showing {filteredApplications.length > 0 ? 1 : 0} to {Math.min(10, filteredApplications.length)} of {filteredApplications.length} entries
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
            <button className="h-6 w-6 rounded bg-indigo-700 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">1</button>
            <button className="h-6 w-6 rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">2</button>
            <button className="h-6 w-6 rounded border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center justify-center hover:bg-zinc-50 bg-white shadow-sm">3</button>
            <button className="h-6 w-6 rounded border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 bg-white shadow-sm">
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}