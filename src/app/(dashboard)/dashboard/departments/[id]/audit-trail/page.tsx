'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Download, Building2, CalendarDays, MapPin,
    Search, Users, Activity, Settings, Clock, ChevronLeft, ChevronRight,
    BarChart2, FileText, UploadCloud,
    RefreshCw,
    X
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';

const auditLogs = [
    { id: 1, date: '15 May 2025', time: '10:45 AM', user: 'Vijay Sharma', role: 'Super Admin', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Department Name', oldVal: 'Interior Desg.', newVal: 'Interior Design', ip: '103.21.45.67', avatar: 'https://i.pravatar.cc/150?u=vijay' },
    { id: 2, date: '15 May 2025', time: '10:43 AM', user: 'Rahul Nair', role: 'Manager', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Department Head', oldVal: 'Amit Verma', newVal: 'Rahul Nair', ip: '103.21.45.68', avatar: 'https://i.pravatar.cc/150?u=rahul' },
    { id: 3, date: '15 May 2025', time: '10:40 AM', user: 'Neha Joshi', role: 'HR Executive', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Location', oldVal: 'Delhi', newVal: 'Noida, Uttar Pradesh', ip: '103.21.45.69', avatar: 'https://i.pravatar.cc/150?u=neha' },
    { id: 4, date: '14 May 2025', time: '05:32 PM', user: 'Pooja Mehta', role: 'Finance Executive', action: 'Created', actionColor: 'orange', module: 'Department Details', record: 'New Department Created', oldVal: '—', newVal: 'Interior Design', ip: '103.21.45.70', avatar: 'https://i.pravatar.cc/150?u=pooja' },
    { id: 5, date: '14 May 2025', time: '04:11 PM', user: 'Vikram Singh', role: 'HR Executive', action: 'Viewed', actionColor: 'blue', module: 'Department Details', record: 'Overview', oldVal: '—', newVal: 'Viewed', ip: '103.21.45.71', avatar: 'https://i.pravatar.cc/150?u=vikram' },
    { id: 6, date: '14 May 2025', time: '03:58 PM', user: 'Vijay Sharma', role: 'Super Admin', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Department Code', oldVal: 'INT-DS', newVal: 'INT-DSN', ip: '103.21.45.67', avatar: 'https://i.pravatar.cc/150?u=vijay2' },
    { id: 7, date: '14 May 2025', time: '03:45 PM', user: 'Neha Joshi', role: 'HR Executive', action: 'Deleted', actionColor: 'red', module: 'Department Details', record: 'Phone Number', oldVal: '0120-2456789', newVal: '—', ip: '103.21.45.69', avatar: 'https://i.pravatar.cc/150?u=neha2' },
    { id: 8, date: '14 May 2025', time: '03:42 PM', user: 'Neha Joshi', role: 'HR Executive', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Description', oldVal: 'Interior desig...', newVal: 'Interior design and consultancy services', ip: '103.21.45.69', avatar: 'https://i.pravatar.cc/150?u=neha3' },
    { id: 9, date: '14 May 2025', time: '03:30 PM', user: 'Vijay Sharma', role: 'Super Admin', action: 'Updated', actionColor: 'green', module: 'Department Details', record: 'Status', oldVal: 'Draft', newVal: 'Active', ip: '103.21.45.67', avatar: 'https://i.pravatar.cc/150?u=vijay3' },
    { id: 10, date: '14 May 2025', time: '03:25 PM', user: 'Srujana Paidi', role: 'CHRO', action: 'Viewed', actionColor: 'blue', module: 'Department Details', record: 'Documents', oldVal: '—', newVal: 'Viewed', ip: '103.21.45.72', avatar: 'https://i.pravatar.cc/150?u=srujana' },
];

const topUsers = [
    { name: 'Vijay Sharma', count: 20, avatar: 'https://i.pravatar.cc/150?u=vijay' },
    { name: 'Neha Joshi', count: 14, avatar: 'https://i.pravatar.cc/150?u=neha' },
    { name: 'Rahul Nair', count: 7, avatar: 'https://i.pravatar.cc/150?u=rahul' },
    { name: 'Pooja Mehta', count: 4, avatar: 'https://i.pravatar.cc/150?u=pooja' },
    { name: 'Others', count: 2, avatar: 'https://i.pravatar.cc/150?u=others' },
];

export default function AuditTrailPage() {
    const params = useParams();
    const id = params?.id as string || 'default';

    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('All Actions');
    const [userFilter, setUserFilter] = useState('All Users');
    const [moduleFilter, setModuleFilter] = useState('All Modules');

    const getBadgeStyle = (color: string) => {
        switch (color) {
            case 'green': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'orange': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'red': return 'bg-rose-50 text-rose-600 border-rose-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800 relative min-h-screen">

            {/* BREADCRUMB */}
            <Breadcrumb items={[
                { label: 'Organization Setup' },
                { label: 'Departments', href: '/dashboard/departments' },
                { label: 'Department Details', href: `/dashboard/departments/${id}` },
                { label: 'Audit Trail' }
            ]} />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mt-1 mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">Audit Trail</h1>
                        <p className="text-[12px] text-slate-500 font-medium mt-0.5">Track all changes and activities performed on this department.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/departments/${id}`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
                    </Link>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                        <Download className="w-3.5 h-3.5" /> Export Report
                    </button>
                </div>
            </div>

            {/* DEPARTMENT SUMMARY CARD */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-2 overflow-hidden w-full">
                <div className="flex flex-nowrap items-center divide-x divide-slate-100 overflow-x-auto w-full">
                    {/* Dept */}
                    <div className="flex-[1.0] min-w-[280px] p-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Department</p>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-[13px] font-bold text-slate-900 leading-tight whitespace-nowrap">Interior Design</h2>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide whitespace-nowrap">Active</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">Department Code: INT-DSN</p>
                            <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">Parent Department: Design & Build</p>
                        </div>
                    </div>

                    {/* Head */}
                    <div className="shrink-0 min-w-[180px] p-4 flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul Nair" className="w-10 h-10 rounded-full border border-slate-200 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Department Head</p>
                            <h2 className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5 whitespace-nowrap">Rahul Nair</h2>
                            <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">Manager</p>
                        </div>
                    </div>

                    {/* Employees */}
                    <div className="shrink-0 min-w-[140px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Total Employees</p>
                            <h2 className="text-[15px] font-bold text-slate-900 leading-tight mb-0.5 whitespace-nowrap">12</h2>
                        </div>
                    </div>

                    {/* Created */}
                    <div className="shrink-0 min-w-[150px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Created On</p>
                            <h2 className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5 whitespace-nowrap">15 May 2025</h2>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="shrink-0 min-w-[180px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Location</p>
                            <h2 className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5 whitespace-nowrap">Noida, Uttar Pradesh</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT */}
            <div className="flex flex-col xl:flex-row mt-2 gap-2 items-start w-full">

                {/* LEFT SECTION (78%) */}
                <div className="w-full xl:w-[78%] flex flex-col gap-2 min-w-0">

                    {/* Toolbar Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-nowrap items-center justify-between gap-2 w-full overflow-x-auto">
                        <div className="flex flex-nowrap items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1.5 bg-white cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
                                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[11px] font-semibold text-slate-700">01 May 2025 - 15 May 2025</span>
                                <ChevronRight className="w-3 h-3 text-slate-400 ml-1 rotate-90" />
                            </div>

                            <div className="relative min-w-[120px]">
                                <select
                                    value={actionFilter}
                                    onChange={(e) => setActionFilter(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-md pl-3 pr-8 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:border-blue-400 cursor-pointer"
                                >
                                    <option value="All Actions">All Actions</option>
                                    <option value="Updated">Updated</option>
                                    <option value="Created">Created</option>
                                    <option value="Deleted">Deleted</option>
                                    <option value="Viewed">Viewed</option>
                                </select>
                                <ChevronRight className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[120px]">
                                <select
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-md pl-3 pr-8 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:border-blue-400 cursor-pointer"
                                >
                                    <option value="All Users">All Users</option>
                                    {Array.from(new Set(auditLogs.map(l => l.user))).map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                                <ChevronRight className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[120px]">
                                <select
                                    value={moduleFilter}
                                    onChange={(e) => setModuleFilter(e.target.value)}
                                    className="w-full appearance-none border border-slate-200 rounded-md pl-3 pr-8 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:border-blue-400 cursor-pointer"
                                >
                                    <option value="All Modules">All Modules</option>
                                    {Array.from(new Set(auditLogs.map(l => l.module))).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <ChevronRight className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => {
                                    setActionFilter('All Actions');
                                    setUserFilter('All Users');
                                    setModuleFilter('All Modules');
                                    setSearchTerm('');
                                }}
                                className="text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors px-2"
                            >
                                Clear Filters
                            </button>
                        </div>
                        <div className="relative shrink-0 min-w-[150px] max-w-[200px] flex-1">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search in audit trail..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-7 pr-3 py-1.5 w-full text-[11px] font-medium border border-slate-200 rounded-md focus:outline-none focus:border-blue-400 text-slate-700 bg-white"
                            />
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full flex flex-col mt-2">
                        <div className="w-full">
                            <table className="w-full text-left border-collapse table-fixed">
                                <colgroup>
                                    <col style={{ width: '3%' }} />
                                    <col style={{ width: '9%' }} />
                                    <col style={{ width: '14%' }} />
                                    <col style={{ width: '9%' }} />
                                    <col style={{ width: '13%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '15%' }} />
                                    <col style={{ width: '10%' }} />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase text-center">#</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">Date & Time</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">User</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">Action</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">Module</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">Record/Field</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">Old Value</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">New Value</th>
                                        <th className="py-2.5 px-1.5 text-[9.5px] font-bold text-slate-600 uppercase">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.filter(log => {
                                        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            log.record.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            log.oldVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            log.newVal.toLowerCase().includes(searchTerm.toLowerCase());
                                        const matchesAction = actionFilter === 'All Actions' || log.action === actionFilter;
                                        const matchesUser = userFilter === 'All Users' || log.user === userFilter;
                                        const matchesModule = moduleFilter === 'All Modules' || log.module === moduleFilter;
                                        return matchesSearch && matchesAction && matchesUser && matchesModule;
                                    }).map((log) => (
                                        <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-2 px-1.5 text-[10px] font-medium text-slate-700 text-center">{log.id}</td>
                                            <td className="py-2 px-1.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-900">{log.date}</span>
                                                    <span className="text-[9px] font-medium text-slate-500">{log.time}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <img src={log.avatar} alt={log.user} className="w-5 h-5 rounded-full border border-slate-200" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-slate-900 leading-tight">{log.user}</span>
                                                        <span className="text-[9px] font-medium text-slate-500 leading-tight">{log.role}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-1.5">
                                                <span className={`px-1.5 py-0.5 text-[8.5px] font-bold border rounded uppercase tracking-wide inline-block ${getBadgeStyle(log.actionColor)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-2 px-1.5 text-[10px] font-medium text-slate-700 truncate">{log.module}</td>
                                            <td className="py-2 px-1.5 text-[10px] font-medium text-slate-700 truncate">{log.record}</td>
                                            <td className="py-2 px-1.5 text-[10px] font-medium text-slate-600 truncate">{log.oldVal}</td>
                                            <td className="py-2 px-1.5 text-[10px] font-bold text-slate-900 truncate">{log.newVal}</td>
                                            <td className="py-2 px-1.5 text-[9.5px] font-medium text-slate-500 truncate">{log.ip}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
                            <span className="text-[11px] font-medium text-slate-500">Showing 1 to 10 of 47 entries</span>
                            <div className="flex items-center gap-1">
                                <button className="p-1 border border-slate-200 rounded bg-white text-slate-400 hover:text-slate-600 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                <button className="w-6 h-6 flex items-center justify-center text-[10px] font-bold bg-blue-600 text-white rounded">1</button>
                                <button className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded">2</button>
                                <button className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded">3</button>
                                <span className="text-[10px] font-bold text-slate-400 px-1">...</span>
                                <button className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded">5</button>
                                <button className="p-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] font-medium text-slate-400 mt-2">© 2025 Crewcam HRMS. All rights reserved.</p>

                </div>

                {/* RIGHT SECTION (22%) */}
                <div className="flex flex-col gap-2 w-full xl:w-[22%] shrink-0">

                    {/* Card 1: Audit Overview */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-[12px] font-bold text-slate-900 mb-3">Audit Overview</h3>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-50">
                                        <Activity className="w-3 h-3 text-indigo-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700">Total Activities</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-900">47</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-50">
                                        <UploadCloud className="w-3 h-3 text-amber-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700">Created</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-900">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-50">
                                        <RefreshCw className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700">Updated</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-900">28</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-rose-50">
                                        <X className="w-3 h-3 text-rose-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700">Deleted</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-900">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-50">
                                        <Activity className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700">Viewed</span>
                                </div>
                                <span className="text-[12px] font-bold text-slate-900">11</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Top Users */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-[12px] font-bold text-slate-900 mb-3">Top Users</h3>
                        <div className="flex flex-col gap-3">
                            {topUsers.map((u, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full border border-slate-200 shrink-0" />
                                        <span className="text-[11px] font-semibold text-slate-700 truncate">{u.name}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{u.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Quick Actions */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-[12px] font-bold text-slate-900 mb-3">Quick Actions</h3>
                        <div className="flex flex-col gap-1">
                            <button className="flex items-center gap-2 px-2 py-2 w-full text-left rounded hover:bg-slate-50 transition-colors group">
                                <Download className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
                                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">Export Audit Report</span>
                            </button>
                            <button className="flex items-center gap-2 px-2 py-2 w-full text-left rounded hover:bg-slate-50 transition-colors group">
                                <Clock className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
                                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">Schedule Audit Report</span>
                            </button>
                            <button className="flex items-center gap-2 px-2 py-2 w-full text-left rounded hover:bg-slate-50 transition-colors group">
                                <Settings className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
                                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">Audit Trail Settings</span>
                            </button>
                            <button className="flex items-center gap-2 px-2 py-2 w-full text-left rounded hover:bg-slate-50 transition-colors group">
                                <BarChart2 className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
                                <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">View Audit Logs (System)</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 4: Retention Policy */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-4 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <h3 className="text-[12px] font-bold text-slate-900">Retention Policy</h3>
                            </div>
                            <p className="text-[10.5px] font-medium text-slate-600 leading-snug mb-3">
                                Audit logs are retained for 1 year from the date of activity.
                            </p>
                            <Link href="#" className="text-[10.5px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group w-max transition-colors">
                                View Retention Policy <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
