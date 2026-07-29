'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    Upload, Download, Plus, ChevronRight, Search, Filter,
    Eye, Edit2, MoreVertical, Building, Users, User, PieChart as PieChartIcon, CheckCircle2, ChevronDown, ChevronLeft, Map, FileText, CheckCircle, Lightbulb, MapPin, BarChart2, Armchair, PenTool, LayoutDashboard, Briefcase, Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import api from '@/lib/axios';

const COLORS = [
    { iconBg: 'bg-blue-50', iconColor: 'text-blue-600', color: '#3b82f6' },
    { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', color: '#10b981' },
    { iconBg: 'bg-amber-50', iconColor: 'text-amber-600', color: '#f59e0b' },
    { iconBg: 'bg-purple-50', iconColor: 'text-purple-600', color: '#8b5cf6' },
];

export default function BusinessUnitsPage() {
    const router = useRouter();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [businessUnitsData, setBusinessUnitsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this business unit?')) return;
        
        try {
            await api.delete(`/business-units/${id}`);
            setBusinessUnitsData((prev) => prev.filter((bu) => bu._id !== id));
            toast.success('Business unit deleted successfully');
        } catch (error: any) {
            console.error('Error deleting business unit:', error);
            toast.error(error.response?.data?.message || 'Failed to delete business unit');
        }
    };

    useEffect(() => {
        const fetchBusinessUnits = async () => {
            try {
                const response = await api.get('/business-units');
                setBusinessUnitsData(response.data.data || []);
            } catch (error) {
                console.error('Error fetching business units:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBusinessUnits();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Derived Data
    const totalEmployees = businessUnitsData.reduce((acc, bu) => acc + (bu.totalEmployees || 0), 0);
    const totalDepartments = businessUnitsData.reduce((acc, bu) => acc + (bu.totalDepartments || 0), 0);
    const totalCostCenters = businessUnitsData.reduce((acc, bu) => acc + (bu.costCenters?.length || 0), 0);
    const totalBudget = businessUnitsData.reduce((acc, bu) => {
        const amount = parseFloat((bu.annualBudget || '0').replace(/[^0-9.-]+/g, ''));
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    const topCards = [
        { title: 'Total Business Units', value: businessUnitsData.length.toString(), subtitle: 'Active', color: '#3b82f6', icon: Building, bg: 'bg-blue-50', text: 'text-blue-600' },
        { title: 'Total Employees', value: totalEmployees.toString(), subtitle: 'Across all BU', color: '#10b981', icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { title: 'Total Departments', value: totalDepartments.toString(), subtitle: 'Linked to BU', color: '#8b5cf6', icon: PieChartIcon, bg: 'bg-purple-50', text: 'text-purple-600' },
        { title: 'Total Cost Centers', value: totalCostCenters.toString(), subtitle: 'Mapped', color: '#f59e0b', icon: Map, bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Total Budget (FY 25-26)', value: formatCurrency(totalBudget), subtitle: 'Allocated', color: '#14b8a6', icon: BarChart2, bg: 'bg-teal-50', text: 'text-teal-600' },
    ];

    const empCompositionData = businessUnitsData.map((bu, idx) => {
        const colorObj = COLORS[idx % COLORS.length];
        const val = bu.totalEmployees || 0;
        const percent = totalEmployees > 0 ? ((val / totalEmployees) * 100).toFixed(1) : '0.0';
        return {
            name: bu.name,
            value: val,
            color: colorObj.color,
            percent: `${percent}%`
        };
    }).filter(item => item.value > 0);

    const mappedBusinessUnits = businessUnitsData.map((bu, idx) => {
        const colorObj = COLORS[idx % COLORS.length];
        return {
            id: bu._id,
            name: bu.name || '-',
            desc: bu.description || 'No description provided',
            code: bu.code || '-',
            headName: bu.head ? `${bu.head.firstName} ${bu.head.lastName}` : 'Unassigned',
            headRole: 'BU Head',
            employees: bu.totalEmployees || 0,
            depts: bu.totalDepartments || 0,
            costCenters: bu.costCenters?.length || 0,
            budget: bu.annualBudget ? formatCurrency(parseFloat(bu.annualBudget.replace(/[^0-9.-]+/g, ''))) : '₹ 0',
            icon: Briefcase,
            iconBg: colorObj.iconBg,
            iconColor: colorObj.iconColor,
            status: bu.status || 'Active'
        };
    });
    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <div className="text-[11px] font-medium text-zinc-500 mb-1 flex items-center gap-2">
                        <span className="cursor-pointer hover:text-zinc-700">Organization Setup</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="cursor-pointer hover:text-zinc-700">Departments</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600 font-semibold cursor-pointer">Business Units</span>
                    </div>
                    <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Business Units (BU)</h1>
                    <p className="text-[11px] text-zinc-500">Create, manage and organize your business units.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Upload className="w-3.5 h-3.5" /> Import BU
                    </button>
                    <button className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Download className="w-3.5 h-3.5" /> Export BU <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                    <Link href="/dashboard/bussiness-unit/add-new-bussiness-unit" prefetch={true} className="flex items-center gap-1.5 h-8 px-2.5 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add New Business Unit
                    </Link>
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

            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-stretch">

                {/* LEFT SECTION (70%) */}
                <div className="xl:col-span-7 flex flex-col gap-2 h-full">
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">

                        {/* TABLE HEADER */}
                        <div className="flex items-center justify-between p-3 border-b border-zinc-100">
                            <h2 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">Business Units List</h2>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <input type="text" placeholder="Search business units..." className="pl-2.5 pr-7 h-8 bg-white border border-zinc-200 rounded-md text-[11px] w-48 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400" />
                                    <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                </div>
                                <button className="flex items-center gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                                    <Filter className="w-3.5 h-3.5" /> Filters
                                </button>
                                <div className="flex items-center gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
                                    Sort by: Name (A-Z) <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase">Business Unit</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase">BU Code</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase">Head / Owner</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-center">Total Employees</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-center">Departments</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-center">Cost Centers</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-right">Budget (FY 25-26)</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-center">Status</th>
                                        <th className="py-2 px-3 text-[10px] font-bold text-zinc-500 uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px]">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                Loading business units...
                                            </td>
                                        </tr>
                                    ) : mappedBusinessUnits.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-zinc-500 font-medium">
                                                No business units found
                                            </td>
                                        </tr>
                                    ) : mappedBusinessUnits.map((bu) => {
                                        const BuIcon = bu.icon;
                                        return (
                                            <tr key={bu.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bu.iconBg} ${bu.iconColor}`}>
                                                            <BuIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-zinc-800 text-[11px]">{bu.name}</span>
                                                            <span className="text-[10px] text-zinc-500 w-36 truncate" title={bu.desc}>{bu.desc}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 font-semibold text-zinc-700">{bu.code}</td>
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <img src={`https://i.pravatar.cc/150?u=${bu.id + 10}`} alt={bu.headName} className="w-7 h-7 rounded-full border border-zinc-200" />
                                                        <div className="leading-tight">
                                                            <p className="font-bold text-zinc-800 text-[11px]">{bu.headName}</p>
                                                            <p className="text-[10px] text-zinc-500">{bu.headRole}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-3 text-center font-bold text-zinc-800">{bu.employees}</td>
                                                <td className="py-2 px-3 text-center font-bold text-zinc-800">{bu.depts}</td>
                                                <td className="py-2 px-3 text-center font-bold text-zinc-800">{bu.costCenters}</td>
                                                <td className="py-2 px-3 text-right font-bold text-zinc-800">{bu.budget}</td>
                                                <td className="py-2 px-3 text-center">
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 relative">
                                                    <div className="flex items-center justify-center gap-1 text-zinc-400">
                                                        <button
                                                            onClick={() => setOpenDropdownId(openDropdownId === bu.id ? null : bu.id)}
                                                            className="p-1 hover:text-zinc-600 transition-colors"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {openDropdownId === bu.id && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute right-6 top-8 w-32 bg-white border border-zinc-200 shadow-md rounded-md py-1 z-50 flex flex-col"
                                                        >
                                                            <button onClick={() => router.push(`/dashboard/bussiness-unit/add-new-bussiness-unit?edit=${bu.id}`)} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors text-left">
                                                                <Edit2 className="w-3.5 h-3.5 text-zinc-400" /> Edit
                                                            </button>
                                                            <button onClick={() => { setOpenDropdownId(null); handleDelete(bu.id); }} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left">
                                                                <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                            <div className="pl-2">Showing 1 to {mappedBusinessUnits.length} of {mappedBusinessUnits.length} business units</div>
                            <div className="flex items-center gap-1">
                                <button className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                <button className="w-6 h-6 flex items-center justify-center border border-indigo-600 bg-indigo-600 text-white rounded-md font-semibold">1</button>
                                <button className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400"><ChevronRight className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex items-center gap-2 pr-2">
                                <span>Rows per page:</span>
                                <div className="relative">
                                    <select className="appearance-none border border-zinc-200 bg-white pl-2 pr-6 py-1 rounded-md cursor-pointer hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-zinc-700 text-[11px]">
                                        <option value="10">10</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 shadow-sm rounded-xl flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <Building className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-[12px] font-bold text-zinc-800 mb-1.5">About Business Units</h3>
                                <p className="text-[11px] text-zinc-600 leading-relaxed">
                                    Business Units (BU) help you group departments and resources based on your organization's structure. Each BU can have its own head, team, budget and cost centers for better management and reporting.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 bg-white border border-zinc-200 shadow-sm rounded-xl grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start gap-1.5">
                                    <div className="mt-0.5 text-indigo-500"><CheckCircle className="w-3.5 h-3.5" /></div>
                                    <p className="text-[11px] text-zinc-600 font-medium leading-snug">Organize departments and teams under each BU</p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <div className="mt-0.5 text-indigo-500"><User className="w-3.5 h-3.5" /></div>
                                    <p className="text-[11px] text-zinc-600 font-medium leading-snug">Assign heads and manage budgets independently</p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                    <div className="mt-0.5 text-indigo-500"><BarChart2 className="w-3.5 h-3.5" /></div>
                                    <p className="text-[11px] text-zinc-600 font-medium leading-snug">Track performance and generate BU-wise reports</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-zinc-800 mb-1.5">Best Practices</h4>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                                        <CheckCircle2 className="w-3 h-3" /> Align BU structure with goals
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                                        <CheckCircle2 className="w-3 h-3" /> Review performance quarterly
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                                        <CheckCircle2 className="w-3 h-3" /> Ensure proper cost center mapping
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (30%) */}
                <div className="xl:col-span-3 flex flex-col gap-2 h-full">

                    {/* Summary Card */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3 flex items-center gap-2">Business Unit Summary</h2>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center"><Building className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Active Business Units</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">{mappedBusinessUnits.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Employees</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">{totalEmployees}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center"><PieChartIcon className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Departments</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">{totalDepartments}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center"><Map className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Cost Centers</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">{totalCostCenters}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center"><BarChart2 className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Budget (FY 25-26)</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">{formatCurrency(totalBudget)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3 flex items-center gap-2">Employees by Business Unit</h2>
                        <div className="flex flex-col md:flex-row xl:flex-col gap-4 items-center justify-center mt-1">
                            <div className="relative w-28 h-28">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={empCompositionData}
                                            innerRadius="65%"
                                            outerRadius="100%"
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                            isAnimationActive={false}
                                        >
                                            {empCompositionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-[16px] font-bold text-zinc-900">{totalEmployees}</span>
                                    <span className="text-[10px] text-zinc-500 font-semibold">Total</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                {empCompositionData.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[11px] font-semibold text-zinc-700">{item.name}</span>
                                        </div>
                                        <span className="text-[11px] font-bold text-zinc-900">
                                            {item.value} <span className="text-[10px] font-semibold text-zinc-500 ml-1">({item.percent})</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 mt-auto">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3 flex items-center gap-2">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button className="flex items-center gap-1.5 p-2 border border-zinc-200 rounded-lg text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors justify-center">
                                <Plus className="w-3.5 h-3.5" /> Add New BU
                            </button>
                            <button className="flex items-center gap-1.5 p-2 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center">
                                <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Map Cost Center
                            </button>
                            <button className="flex items-center gap-1.5 p-2 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center">
                                <User className="w-3.5 h-3.5 text-zinc-400" /> Assign Head
                            </button>
                            <button className="flex items-center gap-1.5 p-2 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center">
                                <Building className="w-3.5 h-3.5 text-zinc-400" /> BU Hierarchy
                            </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-1.5 p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-indigo-600 hover:bg-zinc-100 transition-colors">
                            <FileText className="w-3.5 h-3.5" /> View Business Unit Reports
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
}
