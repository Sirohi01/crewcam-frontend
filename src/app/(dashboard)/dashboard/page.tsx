"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, UserX, CalendarOff, Clock, Laptop, Briefcase, 
  Bell, CheckCircle2, AlertCircle, Calendar,
  ChevronDown, FileText,
  TrendingUp, TrendingDown, UsersRound, Settings, Download,
  Wallet, FileCheck, BrainCircuit, CalendarDays, UserPlus,
  BriefcaseBusiness, ScanFace, UmbrellaOff, Receipt, AlarmClock, LogOut
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  BarChart, Bar
} from "recharts";
import { Card } from "@/components/ui/card";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime ? currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : "Loading...";

  const formattedTime = currentTime ? currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : "--:--";

  return (
    <div className="min-h-screen bg-[#F4F7FA] p-2 font-sans text-slate-800 space-y-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Good Morning, HR Manager! <span>👋</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening in your organization today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-md shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <Calendar size={16} />
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <Clock size={16} />
            <span suppressHydrationWarning>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        <MetricCard icon={<UsersRound size={20} />} iconBg="bg-indigo-100 text-indigo-600" title="Total Employees" value="1,248" trend="+ 12 this month" trendUp />
        <MetricCard icon={<ScanFace size={20} />} iconBg="bg-emerald-100 text-emerald-600" title="Present Today" value="987" sub="79.2% of total" />
        <MetricCard icon={<UserX size={20} />} iconBg="bg-rose-100 text-rose-600" title="Absent Today" value="126" sub="10.1% of total" />
        <MetricCard icon={<CalendarOff size={20} />} iconBg="bg-amber-100 text-amber-600" title="On Leave" value="78" sub="6.2% of total" />
        <MetricCard icon={<Clock size={20} />} iconBg="bg-blue-100 text-blue-600" title="Late Check-ins" value="57" sub="4.5% of total" />
        <MetricCard icon={<Laptop size={20} />} iconBg="bg-cyan-100 text-cyan-600" title="WFH Today" value="24" sub="1.9% of total" />
        <MetricCard icon={<BriefcaseBusiness size={20} />} iconBg="bg-teal-100 text-teal-600" title="New Positions" value="24" trend="5 new this week" trendUp />
      </div>

      {/* Row 2: Alerts, Tasks, Schedule, Birthdays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <CriticalAlerts />
        <TodaysTasks />
        <TodaysSchedule />
        <BirthdaysAnniversaries />
      </div>

      {/* Row 3: Overviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <AttendanceOverview />
        <LeaveOverview />
        <RecruitmentOverview />
        <PerformanceOverview />
      </div>

      {/* Row 4: Overviews pt2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <PayrollOverview />
        <ComplianceOverview />
        <AIInsights />
        <DepartmentSpread />
      </div>

      {/* Row 5: Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <AttendanceTrend />
        <LeaveTrend />
        <HiringTrend />
        <AttritionTrend />
      </div>

      {/* Row 6: Events, Approvals, Activities, Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <UpcomingEvents />
        <PendingApprovals />
        <RecentActivities />
        <QuickStats />
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <h2 className="text-sm font-bold text-slate-800 mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <QuickActionButton icon={<UserPlus size={20} className="text-indigo-600" />} label="Add Employee" bg="bg-indigo-50" />
          <QuickActionButton icon={<ScanFace size={20} className="text-emerald-600" />} label="Mark Attendance" bg="bg-emerald-50" />
          <QuickActionButton icon={<CalendarOff size={20} className="text-amber-600" />} label="Apply Leave" bg="bg-amber-50" />
          <QuickActionButton icon={<CheckCircle2 size={20} className="text-green-600" />} label="Approve Leave" bg="bg-green-50" />
          <QuickActionButton icon={<Wallet size={20} className="text-blue-600" />} label="Run Payroll" bg="bg-blue-50" />
          <QuickActionButton icon={<Briefcase size={20} className="text-purple-600" />} label="Create Job" bg="bg-purple-50" />
          <QuickActionButton icon={<CalendarDays size={20} className="text-fuchsia-600" />} label="Schedule Interviews" bg="bg-fuchsia-50" />
          <QuickActionButton icon={<FileText size={20} className="text-rose-600" />} label="Upload Document" bg="bg-rose-50" />
          <QuickActionButton icon={<Bell size={20} className="text-orange-600" />} label="Send Announcement" bg="bg-orange-50" />
          <QuickActionButton icon={<Download size={20} className="text-slate-600" />} label="Generate Report" bg="bg-slate-50" />
          <QuickActionButton icon={<BriefcaseBusiness size={20} className="text-teal-600" />} label="New Project" bg="bg-teal-50" />
        </div>
      </div>

      {/* Reports Shortcut */}
      <div className="mt-2 mb-4">
        <h2 className="text-sm font-bold text-slate-800 mb-2">Reports Shortcut</h2>
        <div className="flex flex-wrap gap-2">
          <QuickActionButton icon={<FileText size={20} className="text-indigo-600" />} label="Attendance Report" bg="bg-indigo-50" />
          <QuickActionButton icon={<FileText size={20} className="text-emerald-600" />} label="Leave Report" bg="bg-emerald-50" />
          <QuickActionButton icon={<FileText size={20} className="text-amber-600" />} label="Payroll Report" bg="bg-amber-50" />
          <QuickActionButton icon={<FileText size={20} className="text-blue-600" />} label="Recruitment Report" bg="bg-blue-50" />
          <QuickActionButton icon={<FileText size={20} className="text-purple-600" />} label="Performance Report" bg="bg-purple-50" />
          <QuickActionButton icon={<FileText size={20} className="text-rose-600" />} label="Attrition Report" bg="bg-rose-50" />
          <QuickActionButton icon={<FileText size={20} className="text-orange-600" />} label="Compliance Report" bg="bg-orange-50" />
          <QuickActionButton icon={<FileText size={20} className="text-teal-600" />} label="Training Report" bg="bg-teal-50" />
          <QuickActionButton icon={<FileText size={20} className="text-cyan-600" />} label="Expense Report" bg="bg-cyan-50" />
          <QuickActionButton icon={<FileText size={20} className="text-slate-600" />} label="View All Reports" bg="bg-slate-50" />
          <QuickActionButton icon={<FileText size={20} className="text-pink-600" />} label="Audit Report" bg="bg-pink-50" />
        </div>
      </div>
    </div>
  );
}

