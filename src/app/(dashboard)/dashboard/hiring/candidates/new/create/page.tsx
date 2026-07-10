'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, Loader2, Minus, Plus, Maximize2, Download, Mail, Phone,
  MapPin, Link2, ChevronDown, X, RefreshCw, Calendar, ArrowRight, Sparkles,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. The real,
// backend-wired candidate form still lives at
// /dashboard/hiring/candidates/new/create/classic.

const steps = [
  { num: 1, label: 'Upload CV', status: 'active' },
  { num: 2, label: 'Review & Edit', status: 'pending' },
  { num: 3, label: 'Submit Application', status: 'pending' },
];

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
  const [file, setFile] = useState<{ name: string, size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const sizeInKb = (selectedFile.size / 1024).toFixed(0);
      setFile({
        name: selectedFile.name,
        size: `${sizeInKb} KB`
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 flex flex-col font-sans min-h-[650px] lg:h-[calc(100%-48px)] overflow-y-auto pb-6" id="create-page-root">
      <div className="w-full mx-auto max-w-[1600px] px-2 pt-2">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3">
          {/* Title */}
          <div className="shrink-0 w-full lg:w-[380px]">
            <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">Add New Candidate</h1>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 whitespace-nowrap">Upload CV and let AI extract details automatically</p>
          </div>

          {/* Steps */}
          <div className="flex-1 max-w-[320px] w-full flex items-center justify-center relative mx-auto">
            <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
            <div className="flex w-full justify-between z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 px-2">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors z-10
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                      step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                        'border-zinc-200 text-zinc-400 bg-white'}`}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-[380px]">
            <Link href="/dashboard/hiring/candidates" className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
              Cancel
            </Link>
            <button type="button" onClick={() => window.open('/dashboard/hiring/candidates/new/create/review-and-edit', '_blank')} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              Next: Review &amp; Edit &rarr;
            </button>
          </div>
        </div>
        <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>
        {/* Row 1: upload / status / confidence */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            <div className="bg-white rounded-lg border border-slate-100 p-3.5 shadow-sm flex flex-col gap-3">
              <h3 className="text-[12px] font-bold text-indigo-950">CV / Resume Uploaded</h3>

              <div className="flex items-start gap-4">
                {/* PDF Icon exactly like the image */}
                <div className="relative w-11 h-14 shrink-0">
                  <svg width="100%" height="100%" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1C2.34315 1 1 2.34315 1 4V48C1 49.6569 2.34315 51 4 51H36C37.6569 51 39 49.6569 39 48V14L26 1H4Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M25 1V10C25 12.2091 26.7909 14 29 14H39" fill="#E2E8F0" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M26 1L39 14" fill="#E2E8F0" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M26 1V10C26 11.1046 26.8954 12 28 12H39Z" fill="#E2E8F0" />
                  </svg>
                  <div className="absolute bottom-2.5 left-0 right-0 h-5 bg-[#e52e2e] rounded-sm flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white tracking-wide">PDF</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-0 mt-0.5">
                  <p className="truncate text-[11.5px] font-bold text-indigo-950">
                    {file ? file.name : "Amit_Kumar_Verma_Resume.pdf"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {file ? file.size : "245 KB"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-left mt-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Replace File</button>
                </div>
              </div>
            </div>

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
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
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
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
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
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
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
