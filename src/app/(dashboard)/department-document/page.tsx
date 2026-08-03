'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    Plus, Upload, Search, ChevronDown, Check, ChevronLeft, ChevronRight, ArrowLeft,
    Eye, Download, MoreVertical, FileText, Folder, Building2, Calendar,
    Users, MapPin, FileSpreadsheet, FileType2, File as FileIcon,
    UploadCloud, FolderPlus, FolderOpen, Trash2, ShieldCheck, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_DEPARTMENT = {
    name: 'Interior Design',
    status: 'Active',
    code: 'INT-DSN',
    parentDepartment: 'Design & Build',
    head: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=deptHead1' },
    totalEmployees: 12,
    location: 'Noida, Uttar Pradesh',
    createdOn: '2025-05-15',
};

const MOCK_DOCUMENTS = [
    {
        _id: 'doc1',
        name: 'Department SOP Manual',
        note: 'Standard Operating Procedures for Interior Design Department',
        category: 'SOPs & Policies',
        fileType: 'PDF',
        size: '2.45 MB',
        uploadedBy: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=doc1' },
        uploadedOn: '2025-05-15T10:30:00',
        status: 'Active',
    },
    {
        _id: 'doc2',
        name: 'Department Organization Chart',
        note: 'Current structure and reporting hierarchy of the department',
        category: 'Organization',
        fileType: 'DOCX',
        size: '1.12 MB',
        uploadedBy: { firstName: 'Neha', lastName: 'Joshi', designation: 'Executive', avatarUrl: 'https://i.pravatar.cc/150?u=doc2' },
        uploadedOn: '2025-05-14T16:15:00',
        status: 'Active',
    },
    {
        _id: 'doc3',
        name: 'Budget Allocation FY 2025-26',
        note: 'Department-wise budget and allocation details',
        category: 'Finance',
        fileType: 'XLSX',
        size: '820 KB',
        uploadedBy: { firstName: 'Amit', lastName: 'Verma', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=doc3' },
        uploadedOn: '2025-05-13T11:20:00',
        status: 'Active',
    },
];

const documentSummary = [
    { name: 'SOPs & Policies', value: 1, percent: '33.33%', color: '#4f46e5' },
    { name: 'Organization', value: 1, percent: '33.33%', color: '#3b82f6' },
    { name: 'Finance', value: 1, percent: '33.33%', color: '#10b981' },
];

const categoryStyles: Record<string, string> = {
    'SOPs & Policies': 'bg-purple-50 text-purple-600',
    Organization: 'bg-blue-50 text-blue-600',
    Finance: 'bg-emerald-50 text-emerald-600',
};

const fileTypeIcons: Record<string, { icon: any; bg: string; text: string }> = {
    PDF: { icon: FileText, bg: 'bg-rose-50', text: 'text-rose-600' },
    DOCX: { icon: FileType2, bg: 'bg-blue-50', text: 'text-blue-600' },
    XLSX: { icon: FileSpreadsheet, bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

const quickActions = [
    { label: 'Upload Document', icon: UploadCloud },
    { label: 'Create New Folder', icon: FolderPlus },
    { label: 'Document Categories', icon: FolderOpen },
    { label: 'View Trash', icon: Trash2 },
    { label: 'Document Permissions', icon: ShieldCheck },
];
// ---------------------------------------------------------------------------

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const datePart = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { datePart, timePart };
};

const formatSimpleDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function DepartmentDocumentsPage() {
    const router = useRouter();
    const filterRef = useRef<HTMLDivElement>(null);

    const [department, setDepartment] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
    const [statusFilter, setStatusFilter] = useState('All Status');

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isFileTypeOpen, setIsFileTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/departments/current/documents');
                const data = response.data.data;
                setDepartment(data?.department || MOCK_DEPARTMENT);
                setDocuments(data?.documents?.length > 0 ? data.documents : MOCK_DOCUMENTS);
            } catch (error) {
                console.error('Error fetching documents:', error);
                toast.error('Failed to load documents, showing sample data');
                setDepartment(MOCK_DEPARTMENT);
                setDocuments(MOCK_DOCUMENTS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
                setIsFileTypeOpen(false);
                setIsStatusOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const mappedDocuments = documents.map((d) => ({
        id: d._id,
        name: d.name || '-',
        note: d.note || '',
        category: d.category || '-',
        fileType: d.fileType || '-',
        size: d.size || '-',
        uploadedByName: d.uploadedBy ? `${d.uploadedBy.firstName} ${d.uploadedBy.lastName}` : 'Unassigned',
        uploadedByRole: d.uploadedBy?.designation || '-',
        uploadedByAvatar: d.uploadedBy?.avatarUrl || `https://i.pravatar.cc/150?u=${d._id}`,
        uploadedOn: d.uploadedOn,
        status: d.status || 'Active',
    }));

    const categoryOptions = ['All Categories', ...Array.from(new Set(mappedDocuments.map((d) => d.category)))];
    const fileTypeOptions = ['All File Types', ...Array.from(new Set(mappedDocuments.map((d) => d.fileType)))];
    const statusOptions = ['All Status', ...Array.from(new Set(mappedDocuments.map((d) => d.status)))];

    const processedDocuments = mappedDocuments.filter((d) => {
        let isValid = true;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            if (!d.name.toLowerCase().includes(q)) isValid = false;
        }
        if (categoryFilter !== 'All Categories' && d.category !== categoryFilter) isValid = false;
        if (fileTypeFilter !== 'All File Types' && d.fileType !== fileTypeFilter) isValid = false;
        if (statusFilter !== 'All Status' && d.status !== statusFilter) isValid = false;
        return isValid;
    });

    const handleClear = () => {
        setSearchQuery('');
        setCategoryFilter('All Categories');
        setFileTypeFilter('All File Types');
        setStatusFilter('All Status');
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(processedDocuments.length / rowsPerPage));
    const paginatedDocuments = processedDocuments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const dept = department || MOCK_DEPARTMENT;
    const totalDocs = documents.length;

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 mb-0.5">
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Organization Setup</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments" className="hover:text-indigo-600 transition-colors">Departments</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments/details" className="hover:text-indigo-600 transition-colors">Department Details</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 font-semibold">Documents ({totalDocs})</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Folder className="w-4 h-4" />
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 leading-tight">Department Details: Documents ({totalDocs})</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard/departments/details')}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Upload Document
                    </button>
                </div>
            </div>
            <p className="text-[12px] text-zinc-500 -mt-1 mb-1">View and manage all documents related to this sub department.</p>

            {/* DEPARTMENT INFO CARD */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 flex flex-wrap items-center gap-x-8 gap-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Department</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-bold text-zinc-900">{dept.name}</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">{dept.status}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Department Code: {dept.code}</p>
                        <p className="text-[11px] text-zinc-500">Parent Department: {dept.parentDepartment}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <img src={dept.head?.avatarUrl} alt="Department Head" className="w-9 h-9 rounded-full border border-zinc-200 shrink-0" />
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Department Head</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.head?.firstName} {dept.head?.lastName}</p>
                        <p className="text-[10.5px] text-zinc-500">{dept.head?.designation}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Users className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Total Employees</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.totalEmployees}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Location</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.location}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Created On</p>
                        <p className="text-[13px] font-bold text-zinc-800">{formatSimpleDate(dept.createdOn)}</p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-6 border-b border-zinc-200 px-1">
                <button className="py-2.5 text-[12.5px] font-semibold border-b-2 border-indigo-600 text-indigo-600">
                    Documents
                </button>
                <span className="py-2.5 text-[12.5px] font-medium text-zinc-500">
                    {totalDocs} Documents
                </span>
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">

                {/* LEFT: TABLE */}
                <div className="xl:col-span-3 flex flex-col gap-2">

                    {/* FILTER BAR */}
                    <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2.5 flex flex-wrap items-stretch md:items-center gap-2">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="pl-8 pr-3 h-9 w-full bg-white border border-zinc-200 rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                            />
                        </div>

                        {/* All Categories */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsFileTypeOpen(false); setIsStatusOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-40 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{categoryFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {categoryOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setCategoryFilter(opt); setIsCategoryOpen(false); setCurrentPage(1); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span> {categoryFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All File Types */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsFileTypeOpen(!isFileTypeOpen); setIsCategoryOpen(false); setIsStatusOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-40 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{fileTypeFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isFileTypeOpen && (
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {fileTypeOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setFileTypeFilter(opt); setIsFileTypeOpen(false); setCurrentPage(1); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span> {fileTypeFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Status */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); setIsFileTypeOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-36 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{statusFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); setCurrentPage(1); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span> {statusFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="shrink-0">
                            <button
                                onClick={handleClear}
                                className="h-9 px-3.5 border border-zinc-200 rounded-md text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50">
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">#</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Document Name</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Category</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">File Type</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">File Size</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Uploaded By</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Uploaded On</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                                        <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11.5px]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                Loading documents...
                                            </td>
                                        </tr>
                                    ) : paginatedDocuments.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                No documents found
                                            </td>
                                        </tr>
                                    ) : paginatedDocuments.map((d, idx) => {
                                        const fileTypeStyle = fileTypeIcons[d.fileType] || { icon: FileIcon, bg: 'bg-zinc-100', text: 'text-zinc-500' };
                                        const FileTypeIcon = fileTypeStyle.icon;
                                        const dateInfo = formatDate(d.uploadedOn);
                                        return (
                                            <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                                <td className="py-2.5 px-3 text-zinc-500 font-semibold">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                                <td className="py-2.5 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fileTypeStyle.bg} ${fileTypeStyle.text}`}>
                                                            <FileTypeIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="leading-tight">
                                                            <p className="font-bold text-zinc-800 text-[12px] whitespace-nowrap underline decoration-zinc-200 underline-offset-2">{d.name}</p>
                                                            {d.note && <p className="text-[10.5px] text-zinc-500 mt-0.5 max-w-[220px]">{d.note}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${categoryStyles[d.category] || 'bg-zinc-100 text-zinc-600'}`}>
                                                        {d.category}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
                                                        <FileTypeIcon className="w-3.5 h-3.5 text-zinc-400" /> {d.fileType}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3 text-zinc-700">{d.size}</td>
                                                <td className="py-2.5 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <img src={d.uploadedByAvatar} alt={d.uploadedByName} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
                                                        <div className="leading-tight">
                                                            <p className="font-semibold text-zinc-800 text-[11px] whitespace-nowrap">{d.uploadedByName}</p>
                                                            <p className="text-[10.5px] text-zinc-500">{d.uploadedByRole}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3 text-zinc-700">
                                                    {typeof dateInfo === 'object' ? (
                                                        <div className="leading-tight">
                                                            <p>{dateInfo.datePart}</p>
                                                            <p className="text-[10.5px] text-zinc-400">{dateInfo.timePart}</p>
                                                        </div>
                                                    ) : dateInfo}
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${
                                                        d.status === 'Active'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                    }`}>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button className="p-1.5 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" title="View">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="p-1.5 text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors" title="Download">
                                                            <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors" title="More">
                                                            <MoreVertical className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                            <div className="pl-1">
                                Showing {processedDocuments.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                                {Math.min(currentPage * rowsPerPage, processedDocuments.length)} of {processedDocuments.length} entries
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-6 h-6 flex items-center justify-center border rounded-md font-semibold ${
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
                                    className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* NOTE BOX */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3">
                        <div className="text-indigo-500 shrink-0 mt-0.5">
                            <Info className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-[12.5px] font-bold text-zinc-800 mb-1.5">Note</h3>
                            <ul className="list-disc list-inside space-y-1 text-[11.5px] text-zinc-600">
                                <li>Ensure all documents are up to date and relevant to the department.</li>
                                <li>Only authorized users can upload, edit or delete documents.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-1 flex flex-col gap-2">

                    {/* Document Summary */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Document Summary</h2>
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative w-24 h-24">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={documentSummary}
                                            innerRadius="65%"
                                            outerRadius="100%"
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            {documentSummary.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[18px] font-bold text-zinc-900">{totalDocs}</span>
                                    <span className="text-[10px] text-zinc-500 font-semibold">Total</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 w-full">
                                {documentSummary.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="text-zinc-700 font-medium truncate">{item.name}</span>
                                        </div>
                                        <span className="text-zinc-600 font-semibold whitespace-nowrap ml-1">{item.value} ({item.percent})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Storage Usage */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Storage Usage</h2>
                        <div className="flex items-center justify-between text-[11.5px] mb-1.5">
                            <span className="text-zinc-600 font-medium">4.37 MB of 5 GB Used</span>
                            <span className="text-zinc-800 font-bold">0.09%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '2%' }} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-500">Used Space</span>
                                <span className="text-zinc-800 font-semibold">4.37 MB</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-500">Available Space</span>
                                <span className="text-zinc-800 font-semibold">5.00 GB</span>
                            </div>
                        </div>
                        <button className="text-[11px] font-semibold text-indigo-600 hover:underline mt-2 flex items-center gap-1">
                            View Storage Details <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Quick Actions</h2>
                        <div className="flex flex-col gap-1">
                            {quickActions.map((action, idx) => {
                                const ActionIcon = action.icon;
                                return (
                                    <button
                                        key={idx}
                                        className="flex items-center gap-2.5 px-2 py-2 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
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
