'use client'

import React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar,
} from 'recharts'
import {
  Users, UserCheck, Calendar, Send, UserPlus,
  Clock, IndianRupee, CheckCircle2, TrendingUp, Award,
  CalendarDays, SlidersHorizontal, Download,
} from 'lucide-react'
import PageLayout from '@/components/ui/pageLayout'

// ---------- Types ----------

interface StatCard {
  label: string
  value: string
  change: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

interface SourceSlice {
  name: string
  value: number
  percent: string
  color: string
}

interface TrendPoint {
  date: string
  applications: number
}

interface FunnelStage {
  label: string
  value: string
  color: string
  width: string
}

interface MiniMetric {
  label: string
  sub: string
  value: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

interface DeptRow {
  department: string
  openings: number
  applications: number
  shortlisted: number
  interviews: number
  offers: number
  hires: number
  timeToHire: number
}

interface JobRow {
  title: string
  applications: number
  shortlisted: number
  interviews: number
  offers: number
  hires: number
  status: string
}

interface HiringTrendPoint {
  month: string
  hires: number
}

interface DonutSlice {
  name: string
  value: number
  color: string
}

interface DeptHireBar {
  department: string
  hires: number
}

// ---------- Data ----------

const statCards: StatCard[] = [
  { label: 'Total Applications', value: '642', change: '18.6% vs 01 May - 31 May 2026', icon: Users, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Shortlisted', value: '128', change: '21.4% vs 01 May - 31 May 2026', icon: UserCheck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Interviews Conducted', value: '64', change: '15.2% vs 01 May - 31 May 2026', icon: Calendar, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Offers Extended', value: '22', change: '10.0% vs 01 May - 31 May 2026', icon: Send, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Hires (Joined)', value: '14', change: '16.7% vs 01 May - 31 May 2026', icon: UserPlus, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
]

const sourceData: SourceSlice[] = [
  { name: 'Naukri.com', value: 212, percent: '33.0%', color: '#6366f1' },
  { name: 'LinkedIn', value: 168, percent: '26.2%', color: '#3b82f6' },
  { name: 'Employee Referral', value: 112, percent: '17.4%', color: '#22c55e' },
  { name: 'Company Career Page', value: 88, percent: '13.7%', color: '#f59e0b' },
  { name: 'Others', value: 62, percent: '9.7%', color: '#ec4899' },
]

const trendData: TrendPoint[] = [
  { date: '01 Jun', applications: 40 }, { date: '03 Jun', applications: 55 },
  { date: '05 Jun', applications: 35 }, { date: '07 Jun', applications: 60 },
  { date: '09 Jun', applications: 70 }, { date: '11 Jun', applications: 50 },
  { date: '13 Jun', applications: 65 }, { date: '15 Jun', applications: 45 },
]

const funnelStages: FunnelStage[] = [
  { label: 'Applications', value: '642 (100%)', color: '#6366f1', width: '100%' },
  { label: 'AI Screened', value: '418 (65.1%)', color: '#3b82f6', width: '82%' },
  { label: 'Assessments', value: '196 (30.5%)', color: '#22c55e', width: '64%' },
  { label: 'Interviews', value: '64 (10.0%)', color: '#f59e0b', width: '46%' },
  { label: 'Offers', value: '22 (3.4%)', color: '#ec4899', width: '28%' },
  { label: 'Hires', value: '14 (2.2%)', color: '#f472b6', width: '18%' },
]

const miniMetrics: MiniMetric[] = [
  { label: 'Time to Hire', sub: 'Avg. time from opening to joining', value: '28', icon: Clock, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Cost per Hire', sub: 'Average cost incurred per hire', value: '₹8,642', icon: IndianRupee, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Offer Acceptance Rate', sub: 'Offers accepted vs total offers', value: '63.6%', icon: CheckCircle2, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Interview to Offer Rate', sub: 'Offers vs interviews conducted', value: '34.4%', icon: TrendingUp, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Source of Hire (Top)', sub: 'By number of hires', value: 'Employee Referral', icon: Award, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
]

const deptRows: DeptRow[] = [
  { department: 'Marketing', openings: 8, applications: 156, shortlisted: 32, interviews: 12, offers: 6, hires: 4, timeToHire: 24 },
  { department: 'IT', openings: 12, applications: 238, shortlisted: 54, interviews: 26, offers: 8, hires: 5, timeToHire: 26 },
  { department: 'Human Resources', openings: 6, applications: 82, shortlisted: 16, interviews: 8, offers: 3, hires: 2, timeToHire: 21 },
  { department: 'Finance & Accounts', openings: 5, applications: 64, shortlisted: 12, interviews: 6, offers: 2, hires: 1, timeToHire: 29 },
  { department: 'Operations', openings: 7, applications: 102, shortlisted: 14, interviews: 6, offers: 3, hires: 1, timeToHire: 31 },
]

const deptTotals: DeptRow = { department: 'Total', openings: 38, applications: 642, shortlisted: 128, interviews: 64, offers: 22, hires: 14, timeToHire: 28 }

const jobRows: JobRow[] = [
  { title: 'Digital Marketing Executive', applications: 48, shortlisted: 12, interviews: 6, offers: 2, hires: 1, status: 'Active' },
  { title: 'Software Developer', applications: 86, shortlisted: 20, interviews: 10, offers: 3, hires: 2, status: 'Active' },
  { title: 'HR Executive', applications: 32, shortlisted: 6, interviews: 3, offers: 1, hires: 1, status: 'Active' },
  { title: 'UI/UX Designer', applications: 44, shortlisted: 10, interviews: 4, offers: 2, hires: 1, status: 'Active' },
  { title: 'Accountant', applications: 28, shortlisted: 5, interviews: 2, offers: 1, hires: 1, status: 'Active' },
]

const jobTotals = { applications: 238, shortlisted: 53, interviews: 25, offers: 9, hires: 6 }

const hiringTrend: HiringTrendPoint[] = [
  { month: 'Jan', hires: 12 }, { month: 'Feb', hires: 8 }, { month: 'Mar', hires: 16 },
  { month: 'Apr', hires: 18 }, { month: 'May', hires: 10 }, { month: 'Jun', hires: 14 },
]

const offerStatus: DonutSlice[] = [
  { name: 'Accepted', value: 14, color: '#22c55e' },
  { name: 'Pending', value: 5, color: '#f59e0b' },
  { name: 'Declined', value: 3, color: '#ec4899' },
]

const genderData: DonutSlice[] = [
  { name: 'Male', value: 8, color: '#3b82f6' },
  { name: 'Female', value: 6, color: '#ec4899' },
]

const deptHires: DeptHireBar[] = [
  { department: 'IT', hires: 8 }, { department: 'Marketing', hires: 6 },
  { department: 'HR', hires: 3 }, { department: 'Finance', hires: 2 }, { department: 'Operations', hires: 2 },
]

// ---------- Small building blocks ----------

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl border border-slate-300 p-2 flex flex-col min-h-[90px] relative z-10 ${className}`}>{children}</div>
)

const StatCardItem: React.FC<{ item: StatCard }> = ({ item }) => {
  const Icon = item.icon
  return (
    <Card className="justify-center h-full">
      <div className="flex gap-2">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${item.iconBg}`}>
          <Icon className={`w-4 h-4 ${item.iconColor}`} />
        </span>
        <div className="min-w-0">
          <div className="text-xl font-bold text-gray-900 leading-none truncate">{item.value}</div>
          <div className="text-[11px] font-semibold text-gray-700 truncate mt-1">{item.label}</div>
      <div className="text-[10px] font-semibold text-emerald-700 mt-1">↑ {item.change}</div>
        </div>
      </div>
    </Card>
  )
}

const MiniMetricItem: React.FC<{ item: MiniMetric }> = ({ item }) => {
  const Icon = item.icon
  return (
    <Card className="justify-between h-full">
      <div>
        <span className="text-[11px] font-semibold text-gray-900 leading-tight">{item.label}</span>
        <div className="text-[9px] text-gray-600 mt-0.5">{item.sub}</div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${item.iconBg}`}>
          <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
        </span>
        <span className="text-lg font-bold text-gray-900 leading-none truncate">{item.value}</span>
      </div>
    </Card>
  )
}

const DonutChart: React.FC<{ data: DonutSlice[]; centerLabel: string; centerValue: string | number }> = ({ data, centerLabel, centerValue }) => (
  <div className="relative w-full h-full flex items-center justify-center min-h-[80px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="90%" paddingAngle={2} stroke="none">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute flex flex-col items-center">
      <span className="text-base font-bold text-gray-900 leading-none">{centerValue}</span>
      <span className="text-[9px] text-gray-600">{centerLabel}</span>
    </div>
  </div>
)

const Legend: React.FC<{ data: { name: string; color: string; sub?: string }[] }> = ({ data }) => (
  <div className="flex flex-col gap-1 justify-center w-full min-w-0">
    {data.map((d, i) => (
      <div key={i} className="flex items-center justify-between gap-2 text-[9px] text-gray-800 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
          <span className="truncate">{d.name}</span>
        </div>
        {d.sub && <span className="font-semibold shrink-0 tabular-nums">{d.sub}</span>}
      </div>
    ))}
  </div>
)

// ---------- Main component ----------

const ReportAnalytics: React.FC = () => {
  return (
    <PageLayout>
    <div className="w-full min-h-[650px] flex flex-col gap-2 p-2 bg-slate-50 relative z-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-base font-bold text-gray-900 flex items-center gap-1">Reports &amp; Analytics</h1>
          <p className="text-[10px] text-gray-600">Comprehensive insights of recruitment pipeline and hiring performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-1 text-[10px] font-medium text-gray-800 border border-slate-300 bg-white rounded-lg px-2 py-1">
            <CalendarDays className="w-3 h-3" /> 01 Jun 2026 - 15 Jun 2026
          </button>
          <button className="flex items-center gap-1 text-[10px] font-medium text-gray-800 border border-slate-300 bg-white rounded-lg px-2 py-1">
            <SlidersHorizontal className="w-3 h-3" /> Filters
          </button>
          <button className="flex items-center gap-1 text-[10px] font-medium text-white bg-indigo-600 rounded-lg px-2 py-1">
            <Download className="w-3 h-3" /> Export Report
          </button>
        </div>
      </div>

      {/* Row: 5 stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0 lg:h-[13%]">
        {statCards.map((s, i) => <StatCardItem key={i} item={s} />)}
      </div>

      {/* Row: Source donut / Trend line / Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:h-[27%]">
        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Applications by Source</span>
          <div className="flex-1 flex items-center gap-2 min-h-0">
            <div className="w-1/2 h-full"><DonutChart data={sourceData} centerLabel="Total" centerValue={642} /></div>
            <Legend data={sourceData.map(s => ({ name: s.name, color: s.color, sub: s.percent }))} />
          </div>
        </Card>

        <Card className="h-full overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-900">Applications Trend</span>
            <span className="text-[9px] text-gray-600 border border-slate-300 rounded px-1">Daily</span>
          </div>
          <div className="flex-1 min-h-[140px] mt-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pyramid/Funnel Kept as is */}
      <Card className="h-full">
  <span className="text-[11px] font-semibold text-gray-900">
    Pipeline Conversion Funnel
  </span>

 <div className="mt-2 flex flex-1 gap-3 min-h-0">
  {/* Funnel */}
<div className="flex-1 flex flex-col items-center justify-center">
  {funnelStages.map((f, i) => (
    <div
      key={i}
      className="h-5 flex items-center justify-center text-[8px] font-semibold text-white"
      style={{
        width: f.width,
        backgroundColor: f.color,
        clipPath: "polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)", // <-- semicolon hataya
      }}
    >
    </div>
  ))}
</div>

  {/* Labels & Values */}
  <div className="flex-1 flex flex-col justify-center">
    {funnelStages.map((f, i) => (
      <div
        key={i}
        className="h-5 flex items-center justify-between text-[9px]"
      >
        <span className="font-medium text-gray-700 truncate">
          {f.label}
        </span>

        <span className="font-semibold text-gray-900 tabular-nums">
          {f.value}
        </span>
      </div>
    ))}
  </div>
</div>
</Card>
      </div>

      {/* Row: 5 mini metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0 lg:h-[13%]">
        {miniMetrics.map((m, i) => <MiniMetricItem key={i} item={m} />)}
      </div>

      {/* Row: 2 tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:h-[20%]">
        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Recruitment Summary by Department</span>
          <div className="flex-1 overflow-auto mt-1">
            <table className="w-full text-[9px] min-w-[520px]">
              <thead>
                <tr className="text-gray-600 text-left">
                  <th className="font-medium pb-1">Department</th>
                  <th className="font-medium pb-1">Openings</th>
                  <th className="font-medium pb-1">Applications</th>
                  <th className="font-medium pb-1">Shortlisted</th>
                  <th className="font-medium pb-1">Interviews</th>
                  <th className="font-medium pb-1">Offers</th>
                  <th className="font-medium pb-1">Hires</th>
                  <th className="font-medium pb-1">Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                {deptRows.map((r, i) => (
                  <tr key={i} className="text-gray-800 border-t border-slate-200">
                    <td className="py-1">{r.department}</td>
                    <td className="py-1">{r.openings}</td>
                    <td className="py-1">{r.applications}</td>
                    <td className="py-1">{r.shortlisted}</td>
                    <td className="py-1">{r.interviews}</td>
                    <td className="py-1">{r.offers}</td>
                    <td className="py-1">{r.hires}</td>
                    <td className="py-1">{r.timeToHire}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-gray-900 border-t border-slate-300">
                  <td className="py-1">{deptTotals.department}</td>
                  <td className="py-1">{deptTotals.openings}</td>
                  <td className="py-1">{deptTotals.applications}</td>
                  <td className="py-1">{deptTotals.shortlisted}</td>
                  <td className="py-1">{deptTotals.interviews}</td>
                  <td className="py-1">{deptTotals.offers}</td>
                  <td className="py-1">{deptTotals.hires}</td>
                  <td className="py-1">{deptTotals.timeToHire}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Job Openings Performance</span>
          <div className="flex-1 overflow-auto mt-1">
            <table className="w-full text-[9px] min-w-[460px]">
              <thead>
                <tr className="text-gray-600 text-left">
                  <th className="font-medium pb-1">Job Opening</th>
                  <th className="font-medium pb-1">Applications</th>
                  <th className="font-medium pb-1">Shortlisted</th>
                  <th className="font-medium pb-1">Interviews</th>
                  <th className="font-medium pb-1">Offers</th>
                  <th className="font-medium pb-1">Hires</th>
                  <th className="font-medium pb-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobRows.map((r, i) => (
                  <tr key={i} className="text-gray-800 border-t border-slate-200">
                    <td className="py-1 truncate max-w-[110px]">{r.title}</td>
                    <td className="py-1">{r.applications}</td>
                    <td className="py-1">{r.shortlisted}</td>
                    <td className="py-1">{r.interviews}</td>
                    <td className="py-1">{r.offers}</td>
                    <td className="py-1">{r.hires}</td>
                    <td className="py-1">
                      <span className="bg-emerald-100 text-emerald-700 text-[8px] font-medium px-1.5 py-0.5 rounded-full">{r.status}</span>
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold text-gray-900 border-t border-slate-300">
                  <td className="py-1">Total</td>
                  <td className="py-1">{jobTotals.applications}</td>
                  <td className="py-1">{jobTotals.shortlisted}</td>
                  <td className="py-1">{jobTotals.interviews}</td>
                  <td className="py-1">{jobTotals.offers}</td>
                  <td className="py-1">{jobTotals.hires}</td>
                  <td className="py-1">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Row: 4 bottom charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:h-[20%]">
        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Hiring Trend (Hires)</span>
          <div className="flex-1 min-h-[120px] mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="hires" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Offer Status</span>
          <div className="flex-1 flex items-center gap-2 min-h-0">
            <div className="w-1/2 h-full"><DonutChart data={offerStatus} centerLabel="Total" centerValue={22} /></div>
            <Legend data={offerStatus.map(o => ({ name: o.name, color: o.color, sub: `${o.value} (${((o.value / 22) * 100).toFixed(1)}%)` }))} />
          </div>
        </Card>

        <Card className="h-full">
          <span className="text-[11px] font-semibold text-gray-900">Candidate Gender Diversity</span>
          <div className="flex-1 flex items-center gap-2 min-h-0">
            <div className="w-1/2 h-full"><DonutChart data={genderData} centerLabel="Hires" centerValue={14} /></div>
            <Legend data={genderData.map(g => ({ name: g.name, color: g.color, sub: `${g.value} (${((g.value / 14) * 100).toFixed(1)}%)` }))} />
          </div>
        </Card>

        {/* Compact & Fixed Dimension New Hires by Dept */}
        <Card className="h-full max-w-full mx-auto w-full overflow-hidden">
          <span className="text-[11px] font-semibold text-gray-900">New Hires by Department</span>
          <div className="flex-1 min-h-[120px] mt-1 w-full px-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHires} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="department" tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#1e293b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="hires" fill="#818cf8" radius={[3, 3, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
    </PageLayout>
  )
}

export default ReportAnalytics