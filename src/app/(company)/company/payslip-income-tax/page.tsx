'use client';

import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  IndianRupee, Wallet, Banknote, Calculator, FileCheck2, CheckCircle2,
  Search, Filter, ChevronDown, Eye, Download, ChevronLeft, ChevronRight,
  ArrowRight, FileText, ShieldCheck, FileSignature, Landmark, History,
  LayoutDashboard, ScaleIcon, Scale, HeadphonesIcon, ClipboardEdit,
  Calendar, Info, MessageSquarePlus,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────

const summaryStats = [
  {
    icon: IndianRupee,
    accent: 'bg-blue-50 text-blue-600',
    label: 'Monthly Take Home',
    value: '₹78,450',
    detail: 'May 2024',
    link: 'View Payslip',
  },
  {
    icon: Wallet,
    accent: 'bg-emerald-50 text-emerald-600',
    label: 'CTC (Annual)',
    value: '₹12,60,000',
    detail: 'Financial Year 2023-24',
    link: 'View Details',
  },
  {
    icon: Banknote,
    accent: 'bg-amber-50 text-amber-500',
    label: 'Total Deductions (MTD)',
    value: '₹21,550',
    detail: 'May 2024',
    link: 'View Breakup',
  },
  {
    icon: Calculator,
    accent: 'bg-violet-50 text-violet-600',
    label: 'Income Tax (FY 2023-24)',
    value: '₹1,24,800',
    detail: 'Total Tax Paid',
    link: 'View Tax Summary',
  },
  {
    icon: FileCheck2,
    accent: 'bg-teal-50 text-teal-600',
    label: 'Form 16',
    value: 'Available',
    valueExtra: true,
    detail: 'FY 2023-24',
    link: 'Download Now',
  },
];

const tabs = ['Payslips', 'Income Tax', 'Tax Saving Investments', 'Declarations', 'Forms & Documents'];

const payslips = [
  { month: 'May 2024', monthSub: 'May Salary', payDate: '31 May 2024', paySub: 'Paid on', takeHome: '78,450', gross: '1,00,000', deductions: '21,550', status: 'Paid' },
  { month: 'Apr 2024', monthSub: 'April Salary', payDate: '30 Apr 2024', paySub: 'Paid on', takeHome: '78,450', gross: '1,00,000', deductions: '21,550', status: 'Paid' },
  { month: 'Mar 2024', monthSub: 'March Salary', payDate: '31 Mar 2024', paySub: 'Paid on', takeHome: '78,450', gross: '1,00,000', deductions: '21,550', status: 'Paid' },
  { month: 'Feb 2024', monthSub: 'February Salary', payDate: '29 Feb 2024', paySub: 'Paid on', takeHome: '78,450', gross: '1,00,000', deductions: '21,550', status: 'Paid' },
  { month: 'Jan 2024', monthSub: 'January Salary', payDate: '31 Jan 2024', paySub: 'Paid on', takeHome: '78,450', gross: '1,00,000', deductions: '21,550', status: 'Paid' },
];

