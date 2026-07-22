'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Upload, Download, Sparkles, Plus, ChevronRight, Search, Filter,
  RotateCcw, Eye, Edit2, MoreVertical, X, ChevronDown, ChevronLeft,
  Building, Users, User, PieChart as PieChartIcon, CheckCircle2, Circle, TrendingUp, Clock
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '@/components/ui/card';

// --- MOCK DATA ---
const topCards = [
  { title: 'TOTAL DEPARTMENTS', value: '10', subtitle: 'All departments', color: '#3b82f6', isChart: true, linkText: 'View all' },
  { title: 'ACTIVE DEPARTMENTS', value: '10', subtitle: '100% of total', color: '#10b981', isChart: true, linkText: 'View all' },
  { title: 'DEPARTMENT HEADS', value: '9', subtitle: 'With assigned head', color: '#8b5cf6', isChart: true, linkText: 'View all' },
  { title: 'TOTAL EMPLOYEES', value: '467', subtitle: 'Across all departments', color: '#3b82f6', isChart: true, linkText: 'View all' },
  { title: 'TOTAL BUDGET (FY 2025-26)', value: '₹ 15.45 Cr', subtitle: 'Allocated budget', color: '#f97316', isChart: true, linkText: 'View details' },
  { title: 'AVG. UTILIZATION', value: '72%', subtitle: 'Budget utilization', color: '#10b981', isPie: true, linkText: 'View details' },
];

const mockChartData = [{ v: 10 }, { v: 25 }, { v: 20 }, { v: 45 }, { v: 30 }, { v: 50 }, { v: 40 }];

const departments = [
  { id: 1, name: 'Design Studio', code: 'DS', headName: 'Aman Malhotra', headRole: 'Design Director', empTotal: 42, empManager: 28, empSupport: 14, budgetStr: '₹ 1,20,00,000', util: 80, active: true },
  { id: 2, name: 'Retail Interiors', code: 'RI', headName: 'Neha Sethi', headRole: 'GM - Retail', empTotal: 68, empManager: 40, empSupport: 28, budgetStr: '₹ 2,45,00,000', util: 75, active: true },
  { id: 3, name: 'Display Merchandising', code: 'DM', headName: 'Rohit Arora', headRole: 'GM - Display', empTotal: 55, empManager: 35, empSupport: 20, budgetStr: '₹ 1,75,00,000', util: 70, active: true },
  { id: 4, name: 'Events & Exhibitions', code: 'EE', headName: 'Pooja Bansal', headRole: 'Events Director', empTotal: 38, empManager: 26, empSupport: 12, budgetStr: '₹ 1,10,00,000', util: 65, active: true },
  { id: 5, name: 'Projects', code: 'PR', headName: 'Vivek Rana', headRole: 'VP - Projects', empTotal: 72, empManager: 48, empSupport: 24, budgetStr: '₹ 3,10,00,000', util: 78, active: true },
  { id: 6, name: 'Production', code: 'PD', headName: 'Sandeep Yadav', headRole: 'Production Head', empTotal: 61, empManager: 50, empSupport: 11, budgetStr: '₹ 2,05,00,000', util: 72, active: true },
  { id: 7, name: 'Procurement', code: 'PC', headName: 'Meena Joshi', headRole: 'Procurement Head', empTotal: 18, empManager: 12, empSupport: 6, budgetStr: '₹ 65,00,000', util: 60, active: true },
  { id: 8, name: 'Sales & Business Dev.', code: 'SB', headName: 'Karan Wadhwa', headRole: 'Sales Director', empTotal: 46, empManager: 30, empSupport: 16, budgetStr: '₹ 1,90,00,000', util: 68, active: true },
  { id: 9, name: 'Accounts & Finance', code: 'AF', headName: 'Anjali Gupta', headRole: 'Finance Manager', empTotal: 20, empManager: 12, empSupport: 8, budgetStr: '₹ 85,00,000', util: 55, active: true },
  { id: 10, name: 'Human Resources', code: 'HR', headName: 'Priyanka Singh', headRole: 'HR Manager', empTotal: 15, empManager: 9, empSupport: 6, budgetStr: '₹ 60,00,000', util: 50, active: true },
];

