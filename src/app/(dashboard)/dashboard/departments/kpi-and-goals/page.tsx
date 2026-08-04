'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight, ArrowLeft, Plus, Building2, Users, MapPin, GitBranch,
  Target, Activity, Flag, Trophy, BarChart2, Eye, Pencil, MoreVertical,
  LayoutDashboard, Download, ArrowRight, Goal
} from 'lucide-react';

import { getDepartmentKpis } from '@/services/kpiService';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Details', 'KPIs & Goals'];

export default function KPIsAndGoalsPage() {
  const tabs = ['Overview', 'KPIs', 'Goals', 'Progress Tracking', 'History'];

  const [kpisData, setKpisData] = useState<any[]>([]);
  const [goalsData, setGoalsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await getDepartmentKpis('64a7c1e5f8b9a9d2a4f6e1b3');
        if (res.success && res.data) {
          // Map backend KPIs to frontend format
          const mappedKpis = res.data.map((kpi: any, idx: number) => ({
            id: kpi._id,
            displayId: idx + 1,
            name: kpi.title,
            desc: kpi.description || 'No description',
            ownerName: kpi.createdBy ? `${kpi.createdBy.firstName} ${kpi.createdBy.lastName}` : 'System',
            ownerRole: 'N/A', // Role not in model currently
            frequency: kpi.goalPeriod,
            target: kpi.weightage + '%',
            current: '0%', // Mock
            progress: Math.floor(Math.random() * 100), // Mock progress
            status: 'On Track',
            statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
          }));

          // Extract all nested goals from all KPIs
          const allGoals: any[] = [];
          res.data.forEach((kpi: any) => {
            if (kpi.goals && kpi.goals.length > 0) {
              kpi.goals.forEach((goal: any, gIdx: number) => {
                allGoals.push({
                  id: goal._id || `${kpi._id}-${gIdx}`,
                  displayId: allGoals.length + 1,
                  title: goal.name,
                  kpis: '1 KPI',
                  targetDate: kpi.goalPeriod,
                  progress: Math.floor(Math.random() * 100), // Mock progress
                  status: 'On Track',
                  statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                  ownerName: kpi.createdBy ? `${kpi.createdBy.firstName} ${kpi.createdBy.lastName}` : 'System'
                });
              });
            }
          });

          setKpisData(mappedKpis);
          setGoalsData(allGoals);
        }
      } catch (error) {
        console.error('Failed to load KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  return (
    <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800 bg-slate-50 min-h-screen overflow-hidden">

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
        <div>
          <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1 flex-wrap">
            {BREADCRUMB.map((crumb, i) => (
              <React.Fragment key={crumb}>
                {i === BREADCRUMB.length - 1 ? (
                  <span className="text-slate-900 font-bold">{crumb}</span>
                ) : (
                  <span className="cursor-pointer hover:text-slate-700">{crumb}</span>
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
              <h1 className="text-[18px] font-bold text-slate-900 leading-tight">Department Details: KPIs & Goals</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Track department performance using key metrics and defined goals.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors whitespace-nowrap">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
          </button>

          <Link href="/dashboard/departments/kpi-and-goals/add-new" className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap">
            <Plus className="w-3.5 h-3.5" /> Add KPI / Goal
          </Link>
        </div>
      </div>

      {/* Department Overview Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 flex-nowrap overflow-hidden">

          {/* Department Info */}
          <div className="flex items-start gap-2 min-w-0 shrink-0">
            <span className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full bg-indigo-50 text-indigo-600">
              <Building2 className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9.5px] text-slate-500 mb-0.5 font-medium leading-none">Department</p>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h2 className="text-[13px] font-bold text-slate-900 truncate">Interior Design</h2>
                <span className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100 leading-none">Active</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight truncate">Code: <span className="font-semibold text-slate-700">INT-DSN</span></p>
              <p className="text-[10px] text-slate-500 leading-tight truncate">Parent: <span className="font-semibold text-slate-700">Design & Build</span></p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-100 shrink-0 mx-1"></div>

          {/* Department Head */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100 object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-[9.5px] text-slate-500 mb-0.5 font-medium leading-none">Department Head</p>
              <p className="text-[13px] font-bold text-slate-900 truncate">Rahul Nair</p>
              <p className="text-[10px] text-slate-500 leading-tight">Manager</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-100 shrink-0 mx-1"></div>

          {/* Total Employees */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <span className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
              <Users className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9.5px] text-slate-500 mb-0.5 font-medium leading-none">Total Employees</p>
              <p className="text-[13px] font-bold text-slate-900">12</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-100 shrink-0 mx-1"></div>

          {/* Business Unit */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <span className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50">
              <GitBranch className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9.5px] text-slate-500 mb-0.5 font-medium leading-none">Business Unit</p>
              <p className="text-[12px] font-bold text-slate-900 truncate">Design House India</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-100 shrink-0 mx-1"></div>

          {/* Location */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <span className="w-9 h-9 flex items-center justify-center shrink-0 rounded-full bg-purple-50 text-purple-600 border border-purple-100/50">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9.5px] text-slate-500 mb-0.5 font-medium leading-none">Location</p>
              <p className="text-[12px] font-bold text-slate-900 truncate">Noida, Uttar Pradesh</p>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_250px] gap-2 mt-0.5">

        {/* Main Content Area */}
        <div className="flex flex-col min-w-0 gap-2 h-full">

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-slate-200">
            {tabs.map((t, i) => (
              <button key={t} className={`pb-2 text-[12px] font-bold border-b-[2px] transition-colors ${i === 0 ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">Total KPIs</p>
                <p className="text-[16px] font-black text-slate-900 leading-tight my-0.5">{kpisData.length}</p>
                <p className="text-[9px] font-medium text-slate-600 leading-tight">Active</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">KPIs On Track</p>
                <p className="text-[16px] font-black text-slate-900 leading-tight my-0.5">4</p>
                <p className="text-[9px] font-medium text-slate-600 leading-tight">66.67%</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">KPIs At Risk</p>
                <p className="text-[16px] font-black text-slate-900 leading-tight my-0.5">1</p>
                <p className="text-[9px] font-medium text-slate-600 leading-tight">16.67%</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">KPIs Off Track</p>
                <p className="text-[16px] font-black text-slate-900 leading-tight my-0.5">1</p>
                <p className="text-[9px] font-medium text-slate-600 leading-tight">16.67%</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">Total Goals</p>
                  <p className="text-[16px] font-black text-slate-900 leading-tight my-0.5">{goalsData.length}</p>
                  <p className="text-[9px] font-medium text-slate-600 leading-tight">Active</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center pr-1 shrink-0">
                <div className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <p className="text-[9px] font-bold text-slate-900 leading-none">60.00%</p>
              </div>
            </div>
          </div>

          {/* KPIs Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <h3 className="text-[13px] font-bold text-slate-900">Key Performance Indicators (KPIs)</h3>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 w-8">#</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">KPI Name</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">KPI Owner</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Frequency</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Target</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Current</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 w-24">Progress</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 text-center">Status</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kpisData.map((kpi, index) => (
                    <tr key={kpi.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-900">{kpi.displayId}</td>
                      <td className="px-2 py-2">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">{kpi.name}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{kpi.desc}</p>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1.5">
                          <img src={`https://i.pravatar.cc/150?img=${30 + index}`} alt="" className="w-6 h-6 rounded-full object-cover bg-slate-200" />
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 leading-none">{kpi.ownerName}</p>
                            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{kpi.ownerRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-[11px] text-slate-700 font-medium">{kpi.frequency}</td>
                      <td className="px-2 py-2 text-[11px] font-bold text-slate-900">{kpi.target}</td>
                      <td className="px-2 py-2 text-[11px] font-bold text-slate-900">{kpi.current}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-0.5 w-full max-w-[80px]">
                          <span className="text-[9.5px] font-bold text-slate-700 leading-none">{kpi.progress}%</span>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`h-full rounded-full ${kpi.progress >= 100 ? 'bg-emerald-500' : kpi.progress > 90 ? 'bg-emerald-500' : kpi.progress > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${kpi.statusColor}`}>
                          {kpi.status}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Eye className="w-3 h-3" /></button>
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil className="w-3 h-3" /></button>
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><MoreVertical className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 border-t border-slate-100 flex justify-center bg-slate-50/30">
              <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors">
                View All KPIs <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Goals Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <h3 className="text-[13px] font-bold text-slate-900">Department Goals</h3>
            </div>
            <div className="overflow-hidden flex-1">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 w-8">#</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Goal Title</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Linked KPIs</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Target Date</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 w-24">Progress</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 text-center">Status</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800">Owner</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-800 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {goalsData.map((goal, index) => (
                    <tr key={goal.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-2 py-2 text-[11px] font-semibold text-slate-900">{goal.displayId}</td>
                      <td className="px-2 py-2">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">{goal.title}</p>
                      </td>
                      <td className="px-2 py-2 text-[11px] font-medium text-slate-700">{goal.kpis}</td>
                      <td className="px-2 py-2 text-[11px] text-slate-700 font-medium">{goal.targetDate}</td>
                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-0.5 w-full max-w-[80px]">
                          <span className="text-[9.5px] font-bold text-slate-700 leading-none">{goal.progress}%</span>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                            <div
                              className={`h-full rounded-full ${goal.progress >= 80 ? 'bg-emerald-500' : goal.progress > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${goal.statusColor}`}>
                          {goal.status}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1.5">
                          <img src={`https://i.pravatar.cc/150?img=${40 + index}`} alt="" className="w-5 h-5 rounded-full object-cover bg-slate-200" />
                          <span className="text-[11px] font-bold text-slate-900">{goal.ownerName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Eye className="w-3 h-3" /></button>
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil className="w-3 h-3" /></button>
                          <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><MoreVertical className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 border-t border-slate-100 flex justify-center bg-slate-50/30 mt-auto">
              <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors">
                View All Goals <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-2 h-full">

          {/* Goals Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3">Goals Summary</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    className="text-emerald-500"
                    strokeDasharray="60, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-amber-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-60"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="text-red-500"
                    strokeDasharray="20, 100"
                    strokeDashoffset="-80"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-slate-900 leading-tight">5</span>
                  <span className="text-[9px] font-bold text-slate-500 text-center leading-tight mt-0.5">Total<br />Goals</span>
                </div>
              </div>

              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[11px] font-bold text-slate-700">On Track</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">3 (60.00%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[11px] font-bold text-slate-700">In Progress</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">1 (20.00%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-[11px] font-bold text-slate-700">Off Track</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">1 (20.00%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <span className="text-[11px] font-bold text-slate-700">Not Started</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">0 (0.00%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Quarter Progress */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3">Current Quarter Progress</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-20 overflow-hidden mb-1">
                <svg viewBox="0 0 36 18" className="w-full h-full transform translate-y-1">
                  <path
                    className="text-slate-100"
                    d="M2 18 A 16 16 0 0 1 34 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="39.2, 50.24"
                    d="M2 18 A 16 16 0 0 1 34 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-[18px] font-bold text-slate-900">78%</span>
                </div>
              </div>
              <div className="w-full flex justify-between text-[10px] font-bold text-slate-500 px-3 -mt-2 mb-2">
                <span>0%</span>
                <span>100%</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 text-center mb-0.5">Overall KPI Achievement</p>
              <p className="text-[11px] font-bold text-indigo-600 text-center">Target: 90%</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col flex-1">
            <h3 className="text-[13px] font-bold text-slate-900 mb-2">Quick Actions</h3>
            <div className="space-y-1 ">
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-2 text-slate-700">
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-bold group-hover:text-indigo-600 transition-colors">Add KPI</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-2 text-slate-700">
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-bold group-hover:text-indigo-600 transition-colors">Add Goal</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-2 text-slate-700">
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-bold group-hover:text-indigo-600 transition-colors">KPI Dashboard</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-2 text-slate-700">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-bold group-hover:text-indigo-600 transition-colors">Goal Dashboard</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-2 text-slate-700">
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[11px] font-bold group-hover:text-indigo-600 transition-colors">Export Report</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
