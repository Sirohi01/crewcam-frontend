'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, FileText, Clock3, Percent, UserCheck, Wallet, ChevronDown, Save, Send,
  ListChecks, Target, BarChart3, Lightbulb, TrendingUp, RotateCcw, Plus, UploadCloud,
  Bold, Italic, Underline, List, ListOrdered, Indent, Link2, Eye, ArrowRight,
  CalendarDays, Sparkles,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. No backend
// wiring yet; this is a visual reference for the "Post New Job" flow.

const KPIS = [
  { label: 'Total Open Positions', value: '42', icon: Briefcase, accent: 'bg-blue-50 text-blue-600', trend: '8 from last month', up: true },
  { label: 'Active Requisitions', value: '18', icon: FileText, accent: 'bg-emerald-50 text-emerald-600', trend: '15% from last month', up: true },
  { label: 'Avg. Time to Hire', value: '18 Days', icon: Clock3, accent: 'bg-amber-50 text-amber-600', trend: '2 days from last month', up: false },
  { label: 'Offer Acceptance Rate', value: '87%', icon: Percent, accent: 'bg-pink-50 text-pink-600', trend: '7% from last month', up: true },
  { label: 'Positions Filled', value: '24', icon: UserCheck, accent: 'bg-teal-50 text-teal-600', trend: '10% from last month', up: true },
  { label: 'Cost Per Hire', value: '₹ 8,750', icon: Wallet, accent: 'bg-violet-50 text-indigo-700', trend: '5% from last month', up: true },
];

const aiActions = [
  { title: 'Generate Job Description (JD)', detail: 'Create JD using AI based on job title & role', icon: FileText, accent: 'bg-blue-50 text-blue-600' },
  { title: 'Generate Key Responsibilities', detail: 'AI generated role based responsibilities', icon: ListChecks, accent: 'bg-emerald-50 text-emerald-600' },
  { title: 'Suggest Skills', detail: 'Industry and role based skills', icon: Target, accent: 'bg-teal-50 text-teal-600' },
  { title: 'Suggest KPIs', detail: 'Get suitable KPIs for this role', icon: BarChart3, accent: 'bg-violet-50 text-indigo-700' },
  { title: 'Smart Justification', detail: 'AI suggested business justification', icon: Lightbulb, accent: 'bg-amber-50 text-amber-600' },
  { title: 'Salary Benchmark', detail: 'Get market salary range for this role', icon: TrendingUp, accent: 'bg-pink-50 text-pink-600' },
];

const approvalSteps = [
  { title: 'Manager Approval', name: 'Reetika Singh (Sales Head)', status: 'Pending' },
  { title: 'HR Approval', name: 'Swati Verma (HR Manager)', status: 'Pending' },
  { title: 'Finance Approval', name: 'Vikas Mittal (Finance Head)', status: 'Pending' },
  { title: 'Final Approval', name: 'Vishwachandra Kandarpa (CEO)', status: 'Pending' },
];

const skillTags = ['Communication', 'Negotiation', 'CRM'];
const publishChannels = [
  { label: 'Career Portal', checked: true },
  { label: 'Website', checked: true },
  { label: 'Internal Portal', checked: false },
  { label: 'Naukri.com', checked: true },
  { label: 'LinkedIn', checked: true },
  { label: 'Indeed', checked: false },
  { label: 'Other Job Portals', checked: false },
];

