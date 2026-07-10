"use client"
import React, { useMemo, useState } from 'react'
import {
  Download,
  Mail,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Columns3,
  ChevronDown,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Hourglass,
  XCircle,
  Ticket,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type OfferStatus = 'Accepted' | 'Pending' | 'Expired' | 'Declined'
type ExpiryTone = 'ok' | 'warn' | 'expired' | 'declined'
type StatTone = 'purple' | 'green' | 'blue' | 'amber' | 'rose'

interface Offer {
  id: string
  candidateName: string
  email: string
  phone: string
  avatarUrl: string
  jobTitle: string
  jobId: string
  ctc: string
  offerType: string
  location: string
  offerDate: string
  expiryDate: string
  expiryNote: string
  expiryTone: ExpiryTone
  offeredByName: string
  offeredByRole: string
  status: OfferStatus
}

interface FilterDef {
  key: string
  label: string
  value: string
  options: string[]
}

interface ActionMenuState {
  id: string
  top: number
  left: number
}

interface StatItem {
  key: string
  label: string
  value: string
  note: string
  tone: StatTone
  icon: React.ReactNode
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const OFFERS: Offer[] = [
  {
    id: 'JOB-2026-048',
    candidateName: 'Ananya Verma',
    email: 'ananya.verma@email.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://i.pravatar.cc/64?img=47',
    jobTitle: 'Digital Marketing Executive',
    jobId: 'JOB-2026-048',
    ctc: '₹8,40,000',
    offerType: 'Full Time',
    location: 'New Delhi',
    offerDate: '14 Jun 2026',
    expiryDate: '21 Jun 2026',
    expiryNote: '7 days left',
    expiryTone: 'ok',
    offeredByName: 'Rishav Sharma',
    offeredByRole: 'Head of Marketing',
    status: 'Accepted',
  },
  {
    id: 'JOB-2026-049',
    candidateName: 'Rohit Singh',
    email: 'rohit.singh@email.com',
    phone: '+91 91234 56789',
    avatarUrl: 'https://i.pravatar.cc/64?img=12',
    jobTitle: 'Software Developer',
    jobId: 'JOB-2026-049',
    ctc: '₹12,00,000',
    offerType: 'Full Time',
    location: 'Bangalore',
    offerDate: '13 Jun 2026',
    expiryDate: '20 Jun 2026',
    expiryNote: '6 days left',
    expiryTone: 'warn',
    offeredByName: 'Sandeep Singh',
    offeredByRole: 'CTO',
    status: 'Pending',
  },
  {
    id: 'JOB-2026-050',
    candidateName: 'Pooja Mehta',
    email: 'pooja.mehta@email.com',
    phone: '+91 99887 66554',
    avatarUrl: 'https://i.pravatar.cc/64?img=32',
    jobTitle: 'HR Executive',
    jobId: 'JOB-2026-050',
    ctc: '₹6,00,000',
    offerType: 'Full Time',
    location: 'Gurugram',
    offerDate: '12 Jun 2026',
    expiryDate: '19 Jun 2026',
    expiryNote: '5 days left',
    expiryTone: 'warn',
    offeredByName: 'Swati Verma',
    offeredByRole: 'HR Manager',
    status: 'Accepted',
  },
  {
    id: 'JOB-2026-046',
    candidateName: 'Karan Malhotra',
    email: 'karan.malhotra@email.com',
    phone: '+91 98712 34567',
    avatarUrl: 'https://i.pravatar.cc/64?img=15',
    jobTitle: 'UI/UX Designer',
    jobId: 'JOB-2026-046',
    ctc: '₹9,60,000',
    offerType: 'Full Time',
    location: 'Noida',
    offerDate: '11 Jun 2026',
    expiryDate: '18 Jun 2026',
    expiryNote: '4 days left',
    expiryTone: 'warn',
    offeredByName: 'Amit Sharma',
    offeredByRole: 'Sr. Analyst',
    status: 'Pending',
  },
  {
    id: 'JOB-2026-045',
    candidateName: 'Neha Yadav',
    email: 'neha.yadav@email.com',
    phone: '+91 99111 22334',
    avatarUrl: 'https://i.pravatar.cc/64?img=29',
    jobTitle: 'Business Analyst',
    jobId: 'JOB-2026-045',
    ctc: '₹7,20,000',
    offerType: 'Full Time',
    location: 'Mumbai',
    offerDate: '10 Jun 2026',
    expiryDate: '15 Jun 2026',
    expiryNote: 'Expired',
    expiryTone: 'expired',
    offeredByName: 'Rishav Sharma',
    offeredByRole: 'Head of Analytics',
    status: 'Expired',
  },
  {
    id: 'JOB-2026-044',
    candidateName: 'Vikas Sharma',
    email: 'vikas.sharma@email.com',
    phone: '+91 98855 66778',
    avatarUrl: 'https://i.pravatar.cc/64?img=51',
    jobTitle: 'DevOps Engineer',
    jobId: 'JOB-2026-044',
    ctc: '₹11,40,000',
    offerType: 'Full Time',
    location: 'Bangalore',
    offerDate: '09 Jun 2026',
    expiryDate: '15 Jun 2026',
    expiryNote: 'Expired',
    expiryTone: 'expired',
    offeredByName: 'Sandeep Singh',
    offeredByRole: 'CTO',
    status: 'Expired',
  },
  {
    id: 'JOB-2026-043',
    candidateName: 'Ritika Agarwal',
    email: 'ritika.agarwal@email.com',
    phone: '+91 90012 34567',
    avatarUrl: 'https://i.pravatar.cc/64?img=25',
    jobTitle: 'Accountant',
    jobId: 'JOB-2026-043',
    ctc: '₹5,40,000',
    offerType: 'Full Time',
    location: 'Noida',
    offerDate: '08 Jun 2026',
    expiryDate: '17 Jun 2026',
    expiryNote: '2 days left',
    expiryTone: 'warn',
    offeredByName: 'Swati Verma',
    offeredByRole: 'HR Manager',
    status: 'Pending',
  },
  {
    id: 'JOB-2026-042',
    candidateName: 'Saurabh Kumar',
    email: 'saurabh.kumar@email.com',
    phone: '+91 91234 87654',
    avatarUrl: 'https://i.pravatar.cc/64?img=60',
    jobTitle: 'Data Analyst',
    jobId: 'JOB-2026-042',
    ctc: '₹8,00,000',
    offerType: 'Full Time',
    location: 'Hyderabad',
    offerDate: '07 Jun 2026',
    expiryDate: '14 Jun 2026',
    expiryNote: 'Declined',
    expiryTone: 'declined',
    offeredByName: 'Rishav Sharma',
    offeredByRole: 'Head of Analytics',
    status: 'Declined',
  },
]

const FILTER_DEFS: FilterDef[] = [
  { key: 'jobOpening', label: 'Job Opening', value: 'All Openings', options: ['All Openings', ...Array.from(new Set(OFFERS.map((o) => o.jobTitle)))] },
  { key: 'department', label: 'Department', value: 'All Departments', options: ['All Departments', 'Marketing', 'Engineering', 'HR', 'Design', 'Analytics', 'Finance'] },
  { key: 'offerStatus', label: 'Offer Status', value: 'All Status', options: ['All Status', 'Accepted', 'Pending', 'Expired', 'Declined'] },
  { key: 'offerType', label: 'Offer Type', value: 'All Types', options: ['All Types', 'Full Time', 'Part Time', 'Contract', 'Internship'] },
  { key: 'offeredBy', label: 'Offered By', value: 'All Users', options: ['All Users', ...Array.from(new Set(OFFERS.map((o) => o.offeredByName)))] },
  { key: 'dateRange', label: 'Date Range', value: '01 Jun 2026 - 15 Jun 2026', options: ['01 Jun 2026 - 15 Jun 2026', '16 Jun 2026 - 30 Jun 2026', '01 Jul 2026 - 15 Jul 2026'] },
]

const TABS: { key: 'All' | OfferStatus; label: string }[] = [
  { key: 'All', label: 'All Offers' },
  { key: 'Accepted', label: 'Accepted' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Expired', label: 'Expired' },
  { key: 'Declined', label: 'Declined' },
]

const STATUS_STYLE: Record<OfferStatus, string> = {
  Accepted: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Expired: 'bg-rose-50 text-rose-700',
  Declined: 'bg-rose-50 text-rose-700',
}

const EXPIRY_STYLE: Record<ExpiryTone, string> = {
  ok: 'text-emerald-600',
  warn: 'text-amber-600',
  expired: 'text-rose-500',
  declined: 'text-rose-500',
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

type ToastProps = {
  message: string
  onClose: () => void
}

function Toast({ message, onClose }: ToastProps) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2200)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-2 right-2 z-50 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg">
      {message}
    </div>
  )
}

type Field = {
  key: string
  value: string
  options: string[]
}

type DropdownProps = {
  field: Field
  onChange: (key: string, value: string) => void
}

function Dropdown({ field, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative min-w-0 flex-1 basis-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-full w-full items-center justify-between gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-xs font-medium text-slate-700 hover:border-slate-300"
      >
        <span className="truncate">{field.value}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full min-w-[10rem] overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(field.key, opt)
                setOpen(false)
              }}
              className={`block w-full truncate rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-50 ${opt === field.value
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-700"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

const OffersPage = () => {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'All' | OfferStatus>('All')
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(FILTER_DEFS.map((f) => [f.key, f.value]))
  )
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sortNewestFirst, setSortNewestFirst] = useState(true)
  const [sortOpen, setSortOpen] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState<string | null>(null)
  const [actionMenu, setActionMenu] = useState<ActionMenuState | null>(null)

  React.useEffect(() => {
    if (!actionMenu) return
    const close = () => setActionMenu(null)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [actionMenu])

  const openActionMenu = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (actionMenu?.id === id) {
      setActionMenu(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const menuWidth = 176
    const menuHeight = 168
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow >= menuHeight + 8 ? rect.bottom + 4 : rect.top - menuHeight - 4
    const left = Math.min(Math.max(8, rect.right - menuWidth), window.innerWidth - menuWidth - 8)
    setActionMenu({ id, top, left })
  }

  const notify = (msg: string) => setToast(msg)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearAll = () => {
    setFilters(Object.fromEntries(FILTER_DEFS.map((f) => [f.key, f.options[0]])))
    setSearch('')
    setActiveTab('All')
    setPage(1)
    notify('Filters cleared')
  }

  const filtered = useMemo(() => {
    let rows = OFFERS.slice()
    if (activeTab !== 'All') rows = rows.filter((r) => r.status === activeTab)
    if (filters.offerStatus && filters.offerStatus !== 'All Status') {
      rows = rows.filter((r) => r.status === filters.offerStatus)
    }
    if (filters.offerType && filters.offerType !== 'All Types') {
      rows = rows.filter((r) => r.offerType === filters.offerType)
    }
    if (filters.jobOpening && filters.jobOpening !== 'All Openings') {
      rows = rows.filter((r) => r.jobTitle === filters.jobOpening)
    }
    if (filters.offeredBy && filters.offeredBy !== 'All Users') {
      rows = rows.filter((r) => r.offeredByName === filters.offeredBy)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      rows = rows.filter(
        (r) =>
          r.candidateName.toLowerCase().includes(q) ||
          r.jobTitle.toLowerCase().includes(q) ||
          r.jobId.toLowerCase().includes(q)
      )
    }
    rows.sort((a, b) => (sortNewestFirst ? b.offerDate.localeCompare(a.offerDate) : a.offerDate.localeCompare(b.offerDate)))
    return rows
  }, [activeTab, filters, search, sortNewestFirst])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)

  const counts = useMemo(
    () => ({
      All: OFFERS.length,
      Accepted: OFFERS.filter((o) => o.status === 'Accepted').length,
      Pending: OFFERS.filter((o) => o.status === 'Pending').length,
      Expired: OFFERS.filter((o) => o.status === 'Expired').length,
      Declined: OFFERS.filter((o) => o.status === 'Declined').length,
    }),
    []
  )

  const stats: StatItem[] = [
    { key: 'total', label: 'Offers Extended This Month', value: String(counts.All).padStart(2, '0'), note: '↑ 29.4% from last month', tone: 'purple', icon: <CalendarClock className="h-4 w-4" /> },
    { key: 'accepted', label: 'Accepted', value: String(counts.Accepted).padStart(2, '0'), note: `${((counts.Accepted / counts.All) * 100).toFixed(1)}% of total offers`, tone: 'green', icon: <CheckCircle2 className="h-4 w-4" /> },
    { key: 'pending', label: 'Pending', value: String(counts.Pending).padStart(2, '0'), note: `${((counts.Pending / counts.All) * 100).toFixed(1)}% of total offers`, tone: 'blue', icon: <Clock3 className="h-4 w-4" /> },
    { key: 'expired', label: 'Expired', value: String(counts.Expired).padStart(2, '0'), note: `${((counts.Expired / counts.All) * 100).toFixed(1)}% of total offers`, tone: 'amber', icon: <Hourglass className="h-4 w-4" /> },
    { key: 'declined', label: 'Declined', value: String(counts.Declined).padStart(2, '0'), note: `${((counts.Declined / counts.All) * 100).toFixed(1)}% of total offers`, tone: 'rose', icon: <XCircle className="h-4 w-4" /> },
  ]

  const toneClasses: Record<StatTone, string> = {
    purple: 'bg-indigo-50 text-indigo-600',
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  const toggleSelectAll = () => {
    if (selected.size === pageRows.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pageRows.map((r) => r.id)))
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      <div className="flex h-full w-full flex-col gap-2 overflow-hidden bg-white p-2 text-slate-900" style={{ height: 'calc(100% - 3rem)' }}>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        {actionMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActionMenu(null)} />
            <div
              className="fixed z-50 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
              style={{ top: actionMenu.top, left: actionMenu.left }}
            >
              {[
                { label: 'View details', tone: 'text-slate-700' },
                { label: 'Download offer letter', tone: 'text-slate-700' },
                { label: 'Resend offer', tone: 'text-slate-700' },
                { label: 'Edit offer', tone: 'text-slate-700' },
                { label: 'Withdraw offer', tone: 'text-rose-600' },
              ].map((item) => {
                const row = pageRows.find((r) => r.id === actionMenu.id)
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      notify(`${item.label}: ${row?.candidateName ?? ''}`)
                      setActionMenu(null)
                    }}
                    className={`block w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium hover:bg-slate-50 ${item.tone}`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Header */}
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">Offers</h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <Ticket className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-700">Manage and track job offers extended to candidates</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => notify('Offers exported')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 text-indigo-600" /> Export
            </button>
            <button
              onClick={() => notify('Email sent')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Mail className="h-3.5 w-3.5 text-indigo-600" /> Email
            </button>
            <button
              onClick={() => notify('Create Offer flow started')}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" /> Create Offer
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.key} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClasses[s.tone]}`}>{s.icon}</span>
              <div className="min-w-0">
                <div className="text-base font-semibold leading-none text-slate-900">{s.value}</div>
                <div className="mt-1 truncate text-[11px] font-semibold text-slate-700">{s.label}</div>
                <div className={`mt-0.5 truncate text-[11px] font-medium ${s.tone === 'purple' ? 'text-emerald-600' : 'text-slate-600'}`}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filter toggle */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex min-w-0 flex-[3] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-indigo-600" strokeWidth={2.5} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by candidate name, job title or offer ID..."
              className="w-full min-w-0 bg-transparent text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-indigo-600" /> Filters
            <span className="rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">1</span>
          </button>
          <button
            onClick={clearAll}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>

        {/* Filter fields */}
        <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {FILTER_DEFS.map((f) => (
            <div key={f.key} className="flex flex-col gap-0.5">
              <span className="truncate text-[11px] font-medium text-slate-700">{f.label}</span>
              <Dropdown field={{ ...f, value: filters[f.key] }} onChange={handleFilterChange} />
            </div>
          ))}
        </div>

        {/* Tabs + table controls */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200">
          <div className="flex gap-6 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key)
                  setPage(1)
                }}
                className={`whitespace-nowrap border-b-2 px-1 pb-2 text-xs font-medium ${activeTab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
              >
                {t.label} ({counts[t.key]})
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2 pb-2">
            <button
              onClick={() => notify('Column settings opened')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-slate-50"
            >
              <Columns3 className="h-3.5 w-3.5" /> Columns
            </button>
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {sortNewestFirst ? 'Newest First' : 'Oldest First'} <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  {['Newest First', 'Oldest First'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortNewestFirst(opt === 'Newest First')
                        setSortOpen(false)
                      }}
                      className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[860px] border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-slate-700">
                <th className="w-8 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={pageRows.length > 0 && selected.size === pageRows.length}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 accent-indigo-600"
                  />
                </th>
                <th className="px-2 py-2 font-medium">Candidate</th>
                <th className="px-2 py-2 font-medium">Job Opening</th>
                <th className="px-2 py-2 font-medium">Offered CTC</th>
                <th className="px-2 py-2 font-medium">Offer Type</th>
                <th className="px-2 py-2 font-medium">Offer Date</th>
                <th className="px-2 py-2 font-medium">Offer Expiry</th>
                <th className="px-2 py-2 font-medium">Offered By</th>
                <th className="px-2 py-2 font-medium">Status</th>
                <th className="px-2 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((o) => (
                <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-2 py-2 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.has(o.id)}
                      onChange={() => toggleSelectOne(o.id)}
                      className="h-3.5 w-3.5 accent-indigo-600"
                    />
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="flex items-start gap-2">
                      <img src={o.avatarUrl} alt={o.candidateName} className="h-7 w-7 shrink-0 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-900">{o.candidateName}</div>
                        <div className="truncate text-[11px] text-slate-700">{o.email}</div>
                        <div className="truncate text-[11px] text-slate-700">{o.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="truncate font-medium text-slate-900">{o.jobTitle}</div>
                    <div className="truncate text-[11px] text-slate-700">{o.jobId}</div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="font-medium text-slate-900">{o.ctc}</div>
                    <div className="text-[11px] text-slate-700">CTC per annum</div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <span className="mb-0.5 inline-block rounded-md bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600">
                      {o.offerType}
                    </span>
                    <div className="text-[11px] text-slate-700">{o.location}</div>
                  </td>
                  <td className="px-2 py-2 align-top text-slate-700">{o.offerDate}</td>
                  <td className="px-2 py-2 align-top">
                    <div className="text-slate-700">{o.expiryDate}</div>
                    <div className={`text-[11px] font-medium ${EXPIRY_STYLE[o.expiryTone]}`}>{o.expiryNote}</div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="truncate font-medium text-slate-900">{o.offeredByName}</div>
                    <div className="truncate text-[11px] text-slate-700">{o.offeredByRole}</div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                    {o.status === 'Accepted' && <div className="mt-0.5 text-[11px] text-slate-600">15 Jun 2026</div>}
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => notify(`Viewing offer for ${o.candidateName}`)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50"
                        aria-label="View offer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => notify(`Downloading offer letter for ${o.candidateName}`)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50"
                        aria-label="Download offer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => openActionMenu(o.id, e)}
                        className={`flex h-6 w-6 items-center justify-center rounded-md hover:bg-slate-100 ${actionMenu?.id === o.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                          }`}
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-2 py-8 text-center text-slate-600">
                    No offers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <div className="relative">
              <button
                onClick={() => setPageSizeOpen((v) => !v)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 font-medium text-slate-700"
              >
                {pageSize} <ChevronDown className="h-3 w-3" />
              </button>
              {pageSizeOpen && (
                <div className="absolute bottom-full right-0 z-20 mb-1 w-16 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  {[10, 20, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setPageSize(n)
                        setPage(1)
                        setPageSizeOpen(false)
                      }}
                      className="block w-full rounded-md px-2 py-1 text-left hover:bg-slate-50"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span>entries</span>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-6 w-6 items-center justify-center rounded-md font-medium ${n === page ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OffersPage;