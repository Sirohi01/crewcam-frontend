'use client';
import React, { useState } from 'react';
import {
  ChevronRight, ArrowLeft, Save, IdCard, Check, Info,
} from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadCrumb';

// ─── Static data ────────────────────────────────────────────────────────────
const BREADCRUMB = ['Organization Setup', 'Job Grades', 'Add New Job Grade'];

const EXAMPLE_GRADES = [
  { code: 'JG-01', level: 'Level 10', levelColor: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200', title: 'Director', pay: '₹ 2,00,000 - ₹ 3,20,000', family: 'Management', reports: 'CEO' },
  { code: 'JG-03', level: 'Level 7', levelColor: 'bg-blue-50 text-blue-600', border: 'border-blue-200', title: 'Deputy Manager', pay: '₹ 75,000 - ₹ 1,10,000', family: 'Management', reports: 'Manager' },
  { code: 'JG-05', level: 'Level 5', levelColor: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200', title: 'Junior Manager', pay: '₹ 45,000 - ₹ 70,000', family: 'Management', reports: 'Manager' },
  { code: 'JG-07', level: 'Level 3', levelColor: 'bg-amber-50 text-amber-600', border: 'border-amber-200', title: 'Executive', pay: '₹ 25,000 - ₹ 35,000', family: 'Operations', reports: 'Asst. Manager' },
  { code: 'JG-09', level: 'Level 1', levelColor: 'bg-rose-50 text-rose-500', border: 'border-rose-200', title: 'Trainee', pay: '₹ 15,000 - ₹ 18,000', family: 'Operations', reports: 'Executive' },
];

const GRADE_LEVEL_GUIDE = [
  { level: '10', title: 'Executive', sub: 'CEO, President, VP', bg: 'bg-indigo-600' },
  { level: '9-8', title: 'Senior Management', sub: 'Director, Head', bg: 'bg-blue-500' },
  { level: '7-6', title: 'Supervisory', sub: 'Sr. Manager, Manager', bg: 'bg-teal-500' },
  { level: '5-4', title: 'Staff', sub: 'Asst. Manager, Executive', bg: 'bg-emerald-500' },
  { level: '3-1', title: 'Support Staff', sub: 'Assistant, Trainee', bg: 'bg-amber-500' },
];

const WHY_ADD = [
  'Defines role hierarchy in the organization.',
  'Helps in salary structure and pay planning.',
  'Supports performance management.',
  'Improves reporting and analytics.',
];

const NOTES = [
  'Fields marked with * are mandatory.',
  'You can edit or archive the grade anytime.',
  'Ensure grade level mapping is consistent.',
];

// ─── Shared field styles ─────────────────────────────────────────────────────
const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12.5px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors placeholder:text-zinc-400';

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-zinc-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10.5px] text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="flex items-start justify-between gap-3 flex-wrap">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
         <Breadcrumb
  items={[
    { label: "Organization Setup", href: "/dashboard" },
    { label: "Job Grades", href: "/dashboard/job-grades" },
    { label: "Add New Job Grade" },
  ]}
/>
        </div>
        <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Add New Job Grade</h1>
        <p className="text-[13px] text-zinc-500">Create a new job grade and define its basic details.</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/dashboard/job-grades" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
          <ArrowLeft size={14} /> Back to Job Grades
        </Link>
        <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <Save size={14} /> Save Job Grade
        </button>
      </div>
    </section>
  );
}

// ─── Job Grade Details card ─────────────────────────────────────────────────
function JobGradeDetailsCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
          <IdCard size={15} />
        </span>
        <h3 className="text-[14px] font-bold text-zinc-900">Job Grade Details</h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Grade Name" required hint="e.g., Junior Manager">
            <input type="text" defaultValue="Junior Manager" className={inputClass} />
          </Field>
          <Field label="Grade Code" required hint="e.g., JG-05">
            <input type="text" defaultValue="JG-05" className={inputClass} />
          </Field>
          <Field label="Grade Level" required hint="Select grade level">
            <select className={inputClass} defaultValue="5-4">
              <option value="10">10</option>
              <option value="9-8">9 - 8</option>
              <option value="7-6">7 - 6</option>
              <option value="5-4">5 - 4</option>
              <option value="3-1">3 - 1</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Pay Range (Monthly)" required hint="Enter minimum and maximum monthly pay range">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
                <input type="text" defaultValue="45,000" className={`${inputClass} pl-6`} />
              </div>
              <span className="text-[11px] text-zinc-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
                <input type="text" defaultValue="70,000" className={`${inputClass} pl-6`} />
              </div>
            </div>
          </Field>
          <Field label="Job Family" required hint="Choose job family">
            <select className={inputClass} defaultValue="Management">
              <option value="Management">Management</option>
              <option value="Operations">Operations</option>
              <option value="Technical">Technical</option>
              <option value="Support">Support</option>
            </select>
          </Field>
          <Field label="Parent Grade (Optional)" hint="Select if this grade has a parent">
            <select className={inputClass} defaultValue="Manager (JG-06)">
              <option value="">None</option>
              <option value="Manager (JG-06)">Manager (JG-06)</option>
              <option value="Director (JG-01)">Director (JG-01)</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Status" required hint="Choose status">
            <select className={inputClass} defaultValue="Active">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </Field>
          <Field label="Short Description" hint="e.g., Mid-level management roles">
            <input type="text" defaultValue="Mid-level management roles with functional ownership." className={inputClass} />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Examples of Job Grades card ────────────────────────────────────────────
function ExampleGradesCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Examples of Job Grades in Your Organization</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {EXAMPLE_GRADES.map((g) => (
          <div key={g.code} className={`rounded-lg border ${g.border} bg-white p-1.5`}>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-zinc-500">{g.code}</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${g.levelColor}`}>{g.level}</span>
            </div>
            <p className="text-[12px] font-bold text-zinc-900 mt-1">{g.title}</p>
            <p className="text-[10px] text-zinc-500 mt-1">{g.pay}</p>
            <div className="mt-2 pt-2 border-t border-zinc-100 space-y-0.5">
              <p className="text-[10px] text-zinc-400">Family: <span className="text-zinc-600">{g.family}</span></p>
              <p className="text-[10px] text-zinc-400">Reports To: <span className="text-zinc-600">{g.reports}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Additional Information card ────────────────────────────────────────────
function AdditionalInfoCard() {
  const [remarksLen, setRemarksLen] = useState(56);
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={15} className="text-zinc-400" />
        <h3 className="text-[14px] font-bold text-zinc-900">Additional Information (Optional)</h3>
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 170px 1.6fr' }}>
        <Field label="CTC Range (Annual)" hint="Enter annual CTC range">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
              <input type="text" defaultValue="6,00,000" className={`${inputClass} pl-6`} />
            </div>
            <span className="text-[11px] text-zinc-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
              <input type="text" defaultValue="9,00,000" className={`${inputClass} pl-6`} />
            </div>
          </div>
        </Field>
        <Field label="Probation Period (Months)" hint="e.g., 3, 6">
          <input type="text" defaultValue="6" className={inputClass} />
        </Field>
        <Field label="Remarks">
          <div className="relative">
            <textarea
              defaultValue="Applicable for mid-level managers managing teams and projects."
              onChange={(e) => setRemarksLen(e.target.value.length)}
              rows={2}
              className={`${inputClass} resize-none pr-12`}
            />
            <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400">{remarksLen}/160</span>
          </div>
        </Field>
      </div>
    </div>
  );
}

// ─── Right rail: Grade Level Guide ──────────────────────────────────────────
function GradeLevelGuideCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Grade Level Guide</h3>
      <div className="space-y-1.5">
        {GRADE_LEVEL_GUIDE.map((g) => (
          <div key={g.level} className="flex items-center gap-2.5">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${g.bg} text-[11px] font-bold text-white`}>
              {g.level}
            </span>
            <div>
              <p className="text-[12px] font-semibold text-zinc-900">{g.title}</p>
              <p className="text-[10.5px] text-zinc-400">{g.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Why Add Job Grade ──────────────────────────────────────────
function WhyAddCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Why Add Job Grade?</h3>
      <div className="space-y-1.5">
        {WHY_ADD.map((w) => (
          <div key={w} className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 rounded-full bg-emerald-100 text-emerald-600 p-0.5" />
            <p className="text-[12px] text-zinc-600 leading-snug">{w}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right rail: Note ────────────────────────────────────────────────────────
function NoteCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={14} className="text-indigo-500" />
        <h3 className="text-[13.5px] font-bold text-zinc-900">Note</h3>
      </div>
      <ul className="space-y-1.5">
        {NOTES.map((n) => (
          <li key={n} className="flex items-start gap-1.5 text-[11.5px] text-zinc-500 leading-snug">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function AddNewJobGradePage() {
  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <PageHeading />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2.5 items-start">
        <div className="min-w-0 space-y-2">
          <JobGradeDetailsCard />
          <ExampleGradesCard />
          <AdditionalInfoCard />
        </div>

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <GradeLevelGuideCard />
          <WhyAddCard />
          <NoteCard />
        </div>
      </div>

      <footer className="text-center text-[11px] text-zinc-400 py-3 flex items-center justify-center gap-2.5 flex-wrap">
        <span>© 2025 Crewcam HRMS. All Rights Reserved.</span>
      </footer>
    </div>
  );
}