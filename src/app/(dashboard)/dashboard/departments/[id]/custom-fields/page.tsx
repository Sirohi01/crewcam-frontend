'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import {
  Settings, ArrowLeft, Plus, Building2, UserCircle, Users, Calendar, MapPin,
  Search, ChevronDown, Check, X, Eye, Edit2, Trash2, Info, List, Hash,
  AlignLeft, DollarSign, CalendarDays, Upload, Download, FileText, LayoutList,
  Briefcase, ShieldCheck, ClipboardList
} from 'lucide-react';

// Static Data based on user prompt
const customFields = [
  { id: 1, label: 'Project Specialization', subtitle: 'Main area of specialization', apiKey: 'project_specialization', type: 'Dropdown', group: 'Department Info', mandatory: false, status: 'Active' },
  { id: 2, label: 'Years of Experience in Interior', subtitle: 'Total experience in interior industry', apiKey: 'years_of_experience', type: 'Number', group: 'Department Info', mandatory: false, status: 'Active' },
  { id: 3, label: 'Key Design Tools', subtitle: 'Tools used by the department', apiKey: 'design_tools', type: 'Multi Select', group: 'Department Info', mandatory: false, status: 'Active' },
  { id: 4, label: 'Primary Client Segment', subtitle: 'Type of clients we mainly serve', apiKey: 'client_segment', type: 'Dropdown', group: 'Business Info', mandatory: true, status: 'Active' },
  { id: 5, label: 'Department Budget (FY)', subtitle: 'Annual budget allocated', apiKey: 'department_budget', type: 'Currency', group: 'Finance Info', mandatory: false, status: 'Active' },
  { id: 6, label: 'Quality Certification', subtitle: 'Any certification applicable', apiKey: 'quality_certification', type: 'Text', group: 'Compliance', mandatory: false, status: 'Draft' },
  { id: 7, label: 'Last Review Date', subtitle: 'Date of last department review', apiKey: 'last_review_date', type: 'Date', group: 'Review Info', mandatory: false, status: 'Active' },
];

