'use client';
import React from 'react';
import {
  ChevronRight, ArrowLeft, Plus, Building2, Users, GitBranch, Calendar,
  Eye, Pencil, Trash2, CheckCircle2, Check, FileText, BarChart3,
  Download, Upload, Info, Layers, Briefcase, FileSignature, Map
} from 'lucide-react';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Details', 'Business Mapping'];

export default function BusinessMappingPage() {
  const tabs = ['Business Mapping', 'Mapped Overview', 'Mapping History'];

  const kpiData = [
    { label: 'Business Units', val: '2', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-500' },
    { label: 'Cost Centers', val: '2', icon: Map, bg: 'bg-emerald-50', color: 'text-emerald-500' },
    { label: 'Projects', val: '5', icon: Briefcase, bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: 'Processes', val: '6', icon: GitBranch, bg: 'bg-purple-50', color: 'text-purple-500' },
    { label: 'Services / Offerings', val: '4', icon: Layers, bg: 'bg-sky-50', color: 'text-sky-500' },
  ];

  const quickActions = [
    { title: 'View Mapping Report', icon: FileText },
    { title: 'Export Mapping Data', icon: Download },
    { title: 'Add Bulk Mapping', icon: Upload },
    { title: 'Mapping Guidelines', icon: FileSignature },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800">

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-2 flex-wrap">
            {BREADCRUMB.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i === BREADCRUMB.length - 1 ? (
                  <span className="text-blue-600 font-semibold">{crumb}</span>
                ) : (
                  <span className="cursor-pointer hover:text-slate-700">{crumb}</span>
                )}
                {i < BREADCRUMB.length - 1 && <ChevronRight className="w-3 h-3" />}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Business Mapping</h1>
          <p className="text-[11px] text-slate-500">Map this department with business units, cost centers, projects and processes to define its role in the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Department Details
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 border border-blue-600 text-white rounded-md text-[11px] font-medium hover:bg-blue-700 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Mapping
          </button>
        </div>
      </div>

      {/* Department Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm mb-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Department Info */}
          <div className="flex items-start gap-3 min-w-[200px]">
            <span className="w-11 h-11 flex items-center justify-center shrink-0 rounded-full bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5 font-medium">Department</p>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-[14px] font-bold text-slate-900">Interior Design</h2>
                <span className="inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100">Active</span>
              </div>
              <p className="text-[11px] text-slate-600">Department Code: <span className="font-semibold text-slate-800">INT-DSN</span></p>
              <p className="text-[11px] text-slate-600">Parent Department: <span className="font-semibold text-slate-800">Design & Build</span></p>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

          {/* Department Head */}
          <div className="flex items-center gap-3 min-w-[150px]">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar" className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100 shadow-sm" />
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5 font-medium">Department Head</p>
              <p className="text-[13px] font-bold text-slate-900">Rahul Nair</p>
              <p className="text-[11px] text-slate-500">Manager</p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

          {/* Total Employees */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <span className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-purple-50 text-purple-600 border border-purple-100/50">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5 font-medium">Total Employees</p>
              <p className="text-[14px] font-bold text-slate-900">12</p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

          {/* Business Unit */}
          <div className="flex items-center gap-3 min-w-[150px]">
            <span className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <GitBranch className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5 font-medium">Business Unit</p>
              <p className="text-[13px] font-bold text-slate-900">Design House India</p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

          {/* Created On */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <span className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full bg-slate-50 text-slate-600 border border-slate-200/50">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5 font-medium">Created On</p>
              <p className="text-[13px] font-bold text-slate-900">15 May 2025</p>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2">
        <div className="flex flex-col min-w-0">

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-2 px-1">
            {tabs.map((t, i) => (
              <button key={t} className={`pb-2.5 text-[12.5px] font-semibold border-b-2 transition-colors ${i === 0 ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
            {kpiData.map(d => (
              <div key={d.label} className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 shadow-sm min-h-[90px]">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${d.bg} ${d.color}`}>
                  <d.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500">{d.label}</p>
                  <p className="text-[18px] font-bold text-slate-900 leading-tight">{d.val}</p>
                  <p className="text-[9.5px] text-slate-400">Mapped</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mapping Details */}
          <div className="space-y-2">
            <h3 className="text-[13px] font-bold text-slate-900 mb-1.5 ml-0.5">Business Mapping Details</h3>

            {/* Table 1: Business Units */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-100/60 text-blue-600">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[12.5px] font-bold text-slate-800">1. Business Units</span>
                </div>
                <button className="flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Business Unit Mapping
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Business Unit</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Code</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Description</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500 text-center">Primary</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Effective From</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">Design & Build</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">BU-DB</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500 truncate max-w-[200px]">End-to-end design and build solutions</td>
                      <td className="px-1.5 py-2.5 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">15 May 2025</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">Projects & Execution</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">BU-PE</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500 truncate max-w-[200px]">Project execution and site management</td>
                      <td className="px-1.5 py-2.5 text-center"><span className="text-slate-300">-</span></td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">15 May 2025</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Cost Centers */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-100/60 text-emerald-600">
                    <Map className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[12.5px] font-bold text-slate-800">2. Cost Centers</span>
                </div>
                <button className="flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Cost Center Mapping
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Cost Center</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Code</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Description</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Budget Owner</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Effective From</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">CC - Design</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">CC-INT-01</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500 truncate max-w-[200px]">Cost center for design activities</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-5 h-5 rounded-full bg-slate-200" alt="" />
                          <span className="text-[11.5px] font-medium text-slate-800">Rahul Nair</span>
                        </div>
                      </td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">15 May 2025</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">CC - Projects</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">CC-INT-02</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500 truncate max-w-[200px]">Cost center for project execution</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <img src="https://i.pravatar.cc/150?img=11" className="w-5 h-5 rounded-full bg-slate-200" alt="" />
                          <span className="text-[11.5px] font-medium text-slate-800">Amit Verma</span>
                        </div>
                      </td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">15 May 2025</td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: Projects */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-orange-100/60 text-orange-600">
                    <Briefcase className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[12.5px] font-bold text-slate-800">3. Projects</span>
                </div>
                <button className="flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Project Mapping
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Project Name</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Code</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Client / Customer</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Type</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Role in Project</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500">Status</th>
                      <th className="px-1.5 py-2.5 text-[10px] font-semibold text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">Corporate Office - Noida</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">PRJ-2501</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">ABC Pvt. Ltd.</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Commercial</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Lead Design</td>
                      <td className="px-1.5 py-2.5"><span className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-600 border border-emerald-100/50">Active</span></td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">Retail Outlet - Gurugram</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">PRJ-2502</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">XYZ Retail</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Retail</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Design & Planning</td>
                      <td className="px-1.5 py-2.5"><span className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-600 border border-emerald-100/50">Active</span></td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-1.5 py-2.5 text-[11.5px] font-semibold text-slate-800">Experience Center - Delhi</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">PRJ-2503</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">LMN Group</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Commercial</td>
                      <td className="px-1.5 py-2.5 text-[11.5px] text-slate-500">Interior Consultant</td>
                      <td className="px-1.5 py-2.5"><span className="inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-600 border border-amber-100/50">In Progress</span></td>
                      <td className="px-1.5 py-2.5">
                        <div className="flex items-center justify-center gap-2">
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-blue-600 hover:bg-blue-50 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button className="grid h-6 w-6 place-items-center rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-2 border-t border-slate-100 flex justify-center bg-slate-50/30">
                <button className="text-[11.5px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-4 py-1.5 rounded-md transition-colors">
                  View All Projects (5)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col h-full min-w-0 pt-8 gap-2">

          {/* Department Role Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <h3 className="text-[13px] font-semibold text-slate-900">Department Role in Business</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                'Provides interior design solutions for corporate and retail projects',
                'Collaborates with project execution for delivery',
                'Supports business growth through innovative designs',
                'Ensures quality and cost-effective solutions'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-[2px]" />
                  <span className="text-[11.5px] text-slate-600 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapping Health Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-[13px] font-semibold text-slate-900">Mapping Health</h3>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative shrink-0 w-24 h-24">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="172 251.3" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="40 251.3" strokeDashoffset="-172" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="26 251.3" strokeDashoffset="-212" strokeLinecap="round" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="13 251.3" strokeDashoffset="-238" strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center mt-1">
                    <p className="text-[20px] font-bold text-slate-900 leading-none">19</p>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Total<br />Mappings</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="font-semibold text-slate-800">Active</span></div>
                  <span className="text-slate-500">13 (68.42%)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="font-semibold text-slate-800">In Progress</span></div>
                  <span className="text-slate-500">3 (15.79%)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="font-semibold text-slate-800">Pending</span></div>
                  <span className="text-slate-500">2 (10.53%)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="font-semibold text-slate-800">Inactive</span></div>
                  <span className="text-slate-500">1 (5.26%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              {quickActions.map(a => (
                <button key={a.title} className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-2.5">
                    <span className="text-blue-600 bg-blue-50 p-1.5 rounded-md"><a.icon className="w-3.5 h-3.5" /></span>
                    <span className="text-[11.5px] font-medium text-slate-700 group-hover:text-slate-900">{a.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Note Card */}
          <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 shadow-sm p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <h3 className="text-[12px] font-semibold text-amber-900">Note</h3>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              Business mapping helps in budget allocation, reporting, performance tracking and decision making.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
