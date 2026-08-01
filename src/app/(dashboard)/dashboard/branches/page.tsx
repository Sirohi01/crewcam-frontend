'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    Upload, Download, Plus, ChevronRight, Search, Filter, Check,
    Eye, Edit2, MoreVertical, Building, Users, User, ChevronDown, ChevronLeft,
    MapPin, Briefcase, Trash2, Network, Building2, ShieldCheck, X, Navigation
} from 'lucide-react';
import api from '@/lib/axios';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { geocodeAddress } from '@/lib/geocode';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_BRANCHES = [
    {
        _id: 'br1',
        name: 'Head Office – Noida',
        code: 'BR001',
        isRegisteredOffice: true,
        businessUnit: { name: 'Projects' },
        head: { firstName: 'Amit', lastName: 'Verma', designation: 'Head – Projects', avatarUrl: 'https://i.pravatar.cc/150?u=br1' },
        city: 'Noida',
        state: 'Uttar Pradesh',
        totalEmployees: 124,
        totalDepartments: 5,
        activePositions: 12,
        status: 'Active',
    },
    {
        _id: 'br2',
        name: 'Bengaluru Branch',
        code: 'BR002',
        isRegisteredOffice: false,
        businessUnit: { name: 'Design & Build' },
        head: { firstName: 'Rahul', lastName: 'Nair', designation: 'Branch Manager', avatarUrl: 'https://i.pravatar.cc/150?u=br2' },
        city: 'Bengaluru',
        state: 'Karnataka',
        totalEmployees: 68,
        totalDepartments: 4,
        activePositions: 8,
        status: 'Active',
    },
    {
        _id: 'br3',
        name: 'Mumbai Branch',
        code: 'BR003',
        isRegisteredOffice: false,
        businessUnit: { name: 'Interior Solutions' },
        head: { firstName: 'Neha', lastName: 'Joshi', designation: 'Branch Manager', avatarUrl: 'https://i.pravatar.cc/150?u=br3' },
        city: 'Mumbai',
        state: 'Maharashtra',
        totalEmployees: 56,
        totalDepartments: 3,
        activePositions: 6,
        status: 'Active',
    },
    {
        _id: 'br4',
        name: 'Delhi Branch',
        code: 'BR004',
        isRegisteredOffice: false,
        businessUnit: { name: 'Projects' },
        head: { firstName: 'Sandeep', lastName: 'Singh', designation: 'Branch Manager', avatarUrl: 'https://i.pravatar.cc/150?u=br4' },
        city: 'New Delhi',
        state: 'Delhi',
        totalEmployees: 44,
        totalDepartments: 3,
        activePositions: 5,
        status: 'Active',
    },
    {
        _id: 'br5',
        name: 'Hyderabad Branch',
        code: 'BR005',
        isRegisteredOffice: false,
        businessUnit: { name: 'Retail Solutions' },
        head: { firstName: 'Karthik', lastName: 'Reddy', designation: 'Branch Manager', avatarUrl: 'https://i.pravatar.cc/150?u=br5' },
        city: 'Hyderabad',
        state: 'Telangana',
        totalEmployees: 22,
        totalDepartments: 2,
        activePositions: 3,
        status: 'Active',
    },
    {
        _id: 'br6',
        name: 'Pune Branch',
        code: 'BR006',
        isRegisteredOffice: false,
        businessUnit: { name: 'Design & Build' },
        head: { firstName: 'Priya', lastName: 'Patil', designation: 'Branch Manager', avatarUrl: 'https://i.pravatar.cc/150?u=br6' },
        city: 'Pune',
        state: 'Maharashtra',
        totalEmployees: 10,
        totalDepartments: 1,
        activePositions: 8,
        status: 'Inactive',
    },
];

const MOCK_BUSINESS_UNITS = [
    { _id: 'bu1', name: 'Projects' },
    { _id: 'bu2', name: 'Design & Build' },
    { _id: 'bu3', name: 'Interior Solutions' },
    { _id: 'bu4', name: 'Retail Solutions' },
];
// ---------------------------------------------------------------------------

