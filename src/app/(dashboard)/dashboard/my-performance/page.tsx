'use client'

import PageLayout from '@/components/ui/pageLayout'
import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ChevronRight,
  Info,
  Download,
  Pencil,
  Star,
  Calendar,
  Target,
  MessageSquare,
  ArrowUp,
  Minus,
  CheckCircle2,
  Award,
  Trophy,
  Users,
  RefreshCw,
  X,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts'

// ---------- Types ----------

interface StatCard {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  value: string
  valueSuffix?: string
  badge?: { text: string; tone: 'blue' | 'green' }
  helper?: string
  helperIcon?: boolean
}

interface CompetencyRow {
  id: string
  name: string
  rating: number
  delta: number
}

interface AchievementItem {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  date: string
}

interface TrendPoint {
  cycle: string
  rating: number
  current?: boolean
}

interface FeedbackSlice {
  id: string
  label: string
  value: number
  percent: string
  color: string
}

interface GoalSlice {
  id: string
  label: string
  value: number
  percent: string
  color: string
}

interface ListItem {
  id: string
  label: string
}

// ---------- Data ----------

const STATS: StatCard[] = [
  {
    id: 'rating',
    icon: Star,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    label: 'Overall Rating',
    value: '4.4',
    valueSuffix: '/ 5',
    helper: '0.4 vs last cycle',
    helperIcon: true,
  },
  {
    id: 'cycle',
    icon: Calendar,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Current Review Cycle',
    value: 'Apr 2024 – Mar 2025',
    badge: { text: 'In Progress', tone: 'blue' },
  },
  {
    id: 'goals',
    icon: Target,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    label: 'Goals Achieved',
    value: '4',
    valueSuffix: '/ 5',
    helper: '10% vs last cycle',
    helperIcon: true,
  },
  {
    id: 'feedback',
    icon: MessageSquare,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    label: 'Feedback Summary',
    value: '12',
    helper: '8 From Manager · 4 From Peers',
  },
]

const COMPETENCIES: CompetencyRow[] = [
  { id: 'c1', name: 'Goal Achievement', rating: 4.6, delta: 0.4 },
  { id: 'c2', name: 'Quality of Work', rating: 4.3, delta: 0.3 },
  { id: 'c3', name: 'Communication', rating: 4.2, delta: 0.2 },
  { id: 'c4', name: 'Teamwork', rating: 4.5, delta: 0.4 },
  { id: 'c5', name: 'Initiative & Ownership', rating: 4.3, delta: 0.2 },
  { id: 'c6', name: 'Problem Solving', rating: 4.1, delta: 0 },
]

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'a1',
    icon: Trophy,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    title: 'Exceeded Q4 Sales Target',
    description: 'Achieved 115% of Q4 sales target.',
    date: '15 Apr 2025',
  },
  {
    id: 'a2',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: 'Best Team Player Award',
    description: 'Recognized for outstanding collaboration.',
    date: '28 Feb 2025',
  },
]

const TREND: TrendPoint[] = [
  { cycle: "Apr'22–Mar'23", rating: 3.6 },
  { cycle: "Apr'23–Mar'24", rating: 3.8 },
  { cycle: "Oct'23–Sep'24", rating: 4.0 },
  { cycle: "Apr'24–Mar'25", rating: 4.4, current: true },
]

const FEEDBACK_SLICES: FeedbackSlice[] = [
  { id: 'manager', label: 'From Manager', value: 8, percent: '66.7%', color: '#2563eb' },
  { id: 'peers', label: 'From Peers', value: 4, percent: '33.3%', color: '#22c55e' },
  { id: 'reports', label: 'From Direct Reports', value: 0, percent: '0%', color: '#a855f7' },
]

const GOAL_SLICES: GoalSlice[] = [
  { id: 'achieved', label: 'Achieved', value: 4, percent: '80%', color: '#22c55e' },
  { id: 'progress', label: 'In Progress', value: 1, percent: '20%', color: '#2563eb' },
  { id: 'notstarted', label: 'Not Started', value: 0, percent: '0%', color: '#e2e8f0' },
]

const STRENGTHS: ListItem[] = [
  { id: 's1', label: 'Goal Achievement' },
  { id: 's2', label: 'Teamwork' },
  { id: 's3', label: 'Customer Focus' },
]

