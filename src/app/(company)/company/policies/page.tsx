import React from 'react';
import {
  UploadCloud,
  FilePlus,
  Book,
  FileText,
  ClipboardList,
  BookOpen,
  Download,
  Search,
  Filter,
  ChevronDown,
  Eye,
  MoreVertical,
  ChevronRight,
  Info,
  Bell,
  FolderOpen,
  ShieldCheck,
  Monitor,
  Landmark,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import book from '../../../../../public/assets/book.png'


// Dummy Data
const topStats = [
  { id: 1, title: 'Total Documents', value: '128', linkText: 'View all documents', icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 2, title: 'Policy Documents', value: '42', linkText: 'View policies', icon: FileText, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 3, title: 'Forms & Templates', value: '36', linkText: 'View forms', icon: ClipboardList, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
  { id: 4, title: 'Guidelines', value: '28', linkText: 'View guidelines', icon: BookOpen, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 5, title: 'Downloads (This Month)', value: '156', linkText: 'View download history', icon: Download, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
];

const categories = [
  { id: 1, name: 'HR Policies', count: '18 Documents', icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 2, name: 'Leave Policies', count: '8 Documents', icon: FileText, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 3, name: 'Finance Policies', count: '9 Documents', icon: Landmark, iconColor: 'text-orange-500', iconBg: 'bg-orange-50' },
  { id: 4, name: 'IT Policies', count: '11 Documents', icon: Monitor, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
  { id: 5, name: 'Employee Handbook', count: '5 Documents', icon: BookOpen, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' },
  { id: 6, name: 'Compliance', count: '7 Documents', icon: ShieldCheck, iconColor: 'text-teal-600', iconBg: 'bg-teal-50' },
];

const documents = [
  { id: 1, name: 'Leave Policy', type: 'Company Policy', category: 'HR Policies', categoryColor: 'text-blue-600 bg-blue-50', version: 'v2.1', lastUpdated: '20 May 2024', updatedBy: { name: 'Amit Sharma', role: 'HR Manager', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' } },
  { id: 2, name: 'Code of Conduct', type: 'Company Policy', category: 'HR Policies', categoryColor: 'text-blue-600 bg-blue-50', version: 'v3.0', lastUpdated: '15 May 2024', updatedBy: { name: 'Swati Verma', role: 'HR Manager', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' } },
  { id: 3, name: 'Reimbursement Policy', type: 'Finance Policy', category: 'Finance Policies', categoryColor: 'text-orange-500 bg-orange-50', version: 'v1.4', lastUpdated: '10 May 2024', updatedBy: { name: 'Vikas Mittal', role: 'Finance Head', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' } },
  { id: 4, name: 'Work From Office Policy', type: 'IT Policy', category: 'IT Policies', categoryColor: 'text-purple-600 bg-purple-50', version: 'v1.2', lastUpdated: '08 May 2024', updatedBy: { name: 'Rishav Kumar', role: 'IT Manager', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' } },
  { id: 5, name: 'Employee Handbook 2024', type: 'Employee Handbook', category: 'Employee Handbook', categoryColor: 'text-rose-500 bg-rose-50', version: 'v4.0', lastUpdated: '01 May 2024', updatedBy: { name: 'Swati Verma', role: 'HR Manager', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' } },
];

const quickLinks = [
  { id: 1, name: 'All Company Policies', icon: Book, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 2, name: 'HR Forms & Templates', icon: FileText, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 3, name: 'Downloadable Forms', icon: Download, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { id: 4, name: 'Compliance Documents', icon: ShieldCheck, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { id: 5, name: 'FAQ & Guidelines', icon: Info, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' },
  { id: 6, name: 'Document Retention Policy', icon: FileText, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
];

const documentRequests = [
  { id: 1, name: 'Hybrid Work Policy', date: 'Requested on: 21 May 2024', status: 'Under Review', statusColor: 'text-blue-600 bg-blue-50 border-blue-100', icon: FileText, iconColor: 'text-blue-500' },
  { id: 2, name: 'Internet Usage Policy', date: 'Requested on: 10 May 2024', status: 'Approved', statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: FileText, iconColor: 'text-orange-400' },
  { id: 3, name: 'Gift & Entertainment Policy', date: 'Requested on: 05 May 2024', status: 'Under Review', statusColor: 'text-blue-600 bg-blue-50 border-blue-100', icon: FileText, iconColor: 'text-purple-500' },
];

export default function PoliciesAndDocuments() {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Policies & Documents</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Policies & Documents</h1>
            <p className="text-[10px] text-zinc-500 mt-1">Access company policies, guidelines, forms and important documents.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-4 py-1.5 text-[11px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors">
              <UploadCloud size={14} /> Upload Document
            </button>
            <button className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <FilePlus size={14} /> Request New Policy
            </button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-2">
          {topStats.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
                  <stat.icon size={22} className={stat.iconColor} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-[#1a1c21] mb-0.5">{stat.title}</p>
                  <h3 className="text-xl font-black text-[#1a1c21] leading-none mb-1.5">{stat.value}</h3>
                  <Link href="#" className="flex items-center gap-1 text-[9.5px] font-bold text-[#1d4ed8] hover:underline">
                    {stat.linkText} <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

          {/* Left Column (Main Area) */}
          <div className="lg:col-span-8 flex flex-col gap-2">

            {/* Browse by Category */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[12px] font-bold text-[#1a1c21]">Browse by Category</h3>
                <Link href="#" className="flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] hover:underline">
                  View All Categories <ArrowRight size={10} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${category.iconBg} shadow-sm group-hover:shadow-md transition-shadow`}>
                      <category.icon size={18} className={category.iconColor} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#1a1c21] group-hover:text-[#1d4ed8] transition-colors leading-tight">{category.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document List Section */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-zinc-100 mb-4">
                <button className="border-b-2 border-[#1d4ed8] pb-3 text-[10px] font-bold text-[#1d4ed8]">
                  Recent Documents
                </button>
                <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800">
                  Most Downloaded
                </button>
                <button className="border-b-2 border-transparent pb-3 text-[10px] font-medium text-zinc-500 hover:text-zinc-800">
                  Recently Updated
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full rounded-md border border-zinc-200 py-1.5 pl-8 pr-3 text-[10px] outline-none focus:border-[#1d4ed8]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                    <Filter size={12} /> Filter
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                    All Categories <ChevronDown size={12} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-900">
                      <th className="pb-3 px-2 font-bold">Document Name</th>
                      <th className="pb-3 px-2 font-bold">Category</th>
                      <th className="pb-3 px-2 font-bold">Version</th>
                      <th className="pb-3 px-2 font-bold">Last Updated</th>
                      <th className="pb-3 px-2 font-bold">Updated By</th>
                      <th className="pb-3 px-2 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded font-bold text-[8px] border ${doc.name.includes('Reimbursement') ? 'bg-blue-50 text-[#1d4ed8] border-blue-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                              {doc.name.includes('Reimbursement') ? 'DOCX' : 'PDF'}
                            </div>
                            <div>
                              <p className="font-bold text-[#1a1c21]">{doc.name}</p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">{doc.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border border-transparent ${doc.categoryColor} bg-opacity-50`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-zinc-700">{doc.version}</td>
                        <td className="py-3 px-2 font-medium text-[#1a1c21]">{doc.lastUpdated}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <img src={doc.updatedBy.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-[#1a1c21] leading-none">{doc.updatedBy.name}</p>
                              <p className="text-[9px] text-zinc-500 mt-1 leading-none">{doc.updatedBy.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-[#f4f7ff] text-[#1d4ed8] hover:bg-blue-100 transition-colors">
                              <Eye size={12} />
                            </button>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-[#f4f7ff] text-[#1d4ed8] hover:bg-blue-100 transition-colors">
                              <Download size={12} />
                            </button>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 transition-colors">
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
                <p className="text-[10px] text-zinc-500">Showing 1 to 5 of 12 documents</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">‹</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded bg-[#1d4ed8] text-white font-medium">1</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50">2</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-700 hover:bg-zinc-50">3</button>
                    <button className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 text-zinc-500 hover:bg-zinc-50">›</button>
                  </div>
                  <button className="flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 text-[10px] font-medium text-zinc-700 ml-2">
                    5 / page <ChevronDown size={10} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stay Informed Banner */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1d4ed8] text-white">
                  <Info size={16} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-900">Stay Informed</h4>
                  <p className="text-[10px] text-zinc-600 mt-0.5">We regularly update our policies to ensure compliance and provide the best work environment.</p>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-md border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors">
                <Bell size={12} /> Subscribe to Updates
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-2">

            {/* Quick Links */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="text-[12px] font-bold text-[#1a1c21] mb-5">Quick Links</h3>
              <div className="flex flex-col gap-1">
                {quickLinks.map((link) => (
                  <Link key={link.id} href="#" className="flex items-center justify-between p-1.5 hover:bg-zinc-50 transition-colors group rounded-md">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${link.iconBg}`}>
                        <link.icon size={14} className={link.iconColor} />
                      </div>
                      <span className="text-[11px] font-bold text-[#1a1c21] group-hover:text-[#1d4ed8] transition-colors">{link.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-400 group-hover:text-[#1a1c21]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Document Requests */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[12px] font-bold text-[#1a1c21]">Document Requests</h3>
                <Link href="#" className="flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] hover:underline">
                  View All <ArrowRight size={10} />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {documentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 ${req.iconColor}`}>
                        <req.icon size={12} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#1a1c21] leading-tight mb-0.5">{req.name}</p>
                        <p className="text-[9px] text-zinc-500">{req.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${req.statusColor}`}>
                        {req.status}
                      </span>
                      <ChevronRight size={14} className="text-zinc-300 hover:text-zinc-500 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need a Document? */}
            <div className="rounded-xl bg-[#f4f7ff] p-5 border border-blue-100 flex items-center justify-between overflow-hidden">
              <div className="flex-1 pr-4">
                <h3 className="text-[12px] font-bold text-[#1a1c21] mb-1.5">Need a Document?</h3>
                <p className="text-[10px] text-zinc-600 mb-4 leading-relaxed pr-2">
                  Can't find the document you're looking for? Raise a request and we'll get back to you.
                </p>
                <button className="flex items-center justify-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-4 py-1.5 text-[10px] font-bold text-[#1d4ed8] shadow-sm hover:bg-blue-50 transition-colors w-max">
                  <Bell size={12} /> Request Document
                </button>
              </div>

              {/* Illustration decoration */}
              <div className="w-[100px] h-[80px] relative shrink-0">
                <Image src={book} alt="Document Request" fill className="object-contain object-right" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