// Components

function MetricCard({ icon, iconBg, title, value, trend, trendUp, sub }: any) {
  return (
    <Card className="shadow-sm border-slate-100 flex flex-col justify-between p-2.5 bg-white rounded-md">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className={cn("p-1.5 rounded-md flex-shrink-0", iconBg)}>
          {icon}
        </div>
        <div className="text-xs font-semibold text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{title}</div>
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 leading-tight">{value}</div>
        {trend && (
          <div className="text-[10px] font-medium flex items-center gap-1 mt-0.5 text-emerald-600">
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} className="text-rose-500" />}
            <span className={trendUp ? "text-emerald-600" : "text-rose-500"}>{trend}</span>
          </div>
        )}
        {sub && <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{sub}</div>}
      </div>
    </Card>
  );
}

function SectionCard({ title, action, children, className, select }: any) {
  return (
    <Card className={cn("shadow-sm border-slate-100 bg-white rounded-md flex flex-col overflow-hidden h-full", className)}>
      <div className="flex justify-between items-center p-4 border-b border-slate-50">
        <h3 className="text-sm font-bold flex items-center gap-2">{title}</h3>
        {action && <a href="#" className="text-xs text-indigo-600 font-semibold hover:underline">{action}</a>}
        {select && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 cursor-pointer hover:text-slate-800">
            {select} <ChevronDown size={12} />
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">{children}</div>
    </Card>
  );
}

function CriticalAlerts() {
  const alerts = [
    { label: "5 employees absent today", count: 5, color: "text-rose-600 bg-rose-50", iconColor: "text-rose-500" },
    { label: "2 probations ending this week", count: 2, color: "text-amber-600 bg-amber-50", iconColor: "text-amber-500" },
    { label: "6 documents expiring soon", count: 6, color: "text-amber-600 bg-amber-50", iconColor: "text-amber-500" },
    { label: "Salary generation pending", count: 1, color: "text-rose-600 bg-rose-50", iconColor: "text-rose-500" },
    { label: "Offer letters pending", count: 3, color: "text-rose-600 bg-rose-50", iconColor: "text-rose-500" },
    { label: "Interviews starting in 30 min", count: 4, color: "text-blue-600 bg-blue-50", iconColor: "text-blue-500" },
    { label: "PF submission due tomorrow", count: 1, color: "text-amber-600 bg-amber-50", iconColor: "text-amber-500" },
    { label: "Attendance device offline", count: 1, color: "text-amber-600 bg-amber-50", iconColor: "text-amber-500" },
  ];
  return (
    <SectionCard title={<><AlertCircle size={16} className="text-amber-500" /> Critical Alerts</>} action="View All">
      <div className="flex flex-col gap-3 py-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
        {alerts.map((a, i) => (
          <div key={i} className="flex justify-between items-center text-[11px] font-medium">
            <div className="flex items-center gap-2 text-slate-700">
              <span className={cn("w-5 h-5 rounded flex items-center justify-center shrink-0", a.color)}>
                <AlertCircle size={10} className={a.iconColor} />
              </span>
              {a.label}
            </div>
            <span className={cn("px-1.5 py-0.5 text-[10px] rounded font-bold shrink-0", a.color)}>{a.count}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function TodaysTasks() {
  const tasks = [
    { label: "High Priority", count: 5, color: "text-rose-500" },
    { label: "Medium Priority", count: 7, color: "text-amber-500" },
    { label: "Low Priority", count: 5, color: "text-blue-500" },
    { label: "Completed", count: 12, color: "text-emerald-500" },
    { label: "Overdue", count: 2, color: "text-rose-500" },
  ];
  return (
    <SectionCard title={<><FileCheck size={16} className="text-indigo-500" /> Today's Tasks</>} action="View All">
      <div className="flex flex-col sm:flex-row items-center h-full gap-2 pt-2 pb-2">
        <div className="relative w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{value:12},{value:8}]} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell fill="#10b981" />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 leading-none mb-1">12/20</span>
            <span className="text-[9px] font-medium text-slate-500 text-center leading-tight">Tasks<br/>Completed</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 flex-1 justify-center">
          {tasks.map((t, i) => (
            <div key={i} className="flex justify-between items-center text-[11px] font-medium">
              <span className="text-slate-600">{t.label}</span>
              <span className={cn("font-bold text-xs", t.color)}>{t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function TodaysSchedule() {
  const sched = [
    { time: "10:30 AM", title: "Interview - Senior Dev.", sub: "Panel Room 2", dot: "bg-indigo-500" },
    { time: "11:00 AM", title: "HR Policy Review", sub: "Conf Room A", dot: "bg-indigo-500" },
    { time: "02:00 PM", title: "Employee Onboarding", sub: "Training Hall", dot: "bg-indigo-500" },
    { time: "03:30 PM", title: "Payroll Review", sub: "Finance Room", dot: "bg-indigo-500" },
    { time: "04:30 PM", title: "Leave Approval Review", sub: "HR Department", dot: "bg-indigo-500" },
  ];
  return (
    <SectionCard title={<><CalendarDays size={16} className="text-blue-500" /> Today's Schedule</>} action="View Calendar">
      <div className="relative pl-12 h-full flex flex-col pt-2 pb-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
        {sched.map((s, i) => (
          <div key={i} className="relative mb-4 last:mb-0">
            <div className="absolute left-[-45px] text-[9px] font-medium text-slate-500 top-[1px]">{s.time}</div>
            <div className={cn("absolute left-[-11px] top-[5px] w-1.5 h-1.5 rounded-full ring-[3px] ring-white z-10", s.dot)}></div>
            {i !== sched.length - 1 && <div className="absolute left-[-8.5px] top-[10px] w-px h-[calc(100%+10px)] bg-slate-100"></div>}
            <div className="text-[11px] font-semibold text-slate-800 leading-tight mb-0.5">{s.title}</div>
            <div className="text-[9px] font-medium text-slate-400 leading-tight">{s.sub}</div>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-2 block">+ 3 more events</a>
      </div>
    </SectionCard>
  );
}

function BirthdaysAnniversaries() {
  const list = [
    { name: "Sameera Abbas", sub: "Marketing Team", img: "https://i.pravatar.cc/150?u=1", tag: "Today", tagBg: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
    { name: "Rohan Mehra", sub: "Sales Team", img: "https://i.pravatar.cc/150?u=2", tag: "Today", tagBg: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
    { name: "Priya Sharma", sub: "HR Team", img: "https://i.pravatar.cc/150?u=3", tag: "Tomorrow", tagBg: "bg-purple-50 text-purple-600 border border-purple-100" },
    { name: "Arjun Verma", sub: "Development Team", img: "https://i.pravatar.cc/150?u=4", tag: "In 2 days", tagBg: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  ];
  return (
    <SectionCard title={<><Bell size={16} className="text-rose-500" /> Birthdays & Work Anniversaries</>} action="View All">
      <div className="flex border-b border-slate-100 mb-4 text-[11px]">
        <div className="pb-2 border-b-2 border-indigo-600 text-indigo-600 font-bold px-2 flex-1 text-center cursor-pointer">Birthdays (8)</div>
        <div className="pb-2 text-slate-400 font-bold px-2 flex-1 text-center cursor-pointer">Anniversaries (3)</div>
      </div>
      <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
        {list.map((u, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={u.img} className="w-8 h-8 rounded-full shadow-sm" alt="" />
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">{u.name}</div>
                <div className="text-[9px] font-medium text-slate-500">{u.sub}</div>
              </div>
            </div>
            <span className={cn("text-[9px] px-2 py-0.5 rounded font-bold", u.tagBg)}>{u.tag}</span>
          </div>
        ))}
      </div>
      <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto pt-4 block">+ 4 more birthdays</a>
    </SectionCard>
  );
}

function AttendanceOverview() {
  const data = [
    { name: "Present", value: 987, color: "#10b981", pct: "79.2%" },
    { name: "Absent", value: 126, color: "#f43f5e", pct: "10.1%" },
    { name: "On Leave", value: 78, color: "#f59e0b", pct: "6.2%" },
    { name: "Late", value: 57, color: "#94a3b8", pct: "4.6%" },
    { name: "WFH", value: 24, color: "#3b82f6", pct: "1.9%" },
  ];
  return (
    <SectionCard title="Attendance Overview" select="Today" className="col-span-1">
      <div className="flex flex-col xl:flex-row items-center h-full gap-2 py-2">
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 mb-1 leading-none">987</span>
            <span className="text-[9px] font-medium text-slate-500 leading-none">Present</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] font-medium">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: d.color}}></div>
                <span className="text-slate-600 truncate">{d.name}</span>
                <span className="font-bold text-slate-800 ml-auto mr-2">{d.value}</span>
              </div>
              <span className="text-slate-400 shrink-0">({d.pct})</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-50 text-center">
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Attendance %</div>
          <div className="text-sm font-bold text-slate-800">79.2%</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Late %</div>
          <div className="text-sm font-bold text-slate-800">4.6%</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Overtime</div>
          <div className="text-sm font-bold text-slate-800">32</div>
        </div>
      </div>
    </SectionCard>
  );
}

function LeaveOverview() {
  const data = [
    { name: "Casual", value: 80, color: "#10b981", pct: "40%" },
    { name: "Sick", value: 60, color: "#3b82f6", pct: "30%" },
    { name: "Privilege", value: 30, color: "#8b5cf6", pct: "15%" },
    { name: "Comp Off", value: 20, color: "#f59e0b", pct: "10%" },
    { name: "Other", value: 10, color: "#94a3b8", pct: "5%" },
  ];
  return (
    <SectionCard title="Leave Overview" select="This Month" className="col-span-1">
      <div className="flex flex-col xl:flex-row items-center h-full gap-2 py-2">
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 mb-1 leading-none">200</span>
            <span className="text-[9px] font-medium text-slate-500 leading-none">Total Leaves</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 justify-center">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] font-medium">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: d.color}}></div>
                <span className="text-slate-600 truncate">{d.name}</span>
                <span className="font-bold text-slate-800 ml-auto mr-2">{d.value}</span>
              </div>
              <span className="text-slate-400 shrink-0">({d.pct})</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-50 text-center">
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Pending</div>
          <div className="text-sm font-bold text-slate-800">24</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Approved</div>
          <div className="text-sm font-bold text-slate-800">152</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Rejected</div>
          <div className="text-sm font-bold text-slate-800">8</div>
        </div>
      </div>
    </SectionCard>
  );
}

function RecruitmentOverview() {
  const data = [
    { name: "Applied", value: 324, color: "#8b5cf6" },
    { name: "Screening", value: 156, color: "#3b82f6" },
    { name: "Interview", value: 58, color: "#0ea5e9" },
    { name: "Offered", value: 25, color: "#f59e0b" },
    { name: "Joined", value: 18, color: "#10b981" },
  ];
  return (
    <SectionCard title="Recruitment Overview" select="This Month" className="col-span-1">
      <div className="flex flex-col xl:flex-row items-center h-full gap-2 pt-4 pb-2">
        <div className="w-24 shrink-0 flex flex-col items-center gap-[2px]">
          {data.map((d, i) => (
            <div 
              key={i} 
              style={{ backgroundColor: d.color, width: `${100 - (i * 15)}%`, height: "22px" }} 
              className={cn("rounded-sm", i === 0 ? "rounded-t-md" : "", i === data.length - 1 ? "rounded-b-md" : "")}
            ></div>
          ))}
        </div>
        <div className="flex flex-col flex-1 justify-between h-[118px]">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] font-medium h-[22px]">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: d.color}}></div>
                <span className="text-slate-600">{d.name}</span>
              </div>
              <span className="font-bold text-slate-800">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-50 text-center">
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Open Positions</div>
          <div className="text-sm font-bold text-slate-800">24</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Interviews Today</div>
          <div className="text-sm font-bold text-slate-800">6</div>
        </div>
        <div>
          <div className="text-[9px] font-medium text-slate-500 mb-1">Joining This Week</div>
          <div className="text-sm font-bold text-slate-800">7</div>
        </div>
      </div>
    </SectionCard>
  );
}

function PerformanceOverview() {
  return (
    <SectionCard title="Performance Overview" select="This Cycle" className="col-span-1">
      <div className="flex flex-col h-full pt-2">
        <div className="relative w-full h-28 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={[{value:84},{value:16}]} cx="50%" cy="75%" startAngle={180} endAngle={0} innerRadius={50} outerRadius={65} paddingAngle={0} dataKey="value" stroke="none">
                <Cell fill="#10b981" />
                <Cell fill="#f1f5f9" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[18px] pointer-events-none">
            <div className="text-2xl font-bold text-slate-800 flex items-end gap-0.5 leading-none mb-1.5">
              4.2 <span className="text-sm font-semibold text-slate-400">/ 5</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">↑ 0.2 vs last cycle</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mt-auto pt-4">
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-slate-600">Top Performers</span>
            <span className="font-bold text-slate-800 text-xs">174</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-slate-600">Needs Improvement</span>
            <span className="font-bold text-slate-800 text-xs">164</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-slate-600">Low Performers</span>
            <span className="font-bold text-slate-800 text-xs">108</span>
          </div>
          <div className="flex justify-between items-center text-[11px] font-medium mt-1 pt-3 border-t border-slate-50">
            <span className="text-slate-600">Appraisals Due</span>
            <span className="font-bold text-slate-800 text-xs">36</span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function PayrollOverview() {
  const stats = [
    { label: "Processed", value: "890" },
    { label: "Pending", value: "358" },
    { label: "Reimbursements", value: "24" },
    { label: "Advances", value: "16" },
  ];
  return (
    <SectionCard title={<><Wallet size={16} className="text-amber-500" /> Payroll Overview</>} select="June 2026">
      <div className="flex flex-col h-full gap-2 pt-1">
        <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-md border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-600">Payroll Status</span>
          <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">In Progress</span>
        </div>
        <div className="flex flex-col gap-[14px] flex-1 mt-1">
          {stats.map((s, i) => (
            <div key={i} className="flex justify-between items-center text-[11px] font-medium">
              <span className="text-slate-600">{s.label}</span>
              <span className="font-bold text-slate-800 text-xs">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-[11px] font-semibold mt-auto pt-4 border-t border-slate-50 text-indigo-600">
          <span>Salary Day</span>
          <span className="bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">30 Jun 2026</span>
        </div>
      </div>
    </SectionCard>
  );
}

function ComplianceOverview() {
  const items = [
    { icon: <FileText size={12} />, label: "Missing Documents", count: 35, color: "text-rose-600 bg-rose-50" },
    { icon: <AlertCircle size={12} />, label: "Expiring Soon", count: 22, color: "text-amber-600 bg-amber-50" },
    { icon: <CheckCircle2 size={12} />, label: "KYC Pending", count: 18, color: "text-blue-600 bg-blue-50" },
    { icon: <ScanFace size={12} />, label: "Verifications Pending", count: 14, color: "text-indigo-600 bg-indigo-50" },
  ];
  return (
    <SectionCard title={<><FileCheck size={16} className="text-indigo-500" /> Compliance Overview</>} select="This Month">
      <div className="flex flex-col gap-2 py-1 h-full pt-2">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between items-center text-[11px] font-semibold">
            <div className="flex items-center gap-2.5 text-slate-600">
              <span className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", it.color)}>
                {it.icon}
              </span>
              {it.label}
            </div>
            <span className="font-bold text-slate-800 text-sm">{it.count}</span>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto pt-2 block">View Compliance Center</a>
      </div>
    </SectionCard>
  );
}

function UserMinus(props: any) {
  return <UserX {...props} />;
}

function AIInsights() {
  const insights = [
    { text: "5 employees likely to resign.", icon: <BrainCircuit size={12} />, color: "text-indigo-600 bg-indigo-50" },
    { text: "Attendance dropped by 15% in Sales.", icon: <TrendingDown size={12} />, color: "text-rose-600 bg-rose-50" },
    { text: "Hiring is slower than last month.", icon: <UserMinus size={12} />, color: "text-amber-600 bg-amber-50" },
    { text: "3 payroll anomalies detected.", icon: <AlertCircle size={12} />, color: "text-rose-600 bg-rose-50" },
    { text: "High overtime in Development team.", icon: <Clock size={12} />, color: "text-emerald-600 bg-emerald-50" },
  ];
  return (
    <SectionCard title={<><BrainCircuit size={16} className="text-pink-500" /> AI Insights</>}>
      <div className="flex flex-col justify-center h-full gap-3 pt-2">
        {insights.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] text-slate-700 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
            <span className={cn("w-5 h-5 rounded flex items-center justify-center shrink-0", it.color)}>
              {it.icon}
            </span>
            <span className="font-semibold leading-tight">{it.text}</span>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto pt-2 block">View All Insights</a>
      </div>
    </SectionCard>
  );
}

function DepartmentSpread() {
  const data = [
    { name: "Sales", value: 394, color: "#8b5cf6", pct: "31.9%" },
    { name: "Development", value: 326, color: "#0ea5e9", pct: "26.1%" },
    { name: "Marketing", value: 152, color: "#f59e0b", pct: "12.2%" },
    { name: "HR", value: 98, color: "#10b981", pct: "8.1%" },
    { name: "Finance", value: 72, color: "#3b82f6", pct: "7.1%" },
    { name: "Others", value: 206, color: "#f97316", pct: "14.6%" },
  ];
  return (
    <SectionCard title="Department Spread" select="This Month">
      <div className="flex items-center h-full gap-2 pt-2">
        <div className="relative w-[130px] h-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[17px] font-bold text-slate-800 leading-none mb-1">1,248</span>
            <span className="text-[9px] font-medium text-slate-500 leading-none">Total</span>
          </div>
        </div>
        <div className="flex flex-col gap-[7px] flex-1 justify-center pl-1">
          {data.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-[9px] font-medium whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: d.color}}></div>
                <span className="text-slate-600">{d.name}</span>
              </div>
              <span className="font-bold text-slate-800">{d.value} <span className="text-slate-400 font-normal">({d.pct})</span></span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mt-4 border-t border-slate-50 pt-4">
        <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">Departments <ChevronDown size={12} /></div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">Branches <ChevronDown size={12} /></div>
      </div>
    </SectionCard>
  );
}

function AttendanceTrend() {
  const data = [
    { name: 'Mon', value: 82 }, { name: 'Tue', value: 78 }, { name: 'Wed', value: 80 },
    { name: 'Thu', value: 87 }, { name: 'Fri', value: 78 }, { name: 'Sat', value: 74 }, { name: 'Sun', value: 71 },
  ];
  return (
    <SectionCard title="Attendance Trend" select="(This Week)" className="col-span-1">
      <div className="h-[140px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} tickFormatter={(val) => `${val}%`} domain={['dataMin - 5', 'dataMax + 5']} />
            <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', fontWeight: 600, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#e2e8f0' }} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3.5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function LeaveTrend() {
  const data = [
    { name: 'W1', value: 45 }, { name: 'W2', value: 55 }, { name: 'W3', value: 80 },
    { name: 'W4', value: 40 }, { name: 'W5', value: 48 },
  ];
  return (
    <SectionCard title="Leave Trend" select="(This Month)" className="col-span-1">
       <div className="h-[140px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} />
            <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ fontSize: '10px', borderRadius: '8px', fontWeight: 600, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function HiringTrend() {
  const data = [
    { name: 'W1', value: 12 }, { name: 'W2', value: 18 }, { name: 'W3', value: 30 },
    { name: 'W4', value: 15 }, { name: 'W5', value: 25 },
  ];
  return (
    <SectionCard title="Hiring Trend" select="(This Month)" className="col-span-1">
      <div className="h-[140px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} domain={[0, 'dataMax + 10']} />
            <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', fontWeight: 600, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#e2e8f0' }} />
            <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3.5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function AttritionTrend() {
  const data = [
    { name: 'Jan', value: 4.2 }, { name: 'Feb', value: 6.0 }, { name: 'Mar', value: 7.7 },
    { name: 'Apr', value: 7.5 }, { name: 'May', value: 7.9 }, { name: 'Jun', value: 8.4 },
  ];
  return (
    <SectionCard title="Attrition Trend" select="(This Year)" className="col-span-1">
      <div className="h-[140px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 500 }} tickFormatter={(val) => `${val}%`} domain={[0, 10]} />
            <RechartsTooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', fontWeight: 600, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#e2e8f0' }} />
            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ r: 3.5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}

function UpcomingEvents() {
  const events = [
    { date: "28 Jun", title: "Interview - UI/UX Designer", sub: "10:00 AM - Panel Room 1" },
    { date: "29 Jun", title: "New Joiner Orientation", sub: "11:00 AM - Training Hall" },
    { date: "30 Jun", title: "Payroll Processing", sub: "All Day - Finance Department" },
    { date: "01 Jul", title: "Townhall Meeting", sub: "04:00 PM - Auditorium" },
    { date: "02 Jul", title: "Training - HR Policies", sub: "11:00 AM - Conf Room B" },
  ];
  return (
    <SectionCard title="Upcoming Events">
      <div className="flex flex-col gap-[15px] h-full pt-2">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center justify-center shrink-0 w-[34px] h-[34px] rounded-lg bg-indigo-50 text-indigo-700 leading-none border border-indigo-100/50">
              <span className="font-bold text-sm leading-tight">{e.date.split(' ')[0]}</span>
              <span className="text-[8px] uppercase font-bold tracking-wider">{e.date.split(' ')[1]}</span>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight mb-0.5">{e.title}</div>
              <div className="text-[9px] font-medium text-slate-500">{e.sub}</div>
            </div>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto pt-2 block">View Full Calendar</a>
      </div>
    </SectionCard>
  );
}

function PendingApprovals() {
  const items = [
    { icon: <UmbrellaOff size={14} />, label: "Leave Requests", count: 24, color: "text-rose-500" },
    { icon: <Receipt size={14} />, label: "Expense Claims", count: 12, color: "text-indigo-500" },
    { icon: <Clock size={14} />, label: "Timesheets", count: 18, color: "text-amber-500" },
    { icon: <AlarmClock size={14} />, label: "Overtime Requests", count: 7, color: "text-emerald-500" },
    { icon: <LogOut size={14} />, label: "Exit Requests", count: 3, color: "text-rose-600" },
  ];
  return (
    <SectionCard title="Pending Approvals">
      <div className="flex flex-col gap-2 py-1 h-full pt-3">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between items-center text-[11px] font-medium">
            <div className="flex items-center gap-3 text-slate-600">
              <span className={cn("text-slate-400 shrink-0 opacity-80", it.color)}>
                {React.cloneElement(it.icon, { className: it.color })}
              </span>
              {it.label}
            </div>
            <span className={cn("font-bold text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100", it.color)}>{it.count}</span>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto pt-2 block">Go to Approvals</a>
      </div>
    </SectionCard>
  );
}

function RecentActivities() {
  const acts = [
    { icon: <UserPlus size={10} />, title: "John Doe added a new employee", time: "2 min ago", iconBg: "bg-slate-100 text-slate-600 border border-slate-200" },
    { icon: <CheckCircle2 size={10} />, title: "Leave request approved for Priya Sharma", time: "15 min ago", iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
    { icon: <Clock size={10} />, title: "Attendance corrected for 12 employees", time: "30 min ago", iconBg: "bg-slate-100 text-slate-600 border border-slate-200" },
    { icon: <Briefcase size={10} />, title: "Interview completed for React Developer", time: "45 min ago", iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
    { icon: <Wallet size={10} />, title: "Payroll for June is being processed", time: "1 hour ago", iconBg: "bg-slate-100 text-slate-600 border border-slate-200" },
  ];
  return (
    <SectionCard title="Recent Activities">
      <div className="relative pl-6 h-full flex flex-col justify-between pt-2 pb-1">
        {acts.map((a, i) => (
          <div key={i} className="relative mb-[18px] last:mb-0">
            <div className={cn("absolute left-[-24px] top-[1px] w-5 h-5 rounded-full flex items-center justify-center z-10", a.iconBg)}>
              {a.icon}
            </div>
            {i !== acts.length - 1 && <div className="absolute left-[-15px] top-[21px] w-px h-[calc(100%+2px)] bg-slate-200"></div>}
            <div className="text-[11px] font-semibold text-slate-700 leading-tight mb-1">{a.title}</div>
            <div className="text-[9px] font-medium text-slate-400 leading-none">{a.time}</div>
          </div>
        ))}
        <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-2 block">View All Activities</a>
      </div>
    </SectionCard>
  );
}

function QuickStats() {
  return (
    <SectionCard title="Quick Stats">
      <div className="grid grid-cols-2 gap-2 h-full pb-4 pt-2">
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Avg. Check In</div>
          <div className="text-[13px] font-bold text-slate-800">09:18 AM</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Avg. Check Out</div>
          <div className="text-[13px] font-bold text-slate-800">06:27 PM</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Late Arrivals</div>
          <div className="text-[13px] font-bold text-slate-800">57</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Early Leave</div>
          <div className="text-[13px] font-bold text-slate-800">23</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Overtime Hours</div>
          <div className="text-[13px] font-bold text-slate-800">128.5 hrs</div>
        </div>
        <div className="bg-slate-50 p-2 rounded-md border border-slate-100 flex flex-col justify-center">
          <div className="text-[9px] font-medium text-slate-500 mb-1">Leave Balance</div>
          <div className="text-[13px] font-bold text-slate-800">512 Days</div>
        </div>
      </div>
      <a href="#" className="text-[11px] font-semibold text-indigo-600 hover:underline mt-auto block">View Detailed Analytics</a>
    </SectionCard>
  );
}

function QuickActionButton({ icon, label, bg }: any) {
  return (
    <button className="flex flex-col items-center justify-center gap-2.5 w-[100px] h-[100px] bg-white rounded-md shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
      <div className={cn("w-[42px] h-[42px] rounded-md flex items-center justify-center transition-colors shadow-sm", bg)}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-indigo-600 px-1">{label}</span>
    </button>
  );
}