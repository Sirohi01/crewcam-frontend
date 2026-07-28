"use client";

import React from "react";
import {
  ArrowLeft,
  Save,
  ChevronDown,
  IdCard,
  Info,
  CheckCircle2,
  Lightbulb,
  Users,
  BarChart3,
  Megaphone,
  ShoppingBag,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const benefits = [
  "Organize roles into logical groups",
  "Improve reporting and analytics",
  "Standardize career paths",
  "Simplify role and competency mapping",
  "Support consistent compensation planning",
];

const notes = [
  <>
    Fields marked with <span className="text-red-500">*</span> are mandatory.
  </>,
  "You can edit or archive the family anytime.",
  "Job families can be mapped to multiple business units.",
  "Ensure names are clear and meaningful.",
];

const examples = [
  {
    name: "Human Resources",
    code: "HR",
    description:
      "Includes all roles related to HR management, recruitment, employee relations and policies.",
    icon: <Users size={16} strokeWidth={2} />,
    iconBg: "bg-[#eeeaff]",
    iconColor: "text-[#6246d9]",
    codeBg: "bg-[#f1eaff]",
    codeColor: "text-[#6246d9]",
  },
  {
    name: "Finance & Accounts",
    code: "FIN",
    description:
      "Includes roles for accounting, budgeting, finance, taxation and auditing.",
    icon: <BarChart3 size={16} strokeWidth={2} />,
    iconBg: "bg-[#e9f9ed]",
    iconColor: "text-[#36a34a]",
    codeBg: "bg-[#eaf8e9]",
    codeColor: "text-[#369b42]",
  },
  {
    name: "Marketing",
    code: "MKT",
    description:
      "Includes brand management, digital marketing, market research and communications.",
    icon: <Megaphone size={16} strokeWidth={2} />,
    iconBg: "bg-[#f0eaff]",
    iconColor: "text-[#5d42dc]",
    codeBg: "bg-[#eef0ff]",
    codeColor: "text-[#4b50c8]",
  },
  {
    name: "Sales",
    code: "SAL",
    description:
      "Includes business development, sales operations, key account management.",
    icon: <ShoppingBag size={16} strokeWidth={2} />,
    iconBg: "bg-[#fff3e3]",
    iconColor: "text-[#e88b16]",
    codeBg: "bg-[#fff4e6]",
    codeColor: "text-[#d77e12]",
  },
  {
    name: "Customer Support",
    code: "CS",
    description:
      "Includes customer service, tech support, call center and client success roles.",
    icon: <Headphones size={16} strokeWidth={2} />,
    iconBg: "bg-[#e8f8fa]",
    iconColor: "text-[#239aa8]",
    codeBg: "bg-[#e7f7f8]",
    codeColor: "text-[#268e98]",
  },
];

function Field({
  label,
  required,
  helper,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-[#101743]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helper && (
        <p className="mt-1 text-[10px] text-zinc-400">{helper}</p>
      )}
    </div>
  );
}

