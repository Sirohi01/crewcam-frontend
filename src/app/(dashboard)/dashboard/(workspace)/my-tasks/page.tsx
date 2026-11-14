'use client';

import React, { useMemo, useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  ListChecks, CheckCircle2, Clock, AlarmClock, CalendarDays, Search,
  ChevronDown, Pencil, Trash2, ChevronLeft, ChevronRight,
  ArrowUp, Minus, ArrowDown, Circle, ArrowRight, AlertCircle,
  Users, Plus, UserPlus, Target, ArrowUpRight, Loader2,
} from 'lucide-react';
import { TaskDialog, TaskDialogMode, TASK_STATUS_LABEL } from '@/components/tasks/TaskDialog';
import { useDeleteTask, useMyTasks, useMyTeam, useUpdateTask } from '@/hooks/useMyTasks';
import { MyTask } from '@/services/taskService';

// ─────────────────────────────────────────────────────────────────────────
// Derived task state
// ─────────────────────────────────────────────────────────────────────────

type DisplayStatus = 'To Do' | 'In Progress' | 'Completed' | 'Overdue';

const isOverdue = (t: MyTask) => t.status !== 'Completed' && !!t.dueDate && moment(t.dueDate).isBefore(moment(), 'day');
const displayStatus = (t: MyTask): DisplayStatus => (isOverdue(t) ? 'Overdue' : TASK_STATUS_LABEL[t.status] as DisplayStatus);

const dueNote = (t: MyTask) => {
  if (!t.dueDate) return { text: 'No due date', color: 'text-zinc-400' };
  if (t.status === 'Completed') return { text: t.completedAt ? `Done ${moment(t.completedAt).format('DD MMM')}` : 'Done', color: 'text-emerald-600' };
  const days = moment(t.dueDate).startOf('day').diff(moment().startOf('day'), 'days');
  if (days === 0) return { text: 'Today', color: 'text-rose-500' };
  if (days < 0) return { text: `${-days} day${days === -1 ? '' : 's'} overdue`, color: 'text-rose-500' };
  return { text: `${days} day${days === 1 ? '' : 's'} left`, color: 'text-zinc-400' };
};

const tabs = ['All Tasks', 'To Do', 'In Progress', 'Completed', 'Overdue', 'Delegated to Me'] as const;
type TabName = (typeof tabs)[number];

const matchesTab = (t: MyTask, tab: TabName) => {
  if (tab === 'All Tasks') return true;
  if (tab === 'Delegated to Me') return !!t.assignedBy;
  return displayStatus(t) === tab;
};

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

function Card({ title, className = '', children }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}

function LinkButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
      {children} <ArrowUpRight size={12} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header + breadcrumb
// ─────────────────────────────────────────────────────────────────────────

