'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Download, Edit2, Search, Share2, Filter,
  RotateCcw, Building, Users, Clock, AlignLeft, RefreshCcw,
  MoreVertical, Plus, ChevronDown
} from 'lucide-react';

const topCards = [
  { title: 'Business Units', value: '4', subtitle: 'Active', icon: Building, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Divisions', value: '7', subtitle: 'Active', icon: Share2, color: 'text-purple-500', bg: 'bg-purple-50' },
  { title: 'Departments', value: '28', subtitle: 'Active', icon: Building, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Sub Departments', value: '56', subtitle: 'Active', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Total Employees', value: '532', subtitle: 'Active', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
];

const treeData = [
  { name: 'Design House India Pvt. Ltd.', type: 'Organization', emp: 532, cost: 12, level: 0 },
  { name: 'Retail Interiors', type: 'Business Unit', emp: 186, cost: 4, level: 1 },
  { name: 'Design & Planning', type: 'Division', emp: 72, cost: 2, level: 2 },
  { name: 'Design Studio', type: 'Department', emp: 28, cost: 1, level: 3 },
  { name: '3D Visualization Team', type: 'Sub Department', emp: 12, cost: 1, level: 4 },
  { name: 'Space Planning Team', type: 'Sub Department', emp: 10, cost: 1, level: 4 },
  { name: 'Creative Team', type: 'Sub Department', emp: 11, cost: 1, level: 4 },
  { name: 'Design Support Team', type: 'Sub Department', emp: 9, cost: 1, level: 4 },
  { name: 'Project Planning', type: 'Department', emp: 44, cost: 1, level: 3 },
  { name: 'Site Execution', type: 'Department', emp: 64, cost: 2, level: 3 },
  { name: 'Display Solutions', type: 'Business Unit', emp: 132, cost: 3, level: 1 },
  { name: 'Events & Exhibitions', type: 'Business Unit', emp: 118, cost: 3, level: 1 },
  { name: 'Corporate Services', type: 'Business Unit', emp: 96, cost: 2, level: 1 },
];

const typeStyles: Record<string, string> = {
  'Organization': 'bg-blue-100 text-blue-700',
  'Business Unit': 'bg-emerald-100 text-emerald-700',
  'Division': 'bg-purple-100 text-purple-700',
  'Department': 'bg-orange-100 text-orange-700',
  'Sub Department': 'bg-blue-50 text-blue-600',
};

const typeLabels: Record<string, string> = {
  'Organization': 'DH',
  'Business Unit': 'BU',
  'Division': 'DIV',
  'Department': 'DEPT',
  'Sub Department': 'SUB',
};

const legendItems = [
  { type: 'Organization', desc: 'Highest level (Company)' },
  { type: 'Business Unit', desc: 'Major business vertical' },
  { type: 'Division', desc: 'Department group under BU' },
  { type: 'Department', desc: 'Functional department' },
  { type: 'Sub Department', desc: 'Team / sub functional unit' },
];

export default function DepartmentStructurePage() {
  const [activeView, setActiveView] = useState('Tree View');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = treeData.filter(node =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-2">
            <span className="cursor-pointer hover:text-slate-700">Organization Setup</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-slate-700">Departments</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold cursor-pointer">Department Structure</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Department Structure</h1>
          <p className="text-[11px] text-slate-500">Visualize the full hierarchy of your organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/departments" className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            &larr; Back to Departments
          </Link>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export Structure <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 border border-blue-600 text-white rounded-md text-[11px] font-medium hover:bg-blue-700 shadow-sm transition-colors">
            <Edit2 className="w-4 h-4" /> Edit Structure
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mb-1">
        {topCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center gap-3 shadow-sm min-h-[90px]">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col pt-0.5">
              <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">{card.title}</h3>
              <span className="text-xl font-bold text-slate-900 leading-none">{card.value}</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-2 items-start">

        {/* LEFT SECTION */}
        <div className="flex flex-col gap-1 min-w-0">

          <div className="bg-white border border-slate-100 rounded-lg shadow-sm flex flex-col min-w-0">

            {/* HEADER & CONTROLS */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">Organization Hierarchy</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input type="text" placeholder="Search in structure..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium w-48 focus:outline-none focus:border-blue-400 transition-colors" />
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button onClick={() => setActiveView('Tree View')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors ${activeView === 'Tree View' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Share2 className="w-3.5 h-3.5" /> Tree View
                  </button>
                  <button onClick={() => setActiveView('List View')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors ${activeView === 'List View' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    <AlignLeft className="w-3.5 h-3.5" /> List View
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-[1fr_120px_100px_100px_60px] gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="text-[11px] font-bold text-slate-600">Organization / Department</div>
              <div className="text-[11px] font-bold text-slate-600">Type</div>
              <div className="text-[11px] font-bold text-slate-600 text-center">Employees</div>
              <div className="text-[11px] font-bold text-slate-600 text-center">Cost Centers</div>
              <div className="text-[11px] font-bold text-slate-600 text-center">Actions</div>
            </div>

            {/* TABLE BODY */}
            <div className="flex flex-col py-2 px-1 relative overflow-hidden min-h-[400px]">
              {filteredData.length === 0 && (
                <div className="flex items-center justify-center h-48 text-[12px] font-medium text-slate-500">
                  No departments found matching your search.
                </div>
              )}
              {filteredData.map((node, i) => {
                const isTreeView = activeView === 'Tree View';
                const paddingLeft = isTreeView ? (node.level * 32 + 16) : 16;
                return (
                  <div key={i} className="grid grid-cols-[1fr_120px_100px_100px_60px] gap-4 items-center px-4 py-2 hover:bg-slate-50 transition-colors relative group">

                    {/* Tree Lines (Simplified approximation) */}
                    {isTreeView && node.level > 0 && (
                      <div className="absolute top-0 bottom-0 border-l border-slate-200 z-0" style={{ left: `${(node.level - 1) * 32 + 22}px` }}></div>
                    )}
                    {isTreeView && node.level > 0 && (
                      <div className="absolute top-1/2 h-px border-t border-slate-200 z-0" style={{ left: `${(node.level - 1) * 32 + 22}px`, width: '12px' }}></div>
                    )}

                    {/* Column 1: Name */}
                    <div className="flex items-center gap-2 relative z-10" style={{ paddingLeft: `${paddingLeft}px` }}>
                      {isTreeView && node.level < 4 && (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-700 shrink-0" />
                      )}
                      {isTreeView && node.level === 4 && <div className="w-3.5 shrink-0" />}
                      <div className={`w-7 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${typeStyles[node.type]}`}>
                        {typeLabels[node.type]}
                      </div>
                      <span className={`text-[12px] truncate ${node.level === 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                        {node.name}
                      </span>
                    </div>

                    {/* Column 2: Type */}
                    <div className="flex items-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${typeStyles[node.type]}`}>
                        {node.type}
                      </span>
                    </div>

                    {/* Column 3: Employees */}
                    <div className="text-[12px] font-bold text-slate-700 text-center">{node.emp}</div>

                    {/* Column 4: Cost Centers */}
                    <div className="text-[12px] font-bold text-slate-700 text-center">{node.cost}</div>

                    {/* Column 5: Actions */}
                    <div className="flex justify-center">
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM LEGEND & FOOTER */}
            <div className="mt-auto border-t border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {legendItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-4 h-3 rounded flex items-center justify-center text-[7px] font-bold ${typeStyles[item.type]}`}>
                      <Share2 className="w-2 h-2 opacity-50 hidden" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{item.type}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                Last updated on 20 May 2025, 11:20 AM <RefreshCcw className="w-3 h-3 cursor-pointer hover:text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="min-w-0">
          <div className="flex flex-col gap-2">

            {/* Card 1: Structure Summary */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="text-[14px] font-bold text-slate-900 mb-2">Structure Summary</h3>
              <div className="flex flex-col gap-2.5 mb-2">
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Levels in Hierarchy</span>
                  <span className="font-bold text-slate-900">{Math.max(...treeData.map(n => n.level)) + 1}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Total Business Units</span>
                  <span className="font-bold text-slate-900">{treeData.filter(n => n.type === 'Business Unit').length}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Total Divisions</span>
                  <span className="font-bold text-slate-900">{treeData.filter(n => n.type === 'Division').length}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Total Departments</span>
                  <span className="font-bold text-slate-900">{treeData.filter(n => n.type === 'Department').length}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Total Sub Departments</span>
                  <span className="font-bold text-slate-900">{treeData.filter(n => n.type === 'Sub Department').length}</span>
                </div>
                <div className="flex items-center text-[11px]">
                  <span className="font-semibold text-slate-600 w-36">Total Cost Centers</span>
                  <span className="font-bold text-slate-900">{treeData[0]?.cost || 0}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
                  <Clock className="w-3.5 h-3.5" /> Last Modified
                </div>
                <p className="text-[11px] font-semibold text-slate-700 pl-5">20 May 2025, 11:20 AM</p>
                <p className="text-[10px] font-medium text-slate-500 pl-5">by Vijay Sharma (Super Admin)</p>
              </div>
            </div>

            {/* Card 2: Legend */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="text-[14px] font-bold text-slate-900 mb-2">Legend</h3>
              <div className="flex flex-col gap-3">
                {legendItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-[115px_1fr] items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${typeStyles[item.type]}`}>
                        {typeLabels[item.type]}
                      </div>
                      <span className="text-[10px] font-bold text-slate-900 whitespace-nowrap">{item.type}</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="text-[14px] font-bold text-slate-900 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button className="flex items-center gap-1.5 justify-center py-2 border border-slate-200 rounded-lg text-[10.5px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Business Unit
                </button>
                <button className="flex items-center gap-1.5 justify-center py-2 border border-slate-200 rounded-lg text-[10.5px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Division
                </button>
                <button className="flex items-center gap-1.5 justify-center py-2 border border-slate-200 rounded-lg text-[10.5px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Department
                </button>
                <button className="flex items-center gap-1.5 justify-center py-2 border border-slate-200 rounded-lg text-[10.5px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Sub Department
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reorder / Rearrange Structure
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