const compositionData = [
  { name: 'Managers', value: 10, color: '#3b82f6', percent: '24%' },
  { name: 'Executives', value: 20, color: '#10b981', percent: '48%' },
  { name: 'Officers', value: 10, color: '#f59e0b', percent: '24%' },
  { name: 'Support Staff', value: 2, color: '#8b5cf6', percent: '4%' },
];

const activities = [
  { id: 1, text: 'Budget updated for FY 2025-26', by: 'Vijay Sharma', time: '28 May 2025, 11:30 AM' },
  { id: 2, text: 'Neha Sethi assigned as GM - Retail', by: 'Vijay Sharma', time: '20 May 2025, 04:15 PM' },
  { id: 3, text: 'Department created', by: 'Vijay Sharma', time: '12 Jan 2024, 10:00 AM' },
];

// --- COMPONENTS ---
const MicroLineChart = ({ color }: { color: string }) => {
  const chartId = color.replace('#', '');
  return (
    <ResponsiveContainer width="100%" height={35}>
      <AreaChart data={mockChartData}>
        <defs>
          <linearGradient id={`color${chartId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${chartId})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CircularProgress = ({ value, color, hideText }: { value: number, color: string, hideText?: boolean }) => {
  const data = [{ value }, { value: 100 - value }];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius="70%" outerRadius="100%" dataKey="value" stroke="none" startAngle={90} endAngle={-270} isAnimationActive={false}>
            <Cell fill={color} />
            <Cell fill={`${color}33`} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {!hideText && <span className="absolute text-[10px] font-bold text-slate-700">{value}%</span>}
    </div>
  );
};

export default function DepartmentsPage() {
  const [activeLeftTab, setActiveLeftTab] = useState('Department List');
  const [activeRightTab, setActiveRightTab] = useState('Overview');

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
        <div>
          <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center gap-2">
            <span className="cursor-pointer hover:text-slate-700">Organization Setup</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-blue-600 font-semibold cursor-pointer">Departments</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Departments</h1>
          <p className="text-[11px] text-slate-500">Manage, organize and track all departments across the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[11px] font-medium hover:bg-indigo-100 transition-colors relative">
            <span className="absolute -top-2.5 -right-2 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">New</span>
            <Sparkles className="w-4 h-4" /> AI Insights
          </button>
          <div className="flex items-center rounded-md overflow-hidden shadow-sm h-8 ml-2">
            <Link href="/dashboard/departments/add-department/basic-info" className="flex items-center gap-2 px-2 h-full bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Department
            </Link>
            <button className="px-2 h-full bg-blue-700 text-white hover:bg-blue-800 transition-colors border-l border-blue-500 flex items-center justify-center">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-1">
        {topCards.map((card, idx) => (
          <Card key={idx} className="p-3.5 flex flex-col justify-between bg-white border border-slate-200 shadow-sm rounded-lg min-h-[110px]">
            <div className="flex items-start gap-3 mb-2">
              {card.isPie ? (
                <div className="w-12 h-12 shrink-0 -mt-1"><CircularProgress value={parseInt(card.value)} color={card.color} hideText /></div>
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {card.title.includes('DEPARTMENT') && !card.title.includes('HEADS') ? <Building className="w-5 h-5" /> : card.title.includes('EMPLOYEE') ? <Users className="w-5 h-5" /> : card.title.includes('HEADS') ? <User className="w-5 h-5" /> : <PieChartIcon className="w-5 h-5" />}
                </div>
              )}
              <div className="flex flex-col pt-0.5">
                <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">{card.title}</h3>
                <span className="text-xl font-bold text-slate-900 leading-none">{card.value}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{card.subtitle}</p>
              </div>
            </div>
            <div className="flex items-end justify-between mt-auto">
              <a href="#" className="text-[10px] font-bold text-blue-700 hover:underline">{card.linkText}</a>
              {card.isChart && (
                <div className="w-[70px]">
                  <MicroLineChart color={card.color} />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-start">

        {/* LEFT SECTION (70%) */}
        <div className="xl:col-span-7 flex flex-col gap-1 min-w-0">
          <Card className="bg-white border border-slate-100 shadow-sm rounded-lg overflow-hidden flex flex-col">

            {/* TABS & TOOLBAR */}
            <div className="flex items-center justify-between border-b border-slate-100 pl-2 pr-3 w-full">
              <div className="flex items-center gap-4">
                {['Department List', 'Hierarchy View', 'Analytics', 'Budget Overview'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveLeftTab(tab)}
                    className={`whitespace-nowrap py-4 text-[11px] font-semibold border-b-[3px] transition-colors flex items-center gap-2 ${activeLeftTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
                  >
                    {tab === 'Hierarchy View' && <Users className="w-4 h-4 text-slate-500" />}
                    {tab === 'Analytics' && <TrendingUp className="w-4 h-4 text-slate-500" />}
                    {tab === 'Budget Overview' && <PieChartIcon className="w-4 h-4 text-slate-500" />}
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <input type="text" placeholder="Search departments..." className="pl-3 pr-7 py-2 bg-white border border-slate-200 rounded-md text-[12px] w-36 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" />
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filters
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Active Only <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button className="flex flex-col items-center justify-center w-12 py-1 border border-slate-200 rounded-md text-blue-500 hover:bg-blue-50 transition-colors">
                  <RotateCcw className="w-3 h-3 mb-0.5" />
                  <span className="text-[9px] font-bold">Reset</span>
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-1.5 px-2 w-10"></th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Code</th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department Head</th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Employees <span className="block text-[9px] text-slate-400 font-normal normal-case tracking-normal">Count</span></th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">Budget (FY 2025-26) <span className="block text-[9px] text-slate-400 font-normal normal-case tracking-normal">Utilization</span></th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-1.5 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {departments.map((dept, i) => (
                    <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors group ${i === 0 ? 'bg-blue-50/20' : ''}`}>
                      <td className="py-1.5 px-2 text-slate-400">
                        <ChevronRight className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors" />
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm ${i === 0 ? 'bg-blue-600' : 'bg-slate-700'}`}>
                            <Building className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-800">{dept.name}</span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 font-semibold text-slate-700">{dept.code}</td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/150?u=${dept.id}`} alt={dept.headName} className="w-8 h-8 rounded-full border border-slate-200" />
                          <div className="leading-tight">
                            <p className="font-bold text-slate-800 text-[11px]">{dept.headName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{dept.headRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-bold text-slate-800">{dept.empTotal}</span>
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                            <span className="text-blue-600 flex items-center gap-1"><Users className="w-3 h-3 text-blue-400" /> {dept.empManager}</span>
                            <span className="text-rose-500 flex items-center gap-1"><Users className="w-3 h-3 text-rose-400" /> {dept.empSupport}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex flex-col gap-1.5 w-36">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-800">{dept.budgetStr}</span>
                            <span className="font-bold text-slate-500 text-[11px]">{dept.util}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${dept.util}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                          Active
                        </span>
                      </td>
                      <td className="py-1.5 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/dashboard/departments/${i + 1}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors block"><Eye className="w-4 h-4" /></Link>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="mt-auto border-t border-slate-100 p-2 flex items-center justify-between text-[11px] text-slate-500 bg-white">
              <div className="flex-1">Showing 1 to 10 of 10 departments</div>
              <div className="flex-1 flex justify-center items-center gap-1">
                <button className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-7 h-7 flex items-center justify-center border border-blue-600 bg-blue-600 text-white rounded-md font-medium text-[11px]">1</button>
                <button className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="relative">
                  <select className="appearance-none border border-slate-200 bg-white pl-3 pr-8 py-1.5 rounded-md cursor-pointer hover:bg-slate-50 transition-colors font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px]">
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT SECTION (30%) */}
        <div className="xl:col-span-3 min-w-0">
          <Card className="bg-white border border-slate-100 shadow-sm rounded-lg flex flex-col">

            {/* DEPT HEADER */}
            <div className="p-3 pb-2 relative">
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 border-4 border-blue-50 flex items-center justify-center shrink-0 shadow-sm relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-xl m-0.5 flex items-center justify-center text-white"><Edit2 className="w-4 h-4" /></div>
                </div>
                <div className="pt-0.5">
                  <h2 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">Design Studio</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-emerald-600 bg-emerald-50 text-[10px] font-bold tracking-wide mb-1.5 border border-emerald-100/50">Active</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span>DS</span>
                    <span className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                    <span>Core Function</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="flex items-center border-b border-slate-100 px-3">
              {['Overview', 'Employees', 'Budget', 'Documents'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveRightTab(tab)}
                  className={`flex-1 text-center py-1.5 text-[10px] font-bold border-b-[3px] transition-colors ${activeRightTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* DETAILS */}
            <div className="p-3 pb-3 border-b border-slate-100">
              <div className="grid grid-cols-[125px_1fr] gap-y-2.5 gap-x-2 text-[10.5px]">

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Users className="w-4 h-4" /> Department Head</div>
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=1" alt="Aman" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                  <div className="leading-tight">
                    <p className="font-bold text-slate-900 text-[11px]">Aman Malhotra</p>
                    <p className="text-[10px] text-slate-500 font-medium">Design Director</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><User className="w-4 h-4" /> Parent Department</div>
                <div className="font-bold text-slate-800">-</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Building className="w-4 h-4" /> Business Unit</div>
                <div className="font-bold text-slate-800">Design & Creative</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><PieChartIcon className="w-4 h-4" /> Cost Center</div>
                <div className="font-bold text-slate-800">CC-DS-1001</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Filter className="w-4 h-4" /> Location</div>
                <div className="font-bold text-slate-800">Noida – Head Office</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Clock className="w-4 h-4" /> Established On</div>
                <div className="font-bold text-slate-800">12 Jan 2024</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Users className="w-4 h-4" /> Employee Capacity</div>
                <div className="font-bold text-slate-800">60</div>

                <div className="flex items-center gap-2 text-slate-500 font-medium"><Upload className="w-4 h-4" /> Email</div>
                <div className="font-semibold text-blue-600 hover:underline cursor-pointer">designstudio@designhouse.co.in</div>

                <div className="flex items-start gap-2 text-slate-500 font-medium"><Edit2 className="w-4 h-4" /> Description</div>
                <div className="text-slate-700 font-medium leading-relaxed text-[10px]">Responsible for conceptualization, space planning, 3D design and creative development for all projects and client requirements.</div>
              </div>
            </div>

            {/* COMPOSITION CHART */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-[11.5px] font-bold text-slate-800 mb-4">Department Composition</h3>
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={compositionData} innerRadius="55%" outerRadius="100%" dataKey="value" stroke="none">
                        {compositionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  {compositionData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-700 font-semibold">{item.name}</span>
                      </div>
                      <div className="text-slate-700 font-medium">
                        {item.value} <span className="text-slate-500 font-normal ml-1">({item.percent})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="p-3 pb-3">
              <h3 className="text-[11px] font-bold text-slate-800 mb-2.5">Recent Activity</h3>
              <div className="flex flex-col gap-2.5">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                      {act.id === 1 ? <PieChartIcon className="w-4 h-4" /> : act.id === 2 ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                    </div>
                    <div className="leading-tight flex-1 flex justify-between items-start pt-0.5">
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 mb-1">{act.text}</p>
                        <p className="text-[10px] text-slate-500 font-medium">by <span className="text-slate-400">{act.by}</span></p>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center w-full gap-1">
                View all activity <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </Card>
        </div>


      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
}