function PageHeader({ onAdd, onAssign }: { onAdd: () => void; onAssign?: () => void }) {
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
        <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
          <Plus size={14} /> Add Task
        </button>
        {onAssign && (
          <button onClick={onAssign} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
            <UserPlus size={14} /> Assign to Team
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

interface Stat { icon: React.ElementType; accent: string; value: number | string; label: string; detail: string }

function StatCard({ stat }: { stat: Stat }) {
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

function statusBadge(status: DisplayStatus) {
  if (status === 'In Progress') return { cls: 'border-blue-200 bg-blue-50 text-blue-600', Icon: ArrowRight };
  if (status === 'Overdue') return { cls: 'border-rose-200 bg-rose-50 text-rose-600', Icon: AlertCircle };
  if (status === 'Completed') return { cls: 'border-emerald-200 bg-emerald-50 text-emerald-600', Icon: CheckCircle2 };
  return { cls: 'border-zinc-200 bg-zinc-50 text-zinc-500', Icon: Circle };
}

const PAGE_SIZES = [10, 20, 50];

interface TableProps {
  tasks: MyTask[];
  isLoading: boolean;
  tab: TabName;
  setTab: (t: TabName) => void;
  onEdit: (t: MyTask) => void;
  onAdd: () => void;
}

function TasksTableCard({ tasks, isLoading, tab, setTab, onEdit, onAdd }: TableProps) {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) =>
      matchesTab(t, tab) &&
      (!priority || t.priority === priority) &&
      (!q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.relatedTo || '').toLowerCase().includes(q)));
  }, [tasks, tab, priority, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleDone = (t: MyTask) =>
    update.mutate({ id: t._id, status: t.status === 'Completed' ? 'Pending' : 'Completed' }, {
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not update the task'),
    });

  const deleteTask = (t: MyTask) => {
    if (!window.confirm(`Delete "${t.title}"?`)) return;
    remove.mutate(t._id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not delete the task'),
    });
  };

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((name) => (
          <button
            key={name}
            onClick={() => { setTab(name); setPage(1); }}
            className={`shrink-0 whitespace-nowrap pb-2.5 text-[12.5px] font-semibold transition-colors ${tab === name
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50 focus:outline-none"
        >
          <option value="">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <div className="relative min-w-[200px] flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
              <th className="w-9 px-3 py-1.5" title="Mark complete" />
              {['Task Details', 'Priority', 'Status', 'Due Date', 'Related To', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} className="py-6 text-center text-zinc-400"><Loader2 size={16} className="mx-auto animate-spin" /></td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-[12px] text-zinc-500">
                {tasks.length === 0 ? 'No tasks yet — add one to get started.' : 'No tasks match these filters.'}
              </td></tr>
            )}
            {rows.map((t) => {
              const status = displayStatus(t);
              const { cls: pCls, Icon: PIcon } = priorityBadge(t.priority);
              const { cls: sCls, Icon: SIcon } = statusBadge(status);
              const note = dueNote(t);
              const delegated = !!t.assignedBy;
              return (
                <tr key={t._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="px-3 py-1.5">
                    <input
                      type="checkbox"
                      checked={t.status === 'Completed'}
                      onChange={() => toggleDone(t)}
                      title={t.status === 'Completed' ? 'Mark as not done' : 'Mark as done'}
                      className="h-3.5 w-3.5 rounded border-zinc-300"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${delegated ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'}`}>
                        {delegated ? <Users size={14} /> : <ListChecks size={14} />}
                      </span>
                      <div className="min-w-0">
                        <p className={`text-[11.5px] font-medium ${t.status === 'Completed' ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{t.title}</p>
                        <p className="text-[10px] text-zinc-400">
                          {delegated ? `Assigned by ${t.assignedBy!.firstName} ${t.assignedBy!.lastName || ''}` : t.description || '—'}
                        </p>
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
                      <SIcon size={10} /> {status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <p className="text-[11px] text-zinc-500">{t.dueDate ? moment(t.dueDate).format('DD MMM YYYY') : '—'}</p>
                    <p className={`text-[10px] font-medium ${note.color}`}>{note.text}</p>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] text-zinc-500">{t.relatedTo || '—'}</td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onEdit(t)} title={delegated ? 'Update status' : 'Edit'} className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Pencil size={12} />
                      </button>
                      {!delegated && (
                        <button onClick={() => deleteTask(t)} title="Delete" className="grid h-6 w-6 place-items-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-rose-600">
                          <Trash2 size={12} />
                        </button>
                      )}
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
        <p className="text-[11.5px] text-zinc-400">
          {filtered.length === 0 ? 'No tasks' : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} tasks`}
        </p>
        <div className="flex items-center gap-1.5">
          <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
            .map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`grid h-7 w-7 place-items-center rounded-lg text-[11.5px] font-semibold ${n === currentPage ? 'bg-blue-600 text-white' : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              >
                {n}
              </button>
            ))}
          <button disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pl-2.5 pr-6 text-[11.5px] font-medium text-zinc-600 focus:outline-none"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500" />
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
        <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-blue-600 hover:bg-blue-50">
          <Plus size={14} /> Add Task
        </button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

const SUMMARY_COLORS: Record<DisplayStatus, string> = { 'To Do': '#3b82f6', 'In Progress': '#f59e0b', Completed: '#22c55e', Overdue: '#ef4444' };

function TaskSummaryCard({ tasks, onShow }: { tasks: MyTask[]; onShow: (t: TabName) => void }) {
  const data = (Object.keys(SUMMARY_COLORS) as DisplayStatus[]).map((key) => ({
    key, color: SUMMARY_COLORS[key], value: tasks.filter((t) => displayStatus(t) === key).length,
  }));
  const total = tasks.length;
  return (
    <Card title="My Task Summary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={total ? data : [{ key: 'none', value: 1, color: '#e4e4e7' }]}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={total ? 2 : 0}
                stroke="none"
              >
                {(total ? data : [{ key: 'none', color: '#e4e4e7' }]).map((d) => (
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
          {data.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.key}
              </span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                {d.value} ({total ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <LinkButton onClick={() => onShow('Overdue')}>View Overdue</LinkButton>
    </Card>
  );
}

function PriorityBreakdownCard({ tasks, onShow }: { tasks: MyTask[]; onShow: (t: TabName) => void }) {
  const open = tasks.filter((t) => t.status !== 'Completed');
  const rows = [
    { key: 'High Priority', p: 'High', color: 'bg-rose-500', accent: 'bg-rose-50 text-rose-600', icon: ArrowUp },
    { key: 'Medium Priority', p: 'Medium', color: 'bg-amber-500', accent: 'bg-amber-50 text-amber-600', icon: Minus },
    { key: 'Low Priority', p: 'Low', color: 'bg-emerald-500', accent: 'bg-emerald-50 text-emerald-600', icon: ArrowDown },
  ].map((r) => ({ ...r, value: open.filter((t) => t.priority === r.p).length }));
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <Card title="Open Tasks by Priority">
      <div className="space-y-3">
        {rows.map((p) => (
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
                <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.value / max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <LinkButton onClick={() => onShow('All Tasks')}>View All Tasks</LinkButton>
    </Card>
  );
}

function UpcomingTasksCard({ tasks, onShow }: { tasks: MyTask[]; onShow: (t: TabName) => void }) {
  const upcoming = tasks
    .filter((t) => t.status !== 'Completed' && t.dueDate && !moment(t.dueDate).isBefore(moment(), 'day'))
    .sort((a, b) => moment(a.dueDate).valueOf() - moment(b.dueDate).valueOf())
    .slice(0, 3);

  return (
    <Card title="Upcoming Tasks">
      <div className="space-y-1">
        {upcoming.length === 0 && <p className="p-1.5 text-[11.5px] text-zinc-400">Nothing due soon.</p>}
        {upcoming.map((u) => {
          const note = dueNote(u);
          const { cls } = priorityBadge(u.priority);
          return (
            <div key={u._id} className="flex min-w-0 items-center gap-3 rounded-xl p-1.5">
              <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                <span className="text-[9px] font-semibold uppercase text-zinc-400">{moment(u.dueDate).format('MMM')}</span>
                <span className="text-[10px] font-bold leading-none text-zinc-800">{moment(u.dueDate).format('DD')}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-zinc-800">{u.title}</p>
                <span className={`mt-0.5 inline-flex items-center rounded px-1.5 py-0.5 text-[9.5px] font-medium ${cls}`}>
                  {u.priority} Priority
                </span>
              </div>
              <p className={`shrink-0 text-[10.5px] font-medium ${note.color}`}>{note.text}</p>
            </div>
          );
        })}
      </div>

      <LinkButton onClick={() => onShow('To Do')}>View All To Do</LinkButton>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyTasks() {
  const { data, isLoading } = useMyTasks();
  const { data: team = [] } = useMyTeam();
  const [tab, setTab] = useState<TabName>('All Tasks');
  const [dialog, setDialog] = useState<TaskDialogMode | null>(null);

  const tasks = useMemo(() => data ?? [], [data]);

  const summaryStats: Stat[] = useMemo(() => [
    { icon: ListChecks, accent: 'bg-blue-50 text-blue-600', value: tasks.length, label: 'Total Tasks', detail: 'All your tasks' },
    { icon: CheckCircle2, accent: 'bg-emerald-50 text-emerald-600', value: tasks.filter((t) => t.status === 'Completed' && t.completedAt && moment(t.completedAt).isSame(moment(), 'month')).length, label: 'Completed', detail: 'This month' },
    { icon: Clock, accent: 'bg-amber-50 text-amber-500', value: tasks.filter((t) => displayStatus(t) === 'In Progress').length, label: 'In Progress', detail: 'Active tasks' },
    { icon: AlarmClock, accent: 'bg-rose-50 text-rose-600', value: tasks.filter(isOverdue).length, label: 'Overdue', detail: 'Need attention' },
    { icon: CalendarDays, accent: 'bg-violet-50 text-violet-600', value: tasks.filter((t) => t.status !== 'Completed' && t.dueDate && moment(t.dueDate).isSame(moment(), 'day')).length, label: 'Due Today', detail: 'Tasks due today' },
  ], [tasks]);

  return (
    <main className="mx-auto w-full space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader onAdd={() => setDialog({ kind: 'create' })} onAssign={team.length ? () => setDialog({ kind: 'assign' }) : undefined} />

      {/* Row 1 — five summary stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={{ ...stat, value: isLoading ? '…' : stat.value }} />
        ))}
      </div>

      {/* Row 2 — tasks table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <TasksTableCard
            tasks={tasks}
            isLoading={isLoading}
            tab={tab}
            setTab={setTab}
            onEdit={(task) => setDialog({ kind: 'edit', task })}
            onAdd={() => setDialog({ kind: 'create' })}
          />
        </div>
        <div className="min-w-0 space-y-2">
          <TaskSummaryCard tasks={tasks} onShow={setTab} />
          <PriorityBreakdownCard tasks={tasks} onShow={setTab} />
          <UpcomingTasksCard tasks={tasks} onShow={setTab} />
        </div>
      </div>

      <TaskDialog mode={dialog} onClose={() => setDialog(null)} />
    </main>
  );
}
