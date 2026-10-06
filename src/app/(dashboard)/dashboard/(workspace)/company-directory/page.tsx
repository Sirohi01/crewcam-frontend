'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/axios'
import {
  ChevronRight,
  ChevronLeft,
  Users,
  Building2,
  MapPin,
  Briefcase,
  UserPlus,
  Search,
  SlidersHorizontal,
  RotateCcw,
  MessageSquare,
  Mail,
  MoreVertical,
  Network,
  Gift,
  UsersRound,
  BookOpen,
  Headphones,
} from 'lucide-react'

// ---------- Types ----------

interface StatCard {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  value: string
  linkText: string
}

interface Employee {
  id: string
  empId: string
  name: string
  isYou?: boolean
  initials: string
  avatarBg: string
  avatarText: string
  designation: string
  department: string
  location: string
  email: string
  phone: string
}

interface QuickLink {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
}

interface DeptGlance {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  name: string
  count: number
}

interface BirthdayPerson {
  id: string
  name: string
  role: string
  day: string
  month: string
  initials: string
  avatarBg: string
  avatarText: string
}

interface AnniversaryPerson {
  id: string
  name: string
  role: string
  years: number
  initials: string
  avatarBg: string
  avatarText: string
}

// ---------- Data ----------

const STATS: StatCard[] = [
  {
    id: 'employees',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Total Employees',
    value: '256',
    linkText: 'View all employees',
  },
  {
    id: 'departments',
    icon: Building2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    label: 'Departments',
    value: '18',
    linkText: 'View all departments',
  },
  {
    id: 'locations',
    icon: MapPin,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    label: 'Locations',
    value: '6',
    linkText: 'View all locations',
  },
  {
    id: 'positions',
    icon: Briefcase,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    label: 'Open Positions',
    value: '24',
    linkText: 'View open positions',
  },
  {
    id: 'joiners',
    icon: UserPlus,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    label: 'New Joiners (This Month)',
    value: '12',
    linkText: 'View new joiners',
  },
]

const EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    empId: 'EMP0012',
    name: 'Rohan Mehta',
    isYou: true,
    initials: 'RM',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
    designation: 'Executive - Sales',
    department: 'Sales & Marketing',
    location: 'Noida',
    email: 'rohan.mehta@crewcam.com',
    phone: '+91 98765 43210',
  },
  {
    id: 'e2',
    empId: 'EMP0021',
    name: 'Swati Verma',
    initials: 'SV',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
    designation: 'HR Manager',
    department: 'Human Resources',
    location: 'Gurugram',
    email: 'swati.verma@crewcam.com',
    phone: '+91 98123 45678',
  },
  {
    id: 'e3',
    empId: 'EMP0034',
    name: 'Vikas Mittal',
    initials: 'VM',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-700',
    designation: 'Finance Head',
    department: 'Finance & Accounts',
    location: 'Noida',
    email: 'vikas.mittal@crewcam.com',
    phone: '+91 99100 11223',
  },
  {
    id: 'e4',
    empId: 'EMP0045',
    name: 'Rishav Kumar',
    initials: 'RK',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    designation: 'IT Manager',
    department: 'Information Technology',
    location: 'Bengaluru',
    email: 'rishav.kumar@crewcam.com',
    phone: '+91 99876 54321',
  },
  {
    id: 'e5',
    empId: 'EMP0056',
    name: 'Reetika Singh',
    initials: 'RS',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    designation: 'Sales Head',
    department: 'Sales & Marketing',
    location: 'Mumbai',
    email: 'reetika.singh@crewcam.com',
    phone: '+91 98987 65432',
  },
  {
    id: 'e6',
    empId: 'EMP0067',
    name: 'Amit Sharma',
    initials: 'AS',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
    designation: 'Operations Manager',
    department: 'Operations',
    location: 'Noida',
    email: 'amit.sharma@crewcam.com',
    phone: '+91 98701 23456',
  },
  {
    id: 'e7',
    empId: 'EMP0078',
    name: 'Nisha Patel',
    initials: 'NP',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-700',
    designation: 'Accountant',
    department: 'Finance & Accounts',
    location: 'Ahmedabad',
    email: 'nisha.patel@crewcam.com',
    phone: '+91 90990 11223',
  },
  {
    id: 'e8',
    empId: 'EMP0089',
    name: 'Sandeep Singh',
    initials: 'SS',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-700',
    designation: 'Senior Developer',
    department: 'Information Technology',
    location: 'Bengaluru',
    email: 'sandeep.singh@crewcam.com',
    phone: '+91 96633 22110',
  },
]

