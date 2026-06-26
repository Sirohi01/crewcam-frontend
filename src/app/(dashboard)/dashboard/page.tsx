'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  ArrowRight, BriefcaseBusiness, CalendarCheck, CalendarDays, CalendarX2,
  ChevronDown, FileText, Mail, MapPin, Megaphone,
  ScanFace, Star, TrendingDown, TrendingUp, UmbrellaOff,
  UserRoundPlus, UsersRound, Wallet, CalendarClock, Briefcase, UserPlus, Eye,
  CheckCircle2, Circle, Cake, Wallet2, Shield, PartyPopper, X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/axios';

interface DashboardConfig { category: string; effectivePermissions: string[]; widgets: string[]; }

const performanceData = [
  { name: 'High Performers', value: 174, pct: '(13.92%)', color: '#22c55e' },
  { name: 'Meets Expectations', value: 802, pct: '(64.26%)', color: '#3b82f6' },
  { name: 'Needs Improvement', value: 164, pct: '(13.14%)', color: '#f59e0b' },
  { name: 'Poor Performers', value: 108, pct: '(8.67%)', color: '#ef4444' },
];

const leaveBalanceData = [
  { type: 'Casual Leave', balance: 10.5, color: '#38bdf8' },
  { type: 'Sick Leave', balance: 10, color: '#f59e0b' },
  { type: 'Privilege Leave', balance: 18, color: '#8b5cf6' },
  { type: 'Comp Off', balance: 5, color: '#22c55e' },
];

const ALERT_EMPLOYEES: Record<string, { name: string; dept: string }[]> = {
  birthday: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
    { name: 'Kavya Reddy', dept: 'Product' },
    { name: 'Rohit Das', dept: 'Engineering' },
    { name: 'Divya Iyer', dept: 'HR' },
    { name: 'Suresh Kumar', dept: 'Finance' },
  ],
  anniversary: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
  ],
  salary: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
    { name: 'Pooja Nair', dept: 'Operations' },
    { name: 'Arjun Mehta', dept: 'Design' },
    { name: 'Kavya Reddy', dept: 'Product' },
    { name: 'Rohit Das', dept: 'Engineering' },
  ],
  probation: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
    { name: 'Vikram Singh', dept: 'Engineering' },
  ],
  special: [
    { name: 'Priya Sharma', dept: 'Engineering' },
    { name: 'Rahul Verma', dept: 'Sales' },
    { name: 'Neha Gupta', dept: 'HR' },
    { name: 'Amit Patel', dept: 'Finance' },
    { name: 'Sunita Rao', dept: 'Marketing' },
  ],
};

