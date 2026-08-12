'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, History as HistoryIcon,
    Building2, Calendar, RefreshCcw, FileClock, Pencil, PlusCircle, UploadCloud,
    Trash2, CheckCircle2, Users, FileText, ClipboardList, ShieldPlus, Download,
    Users2, ChevronRight as ChevronRightIcon, Archive, ThumbsUp, ThumbsDown, X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';

// ---------------------------------------------------------------------------
// Types (mirror the backend)
// ---------------------------------------------------------------------------

type ActivityType =
    | 'Created' | 'Updated' | 'Added' | 'Uploaded'
    | 'Deleted' | 'Archived' | 'Approved' | 'Rejected';

type ActivityGroup =
    | 'Sub Department' | 'Team Member' | 'Document'
    | 'Master Data' | 'Budget' | 'Other';

interface PerformedBy {
    name: string;
    role: string;
    avatarUrl?: string;
}

interface HistoryEntry {
    _id: string;
    dateTime: string;
    activity: ActivityType;
    activityGroup: ActivityGroup;
    title: string;
    detail: string;
    performedBy: PerformedBy;
    ip: string;
}

interface SubDepartmentSummary {
    _id: string;
    name: string;
    code: string;
    department: string;
    parentDepartment: string;
    createdBy: PerformedBy;
    createdOn: string;
    lastUpdated: string;
    totalChanges: number;
}

interface SummaryItem {
    name: ActivityType;
    value: number;
    percentage: number;
}

interface GroupItem {
    label: ActivityGroup;
    count: number;
}

const ACTIVITY_TYPE_OPTIONS: ActivityType[] = [
    'Created', 'Updated', 'Added', 'Uploaded', 'Deleted', 'Archived', 'Approved', 'Rejected',
];

const ACTIVITY_COLORS: Record<ActivityType, string> = {
    Created: '#22c55e',
    Updated: '#3b82f6',
    Added: '#0ea5e9',
    Uploaded: '#6366f1',
    Deleted: '#f97316',
    Archived: '#a1a1aa',
    Approved: '#10b981',
    Rejected: '#ef4444',
};

const activityStyles: Record<ActivityType, { icon: any; bg: string; text: string }> = {
    Updated: { icon: Pencil, bg: 'bg-blue-50', text: 'text-blue-600' },
    Added: { icon: PlusCircle, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    Uploaded: { icon: UploadCloud, bg: 'bg-sky-50', text: 'text-sky-600' },
    Deleted: { icon: Trash2, bg: 'bg-rose-50', text: 'text-rose-600' },
    Created: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    Archived: { icon: Archive, bg: 'bg-zinc-100', text: 'text-zinc-500' },
    Approved: { icon: ThumbsUp, bg: 'bg-teal-50', text: 'text-teal-600' },
    Rejected: { icon: ThumbsDown, bg: 'bg-red-50', text: 'text-red-600' },
};

const GROUP_ICONS: Record<ActivityGroup, { icon: any; color: string }> = {
    'Sub Department': { icon: Building2, color: 'text-indigo-500' },
    'Team Member': { icon: Users2, color: 'text-blue-500' },
    'Document': { icon: FileText, color: 'text-emerald-500' },
    'Master Data': { icon: ClipboardList, color: 'text-amber-500' },
    'Budget': { icon: ShieldPlus, color: 'text-violet-500' },
    'Other': { icon: FileClock, color: 'text-zinc-400' },
};

// Maps the page's tab keys to the `activityGroup` value the backend filters on.
const TAB_GROUP_MAP: Record<string, ActivityGroup | undefined> = {
    all: undefined,
    master: 'Master Data',
    team: 'Team Member',
    documents: 'Document',
};

const quickActions = [
    { label: 'View Team Members', icon: Users },
    { label: 'View Documents', icon: FileText },
    { label: 'Change History Report', icon: ClipboardList },
    { label: 'Audit Trail Export', icon: ShieldPlus },
];

// ---------------------------------------------------------------------------
// Dummy data – displayed when the API returns no entries
// ---------------------------------------------------------------------------
const DUMMY_ACTIVITIES: HistoryEntry[] = [
    {
        _id: 'dummy-001',
        dateTime: '2026-08-12T07:30:00Z',
        activity: 'Updated',
        activityGroup: 'Sub Department',
        title: 'Sub Department Details Updated',
        detail: 'Department name changed from "Interior" to "Interior Design"',
        performedBy: { name: 'Vijay Sharma', role: 'HR Manager', avatarUrl: '' },
        ip: '192.168.1.42',
    },
];

const DUMMY_SUMMARY: SummaryItem[] = [
    { name: 'Updated', value: 1, percentage: 100 },
];

const DUMMY_GROUPS: GroupItem[] = [
    { label: 'Sub Department', count: 1 },
];

const DUMMY_SUB_DEPARTMENT: SubDepartmentSummary = {
    _id: 'dummy-sub-dept-001',
    name: 'Interior Design',
    code: 'interior-design',
    department: 'Design',
    parentDepartment: 'Creative',
    createdBy: { name: 'Admin User', role: 'Super Admin' },
    createdOn: '2026-01-15T09:00:00Z',
    lastUpdated: '2026-08-12T07:30:00Z',
    totalChanges: 1,
};

const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return { date: '-', time: '' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: dateStr, time: '' };
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
};

