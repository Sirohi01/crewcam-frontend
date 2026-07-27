'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Settings2, RotateCcw, Crown, User, Users, Briefcase, UserCircle, Badge, Square, MoreVertical, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = ['All Designations', 'Active', 'Inactive', 'By Job Grade', 'By Job Family'];

const DESIGNATIONS = [
  { id: 1, name: 'Managing Director', subtitle: 'Overall leadership and strategy', code: 'DES-MD', jg: 'JG-10', family: 'Leadership', emp: 1, vac: 0, status: 'Active', icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50', jgColor: 'text-purple-600 bg-purple-50' },
  { id: 2, name: 'General Manager', subtitle: 'Division operations and management', code: 'DES-GM', jg: 'JG-09', family: 'Management', emp: 4, vac: 1, status: 'Active', icon: User, color: 'text-pink-600', bg: 'bg-pink-50', jgColor: 'text-pink-600 bg-pink-50' },
  { id: 3, name: 'Department Head', subtitle: 'Department planning and execution', code: 'DES-DH', jg: 'JG-08', family: 'Management', emp: 12, vac: 2, status: 'Active', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', jgColor: 'text-blue-600 bg-blue-50' },
  { id: 4, name: 'Senior Manager', subtitle: 'Function management and control', code: 'DES-SM', jg: 'JG-07', family: 'Management', emp: 18, vac: 3, status: 'Active', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', jgColor: 'text-emerald-600 bg-emerald-50' },
  { id: 5, name: 'Manager', subtitle: 'Team management and delivery', code: 'DES-MGR', jg: 'JG-06', family: 'Management', emp: 45, vac: 6, status: 'Active', icon: UserCircle, color: 'text-orange-600', bg: 'bg-orange-50', jgColor: 'text-orange-600 bg-orange-50' },
  { id: 6, name: 'Assistant Manager', subtitle: 'Assist in management activities', code: 'DES-AM', jg: 'JG-05', family: 'Management', emp: 62, vac: 7, status: 'Active', icon: User, color: 'text-teal-600', bg: 'bg-teal-50', jgColor: 'text-teal-600 bg-teal-50' },
  { id: 7, name: 'Senior Executive', subtitle: 'Specialist and key contributor', code: 'DES-SE', jg: 'JG-04', family: 'Professional', emp: 110, vac: 9, status: 'Active', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', jgColor: 'text-indigo-600 bg-indigo-50' },
  { id: 8, name: 'Executive', subtitle: 'Core execution and support', code: 'DES-EXE', jg: 'JG-03', family: 'Professional', emp: 168, vac: 10, status: 'Active', icon: Square, color: 'text-amber-500', bg: 'bg-amber-50', jgColor: 'text-amber-600 bg-amber-50' },
];

export default function DesignationsTable() {
  const [activeTab, setActiveTab] = useState('All Designations');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = DESIGNATIONS.filter(d => {
    const tabMatch = activeTab === 'All Designations' ? true : activeTab === d.status;
    const searchMatch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col min-w-0">
      
      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 pt-2 border-b border-zinc-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 pt-2 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search designations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-[12px] text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-zinc-400"
          />
        </div>
        
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <Filter size={14} /> Filters
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Job Grade <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Job Family <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Status <ChevronDown size={14} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <Settings2 size={14} /> More Filters
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 transition-colors">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-0">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="py-3 pl-4 pr-2 w-10">
                <input 
                  type="checkbox" 
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={(e) => setSelectedIds(e.target.checked ? filtered.map(d => d.id) : [])}
                />
              </th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Designation Name</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Code</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Job Grade</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Job Family</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Employees</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Vacant</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Status</th>
              <th className="py-3 px-4 text-[11px] font-semibold text-zinc-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map(d => (
              <tr key={d.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="py-2.5 pl-4 pr-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedIds.includes(d.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(p => [...p, d.id]);
                      else setSelectedIds(p => p.filter(id => id !== d.id));
                    }}
                  />
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${d.bg} ${d.color}`}>
                      <d.icon size={16} />
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-blue-600 group-hover:underline cursor-pointer">{d.name}</p>
                      <p className="text-[10.5px] text-zinc-500">{d.subtitle}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[12px] font-semibold text-zinc-700">{d.code}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${d.jgColor}`}>
                    {d.jg}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[12px] text-zinc-600">{d.family}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[12px] font-semibold text-zinc-700">{d.emp}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-[12px] font-semibold text-zinc-700">{d.vac}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    d.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="w-7 h-7 rounded hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-100 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div>Showing {filtered.length > 0 ? 1 : 0} to {filtered.length} of 42 designations</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100"><ChevronLeft size={14}/></button>
            <button className="w-6 h-6 rounded flex items-center justify-center bg-blue-600 text-white font-semibold">1</button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 font-medium">2</button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 font-medium">3</button>
            <span className="px-1 text-zinc-400">...</span>
            <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 font-medium">6</button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100"><ChevronRight size={14}/></button>
          </div>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="flex items-center gap-1 font-semibold text-zinc-700 cursor-pointer hover:bg-zinc-50 px-1.5 py-0.5 rounded">
              10 <ChevronDown size={12}/>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