const topAlertsData = [
  { key: 'birthday', icon: <Cake size={14} />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Birthday', subtitle: 'Celebrating birthday', count: 12, detail: 'Celebrating today', extra: 9, date: 'Jun 26, 2025', dateLabel: 'Today' },
  { key: 'anniversary', icon: <Star size={14} />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Anniversary', subtitle: 'Work anniversaries', count: 8, detail: 'Work anniversary', extra: 5, date: 'Jun 27 – Jul 3', dateLabel: 'This week' },
  { key: 'salary', icon: <Wallet2 size={14} />, color: '#22c55e', bg: '#f0fdf4', title: 'Salary Increment', subtitle: 'Upcoming increment', count: 10, detail: 'Awaiting review', extra: 7, date: 'Jun 30, 2025', dateLabel: 'in 4 days' },
  { key: 'probation', icon: <Shield size={14} />, color: '#f59e0b', bg: '#fffbeb', title: 'Probation Ending', subtitle: 'Probation ending', count: 6, detail: 'Need evaluation', extra: 3, date: 'Jul 5, 2025', dateLabel: 'in 9 days' },
  { key: 'special', icon: <PartyPopper size={14} />, color: '#ef4444', bg: '#fef2f2', title: 'Special Occasion', subtitle: 'Other occasions', count: 5, detail: 'Special occasion', extra: 2, date: 'Jun 28, 2025', dateLabel: 'in 2 days' },
];

const todaySchedule = [
  {
    time: '08:30 AM',
    title: 'Daily HR Standup',
    location: 'HR Cabin'
  },
  {
    time: '09:30 AM',
    title: 'HR Policy Review Meeting',
    location: 'Conference Room A'
  },
  {
    time: '10:15 AM',
    title: 'Employee Onboarding Session',
    location: 'Training Hall'
  },
  {
    time: '11:00 AM',
    title: 'Interview – Senior Developer',
    location: 'Panel Room 2'
  },
  {
    time: '12:30 PM',
    title: 'Lunch with New Joiners',
    location: 'Cafeteria'
  },
  {
    time: '02:00 PM',
    title: 'Performance Calibration',
    location: 'Conference Room B'
  },
  {
    time: '03:00 PM',
    title: 'Payroll Review Meeting',
    location: 'Finance Room'
  },
  {
    time: '04:00 PM',
    title: 'Townhall Meeting',
    location: 'Auditorium'
  },
  {
    time: '05:00 PM',
    title: 'Leave Approval Review',
    location: 'HR Department'
  },
  {
    time: '06:00 PM',
    title: 'Recruitment Planning',
    location: 'Meeting Room C'
  },
    {
    time: '04:00 PM',
    title: 'Townhall Meeting',
    location: 'Auditorium'
  },
  {
    time: '05:00 PM',
    title: 'Leave Approval Review',
    location: 'HR Department'
  },
  {
    time: '06:00 PM',
    title: 'Recruitment Planning',
    location: 'Meeting Room C'
  },
];

const todayTasks = [
  { id: 1, title: 'Review onboarding docs for 3 new joiners', priority: 'high', done: false },
  { id: 2, title: 'Approve pending leave requests (12)', priority: 'high', done: false },
  { id: 3, title: 'Send offer letter to Rohit Mehra', priority: 'medium', done: true },
  { id: 4, title: 'Update Q2 performance ratings', priority: 'medium', done: false },
  { id: 5, title: 'Schedule exit interview – Priya Shah', priority: 'low', done: false },
  { id: 6, title: 'Publish June payroll summary', priority: 'low', done: true },
];

const META: Record<string, {
  title: string; icon: React.ReactNode; accent: string;
  fallback: string; delta: string; deltaType: 'up' | 'down' | 'neutral'; subLabel?: string;
}> = {
  'org-headcount': { title: 'Total Employees', icon: <UsersRound size={18} />, accent: 'bg-violet-500', fallback: '—', delta: '', deltaType: 'neutral' },
  'team-attendance-today': { title: 'Present Today', icon: <ScanFace size={18} />, accent: 'bg-emerald-500', fallback: '—', delta: '', deltaType: 'neutral' },
  'on-leave-today': { title: 'On Leave Today', icon: <UmbrellaOff size={18} />, accent: 'bg-amber-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'new-joinees': { title: 'New Joinees', icon: <UserRoundPlus size={18} />, accent: 'bg-blue-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'pending-leave-approvals': { title: 'Leave Pending', icon: <CalendarX2 size={18} />, accent: 'bg-rose-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'open-positions': { title: 'Open Positions', icon: <BriefcaseBusiness size={18} />, accent: 'bg-teal-500', fallback: '0', delta: '', deltaType: 'neutral' },
};

function valueFor(key: string, data: any, fallback: string) {
  if (!data || data.dataAvailable === false) return fallback;
  if (key === 'on-leave-today') return String(data.count ?? fallback);
  if (key.includes('attendance')) {
    const present = Number(data.presentToday ?? 0); const total = Number(data.teamSize ?? 0);
    return total ? String(present) : fallback;
  }
  if (key.includes('headcount')) return String(data.count ?? fallback);
  return String(data.count ?? fallback);
}

const SLIDES = [
  { imageUrl: '/bannerImg/img1.png' },
  { imageUrl: '/bannerImg/img2.png' },
  { imageUrl: '/bannerImg/img3.jpg' },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const currentRef = useRef(0);
  const progressRef = useRef(0);
  const DURATION = 7000;

  const { data: dynamicBanners, isLoading: bannersLoading } = useQuery({
    queryKey: ['dashboard', 'banners'],
    queryFn: async () => (await api.get('/dashboard/banners')).data,
    staleTime: 30_000,
  });

  const activeSlides = bannersLoading ? SLIDES : (dynamicBanners?.length ? dynamicBanners : SLIDES);
  useEffect(() => { setCurrent(0); currentRef.current = 0; }, [dynamicBanners]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const tick = (ts: number) => {
      if (!lastRef.current) lastRef.current = ts;
      const dt = ts - lastRef.current; lastRef.current = ts;
      if (!pausedRef.current) {
        progressRef.current += (dt / DURATION) * 100;
        if (progressRef.current >= 100) {
          progressRef.current = 0;
          const next = (currentRef.current + 1) % activeSlides.length;
          setFading(true);
          setTimeout(() => { currentRef.current = next; setCurrent(next); setFading(false); }, 220);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [activeSlides.length]);

  const slide = activeSlides[current] ?? activeSlides[0];
  if (!slide) return null;

  return (
    <section className="relative overflow-hidden rounded-xl shadow-md" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.22s ease' }}>
        <img src={slide.imageUrl} alt="" aria-hidden="true" className="w-full object-cover block"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {activeSlides.map((_: unknown, i: number) => (
          <button key={i}
            onClick={() => { setFading(true); setTimeout(() => { currentRef.current = i; setCurrent(i); setFading(false); }, 220); }}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}

function KpiCard({ widgetKey }: { widgetKey: string }) {
  const meta = META[widgetKey];
  if (!meta) return null;
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'widget', widgetKey],
    queryFn: async () => (await api.get(`/dashboard/widget-data/${widgetKey}`)).data,
  });
  const val = isLoading ? '—' : valueFor(widgetKey, data, meta.fallback);
  return (
    <Card className="group overflow-hidden border-zinc-200/80 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="relative p-3.5">
        <div className={`absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full opacity-[.08] ${meta.accent}`} />
        <div className="flex items-start gap-2.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-sm ${meta.accent}`}>{meta.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-zinc-500 truncate">{meta.title}</p>
            <p className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">{val}</p>
            <div className="mt-0.5 flex items-center gap-1">
              {meta.deltaType === 'up' && <TrendingUp size={10} className="text-emerald-500 shrink-0" />}
              {meta.deltaType === 'down' && <TrendingDown size={10} className="text-rose-500 shrink-0" />}
              <span className={`text-[10px] font-medium ${meta.deltaType === 'up' ? 'text-emerald-600' : meta.deltaType === 'down' ? 'text-rose-500' : 'text-amber-600'}`}>{meta.delta}</span>
              {meta.subLabel && <span className="text-[10px] text-zinc-400">{meta.subLabel}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DateFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 shadow-sm hover:border-violet-300 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer w-[120px]"
      />
    </div>
  );
}

function ChartCard({ title, action, href, className = '', filterValue, onFilterChange, children }: {
  title: string; action?: string; href?: string; className?: string;
  filterValue?: string; onFilterChange?: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <Card className={`border-zinc-200/80 shadow-sm ${className}`}>
      <CardContent className="p-3.5 h-full flex flex-col">
        <div className="mb-2 flex items-center justify-between gap-2 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            {filterValue !== undefined && onFilterChange && <DateFilter value={filterValue} onChange={onFilterChange} />}
            {action && href && (
              <Link href={href} className="inline-flex items-center gap-0.5 text-[11px] font-medium text-violet-700 hover:text-violet-800 whitespace-nowrap">
                {action} <ArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </CardContent>
    </Card>
  );
}

// ─── Attendance Overview — Status / Count / Percentage / View, single 4-col grid ──
function AttendanceOverview({ attendance }: { attendance: any }) {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const present = Number(attendance?.presentToday || 987);
  const teamSize = Number(attendance?.teamSize || 1360);

  const rows = [
    { label: 'Present', count: present, pct: ((present / teamSize) * 100).toFixed(1), color: '#22c55e', href: '/dashboard/attendance?status=present' },
    { label: 'Half Day', count: 60, pct: '5.2', color: '#f59e0b', href: '/dashboard/attendance?status=half-day' },
    { label: 'Absent', count: 196, pct: '15.7', color: '#ef4444', href: '/dashboard/attendance?status=absent' },
    { label: 'On Leave', count: 45, pct: '6.1', color: '#3b82f6', href: '/dashboard/attendance?status=on-leave' },
    { label: 'WFH', count: 72, pct: '5.8', color: '#8b5cf6', href: '/dashboard/attendance?status=wfh' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[12px] font-semibold text-zinc-900">Attendance Overview</h3>
          <DateFilter value={date} onChange={setDate} />
        </div>
        <div className="rounded-lg border border-zinc-100 overflow-hidden">
          {/* Header — same grid-cols-4 as data rows, so columns line up exactly */}
          <div className="grid grid-cols-4 bg-zinc-50 px-3 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wide border-b border-zinc-100">
            <span>Status</span>
            <span className="text-center">Count</span>
            <span className="text-center">Percentage</span>
            <span className="text-center">View</span>
          </div>
          {rows.map((row, i) => (
            <div key={row.label}
              className={`grid grid-cols-4 items-center px-3 py-1.5 hover:bg-zinc-50/80 transition-colors ${i < rows.length - 1 ? 'border-b border-zinc-100' : ''}`}>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                <span className="text-[11px] font-medium text-zinc-700 truncate">{row.label}</span>
              </div>
              <div className="text-center text-[11px] font-bold text-zinc-900">{row.count}</div>
              <div className="text-center text-[10px] font-semibold tabular-nums" style={{ color: row.color }}>{row.pct}%</div>
              <div className="flex justify-center">
                <Link href={row.href} className="inline-flex items-center gap-0.5 rounded border border-blue-200 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye size={9} />
                </Link>
              </div>
            </div>
          ))}
          {/* Total row — same grid-cols-4, no leftover progress bar */}
          <div className="grid grid-cols-4 items-center px-3 py-1.5 border-t-2 border-zinc-200 bg-zinc-50/60">
            <div className="flex items-center gap-1.5 min-w-0">
              <UsersRound size={11} className="text-blue-600 shrink-0" />
              <span className="text-[11px] font-bold text-blue-700">Total</span>
            </div>
            <div className="text-center text-[11px] font-bold text-zinc-900">{teamSize.toLocaleString()}</div>
            <div className="text-center text-[10px] font-bold text-blue-600">100%</div>
            <div className="flex justify-center">
              <Link href="/dashboard/attendance" className="inline-flex items-center rounded border border-blue-200 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                <Eye size={9} />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveOverview() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  return (
    <ChartCard title="Leave Overview" filterValue={date} onFilterChange={setDate} action="View Report" href="/dashboard/leaves">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0 space-y-2">
          {leaveBalanceData.map((item) => (
            <div key={item.type} className="flex items-center gap-2 text-[11px]">
              <span className="text-zinc-600 w-[85px] shrink-0 truncate">{item.type}</span>
              <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(item.balance / 20) * 100}%`, backgroundColor: item.color }} />
              </div>
              <span className="font-bold text-zinc-900 w-6 text-right shrink-0">{item.balance}</span>
            </div>
          ))}
          <div className="border-t border-zinc-100 pt-1.5 grid grid-cols-2 gap-2 text-[10px]">
            <div><p className="text-zinc-400">Approved</p><p className="font-bold text-zinc-800">47</p></div>
            <div><p className="text-zinc-400">Rejected</p><p className="font-bold text-zinc-800">8</p></div>
          </div>
        </div>
        <div className="shrink-0 relative h-[90px] w-[90px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leaveBalanceData.map(l => ({ name: l.type, value: l.balance }))} dataKey="value" innerRadius={26} outerRadius={40} paddingAngle={2} stroke="none">
                {leaveBalanceData.map((entry) => <Cell key={entry.type} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <strong className="text-xs font-bold leading-none">45.5</strong>
            <span className="text-[8px] text-zinc-500">Total Days</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function PerformanceOverview() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  return (
    <ChartCard title="Performance Overview" filterValue={date} onFilterChange={setDate} action="View Dashboard" href="/dashboard/performance">
      <div className="flex items-center gap-3">
        <div className="relative h-[120px] w-[42%] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={performanceData} dataKey="value" innerRadius={36} outerRadius={54} paddingAngle={2} stroke="none">
                {performanceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <strong className="text-base font-bold text-zinc-900">1,248</strong>
            <span className="text-[9px] text-zinc-500">Employees</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {performanceData.map((item) => (
            <div key={item.name} className="text-[10px]">
              <div className="flex items-center justify-between mb-0.5">
                <span className="flex items-center gap-1 text-zinc-600">
                  <i className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-zinc-900">{item.value} <span className="font-normal text-zinc-400">{item.pct}</span></span>
              </div>
              <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(item.value / 1248) * 100}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

// ─── Avatar Stack — clickable ─────────────────────────────────────────────────
function AvatarStack({ extra, color, onClick }: { extra: number; color: string; onClick: () => void }) {
  const initials: [string, string][] = [['P', '#e2e8f0'], ['R', '#dbeafe'], ['N', '#fce7f3']];
  return (
    <div
      className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title="Click to see all employees"
    >
      {initials.map(([letter, bg], i) => (
        <div key={i}
          className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-zinc-600 -ml-1.5 first:ml-0 shrink-0"
          style={{ backgroundColor: bg, zIndex: 3 - i }}>
          {letter}
        </div>
      ))}
      <div
        className="h-6 w-6 rounded-full border-2 border-white -ml-1.5 flex items-center justify-center text-[8px] font-bold shrink-0"
        style={{ backgroundColor: `${color}22`, color }}>
        +{extra}
      </div>
    </div>
  );
}

// ─── Employee Expand Panel ────────────────────────────────────────────────────
function EmployeeListPanel({ alertKey, color, bg, onClose }: {
  alertKey: string; color: string; bg: string; onClose: () => void;
}) {
  const employees = ALERT_EMPLOYEES[alertKey] || [];
  return (
    <div className="px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: `${color}33` }}>
        <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold" style={{ backgroundColor: bg, color }}>
          <span>{employees.length} Employees</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="rounded p-0.5 hover:bg-black/5 transition-colors">
            <X size={11} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-0 bg-white">
          {employees.map((emp, i) => (
            <div key={i}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-50 transition-colors cursor-pointer ${i >= 4 ? 'border-t border-zinc-100' : ''}`}>
              <div className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 text-white"
                style={{ backgroundColor: color }}>
                {emp.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-zinc-800 truncate leading-tight">{emp.name}</p>
                <p className="text-[9px] text-zinc-400 truncate">{emp.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Top Alerts — compact ─────────────────────────────────────────────────────
// function TopAlerts({ className = '' }: { className?: string }) {
//   const [expandedKey, setExpandedKey] = useState<string | null>(null);

//   return (
//     <Card className={`border-zinc-200/80 shadow-sm h-full flex flex-col ${className}`}>
//       <CardContent className="p-2.5">
//         <div className="flex items-center justify-between mb-1.5">
//           <h3 className="text-[12px] font-semibold text-zinc-900">
//             Top Alerts <span className="text-[10px] font-normal text-zinc-400">(Important alerts and upcoming events)</span>
//           </h3>
//           <Link href="/dashboard/alerts"
//             className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-violet-700 hover:text-violet-800 transition-colors">
//             View All <ArrowRight size={10} />
//           </Link>
//         </div>

//         {/* Table header */}
//         <div className="grid grid-cols-12 bg-zinc-50/80 px-2.5 py-1 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
//           <span className="col-span-3">Alert Type</span>
//           <span className="col-span-2">Details</span>
//           <span className="col-span-3">
//             Employees <span className="text-[8px] font-normal text-zinc-300 normal-case">(tap to expand)</span>
//           </span>
//           <span className="col-span-4">Date</span>
//         </div>

//         {topAlertsData.map((alert, i) => (
//           <React.Fragment key={alert.key}>
//             <div className={`grid grid-cols-12 items-center px-2.5 py-1.5 ${i < topAlertsData.length - 1 && expandedKey !== alert.key ? 'border-b border-zinc-100' : ''} ${expandedKey === alert.key ? 'bg-zinc-50/40' : ''}`}>
//               {/* Col 1: Alert Type */}
//               <div className="col-span-3 min-w-0">
//                 <p className="text-[11px] font-bold leading-tight truncate" style={{ color: alert.color }}>{alert.title}</p>
//                 <p className="text-[9px] text-zinc-400 truncate">{alert.subtitle}</p>
//               </div>

//               {/* Col 2: Details */}
//               <div className="col-span-2">
//                 <p className="text-[11px] font-bold" style={{ color: alert.color }}>{alert.count}</p>
//                 <p className="text-[9px] text-zinc-400 truncate">{alert.detail}</p>
//               </div>

//               {/* Col 3: Avatar Stack — only clickable element */}
//               <div className="col-span-3">
//                 <AvatarStack
//                   extra={alert.extra}
//                   color={alert.color}
//                   onClick={() => setExpandedKey(prev => prev === alert.key ? null : alert.key)}
//                 />
//               </div>

//               {/* Col 4: Date */}
//               <div className="col-span-4 flex items-center gap-1.5">
//                 <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: alert.bg }}>
//                   <CalendarDays size={11} style={{ color: alert.color }} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-[10px] font-semibold text-zinc-800 truncate">{alert.date}</p>
//                   <p className="text-[9px] text-zinc-400">{alert.dateLabel}</p>
//                 </div>
//               </div>
//             </div>

//             {expandedKey === alert.key && (
//               <div className={i < topAlertsData.length - 1 ? 'border-b border-zinc-100' : ''}>
//                 <EmployeeListPanel
//                   alertKey={alert.key}
//                   color={alert.color}
//                   bg={alert.bg}
//                   onClose={() => setExpandedKey(null)}
//                 />
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }

function QuickActions() {
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: interviewData } = useQuery({
    queryKey: ['dashboard', 'today-interviews', todayStr],
    queryFn: async () => {
      const res = await api.get('/hiring/interviews', { params: { page: 1, limit: 100, status: 'Scheduled' } });
      const rows: any[] = Array.isArray(res.data) ? res.data : res.data?.data || [];
      return rows.filter((iv: any) => iv.scheduledDate?.startsWith(todayStr));
    },
    staleTime: 60_000,
  });
  const todayInterviews: any[] = interviewData || [];

  const { data: offeredData } = useQuery({
    queryKey: ['dashboard', 'offered-candidates'],
    queryFn: async () => {
      const res = await api.get('/hiring/candidates', { params: { status: 'Offered', limit: 5 } });
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
    staleTime: 60_000,
  });
  const offeredCandidates: any[] = offeredData || [];
  const firstOfferName = offeredCandidates.length > 0
    ? `${offeredCandidates[0].firstName || ''} ${offeredCandidates[0].lastName || ''}`.trim()
    : null;

  type ActionItem = { href: string; icon: React.ReactNode; label: string; color: string; badge?: number; sub?: string; };

  const actions: ActionItem[] = [
    { href: '/dashboard/employees/new', icon: <UserPlus size={14} />, label: 'Add Employee', color: 'text-violet-600 bg-violet-50' },
    { href: '/dashboard/leaves/apply', icon: <CalendarCheck size={14} />, label: 'Apply Leave', color: 'text-emerald-600 bg-emerald-50' },
    { href: '/dashboard/payroll/run', icon: <Wallet size={14} />, label: 'Run Payroll', color: 'text-sky-600 bg-sky-50' },
    { href: '/dashboard/hiring/interviews/list', icon: <CalendarClock size={14} />, label: "Today's Interview", color: 'text-amber-600 bg-amber-50', badge: todayInterviews.length, sub: todayInterviews.length === 0 ? 'None today' : `${todayInterviews.length} scheduled` },
    { href: '/dashboard/announcements/new', icon: <Megaphone size={14} />, label: 'Announce', color: 'text-pink-600 bg-pink-50' },
    { href: '/dashboard/hiring/candidates', icon: <Mail size={14} />, label: 'Offer Pending', color: 'text-indigo-600 bg-indigo-50', badge: offeredCandidates.length, sub: firstOfferName || 'No pending' },
    { href: '/dashboard/documents/upload', icon: <FileText size={14} />, label: 'Upload Doc', color: 'text-orange-600 bg-orange-50' },
    { href: '/dashboard/hiring/manpower', icon: <Briefcase size={14} />, label: 'New Requisition', color: 'text-teal-600 bg-teal-50' },
    { href: '/dashboard/meetings/new', icon: <CalendarDays size={14} />, label: 'Schedule Meeting', color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-semibold text-zinc-900">Quick Actions</h3>
          <p className="text-[11px] text-zinc-500">(Get things done faster)</p>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {actions.map((a) => (
            <Link key={a.label} href={a.href}
              className="relative flex flex-col items-center gap-0.5 rounded-lg border border-zinc-100 px-1 py-1.5 text-center hover:border-violet-200 hover:bg-violet-50/60 transition-colors overflow-hidden">
              {a.badge !== undefined && a.badge > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5 leading-none">{a.badge}</span>
              )}
              <span className={`grid h-6 w-6 place-items-center rounded-md ${a.color} shrink-0`}>{a.icon}</span>
              <span className="text-[9.5px] font-semibold text-zinc-700 leading-tight">{a.label}</span>
              {a.sub && <span className="text-[8px] text-zinc-400 leading-tight truncate w-full px-0.5">{a.sub}</span>}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BirthdaysOverview() {
  return (
    <Card className="border-zinc-200/80 shadow-sm flex flex-col h-full">
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="mb-2 flex items-center gap-1.5 shrink-0">
          <Cake size={14} className="text-blue-500" />
          <h3 className="text-[12px] font-semibold text-zinc-900">Birthdays</h3>
        </div>

        <div className="flex gap-2 flex-1 min-h-0">
          {/* Card 1 */}
          <div className="flex-1 rounded-lg border border-zinc-100 flex flex-col items-center justify-center p-2 relative overflow-hidden bg-white">
            <div className="absolute top-0 w-full h-8 bg-amber-100/50"></div>
            <div className="relative mb-1 mt-2">
              <img src="https://i.pravatar.cc/150?u=1" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10 bg-white" alt="avatar" />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 z-20 shadow-sm border border-white">
                <Cake size={8} className="text-white" />
              </div>
            </div>
            <p className="text-[11px] font-semibold text-zinc-800 text-center leading-tight mt-1">Sameera<br />Abbas</p>
            <span className="mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-semibold">Today</span>
          </div>

          {/* Card 2 */}
          <div className="flex-1 rounded-lg border border-zinc-100 flex flex-col items-center justify-center p-2 relative overflow-hidden bg-white">
            <div className="absolute top-0 w-full h-8 bg-rose-100/50"></div>
            <div className="relative mb-1 mt-2">
              <img src="https://i.pravatar.cc/150?u=2" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm relative z-10 bg-white" alt="avatar" />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 z-20 shadow-sm border border-white">
                <Cake size={8} className="text-white" />
              </div>
            </div>
            <p className="text-[11px] font-semibold text-zinc-800 text-center leading-tight mt-1">Olivia<br />Johnson</p>
            <span className="mt-1.5 px-2 py-0.5 text-zinc-500 text-[9px] font-medium">1d ago</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-semibold text-zinc-800">4 upcoming birthdays</span>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity outline-none appearance-none bg-transparent border-none p-0">
              <div className="flex -space-x-1.5">
                 <img src="https://i.pravatar.cc/150?u=3" className="w-5 h-5 rounded-full border-2 border-white object-cover" alt="user" />
                 <img src="https://i.pravatar.cc/150?u=4" className="w-5 h-5 rounded-full border-2 border-white object-cover" alt="user" />
                 <img src="https://i.pravatar.cc/150?u=5" className="w-5 h-5 rounded-full border-2 border-white object-cover" alt="user" />
              </div>
              <ChevronDown className="text-zinc-400 rotate-[-90deg] ml-0.5" size={12} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Cake className="text-blue-500" size={18} />
                  Upcoming Birthdays
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {[
                  { name: 'Rohan Mehta', date: 'Tomorrow', avatar: '3' },
                  { name: 'Kavya Singh', date: 'In 3 days', avatar: '4' },
                  { name: 'Aryan Kapoor', date: 'Next Week', avatar: '5' },
                  { name: 'Sneha Desai', date: 'Next Week', avatar: '6' }
                ].map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/150?u=${b.avatar}`} className="w-10 h-10 rounded-full object-cover shadow-sm border border-zinc-100" alt={b.name} />
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{b.name}</p>
                        <p className="text-xs text-zinc-500">{b.date}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Cake size={14} className="text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function TodayTasks() {
  const [tasks, setTasks] = useState(todayTasks);
  const toggle = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const priorityConfig = {
    high: { color: '#ef4444', bg: '#fef2f2', label: 'High' },
    medium: { color: '#f59e0b', bg: '#fffbeb', label: 'Med' },
    low: { color: '#22c55e', bg: '#f0fdf4', label: 'Low' },
  };
  const done = tasks.filter(t => t.done).length;

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900">Today's Tasks</h3>
            <span className="text-[10px] text-zinc-400">{done}/{tasks.length} done</span>
          </div>
          <Link href="/dashboard/tasks" className="inline-flex items-center gap-0.5 text-[11px] font-medium text-violet-700 hover:text-violet-800">
            View All <ArrowRight size={11} />
          </Link>
        </div>
        <div className="mb-2 h-1 rounded-full bg-zinc-100 overflow-hidden">
          <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${(done / tasks.length) * 100}%` }} />
        </div>
        <div className="space-y-1">
          {tasks.map((task) => {
            const p = priorityConfig[task.priority as keyof typeof priorityConfig];
            return (
              <div key={task.id} onClick={() => toggle(task.id)}
                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-colors group ${task.done ? 'opacity-50' : 'hover:bg-zinc-50'}`}>
                <div className="mt-0.5 shrink-0">
                  {task.done ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Circle size={13} className="text-zinc-300 group-hover:text-zinc-400 transition-colors" />}
                </div>
                <p className={`flex-1 text-[11px] leading-tight ${task.done ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>{task.title}</p>
                <span className="shrink-0 rounded text-[9px] font-bold px-1.5 py-0.5" style={{ color: p.color, backgroundColor: p.bg }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isLoading } = useQuery<DashboardConfig>({
    queryKey: ['dashboard', 'config'],
    queryFn: async () => (await api.get('/dashboard/config')).data,
  });

  const { data: attendance } = useQuery({
    queryKey: ['dashboard', 'widget', 'team-attendance-today'],
    queryFn: async () => (await api.get('/dashboard/widget-data/team-attendance-today')).data,
  });

  const topKpiKeys = ['org-headcount', 'team-attendance-today', 'on-leave-today', 'new-joinees', 'pending-leave-approvals', 'open-positions'];

  return (
    <main className="mx-auto max-w-[1600px] space-y-2 pb-4">

      {/* Banner */}
      <HeroSlider />

      {/* KPI Strip */}
      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[82px] animate-pulse rounded-xl bg-zinc-100" />)
          : topKpiKeys.map((key) => <KpiCard key={key} widgetKey={key} />)
        }
      </section>

      {/* Main Content: Left Side (8 cols) and Right Side (4 cols) */}
      <div className="grid gap-2 xl:grid-cols-12 items-start">

        {/* LEFT SIDE: 2-column grid layout */}
        <div className="xl:col-span-8 flex flex-col gap-2">

          {/* Row 1: Today's Tasks | Birthdays */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <TodayTasks />
            <BirthdaysOverview />
          </div>

          {/* Row 2: Attendance Overview | Leave Overview */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <AttendanceOverview attendance={attendance} />
            <LeaveOverview />
          </div>

          {/* Row 3: Performance Overview | Quick Actions */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <PerformanceOverview />
            <QuickActions />
          </div>

        </div>

        {/* RIGHT SIDE: Today's Schedule (Spans full height) */}
        <div className="xl:col-span-4 h-full flex flex-col">
          <Card className="border-zinc-200/80 shadow-sm flex-1 flex flex-col">
            <CardContent className="p-3 flex-1 flex flex-col">
              <div className="mb-2 flex items-center justify-between shrink-0">
                <h3 className="text-[12px] font-semibold text-zinc-900">Today's Schedule</h3>
                <Link href="/dashboard/meetings" className="inline-flex items-center gap-0.5 text-[10px] font-medium text-violet-700 hover:text-violet-800">
                  View Calendar <ArrowRight size={10} />
                </Link>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
                {todaySchedule.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    <div className="shrink-0 text-zinc-400 w-[50px] pt-0.5 tabular-nums text-[10px] leading-tight">{item.time}</div>
                    <div className="flex-1 rounded-lg border border-violet-100 bg-violet-50/60 px-2 py-1.5 group-hover:bg-violet-100/60 transition-colors">
                      <p className="text-[11px] font-medium text-zinc-800 leading-tight">{item.title}</p>
                      {item.location && (
                        <p className="text-zinc-400 text-[9px] mt-0.5 flex items-center gap-0.5">
                          <MapPin size={7} />{item.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}