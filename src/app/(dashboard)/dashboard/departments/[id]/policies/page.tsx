'use client';
import React, { useState, useEffect } from 'react';
import { getDepartmentById } from '@/services/departmentService';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import {
  ShieldCheck, ArrowLeft, Plus, Building2, UserCircle, Users, Calendar, MapPin, Search, ChevronDown, Download, Eye, MoreVertical,
  Shield, Laptop, Gift, Clock, FileText, Settings, Upload, ChevronRight
} from 'lucide-react';

const policies = [
  {
    id: 1,
    name: 'Attendance & Punctuality Policy',
    desc: 'Guidelines for working hours, attendance marking and punctuality.',
    category: 'Attendance',
    catColor: 'text-blue-600 bg-blue-50 border-blue-200',
    type: 'Department Policy',
    typeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    version: '1.2',
    effective: '01 Apr 2025',
    updatedDate: '10 May 2025',
    updatedBy: 'Rahul Nair',
    icon: <ShieldCheck size={16} className="text-blue-500" />,
    iconBg: 'bg-blue-50',
  },
  {
    id: 2,
    name: 'Leave Policy',
    desc: 'Rules for applying, approval and encashment of leaves.',
    category: 'Leave',
    catColor: 'text-purple-600 bg-purple-50 border-purple-200',
    type: 'Company Policy',
    typeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    version: '2.0',
    effective: '01 Jan 2025',
    updatedDate: '05 May 2025',
    updatedBy: 'HR Team',
    icon: <Users size={16} className="text-purple-500" />,
    iconBg: 'bg-purple-50',
  },
  {
    id: 3,
    name: 'Code of Conduct',
    desc: 'Expected behaviour, ethics and professional standards.',
    category: 'HR Policies',
    catColor: 'text-orange-600 bg-orange-50 border-orange-200',
    type: 'Company Policy',
    typeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    version: '3.1',
    effective: '01 Jan 2025',
    updatedDate: '02 May 2025',
    updatedBy: 'HR Team',
    icon: <Shield size={16} className="text-orange-500" />,
    iconBg: 'bg-orange-50',
  },
  {
    id: 4,
    name: 'IT & Data Security Policy',
    desc: 'Guidelines for information security and acceptable use of IT resources.',
    category: 'IT Policies',
    catColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    type: 'Company Policy',
    typeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    version: '1.5',
    effective: '15 Feb 2025',
    updatedDate: '28 Apr 2025',
    updatedBy: 'IT Team',
    icon: <Laptop size={16} className="text-emerald-500" />,
    iconBg: 'bg-emerald-50',
  },
  {
    id: 5,
    name: 'Leave Travel Concession (LTC) Policy',
    desc: 'Rules and eligibility for LTC for employees.',
    category: 'Benefits',
    catColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    type: 'Company Policy',
    typeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    version: '1.0',
    effective: '01 Apr 2025',
    updatedDate: '15 Apr 2025',
    updatedBy: 'HR Team',
    icon: <Gift size={16} className="text-yellow-500" />,
    iconBg: 'bg-yellow-50',
  },
  {
    id: 6,
    name: 'Grievance Redressal Policy',
    desc: 'Process for raising and resolving employee grievances.',
    category: 'HR Policies',
    catColor: 'text-orange-600 bg-orange-50 border-orange-200',
    type: 'Department Policy',
    typeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    version: '1.1',
    effective: '01 Mar 2025',
    updatedDate: '12 Apr 2025',
    updatedBy: 'Rahul Nair',
    icon: <FileText size={16} className="text-red-500" />,
    iconBg: 'bg-red-50',
  }
];

