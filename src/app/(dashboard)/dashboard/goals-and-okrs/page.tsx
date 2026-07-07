"use client"

import React, { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import * as Dialog from "@radix-ui/react-dialog"
import {
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Plus,
  Rocket,
  Users,
  BarChart3,
  Calendar,
  MoreVertical,
  ArrowRight,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// ---------- Types ----------

type OkrStatus = "On Track" | "At Risk" | "Behind"

interface SummaryStat {
  id: string
  label: string
  value: number
  sub: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

interface KeyResult {
  id: string
  title: string
  progress: number
  displayCurrent: string
  displayTarget: string
}

interface Objective {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  dateRange: string
  status: OkrStatus
  overallProgress: number
  keyResults: KeyResult[]
}

interface DonutSlice {
  name: OkrStatus
  value: number
  color: string
}

interface AlignmentNode {
  id: string
  title: string
  highlighted?: boolean
}

interface CheckIn {
  id: string
  title: string
  subtitle: string
  date: string
  time: string
  avatarBg: string
}

// ---------- Static config ----------

const statusStyles: Record<OkrStatus, { text: string; bg: string; border: string }> = {
  "On Track": { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300" },
  "At Risk": { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300" },
  Behind: { text: "text-red-600", bg: "bg-red-50", border: "border-red-300" },
}

const progressBarColor: Record<OkrStatus, string> = {
  "On Track": "bg-emerald-500",
  "At Risk": "bg-amber-500",
  Behind: "bg-red-500",
}

const summaryStats: SummaryStat[] = [
  { id: "total", label: "Total Goals", value: 5, sub: "All Active Goals", icon: Target, iconColor: "text-violet-600", iconBg: "bg-violet-100" },
  { id: "ontrack", label: "On Track", value: 3, sub: "60% of Goals", icon: CheckCircle2, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
  { id: "atrisk", label: "At Risk", value: 1, sub: "20% of Goals", icon: Clock, iconColor: "text-amber-600", iconBg: "bg-amber-100" },
  { id: "behind", label: "Behind", value: 1, sub: "20% of Goals", icon: AlertCircle, iconColor: "text-red-600", iconBg: "bg-red-100" },
  { id: "completed", label: "Completed", value: 2, sub: "This Cycle", icon: Flag, iconColor: "text-blue-600", iconBg: "bg-blue-100" },
]

const objectives: Objective[] = [
  {
    id: "obj-1",
    icon: Rocket,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Increase New Customer Acquisition",
    dateRange: "01 Apr - 30 Jun 2024",
    status: "On Track",
    overallProgress: 72,
    keyResults: [
      { id: "kr-1-1", title: "Acquire 50 new enterprise customers", progress: 72, displayCurrent: "36", displayTarget: "50" },
      { id: "kr-1-2", title: "Generate ₹1.5 Cr revenue", progress: 72, displayCurrent: "₹1.08 Cr", displayTarget: "₹1.5 Cr" },
      { id: "kr-1-3", title: "Improve lead conversion rate", progress: 80, displayCurrent: "16%", displayTarget: "20%" },
    ],
  },
  {
    id: "obj-2",
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Enhance Customer Satisfaction & Retention",
    dateRange: "01 Apr - 30 Jun 2024",
    status: "At Risk",
    overallProgress: 48,
    keyResults: [
      { id: "kr-2-1", title: "Achieve NPS score of 60+", progress: 70, displayCurrent: "42", displayTarget: "60" },
      { id: "kr-2-2", title: "Reduce customer complaints", progress: 70, displayCurrent: "14%", displayTarget: "20%" },
    ],
  },
  {
    id: "obj-3",
    icon: BarChart3,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Improve Sales Team Productivity",
    dateRange: "01 Apr - 30 Jun 2024",
    status: "Behind",
    overallProgress: 28,
    keyResults: [
      { id: "kr-3-1", title: "Increase average deal size", progress: 40, displayCurrent: "6%", displayTarget: "15%" },
      { id: "kr-3-2", title: "Reduce sales cycle time", progress: 60, displayCurrent: "6%", displayTarget: "10%" },
    ],
  },
]

const donutData: DonutSlice[] = [
  { name: "On Track", value: 1, color: "#10b981" },
  { name: "At Risk", value: 1, color: "#f59e0b" },
  { name: "Behind", value: 1, color: "#ef4444" },
]

const alignmentChildren: AlignmentNode[] = [
  { id: "a-1", title: "Customer Acquisition", highlighted: true },
  { id: "a-2", title: "Customer Retention" },
  { id: "a-3", title: "Sales Efficiency" },
]

const checkIns: CheckIn[] = [
  { id: "c-1", title: "Weekly Check-in", subtitle: "Increase New Customer Acquisition", date: "24 May 2024", time: "10:00 AM", avatarBg: "bg-rose-200" },
  { id: "c-2", title: "Bi-weekly Check-in", subtitle: "Enhance Customer Satisfaction & Retention", date: "27 May 2024", time: "11:00 AM", avatarBg: "bg-blue-200" },
  { id: "c-3", title: "Monthly Review", subtitle: "Improve Sales Team Productivity", date: "31 May 2024", time: "02:00 PM", avatarBg: "bg-amber-200" },
]

const tabs = ["My OKRs", "My Goals", "Team OKRs", "Team Goals", "Aligned OKRs", "Archived"] as const
type TabName = (typeof tabs)[number]

// ---------- Zod schemas ----------

const goalSchema = z.object({
  title: z.string().min(3, "Title kam se kam 3 characters ka ho"),
  description: z.string().optional(),
  category: z.string().min(1, "Category select karo"),
  dueDate: z.string().min(1, "Due date daalo"),
  priority: z.string().min(1, "Priority select karo"),
})
type GoalFormValues = z.infer<typeof goalSchema>

// ---------- Modal shell ----------

const FormModal: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}> = ({ open, onOpenChange, title, children }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-300 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button type="button" className=" hover:">
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

// ---------- Create Goal form ----------

const CreateGoalForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({ resolver: zodResolver(goalSchema) })

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await api.post('/pms/goals-and-okrs', { ...data, type: 'goal' });
      reset()
      onDone()
    } catch (err) {
      console.error("Failed to create goal", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <label className="mb-1 block text-xs font-medium">Goal Title</label>
        <input {...register("title")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" placeholder="e.g. Expand into new markets" />
        {errors.title && <p className="mt-0.5 text-[10px] text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Description</label>
        <textarea {...register("description")} rows={2} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" placeholder="Optional details" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium">Category</label>
          <select {...register("category")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs">
            <option value="">Select</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="product">Product</option>
            <option value="support">Support</option>
          </select>
          {errors.category && <p className="mt-0.5 text-[10px] text-red-600">{errors.category.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Priority</label>
          <select {...register("priority")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs">
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="mt-0.5 text-[10px] text-red-600">{errors.priority.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Due Date</label>
        <input type="date" {...register("dueDate")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" />
        {errors.dueDate && <p className="mt-0.5 text-[10px] text-red-600">{errors.dueDate.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="mt-1 rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-70">
        {isSubmitting ? 'Saving...' : 'Save Goal'}
      </button>
    </form>
  )
}

// ---------- Create OKR form ----------
import { useFieldArray } from "react-hook-form" // add this import along with useForm

// ---------- Zod schema (updated) ----------

const okrSchema = z.object({
  objective: z.string().min(3, "Objective title daalo"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date daalo"),
  endDate: z.string().min(1, "End date daalo"),
  keyResults: z
    .array(
      z.object({
        title: z.string().min(3, "Key result kam se kam 3 characters ka ho"),
        targetValue: z.string().min(1, "Target value daalo"),
      })
    )
    .min(1, "Kam se kam ek key result daalo"),
})
type OkrFormValues = z.infer<typeof okrSchema>

// ---------- Create OKR form (updated) ----------

const CreateOkrForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OkrFormValues>({
    resolver: zodResolver(okrSchema),
    defaultValues: {
      keyResults: [{ title: "", targetValue: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "keyResults",
  })

  const onSubmit = async (data: OkrFormValues) => {
    try {
      await api.post('/pms/goals-and-okrs', { ...data, type: 'okr' });
      reset({ keyResults: [{ title: "", targetValue: "" }] })
      onDone()
    } catch (err) {
      console.error("Failed to create okr", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div>
        <label className="mb-1 block text-xs font-medium">Objective</label>
        <input {...register("objective")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" placeholder="e.g. Increase customer retention" />
        {errors.objective && <p className="mt-0.5 text-[10px] text-red-600">{errors.objective.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Description</label>
        <textarea {...register("description")} rows={2} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" placeholder="Optional details" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium">Start Date</label>
          <input type="date" {...register("startDate")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" />
          {errors.startDate && <p className="mt-0.5 text-[10px] text-red-600">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">End Date</label>
          <input type="date" {...register("endDate")} className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs" />
          {errors.endDate && <p className="mt-0.5 text-[10px] text-red-600">{errors.endDate.message}</p>}
        </div>
      </div>

      {/* Dynamic Key Results */}
      <div className="flex flex-col gap-2">
        <label className="block text-xs font-medium">Key Results</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-1.5 rounded-md border border-slate-200 p-1.5">
            <div className="flex-1">
              <input
                {...register(`keyResults.${index}.title` as const)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                placeholder="e.g. Achieve NPS score of 60+"
              />
              {errors.keyResults?.[index]?.title && (
                <p className="mt-0.5 text-[10px] text-red-600">{errors.keyResults[index]?.title?.message}</p>
              )}
            </div>
            <div className="w-24 shrink-0">
              <input
                {...register(`keyResults.${index}.targetValue` as const)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                placeholder="Target"
              />
              {errors.keyResults?.[index]?.targetValue && (
                <p className="mt-0.5 text-[10px] text-red-600">{errors.keyResults[index]?.targetValue?.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="mt-1 shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ title: "", targetValue: "" })}
          className="flex items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Key Result
        </button>
      </div>

      <button type="submit" disabled={isSubmitting} className="mt-1 rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-70">
        {isSubmitting ? 'Saving...' : 'Save OKR'}
      </button>
    </form>
  )
}

// ---------- Small building blocks ----------

const StatCard: React.FC<{ stat: SummaryStat }> = ({ stat }) => {
  const Icon = stat.icon
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 min-w-[150px] flex-1 sm:min-w-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs  truncate">{stat.label}</p>
        <p className="text-lg font-bold leading-tight">{stat.value}</p>
        <p className="text-[11px]  truncate">{stat.sub}</p>
      </div>
    </div>
  )
}

const KeyResultRow: React.FC<{ kr: KeyResult; status: OkrStatus }> = ({
  kr,
  status,
}) => (
  <div className="flex w-full items-center gap-3 py-2">
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-400 text-[8px] ">
      /
    </span>

    {/* Title */}
<p className="flex-1 min-w-0 truncate text-[11px] ">
  {kr.title}
</p>

<div className="w-28 shrink-0 h-1.5 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
  <div
    className={`h-full rounded-full ${progressBarColor[status]}`}
    style={{ width: `${kr.progress}%` }}
  />
</div>

<p className="shrink-0 whitespace-nowrap text-right text-[10px] ">
  {kr.displayCurrent} / {kr.displayTarget}
  <span className=""> ({kr.progress}%)</span>
</p>
  </div>
);

const ObjectiveCard: React.FC<{ objective: Objective }> = ({ objective }) => {
  const Icon = objective.icon
  const style = statusStyles[objective.status]
  return (
    <div className="rounded-lg border border-slate-300 bg-white p-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${objective.iconBg}`}>
            <Icon className={`h-4 w-4 ${objective.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wide text-blue-600">OBJECTIVE</p>
            <p className="truncate text-sm font-semibold">{objective.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 justify-between w-full flex-1">
              <span className="flex items-center gap-1 text-[11px]">
                <Calendar className="h-3 w-3" />
                {objective.dateRange}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${style.text} ${style.bg} ${style.border}`}>
                {objective.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:self-start">
          <div className="text-right">
            <p className="text-lg font-bold leading-none">{objective.overallProgress}%</p>
            <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full border border-slate-300 bg-slate-200 sm:w-24">
              <div className={`h-full rounded-full ${progressBarColor[objective.status]}`} style={{ width: `${objective.overallProgress}%` }} />
            </div>
            <p className="mt-0.5 whitespace-nowrap text-[10px] ">Overall Progress</p>
          </div>
          <button type="button" className=" hover:">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

     <div className="mt-1 divide-y divide-slate-200 w-full">
  {objective.keyResults.map((kr) => (
    <KeyResultRow
      key={kr.id}
      kr={kr}
      status={objective.status}
    />
  ))}
</div>
    </div>
  )
}

const DonutLegendRow: React.FC<{ slice: DonutSlice; total: number }> = ({ slice, total }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }} />
      {slice.name}
    </span>
    <span className="font-medium">
      {slice.value} ({Math.round((slice.value / total) * 100)}%)
    </span>
  </div>
)

// ---------- Main component ----------

const GoalsAndOkrs: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TabName>("My OKRs")
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [okrModalOpen, setOkrModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pms/goals-and-okrs');
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey(k => k + 1);

  const currentSummaryStats = data?.summaryStats || summaryStats;
  const currentObjectives = data?.objectives || objectives;
  const currentDonutData = data?.donutData || donutData;
  const currentAlignmentChildren = data?.alignmentChildren || alignmentChildren;
  const currentCheckIns = data?.checkIns || checkIns;
  const totalDonut = currentDonutData.reduce((sum: number, d: any) => sum + d.value, 0)

  // Tab config -- ab sabkuch defined hone ke baad
  const TAB_CONFIG: Record<TabName, { types: string[]; emptyLabel: string; addLabel: string; onAdd: 'goal' | 'okr' | null }> = {
    "My OKRs": { types: ["okr"], emptyLabel: "OKRs", addLabel: "Add OKR", onAdd: "okr" },
    "My Goals": { types: ["goal"], emptyLabel: "Goals", addLabel: "Add Goal", onAdd: "goal" },
    "Team OKRs": { types: ["okr"], emptyLabel: "Team OKRs", addLabel: "Add OKR", onAdd: "okr" },
    "Team Goals": { types: ["goal"], emptyLabel: "Team Goals", addLabel: "Add Goal", onAdd: "goal" },
    "Aligned OKRs": { types: ["okr"], emptyLabel: "Aligned OKRs", addLabel: "Add OKR", onAdd: "okr" },
    "Archived": { types: ["goal", "okr"], emptyLabel: "Archived items", addLabel: "", onAdd: null },
  }
  const activeConfig = TAB_CONFIG[activeTab]
  const filteredItems = currentObjectives.filter((o: any) =>
    activeConfig.types.includes(o.type || "okr")
  )

  return (
    
  <div className="flex h-[calc(100vh-48px)] min-h-[650px] flex-col gap-2 overflow-hidden bg-slate-50 p-2 text-slate-900">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs ">
        <span>Dashboard</span>
        <span>›</span>
        <span className="font-medium ">Goals & OKRs</span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
      ) : (
      <>
        {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Goals & OKRs</h1>
          <p className="text-xs ">Set goals, track progress and achieve excellence.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGoalModalOpen(true)}
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 sm:flex-none"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Goal
          </button>
          <button
            type="button"
            onClick={() => setOkrModalOpen(true)}
            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 sm:flex-none"
          >
            <Flag className="h-3.5 w-3.5" />
            Create OKR
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {currentSummaryStats.map((stat: any) => (
          <StatCard key={stat.id} stat={{
            ...stat,
            icon: stat.icon === "Target" ? Target : stat.icon === "CheckCircle2" ? CheckCircle2 : stat.icon === "Clock" ? Clock : stat.icon === "AlertCircle" ? AlertCircle : Flag
          }} />
        ))}
      </div>

      {/* Tabs + filters */}
      <div className="flex flex-col gap-2 border-b-2 border-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 pb-2 text-sm font-medium ${
                activeTab === tab ? "text-blue-600" : " hover:"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <button className="flex flex-1 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs sm:flex-none">
            <Calendar className="h-3.5 w-3.5  shrink-0" />
            <span className="truncate">Q2 2024 (Apr - Jun)</span>
            <ChevronDown className="h-3.5 w-3.5  shrink-0" />
          </button>
          <button className="flex flex-1 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs sm:flex-none">
            All Status
            <ChevronDown className="h-3.5 w-3.5  shrink-0" />
          </button>
        </div>
      </div>

 {/* Main content */}
<div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[1fr_28%]">
  {/* Left column */}
  <div className="flex min-h-0 flex-col gap-2 lg:overflow-hidden">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold">
        {activeTab} ({filteredItems.length})
      </p>
      <button className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs">
        Sort by: Priority
        <ChevronDown className="h-3.5 w-3.5 " />
      </button>
    </div>

    {filteredItems.length > 0 ? (
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-2 pr-1">
            {filteredItems.map((item: any) => (
              <ObjectiveCard
                key={item.id}
                objective={{
                  ...item,
                  icon: item.icon === "Rocket" ? Rocket
                    : item.icon === "Users" ? Users
                    : item.icon === "BarChart3" ? BarChart3
                    : item.icon === "CheckCircle2" ? CheckCircle2
                    : Target,
                }}
              />
            ))}
          </div>
        </div>

        {activeConfig.onAdd && (
          <button
            type="button"
            onClick={() => activeConfig.onAdd === "goal" ? setGoalModalOpen(true) : setOkrModalOpen(true)}
            className="mt-2 shrink-0 flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-400 bg-white py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {activeConfig.addLabel}
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs ">
        No data yet in &quot;{activeTab}&quot;
      </div>
    )}

    <div className="flex flex-col items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Keep Achieving!</p>
          <p className="text-xs ">
            You are performing better than 72% of employees in your department.
          </p>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-1 rounded-md border border-blue-300 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 sm:w-auto">
        <BarChart3 className="h-3.5 w-3.5" />
        View Insights
      </button>
    </div>
  </div>
        

        {/* Right column */}
        <div className="flex min-h-0 flex-col gap-2 lg:overflow-y-auto">
          {/* Progress summary */}
          <div className="rounded-lg border border-slate-300 bg-white p-2">
            <p className="mb-1 text-sm font-semibold">OKR Progress Summary</p>
            <div className="flex items-center gap-2">
              <div className="relative aspect-square w-[28%] max-w-[96px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={currentDonutData} dataKey="value" innerRadius="60%" outerRadius="95%" startAngle={90} endAngle={-270} stroke="none">
                      {currentDonutData.map((slice: any) => (
                        <Cell key={slice.name} fill={slice.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-base font-bold leading-none">{totalDonut}</p>
                  <p className="text-[10px] ">OKRs</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                {currentDonutData.map((slice: any) => (
                  <DonutLegendRow key={slice.name} slice={slice} total={totalDonut} />
                ))}
              </div>
            </div>
          </div>

          {/* Goal alignment */}
          <div className="rounded-lg border border-slate-300 bg-white p-2">
            <p className="mb-2 text-sm font-semibold">Goal Alignment</p>
            <div className="flex justify-center">
              <span className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-center text-[10px] font-medium text-blue-700">
                Company Objective — Grow Revenue 25%
              </span>
            </div>
            <div className="mx-auto h-3 w-px bg-slate-400" />
            <div className="grid grid-cols-3 gap-1">
              {currentAlignmentChildren.map((node: any) => (
                <div key={node.id} className="flex flex-col items-center gap-1">
                  <div className="h-3 w-px bg-slate-400" />
                  <span
                    className={`w-full truncate rounded-md px-1 py-1 text-center text-[9px] font-medium ${
                      node.highlighted ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 "
                    }`}
                  >
                    {node.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming check-ins */}
          <div className="flex-1 rounded-lg border border-slate-300 bg-white p-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold">Upcoming Check-ins</p>
              <button className="text-xs font-medium text-blue-600">View Calendar</button>
            </div>
            <div className="flex flex-col divide-y divide-slate-200">
              {currentCheckIns.map((c: any) => (
                <div key={c.id} className="flex items-center gap-2 py-1.5">
                  <span className={`h-7 w-7 shrink-0 rounded-full ${c.avatarBg}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{c.title}</p>
                    <p className="truncate text-[11px] ">{c.subtitle}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="flex items-center gap-1 whitespace-nowrap text-[11px] ">
                      <Calendar className="h-3 w-3" />
                      {c.date}
                    </p>
                    <p className="text-[10px] ">{c.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600">
              View All Check-ins
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Modals */}
      <FormModal open={goalModalOpen} onOpenChange={setGoalModalOpen} title="Create Goal">
        <CreateGoalForm onDone={() => { setGoalModalOpen(false); triggerRefresh(); }} />
      </FormModal>
      <FormModal open={okrModalOpen} onOpenChange={setOkrModalOpen} title="Create OKR">
        <CreateOkrForm onDone={() => { setOkrModalOpen(false); triggerRefresh(); }} />
      </FormModal>
    </div>
  )
}

export default GoalsAndOkrs