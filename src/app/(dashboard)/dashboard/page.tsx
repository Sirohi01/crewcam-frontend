'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer} from 'recharts';
import {
  ArrowRight, BriefcaseBusiness, CalendarCheck, CalendarDays, CalendarX2,
  ChevronDown, Clock, FileText, Gift, Mail, MapPin, Megaphone,
  ScanFace, Star, TrendingDown, TrendingUp, UmbrellaOff,
  UserRoundPlus, UsersRound, Wallet, CalendarClock, Briefcase, UserPlus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardConfig { category: string; effectivePermissions: string[]; widgets: string[]; }

// ─── Static Data ──────────────────────────────────────────────────────────────
const performanceData = [
  { name: 'High Performers', value: 174, pct: '(13.92%)', color: '#22c55e' },
  { name: 'Meets Expectations', value: 802, pct: '(64.26%)', color: '#3b82f6' },
  { name: 'Needs Improvement', value: 164, pct: '(13.14%)', color: '#f59e0b' },
  { name: 'Poor Performers', value: 108, pct: '(8.67%)', color: '#ef4444' },
];

const engagementTrend = [
  { month: 'Dec', score: 4.1 }, { month: 'Jan', score: 4.0 }, { month: 'Feb', score: 4.3 },
  { month: 'Mar', score: 4.1 }, { month: 'Apr', score: 4.4 }, { month: 'May', score: 4.2 },
];

const leaveBalanceData = [
  { type: 'Casual Leave', balance: 10.5, color: '#38bdf8' },
  { type: 'Sick Leave', balance: 10, color: '#f59e0b' },
  { type: 'Privilege Leave', balance: 18, color: '#8b5cf6' },
  { type: 'Comp Off', balance: 5, color: '#22c55e' },
];

const topAlerts = [
  { label: 'Salary Increment', count: 10, color: '#ef4444', icon: <FileText size={13} /> },
  { label: 'Probation Ending', count: 8, color: '#f59e0b', icon: <Clock size={13} /> },
  { label: 'Birthdays This Week', count: 23, color: '#3b82f6', icon: <Gift size={13} /> },
  { label: 'Anniversary This Month', count: 17, color: '#8b5cf6', icon: <Star size={13} /> },
  { label: 'Pending Leave Approval', count: 12, color: '#22c55e', icon: <CalendarCheck size={13} /> },
];

const todaySchedule = [
  { time: '09:30 AM', title: 'HR Policy Review Meeting', location: 'Conference Room A' },
  { time: '11:00 AM', title: 'Interview – Senior Developer', location: 'Panel Room 2' },
  { time: '02:00 PM', title: 'Performance Calibration', location: 'Conference Room B' },
  { time: '04:00 PM', title: 'Townhall Meeting', location: 'Auditorium' },
];

// ─── KPI META — 6 cards ──────────────────────────────────────────────────────
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

// ─── Hero Slider ──────────────────────────────────────────────────────────────
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
    <section
      className="relative overflow-hidden rounded-xl shadow-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.22s ease' }}>
        <img
          src={slide.imageUrl} alt="" aria-hidden="true"
          className="w-full object-cover block"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {activeSlides.map((_: unknown, i: number) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { currentRef.current = i; setCurrent(i); setFading(false); }, 220); }}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
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
              <span className={`text-[10px] font-medium ${meta.deltaType === 'up' ? 'text-emerald-600' : meta.deltaType === 'down' ? 'text-rose-500' : 'text-amber-600'}`}>
                {meta.delta}
              </span>
              {meta.subLabel && <span className="text-[10px] text-zinc-400">{meta.subLabel}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Month Filter Dropdown ────────────────────────────────────────────────────
const MONTHS = ['This Month', 'Previous Month', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'];

function MonthFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 shadow-sm hover:border-violet-300 transition-colors"
      >
        {value} <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-zinc-200 bg-white shadow-lg py-1">
          {MONTHS.map(m => (
            <button
              key={m}
              onClick={() => { onChange(m); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-violet-50 hover:text-violet-700 transition-colors ${m === value ? 'text-violet-700 font-semibold bg-violet-50/60' : 'text-zinc-700'}`}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────────────────────────
function ChartCard({ title, action, href, className = '', filterValue, onFilterChange, children }: {
  title: string; action?: string; href?: string;
  className?: string; filterValue?: string; onFilterChange?: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Card className={`border-zinc-200/80 shadow-sm ${className}`}>
      <CardContent className="p-3.5 h-full flex flex-col">
        <div className="mb-2.5 flex items-center justify-between gap-2 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            {filterValue !== undefined && onFilterChange && (
              <MonthFilter value={filterValue} onChange={onFilterChange} />
            )}
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

// ─── Attendance Overview ──────────────────────────────────────────────────────
function AttendanceOverview({ attendance }: { attendance: any }) {
  const [month, setMonth] = useState('This Month');
  const present = Number(attendance?.presentToday || 987);
  const teamSize = Number(attendance?.teamSize || 1248);
  const rate = teamSize ? Math.round((present / teamSize) * 100) : 79;

  const breakdownData = [
    { name: 'Present', value: 79.09, count: 987, color: '#22c55e' },
    { name: 'Half Day', value: 5.21, count: 60, color: '#f59e0b' },
    { name: 'Absent', value: 15.70, count: 196, color: '#ef4444' },
  ];

  return (
    <ChartCard title="Attendance Overview" className="xl:col-span-4" filterValue={month} onFilterChange={setMonth}>
      {/* Donut + breakdown in single row */}
      <div className="flex items-center gap-3">
        {/* Donut */}
        <div className="relative h-[120px] w-[120px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdownData} dataKey="value" innerRadius={38} outerRadius={54} paddingAngle={2} stroke="none">
                {breakdownData.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <strong className="text-base font-bold leading-none">{rate}%</strong>
            <span className="text-[9px] text-zinc-500">Present</span>
          </div>
        </div>

        {/* Right side: legend + stats */}
        <div className="flex-1 min-w-0">
          {/* Legend rows */}
          <div className="space-y-1.5 mb-2">
            {breakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-600 shrink-0">
                  <i className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-zinc-900 tabular-nums">
                  {item.count}{' '}
                  <span className="font-normal text-zinc-400">({item.value}%)</span>
                </span>
              </div>
            ))}
          </div>
          {/* Stats row */}
          <div className="border-t border-zinc-100 pt-1.5 grid grid-cols-3 gap-1 text-[10px]">
            <div>
              <p className="text-zinc-400">Late Arrivals</p>
              <p className="font-bold text-zinc-800">78</p>
            </div>
            <div>
              <p className="text-zinc-400">Overtime Hrs</p>
              <p className="font-bold text-zinc-800">245</p>
            </div>
            <div>
              <p className="text-zinc-400">Early Exits</p>
              <p className="font-bold text-zinc-800">32</p>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

// ─── Leave Overview ───────────────────────────────────────────────────────────
function LeaveOverview() {
  const [month, setMonth] = useState('This Month');
  return (
    <ChartCard title="Leave Overview" className="xl:col-span-4" filterValue={month} onFilterChange={setMonth} action="View Report" href="/dashboard/leaves">
      <div className="flex items-start gap-2">
        {/* Leave list */}
        <div className="flex-1 min-w-0 space-y-2">
          {leaveBalanceData.map((item) => (
            <div key={item.type} className="flex items-center gap-2 text-[11px]">
              {/* Label */}
              <span className="text-zinc-600 w-[90px] shrink-0 truncate">{item.type}</span>
              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(item.balance / 20) * 100}%`, backgroundColor: item.color }} />
              </div>
              {/* Value */}
              <span className="font-bold text-zinc-900 w-7 text-right shrink-0">{item.balance}</span>
            </div>
          ))}
          <div className="border-t border-zinc-100 pt-1.5 grid grid-cols-2 gap-2 text-[10px]">
            <div><p className="text-zinc-400">Approved</p><p className="font-bold text-zinc-800">47</p></div>
            <div><p className="text-zinc-400">Rejected</p><p className="font-bold text-zinc-800">8</p></div>
          </div>
        </div>
        {/* Donut */}
        <div className="shrink-0 relative h-[95px] w-[95px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leaveBalanceData.map(l => ({ name: l.type, value: l.balance }))} dataKey="value" innerRadius={28} outerRadius={42} paddingAngle={2} stroke="none">
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

// ─── Performance Overview ─────────────────────────────────────────────────────
function PerformanceOverview() {
  const [month, setMonth] = useState('This Month');
  return (
    <ChartCard title="Performance Overview" className="xl:col-span-4" filterValue={month} onFilterChange={setMonth} action="View Dashboard" href="/dashboard/performance">
      <div className="flex items-center gap-3">
        <div className="relative h-[130px] w-[45%] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={performanceData} dataKey="value" innerRadius={40} outerRadius={58} paddingAngle={2} stroke="none">
                {performanceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <strong className="text-lg font-bold text-zinc-900">1,248</strong>
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

// ─── Top Alerts ───────────────────────────────────────────────────────────────
function TopAlerts() {
  return (
    <ChartCard title="Top Alerts" className="xl:col-span-4">
      <div className="space-y-1.5">
        {topAlerts.map((alert) => (
          <div key={alert.label} className="flex items-center justify-between text-[11px] group cursor-pointer py-0.5">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md shrink-0" style={{ backgroundColor: `${alert.color}18`, color: alert.color }}>
                {alert.icon}
              </span>
              <span className="text-zinc-700 group-hover:text-zinc-900 transition-colors">{alert.label}</span>
            </div>
            <span className="font-bold rounded-full px-2 py-0.5 text-[10px] shrink-0" style={{ backgroundColor: `${alert.color}18`, color: alert.color }}>
              {alert.count} {alert.label.includes('Leave') ? 'Requests' : 'Emp'}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
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

  type ActionItem = {
    href: string; icon: React.ReactNode; label: string;
    color: string; badge?: number; sub?: string;
  };

  const actions: ActionItem[] = [
    { href: '/dashboard/employees/new', icon: <UserPlus size={14} />, label: 'Add Employee', color: 'text-violet-600 bg-violet-50' },
    { href: '/dashboard/leaves/apply', icon: <CalendarCheck size={14} />, label: 'Apply Leave', color: 'text-emerald-600 bg-emerald-50' },
    { href: '/dashboard/payroll/run', icon: <Wallet size={14} />, label: 'Run Payroll', color: 'text-sky-600 bg-sky-50' },
    // Slot 4: Today's Interviews (replaces Add Expense)
    {
      href: '/dashboard/hiring/interviews/list',
      icon: <CalendarClock size={14} />,
      label: "Today's Interview",
      color: 'text-amber-600 bg-amber-50',
      badge: todayInterviews.length,
      sub: todayInterviews.length === 0 ? 'None today' : `${todayInterviews.length} scheduled`,
    },
    { href: '/dashboard/announcements/new', icon: <Megaphone size={14} />, label: 'Announce', color: 'text-pink-600 bg-pink-50' },
    // Slot 6: Offer Letter Pending (replaces Create Ticket)
    {
      href: '/dashboard/hiring/candidates',
      icon: <Mail size={14} />,
      label: 'Offer Pending',
      color: 'text-indigo-600 bg-indigo-50',
      badge: offeredCandidates.length,
      sub: firstOfferName || 'No pending',
    },
    { href: '/dashboard/documents/upload', icon: <FileText size={14} />, label: 'Upload Doc', color: 'text-orange-600 bg-orange-50' },
    { href: '/dashboard/hiring/manpower', icon: <Briefcase size={14} />, label: 'New Requisition', color: 'text-teal-600 bg-teal-50' },
    { href: '/dashboard/meetings/new', icon: <CalendarDays size={14} />, label: 'Schedule Meeting', color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm xl:col-span-4">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-zinc-900">
            Quick Actions
          </h3>

          <p className="text-[11px] text-zinc-500">
            (Get things done faster)
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="relative flex flex-col items-center gap-0.5 rounded-lg border border-zinc-100 px-1 py-1.5 text-center hover:border-violet-200 hover:bg-violet-50/60 transition-colors overflow-hidden"
            >
              {/* Badge dot */}
              {a.badge !== undefined && a.badge > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center px-0.5 leading-none">
                  {a.badge}
                </span>
              )}
              <span className={`grid h-6 w-6 place-items-center rounded-md ${a.color} shrink-0`}>{a.icon}</span>
              <span className="text-[9.5px] font-semibold text-zinc-700 leading-tight">{a.label}</span>
              {a.sub && (
                <span className="text-[8px] text-zinc-400 leading-tight truncate w-full px-0.5">{a.sub}</span>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Today's Schedule ─────────────────────────────────────────────────────────
function TodaySchedule() {
  return (
    <ChartCard title="Today's Schedule" action="View Calendar" href="/dashboard/meetings" className="xl:col-span-4">
      <div className="space-y-1.5">
        {todaySchedule.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px] group">
            <div className="shrink-0 text-zinc-400 w-[56px] pt-0.5 tabular-nums">{item.time}</div>
            <div className="flex-1 rounded-lg border border-violet-100 bg-violet-50/60 px-2 py-1.5 group-hover:bg-violet-100/60 transition-colors">
              <p className="font-medium text-zinc-800 leading-tight">{item.title}</p>
              {item.location && (
                <p className="text-zinc-400 text-[10px] mt-0.5 flex items-center gap-0.5">
                  <MapPin size={8} />{item.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: config, isLoading } = useQuery<DashboardConfig>({
    queryKey: ['dashboard', 'config'],
    queryFn: async () => (await api.get('/dashboard/config')).data,
  });

  const { data: attendance } = useQuery({
    queryKey: ['dashboard', 'widget', 'team-attendance-today'],
    queryFn: async () => (await api.get('/dashboard/widget-data/team-attendance-today')).data,
  });

  // 6 KPI cards — 4 original + 2 from important sidebar modules
  const topKpiKeys = ['org-headcount', 'team-attendance-today', 'on-leave-today', 'new-joinees', 'pending-leave-approvals', 'open-positions'];

  return (
    <main className="mx-auto max-w-[1600px] space-y-2 pb-4">

      {/* Banner */}
      <HeroSlider />

      {/* Top KPI Strip — 6 cards */}
      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[82px] animate-pulse rounded-xl bg-zinc-100" />
          ))
          : topKpiKeys.map((key) => <KpiCard key={key} widgetKey={key} />)
        }
      </section>

      {/* Row 2: Attendance + Leave + Quick Actions */}
      <section className="grid gap-2 xl:grid-cols-12">
        <AttendanceOverview attendance={attendance} />
        <LeaveOverview />
        <QuickActions />
      </section>

      {/* Row 3: Performance + Top Alerts + Engagement + Schedule */}
      <section className="grid gap-2 xl:grid-cols-12">
        <PerformanceOverview />
        <TopAlerts />
        <TodaySchedule />
      </section>

    </main>
  );
}