export default function PoliciesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const [activeTab, setActiveTab] = useState('All Policies');
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const data = await getDepartmentById(id);
        setDepartment(data);
      } catch (error) {
        console.error('Failed to fetch department details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const tabs = ['All Policies', 'Department Policies', 'Company Policies', 'Archived Policies'];

  return (
    <div className="flex flex-col gap-1 p-2 w-full font-sans text-slate-800 animate-in fade-in duration-300">

      {/* BREADCRUMB */}
      <Breadcrumb items={[
        { label: 'Organization Setup' },
        { label: 'Departments', href: '/dashboard/departments' },
        { label: 'Department Details', href: `/dashboard/departments/${id}` },
        { label: 'Policies' }
      ]} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
        <div className="flex items-start gap-2">
          <div className="mt-1 w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Policies</h1>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">Manage and communicate department specific policies and guidelines.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/departments/${id}`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
          </Link>
          <Link href={`/dashboard/departments/${id}/policies/add`} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Policy
          </Link>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="px-3 py-2 flex gap-3 items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Department</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{department?.name || 'Loading...'}</span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold ${department?.isActive ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-700 bg-slate-50 border-slate-200'} border rounded uppercase`}>
                {department?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-col gap-0 mt-0.5">
              <span className="text-[10.5px] font-medium text-slate-600">Department Code: {department?.code || '---'}</span>
              <span className="text-[10.5px] font-medium text-slate-600">Parent Department: {department?.reportingToId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 flex gap-3 items-center flex-[0.8]">
          <img src="https://i.pravatar.cc/150?u=12" alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Department Head</span>
            <span className="text-sm font-bold text-slate-900">{department?.hodEmployeeId || 'Not Assigned'}</span>
            <span className="text-[11px] font-medium text-slate-600">Manager</span>
          </div>
        </div>

        <div className="px-3 py-2 flex gap-3 items-center flex-[0.7]">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Employee Capacity</span>
            <span className="text-sm font-bold text-slate-900">{department?.employeeCapacity || '0'}</span>
          </div>
        </div>

        <div className="px-3 py-2 flex gap-3 items-center flex-[0.7]">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Created On</span>
            <span className="text-[13px] font-bold text-slate-900">15 May 2025</span>
          </div>
        </div>

        <div className="px-3 py-2 flex gap-3 items-center flex-[0.8]">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Location</span>
            <span className="text-[13px] font-bold text-slate-900">{department?.location || '---'}</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-2 items-start">

        {/* LEFT SECTION (TABLE) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">

          {/* TABS */}
          <div className="flex items-center gap-6 px-4 border-b border-slate-100 pt-2">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`pb-2 text-[11px] font-bold transition-colors relative ${activeTab === t ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                {t}
                {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-t-full" />}
              </button>
            ))}
          </div>

          {/* CONTROLS */}
          <div className="p-2 px-4 border-b border-slate-100 flex flex-wrap items-center gap-2">
            <div className="relative">
              <input type="text" placeholder="Search policies..." className="pl-8 pr-3 py-1 border border-slate-200 rounded-md text-[11px] font-medium w-48 focus:outline-none focus:border-indigo-400 bg-white shadow-sm" />
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 bg-white shadow-sm w-36 focus:outline-none focus:border-indigo-400">
                <option>All Categories</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 bg-white shadow-sm w-36 focus:outline-none focus:border-indigo-400">
                <option>All Policy Types</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none pl-3 pr-8 py-1 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 bg-white shadow-sm w-28 focus:outline-none focus:border-indigo-400">
                <option>All Status</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button className="px-3 py-1 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Clear
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-600 uppercase w-10">#</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Policy Name</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Category</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Policy Type</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Version</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Effective Date</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Last Updated</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Status</th>
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-600 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map((pol) => (
                  <tr key={pol.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 px-3 text-[11px] font-bold text-slate-700">{pol.id}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 mt-0.5 rounded-lg flex items-center justify-center shrink-0 border ${pol.catColor.replace('text-', 'border-').replace('600', '100')} ${pol.iconBg}`}>
                          {pol.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-slate-900">{pol.name}</span>
                          <span className="text-[10px] font-medium text-slate-500 mt-0.5 max-w-[200px] leading-tight">{pol.desc}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${pol.catColor}`}>{pol.category}</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${pol.typeColor}`}>{pol.type}</span>
                    </td>
                    <td className="py-2 px-2 text-center text-[11px] font-semibold text-slate-700">{pol.version}</td>
                    <td className="py-2 px-2 text-center text-[11px] font-medium text-slate-600">{pol.effective}</td>
                    <td className="py-2 px-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-slate-700">{pol.updatedDate}</span>
                        <span className="text-[9px] font-medium text-slate-500">{pol.updatedBy}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Active</span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-2 px-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-600">Showing 1 to 6 of 18 policies</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 text-[10px] font-medium">&lt;</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-indigo-600 bg-indigo-600 text-white text-[10px] font-bold">1</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-bold">2</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-bold">3</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-700 text-[10px] font-bold cursor-default">...</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-bold">4</button>
              <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-medium">&gt;</button>
            </div>
          </div>

          {/* NOTE */}
          <div className="p-2 px-4 bg-slate-50/50 border-t border-slate-100 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1.5">Note</h4>
              <ul className="list-disc pl-4 text-[10px] font-medium text-slate-600 space-y-0.5 marker:text-slate-400">
                <li>Department policies apply to all employees under this department.</li>
                <li>Ensure policies are reviewed and updated regularly.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (SIDEBAR) */}
        <div className="flex flex-col gap-2">

          {/* Card 1: Policy Summary */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
            <h3 className="text-[11px] font-bold text-slate-900 mb-3">Policy Summary</h3>
            <div className="flex justify-center mb-4 relative">
              {/* CSS Donut Chart */}
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'conic-gradient(#10b981 0% 66.67%, #3b82f6 66.67% 77.78%, #f97316 77.78% 88.89%, #ef4444 88.89% 100%)'
                }}>
                <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center absolute">
                  <span className="text-lg font-bold text-slate-900 leading-tight">18</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Total</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-semibold text-slate-700">Active</span></div>
                <div className="flex items-center gap-2"><span className="font-bold text-slate-900">12</span><span className="text-slate-400">(66.67%)</span></div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="font-semibold text-slate-700">Draft</span></div>
                <div className="flex items-center gap-2"><span className="font-bold text-slate-900">2</span><span className="text-slate-400">(11.11%)</span></div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /><span className="font-semibold text-slate-700">Under Review</span></div>
                <div className="flex items-center gap-2"><span className="font-bold text-slate-900">2</span><span className="text-slate-400">(11.11%)</span></div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="font-semibold text-slate-700">Archived</span></div>
                <div className="flex items-center gap-2"><span className="font-bold text-slate-900">2</span><span className="text-slate-400">(11.11%)</span></div>
              </div>
            </div>
          </div>

          {/* Card 2: Categories */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
            <h3 className="text-[11px] font-bold text-slate-900 mb-1.5">Categories</h3>
            <div className="flex flex-col gap-0">
              <div className="flex items-center justify-between py-1 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Shield size={14} className="text-orange-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">HR Policies</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">5</span>
              </div>
              <div className="flex items-center justify-between py-1.5 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Users size={14} className="text-blue-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Attendance</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between py-1.5 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Calendar size={14} className="text-purple-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Leave</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between py-1.5 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Laptop size={14} className="text-emerald-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">IT Policies</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">2</span>
              </div>
              <div className="flex items-center justify-between py-1.5 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Gift size={14} className="text-yellow-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Benefits</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">2</span>
              </div>
              <div className="flex items-center justify-between py-1.5 group cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-slate-500" />
                  <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Others</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">3</span>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
            <h3 className="text-[11px] font-bold text-slate-900 mb-1.5">Quick Actions</h3>
            <div className="flex flex-col gap-0">
              <button className="flex items-center justify-between py-1.5 group text-left w-full">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <Plus size={15} />
                  <span className="text-[11.5px] font-bold">Add Policy</span>
                </div>
              </button>
              <button className="flex items-center justify-between py-2 group text-left w-full">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <FileText size={15} />
                  <span className="text-[11.5px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Policy Categories</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between py-2 group text-left w-full">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <Settings size={15} />
                  <span className="text-[11.5px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Policy Types</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between py-2 group text-left w-full">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <Upload size={15} />
                  <span className="text-[11.5px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Upload Bulk Policies</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
              <button className="flex items-center justify-between py-2 group text-left w-full">
                <div className="flex items-center gap-2.5 text-indigo-600">
                  <Users size={15} />
                  <span className="text-[11.5px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Policy Approval Workflow</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
