'use client'

import React, { useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  Search, Filter, X, Calendar, Download, Mail, Plus,
  CheckCircle2, Clock, Users, XCircle, Video, User as UserIcon,
  Eye, Pencil, MoreHorizontal, LayoutGrid, ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'

// ---------- Types ----------

type InterviewStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
type InterviewMode = 'Online' | 'In Person'

interface Interviewer {
  name: string
  role: string
}

interface InterviewRow {
  id: string
  candidateName: string
  email: string
  phone: string
  avatarColor: string
  jobTitle: string
  jobId: string
  interviewType: string
  mode: InterviewMode
  stage: string
  interviewers: Interviewer[]
  date: string
  time: string
  status: InterviewStatus
}

interface StatCard {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

// ---------- Data ----------

const baseRows: InterviewRow[] = [
  { id: '1', candidateName: 'Ananya Verma', email: 'ananya.verma@email.com', phone: '+91 98765 43210', avatarColor: 'bg-rose-200 text-rose-700', jobTitle: 'Digital Marketing Executive', jobId: 'JOB-2026-048', interviewType: 'Technical Interview', mode: 'Online', stage: 'Technical Round', interviewers: [{ name: 'Rishav Sharma', role: 'Head of Marketing' }], date: '16 Jun 2026', time: '10:30 AM - 11:00 AM', status: 'Scheduled' },
  { id: '2', candidateName: 'Rohit Singh', email: 'rohit.singh@email.com', phone: '+91 91234 56789', avatarColor: 'bg-indigo-200 text-indigo-700', jobTitle: 'Software Developer', jobId: 'JOB-2026-049', interviewType: 'Technical Interview', mode: 'Online', stage: 'Technical Round', interviewers: [{ name: 'Sandeep Singh', role: 'CTO' }], date: '16 Jun 2026', time: '01:00 PM - 01:45 PM', status: 'In Progress' },
  { id: '3', candidateName: 'Pooja Mehta', email: 'pooja.mehta@email.com', phone: '+91 99887 66554', avatarColor: 'bg-amber-200 text-amber-700', jobTitle: 'HR Executive', jobId: 'JOB-2026-050', interviewType: 'HR Interview', mode: 'Online', stage: 'HR Round', interviewers: [{ name: 'Swati Verma', role: 'HR Manager' }], date: '15 Jun 2026', time: '11:00 AM - 11:30 AM', status: 'Completed' },
  { id: '4', candidateName: 'Karan Malhotra', email: 'karan.malhotra@email.com', phone: '+91 98712 34567', avatarColor: 'bg-sky-200 text-sky-700', jobTitle: 'UI/UX Designer', jobId: 'JOB-2026-046', interviewType: 'Panel Interview', mode: 'In Person', stage: 'Panel Round', interviewers: [{ name: 'Amit Rao', role: 'Design Lead' }, { name: 'Neha Iyer', role: 'Product Head' }, { name: 'Sameer Joshi', role: 'UX Lead' }], date: '17 Jun 2026', time: '02:00 PM - 03:00 PM', status: 'Scheduled' },
  { id: '5', candidateName: 'Neha Yadav', email: 'neha.yadav@email.com', phone: '+91 99111 22334', avatarColor: 'bg-emerald-200 text-emerald-700', jobTitle: 'Business Analyst', jobId: 'JOB-2026-045', interviewType: 'Technical Interview', mode: 'Online', stage: 'Technical Round', interviewers: [{ name: 'Amit Sharma', role: 'Sr. Analyst' }], date: '14 Jun 2026', time: '03:00 PM - 03:45 PM', status: 'Cancelled' },
  { id: '6', candidateName: 'Vikas Sharma', email: 'vikas.sharma@email.com', phone: '+91 98855 66778', avatarColor: 'bg-violet-200 text-violet-700', jobTitle: 'DevOps Engineer', jobId: 'JOB-2026-044', interviewType: 'Panel Interview', mode: 'In Person', stage: 'Panel Round', interviewers: [{ name: 'Ritu Kapoor', role: 'Infra Lead' }, { name: 'Manish Dev', role: 'Eng Manager' }, { name: 'Sonal Gupta', role: 'DevOps Lead' }, { name: 'Arjun Nair', role: 'SRE' }], date: '13 Jun 2026', time: '01:00 PM - 02:30 PM', status: 'Completed' },
  { id: '7', candidateName: 'Ritika Agarwal', email: 'ritika.agarwal@email.com', phone: '+91 90012 34567', avatarColor: 'bg-pink-200 text-pink-700', jobTitle: 'Accountant', jobId: 'JOB-2026-043', interviewType: 'HR Interview', mode: 'Online', stage: 'HR Round', interviewers: [{ name: 'Nidhi Sharma', role: 'HR Executive' }], date: '12 Jun 2026', time: '10:00 AM - 10:30 AM', status: 'Scheduled' },
  { id: '8', candidateName: 'Saurabh Kumar', email: 'saurabh.kumar@email.com', phone: '+91 91234 87654', avatarColor: 'bg-cyan-200 text-cyan-700', jobTitle: 'Data Analyst', jobId: 'JOB-2026-042', interviewType: 'Technical Interview', mode: 'Online', stage: 'Technical Round', interviewers: [{ name: 'Rishav Sharma', role: 'Head of Analytics' }], date: '11 Jun 2026', time: '04:00 PM - 04:45 PM', status: 'In Progress' },
]

const extraNames = ['Aditi Rao', 'Manish Tiwari', 'Sneha Kulkarni', 'Devendra Nair', 'Priya Choudhary', 'Alok Bansal', 'Ishita Sen', 'Gaurav Kapoor', 'Meera Pillai', 'Tarun Bhatt', 'Simran Kaur', 'Yash Malhotra', 'Divya Menon', 'Rahul Khanna', 'Nisha Reddy', 'Aman Chopra', 'Kavita Joshi', 'Suresh Pandey', 'Anjali Mishra', 'Vivek Saxena', 'Pallavi Nanda', 'Harsh Vardhan', 'Shreya Dutta', 'Naveen Kumar', 'Ritu Sinha', 'Deepak Rathi', 'Komal Shah', 'Ashish Verma', 'Preeti Sood', 'Mohit Arora']
const jobPool = [
  { title: 'Software Developer', id: 'JOB-2026-049', type: 'Technical Interview', stage: 'Technical Round' },
  { title: 'Digital Marketing Executive', id: 'JOB-2026-048', type: 'Technical Interview', stage: 'Technical Round' },
  { title: 'HR Executive', id: 'JOB-2026-050', type: 'HR Interview', stage: 'HR Round' },
  { title: 'UI/UX Designer', id: 'JOB-2026-046', type: 'Panel Interview', stage: 'Panel Round' },
  { title: 'Accountant', id: 'JOB-2026-043', type: 'HR Interview', stage: 'HR Round' },
]
const statusPool: InterviewStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled']
const colorPool = ['bg-rose-200 text-rose-700', 'bg-indigo-200 text-indigo-700', 'bg-amber-200 text-amber-700', 'bg-sky-200 text-sky-700', 'bg-emerald-200 text-emerald-700', 'bg-violet-200 text-violet-700']

const generatedRows: InterviewRow[] = extraNames.map((name, i) => {
  const job = jobPool[i % jobPool.length]
  const status = statusPool[i % statusPool.length]
  return {
    id: `gen-${i}`,
    candidateName: name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
    phone: `+91 9${(10000 + i).toString().padStart(5, '0')}${i}`,
    avatarColor: colorPool[i % colorPool.length],
    jobTitle: job.title,
    jobId: job.id,
    interviewType: job.type,
    mode: job.type === 'Panel Interview' ? 'In Person' : 'Online',
    stage: job.stage,
    interviewers: [{ name: 'Rishav Sharma', role: 'Head of Department' }],
    date: `${(i % 20) + 1} Jun 2026`,
    time: '11:00 AM - 11:30 AM',
    status,
  }
})

const allRows: InterviewRow[] = [...baseRows, ...generatedRows]

const jobOpeningOptions = ['All Openings', ...Array.from(new Set(allRows.map(r => r.jobTitle)))]
const stageOptions = ['All Stages', ...Array.from(new Set(allRows.map(r => r.stage)))]
const typeOptions = ['All Types', ...Array.from(new Set(allRows.map(r => r.interviewType)))]
const interviewerOptions = ['All Interviewers', ...Array.from(new Set(allRows.flatMap(r => r.interviewers.map(iv => iv.name))))]
const statusOptions = ['All Status', ...statusPool]

const statCards: StatCard[] = [
  { label: 'Interviews Scheduled This Week', value: '38', sub: '↑ 22.4% from last week', icon: Calendar, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Completed', value: '26', sub: '68.4% of total', icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'In Progress', value: '12', sub: '31.6% of total', icon: Clock, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
  { label: 'Panel Interviews', value: '07', sub: '18.4% of total', icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Cancelled', value: '03', sub: '7.9% of total', icon: XCircle, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
]

const statusBadgeClass: Record<InterviewStatus, string> = {
  Scheduled: 'bg-blue-100 text-blue-800 border border-blue-200',
  'In Progress': 'bg-amber-100 text-amber-800 border border-amber-200',
  Completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-800 border border-rose-200',
}

type TabKey = 'All' | InterviewStatus

const tabs: { key: TabKey; label: string }[] = [
  { key: 'All', label: 'All Interviews' },
  { key: 'Scheduled', label: 'Scheduled' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Cancelled', label: 'Cancelled' },
]

// ---------- Component ----------

const Interviews: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('All')
  const [jobOpening, setJobOpening] = useState('All Openings')
  const [stage, setStage] = useState('All Stages')
  const [type, setType] = useState('All Types')
  const [interviewer, setInterviewer] = useState('All Interviewers')
  const [status, setStatus] = useState('All Status')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalInterviewers, setModalInterviewers] = useState<Interviewer[] | null>(null)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (jobOpening !== 'All Openings') count++
    if (stage !== 'All Stages') count++
    if (type !== 'All Types') count++
    if (interviewer !== 'All Interviewers') count++
    if (status !== 'All Status') count++
    return count
  }, [jobOpening, stage, type, interviewer, status])

  const filteredRows = useMemo(() => {
    return allRows.filter(r => {
      if (activeTab !== 'All' && r.status !== activeTab) return false
      if (jobOpening !== 'All Openings' && r.jobTitle !== jobOpening) return false
      if (stage !== 'All Stages' && r.stage !== stage) return false
      if (type !== 'All Types' && r.interviewType !== type) return false
      if (interviewer !== 'All Interviewers' && !r.interviewers.some(iv => iv.name === interviewer)) return false
      if (status !== 'All Status' && r.status !== status) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const hay = `${r.candidateName} ${r.jobTitle} ${r.interviewers.map(iv => iv.name).join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [activeTab, jobOpening, stage, type, interviewer, status, searchQuery])

  const totalEntries = filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize))
  const pageSafe = Math.min(currentPage, totalPages)
  const pagedRows = filteredRows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  const tabCount = (key: TabKey) => key === 'All' ? allRows.length : allRows.filter(r => r.status === key).length

  const allChecked = pagedRows.length > 0 && pagedRows.every(r => selectedIds.has(r.id))

  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allChecked) pagedRows.forEach(r => next.delete(r.id))
      else pagedRows.forEach(r => next.add(r.id))
      return next
    })
  }

  const toggleRow = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearAll = () => {
    setJobOpening('All Openings')
    setStage('All Stages')
    setType('All Types')
    setInterviewer('All Interviewers')
    setStatus('All Status')
    setSearchQuery('')
    setActiveTab('All')
    setCurrentPage(1)
    toast.success('Filters cleared')
  }

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setCurrentPage(p)
  }

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <div className="w-full h-[calc(100vh-3rem)] min-h-[650px] flex flex-col gap-2 p-2 bg-gray-50 overflow-hidden">
        <Toaster position="top-right" toastOptions={{ style: { fontSize: '11px' } }} />

        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-base font-bold">Interviews</h1>
            <p className="text-[10px]">Manage and track all candidate interviews</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success('Exporting interviews...')}
              className="flex items-center gap-1 text-[10px] font-semibold border border-gray-300 bg-white rounded-lg px-2 py-1.5 hover:bg-gray-100"
            >
              <Download className="w-3 h-3" /> Export
            </button>
            <button
              onClick={() => toast.success('Opening email composer...')}
              className="flex items-center gap-1 text-[10px] font-semibold border border-gray-300 bg-white rounded-lg px-2 py-1.5 hover:bg-gray-100"
            >
              <Mail className="w-3 h-3" /> Email
            </button>
            <button
              onClick={() => toast.success('Schedule Interview form opened')}
              className="flex items-center gap-1 text-[10px] font-semibold text-white bg-indigo-600 rounded-lg px-2 py-1.5 hover:bg-indigo-700"
            >
              <Plus className="w-3 h-3" /> Schedule Interview
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-5 gap-2 shrink-0">
          {statCards.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-300 p-2 flex items-center gap-2">
                <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${s.iconBg}`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-bold leading-none">{s.value}</div>
                  <div className="text-[10px] font-medium mt-0.5 truncate">{s.label}</div>
                  <div className="text-[9px] font-semibold text-emerald-700 mt-0.5">{s.sub}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search + top actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              placeholder="Search by candidate name, job title or interviewer..."
              className="w-full text-[11px] border border-gray-300 rounded-lg pl-7 pr-2 py-1.5 bg-white outline-none focus:border-indigo-500"
            />
          </div>
          <button className={`relative flex items-center gap-1 text-[10px] font-semibold border border-gray-300 bg-white rounded-lg px-2 py-1.5 ${activeFilterCount > 0 && 'text-blue-500'}`}>
            <Filter className="w-3 h-3" /> Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[10px] font-semibold border border-gray-300 bg-white rounded-lg px-2 py-1.5 hover:bg-gray-100"
          >
            <X className="w-3 h-3" /> Clear All
          </button>
        </div>

        {/* Filter selects */}
        <div className="grid grid-cols-6 gap-2 shrink-0">
          <FilterSelect label="Job Opening" value={jobOpening} options={jobOpeningOptions} onChange={v => { setJobOpening(v); setCurrentPage(1) }} />
          <FilterSelect label="Interview Stage" value={stage} options={stageOptions} onChange={v => { setStage(v); setCurrentPage(1) }} />
          <FilterSelect label="Interview Type" value={type} options={typeOptions} onChange={v => { setType(v); setCurrentPage(1) }} />
          <FilterSelect label="Interviewer" value={interviewer} options={interviewerOptions} onChange={v => { setInterviewer(v); setCurrentPage(1) }} />
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={v => { setStatus(v); setCurrentPage(1) }} />
          <div className="flex flex-col justify-end">
            <span className="text-[9px] font-medium  mb-0.5">Date Range</span>
            <button className="flex items-center gap-1 text-[10px] font-semibold  border border-gray-300 bg-white rounded-lg px-2 py-1.5">
              <Calendar className="w-3 h-3" /> 01 Jun 2026 - 15 Jun 2026
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-gray-300 shrink-0">
          <div className="flex items-center gap-4">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setCurrentPage(1) }}
                className={`text-[11px] font-semibold pb-1.5 border-b-2 transition-colors ${activeTab === t.key ? 'text-indigo-600 border-indigo-600' : ' border-transparent hover:text-gray-900'
                  }`}
              >
                {t.label} ({tabCount(t.key)})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-1">
            <button className="flex items-center gap-1 text-[10px] font-semibold text-gray-800 border border-gray-300 bg-white rounded-lg px-2 py-1">
              <LayoutGrid className="w-3 h-3" /> Columns
            </button>
            <button className="flex items-center gap-1 text-[10px] font-semibold text-gray-800 border border-gray-300 bg-white rounded-lg px-2 py-1">
              Interview Date <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 bg-white rounded-xl border border-gray-300 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-[10px]">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="text-gray-700 text-left">
                  <th className="py-2 px-2 w-8">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-indigo-600" />
                  </th>
                  <th className="py-2 px-2">Candidate</th>
                  <th className="py-2 px-2">Job Opening</th>
                  <th className="py-2 px-2">Interview Type</th>
                  <th className="py-2 px-2">Stage</th>
                  <th className="py-2 px-2">Interviewer(s)</th>
                  <th className="py-2 px-2">Interview Date &amp; Time</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map(r => (
                  <tr key={r.id} className="border-t border-gray-200 text-gray-900 hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleRow(r.id)} className="accent-indigo-600" />
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold shrink-0 ${r.avatarColor}`}>
                          {r.candidateName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{r.candidateName}</div>
                          <div className="text-[9px] truncate">{r.email}</div>
                          <div className="text-[9px] truncate">{r.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-gray-900 truncate font-semibold">{r.jobTitle}</div>
                      <div className="text-[9px]">{r.jobId}</div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1 text-gray-900 font-semibold">
                        {r.interviewType}
                        {r.mode === 'Online' ? <Video className="w-3 h-3 text-indigo-600" /> : <UserIcon className="w-3 h-3 text-indigo-600" />}
                      </div>
                      <div className="text-[9px] ">{r.mode === 'Online' ? '(Online)' : '(In Person)'}</div>
                    </td>
                    <td className="py-2 px-2 text-gray-900">{r.stage}</td>
                    <td className="py-2 px-2">
                      {r.interviewers.length > 1 ? (
                        <div>
                          <div className="text-gray-900">{r.interviewers.length} Interviewers</div>
                          <button
                            onClick={() => setModalInterviewers(r.interviewers)}
                            className="text-[9px] text-indigo-700 font-semibold hover:underline"
                          >
                            View All
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-900 font-semibold">{r.interviewers[0]?.name}</div>
                          <div className="text-[9px] ">{r.interviewers[0]?.role}</div>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-gray-900 font-semibold">{r.date}</div>
                      <div className="text-[9px] ">{r.time}</div>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full font-semibold ${statusBadgeClass[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toast(`Viewing ${r.candidateName}`)} className=" hover:text-indigo-600 border border-gray-200 p-1 rounded-lg">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toast.success(`Editing ${r.candidateName}`)} className=" hover:text-indigo-600 border border-gray-200 p-1 rounded-lg">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toast(`More options for ${r.candidateName}`)} className=" hover:text-indigo-600 border border-gray-200 p-1 rounded-lg">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center  text-[11px]">No interviews match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-300 px-2 py-1.5 shrink-0">
            <div className="flex items-center gap-1 text-[10px] ">
              Show
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
                className="border border-gray-300 rounded px-1 py-0.5 text-[10px] text-gray-900 outline-none"
              >
                {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              entries
            </div>
            <div className="text-[10px] ">
              Showing {totalEntries === 0 ? 0 : (pageSafe - 1) * pageSize + 1} to {Math.min(pageSafe * pageSize, totalEntries)} of {totalEntries} entries
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(pageSafe - 1)} disabled={pageSafe === 1} className="w-6 h-6 flex items-center justify-center rounded border border-gray-300  disabled:opacity-40">
                <ChevronLeft className="w-3 h-3" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 4).map(p => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-semibold ${p === pageSafe ? 'bg-indigo-600 text-white' : 'border border-gray-300  hover:bg-gray-100'
                    }`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => goToPage(pageSafe + 1)} disabled={pageSafe === totalPages} className="w-6 h-6 flex items-center justify-center rounded border border-gray-300  disabled:opacity-40">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Interviewers Modal */}
        {modalInterviewers && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setModalInterviewers(null)}
          >
            <div
              className="bg-white rounded-xl border border-gray-300 w-80 max-h-[70vh] overflow-y-auto p-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[12px] font-bold text-gray-900">Interviewers ({modalInterviewers.length})</h3>
                <button onClick={() => setModalInterviewers(null)} className=" hover:text-gray-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {modalInterviewers.map((iv, idx) => (
                  <div key={idx} className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {iv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-gray-900 truncate">{iv.name}</div>
                      <div className="text-[9px]  truncate">{iv.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
   </div>
  )
}

// ---------- Filter select ----------

interface FilterSelectProps {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-medium text-gray-600 mb-0.5">{label}</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-[10px] text-gray-900 border border-gray-300 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-indigo-500"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

export default Interviews