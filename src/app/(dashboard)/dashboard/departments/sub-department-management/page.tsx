'use client';
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  ChevronRight, Building2, GitBranch, Plus, ChevronDown, Search, Filter,
  Download, Pencil, MoreVertical, Users, FolderKanban, LayoutGrid, Palette,
  Box, FileText, Layers, ArrowUpRight, UserPlus, Repeat, UserCog, Upload,
  Info,
  Loader2,
  Recycle,
  Trash2,
} from 'lucide-react';
import { getSubDepartments, deleteSubDepartment, SubDepartment } from '@/services/subDepartmentService';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Departments', 'Design Studio', 'Sub Departments'];

const QUICK_ACTIONS = [
  { title: 'Add Employee', sub: 'Add new employee to this team', icon: UserPlus },
  { title: 'Transfer Employee', sub: 'Move employee to this team', icon: Repeat },
  { title: 'Assign Team Lead', sub: 'Change team lead for this team', icon: UserCog },
  { title: 'Export Structure', sub: 'Download team structure', icon: Upload },
];

const SKILLS = ['Concept Development', 'Space Planning', 'Sketching', 'Presentation', 'Client Communication'];

const ACTIVE_PROJECTS = [
  { name: 'COCO Store – Noida', status: 'In Progress', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Nyati Plaza – Pune', status: 'In Progress', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Artha Mart – Noida', status: 'Planning', color: 'bg-amber-50 text-amber-600' },
];

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === BREADCRUMB.length - 1 ? (
              <span className="text-indigo-600 font-semibold">{crumb}</span>
            ) : (
              <span className="text-zinc-500 hover:underline cursor-pointer">{crumb}</span>
            )}
            {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Building2 size={20} />
          </span>
          <div>
            <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Sub Department Management</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">Manage sub departments, team leads and workforce under Design Studio.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <GitBranch size={14} /> Hierarchy View
          </button>
          <NextLink href="/dashboard/departments/add-sub-department" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 pl-4 pr-2 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <Plus size={14} /> Add Sub Department
            <span className="ml-1 border-l border-white/30 pl-2"><ChevronDown size={13} /></span>
          </NextLink>
        </div>
      </div>
    </section>
  );
}

