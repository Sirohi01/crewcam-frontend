'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2, Loader2, Minus, Plus, Maximize2, Download, Mail, Phone,
  MapPin, Link2, ChevronDown, X, RefreshCw, Calendar, ArrowRight, Sparkles,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. The real,
// backend-wired candidate form still lives at
// /dashboard/hiring/candidates/new/create/classic.

const steps = ['Upload CV', 'Review & Edit', 'Submit Application'];

const extractionChecklist = [
  'Reading CV content',
  'Extracting Personal Information',
  'Extracting Experience',
  'Extracting Education',
  'Extracting Skills',
];

const experience = [
  { role: 'Sales Manager', company: 'ABC Pvt. Ltd.', period: 'Jun 2021 – Present', points: ['Leading a team of 10 sales executives and managing key enterprise accounts.', 'Achieved 125% of annual sales target for 2 consecutive years.', 'Developed strategic sales plans and increased market share by 18%.'] },
  { role: 'Senior Sales Executive', company: 'XYZ Solutions Pvt. Ltd.', period: 'May 2019 – May 2021', points: ['Managed client acquisition and retention.', 'Consistently met quarterly sales targets.'] },
  { role: 'Sales Executive', company: 'Techno Sales Pvt. Ltd.', period: 'Aug 2017 – Apr 2019', points: ['Generated leads and converted them into long-term clients.'] },
];

const education = [
  { degree: 'MBA – Marketing', school: 'Amity University, Noida', period: '2017 – 2019' },
  { degree: 'BBA', school: 'Delhi University', period: '2014 – 2017' },
];

const cvSkills = ['Sales Strategy', 'Team Leadership', 'Client Relationship', 'Negotiation', 'Business Development', 'CRM', 'Market Analysis'];
const extractedSkills = ['Sales Strategy', 'Team Leadership', 'Client Relationship', 'Business Development', 'Negotiation', 'CRM', 'Market Analysis'];

const extractionSummary = [
  { label: 'Personal Information', value: 95 },
  { label: 'Experience', value: 91 },
  { label: 'Education', value: 92 },
  { label: 'Skills', value: 88 },
];

const inputCls = 'mt-1 h-7 w-full rounded-none border border-zinc-200 bg-white px-2 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Field({
  title, required, children,
}: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
      {children}
    </label>
  );
}

function SelectField({ title, required, options }: { title: string; required?: boolean; options: string[] }) {
  return (
    <Field title={title} required={required}>
      <div className="relative">
        <select className={selectCls} defaultValue={options[0]}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </Field>
  );
}

function Card({
  title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-none border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-2.5 py-1.5">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-2.5 pb-2 pt-1">{children}</div>
    </div>
  );
}

