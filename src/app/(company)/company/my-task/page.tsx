'use client';

import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  ListChecks, CheckCircle2, Clock, AlarmClock, CalendarDays, Search, Filter,
  ChevronDown, Pencil, MoreVertical, ChevronLeft, ChevronRight,
  ArrowUp, Minus, ArrowDown, Circle, ArrowRight, AlertCircle,
  FileText, Users, Monitor, Database, Calendar, BookOpen,
  Plus, CalendarPlus, Target, BarChart3, ArrowUpRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

const summaryStats = [
  {
    icon: ListChecks,
    accent: 'bg-blue-50 text-blue-600',
    value: '18',
    label: 'Total Tasks',
    detail: 'All assigned tasks',
  },
  {
    icon: CheckCircle2,
    accent: 'bg-emerald-50 text-emerald-600',
    value: '7',
    label: 'Completed',
    detail: 'This month',
  },
  {
    icon: Clock,
    accent: 'bg-amber-50 text-amber-500',
    value: '6',
    label: 'In Progress',
    detail: 'Active tasks',
  },
  {
    icon: AlarmClock,
    accent: 'bg-rose-50 text-rose-600',
    value: '3',
    label: 'Overdue',
    detail: 'Need attention',
  },
  {
    icon: CalendarDays,
    accent: 'bg-violet-50 text-violet-600',
    value: '5',
    label: 'Due Today',
    detail: 'Tasks due today',
  },
];

const tabs = ['All Tasks', 'To Do', 'In Progress', 'Completed', 'Overdue', 'Delegated to Me'];

const tasks = [
  {
    id: 't1', icon: FileText, iconBg: 'bg-blue-50 text-blue-600',
    title: 'Prepare Q2 Sales Report', sub: 'Compile sales data and prepare comprehensive report for Q2 2024',
    priority: 'High', status: 'In Progress', dueDate: '24 May 2024', dueNote: 'Today', dueNoteColor: 'text-rose-500',
    related: 'Q2 Sales Report',
  },
  {
    id: 't2', icon: Users, iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'Follow up with New Clients', sub: 'Reach out to 15 new leads and schedule discovery calls',
    priority: 'Medium', status: 'To Do', dueDate: '27 May 2024', dueNote: '3 days left', dueNoteColor: 'text-zinc-400',
    related: 'Client Acquisition',
  },
  {
    id: 't3', icon: Monitor, iconBg: 'bg-violet-50 text-violet-600',
    title: 'Product Presentation', sub: 'Prepare and deliver product demo for potential client',
    priority: 'High', status: 'In Progress', dueDate: '28 May 2024', dueNote: '4 days left', dueNoteColor: 'text-zinc-400',
    related: 'Client: TechCorp',
  },
  {
    id: 't4', icon: Database, iconBg: 'bg-amber-50 text-amber-600',
    title: 'Update CRM Data', sub: 'Update and clean customer data in CRM system',
    priority: 'Low', status: 'To Do', dueDate: '31 May 2024', dueNote: '7 days left', dueNoteColor: 'text-zinc-400',
    related: 'CRM System',
  },
  {
    id: 't5', icon: Calendar, iconBg: 'bg-rose-50 text-rose-600',
    title: 'Monthly Team Meeting', sub: 'Prepare agenda and conduct monthly team meeting',
    priority: 'Medium', status: 'Overdue', dueDate: '20 May 2024', dueNote: '4 days overdue', dueNoteColor: 'text-rose-500',
    related: 'Sales Team',
  },
  {
    id: 't6', icon: BookOpen, iconBg: 'bg-blue-50 text-blue-600',
    title: 'Complete Product Training', sub: 'Finish advanced product training module and assessment',
    priority: 'Low', status: 'To Do', dueDate: '05 Jun 2024', dueNote: '12 days left', dueNoteColor: 'text-zinc-400',
    related: 'Training Module',
  },
];

const taskSummary = [
  { key: 'To Do', value: 7, pct: '39%', color: '#3b82f6' },
  { key: 'In Progress', value: 6, pct: '33%', color: '#f59e0b' },
  { key: 'Completed', value: 4, pct: '22%', color: '#22c55e' },
  { key: 'Overdue', value: 1, pct: '0%', color: '#ef4444' },
];

const priorityBreakdown = [
  { key: 'High Priority', value: 6, max: 8, color: 'bg-rose-500', accent: 'bg-rose-50 text-rose-600', icon: ArrowUp },
  { key: 'Medium Priority', value: 8, max: 8, color: 'bg-amber-500', accent: 'bg-amber-50 text-amber-600', icon: Minus },
  { key: 'Low Priority', value: 4, max: 8, color: 'bg-emerald-500', accent: 'bg-emerald-50 text-emerald-600', icon: ArrowDown },
];

const upcomingTasks = [
  { month: 'MAY', day: '24', title: 'Prepare Q2 Sales Report', tag: 'High Priority', tagStyle: 'bg-rose-50 text-rose-600', note: 'Today', noteColor: 'text-rose-500' },
  { month: 'MAY', day: '27', title: 'Follow up with New Clients', tag: 'Medium Priority', tagStyle: 'bg-amber-50 text-amber-600', note: '3 days left', noteColor: 'text-zinc-400' },
  { month: 'MAY', day: '28', title: 'Product Presentation', tag: 'High Priority', tagStyle: 'bg-rose-50 text-rose-600', note: '4 days left', noteColor: 'text-zinc-400' },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  action?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
}

