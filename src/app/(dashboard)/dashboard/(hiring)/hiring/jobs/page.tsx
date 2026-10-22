'use client';
import React from 'react';
import Link from 'next/link';
import { Download, Upload, Plus, Search, Filter, RotateCcw, ChevronDown, Calendar, Clock, Briefcase, Globe, Info, Loader2, Trash2, LayoutGrid, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function JobsPage() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'today' | 'week'>('all');
  const [query, setQuery] = React.useState('');
  const [department, setDepartment] = React.useState('All Departments');
  const [sortField, setSortField] = React.useState('newest');

  const [showColumnsDropdown, setShowColumnsDropdown] = React.useState(false);
  const [visibleCols, setVisibleCols] = React.useState({
    jobCode: true,
    jobTitle: true,
    department: true,
    location: true,
    positions: true,
    priority: true,
    status: true,
  });

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = React.useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/hiring/manpower-request/${id}`);
    },
    onSuccess: (_, id) => {
      setDeletedIds((prev) => new Set([...prev, id]));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setConfirmDeleteId(null);
      setDeleteError(null);
    },
    onError: (err: any) => {
      setDeleteError(err?.response?.data?.message || 'Failed to delete job. Please try again.');
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

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/hiring/manpower-request');
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

  const rawJobs = Array.isArray(jobsResponse) ? jobsResponse : (jobsResponse?.data || []);
  const jobs = rawJobs.filter((c: any) => c.recruitmentStatus === 'Posted').map((c: any) => {
    return {
      id: c._id || c.id,
      jobCode: c.jobCode || (c._id || c.id || '').substring(0, 8).toUpperCase(),
      jobTitle: c.jobTitle || 'N/A',
      employmentType: c.employmentType || 'N/A',
      department: c.departmentId?.name || c.department || 'N/A',
      location: c.locationBranchId?.name || c.location || 'N/A',
      positions: c.numberOfPositions || c.positions || 1,
      priority: c.priority || 'Medium',
      status: c.status || 'Pending',
      createdAt: c.requestDate || c.createdAt || c.requestedOn || Date.now(),
      appliedOnDate: new Date(c.requestDate || c.createdAt || c.requestedOn || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
  });

  const stats = React.useMemo(() => {
    const activeJobs = jobs.filter((a: any) => !deletedIds.has(a.id));
    const total = activeJobs.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayCount = activeJobs.filter((a: any) => new Date(a.createdAt) >= todayStart).length;
    const openCount = activeJobs.filter((a: any) => a.status === 'Open' || a.status === 'Approved').length;
    const pendingCount = activeJobs.filter((a: any) => a.status === 'Pending' || a.status === 'Pending Approval').length;
    
    return [
      { label: 'Total Jobs', value: total.toString(), sub1: 'All posted jobs', bg: 'bg-indigo-50', color: 'text-indigo-600', icon: Briefcase },
      { label: 'Open Jobs', value: openCount.toString(), sub1: 'Active jobs', bg: 'bg-emerald-50', color: 'text-emerald-600', icon: Globe },
      { label: 'Pending Approval', value: pendingCount.toString(), sub1: 'Needs review', bg: 'bg-amber-50', color: 'text-amber-600', icon: Clock },
      { label: 'Created Today', value: todayCount.toString(), sub1: 'Recent additions', bg: 'bg-blue-50', color: 'text-blue-600', icon: Calendar },
      { label: 'Most Urgent', value: 'High', sub1: 'Top priority', bg: 'bg-rose-50', color: 'text-rose-600', icon: Info },
    ];
  }, [jobs, deletedIds]);

  const filteredJobs = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());

    let result = jobs
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => {
        let matchTab = true;
        const appliedDate = new Date(a.createdAt);
        if (activeTab === 'today') matchTab = appliedDate >= todayStart;
        if (activeTab === 'week') matchTab = appliedDate >= weekStart;

        const q = query.trim().toLowerCase();
        const matchQuery = !q ||
          a.jobTitle.toLowerCase().includes(q) ||
          a.jobCode.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q);

        const matchDept = department === 'All Departments' || a.department === department;
        return matchTab && matchQuery && matchDept;
      });

    if (sortField === 'newest') {
      result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortField === 'oldest') {
      result.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortField === 'name-asc') {
      result.sort((a: any, b: any) => a.jobTitle.localeCompare(b.jobTitle));
    } else if (sortField === 'name-desc') {
      result.sort((a: any, b: any) => b.jobTitle.localeCompare(a.jobTitle));
    }

    return result;
  }, [jobs, deletedIds, activeTab, query, department, sortField]);

  const todayCount = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return jobs
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => new Date(a.createdAt) >= todayStart).length;
  }, [jobs, deletedIds]);

  const weekCount = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());
    return jobs
      .filter((a: any) => !deletedIds.has(a.id))
      .filter((a: any) => new Date(a.createdAt) >= weekStart).length;
  }, [jobs, deletedIds]);

  return (
    <div className="w-full mx-auto px-1 py-0.5 lg:px-2 lg:py-1 space-y-2.5 font-sans text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">New Jobs</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Manage and track all posted jobs in the system</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Download size={13} /> Export
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Upload size={13} /> Import
          </button>
          <button onClick={() => window.open("/dashboard/hiring/jobs/new", '_self')} className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Plus size={14} /> Post New Job
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
              placeholder="Search by job title, job code, or department..."
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
            <label className="text-[10px] font-semibold text-zinc-700">Location</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                <option>All Locations</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-zinc-700">Status</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] text-zinc-600 focus:outline-none focus:border-indigo-500 shadow-sm ">
                <option>All Status</option>
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
              All Jobs
              ({jobs.filter((a: any) => !deletedIds.has(a.id)).length})
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
                <option value="name-asc">Title (A-Z)</option>
                <option value="name-desc">Title (Z-A)</option>
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
                    checked={filteredJobs.length > 0 && filteredJobs.every((app: any) => selectedIds.has(app.id))}
                    ref={(el) => {
                      if (el) el.indeterminate =
                        filteredJobs.some((app: any) => selectedIds.has(app.id)) &&
                        !filteredJobs.every((app: any) => selectedIds.has(app.id));
                    }}
                    onChange={(e) => handleToggleAll(e.target.checked, filteredJobs.map((app: any) => app.id))}
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
                  />
                </th>
                {visibleCols.jobCode && <th className="px-3 py-2 font-bold text-center">Job Code</th>}
                {visibleCols.jobTitle && <th className="px-3 py-2 font-bold">Job Title</th>}
                {visibleCols.department && <th className="px-3 py-2 font-bold text-center">Department</th>}
                {visibleCols.location && <th className="px-3 py-2 font-bold text-center">Location</th>}
                {visibleCols.positions && <th className="px-3 py-2 font-bold text-center">Positions</th>}
                {visibleCols.priority && <th className="px-3 py-2 font-bold text-center">Priority</th>}
                {visibleCols.status && <th className="px-3 py-2 font-bold text-center">Status</th>}
                <th className="px-3 py-2 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-10 text-center"><Loader2 className="inline animate-spin text-indigo-600" /></td></tr>
              ) : filteredJobs.length === 0 ? (
                <tr><td colSpan={9} className="py-10 text-center text-[12px] text-zinc-500">
                  {activeTab === 'today' ? 'No jobs posted today' : activeTab === 'week' ? 'No jobs posted this week' : 'No jobs found'}
                </td></tr>
              ) : filteredJobs.map((app: any) => (
                <tr key={app.id} className={`transition-colors ${selectedIds.has(app.id) ? 'bg-indigo-50/60' : 'hover:bg-zinc-50/50'}`}>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.id)}
                      onChange={() => handleToggle(app.id)}
                      className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer accent-indigo-600"
                    />
                  </td>
                  {visibleCols.jobCode && (
                    <td className="px-3 py-2 text-[10px] font-semibold text-violet-700 text-center">
                      {app.jobCode}
                    </td>
                  )}
                  {visibleCols.jobTitle && (
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/dashboard/hiring/jobs/${app.id}`} className="font-bold text-indigo-700 hover:underline">{app.jobTitle}</Link>
                        <span className="text-[9px] font-medium text-zinc-500">{app.employmentType}</span>
                      </div>
                    </td>
                  )}
                  {visibleCols.department && <td className="px-3 py-2 font-medium text-zinc-700 text-center">{app.department}</td>}
                  {visibleCols.location && <td className="px-3 py-2 font-medium text-zinc-700 text-center">{app.location}</td>}
                  {visibleCols.positions && <td className="px-3 py-2 font-bold text-zinc-800 text-center">{app.positions}</td>}
                  {visibleCols.priority && (
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                        app.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        app.priority === 'Low' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {app.priority}
                      </span>
                    </td>
                  )}
                  {visibleCols.status && (
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        app.status === 'Closed' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  )}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/dashboard/hiring/jobs/${app.id}`}
                        title="View Job Details"
                        className="h-6 w-6 flex items-center justify-center rounded border border-indigo-100 text-indigo-700 hover:bg-indigo-50 bg-white shadow-sm transition-colors"
                      >
                        <Eye size={12} />
                      </Link>
                      <button
                        onClick={() => handleDeleteRow(app.id)}
                        title="Delete"
                        className="h-6 w-6 flex items-center justify-center rounded border border-rose-100 text-rose-600 hover:bg-rose-50 bg-white shadow-sm transition-colors"
                      >
                        <Trash2 size={12} />
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
              Showing {filteredJobs.length > 0 ? 1 : 0} to {Math.min(10, filteredJobs.length)} of {filteredJobs.length} entries
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
                <h3 className="text-[15px] font-bold text-zinc-800">Delete Job?</h3>
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
