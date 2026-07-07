'use client'

import React, { useMemo, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import toast, { Toaster } from 'react-hot-toast'
import { parse, isWithinInterval } from 'date-fns'
import {
  UserPlus,
  Download,
  Mail,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Columns3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock,
  Hourglass,
  XCircle,
  Circle,
  FileUp,
  Send,
  ListChecks,
  X,
} from 'lucide-react'
import PageLayout from '@/components/ui/pageLayout'

// ---------- Types ----------

type OnboardingStatus = 'In Progress' | 'Completed' | 'Pending Docs' | 'On Hold'
type TabKey = 'all' | 'inProgress' | 'pendingDocs' | 'completed' | 'onHold'
type StepStatus = 'completed' | 'active' | 'pending'

interface Candidate {
  id: string
  name: string
  email: string
  initials: string
  avatarBg: string
  avatarText: string
  jobTitle: string
  jobId: string
  department: string
  joinDateLabel: string
  joinDateISO: string
  joinNote: string
  joinNoteColor: string
  progressCompleted: number
  progressTotal: number
  status: OnboardingStatus
  ownerName: string
  ownerRole: string
}

interface StatCardData {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  cardBg: string
  cardBorder: string
  value: string
  label: string
  helper?: string
  helperColor?: string
}

interface OnboardingStepData {
  id: string
  order: number
  title: string
  description: string
  status: StepStatus
}

interface QuickActionData {
  id: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
}

interface TabDef {
  key: TabKey
  label: string
}

// ---------- Data ----------

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Ananya Verma',
    email: 'ananya.verma@email.com',
    initials: 'AV',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-700',
    jobTitle: 'Digital Marketing Executive',
    jobId: 'JOB-2026-048',
    department: 'Marketing',
    joinDateLabel: '15 Jun 2026',
    joinDateISO: '2026-06-15',
    joinNote: '3 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 8,
    progressTotal: 10,
    status: 'In Progress',
    ownerName: 'Rishav Sharma',
    ownerRole: 'Head of Marketing',
  },
  {
    id: 'c2',
    name: 'Rohit Singh',
    email: 'rohit.singh@email.com',
    initials: 'RS',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
    jobTitle: 'Software Developer',
    jobId: 'JOB-2026-049',
    department: 'IT Department',
    joinDateLabel: '13 Jun 2026',
    joinDateISO: '2026-06-13',
    joinNote: 'Joined',
    joinNoteColor: 'text-emerald-600',
    progressCompleted: 10,
    progressTotal: 10,
    status: 'Completed',
    ownerName: 'Sandeep Singh',
    ownerRole: 'CTO',
  },
  {
    id: 'c3',
    name: 'Pooja Mehta',
    email: 'pooja.mehta@email.com',
    initials: 'PM',
    avatarBg: 'bg-violet-100',
    avatarText: 'text-violet-700',
    jobTitle: 'HR Executive',
    jobId: 'JOB-2026-050',
    department: 'Human Resources',
    joinDateLabel: '12 Jun 2026',
    joinDateISO: '2026-06-12',
    joinNote: '2 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 6,
    progressTotal: 10,
    status: 'In Progress',
    ownerName: 'Swati Verma',
    ownerRole: 'HR Manager',
  },
  {
    id: 'c4',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@email.com',
    initials: 'KM',
    avatarBg: 'bg-cyan-100',
    avatarText: 'text-cyan-700',
    jobTitle: 'UI/UX Designer',
    jobId: 'JOB-2026-046',
    department: 'IT Department',
    joinDateLabel: '11 Jun 2026',
    joinDateISO: '2026-06-11',
    joinNote: '5 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 4,
    progressTotal: 10,
    status: 'Pending Docs',
    ownerName: 'Amit Sharma',
    ownerRole: 'Sr. Analyst',
  },
  {
    id: 'c5',
    name: 'Neha Yadav',
    email: 'neha.yadav@email.com',
    initials: 'NY',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
    jobTitle: 'Business Analyst',
    jobId: 'JOB-2026-045',
    department: 'IT Department',
    joinDateLabel: '10 Jun 2026',
    joinDateISO: '2026-06-10',
    joinNote: '7 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 2,
    progressTotal: 10,
    status: 'Pending Docs',
    ownerName: 'Rishav Sharma',
    ownerRole: 'Head of Analytics',
  },
  {
    id: 'c6',
    name: 'Vikas Sharma',
    email: 'vikas.sharma@email.com',
    initials: 'VS',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-700',
    jobTitle: 'DevOps Engineer',
    jobId: 'JOB-2026-044',
    department: 'IT Department',
    joinDateLabel: '09 Jun 2026',
    joinDateISO: '2026-06-09',
    joinNote: 'Joined',
    joinNoteColor: 'text-emerald-600',
    progressCompleted: 10,
    progressTotal: 10,
    status: 'Completed',
    ownerName: 'Sandeep Singh',
    ownerRole: 'CTO',
  },
  {
    id: 'c7',
    name: 'Ritika Agarwal',
    email: 'ritika.agarwal@email.com',
    initials: 'RA',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    jobTitle: 'Accountant',
    jobId: 'JOB-2026-043',
    department: 'Finance & Accounts',
    joinDateLabel: '08 Jun 2026',
    joinDateISO: '2026-06-08',
    joinNote: '3 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 5,
    progressTotal: 10,
    status: 'In Progress',
    ownerName: 'Swati Verma',
    ownerRole: 'HR Manager',
  },
  {
    id: 'c8',
    name: 'Saurabh Kumar',
    email: 'saurabh.k@email.com',
    initials: 'SK',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-700',
    jobTitle: 'Data Analyst',
    jobId: 'JOB-2026-042',
    department: 'IT Department',
    joinDateLabel: '07 Jun 2026',
    joinDateISO: '2026-06-07',
    joinNote: '8 days left',
    joinNoteColor: 'text-amber-600',
    progressCompleted: 1,
    progressTotal: 10,
    status: 'On Hold',
    ownerName: 'Rishav Sharma',
    ownerRole: 'Head of Analytics',
  },
]