function Card({ title, action, className = '', children, titleExtra }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            {titleExtra}
            {action && (
              <button className="flex items-center gap-0.5 whitespace-nowrap text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                {action} <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header + breadcrumb
// ─────────────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-1.5 text-[12px] text-zinc-400">
          <span className="text-zinc-400">Dashboard</span>
          <span>›</span>
          <span className="font-semibold text-zinc-700">My Tasks</span>
        </p>
        <h1 className="mt-1 text-[24px] font-bold text-zinc-900">My Tasks</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">View and manage your tasks. Stay organized and get things done.</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
          <Plus size={14} /> Add Task
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
          <CalendarPlus size={14} /> View Calendar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: (typeof summaryStats)[number] }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${stat.accent}`}>
          <stat.icon size={20} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[19px] font-bold leading-tight text-zinc-900">{stat.value}</p>
          <p className="mt-0.5 text-[12.5px] font-semibold text-zinc-700">{stat.label}</p>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-zinc-400">{stat.detail}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tasks table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function priorityBadge(priority: string) {
  if (priority === 'High') return { cls: 'bg-rose-50 text-rose-600', Icon: ArrowUp };
  if (priority === 'Medium') return { cls: 'bg-amber-50 text-amber-600', Icon: Minus };
  return { cls: 'bg-emerald-50 text-emerald-600', Icon: ArrowDown };
}

function statusBadge(status: string) {
  if (status === 'In Progress') return { cls: 'border-blue-200 bg-blue-50 text-blue-600', Icon: ArrowRight };
  if (status === 'Overdue') return { cls: 'border-rose-200 bg-rose-50 text-rose-600', Icon: AlertCircle };
  return { cls: 'border-zinc-200 bg-zinc-50 text-zinc-500', Icon: Circle };
}

function TasksTableCard() {
  const [activeTab, setActiveTab] = useState('All Tasks');

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap pb-2.5 text-[12.5px] font-semibold transition-colors ${activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
          <Filter size={13} /> Filter
        </button>
        <div className="relative min-w-[200px] flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full rounded-lg border border-zinc-200 py-2 pl-3 pr-8 text-[12px] text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Search size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {/* Table — contained scroll region only; does not affect page width */}
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-zinc-100 bg-white">
              <th className="w-9 px-3 py-1.5">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-300" />
              </th>
              {['Task Details', 'Priority', 'Status', 'Due Date', 'Related To', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const { cls: pCls, Icon: PIcon } = priorityBadge(t.priority);
              const { cls: sCls, Icon: SIcon } = statusBadge(t.status);
              return (
                <tr key={t.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-3 py-1.5">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-300" />
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${t.iconBg}`}>
                        <t.icon size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-medium text-zinc-800">{t.title}</p>
                        <p className="text-[10px] text-zinc-400">{t.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${pCls}`}>
                      <PIcon size={10} /> {t.priority}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${sCls}`}>
                      <SIcon size={10} /> {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <p className="text-[11px] text-zinc-500">{t.dueDate}</p>
                    <p className={`text-[10px] font-medium ${t.dueNoteColor}`}>{t.dueNote}</p>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-zinc-500">{t.related}</td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Pencil size={12} />
                      </button>
                      <button className="grid h-6 w-6 place-items-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-[11.5px] text-zinc-400">Showing 1 to 6 of 18 tasks</p>
        <div className="flex items-center gap-1.5">
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronLeft size={14} />
          </button>
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white">1</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">2</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">3</button>
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-600">
          10 / page <ChevronDown size={12} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
            <Target size={16} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-zinc-900">Stay on Top of Your Tasks</p>
            <p className="text-[11.5px] text-zinc-500">Break down large tasks, set priorities and track progress to achieve your goals.</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <BarChart3 size={14} /> View Productivity Insights
        </button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function TaskSummaryCard() {
  const total = taskSummary.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card title="My Task Summary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskSummary}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {taskSummary.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-bold text-zinc-900">{total}</span>
            <span className="text-[9px] text-zinc-400">Total</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {taskSummary.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.key}
              </span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                {d.value} ({d.pct})
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View Detailed Report <ArrowUpRight size={12} />
      </button>
    </Card>
  );
}

function PriorityBreakdownCard() {
  return (
    <Card title="Tasks by Priority">
      <div className="space-y-3">
        {priorityBreakdown.map((p) => (
          <div key={p.key} className="flex min-w-0 items-center gap-2.5">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${p.accent}`}>
              <p.icon size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11.5px] font-medium text-zinc-700">{p.key}</p>
                <p className="text-[11.5px] font-semibold text-zinc-800">{p.value}</p>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.value / p.max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View All Tasks <ArrowUpRight size={12} />
      </button>
    </Card>
  );
}

function UpcomingTasksCard() {
  return (
    <Card title="Upcoming Tasks" action="View Calendar">
      <div className="space-y-1">
        {upcomingTasks.map((u, i) => (
          <div key={i} className="flex min-w-0 items-center gap-3 rounded-xl p-1.5">
            <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <span className="text-[9px] font-semibold uppercase text-zinc-400">{u.month}</span>
              <span className="text-[10px] font-bold leading-none text-zinc-800">{u.day}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold text-zinc-800">{u.title}</p>
              <span className={`mt-0.5 inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-medium ${u.tagStyle}`}>
                {u.tag}
              </span>
            </div>
            <p className={`shrink-0 text-[10.5px] font-medium ${u.noteColor}`}>{u.note}</p>
          </div>
        ))}
      </div>

      <button className="mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View All Upcoming <ArrowUpRight size={12} />
      </button>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyTasks() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader />

      {/* Row 1 — five summary stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — tasks table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <TasksTableCard />
        </div>
        <div className="min-w-0 space-y-2">
          <TaskSummaryCard />
          <PriorityBreakdownCard />
          <UpcomingTasksCard />
        </div>
      </div>
    </main>
  );
}