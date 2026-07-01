'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Calendar, Plane, Target,Upload, Download, Camera, IdCard, Briefcase, UserRound, AtSign, Phone, MapPin, CalendarDays, ArrowRight, Plus,
  ScanFace, CalendarCheck, Clock, FileBadge2, Headset, Megaphone,Gift, Rocket, FileSignature, Banknote, AlertCircle, LogOut,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
const employee = {
  name: 'Ananya Singh',
  role: 'UI/UX Designer',
  status: 'Active',
  employeeId: 'EMP10234',
  department: 'Design',
  reportingManager: 'Rohan Mehra',
  email: 'ananya.singh@crewcam.com',
  phone: '+91 98765 43210',
  location: 'Noida, India',
  dateOfJoining: '15 Mar 2023',
  // Fixed, deterministic female portrait (no random gender mismatch like pravatar seeds)
  avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
};

const attendanceWeek = [
  { day: 'Mon', value: 100, status: 'present' },
  { day: 'Tue', value: 100, status: 'present' },
  { day: 'Wed', value: 100, status: 'present' },
  { day: 'Thu', value: 100, status: 'present' },
  { day: 'Fri', value: 75, status: 'half' },
  { day: 'Sat', value: 0, status: 'leave' },
  { day: 'Sun', value: 0, status: 'absent' },
];

const STATUS_COLOR: Record<string, string> = {
  present: '#22c55e',
  half: '#f59e0b',
  absent: '#ef4444',
  leave: '#8b5cf6',
};

const upcomingEvents = [
  { day: '28', mon: 'JUN', title: 'Team Meeting', detail: '10:00 AM – Conference Room A' },
  { day: '30', mon: 'JUN', title: 'Project Deadline', detail: 'End of Day' },
  { day: '01', mon: 'JUL', title: 'Performance Review', detail: '02:30 PM – HR Cabin' },
  { day: '05', mon: 'JUL', title: 'Training: Figma Advanced', detail: '11:00 AM – Online' },
];

const initialTasks = [
  { id: 1, title: 'Update UI for Dashboard', due: 'Due: Today', priority: 'High', done: false },
  { id: 2, title: 'Review Design System', due: 'Due: Tomorrow', priority: 'Medium', done: false },
  { id: 3, title: 'Prepare Prototype', due: 'Due: 30 Jun 2026', priority: 'Low', done: false },
];

const PRIORITY_STYLE: Record<string, string> = {
  High: 'bg-rose-50 text-rose-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-emerald-50 text-emerald-600',
};

const leaveBalances = [
  { label: 'Casual Leave', used: 12.5, total: 15, color: '#22c55e', icon: CalendarCheck },
  { label: 'Sick Leave', used: 7, total: 10, color: '#f59e0b', icon: ScanFace },
  { label: 'Privileged Leave', used: 8, total: 10, color: '#3b82f6', icon: CalendarDays },
  { label: 'Comp Off', used: 3, total: 5, color: '#8b5cf6', icon: Clock },
];

const leaveStatus = [
  { type: 'Vacation Leave', range: '2 Days · 26 – 27 Jun 2026', status: 'Pending', style: 'bg-amber-50 text-amber-600' },
  { type: 'Sick Leave', range: '1 Day · 18 Jun 2026', status: 'Approved', style: 'bg-emerald-50 text-emerald-600' },
  { type: 'Comp Off', range: '1 Day · 10 Jun 2026', status: 'Approved', style: 'bg-emerald-50 text-emerald-600' },
];

