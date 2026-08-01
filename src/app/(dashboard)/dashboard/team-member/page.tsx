'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
    Plus, Search, ChevronDown, Check, ChevronLeft, ChevronRight,
    Eye, Pencil, MoreVertical, ArrowLeft, Users, UserCheck, CalendarDays,
    Building2, Network, UserCog, Landmark, Wallet, UserPlus, ShieldCheck,
    UploadCloud, Download, GitBranch
} from 'lucide-react';
import api from '@/lib/axios';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_SUB_DEPARTMENT = {
    name: 'Interior Design',
    code: 'INT-DSN',
    department: 'Design & Build',
    reportingTo: 'Design & Build Head Office',
    totalMembers: 12,
    activeMembers: 11,
    effectiveDate: '2025-06-01',
    parentDepartment: 'Design & Build',
    departmentHead: 'Rahul Nair',
    businessUnit: 'Design House – Projects',
    costCenter: 'CC-DB-INT-01',
};

const MOCK_TEAM_MEMBERS = [
    {
        _id: 'tm1',
        firstName: 'Rahul',
        lastName: 'Nair',
        employeeId: 'DHI1023',
        designation: 'Senior Interior Designer',
        role: 'Team Lead',
        email: 'rahul.nair@dhipl.com',
        mobile: '9876543210',
        status: 'Active',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm1',
    },
    {
        _id: 'tm2',
        firstName: 'Neha',
        lastName: 'Joshi',
        employeeId: 'DHI1045',
        designation: 'Interior Designer',
        role: 'Designer',
        email: 'neha.joshi@dhipl.com',
        mobile: '9876543211',
        status: 'Active',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm2',
    },
    {
        _id: 'tm3',
        firstName: 'Amit',
        lastName: 'Verma',
        employeeId: 'DHI1058',
        designation: '3D Visualizer',
        role: 'Visualizer',
        email: 'amit.verma@dhipl.com',
        mobile: '9876543212',
        status: 'Active',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm3',
    },
    {
        _id: 'tm4',
        firstName: 'Pooja',
        lastName: 'Mehta',
        employeeId: 'DHI1062',
        designation: 'Project Coordinator',
        role: 'Coordinator',
        email: 'pooja.mehta@dhipl.com',
        mobile: '9876543213',
        status: 'Active',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm4',
    },
    {
        _id: 'tm5',
        firstName: 'Vikram',
        lastName: 'Singh',
        employeeId: 'DHI1069',
        designation: 'Site Supervisor',
        role: 'Supervisor',
        email: 'vikram.singh@dhipl.com',
        mobile: '9876543214',
        status: 'Active',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm5',
    },
    {
        _id: 'tm6',
        firstName: 'Anjali',
        lastName: 'Sharma',
        employeeId: 'DHI1076',
        designation: 'Material & FF&E Specialist',
        role: 'Specialist',
        email: 'anjali.sharma@dhipl.com',
        mobile: '9876543215',
        status: 'Inactive',
        avatarUrl: 'https://i.pravatar.cc/150?u=tm6',
    },
];

const MOCK_TOTAL_ENTRIES = 12;

const quickActions = [
    { label: 'Add Team Member', icon: UserPlus },
    { label: 'Assign Roles', icon: ShieldCheck },
    { label: 'Bulk Upload Members', icon: UploadCloud },
    { label: 'Download Member List', icon: Download },
    { label: 'View Team Hierarchy', icon: GitBranch },
];
// ---------------------------------------------------------------------------

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const roleStyles: Record<string, string> = {
    'Team Lead': 'bg-blue-50 text-blue-600',
    Designer: 'bg-fuchsia-50 text-fuchsia-600',
    Visualizer: 'bg-emerald-50 text-emerald-600',
    Coordinator: 'bg-orange-50 text-orange-600',
    Supervisor: 'bg-amber-50 text-amber-600',
    Specialist: 'bg-rose-50 text-rose-600',
};

