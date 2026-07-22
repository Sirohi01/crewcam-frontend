
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Copy, Edit2, Info, ChevronDown, X, Building, HelpCircle,
  Target, Book, AlignLeft, Clock, Archive, Save,
  PieChartIcon, Share2, GitBranch, ShieldCheck
} from 'lucide-react';

// Missing standard lucide icons mapped to custom svgs for exact matches
const Users = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ChevronRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const FileText = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const HierarchyIcon = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="4" y="11" width="16" height="10" rx="2" /><circle cx="12" cy="16" r="1" /></svg>;

export default function DepartmentDetailsPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    name: 'Design Studio',
    code: 'DS',
    shortName: 'Design Studio',
    parent: '',
    head: 'Aman Malhotra',
    altHead: 'Neha Sethi',
    bu: 'Design & Creative',
    costCenter: 'CC-DS-1001',
    location: 'Noida – Head Office',
    budget: '₹ 1,20,00,000',
    capacity: '60',
    type: 'Core Department',
    status: 'Active',
    email: 'designstudio@designhouse.co.in',
    phone: '+91 120 456 7890',
    description: 'Responsible for conceptualization, space planning, 3D design and creative development for all projects and client requirements.'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { name: 'Basic Information', icon: Info },
    { name: 'Department Structure', icon: GitBranch },
    { name: 'Business Mapping', icon: Building },
    { name: 'Budget & Costing', icon: PieChartIcon },
    { name: 'Documents (3)', icon: FileText },
    { name: 'KPIs & Goals', icon: Target },
    { name: 'Policies', icon: Book },
    { name: 'Custom Fields', icon: AlignLeft },
    { name: 'Audit Trail', icon: Clock },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800 bg-slate-50 min-h-screen">
      {/* BREADCRUMB */}
      <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-2">
        <span className="hover:text-blue-600 cursor-pointer transition-colors">Organization Setup</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/dashboard/departments" className="hover:text-blue-600 cursor-pointer transition-colors">Departments</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Department Details</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex items-center justify-center w-9 h-9 rounded-md border border-slate-200 text-blue-600">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-2">Department Details</h1>
            <p className="text-[12px] text-slate-500 font-medium">View and manage department information, structure and settings.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/departments" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-[12px] hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to List
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-[12px] hover:bg-slate-50 transition-colors shadow-sm">
            <Copy className="w-4 h-4" /> Duplicate Department
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 border border-blue-600 text-white rounded-md font-bold text-[12px] hover:bg-blue-700 transition-colors shadow-sm">
            <Edit2 className="w-4 h-4" /> Edit Department
          </button>
        </div>
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[200px_minmax(0,1fr)_380px] gap-5 items-start mt-2">

        {/* LEFT NAV PANEL */}
        <div className="flex flex-col gap-1 py-1">
          {tabs.map((tab, idx) => (
            <button key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[12px] font-bold transition-colors ${idx === 0 ? 'bg-white text-blue-600 shadow-sm border border-slate-200 relative before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-blue-600 before:rounded-r-md' : 'text-slate-600 hover:bg-slate-100 border border-transparent'}`}>
              <tab.icon className={`w-4 h-4 ${idx === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* MIDDLE SECTION - FORM */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
          {/* Section Header */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-[16px] font-bold text-slate-900">Basic Information</h2>
            </div>
            <p className="text-[12px] text-slate-500 font-medium pl-7">Enter essential details about this department.</p>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* ROW 1 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Department Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Department Code <span className="text-red-500">*</span></label>
                <input type="text" value={formData.code} onChange={(e) => handleInputChange('code', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Short Name</label>
                <input type="text" value={formData.shortName} onChange={(e) => handleInputChange('shortName', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Parent Department</label>
                <div className="relative">
                  <select value={formData.parent} onChange={(e) => handleInputChange('parent', e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm pr-8">
                    <option value="">-- None (Top Level) --</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2 flex items-center gap-1">Select the parent department <HelpCircle className="w-3.5 h-3.5 text-slate-400" /></p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Department Head <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-between border border-slate-200 rounded-lg p-1.5 pr-2.5 shadow-sm bg-white cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2 pl-1">
                    <img src="https://i.pravatar.cc/150?u=1" alt="Aman" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    <div className="leading-tight">
                      <p className="text-[11.5px] font-bold text-slate-900">{formData.head}</p>
                      <p className="text-[9.5px] font-medium text-slate-500">Design Director</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><X className="w-3.5 h-3.5" /></div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Alternate Head</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-lg p-1.5 pr-2.5 shadow-sm bg-white cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2 pl-1">
                    <img src="https://i.pravatar.cc/150?u=2" alt="Neha" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    <div className="leading-tight">
                      <p className="text-[11.5px] font-bold text-slate-900">{formData.altHead}</p>
                      <p className="text-[9.5px] font-medium text-slate-500">GM – Retail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"><X className="w-3.5 h-3.5" /></div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Business Unit <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={formData.bu} onChange={(e) => handleInputChange('bu', e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm pr-8">
                    <option value="Design & Creative">Design & Creative</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2 flex items-center gap-1">Select the business unit <HelpCircle className="w-3.5 h-3.5 text-slate-400" /></p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Cost Center <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={formData.costCenter} onChange={(e) => handleInputChange('costCenter', e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm pr-8">
                    <option value="CC-DS-1001">CC-DS-1001</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2 flex items-center gap-1">Select the cost center <HelpCircle className="w-3.5 h-3.5 text-slate-400" /></p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm pr-8">
                    <option value="Noida – Head Office">Noida – Head Office</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2 flex items-center gap-1">Select the primary location <HelpCircle className="w-3.5 h-3.5 text-slate-400" /></p>
              </div>
            </div>

            {/* INFO CALLOUT */}
            <div className="bg-[#F0F5FF] border border-blue-100 rounded-lg p-3 flex items-start gap-3 mt-0">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-tight">
                <h4 className="text-[13px] font-bold text-blue-900 mb-2">What is Business Unit?</h4>
                <p className="text-[11.5px] font-medium text-slate-700 mb-2 leading-relaxed">A Business Unit represents a major business or operational vertical within the organization.</p>
                <p className="text-[11.5px] font-medium text-slate-700"><strong>Example:</strong> Retail Interiors, Display Solutions, Events & Exhibitions, Corporate Services</p>
              </div>
            </div>

            {/* ROW 4 */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Budget (FY 2025-26)</label>
                <input type="text" value={formData.budget} onChange={(e) => handleInputChange('budget', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Employee Capacity</label>
                <input type="text" value={formData.capacity} onChange={(e) => handleInputChange('capacity', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Department Type</label>
                <div className="relative">
                  <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm pr-8">
                    <option value="Core Department">Core Department</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Status</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-[12px] font-bold text-emerald-600">Active</span>
                  </div>
                  <select value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} className="w-full appearance-none pl-12 pr-8 py-2 border border-slate-200 rounded-lg text-[12px] text-transparent font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm cursor-pointer">
                    <option value="Active">Active</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ROW 5 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Email</label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Phone</label>
                <input type="text" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm" />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Description</label>
              <textarea rows={2} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors bg-white shadow-sm resize-none"></textarea>
              <div className="flex justify-end mt-1">
                <span className="text-[11px] font-bold text-slate-400">{formData.description.length} / 500</span>
              </div>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 rounded-md font-bold text-[12px] hover:bg-red-50 transition-colors bg-white shadow-sm">
              <Archive className="w-4 h-4" /> Archive Department
            </button>
            <div className="flex items-center gap-3">
              <button className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-md font-bold text-[12px] hover:bg-slate-50 transition-colors bg-white shadow-sm">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 border border-blue-600 text-white rounded-md font-bold text-[12px] hover:bg-blue-700 transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT INFORMATION PANEL */}
        <div className="flex flex-col gap-5 sticky top-6">
          {/* Understand Key Fields */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-amber-500"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg></div>
              <h3 className="text-[14px] font-bold text-slate-900">Understand Key Fields</h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Field 1 */}
              <div className="flex gap-4 border border-slate-100 rounded-lg p-3">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-blue-800 mb-1">Parent Department</h4>
                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed mb-2">The department under which this department is organized. Helps in building hierarchy and reporting structure.</p>
                  <p className="text-[10px] font-bold text-slate-800">Example: <span className="font-medium text-slate-600">Projects → Retail Interiors</span></p>
                </div>
                <div className="w-12 h-12 shrink-0 text-slate-400">
                  <HierarchyIcon className="w-full h-full stroke-[1]" />
                </div>
              </div>

              {/* Field 2 */}
              <div className="flex gap-4 border border-slate-100 rounded-lg p-3">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-blue-800 mb-1">Business Unit (BU)</h4>
                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed mb-2">A group of departments that work together to deliver a specific product or service or operate in a specific market.</p>
                  <p className="text-[10px] font-bold text-slate-800">Example: <span className="font-medium text-slate-600">Design & Creative</span></p>
                </div>
                <div className="w-10 h-10 shrink-0 text-[#4068D3]">
                  <PieChartIcon className="w-full h-full stroke-[1] fill-current" />
                </div>
              </div>

              {/* Field 3 */}
              <div className="flex gap-4 border border-slate-100 rounded-lg p-3">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-blue-800 mb-1">Cost Center</h4>
                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed mb-2">A unique code/center used by Finance to track all expenses and budgets related to this department.</p>
                  <p className="text-[10px] font-bold text-slate-800">Example: <span className="font-medium text-slate-600">CC-DS-1001</span></p>
                </div>
                <div className="w-10 h-10 shrink-0 bg-[#BEA9ED] rounded-lg p-2 text-white flex items-center justify-between">
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                  <div className="bg-[#5939A5] text-[12px] font-bold h-full aspect-square flex items-center justify-center rounded">₹</div>
                </div>
              </div>

              {/* Field 4 */}
              <div className="flex gap-4 border border-slate-100 rounded-lg p-3">
                <div className="flex-1">
                  <h4 className="text-[12px] font-bold text-blue-800 mb-1">Department Type</h4>
                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed mb-2">Helps classify departments based on their role in the organization.</p>
                  <p className="text-[10px] font-bold text-slate-800">Example: <span className="font-medium text-slate-600">Core, Support, Project Based</span></p>
                </div>
                <div className="w-10 h-10 shrink-0">
                  <ShieldCheck className="w-full h-full stroke-[1.5] fill-[#84D399] text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Hierarchy Preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">Hierarchy Preview</h3>
            <div className="flex flex-col text-[11px] font-bold text-slate-800 relative z-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-[#E8F3EA] text-[#6CA97B] flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                Design House India Pvt. Ltd.
              </div>

              <div className="pl-[11px] border-l border-slate-200 ml-2.5 mb-3 flex items-center gap-2 relative">
                <div className="absolute top-1/2 left-0 w-3 border-t border-slate-200"></div>
                <div className="bg-[#F0F5FF] border border-blue-100 text-blue-900 px-3 py-1.5 rounded-lg flex items-center gap-2 w-auto shadow-sm">
                  <Share2 className="w-3.5 h-3.5 text-slate-500" /> Design & Creative <span className="font-medium text-slate-500">(Business Unit)</span>
                </div>
              </div>

              <div className="pl-[27px] border-l border-slate-200 ml-2.5 mb-3 flex items-center gap-2 relative">
                <div className="absolute top-1/2 left-0 w-7 border-t border-slate-200"></div>
                <div className="bg-[#0038FF] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 w-auto shadow-sm">
                  <Building className="w-3.5 h-3.5" /> Design Studio <span className="font-medium text-blue-200">(This Department)</span>
                </div>
              </div>

              <div className="pl-[43px] border-l border-slate-200 ml-2.5 mb-2.5 flex items-center gap-2 relative text-slate-600">
                <div className="absolute top-1/2 left-0 w-11 border-t border-slate-200"></div>
                <Users className="w-3.5 h-3.5" /> 3D Visualization Team
              </div>

              <div className="pl-[43px] border-l border-slate-200 ml-2.5 mb-2.5 flex items-center gap-2 relative text-slate-600">
                <div className="absolute top-1/2 left-0 w-11 border-t border-slate-200"></div>
                <Users className="w-3.5 h-3.5" /> Space Planning Team
              </div>

              <div className="pl-[43px] border-l border-slate-200 ml-2.5 flex items-center gap-2 relative text-slate-600">
                <div className="absolute top-1/2 left-0 w-11 border-t border-slate-200"></div>
                <Users className="w-3.5 h-3.5" /> Creative Team
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[14px] font-bold text-slate-900 ml-1">Quick Actions</h3>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-3 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 group-hover:text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Share2 className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-blue-500" /> View Organization Chart
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>
              <button className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-3 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 group-hover:text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Building className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-blue-500" /> Go to Cost Center
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
