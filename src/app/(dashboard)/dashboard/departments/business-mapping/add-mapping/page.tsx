'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Building2, Map, Briefcase, GitBranch, Layers,
  ArrowLeft, Save, Trash2, Info, CheckCircle2, Check,
  Calendar, User, Tag, Plus
} from 'lucide-react';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Details', 'Business Mapping', 'Add Mapping'];

export default function AddBusinessMappingPage() {
  const [activeTab, setActiveTab] = useState('Business Units');
  const tabs = [
    { name: 'Business Units', icon: Building2 },
    { name: 'Cost Centers', icon: Map },
    { name: 'Projects', icon: Briefcase },
    { name: 'Processes', icon: GitBranch },
    { name: 'Services / Offerings', icon: Layers },
  ];

  return (
    <div className="flex flex-col gap-2 px-2 pt-2 w-full font-sans text-slate-800">

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
        <div>
          <div className="text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1.5 flex-wrap">
            {BREADCRUMB.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i === BREADCRUMB.length - 1 ? (
                  <span className="text-blue-600 font-bold">{crumb}</span>
                ) : (
                  <span className="hover:text-blue-600 cursor-pointer transition-colors">{crumb}</span>
                )}
                {i < BREADCRUMB.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">Add Business Mapping</h1>
          <p className="text-[12px] text-slate-500 font-medium">Map this sub department with business units, cost centers, projects and processes.</p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-4">
          <Link href="/dashboard/departments/business-mapping" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-bold text-[12px] hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Business Mapping
          </Link>
          <button className="flex items-center gap-1.5 px-6 py-2 bg-[#4f46e5] border border-[#4f46e5] text-white rounded-md font-bold text-[12px] hover:bg-indigo-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Mapping
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-0 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-slate-500">Sub Department</span>
              <span className="text-[10px] font-bold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">INT-DSN</span>
            </div>
            <h2 className="text-[16px] font-bold text-slate-900 leading-tight">Interior Design</h2>
            <p className="text-[11px] text-slate-500 mt-1">Department: <span className="font-semibold text-slate-700">Design & Build</span></p>
            <p className="text-[11px] text-slate-500">Parent Department: <span className="font-semibold text-slate-700">Design & Build</span></p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-10 h-10 rounded-full bg-slate-200 border border-slate-200" alt="" />
            <div>
              <p className="text-[10px] font-bold text-slate-500">Department Head</p>
              <p className="text-[13px] font-bold text-slate-900">Rahul Nair</p>
              <p className="text-[11px] text-slate-500">Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-50 border border-slate-100 text-slate-500">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500">Created On</p>
              <p className="text-[13px] font-bold text-slate-900">15 May 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
              <User size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500">Status</p>
              <span className="inline-block mt-0.5 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-2">

          {/* Card 1: Business Units */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-4">1. Select and Map</h3>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 border-b border-slate-100 px-1">
              {tabs.map((t, i) => (
                <button key={t.name} onClick={() => setActiveTab(t.name)} className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-[11px] font-bold whitespace-nowrap transition-colors ${activeTab === t.name ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  <t.icon size={13} className={activeTab === t.name ? 'text-[#4f46e5]' : 'text-slate-400'} /> {t.name}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Business Units <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-[12px] text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] shadow-sm">
                  <option>Select business units</option>
                </select>
                <button className="flex items-center gap-1 px-4 py-2 border border-[#4f46e5]/30 text-[#4f46e5] rounded-md text-[11.5px] font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                  <Plus size={14} /> Add Business Unit
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[11.5px] font-bold text-slate-800 mb-2">Selected Business Units (2)</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-3 py-2.5 text-[10.5px] font-bold text-slate-600">Business Unit</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Code</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Description</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Primary</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Design & Build</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">BU-DB</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500 truncate max-w-[200px]">End-to-end design and build solutions</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <div className="w-8 h-4 bg-[#4f46e5] rounded-full relative mx-auto cursor-pointer shadow-inner">
                          <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Projects & Execution</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">BU-PE</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500 truncate max-w-[200px]">Project execution and site management</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <div className="w-8 h-4 bg-slate-200 rounded-full relative mx-auto cursor-pointer shadow-inner">
                          <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 2: Cost Centers */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-4">2. Map Cost Centers (Optional)</h3>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Cost Centers</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-[12px] text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 shadow-sm">
                  <option>Select cost centers</option>
                </select>
                <button className="flex items-center gap-1 px-4 py-2 border border-indigo-200 text-indigo-700 rounded-md text-[11.5px] font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                  <Plus size={14} /> Add Cost Center
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[11.5px] font-bold text-slate-800 mb-2">Selected Cost Centers (1)</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Cost Center</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Code</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Description</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Budget Owner</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">CC - Design</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">CC-INT-01</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500 truncate max-w-[150px]">Cost center for design activities</td>
                      <td className="px-1.5 py-2.5 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className="w-5 h-5 rounded-full bg-slate-200" alt="" />
                          <span className="font-bold text-slate-800">Rahul Nair</span>
                        </div>
                      </td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 3: Projects */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-4">3. Map Projects (Optional)</h3>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Projects</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-[12px] text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 shadow-sm">
                  <option>Select projects</option>
                </select>
                <button className="flex items-center gap-1 px-4 py-2 border border-indigo-200 text-indigo-700 rounded-md text-[11.5px] font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[11.5px] font-bold text-slate-800 mb-2">Selected Projects (1)</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Project Name</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Code</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Client / Customer</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Role in Project</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Corporate Office - Noida</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">PRJ-2501</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">ABC Pvt. Ltd.</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">Lead Design</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-2">

          {/* Card 4: Processes */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-4">4. Map Processes (Optional)</h3>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Processes</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-[12px] text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 shadow-sm">
                  <option>Select processes</option>
                </select>
                <button className="flex items-center gap-1 px-4 py-2 border border-indigo-200 text-indigo-700 rounded-md text-[11.5px] font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                  <Plus size={14} /> Add Process
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[11.5px] font-bold text-slate-800 mb-2">Selected Processes (2)</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Process Name</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Code</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Description</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Design Planning</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">PRC-001</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">Space planning and concept development</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Design Execution</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">PRC-002</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">Detailed design and execution</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Card 5: Services / Offerings */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-4">5. Map Services / Offerings (Optional)</h3>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Services / Offerings</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-[12px] text-slate-500 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 shadow-sm">
                  <option>Select services or offerings</option>
                </select>
                <button className="flex items-center gap-1 px-4 py-2 border border-indigo-200 text-indigo-700 rounded-md text-[11.5px] font-bold hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                  <Plus size={14} /> Add Service
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[11.5px] font-bold text-slate-800 mb-2">Selected Services / Offerings (1)</h4>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse bg-white whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Service / Offering</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Code</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600">Description</th>
                      <th className="px-1.5 py-2.5 text-[10.5px] font-bold text-slate-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-1.5 py-2.5 text-[11px] font-bold text-slate-800">Interior Design Solutions</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500">SRV-INT-01</td>
                      <td className="px-1.5 py-2.5 text-[11px] text-slate-500 truncate max-w-[200px]">Custom interior design solutions</td>
                      <td className="px-1.5 py-2.5 text-center">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mapping Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 mb-4">Mapping Summary</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center"><Building2 size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Business Units</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-tight mt-0.5">2</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><Map size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Cost Centers</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-tight mt-0.5">1</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-orange-50 text-orange-600 flex items-center justify-center"><Briefcase size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Projects</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-tight mt-0.5">1</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center"><GitBranch size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Processes</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-tight mt-0.5">2</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-sky-50 text-sky-600 flex items-center justify-center"><Layers size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">Services / Offerings</p>
                  <p className="text-[15px] font-bold text-slate-900 leading-tight mt-0.5">1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Note Card */}
          <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 shadow-sm p-4 mt-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <h3 className="text-[12.5px] font-bold text-amber-900">Note</h3>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-relaxed font-medium">
              Business mapping defines how this sub department is connected with different business elements.<br />
              You can edit or remove mappings anytime.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 mb-8">
            <Link href="/dashboard/departments/business-mapping" className="px-5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-md font-bold text-[12px] transition-colors shadow-sm">
              Cancel
            </Link>
            <button className="flex items-center gap-1.5 px-6 py-2 bg-[#4f46e5] border border-[#4f46e5] text-white rounded-md font-bold text-[12px] hover:bg-indigo-700 transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Save Mapping
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
