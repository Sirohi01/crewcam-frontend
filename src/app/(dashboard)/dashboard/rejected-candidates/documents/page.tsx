'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, FolderOpen, Building2, FileText, HardDrive, CalendarDays, Users2, Folder, Plus, UploadCloud, Search, Eye, Download, MoreVertical, FileSpreadsheet, FileType2, FileArchive, FileImage, ShieldCheck, FileSearch, Trash2, ArrowRight} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '@/lib/axios';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_SUB_DEPARTMENT = {
    name: 'Interior Design',
    code: 'INT-DSN',
    department: 'Design & Build',
    parentDepartment: 'Design & Build',
    totalDocuments: 48,
    totalSize: '2.48 GB',
    lastUpdated: '2025-06-01',
    accessMembers: 12,
};

const MOCK_FOLDERS = [
    { name: 'Policies & Guidelines', count: 8 },
    { name: 'SOPs & Processes', count: 12 },
    { name: 'Forms & Templates', count: 6 },
    { name: 'Reports', count: 7 },
    { name: 'Presentations', count: 5 },
];

const MOCK_DOCUMENTS = [
    {
        _id: 'doc1',
        name: 'Interior Design - SOP Manual.pdf',
        subtitle: 'Standard Operating Procedures',
        category: 'SOPs & Processes',
        fileType: 'PDF',
        size: '2.45 MB',
        uploadedBy: { name: 'Rahul Nair', role: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=doc1' },
        uploadedOn: '2025-06-01T10:30:00',
    },
    {
        _id: 'doc2',
        name: 'Team Roles & Responsibilities.docx',
        subtitle: 'Roles and Responsibilities',
        category: 'Forms & Templates',
        fileType: 'DOCX',
        size: '1.25 MB',
        uploadedBy: { name: 'Neha Joshi', role: 'Executive', avatarUrl: 'https://i.pravatar.cc/150?u=doc2' },
        uploadedOn: '2025-05-31T16:15:00',
    },
    {
        _id: 'doc3',
        name: 'Budget Allocation FY 2025-26.xlsx',
        subtitle: 'Budget Plan and Allocation',
        category: 'Reports',
        fileType: 'XLSX',
        size: '820 KB',
        uploadedBy: { name: 'Amit Verma', role: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=doc3' },
        uploadedOn: '2025-05-30T11:20:00',
    },
    {
        _id: 'doc4',
        name: 'ID Project Workflow.pdf',
        subtitle: 'Project Workflow Document',
        category: 'SOPs & Processes',
        fileType: 'PDF',
        size: '1.85 MB',
        uploadedBy: { name: 'Pooja Mehta', role: 'Coordinator', avatarUrl: 'https://i.pravatar.cc/150?u=doc4' },
        uploadedOn: '2025-05-29T15:40:00',
    },
    {
        _id: 'doc5',
        name: 'Interior Design Overview.pptx',
        subtitle: 'Sub Department Overview',
        category: 'Presentations',
        fileType: 'PPTX',
        size: '3.15 MB',
        uploadedBy: { name: 'Vikram Singh', role: 'Supervisor', avatarUrl: 'https://i.pravatar.cc/150?u=doc5' },
        uploadedOn: '2025-05-28T14:10:00',
    },
    {
        _id: 'doc6',
        name: 'Client Drawings & Assets.zip',
        subtitle: 'Design Assets and Drawings',
        category: 'Project Assets',
        fileType: 'ZIP',
        size: '18.64 MB',
        uploadedBy: { name: 'Anjali Sharma', role: 'Specialist', avatarUrl: 'https://i.pravatar.cc/150?u=doc6' },
        uploadedOn: '2025-05-27T12:05:00',
    },
];

const MOCK_TOTAL_ENTRIES = 48;

const storage = {
    usedGb: 2.48,
    totalGb: 10,
    usedPct: 24.8,
    availablePct: 75.2,
};

const categories = [
    { label: 'SOPs & Processes', count: 12, color: '#4f46e5' },
    { label: 'Forms & Templates', count: 6, color: '#3b82f6' },
    { label: 'Reports', count: 7, color: '#10b981' },
    { label: 'Presentations', count: 5, color: '#f59e0b' },
    { label: 'Policies & Guidelines', count: 8, color: '#f43f5e' },
    { label: 'Others', count: 4, color: '#a1a1aa' },
];

const quickActions = [
    { label: 'Upload Document', icon: UploadCloud },
    { label: 'Bulk Upload', icon: FileSearch },
    { label: 'Document Request', icon: FileText },
    { label: 'View Deleted Documents', icon: Trash2 },
    { label: 'Document Permissions', icon: ShieldCheck },
];
// ---------------------------------------------------------------------------

const fileTypeStyles: Record<string, { icon: any; bg: string; text: string }> = {
    PDF: { icon: FileText, bg: 'bg-rose-50', text: 'text-rose-600' },
    DOCX: { icon: FileType2, bg: 'bg-blue-50', text: 'text-blue-600' },
    XLSX: { icon: FileSpreadsheet, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    PPTX: { icon: FileImage, bg: 'bg-orange-50', text: 'text-orange-600' },
    ZIP: { icon: FileArchive, bg: 'bg-violet-50', text: 'text-violet-600' },
};

const categoryStyles: Record<string, string> = {
    'SOPs & Processes': 'bg-blue-50 text-blue-600',
    'Forms & Templates': 'bg-sky-50 text-sky-600',
    Reports: 'bg-emerald-50 text-emerald-600',
    Presentations: 'bg-orange-50 text-orange-600',
    'Policies & Guidelines': 'bg-rose-50 text-rose-600',
    'Project Assets': 'bg-teal-50 text-teal-600',
};

const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return { date: '-', time: '' };
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: dateStr, time: '' };
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { date, time };
};

export default function DocumentsPage() {
    const filterRef = useRef<HTMLDivElement>(null);

    const [subDepartment, setSubDepartment] = useState<any>(MOCK_SUB_DEPARTMENT);
    const [folders, setFolders] = useState<any[]>(MOCK_FOLDERS);
    const [documentsData, setDocumentsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [fileTypeFilter, setFileTypeFilter] = useState('All File Types');
    const [uploadedByFilter, setUploadedByFilter] = useState('Uploaded By');

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isFileTypeOpen, setIsFileTypeOpen] = useState(false);
    const [isUploadedByOpen, setIsUploadedByOpen] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        category: 'All Categories',
        fileType: 'All File Types',
        uploadedBy: 'Uploaded By',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get('/sub-departments/interior-design/documents');
                const data = response.data.data || [];
                setDocumentsData(data.length > 0 ? data : MOCK_DOCUMENTS);
                setSubDepartment(response.data.subDepartment || MOCK_SUB_DEPARTMENT);
                setFolders(response.data.folders || MOCK_FOLDERS);
            } catch (error) {
                console.error('Error fetching documents:', error);
                toast.error('Failed to load documents, showing sample data');
                setDocumentsData(MOCK_DOCUMENTS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
                setIsFileTypeOpen(false);
                setIsUploadedByOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categoryOptions = ['All Categories', ...Array.from(new Set(documentsData.map((d) => d.category)))];
    const fileTypeOptions = ['All File Types', ...Array.from(new Set(documentsData.map((d) => d.fileType)))];
    const uploadedByOptions = ['Uploaded By', ...Array.from(new Set(documentsData.map((d) => d.uploadedBy?.name).filter(Boolean)))];

    let processedDocuments = documentsData.filter((d) => {
        let isValid = true;

        if (appliedFilters.search.trim()) {
            const q = appliedFilters.search.toLowerCase();
            if (!d.name.toLowerCase().includes(q)) isValid = false;
        }

        if (appliedFilters.category !== 'All Categories' && d.category !== appliedFilters.category) isValid = false;
        if (appliedFilters.fileType !== 'All File Types' && d.fileType !== appliedFilters.fileType) isValid = false;
        if (appliedFilters.uploadedBy !== 'Uploaded By' && d.uploadedBy?.name !== appliedFilters.uploadedBy) isValid = false;

        return isValid;
    });

    const handleApply = () => {
        setAppliedFilters({
            search: searchQuery,
            category: categoryFilter,
            fileType: fileTypeFilter,
            uploadedBy: uploadedByFilter,
        });
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearchQuery('');
        setCategoryFilter('All Categories');
        setFileTypeFilter('All File Types');
        setUploadedByFilter('Uploaded By');
        setAppliedFilters({ search: '', category: 'All Categories', fileType: 'All File Types', uploadedBy: 'Uploaded By' });
        setCurrentPage(1);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedDocuments.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedDocuments.map((d) => d.id));
        }
    };

    const totalPages = Math.max(1, Math.ceil(MOCK_TOTAL_ENTRIES / rowsPerPage));

    const mappedDocuments = processedDocuments.map((d) => ({ ...d, id: d._id }));
    const paginatedDocuments = mappedDocuments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="text-[12px] text-zinc-500 font-medium mb-0.5">
                <span>Organization Setup</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span>Sub Departments</span> <span className="mx-1 text-zinc-300">›</span>
                <span className="text-indigo-600 font-semibold">Documents</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-900 mb-0.5">
                        <FolderOpen className="w-5 h-5 text-indigo-600" /> Documents
                    </h1>
                    <p className="text-[12px] text-zinc-500">Manage and access all documents related to this sub department.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sub Departments
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <UploadCloud className="w-3.5 h-3.5" /> Upload Document
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> New Folder
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

                <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Total Documents</p>
                        <p className="text-[13px] font-bold text-zinc-800">{subDepartment.totalDocuments}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <HardDrive className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Total Size</p>
                        <p className="text-[13px] font-bold text-zinc-800">{subDepartment.totalSize}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[150px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Last Updated</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{formatDateTime(subDepartment.lastUpdated).date}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[140px]">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0">
                        <Users2 className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                        <p className="text-[10px] text-zinc-400">Access</p>
                        <p className="text-[12px] font-semibold text-zinc-800">{subDepartment.accessMembers} Members</p>
                    </div>
                </div>
            </div>

            {/* FOLDERS */}
            <div className="mt-1">
                <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Folders</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {folders.map((folder, idx) => (
                        <button
                            key={idx}
                            className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 flex flex-col items-start gap-2 hover:border-indigo-300 hover:shadow-md transition-all text-left"
                        >
                            <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center">
                                <Folder className="w-4.5 h-4.5 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-zinc-800 leading-tight">{folder.name}</p>
                                <p className="text-[10.5px] text-zinc-400 mt-0.5">{folder.count} Files</p>
                            </div>
                        </button>
                    ))}
                    <button className="bg-white border border-dashed border-zinc-300 rounded-md p-3 flex flex-col items-center justify-center gap-1.5 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-zinc-500 hover:text-indigo-600">
                        <Plus className="w-5 h-5" />
                        <span className="text-[11px] font-semibold">New Folder</span>
                    </button>
                </div>
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
                                placeholder="Search documents by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                                className="pl-8 pr-3 h-9 w-full bg-white border border-zinc-200 rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                            />
                        </div>

                        {/* All Categories */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsFileTypeOpen(false); setIsUploadedByOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-40 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{categoryFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {categoryOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setCategoryFilter(opt); setIsCategoryOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All File Types */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsFileTypeOpen(!isFileTypeOpen); setIsCategoryOpen(false); setIsUploadedByOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-36 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{fileTypeFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isFileTypeOpen && (
                                <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {fileTypeOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setFileTypeFilter(opt); setIsFileTypeOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Uploaded By */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => { setIsUploadedByOpen(!isUploadedByOpen); setIsCategoryOpen(false); setIsFileTypeOpen(false); }}
                                className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-36 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                <span className="truncate">{uploadedByFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            </button>
                            {isUploadedByOpen && (
                                <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                                    {uploadedByOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => { setUploadedByFilter(opt); setIsUploadedByOpen(false); }}
                                            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                        >
                                            <span className="truncate">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleClear}
                                className="h-9 px-3.5 border border-zinc-200 rounded-md text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApply}
                                className="h-9 px-3.5 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50/60">
                                        <th className="py-2.5 px-3 w-8">
                                            <input
                                                type="checkbox"
                                                checked={paginatedDocuments.length > 0 && selectedIds.length === paginatedDocuments.length}
                                                onChange={toggleSelectAll}
                                                className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Document Name</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Category</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">File Type</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Size</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Uploaded By</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Uploaded On</th>
                                        <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 text-center whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-zinc-500 font-medium">
                                                Loading documents...
                                            </td>
                                        </tr>
                                    ) : paginatedDocuments.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-zinc-500 font-medium">
                                                No documents found
                                            </td>
                                        </tr>
                                    ) : paginatedDocuments.map((d) => {
                                        const style = fileTypeStyles[d.fileType] || { icon: FileText, bg: 'bg-zinc-100', text: 'text-zinc-500' };
                                        const FileIcon = style.icon;
                                        const dt = formatDateTime(d.uploadedOn);
                                        return (
                                            <tr key={d.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                                <td className="py-3 px-3 align-top">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(d.id)}
                                                        onChange={() => toggleSelect(d.id)}
                                                        className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="py-3 px-3 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${style.bg} ${style.text}`}>
                                                            <FileIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="leading-tight">
                                                            <p className="font-bold text-zinc-800">{d.name}</p>
                                                            <p className="text-[10.5px] text-zinc-400 mt-0.5">{d.subtitle}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 align-top">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${categoryStyles[d.category] || 'bg-zinc-100 text-zinc-500'}`}>
                                                        {d.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 align-top text-zinc-700 font-medium whitespace-nowrap">{d.fileType}</td>
                                                <td className="py-3 px-3 align-top text-zinc-700 whitespace-nowrap">{d.size}</td>
                                                <td className="py-3 px-3 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <img src={d.uploadedBy?.avatarUrl} alt={d.uploadedBy?.name} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
                                                        <div className="leading-tight">
                                                            <p className="font-semibold text-zinc-800 text-[11px] whitespace-nowrap">{d.uploadedBy?.name}</p>
                                                            <p className="text-[10.5px] text-zinc-500">{d.uploadedBy?.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 align-top whitespace-nowrap">
                                                    <p className="font-semibold text-zinc-800">{dt.date}</p>
                                                    <p className="text-[10.5px] text-zinc-400">{dt.time}</p>
                                                </td>
                                                <td className="py-3 px-3 align-top">
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
                        <div className="p-3 flex items-center justify-between text-[12px] text-zinc-500">
                            <div className="pl-1">
                                Showing {paginatedDocuments.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                                {Math.min(currentPage * rowsPerPage, MOCK_TOTAL_ENTRIES)} of {MOCK_TOTAL_ENTRIES} entries
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
                                        className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${
                                            currentPage === page
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
                                    className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${
                                        currentPage === totalPages
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
                    {/* Storage Overview */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Storage Overview</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Used', value: storage.usedPct, color: '#4f46e5' },
                                                { name: 'Available', value: storage.availablePct, color: '#e0e7ff' },
                                            ]}
                                            innerRadius="65%"
                                            outerRadius="100%"
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            <Cell fill="#4f46e5" />
                                            <Cell fill="#e0e7ff" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-zinc-900">{storage.usedGb} GB</p>
                                <p className="text-[10.5px] text-zinc-400">of {storage.totalGb} GB Used</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-3">
                            <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                    <span className="text-zinc-700 font-medium">Used Space</span>
                                </div>
                                <span className="text-zinc-500">{storage.usedGb} GB ({storage.usedPct}%)</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-100" />
                                    <span className="text-zinc-700 font-medium">Available Space</span>
                                </div>
                                <span className="text-zinc-500">{(storage.totalGb - storage.usedGb).toFixed(2)} GB ({storage.availablePct}%)</span>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 mt-3 hover:underline">
                            View Storage Details <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[12px] font-bold text-zinc-800 mb-3">Categories</h2>
                        <div className="flex flex-col gap-2.5">
                            {categories.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11.5px]">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Folder className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                                        <span className="text-zinc-700 font-medium truncate">{item.label}</span>
                                    </div>
                                    <span className="text-zinc-800 font-bold shrink-0">{item.count}</span>
                                </div>
                            ))}
                        </div>
                        <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 mt-3 hover:underline">
                            View All Categories <ArrowRight className="w-3 h-3" />
                        </button>
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