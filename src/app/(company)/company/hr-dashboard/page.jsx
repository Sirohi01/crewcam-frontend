'use client';

import React from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  Briefcase, Users, FileText, CalendarCheck, CheckCircle2, UserPlus,
  ChevronDown, SlidersHorizontal, ArrowUpRight, Plus, Search,
  ClipboardList, FileBarChart2, AlertTriangle, Bell, FileWarning,
} from 'lucide-react';

// ───────────────────────────────────────────────────────────────────────────

const statCards = [
  { label: 'Total Jobs', value: '28', icon: Briefcase, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Total Candidates', value: '2,350', icon: Users, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Total Applications', value: '3,680', icon: FileText, accent: 'bg-violet-50 text-violet-600' },
  { label: 'Total Interviews', value: '580', icon: CalendarCheck, accent: 'bg-amber-50 text-amber-600' },
  { label: 'Offers Made', value: '76', icon: CheckCircle2, accent: 'bg-teal-50 text-teal-600' },
  { label: 'Hires This Month', value: '18', icon: UserPlus, accent: 'bg-indigo-50 text-indigo-600' },
];

const applicationOverview = [
  { day: '21 May', value: 120 }, { day: '22 May', value: 240 }, { day: '23 May', value: 260 },
  { day: '24 May', value: 360 }, { day: '25 May', value: 200 }, { day: '26 May', value: 300 },
  { day: '27 May', value: 250 },
];

const applicationsBySource = [
  { name: 'LinkedIn', value: 42, color: '#3b82f6' },
  { name: 'Naukri', value: 25, color: '#22c55e' },
  { name: 'Indeed', value: 15, color: '#f59e0b' },
  { name: 'Employee Referral', value: 10, color: '#8b5cf6' },
  { name: 'Others', value: 8, color: '#ef4444' },
];

const hiringPipeline = [
  { name: 'Applied',    value: 3680, pct: '100.0%', fill: '#6366f1' },
  { name: 'Screening',  value: 1850, pct: '50.3%',  fill: '#f59e0b' },
  { name: 'Assessment', value: 950,  pct: '25.8%',  fill: '#10b981' },
  { name: 'Interview',  value: 580,  pct: '15.8%',  fill: '#3b82f6' },
  { name: 'Offer',      value: 120,  pct: '3.3%',   fill: '#f97316' },
  { name: 'Hired',      value: 18,   pct: '0.5%',   fill: '#22c55e' },
];

const applicationsTrend = [
  { day: '1 May', value: 280 }, { day: '10 May', value: 200 }, { day: '20 May', value: 340 },
  { day: '28 May', value: 260 },
];

const quickActions = [
  { label: 'Post a New Job', icon: Plus },
  { label: 'Search Candidates', icon: Search },
  { label: 'Schedule Interview', icon: CalendarCheck },
  { label: 'Review Applications', icon: ClipboardList },
  { label: 'Generate Report', icon: FileBarChart2 },
];

const tasks = [
  { label: 'Review pending applications', count: 12 },
  { label: 'Schedule Interviews', count: 5 },
  { label: 'Follow up with candidates', count: 8 },
  { label: 'Update job descriptions', count: 2 },
  { label: 'Prepare offer letters', count: 3 },
];