const IMPROVEMENTS: ListItem[] = [
  { id: 'i1', label: 'Problem Solving' },
  { id: 'i2', label: 'Time Management' },
  { id: 'i3', label: 'Communication (Written)' },
]

const TABS: string[] = [
  'Overview',
  'Goals',
  'Reviews',
  '360° Feedback',
  'Achievements',
  'Development Plan',
  'History',
]

const DOWNLOAD_REPORT_URL = 'https://ensis.in/pdf/e-broucher.pdf'

// ---------- Small building blocks ----------

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`rounded-lg border border-slate-300 bg-white p-2 flex flex-col min-h-0 ${className}`}
  >
    {children}
  </div>
)

const SectionTitle: React.FC<{ icon?: React.ElementType; children: React.ReactNode }> = ({
  icon: Icon,
  children,
}) => (
  <div className="flex items-center gap-1 mb-2 shrink-0">
    {Icon ? <Icon className="h-3.5 w-3.5 text-indigo-500" /> : null}
    <h2 className="text-[13px] font-semibold ">{children}</h2>
  </div>
)

// Placeholder action link used at the bottom of cards (wire up real routes later)
const CardLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <a
    href="#"
    className="mt-1 flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 hover:underline shrink-0"
  >
    {children}
    <ChevronRight className="h-2.5 w-2.5" />
  </a>
)

// ---------- Stat card ----------

