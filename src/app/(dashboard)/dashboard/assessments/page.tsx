'use client'

import React, { useState } from 'react'
import { 
  Plus, Download, BarChart3, Search, Filter, RotateCcw, 
  Grid, ChevronDown, Eye, Play, CheckCircle2, AlertCircle, 
  Clock, HelpCircle, ChevronLeft, ChevronRight, MoreVertical, 
  AlertTriangle,
    ClipboardCheck,
  Clock3,
  Timer,
} from 'lucide-react'
import PageLayout from '@/components/ui/pageLayout'

// ---------- TYPES & INTERFACES ----------

interface StatMetric {
  id: string
  label: string
  count: number
  subtext: string
  isTrend?: boolean
  trendText?: string
  bgIcon: string
  iconColor: string
  borderColor: string,
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface Candidate {
  name: string
  email: string
  phone: string
  avatar?: string
}

interface AssessmentRow {
  id: string
  candidate: Candidate
  jobTitle: string
  jobCode: string
  assessmentName: string
  assessmentSub?: string
  type: 'Skill Test' | 'Technical' | 'Aptitude' | 'Practical'
  duration: string
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue'
  score?: string
  percentile?: string
  percentileLabel?: string
  completedOn?: string
}

// ---------- MOCK DATA ----------

const initialStats: StatMetric[] = [
  {
    id: "all",
    label: "Assessments Conducted This Week",
    count: 56,
    subtext: "",
    isTrend: true,
    trendText: "↑ 18.4% from last week",
    bgIcon: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    icon: ClipboardCheck,
  },
  {
    id: "completed",
    label: "Completed",
    count: 24,
    subtext: "42.9% of total",
    bgIcon: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    icon: CheckCircle2,
  },
  {
    id: "progress",
    label: "In Progress",
    count: 18,
    subtext: "32.1% of total",
    bgIcon: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    icon: Clock3,
  },
  {
    id: "pending",
    label: "Pending",
    count: 8,
    subtext: "14.3% of total",
    bgIcon: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
    icon: Timer,
  },
  {
    id: "overdue",
    label: "Overdue",
    count: 6,
    subtext: "10.7% of total",
    bgIcon: "bg-rose-50",
    iconColor: "text-rose-600",
    borderColor: "border-rose-200",
    icon: AlertTriangle,
  },
];

const initialRows: AssessmentRow[] = [
  {
    id: '1',
    candidate: { name: 'Ananya Verma', email: 'ananya.verma@email.com', phone: '+91 98765 43210' },
    jobTitle: 'Digital Marketing Executive', jobCode: 'JOB-2026-048',
    assessmentName: 'Digital Marketing', assessmentSub: 'Skill Assessment',
    type: 'Skill Test', duration: '45 min', status: 'Completed', score: '42/50', percentile: '92%', percentileLabel: 'Outstanding', completedOn: '14 Jun 2026, 11:24 AM'
  },
  {
    id: '2',
    candidate: { name: 'Rohit Singh', email: 'rohit.singh@email.com', phone: '+91 91234 56789' },
    jobTitle: 'Software Developer', jobCode: 'JOB-2026-049',
    assessmentName: 'Technical MCQ Test', assessmentSub: '(Java, SQL, DSA)',
    type: 'Technical', duration: '60 min', status: 'Completed', score: '38/50', percentile: '76%', percentileLabel: 'Good', completedOn: '14 Jun 2026, 09:45 AM'
  },
  {
    id: '3',
    candidate: { name: 'Pooja Mehta', email: 'pooja.mehta@email.com', phone: '+91 99887 66554' },
    jobTitle: 'HR Executive', jobCode: 'JOB-2026-050',
    assessmentName: 'HR Aptitude Test',
    type: 'Aptitude', duration: '40 min', status: 'In Progress'
  },
  {
    id: '4',
    candidate: { name: 'Karan Malhotra', email: 'karan.malhotra@email.com', phone: '+91 98712 34567' },
    jobTitle: 'UI/UX Designer', jobCode: 'JOB-2026-046',
    assessmentName: 'UI/UX Design', assessmentSub: 'Practical Test',
    type: 'Practical', duration: '90 min', status: 'Completed', score: '36/50', percentile: '68%', percentileLabel: 'Good', completedOn: '13 Jun 2026, 04:15 PM'
  },
  {
    id: '5',
    candidate: { name: 'Neha Yadav', email: 'neha.yadav@email.com', phone: '+91 99111 22334' },
    jobTitle: 'Business Analyst', jobCode: 'JOB-2026-045',
    assessmentName: 'Analytical Reasoning Test',
    type: 'Aptitude', duration: '50 min', status: 'Pending'
  },
  {
    id: '6',
    candidate: { name: 'Vikas Sharma', email: 'vikas.sharma@email.com', phone: '+91 98855 66778' },
    jobTitle: 'DevOps Engineer', jobCode: 'JOB-2026-044',
    assessmentName: 'DevOps & Cloud Assessment',
    type: 'Technical', duration: '70 min', status: 'Overdue', completedOn: '10 Jun 2026, (3 days overdue)'
  },
  {
    id: '7',
    candidate: { name: 'Ritika Agarwal', email: 'ritika.agarwal@email.com', phone: '+91 90012 34567' },
    jobTitle: 'Accountant', jobCode: 'JOB-2026-043',
    assessmentName: 'Accounting & Tally Test',
    type: 'Skill Test', duration: '45 min', status: 'Completed', score: '40/50', percentile: '88%', percentileLabel: 'Very Good', completedOn: '12 Jun 2026, 02:30 PM'
  },
  {
    id: '8',
    candidate: { name: 'Saurabh Kumar', email: 'saurabh.k@email.com', phone: '+91 98123 87654' },
    jobTitle: 'Data Analyst', jobCode: 'JOB-2026-042',
    assessmentName: 'Data Analysis Case Study',
    type: 'Practical', duration: '60 min', status: 'In Progress'
  }
]

const AssessmentsPage: React.FC = () => {
  const [search, setSearch] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [selectedOpening, setSelectedOpening] = useState<string>('All Openings')
  const [selectedType, setSelectedType] = useState<string>('All Types')

  // Button actions alert triggers for full interactivity
  const handleActionClick = (actionName: string, entity?: string) => {
    alert(`${actionName} triggered ${entity ? `for ${entity}` : ''}`)
  }

  return (
    <PageLayout>

    <div className="w-full h-[calc(100vh-48px)] flex flex-col gap-1.5 p-2 bg-slate-50 overflow-hidden text-slate-900 font-sans">
      
      {/* ---------- HEADER SECTION ---------- */}
      <div className="w-full flex items-center justify-between gap-2 shrink-0 h-[6%]">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-slate-900 flex items-center gap-1">
            Assessments <HelpCircle className="w-3.5 h-3.5 text-indigo-600 inline cursor-pointer" />
          </h1>
          <p className="text-[10px] font-medium text-slate-600">Evaluate candidates with skill tests and assessments</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => handleActionClick('Export data')} className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1 hover:bg-slate-50 transition-colors">
            <Download className="w-3 h-3 text-slate-700" /> Export
          </button>
          <button onClick={() => handleActionClick('View Assessment Reports')} className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1 hover:bg-slate-50 transition-colors">
            <BarChart3 className="w-3 h-3 text-slate-700" /> Assessment Reports
          </button>
          <button onClick={() => handleActionClick('Create Assessment')} className="flex items-center gap-1 text-[11px] font-semibold text-white bg-indigo-600 rounded px-2.5 py-1 hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5 text-white" /> Create Assessment
          </button>
        </div>
      </div>

      {/* ---------- TOP COUNTER METRICS CARD GRID ---------- */}
      <div className="w-full grid grid-cols-5 gap-2 shrink-0 h-[11%]">
     {initialStats.map((stat) => {
  const Icon = stat.icon;

  return (
    <div
      key={stat.id}
      onClick={() => setActiveTab(stat.id)}
      className={`bg-white rounded-lg border p-2 flex items-center gap-2 cursor-pointer transition-all hover:shadow-sm ${
        activeTab === stat.id
          ? "border-indigo-500 ring-1 ring-indigo-500"
          : "border-slate-300"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${stat.bgIcon} mr-2`}
      >
        <Icon className={`w-4 h-4 ${stat.iconColor}`} strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-slate-900 tabular-nums">
            {stat.count}
          </span>

          {stat.isTrend && (
            <span className="text-[9px] font-bold text-emerald-600 whitespace-nowrap">
              {stat.trendText}
            </span>
          )}
        </div>

        <span className="text-[10px] font-bold text-slate-800 truncate leading-tight">
          {stat.label}
        </span>

        {stat.subtext && (
          <span className="text-[9px] font-medium text-slate-500 whitespace-nowrap">
            {stat.subtext}
          </span>
        )}
      </div>
    </div>
  );
})}
      </div>

      {/* ---------- FILTER AND CONTROL BAR ---------- */}
      <div className="w-full bg-white border border-slate-300 rounded-lg p-2 flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Main Search Input */}
          <div className="relative w-72">
            <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by candidate name, assessment name or job..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-[11px] font-medium border border-slate-300 rounded bg-slate-50 focus:outline-none focus:border-indigo-500 text-slate-900 placeholder-slate-500"
            />
          </div>
          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-50">
              <Filter className="w-3 h-3 text-slate-700" /> Filters <span className="bg-indigo-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]">1</span>
            </button>
            <button onClick={() => { setSearch(''); setSelectedOpening('All Openings'); setSelectedType('All Types'); }} className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-50">
              <RotateCcw className="w-3 h-3 text-slate-700" /> Clear All
            </button>
          </div>
        </div>

        {/* Dropdowns Filters Row */}
        <div className="grid grid-cols-6 gap-1.5">
          {[
            { label: 'Job Opening', value: selectedOpening, setter: setSelectedOpening, options: ['All Openings', 'Digital Marketing Executive', 'Software Developer'] },
            { label: 'Assessment Type', value: selectedType, setter: setSelectedType, options: ['All Types', 'Skill Test', 'Technical', 'Aptitude'] },
            { label: 'Department', value: 'All Departments', options: ['All Departments'] },
            { label: 'Status', value: 'All Status', options: ['All Status'] },
            { label: 'Created By', value: 'All Users', options: ['All Users'] },
            { label: 'Date Range', value: '01 Jun 2026 - 15 Jun 2026', options: ['01 Jun 2026 - 15 Jun 2026'] }
          ].map((drop, index) => (
            <div key={index} className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold text-slate-700">{drop.label}</label>
              <div className="relative cursor-pointer">
                <select 
                  className="w-full bg-white border border-slate-300 rounded px-1.5 py-0.5 pr-5 text-[10px] font-semibold text-slate-900 outline-none appearance-none cursor-pointer"
                  value={drop.value}
                  onChange={(e) => drop.setter && drop.setter(e.target.value)}
                >
                  {drop.options.map((opt, oIdx) => <option key={oIdx} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-700 absolute right-1.5 top-1.5 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- TABS NAVIGATION ---------- */}
      <div className="w-full border-b border-slate-300 flex items-center justify-between shrink-0 h-[5%]">
        <div className="flex gap-4">
          {[
            { key: 'all', label: 'All Assessments', count: 56 },
            { key: 'completed', label: 'Completed', count: 24 },
            { key: 'progress', label: 'In Progress', count: 18 },
            { key: 'pending', label: 'Pending', count: 8 },
            { key: 'overdue', label: 'Overdue', count: 6 }
          ].map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-1 text-[11px] font-bold transition-all relative ${activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-700 hover:text-slate-900'}`}
            >
              {tab.label} <span className="text-[10px] text-slate-500 font-semibold">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pb-0.5">
          <button className="flex items-center gap-1 border border-slate-300 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 bg-white">
            <Grid className="w-3 h-3 text-slate-700" /> Columns
          </button>
          <div className="relative">
            <select className="bg-white border border-slate-300 rounded pl-1.5 pr-4 py-0.5 text-[10px] font-semibold text-slate-700 appearance-none outline-none">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
            <ChevronDown className="w-2.5 h-2.5 text-slate-700 absolute right-1.5 top-1.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ---------- DATA TABLE CONTAINER ---------- */}
      <div className="w-full flex-1 overflow-auto bg-white border border-slate-300 rounded-lg">
        <table className="w-full table-auto border-collapse text-left">
          <thead className="bg-slate-50 sticky top-0 z-20 border-b border-slate-300 text-[10px] font-bold text-slate-800">
            <tr>
              <th className="p-2 w-8"><input type="checkbox" className="rounded text-indigo-600" /></th>
              <th className="p-2">Candidate</th>
              <th className="p-2">Job Opening</th>
              <th className="p-2">Assessment</th>
              <th className="p-2">Type</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Status</th>
              <th className="p-2">Score</th>
              <th className="p-2">Percentile</th>
              <th className="p-2">Completed On</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[11px] font-medium text-slate-900">
            {initialRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {/* Checkbox */}
                <td className="p-2"><input type="checkbox" className="rounded border-slate-300 text-indigo-600" /></td>
                
                {/* Candidate Info */}
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[9px] uppercase shrink-0">
                      {row.candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-950 truncate">{row.candidate.name}</span>
                      <span className="text-[10px] text-slate-600 truncate">{row.candidate.email}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{row.candidate.phone}</span>
                    </div>
                  </div>
                </td>

                {/* Job Details */}
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-tight">{row.jobTitle}</span>
                    <span className="text-[9px] text-slate-600 font-mono mt-0.5">{row.jobCode}</span>
                  </div>
                </td>

                {/* Assessment Name */}
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-tight">{row.assessmentName}</span>
                    {row.assessmentSub && <span className="text-[9px] text-slate-600">{row.assessmentSub}</span>}
                  </div>
                </td>

                {/* Type Badge */}
                <td className="p-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    row.type === 'Skill Test' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                    row.type === 'Technical' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    row.type === 'Aptitude' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {row.type}
                  </span>
                </td>

                {/* Duration */}
                <td className="p-2 font-semibold text-slate-800">{row.duration}</td>

                {/* Status Badge */}
                <td className="p-2">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                    row.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                    row.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {row.status === 'Completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {row.status === 'In Progress' && <Clock className="w-2.5 h-2.5" />}
                    {row.status === 'Pending' && <AlertCircle className="w-2.5 h-2.5" />}
                    {row.status === 'Overdue' && <AlertCircle className="w-2.5 h-2.5" />}
                    {row.status}
                  </span>
                </td>

                {/* Score */}
                <td className="p-2 font-bold text-slate-900 tabular-nums">{row.score || '--'}</td>

                {/* Percentile Rank */}
                <td className="p-2">
                  {row.percentile ? (
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-700 tabular-nums">{row.percentile}</span>
                      <span className="text-[8px] font-bold text-emerald-600 leading-none">{row.percentileLabel}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono">--</span>
                  )}
                </td>

                {/* Completed Datetime */}
                <td className="p-2">
                  {row.completedOn ? (
                    <span className={`text-[10px] ${row.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-800 font-semibold'}`}>
                      {row.completedOn}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">--</span>
                  )}
                </td>

                {/* Actions Icons */}
                <td className="p-2">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => handleActionClick('View Record', row.candidate.name)}
                      className="p-1 rounded text-slate-700 hover:bg-slate-100 transition-colors" 
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {row.status === 'In Progress' ? (
                      <button 
                        onClick={() => handleActionClick('Resume/Monitor Test', row.candidate.name)}
                        className="p-1 rounded text-indigo-600 hover:bg-slate-100 transition-colors"
                        title="Resume Test"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleActionClick('Open More Menu', row.candidate.name)}
                        className="p-1 rounded text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- FOOTER PAGINATION BAR ---------- */}
      <div className="w-full flex items-center justify-between border border-slate-300 bg-white rounded-lg p-1.5 shrink-0 h-[6%] text-[11px] font-bold text-slate-800">
        <div>
          Showing <span className="text-slate-950 font-extrabold">1</span> to <span className="text-slate-950 font-extrabold">10</span> of <span className="text-slate-950 font-extrabold">56</span> entries
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span>Show</span>
            <div className="relative">
              <select className="bg-slate-50 border border-slate-300 rounded px-1 py-0.5 pr-4 font-bold text-slate-950 appearance-none outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-800 absolute right-1 top-1 pointer-events-none" />
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-0.5">
            <button className="p-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100">
              <ChevronLeft className="w-3.5 h-3.5 text-slate-800" />
            </button>
            {['1', '2', '3', '...', '6'].map((page, idx) => (
              <button 
                key={idx} 
                className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${page === '1' ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-800'}`}
              >
                {page}
              </button>
            ))}
            <button className="p-1 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100">
              <ChevronRight className="w-3.5 h-3.5 text-slate-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>

  )
}

export default AssessmentsPage