export default function AddNewJobFamilyPage() {
  const router = useRouter();
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      {/* Breadcrumb */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="text-zinc-400">Organization Setup</span>
        <span className="text-sm font-normal leading-none">›</span>
        <Link href="/dashboard/job-families" className="text-zinc-400">Job Families</Link>
        <span className="text-sm font-normal leading-none">›</span>
        <span>Add New Job Family</span>
      </div>

      {/* Header */}
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mt-1 text-[24px] font-bold text-zinc-900">
            Add New Job Family
          </h1>
          <p className="mt-0.5 text-[13px] text-zinc-400">
            Create a new job family to group related roles and maintain
            consistency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/job-families")}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border cursor-pointer border-[#e0e4eb] bg-white px-3 text-[11px] font-semibold text-[#101743] sm:flex-none"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Job Families
          </button>

          <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#153ee7] px-3 text-[11px] font-semibold text-white shadow-[0_2px_5px_rgba(21,62,231,0.25)] sm:flex-none">
            <Save size={14} strokeWidth={2} />
            Save Job Family
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[1fr_300px]">
        {/* Left column */}
        <div className="flex h-full flex-col gap-2">
          {/* Job Family Information */}
          <div className="rounded-xl border border-[#e7e9ee] bg-white p-3">
            <div className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-[#101743]">
              <IdCard size={16} className="text-[#2474d5]" />
              Job Family Information
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Job Family Name" required helper="e.g., Information Technology">
                <input
                  defaultValue="Information Technology"
                  className="h-6 w-full rounded-md border border-[#e0e4eb] px-2.5 text-[11px] font-medium text-[#101743] outline-none"
                />
              </Field>

              <Field label="Family Code" required helper="e.g., IT">
                <input
                  defaultValue="IT"
                  className="h-6 w-full rounded-md border border-[#e0e4eb] px-2.5 text-[11px] font-medium text-[#101743] outline-none"
                />
              </Field>

              <Field label="Description" required>
                <div className="relative">
                  <textarea
                    defaultValue="Includes all roles related to technology, software development, infrastructure and IT support."
                    rows={3}
                    className="w-full resize-none rounded-md border border-[#e0e4eb] px-2.5 py-2 text-[11px] font-medium leading-[16px] text-[#101743] outline-none"
                  />
                  <span className="pointer-events-none absolute bottom-1.5 right-2 text-[9px] text-zinc-400">
                    92/200
                  </span>
                </div>
              </Field>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Parent Family (Optional)" helper="Select if this is a sub-family">
                <div className="relative">
                  <select className="h-6 w-full appearance-none rounded-md border border-[#e0e4eb] px-2.5 text-[11px] font-medium text-[#101743] outline-none">
                    <option>Select parent family</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#101743]"
                  />
                </div>
              </Field>

              <Field label="Applicable Business Unit" helper="Select the applicable business unit">
                <div className="relative">
                  <select className="h-6 w-full appearance-none rounded-md border border-[#e0e4eb] px-2.5 text-[11px] font-medium text-[#101743] outline-none">
                    <option>Select business unit</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#101743]"
                  />
                </div>
              </Field>

              <Field label="Status" required helper="Choose current status">
                <div className="relative">
                  <select className="h-6 w-full appearance-none rounded-md border border-[#e0e4eb] px-2.5 text-[11px] font-medium text-[#101743] outline-none">
                    <option>Active</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#101743]"
                  />
                </div>
              </Field>
            </div>

            <div className="mt-3">
              <Field label="Key Responsibilities (Optional)">
                <div className="relative">
                  <textarea
                    defaultValue={
                      "• Design, develop and maintain technology solutions.\n• Ensure system security, performance and reliability.\n• Provide technical support and continuous improvement."
                    }
                    rows={4}
                    className="w-full resize-none rounded-md border border-[#e0e4eb] px-2.5 py-2 text-[11px] font-medium leading-[18px] text-[#101743] outline-none"
                  />
                  <span className="pointer-events-none absolute bottom-1.5 right-2 text-[9px] text-zinc-400">
                    0/300
                  </span>
                </div>
              </Field>
            </div>
          </div>

          {/* Examples */}
          <div className="rounded-xl border border-[#e7e9ee] bg-white p-3">
            <div className="mb-3 text-[13px] font-bold text-[#101743]">
              Examples of Job Families in Your Organization
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {examples.map((ex) => (
                <div
                  key={ex.code}
                  className="rounded-lg border border-[#edf0f4] p-2.5"
                >
                  <div className="flex gap-2 ">
                    <div
                      className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${ex.iconBg} ${ex.iconColor}`}
                    >
                      {ex.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#101743]">
                        {ex.name}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold ${ex.codeBg} ${ex.codeColor}`}
                      >
                        {ex.code}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] leading-[15px] text-zinc-400">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md border border-[#dbe4ff] bg-[#eef2ff] p-2.5">
              <Lightbulb size={14} className="mt-0.5 shrink-0 text-[#2474d5]" />
              <p className="text-[11px] leading-[16px] text-[#2474d5]">
                <span className="font-bold text-[#2474d5]">Tip:</span> Job families help in
                structuring roles, mapping competencies and creating
                consistent career paths.
              </p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex h-full flex-col gap-2">
          <div className="rounded-xl border border-[#e7e9ee] bg-white p-3">
            <div className="mb-2 text-[13px] font-bold text-[#101743]">
              About Job Family
            </div>
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-[#2474d5]">
                <IdCard size={16} />
              </div>
              <p className="text-[11px] leading-[17px] text-[#31365c]">
                Job families group similar roles based on function or domain.
                This helps in role management, reporting, career path
                planning and salary benchmarking.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#e7e9ee] bg-white p-3">
            <div className="mb-2 text-[13px] font-bold text-[#101743]">
              Benefits
            </div>
            <ul className="flex flex-col gap-2">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-1.5 text-[11px] leading-[16px] text-[#31365c]"
                >
                  <CheckCircle2
                    size={14}
                    className="mt-[1px] shrink-0 text-[#2da348]"
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-1 flex-col rounded-xl border border-[#e7e9ee] bg-white p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[#101743]">
              <Info size={15} className="text-[#2474d5]" />
              Note
            </div>
            <ul className="flex flex-col gap-2">
              {notes.map((n, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-[11px] leading-[16px] text-[#31365c]"
                >
                  <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#2474d5]" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>


      {/* Copyright */}
      <footer className="pt-2 text-center text-[10px] font-medium text-[#565b7b]">
        © 2025 Crewcam HRMS. All rights reserved.
      </footer>
    </main>
  );
}