'use client';

import React, { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Fingerprint, CalendarClock, Star, Award, Users, ChevronDown, Calendar,
  Download, ArrowRight, CheckCircle2, Circle, Megaphone, FileCheck2,
  ShieldCheck, CalendarCheck, Receipt, FileText, ClipboardList, FileEdit,
  BookOpen, Headset, IdCard, Landmark, GraduationCap, Wallet, Clock3,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

const employee = {
  name: 'Rohan Kumar',
  employeeId: 'EMP10234',
  department: 'Sales & Marketing',
  designation: 'Executive',
  dateOfJoining: '15 Mar 2023',
  reportingManager: 'Amit Kumar',
  workLocation: 'Noida Office',
  avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
};

// day → status, for the 31-day attendance bar chart
const dayStatus = [
  'present', 'late', 'present', 'present', 'late', 'present', 'present',
  'present', 'late', 'half', 'present', 'present', 'present', 'present',
  'present', 'present', 'present', 'present', 'absent', 'present', 'present',
  'late', 'present', 'present', 'present', 'present', 'present', 'present',
  'present', 'present', 'present',
];
const STATUS_COLOR: Record<string, string> = {
  present: '#22c55e',
  late: '#f59e0b',
  half: '#8b5cf6',
  absent: '#ef4444',
};
const attendanceDays = dayStatus.map((status, i) => ({
  day: String(i + 1).padStart(2, '0'),
  value: status === 'absent' ? 20 : status === 'half' ? 55 : 100,
  status,
}));

const attendanceStats = [
  { label: 'Present Days', value: 15, color: '#22c55e', bg: 'bg-emerald-50', ring: 'border-emerald-100' },
  { label: 'Absent Days', value: 0, color: '#ef4444', bg: 'bg-rose-50', ring: 'border-rose-100' },
  { label: 'Late Days', value: 2, color: '#f59e0b', bg: 'bg-amber-50', ring: 'border-amber-100' },
  { label: 'Half Days', value: 1, color: '#8b5cf6', bg: 'bg-violet-50', ring: 'border-violet-100' },
];

const tasks = [
  { id: 1, title: 'Prepare Monthly Sales Report', due: 'Due Today', dueColor: 'text-rose-500', done: true },
  { id: 2, title: 'Follow up with Leads', due: 'Due Tomorrow', dueColor: 'text-amber-500', done: true },
  { id: 3, title: 'Client Meeting - ABC Corp', due: '23 May 2025', dueColor: 'text-zinc-400', done: false },
  { id: 4, title: 'Review Sales Pipeline', due: '25 May 2025', dueColor: 'text-zinc-400', done: false },
  { id: 5, title: 'Update CRM Data', due: '26 May 2025', dueColor: 'text-zinc-400', done: false },
];

const announcements = [
  { icon: Megaphone, accent: 'bg-amber-50 text-amber-500', title: 'Company Townhall Meeting', detail: '24 May 2025  |  11:00 AM' },
  { icon: FileCheck2, accent: 'bg-emerald-50 text-emerald-500', title: 'New Leave Policy Update', detail: '20 May 2025' },
  { icon: ShieldCheck, accent: 'bg-sky-50 text-sky-500', title: 'IT Security Awareness Program', detail: '18 May 2025' },
];

const upcomingEvents = [
  { day: '24', mon: 'MAY', accent: 'bg-rose-50 text-rose-600', title: 'Performance Review Meeting', detail: '10:00 AM - Conference Room' },
  { day: '26', mon: 'MAY', accent: 'bg-violet-50 text-violet-600', title: 'Payroll Processing', detail: 'All Day Event' },
  { day: '28', mon: 'MAY', accent: 'bg-sky-50 text-sky-600', title: 'Leadership Workshop', detail: '02:00 PM - Training Hall' },
];

const goals = [
  { title: 'Increase Sales Revenue', pct: 75, color: '#22c55e' },
  { title: 'New Client Acquisition', pct: 60, color: '#3b82f6' },
  { title: 'Customer Satisfaction', pct: 90, color: '#8b5cf6' },
];

const importantLinks = [
  { icon: CalendarCheck, label: 'Apply Leave', accent: 'bg-emerald-50 text-emerald-600' },
  { icon: Receipt, label: 'Reimbursement', accent: 'bg-rose-50 text-rose-600' },
  { icon: FileText, label: 'Payslip', accent: 'bg-amber-50 text-amber-600' },
  { icon: ClipboardList, label: 'Attendance Regularization', accent: 'bg-sky-50 text-sky-600' },
  { icon: FileEdit, label: 'IT Declaration', accent: 'bg-violet-50 text-violet-600' },
  { icon: BookOpen, label: 'HR Policies', accent: 'bg-blue-50 text-blue-600' },
];

const documents = [
  { icon: IdCard, label: 'Aadhaar Card' },
  { icon: IdCard, label: 'PAN Card' },
  { icon: Landmark, label: 'Bank Details' },
  { icon: GraduationCap, label: 'Education Certificate' },
];

const requests = [
  { icon: Wallet, label: 'Reimbursement Request', status: 'Submitted', style: 'bg-sky-50 text-sky-600' },
  { icon: FileEdit, label: 'IT Declaration', status: 'Approved', style: 'bg-emerald-50 text-emerald-600' },
  { icon: Clock3, label: 'Attendance Regularization', status: 'Pending', style: 'bg-amber-50 text-amber-600' },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell — flex column, footer (if any) always pinned to bottom
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  action?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: string;
}

function Card({ title, action, className = '', children, titleExtra, footer, tone = '' }: CardProps) {
  return (
    <div className={`flex h-full flex-col rounded-lg border p-2 shadow-sm ${tone || 'border-zinc-200/70 bg-white'} ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex items-center gap-2">
            {titleExtra}
            {action && (
              <button className="flex items-center gap-0.5 text-[10.5px] font-semibold text-blue-600 hover:text-blue-700">
                {action}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-1.5 pt-1.5 border-t border-zinc-100">{footer}</div>}
    </div>
  );
}

function LinkText({ children, colorClass = 'text-blue-600 hover:text-blue-700' }: { children: React.ReactNode; colorClass?: string }) {
  return (
    <button className={`inline-flex items-center gap-1 text-[11px] font-semibold ${colorClass}`}>
      {children} <ArrowRight size={12} />
    </button>
  );
}

// Footer used by the top-row stat cards: a hairline divider followed by a
// theme-tinted link, always pinned to the bottom of the card.
function CardFooterLink({ children, colorClass, dividerClass = 'border-zinc-100' }: { children: React.ReactNode; colorClass?: string; dividerClass?: string }) {
  return (
    <div className={`mt-2 border-t pt-2 ${dividerClass}`}>
      <LinkText colorClass={colorClass}>{children}</LinkText>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five stat/action cards
// ─────────────────────────────────────────────────────────────────────────

function AttendanceTodayCard() {
  const [checkedOut, setCheckedOut] = useState(false);
  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200/70 bg-white p-2 shadow-sm">
      <p className="text-[11.5px] font-semibold text-zinc-700">Attendance Today</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <Fingerprint size={17} />
        </span>
        <div>
          <p className="text-[16px] font-bold leading-tight text-zinc-900">09:24 AM</p>
          <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            In Time <CheckCircle2 size={10} />
          </p>
        </div>
      </div>
      <button
        onClick={() => setCheckedOut((v) => !v)}
        className="mt-6 w-full rounded-lg bg-emerald-600 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        {checkedOut ? 'Checked Out' : 'Check Out'}
      </button>
    </div>
  );
}

function LeaveBalanceCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-semibold text-zinc-700">Leave Balance</p>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
          <CalendarClock size={14} />
        </span>
      </div>
      <div className="mt-2 flex flex-1 items-center gap-6">
        <div>
          <p className="text-[10px] text-zinc-400">Casual Leave</p>
          <p className="text-[16px] font-bold text-zinc-900">12.5 <span className="text-[10px] font-medium text-zinc-400">Days</span></p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400">Sick Leave</p>
          <p className="text-[16px] font-bold text-zinc-900">8 <span className="text-[10px] font-medium text-zinc-400">Days</span></p>
        </div>
      </div>
      <CardFooterLink colorClass="text-blue-600 hover:text-blue-700" dividerClass="border-blue-100/70">
        View Leave Balance
      </CardFooterLink>
    </div>
  );
}

function PerformanceCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-violet-100 bg-violet-50/60 p-2 shadow-sm">
      <p className="text-[11.5px] font-semibold text-zinc-700">My Performance</p>
      <p className="mt-2 text-[10px] text-zinc-400">Current Rating</p>
      <div className="mt-1 flex flex-1 items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <Star key={i} size={15} className="text-amber-400" fill="currentColor" />
        ))}
        <Star size={15} className="text-zinc-300" fill="currentColor" />
        <span className="ml-1.5 text-[14px] font-bold text-zinc-900">4.2 <span className="text-[10.5px] font-medium text-zinc-400">/ 5</span></span>
      </div>
      <CardFooterLink colorClass="text-violet-600 hover:text-violet-700" dividerClass="border-violet-200/70">
        View Performance
      </CardFooterLink>
    </div>
  );
}

function AppraisalCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-amber-100 bg-amber-50/60 p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-semibold text-zinc-700">My Next Appraisal</p>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-500">
          <Award size={14} />
        </span>
      </div>
      <div className="mt-2 flex-1">
        <p className="text-[16px] font-bold text-zinc-900">01 Dec 2025</p>
        <p className="text-[10.5px] font-semibold text-orange-500">214 Days to go</p>
      </div>
      <CardFooterLink colorClass="text-amber-600 hover:text-amber-700" dividerClass="border-amber-200/70">
        View Details
      </CardFooterLink>
    </div>
  );
}

function TeamCard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] font-semibold text-zinc-700">My Team</p>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
          <Users size={14} />
        </span>
      </div>
      <div className="mt-2 flex-1">
        <p className="text-[10px] text-zinc-400">Team Members</p>
        <p className="text-[16px] font-bold text-zinc-900">8</p>
      </div>
      <CardFooterLink colorClass="text-blue-600 hover:text-blue-700" dividerClass="border-blue-100/70">
        View Team
      </CardFooterLink>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 2 — attendance summary / leave / payslip / important links
// ─────────────────────────────────────────────────────────────────────────

function AttendanceSummaryCard() {
  return (
    <Card
      title="My Attendance Summary"
      titleExtra={
        <span className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] font-medium text-zinc-500">
          May 2025 <ChevronDown size={11} />
        </span>
      }
    >
      {/* Micro stat cards */}
      <div className="grid grid-cols-4 gap-2">
        {attendanceStats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border ${s.ring} ${s.bg} px-1.5 py-2`}
          >
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[9px] font-medium leading-tight text-zinc-500">{s.label}</span>
            </div>
            <p className="mt-1 text-[16px] font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 h-[60px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceDays} barCategoryGap="20%">
            <Bar dataKey="value" radius={[2, 2, 2, 2]} maxBarSize={8}>
              {attendanceDays.map((entry) => (
                <Cell key={entry.day} fill={STATUS_COLOR[entry.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex justify-between px-0.5">
        {attendanceDays.map((d, i) => (
          <span key={d.day} className="w-[3%] text-center text-[8.5px] font-medium leading-none text-zinc-400">
            {i % 3 === 0 ? d.day : ''}
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {Object.entries({ present: 'Present', late: 'Late', half: 'Half Day', absent: 'Absent' }).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1 text-[9.5px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[key] }} />
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
}

function MyLeaveCard() {
  const [tab, setTab] = useState('upcoming');
  return (
    <Card title="My Leave" footer={<LinkText>Apply Leave</LinkText>}>
      <div className="flex rounded-lg bg-zinc-100 p-0.5 text-[10px] font-semibold">
        <button
          onClick={() => setTab('upcoming')}
          className={`flex-1 rounded-md py-1 transition-colors ${tab === 'upcoming' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
        >
          Upcoming Leave
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 rounded-md py-1 transition-colors ${tab === 'history' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
        >
          Leave History
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-3 text-center">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-zinc-400">
          <Calendar size={14} />
        </span>
        <p className="mt-2 text-[11px] font-semibold text-zinc-700">
          {tab === 'upcoming' ? 'No Upcoming Leave' : 'No Leave History'}
        </p>
        <p className="text-[9.5px] text-zinc-400">
          {tab === 'upcoming' ? 'You have no upcoming leave.' : 'Your past leaves will show here.'}
        </p>
      </div>
    </Card>
  );
}

function PayslipCard() {
  return (
    <Card title="My Payslip" action="View All" footer={<LinkText>View Payslip</LinkText>}>
      <div className="flex items-center gap-2">
        <span className="text-[11.5px] font-semibold text-zinc-800">May 2025</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Paid</span>
      </div>

      <p className="mt-1.5 text-[10px] text-zinc-400">Take Home Salary</p>
      <p className="text-[18px] font-bold text-zinc-900">₹45,680</p>

      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-zinc-50 px-2.5 py-1.5">
        <div>
          <p className="text-[9px] text-zinc-400">Payment Date</p>
          <p className="text-[10.5px] font-semibold text-zinc-700">31 May 2025</p>
        </div>
        <button className="grid h-6 w-6 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100">
          <Download size={12} />
        </button>
      </div>
    </Card>
  );
}

function ImportantLinksCard() {
  return (
    <Card
      title="Important Links"
      footer={
        <div className="flex justify-end">
          <LinkText>View All Services</LinkText>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {importantLinks.map((l) => (
          <button
            key={l.label}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-100 px-1.5 py-1 text-center transition-colors hover:border-blue-200 hover:bg-blue-50/50"
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full ${l.accent}`}>
              <l.icon size={12} />
            </span>
            <span className="text-[8.5px] font-semibold leading-tight text-zinc-600">{l.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 3 — goals / tasks / announcements / upcoming events
// ─────────────────────────────────────────────────────────────────────────

function GoalsCard() {
  const overall = 75;
  const r = 26;
  const circumference = 2 * Math.PI * r;
  return (
    <Card title="My Goals & OKRs" action="View All" footer={<LinkText>View Goals</LinkText>}>
      <p className="text-[10px] text-zinc-400">Q2 - 2025 (Apr - Jun)</p>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f1f4" strokeWidth="7" />
            <circle
              cx="32" cy="32" r={r} fill="none" stroke="#22c55e" strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - overall / 100)}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-bold text-zinc-900">{overall}%</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {goals.map((g) => (
            <div key={g.title}>
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-[9.5px] font-medium text-zinc-700">{g.title}</span>
                <span className="shrink-0 text-[9.5px] font-bold text-zinc-800">{g.pct}%</span>
              </div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-center text-[8px] leading-tight text-zinc-400">Overall Progress</p>
    </Card>
  );
}

function TasksCard() {
  const [items, setItems] = useState(tasks);
  const toggle = (id: number) => setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  return (
    <Card title="My Tasks" action="View All" footer={<LinkText>View All Tasks</LinkText>}>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} onClick={() => toggle(t.id)} className="flex cursor-pointer items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {t.done ? (
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
              ) : (
                <Circle size={14} className="shrink-0 text-zinc-300" />
              )}
              <span className={`truncate text-[10.5px] font-medium ${t.done ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>{t.title}</span>
            </div>
            <span className={`shrink-0 text-[9px] font-semibold ${t.dueColor}`}>{t.due}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AnnouncementsCard() {
  return (
    <Card title="Announcements" action="View All">
      <div className="space-y-2">
        {announcements.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${a.accent}`}>
              <a.icon size={13} />
            </span>
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold leading-tight text-zinc-800">{a.title}</p>
              <p className="mt-0.5 text-[9.5px] text-zinc-400">{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UpcomingEventsCard() {
  return (
    <Card title="Upcoming Events" action="View Calendar">
      <div className="space-y-2">
        {upcomingEvents.map((ev, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-center ${ev.accent}`}>
              <span className="text-[10.5px] font-bold leading-none">{ev.day}</span>
              <span className="text-[6.5px] font-semibold uppercase leading-none">{ev.mon}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-semibold leading-tight text-zinc-800">{ev.title}</p>
              <p className="truncate text-[9px] text-zinc-400">{ev.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 4 — profile / documents / requests / quick help
// Kept compact and single-viewport-tall, matching the reference image
// ─────────────────────────────────────────────────────────────────────────

function ProfileSummaryCard() {
  const details = [
    { label: 'Employee ID', value: employee.employeeId },
    { label: 'Department', value: employee.department },
    { label: 'Designation', value: employee.designation },
    { label: 'Date of Joining', value: employee.dateOfJoining },
    { label: 'Reporting Manager', value: employee.reportingManager },
    { label: 'Work Location', value: employee.workLocation },
  ];
  return (
    <Card title="My Profile Summary" footer={<LinkText>View Full Profile</LinkText>}>
      <div className="flex items-start gap-3">
        <img src={employee.avatar} alt={employee.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-2">
          {details.map((d) => (
            <div key={d.label} className="min-w-0">
              <p className="text-[8.5px] leading-tight text-zinc-400">{d.label}</p>
              <p className="truncate text-[10.5px] font-semibold leading-tight text-zinc-800">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DocumentsCard() {
  return (
    <Card title="My Documents" action="View All">
      <div className="space-y-1.5">
        {documents.map((doc) => (
          <div key={doc.label} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-zinc-50 text-zinc-500">
                <doc.icon size={12} />
              </span>
              <span className="truncate text-[10px] font-medium text-zinc-700">{doc.label}</span>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[8.5px] font-semibold text-emerald-600">Verified</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RequestsCard() {
  return (
    <Card title="My Requests" action="View All">
      <div className="space-y-1.5">
        {requests.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-zinc-50 text-zinc-500">
                <r.icon size={12} />
              </span>
              <span className="truncate text-[10px] font-medium text-zinc-700">{r.label}</span>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8.5px] font-semibold ${r.style}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickHelpCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-zinc-200/70 bg-white p-2 text-center shadow-sm">
      <h3 className="mb-1 w-full text-[12.5px] font-semibold text-zinc-900">Quick Help</h3>
      <span className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-white">
        <Headset size={16} />
      </span>
      <p className="mt-2 text-[11px] font-semibold text-zinc-800">Need Help?</p>
      <p className="text-[9.5px] text-zinc-400">Raise a ticket with HR Support Team.</p>
      <button className="mt-2 w-full rounded-lg bg-zinc-900 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-800">
        Raise a Ticket
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  return (
    <main className="mx-auto max-w-[1600px] space-y-2 pb-4 px-2 sm:px-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-zinc-900">Good Morning, Rohan! 👋</h1>
          <p className="text-[11px] text-zinc-400">Have a great day at work.</p>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">Wednesday, 21 May 2025</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5 xl:items-stretch">
        <AttendanceTodayCard />
        <LeaveBalanceCard />
        <PerformanceCard />
        <AppraisalCard />
        <TeamCard />
      </div>

      {/* Row 2 — Attendance Summary widened to fit micro-cards + full chart,
remaining cards trimmed proportionally to balance the row */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1.7fr_0.85fr_0.85fr_0.9fr] xl:items-stretch">
        <AttendanceSummaryCard />
        <MyLeaveCard />
        <PayslipCard />
        <ImportantLinksCard />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-4 xl:items-stretch">
        <GoalsCard />
        <TasksCard />
        <AnnouncementsCard />
        <UpcomingEventsCard />
      </div>

      {/* Row 4 — Profile Summary widened for the 3-column detail grid,
remaining cards trimmed proportionally to balance the row */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1.4fr_0.85fr_0.85fr_0.85fr] xl:items-stretch">
        <ProfileSummaryCard />
        <DocumentsCard />
        <RequestsCard />
        <QuickHelpCard />
      </div>

    </main>
  );
}