const ONBOARDING_STEPS: OnboardingStepData[] = [
  { id: 's1', order: 1, title: 'Offer Accepted', description: 'Candidate has accepted the offer letter.', status: 'completed' },
  { id: 's2', order: 2, title: 'Personal Information', description: 'Collect personal & contact details.', status: 'completed' },
  { id: 's3', order: 3, title: 'Documents Upload', description: 'Upload and verify required documents.', status: 'active' },
  { id: 's4', order: 4, title: 'Policy Acknowledgement', description: 'Company policies and handbooks.', status: 'pending' },
  { id: 's5', order: 5, title: 'System Access', description: 'Setup IT access and tools.', status: 'pending' },
  { id: 's6', order: 6, title: 'Training & Introduction', description: 'Department and role orientation.', status: 'pending' },
  { id: 's7', order: 7, title: 'Completed', description: 'Onboarding completed successfully.', status: 'pending' },
]

const JOB_OPENINGS = ['All Openings', 'Digital Marketing Executive', 'Software Developer', 'HR Executive', 'UI/UX Designer', 'Business Analyst', 'DevOps Engineer', 'Accountant', 'Data Analyst']
const DEPARTMENTS = ['All Departments', 'Marketing', 'IT Department', 'Human Resources', 'Finance & Accounts']
const STATUSES: (OnboardingStatus | 'All Status')[] = ['All Status', 'In Progress', 'Completed', 'Pending Docs', 'On Hold']
const OWNERS = ['All Users', 'Rishav Sharma', 'Sandeep Singh', 'Swati Verma', 'Amit Sharma']