const importantDocuments = [
  { icon: FileText, accent: 'bg-blue-50 text-blue-600', title: 'Form 16', sub: 'FY 2023-24', link: 'Download' },
  { icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-600', title: 'Investment Proofs', sub: 'FY 2023-24', link: 'Upload/View' },
  { icon: FileSignature, accent: 'bg-violet-50 text-violet-600', title: 'Salary Certificate', sub: 'Request Letter', link: 'Request' },
  { icon: Landmark, accent: 'bg-amber-50 text-amber-600', title: 'Loan Certificate', sub: 'For Home/Other Loan', link: 'Request' },
  { icon: History, accent: 'bg-rose-50 text-rose-600', title: 'Previous Employment', sub: 'Income Tax Calculation', link: 'View' },
];

const earningsBreakdown = [
  { key: 'Total Earnings', value: 100000, pct: '100%', color: '#22c55e' },
  { key: 'Total Deductions', value: 21550, pct: '21.55%', color: '#ef4444' },
];

const yearToDate = [
  { icon: Wallet, accent: 'bg-blue-50 text-blue-600', label: 'Gross Earnings', value: '₹1,00,000' },
  { icon: Banknote, accent: 'bg-rose-50 text-rose-600', label: 'Total Deductions', value: '₹21,550' },
  { icon: Calculator, accent: 'bg-amber-50 text-amber-600', label: 'Taxable Income', value: '₹6,74,000' },
  { icon: Scale, accent: 'bg-emerald-50 text-emerald-600', label: 'Tax Paid (TDS)', value: '₹1,24,800' },
];

const quickLinks = [
  { icon: LayoutDashboard, title: 'Income Tax Dashboard' },
  { icon: FileText, title: 'Form 16' },
  { icon: ShieldCheck, title: 'Investment Proofs' },
  { icon: ClipboardEdit, title: 'Declarations' },
  { icon: Scale, title: 'Tax Regime Comparison' },
  { icon: HeadphonesIcon, title: 'Help & Support' },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  action?: string | React.ReactNode;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
}

function Card({ title, action, className = '', children, titleExtra }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">
            {titleExtra}
            {action && (
              <button className="flex items-center gap-0.5 whitespace-nowrap text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                {action} <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header + breadcrumb
// ─────────────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="flex items-center gap-1.5 text-[12px] text-zinc-400">
          <span className="text-zinc-400">Dashboard</span>
          <span>›</span>
          <span className="font-semibold text-zinc-700">Payslip & Income Tax</span>
        </p>
        <h1 className="mt-1 text-[24px] font-bold text-zinc-900">Payslip & Income Tax</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">View your payslips, tax details and download important documents.</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
          <LayoutDashboard size={14} /> Income Tax Dashboard
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
          <Download size={14} /> Download Form 16
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Row 1 — five summary stat cards
// ─────────────────────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: (typeof summaryStats)[number] }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${stat.accent}`}>
          <stat.icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-zinc-500">{stat.label}</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[15px] font-bold leading-tight text-zinc-900">
            {stat.value}
            {stat.valueExtra && <CheckCircle2 size={14} className="text-emerald-500" />}
          </p>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-zinc-400">{stat.detail}</p>
      <button className="mt-auto flex items-center gap-1 pt-1.5 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        {stat.link} <ArrowRight size={12} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Payslip history table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function PayslipHistoryCard() {
  const [activeTab, setActiveTab] = useState('Payslips');

  return (
    <Card className="!p-0">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-zinc-100 px-4 pt-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 whitespace-nowrap pb-2.5 text-[12.5px] font-semibold transition-colors ${activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'border-b-2 border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        {/* Sub-header + filters */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-zinc-900">Payslip History</h4>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
              Financial Year: 2024-25 <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50">
              <Filter size={13} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-y border-zinc-100 bg-white">
                {['Month', 'Pay Date', 'Take Home Salary', 'Gross Salary', 'Deductions', 'Status', 'Action'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-1 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payslips.map((p) => (
                <tr key={p.month} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                  <td className="whitespace-nowrap px-1 py-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <Calendar size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-medium text-zinc-800">{p.month}</p>
                        <p className="text-[10px] text-zinc-400">{p.monthSub}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-1 py-1.5">
                    <p className="text-[11px] text-zinc-500">{p.payDate}</p>
                    <p className="text-[10px] text-zinc-400">{p.paySub}</p>
                  </td>
                  <td className="whitespace-nowrap px-1 py-1.5 text-[11px] font-semibold text-emerald-600">₹{p.takeHome}</td>
                  <td className="whitespace-nowrap px-1 py-1.5 text-[11px] font-medium text-zinc-800">₹{p.gross}</td>
                  <td className="whitespace-nowrap px-1 py-1.5 text-[11px] text-zinc-500">₹{p.deductions}</td>
                  <td className="px-1t py-1.5">
                    <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-1 py-1.5">
                    <div className="flex items-center gap-2">
                      <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Eye size={12} />
                      </button>
                      <button className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11.5px] text-zinc-400">Showing 1 to 5 of 12 payslips</p>
          <div className="flex items-center gap-1.5">
            <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
              <ChevronLeft size={14} />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white">1</button>
            <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">2</button>
            <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50">3</button>
            <button className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50">
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-600">
            5 / page <ChevronDown size={12} />
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Important Documents
// ─────────────────────────────────────────────────────────────────────────

function ImportantDocumentsCard() {
  return (
    <Card title="Important Documents">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {importantDocuments.map((d) => (
          <div key={d.title} className="flex min-w-0 flex-col gap-2 rounded-xl border border-zinc-100 p-2.5">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${d.accent}`}>
              <d.icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11.5px] font-semibold text-zinc-800">{d.title}</p>
              <p className="truncate text-[10.5px] text-zinc-400">{d.sub}</p>
            </div>
            <button className="mt-auto flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
              {d.link} <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Bottom banner — Need Help
// ─────────────────────────────────────────────────────────────────────────

function NeedHelpBanner() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
          <Info size={16} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-zinc-900">Need help with your payslip or income tax?</p>
          <p className="text-[11.5px] text-zinc-500">Raise a request with our HR team and we will get back to you.</p>
        </div>
      </div>
      <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-blue-700">
        <MessageSquarePlus size={14} /> Raise a Request
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Right sidebar
// ─────────────────────────────────────────────────────────────────────────

function EarningsVsDeductionsCard() {
  const gross = 10000;
  return (
    <Card title="Earnings vs Deductions" titleExtra={<span className="text-[10.5px] font-medium text-zinc-400">(May 2024)</span>}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-24 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={earningsBreakdown}
                dataKey="value"
                nameKey="key"
                innerRadius={32}
                outerRadius={46}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {earningsBreakdown.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10.5px] font-bold text-zinc-900">₹{gross.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-zinc-400">Gross Salary</span>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {earningsBreakdown.map((d) => (
            <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.key}
              </span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                ₹{d.value.toLocaleString('en-IN')} ({d.pct})
              </span>
            </div>
          ))}
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-zinc-100 pt-2">
            <span className="text-[11px] font-medium text-blue-600">Take Home Salary</span>
            <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">₹78(78%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function YearToDateCard() {
  return (
    <Card title="Year to Date" titleExtra={<span className="text-[10.5px] font-medium text-zinc-400">(FY 2024-25)</span>}>
      <div className="space-y-2.5">
        {yearToDate.map((y) => (
          <div key={y.label} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-[11.5px] font-medium text-zinc-600">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded ${y.accent}`}>
                <y.icon size={12} />
              </span>
              {y.label}
            </span>
            <span className="shrink-0 text-[11.5px] font-semibold text-zinc-800">{y.value}</span>
          </div>
        ))}
      </div>
      <button className="mt-3 flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
        View Full Tax Summary <ArrowRight size={12} />
      </button>
    </Card>
  );
}

function QuickLinksCard() {
  return (
    <Card title="Quick Links">
      <div className="grid grid-cols-3 gap-2">
        {quickLinks.map((q) => (
          <button
            key={q.title}
            className="flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-zinc-100 p-2 text-center transition-colors hover:border-blue-200 hover:bg-blue-50/40"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <q.icon size={14} />
            </span>
            <p className="text-[10.5px] font-medium leading-tight text-zinc-700">{q.title}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function PayslipIncomeTax() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      <PageHeader />

      {/* Row 1 — five summary stat cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Row 2 — payslip table (left, wide) + sidebar (right) */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-[2.8fr_1fr] xl:items-start">
        <div className="min-w-0 space-y-2">
          <PayslipHistoryCard />
          <ImportantDocumentsCard />
          <NeedHelpBanner />
        </div>
        <div className="min-w-0 space-y-2">
          <EarningsVsDeductionsCard />
          <YearToDateCard />
          <QuickLinksCard />
        </div>
      </div>
    </main>
  );
}