// Replaces "Recent Payslips" with downloadable documents — salary slip + offer letter
const myDocuments = [
  { label: 'Salary Slip', sub: 'June 2026 · 30 Jun 2026', icon: Banknote, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Offer Letter', sub: 'PDF · Issued 12 Jan 2024', icon: FileSignature, accent: 'bg-blue-50 text-blue-600' },
];

const myGoals = [
  { title: 'Improve Design System', pct: 80, due: 'Due: 30 Sep 2026' },
  { title: 'Complete 3 Major Projects', pct: 60, due: 'Due: 31 Dec 2026' },
  { title: 'Enhance User Research', pct: 40, due: 'Due: 31 Aug 2026' },
];

const announcements = [
  { icon: Megaphone, accent: 'bg-violet-50 text-violet-600', title: 'Townhall Meeting', detail: 'All employees are invited to the quarterly townhall meeting.', time: '2h ago' },
  { icon: Gift, accent: 'bg-rose-50 text-rose-600', title: 'Work Anniversary Celebration', detail: 'Join us in celebrating our team members this Friday.', time: '1d ago' },
  { icon: Rocket, accent: 'bg-blue-50 text-blue-600', title: 'New HR Policy Update', detail: 'Updated leave and remote work policy effective July 1st.', time: '2d ago' },
];

// Deterministic gender-correct portraits (randomuser.me fixed indices, not random)
const birthdays = [
  { name: 'Rohan Mehra', when: 'Today', whenColor: 'text-violet-600', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priya Sharma', when: 'Tomorrow', whenColor: 'text-violet-600', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Arjun Verma', when: 'In 2 days', whenColor: 'text-emerald-600', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
];

const anniversaries = [
  { name: 'Neha Gupta', when: 'Today', whenColor: 'text-violet-600', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { name: 'Vikram Singh', when: 'In 4 days', whenColor: 'text-emerald-600', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
];

const quickActions = [
  { icon: CalendarCheck, label: 'Apply Leave', accent: 'bg-violet-50 text-violet-600', href: '/dashboard/leaves/apply' },
  { icon: FileBadge2, label: 'View Payslips', accent: 'bg-blue-50 text-blue-600', href: '/dashboard/payslips' },
  { icon: ScanFace, label: 'Attendance', accent: 'bg-emerald-50 text-emerald-600', href: '/dashboard/attendance' },
  { icon: Clock, label: 'My Timesheet', accent: 'bg-amber-50 text-amber-600', href: '/dashboard/timesheet' },
  { icon: Target, label: 'My Goals', accent: 'bg-teal-50 text-teal-600', href: '/dashboard/goals' },
  { icon: Headset, label: 'Helpdesk Ticket', accent: 'bg-orange-50 text-orange-600', href: '/dashboard/helpdesk' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small shared pieces
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  title, action, href, className = '', children,
}: { title: string; action?: string; href?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm h-full ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold text-zinc-900">{title}</h3>
        {action && href && (
          <Link href={href} className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-violet-600 hover:text-violet-700">
            {action} <ArrowRight size={11} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top stat / action cards — 6 cards: Attendance(check-in/out), Apply Leave,
// Upload Document, Pending Approvals, Payslip, Goals Progress
// ─────────────────────────────────────────────────────────────────────────────

function AttendanceCard() {
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkedOut, setCheckedOut] = useState(false);
  const [time, setTime] = useState('09:18 AM');

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckedOut(false);
    setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };
  const handleCheckOut = () => {
    setCheckedOut(true);
    setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-sm flex flex-col gap-1.5 justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <Calendar size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[11px] font-bold text-zinc-900 leading-tight">{time}</p>
            <div className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${checkedOut ? 'bg-zinc-300' : 'bg-emerald-500'}`} />
              <span className={`text-[9px] font-medium ${checkedOut ? 'text-zinc-400' : 'text-emerald-600'}`}>
                {checkedOut ? 'Checked Out' : checkedIn ? 'Checked In' : 'Not Checked In'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleCheckIn}
          disabled={checkedIn && !checkedOut}
          className="flex-1 rounded-md border border-emerald-200 bg-emerald-50 py-0.5 text-[9px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check In
        </button>
        <button
          onClick={handleCheckOut}
          disabled={!checkedIn || checkedOut}
          className="flex-1 rounded-md border border-rose-200 bg-rose-50 py-0.5 text-[9px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Out
        </button>
      </div>
    </div>
  );
}

function ApplyLeaveCard() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-sm flex flex-col gap-1.5 justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600">
          <Plane size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-zinc-900 leading-tight truncate">
            2 <span className="font-semibold text-zinc-400">Leave Taken</span>
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/leaves/apply"
        className="rounded-md bg-sky-600 py-0.5 text-center text-[10px] font-semibold text-white hover:bg-sky-700 transition-colors"
      >
        Apply Leave
      </Link>
    </div>
  );
}

function UploadDocumentCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-sm flex flex-col gap-1.5 justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-pink-50 text-pink-600">
          <Upload size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-zinc-900 leading-tight truncate">2 toal documets uploaded</p>
        </div>
      </div>
      <input ref={inputRef} type="file" onChange={(e) => e.target.files?.[0]} className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-pink-200 bg-pink-50 py-0.5 text-[10px] font-semibold text-pink-600 hover:bg-pink-100 transition-colors"
      >
        Upload Document
      </button>
    </div>
  );
}

function MiniStatCard({
  icon: Icon, accent, title, value, valueSuffix, sub, actionBtn,
}: {
  icon: any; accent: string; title: string; value: string; valueSuffix?: string; sub: string;
  actionBtn?: { label: string; href: string; btnClass: string };
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white px-2.5 py-2 shadow-sm flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${accent}`}>
          <Icon size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] text-zinc-400 leading-tight truncate">{title}</p>
          <p className="text-[13px] font-bold text-zinc-900 leading-tight">
            {value} {valueSuffix && <span className="text-[10px] font-semibold text-zinc-400">{valueSuffix}</span>}
          </p>
          <p className="text-[9px] text-zinc-400 leading-tight">{sub}</p>
        </div>
      </div>
      {actionBtn && (
        <Link
          href={actionBtn.href}
          className={`block rounded-md py-0.5 text-center text-[9.5px] font-semibold transition-colors ${actionBtn.btnClass}`}
        >
          {actionBtn.label}
        </Link>
      )}
    </div>
  );
}

function ComplaintCard() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-sm flex flex-col gap-1.5 justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
          <AlertCircle size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-zinc-900 leading-tight truncate">Complaint</p>
        </div>
      </div>
      <Link
        href="/dashboard/complaint"
        className="rounded-md bg-amber-500 py-0.5 text-center text-[10px] font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        Raise Complaint
      </Link>
    </div>
  );
}

function ResignationCard() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-2 shadow-sm flex flex-col gap-1.5 justify-between">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
          <LogOut size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-zinc-900 leading-tight truncate">Submit Resignation</p>
        </div>
      </div>
      <Link
        href="/dashboard/resignation"
        className="rounded-md bg-rose-500 py-0.5 text-center text-[10px] font-semibold text-white hover:bg-rose-600 transition-colors"
      >
        Resign Now
      </Link>
    </div>
  );
}

