import React from 'react';
import {
  Ticket,
  Wallet,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Plus,
  MessageSquare,
  FileText,
  ChevronRight,
  Headphones,
  Laptop,
  Plane,
  CreditCard,
  User,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Shield,
  Star,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// Dummy Data
const topStats = [
  { id: 1, title: 'Total Tickets', value: '28', subtitle: 'All time', linkText: 'View all tickets', icon: Ticket, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 2, title: 'Open', value: '10', subtitle: 'Need your attention', linkText: 'View open tickets', icon: Wallet, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 3, title: 'In Progress', value: '6', subtitle: 'Being worked on', linkText: 'View in progress', icon: Clock, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
  { id: 4, title: 'Resolved', value: '10', subtitle: 'This month', linkText: 'View resolved', icon: CheckCircle2, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 5, title: 'SLA Compliance', value: '96%', subtitle: 'This month', linkText: 'View report', icon: ShieldCheck, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
];

const tickets = [
  {
    id: '#HD-2024-1028',
    subject: 'Laptop not working',
    category: 'IT Support',
    priority: 'High',
    priorityIcon: ArrowUp,
    priorityColor: 'text-red-600 bg-red-50 border-red-100',
    status: 'In Progress',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    raisedOn: { date: '24 May 2024', time: '10:30 AM' },
    updatedOn: { date: '24 May 2024', time: '02:15 PM' },
    icon: Laptop,
    iconColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: '#HD-2024-1027',
    subject: 'Salary slip correction',
    category: 'Payroll',
    priority: 'Medium',
    priorityIcon: Minus,
    priorityColor: 'text-orange-500 bg-orange-50 border-orange-100',
    status: 'Open',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    raisedOn: { date: '23 May 2024', time: '09:20 AM' },
    updatedOn: { date: '23 May 2024', time: '09:20 AM' },
    icon: Wallet,
    iconColor: 'text-emerald-600 bg-emerald-50'
  },
  {
    id: '#HD-2024-1026',
    subject: 'Travel reimbursement',
    category: 'Reimbursement',
    priority: 'Medium',
    priorityIcon: Minus,
    priorityColor: 'text-orange-500 bg-orange-50 border-orange-100',
    status: 'In Progress',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    raisedOn: { date: '22 May 2024', time: '05:40 PM' },
    updatedOn: { date: '24 May 2024', time: '11:05 AM' },
    icon: Plane,
    iconColor: 'text-purple-600 bg-purple-50'
  },
  {
    id: '#HD-2024-1025',
    subject: 'Access to HRMS portal',
    category: 'IT Support',
    priority: 'Low',
    priorityIcon: ArrowDown,
    priorityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    status: 'Resolved',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    raisedOn: { date: '21 May 2024', time: '11:10 AM' },
    updatedOn: { date: '22 May 2024', time: '04:30 PM' },
    icon: CreditCard,
    iconColor: 'text-orange-500 bg-orange-50'
  },
  {
    id: '#HD-2024-1024',
    subject: 'Change in personal details',
    category: 'HR Services',
    priority: 'Low',
    priorityIcon: ArrowDown,
    priorityColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    status: 'Resolved',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    raisedOn: { date: '20 May 2024', time: '02:25 PM' },
    updatedOn: { date: '21 May 2024', time: '10:15 AM' },
    icon: User,
    iconColor: 'text-cyan-500 bg-cyan-50'
  },
];

const quickActions = [
  { id: 1, title: 'Raise New Request', subtitle: 'Submit a new request', icon: Plus, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 2, title: 'My Tickets', subtitle: 'View all my tickets', icon: Ticket, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 3, title: 'Check Status', subtitle: 'Track your request', icon: FileText, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 4, title: 'Live Chat', subtitle: 'Chat with support', icon: MessageSquare, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
];

const knowledgeBase = [
  { id: 1, title: 'How to connect to office VPN', subtitle: 'Step-by-step guide', icon: Laptop, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 2, title: 'How to apply for leave', subtitle: 'Leave policy and process', icon: Wallet, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 3, title: 'How to upload documents', subtitle: 'Document upload guide', icon: FileText, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 4, title: 'IT support - FAQs', subtitle: 'Common IT issues and solutions', icon: Ticket, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
];

export default function EmployeeHelpdesk() {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Employee Helpdesk</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Employee Helpdesk</h1>
            <p className="text-[10px] text-zinc-500 mt-1">Raise a request, track status and get quick resolution.</p>
          </div>
          <div>
            <button className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Raise New Request
            </button>
          </div>
        </div>

        {/* Top Stats Row — single card with dividers */}
        <div className="flex gap-2 mb-2">
          {topStats.map((stat) => (
            <div key={stat.id} className="flex-1 flex items-start gap-4 p-5 min-w-0 border border-zinc-200 bg-white rounded-xl shadow-sm">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.iconColor} />
              </div>
              <div className="flex flex-col justify-between min-w-0">
                <p className="text-[10px] font-semibold text-zinc-700 truncate">{stat.title}</p>
                <h3 className="mt-0.5 text-2xl font-bold text-zinc-900 leading-none">{stat.value}</h3>
                <p className="text-[9px] text-zinc-400 mt-1">{stat.subtitle}</p>
                <Link href="#" className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                  {stat.linkText} <ChevronRight size={10} />
                </Link>
              </div>
            </div>
          ))}
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

          {/* Left Column (Main Area) */}
          <div className="lg:col-span-8 flex flex-col gap-2">

            {/* Tickets Table Section */}
            <div className="rounded-xl border border-zinc-200 bg-blue-50/50  p-5 shadow-sm">
              {/* Tabs and Actions */}
              <div className="flex items-center justify-between border-b border-zinc-100 mb-4 pb-0">
                <div className="flex items-center gap-6 h-full">
                  <button className="border-b-2 border-[#1d4ed8] pb-3 text-[10px] font-bold text-[#1d4ed8] pt-1">
                    My Tickets
                  </button>
                  <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800 pt-1">
                    Open
                  </button>
                  <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800 pt-1">
                    In Progress
                  </button>
                  <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800 pt-1">
                    Resolved
                  </button>
                  <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800 pt-1">
                    Closed
                  </button>
                </div>
                <div className="flex items-center gap-2 pb-3">
                  <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                    <Filter size={12} /> Filter
                  </button>
                  <div className="relative w-48">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      className="w-full rounded-md border border-zinc-200 py-1.5 pl-3 pr-8 text-[10px] outline-none focus:border-[#1d4ed8]"
                    />
                    <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-900">
                      <th className="pb-3 px-2 font-bold">Ticket Details</th>
                      <th className="pb-3 px-2 font-bold">Category</th>
                      <th className="pb-3 px-2 font-bold">Priority</th>
                      <th className="pb-3 px-2 font-bold">Status</th>
                      <th className="pb-3 px-2 font-bold">Raised On</th>
                      <th className="pb-3 px-2 font-bold">Updated On</th>
                      <th className="pb-3 px-2 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-md ${ticket.iconColor}`}>
                              <ticket.icon size={14} />
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900">{ticket.subject}</p>
                              <p className="text-[9px] text-zinc-500 font-medium">{ticket.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-zinc-800">{ticket.category}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-semibold border ${ticket.priorityColor}`}>
                            <ticket.priorityIcon size={10} /> {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-semibold border bg-transparent ${ticket.statusColor.replace('bg-', 'bg-opacity-10 bg-')}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-zinc-800">{ticket.raisedOn.date}</p>
                          <p className="text-[9px] text-zinc-500">{ticket.raisedOn.time}</p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-zinc-800">{ticket.updatedOn.date}</p>
                          <p className="text-[9px] text-zinc-500">{ticket.updatedOn.time}</p>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 text-[#2d56c7] hover:text-[#1d4ed8] hover:bg-blue-50 rounded-md transition-colors border border-blue-100 bg-blue-50">
                              <Eye size={12} />
                            </button>
                            <button className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                              <MoreVertical size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-zinc-500 font-medium">Showing 1 to 5 of 28 tickets</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">‹</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded bg-[#1d4ed8] text-white font-medium">1</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50">2</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50">3</button>
                    <span className="flex h-6 items-center justify-center text-zinc-400 px-1">...</span>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50">6</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">›</button>
                  </div>
                  <button className="flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-[10px] font-medium text-zinc-700 ml-2 hover:bg-zinc-50">
                    5 / page <ChevronDown size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-2 ">

              {/* We're here to help! */}
              <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] shadow-sm p-5">
                <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1">We're here to help!</h3>
                <p className="text-[10px] text-zinc-500 mb-5">Our support team is committed to providing you the best experience.</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[#1d4ed8] shadow-sm">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">Quick Response</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">We usually respond within<br />30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-[#1d4ed8] shadow-sm">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">Expert Support</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">Our team of experts is<br />ready to assist you</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-emerald-600 shadow-sm">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#1a1c21] leading-tight">SLA Driven</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 leading-tight">We ensure timely resolution<br />as per SLA policy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How was your support experience? */}
              <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1">How was your support experience?</h3>
                  <p className="text-[10px] text-zinc-500 mb-5">Rate your last interaction with our support team</p>

                  <div className="flex items-center gap-1.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={22} className="text-[#3b4758] hover:text-[#1d4ed8] cursor-pointer transition-colors" />
                    ))}
                  </div>
                </div>

                <Link href="#" className="text-[11px] font-bold text-[#1d4ed8] hover:underline">
                  Submit Feedback
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-2">

            {/* Quick Actions */}
            <div className="rounded-xl border border-zinc-200 bg-[#fcfdff] p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-[#1a1c21] mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm hover:border-[#1d4ed8]/30 hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${action.iconBg}`}>
                      <action.icon size={16} className={action.iconColor} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#1a1c21] group-hover:text-[#1d4ed8] transition-colors leading-tight mb-0.5">{action.title}</p>
                      <p className="text-[9px] text-zinc-500 leading-tight">{action.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="rounded-xl border border-zinc-200 bg-blue-50/50  p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold text-zinc-900">Knowledge Base</h3>
                <Link href="#" className="flex items-center gap-1 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                {knowledgeBase.map((kb) => (
                  <Link key={kb.id} href="#" className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${kb.iconBg}`}>
                        <kb.icon size={14} className={kb.iconColor} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-zinc-800 group-hover:text-[#1d4ed8] transition-colors leading-tight">{kb.title}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{kb.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-400 group-hover:text-[#1d4ed8]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Need immediate help? */}
            <div className="rounded-xl bg-blue-50/50 p-5 border border-blue-100 flex flex-col items-start relative overflow-hidden">
              <div className="relative z-10 w-[75%]">
                <h3 className="text-[11px] font-bold text-zinc-900 mb-1">Need immediate help?</h3>
                <p className="text-[10px] text-zinc-600 mb-2 leading-relaxed">
                  Our support team is here for you<br />Monday to Friday, 9 AM to 6 PM
                </p>
                <button className="flex items-center justify-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-4 py-2 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors">
                  <Headphones size={12} /> Contact Support Team
                </button>
              </div>

              {/* Illustration decoration */}
              <div className="absolute -right-4 bottom-0 h-32 w-32 translate-y-4">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100/50 opacity-50">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-200/50">
                    <Headphones size={48} className="text-[#1d4ed8] opacity-80" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
