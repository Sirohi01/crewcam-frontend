'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Upload, Download, Plus, ChevronRight, Search, Filter,
    Eye, Edit2, MoreVertical, Building, Users, User, PieChart as PieChartIcon, CheckCircle2, ChevronDown, ChevronLeft, Map, FileText, CheckCircle, Lightbulb, MapPin, BarChart2, Armchair, PenTool, LayoutDashboard, Briefcase
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadCrumb';

// --- MOCK DATA ---
const topCards = [
    { title: 'Total Business Units', value: '4', subtitle: 'Active', color: '#3b82f6', icon: Building, bg: 'bg-blue-50', text: 'text-blue-600' },
    { title: 'Total Employees', value: '532', subtitle: 'Across all BU', color: '#10b981', icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { title: 'Total Departments', value: '28', subtitle: 'Linked to BU', color: '#8b5cf6', icon: PieChartIcon, bg: 'bg-purple-50', text: 'text-purple-600' },
    { title: 'Total Cost Centers', value: '12', subtitle: 'Mapped', color: '#f59e0b', icon: Map, bg: 'bg-amber-50', text: 'text-amber-600' },
    { title: 'Total Budget (FY 25-26)', value: '₹ 24,50,000', subtitle: 'Allocated', color: '#14b8a6', icon: BarChart2, bg: 'bg-teal-50', text: 'text-teal-600' },
];

const businessUnits = [
    { id: 1, name: 'Retail Interiors', desc: 'Interior solutions for retail spaces and stores', code: 'BU-RI', headName: 'Neha Sethi', headRole: 'BU Head', employees: 186, depts: 8, costCenters: 4, budget: '₹ 8,40,000', icon: Armchair, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 2, name: 'Design & Planning', desc: 'Conceptual design and planning services', code: 'BU-DP', headName: 'Vivek Rana', headRole: 'BU Head', employees: 152, depts: 6, costCenters: 2, budget: '₹ 6,50,000', icon: PenTool, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { id: 3, name: 'Display Solutions', desc: 'Exhibition and retail display solutions', code: 'BU-DS', headName: 'Amit Kumar', headRole: 'BU Head', employees: 118, depts: 7, costCenters: 3, budget: '₹ 5,20,000', icon: LayoutDashboard, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 4, name: 'Corporate Services', desc: 'Support functions and corporate services', code: 'BU-CS', headName: 'Pooja Bansal', headRole: 'BU Head', employees: 76, depts: 7, costCenters: 3, budget: '₹ 4,40,000', icon: Briefcase, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
];

const empCompositionData = [
    { name: 'Retail Interiors', value: 186, color: '#3b82f6', percent: '35.0%' },
    { name: 'Design & Planning', value: 152, color: '#10b981', percent: '28.6%' },
    { name: 'Display Solutions', value: 118, color: '#f59e0b', percent: '22.2%' },
    { name: 'Corporate Services', value: 76, color: '#8b5cf6', percent: '14.2%' },
];

export default function BusinessUnitsPage() {
    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                  <Breadcrumb
  items={[
    { label: "Organization Setup", href: "/dashboard" },
    { label: "Departments", href: "/dashboard/departments" },
    { label: "Business Units" },
  ]}
/>
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
                                    {businessUnits.map((bu) => {
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
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center justify-center gap-1 text-zinc-400">
                                                        <button className="p-1 hover:text-zinc-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                            <div className="pl-2">Showing 1 to 4 of 4 business units</div>
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
                                <span className="text-[12px] font-bold text-zinc-800">4</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Employees</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">532</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center"><PieChartIcon className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Departments</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">28</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center"><Map className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Cost Centers</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center"><BarChart2 className="w-3 h-3" /></div>
                                    <span className="text-[11px] font-semibold">Total Budget (FY 25-26)</span>
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">₹ 24,50,000</span>
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
                                    <span className="text-[16px] font-bold text-zinc-900">532</span>
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