export default function CustomFieldsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [activeTab, setActiveTab] = useState('Custom Fields');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All Field Groups');
  const [selectedType, setSelectedType] = useState('All Data Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup, selectedType, selectedStatus, activeTab]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGroup('All Field Groups');
    setSelectedType('All Data Types');
    setSelectedStatus('All Status');
  };

  const filteredFields = customFields.filter((field) => {
    if (searchQuery && !field.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedGroup !== 'All Field Groups' && field.group !== selectedGroup) return false;
    if (selectedType !== 'All Data Types' && field.type !== selectedType) return false;
    if (selectedStatus !== 'All Status' && field.status !== selectedStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredFields.length / rowsPerPage);
  const paginatedFields = filteredFields.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Render Badge based on Data Type
  const renderDataTypeBadge = (type: string) => {
    switch (type) {
      case 'Dropdown':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-blue-600 bg-blue-50 border-blue-200"><List size={10} /> Dropdown</span>;
      case 'Number':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-indigo-600 bg-indigo-50 border-indigo-200"><Hash size={10} /> Number</span>;
      case 'Multi Select':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-amber-600 bg-amber-50 border-amber-200"><LayoutList size={10} /> Multi Select</span>;
      case 'Currency':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-emerald-600 bg-emerald-50 border-emerald-200"><DollarSign size={10} /> Currency</span>;
      case 'Text':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-slate-600 bg-slate-50 border-slate-200"><AlignLeft size={10} /> Text</span>;
      case 'Date':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-teal-600 bg-teal-50 border-teal-200"><CalendarDays size={10} /> Date</span>;
      default:
        return <span>{type}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2 w-full font-sans text-slate-800 animate-in fade-in duration-300">

      {/* BREADCRUMB */}
      <Breadcrumb items={[
        { label: 'Organization Setup' },
        { label: 'Departments', href: '/dashboard/departments' },
        { label: 'Department Details', href: `/dashboard/departments/${id}` },
        { label: 'Custom Fields' }
      ]} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className="mt-1 w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            <Settings size={18} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Custom Fields</h1>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">Create and manage custom fields to capture additional information for this department.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/departments/${id}`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
          </Link>
          <Link href={`/dashboard/departments/${id}/custom-fields/add`} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Custom Field
          </Link>
        </div>
      </div>

      {/* DEPARTMENT SUMMARY CARD */}
      <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-2 my-2 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
        <div className="flex items-center gap-3 md:w-[25%] px-4 py-2 md:py-0 first:pl-0">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 border border-purple-200">
            <Building2 className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Department</p>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Interior Design</h2>
              <span className="px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Active</span>
            </div>
            <p className="text-[10px] font-medium text-slate-600 mt-0.5">Department Code: INT-DSN</p>
            <p className="text-[10px] font-medium text-slate-600">Parent Department: Design & Build</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-[25%] px-4 py-2 md:py-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Department Head</p>
            <p className="text-xs font-bold text-slate-900 leading-snug">Rahul Nair</p>
            <p className="text-[10px] font-medium text-slate-600">Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-[15%] px-4 py-2 md:py-0">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Total Employees</p>
            <p className="text-sm font-bold text-slate-900">12</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-[15%] px-4 py-2 md:py-0">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Created On</p>
            <p className="text-[11px] font-bold text-slate-900">15 May 2025</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:w-[15%] px-4 py-2 md:py-0 last:pr-0">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Location</p>
            <p className="text-[11px] font-bold text-slate-900">Noida, Uttar Pradesh</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col xl:flex-row gap-2">

        {/* LEFT SECTION (78%) */}
        <div className="w-full xl:w-[78%] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">

          {/* TABS */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 pt-2">
            <button
              className={`px-4 py-2.5 text-[11px] font-bold border-b-2 transition-colors ${activeTab === 'Custom Fields' ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
              onClick={() => setActiveTab('Custom Fields')}
            >
              Custom Fields
            </button>
            <button
              className={`px-4 py-2.5 text-[11px] font-bold border-b-2 transition-colors ${activeTab === 'Field Groups' ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
              onClick={() => setActiveTab('Field Groups')}
            >
              Field Groups
            </button>
          </div>

          {/* FILTERS */}
          <div className="p-3 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-white">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search custom fields..."
                className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="relative w-40">
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-1.5 text-[11px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-700">
                <option>All Field Groups</option>
                <option>Department Info</option>
                <option>Business Info</option>
                <option>Finance Info</option>
                <option>Compliance</option>
                <option>Review Info</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative w-36">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-1.5 text-[11px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-700">
                <option>All Data Types</option>
                <option>Dropdown</option>
                <option>Number</option>
                <option>Multi Select</option>
                <option>Currency</option>
                <option>Text</option>
                <option>Date</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative w-32">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-1.5 text-[11px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-700">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <button onClick={handleClearFilters} className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors">
              Clear
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-600 uppercase w-10">#</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Field Label</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Field Name (API Key)</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Data Type</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase">Field Group</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Mandatory</th>
                  <th className="py-2 px-2 text-[10px] font-bold text-slate-600 uppercase text-center">Status</th>
                  <th className="py-2 px-3 text-[10px] font-bold text-slate-600 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedFields.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-slate-500 text-[11px]">No custom fields found matching your filters.</td>
                  </tr>
                )}
                {paginatedFields.map((field, idx) => (
                  <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-[11px] font-bold text-slate-700">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900">{field.label}</span>
                        <span className="text-[10px] font-medium text-slate-500 mt-0.5">{field.subtitle}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[11px] font-medium text-slate-600">{field.apiKey}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      {renderDataTypeBadge(field.type)}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-[11px] font-medium text-slate-600">{field.group}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {field.mandatory ? (
                        <div className="flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px] font-medium text-slate-700">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <X className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-medium text-slate-600">No</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {field.status === 'Active' ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Active</span>
                      ) : (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded uppercase tracking-wide">Draft</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-2 px-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-600">
              Showing {filteredFields.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredFields.length)} of {filteredFields.length} entries
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-2">
                <span className="text-[10px] font-medium text-slate-500">Rows per page:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="appearance-none border border-slate-200 bg-white px-2 py-0.5 rounded text-[10px] font-medium focus:outline-none">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 text-[10px] font-medium">&lt;</button>
              <span className="text-[10px] font-bold text-slate-700 px-1">Page {currentPage} of {totalPages || 1}</span>
              <button disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 text-[10px] font-medium">&gt;</button>
            </div>
          </div>

          {/* NOTE */}
          <div className="p-3 px-4 bg-slate-50/50 border-t border-slate-100 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
              <Info className="w-3 h-3 text-indigo-600" />
            </div>
            <div className="mt-0.5">
              <p className="text-[13px] font-bold text-indigo-600 mb-1.5">Note</p>
              <ul className="list-disc pl-4 text-[10px] font-medium text-slate-600 space-y-0.5 marker:text-slate-400">
                <li>Custom fields help you capture department specific information.</li>
                <li>Changes may reflect in forms and reports where this department is used.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (22%) */}
        <div className="flex flex-col gap-2 w-full xl:w-[22%]">

          {/* Card 1: Field Summary */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-2">Field Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <LayoutList className="w-3 h-3 text-indigo-600" />
                  <span className="text-[14px] font-bold text-slate-900 leading-none">7</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Total Fields</span>
              </div>
              <div className="flex flex-col p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-[14px] font-bold text-slate-900 leading-none">5</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Active Fields</span>
              </div>
              <div className="flex flex-col p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-3 h-3 text-amber-500" />
                  <span className="text-[14px] font-bold text-slate-900 leading-none">1</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Draft Fields</span>
              </div>
              <div className="flex flex-col p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Settings className="w-3 h-3 text-rose-500" />
                  <span className="text-[14px] font-bold text-slate-900 leading-none">1</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Mandatory Fields</span>
              </div>
            </div>
          </div>

          {/* Card 2: Field Groups */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-2">Field Groups</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-100">
                    <Building2 className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Department Info</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">4</span>
              </div>
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Business Info</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">1</span>
              </div>
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <DollarSign className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Finance Info</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">1</span>
              </div>
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Compliance</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">1</span>
              </div>
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100">
                    <ClipboardList className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">Review Info</span>
                </div>
                <span className="text-[11px] font-bold text-slate-900">1</span>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left">
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Add Custom Field</span>
              </button>
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left">
                <LayoutList className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Field Groups</span>
              </button>
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left">
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Import Fields</span>
              </button>
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left">
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Export Fields</span>
              </button>
              <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-bold">Field Usage Report</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
