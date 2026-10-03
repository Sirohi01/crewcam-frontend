'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Briefcase, Users, User, CalendarCheck, FileCheck2, UserCheck, Clock3,
  ClipboardList, UserPlus, ChevronRight, Bot,
  ArrowUpRight, ArrowDownRight, ChevronDown, RefreshCw, Send, Rocket,
  FileText, FileBarChart2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// ─────────────────────────────────────────────────────────────────────────
// Dummy data — this page mirrors the approved design mockup 1:1. Swap these
// constants for live API data once the backend endpoints are wired up.
// ─────────────────────────────────────────────────────────────────────────

const KPIS = [
  { label: 'Open Positions', value: '42', icon: Briefcase, accent: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400', trend: '8 from last month', up: true },
  { label: 'Active Candidates', value: '368', icon: Users, accent: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400', trend: '15% from last month', up: true },
  { label: 'Interviews Scheduled', value: '57', icon: CalendarCheck, accent: 'bg-violet-50 text-indigo-700 dark:bg-violet-500/10 dark:text-violet-400', trend: '12% from last month', up: true },
  { label: 'Offers Released', value: '18', icon: FileCheck2, accent: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400', trend: '5 from last month', up: true },
  { label: 'Positions Filled', value: '24', icon: UserCheck, accent: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400', trend: '10 from last month', up: true },
  { label: 'Time to Hire (Avg)', value: '18 Days', icon: Clock3, accent: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400', trend: '2 Days from last month', up: false },
];

const PIPELINE_STAGES = [
  { name: 'Applications Received', value: 1245, icon: Briefcase, color: '#1e40af' },
  { name: 'Shortlisted', value: 325, icon: User, color: '#0ea5e9' },
  { name: 'HR Screening', value: 180, icon: Users, color: '#14b8a6' },
  { name: 'Technical Interview', value: 95, icon: Users, color: '#22c55e' },
  { name: 'Final Interview', value: 52, icon: FileCheck2, color: '#f59e0b' },
  { name: 'Offer Released', value: 18, icon: User, color: '#ec4899' },
  { name: 'Joined', value: 16, icon: Users, color: '#8b5cf6' },
];

const HIRING_OVERVIEW = [
  { name: 'Sales', value: 12, pct: 29, color: '#3b82f6' },
  { name: 'IT', value: 8, pct: 19, color: '#8b5cf6' },
  { name: 'Marketing', value: 8, pct: 19, color: '#f59e0b' },
  { name: 'HR', value: 5, pct: 12, color: '#22c55e' },
  { name: 'Operations', value: 6, pct: 14, color: '#14b8a6' },
  { name: 'Finance', value: 3, pct: 7, color: '#ec4899' },
];
const TOTAL_OPEN_POSITIONS = HIRING_OVERVIEW.reduce((sum, d) => sum + d.value, 0);

const ACTIONS = [
  { label: 'Create Job Requisition', href: '/dashboard/hiring/manpower/new', icon: ClipboardList, accent: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
  { label: 'Post New Job', href: '/dashboard/hiring/manpower', icon: Send, accent: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' },
  { label: 'Add Candidate', href: '/dashboard/hiring/candidates/new', icon: UserPlus, accent: 'bg-violet-50 text-indigo-700 dark:bg-violet-500/10 dark:text-violet-400' },
  { label: 'Schedule Interview', href: '/dashboard/hiring/interviews', icon: CalendarCheck, accent: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
  { label: 'Release Offer', href: '/dashboard/hiring/loi', icon: FileCheck2, accent: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400' },
  { label: 'Start Onboarding', href: '/dashboard/hiring/joining-confirmation', icon: Rocket, accent: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' },
];

const QUICK_LINKS = [
  { label: 'All Candidates', href: '/dashboard/hiring/candidates', icon: Users },
  { label: 'Job Openings', href: '/dashboard/hiring/manpower', icon: Briefcase },
  { label: 'Interview Panel', href: '/dashboard/hiring/interviews', icon: CalendarCheck },
  { label: 'Offer Letters', href: '/dashboard/hiring/loi', icon: FileCheck2 },
  { label: 'Other Letters', href: '/dashboard/hiring/doc-checklist', icon: FileText },
  { label: 'Recruitment Reports', href: '/dashboard/coming-soon', icon: FileBarChart2 },
];

const TODAYS_INTERVIEWS = [
  { time: '10:00 AM', candidate: 'Rahul Sharma', position: 'HR Executive', interviewer: 'Swati Verma', status: 'Scheduled' },
  { time: '11:30 AM', candidate: 'Priya Singh', position: 'Sales Manager', interviewer: 'Reetika Singh', status: 'In Progress' },
  { time: '02:00 PM', candidate: 'Mohit Jain', position: 'Web Developer', interviewer: 'IT Head', status: 'Scheduled' },
  { time: '04:00 PM', candidate: 'Neha Gupta', position: 'Graphic Designer', interviewer: 'Marketing Head', status: 'Scheduled' },
];
const INTERVIEW_STATUS_STYLE: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  'In Progress': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
};

const HOT_CANDIDATES = [
  { name: 'Amit Verma', role: 'Sales Manager', exp: '7 Yrs Exp', stage: 'Final Round' },
  { name: 'Deepak Singh', role: 'HR Manager', exp: '6 Yrs Exp', stage: 'Offer Stage' },
  { name: 'Rahul Arora', role: 'Senior Developer', exp: '5 Yrs Exp', stage: 'Technical Round' },
  { name: 'Neha Tiwari', role: 'Graphic Designer', exp: '4 Yrs Exp', stage: 'Final Round' },
];
const CANDIDATE_STAGE_STYLE: Record<string, string> = {
  'Final Round': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  'Offer Stage': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Technical Round': 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
};

const UPCOMING_JOINING = [
  { name: 'Deepak Sharma', role: 'HR Manager', date: '10 Jul 2026' },
  { name: 'Priya Verma', role: 'Sales Executive', date: '12 Jul 2026' },
  { name: 'Mohit Gupta', role: 'Developer', date: '15 Jul 2026' },
  { name: 'Anjali Mehta', role: 'Accounts Executive', date: '18 Jul 2026' },
];

const ACTIVE_JOB_OPENINGS = [
  { title: 'HR Manager', dept: 'HR', vacancies: 1, applications: 68, interviews: 8, status: 'Active', postedOn: '18 Jun 2026' },
  { title: 'Sales Executive', dept: 'Sales', vacancies: 8, applications: 245, interviews: 32, status: 'Urgent Hiring', postedOn: '15 Jun 2026' },
  { title: 'Web Developer', dept: 'IT', vacancies: 3, applications: 78, interviews: 11, status: 'Active', postedOn: '20 Jun 2026' },
  { title: 'Graphic Designer', dept: 'Marketing', vacancies: 2, applications: 44, interviews: 6, status: 'Active', postedOn: '22 Jun 2026' },
  { title: 'Accounts Executive', dept: 'Finance', vacancies: 2, applications: 32, interviews: 4, status: 'Active', postedOn: '25 Jun 2026' },
];
const JOB_STATUS_STYLE: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  'Urgent Hiring': 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
};

const SOURCE_PERFORMANCE = [
  { source: 'Naukri.com', candidates: 215, hired: 14, rate: 6.5 },
  { source: 'LinkedIn', candidates: 98, hired: 7, rate: 7.1 },
  { source: 'Employee Referral', candidates: 32, hired: 12, rate: 37.5 },
  { source: 'Company Website', candidates: 55, hired: 4, rate: 7.3 },
  { source: 'Walk-In', candidates: 48, hired: 3, rate: 6.2 },
];

const AI_INSIGHTS = [
  'Sales department has 12 open positions which require urgent attention.',
  'Employee referrals have the highest success rate (37.5%).',
  'HR Manager position is pending for 18 days.',
  '5 candidates are ready for immediate joining.',
];

const PENDING_APPROVALS = [
  { title: 'HR Manager Hiring', status: 'Awaiting Approval' },
  { title: 'Sales Executive (5 Nos.)', status: 'Pending' },
  { title: 'Accounts Executive', status: 'Pending' },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared pieces
// ─────────────────────────────────────────────────────────────────────────

function Card({
  title, action, className = '', children,
}: { title?: string; action?: React.ReactNode; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-2 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {title && (
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-[11.5px] font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{title}</h3>
          {action}
        </div>
      )}
      {children && <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>}
    </div>
  );
}

function ViewAllLink({ href, label = 'View All' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="shrink-0 text-[10px] font-semibold text-indigo-700 hover:text-violet-700 dark:text-violet-400">{label}</Link>
  );
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
}

function Avatar({ name }: { name: string }) {
  const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
  return (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold ${AVATAR_COLORS[colorIndex]}`}>
      {initials(name)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h1 className="text-[17px] font-bold text-zinc-900 dark:text-zinc-50">Recruitment &amp; Talent Acquisition</h1>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Overview of hiring pipeline, candidates, interviews, offers and onboarding.</p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
          <CalendarCheck size={13} className="text-zinc-400" />
          Jul 1 – Jul 31, 2026
          <ChevronDown size={12} className="text-zinc-400" />
        </div>
        <select className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 outline-none">
          <option>All Departments</option>
        </select>
        <select className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 outline-none">
          <option>All Locations</option>
        </select>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// KPI strip
// ─────────────────────────────────────────────────────────────────────────

function StatsStrip({ kpiData = KPIS }: { kpiData?: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {(kpiData || []).map((s) => {
        const TrendIcon = s.up ? ArrowUpRight : ArrowDownRight;
        const trendColor = s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400';
        return (
          <div key={s.label} className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-2">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.accent}`}>
                <s.icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight truncate">{s.label}</p>
                <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">{s.value}</p>
                <p className={`flex items-center gap-0.5 truncate text-[9px] font-semibold leading-tight ${trendColor}`}>
                  <TrendIcon size={9} className="shrink-0" />{s.trend}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Pipeline funnel + table / Hiring overview donut
// ─────────────────────────────────────────────────────────────────────────

function RecruitmentPipeline({ pipelineData = PIPELINE_STAGES }: { pipelineData?: any[] }) {
  // Funnel bar widths are a fixed, evenly-tapered staircase (not scaled to
  // the raw candidate counts) so the shape always reads as a clean funnel,
  // matching the mockup — the real numbers live in the table on the right.
  const FUNNEL_WIDTHS = [100, 88, 76, 64, 52, 40, 28];
  return (
    <Card title="Recruitment Pipeline">
      <div className="flex gap-3">
        <div className="flex w-[34%] shrink-0 flex-col items-center justify-start gap-0.5">
          {(pipelineData || []).map((s, i) => (
            <div
              key={s.name}
              className="flex h-[26px] items-center justify-center rounded"
              style={{ width: `${FUNNEL_WIDTHS[i] ?? 28}%`, backgroundColor: s.color }}
            >
              <s.icon size={13} className="text-white" />
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[9.5px] text-zinc-400">
                <th className="pb-1.5 font-medium">Stage</th>
                <th className="pb-1.5 font-medium">Candidates</th>
                <th className="pb-1.5 font-medium">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {(pipelineData || []).map((s, i) => {
                const conversion = i === 0 ? 100 : (s.value / pipelineData[i - 1]?.value || 1) * 100;
                return (
                  <tr key={s.name} className="border-t border-zinc-50 dark:border-zinc-800">
                    <td className="py-1 pr-1 text-[10.5px] font-medium text-zinc-800 dark:text-zinc-100">
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </td>
                    <td className="py-1 pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{s.value.toLocaleString()}</td>
                    <td className="py-1 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-200">{conversion.toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

function HiringOverview({ overview = [] }: { overview?: any[] }) {
  const TOTAL_OPEN_POSITIONS = overview.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card
      title="Hiring Overview"
      action={(
        <button type="button" className="shrink-0 rounded-md border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-[9.5px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          View Details
        </button>
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={overview.length > 0 ? overview : [{ name: 'None', value: 1, color: '#f4f4f5' }]} dataKey="value" nameKey="name" innerRadius={40} outerRadius={62} paddingAngle={2} stroke="none">
                {(overview.length > 0 ? overview : [{ name: 'None', value: 1, color: '#f4f4f5' }]).map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center leading-none">
              <p className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50">{TOTAL_OPEN_POSITIONS}</p>
              <p className="mt-0.5 text-[8.5px] text-zinc-400">Total Open<br />Positions</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          {overview.length > 0 ? overview.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="truncate">{s.name}</span>
              <span className="ml-auto shrink-0 font-semibold text-zinc-700 dark:text-zinc-200">{s.value} ({s.pct}%)</span>
            </div>
          )) : (
            <div className="text-[10.5px] text-zinc-400 italic">No data available</div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar: Action Center / Quick Links / AI Insights / Pending Approvals
// ─────────────────────────────────────────────────────────────────────────

function ActionCenter() {
  return (
    <Card title="Recruitment Action Center">
      <div className="grid grid-cols-3 gap-1.5">
        {ACTIONS.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800 px-2 py-2.5 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-lg ${a.accent}`}>
              <a.icon size={15} />
            </span>
            <span className="text-[9.5px] font-medium text-zinc-700 dark:text-zinc-200 leading-tight">{a.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function QuickLinks() {
  return (
    <Card title="Quick Links">
      <div className="grid grid-cols-2 gap-x-2">
        {QUICK_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <l.icon size={13} className="shrink-0 text-zinc-400" />
            <span className="min-w-0 flex-1 truncate">{l.label}</span>
            <ChevronRight size={13} className="shrink-0 text-zinc-300" />
          </Link>
        ))}
      </div>
    </Card>
  );
}

function AIInsights({ insights = [] }: { insights?: string[] }) {
  return (
    <Card title="AI Recruitment Insights">
      <div className="space-y-2">
        {insights.length > 0 ? insights.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <Bot size={13} className="mt-0.5 shrink-0 text-violet-500" />
            <p className="text-[10.5px] font-medium leading-tight text-zinc-700 dark:text-zinc-200">{text}</p>
          </div>
        )) : (
          <div className="text-[10.5px] text-zinc-400 italic">No insights available at the moment.</div>
        )}
      </div>
      <Link href="/dashboard/coming-soon" className="mt-2 block border-t border-zinc-50 dark:border-zinc-800 pt-1.5 text-[10px] font-semibold text-indigo-700 dark:text-violet-400">
        View All Insights
      </Link>
    </Card>
  );
}

function PendingApprovals() {
  return (
    <Card title="Pending Approvals" action={<ViewAllLink href="/dashboard/hiring/manpower" />}>
      <div className="space-y-1">
        {PENDING_APPROVALS.map((r: any) => (
          <div key={(r.jobTitle || r.title)} className="flex items-center justify-between gap-2 rounded-lg bg-amber-50/60 dark:bg-amber-500/10 px-2 py-0.5">
            <p className="truncate text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-100">{(r.jobTitle || r.title)}</p>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-400">{r.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tables / lists
// ─────────────────────────────────────────────────────────────────────────

function TodaysInterviews({ interviews = [] }: { interviews?: any[] }) {
  return (
    <Card className="min-h-[180px]" title="Today's Interviews" action={<ViewAllLink href="/dashboard/meetings" label="View Calendar" />}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[9.5px] text-zinc-400">
            <th className="pb-1.5 font-medium">Time</th>
            <th className="pb-1.5 font-medium">Candidate</th>
            <th className="pb-1.5 font-medium">Position</th>
            <th className="pb-1.5 font-medium">Interviewer</th>
            <th className="pb-1.5 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {interviews.length > 0 ? interviews.map((iv) => (
            <tr key={iv._id || iv.time || new Date(iv.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + (iv.candidateId?.firstName ? `${iv.candidateId.firstName} ${iv.candidateId.lastName}` : iv.candidate)} className="border-t border-zinc-50 dark:border-zinc-800">
              <td className="py-1 pr-1 text-[10px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{iv.time || new Date(iv.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td className="truncate py-1 pr-1 text-[10.5px] font-medium text-zinc-800 dark:text-zinc-100">{(iv.candidateId?.firstName ? `${iv.candidateId.firstName} ${iv.candidateId.lastName}` : iv.candidate)}</td>
              <td className="truncate py-1 pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{iv.position || 'Candidate'}</td>
              <td className="truncate py-1 pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{(iv.interviewerId?.firstName ? `${iv.interviewerId.firstName} ${iv.interviewerId.lastName}` : iv.interviewer)}</td>
              <td className="py-1">
                <span className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${INTERVIEW_STATUS_STYLE[iv.status] || ''}`}>{iv.status}</span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="py-10 text-[10.5px] text-center text-zinc-400 italic border-t border-zinc-50 dark:border-zinc-800">
                No interviews scheduled for today
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function HotCandidates({ candidates = [] }: { candidates?: any[] }) {
  return (
    <Card className="min-h-[180px]" title="Hot Candidates" action={<ViewAllLink href="/dashboard/hiring/candidates" />}>
      <div className="space-y-2">
        {candidates.length > 0 ? candidates.map((c) => (
          <div key={(c.firstName ? `${c.firstName} ${c.lastName}` : c.name)} className="flex items-center gap-2">
            <Avatar name={(c.firstName ? `${c.firstName} ${c.lastName}` : c.name)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-100">{(c.firstName ? `${c.firstName} ${c.lastName}` : c.name)}</p>
              <p className="truncate text-[9px] text-zinc-400">{(c.jobRole || c.role)} • {(c.experience ? `${c.experience} Yrs` : c.exp)}</p>
            </div>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${CANDIDATE_STAGE_STYLE[(c.status || c.stage)] || ''}`}>{(c.status || c.stage)}</span>
          </div>
        )) : (
          <div className="flex h-[100px] items-center justify-center text-[10.5px] text-zinc-400 italic">No candidates available</div>
        )}
      </div>
    </Card>
  );
}

function UpcomingJoining({ joinings = [] }: { joinings?: any[] }) {
  return (
    <Card className="min-h-[180px]" title="Upcoming Joining" action={<ViewAllLink href="/dashboard/hiring/joining-confirmation" />}>
      <div className="space-y-2">
        {joinings.length > 0 ? joinings.map((j) => (
          <div key={(j.firstName ? `${j.firstName} ${j.lastName}` : j.name)} className="flex items-center gap-2">
            <Avatar name={(j.firstName ? `${j.firstName} ${j.lastName}` : j.name)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-100">{(j.firstName ? `${j.firstName} ${j.lastName}` : j.name)}</p>
              <p className="truncate text-[9px] text-zinc-400">{(j.jobRole || j.role)}</p>
            </div>
            <span className="shrink-0 whitespace-nowrap text-[9.5px] font-medium text-zinc-500 dark:text-zinc-400">{j.date || 'TBD'}</span>
          </div>
        )) : (
          <div className="flex h-[100px] items-center justify-center text-[10.5px] text-zinc-400 italic">No upcoming joinings</div>
        )}
      </div>
    </Card>
  );
}

function ActiveJobOpenings({ openings = [] }: { openings?: any[] }) {
  return (
    <Card className="min-h-[220px]" title="Active Job Openings" action={<ViewAllLink href="/dashboard/hiring/manpower" label="View All Jobs" />}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[9.5px] text-zinc-400">
            <th className="pb-1 font-medium">Job Title</th>
            <th className="pb-1 font-medium">Department</th>
            <th className="pb-1 font-medium">Vacancies</th>
            <th className="pb-1 font-medium">Applications</th>
            <th className="pb-1 font-medium">Interviews</th>
            <th className="pb-1 font-medium">Status</th>
            <th className="pb-1 font-medium">Posted On</th>
          </tr>
        </thead>
        <tbody>
          {openings.length > 0 ? openings.map((r) => (
            <tr key={(r.jobTitle || r.title)} className="border-t border-zinc-50 dark:border-zinc-800">
              <td className="truncate py-px pr-1 text-[10.5px] font-medium text-zinc-800 dark:text-zinc-100">{(r.jobTitle || r.title)}</td>
              <td className="truncate py-px pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{(r.departmentId?.name || r.dept)}</td>
              <td className="py-px pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{(r.numberOfPositions || r.vacancies)}</td>
              <td className="py-px pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{(r.applications || 0)}</td>
              <td className="py-px pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{(r.interviews || 0)}</td>
              <td className="py-px pr-1">
                <span className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${JOB_STATUS_STYLE[r.status] || ''}`}>{r.status}</span>
              </td>
              <td className="py-px text-[10px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{(r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.postedOn)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="py-12 text-[10.5px] text-center text-zinc-400 italic border-t border-zinc-50 dark:border-zinc-800">
                No active job openings
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

function SourcePerformance({ performance = [] }: { performance?: any[] }) {
  return (
    <Card title="Recruitment Source Performance" action={<ViewAllLink href="/dashboard/hiring/candidates" label="View Report" />}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-[9.5px] text-zinc-400">
            <th className="pb-1 font-medium">Source</th>
            <th className="pb-1 font-medium">Candidates</th>
            <th className="pb-1 font-medium">Hired</th>
            <th className="pb-1 font-medium">Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {performance.length > 0 ? performance.map((s) => (
            <tr key={s.source} className="border-t border-zinc-50 dark:border-zinc-800">
              <td className="truncate py-0.5 pr-1 text-[10.5px] font-medium text-zinc-800 dark:text-zinc-100">{s.source}</td>
              <td className="py-0.5 pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{s.candidates}</td>
              <td className="py-0.5 pr-1 text-[10.5px] text-zinc-600 dark:text-zinc-300">{s.hired}</td>
              <td className="py-0.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${s.rate >= 20 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(s.rate, 100)}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[9.5px] font-semibold text-zinc-600 dark:text-zinc-300">{s.rate.toFixed(1)}%</span>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="py-12 text-[10.5px] text-center text-zinc-400 italic border-t border-zinc-50 dark:border-zinc-800">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function RecruiterDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['hrDashboardStats'],
    queryFn: async () => {
      const res = await api.get('/hiring/dashboard-stats');
      return res.data.data;
    }
  });

  const dynamicKPIS = data ? [
    { ...KPIS[0], value: data.kpis.openPositions.toString() },
    { ...KPIS[1], value: data.kpis.activeCandidates.toString() },
    { ...KPIS[2], value: data.kpis.interviewsScheduled.toString() },
    { ...KPIS[3], value: data.kpis.offersReleased.toString() },
    { ...KPIS[4], value: data.kpis.positionsFilled.toString() },
    { ...KPIS[5] }
  ] : KPIS.map(k => ({ ...k, value: '0', trend: '-' }));

  const dynamicPipeline = data ? [
    { ...PIPELINE_STAGES[0], value: data.pipeline.applications },
    { ...PIPELINE_STAGES[1], value: data.pipeline.shortlisted },
    { ...PIPELINE_STAGES[2], value: data.pipeline.screening },
    { ...PIPELINE_STAGES[3], value: data.pipeline.interviewing },
    { ...PIPELINE_STAGES[4], value: data.pipeline.offered },
    { ...PIPELINE_STAGES[5], value: data.pipeline.offered },
    { ...PIPELINE_STAGES[6], value: data.pipeline.joined },
  ] : PIPELINE_STAGES.map(p => ({ ...p, value: 0 }));

  const todaysInterviews = data?.todaysInterviews || [];
  const hotCandidates = data?.hotCandidates || [];
  const upcomingJoining = data?.upcomingJoining || [];
  const activeJobOpenings = data?.activeJobOpenings || [];
  const hiringOverview = data?.hiringOverview || [];
  const sourcePerformance = data?.sourcePerformance || [];
  const aiInsights = data?.aiInsights || [];

  return (
    <div className="w-full px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <div className="mx-auto max-w-[1500px] space-y-2">
        <Header />
        <StatsStrip kpiData={dynamicKPIS} />

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[3fr_2fr]">
              <RecruitmentPipeline pipelineData={dynamicPipeline} />
              <HiringOverview overview={hiringOverview} />
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[2fr_1fr_1fr]">
              <TodaysInterviews interviews={todaysInterviews} />
              <HotCandidates candidates={hotCandidates} />
              <UpcomingJoining joinings={upcomingJoining} />
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <ActiveJobOpenings openings={activeJobOpenings} />
              <SourcePerformance performance={sourcePerformance} />
            </div>
          </div>

          <div className="space-y-2">
            <ActionCenter />
            <QuickLinks />
            <AIInsights insights={aiInsights} />
            <PendingApprovals />
          </div>
        </div>
      </div>
    </div>
  );
}