const QUICK_LINKS: QuickLink[] = [
  {
    id: 'org',
    icon: Network,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: 'Org Chart',
    description: 'View organizational structure',
  },
  {
    id: 'birthdays',
    icon: Gift,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    title: 'Birthdays & Work Anniversaries',
    description: 'See upcoming celebrations',
  },
  {
    id: 'whos-who',
    icon: UsersRound,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: "Who's Who",
    description: 'Key people in the organization',
  },
  {
    id: 'team-directory',
    icon: UsersRound,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    title: 'Team Directory',
    description: 'Browse by teams',
  },
  {
    id: 'handbook',
    icon: BookOpen,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    title: 'Employee Handbook',
    description: 'Company policies & guidelines',
  },
]

const DEPT_GLANCE: DeptGlance[] = [
  { id: 'md', icon: UsersRound, iconBg: 'bg-slate-100', iconColor: '', name: 'Managing Director', count: 1 },
  { id: 'sales', icon: Briefcase, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', name: 'Sales & Marketing', count: 45 },
  { id: 'finance', icon: Building2, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', name: 'Finance & Accounts', count: 32 },
  { id: 'hr', icon: UsersRound, iconBg: 'bg-violet-50', iconColor: 'text-violet-500', name: 'Human Resources', count: 18 },
  { id: 'it', icon: Network, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', name: 'Information Technology', count: 42 },
  { id: 'ops', icon: Briefcase, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', name: 'Operations', count: 56 },
  { id: 'cs', icon: Headphones, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', name: 'Customer Support', count: 27 },
  { id: 'admin', icon: Briefcase, iconBg: 'bg-orange-50', iconColor: 'text-orange-500', name: 'Admin', count: 15 },
]

const BIRTHDAYS: BirthdayPerson[] = [
  {
    id: 'b1',
    name: 'Rishav Kumar',
    role: 'IT Manager',
    day: '24',
    month: 'MAY',
    initials: 'RK',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
  },
  {
    id: 'b2',
    name: 'Nisha Patel',
    role: 'Accountant',
    day: '28',
    month: 'MAY',
    initials: 'NP',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-700',
  },
  {
    id: 'b3',
    name: 'Amit Sharma',
    role: 'Operations Manager',
    day: '30',
    month: 'MAY',
    initials: 'AS',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
  },
]

const ANNIVERSARIES: AnniversaryPerson[] = [
  {
    id: 'a1',
    name: 'Swati Verma',
    role: 'HR Manager',
    years: 3,
    initials: 'SV',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
  },
  {
    id: 'a2',
    name: 'Reetika Singh',
    role: 'Sales Head',
    years: 7,
    initials: 'RS',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
  },
  {
    id: 'a3',
    name: 'Vikas Mittal',
    role: 'Finance Head',
    years: 7,
    initials: 'VM',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-700',
  },
]

const FILTERS: string[] = ['All Departments', 'All Locations', 'All Designations']

const PAGES: (number | 'ellipsis')[] = [1, 2, 3, 'ellipsis', 32]

// ---------- Small building blocks ----------

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`relative rounded-lg border border-slate-200 bg-white p-2 flex flex-col min-h-0 overflow-hidden ${className}`}
  >
    {children}
  </div>
)

const Avatar: React.FC<{ initials: string; bg: string; text: string; size?: string }> = ({
  initials,
  bg,
  text,
  size = 'h-7 w-7',
}) => (
  <div
    className={`${size} ${bg} ${text} rounded-full flex items-center justify-center text-[10px] font-bold shrink-0`}
  >
    {initials}
  </div>
)

// ---------- Stat card ----------

const StatCardView: React.FC<{ stat: StatCard }> = ({ stat }) => {
  const Icon = stat.icon
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 min-w-0 flex-1">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs  truncate">{stat.label}</p>
        <p className="text-lg font-bold leading-tight">{stat.value}</p>
        <p className="text-[11px]  truncate">{stat.linkText}</p>
      </div>
    </div>
  )
}
// ---------- Main component ----------

const CompanyDirectory: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/companies/directory');
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch directory data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsMap = data?.stats || {};
  const currentStats = STATS.map(s => {
    if (s.id === 'employees') return { ...s, value: statsMap.totalEmployees?.toString() || '0' };
    if (s.id === 'departments') return { ...s, value: statsMap.totalDepartments?.toString() || '0' };
    if (s.id === 'locations') return { ...s, value: statsMap.totalLocations?.toString() || '0' };
    if (s.id === 'positions') return { ...s, value: statsMap.openPositions?.toString() || '0' };
    if (s.id === 'joiners') return { ...s, value: statsMap.newJoiners?.toString() || '0' };
    return s;
  });

  const currentEmployees = data?.employees || EMPLOYEES;
  const currentDeptGlance = data?.deptGlance?.map((d: any) => ({
    id: d.id, icon: Briefcase, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', name: d.name, count: d.count
  })) || DEPT_GLANCE;
  const currentBirthdays = data?.birthdays || BIRTHDAYS;
  const currentAnniversaries = data?.anniversaries || ANNIVERSARIES;

  return (
   <div className="flex h-[calc(100vh-48px)] min-h-[650px] flex-col gap-2 overflow-hidden bg-slate-50 p-2 text-slate-900">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <div className="flex items-center gap-1 text-[11px] font-medium ">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span className="">Company Directory</span>
        </div>
        <h1 className="text-lg font-bold  leading-none">Company Directory</h1>
        <p className="text-[11px] font-medium ">
          Find and connect with people across the organization.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
      ) : (
      <>
        {/* Stat cards - always a single row */}
        <div className="grid grid-cols-5 gap-2 shrink-0">
          {currentStats.map((stat) => (
            <StatCardView key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-[2.4fr_1fr] gap-2 flex-1 min-h-0">
        {/* Left column */}
        <div className="flex flex-col min-h-0 ">
          {/* Search / filters - always a single row */}
          <div className="relative rounded-tl-lg rounded-tr-lg  border border-slate-200 bg-white p-2 flex min-h-0 overflow-hidden  flex-row flex-nowrap items-center gap-2 shrink-0 overflow-x-auto">
            <div className="flex-1 flex items-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 min-w-[160px]">
              <Search className="h-3.5 w-3.5  shrink-0" />
              <input
                type="text"
                placeholder="Search by name, role, department or location..."
                className="flex-1 text-[11px] font-medium  placeholder: outline-none min-w-0"
              />
            </div>
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] font-medium  whitespace-nowrap shrink-0"
              >
                {filter}
                <ChevronRight className="h-3 w-3 rotate-90 " />
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] font-medium  whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="h-3 w-3" />
              More Filters
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] font-medium  whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          {/* Employee table */}
         <div className="flex-1 relative  border border-slate-200 bg-white p-2 flex flex-col min-h-0">
  <div className="grid grid-cols-[1.6fr_1.2fr_1.4fr_1fr_1.6fr_0.9fr] gap-2 pb-1.5 border-b border-slate-100 shrink-0">
    <span className="text-[10px] font-semibold">Employee</span>
    <span className="text-[10px] font-semibold">Designation</span>
    <span className="text-[10px] font-semibold">Department</span>
    <span className="text-[10px] font-semibold">Location</span>
    <span className="text-[10px] font-semibold">Email / Phone</span>
    <span className="text-[10px] font-semibold text-right">Action</span>
  </div>

  {/* Scrollable body */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    <div className="flex flex-col">
      {currentEmployees.map((emp: any) => (
        <div
          key={emp.id}
          className="grid grid-cols-[1.6fr_1.2fr_1.4fr_1fr_1.6fr_0.9fr] gap-2 items-center border-b border-slate-50 last:border-b-0"
        >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar initials={emp.initials} bg={emp.avatarBg} text={emp.avatarText} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-semibold  truncate">
                            {emp.name}
                          </span>
                          {emp.isYou ? (
                            <span className="text-[8px] font-semibold text-blue-600 bg-blue-50 rounded-full px-1 py-0.5 shrink-0">
                              You
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[9px] font-medium ">{emp.empId}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium  truncate">
                      {emp.designation}
                    </span>
                    <span className="text-[11px] font-medium  truncate">
                      {emp.department}
                    </span>
                    <span className="flex items-center gap-0.5 text-[11px] font-medium  truncate">
                      <MapPin className="h-3 w-3  shrink-0" />
                      {emp.location}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-blue-600 truncate">{emp.email}</p>
                      <p className="text-[10px] font-medium  truncate">{emp.phone}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-slate-50"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center text-blue-600 hover:bg-slate-50"
                      >
                        <Mail className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="h-6 w-6 rounded-md flex items-center justify-center  hover:bg-slate-50"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="relative rounded-bl-lg rounded-br-lg  border border-slate-200 bg-white p-2 flex min-h-0 overflow-hidden flex-row items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-medium ">
              Showing 1 to 8 of 256 employees
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center "
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              {PAGES.map((page, idx) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${idx}`} className="text-[11px] font-medium  px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    className={`h-6 w-6 rounded-md text-[11px] font-semibold flex items-center justify-center ${
                      page === 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 '
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center "
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium "
            >
              10 / page
              <ChevronRight className="h-3 w-3 rotate-90 " />
            </button>
          </div>

          {/* Bottom row: birthdays / anniversaries / contact - always 3 equal columns in one row */}
         
        </div>

        {/* Right column */}
      <div className="flex flex-col gap-2 min-h-0">
  {/* Quick Links */}
  <Card className="flex-1 min-h-0 flex flex-col">
    <span className="text-[12px] font-semibold mb-1 shrink-0">
      Quick Links
    </span>

    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
      {QUICK_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <button
            key={link.id}
            type="button"
            className="flex items-center gap-2 text-left"
          >
            <div
              className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${link.iconBg}`}
            >
              <Icon className={`h-3.5 w-3.5 ${link.iconColor}`} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold truncate">
                {link.title}
              </p>
              <p className="text-[9px] font-medium truncate">
                {link.description}
              </p>
            </div>

            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        );
      })}
    </div>
  </Card>

  {/* Organization at a Glance */}
  <Card className="flex-[1.4] min-h-0 flex flex-col">
    <div className="flex items-center justify-between mb-1 shrink-0">
      <span className="text-[12px] font-semibold">
        Organization at a Glance
      </span>

      <button
        type="button"
        className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 whitespace-nowrap"
      >
        View Full Org Chart
        <ChevronRight className="h-2.5 w-2.5" />
      </button>
    </div>

    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
      {currentDeptGlance.map((d: any) => {
        const Icon = d.icon || Briefcase;

        return (
          <div key={d.id} className="flex items-center gap-1.5">
            <div
              className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${d.iconBg}`}
            >
              <Icon className={`h-3 w-3 ${d.iconColor}`} />
            </div>

            <span className="text-[11px] font-semibold flex-1 truncate">
              {d.name}
            </span>

            <span className="text-[10px] font-bold bg-slate-100 rounded-full px-1.5 py-0.5 shrink-0">
              {d.count}
            </span>
          </div>
        );
      })}
    </div>
  </Card>
</div>
      </div>
       <div className="grid grid-cols-3 gap-2 shrink-0" style={{ height: '18%' }}>
            <Card>
              <div className="flex items-center justify-between shrink-0 mb-1">
                <span className="text-[12px] font-semibold ">Upcoming Birthdays</span>
                <button
                  type="button"
                  className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600"
                >
                  View All
                  <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
          <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
  {currentBirthdays.map((p: any) => (
    <div
      key={p.id}
      className="flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <Avatar
          initials={p.initials}
          bg={p.avatarBg}
          text={p.avatarText}
          size="h-6 w-6"
        />

        <div className="min-w-0">
          <p className="text-[11px] font-semibold  truncate">
            {p.name}
          </p>
          <p className="text-[9px] font-medium  truncate">
            {p.role}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-center">
        <p className="text-[11px] font-bold leading-none text-emerald-600">
          {p.day}
        </p>
        <p className="text-[8px] font-semibold leading-none ">
          {p.month}
        </p>
      </div>
    </div>
  ))}
</div>
            </Card>

            <Card>
              <div className="flex items-center justify-between shrink-0 mb-1">
                <span className="text-[12px] font-semibold ">
                  Upcoming Work Anniversaries
                </span>
                <button
                  type="button"
                  className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600"
                >
                  View All
                  <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
       <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
  {currentAnniversaries.map((p: any) => (
    <div
      key={p.id}
      className="flex items-center justify-between gap-2 rounded-lg"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <Avatar
          initials={p.initials}
          bg={p.avatarBg}
          text={p.avatarText}
          size="h-6 w-6"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold  truncate">
            {p.name}
          </p>
          <p className="text-[9px] font-medium  truncate">
            {p.role}
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-center">
        <p className="text-[11px] font-bold leading-none text-amber-600">
          {p.years}
        </p>
        <p className="text-[8px] font-semibold leading-none ">
          Years
        </p>
      </div>
    </div>
  ))}
</div>
            </Card>

            {/* Can't find someone - dummy bg image, replace url with your own */}
            <Card className="items-center justify-center text-center p-0">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://placehold.co/600x400/e0f2fe/e0f2fe')" }}
              />
              <div className="absolute inset-0 z-0 bg-white/85" />
              <div className="relative z-10 flex flex-col items-center justify-center p-2 h-full w-full">
                <span className="text-[12px] font-bold ">Can&apos;t find someone?</span>
                <p className="text-[10px] font-medium  mt-0.5">
                  If you are unable to find the person you are looking for, please contact HR.
                </p>
                <button
                  type="button"
                  className="mt-1.5 flex items-center gap-1 rounded-md border border-blue-200 bg-white text-blue-600 px-2 py-1.5 text-[11px] font-semibold"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  Contact HR Team
                </button>
              </div>
            </Card>
          </div>
      </>
      )}
    </div>
  )
}

export default CompanyDirectory