const inputCls = 'mt-1 h-8 w-full rounded-none border border-zinc-200 bg-white px-2.5 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const textAreaCls = 'w-full resize-y rounded-none border border-zinc-200 bg-white px-2.5 py-1.5 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Field({
  title, required, children, hint,
}: { title: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
      <div className="relative">
        {children}
        {hint && <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400">{hint}</span>}
      </div>
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

function RangeField({ title, required, unit }: { title: string; required?: boolean; unit?: string }) {
  return (
    <Field title={title} required={required}>
      <div className="mt-1 flex items-center gap-1.5">
        <input className={inputCls.replace('mt-1 ', '')} placeholder="Minimum" />
        <span className="text-[10px] text-zinc-400">to</span>
        <input className={inputCls.replace('mt-1 ', '')} placeholder="Maximum" />
        {unit}
      </div>
    </Field>
  );
}

function RichTextBox({
  title, aiLabel, placeholder, hint,
}: { title: string; required?: boolean; aiLabel?: string; placeholder: string; hint: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className={labelCls}>{title}<b className="text-rose-500"> *</b></span>
        {aiLabel && (
          <button type="button" className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
            <Sparkles size={11} /> {aiLabel}
          </button>                                                 
        )}
      </div>
      <div className="rounded-none border border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-2 py-1 text-zinc-400">
          <Bold size={12} /><Italic size={12} /><Underline size={12} /><List size={12} /><ListOrdered size={12} /><Indent size={12} /><Link2 size={12} />
        </div>
        <div className="relative">
          <textarea className="h-20 w-full resize-none rounded-none px-2.5 py-2 text-[11.5px] text-zinc-800 outline-none placeholder:text-zinc-400" placeholder={placeholder} />
          <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400">{hint}</span>
        </div>
      </div>
    </div>
  );
}

function Card({
  title, action, children, className = '',
}: { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-none border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[13px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 pb-2.5 pt-1">{children}</div>
    </div>
  );
}

function SectionCard({
  number, title, children,
}: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-none border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 px-3 py-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-none bg-indigo-600 text-[11px] font-bold text-white">{number}</span>
        <h2 className="text-[13.5px] font-bold text-zinc-800">{title}</h2>
      </div>
      <div className="space-y-2 px-3 pb-2.5 pt-1">{children}</div>
    </div>
  );
}

export default function PostNewJobPage() {
  const [isReplacement, setIsReplacement] = useState(true);
  const [priority, setPriority] = useState('High');

  return (
    <div className="font-sans">
      <div className="mx-auto max-w-[1500px] p-1">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_270px]">
          <div className="space-y-2">
            {/* Header */}
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Post New Job</h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
                <span>Recruitment</span> <span>›</span> <span>Job Openings</span> <span>›</span>
                <span className="font-semibold text-zinc-700">Post New Job</span>
              </p>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              {KPIS.map((s) => (
                <div key={s.label} className="flex flex-col justify-between rounded-none border border-zinc-200 bg-white p-2.5 shadow-sm">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[11px] font-medium text-zinc-500 leading-snug">{s.label}</p>
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-none ${s.accent}`}>
                      <s.icon size={13} />
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <p className="text-lg font-bold leading-none text-zinc-900">{s.value}</p>
                    <p className={`mt-1.5 text-[9.5px] font-semibold leading-none ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {s.up ? '↗' : '↘'} {s.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <SectionCard number={1} title="Job Details">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-[2fr_1fr]">
                  <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                    <Field title="Job Title" required><input className={inputCls} placeholder="Enter job title" /></Field>
                    <Field title="Job Code"><input className={`${inputCls} bg-zinc-50 text-zinc-400`} placeholder="Auto generated" readOnly /></Field>
                    <SelectField title="Department" required options={['Select Department', 'Sales & Marketing', 'IT', 'HR', 'Finance']} />

                    <SelectField title="Designation" required options={['Select Designation', 'Sales Executive', 'Sales Manager']} />
                    <SelectField title="Job Category" required options={['Select Category', 'Full Time', 'Internship']} />
                    <SelectField title="Employment Type" required options={['Select Employment Type', 'Permanent', 'Contract']} />

                    <SelectField title="Job Location" required options={['Select Location', 'Noida - Head Office', 'Delhi', 'Mumbai']} />
                    <SelectField title="Work Mode" required options={['Select Work Mode', 'On-site', 'Remote', 'Hybrid']} />
                    <Field title="No. of Openings" required><input className={inputCls} placeholder="Enter number of openings" /></Field>

                    <Field title="Priority" required>
                      <div className="mt-1 flex h-8 items-center gap-3">
                        {['High', 'Medium', 'Low'].map((p) => (
                          <label key={p} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700">
                            <input type="radio" name="priority" checked={priority === p} onChange={() => setPriority(p)} className="h-3.5 w-3.5 accent-rose-500" />
                            {p}
                          </label>
                        ))}
                      </div>
                    </Field>
                    <RangeField title="Experience Required (Years)" required />
                    <Field title="Expected Joining Date" required><input type="date" className={inputCls} placeholder="Select date" /></Field>

                    <SelectField title="Notice Period" options={['Select Notice Period', 'Immediate', '15 Days', '30 Days', '60 Days']} />
                    <Field title="Salary Range (INR)" required>
                      <div className="mt-1 flex items-center gap-1.5">
                        <input className={inputCls.replace('mt-1 ', '')} placeholder="Minimum" />
                        <span className="text-[10px] text-zinc-400">to</span>
                        <input className={inputCls.replace('mt-1 ', '')} placeholder="Maximum" />
                      </div>
                    </Field>
                    <SelectField title="Currency" options={['Per Annum', 'Per Month']} />
                  </div>

                  <div className="rounded-none border border-zinc-200">
                    <div className="border-b border-zinc-100 px-3 py-2">
                      <span className="text-[11.5px] font-semibold text-zinc-700">Replacement Employee <span className="font-normal text-zinc-400">(If Applicable)</span></span>
                    </div>
                    <div className="space-y-1 px-3 pb-2 pt-1">
                      <div>
                        <span className={labelCls}>Is this position replacement?</span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsReplacement(false)}
                            className={`rounded-none px-2.5 py-1 text-[10px] font-semibold ${!isReplacement ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-100 text-zinc-400'}`}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsReplacement(true)}
                            className={`rounded-none px-2.5 py-1 text-[10px] font-semibold ${isReplacement ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400'}`}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                      <SelectField title="Employee Being Replaced" required options={['Select Employee', 'Amit Kumar (Sales Executive)']} />
                      <SelectField title="Replacement Reason" required options={['Select Reason', 'Resigned', 'Terminated', 'Transferred']} />
                      <Field title="Last Working Date"><input type="date" className={inputCls} placeholder="Select date" /></Field>
                      <SelectField title="Impact of Vacancy" options={['Select Impact', 'Low', 'Medium', 'High']} />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard number={2} title="Job Description & Responsibilities">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                  <div className="space-y-1.5">
                    <RichTextBox title="Job Description (JD)" aiLabel="AI Generate JD" placeholder="Write a detailed job description..." hint="0 / 3000" />
                    <button type="button" className="text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">Add Responsibility</button>
                  </div>
                  <div className="space-y-1.5">
                    <RichTextBox title="Key Responsibilities" aiLabel="AI Generate Responsibilities" placeholder="List the key responsibilities for this role..." hint="0 / 2000" />
                    <div className="text-right">
                      <button type="button" className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors">
                        <Plus size={11} /> Add More
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <RichTextBox title="Justification for Hiring" placeholder="Explain the reason for this hiring requirement, business impact, and how it aligns with organizational goals..." hint="0 / 1500" />
                  </div>
                </div>
              </SectionCard>

              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[2fr_1fr]">
                <SectionCard number={3} title="Requirements">
                  <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                    <SelectField title="Education" required options={['Select Minimum Education', 'Graduate', 'Post Graduate', 'MBA']} />
                    <RangeField title="Experience (Years)" required />
                    <Field title="Skills Required" required>
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="relative flex-1">
                          <select className={selectCls}><option>Select or type skills</option></select>
                          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <button type="button" className="flex h-8 shrink-0 items-center gap-1 rounded-none border border-zinc-200 px-2.5 text-[10.5px] font-semibold text-indigo-600 hover:bg-indigo-50/50">
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </Field>

                    <SelectField title="Preferred Qualifications" options={['Select or type']} />
                    <SelectField title="Certifications (Optional)" options={['Select or type']} />
                    <SelectField title="Languages (Optional)" options={['Select or type']} />
                  </div>
                </SectionCard>

                <Card title="Attachments (Optional)">
                  <div className="flex h-16 flex-col items-center justify-center gap-1 rounded-none border-2 border-dashed border-zinc-200 text-center">
                    <UploadCloud size={16} className="text-zinc-300" />
                    <p className="text-[10px] text-zinc-500">Drag &amp; drop files here or <span className="font-semibold text-indigo-600">Browse Files</span></p>
                    <p className="text-[8.5px] text-zinc-400">(JPG, PNG, PDF, DOC, DOCX up to 10MB)</p>
                  </div>
                </Card>
              </div>

              <SectionCard number={4} title="Additional Information">
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3 xl:grid-cols-6">
                  <SelectField title="Who can Apply?" required options={['Select option', 'Internal Only', 'External Only', 'Both']} />
                  <SelectField title="Gender Preference" options={['No Preference', 'Male', 'Female']} />
                  <SelectField title="Relocation Assistance" options={['Select option', 'Yes', 'No']} />
                  <SelectField title="Travel Required" options={['Select option', 'Yes', 'No', 'Occasional']} />
                  <SelectField title="Shift Timings" options={['Select Shift', 'Day', 'Night', 'Rotational']} />
                  <SelectField title="Probation Period" options={['Select Period', '3 Months', '6 Months']} />
                  <div className="sm:col-span-3 xl:col-span-6">
                    <Field title="Other Notes (Optional)"><textarea className={`${textAreaCls} mt-1 h-12`} placeholder="Any additional information" /></Field>
                  </div>
                </div>
              </SectionCard>

              <SectionCard number={5} title="Publish Settings">
                <div>
                  <span className={labelCls}>Publish On<b className="text-rose-500"> *</b></span>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    {publishChannels.map((c) => (
                      <label key={c.label} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-700">
                        <input type="checkbox" defaultChecked={c.checked} className="h-3.5 w-3.5 rounded-none accent-indigo-600" />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field title="Application Last Date"><input type="date" className={inputCls} placeholder="Select date" /></Field>
                  <Field title="Application Email"><input className={inputCls} defaultValue="careers@company.com" /></Field>
                </div>
              </SectionCard>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <div className="mt-3 mb-1 flex gap-2">
              <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-none border border-zinc-200 bg-white px-1 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                <Save size={12} /> Save as Draft
              </button>
              <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-none bg-indigo-600 px-1 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
                {/* <Send size={10} />  */}
                Submit for Approval
              </button>
            </div>

            <Card
              title="AI Job Assistant"
              action={<span className="rounded-none bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">Beta</span>}
            >
              <p className="mb-1.5 text-[11px] leading-snug text-zinc-500">Use AI to create a professional and accurate job posting.</p>
              <div className="space-y-1">
                {aiActions.map((a) => (
                  <button key={a.title} type="button" className="flex w-full items-start gap-2 rounded-none border border-zinc-100 px-0.5 py-1.5 text-left hover:bg-indigo-50/40">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-none ${a.accent}`}><a.icon size={13} /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold text-zinc-800">{a.title}</span>
                      <span className="block truncate text-[10px] text-zinc-400">{a.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-none border border-indigo-100 bg-indigo-50/60 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50">
                <RotateCcw size={12} /> Regenerate All with AI
              </button>
            </Card>

            <Card
              title="Job Preview"
              action={(
                <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                  View Full Preview <ArrowRight size={11} />
                </button>
              )}
            >
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wide text-zinc-400"><Eye size={11} /> Live preview</p>
              <p className="mt-1.5 text-[13px] font-bold text-zinc-900">Sales Executive</p>
              <p className="text-[10.5px] text-zinc-500">Sales &amp; Marketing • Noida</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Full Time', 'On-site', '2 - 4 Yrs'].map((t) => (
                  <span key={t} className="rounded-none bg-zinc-100 px-2 py-0.5 text-[9.5px] font-semibold text-zinc-600">{t}</span>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] font-bold text-zinc-900">₹ 3,00,000 - ₹ 5,00,000 PA</p>
              <p className="mt-1.5 text-[10.5px] leading-snug text-zinc-500">We are looking for a dynamic Sales Executive to join our team and drive business growth...</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skillTags.map((t) => (
                  <span key={t} className="rounded-none bg-indigo-50 px-2 py-0.5 text-[9.5px] font-semibold text-indigo-600">{t}</span>
                ))}
                <span className="text-[9.5px] font-semibold text-zinc-400">+ Lead Generation</span>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-[9.5px] text-zinc-400">
                <CalendarDays size={11} /> Application Deadline: 15 Aug 2026
              </p>
            </Card>

            <Card title="Approval Workflow" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">Edit Workflow</Link>}>
              <div className="space-y-0">
                {approvalSteps.map((s, i) => (
                  <div key={s.title} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < approvalSteps.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />}
                    <span className="relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-none border-2 border-indigo-500 bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-zinc-800">{s.title}</p>
                      <p className="truncate text-[10px] text-zinc-400">{s.name}</p>
                    </div>
                    <span className="shrink-0 rounded-none bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">{s.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