function StatsStrip() {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
      <AttendanceCard />
      <ApplyLeaveCard />
      <UploadDocumentCard />
      <ComplaintCard />
      <ResignationCard />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Attendance chart
// ─────────────────────────────────────────────────────────────────────────────

function MyAttendance() {
  return (
    <SectionCard title="My Attendance" action="View Calendar" href="/dashboard/attendance">
      <div className="h-[110px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceWeek} barCategoryGap="32%">
            <CartesianGrid vertical={false} stroke="#f1f1f4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#a1a1aa' }}
              ticks={[0, 25, 50, 75, 100]}
              width={32}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={20}>
              {attendanceWeek.map((entry) => (
                <Cell key={entry.day} fill={STATUS_COLOR[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        {Object.entries({ present: 'Present', half: 'Half Day', absent: 'Absent', leave: 'Leave' }).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[key] }} />
            {label}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Upcoming events
// ─────────────────────────────────────────────────────────────────────────────

function UpcomingEvents() {
  return (
    <SectionCard title="Upcoming Events" action="View All" href="/dashboard/events">
      <div className="space-y-1.5">
        {upcomingEvents.map((ev, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-center">
              <span className="text-[10px] font-bold text-violet-700 leading-none">{ev.day}</span>
              <span className="text-[7px] font-semibold uppercase text-violet-400 leading-none">{ev.mon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-zinc-800 leading-tight truncate">{ev.title}</p>
              <p className="text-[9.5px] text-zinc-400 truncate">{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Tasks
// ─────────────────────────────────────────────────────────────────────────────

function MyTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const toggle = (id: number) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <SectionCard title={`My Tasks (${tasks.length})`} action="View All" href="/dashboard/tasks">
      <div className="space-y-1">
        {tasks.map((task) => (
          <div key={task.id} onClick={() => toggle(task.id)} className="flex items-start gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggle(task.id)}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
            />
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-medium leading-tight ${task.done ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>{task.title}</p>
              <p className="text-[9.5px] text-zinc-400">{task.due}</p>
            </div>
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${PRIORITY_STYLE[task.priority]}`}>{task.priority}</span>
          </div>
        ))}
      </div>
      <button className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold text-violet-600 hover:text-violet-700">
        <Plus size={11} /> Add New Task
      </button>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile card + Quick Actions
// ─────────────────────────────────────────────────────────────────────────────

function ProfileCard({ emp = employee }: { emp?: any }) {
  const details = [
    { icon: IdCard, label: 'Employee ID', value: emp.employeeId },
    { icon: Briefcase, label: 'Department', value: emp.department },
    { icon: UserRound, label: 'Reporting Manager', value: emp.reportingManager },
    { icon: AtSign, label: 'Email', value: emp.email },
    { icon: Phone, label: 'Phone', value: emp.phone },
    { icon: MapPin, label: 'Location', value: emp.location },
    { icon: CalendarDays, label: 'Date of Joining', value: emp.dateOfJoining },
  ];

  return (
    <div className="rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-sm h-full flex flex-col">
      <div className="flex flex-col items-center text-center pt-3">
        <div className="relative">
          <img src={emp.avatar} alt={emp.name} className="h-20 w-20 rounded-full border-4 border-white/40 object-cover shadow-lg" />
          <button className="absolute bottom-0.5 right-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-violet-600 shadow-sm hover:bg-violet-50">
            <Camera size={12} />
          </button>
        </div>
        <p className="mt-3 text-[15px] font-bold leading-tight">{emp.name}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[11px] text-white/80">{emp.role}</span>
          <span className="rounded-full bg-emerald-400/25 px-2 py-0.5 text-[9px] font-semibold text-emerald-200">{emp.status}</span>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-1.5 rounded-xl bg-white/10 p-2.5">
        {details.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-2 text-[10px]">
            <span className="flex items-center gap-1.5 text-white/65 shrink-0">
              <d.icon size={11} /> {d.label}
            </span>
            <span className="font-semibold text-white text-right truncate">{d.value}</span>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/profile"
        className="mt-2.5 block rounded-lg bg-white py-1.5 text-center text-[11px] font-semibold text-violet-700 hover:bg-violet-50 transition-colors"
      >
        View Full Profile
      </Link>
    </div>
  );
}

function QuickActionsPanel() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm h-full">
      <h3 className="mb-2 text-[12px] font-semibold text-zinc-900">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-1">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center gap-1 rounded-lg border border-zinc-100 px-1 py-1.5 text-center hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
          >
            <span className={`grid h-6 w-6 place-items-center rounded-lg ${a.accent}`}>
              <a.icon size={13} />
            </span>
            <span className="text-[9px] font-semibold leading-tight text-zinc-600">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Leave / Leave Status / My Documents
// ─────────────────────────────────────────────────────────────────────────────

function MyLeave() {
  return (
    <SectionCard title="My Leave" action="Apply Leave" href="/dashboard/leaves/apply">
      <div className="space-y-2">
        {leaveBalances.map((lb) => (
          <div key={lb.label} className="flex items-center gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${lb.color}1A`, color: lb.color }}>
              <lb.icon size={11} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-medium text-zinc-700 truncate">{lb.label}</span>
                <span className="text-[10px] font-bold text-zinc-800 shrink-0 ml-1">{lb.used} / {lb.total} days</span>
              </div>
              <div className="mt-0.5 h-1 rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(lb.used / lb.total) * 100}%`, backgroundColor: lb.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/dashboard/leaves/history" className="mt-2 inline-block text-[10.5px] font-semibold text-violet-600 hover:text-violet-700">
        View Leave History
      </Link>
    </SectionCard>
  );
}

function LeaveStatus() {
  return (
    <SectionCard title="Leave Status" action="View All" href="/dashboard/leaves">
      <div className="space-y-2">
        {leaveStatus.map((ls, i) => (
          <div key={i} className="flex items-center justify-between gap-2 py-1 border-b border-zinc-50 last:border-0">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-zinc-800 truncate">{ls.type}</p>
              <p className="text-[10px] text-zinc-400 truncate">{ls.range}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${ls.style}`}>{ls.status}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MyDocuments() {
  return (
    <SectionCard title="My Documents" action="View All" href="/dashboard/documents">
      <div className="space-y-2">
        {myDocuments.map((doc, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${doc.accent}`}>
                <doc.icon size={12} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-zinc-800 truncate">{doc.label}</p>
                <p className="text-[10px] text-zinc-400 truncate">{doc.sub}</p>
              </div>
            </div>
            <button className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
              <Download size={12} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// My Goals / Company Announcements / Birthdays & Anniversaries
// ─────────────────────────────────────────────────────────────────────────────

function MyGoals() {
  return (
    <SectionCard title="My Goals" action="View All" href="/dashboard/goals">
      <div className="space-y-2">
        {myGoals.map((g) => (
          <div key={g.title}>
            <div className="mb-0.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-700">{g.title}</span>
              <span className="text-[10px] font-bold text-violet-600">{g.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${g.pct}%` }} />
            </div>
            <p className="mt-0.5 text-[9.5px] text-zinc-400">{g.due}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CompanyAnnouncements() {
  return (
    <SectionCard title="Company Announcements" action="View All" href="/dashboard/announcements">
      <div className="space-y-2">
        {announcements.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${a.accent}`}>
              <a.icon size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-zinc-800 leading-tight">{a.title}</p>
              <p className="text-[10px] text-zinc-400 leading-snug mt-0.5 line-clamp-2">{a.detail}</p>
              <p className="text-[9px] text-zinc-300 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function BirthdaysAnniversaries() {
  const [tab, setTab] = useState<'birthdays' | 'anniversaries'>('birthdays');
  const people = tab === 'birthdays' ? birthdays : anniversaries;

  return (
    <SectionCard title="Birthday & Work Anniversaries" action="View All" href="/dashboard/celebrations">
      <div className="mb-2 flex border-b border-zinc-100">
        <button
          onClick={() => setTab('birthdays')}
          className={`flex-1 pb-1 text-[10.5px] font-semibold relative ${tab === 'birthdays' ? 'text-violet-600' : 'text-zinc-400'}`}
        >
          Birthdays ({birthdays.length})
          {tab === 'birthdays' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />}
        </button>
        <button
          onClick={() => setTab('anniversaries')}
          className={`flex-1 pb-1 text-[10.5px] font-semibold relative ${tab === 'anniversaries' ? 'text-violet-600' : 'text-zinc-400'}`}
        >
          Anniversaries ({anniversaries.length})
          {tab === 'anniversaries' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />}
        </button>
      </div>
      <div className="space-y-1.5">
        {people.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <img src={p.avatar} alt={p.name} className="h-7 w-7 rounded-full object-cover shrink-0" />
            <span className="text-[11px] font-medium text-zinc-700 flex-1 truncate">{p.name}</span>
            <span className={`text-[10px] font-semibold shrink-0 ${p.whenColor}`}>{p.when}</span>
          </div>
        ))}
      </div>
      <button className="mt-1.5 text-[10px] font-semibold text-violet-600 hover:text-violet-700">+ 5 more birthdays</button>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page content (no sidebar / header — embed inside your existing app shell)
// ─────────────────────────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  const { data: currentEmployeeData, isLoading } = useQuery({
    queryKey: ['current-employee'],
    queryFn: async () => {
      const res = await api.get('/employees/current');
      return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="p-4 text-sm text-zinc-500">Loading dashboard...</div>;
  }

  const currentEmployee = currentEmployeeData || {};

  const mappedEmployee = {
    name: currentEmployee.firstName ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : employee.name,
    role: currentEmployee.designationId?.name || employee.role,
    status: currentEmployee.employmentStatus === 'active' ? 'Active' : employee.status,
    employeeId: currentEmployee.employeeCode || employee.employeeId,
    department: currentEmployee.departmentId?.name || employee.department,
    reportingManager: currentEmployee.reportingToId 
      ? `${currentEmployee.reportingToId.firstName} ${currentEmployee.reportingToId.lastName}`
      : employee.reportingManager,
    email: currentEmployee.email || employee.email,
    phone: currentEmployee.mobileNumber || employee.phone,
    location: currentEmployee.branchId?.name || employee.location,
    dateOfJoining: currentEmployee.dateOfJoining 
      ? new Date(currentEmployee.dateOfJoining).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : employee.dateOfJoining,
    avatar: currentEmployee.profilePictureUrl || employee.avatar,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-2 p-3">
      <StatsStrip />

      {/* Merged rows: ProfileCard spans 2 rows, others fill 3 cols × 2 rows */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-4 xl:grid-rows-2">
        <div className="xl:row-span-2">
          <ProfileCard emp={mappedEmployee} />
        </div>
        <MyAttendance />
        <UpcomingEvents />
        <MyTasks />
        <MyLeave />
        <LeaveStatus />
        <MyDocuments />
      </div>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        <QuickActionsPanel />
        <MyGoals />
        <CompanyAnnouncements />
      </div>
    </div>
  );
}