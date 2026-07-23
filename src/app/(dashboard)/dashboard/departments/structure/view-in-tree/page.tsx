'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Download, Edit2, Search, Share2,
  Building, Users, Clock, AlignLeft,
  Plus, Maximize, Minus, User, MapPin, Map
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const topCards = [
  { title: 'Total Employees', value: '532', subtitle: 'Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Total Departments', value: '28', subtitle: 'Active', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { title: 'Total Sub Departments', value: '56', subtitle: 'Active', icon: Share2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { title: 'Total Cost Centers', value: '12', subtitle: 'Mapped', icon: Building, color: 'text-orange-600', bg: 'bg-orange-50' },
  { title: 'Total Business Units', value: '4', subtitle: 'Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
];

const typeStyles: Record<string, string> = {
  'Organization': 'bg-blue-600 text-white',
  'Business Unit': 'bg-emerald-400 text-white',
  'Division': 'bg-purple-300 text-purple-900',
  'Department': 'bg-orange-300 text-orange-900',
  'Sub Department': 'bg-blue-300 text-blue-900',
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

const budgetData = [
  { name: 'Allocated', value: 620000, color: '#3b82f6', percentage: '73.81%' },
  { name: 'Utilized', value: 510000, color: '#22c55e', percentage: '60.71%' },
  { name: 'Available', value: 330000, color: '#f59e0b', percentage: '39.29%' },
];

const orgData = {
  name: 'Design House India Pvt. Ltd.',
  type: 'Organization',
  emp: 532,
  cost: '12 Cost Centers',
  children: [
    {
      name: 'Retail Interiors',
      type: 'Business Unit',
      emp: 186,
      cost: '4 Cost Centers',
      children: [
        {
          name: 'Design & Planning',
          type: 'Division',
          emp: 72,
          cost: '2 Cost Centers',
          children: [
            {
              name: 'Design Studio',
              type: 'Department',
              emp: 28,
              cost: '1 Cost Center',
              isSelected: true,
              children: [
                { name: '3D Visualization Team', type: 'Sub Department', emp: 12, cost: 'CC-DS-3D01' },
                { name: 'Space Planning Team', type: 'Sub Department', emp: 10, cost: 'CC-DS-3D02' },
                { name: 'Creative Team', type: 'Sub Department', emp: 11, cost: 'CC-DS-3D03' },
                { name: 'Design Support Team', type: 'Sub Department', emp: 9, cost: 'CC-DS-3D04' },
              ]
            },
            { name: 'Project Planning', type: 'Department', emp: 44, cost: '1 Cost Center' },
            { name: 'Site Execution', type: 'Department', emp: 64, cost: '2 Cost Centers' }
          ]
        }
      ]
    },
    { name: 'Display Solutions', type: 'Business Unit', emp: 132, cost: '3 Cost Centers' },
    { name: 'Events & Exhibitions', type: 'Business Unit', emp: 118, cost: '3 Cost Centers' },
    {
      name: 'Corporate Services',
      type: 'Business Unit',
      emp: 96,
      cost: '2 Cost Centers',
      layout: 'vertical',
      children: [
        { name: 'HR & Admin', type: 'Department', emp: 32, cost: '1 Cost Center' },
        { name: 'Finance & Accounts', type: 'Department', emp: 28, cost: '1 Cost Center' },
        { name: 'IT & Systems', type: 'Department', emp: 18, cost: '1 Cost Center' },
        { name: 'Legal & Compliance', type: 'Department', emp: 18, cost: '1 Cost Center' }
      ]
    }
  ]
};

const OrgNode = ({ node }: { node: any }) => {
  const isVertical = node.layout === 'vertical';

  return (
    <li className={`relative flex flex-col items-center ${isVertical ? 'pt-4 pb-0 vertical-node' : 'p-4'}`}>
      <div className={`relative bg-white border ${node.isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-50' : 'border-slate-200'} rounded-xl shadow-sm p-3 w-[220px] flex flex-col gap-2 z-10 transition-all hover:border-blue-300 hover:shadow-md cursor-pointer`}>
        <div className="flex items-start gap-2">
          <div className={`w-8 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${typeStyles[node.type]}`}>
            {typeLabels[node.type]}
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className={`text-[12px] font-bold truncate ${node.type === 'Organization' ? 'text-slate-900' : 'text-slate-800'}`}>{node.name}</h4>
            <span className={`text-[9px] font-bold uppercase ${node.type === 'Business Unit' ? 'text-emerald-500' : node.type === 'Division' ? 'text-purple-500' : 'text-blue-500'}`}>{node.type}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 text-[11px] font-semibold text-slate-500">
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {node.emp}</span>
          <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {node.cost}</span>
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <ul className={`relative flex ${isVertical ? 'flex-col items-start pl-[110px] pt-4 vertical-tree' : 'flex-row justify-center pt-4'}`}>
          {isVertical && (
            <div className="absolute top-0 bottom-8 left-[110px] w-px bg-slate-300 -translate-x-px" />
          )}
          {node.children.map((child: any, idx: number) => (
            <React.Fragment key={idx}>
              {isVertical ? (
                <div className="relative pl-6 py-2 w-full flex vertical-node">
                  <div className="absolute left-0 top-1/2 w-6 h-px bg-slate-300 -translate-y-px" />
                  <OrgNode node={child} />
                </div>
              ) : (
                <OrgNode node={child} />
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </li>
  );
};

export default function DepartmentStructurePage() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800 min-h-screen">

      <style dangerouslySetInnerHTML={{
        __html: `
        .org-tree ul:not(.vertical-tree) {
          padding-top: 20px;
          position: relative;
          transition: all 0.5s;
        }
        .org-tree li:not(.vertical-node) {
          float: left;
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 5px 0 5px;
          transition: all 0.5s;
        }
        .org-tree li:not(.vertical-node)::before, .org-tree li:not(.vertical-node)::after {
          content: '';
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 1px solid #cbd5e1;
          width: 50%;
          height: 20px;
        }
        .org-tree li:not(.vertical-node)::after {
          right: auto;
          left: 50%;
          border-left: 1px solid #cbd5e1;
        }
        .org-tree li:not(.vertical-node):only-child::after, .org-tree li:not(.vertical-node):only-child::before {
          display: none;
        }
        .org-tree li:not(.vertical-node):only-child {
          padding-top: 0;
        }
        .org-tree li:not(.vertical-node):first-child::before, .org-tree li:not(.vertical-node):last-child::after {
          border: 0 none;
        }
        .org-tree li:not(.vertical-node):last-child::before {
          border-right: 1px solid #cbd5e1;
          border-radius: 0 5px 0 0;
        }
        .org-tree li:not(.vertical-node):first-child::after {
          border-radius: 5px 0 0 0;
        }
        .org-tree ul:not(.vertical-tree) ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 1px solid #cbd5e1;
          width: 0;
          height: 20px;
          margin-left: -1px;
        }
      `}} />

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-2">
            <span className="cursor-pointer hover:text-slate-700">Organization Setup</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-slate-700">Departments</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-slate-700">Department Structure</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-slate-700">Sub Department Details</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold cursor-pointer">View in Tree</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">View in Tree</h1>
          <p className="text-[11px] text-slate-500">Visual representation of your organization hierarchy.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/departments" className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            &larr; Back to Department
          </Link>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <AlignLeft className="w-4 h-4" /> List View
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 border border-blue-600 text-white rounded-md text-[11px] font-medium hover:bg-blue-700 shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export Tree
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-2">
        {topCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm min-h-[90px]">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{card.title}</h3>
              <span className="text-2xl font-bold text-slate-900 leading-none">{card.value}</span>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">

        {/* LEFT SECTION (Org Tree) */}
        <div className="xl:col-span-9 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative">

          {/* HEADER & CONTROLS */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-[15px] font-bold text-slate-900">Organization Tree</h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-100 bg-blue-50 text-blue-600 rounded-md text-[11px] font-bold hover:bg-blue-100 transition-colors">
                <Minus className="w-3.5 h-3.5" /> Collapse All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-slate-600 rounded-md text-[11px] font-bold hover:bg-slate-50 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Expand All
              </button>
              <div className="relative">
                <input type="text" placeholder="Search in tree..." className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium w-56 focus:outline-none focus:border-blue-400 transition-colors" />
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* TREE CANVAS */}
          <div className="flex-1 overflow-x-auto overflow-y-visible bg-slate-50/30 p-8 relative flex org-tree">
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }} className="pb-16 min-w-max mx-auto">
              <ul className="flex justify-center">
                <OrgNode node={orgData} />
              </ul>
            </div>

          </div>

          {/* Zoom Controls (Fixed relative to left section) */}
          <div className="absolute bottom-6 right-6 flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden p-1 gap-1 z-20">
            <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded">
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 10, 150))} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded">
              <Plus className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded">
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Legend (Fixed relative to left section) */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20 bg-white/80 backdrop-blur border border-slate-200 p-2 rounded-lg shadow-sm">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2">
                <div className={`w-7 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${typeStyles[item.type]}`}>
                  {typeLabels[item.type]}
                </div>
                <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{item.type}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="xl:col-span-3 min-w-0 flex flex-col gap-3 pb-1">

          {/* Selected Department */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 shrink-0">
            <h3 className="text-[14px] font-bold text-slate-900 mb-3">Selected Department</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-7 rounded bg-orange-300 text-orange-900 flex items-center justify-center text-[11px] font-bold shrink-0">
                  DEPT
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate">Design Studio</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded">Active</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                    Department Code: <span className="font-bold text-slate-700">DS-3D</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Parent</span>
                <span className="font-bold text-slate-700">Design & Planning (Division)</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Business Unit</span>
                <span className="font-bold text-slate-700">Retail Interiors</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Cost Center</span>
                <span className="font-bold text-slate-700">CC-DS-3D01</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Manager</span>
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  Neha Sethi
                </span>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Employees</span>
                <span className="font-bold text-slate-700">28</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center text-[11px]">
                <span className="font-semibold text-slate-500">Sub Departments</span>
                <span className="font-bold text-slate-700">4</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1 w-full">
                View Full Details &rarr;
              </button>
            </div>
          </div>

          {/* Cost Center Summary */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 shrink-0">
            <h3 className="text-[14px] font-bold text-slate-900 mb-4">Cost Center Summary</h3>
            <div className="flex items-center gap-2">
              <div className="w-24 h-24 shrink-0 relative ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[9px] font-bold text-slate-900 leading-none">₹ 8,40,000</span>
                  <span className="text-[7px] font-bold text-slate-500 mt-0.5">Total Budget</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 min-w-0 pl-2">
                {budgetData.map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 pr-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </div>
                    </div>
                    <div className="flex flex-col pl-3.5">
                      <span className="text-[10px] font-bold text-slate-900">₹ {(item.value / 100000).toFixed(2).replace('.', ',')}0,000</span>
                      <span className="text-[9px] font-semibold text-slate-500">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 shrink-0">
            <h3 className="text-[14px] font-bold text-slate-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 justify-start px-2.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap overflow-hidden">
                <Plus className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Add Department</span>
              </button>
              <button className="flex items-center gap-2 justify-start px-2.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap overflow-hidden">
                <Plus className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Add Sub Department</span>
              </button>
              <button className="flex items-center gap-2 justify-start px-2.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap overflow-hidden">
                <Edit2 className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Edit Department</span>
              </button>
              <button className="flex items-center gap-2 justify-start px-2.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap overflow-hidden">
                <Map className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Map Cost Center</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
