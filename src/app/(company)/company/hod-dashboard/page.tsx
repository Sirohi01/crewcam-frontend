'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Briefcase, ListTodo, CheckCircle2, Clock, Star, Trophy, Calendar,
  AlertOctagon, CalendarClock, CalendarCheck2, FolderPlus, ClipboardCheck,
  PlaneTakeoff, FileBarChart2, CalendarPlus, CircleDot, Video, Quote,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

/* Types  */

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

interface EmployeeRow {
  id: string;
  name: string;
  avatarUrl?: string;
  performanceScore: number;
  onTimePercent: number;
  tasksCompleted: number;
  totalTasks: number;
  status: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  overallRating: number;
}

interface TodayTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  dueTime: string;
  done: boolean;
}

interface TeamMemberAvailability {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'Available' | 'In a Meeting' | 'On Break' | 'Offline';
}

interface UpcomingMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface HodFeedback {
  name: string;
  role: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
}

interface DashboardData {
  manager: string;
  rangeLabel: string;
  stats: StatCard[];
  taskOverview: { name: string; value: number; color: string }[];
  totalTasks: number;
  onTimeTrend: { date: string; onTime: number; delayed: number }[];
  onTimeTotal: number;
  onTimePercent: number;
  delayedTotal: number;
  delayedPercent: number;
  performanceAvg: number;
  employees: EmployeeRow[];
  performanceTrend: { date: string;[key: string]: string | number }[];
  taskStatusSummary: { label: string; value: number; percent: number; color: string }[];
  totalTasksSummary: number;
  tasksDueThisWeek: { label: string; value: number; icon: string; color: string }[];
  recentAchievements: { text: string; time: string }[];
  todaysTasks: TodayTask[];
  teamAvailability: TeamMemberAvailability[];
  upcomingMeetings: UpcomingMeeting[];
  hodFeedback: HodFeedback;
}

/* Mock fetch — swap the resolve() for a real api.get() call */