const StatCardView: React.FC<{ stat: StatCard }> = ({ stat }) => {
  const Icon = stat.icon
  return (
    <div className="rounded-lg border border-slate-300 bg-white p-2 min-h-0 flex flex-row items-center justify-start gap-2">
      {/* Left Icon */}
      <div
        className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${stat.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
      </div>

      {/* Right Content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-medium ">{stat.label}</span>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold leading-none truncate ">
            {stat.value}
          </span>
          {stat.valueSuffix && (
            <span className="text-[11px] font-medium ">{stat.valueSuffix}</span>
          )}
        </div>

        {stat.badge && (
          <span
            className={`w-fit rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
              stat.badge.tone === 'blue'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {stat.badge.text}
          </span>
        )}

        {stat.helper && (
          <span className="flex items-center gap-0.5 truncate text-[10px] font-medium ">
            {stat.helperIcon && (
              <ArrowUp className="h-2.5 w-2.5 shrink-0 text-emerald-500" />
            )}
            {stat.helper}
          </span>
        )}
      </div>
    </div>
  )
}

// ---------- Donut helper ----------

interface MiniDonutProps {
  data: { id: string; value: number; color: string }[]
  centerValue: string
  centerLabel: string
  size?: string
  valueClassName?: string
  labelClassName?: string
}

const MiniDonut: React.FC<MiniDonutProps> = ({
  data,
  centerValue,
  centerLabel,
  size = 'h-20 w-20',
  valueClassName = 'text-sm font-bold  leading-none',
  labelClassName = 'text-[8px] font-medium  leading-none mt-0.5',
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const chartData = total > 0 ? data : [{ id: 'empty', value: 1, color: '#e2e8f0' }]
  return (
    <div className={`relative shrink-0 ${size}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="id"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={valueClassName}>{centerValue}</span>
        <span className={labelClassName}>{centerLabel}</span>
      </div>
    </div>
  )
}

// ---------- Start Self Review modal ----------

const StartSelfReviewModal: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
  open,
  onOpenChange,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Dialog.Title className="text-[14px] font-bold ">
              Start Self Review
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-[11px] font-medium ">
              This is a placeholder for the self review flow. Hook this up to your actual review
              form when it&apos;s ready.
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="shrink-0 rounded-md p-1  hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close asChild>
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-[11px] font-semibold  hover:bg-slate-50"
            >
              Cancel
            </button>
          </Dialog.Close>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

// ---------- Main component ----------

const MyPerformance: React.FC = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  return (
    <PageLayout>
     <div className="flex h-[calc(100vh-48px)] min-h-[650px] flex-col gap-2 overflow-hidden bg-slate-50 text-slate-900">
        {/* Breadcrumb + Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 shrink-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[11px] font-medium ">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="">My Performance</span>
            </div>
            <div className="flex items-center gap-1">
              <h1 className="text-lg font-bold  leading-none">My Performance</h1>
              <Info className="h-3.5 w-3.5 " />
            </div>
            <p className="text-[11px] font-medium ">
              Track your performance, achievements and growth.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={DOWNLOAD_REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Download Report
            </a>
            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Start Self Review
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 shrink-0">
          {STATS.map((stat) => (
            <StatCardView key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-300 border-t border-slate-300 pt-2 sm:border-t-0 sm:pt-0 shrink-0 overflow-x-auto">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              type="button"
              className={`pb-2 text-[12px] font-semibold whitespace-nowrap ${
                idx === 0
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : ' hover:'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:flex-1 lg:min-h-0">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-2 min-h-0">
            {/* Performance Snapshot */}
            <Card className="min-h-[300px] lg:flex-[1.3] lg:min-h-0">
              <SectionTitle>Performance Snapshot</SectionTitle>
              <div className="flex flex-col sm:flex-row gap-3 flex-1 min-h-0">
                <div className="flex flex-col items-center justify-center gap-1 w-full sm:w-40 shrink-0">
                  <MiniDonut
                    data={[{ id: 'r', value: 4.4, color: '#22c55e' }, { id: 'rest', value: 0.6, color: '#e2e8f0' }]}
                    centerValue="4.4"
                    centerLabel="/ 5"
                    size="h-28 w-28"
                    valueClassName="text-2xl font-bold  leading-none"
                    labelClassName="text-[10px] font-medium  leading-none mt-0.5"
                  />
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <Star className="h-3 w-3 text-slate-300" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Excellent Performance
                  </span>
                  <p className="text-[10px] font-medium  text-center leading-tight">
                    You are performing above expectations. Keep it up!
                  </p>
                </div>
                <div className="flex-1 flex flex-col min-h-0 border-1 border-l pl-2">
                  <div className="grid grid-cols-[1fr_auto_2fr_auto] gap-x-3 text-[10px] font-semibold  pb-1">
                    <span>Competency</span>
                    <span>Rating</span>
                    <span></span>
                    <span>vs Last</span>
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-h-0">
                    {COMPETENCIES.map((c) => (
                      <div
                        key={c.id}
                        className="grid grid-cols-[1fr_auto_2fr_auto] gap-x-3 items-center"
                      >
                        <span className="text-[11px] font-semibold  truncate">
                          {c.name}
                        </span>
                        <span className="text-[11px] font-semibold ">
                          {c.rating.toFixed(1)}
                        </span>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${(c.rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 justify-end">
                          {c.delta > 0 ? (
                            <ArrowUp className="h-2.5 w-2.5" />
                          ) : (
                            <Minus className="h-2.5 w-2.5 " />
                          )}
                          {c.delta > 0 ? `${c.delta.toFixed(1)}` : '0.0'}
                        </span>
                      </div>
                    ))}
                  </div>
              <button
                type="button"
                className="mt-2 flex items-center justify-center gap-1 rounded-md border border-slate-300 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-slate-50 shrink-0"
              >
                View Detailed Competency Breakdown
                <ChevronRight className="h-3 w-3" />
              </button>
                </div>
              </div>
            </Card>

            {/* Goals + Achievements */}
            <div className="lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-0">
            <Card>
  <SectionTitle>Goals Progress</SectionTitle>

  <div className="flex flex-1 items-center gap-4 min-h-0 w-full">
    <div className="flex items-center justify-center flex-1">
      <MiniDonut
        data={GOAL_SLICES.map((g) => ({
          id: g.id,
          value: g.value,
          color: g.color,
        }))}
        centerValue="5"
        centerLabel="Total Goals"
      />
    </div>

    <div className="flex flex-1 flex-col justify-center gap-2 min-w-0">
      {GOAL_SLICES.map((g) => (
        <div
          key={g.id}
          className="flex items-center justify-between gap-2 text-[10px] font-medium "
        >
          <div className="flex items-center gap-1 min-w-0">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: g.color }}
            />
            <span className="truncate">{g.label}</span>
          </div>

          <span className=" shrink-0">
            {g.value} ({g.percent})
          </span>
        </div>
      ))}
    </div>
  </div>

  <CardLink>View All Goals</CardLink>
</Card>

              <Card>
                <SectionTitle icon={Award}>Recent Achievements</SectionTitle>
                <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
                  {ACHIEVEMENTS.map((a) => {
                    const Icon = a.icon
                    return (
                      <div key={a.id} className="flex items-start gap-2">
                        <div
                          className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${a.iconBg}`}
                        >
                          <Icon className={`h-3 w-3 ${a.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold  truncate">
                              {a.title}
                            </span>
                            <span className="text-[9px] font-medium  shrink-0">
                              {a.date}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium  truncate">
                            {a.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <CardLink>View All Achievements</CardLink>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2 min-h-0">
            {/* Trend */}
            <Card className="min-h-[240px] lg:flex-1 lg:min-h-0">
              <div className="flex items-center justify-between shrink-0 mb-1">
                <SectionTitle>Performance Trend</SectionTitle>
                <div className="flex items-center gap-1 text-[10px] font-semibold  border border-slate-300 rounded-md px-1.5 py-0.5">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Last 4 Cycles
                </div>
              </div>
        <div className="min-h-[200px] lg:flex-1 lg:min-h-0">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={TREND}
      margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
    >
      <defs>
        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid
        vertical={false}
        stroke="#e5e7eb"
        strokeDasharray="0"
      />

      <XAxis
        dataKey="cycle"
        tick={{ fontSize: 9, fill: "#64748b" }}
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        domain={[1, 5]}
        tick={{ fontSize: 9, fill: "#64748b" }}
        axisLine={false}
        tickLine={false}
      />

      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          fontSize: 12,
        }}
      />

      {/* Gradient Fade */}
      <Area
        type="monotone"
        dataKey="rating"
        stroke="none"
        fill="url(#trendGradient)"
      />

      {/* Line */}
      <Line
        type="monotone"
        dataKey="rating"
        stroke="#2563eb"
        strokeWidth={2.5}
        dot={{
          r: 4,
          fill: "#2563eb",
          stroke: "#fff",
          strokeWidth: 2,
        }}
        activeDot={{
          r: 5,
          fill: "#2563eb",
          stroke: "#fff",
          strokeWidth: 2,
        }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
              <CardLink>View Trend Details</CardLink>
            </Card>

            {/* Feedback summary */}
            <Card className="min-h-[150px] lg:flex-1 lg:min-h-0">
              <SectionTitle>Feedback Summary</SectionTitle>
              <div className="flex items-center gap-3 flex-1 min-h-0">
                <MiniDonut
                  data={FEEDBACK_SLICES.map((f) => ({ id: f.id, value: f.value, color: f.color }))}
                  centerValue="12"
                  centerLabel="Total"
                />
           <div className="flex flex-col gap-1 w-full">
  {FEEDBACK_SLICES.map((f) => (
    <div
      key={f.id}
      className="flex w-full items-center justify-between text-[10px] font-medium"
    >
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: f.color }}
        />
        <span className="truncate">{f.label}</span>
      </div>

      <span className="shrink-0">
        {f.value} ({f.percent})
      </span>
    </div>
  ))}
</div>
              </div>
              <CardLink>View All Feedback</CardLink>
            </Card>

            {/* Strengths / Improve */}
            <Card className="min-h-[150px] lg:flex-1 lg:min-h-0">
              <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                <div className="flex flex-col min-h-0">
                  <span className="text-[11px] font-semibold  mb-1 shrink-0">
                    Top Strengths
                  </span>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {STRENGTHS.map((s) => (
                      <div key={s.id} className="flex items-center gap-1 text-[10px] font-medium ">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col min-h-0">
                  <span className="text-[11px] font-semibold  mb-1 shrink-0">
                    Areas to Improve
                  </span>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {IMPROVEMENTS.map((i) => (
                      <div key={i.id} className="flex items-center gap-1 text-[10px] font-medium ">
                        <ArrowUp className="h-3 w-3 text-orange-500 shrink-0" />
                        <span className="truncate">{i.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <CardLink>View Development Plan</CardLink>
            </Card>
          </div>
        </div>

        {/* Take Charge of Your Growth - full width banner below both columns */}
        <Card className="w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 bg-blue-50/60 border-blue-200">
          <div className="flex items-center gap-2 min-w-0">
            <Pencil className="h-4 w-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold  truncate">
                Take Charge of Your Growth
              </p>
              <p className="text-[10px] font-medium  truncate">
                Complete your self review to help your manager understand your perspective better.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="flex w-full sm:w-auto items-center justify-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 shrink-0 mt-1 sm:mt-0"
          >
            <Pencil className="h-3.5 w-3.5" />
            Start Self Review
          </button>
        </Card>
      </div>

      <StartSelfReviewModal open={isReviewOpen} onOpenChange={setIsReviewOpen} />
    </PageLayout>
  )
}

export default MyPerformance