export default function CreateCandidatePage() {
  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1600px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Add New Candidate</h1>
            <p className="mt-0.5 text-[10.5px] text-zinc-500">Upload CV and let AI extract details automatically</p>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span className="h-px w-8 bg-zinc-200" />}
                <div className="flex flex-col items-center gap-1">
                  <span className={`grid h-6 w-6 place-items-center rounded-none text-[10.5px] font-bold ${i === 0 ? 'bg-indigo-600 text-white' : 'border border-zinc-200 bg-white text-zinc-400'}`}>
                    {i + 1}
                  </span>
                  <span className={`whitespace-nowrap text-[9.5px] font-semibold ${i === 0 ? 'text-zinc-800' : 'text-zinc-400'}`}>{s}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard/hiring/candidates" className="flex items-center rounded-none border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              Cancel
            </Link>
            <button type="button" className="flex items-center gap-1.5 rounded-none bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
              Next: Review &amp; Edit <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Row 1: upload / status / confidence */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            <Card title="CV / Resume Uploaded">
              <div className="flex items-center gap-2">
                <span className="grid h-11 w-9 shrink-0 place-items-center rounded-none bg-rose-600 text-[9px] font-bold text-white">PDF</span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-zinc-800">Amit_Kumar_Verma_Resume.pdf</p>
                  <p className="text-[9.5px] text-zinc-400">245 KB</p>
                </div>
              </div>
              <button type="button" className="mt-0.5 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">Replace File</button>
            </Card>

            <Card title="AI Extraction Status">
              <div className="space-y-0.5">
                {extractionChecklist.map((c) => (
                  <p key={c} className="flex items-center gap-1.5 text-[10.5px] text-zinc-600">
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-500" /> {c}
                  </p>
                ))}
                <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-indigo-600">
                  <Loader2 size={13} className="shrink-0 animate-spin" /> AI extraction completed successfully
                </p>
              </div>
            </Card>

            <Card title="AI Extraction Confidence" className="text-center">
              <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: 'conic-gradient(#4f46e5 92%, #e5e7eb 0)' }}>
                <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-white">
                  <span className="text-[13px] font-bold text-zinc-900">92%</span>
                </div>
              </div>
              <p className="mt-0.5 text-[10.5px] font-semibold text-emerald-600">High Accuracy</p>
              <p className="mt-0.5 text-[9.5px] leading-snug text-zinc-400">The extracted information is highly accurate.</p>
            </Card>
          </div>

          {/* Original CV preview column starts here so it spans the full remaining height */}
          <div className="space-y-2 lg:row-span-2">
            <Card
              title="Original CV Preview"
              action={(
                <div className="flex items-center gap-1 text-zinc-400">
                  <button type="button" className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Minus size={13} /></button>
                  <button type="button" className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Plus size={13} /></button>
                  <button type="button" className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Maximize2 size={13} /></button>
                  <button type="button" className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Download size={13} /></button>
                </div>
              )}
              className="max-h-[820px] overflow-y-auto"
            >
              <div className="flex items-start gap-3">
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-none bg-zinc-200" />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold uppercase text-zinc-900">Amit Kumar Verma</p>
                  <p className="text-[10px] font-semibold text-zinc-500">Sales Manager</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9.5px] text-zinc-500">
                    <span className="flex items-center gap-1"><Phone size={10} /> +91 98765 43210</span>
                    <span className="flex items-center gap-1"><Mail size={10} /> amit.verma@email.com</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> Noida, Uttar Pradesh</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-[9.5px] text-zinc-500"><Link2 size={10} /> linkedin.com/in/amitverma</p>
                </div>
              </div>

              <div className="mt-3 border-t border-zinc-100 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Professional Summary</p>
                <p className="mt-1 text-[10px] leading-snug text-zinc-500">
                  Results-driven Sales Manager with 7+ years of experience in B2B sales, team leadership, and business development. Proven track record in achieving revenue targets, building strong client relationships and driving growth.
                </p>
              </div>

              <div className="mt-1.5 border-t border-zinc-100 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Experience</p>
                <div className="mt-1 space-y-1">
                  {experience.map((e) => (
                    <div key={e.role}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <p className="text-[10.5px] font-semibold text-zinc-800">{e.role}</p>
                        <p className="text-[9px] text-zinc-400">{e.period}</p>
                      </div>
                      <p className="text-[9.5px] text-zinc-500">{e.company}</p>
                      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[9.5px] text-zinc-500">
                        {e.points.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1.5 border-t border-zinc-100 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Education</p>
                <div className="mt-1 space-y-1">
                  {education.map((e) => (
                    <div key={e.degree} className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <div>
                        <p className="text-[10.5px] font-semibold text-zinc-800">{e.degree}</p>
                        <p className="text-[9.5px] text-zinc-500">{e.school}</p>
                      </div>
                      <p className="text-[9px] text-zinc-400">{e.period}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-1.5 border-t border-zinc-100 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-700">Skills</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {cvSkills.map((s) => (
                    <span key={s} className="rounded-none bg-zinc-100 px-2 py-0.5 text-[9.5px] font-medium text-zinc-600">{s}</span>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Card title="AI Extraction Summary">
                <div className="space-y-1">
                  {extractionSummary.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-[10.5px]">
                      <span className="text-zinc-500">{s.label}</span>
                      <span className="font-semibold text-emerald-600">{s.value}%</span>
                    </div>
                  ))}
                </div>
                <Link href="#" className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                  View Full AI Analysis <ArrowRight size={11} />
                </Link>
              </Card>

              <Card>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-[11px] font-bold text-zinc-800">AI Suggestion</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">Looks good! Please review all details. You can edit any information before proceeding.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Application Information form (left column, below row 1) */}
          <Card
            title={<>Application Information <span className="font-normal text-zinc-400">(Review &amp; Edit)</span></>}
            action={(
              <button type="button" className="flex items-center gap-1.5 rounded-none border border-zinc-200 px-2.5 py-1 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
                <RefreshCw size={11} /> Re-extract CV
              </button>
            )}
          >
            <div className="space-y-2">
              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Personal Information</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                  <Field title="Full Name" required><input className={inputCls} defaultValue="Amit Kumar Verma" /></Field>
                  <Field title="Email Address" required><input className={inputCls} defaultValue="amit.verma@email.com" /></Field>
                  <Field title="Mobile Number" required><input className={inputCls} defaultValue="+91 98765 43210" /></Field>

                  <Field title="Current Location" required><input className={inputCls} defaultValue="Noida, Uttar Pradesh" /></Field>
                  <SelectField title="Preferred Location" options={['Noida, Delhi NCR', 'Mumbai', 'Bangalore']} />
                  <Field title="LinkedIn Profile (Optional)"><input className={inputCls} defaultValue="https://linkedin.com/in/amitverma" /></Field>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Application Details</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                  <SelectField title="Position Applied For" required options={['Sales Manager', 'Sales Executive']} />
                  <SelectField title="Department" required options={['Sales & Marketing', 'IT', 'HR']} />
                  <SelectField title="Employment Type" required options={['Full Time', 'Contract']} />

                  <Field title="Total Experience (Years)" required><input className={inputCls} defaultValue="7" /></Field>
                  <Field title="Relevant Experience (Years)" required><input className={inputCls} defaultValue="7" /></Field>
                  <Field title="Current Company"><input className={inputCls} defaultValue="ABC Pvt. Ltd." /></Field>

                  <Field title="Current CTC (INR)"><input className={inputCls} defaultValue="₹ 8.50 LPA" /></Field>
                  <Field title="Expected CTC (INR)" required><input className={inputCls} defaultValue="₹ 12.00 LPA" /></Field>
                  <SelectField title="Notice Period" required options={['30 Days', '15 Days', '60 Days', 'Immediate']} />

                  <Field title="Available From" required>
                    <div className="relative">
                      <input className={`${inputCls} pl-7`} defaultValue="15 June 2026" />
                      <Calendar size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </Field>
                  <SelectField title="Relocation" options={['Yes, I am open to relocate', 'No']} />
                  <SelectField title="Willing to Travel" options={['Yes', 'No']} />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Education Details</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-3">
                  <Field title="Highest Qualification" required><input className={inputCls} defaultValue="MBA - Marketing" /></Field>
                  <Field title="University / Board" required><input className={inputCls} defaultValue="Amity University, Noida" /></Field>
                  <Field title="Year of Passing" required><input className={inputCls} defaultValue="2017" /></Field>
                  <Field title="Percentage / CGPA"><input className={inputCls} defaultValue="7.8 CGPA" /></Field>
                </div>
              </div>

              <div>
                <p className={labelCls}>Skills (Extracted)</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {extractedSkills.map((s) => (
                    <span key={s} className="flex items-center gap-1 rounded-none bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                      {s} <X size={10} className="cursor-pointer text-indigo-400" />
                    </span>
                  ))}
                  <button type="button" className="flex items-center gap-1 rounded-none border border-dashed border-zinc-300 px-2 py-1 text-[10px] font-semibold text-zinc-500 hover:bg-zinc-50">
                    <Sparkles size={10} /> Add Skill
                  </button>
                </div>
              </div>

              <button type="button" className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                Show More Fields <ChevronDown size={13} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