async function fetchDashboardData(rangeLabel: string): Promise<DashboardData> {
  // Replace this block with: return (await api.get('/manager/dashboard-stats', { params: { range } })).data;
  return {
    manager: 'Sadhana Chaudhary',
    rangeLabel,
    stats: [
      { label: 'Total Team Size', value: '128', icon: <Users size={16} />, iconColor: 'text-white', iconBg: 'bg-indigo-500' },
      { label: 'Active Projects', value: '18', icon: <Briefcase size={16} />, iconColor: 'text-white', iconBg: 'bg-blue-500' },
      { label: 'Tasks In Progress', value: '162', icon: <ListTodo size={16} />, iconColor: 'text-white', iconBg: 'bg-amber-500' },
      { label: 'Tasks Completed', value: '428', icon: <CheckCircle2 size={16} />, iconColor: 'text-white', iconBg: 'bg-emerald-500' },
      { label: 'On-Time Completion', value: '87.6%', icon: <Clock size={16} />, iconColor: 'text-white', iconBg: 'bg-sky-500' },
      { label: 'Top Performer', value: 'Priya Singh', icon: <Trophy size={16} />, iconColor: 'text-white', iconBg: 'bg-orange-500' },
    ],
    totalTasks: 615,
    taskOverview: [
      { name: 'On Time', value: 538, color: '#22c55e' },
      { name: 'Delayed', value: 57, color: '#ef4444' },
      { name: 'In Progress', value: 20, color: '#f59e0b' },
    ],
    onTimeTrend: [
      { date: '1 Jun', onTime: 62, delayed: 10 },
      { date: '8 Jun', onTime: 71, delayed: 12 },
      { date: '15 Jun', onTime: 80, delayed: 9 },
      { date: '22 Jun', onTime: 88, delayed: 11 },
      { date: '30 Jun', onTime: 95, delayed: 8 },
    ],
    onTimeTotal: 538,
    onTimePercent: 87.6,
    delayedTotal: 57,
    delayedPercent: 9.3,
    performanceAvg: 4.6,
    employees: [
      { id: '1', name: 'Priya Singh', performanceScore: 4.9, onTimePercent: 98, tasksCompleted: 42, totalTasks: 43, status: 'Excellent', overallRating: 5 },
      { id: '2', name: 'Aman Kumar', performanceScore: 4.8, onTimePercent: 95, tasksCompleted: 38, totalTasks: 40, status: 'Excellent', overallRating: 5 },
      { id: '3', name: 'Rahul Verma', performanceScore: 4.7, onTimePercent: 93, tasksCompleted: 36, totalTasks: 39, status: 'Good', overallRating: 4 },
      { id: '4', name: 'Sneha Patel', performanceScore: 4.6, onTimePercent: 92, tasksCompleted: 35, totalTasks: 38, status: 'Good', overallRating: 4 },
      { id: '5', name: 'Vikram Joshi', performanceScore: 4.6, onTimePercent: 90, tasksCompleted: 32, totalTasks: 36, status: 'Good', overallRating: 4 },
    ],
    performanceTrend: [
      { date: '1 Jun', 'Priya Singh': 4.5, 'Aman Kumar': 4.3, 'Rahul Verma': 4.1, 'Sneha Patel': 3.9, 'Vikram Joshi': 3.7 },
      { date: '8 Jun', 'Priya Singh': 4.6, 'Aman Kumar': 4.4, 'Rahul Verma': 4.2, 'Sneha Patel': 4.0, 'Vikram Joshi': 3.9 },
      { date: '15 Jun', 'Priya Singh': 4.7, 'Aman Kumar': 4.5, 'Rahul Verma': 4.4, 'Sneha Patel': 4.2, 'Vikram Joshi': 4.1 },
      { date: '22 Jun', 'Priya Singh': 4.8, 'Aman Kumar': 4.6, 'Rahul Verma': 4.5, 'Sneha Patel': 4.4, 'Vikram Joshi': 4.3 },
      { date: '30 Jun', 'Priya Singh': 4.9, 'Aman Kumar': 4.8, 'Rahul Verma': 4.7, 'Sneha Patel': 4.6, 'Vikram Joshi': 4.6 },
    ],
    taskStatusSummary: [
      { label: 'Completed On Time', value: 538, percent: 87.6, color: 'bg-emerald-500' },
      { label: 'Completed Delayed', value: 57, percent: 9.3, color: 'bg-amber-500' },
      { label: 'In Progress', value: 20, percent: 3.1, color: 'bg-blue-500' },
      { label: 'Not Started', value: 12, percent: 2.0, color: 'bg-zinc-400' },
    ],
    totalTasksSummary: 615,
    tasksDueThisWeek: [
      { label: 'High Priority Tasks', value: 18, icon: 'alert', color: 'text-indigo-500' },
      { label: 'Tasks Due Today', value: 7, icon: 'clock', color: 'text-rose-500' },
      { label: 'Tasks Due This Week', value: 34, icon: 'calendar', color: 'text-emerald-500' },
      { label: 'Overdue Tasks', value: 23, icon: 'overdue', color: 'text-amber-500' },
    ],
    recentAchievements: [
      { text: 'Priya Singh completed 100% tasks on time for this month', time: '2 hours ago' },
      { text: 'Aman Kumar delivered "Mobile App Development" ahead of schedule', time: '1 day ago' },
      { text: 'Rahul Verma resolved critical issue in "ERP Integration" project', time: '2 days ago' },
      { text: 'Sneha Patel received appreciation from client for UI/UX improvements', time: '3 days ago' },
    ],
    todaysTasks: [
      { id: 't1', title: 'Review sprint backlog with QA team', assignee: 'Priya Singh', priority: 'High', dueTime: '11:00 AM', done: false },
      { id: 't2', title: 'Submit monthly attendance report', assignee: 'Aman Kumar', priority: 'Medium', dueTime: '01:00 PM', done: false },
      { id: 't3', title: 'Client call — ERP Integration status', assignee: 'Rahul Verma', priority: 'High', dueTime: '03:30 PM', done: false },
      { id: 't4', title: 'Update onboarding checklist', assignee: 'Sneha Patel', priority: 'Low', dueTime: '05:00 PM', done: true },
      //   { id: 't5', title: 'Approve pending leave requests', assignee: 'Vikram Joshi', priority: 'Medium', dueTime: '06:00 PM', done: false },
    ],
    teamAvailability: [
      { id: 'm1', name: 'Priya Singh', status: 'Available' },
      { id: 'm2', name: 'Aman Kumar', status: 'In a Meeting' },
      { id: 'm3', name: 'Rahul Verma', status: 'Available' },
      { id: 'm4', name: 'Sneha Patel', status: 'On Break' },
      { id: 'm5', name: 'Vikram Joshi', status: 'Available' },
    ],
    upcomingMeetings: [
      { id: 'mt1', title: 'Team Standup', date: 'Daily', time: '10:00 AM - 10:15 AM' },
      { id: 'mt2', title: 'Project Review — Website Redesign', date: '02 Jun 2026', time: '11:00 AM - 12:00 PM' },
      { id: 'mt3', title: 'Sprint Planning', date: '04 Jun 2026', time: '02:00 PM - 03:00 PM' },
      { id: 'mt4', title: 'Retrospective Meeting', date: '06 Jun 2026', time: '04:00 PM - 05:00 PM' },
    ],
    hodFeedback: {
      name: 'Ankit Malhotra',
      role: 'Head of Development',
      quote: '"Rajesh is doing a great job leading the team. His communication, problem-solving approach and support to the team are excellent. Keep up the good work!"',
      rating: 5,
    },
  };
}