const recentApplications = [
  { name: 'Amit Verma', role: 'Frontend Developer', source: 'LinkedIn', date: '27 May 2025', status: 'New', style: 'bg-blue-50 text-blue-600', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { name: 'Sneha Singh', role: 'HR Executive', source: 'Naukri', date: '27 May 2025', status: 'Screening', style: 'bg-amber-50 text-amber-600', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { name: 'Siddharth Jain', role: 'Backend Developer', source: 'Referral', date: '26 May 2025', status: 'Shortlisted', style: 'bg-emerald-50 text-emerald-600', avatar: 'https://randomuser.me/api/portraits/men/13.jpg' },
  { name: 'Pooja Mehta', role: 'UI/UX Designer', source: 'Indeed', date: '26 May 2025', status: 'Interview', style: 'bg-violet-50 text-violet-600', avatar: 'https://randomuser.me/api/portraits/women/14.jpg' },
  { name: 'Rahul Das', role: 'DevOps Engineer', source: 'LinkedIn', date: '25 May 2025', status: 'New', style: 'bg-blue-50 text-blue-600', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
];

const upcomingInterviews = [
  { time: '10:00 AM', name: 'Rohit Kumar', role: 'SDE', stage: 'Technical Round', style: 'bg-blue-50 text-blue-600', avatar: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { time: '11:30 AM', name: 'Anjali Mehta', role: 'HR Executive', stage: 'Screening', style: 'bg-amber-50 text-amber-600', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { time: '01:00 PM', name: 'Vikram Singh', role: 'Product Manager', stage: 'HR Round', style: 'bg-violet-50 text-violet-600', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { time: '03:00 PM', name: 'Sneha Patel', role: 'Marketing Manager', stage: 'Final Round', style: 'bg-emerald-50 text-emerald-600', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
];

const todaysSchedule = [
  { time: '10:00 AM', title: 'Interview - Software Engineer', name: 'Rohit Kumar', tag: 'Technical Round', style: 'bg-blue-50 text-blue-600', avatar: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { time: '11:30 AM', title: 'Screening Call - HR Executive', name: 'Anjali Mehta', tag: 'Screening', style: 'bg-amber-50 text-amber-600', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { time: '01:00 PM', title: 'HR Round - Product Manager', name: 'Vikram Singh', tag: 'HR Round', style: 'bg-violet-50 text-violet-600', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { time: '03:00 PM', title: 'Technical Round - DevOps', name: 'Neha Verma', tag: 'Technical', style: 'bg-blue-50 text-blue-600', avatar: 'https://randomuser.me/api/portraits/women/25.jpg' },
  { time: '04:30 PM', title: 'Final Round - UI/UX Designer', name: 'Sneha Patel', tag: 'Final Round', style: 'bg-emerald-50 text-emerald-600', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
];

const importantAlerts = [
  { icon: AlertTriangle, color: 'text-rose-500', text: '5 interviews are scheduled today', sub: 'Today, 9:00 AM' },
  { icon: Bell, color: 'text-amber-500', text: '12 applications are pending review', sub: 'Today, 8:30 AM' },
  { icon: FileWarning, color: 'text-blue-500', text: '3 offers are awaiting approval', sub: 'Yesterday, 6:15 PM' },
  { icon: FileWarning, color: 'text-blue-500', text: '3 offers are awaiting approval', sub: 'Yesterday, 6:15 PM' },
  { icon: FileWarning, color: 'text-blue-500', text: '3 offers are awaiting approval', sub: 'Yesterday, 6:15 PM' },
];

const documentExpiry = [
  { label: 'Offer Letter - Rohit Kumar', sub: 'Expires in 3 days' },
  { label: 'ID Proof - Anjali Mehta', sub: 'Expires in 7 days' },
  { label: 'Resume - Vikram Singh', sub: 'Expires in 10 days' },
];

const offerStats = [
  { name: 'Accepted', value: 18, pct: '62.1%', color: '#22c55e' },
  { name: 'Pending', value: 8, pct: '27.6%', color: '#f59e0b' },
  { name: 'Declined', value: 3, pct: '10.3%', color: '#ef4444' },
];

const timeToHireTrend = [
  { day: 'W1', value: 26 }, { day: 'W2', value: 24 }, { day: 'W3', value: 22 },
  { day: 'W4', value: 25 }, { day: 'W5', value: 24 },
];

const topDepartments = [
  { name: 'Engineering', value: 35 },
  { name: 'Product', value: 18 },
  { name: 'Design', value: 12 },
  { name: 'Marketing', value: 8 },
  { name: 'Human Resources', value: 5 },
];

const experienceLevel = [
  { name: '0 - 2 Years', value: 35, color: '#3b82f6' },
  { name: '2 - 5 Years', value: 30, color: '#22c55e' },
  { name: '5 - 8 Years', value: 25, color: '#f59e0b' },
  { name: '8+ Years', value: 10, color: '#8b5cf6' },
];

const candidateLocations = [
  { name: 'Noida', pct: 40 },
  { name: 'Bangalore', pct: 25 },
  { name: 'Delhi', pct: 15 },
  { name: 'Mumbai', pct: 10 },
  { name: 'Hyderabad', pct: 10 },
];

// ───────────────────────────────────────────────────────────────────────────
// Shared pieces
// ───────────────────────────────────────────────────────────────────────────

function Card({ title, action, className = '', children }) {
  return (
    <div className={`rounded-xl border border-zinc-200/80 bg-white p-2.5 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {title && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3 className="text-[11.5px] font-semibold text-zinc-900 whitespace-nowrap">{title}</h3>
          {action}
        </div>
      )}
      {children && <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">{children}</div>}
    </div>
  );
}

function ViewAllLink({ label = 'View All' }) {
  return (
    <button type="button" className="shrink-0 text-[10px] font-semibold text-violet-600 hover:text-violet-700">{label}</button>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Header
// ───────────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-[17px] font-bold text-zinc-900">Welcome back, Priya! 👋</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600">
          <CalendarCheck size={13} className="text-zinc-400" />
          Tuesday 30 Jun, 2026
          <ChevronDown size={12} className="text-zinc-400" />
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50">
          <SlidersHorizontal size={12} /> Filters
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Top stat strip — 6 equal cards in one row
// ───────────────────────────────────────────────────────────────────────────

function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {statCards.map((s) => (
        <div key={s.label} className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm overflow-hidden relative">
          <div className={`absolute right-0 top-0 h-14 w-14 translate-x-4 -translate-y-4 rounded-full opacity-[.07] ${s.accent}`} />
          <div className="flex items-center gap-2">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.accent}`}>
              <s.icon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-zinc-500 leading-tight truncate">{s.label}</p>
              <p className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">{s.value}</p>
              <p className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-600 truncate leading-tight">
                <ArrowUpRight size={9} className="shrink-0" />{s.delta}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Row 1: Application Overview / Applications by Source / Hiring Pipeline
// ───────────────────────────────────────────────────────────────────────────

function ApplicationOverview() {
  return (
    <Card
      title="Application Overview"
      action={<span className="flex shrink-0 items-center gap-0.5 text-[10px] text-zinc-400">Last 7 Days <ChevronDown size={11} /></span>}
      className="h-[340px]"
    >
      <div style={{ width: '100%', height: 190 }}>
        <ResponsiveContainer>
          <LineChart data={applicationOverview} margin={{ top: 5, left: -5, right: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f1f4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} width={28} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.25} dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ApplicationsBySource() {
  return (
    <Card title="Applications by Source" className="h-[340px]">
      <div className="flex items-center justify-center gap-4 h-full">
        <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={applicationsBySource} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={2} stroke="none">
                {applicationsBySource.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center leading-none">
              <p className="text-[13px] font-bold text-zinc-900">3,680</p>
              <p className="text-[8px] text-zinc-400">Total</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          {applicationsBySource.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="truncate">{s.name}</span>
              <span className="ml-auto shrink-0 font-semibold text-zinc-700">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function HiringPipeline() {
  const max = hiringPipeline[0].value;
  return (
    <Card title="Hiring Pipeline" className="h-[340px]">
      <div className="space-y-1.5">
        {hiringPipeline.map((stage) => (
          <div
            key={stage.name}
            className="ml-auto flex h-[22px] items-center justify-center rounded text-[9.5px] font-semibold text-white"
            style={{ width: `${Math.max((stage.value / max) * 100, 20)}%`, backgroundColor: stage.fill }}
          >
            {stage.value.toLocaleString()}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-0.5">
        {hiringPipeline.map((stage) => (
          <div key={stage.name} className="flex items-center justify-between text-[9.5px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stage.fill }} />
              {stage.name}
            </span>
            <span className="font-semibold text-zinc-700">{stage.pct}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Row 2: Applications Trend / Quick Actions / Tasks
// ───────────────────────────────────────────────────────────────────────────

function ApplicationsTrend() {
  return (
    <Card title="Applications Trend" action={<span className="shrink-0 text-[10px] text-zinc-400">This Month</span>} className="h-[340px]">
      <div className="flex flex-col justify-center h-full">
        <p className="text-[18px] font-bold text-zinc-900 leading-none">3,680</p>
        <p className="mb-3 mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
          <ArrowUpRight size={11} /> 22% vs last month
        </p>
        <div style={{ width: '100%', height: 100 }}>
          <ResponsiveContainer>
            <LineChart data={applicationsTrend} margin={{ top: 2, left: 0, right: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card title="Quick Actions" className="h-[340px]">
      <div className="space-y-1">
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-1 py-0.5 text-left text-violet-600 hover:bg-violet-50/60"
          >
            <a.icon size={13} className="shrink-0" />
            <span className="text-[11px] font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Row 3: Recent Applications / Upcoming Interviews / Today's Schedule
// ───────────────────────────────────────────────────────────────────────────

function RecentApplications() {
  
  return (
    <Card title="Recent Applications" action={<ViewAllLink />} className="h-[340px]">
      <div className="overflow-y-auto overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-zinc-200">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left text-[9.5px] text-zinc-400">
              <th className="pb-1.5 font-medium">Candidate</th>
              <th className="pb-1.5 font-medium">Job Role</th>
              <th className="pb-1.5 font-medium">Source</th>
              <th className="pb-1.5 font-medium">Applied On</th>
              <th className="pb-1.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map((c) => (
              <tr key={c.name} className="border-t border-zinc-50 hover:bg-zinc-50 transition-colors">
                <td className="py-1.5 pr-1">
                  <div className="flex items-center gap-1.5">
                    <img src={c.avatar} alt={c.name} className="h-5 w-5 shrink-0 rounded-full object-cover" />
                    <span className="truncate text-[10.5px] font-medium text-zinc-800">{c.name}</span>
                  </div>
                </td>
                <td className="truncate py-1.5 pr-1 text-[10.5px] text-zinc-600">{c.role}</td>
                <td className="truncate py-1.5 pr-1 text-[10.5px] text-zinc-600">{c.source}</td>
                <td className="truncate py-1.5 pr-1 text-[10px] text-zinc-500">{c.date}</td>
                <td className="py-1.5">
                  <span className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${c.style}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function UpcomingInterviews() {
  return (
    <Card title="Upcoming Interviews" action={<ViewAllLink />} className="h-[340px]">
      <div className="space-y-2">
        {upcomingInterviews.map((i) => (
          <div key={i.name} className="flex items-center gap-2">
            <span className="w-[52px] shrink-0 text-[9.5px] font-semibold text-zinc-500">{i.time}</span>
            <img src={i.avatar} alt={i.name} className="h-6 w-6 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-semibold text-zinc-800">{i.name}</p>
              <p className="truncate text-[9px] text-zinc-400">{i.role}</p>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${i.style}`}>{i.stage}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TodaysSchedule() {
  return (
    <Card title="Today's Schedule" action={<ViewAllLink label="View Calendar" />} className="h-[340px]">
      <div className="space-y-2">
        {todaysSchedule.map((e) => (
          <div key={e.time} className="flex items-start gap-2">
            <span className="w-[52px] shrink-0 pt-0.5 text-[9.5px] font-semibold text-zinc-500">{e.time}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-semibold text-zinc-800">{e.title}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <img src={e.avatar} alt={e.name} className="h-4 w-4 rounded-full object-cover" />
                <span className="truncate text-[9px] text-zinc-400">{e.name}</span>
              </div>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${e.style}`}>{e.tag}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Row 4: Important Alerts / Document Expiry / Offer Statistics / Time to Hire
// ───────────────────────────────────────────────────────────────────────────

function ImportantAlerts() {
  return (
    <Card title="Important Alerts" action={<ViewAllLink />} className="h-[340px]">
      <div className="space-y-2.5">
        {importantAlerts.map((a) => (
          <div key={a.text} className="flex items-start gap-2">
            <a.icon size={13} className={`mt-0.5 shrink-0 ${a.color}`} />
            <div className="min-w-0">
              <p className="text-[10.5px] font-medium leading-tight text-zinc-700">{a.text}</p>
              <p className="text-[9px] text-zinc-400">{a.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DocumentExpiry() {
  return (
    <Card title="Document Expiry" action={<ViewAllLink />} className="h-[340px]">
      <div className="space-y-2">
        {documentExpiry.map((d) => (
          <div key={d.label} className="rounded-lg bg-rose-50 px-2 py-1.5 text-rose-600">
            <p className="truncate text-[10.5px] font-semibold leading-tight">{d.label}</p>
            <p className="text-[9px] opacity-80">{d.sub}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OfferStatistics() {
  return (
    <Card title="Offer Statistics" action={<span className="shrink-0 text-[10px] text-zinc-400">This Month</span>} className="h-[340px]">
      <div className="flex items-center gap-2">
        <div className="shrink-0" style={{ width: 84, height: 84 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={offerStats} dataKey="value" nameKey="name" innerRadius={24} outerRadius={40} paddingAngle={3} stroke="none">
                {offerStats.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="min-w-0 space-y-1">
          {offerStats.map((s) => (
            <p key={s.name} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              {s.name} <span className="font-semibold text-zinc-800">{s.value} ({s.pct})</span>
            </p>
          ))}
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-zinc-50 pt-2">
        <div>
          <p className="text-[14px] font-bold leading-none text-zinc-900">29</p>
          <p className="text-[9px] text-zinc-400">Total Offers</p>
        </div>
        <div>
          <p className="text-[14px] font-bold leading-none text-zinc-900">62.1%</p>
          <p className="text-[9px] text-zinc-400">Acceptance Rate</p>
        </div>
      </div>
    </Card>
  );
}

function TimeToHire() {
  return (
    <Card title="Time to Hire" action={<span className="shrink-0 text-[10px] text-zinc-400">This Month</span>} className="h-[340px]">
      <p className="text-[18px] font-bold leading-none text-zinc-900">24 <span className="text-[11px] font-semibold text-zinc-400">Days</span></p>
      <p className="mb-1.5 mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
        <ArrowUpRight size={11} className="-rotate-45" /> 6 days vs last month
      </p>
      <div style={{ width: '100%', height: 60 }}>
        <ResponsiveContainer>
          <LineChart data={timeToHireTrend} margin={{ top: 2, left: 0, right: 0, bottom: 0 }}>
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-[9.5px] text-zinc-400">
        <span>Best <span className="font-semibold text-zinc-700">18 Days</span></span>
        <span>Average <span className="font-semibold text-zinc-700">24 Days</span></span>
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Row 5: Top Hiring Departments / Candidate Demographics
// ───────────────────────────────────────────────────────────────────────────

function TopHiringDepartments() {
  const max = Math.max(...topDepartments.map((d) => d.value));
  return (
    <Card title="Top Hiring Departments" action={<span className="shrink-0 text-[10px] text-zinc-400">This Year</span>} className="h-[340px]">
      <div className="space-y-2.5">
        {topDepartments.map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex items-center justify-between text-[10.5px]">
              <span className="text-zinc-600">{d.name}</span>
              <span className="font-semibold text-zinc-800">{d.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(d.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CandidateDemographics() {
  return (
    <Card title="Candidate Demographics" action={<ViewAllLink label="View Report" />} className="h-[340px]">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Experience Level</p>
          <div style={{ width: '100%', height: 110 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={experienceLevel} dataKey="value" nameKey="name" innerRadius={28} outerRadius={46} paddingAngle={2} stroke="none">
                  {experienceLevel.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-0.5">
            {experienceLevel.map((e) => (
              <div key={e.name} className="flex items-center gap-1 text-[9px] text-zinc-500">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="truncate">{e.name}</span>
                <span className="ml-auto shrink-0 font-semibold text-zinc-700">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold text-zinc-500">Location</p>
          <div className="space-y-1.5">
            {candidateLocations.map((l) => (
              <div key={l.name}>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>{l.name}</span>
                  <span className="font-semibold text-zinc-700">{l.pct}%</span>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full rounded-full bg-violet-500" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────────────────

export default function RecruitmentDashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1500px] space-y-2.5 p-3">
        <Header />
        <StatsStrip />

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <ApplicationOverview />
          <ApplicationsBySource />
          <HiringPipeline />
        </div>

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <ApplicationsTrend />
          <QuickActions />
          <TodaysSchedule />
        </div>

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <RecentApplications />
          <UpcomingInterviews />
          <TopHiringDepartments />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <ImportantAlerts />
          <DocumentExpiry />
          <OfferStatistics />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <TimeToHire />
          <CandidateDemographics />
        </div>
      </div>
    </div>
  );
}