// ─── KPI strip ────────────────────────────────────────────────────────────────
function KpiStrip({ departments }: { departments: any[] }) {
  const totalSubDepartments = departments.length;
  const activeTeams = departments.filter((d) => d.isActive).length;
  const teamLeads = departments.filter((d) => d.hodEmployeeId).length;
  const totalEmployees = departments.reduce((acc, d) => acc + (d.employeeCapacity || d.employees || d.totalEmployees || 0), 0);
  const activeProjects = departments.reduce((acc, d) => acc + (d.activeProjects || d.projectsCount || 0), 0);

  const KPIS = [
    { label: 'Total Sub Departments', value: totalSubDepartments.toString(), sub: 'All active teams', icon: Building2, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Active Teams', value: activeTeams.toString(), sub: '100% of total', icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Team Leads', value: teamLeads.toString(), sub: 'Assigned', icon: UserCog, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Total Employees', value: totalEmployees.toString(), sub: 'Across all teams', icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'Active Projects', value: activeProjects.toString(), sub: 'Across all teams', icon: FolderKanban, bg: 'bg-blue-50', color: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
      {KPIS.map((k) => (
        <div key={k.label} className="rounded-md border border-zinc-200 bg-white shadow-sm p-3 flex items-center gap-2.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${k.bg} ${k.color}`}>
            <k.icon size={16} />
          </span>
          <div>
            <p className="text-[10.5px] text-zinc-500 leading-tight">{k.label}</p>
            <p className="text-[17px] font-semibold text-zinc-900 leading-tight">{k.value}</p>
            <p className="text-[10px] text-zinc-400">{k.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Department hierarchy card ──────────────────────────────────────────────
function DepartmentHierarchyCard({ departments }: { departments: any[] }) {
  const totalSubDepartments = departments.length;
  const teamLeads = departments.filter((d) => d.hodEmployeeId).length;
  const totalEmployees = departments.reduce((acc, d) => acc + (d.employeeCapacity || d.employees || d.totalEmployees || 0), 0);
  const activeProjects = departments.reduce((acc, d) => acc + (d.activeProjects || d.projectsCount || 0), 0);

  const nodes = [
    { label: 'Sub Departments', value: totalSubDepartments.toString() },
    { label: 'Team Leads', value: teamLeads.toString() },
    { label: 'Employees', value: totalEmployees.toString() },
    { label: 'Active Projects', value: activeProjects.toString() },
  ];
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-[13px] font-semibold text-zinc-900">Department Hierarchy</h3>
        <button className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
          <ArrowUpRight size={12} /> Expand All
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50/60 px-2.5 py-1.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-indigo-600 text-[11px] font-bold text-white">DS</span>
          <div>
            <p className="text-[11.5px] font-semibold text-zinc-900 leading-tight">Design Studio</p>
            <p className="text-[9.5px] text-zinc-400">Core Department</p>
          </div>
        </div>
        {nodes.map((n) => (
          <React.Fragment key={n.label}>
            <span className="h-px w-4 bg-zinc-200" />
            <div className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-center">
              <p className="text-[13px] font-semibold text-zinc-900 leading-tight">{n.value}</p>
              <p className="text-[9.5px] text-zinc-400 whitespace-nowrap">{n.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  if (status === 'Active') {
    return (
      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
        Active
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600">
      Inactive
    </span>
  );
}

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${bg} text-[10px] font-bold text-white`}>
      {initials}
    </span>
  );
}

// ─── Sub Departments table ───────────────────────────────────────────────────
function SubDepartmentsTable({ departments, onSelect, selectedId, loading, onDelete }: { departments: SubDepartment[], onSelect: (id: string) => void; selectedId: string, loading: boolean, onDelete: (id: string) => void }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-[14px] font-semibold text-zinc-900">Sub Departments</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search sub departments..."
              className="w-56 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-zinc-400"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
            <Filter size={13} /> Filters
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[10%]" />
            <col className="w-[18%]" />
            <col className="w-[13%]" />
            <col className="w-[14%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Sub Department Name</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Code</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Team Lead</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Employees</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Current Projects</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Status</th>
              <th className="text-left text-[10.5px] font-medium text-zinc-400 py-1.5 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto" />
                  <p className="text-sm text-zinc-500 mt-2">Loading departments...</p>
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <p className="text-sm text-zinc-500">No sub departments found</p>
                </td>
              </tr>
            ) : departments.map((row: any) => (
              <tr
                key={row._id}
                onClick={() => onSelect(row._id)}
                className={`cursor-pointer transition-colors ${selectedId === row._id ? 'bg-indigo-50/40' : 'hover:bg-zinc-50/60'}`}
              >
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600`}>
                      <Building2 size={15} />
                    </span>
                    <span className="text-[12.5px] font-normal text-zinc-700">{row.name}</span>
                  </div>
                </td>
                <td className="py-1.5 pr-2 text-[12px] text-zinc-500">{row.code || '-'}</td>
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <Avatar initials={row.hodEmployeeId ? row.hodEmployeeId.firstName?.charAt(0) : 'U'} bg="bg-indigo-500" />
                    <div>
                      <p className="text-[12px] font-semibold text-zinc-900">
                        {row.hodEmployeeId ? `${row.hodEmployeeId.firstName} ${row.hodEmployeeId.lastName}` : 'Unassigned'}
                      </p>
                      <p className="text-[10.5px] text-zinc-400">Team Lead</p>
                    </div>
                  </div>
                </td>
                <td className="py-1.5 pr-2 text-[12.5px] text-zinc-700">{row.employeeCapacity || row.employees || row.totalEmployees || 0}</td>
                <td className="py-1.5 pr-2 text-[12.5px] text-zinc-700">{row.activeProjects || row.projectsCount || 0}</td>
                <td className="py-1.5 pr-2"><StatusPill status={row.isActive ? 'Active' : 'Inactive'} /></td>
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <NextLink href={`/dashboard/departments/add-sub-department?id=${row._id}`} className="grid h-7 w-7 place-items-center rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Pencil size={13} />
                    </NextLink>
                    <button onClick={() => onDelete(row._id)} className="grid h-7 w-7 place-items-center rounded-md text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mt-4 pt-3 border-t border-zinc-100">
        <p className="text-[12px] text-zinc-500">Showing {departments.length} sub departments</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-[12px] font-semibold text-white">1</button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-zinc-600 shadow-sm outline-none">
              <option>10 per page</option>
              <option>25 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Actions row ───────────────────────────────────────────────────────
function QuickActionsRow() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-semibold text-zinc-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.title}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-3 text-left hover:bg-zinc-50 transition-colors"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
              <a.icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-zinc-900 truncate">{a.title}</p>
              <p className="text-[10.5px] text-zinc-400 truncate">{a.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Selected Sub Department ────────────────────────────────────
function SelectedSubDepartmentCard({ department }: { department: any }) {
  if (!department) return null;
  const leadName = department.hodEmployeeId ? `${department.hodEmployeeId.firstName} ${department.hodEmployeeId.lastName}` : 'Unassigned';
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <p className="text-[13px] font-semibold text-zinc-900 mb-3">Selected Sub Department</p>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
          <Building2 size={18} />
        </span>
        <div>
          <p className="text-[14px] font-semibold text-zinc-900">{department.name}</p>
          <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${department.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {department.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <p className="text-[11.5px] text-zinc-500 mt-2">Code: <span className="font-semibold text-zinc-700">{department.code || '-'}</span> &nbsp;•&nbsp; Team Lead: <span className="font-semibold text-zinc-700">{leadName}</span></p>
    </div>
  );
}

// ─── Right rail: Reporting Structure ────────────────────────────────────────
function ReportingStructureCard({ department }: { department: any }) {
  if (!department) return null;
  const leadName = department.hodEmployeeId ? `${department.hodEmployeeId.firstName} ${department.hodEmployeeId.lastName}` : 'Unassigned';
  const leadInitials = department.hodEmployeeId ? department.hodEmployeeId.firstName.charAt(0) : 'U';

  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <p className="text-[13px] font-semibold text-zinc-900 mb-3">Reporting Structure</p>
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-300" />
        <div className="flex items-center gap-2 flex-1">
          <Avatar initials="H" bg="bg-slate-600" />
          <div>
            <p className="text-[12px] font-semibold text-zinc-900">{department.branchId?.name || 'Head Office'} <span className="font-normal text-zinc-400">(Parent)</span></p>
            <p className="text-[10.5px] text-zinc-400">Head of Department</p>
          </div>
        </div>
      </div>
      <div className="ml-[3px] my-1 h-3 w-px bg-zinc-200" />
      <div className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
        <div className="flex items-center gap-2 flex-1">
          <Avatar initials={leadInitials} bg="bg-rose-400" />
          <div>
            <p className="text-[12px] font-semibold text-zinc-900">{department.name} <span className="font-normal text-zinc-400">(This Sub Dept)</span></p>
            <p className="text-[10.5px] text-zinc-400">{leadName} <span className="text-zinc-400">(Team Lead)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right rail: Skills & Expertise ─────────────────────────────────────────
function SkillsExpertiseCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <p className="text-[13px] font-semibold text-zinc-900 mb-3">Skills & Expertise</p>
      <div className="flex flex-wrap gap-1.5">
        {SKILLS.map((s) => (
          <span key={s} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">{s}</span>
        ))}
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">+3 more</span>
      </div>
    </div>
  );
}

// ─── Right rail: Active Projects ────────────────────────────────────────────
function ActiveProjectsCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-zinc-900">Active Projects (3)</p>
        <button className="text-[12px] font-semibold text-indigo-600 hover:underline">View All</button>
      </div>
      <div className="space-y-2.5">
        {ACTIVE_PROJECTS.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-zinc-700">{p.name}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${p.color}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Capacity Overview ──────────────────────────────────────────
function CapacityOverviewCard() {
  const total = 12;
  const utilized = 9;
  const available = 3;
  const pct = (utilized / total) * 100;
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const dash = (pct / 100) * circumference;

  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <p className="text-[13px] font-semibold text-zinc-900 mb-3">Capacity Overview</p>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e4e4e7" strokeWidth="10" />
            <circle
              cx="50" cy="50" r={r} fill="none" stroke="#4f46e5" strokeWidth="10"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[18px] font-bold text-zinc-900 leading-none">{total}</p>
              <p className="text-[9px] text-zinc-400 mt-0.5">Employees</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span className="text-zinc-600">Utilized</span>
            <span className="font-semibold text-zinc-900">{utilized} ({pct.toFixed(0)}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            <span className="text-zinc-600">Available</span>
            <span className="font-semibold text-zinc-900">{available} ({(100 - pct).toFixed(0)}%)</span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[12px] text-zinc-500">
        <span>Team Capacity: <span className="font-semibold text-zinc-800">15</span></span>
        <Info size={12} className="text-zinc-400" />
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function SubDepartmentManagementPage() {
  const [departments, setDepartments] = useState<SubDepartment[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubDepartments({ limit: 1000 })
      .then((data) => {
        setDepartments(data);
        if (data.length > 0) {
          setSelectedId(data[0]._id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sub department?')) {
      try {
        await deleteSubDepartment(id);
        const updatedDepartments = departments.filter((d) => d._id !== id);
        setDepartments(updatedDepartments);
        if (selectedId === id) {
          setSelectedId(updatedDepartments.length > 0 ? updatedDepartments[0]._id : '');
        }
      } catch (error) {
        console.error('Failed to delete sub department', error);
        alert('Failed to delete sub department');
      }
    }
  };

  const selectedDepartment = departments.find(d => d._id === selectedId);

  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <PageHeading />
      <KpiStrip departments={departments} />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2 items-start">
        <div className="min-w-0 space-y-2">
          <DepartmentHierarchyCard departments={departments} />
          <SubDepartmentsTable
            departments={departments}
            onSelect={setSelectedId}
            selectedId={selectedId}
            loading={loading}
            onDelete={handleDelete}
          />
          <QuickActionsRow />
        </div>

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          {selectedDepartment && (
            <>
              <SelectedSubDepartmentCard department={selectedDepartment} />
              <ReportingStructureCard department={selectedDepartment} />
            </>
          )}
          <SkillsExpertiseCard />
          <ActiveProjectsCard />
          <CapacityOverviewCard />
        </div>
      </div>
    </div>
  );
}