'use client';

import React, { useState } from 'react';
import {
  Users, User, BadgeCent, IndianRupee, Search, Filter, Download,
  ChevronDown, MoreVertical, Plus, Upload, Wallet, UserPlus, FolderOpen,
  ChevronRight, ChevronLeft, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// --- Data ---
const TEAM_MEMBERS = [
  { id: 1, name: 'Vivek Rana', email: 'vivek.rana@designhouse.co.in', empId: 'DH1025', designation: 'Sr. 3D Visualizer', grade: 'Grade: G7', experience: '6.2 yrs', doj: '12 Jan 2023', status: 'Active', cost: '₹ 28,000', avatar: 'bg-orange-100 text-orange-600', initials: 'VR' },
  { id: 2, name: 'Neha Sethi', email: 'neha.sethi@designhouse.co.in', empId: 'DH1031', designation: 'Manager - Space Planning', grade: 'Grade: G8', experience: '7.4 yrs', doj: '15 Mar 2022', status: 'Active', cost: '₹ 32,000', avatar: 'bg-emerald-100 text-emerald-600', initials: 'NS' },
  { id: 3, name: 'Amit Kumar', email: 'amit.kumar@designhouse.co.in', empId: 'DH1042', designation: '3D Artist', grade: 'Grade: G6', experience: '4.0 yrs', doj: '01 Aug 2023', status: 'Active', cost: '₹ 20,000', avatar: 'bg-blue-100 text-blue-600', initials: 'AK' },
  { id: 4, name: 'Pooja Bansal', email: 'pooja.bansal@designhouse.co.in', empId: 'DH1056', designation: 'Sr. Executive - Design Support', grade: 'Grade: G5', experience: '3.8 yrs', doj: '10 Apr 2024', status: 'Active', cost: '₹ 18,500', avatar: 'bg-purple-100 text-purple-600', initials: 'PB' },
  { id: 5, name: 'Rohit Sharma', email: 'rohit.sharma@designhouse.co.in', empId: 'DH1063', designation: '3D Visualizer', grade: 'Grade: G6', experience: '3.6 yrs', doj: '05 Jun 2024', status: 'Probation', cost: '₹ 19,000', avatar: 'bg-pink-100 text-pink-600', initials: 'RS' },
  { id: 6, name: 'Ishita Verma', email: 'ishita.verma@designhouse.co.in', empId: 'DH1070', designation: 'Interior Designer', grade: 'Grade: G6', experience: '2.5 yrs', doj: '18 Oct 2024', status: 'Active', cost: '₹ 17,000', avatar: 'bg-teal-100 text-teal-600', initials: 'IV' },
  { id: 7, name: 'Manish Tiwari', email: 'manish.tiwari@designhouse.co.in', empId: 'DH1078', designation: 'CAD Designer', grade: 'Grade: G5', experience: '2.2 yrs', doj: '01 Nov 2024', status: 'Probation', cost: '₹ 16,000', avatar: 'bg-rose-100 text-rose-600', initials: 'MT' },
  { id: 8, name: 'Swati Singh', email: 'swati.singh@designhouse.co.in', empId: 'DH1084', designation: 'Design Coordinator', grade: 'Grade: G5', experience: '2.0 yrs', doj: '20 Jan 2025', status: 'Active', cost: '₹ 15,000', avatar: 'bg-cyan-100 text-cyan-600', initials: 'SS' },
];

const METRICS = [
  { label: 'Total Members', value: '12', sub: 'Active', icon: Users, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
  { label: 'Male', value: '8', sub: '66.67%', icon: User, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
  { label: 'Female', value: '4', sub: '33.33%', icon: User, iconColor: 'text-purple-500', iconBg: 'bg-purple-50' },
  { label: 'Average Experience', value: '4.6 yrs', sub: '', icon: BadgeCent, iconColor: 'text-amber-500', iconBg: 'bg-amber-50' },
  { label: 'Total Cost', value: '₹ 2,40,500', sub: '(Monthly)', icon: IndianRupee, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
];

const STATUS_TABS = ['All Members', 'Active', 'On Leave', 'In Probation', 'Exited'];

// --- Components ---

function MetricCard({ m }: { m: typeof METRICS[0] }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 flex items-start gap-4 shadow-sm flex-1 min-w-[180px]">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg} ${m.iconColor}`}>
        <m.icon size={20} />
      </div>
      <div>
        <p className="text-[11px] text-zinc-500 mb-0.5">{m.label}</p>
        <p className="text-[18px] font-bold text-zinc-900 leading-tight mb-1">{m.value}</p>
        {m.sub && <p className="text-[11px] text-zinc-500">{m.sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isProbation = status === 'Probation';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${isProbation ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
      {status}
    </span>
  );
}

function DoughnutChart() {
  // Pure CSS Donut chart representation
  return (
    <div className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center shrink-0"
      style={{
        background: `conic-gradient(
             #f59e0b 0% 16.67%, 
             #3b82f6 16.67% 25%, 
             #e5e7eb 25% 25%, 
             #10b981 25% 100%
           )`
      }}>
      {/* Inner white circle to make it a donut */}
      <div className="absolute w-[85px] h-[85px] bg-white rounded-full flex flex-col items-center justify-center">
        <span className="text-[16px] font-bold text-zinc-900 leading-tight">12</span>
        <span className="text-[10px] text-zinc-500">Members</span>
      </div>
    </div>
  );
}

export default function TeamMembersTab() {
  const [activeTab, setActiveTab] = useState('All Members');
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on active tab and search term
  const filteredMembers = TEAM_MEMBERS.filter(emp => {
    // 1. Tab filter
    const matchesTab = activeTab === 'All Members'
      ? true
      : activeTab === 'In Probation'
        ? emp.status === 'Probation'
        : emp.status === activeTab;

    // 2. Search filter
    const matchesSearch = searchTerm.trim() === '' ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-10">

      {/* 1. Metrics Row */}
      <div className="flex flex-wrap gap-4">
        {METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
      </div>

      {/* 2. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2 items-start">

        {/* LEFT COLUMN: TABLE AREA */}
        <div className="min-w-0">

          {/* Status Tabs */}
          <div className="flex items-center gap-6 border-b border-zinc-200 mb-2 px-2">
            {STATUS_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-3 pt-1 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 flex items-center justify-between gap-3 flex-wrap border-b border-zinc-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[280px] rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-[12px] text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-zinc-400"
                />
              </div>
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Filter size={14} /> Filters
                </button>
                {showFilters && (
                  <div className="absolute top-full mt-1 right-0 sm:right-auto sm:left-0 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg p-2 z-10">
                    <p className="text-[11px] text-zinc-500 px-2 py-1">No filters applied</p>
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Bulk Actions <ChevronDown size={14} />
                  </button>
                  {showBulkActions && (
                    <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-10">
                      <button className="w-full text-left px-3 py-2 text-[12px] hover:bg-zinc-50 text-zinc-700">Delete Selected</button>
                      <button className="w-full text-left px-3 py-2 text-[12px] hover:bg-zinc-50 text-zinc-700">Update Status</button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => alert("Exporting data...")}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="py-3 pl-4 pr-2 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={filteredMembers.length > 0 && selectedIds.length === filteredMembers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(filteredMembers.map(emp => emp.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Employee</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Employee ID</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Designation</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Experience</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">DOJ</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Status</th>
                    <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700">Cost (Monthly)</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-zinc-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredMembers.map((emp) => (
                    <tr key={emp.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-2.5 pl-4 pr-2">
                        <input
                          type="checkbox"
                          className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedIds.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, emp.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== emp.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2.5">
                          {/* Use Image instead if you have real avatars. Using colored circle for now. */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${emp.avatar}`}>
                            {emp.initials}
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{emp.name}</p>
                            <p className="text-[10px] text-zinc-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-[11px] font-semibold text-blue-600">{emp.empId}</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <p className="text-[12px] font-medium text-zinc-700">{emp.designation}</p>
                        <p className="text-[10px] text-zinc-400">{emp.grade}</p>
                      </td>
                      <td className="py-2.5 px-2 text-[12px] text-zinc-600">{emp.experience}</td>
                      <td className="py-2.5 px-2 text-[12px] text-zinc-600">{emp.doj}</td>
                      <td className="py-2.5 px-2">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="py-2.5 px-2 text-[12px] font-medium text-zinc-700">{emp.cost}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded transition-colors">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <div>Showing {filteredMembers.length > 0 ? 1 : 0} to {filteredMembers.length} of {TEAM_MEMBERS.length} members</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100"><ChevronLeft size={14} /></button>
                  <button className="w-6 h-6 rounded flex items-center justify-center bg-blue-600 text-white font-semibold">1</button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 font-medium">2</button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100"><ChevronRight size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <div className="border border-zinc-200 rounded px-2 py-1 text-zinc-700 font-medium flex items-center gap-1">
                    10 <ChevronDown size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & ACTIONS */}
        <div className="space-y-2">

          {/* Team Overview Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Team Overview</h3>
            <div className="flex gap-4 items-center">
              <DoughnutChart />
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-500"></div><span className="text-zinc-600">Active (9)</span></div>
                  <span className="font-semibold text-zinc-900">75%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-500"></div><span className="text-zinc-600">Probation (2)</span></div>
                  <span className="font-semibold text-zinc-900">16.67%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-blue-500"></div><span className="text-zinc-600">On Leave (1)</span></div>
                  <span className="font-semibold text-zinc-900">8.33%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-zinc-300"></div><span className="text-zinc-600">Exited (0)</span></div>
                  <span className="font-semibold text-zinc-900">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Designation Wise Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Designation Wise</h3>
            <div className="space-y-3">
              {[
                { label: 'Sr. 3D Visualizer', count: 2, percent: 100 },
                { label: 'Manager - Space Planning', count: 1, percent: 50 },
                { label: '3D Artist', count: 1, percent: 50 },
                { label: 'Interior Designer', count: 1, percent: 50 },
                { label: 'Design Support', count: 1, percent: 50 },
                { label: 'CAD Designer', count: 1, percent: 50 },
                { label: 'Design Coordinator', count: 1, percent: 50 },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2 text-[11px]">
                  <span className="w-[120px] shrink-0 text-zinc-600 truncate">{d.label}</span>
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.percent}%` }}></div>
                  </div>
                  <span className="w-4 shrink-0 text-right font-medium text-zinc-900">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <h3 className="text-[13px] font-bold text-zinc-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button className="flex items-center gap-1.5 justify-center py-2 px-1.5 border border-blue-100 bg-blue-50 rounded-lg text-[10.5px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors overflow-hidden">
                <Plus className="w-3.5 h-3.5 shrink-0" /> 
                <span className="truncate">Add Team Member</span>
              </button>
              <button className="flex items-center gap-1.5 justify-center py-2 px-1.5 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
                <Upload className="w-3.5 h-3.5 shrink-0" /> 
                <span className="truncate">Bulk Import</span>
              </button>
              <button className="flex items-center gap-1.5 justify-center py-2 px-1.5 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
                <FolderOpen className="w-3.5 h-3.5 shrink-0" /> 
                <span className="truncate">Cost Center</span>
              </button>
              <button className="flex items-center gap-1.5 justify-center py-2 px-1.5 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
                <IndianRupee className="w-3.5 h-3.5 shrink-0" /> 
                <span className="truncate">Update Salaries</span>
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-zinc-200 bg-white rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
              <Users className="w-3.5 h-3.5 text-blue-600" /> View Team Directory
            </button>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Reports</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors group text-left">
                <div className="flex gap-2">
                  <div className="mt-0.5 text-blue-500"><FolderOpen size={14} /></div>
                  <div>
                    <p className="text-[11.5px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Team Attendance Report</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">View attendance summary</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors group text-left">
                <div className="flex gap-2">
                  <div className="mt-0.5 text-blue-500"><FolderOpen size={14} /></div>
                  <div>
                    <p className="text-[11.5px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Team Cost Report</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">View cost and budget report</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
