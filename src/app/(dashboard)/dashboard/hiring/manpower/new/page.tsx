'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase, Clock3, UserCheck, Percent, Wallet, ChevronDown, Save, Send,
  FileText, ListChecks, Target, TrendingUp, Lightbulb, RotateCcw, Plus,
  UploadCloud, MessageCircle, X,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. The real,
// backend-wired requisition form still lives at
// /dashboard/hiring/manpower/new/classic so nothing is lost.

const KPIS = [
  { label: 'Open Positions', value: '42', icon: Briefcase, accent: 'bg-blue-50 text-blue-600', trend: '8 from last month', up: true },
  { label: 'Active Requisitions', value: '18', icon: FileText, accent: 'bg-emerald-50 text-emerald-600', trend: '12% from last month', up: true },
  { label: 'Avg. Time to Hire', value: '18 Days', icon: Clock3, accent: 'bg-amber-50 text-amber-600', trend: '2 days from last month', up: false },
  { label: 'Positions Filled', value: '24', icon: UserCheck, accent: 'bg-violet-50 text-violet-600', trend: '10 from last month', up: true },
  { label: 'Offer Acceptance Rate', value: '87%', icon: Percent, accent: 'bg-pink-50 text-pink-600', trend: '7% from last month', up: true },
  { label: 'Cost Per Hire', value: '₹ 8,750', icon: Wallet, accent: 'bg-teal-50 text-teal-600', trend: '7% from last month', up: true },
];

const kpiRows = [
  { name: 'Monthly Sales Target Achievement', weight: 40 },
  { name: 'New Client Acquisition', weight: 25 },
  { name: 'Customer Retention', weight: 20 },
  { name: 'Lead Conversion Rate', weight: 10 },
  { name: 'Reporting & CRM Compliance', weight: 5 },
];

const otherBenefits = ['PF', 'ESI', 'Medical Insurance', 'Mobile Allowance'];

const aiActions = [
  { title: 'Generate Job Description (JD)', detail: 'Based on Job Title & Role', icon: FileText },
  { title: 'Generate Key Responsibilities', detail: 'AI generated role based responsibilities', icon: ListChecks },
  { title: 'Suggest KPIs', detail: 'Industry standard KPI suggestions', icon: Target },
  { title: 'Salary Benchmark', detail: 'Get market salary range', icon: TrendingUp },
  { title: 'Smart Justification', detail: 'AI suggested business justification', icon: Lightbulb },
];

const requestSummary = [
  { label: 'Requisition Title', value: 'Sales Executive - North Region' },
  { label: 'Department', value: 'Sales & Marketing' },
  { label: 'Location', value: 'Noida - Head Office' },
  { label: 'No. of Positions', value: '5' },
  { label: 'Employment Type', value: 'Permanent (Full Time)' },
  { label: 'Priority', value: 'High' },
  { label: 'Expected Joining', value: '15 Aug 2026' },
  { label: 'Requisition Raised By', value: 'Swati Verma (HR Manager)' },
];

const approvalSteps = [
  { title: 'Manager Approval', name: 'Reetika Singh (Sales Head)', status: 'Pending' },
  { title: 'HR Approval', name: 'Swati Verma (HR Manager)', status: 'Pending' },
  { title: 'Finance Approval', name: 'Vikas Mittal (Finance Head)', status: 'Pending' },
  { title: 'Final Approval', name: 'Vishwachandra Kandarpa (CEO)', status: 'Pending' },
];

const inputCls = 'mt-0.5 h-8 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-[11.5px] text-zinc-800 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const textAreaCls = 'mt-0.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11.5px] text-zinc-800 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Field({
  title, required, children, hint,
}: { title: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
      {children}
      {hint && <span className="mt-1 block text-right text-[9px] text-zinc-400">{hint}</span>}
    </label>
  );
}

function SelectField({
  title, required, options, defaultValue,
}: { title: string; required?: boolean; options: string[]; defaultValue?: string }) {
  return (
    <Field title={title} required={required}>
      <div className="relative">
        <select className={selectCls} defaultValue={defaultValue}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </Field>
  );
}

function Card({
  title, action, children, className = '',
}: { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-1.5">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 py-1.5">{children}</div>
    </div>
  );
}

function SectionCard({
  number, title, children,
}: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-1.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">{number}</span>
        <h2 className="text-[12.5px] font-bold text-zinc-800">{title}</h2>
      </div>
      <div className="space-y-2 px-3 py-1.5">{children}</div>
    </div>
  );
}

