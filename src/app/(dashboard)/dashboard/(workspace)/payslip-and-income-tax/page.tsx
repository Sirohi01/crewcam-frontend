'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  IndianRupee, Wallet, Banknote, Calculator, FileCheck2,
  Eye, Download, ChevronLeft, ChevronRight,
  ArrowRight, FileText, ShieldCheck, FileSignature, Landmark, History,
  LayoutDashboard, Scale, HeadphonesIcon, ClipboardEdit,
  Calendar, Info, MessageSquarePlus,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import {
  SalarySlip,
  currentFinancialYear,
  financialYearOf,
  getMySalarySlips,
  getMySalaryStructure,
  inr,
  monthLabel,
  printPayslip,
} from '@/services/payslipService';

// Income tax, Form 16, declarations and investment proofs need the statutory payroll
// engine (Phase 4). Until then these entry points say so instead of showing numbers.
const PHASE_4 = 'Available with the payroll & income-tax module, coming soon.';
const comingSoon = () => toast(PHASE_4, { icon: 'ℹ️' });

const tabs = ['Payslips', 'Income Tax', 'Tax Saving Investments', 'Declarations', 'Forms & Documents'];
const PAGE_SIZE = 5;

const importantDocuments = [
  { icon: FileText, accent: 'bg-blue-50 text-blue-600', title: 'Form 16', sub: 'Annual TDS certificate' },
  { icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-600', title: 'Investment Proofs', sub: 'Upload / view' },
  { icon: FileSignature, accent: 'bg-violet-50 text-violet-600', title: 'Salary Certificate', sub: 'Request letter' },
  { icon: Landmark, accent: 'bg-amber-50 text-amber-600', title: 'Loan Certificate', sub: 'For home/other loan' },
  { icon: History, accent: 'bg-rose-50 text-rose-600', title: 'Previous Employment', sub: 'Income tax calculation' },
];

const quickLinks: Array<{ icon: React.ElementType; title: string; href?: string }> = [
  { icon: LayoutDashboard, title: 'Income Tax Dashboard' },
  { icon: FileText, title: 'Form 16' },
  { icon: ShieldCheck, title: 'Investment Proofs' },
  { icon: ClipboardEdit, title: 'Declarations' },
  { icon: Scale, title: 'Tax Regime Comparison' },
  { icon: HeadphonesIcon, title: 'Help & Support', href: '/dashboard/helpdesk' },
];

const STATUS_STYLE: Record<string, string> = {
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  Generated: 'border-blue-200 bg-blue-50 text-blue-600',
};

const pct = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toFixed(2)}%` : '0%');

// ─────────────────────────────────────────────────────────────────────────
// Shared card shell
// ─────────────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  titleExtra?: React.ReactNode;
}

function Card({ title, className = '', children, titleExtra }: CardProps) {
  return (
    <div className={`min-w-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm ${className}`}>
      {title && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h3>
          <div className="flex shrink-0 items-center gap-2">{titleExtra}</div>
        </div>
      )}
      {children}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Payslip & Income Tax" },
          ]}
        />
        <h1 className="mt-1 text-[24px] font-bold text-zinc-900">Payslip & Income Tax</h1>
        <p className="mt-0.5 text-[13px] text-zinc-400">View your payslips, tax details and download important documents.</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={comingSoon} className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
          <LayoutDashboard size={14} /> Income Tax Dashboard
        </button>
        <button onClick={comingSoon} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
          <Download size={14} /> Download Form 16
        </button>
      </div>
    </div>
  );
}

interface Stat {
  icon: React.ElementType;
  accent: string;
  label: string;
  value: string;
  detail: string;
  link: string;
  onClick?: () => void;
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-zinc-200/70 bg-white p-2 shadow-sm">
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${stat.accent}`}>
          <stat.icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-zinc-500">{stat.label}</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[15px] font-bold leading-tight text-zinc-900">{stat.value}</p>
        </div>
      </div>
      <p className="mt-2 text-[11.5px] text-zinc-400">{stat.detail}</p>
      {stat.onClick && (
        <button onClick={stat.onClick} className="mt-auto flex items-center gap-1 pt-1.5 text-[11.5px] font-semibold text-blue-600 hover:text-blue-700">
          {stat.link} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Payslip history table + tabs + filters
// ─────────────────────────────────────────────────────────────────────────

function PayslipHistoryCard({ slips, isLoading, onView, onDownload }: {
  slips: SalarySlip[];
  isLoading: boolean;
  onView: (s: SalarySlip) => void;
  onDownload: (s: SalarySlip) => void;
}) {
  const [activeTab, setActiveTab] = useState('Payslips');
  const years = useMemo(() => Array.from(new Set([currentFinancialYear(), ...slips.map(financialYearOf)])).sort().reverse(), [slips]);
  const [fy, setFy] = useState(currentFinancialYear());
  const [page, setPage] = useState(1);

  const filtered = slips.filter((s) => financialYearOf(s) === fy);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

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

      {activeTab !== 'Payslips' ? (
        <div className="px-4 py-8 text-center">
          <p className="text-[13px] font-semibold text-zinc-800">{activeTab}</p>
          <p className="mt-1 text-[12px] text-zinc-500">{PHASE_4}</p>
        </div>
      ) : (
        <div className="px-4 py-3">
          {/* Sub-header + filters */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[13px] font-semibold text-zinc-900">Payslip History</h4>
            <label className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-medium text-zinc-600">
              Financial Year:
              <select value={fy} onChange={(e) => { setFy(e.target.value); setPage(1); }} className="bg-transparent outline-none">
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-y border-zinc-100 bg-white">
                  {['Month', 'Status Updated', 'Take Home Salary', 'Gross Salary', 'Deductions', 'Status', 'Action'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-1.5 text-left text-[11px] font-semibold text-zinc-800">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-[11.5px] text-zinc-400">Loading…</td></tr>
                )}
                {!isLoading && rows.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-[11.5px] text-zinc-500">No payslips issued for FY {fy} yet.</td></tr>
                )}
                {rows.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/40">
                    <td className="whitespace-nowrap px-3 py-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <Calendar size={14} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11.5px] font-medium text-zinc-800">{monthLabel(p)}</p>
                          <p className="text-[10px] text-zinc-400">{new Date(p.year, p.month - 1).toLocaleString('en-IN', { month: 'long' })} Salary</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-1.5">
                      <p className="text-[11px] text-zinc-500">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-1.5 text-[11px] font-semibold text-emerald-600">{inr(p.netPay)}</td>
                    <td className="whitespace-nowrap px-3 py-1.5 text-[11px] font-medium text-zinc-800">{inr(p.totalEarnings)}</td>
                    <td className="whitespace-nowrap px-3 py-1.5 text-[11px] text-zinc-500">{inr(p.totalDeductions)}</td>
                    <td className="px-3 py-1.5">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLE[p.status] || 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <button aria-label={`View ${monthLabel(p)} payslip`} onClick={() => onView(p)} className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
                          <Eye size={12} />
                        </button>
                        <button aria-label={`Download ${monthLabel(p)} payslip`} onClick={() => onDownload(p)} className="grid h-6 w-6 place-items-center rounded border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100">
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
            <p className="text-[11.5px] text-zinc-400">
              {filtered.length === 0 ? 'No payslips' : `Showing ${(current - 1) * PAGE_SIZE + 1} to ${Math.min(current * PAGE_SIZE, filtered.length)} of ${filtered.length} payslips`}
            </p>
            {pageCount > 1 && (
              <div className="flex items-center gap-1.5">
                <button aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={n === current ? 'grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-[11.5px] font-semibold text-white' : 'grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-[11.5px] font-semibold text-zinc-600 hover:bg-zinc-50'}>
                    {n}
                  </button>
                ))}
                <button aria-label="Next page" disabled={current === pageCount} onClick={() => setPage(current + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-40">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

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
            <button onClick={comingSoon} className="mt-auto flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-zinc-600">
              Coming soon
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

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
      <Link href="/dashboard/helpdesk" className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-blue-700">
        <MessageSquarePlus size={14} /> Raise a Request
      </Link>
    </div>
  );
}

function EarningsVsDeductionsCard({ slip }: { slip?: SalarySlip }) {
  const gross = slip?.totalEarnings || 0;
  const deductions = slip?.totalDeductions || 0;
  const breakdown = [
    { key: 'Total Earnings', value: gross, color: '#22c55e' },
    { key: 'Total Deductions', value: deductions, color: '#ef4444' },
  ];
  return (
    <Card title="Earnings vs Deductions" titleExtra={slip && <span className="text-[10.5px] font-medium text-zinc-400">({monthLabel(slip)})</span>}>
      {!slip ? (
        <p className="py-4 text-center text-[11.5px] text-zinc-500">No payslip issued yet.</p>
      ) : (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-24 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="key" innerRadius={32} outerRadius={46} startAngle={90} endAngle={-270} paddingAngle={2} stroke="none">
                  {breakdown.map((d) => <Cell key={d.key} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10.5px] font-bold text-zinc-900">{inr(gross)}</span>
              <span className="text-[9px] text-zinc-400">Gross Salary</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            {breakdown.map((d) => (
              <div key={d.key} className="flex min-w-0 items-center justify-between gap-2">
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-600">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.key}
                </span>
                <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">
                  {inr(d.value)} ({pct(d.value, gross)})
                </span>
              </div>
            ))}
            <div className="flex min-w-0 items-center justify-between gap-2 border-t border-zinc-100 pt-2">
              <span className="text-[11px] font-medium text-blue-600">Take Home Salary</span>
              <span className="min-w-0 truncate text-right text-[11px] font-semibold text-zinc-800">{inr(slip.netPay)} ({pct(slip.netPay, gross)})</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function YearToDateCard({ slips }: { slips: SalarySlip[] }) {
  const fy = currentFinancialYear();
  const ytd = slips.filter((s) => financialYearOf(s) === fy);
  const sum = (f: (s: SalarySlip) => number) => ytd.reduce((acc, s) => acc + f(s), 0);
  const rows = [
    { icon: Wallet, accent: 'bg-blue-50 text-blue-600', label: 'Gross Earnings', value: inr(sum((s) => s.totalEarnings)) },
    { icon: Banknote, accent: 'bg-rose-50 text-rose-600', label: 'Total Deductions', value: inr(sum((s) => s.totalDeductions)) },
    { icon: IndianRupee, accent: 'bg-amber-50 text-amber-600', label: 'Net Paid', value: inr(sum((s) => s.netPay)) },
    { icon: Scale, accent: 'bg-emerald-50 text-emerald-600', label: 'Tax Deducted (TDS)', value: inr(sum((s) => s.breakdown?.deductions?.tax || 0)) },
  ];
  return (
    <Card title="Year to Date" titleExtra={<span className="text-[10.5px] font-medium text-zinc-400">(FY {fy})</span>}>
      <div className="space-y-2.5">
        {rows.map((y) => (
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
      <p className="mt-3 text-[11px] text-zinc-400">From {ytd.length} payslip{ytd.length === 1 ? '' : 's'} issued this financial year.</p>
    </Card>
  );
}

function QuickLinksCard() {
  return (
    <Card title="Quick Links">
      <div className="grid grid-cols-3 gap-2">
        {quickLinks.map((q) => {
          const body = (
            <>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <q.icon size={14} />
              </span>
              <p className="text-[10.5px] font-medium leading-tight text-zinc-700">{q.title}</p>
            </>
          );
          const className = 'flex min-w-0 flex-col items-center gap-1.5 rounded-xl border border-zinc-100 p-2 text-center transition-colors hover:border-blue-200 hover:bg-blue-50/40';
          return q.href
            ? <Link key={q.title} href={q.href} className={className}>{body}</Link>
            : <button key={q.title} onClick={comingSoon} className={className}>{body}</button>;
        })}
      </div>
    </Card>
  );
}

function SlipDetailDialog({ slip, onClose, onDownload }: { slip: SalarySlip | null; onClose: () => void; onDownload: (s: SalarySlip) => void }) {
  const e = slip?.breakdown?.earnings || {};
  const d = slip?.breakdown?.deductions || {};
  const line = (label: string, value?: number) =>
    (value || 0) > 0 && (
      <div key={label} className="flex justify-between text-[12px] text-zinc-600"><span>{label}</span><span>{inr(value)}</span></div>
    );
  return (
    <Dialog open={!!slip} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Payslip — {slip && monthLabel(slip, 'long')}</DialogTitle>
        </DialogHeader>
        {slip && (
          <div className="space-y-3 py-1">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase text-zinc-400">Earnings</p>
              {line('Basic', e.basic)}{line('HRA', e.hra)}{line('Conveyance', e.conveyance)}{line('Special Allowance', e.specialAllowance)}
              <div className="flex justify-between border-t border-zinc-100 pt-1 text-[12px] font-semibold text-zinc-800"><span>Total Earnings</span><span>{inr(slip.totalEarnings)}</span></div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase text-zinc-400">Deductions</p>
              {line('Provident Fund', d.pf)}{line('ESI', d.esi)}{line('Income Tax (TDS)', d.tax)}{line('Other', d.other)}
              <div className="flex justify-between border-t border-zinc-100 pt-1 text-[12px] font-semibold text-zinc-800"><span>Total Deductions</span><span>{inr(slip.totalDeductions)}</span></div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
              <span className="text-[12.5px] font-semibold text-emerald-700">Net Pay</span>
              <span className="text-[14px] font-bold text-emerald-700">{inr(slip.netPay)}</span>
            </div>
            <button onClick={() => onDownload(slip)} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-[12.5px] font-semibold text-white hover:bg-blue-700">
              <Download size={14} /> Download / Print
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function PayslipIncomeTax() {
  const { data: slips = [], isLoading } = useQuery({ queryKey: ['me', 'salary-slips'], queryFn: getMySalarySlips });
  const { data: structure } = useQuery({ queryKey: ['me', 'salary-structure'], queryFn: getMySalaryStructure });
  const { data: profile } = useMyProfile();
  const { data: company } = useCompanyProfile();
  const [viewing, setViewing] = useState<SalarySlip | null>(null);

  // Newest first.
  const sorted = useMemo(() => [...slips].sort((a, b) => b.year - a.year || b.month - a.month), [slips]);
  const latest = sorted[0];
  const fy = currentFinancialYear();
  const tdsThisYear = sorted.filter((s) => financialYearOf(s) === fy).reduce((acc, s) => acc + (s.breakdown?.deductions?.tax || 0), 0);

  const download = (slip: SalarySlip) => {
    const opened = printPayslip(slip, {
      name: profile ? `${profile.firstName} ${profile.lastName}` : '',
      code: profile?.employeeCode,
      designation: profile?.designationId?.name || profile?.designation,
      company: company?.legalName || company?.name,
    });
    if (!opened) toast.error('Allow pop-ups to download your payslip');
  };

  const summaryStats: Stat[] = [
    { icon: IndianRupee, accent: 'bg-blue-50 text-blue-600', label: 'Monthly Take Home', value: latest ? inr(latest.netPay) : '—', detail: latest ? monthLabel(latest, 'long') : 'No payslip yet', link: 'View Payslip', onClick: latest ? () => setViewing(latest) : undefined },
    { icon: Wallet, accent: 'bg-emerald-50 text-emerald-600', label: 'Annual Gross Salary', value: structure ? inr(structure.annualGross) : '—', detail: structure ? 'From your salary structure' : 'Salary structure not set up yet', link: '' },
    { icon: Banknote, accent: 'bg-amber-50 text-amber-500', label: 'Total Deductions', value: latest ? inr(latest.totalDeductions) : '—', detail: latest ? monthLabel(latest, 'long') : '—', link: 'View Breakup', onClick: latest ? () => setViewing(latest) : undefined },
    { icon: Calculator, accent: 'bg-violet-50 text-violet-600', label: `Tax Deducted (FY ${fy})`, value: inr(tdsThisYear), detail: 'TDS on payslips this year', link: '' },
    { icon: FileCheck2, accent: 'bg-teal-50 text-teal-600', label: 'Form 16', value: 'Not available yet', detail: 'Issued after year end', link: 'Learn more', onClick: comingSoon },
  ];

  return (
    <main className="mx-auto w-full space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
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
          <PayslipHistoryCard slips={sorted} isLoading={isLoading} onView={setViewing} onDownload={download} />
          <ImportantDocumentsCard />
          <NeedHelpBanner />
        </div>
        <div className="min-w-0 space-y-2">
          <EarningsVsDeductionsCard slip={latest} />
          <YearToDateCard slips={sorted} />
          <QuickLinksCard />
        </div>
      </div>

      <SlipDetailDialog slip={viewing} onClose={() => setViewing(null)} onDownload={download} />
    </main>
  );
}
