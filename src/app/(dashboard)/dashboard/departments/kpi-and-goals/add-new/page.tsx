'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ArrowLeft, Target, Eye, BookOpen, Copy, Info, Trash2,
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Goal, Activity, Plus, BarChart2
} from 'lucide-react';

const BREADCRUMB = ['Performance Management', 'KPIs & Goals', 'KPI Management', 'Add New KPI & Goal'];

export default function AddNewKPIPage() {
  const [goals, setGoals] = useState([{ id: 1 }, { id: 2 }]);

  const addGoal = () => setGoals([...goals, { id: goals.length + 1 }]);
  const removeGoal = (id: number) => setGoals(goals.filter(g => g.id !== id));

  return (
    <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800 bg-slate-100 min-h-screen overflow-x-hidden">

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
        <div>
          <div className="text-[10px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1 flex-wrap">
            {BREADCRUMB.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i === BREADCRUMB.length - 1 ? (
                  <span className="text-slate-900 font-bold">{crumb}</span>
                ) : (
                  <Link href="/dashboard/departments/kpi-and-goals" className="cursor-pointer hover:text-slate-700">{crumb}</Link>
                )}
                {i < BREADCRUMB.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-400" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <Goal className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[18px] font-bold text-slate-900 leading-tight">Add New KPI and Goal</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Define a new KPI and set measurable goals aligned with organizational objectives.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Link href="/dashboard/departments/kpi-and-goals" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to KPI & Goals
          </Link>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 text-white rounded-md text-[11px] font-bold hover:bg-indigo-800 transition-colors shadow-sm">
            Save KPI & Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2">
        {/* Left Column: Forms */}
        <div className="flex flex-col min-w-0 gap-2">

          {/* 1. KPI Information */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md">
            <h2 className="text-[14px] font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-200">1. KPI Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">KPI Title <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" placeholder="Enter KPI title" className="w-full border border-slate-300 bg-slate-50 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 placeholder-slate-400" />
                  <span className="absolute right-2 top-1.5 text-[10px] text-slate-400">0/150</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">KPI Code <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Auto-generated" disabled className="w-full border border-slate-300 bg-slate-100 rounded-md px-3 py-1.5 text-[12px] focus:outline-none placeholder-slate-500 cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">KPI Type <span className="text-red-500">*</span> <Info className="w-3 h-3 text-slate-400" /></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select KPI Type</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Category</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Perspective <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Perspective</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Weightage <span className="text-red-500">*</span> (%)</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="0" className="w-20 border border-slate-300 bg-slate-50 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 placeholder-slate-400" />
                  <span className="text-[10px] text-slate-500">% (Total must be 100%)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Description <span className="text-red-500">*</span></label>
              <div className="border border-slate-300 rounded-md overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-slate-100">
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Bold className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Italic className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><Underline className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><List className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><ListOrdered className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <button className="p-1 hover:bg-slate-200 rounded text-slate-700"><LinkIcon className="w-3.5 h-3.5" /></button>
                </div>
                <div className="relative">
                  <textarea rows={3} placeholder="Enter KPI description..." className="w-full px-3 py-2 text-[12px] focus:outline-none resize-none placeholder-slate-400" />
                  <span className="absolute right-2 bottom-2 text-[10px] text-slate-400">0/1000</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Goal Details */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md overflow-hidden">
            <h2 className="text-[14px] font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-200">2. Goal Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Measurement Unit <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Unit</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Target Type <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Target Type</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">Target is Higher Better?</label>
                <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5 w-fit">
                  <button className="px-4 py-1 text-[11px] font-bold bg-indigo-700 text-white rounded shadow-sm">Yes</button>
                  <button className="px-4 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 rounded transition-colors">No</button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Goal Period <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" value="FY 2025-26" readOnly className="w-full border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-[12px] focus:outline-none font-medium text-slate-900 bg-slate-50" />
                  <div className="absolute left-2.5 top-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Table */}
            <div className="w-full overflow-x-auto mb-3">
              <table className="w-full text-left whitespace-nowrap min-w-[700px] border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 w-8 border-b border-slate-300">#</th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 border-b border-slate-300">Goal Name / Description</th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 w-28 border-b border-slate-300">Target Value <Info className="inline w-3 h-3 text-indigo-400 ml-0.5" /></th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 w-28 border-b border-slate-300">Minimum Threshold <Info className="inline w-3 h-3 text-indigo-400 ml-0.5" /></th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 w-28 border-b border-slate-300">Maximum Threshold</th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 w-24 border-b border-slate-300">Weightage (%)</th>
                    <th className="px-2 py-2.5 text-[10px] font-extrabold text-slate-600 text-center w-12 border-b border-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((g, index) => (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-2 py-3 text-[12px] font-bold text-slate-900">{index + 1}</td>
                      <td className="px-2 py-3"><input type="text" placeholder="Enter goal name or description" className="w-full border border-slate-300 bg-slate-50 rounded text-[11px] px-2 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-400" /></td>
                      <td className="px-2 py-3"><input type="text" placeholder="0" className="w-full border border-slate-300 bg-slate-50 rounded text-[11px] px-2 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-400" /></td>
                      <td className="px-2 py-3"><input type="text" placeholder="0" className="w-full border border-slate-300 bg-slate-50 rounded text-[11px] px-2 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-400" /></td>
                      <td className="px-2 py-3"><input type="text" placeholder="0" className="w-full border border-slate-300 bg-slate-50 rounded text-[11px] px-2 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-400" /></td>
                      <td className="px-2 py-3"><input type="text" placeholder="0" className="w-full border border-slate-300 bg-slate-50 rounded text-[11px] px-2 py-1.5 focus:outline-none focus:border-indigo-500 placeholder-slate-400" /></td>
                      <td className="px-2 py-3 text-center"><button onClick={() => removeGoal(g.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={addGoal} className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 transition-colors mb-4 px-2 py-1 rounded-md hover:bg-indigo-50 w-fit">
              <Plus className="w-3.5 h-3.5" /> Add Another Goal
            </button>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-md p-3 flex flex-col md:flex-row md:items-center gap-4 text-[10.5px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span><span className="font-bold text-slate-700">Minimum Threshold:</span> Minimum acceptable performance level.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-indigo-600"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span><span className="font-bold text-slate-700">Maximum Threshold:</span> Outstanding performance level.</span>
              </div>
            </div>
          </div>

          {/* 3. Alignment */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md mb-1">
            <h2 className="text-[14px] font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-200">3. Alignment</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Aligned With <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Alignment</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Alignment Details</label>
                <div className="relative">
                  <input type="text" placeholder="Enter alignment details (optional)" className="w-full border border-slate-300 bg-slate-50 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 placeholder-slate-400" />
                  <span className="absolute right-2 top-1.5 text-[9px] text-slate-400">0/250</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Assigned To <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>Select Employee / Team</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Department</label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none">
                  <option>All Departments</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-3.5 h-3.5 border border-slate-300 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
              <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1 cursor-pointer">
                Cascaded KPI (Rolls down to team/individuals) <Info className="w-3 h-3 text-slate-400" />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Sidebar */}
        <div className="flex flex-col gap-2 h-full">

          {/* KPI Preview */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-slate-900">KPI Preview</h3>
              <button className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
                <Eye className="w-3 h-3" /> Preview
              </button>
            </div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">KPI Title</span>
                <span className="text-[11px] font-bold text-slate-900">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">KPI Code</span>
                <span className="text-[11px] font-bold text-slate-900">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">Category</span>
                <span className="text-[11px] font-bold text-slate-900">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">Type</span>
                <span className="text-[11px] font-bold text-slate-900">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">Weightage</span>
                <span className="text-[11px] font-bold text-slate-900">0%</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">Perspective</span>
                <span className="text-[11px] font-bold text-slate-900">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2 mt-4 pt-4 border-t border-slate-200">
                <span className="text-[11px] text-slate-500 font-bold">Added By</span>
                <span className="text-[11px] font-bold text-slate-900">Vijay Sharma</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-[11px] text-slate-500 font-bold">Date</span>
                <span className="text-[11px] font-bold text-slate-900">21 May 2025</span>
              </div>
            </div>
          </div>

          {/* KPI Type Cards */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3">KPI Type</h3>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              <button className="flex flex-col items-center gap-1.5 p-2 rounded border border-indigo-200 bg-indigo-50/50 text-indigo-700 transition-colors hover:bg-indigo-50 text-center">
                <Target className="w-4 h-4" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold leading-tight">Leading</span>
                  <span className="text-[7.5px] leading-tight text-center opacity-80 mt-1">Focus on drivers of future performance</span>
                </div>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 rounded border border-slate-300 hover:border-slate-400 text-slate-700 transition-colors text-center">
                <BarChart2 className="w-4 h-4" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold leading-tight">Lagging</span>
                  <span className="text-[7.5px] leading-tight text-center text-slate-500 mt-1">Focus on results of past performance</span>
                </div>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 rounded border border-slate-300 hover:border-slate-400 text-slate-700 transition-colors text-center">
                <Target className="w-4 h-4" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold leading-tight">Outcome</span>
                  <span className="text-[7.5px] leading-tight text-center text-slate-500 mt-1">Focus on impact and outcomes</span>
                </div>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-2 rounded border border-slate-300 hover:border-slate-400 text-slate-700 transition-colors text-center">
                <Activity className="w-4 h-4" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold leading-tight">Activity</span>
                  <span className="text-[7.5px] leading-tight text-center text-slate-500 mt-1">Focus on key activities</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-slate-700">Category</label>
                <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-[11px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none text-slate-700 font-medium">
                  <option>Select Category</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-slate-700 flex items-center gap-1">Perspective <Info className="w-3 h-3 text-slate-400" /></label>
                <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-[11px] focus:outline-none focus:border-indigo-500 bg-slate-50 appearance-none text-slate-700 font-medium">
                  <option>Select Perspective</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md flex flex-col flex-1">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2 ">
              <button className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-bold text-slate-800">Choose from KPI Library</span>
                  <span className="text-[10px] font-medium text-slate-500">Select from predefined KPIs</span>
                </div>
              </button>

              <button className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-bold text-slate-800">Copy from Existing KPI</span>
                  <span className="text-[10px] font-medium text-slate-500">Duplicate and customize</span>
                </div>
              </button>

              <button className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100">
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11.5px] font-bold text-slate-800">KPI Guidelines</span>
                  <span className="text-[10px] font-medium text-slate-500">Best practices for KPIs</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-3 bg-white border border-slate-300 rounded-lg shadow-md   mb-2">
        <button className="px-5 py-2 border border-slate-300 bg-white rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors">
          Cancel
        </button>
        <button className="flex items-center gap-1.5 px-5 py-2 bg-indigo-700 text-white rounded-md text-[11px] font-bold hover:bg-indigo-800 transition-colors shadow-sm">
          <Goal className="w-3.5 h-3.5" /> Save KPI & Goal
        </button>
      </div>

    </div>
  );
}
