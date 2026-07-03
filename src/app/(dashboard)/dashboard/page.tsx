'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  ArrowRight, BriefcaseBusiness, CalendarCheck, CalendarDays, CalendarX2,
  ChevronDown, FileText, Mail, MapPin, Megaphone,
  ScanFace, Star, TrendingDown, TrendingUp, UmbrellaOff,
  UserRoundPlus, UsersRound, Wallet, CalendarClock, Briefcase, UserPlus, Eye,
  CheckCircle2, Circle, Cake, Wallet2, Shield, PartyPopper, X,
  AlertTriangle, FileWarning, UserCheck, BarChart3,
  // New icons for additions
  ClipboardCheck, Download, FolderKanban, TrendingUp as BadgeCheck, ScanLine,
  // Icons for Welcome Header (customize dashboard, date/time)
  Settings, Clock,
  // Icons for Recruitment Overview, Quick Actions, Leave Approvals, AI Insights, Performance
  FolderOpen, Percent, GraduationCap, ListTodo, Clock3, TimerReset,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/axios';
import EmployeeDashboard from './employee/page';

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
  { time: '08:30 AM', title: 'Daily HR Standup', location: 'HR Cabin' },
  { time: '09:30 AM', title: 'HR Policy Review Meeting', location: 'Conference Room A' },
  { time: '10:15 AM', title: 'Employee Onboarding Session', location: 'Training Hall' },
  { time: '11:00 AM', title: 'Interview – Senior Developer', location: 'Panel Room 2' },
  { time: '12:30 PM', title: 'Lunch with New Joiners', location: 'Cafeteria' },
  { time: '02:00 PM', title: 'Performance Calibration', location: 'Conference Room B' },
  { time: '03:00 PM', title: 'Payroll Review Meeting', location: 'Finance Room' },
  { time: '04:00 PM', title: 'Townhall Meeting', location: 'Auditorium' },
  { time: '05:00 PM', title: 'Leave Approval Review', location: 'HR Department' },
  { time: '06:00 PM', title: 'Recruitment Planning', location: 'Meeting Room C' },
];

const todayTasks = [
  { id: 1, title: 'Review onboarding docs for 3 new joiners', priority: 'high', done: false },
  { id: 2, title: 'Approve pending leave requests (12)', priority: 'high', done: false },
  { id: 3, title: 'Send offer letter to Rohit Mehra', priority: 'medium', done: true },
  { id: 4, title: 'Update Q2 performance ratings', priority: 'medium', done: false },
  { id: 5, title: 'Schedule exit interview – Priya Shah', priority: 'low', done: false },
  { id: 6, title: 'Publish June payroll summary', priority: 'low', done: true },
];

const recentNewJoiners = [
  { name: 'Rajesh Kumar', role: 'Software Engineer', avatar: '10', joinedAgo: '2d ago' },
  { name: 'Ananya Singh', role: 'HR Executive', avatar: '11', joinedAgo: '3d ago' },
  { name: 'Vikram Patel', role: 'UI/UX Designer', avatar: '12', joinedAgo: '5d ago' },
  { name: 'Meera Joshi', role: 'Product Manager', avatar: '13', joinedAgo: '1w ago' },
  { name: 'Karan Mehta', role: 'Data Analyst', avatar: '14', joinedAgo: '1w ago' },
];