const RANGE_LABELS: Record<'today' | 'week' | 'month' | 'custom', string> = {
  today: 'Today',
  week: 'This Week',
  month: '01 Jun 2026 - 30 Jun 2026',
  custom: 'Custom Range',
};

function statusBadgeClasses(status: EmployeeRow['status']) {
  switch (status) {
    case 'Excellent':
      return 'bg-emerald-100 text-emerald-700';
    case 'Good':
      return 'bg-blue-100 text-blue-700';
    case 'Average':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-red-100 text-red-700';
  }
}

function priorityBadgeClasses(priority: TodayTask['priority']) {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700';
    case 'Medium':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-zinc-100 text-zinc-600';
  }
}

function availabilityDotClasses(status: TeamMemberAvailability['status']) {
  switch (status) {
    case 'Available':
      return 'bg-emerald-500';
    case 'In a Meeting':
      return 'bg-amber-500';
    case 'On Break':
      return 'bg-sky-500';
    default:
      return 'bg-zinc-400';
  }
}

function availabilityTextClasses(status: TeamMemberAvailability['status']) {
  switch (status) {
    case 'Available':
      return 'text-emerald-600';
    case 'In a Meeting':
      return 'text-amber-600';
    case 'On Break':
      return 'text-sky-600';
    default:
      return 'text-zinc-500';
  }
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={11} className={i < count ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />
      ))}
    </div>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export default function ManagerDashboardPage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['manager', 'dashboard-stats', date],
    queryFn: () => fetchDashboardData(date),
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 p-3 pb-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {data?.manager ?? '—'} 👋
          </h1>
          <p className="text-[12px] text-zinc-500">Here's the all overview of your department.</p>
        </div>
        <div className="flex items-center gap-2 relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 flex items-center gap-2 px-3 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Top stat cards — all 6 in a single row */}
      <div className="grid grid-cols-6 gap-3">
        {(data?.stats ?? Array.from({ length: 6 })).map((s: any, i) => (
          <Card key={i} className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${s?.iconBg ?? 'bg-zinc-200'} ${s?.iconColor ?? 'text-white'}`}>
                {s?.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-zinc-500 truncate">{s?.label ?? ''}</p>
                <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight truncate">
                  {isLoading ? '—' : s?.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Completion / Today's Tasks / Tasks Due This Week */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Task Completion Overview</CardTitle>
            <span className="text-[10px] text-zinc-400">{date}</span>
          </CardHeader>
          <CardContent className="p-3 flex-1 flex items-center justify-center gap-6 overflow-hidden">
            <div className="relative h-[130px] w-[130px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.taskOverview ?? []}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {(data?.taskOverview ?? []).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-semibold text-zinc-900">{data?.totalTasks ?? '—'}</span>
                <span className="text-[9px] text-zinc-400">Total Tasks</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {(data?.taskOverview ?? []).map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] w-[110px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-zinc-600">{t.name}</span>
                  <span className="font-medium text-zinc-900 ml-auto">{t.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Today's Tasks</CardTitle>
            <span className="text-[10px] text-zinc-400">{(data?.todaysTasks ?? []).length} tasks</span>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {(data?.todaysTasks ?? []).map((t) => (
                <div key={t.id} className="flex items-start gap-2 p-2.5">
                  <CircleDot size={13} className={`mt-0.5 shrink-0 ${t.done ? 'text-emerald-500' : 'text-zinc-300'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] leading-snug ${t.done ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{t.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-zinc-400">{t.assignee}</span>
                      <span className="text-[9px] text-zinc-300">•</span>
                      <span className="text-[9px] text-zinc-400">{t.dueTime}</span>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium shrink-0 ${priorityBadgeClasses(t.priority)}`}>
                    {t.priority}
                  </span>
                </div>
              ))}
              {!isLoading && (data?.todaysTasks ?? []).length === 0 && (
                <div className="p-8 text-center text-[11px] text-zinc-400">No tasks scheduled for today.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Tasks Due This Week</CardTitle>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-2 flex-1 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/50 overflow-auto">
            {(data?.tasksDueThisWeek ?? []).map((t, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-1">
                <div className="flex items-center gap-2">
                  {t.icon === 'alert' && <AlertOctagon size={13} className={t.color} />}
                  {t.icon === 'clock' && <Clock size={13} className={t.color} />}
                  {t.icon === 'calendar' && <CalendarCheck2 size={13} className={t.color} />}
                  {t.icon === 'overdue' && <CalendarClock size={13} className={t.color} />}
                  <span className="text-[11px] text-zinc-600">{t.label}</span>
                </div>
                <span className="text-[12px] font-semibold text-zinc-900">{t.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Employee tables */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Employees Who Complete Tasks On Time</CardTitle>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-zinc-400 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">On-Time</th>
                  <th className="px-3 py-2 font-medium">Done / Total</th>
                  <th className="px-3 py-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {(data?.employees ?? []).map((e) => (
                  <tr key={e.id}>
                    <td className="px-3 py-2 font-medium text-zinc-900">{e.name}</td>
                    <td className="px-3 py-2 text-zinc-600">{e.onTimePercent}%</td>
                    <td className="px-3 py-2 text-zinc-600">{e.tasksCompleted} / {e.totalTasks}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${statusBadgeClasses(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Top Employees (Overall)</CardTitle>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-zinc-400 uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2 font-medium">Rank</th>
                  <th className="px-3 py-2 font-medium">Employee</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {(data?.employees ?? []).map((e, i) => (
                  <tr key={e.id}>
                    <td className="px-3 py-2 text-zinc-500">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-zinc-900">{e.name}</td>
                    <td className="px-3 py-2 text-zinc-600">{e.performanceScore.toFixed(1)} / 5</td>
                    <td className="px-3 py-2 text-right"><Stars count={e.overallRating} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
            <CardTitle className="text-[12px] font-semibold">Task Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex flex-col gap-3 flex-1 overflow-auto">
            {(data?.taskStatusSummary ?? []).map((t, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-zinc-600">{t.label}</span>
                  <span className="font-medium text-zinc-900">{t.value} ({t.percent}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.percent}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-auto pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500">Total</span>
              <span className="font-semibold text-zinc-900">{data?.totalTasksSummary}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Team Members Availability / Upcoming Meetings / HOD-Manager Feedback */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Team Members Availability</CardTitle>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {(data?.teamAvailability ?? []).map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 p-2.5">
                <Avatar name={m.name} />
                <span className="text-[11px] font-medium text-zinc-700 flex-1 truncate">{m.name}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full ${availabilityDotClasses(m.status)}`} />
                  <span className={availabilityTextClasses(m.status)}>{m.status}</span>
                </span>
              </div>
            ))}
            {!isLoading && (data?.teamAvailability ?? []).length === 0 && (
              <div className="p-8 text-center text-[11px] text-zinc-400">No team members found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-[12px] font-semibold">Upcoming Meetings</CardTitle>
            <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">View Calendar</button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {(data?.upcomingMeetings ?? []).map((mt) => (
              <div key={mt.id} className="flex items-start gap-2.5 p-2.5">
                <div className="h-7 w-7 shrink-0 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Video size={13} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-zinc-800 leading-snug truncate">{mt.title}</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">{mt.date} • {mt.time}</p>
                </div>
                <button className="text-[9px] font-medium px-2 py-1 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 shrink-0">
                  Join
                </button>
              </div>
            ))}
            {!isLoading && (data?.upcomingMeetings ?? []).length === 0 && (
              <div className="p-8 text-center text-[11px] text-zinc-400">No upcoming meetings.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[300px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
            <CardTitle className="text-[12px] font-semibold">HOD / Manager Feedback</CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-1 flex flex-col">
            {data?.hodFeedback && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Quote size={18} className="text-indigo-200 mb-1" />
                  <p className="text-[11px] text-zinc-600 leading-relaxed">{data.hodFeedback.quote}</p>
                </div>
                <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-zinc-100">
                  <Avatar name={data.hodFeedback.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-zinc-900 truncate">{data.hodFeedback.name}</p>
                    <p className="text-[9px] text-zinc-400 truncate">{data.hodFeedback.role}</p>
                  </div>
                  <Stars count={data.hodFeedback.rating} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements / quick actions */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[260px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
            <CardTitle className="text-[12px] font-semibold">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {(data?.recentAchievements ?? []).map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5">
                <Trophy size={13} className="text-amber-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-700 leading-snug">{a.text}</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg h-[260px] flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
            <CardTitle className="text-[12px] font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-1 grid grid-cols-3 gap-2 content-center">
            <QuickAction icon={<FolderPlus size={16} />} label="Add Project" color="text-indigo-500 bg-indigo-50" />
            <QuickAction icon={<ClipboardCheck size={16} />} label="Assign Task" color="text-blue-500 bg-blue-50" />
            <QuickAction icon={<PlaneTakeoff size={16} />} label="Approve Leave" color="text-emerald-500 bg-emerald-50" />
            <QuickAction icon={<FileBarChart2 size={16} />} label="Generate Report" color="text-violet-500 bg-violet-50" />
            <QuickAction icon={<CalendarPlus size={16} />} label="Schedule Meeting" color="text-amber-500 bg-amber-50" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className={`h-8 w-8 rounded-md flex items-center justify-center ${color}`}>{icon}</div>
      <span className="text-[9px] font-medium text-zinc-600 dark:text-zinc-300 text-center leading-tight">{label}</span>
    </button>
  );
}