export default function CreateJobRequisitionPage() {
  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Create Job Requisition</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Recruitment</span> <span>›</span> <span>Job Requisition</span> <span>›</span>
              <span className="font-semibold text-zinc-700">Create New Request</span>
            </p>
          </div>
          <Link href="/dashboard/hiring/manpower/new/classic" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
            Need the classic form?
          </Link>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((s) => (
            <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.accent}`}>
                  <s.icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] text-zinc-500 leading-tight">{s.label}</p>
                  <p className="text-lg font-bold leading-tight text-zinc-900">{s.value}</p>
                  <p className={`truncate text-[9px] font-semibold leading-tight ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {s.up ? '↗' : '↘'} {s.trend}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content: form + sidebar */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          {/* Form */}
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <SectionCard number={1} title="Requisition Details">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field title="Requisition Title" required><input className={inputCls} defaultValue="Sales Executive - North Region" /></Field>
                <SelectField title="Department" required options={['Sales & Marketing', 'IT', 'HR', 'Finance']} />
                <SelectField title="Reporting Manager" required options={['Reetika Singh (Sales Head)', 'Amit Kumar', 'Vikas Mittal']} />
                <SelectField title="Business Unit" options={['Select Business Unit', 'Retail', 'Corporate', 'Enterprise']} />

                <SelectField title="Location" required options={['Noida - Head Office', 'Delhi', 'Mumbai', 'Bangalore']} />
                <SelectField title="Job Type" required options={['Full Time', 'Part Time', 'Contract', 'Internship']} />
                <SelectField title="Employment Type" required options={['Permanent', 'Temporary', 'Probation']} />
                <Field title="Expected Joining Date" required><input type="date" className={inputCls} defaultValue="2026-08-15" /></Field>

                <Field title="No. of Positions" required><input type="number" className={inputCls} defaultValue={5} /></Field>
                <Field title="Priority" required>
                  <div className="relative">
                    <select className={selectCls} defaultValue="High">
                      <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                    </select>
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <SelectField title="Requisition Raised By" required options={['Swati Verma (HR Manager)', 'Amit Kumar']} />
                <Field title="Requisition Date"><input type="date" className={`${inputCls} bg-zinc-50 text-zinc-500`} defaultValue="2026-05-21" readOnly /></Field>

                <div className="sm:col-span-2 xl:col-span-4">
                  <Field title="Requisition Justification" required hint="109 / 500">
                    <textarea
                      className={`${textAreaCls} h-16`}
                      defaultValue="Extending our sales team in North region to meet increasing customer demand and business growth targets for FY 2026-27."
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard number={2} title="Job Details">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field title="Job Title" required><input className={inputCls} defaultValue="Sales Executive" /></Field>
                    <Field title="Job Code"><input className={inputCls} defaultValue="SE-001" /></Field>
                    <SelectField title="Department" required options={['Sales & Marketing', 'IT', 'HR', 'Finance']} />
                    <SelectField title="Designation" required options={['Sales Executive', 'Senior Sales Executive', 'Sales Manager']} />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field title="Job Description (JD)" required hint="176 / 1500">
                      <textarea
                        className={`${textAreaCls} h-20`}
                        defaultValue="Sales Executive will be responsible for generating leads, meeting potential clients, understanding their business needs and providing suitable solutions to achieve sales targets and build strong client relationships."
                      />
                    </Field>
                    <Field title="Key Responsibilities" required hint="5 / 15">
                      <textarea
                        className={`${textAreaCls} h-20`}
                        defaultValue={'• Identify and develop new business opportunities\n• Generate leads through calls, emails and meetings\n• Achieve monthly and quarterly sales targets\n• Maintain CRM and update customer information\n• Build and maintain long term client relationships'}
                      />
                    </Field>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200">
                  <div className="border-b border-zinc-100 px-3 py-1.5">
                    <span className="text-[11px] font-semibold text-zinc-700">Key Performance Indicators (KPIs) <b className="text-rose-500">*</b></span>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {kpiRows.map((k) => (
                      <div key={k.name} className="flex items-center gap-2 px-3 py-1.5">
                        <span className="min-w-0 flex-1 truncate text-[10.5px] text-zinc-700">{k.name}</span>
                        <input className="h-7 w-12 rounded border border-zinc-200 px-1.5 text-center text-[10.5px]" defaultValue={k.weight} />
                        <span className="text-[10px] text-zinc-400">%</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="flex w-full items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-semibold text-indigo-600 hover:bg-indigo-50/50">
                    <Plus size={12} /> Add KPI
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard number={3} title="Replacement Details (If Applicable)">
              <div className="flex items-center gap-2.5">
                <span className={`${labelCls}`}>Is this position replacement?</span>
                <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-indigo-600">
                  <span className="absolute right-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </span>
                <span className="text-[10.5px] font-semibold text-zinc-600">Yes</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <SelectField title="Employee Being Replaced" required options={['Amit Kumar (Sales Executive)', 'Rohit Sharma']} />
                <SelectField title="Replacement Reason" required options={['Resigned', 'Terminated', 'Transferred', 'Retired']} />
                <Field title="Last Working Date"><input type="date" className={inputCls} defaultValue="2026-08-10" /></Field>
                <SelectField title="Impact of Vacancy" options={['Low', 'Medium', 'High']} defaultValue="High" />
              </div>
            </SectionCard>

            <SectionCard number={4} title="Compensation Details">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <Field title="Minimum Salary (₹)" required><input className={inputCls} defaultValue="25,000" /></Field>
                <Field title="Maximum Salary (₹)" required><input className={inputCls} defaultValue="35,000" /></Field>
                <SelectField title="Currency" required options={['INR', 'USD', 'EUR']} />
                <SelectField title="Salary Type" required options={['Per Month', 'Per Annum']} />
                <Field title="Incentives / Variable Pay"><input className={inputCls} defaultValue="Performance Based Incentives" /></Field>
              </div>
              <Field title="Other Benefits">
                <div className="mt-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5">
                  {otherBenefits.map((b) => (
                    <span key={b} className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                      {b} <X size={10} className="cursor-pointer text-indigo-400" />
                    </span>
                  ))}
                  <ChevronDown size={13} className="ml-auto text-zinc-400" />
                </div>
              </Field>
            </SectionCard>

            <SectionCard number={5} title="Attachments (Optional)">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className={labelCls}>Add relevant documents</span>
                  <div className="mt-1 flex h-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-200 text-center">
                    <UploadCloud size={18} className="text-zinc-300" />
                    <p className="text-[10.5px] text-zinc-500">Drag &amp; drop files here or <span className="font-semibold text-indigo-600">Browse Files</span></p>
                    <p className="text-[9px] text-zinc-400">(JPG, PNG, PDF, DOC up to 10MB)</p>
                  </div>
                </div>
                <Field title="Notes (Optional)" hint="0 / 500">
                  <textarea className={`${textAreaCls} h-20`} placeholder="Add any additional information or notes..." />
                </Field>
              </div>
            </SectionCard>
          </form>

          {/* Sidebar */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                <Save size={13} /> Save as Draft
              </button>
              <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
                <Send size={13} /> Submit for Approval
              </button>
            </div>

            <Card
              title="AI Assistant"
              action={<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">Beta</span>}
            >
              <p className="mb-1.5 text-[10.5px] leading-snug text-zinc-500">Let AI help you create a complete and accurate job requisition.</p>
              <div className="space-y-1">
                {aiActions.map((a) => (
                  <button key={a.title} type="button" className="flex w-full items-start gap-2.5 rounded-lg border border-zinc-100 px-2.5 py-1.5 text-left hover:bg-indigo-50/40">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><a.icon size={14} /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-[10.5px] font-semibold text-zinc-800">{a.title}</span>
                      <span className="block truncate text-[9.5px] text-zinc-400">{a.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 border-t border-zinc-100 pt-1.5 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                <RotateCcw size={11} /> Regenerate All with AI
              </button>
            </Card>

            <Card title="Request Summary">
              <div className="space-y-2">
                {requestSummary.map((r) => (
                  <div key={r.label} className="flex items-start justify-between gap-2 text-[10.5px]">
                    <span className="shrink-0 text-zinc-500">{r.label}</span>
                    <span className="text-right font-semibold text-zinc-800">{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Approval Workflow">
              <div className="space-y-0">
                {approvalSteps.map((s, i) => (
                  <div key={s.title} className="relative flex gap-2.5 pb-2 last:pb-0">
                    {i < approvalSteps.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />}
                    <span className="relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2 border-indigo-500 bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold text-zinc-800">{s.title}</p>
                      <p className="truncate text-[9.5px] text-zinc-400">{s.name}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">{s.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Floating AI chat bubble */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <div className="max-w-[220px] rounded-xl rounded-br-sm border border-zinc-200 bg-white px-3 py-2 text-[10.5px] text-zinc-600 shadow-md">
            Hi Swati! Need help in generating JD or KPIs?
          </div>
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