const STATUS_STYLES: Record<OnboardingStatus, { bg: string; text: string }> = {
  'In Progress': { bg: 'bg-blue-50', text: 'text-blue-600' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'Pending Docs': { bg: 'bg-amber-50', text: 'text-amber-600' },
  'On Hold': { bg: 'bg-rose-50', text: 'text-rose-600' },
}

const getProgressColor = (percent: number): string => {
  if (percent >= 60) return 'bg-emerald-500'
  if (percent >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
}

const TABS: TabDef[] = [
  { key: 'all', label: 'All Onboarding' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'pendingDocs', label: 'Pending Documents' },
  { key: 'completed', label: 'Completed' },
  { key: 'onHold', label: 'On Hold' },
]

const TAB_STATUS_MAP: Record<Exclude<TabKey, 'all'>, OnboardingStatus> = {
  inProgress: 'In Progress',
  pendingDocs: 'Pending Docs',
  completed: 'Completed',
  onHold: 'On Hold',
}

// ---------- Small building blocks ----------

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`rounded-lg border border-slate-300 bg-white p-2 flex flex-col min-h-0 ${className}`}>
    {children}
  </div>
)

const Avatar: React.FC<{ initials: string; bg: string; text: string }> = ({ initials, bg, text }) => (
  <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${bg} ${text}`}>
    {initials}
  </div>
)

// ---------- Stat card ----------

const StatCardView: React.FC<{ stat: StatCardData }> = ({ stat }) => {
  const Icon = stat.icon
  return (
    <div className={`flex items-center gap-2 rounded-lg border p-2 flex-1 min-w-0 ${stat.cardBg} ${stat.cardBorder}`}>
      <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${stat.iconBg}`}>
        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-slate-900">{stat.value}</p>
        <p className="text-[10px] font-medium text-slate-700 truncate">{stat.label}</p>
        {stat.helper ? (
          <p className={`text-[9px] font-semibold truncate ${stat.helperColor ?? 'text-slate-500'}`}>
            {stat.helper}
          </p>
        ) : null}
      </div>
    </div>
  )
}

const StepStatusIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
  if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
  if (status === 'active') return <Clock className="h-4 w-4 text-amber-500 shrink-0" />
  return <Circle className="h-4 w-4 text-slate-300 shrink-0" />
}

// ---------- Main component ----------

const OnboardingPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [jobFilter, setJobFilter] = useState('All Openings')
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | 'All Status'>('All Status')
  const [ownerFilter, setOwnerFilter] = useState('All Users')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [showColumnsMenu, setShowColumnsMenu] = useState(false)
  const [showDeptColumn, setShowDeptColumn] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null)
  const [isAddHireOpen, setIsAddHireOpen] = useState(false)
  const [newHireName, setNewHireName] = useState('')
  const [newHireJob, setNewHireJob] = useState(JOB_OPENINGS[1])
  const [newHireDept, setNewHireDept] = useState(DEPARTMENTS[1])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const stepsCardRef = useRef<HTMLDivElement>(null)

  const activeFilterCount = [
    jobFilter !== 'All Openings',
    deptFilter !== 'All Departments',
    statusFilter !== 'All Status',
    ownerFilter !== 'All Users',
    Boolean(fromDate || toDate),
  ].filter(Boolean).length

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab = activeTab === 'all' || c.status === TAB_STATUS_MAP[activeTab]
      const matchesJob = jobFilter === 'All Openings' || c.jobTitle === jobFilter
      const matchesDept = deptFilter === 'All Departments' || c.department === deptFilter
      const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter
      const matchesOwner = ownerFilter === 'All Users' || c.ownerName === ownerFilter

      let matchesDate = true
      if (fromDate && toDate) {
        try {
          const joinDate = parse(c.joinDateISO, 'yyyy-MM-dd', new Date())
          matchesDate = isWithinInterval(joinDate, {
            start: parse(fromDate, 'yyyy-MM-dd', new Date()),
            end: parse(toDate, 'yyyy-MM-dd', new Date()),
          })
        } catch {
          matchesDate = true
        }
      }

      return matchesSearch && matchesTab && matchesJob && matchesDept && matchesStatus && matchesOwner && matchesDate
    })
  }, [candidates, searchTerm, activeTab, jobFilter, deptFilter, statusFilter, ownerFilter, fromDate, toDate])

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / itemsPerPage))
  const pageSafe = Math.min(currentPage, totalPages)
  const paginatedCandidates = filteredCandidates.slice(
    (pageSafe - 1) * itemsPerPage,
    pageSafe * itemsPerPage
  )

  const tabCounts: Record<TabKey, number> = {
    all: candidates.length,
    inProgress: candidates.filter((c) => c.status === 'In Progress').length,
    pendingDocs: candidates.filter((c) => c.status === 'Pending Docs').length,
    completed: candidates.filter((c) => c.status === 'Completed').length,
    onHold: candidates.filter((c) => c.status === 'On Hold').length,
  }

  const STATS: StatCardData[] = [
    {
      id: 'total',
      icon: UserPlus,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      cardBg: 'bg-violet-50/50',
      cardBorder: 'border-violet-200',
      value: String(candidates.length),
      label: 'Total Onboarding This Month',
      helper: '↑ 20% from last month',
      helperColor: 'text-emerald-600',
    },
    {
      id: 'completed',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      cardBg: 'bg-emerald-50/50',
      cardBorder: 'border-emerald-200',
      value: String(tabCounts.completed).padStart(2, '0'),
      label: 'Completed',
      helper: `${((tabCounts.completed / candidates.length) * 100).toFixed(1)}% of total`,
      helperColor: 'text-slate-500',
    },
    {
      id: 'inprogress',
      icon: Clock,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      cardBg: 'bg-blue-50/50',
      cardBorder: 'border-blue-200',
      value: String(tabCounts.inProgress).padStart(2, '0'),
      label: 'In Progress',
      helper: `${((tabCounts.inProgress / candidates.length) * 100).toFixed(1)}% of total`,
      helperColor: 'text-slate-500',
    },
    {
      id: 'pending',
      icon: Hourglass,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      cardBg: 'bg-amber-50/50',
      cardBorder: 'border-amber-200',
      value: String(tabCounts.pendingDocs).padStart(2, '0'),
      label: 'Pending Docs',
      helper: `${((tabCounts.pendingDocs / candidates.length) * 100).toFixed(1)}% of total`,
      helperColor: 'text-slate-500',
    },
    {
      id: 'onhold',
      icon: XCircle,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      cardBg: 'bg-rose-50/50',
      cardBorder: 'border-rose-200',
      value: String(tabCounts.onHold).padStart(2, '0'),
      label: 'On Hold',
      helper: `${((tabCounts.onHold / candidates.length) * 100).toFixed(1)}% of total`,
      helperColor: 'text-slate-500',
    },
  ]

  const QUICK_ACTIONS: QuickActionData[] = [
    { id: 'upload', icon: FileUp, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', label: 'Upload Document' },
    { id: 'email', icon: Send, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', label: 'Send Welcome Email' },
    { id: 'checklist', icon: ListChecks, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', label: 'View Onboarding Checklist' },
  ]

  const handleClearAll = () => {
    setSearchTerm('')
    setJobFilter('All Openings')
    setDeptFilter('All Departments')
    setStatusFilter('All Status')
    setOwnerFilter('All Users')
    setFromDate('')
    setToDate('')
    setActiveTab('all')
    setCurrentPage(1)
    toast.success('Filters cleared')
  }

  const handleExport = () => {
    const header = ['Candidate', 'Email', 'Job Opening', 'Department', 'Join Date', 'Progress', 'Status', 'Owner']
    const rows = filteredCandidates.map((c) => [
      c.name,
      c.email,
      c.jobTitle,
      c.department,
      c.joinDateLabel,
      `${c.progressCompleted}/${c.progressTotal}`,
      c.status,
      c.ownerName,
    ])
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'onboarding-export.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filteredCandidates.length} records`)
  }

  const handleRemoveCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
    setOpenMenuId(null)
    toast.success('Candidate removed')
  }

  const handleAddHire = () => {
    if (!newHireName.trim()) {
      toast.error('Please enter a name')
      return
    }
    const newCandidate: Candidate = {
      id: `c${Date.now()}`,
      name: newHireName.trim(),
      email: `${newHireName.trim().toLowerCase().replace(/\s+/g, '.')}@email.com`,
      initials: newHireName
        .trim()
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      avatarBg: 'bg-slate-100',
      avatarText: 'text-slate-700',
      jobTitle: newHireJob,
      jobId: `JOB-2026-${Math.floor(Math.random() * 900 + 100)}`,
      department: newHireDept,
      joinDateLabel: 'Today',
      joinDateISO: new Date().toISOString().slice(0, 10),
      joinNote: 'New',
      joinNoteColor: 'text-blue-600',
      progressCompleted: 0,
      progressTotal: 10,
      status: 'In Progress',
      ownerName: 'Rishav Sharma',
      ownerRole: 'Head of Marketing',
    }
    setCandidates((prev) => [newCandidate, ...prev])
    setIsAddHireOpen(false)
    setNewHireName('')
    toast.success('New hire added')
  }

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      toast.success(`Uploaded "${file.name}"`)
    }
    e.target.value = ''
  }

  return (
    <PageLayout>

    <div className="flex flex-col gap-2 min-h-screen overflow-visible lg:h-[calc(100vh-48px)] lg:overflow-y-auto">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '12px' } }} />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-slate-900 leading-none">Onboarding</h1>
            <UserPlus className="h-4 w-4 text-violet-600" />
          </div>
          <p className="text-[11px] font-medium text-slate-500">
            Track and manage onboarding process of new hires
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent('Onboarding Update')}`}
            className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </a>
          <button
            type="button"
            onClick={() => setIsAddHireOpen(true)}
            className="flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Hire
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0">
        {STATS.map((stat) => (
          <StatCardView key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2 lg:flex-1 lg:min-h-0">
        {/* Left column */}
        <div className="flex flex-col gap-2 min-h-0">
          {/* Search + filters */}
          <Card className="gap-2 shrink-0">
            <div className="flex flex-row items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1.5 min-w-0">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search by candidate name, job title or email..."
                  className="flex-1 text-[11px] font-medium text-slate-900 placeholder:text-slate-400 outline-none min-w-0"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMoreFilters((s) => !s)}
                className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-50"
              >
                <Filter className="h-3.5 w-3.5" />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-violet-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap shrink-0 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear All
              </button>
            </div>

            {showMoreFilters ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <select
                  value={jobFilter}
                  onChange={(e) => {
                    setJobFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
                >
                  {JOB_OPENINGS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
                <select
                  value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as OnboardingStatus | 'All Status')
                    setCurrentPage(1)
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={ownerFilter}
                  onChange={(e) => {
                    setOwnerFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
                >
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-1/2 rounded-md border border-slate-300 px-1 py-1.5 text-[10px] font-medium text-slate-700 outline-none"
                  />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-1/2 rounded-md border border-slate-300 px-1 py-1.5 text-[10px] font-medium text-slate-700 outline-none"
                  />
                </div>
              </div>
            ) : null}
          </Card>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-4">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key)
                    setCurrentPage(1)
                  }}
                  className={`pb-2 text-[11px] font-semibold whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-violet-600 border-b-2 border-violet-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label} ({tabCounts[tab.key]})
                </button>
              ))}
            </div>
            <div className="relative shrink-0 pb-2">
              <button
                type="button"
                onClick={() => setShowColumnsMenu((s) => !s)}
                className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Columns3 className="h-3 w-3" />
                Columns
                <ChevronDown className="h-3 w-3" />
              </button>
              {showColumnsMenu ? (
                <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border border-slate-300 bg-white p-1.5 shadow-md">
                  <label className="flex items-center gap-1.5 text-[10px] font-medium text-slate-700 px-1 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDeptColumn}
                      onChange={(e) => setShowDeptColumn(e.target.checked)}
                    />
                    Department
                  </label>
                </div>
              ) : null}
            </div>
          </div>

          {/* Table */}
          <Card className="min-h-[42vh] lg:flex-1 lg:min-h-0 overflow-x-auto lg:overflow-x-visible">
            <div
              className={`min-w-[820px] lg:min-w-0 grid gap-2 pb-1.5 border-b border-slate-200 shrink-0 ${
                showDeptColumn
                  ? 'grid-cols-[1.6fr_1.3fr_1.1fr_1fr_1.4fr_1fr_1.2fr_0.7fr]'
                  : 'grid-cols-[1.6fr_1.3fr_1fr_1.4fr_1fr_1.2fr_0.7fr]'
              }`}
            >
              <span className="text-[10px] font-semibold text-slate-500">Candidate</span>
              <span className="text-[10px] font-semibold text-slate-500">Job Opening</span>
              {showDeptColumn ? (
                <span className="text-[10px] font-semibold text-slate-500">Department</span>
              ) : null}
              <span className="text-[10px] font-semibold text-slate-500">Join Date</span>
              <span className="text-[10px] font-semibold text-slate-500">Onboarding Progress</span>
              <span className="text-[10px] font-semibold text-slate-500">Status</span>
              <span className="text-[10px] font-semibold text-slate-500">Onboarding Owner</span>
              <span className="text-[10px] font-semibold text-slate-500 text-right">Actions</span>
            </div>
            <div className="min-w-[820px] lg:min-w-0 flex flex-col justify-between flex-1 min-h-0">
              {paginatedCandidates.length === 0 ? (
                <p className="text-[11px] font-medium text-slate-500 py-4 text-center">
                  No candidates match the current filters.
                </p>
              ) : (
                paginatedCandidates.map((c) => {
                  const percent = Math.round((c.progressCompleted / c.progressTotal) * 100)
                  const statusStyle = STATUS_STYLES[c.status]
                  return (
                    <div
                      key={c.id}
                      className={`grid gap-2 items-center border-b border-slate-100 last:border-b-0 py-1 ${
                        showDeptColumn
                          ? 'grid-cols-[1.6fr_1.3fr_1.1fr_1fr_1.4fr_1fr_1.2fr_0.7fr]'
                          : 'grid-cols-[1.6fr_1.3fr_1fr_1.4fr_1fr_1.2fr_0.7fr]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar initials={c.initials} bg={c.avatarBg} text={c.avatarText} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-900 truncate">{c.name}</p>
                          <p className="text-[9px] font-medium text-slate-500 truncate">{c.email}</p>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-700 truncate">{c.jobTitle}</p>
                        <p className="text-[9px] font-medium text-slate-500 truncate">{c.jobId}</p>
                      </div>
                      {showDeptColumn ? (
                        <span className="text-[11px] font-medium text-slate-700 truncate">{c.department}</span>
                      ) : null}
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-700 truncate">{c.joinDateLabel}</p>
                        <p className={`text-[9px] font-semibold truncate ${c.joinNoteColor}`}>{c.joinNote}</p>
                      </div>
                      <div className="min-w-0">
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getProgressColor(percent)}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-[9px] font-medium text-slate-500 mt-0.5">
                          {c.progressCompleted} / {c.progressTotal} Completed
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {c.status}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-700 truncate">{c.ownerName}</p>
                        <p className="text-[9px] font-medium text-slate-500 truncate">{c.ownerRole}</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 relative">
                        <button
                          type="button"
                          onClick={() => setViewCandidate(c)}
                          className="h-6 w-6 rounded-md border border-slate-300 flex items-center justify-center text-blue-600 hover:bg-slate-50"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenMenuId((id) => (id === c.id ? null : c.id))}
                          className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </button>
                        {openMenuId === c.id ? (
                          <div className="absolute right-0 top-7 z-10 w-32 rounded-md border border-slate-300 bg-white p-1 shadow-md">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null)
                                toast('Edit flow coming soon')
                              }}
                              className="w-full text-left px-2 py-1 text-[10px] font-medium text-slate-700 rounded hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCandidate(c.id)}
                              className="w-full text-left px-2 py-1 text-[10px] font-medium text-rose-600 rounded hover:bg-rose-50"
                            >
                              Remove
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Pagination */}
          <Card className="flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-500">
              Showing {filteredCandidates.length === 0 ? 0 : (pageSafe - 1) * itemsPerPage + 1} to{' '}
              {Math.min(pageSafe * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} entries
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                Show
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="rounded-md border border-slate-300 px-1 py-1 text-[11px] font-medium text-slate-700 outline-none"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                entries
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe === 1}
                className="h-6 w-6 rounded-md border border-slate-300 flex items-center justify-center text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-6 w-6 rounded-md text-[11px] font-semibold flex items-center justify-center ${
                    page === pageSafe ? 'bg-violet-600 text-white' : 'border border-slate-300 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe === totalPages}
                className="h-6 w-6 rounded-md border border-slate-300 flex items-center justify-center text-slate-500 disabled:opacity-40"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2 min-h-0">
          <div ref={stepsCardRef}>
            <Card className="min-h-[32vh] lg:flex-[1.6] lg:min-h-0">
            <span className="text-[12px] font-semibold text-slate-900 mb-2 shrink-0">Onboarding Steps</span>
            <div className="flex flex-col justify-between flex-1 min-h-0 gap-1.5">
              {ONBOARDING_STEPS.map((step) => (
                <div key={step.id} className="flex items-start gap-2">
                  <StepStatusIcon status={step.status} />
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] font-semibold truncate ${
                        step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {step.order}. {step.title}
                    </p>
                    <p className="text-[9px] font-medium text-slate-500 truncate">{step.description}</p>
                    {step.status === 'active' ? (
                      <span className="text-[9px] font-semibold text-amber-600">Pending</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          </div>

          <Card className="min-h-[16vh] lg:flex-1 lg:min-h-0">
            <span className="text-[12px] font-semibold text-slate-900 mb-2 shrink-0">Quick Actions</span>
            <div className="flex flex-col justify-between flex-1 min-h-0 gap-1.5">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                const handleClick = () => {
                  if (action.id === 'upload') fileInputRef.current?.click()
                  else if (action.id === 'email')
                    window.location.href = `mailto:?subject=${encodeURIComponent('Welcome to the team!')}`
                  else if (action.id === 'checklist')
                    stepsCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={handleClick}
                    className="flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1.5 text-left hover:bg-slate-50"
                  >
                    <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${action.iconBg}`}>
                      <Icon className={`h-3.5 w-3.5 ${action.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-900 flex-1 truncate">{action.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* View candidate modal */}
      <Dialog.Root open={viewCandidate !== null} onOpenChange={(open) => !open && setViewCandidate(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg">
            {viewCandidate ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar initials={viewCandidate.initials} bg={viewCandidate.avatarBg} text={viewCandidate.avatarText} />
                    <div>
                      <Dialog.Title className="text-[13px] font-bold text-slate-900">
                        {viewCandidate.name}
                      </Dialog.Title>
                      <Dialog.Description className="text-[10px] font-medium text-slate-500">
                        {viewCandidate.jobTitle} · {viewCandidate.jobId}
                      </Dialog.Description>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-slate-500 font-medium">Department</p>
                    <p className="text-slate-900 font-semibold">{viewCandidate.department}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Join Date</p>
                    <p className="text-slate-900 font-semibold">{viewCandidate.joinDateLabel}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Progress</p>
                    <p className="text-slate-900 font-semibold">
                      {viewCandidate.progressCompleted}/{viewCandidate.progressTotal} completed
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Owner</p>
                    <p className="text-slate-900 font-semibold">
                      {viewCandidate.ownerName} ({viewCandidate.ownerRole})
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add new hire modal */}
      <Dialog.Root open={isAddHireOpen} onOpenChange={setIsAddHireOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <Dialog.Title className="text-[13px] font-bold text-slate-900">Add New Hire</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-1 text-[10px] font-medium text-slate-500">
              Fill in the details to start a new onboarding process.
            </Dialog.Description>
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                value={newHireName}
                onChange={(e) => setNewHireName(e.target.value)}
                placeholder="Full name"
                className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-900 outline-none"
              />
              <select
                value={newHireJob}
                onChange={(e) => setNewHireJob(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
              >
                {JOB_OPENINGS.slice(1).map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
              <select
                value={newHireDept}
                onChange={(e) => setNewHireDept(e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-[11px] font-medium text-slate-700 outline-none"
              >
                {DEPARTMENTS.slice(1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleAddHire}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-700"
              >
                Add Hire
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
    </PageLayout>

  )
}

export default OnboardingPage