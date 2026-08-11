'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, History as HistoryIcon,
    Building2, Calendar, RefreshCcw, FileClock, Pencil, PlusCircle, UploadCloud,
    Trash2, CheckCircle2, Users, FileText, ClipboardList, ShieldPlus, Download,
    Users2, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_SUB_DEPARTMENT = {
    name: 'Interior Design',
    code: 'INT-DSN',
    department: 'Design & Build',
    parentDepartment: 'Design & Build',
    createdBy: { name: 'Rahul Nair', role: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=creator' },
    createdOn: '2025-05-15T10:30:00',
    lastUpdated: '2025-06-01T16:25:00',
    totalChanges: 28,
};

const MOCK_ACTIVITIES = [
    {
        _id: 'act1',
        dateTime: '2025-06-01T16:25:00',
        activity: 'Updated',
        activityGroup: 'Sub Department',
        title: 'Updated description and reporting manager',
        detail: 'Reporting To changed from "Operations Head" to "Design & Build Head"',
        performedBy: { name: 'Rahul Nair', role: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=act1' },
        ip: '192.168.1.45',
    },
    {
        _id: 'act2',
        dateTime: '2025-05-31T15:15:00',
        activity: 'Added',
        activityGroup: 'Team Member',
        title: 'Added new team member',
        detail: 'Amit Verma (3D Visualizer) added to the team',
        performedBy: { name: 'Neha Joshi', role: 'Executive', avatarUrl: 'https://i.pravatar.cc/150?u=act2' },
        ip: '192.168.1.32',
    },
    {
        _id: 'act3',
        dateTime: '2025-05-30T11:40:00',
        activity: 'Updated',
        activityGroup: 'Sub Department',
        title: 'Updated sub department details',
        detail: 'Short name changed from "Inter Design" to "Interior Design"',
        performedBy: { name: 'Vijay Sharma', role: 'Super Admin', avatarUrl: 'https://i.pravatar.cc/150?u=act3' },
        ip: '192.168.1.10',
    },
    {
        _id: 'act4',
        dateTime: '2025-05-28T14:05:00',
        activity: 'Uploaded',
        activityGroup: 'Document',
        title: 'Uploaded document',
        detail: '"Interior Design SOP Manual.pdf" uploaded',
        performedBy: { name: 'Pooja Mehta', role: 'Coordinator', avatarUrl: 'https://i.pravatar.cc/150?u=act4' },
        ip: '192.168.1.55',
    },
    {
        _id: 'act5',
        dateTime: '2025-05-26T10:20:00',
        activity: 'Deleted',
        activityGroup: 'Team Member',
        title: 'Removed team member',
        detail: 'Vikram Singh removed from the team',
        performedBy: { name: 'Rahul Nair', role: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=act5' },
        ip: '192.168.1.45',
    },
    {
        _id: 'act6',
        dateTime: '2025-05-20T17:45:00',
        activity: 'Created',
        activityGroup: 'Sub Department',
        title: 'Sub department created',
        detail: 'Interior Design (INT-DSN) created under Design & Build',
        performedBy: { name: 'Vijay Sharma', role: 'Super Admin', avatarUrl: 'https://i.pravatar.cc/150?u=act6' },
        ip: '192.168.1.10',
    },
];

const MOCK_TOTAL_ENTRIES = 28;

const activitySummary = [
    { name: 'Created', value: 6, percent: '21.43%', color: '#22c55e' },
    { name: 'Updated', value: 12, percent: '42.86%', color: '#3b82f6' },
    { name: 'Deleted', value: 3, percent: '10.71%', color: '#f97316' },
    { name: 'Others', value: 7, percent: '25.00%', color: '#8b5cf6' },
];

const activityTypes = [
    { label: 'Sub Department Changes', count: 10, icon: Building2, color: 'text-indigo-500' },
    { label: 'Team & Access Changes', count: 8, icon: Users2, color: 'text-blue-500' },
    { label: 'Document Activities', count: 6, icon: FileText, color: 'text-emerald-500' },
    { label: 'Master Data Changes', count: 3, icon: ClipboardList, color: 'text-amber-500' },
    { label: 'Others', count: 1, icon: FileClock, color: 'text-zinc-400' },
];

const quickActions = [
    { label: 'View Team Members', icon: Users },
    { label: 'View Documents', icon: FileText },
    { label: 'Change History Report', icon: ClipboardList },
    { label: 'Audit Trail Export', icon: ShieldPlus },
];
// ---------------------------------------------------------------------------

const activityStyles: Record<string, { icon: any; bg: string; text: string }> = {
    Updated: { icon: Pencil, bg: 'bg-blue-50', text: 'text-blue-600' },
    Added: { icon: PlusCircle, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    Uploaded: { icon: UploadCloud, bg: 'bg-sky-50', text: 'text-sky-600' },
    Deleted: { icon: Trash2, bg: 'bg-rose-50', text: 'text-rose-600' },
    Created: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return { date: '-', time: '' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: dateStr, time: '' };
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
};

export default function HistoryPage() {
    const filterRef = useRef<HTMLDivElement>(null);

    const [subDepartment, setSubDepartment] = useState<any>(MOCK_SUB_DEPARTMENT);
    const [activitiesData, setActivitiesData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'all' | 'master' | 'team' | 'documents'>('all');

    const [dateRange, setDateRange] = useState('01/05/2025 - 01/06/2025');
    const [activityTypeFilter, setActivityTypeFilter] = useState('All Activity Types');
    const [userFilter, setUserFilter] = useState('All Users');

    const [isActivityTypeOpen, setIsActivityTypeOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/sub-departments/interior-design/history');
                const data = response.data.data || [];
                setActivitiesData(data.length > 0 ? data : MOCK_ACTIVITIES);
                setSubDepartment(response.data.subDepartment || MOCK_SUB_DEPARTMENT);
            } catch (error) {
                console.error('Error fetching history:', error);
                toast.error('Failed to load history, showing sample data');
                setActivitiesData(MOCK_ACTIVITIES);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsActivityTypeOpen(false);
                setIsUserOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userOptions = ['All Users', ...Array.from(new Set(activitiesData.map((a) => a.performedBy?.name).filter(Boolean)))];
    const activityTypeOptions = ['All Activity Types', ...Array.from(new Set(activitiesData.map((a) => a.activity)))];

    const handleClearFilters = () => {
        setActivityTypeFilter('All Activity Types');
        setUserFilter('All Users');
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(MOCK_TOTAL_ENTRIES / rowsPerPage));
    const paginatedActivities = activitiesData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const created = formatDateTime(subDepartment.createdOn);
    const updated = formatDateTime(subDepartment.lastUpdated);

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
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sub Departments
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
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
                            <span className="text-[13px] font-bold text-zinc-900">{subDepartment.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">Sub Department</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Code: {subDepartment.code}</p>
                        <p className="text-[11px] text-zinc-500">Department: {subDepartment.department}</p>
                        <p className="text-[11px] text-zinc-500">Parent Department: <span className="font-semibold text-zinc-700">{subDepartment.parentDepartment}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <img src={subDepartment.createdBy?.avatarUrl} alt={subDepartment.createdBy?.name} className="w-8 h-8 rounded-full border border-zinc-200 shrink-0" />
                    <div>
                        <p className="text-[10px] text-zinc-400">Created By</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{subDepartment.createdBy?.name}</p>
                        <p className="text-[10.5px] text-zinc-400">{subDepartment.createdBy?.role}</p>
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
                        <p className="text-[13px] font-bold text-zinc-800">{subDepartment.totalChanges}</p>
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
                        <div className="relative shrink-0">
                            <button className="flex items-center justify-between gap-2 h-9 px-3 w-full md:w-52 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> <span className="truncate">{dateRange}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                        </div>

                        {/* All Activity Types */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsActivityTypeOpen(!isActivityTypeOpen); setIsUserOpen(false); }}
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
                                onClick={() => { setIsUserOpen(!isUserOpen); setIsActivityTypeOpen(false); }}
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
                                    ) : paginatedActivities.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-zinc-500 font-medium">
                                                No activities found
                                            </td>
                                        </tr>
                                    ) : paginatedActivities.map((a) => {
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
                                                        <img src={a.performedBy?.avatarUrl} alt={a.performedBy?.name} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
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
                                Showing {paginatedActivities.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                                {Math.min(currentPage * rowsPerPage, MOCK_TOTAL_ENTRIES)} of {MOCK_TOTAL_ENTRIES} activities
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${currentPage === page
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <span className="px-1 text-zinc-400">...</span>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${currentPage === totalPages
                                            ? 'border-indigo-600 bg-indigo-600 text-white'
                                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                        }`}
                                >
                                    {totalPages}
                                </button>
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
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={activitySummary}
                                            innerRadius="68%"
                                            outerRadius="100%"
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            {activitySummary.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-zinc-900">{subDepartment.totalChanges}</span>
                                    <span className="text-[10px] text-zinc-400">Total</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full mt-3">
                                {activitySummary.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="text-zinc-700 font-medium truncate">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-zinc-600 font-semibold whitespace-nowrap">{item.value}</span>
                                            <span className="text-zinc-400 whitespace-nowrap">({item.percent})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Type */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Activity Type</h2>
                        <div className="flex flex-col gap-2.5">
                            {activityTypes.map((item, idx) => {
                                const ItemIcon = item.icon;
                                return (
                                    <div key={idx} className="flex items-center justify-between text-[11.5px]">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                                            <span className="text-zinc-700 font-medium truncate">{item.label}</span>
                                        </div>
                                        <span className="text-zinc-800 font-bold shrink-0">{item.count}</span>
                                    </div>
                                );
                            })}
                        </div>
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