// ---------------------------------------------------------------------------

export default function HistoryPage() {
    const filterRef = useRef<HTMLDivElement>(null);

    // If your route isn't dynamic, replace this with a hardcoded code or a prop.
    const params = useParams<{ code?: string }>();
    const code = params?.code || 'interior-design';

    const [subDepartment, setSubDepartment] = useState<SubDepartmentSummary | null>(null);
    const [activitiesData, setActivitiesData] = useState<HistoryEntry[]>([]);
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [summaryData, setSummaryData] = useState<SummaryItem[]>([]);
    const [groupsData, setGroupsData] = useState<GroupItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarLoading, setIsSidebarLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'all' | 'master' | 'team' | 'documents'>('all');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activityTypeFilter, setActivityTypeFilter] = useState('All Activity Types');
    const [userFilter, setUserFilter] = useState('All Users');
    const [knownUsers, setKnownUsers] = useState<string[]>([]);

    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isActivityTypeOpen, setIsActivityTypeOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    // ------------------------------------------------------------------
    // Fetch: paginated history (re-runs on any filter/page/tab change)
    // ------------------------------------------------------------------
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/sub-departments/${code}/history`, {
                params: {
                    page: currentPage,
                    limit: rowsPerPage,
                    activity: activityTypeFilter !== 'All Activity Types' ? activityTypeFilter : undefined,
                    user: userFilter !== 'All Users' ? userFilter : undefined,
                    group: TAB_GROUP_MAP[activeTab],
                    startDate: startDate || undefined,
                    endDate: endDate || undefined,
                },
            });

            const { data, subDepartment: subDept, pagination } = response.data;

            const activities: HistoryEntry[] = (data && data.length > 0) ? data : DUMMY_ACTIVITIES;
            const subDeptData = subDept || DUMMY_SUB_DEPARTMENT;

            setActivitiesData(activities);
            setSubDepartment(subDeptData);
            setTotalEntries(pagination?.total ?? activities.length);
            setTotalPages(Math.max(1, pagination?.totalPages ?? 1));

            // Grow the known-users list as new names show up, so the dropdown
            // doesn't shrink to only whoever is on the current page.
            setKnownUsers((prev) => {
                const names: string[] = activities.map((a: HistoryEntry) => a.performedBy?.name).filter(Boolean);
                return Array.from(new Set([...prev, ...names]));
            });
        } catch (error) {
            console.error('Error fetching history:', error);
            // Fall back to dummy data so the page isn\'t blank during development
            setActivitiesData(DUMMY_ACTIVITIES);
            setSubDepartment(DUMMY_SUB_DEPARTMENT);
            setTotalEntries(DUMMY_ACTIVITIES.length);
            setTotalPages(1);
            setKnownUsers(DUMMY_ACTIVITIES.map((a) => a.performedBy.name));
        } finally {
            setIsLoading(false);
        }
    }, [code, currentPage, activityTypeFilter, userFilter, activeTab, startDate, endDate]);

    // ------------------------------------------------------------------
    // Fetch: summary + activity groups (unfiltered, once per code)
    // ------------------------------------------------------------------
    const fetchSidebarData = useCallback(async () => {
        setIsSidebarLoading(true);
        try {
            const [summaryRes, groupsRes] = await Promise.all([
                api.get(`/sub-departments/${code}/history/summary`),
                api.get(`/sub-departments/${code}/history/activity-groups`),
            ]);

            const summary = summaryRes.data.data;
            const groups = groupsRes.data.data;
            setSummaryData((summary && summary.length > 0) ? summary : DUMMY_SUMMARY);
            setGroupsData((groups && groups.length > 0) ? groups : DUMMY_GROUPS);
        } catch (error) {
            console.error('Error fetching history sidebar data:', error);
            // Fall back to dummy sidebar data
            setSummaryData(DUMMY_SUMMARY);
            setGroupsData(DUMMY_GROUPS);
        } finally {
            setIsSidebarLoading(false);
        }
    }, [code]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    useEffect(() => {
        fetchSidebarData();
    }, [fetchSidebarData]);

    // Reset to page 1 whenever a filter (other than page itself) changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activityTypeFilter, userFilter, activeTab, startDate, endDate]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsActivityTypeOpen(false);
                setIsUserOpen(false);
                setIsDateOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userOptions = ['All Users', ...knownUsers];
    const activityTypeOptions = ['All Activity Types', ...ACTIVITY_TYPE_OPTIONS];

    const handleClearFilters = () => {
        setActivityTypeFilter('All Activity Types');
        setUserFilter('All Users');
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    const handleDownloadHistory = () => {
        // CSV export of the current page's data. Swap for a real export
        // endpoint if you add one server-side.
        if (activitiesData.length === 0) {
            toast.error('No activities to export');
            return;
        }
        const header = ['Date', 'Time', 'Activity', 'Group', 'Title', 'Detail', 'Performed By', 'Role', 'IP'];
        const rows = activitiesData.map((a) => {
            const dt = formatDateTime(a.dateTime);
            return [dt.date, dt.time, a.activity, a.activityGroup, a.title, a.detail, a.performedBy?.name, a.performedBy?.role, a.ip];
        });
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${code}-history.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const dateRangeLabel = startDate || endDate
        ? `${startDate || '…'} - ${endDate || '…'}`
        : 'All Dates';

    const created = formatDateTime(subDepartment?.createdOn);
    const updated = formatDateTime(subDepartment?.lastUpdated);
    const totalChangesLabel = subDepartment?.totalChanges ?? 0;

    const summaryTotal = summaryData.reduce((sum, item) => sum + item.value, 0);

    // Build page numbers for the footer (compact, current-page centered)
    const pageNumbers = (() => {
        const pages = new Set<number>();
        pages.add(1);
        pages.add(totalPages);
        pages.add(currentPage);
        if (currentPage - 1 > 1) pages.add(currentPage - 1);
        if (currentPage + 1 < totalPages) pages.add(currentPage + 1);
        return Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    })();

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="text-[12px] text-zinc-500 font-medium mb-0.5">
                <span>Organization Setup</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Sub Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span className="text-indigo-600 font-semibold">History</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900 mb-0.5">
                        <HistoryIcon className="w-5 h-5 text-indigo-600" /> History
                    </h1>
                    <p className="text-[12px] text-zinc-500">View all activities and changes made in this sub department.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sub Departments
                    </button>
                    <button
                        onClick={handleDownloadHistory}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <Download className="w-3.5 h-3.5" /> Download History
                    </button>
                </div>
            </div>

            {/* SUB DEPARTMENT SUMMARY CARD */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 min-w-[220px]">
                    <div className="w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-zinc-900">{subDepartment?.name || (isLoading ? 'Loading...' : '-')}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">Sub Department</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Code: {subDepartment?.code || '-'}</p>
                        <p className="text-[11px] text-zinc-500">Department: {subDepartment?.department || '-'}</p>
                        <p className="text-[11px] text-zinc-500">Parent Department: <span className="font-semibold text-zinc-700">{subDepartment?.parentDepartment || '-'}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    {subDepartment?.createdBy?.avatarUrl ? (
                        <img src={subDepartment.createdBy.avatarUrl} alt={subDepartment.createdBy.name} className="w-8 h-8 rounded-full border border-zinc-200 shrink-0" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 shrink-0" />
                    )}
                    <div>
                        <p className="text-[10px] text-zinc-400">Created By</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{subDepartment?.createdBy?.name || '-'}</p>
                        <p className="text-[10.5px] text-zinc-400">{subDepartment?.createdBy?.role || ''}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-violet-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Created On</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{created.date}</p>
                        <p className="text-[10.5px] text-zinc-400">{created.time}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                        <RefreshCcw className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Last Updated</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{updated.date}</p>
                        <p className="text-[10.5px] text-zinc-400">{updated.time}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                        <FileClock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Total Changes</p>
                        <p className="text-[13px] font-bold text-zinc-800">{totalChangesLabel}</p>
                        <p className="text-[10.5px] text-zinc-400">This sub department</p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1 border-b border-zinc-200 mt-1 px-1">
                {[
                    { key: 'all', label: 'All Activities' },
                    { key: 'master', label: 'Master Data Changes' },
                    { key: 'team', label: 'Team & Access Changes' },
                    { key: 'documents', label: 'Document Activities' },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`px-3 py-2 text-[12px] font-semibold border-b-2 transition-colors -mb-px ${activeTab === tab.key
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* MAIN GRID: TABLE + SIDEBAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-1">

                <div className="lg:col-span-9 flex flex-col gap-2">
                    {/* FILTER BAR */}
                    <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2 flex flex-wrap items-stretch md:items-center gap-2">
                        {/* Date Range */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsDateOpen(!isDateOpen); setIsActivityTypeOpen(false); setIsUserOpen(false); }}
                                className="flex items-center justify-between gap-2 h-9 px-3 w-full md:w-56 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> <span className="truncate">{dateRangeLabel}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isDateOpen && (
                                <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-zinc-200 shadow-lg rounded-md p-3 z-50 flex flex-col gap-2">
                                    <label className="text-[11px] font-semibold text-zinc-600">
                                        Start Date
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="mt-1 w-full h-8 px-2 border border-zinc-200 rounded-md text-[12px]"
                                        />
                                    </label>
                                    <label className="text-[11px] font-semibold text-zinc-600">
                                        End Date
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="mt-1 w-full h-8 px-2 border border-zinc-200 rounded-md text-[12px]"
                                        />
                                    </label>
                                    {(startDate || endDate) && (
                                        <button
                                            onClick={() => { setStartDate(''); setEndDate(''); }}
                                            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 self-start mt-1"
                                        >
                                            <X className="w-3 h-3" /> Clear dates
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* All Activity Types */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsActivityTypeOpen(!isActivityTypeOpen); setIsUserOpen(false); setIsDateOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-44 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{activityTypeFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isActivityTypeOpen && (
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {activityTypeOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setActivityTypeFilter(opt); setIsActivityTypeOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Users */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsUserOpen(!isUserOpen); setIsActivityTypeOpen(false); setIsDateOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-40 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{userFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isUserOpen && (
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {userOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setUserFilter(opt); setIsUserOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-1.5 h-9 px-3 border border-zinc-200 rounded-md text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" /> Clear Filters
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50/60">
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap w-4"></th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Date & Time</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Activity</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Details</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Performed By</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-zinc-500 font-medium">
                                                Loading history...
                                            </td>
                                        </tr>
                                    ) : activitiesData.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-zinc-500 font-medium">
                                                No activities found
                                            </td>
                                        </tr>
                                    ) : activitiesData.map((a) => {
                                        const style = activityStyles[a.activity] || { icon: FileClock, bg: 'bg-zinc-100', text: 'text-zinc-500' };
                                        const ActivityIcon = style.icon;
                                        const dt = formatDateTime(a.dateTime);
                                        return (
                                            <tr key={a._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors relative">
                                                <td className="py-3 pl-3 align-top">
                                                    <span className="block w-2 h-2 rounded-full bg-indigo-400 mt-1.5" />
                                                </td>
                                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                                    <p className="font-semibold text-zinc-800">{dt.date}</p>
                                                    <p className="text-[10.5px] text-zinc-400">{dt.time}</p>
                                                </td>
                                                <td className="py-3 px-3 align-top">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                                                            <ActivityIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="leading-tight">
                                                            <p className={`font-bold ${style.text}`}>{a.activity}</p>
                                                            <p className="text-[10.5px] text-zinc-400">{a.activityGroup}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 align-top max-w-[260px]">
                                                    <p className="font-semibold text-zinc-800">{a.title}</p>
                                                    <p className="text-[10.5px] text-zinc-400 mt-0.5">{a.detail}</p>
                                                </td>
                                                <td className="py-3 px-3 align-top">
                                                    <div className="flex items-center gap-2">
                                                        {a.performedBy?.avatarUrl ? (
                                                            <img src={a.performedBy.avatarUrl} alt={a.performedBy.name} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 shrink-0" />
                                                        )}
                                                        <div className="leading-tight">
                                                            <p className="font-semibold text-zinc-800 text-[11px] whitespace-nowrap">{a.performedBy?.name}</p>
                                                            <p className="text-[10.5px] text-zinc-500">{a.performedBy?.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 align-top text-zinc-500 whitespace-nowrap">{a.ip}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-3 flex items-center justify-between text-[12px] text-zinc-500">
                            <div className="pl-1">
                                Showing {activitiesData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                                {Math.min(currentPage * rowsPerPage, totalEntries)} of {totalEntries} activities
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                {pageNumbers.map((page, idx) => (
                                    <React.Fragment key={page}>
                                        {idx > 0 && page - pageNumbers[idx - 1] > 1 && (
                                            <span className="px-1 text-zinc-400">...</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${currentPage === page
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                    {/* Activity Summary */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Activity Summary</h2>
                        {isSidebarLoading ? (
                            <p className="text-[11px] text-zinc-400 text-center py-6">Loading...</p>
                        ) : summaryData.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 text-center py-6">No activity yet</p>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={summaryData}
                                                innerRadius="68%"
                                                outerRadius="100%"
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                                isAnimationActive={false}
                                            >
                                                {summaryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[entry.name] || '#a1a1aa'} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-bold text-zinc-900">{summaryTotal}</span>
                                        <span className="text-[10px] text-zinc-400">Total</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 w-full mt-3">
                                    {summaryData.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[11px]">
                                            <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ACTIVITY_COLORS[item.name] || '#a1a1aa' }} />
                                                <span className="text-zinc-700 font-medium truncate">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-zinc-600 font-semibold whitespace-nowrap">{item.value}</span>
                                                <span className="text-zinc-400 whitespace-nowrap">({item.percentage}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Activity Type (by group) */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Activity Type</h2>
                        {isSidebarLoading ? (
                            <p className="text-[11px] text-zinc-400 text-center py-4">Loading...</p>
                        ) : groupsData.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 text-center py-4">No data</p>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                {groupsData.map((item, idx) => {
                                    const meta = GROUP_ICONS[item.label] || { icon: FileClock, color: 'text-zinc-400' };
                                    const ItemIcon = meta.icon;
                                    return (
                                        <div key={idx} className="flex items-center justify-between text-[11.5px]">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${meta.color}`} />
                                                <span className="text-zinc-700 font-medium truncate">{item.label}</span>
                                            </div>
                                            <span className="text-zinc-800 font-bold shrink-0">{item.count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Quick Actions</h2>
                        <div className="flex flex-col gap-1">
                            {quickActions.map((action, idx) => {
                                const ActionIcon = action.icon;
                                return (
                                    <button
                                        key={idx}
                                        className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11.5px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <ActionIcon className="w-4 h-4 text-indigo-500" /> {action.label}
                                        </span>
                                        <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-300" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}