const META: Record<string, {
  title: string; icon: React.ReactNode; accent: string;
  fallback: string; delta: string; deltaType: 'up' | 'down' | 'neutral'; subLabel?: string;
}> = {
  'org-headcount': { title: 'Total Employees', icon: <UsersRound size={18} />, accent: 'bg-violet-500', fallback: '—', delta: '', deltaType: 'neutral' },
  'team-attendance-today': { title: 'Present Today', icon: <ScanFace size={18} />, accent: 'bg-emerald-500', fallback: '—', delta: '', deltaType: 'neutral' },
  'absent-today': { title: 'Absent Today', icon: <CalendarX2 size={18} />, accent: 'bg-rose-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'work-from-home': { title: 'Work From Home', icon: <Briefcase size={18} />, accent: 'bg-fuchsia-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'late-coming': { title: 'Late Coming', icon: <Clock3 size={18} />, accent: 'bg-amber-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'on-leave-today': { title: 'On Leave Today', icon: <UmbrellaOff size={18} />, accent: 'bg-amber-500', fallback: '0', delta: '', deltaType: 'neutral' },
  'new-joinees': { title: 'New Joinees', icon: <UserRoundPlus size={18} />, accent: 'bg-blue-500', fallback: '0', delta: '', deltaType: 'neutral' },
  // 'open-positions': { title: 'Open Positions', icon: <BriefcaseBusiness size={18} />, accent: 'bg-teal-500', fallback: '0', delta: '', deltaType: 'neutral' },
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

// ─── My Performance (personal card for logged-in HR user) ─────────────────
function MyPerformanceCard() {
  const myStats = {
    rating: 4.6,
    ratingLabel: 'Excellent',
    appraisalScore: 92,
    goalsCompleted: 8,
    goalsTotal: 10,
    feedbackCount: 14,
    lastReviewDate: 'May 2026',
  };

  return (
    <ChartCard title="My Performance" action="View Details" href="/dashboard/performance/me" className="xl:h-[270px]">
      <div className="flex items-center gap-4 h-full">
        {/* Left: rating donut */}
        <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Score', value: myStats.appraisalScore },
                  { name: 'Remaining', value: 100 - myStats.appraisalScore },
                ]}
                dataKey="value"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <strong className="text-[18px] font-bold text-zinc-900 leading-none">{myStats.appraisalScore}%</strong>
            <span className="text-[10px] text-zinc-500 mt-0.5">Appraisal Score</span>
          </div>
        </div>

        {/* Right: stats */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">Current Rating</span>
            <span className="text-[12px] font-bold text-zinc-900">{myStats.rating} / 5 <span className="text-emerald-600 font-medium">({myStats.ratingLabel})</span></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">Goals Completed</span>
            <span className="text-[12px] font-bold text-zinc-900">{myStats.goalsCompleted}/{myStats.goalsTotal}</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(myStats.goalsCompleted / myStats.goalsTotal) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-zinc-600">Feedback Received</span>
            <span className="text-[12px] font-bold text-zinc-900">{myStats.feedbackCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">Last Review</span>
            <span className="text-[12px] font-bold text-zinc-900">{myStats.lastReviewDate}</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BANNER / HERO SLIDER — commented out as requested (kept in code, not
   removed). Replaced in the page body by <WelcomeHeader /> below.
   ─────────────────────────────────────────────────────────────────────────

const SLIDES = [
  { imageUrl: '/bannerImges/img1.png' },
  { imageUrl: '/bannerImges/img2.png' },
  { imageUrl: '/bannerImges/img3.jpg' },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showEmployeeDashboard, setShowEmployeeDashboard] = useState(false);
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
    <section className="relative overflow-hidden rounded-xl shadow-md min-h-[120px] bg-zinc-100" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.22s ease' }}>
        <img
          src={slide.imageUrl}
          alt=""
          aria-hidden="true"
          className="w-full object-cover block"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            // Try constructing an absolute URL if the stored URL is relative
            if (img.src && !img.src.startsWith('http')) {
              img.src = `http://localhost:8000${img.src}`;
            } else {
              img.style.display = 'none';
            }
          }}
        />
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

   ───────────────────────────────────────────────────────────────────────── */

// ─── Welcome Header (replaces the banner) ─────────────────────────────────
function WelcomeHeader({ category }: { category?: string }) {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const customizeRef = useRef<HTMLDivElement>(null);

  // live clock, updates every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (customizeRef.current && !customizeRef.current.contains(e.target as Node)) {
        setShowCustomize(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let dashboardOptions = [
    { label: 'Admin Dashboard', href: '/dashboard/admin-dashboard' },
    { label: 'HR Dashboard', href: '/dashboard/hr-dashboard' },
    { label: 'Employee Dashboard', href: '/dashboard/employee' },
  ];

  if (category === 'employee' || category === 'reporting_manager' || category === 'finance') {
    dashboardOptions = [];
  } else if (category === 'hod') {
    dashboardOptions = [
      { label: 'HOD Dashboard', href: '/dashboard/hod-dashboard' },
      { label: 'Employee Dashboard', href: '/dashboard/employee' },
    ];
  }

  const displayDate = selectedDate || now;
  const dateStr = displayDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSelectDashboard = (href: string) => {
    setShowCustomize(false);
    router.push(href);
  };

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <h1 className="text-md font-bold text-zinc-900 leading-tight">Welcome back, Vikram Singh 👋</h1>
        <p className="text-[13px] text-zinc-600 mt-1">Here&apos;s what&apos;s happening in your team today.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div
          className="relative flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-1.5 cursor-pointer hover:border-violet-300 transition-colors"
          onClick={(e) => {
            const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
            if (input && typeof input.showPicker === 'function') {
              try { input.showPicker(); } catch (err) { }
            }
          }}
        >
          <input
            type="date"
            className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
            value={selectedDate ? selectedDate.toISOString().split('T')[0] : now.toISOString().split('T')[0]}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split('-');
                setSelectedDate(new Date(Number(y), Number(m) - 1, Number(d)));
              }
            }}
          />
          <CalendarDays size={14} className="text-zinc-500 shrink-0 pointer-events-none" />
          <span className="text-[12px] font-semibold text-zinc-700 whitespace-nowrap pointer-events-none">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-1.5">
          <Clock size={14} className="text-zinc-500 shrink-0" />
          <span className="text-[12px] font-semibold text-zinc-700 tabular-nums whitespace-nowrap">{timeStr}</span>
        </div>

        {dashboardOptions.length > 0 && (
          <div className="relative" ref={customizeRef}>
            <button
              onClick={() => setShowCustomize((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Settings size={14} />
              Customize Dashboard
            </button>
            {showCustomize && (
              <div className="absolute right-0 top-full mt-1.5 z-20 w-48 border border-zinc-200 bg-white shadow-sm overflow-hidden">
                {dashboardOptions.map((opt) => (
                  <button
                    key={opt.href}
                    onClick={() => handleSelectDashboard(opt.href)}
                    className="block w-full px-3 py-2 text-left text-[12px] font-medium text-zinc-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
      <CardContent className="relative p-3">
        <div className={`absolute right-0 top-0 h-14 w-14 translate-x-4 -translate-y-4 rounded-full opacity-[.08] ${meta.accent}`} />
        <div className="flex items-center gap-2">
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white shadow-sm ${meta.accent}`}>{meta.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-zinc-500 truncate leading-tight">{meta.title}</p>
            <p className="text-xl font-bold tracking-tight text-zinc-900 leading-tight">{val}</p>
            <div className="flex items-center gap-1">
              {meta.deltaType === 'up' && <TrendingUp size={9} className="text-emerald-500 shrink-0" />}
              {meta.deltaType === 'down' && <TrendingDown size={9} className="text-rose-500 shrink-0" />}
              <span className={`text-[9px] font-medium ${meta.deltaType === 'up' ? 'text-emerald-600' : meta.deltaType === 'down' ? 'text-rose-500' : 'text-amber-600'}`}>{meta.delta}</span>
              {meta.subLabel && <span className="text-[9px] text-zinc-400">{meta.subLabel}</span>}
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
    <Card className={`border-zinc-200/80 shadow-sm flex flex-col ${className}`}>
      <CardContent className="p-3.5 flex-1 flex flex-col min-h-0">
        <div className="mb-2.5 flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <h3 className="text-sm font-semibold text-zinc-900 whitespace-nowrap">{title}</h3>
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

function ImportantAlertsCards() {
  const alerts = [
    {
      icon: <AlertTriangle size={12} />,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
      cardBg: 'bg-rose-50/40',
      border: 'border-rose-100',
      count: '5 Leave Requests',
      sub: 'awaiting approval',
      priority: 'High Priority',
      priorityColor: 'text-rose-500',
      href: '/dashboard/leaves',
    },
    {
      icon: <FileWarning size={12} />,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
      cardBg: 'bg-amber-50/40',
      border: 'border-amber-100',
      count: '3 Documents',
      sub: 'expiring soon',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-500',
      href: '/dashboard/documents',
    },
    {
      icon: <UserCheck size={12} />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      cardBg: 'bg-blue-50/40',
      border: 'border-blue-100',
      count: '12 Probation',
      sub: 'ending this month',
      priority: 'Medium Priority',
      priorityColor: 'text-amber-500',
      href: '/dashboard/employees',
    },
    {
      icon: <BarChart3 size={12} />,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
      cardBg: 'bg-emerald-50/40',
      border: 'border-emerald-100',
      count: 'Q2 Performance Review',
      sub: 'in progress',
      priority: 'Low Priority',
      priorityColor: 'text-emerald-500',
      href: '/dashboard/performance',
    },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm font-semibold text-zinc-900">Important Alerts</h3>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard/alerts" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
              View All Alerts <ArrowRight size={13} />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:grid-cols-4">
          {alerts.map((alert, i) => (
            <Link key={i} href={alert.href}
              className={`flex items-center gap-2 rounded-lg border ${alert.border} ${alert.cardBg} px-2 py-1.5 hover:shadow-sm transition-all group`}>
              <div className={`shrink-0 h-6 w-6 rounded-full ${alert.iconBg} flex items-center justify-center ${alert.iconColor}`}>
                {alert.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-zinc-800 leading-tight">{alert.count}</p>
                <p className="text-[9px] text-zinc-500 leading-tight">{alert.sub}</p>
                <p className={`text-[9px] font-semibold ${alert.priorityColor} leading-tight`}>{alert.priority}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceOverview({ attendance }: { attendance: any }) {
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
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h3 className="text-[12px] font-semibold text-zinc-900">Attendance Overview</h3>
        </div>
        <div className="rounded-lg border border-zinc-100 overflow-hidden">
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
  return (
    <ChartCard title="Leave Overview" action="View Report" href="/dashboard/leaves" className="xl:h-[270px]">
      <div className="flex items-center gap-3 h-full">
        {/* Left: progress bars */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5">
          {leaveBalanceData.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 w-[88px] shrink-0 truncate">{item.type}</span>
              <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.balance / 20) * 100}%`, backgroundColor: item.color }} />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 w-6 text-right shrink-0">{item.balance}</span>
            </div>
          ))}
          <div className="mt-1 pt-2 border-t border-zinc-100 flex gap-4">
            <div>
              <p className="text-[10px] text-zinc-400 leading-tight">Approved</p>
              <p className="text-[13px] font-bold text-zinc-800">47</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 leading-tight">Rejected</p>
              <p className="text-[13px] font-bold text-zinc-800">8</p>
            </div>
          </div>
        </div>

        {/* Right: donut chart */}
        <div className="shrink-0 relative" style={{ width: 100, height: 100 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leaveBalanceData.map(l => ({ name: l.type, value: l.balance }))}
                dataKey="value"
                innerRadius={30}
                outerRadius={46}
                paddingAngle={3}
                stroke="none"
              >
                {leaveBalanceData.map((entry) => <Cell key={entry.type} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <strong className="text-[13px] font-bold text-zinc-900 leading-none">45.5</strong>
            <span className="text-[9px] text-zinc-500 mt-0.5 leading-tight">Total Days</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function PerformanceOverview() {
  return (
    <ChartCard title="Performance Overview" action="View Dashboard" href="/dashboard/performance" className="xl:h-[270px]">
      <div className="flex items-center gap-4 h-full">
        {/* Left: large donut */}
        <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={performanceData}
                dataKey="value"
                innerRadius={40}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
              >
                {performanceData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <strong className="text-[18px] font-bold text-zinc-900 leading-none">1,248</strong>
            <span className="text-[10px] text-zinc-500 mt-0.5">Employees</span>
          </div>
        </div>

        {/* Right: legend with bars */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5">
          {performanceData.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-600 leading-tight">
                  <span className="h-2 w-2 rounded-full shrink-0 inline-block" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="text-[11px] font-bold text-zinc-900 shrink-0 ml-1">
                  {item.value} <span className="font-normal text-zinc-400 text-[10px]">{item.pct}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.value / 1248) * 100}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function AvatarStack({ extra, color, onClick }: { extra: number; color: string; onClick: () => void }) {
  const initials: [string, string][] = [['P', '#e2e8f0'], ['R', '#dbeafe'], ['N', '#fce7f3']];
  return (
    <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={(e) => { e.stopPropagation(); onClick(); }} title="Click to see all employees">
      {initials.map(([letter, bg], i) => (
        <div key={i} className="h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-zinc-600 -ml-1.5 first:ml-0 shrink-0" style={{ backgroundColor: bg, zIndex: 3 - i }}>{letter}</div>
      ))}
      <div className="h-6 w-6 rounded-full border-2 border-white -ml-1.5 flex items-center justify-center text-[8px] font-bold shrink-0" style={{ backgroundColor: `${color}22`, color }}>+{extra}</div>
    </div>
  );
}

function EmployeeListPanel({ alertKey, color, bg, onClose }: { alertKey: string; color: string; bg: string; onClose: () => void; }) {
  const employees = ALERT_EMPLOYEES[alertKey] || [];
  return (
    <div className="px-3 pb-2 pt-1" onClick={(e) => e.stopPropagation()}>
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: `${color}33` }}>
        <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-semibold" style={{ backgroundColor: bg, color }}>
          <span>{employees.length} Employees</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="rounded p-0.5 hover:bg-black/5 transition-colors"><X size={11} /></button>
        </div>
        <div className="grid grid-cols-4 gap-0 bg-white">
          {employees.map((emp, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-50 transition-colors cursor-pointer ${i >= 4 ? 'border-t border-zinc-100' : ''}`}>
              <div className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 text-white" style={{ backgroundColor: color }}>{emp.name.charAt(0)}</div>
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

// Generate Report) ──────────────────────────────────────────────────────────
function QuickActions() {
  type ActionItem = { href: string; icon: React.ReactNode; label: string; color: string; badge?: number; sub?: string; };

  const actions: ActionItem[] = [
    { href: '/dashboard/leaves/approve', icon: <CalendarCheck size={16} />, label: 'Approve Leave', color: 'text-emerald-600 bg-emerald-50' },
    { href: '/dashboard/attendance/approve', icon: <ScanFace size={16} />, label: 'Approve Attendance', color: 'text-blue-600 bg-blue-50' },
    { href: '/dashboard/performance/appraisal/new', icon: <Star size={16} />, label: 'Start Appraisal', color: 'text-violet-600 bg-violet-50' },
    { href: '/dashboard/appreciation/new', icon: <PartyPopper size={16} />, label: 'Give Appreciation', color: 'text-pink-600 bg-pink-50' },
    { href: '/dashboard/discipline/warning/new', icon: <AlertTriangle size={16} />, label: 'Issue Warning', color: 'text-rose-600 bg-rose-50' },
    { href: '/dashboard/hiring/manpower/new', icon: <Briefcase size={16} />, label: 'Create Requisition', color: 'text-cyan-600 bg-cyan-50' },
    { href: '/dashboard/training/assign', icon: <GraduationCap size={16} />, label: 'Assign Training', color: 'text-amber-600 bg-amber-50' },
    { href: '/dashboard/tasks/new', icon: <ListTodo size={16} />, label: 'New Task', color: 'text-indigo-600 bg-indigo-50' },
    { href: '/dashboard/finance/imprest/new', icon: <Wallet2 size={16} />, label: 'Request Imprest', color: 'text-teal-600 bg-teal-50' },
    { href: '/dashboard/reports/generate', icon: <Download size={16} />, label: 'Generate Report', color: 'text-slate-600 bg-slate-50' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="px-2 pt-1.5 pb-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[12px] font-semibold text-zinc-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-5 gap-1 md:grid-cols-10">
          {actions.map((a) => (
            <Link key={a.label} href={a.href}
              className="relative flex flex-col items-center gap-0.5 rounded-lg border border-zinc-100 px-1 py-1 text-center hover:border-violet-200 hover:bg-violet-50/60 transition-colors group">
              {a.badge !== undefined && a.badge > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[13px] h-3 rounded-full bg-rose-500 text-white text-[7px] font-bold flex items-center justify-center px-0.5 leading-none z-10">{a.badge}</span>
              )}
              <span className={`grid h-6 w-6 place-items-center rounded-md ${a.color} shrink-0 group-hover:scale-105 transition-transform`}>{a.icon}</span>
              <span className="text-[8px] font-semibold text-zinc-600 leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Team Performance ranking card (replaces Quick Actions in the 3-col row,
//     styled to match the "Team Performance" panel from the reference image) ─
function TeamPerformanceCard() {
  const ranking: { rank: number; name: string; role: string; avatar: string; score: number; trend: 'up' | 'down' | 'neutral' }[] = [
    { rank: 1, name: 'Amit Kumar', role: 'Senior Engineer', avatar: '40', score: 98, trend: 'up' },
    { rank: 2, name: 'Rahul Sharma', role: 'Project Lead', avatar: '41', score: 95, trend: 'up' },
    { rank: 3, name: 'Deepak Verma', role: 'Engineer', avatar: '42', score: 93, trend: 'up' },
    { rank: 4, name: 'Rohan Mehta', role: 'Executive', avatar: '43', score: 71, trend: 'neutral' },
    { rank: 5, name: 'Pooja Singh', role: 'Executive', avatar: '44', score: 68, trend: 'down' },
  ];

  const summary = [
    { label: 'High', range: '(>90%)', count: 12, color: 'text-emerald-600' },
    { label: 'Avg', range: '(70-90%)', count: 18, color: 'text-blue-600' },
    { label: 'Low', range: '(<70%)', count: 5, color: 'text-amber-600' },
    { label: 'At Risk', range: '(<70%)', count: 3, color: 'text-rose-600' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">Team Performance</h3>
          <Link href="/dashboard/performance" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
          <div className="grid grid-cols-[18px_1fr_44px_24px] items-center gap-2 px-1 pb-1 text-[9px] font-semibold text-zinc-400 uppercase tracking-wide">
            <span>#</span>
            <span>Employee</span>
            <span className="text-right">Score</span>
            <span className="text-right">Trend</span>
          </div>
          {ranking.map((p) => (
            <div key={p.rank} className="grid grid-cols-[18px_1fr_44px_24px] items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-zinc-50 transition-colors">
              <span className="text-[11px] font-bold text-zinc-400">{p.rank}</span>
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={`https://i.pravatar.cc/150?u=${p.avatar}`}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                  alt={p.name}
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-zinc-800 truncate leading-tight">{p.name}</p>
                  <p className="text-[9px] text-zinc-400 truncate">{p.role}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-zinc-900 text-right">{p.score}%</span>
              <span className="flex justify-end">
                {p.trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
                {p.trend === 'down' && <TrendingDown size={12} className="text-rose-500" />}
                {p.trend === 'neutral' && <span className="text-zinc-400 text-[11px] font-bold leading-none">—</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-zinc-100 shrink-0">
          {summary.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[8px] text-zinc-400 leading-tight font-medium">{s.label}</p>
              <p className="text-[8px] text-zinc-400 leading-tight">{s.range}</p>
              <p className={`text-[15px] font-bold ${s.color} leading-tight mt-0.5`}>{s.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Reports Shortcut (new card from img4) ────────────────────────────────────
function ReportsShortcut() {
  const reports = [
    { label: 'Attendance Report', icon: <ScanFace size={16} />, color: 'text-violet-600 bg-violet-50', href: '/dashboard/reports/attendance' },
    { label: 'Leave Report', icon: <CalendarX2 size={16} />, color: 'text-emerald-600 bg-emerald-50', href: '/dashboard/reports/leave' },
    { label: 'Payroll Report', icon: <Wallet size={16} />, color: 'text-amber-600 bg-amber-50', href: '/dashboard/reports/payroll' },
    { label: 'Recruitment Report', icon: <UserRoundPlus size={16} />, color: 'text-blue-600 bg-blue-50', href: '/dashboard/reports/recruitment' },
    { label: 'Performance Report', icon: <BarChart3 size={16} />, color: 'text-purple-600 bg-purple-50', href: '/dashboard/reports/performance' },
    { label: 'Attrition Report', icon: <TrendingDown size={16} />, color: 'text-rose-600 bg-rose-50', href: '/dashboard/reports/attrition' },
    { label: 'Compliance Report', icon: <BadgeCheck size={16} />, color: 'text-teal-600 bg-teal-50', href: '/dashboard/reports/compliance' },
    { label: 'Training Report', icon: <Star size={16} />, color: 'text-orange-600 bg-orange-50', href: '/dashboard/reports/training' },
    { label: 'Expense Report', icon: <Wallet2 size={16} />, color: 'text-indigo-600 bg-indigo-50', href: '/dashboard/reports/expense' },
    { label: 'View All Reports', icon: <FileText size={16} />, color: 'text-slate-600 bg-slate-50', href: '/dashboard/reports' },
    { label: 'Audit Report', icon: <ScanLine size={16} />, color: 'text-pink-600 bg-pink-50', href: '/dashboard/reports/audit' },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="px-2 pt-1.5 pb-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[12px] font-semibold text-zinc-900">Reports Shortcut</h3>
          <Link href="/dashboard/reports" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            All Reports <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-1 md:grid-cols-6 xl:grid-cols-11">
          {reports.map((r) => (
            <Link key={r.label} href={r.href}
              className="flex flex-col items-center gap-0.5 rounded-lg border border-zinc-100 px-1 py-1 text-center hover:border-violet-200 hover:bg-violet-50/60 transition-colors group">
              <span className={`grid h-6 w-6 place-items-center rounded-md ${r.color} shrink-0 group-hover:scale-105 transition-transform`}>{r.icon}</span>
              <span className="text-[8px] font-semibold text-zinc-600 leading-tight">{r.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Leave Approvals (new card, matches reference dashboard) ─────────────────
const leaveApprovalsData = [
  { label: 'Leave Requests', count: 12, sub: 'Pending', icon: <CalendarX2 size={16} />, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/leaves?filter=pending' },
  { label: 'Regularization', count: 3, sub: 'Pending', icon: <ClipboardCheck size={16} />, color: 'text-amber-600', bg: 'bg-amber-50', href: '/dashboard/attendance/regularization' },
  { label: 'Comp Off', count: 5, sub: '', icon: <CalendarCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/dashboard/leaves/comp-off' },
  { label: 'Half Day', count: 2, sub: 'Pending', icon: <Clock3 size={16} />, color: 'text-violet-600', bg: 'bg-violet-50', href: '/dashboard/leaves/half-day' },
];

function LeaveApprovalsCard() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[220px] flex flex-col">
      <CardContent className="p-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">Leave Approvals</h3>
          <Link href="/dashboard/leaves" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {leaveApprovalsData.map((item) => (
            <Link key={item.label} href={item.href}
              className="flex flex-row items-center gap-2.5 rounded-lg border border-zinc-100 px-2.5 py-2 hover:border-violet-200 hover:bg-violet-50/40 transition-colors">
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${item.bg} ${item.color} shrink-0`}>{item.icon}</span>
              <div className="min-w-0">
                <p className="text-[12px] text-black-600 leading-tight font-medium truncate">{item.label}</p>
                <p className="text-[14px] font-bold text-zinc-900 leading-none">{item.count}</p>
                {item.sub && <p className="text-[10px] text-zinc-500 leading-tight">{item.sub}</p>}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── AI Insights (new card, matches reference dashboard) ─────────────────────
const aiInsightsData = [
  { text: '3 employees are at high risk of resignation.', icon: <AlertTriangle size={13} />, color: 'text-rose-600', bg: 'bg-rose-50' },
  { text: '5 employees are eligible for promotion.', icon: <TrendingUp size={13} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { text: 'Team productivity dropped by 12% vs last month.', icon: <TrendingDown size={13} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { text: 'Overtime cost increased by 18% this month.', icon: <Wallet size={13} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  { text: '2 disciplinary cases require your attention.', icon: <FileWarning size={13} />, color: 'text-rose-600', bg: 'bg-rose-50' },
];

function AiInsightsCard() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[220px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">AI Insights</h3>
          <Link href="/dashboard/insights" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
          {aiInsightsData.map((item, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-zinc-100 px-2 py-1.5">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${item.bg} ${item.color}`}>{item.icon}</span>
              <p className="text-[11px] text-zinc-700 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Team Performance stat row (High / Average / Low Performers, At Risk) ────
const teamPerformanceStats = [
  { label: 'High Performers', sub: '(≥90%)', count: 12, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <TrendingUp size={14} /> },
  { label: 'Average Performers', sub: '(70-90%)', count: 18, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <BarChart3 size={14} /> },
  { label: 'Low Performers', sub: '(<70%)', count: 5, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <TrendingDown size={14} /> },
  { label: 'At Risk Employees', sub: '', count: 3, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: <AlertTriangle size={14} /> },
];

function TeamPerformanceStats() {
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="px-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-zinc-900">Team Performance</h3>
          <Link href="/dashboard/performance" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
          {teamPerformanceStats.map((item) => (
            <div key={item.label} className={`flex items-center gap-2 rounded-lg border ${item.border} ${item.bg} px-2.5 py-2`}>
              <span className={`shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center ${item.color}`}>{item.icon}</span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-zinc-900 leading-tight">{item.count}</p>
                <p className="text-[10px] font-medium text-zinc-600 leading-tight truncate">{item.label} <span className="text-zinc-400">{item.sub}</span></p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Top Late Comers (new card, matches reference dashboard) ─────────────────
const topLateComersData = [
  { name: 'Rohan Mehta', role: 'Sales Executive', avatar: '30', time: '10:15 AM' },
  { name: 'Sandeep Yadav', role: 'Support Engineer', avatar: '31', time: '10:02 AM' },
  { name: 'Karan Patel', role: 'Accountant', avatar: '33', time: '09:58 AM' },
];

function TopLateComers() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[220px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">Top Late Comers</h3>
          <Link href="/dashboard/attendance?sort=late" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
          {topLateComersData.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-zinc-50 transition-colors">
              <img
                src={`https://i.pravatar.cc/150?u=${p.avatar}`}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                alt={p.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-zinc-800 truncate leading-tight">{p.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{p.role}</p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                <TimerReset size={10} />
                {p.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Recruitment Overview (rebuilt to match reference: simple stat list) ─────
const recruitmentOverviewStats = [
  { label: 'Open Requisitions', value: 7, icon: <FolderOpen size={16} />, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Interviews Scheduled', value: 15, icon: <CalendarClock size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Joining This Month', value: 6, icon: <UserRoundPlus size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Offer Acceptance Ratio', value: '86%', icon: <Percent size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
];

function RecruitmentOverview() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-sm font-bold text-zinc-900">Recruitment Overview</h3>
          <Link href="/dashboard/hiring" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex-1 min-h-0 space-y-1.5">
          {recruitmentOverviewStats.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-lg border border-zinc-100 px-2.5 py-2.5 hover:bg-zinc-50 transition-colors">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.bg} ${item.color}`}>{item.icon}</span>
              <span className="flex-1 text-[12px] font-medium text-zinc-700">{item.label}</span>
              <span className="text-[16px] font-bold text-zinc-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Payroll Overview (img2 left) ─────────────────────────────────────────────
function PayrollOverview() {
  const [period, setPeriod] = useState('June 2026');
  const [open, setOpen] = useState(false);
  const periods = ['April 2026', 'May 2026', 'June 2026'];

  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Wallet size={14} className="text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-900">Payroll Overview</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-sm hover:border-violet-300 transition-colors"
            >
              {period} <ChevronDown size={11} />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 z-10 w-32 rounded-lg border border-zinc-200 bg-white shadow-lg overflow-hidden">
                {periods.map((p) => (
                  <button key={p} onClick={() => { setPeriod(p); setOpen(false); }}
                    className={`w-full px-3 py-1.5 text-left text-[11px] hover:bg-violet-50 transition-colors ${p === period ? 'text-violet-700 font-semibold bg-violet-50/60' : 'text-zinc-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payroll Status */}
        <div className="flex items-center justify-between mb-2 px-3 py-1 rounded-lg bg-zinc-50 border border-zinc-100">
          <span className="text-[12px] font-medium text-zinc-600">Payroll Status</span>
          <span className="text-[11px] font-bold px-1 py-0.5 rounded-full bg-violet-100 text-violet-700">In Progress</span>
        </div>

        {/* Stats */}
        <div className="space-y-1 mb-3">
          {[
            { label: 'Processed', value: 890, color: 'text-emerald-600' },
            { label: 'Pending', value: 358, color: 'text-amber-600' },
            { label: 'Reimbursements', value: 24, color: 'text-blue-600' },
            { label: 'Advances', value: 16, color: 'text-rose-600' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1 border-b border-zinc-100 last:border-0">
              <span className="text-[11px] text-zinc-600">{item.label}</span>
              <span className={`text-[13px] font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Salary Day */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <Link href="/dashboard/payroll" className="text-[12px] font-semibold text-violet-600 hover:text-violet-700">Salary Day</Link>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">30 Jun 2026</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Compliance Overview (img2 right) ─────────────────────────────────────────
function ComplianceOverview() {
  const [period, setPeriod] = useState('This Month');
  const [open, setOpen] = useState(false);
  const periods = ['This Week', 'This Month', 'This Quarter'];

  const items = [
    { icon: <FileWarning size={16} />, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', label: 'Missing Documents', count: 35 },
    { icon: <AlertTriangle size={16} />, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', label: 'Expiring Soon', count: 22 },
    { icon: <CheckCircle2 size={16} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', label: 'KYC Pending', count: 18 },
    { icon: <ScanFace size={16} />, iconBg: 'bg-violet-50', iconColor: 'text-violet-500', label: 'Verifications Pending', count: 14 },
  ];

  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-violet-500" />
            <h3 className="text-sm font-bold text-zinc-900">Compliance Overview</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 shadow-sm hover:border-violet-300 transition-colors"
            >
              {period} <ChevronDown size={11} />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 z-10 w-36 rounded-lg border border-zinc-200 bg-white shadow-lg overflow-hidden">
                {periods.map((p) => (
                  <button key={p} onClick={() => { setPeriod(p); setOpen(false); }}
                    className={`w-full px-3 py-1.5 text-left text-[11px] hover:bg-violet-50 transition-colors ${p === period ? 'text-violet-700 font-semibold bg-violet-50/60' : 'text-zinc-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-1 mb-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 py-1 border-b border-zinc-100 last:border-0">
              <div className={`h-7 w-7 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor} shrink-0`}>
                {item.icon}
              </div>
              <span className="text-[11px] text-zinc-600 flex-1">{item.label}</span>
              <span className="text-[13px] font-bold text-zinc-900">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-100">
          <Link href="/dashboard/compliance" className="text-[12px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            View Compliance Center
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

const birthdayPeople = [
  { name: 'Sameera Abbas', team: 'Marketing Team', avatar: '1', when: 'Today', whenColor: 'bg-violet-100 text-violet-700', whenBorder: 'border-violet-200' },
  { name: 'Rohan Mehra', team: 'Sales Team', avatar: '2', when: 'Today', whenColor: 'bg-violet-100 text-violet-700', whenBorder: 'border-violet-200' },
  { name: 'Priya Sharma', team: 'HR Team', avatar: '7', when: 'Tomorrow', whenColor: 'bg-violet-100 text-violet-700', whenBorder: 'border-violet-200' },
  { name: 'Arjun Verma', team: 'Engineering', avatar: '8', when: 'In 2 days', whenColor: 'bg-emerald-100 text-emerald-700', whenBorder: 'border-emerald-200' },
];

const anniversaryPeople = [
  { name: 'Neha Gupta', team: 'Finance Team', avatar: '15', when: 'Today', whenColor: 'bg-violet-100 text-violet-700', whenBorder: 'border-violet-200' },
  { name: 'Vikram Singh', team: 'Operations', avatar: '16', when: 'Tomorrow', whenColor: 'bg-violet-100 text-violet-700', whenBorder: 'border-violet-200' },
  { name: 'Pooja Nair', team: 'Design', avatar: '17', when: 'In 3 days', whenColor: 'bg-emerald-100 text-emerald-700', whenBorder: 'border-emerald-200' },
];

function BirthdaysOverview() {
  const [activeTab, setActiveTab] = useState<'birthdays' | 'anniversaries'>('birthdays');
  const people = activeTab === 'birthdays' ? birthdayPeople : anniversaryPeople;
  const moreCount = activeTab === 'birthdays' ? 4 : 2;

  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-start justify-between mb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <Cake size={13} className="text-rose-500" />
            </div>
            <h3 className="text-[12px] font-bold text-zinc-900 leading-tight">Birthdays &amp; Anniversaries</h3>
          </div>
          <Link href="/dashboard/celebrations" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700 whitespace-nowrap shrink-0 mt-0.5">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex border-b border-zinc-100 mb-2 shrink-0">
          <button
            onClick={() => setActiveTab('birthdays')}
            className={`flex-1 pb-1.5 text-[11px] font-semibold transition-colors relative text-left ${activeTab === 'birthdays' ? 'text-violet-600' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Birthdays ({birthdayPeople.length})
            {activeTab === 'birthdays' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('anniversaries')}
            className={`flex-1 pb-1.5 text-[11px] font-semibold transition-colors relative text-right ${activeTab === 'anniversaries' ? 'text-violet-600' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            Anniversaries ({anniversaryPeople.length})
            {activeTab === 'anniversaries' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />}
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
          {people.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5 px-1 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer">
              <img
                src={`https://i.pravatar.cc/150?u=${p.avatar}`}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                alt={p.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-zinc-800 truncate leading-tight">{p.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{p.team}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${p.whenColor} ${p.whenBorder}`}>
                {p.when}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 mt-1 border-t border-zinc-100 shrink-0">
          <button className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            + {moreCount} more {activeTab === 'birthdays' ? 'birthdays' : 'anniversaries'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Activity Log data ────────────────────────────────────────────────────────
const activityLogs = [
  {
    user: { name: 'Rohit Mehra', avatar: '32', initials: 'RM' },
    action: 'submitted a leave request',
    date: 'Today',
    time: '10:21 AM',
    ip: '192.168.1.102',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    user: { name: 'Priya Sharma', avatar: '68', initials: 'PS' },
    action: 'uploaded document "Offer Letter"',
    date: 'Today',
    time: '09:45 AM',
    ip: '192.168.1.88',
    accent: 'bg-emerald-50 text-emerald-600',
  },
  {
    user: { name: 'Anjali Verma', avatar: '45', initials: 'AV' },
    action: 'new employee joined',
    date: 'Today',
    time: '09:30 AM',
    ip: '192.168.2.14',
    accent: 'bg-violet-50 text-violet-600',
  },
  {
    user: { name: 'Karan Mehta', avatar: '52', initials: 'KM' },
    action: 'interview scheduled for Senior Developer',
    date: 'Yesterday',
    time: '04:15 PM',
    ip: '10.0.0.45',
    accent: 'bg-amber-50 text-amber-600',
  },
  {
    user: { name: 'System', avatar: null, initials: 'SY' },
    action: 'salary for May 2026 has been processed',
    date: 'Yesterday',
    time: '02:30 PM',
    ip: '10.0.0.1',
    accent: 'bg-teal-50 text-teal-600',
  },
];

function ActivityLog() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">Activity Log</h3>
          <Link href="/dashboard/audit-logs" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 space-y-0.5">
          {activityLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-zinc-50 transition-colors group">
              {/* User avatar */}
              <div className="shrink-0 relative">
                {log.user.avatar ? (
                  <img
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${log.user.avatar}.jpg`}
                    alt={log.user.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-100 shadow-sm"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ${log.accent}`}>
                    {log.user.initials}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-700 leading-tight">
                  <span className="font-semibold text-zinc-900">{log.user.name}</span>{' '}
                  {log.action}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[9.5px] text-zinc-400 tabular-nums">
                    {log.date} · {log.time}
                  </span>
                  <span className="text-[9px] text-zinc-300">•</span>
                  <span className="text-[9.5px] text-zinc-400 font-mono">{log.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function RecentNewJoiners() {
  return (
    <Card className="border-zinc-200/80 shadow-sm xl:h-[270px] flex flex-col">
      <CardContent className="p-3 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-sm font-semibold text-zinc-900">Recent New Joiners</h3>
          <Link href="/dashboard/employees?filter=new" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 hover:text-violet-800 whitespace-nowrap">
            View All <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-zinc-200">
          {recentNewJoiners.map((joiner, i) => (
            <div key={i} className="flex items-center gap-2.5 group hover:bg-zinc-50/80 rounded-xl px-2 py-1.5 -mx-1.5 transition-all cursor-pointer border border-transparent hover:border-zinc-100 hover:shadow-sm mb-1">
              <div className="relative shrink-0">
                <img
                  src={`https://i.pravatar.cc/150?u=${joiner.avatar}`}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                  alt={joiner.name}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-zinc-800 truncate leading-tight">{joiner.name}</p>
                <p className="text-[10px] text-violet-500 font-medium truncate">{joiner.role}</p>
              </div>
              <span className="text-[10px] text-zinc-400 shrink-0 tabular-nums bg-zinc-50 border border-zinc-100 rounded-full px-2 py-0.5">{joiner.joinedAgo}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-semibold text-zinc-700">18 new joiners this month</span>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {['20', '21', '22', '23'].map((u) => (
                <img key={u} src={`https://i.pravatar.cc/150?u=${u}`}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                  alt="joiner" />
              ))}
            </div>
            <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-sm">+15</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Today's Schedule — now with "My Task" / "Team Task" toggle ───────────────
function TodaySchedule() {
  const [view, setView] = useState<'my' | 'team'>('my');
  const [tasks, setTasks] = useState(todayTasks);

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const priorityStyles: Record<string, string> = {
    high: 'text-rose-600 bg-rose-50 border-rose-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  };

  return (
    <Card className="border-zinc-200/80 shadow-sm h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        <div className="mb-2.5 flex items-center justify-between shrink-0">
          <h3 className="text-[13px] font-semibold text-zinc-900">Today's Schedule</h3>
          <Link href="/dashboard/meetings" className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700">
            View Calendar <ArrowRight size={13} />
          </Link>
        </div>

        {/* My Task / Team Task toggle buttons */}
        <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-zinc-100 p-1 shrink-0">
          <button
            onClick={() => setView('my')}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${view === 'my' ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            My Task
          </button>
          <button
            onClick={() => setView('team')}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${view === 'team' ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Team Task
          </button>
        </div>

        {view === 'my' ? (
          // ── My Task view: personal checklist ──
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200 space-y-1.5">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 hover:bg-zinc-50 transition-colors">
                <button onClick={() => toggleTask(task.id)} className="shrink-0 mt-0.5">
                  {task.done ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-zinc-300" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-medium leading-tight ${task.done ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{task.title}</p>
                </div>
                <span className={`shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border capitalize ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          // ── Team Task view: meeting/event timeline ──
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="pr-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="shrink-0 w-[58px] pt-1">
                  <span className="text-[10px] font-medium text-zinc-400 tabular-nums leading-tight">{item.time}</span>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-400 group-hover:bg-violet-600 transition-colors mt-1 shrink-0 ring-2 ring-violet-100" />
                  {i < todaySchedule.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-300 mt-0.5" style={{ minHeight: '28px' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <p className="text-[12px] font-semibold text-zinc-800 leading-tight group-hover:text-violet-700 transition-colors">{item.title}</p>
                  {item.location && (
                    <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={9} className="shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-zinc-100 shrink-0">
          <Link href="/dashboard/meetings"
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            View Full Calendar <ArrowRight size={11} />
          </Link>
        </div>
      </CardContent>
    </Card>
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

  const topKpiKeys = ['org-headcount', 'team-attendance-today', 'absent-today', 'work-from-home', 'late-coming', 'on-leave-today', 'new-joinees'];

  if (config && config.category === 'employee') {
    return <EmployeeDashboard />;
  }

  return (
    <main className="mx-auto max-w-[1600px] space-y-2 pb-4 px-2 sm:px-3">

      {/* Banner — commented out, replaced by WelcomeHeader (see comment block above) */}
      {/* <HeroSlider /> */}
      <WelcomeHeader category={config?.category} />

      {/* KPI Strip */}
      <section className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-zinc-100" />)
          : topKpiKeys.map((key) => <KpiCard key={key} widgetKey={key} />)
        }
      </section>

      {/* Important Alerts */}
      <ImportantAlertsCards />

      {/* Main Content */}
      <div className="grid gap-2 grid-cols-1 xl:grid-cols-12 items-start xl:items-stretch">

        {/* LEFT SIDE: Rows 1 & 2 */}
        <div className="xl:col-span-8 flex flex-col gap-2">
          {/* Row 1: Activity Log | Birthdays */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <MyPerformanceCard />
            <BirthdaysOverview />
          </div>

          {/* Row 2: Attendance Overview | Leave Overview */}
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            <AttendanceOverview attendance={attendance} />
            <LeaveOverview />
          </div>
        </div>

        {/* RIGHT SIDE: Today's Schedule */}
        <div className="xl:col-span-4 relative min-h-[320px] xl:min-h-0">
          <div className="xl:absolute xl:inset-0 h-full w-full">
            <TodaySchedule />
          </div>
        </div>

        {/* FULL WIDTH: Row 2b — Leave Approvals | Top Late Comers | AI Insights */}
        <div className="xl:col-span-12 flex flex-col gap-2">
          <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
            <LeaveApprovalsCard />
            <TopLateComers />
            <AiInsightsCard />
          </div>
        </div>

        {/* FULL WIDTH: Row 3 — Performance | Team Performance (replaces Quick Actions) | Recent New Joiners */}
        <div className="xl:col-span-12 flex flex-col gap-2">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <ActivityLog />
            <TeamPerformanceCard />
            <RecentNewJoiners />
          </div>
        </div>

        {/* FULL WIDTH: Row 4 — Reports Shortcut */}
        {/* <div className="xl:col-span-12 flex flex-col gap-2">
          <ReportsShortcut />
        </div> */}

        {/* FULL WIDTH: Row 5 — Payroll | Compliance | Recruitment */}
        <div className="xl:col-span-12">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <PayrollOverview />
            <ComplianceOverview />
            <RecruitmentOverview />
          </div>
        </div>

        {/* FULL WIDTH: Bottom strip — Quick Actions */}
        <div className="xl:col-span-12">
          <QuickActions />
        </div>

      </div>
    </main>
  );
}