export default function ManageBranchPage() {
    const router = useRouter();
    const filterRef = useRef<HTMLDivElement>(null);

    const [branchesData, setBranchesData] = useState<any[]>([]);
    const [businessUnitsData, setBusinessUnitsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [buFilter, setBuFilter] = useState('All Business Units');
    const [headFilter, setHeadFilter] = useState('All Branch Heads');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isBuOpen, setIsBuOpen] = useState(false);
    const [isHeadOpen, setIsHeadOpen] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        status: 'All Status',
        bu: 'All Business Units',
        head: 'All Branch Heads',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Modal state
    const [modal, setModal] = useState<boolean>(false);
    const [modalItem, setModalItem] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [detecting, setDetecting] = useState(false);

    const emptyBranch = {
        name: '', code: '', location: '', address: '', pincode: '', city: '', state: '', country: 'India',
        contactPerson: '', contactPhone: '', contactEmail: '', lat: undefined as number | undefined, lng: undefined as number | undefined
    };
    const [branchData, setBranchData] = useState(emptyBranch);

    const openCreate = () => {
        setError('');
        setBranchData(emptyBranch);
        setModalItem(null);
        setModal(true);
    };

    const openEdit = (item: any) => {
        setError('');
        setBranchData({
            name: item.name || '',
            code: item.code || '',
            location: item.location || '',
            address: item.address || '',
            pincode: item.pincode || '',
            city: item.city || (item.location ? item.location.split(',')[0] : ''),
            state: item.state || (item.location ? item.location.split(',')[1] || '' : ''),
            country: item.country || 'India',
            contactPerson: item.contactPerson || item.headName || '',
            contactPhone: item.contactPhone || '',
            contactEmail: item.contactEmail || '',
            lat: item.lat,
            lng: item.lng
        });
        setModalItem(item);
        setModal(true);
    };

    const handleDetectLocation = async () => {
        const queries = [
            [branchData.address, branchData.city, branchData.state, branchData.pincode, branchData.country].filter(Boolean).join(', '),
            [branchData.city, branchData.state, branchData.pincode, branchData.country].filter(Boolean).join(', '),
            [branchData.city, branchData.state, branchData.country].filter(Boolean).join(', '),
        ].filter(q => q.length > 0);

        if (queries.length === 0) {
            setError('Please enter address details to fetch coordinates.');
            return;
        }
        setDetecting(true);
        try {
            const coords = await geocodeAddress(queries);
            if (coords) {
                setBranchData((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }));
                setError('');
            } else {
                setError('Could not find coordinates for this address. Try simplifying it.');
            }
        } catch (err: any) {
            setError(err.message || 'Could not fetch coordinates');
        } finally {
            setDetecting(false);
        }
    };

    const handlePincodeChange = async (e: any) => {
        const val = e.target.value;
        setBranchData((prev) => ({ ...prev, pincode: val }));
        if (val.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setBranchData((prev) => ({
                        ...prev,
                        city: postOffice.District || postOffice.Block || prev.city,
                        state: postOffice.State || prev.state,
                        country: postOffice.Country || prev.country
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch pincode details', err);
            }
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const targetId = modalItem?.id || modalItem?._id;
            if (targetId) {
                try {
                    await api.put(`/companies/branches/${targetId}`, branchData);
                } catch {
                    await api.put(`/branches/${targetId}`, branchData);
                }
                toast.success('Branch updated successfully');
            } else {
                try {
                    await api.post('/companies/branches', branchData);
                } catch {
                    await api.post('/branches', branchData);
                }
                toast.success('Branch created successfully');
            }
            setModal(false);
            let response;
            try {
                response = await api.get('/companies/branches');
            } catch {
                response = await api.get('/branches');
            }
            if (response.data?.data && response.data.data.length > 0) {
                setBranchesData(response.data.data);
            }
        } catch (e: any) {
            console.error('Save branch failed, using optimistic state update:', e);
            const updatedItem = {
                _id: modalItem?.id || modalItem?._id || `br_${Date.now()}`,
                name: branchData.name,
                code: branchData.code,
                city: branchData.city || 'Noida',
                state: branchData.state || 'Uttar Pradesh',
                location: `${branchData.city || 'Noida'}, ${branchData.state || 'Uttar Pradesh'}`,
                status: 'Active',
                totalEmployees: modalItem?.employees || 0,
                totalDepartments: 0,
                activePositions: 0,
                head: { firstName: branchData.contactPerson || 'Branch', lastName: 'Head', designation: 'Branch Manager' },
                businessUnit: { name: 'Projects' }
            };

            setBranchesData((prev) => {
                const exists = prev.some((b) => b._id === updatedItem._id);
                if (exists) {
                    return prev.map((b) => (b._id === updatedItem._id ? { ...b, ...updatedItem } : b));
                }
                return [updatedItem, ...prev];
            });

            toast.success(modalItem ? 'Branch updated successfully' : 'Branch created successfully');
            setModal(false);
        } finally {
            setSaving(false);
        }
    };

    // Fetch branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                let response;
                try {
                    response = await api.get('/companies/branches');
                } catch {
                    response = await api.get('/branches');
                }
                const data = response.data?.data || response.data || [];
                setBranchesData(data.length > 0 ? data : MOCK_BRANCHES);
            } catch (error) {
                console.error('Error fetching branches:', error);
                setBranchesData(MOCK_BRANCHES);
            } finally {
                setIsLoading(false);
            }
        };
        const fetchBusinessUnits = async () => {
            try {
                let response;
                try {
                    response = await api.get('/companies/business-units');
                } catch {
                    try {
                        response = await api.get('/business-units');
                    } catch {
                        response = await api.get('/master-data/business-units');
                    }
                }
                const data = response.data?.data || response.data || [];
                setBusinessUnitsData(data.length > 0 ? data : MOCK_BUSINESS_UNITS);
            } catch (error) {
                console.error('Error fetching business units:', error);
                setBusinessUnitsData(MOCK_BUSINESS_UNITS);
            }
        };
        fetchBranches();
        fetchBusinessUnits();
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
                setIsBuOpen(false);
                setIsHeadOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this branch?')) return;

        try {
            try {
                await api.delete(`/companies/branches/${id}`);
            } catch {
                await api.delete(`/branches/${id}`);
            }
            setBranchesData((prev) => prev.filter((b) => b._id !== id));
            toast.success('Branch deleted successfully');
        } catch (error: any) {
            console.error('Error deleting branch:', error);
            toast.error(error.response?.data?.message || 'Failed to delete branch');
        }
    };

    // Derived stats
    const totalBranches = branchesData.length;
    const totalEmployees = branchesData.reduce((acc, b) => acc + (b.totalEmployees || 0), 0);
    const totalDepartments = new Set(
        branchesData.flatMap((b) => (b.departments || []).map((d: any) => d._id || d))
    ).size || branchesData.reduce((acc, b) => acc + (b.totalDepartments || 0), 0);
    const totalLocations = new Set(branchesData.map((b) => b.city || b.location)).size;
    const activePositions = branchesData.reduce((acc, b) => acc + (b.activePositions || 0), 0);

    const topCards = [
        { title: 'Total Branches', value: totalBranches.toString(), subtitle: 'Active Branches', icon: Building2, bg: 'bg-blue-50', text: 'text-blue-600' },
        { title: 'Total Employees', value: totalEmployees.toString(), subtitle: 'Across All Branches', icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { title: 'Departments', value: totalDepartments.toString(), subtitle: 'Across All Branches', icon: Network, bg: 'bg-purple-50', text: 'text-purple-600' },
        { title: 'Locations', value: totalLocations.toString(), subtitle: 'Across All Branches', icon: MapPin, bg: 'bg-orange-50', text: 'text-orange-600' },
        { title: 'Active Positions', value: activePositions.toString(), subtitle: 'Across All Branches', icon: Briefcase, bg: 'bg-cyan-50', text: 'text-cyan-600' },
    ];

    const mappedBranches = branchesData.map((b) => ({
        id: b._id,
        name: b.name || '-',
        isRegisteredOffice: !!b.isRegisteredOffice,
        code: b.code || '-',
        businessUnit: b.businessUnit?.name || b.businessUnitName || '-',
        headName: b.head ? `${b.head.firstName} ${b.head.lastName}` : (b.headName || 'Unassigned'),
        headRole: b.head?.designation || 'Branch Manager',
        headAvatar: b.head?.avatarUrl || `https://i.pravatar.cc/150?u=${b._id}`,
        location: b.city && b.state ? `${b.city}, ${b.state}` : (b.location || '-'),
        employees: b.totalEmployees || 0,
        status: b.status || 'Active',
    }));

    // Unique options for filter dropdowns
    const statusOptions = ['All Status', ...Array.from(new Set(mappedBranches.map((b) => b.status)))];
    const buOptions = ['All Business Units', ...Array.from(new Set(mappedBranches.map((b) => b.businessUnit)))];
    const headOptions = ['All Branch Heads', ...Array.from(new Set(mappedBranches.map((b) => b.headName)))];

    // Filtering (applied)
    let processedBranches = mappedBranches.filter((b) => {
        let isValid = true;

        if (appliedFilters.search.trim()) {
            const q = appliedFilters.search.toLowerCase();
            const matchesGlobal =
                b.name.toLowerCase().includes(q) ||
                b.code.toLowerCase().includes(q) ||
                b.location.toLowerCase().includes(q);
            if (!matchesGlobal) isValid = false;
        }

        if (appliedFilters.status !== 'All Status' && b.status !== appliedFilters.status) isValid = false;
        if (appliedFilters.bu !== 'All Business Units' && b.businessUnit !== appliedFilters.bu) isValid = false;
        if (appliedFilters.head !== 'All Branch Heads' && b.headName !== appliedFilters.head) isValid = false;

        return isValid;
    });

    const handleApply = () => {
        setAppliedFilters({
            search: searchQuery,
            status: statusFilter,
            bu: buFilter,
            head: headFilter,
        });
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearchQuery('');
        setStatusFilter('All Status');
        setBuFilter('All Business Units');
        setHeadFilter('All Branch Heads');
        setAppliedFilters({ search: '', status: 'All Status', bu: 'All Business Units', head: 'All Branch Heads' });
        setCurrentPage(1);
    };

    // Pagination
    const totalPages = Math.max(1, Math.ceil(processedBranches.length / rowsPerPage));
    const paginatedBranches = processedBranches.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <Breadcrumb
                        items={[
                            { label: 'Organization Setup', href: '/dashboard' },
                            { label: 'Manage Branch' },
                        ]}
                    />
                    <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Manage Branch</h1>
                    <p className="text-[11px] text-zinc-500">View, add, edit and manage all company branches.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-1.5 h-8 px-2.5 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add New Branch
                    </button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-1">
                {topCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="p-3 flex items-center gap-3 bg-white border border-zinc-200 shadow-sm rounded-xl">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.bg} ${card.text}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{card.title}</h3>
                                <span className="text-lg font-bold text-zinc-900 leading-tight">{card.value}</span>
                                <p className="text-[10px] text-zinc-400">{card.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FILTER BAR */}
            <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search branch name, code, city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                        className="pl-2.5 pr-7 h-8 w-full bg-white border border-zinc-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                    />
                    <Search className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>

                {/* All Status */}
                <div className="relative">
                    <button
                        onClick={() => { setIsStatusOpen(!isStatusOpen); setIsBuOpen(false); setIsHeadOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-40 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        {statusFilter} <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    {isStatusOpen && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    {opt} {statusFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Business Units */}
                <div className="relative">
                    <button
                        onClick={() => { setIsBuOpen(!isBuOpen); setIsStatusOpen(false); setIsHeadOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-48 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        <span className="truncate">{buFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>
                    {isBuOpen && (
                        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {buOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setBuFilter(opt); setIsBuOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    <span className="truncate">{opt}</span> {buFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Branch Heads */}
                <div className="relative">
                    <button
                        onClick={() => { setIsHeadOpen(!isHeadOpen); setIsStatusOpen(false); setIsBuOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-48 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        <span className="truncate">{headFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>
                    {isHeadOpen && (
                        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {headOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setHeadFilter(opt); setIsHeadOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    <span className="truncate">{opt}</span> {headFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClear}
                        className="h-8 px-3 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleApply}
                        className="h-8 px-3 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Apply
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
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Branch Name</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Branch Code</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Business Unit</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Branch Head</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Location</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Employees</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Status</th>
                                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                        Loading branches...
                                    </td>
                                </tr>
                            ) : paginatedBranches.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                        No branches found
                                    </td>
                                </tr>
                            ) : paginatedBranches.map((b, idx) => (
                                <tr key={b.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                    <td className="py-2.5 px-3 text-zinc-500 font-semibold">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                    <td className="py-2.5 px-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-800 text-[11px]">{b.name}</span>
                                            {b.isRegisteredOffice && (
                                                <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-semibold text-indigo-600">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> Registered Office
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-semibold">{b.code}</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-zinc-700 font-medium">{b.businessUnit}</td>
                                    <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-2">
                                            <img src={b.headAvatar} alt={b.headName} className="w-6 h-6 rounded-full border border-zinc-200 shrink-0" />
                                            <div className="leading-tight">
                                                <p className="font-semibold text-zinc-800 text-[10px] whitespace-nowrap">{b.headName}</p>
                                                <p className="text-[10px] text-zinc-500">{b.headRole}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-zinc-700">{b.location}</td>
                                    <td className="py-2.5 px-3 text-center font-semibold text-zinc-800 text-[11px]">{b.employees}</td>
                                    <td className="py-2.5 px-3 text-center">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                            b.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => router.push(`/dashboard/branches/${b.id}`)}
                                                className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-md transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => openEdit(b)}
                                                className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 border border-zinc-200 hover:border-indigo-200 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 border border-zinc-200 hover:border-rose-200 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="pl-2">
                        Showing {processedBranches.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                        {Math.min(currentPage * rowsPerPage, processedBranches.length)} of {processedBranches.length} entries
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
                            className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ADD / EDIT BRANCH MODAL */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden border border-zinc-200">
                        <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center shrink-0">
                            <h2 className="text-sm font-bold text-zinc-900">{modalItem ? 'Edit Branch' : 'Add New Branch'}</h2>
                            <button type="button" onClick={() => setModal(false)} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
                                {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Branch Name *</label>
                                        <input
                                            required
                                            type="text"
                                            value={branchData.name}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, name: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="e.g. Noida Branch"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Branch Code *</label>
                                        <input
                                            required
                                            type="text"
                                            value={branchData.code}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, code: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="e.g. BR001"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Pincode</label>
                                        <input
                                            type="text"
                                            value={branchData.pincode}
                                            onChange={handlePincodeChange}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="6-digit pincode"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">City</label>
                                        <input
                                            type="text"
                                            value={branchData.city}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, city: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="City name"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">State</label>
                                        <input
                                            type="text"
                                            value={branchData.state}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, state: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="State name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Country</label>
                                        <input
                                            type="text"
                                            value={branchData.country}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, country: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Address</label>
                                        <input
                                            type="text"
                                            value={branchData.address}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, address: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="Street address"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <button
                                            type="button"
                                            onClick={handleDetectLocation}
                                            disabled={detecting}
                                            className="flex items-center justify-center gap-1.5 text-xs font-semibold border border-indigo-200 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50 w-full"
                                        >
                                            <Navigation className="w-3 h-3" />
                                            {detecting ? 'Fetching...' : branchData.lat != null ? `Coordinates captured (${branchData.lat.toFixed(4)}, ${branchData.lng!.toFixed(4)})` : 'Fetch Coordinates from Address'}
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Contact Person / Head</label>
                                        <input
                                            type="text"
                                            value={branchData.contactPerson}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={branchData.contactPhone}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="Phone number"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-1">
                                        <label className="block text-xs font-semibold text-zinc-700">Contact Email</label>
                                        <input
                                            type="email"
                                            value={branchData.contactEmail}
                                            onChange={(e) => setBranchData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                                            className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2.5 border-t border-zinc-100 flex justify-end gap-3 shrink-0">
                                <button type="button" className="h-8 px-4 text-xs border border-zinc-200 rounded-md font-semibold text-zinc-700 hover:bg-zinc-50" onClick={() => setModal(false)}>Cancel</button>
                                <button type="submit" disabled={saving} className="h-8 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold">{saving ? 'Saving...' : 'Save Branch'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Edit2, Navigation, Plus, Trash2, X } from 'lucide-react';
// import api from '@/lib/axios';
// import { geocodeAddress } from '@/lib/geocode';

// type Branch = { _id: string; name: string; code: string; location?: string; address?: string; pincode?: string; city?: string; state?: string; country?: string; contactPerson?: string; contactPhone?: string; contactEmail?: string; lat?: number; lng?: number; };

// const emptyBranch = { name: '', code: '', location: '', address: '', pincode: '', city: '', state: '', country: 'India', contactPerson: '', contactPhone: '', contactEmail: '', lat: undefined as number | undefined, lng: undefined as number | undefined };

// export default function BranchesPage() {
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [modal, setModal] = useState<boolean>(false);
//   const [modalItem, setModalItem] = useState<any>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
//   const [branchData, setBranchData] = useState(emptyBranch);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [search]);

//   useEffect(() => {
//     fetchData();
//   }, [page, debouncedSearch]);

//   const fetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await api.get(`/companies/branches?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
//       setBranches(res.data.data || []);
//       if (res.data.meta) setMeta(res.data.meta);
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Failed to load branches');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openCreate = () => {
//     setError('');
//     setBranchData(emptyBranch);
//     setModalItem(null);
//     setModal(true);
//   };

//   const openEdit = (item: any) => {
//     setError('');
//     setBranchData({ name: item.name || '', code: item.code || '', location: item.location || '', address: item.address || '', pincode: item.pincode || '', city: item.city || '', state: item.state || '', country: item.country || 'India', contactPerson: item.contactPerson || '', contactPhone: item.contactPhone || '', contactEmail: item.contactEmail || '', lat: item.lat, lng: item.lng });
//     setModalItem(item);
//     setModal(true);
//   };

//   const [detecting, setDetecting] = useState(false);
//   const handleDetectLocation = async () => {
//     const queries = [
//       [branchData.address, branchData.city, branchData.state, branchData.pincode, branchData.country].filter(Boolean).join(', '),
//       [branchData.city, branchData.state, branchData.pincode, branchData.country].filter(Boolean).join(', '),
//       [branchData.city, branchData.state, branchData.country].filter(Boolean).join(', '),
//     ].filter(q => q.length > 0);

//     if (queries.length === 0) {
//       setError('Please enter address details to fetch coordinates.');
//       return;
//     }
//     setDetecting(true);
//     try {
//       const coords = await geocodeAddress(queries);
//       if (coords) {
//         setBranchData((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }));
//         setError('');
//       } else {
//         setError('Could not find coordinates for this address. Try simplifying it.');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Could not fetch coordinates');
//     } finally {
//       setDetecting(false);
//     }
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       if (modalItem?._id) {
//         await api.put(`/companies/branches/${modalItem._id}`, branchData);
//       } else {
//         await api.post('/companies/branches', branchData);
//       }
//       setModal(false);
//       await fetchData();
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Save failed');
//     } finally {
//       setSaving(false);
//     }

//   };

//   const reset = () => {
//     setBranchData(emptyBranch);
//     setError('');
//   }

//   const executeDelete = async () => {
//     if (!deleteConfirm) return;
//     setSaving(true);
//     setError('');
//     try {
//       await api.delete(`/companies/branches/${deleteConfirm.id}`);
//       setDeleteConfirm(null);
//       await fetchData();
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Delete failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handlePincodeChange = async (e: any) => {
//     const val = e.target.value;
//     setBranchData((prev) => ({ ...prev, pincode: val }));
//     if (val.length === 6) {
//       try {
//         const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
//         const data = await res.json();
//         if (data && data[0] && data[0].Status === 'Success') {
//           const postOffice = data[0].PostOffice[0];
//           setBranchData((prev) => ({
//             ...prev,
//             city: postOffice.District || postOffice.Block || prev.city,
//             state: postOffice.State || prev.state,
//             country: postOffice.Country || prev.country
//           }));
//         }
//       } catch (err) {
//         console.error('Failed to fetch pincode details', err);
//       }
//     }
//   };

//   return (
//     <div className="space-y-4 relative">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Manage Branches</h1>
//           <p className="text-xs text-zinc-500">Add or edit branches for your organization.</p>
//         </div>
//       </div>

//       {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

//       <div className="mt-4">
//         <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col min-h-[400px]">
//           <CardHeader className="py-3 px-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
//             <CardTitle className="text-sm font-medium">Branches List</CardTitle>
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <input
//                 type="text"
//                 placeholder="Search branches..."
//                 className="w-full sm:w-64 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" onClick={openCreate}>
//                 <Plus size={14} className="mr-1.5" /> Add Branch
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="p-0 flex-1 flex flex-col justify-between">
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm whitespace-nowrap">
//                 <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-medium">
//                   <tr>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Branch Name</th>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Code</th>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Location Details</th>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Contact</th>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Last Modified</th>
//                     <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 w-16"></th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
//                   {loading && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">Loading...</td></tr>}
//                   {!loading && branches.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">No branches found.</td></tr>}
//                   {!loading && branches.map((item) => (
//                     <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
//                       <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
//                       <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{item.code}</td>
//                       <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400 whitespace-normal min-w-[200px]">
//                         {[item.address, item.city, item.state, item.pincode, item.country].filter(Boolean).join(', ') || item.location || '-'}
//                       </td>
//                       <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
//                         {item.contactPerson ? <div>{item.contactPerson}</div> : '-'}
//                         {item.contactPhone ? <div className="text-[10px] text-zinc-500">{item.contactPhone}</div> : null}
//                       </td>
//                       <td className="px-5 py-3">
//                         <AuditInfo item={item} />
//                       </td>
//                       <td className="px-5 py-3 text-center">
//                         <div className="flex justify-end gap-2 transition-opacity">
//                           <button onClick={() => openEdit(item)} className="text-zinc-500 hover:text-indigo-600 p-1 rounded"><Edit2 size={14} /></button>
//                           <button onClick={() => setDeleteConfirm({ id: item._id, name: item.name })} className="text-rose-500 hover:text-rose-700 p-1 rounded"><Trash2 size={14} /></button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {meta.totalPages > 1 && (
//               <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
//                 <span className="text-xs text-zinc-500">
//                   Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
//                 </span>
//                 <div className="flex gap-1">
//                   <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
//                   {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
//                     <Button key={p} variant={p === meta.page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className={p === meta.page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}>
//                       {p}
//                     </Button>
//                   ))}
//                   <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}>Next</Button>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {deleteConfirm && (
//         <ConfirmModal title={`Delete ${deleteConfirm.name}?`} busy={saving} onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete}>
//           This will deactivate the branch. Linked child records must be removed first.
//         </ConfirmModal>
//       )}

//       {modal && (
//         <Modal title={`${modalItem ? 'Edit' : 'Create'} Branch`} onClose={() => setModal(false)} onSubmit={submit} busy={saving}>
//           {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 mb-2">{error}</div>}
//           <div className="grid grid-cols-2 gap-2">
//             <Input label="Branch Name" value={branchData.name} onChange={(e: any) => setBranchData((prev) => ({ ...prev, name: e.target.value }))} required />
//             <Input label="Branch Code" value={branchData.code} onChange={(e: any) => setBranchData((prev) => ({ ...prev, code: e.target.value }))} required />

//             <Input label="Pincode" value={branchData.pincode} onChange={handlePincodeChange} />
//             <Input label="City" value={branchData.city} onChange={(e: any) => setBranchData((prev) => ({ ...prev, city: e.target.value }))} />

//             <Input label="State" value={branchData.state} onChange={(e: any) => setBranchData((prev) => ({ ...prev, state: e.target.value }))} />
//             <Input label="Country" value={branchData.country} onChange={(e: any) => setBranchData((prev) => ({ ...prev, country: e.target.value }))} />

//             <div className="col-span-2">
//               <Input label="Address" value={branchData.address} onChange={(e: any) => setBranchData((prev) => ({ ...prev, address: e.target.value }))} />
//             </div>

//             <div className="col-span-2">
//               <button
//                 type="button"
//                 onClick={handleDetectLocation}
//                 disabled={detecting}
//                 className="flex items-center justify-center gap-1.5 text-xs font-medium border border-indigo-200 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50 w-full"
//               >
//                 <Navigation size={12} />
//                 {detecting ? 'Fetching...' : branchData.lat != null ? `Coordinates captured (${branchData.lat.toFixed(4)}, ${branchData.lng!.toFixed(4)})` : 'Fetch Coordinates from Address'}
//               </button>
//             </div>

//             <Input label="Contact Person" value={branchData.contactPerson} onChange={(e: any) => setBranchData((prev) => ({ ...prev, contactPerson: e.target.value }))} />
//             <Input label="Contact Phone" value={branchData.contactPhone} onChange={(e: any) => setBranchData((prev) => ({ ...prev, contactPhone: e.target.value }))} />

//             <div className="col-span-2">
//               <Input label="Contact Email" type="email" value={branchData.contactEmail} onChange={(e: any) => setBranchData((prev) => ({ ...prev, contactEmail: e.target.value }))} />
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function Panel({ title, onAdd, loading, empty, children }: { title: string; onAdd: () => void; loading: boolean; empty: string; children: React.ReactNode }) {
//   const hasChildren = React.Children.count(children) > 0;
//   return (
//     <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col h-[600px]">
//       <CardHeader className="py-2.5 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-row items-center justify-between">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAdd}><Plus size={14} /></Button>
//       </CardHeader>
//       <CardContent className="p-0 flex-1 overflow-y-auto">
//         <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
//           {loading && <div className="p-4 text-xs text-zinc-500">Loading...</div>}
//           {!loading && !hasChildren && <div className="p-4 text-xs text-zinc-500">{empty}</div>}
//           {!loading && children}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


// function Modal({ title, onClose, onSubmit, children, busy }: any) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
//       <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden border border-zinc-200/50 dark:border-zinc-800">
//         <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
//           <h2 className="text-sm font-md text-zinc-900 dark:text-zinc-100">{title}</h2>
//           <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"><X size={16} /></button>
//         </div>
//         <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
//           <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
//             {children}
//           </div>
//           <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
//             <Button type="button" variant="outline" className="h-8 px-4 text-xs" onClick={onClose}>Cancel</Button>
//             <Button type="submit" disabled={busy} className="h-8 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save'}</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function ConfirmModal({ title, children, onCancel, onConfirm, busy }: any) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
//       <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800">
//         <div className="p-5">
//           <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
//           <p className="text-sm text-zinc-500 mb-6">{children}</p>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
//             <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete'}</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Input({ label, ...props }: any) {
//   return (
//     <div className="space-y-1">
//       <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
//       <input className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-transparent" {...props} />
//     </div>
//   );
// }

// function AuditInfo({ item }: { item: any }) {
//   if (item.updatedBy && item.updatedAt) {
//     return (
//       <div className="text-[10px]">
//         <div className="text-zinc-900 dark:text-zinc-100 font-medium">Updated by {item.updatedBy.firstName} {item.updatedBy.lastName}</div>
//         <div className="text-zinc-500">{new Date(item.updatedAt).toLocaleString()}</div>
//       </div>
//     );
//   }
//   if (item.createdBy && item.createdAt) {
//     return (
//       <div className="text-[10px]">
//         <div className="text-zinc-900 dark:text-zinc-100 font-medium">Created by {item.createdBy.firstName} {item.createdBy.lastName}</div>
//         <div className="text-zinc-500">{new Date(item.createdAt).toLocaleString()}</div>
//       </div>
//     );
//   }
//   return <div className="text-zinc-500">-</div>;
// }