export default function TeamMembersPage() {
    const filterRef = useRef<HTMLDivElement>(null);

    const [subDepartment, setSubDepartment] = useState<any>(MOCK_SUB_DEPARTMENT);
    const [membersData, setMembersData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'members' | 'hierarchy' | 'roles'>('members');

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [employmentFilter, setEmploymentFilter] = useState('All Employment Types');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isEmploymentOpen, setIsEmploymentOpen] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        status: 'All Status',
        role: 'All Roles',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get('/sub-departments/interior-design/team-members');
                const data = response.data.data || [];
                setMembersData(data.length > 0 ? data : MOCK_TEAM_MEMBERS);
                setSubDepartment(response.data.subDepartment || MOCK_SUB_DEPARTMENT);
            } catch (error) {
                console.error('Error fetching team members:', error);
                toast.error('Failed to load team members, showing sample data');
                setMembersData(MOCK_TEAM_MEMBERS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
                setIsRoleOpen(false);
                setIsEmploymentOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const mappedMembers = membersData.map((m) => ({
        id: m._id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        employeeId: m.employeeId,
        designation: m.designation,
        role: m.role,
        mobile: m.mobile,
        status: m.status || 'Active',
        avatarUrl: m.avatarUrl || `https://i.pravatar.cc/150?u=${m._id}`,
    }));

    const statusOptions = ['All Status', ...Array.from(new Set(mappedMembers.map((m) => m.status)))];
    const roleOptions = ['All Roles', ...Array.from(new Set(mappedMembers.map((m) => m.role)))];
    const employmentOptions = ['All Employment Types', 'Full-Time', 'Part-Time', 'Contract'];

    let processedMembers = mappedMembers.filter((m) => {
        let isValid = true;

        if (appliedFilters.search.trim()) {
            const q = appliedFilters.search.toLowerCase();
            const matchesGlobal =
                m.name.toLowerCase().includes(q) ||
                m.employeeId.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q);
            if (!matchesGlobal) isValid = false;
        }

        if (appliedFilters.status !== 'All Status' && m.status !== appliedFilters.status) isValid = false;
        if (appliedFilters.role !== 'All Roles' && m.role !== appliedFilters.role) isValid = false;

        return isValid;
    });

    const handleApply = () => {
        setAppliedFilters({
            search: searchQuery,
            status: statusFilter,
            role: roleFilter,
        });
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(MOCK_TOTAL_ENTRIES / rowsPerPage));
    const paginatedMembers = processedMembers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const statusStyles: Record<string, string> = {
        Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Inactive: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    };

    const overviewItems = [
        { label: 'Sub Department', value: subDepartment.name, icon: Building2, bg: 'bg-indigo-50', text: 'text-indigo-600' },
        { label: 'Parent Department', value: subDepartment.parentDepartment, icon: Network, bg: 'bg-blue-50', text: 'text-blue-600' },
        { label: 'Department Head', value: subDepartment.departmentHead, icon: UserCog, bg: 'bg-rose-50', text: 'text-rose-600' },
        { label: 'Business Unit', value: subDepartment.businessUnit, icon: Landmark, bg: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Cost Center', value: subDepartment.costCenter, icon: Wallet, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    ];

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="text-[12px] text-zinc-500 font-medium mb-0.5">
                <span>Organization Setup</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Sub Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span className="text-indigo-600 font-semibold">Team Members</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900 mb-0.5">
                        <Users className="w-5 h-5 text-indigo-600" /> Team Members
                    </h1>
                    <p className="text-[12px] text-zinc-500">View and manage team members working in this sub department.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sub Departments
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add Team Member
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
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[170px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <Network className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Reporting To</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{subDepartment.reportingTo}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[130px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Total Members</p>
                        <p className="text-[13px] font-bold text-zinc-800">{subDepartment.totalMembers}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Active Members</p>
                        <p className="text-[13px] font-bold text-emerald-600">{subDepartment.activeMembers}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Effective Date</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{formatDate(subDepartment.effectiveDate)}</p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1 border-b border-zinc-200 mt-1 px-1">
                {[
                    { key: 'members', label: 'Team Members' },
                    { key: 'hierarchy', label: 'Team Hierarchy' },
                    { key: 'roles', label: 'Roles & Responsibilities' },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={`px-3 py-2 text-[12px] font-semibold border-b-2 transition-colors -mb-px ${
                            activeTab === tab.key
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
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by name, employee ID, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                                className="pl-8 pr-3 h-9 w-full bg-white border border-zinc-200 rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                            />
                        </div>

                        {/* All Status */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsRoleOpen(false); setIsEmploymentOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-32 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                {statusFilter} <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                                            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            {opt} {statusFilter === opt && <Check className="w-3 h-3 text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Roles */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsRoleOpen(!isRoleOpen); setIsStatusOpen(false); setIsEmploymentOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-36 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{roleFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isRoleOpen && (
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {roleOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setRoleFilter(opt); setIsRoleOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span> {roleFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Employment Types */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsEmploymentOpen(!isEmploymentOpen); setIsStatusOpen(false); setIsRoleOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-48 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{employmentFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isEmploymentOpen && (
                                <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {employmentOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setEmploymentFilter(opt); setIsEmploymentOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span> {employmentFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200">
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">#</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Employee</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Employee ID</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Designation</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Role</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Email</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Mobile</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Status</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 text-center whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                Loading team members...
                                            </td>
                                        </tr>
                                    ) : paginatedMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                No team members found
                                            </td>
                                        </tr>
                                    ) : paginatedMembers.map((m, idx) => (
                                        <tr key={m.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                            <td className="py-3 px-3 text-zinc-500 font-semibold align-top">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                            <td className="py-3 px-3 align-top">
                                                <div className="flex items-center gap-2">
                                                    <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
                                                    <span className="font-bold text-zinc-800 text-[12px] whitespace-nowrap">{m.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 align-top text-zinc-700 font-medium whitespace-nowrap">{m.employeeId}</td>
                                            <td className="py-3 px-3 align-top text-zinc-700 whitespace-nowrap">{m.designation}</td>
                                            <td className="py-3 px-3 align-top">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${roleStyles[m.role] || 'bg-zinc-100 text-zinc-500'}`}>
                                                    {m.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 align-top text-zinc-500">{m.email}</td>
                                            <td className="py-3 px-3 align-top text-zinc-700 whitespace-nowrap">{m.mobile}</td>
                                            <td className="py-3 px-3 align-top">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${statusStyles[m.status] || 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                                    {m.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 align-top">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button className="p-1.5 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" title="View">
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="p-1.5 text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors" title="Edit">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors" title="More">
                                                        <MoreVertical className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-3 flex items-center justify-between text-[12px] text-zinc-500">
                            <div className="pl-1">
                                Showing {processedMembers.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                                {Math.min(currentPage * rowsPerPage, processedMembers.length)} of {MOCK_TOTAL_ENTRIES} entries
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${
                                            currentPage === page
                                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
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
                    {/* Sub Department Overview */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Sub Department Overview</h2>
                        <div className="flex flex-col gap-3">
                            {overviewItems.map((item, idx) => {
                                const ItemIcon = item.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-2.5">
                                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.bg} ${item.text}`}>
                                            <ItemIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-zinc-400 leading-tight">{item.label}</p>
                                            <p className="text-[11.5px] font-semibold text-zinc-800 truncate">{item.value}</p>
                                        </div>
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
                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[11.5px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <ActionIcon className="w-4 h-4 text-indigo-500" /> {action.label}
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