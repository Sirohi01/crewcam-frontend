"use client";

import React from "react";
import {
  ArrowLeft,
  Pencil,
  LayoutGrid,
  ChevronDown,
  FileText,
  FolderOpen,
  Building2,
  UserRound,
  Users,
  Info,
  ClipboardList,
  Star,
  StickyNote,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/navigation";
import Link from "next/link";

const infoCards = [
  {
    icon: <FileText size={18} />,
    iconBg: "bg-[#eaf2ff]",
    iconColor: "text-[#2474d5]",
    label: "Family Code",
    value: "IT",
  },
  {
    icon: <FolderOpen size={18} />,
    iconBg: "bg-[#f3eaff]",
    iconColor: "text-[#8b3fdb]",
    label: "Parent Family",
    value: "Corporate Functions",
  },
  {
    icon: <Building2 size={18} />,
    iconBg: "bg-[#e6f8ec]",
    iconColor: "text-[#2da348]",
    label: "Applicable Business Units",
    value: "All Business Units",
  },
  {
    icon: <UserRound size={18} />,
    iconBg: "bg-[#fff4df]",
    iconColor: "text-[#ec8a13]",
    label: "Total Designations",
    value: "12",
  },
  {
    icon: <Users size={18} />,
    iconBg: "bg-[#eaf3ff]",
    iconColor: "text-[#2672d0]",
    label: "Total Employees",
    value: "86",
  },
];

const tabs = [
  { name: "Overview", active: true },
  { name: "Designations (12)", active: false },
  { name: "Job Grades Mapping (4)", active: false },
  { name: "Employees (86)", active: false },
  { name: "Related Documents", active: false },
];

const responsibilities = [
  "Design, develop and maintain software applications and systems.",
  "Ensure system performance, security, availability and scalability.",
  "Manage IT infrastructure, networks and cloud services.",
  "Provide technical support and resolve issues in a timely manner.",
  "Implement best practices and drive continuous improvement in IT operations.",
];

const skills = [
  "Programming",
  "System Analysis",
  "Cloud Computing",
  "Database Management",
  "Networking",
  "Cyber Security",
  "IT Support",
  "Project Management",
  "Problem Solving",
  "Communication",
];

const designationExamples = [
  { name: "Chief Technology Officer (CTO)", grade: "JG-10", bg: "bg-[#f3eaff]", color: "text-[#8b3fdb]" },
  { name: "IT Manager", grade: "JG-08", bg: "bg-[#eaf2ff]", color: "text-[#2474d5]" },
  { name: "Senior Software Engineer", grade: "JG-07", bg: "bg-[#eaf2ff]", color: "text-[#2474d5]" },
  { name: "System Administrator", grade: "JG-05", bg: "bg-[#e6f8ec]", color: "text-[#2da348]" },
  { name: "IT Support Executive", grade: "JG-03", bg: "bg-[#fff4df]", color: "text-[#ec8a13]" },
];

const gradeDistribution = [
  { name: "Level 10", value: 1, pct: "8%", color: "#8b3fdb" },
  { name: "Level 8", value: 1, pct: "8%", color: "#2474d5" },
  { name: "Level 7", value: 3, pct: "25%", color: "#1fb5c9" },
  { name: "Level 5", value: 5, pct: "42%", color: "#2da348" },
  { name: "Level 3", value: 2, pct: "17%", color: "#ec8a13" },
];

function InfoCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium leading-tight text-[#5c6178]">
          {label}
        </p>
        <p className="truncate text-xs font-bold leading-tight text-[#101743]">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e7e9ee] bg-white p-2 h-full">
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold text-[#101743]`}>
        <span className={iconColor}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function JobFamilyDetailsPage() {
  const router = useRouter()
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      {/* Breadcrumb */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="text-zinc-400">Organization Setup</span>
        <span className="text-sm font-normal leading-none">›</span>
        <Link href="/dashboard/job-families" className="text-zinc-400">Job Families</Link>
        <span className="text-sm font-normal leading-none">›</span>
        <span>Job Family Details</span>
      </div>

      {/* Header */}
      <div className="mb-0 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-bold text-zinc-900">
              Information Technology (IT)
            </h1>
            <span className="rounded border border-[#c6ead0] bg-[#e9f8ec] px-2 py-0.5 text-[10px] font-semibold text-[#22923d]">
              Active
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">
            Includes all roles related to technology, software development,
            infrastructure and IT support.
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

          <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#e0e4eb] bg-white px-3 text-[11px] font-semibold text-[#101743] sm:flex-none">
            <Pencil size={14} strokeWidth={2} />
            Edit
          </button>

          <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#153ee7] px-3 text-[11px] font-semibold text-white shadow-[0_2px_5px_rgba(21,62,231,0.25)] sm:flex-none">
            <LayoutGrid size={14} strokeWidth={2} />
            Actions
            <ChevronDown size={13} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mb-2 py-2 grid grid-cols-2 divide-y divide-[#edf0f4] rounded-xl border border-[#e7e9ee] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
        {infoCards.map((c) => (
          <InfoCard key={c.label} {...c} />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex min-h-full flex-col gap-2">
          {/* Tabs */}
          <div className="mb-2 flex w-full border-b border-[#e7e9ee]">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`flex-1 whitespace-nowrap border-b-2 py-1.5 text-[10px] font-semibold ${tab.active
                    ? "border-[#153ee7] text-[#153ee7]"
                    : "border-transparent text-[#5c6178]"
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <SectionCard
              icon={<Info size={15} />}
              iconColor="text-[#2474d5]"
              title="About This Job Family"
            >
              <p className="text-[11px] leading-[18px] text-[#31365c]">
                The Information Technology job family encompasses roles that plan,
                develop, implement and support technology solutions to meet business
                needs. It includes software development, system administration,
                network management, IT support and information security functions.
              </p>
            </SectionCard>
          </div>

          <div className="flex-1">
            <SectionCard
              icon={<ClipboardList size={15} />}
              iconColor="text-[#153ee7]"
              title="Key Responsibilities"
            >
              <ul className="flex flex-col gap-1.5">
                {responsibilities.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-1.5 text-[11px] leading-[18px] text-[#31365c]"
                  >
                    <span className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#153ee7]" />
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="flex-1">
            <SectionCard
              icon={<Star size={15} />}
              iconColor="text-[#2474d5]"
              title="Key Skills (Typical)"
            >
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-[#e0e4eb] bg-[#f5f7fb] px-2 py-1 text-[10px] font-medium text-[#2474d5]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="flex-1">
            <SectionCard
              icon={<StickyNote size={15} />}
              iconColor="text-[#2da348]"
              title="Notes (Optional)"
            >
              <p className="text-[11px] leading-[18px] text-[#31365c]">
                This job family is applicable across all business units.
              </p>
            </SectionCard>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="flex min-h-full flex-col gap-2">
          {/* Designation Examples */}
          <div className="rounded-xl border border-[#e7e9ee] bg-white">
            <div className="flex items-center gap-1.5 px-2 pt-2 text-xs font-bold text-[#101743]">
              <Briefcase size={15} className="text-[#153ee7]" />
              Designation Examples
            </div>

            <div className="grid grid-cols-[1fr_70px] gap-1 px-2 pb-1.5 pt-2 text-[10px] font-bold text-[#5c6178]">
              <span>Designation</span>
              <span>Job Grade</span>
            </div>

            <div className="flex flex-col">
              {designationExamples.map((d) => (
                <div
                  key={d.name}
                  className="grid grid-cols-[1fr_70px] items-center gap-1 border-b border-[#edf0f4] px-2 py-1 transition-colors duration-150 hover:bg-blue-100"
                >
                  <span className="truncate text-[11px] font-medium text-[#101743]">
                    {d.name}
                  </span>

                  <span
                    className={`inline-flex w-fit rounded px-1.5 py-0.5 text-[10px] font-bold ${d.bg} ${d.color}`}
                  >
                    {d.grade}
                  </span>
                </div>
              ))}
            </div>

            <button className="px-2 pb-2 pt-2 text-[11px] font-semibold text-[#153ee7]">
              View All (12)
            </button>
          </div>

          {/* Job Grade Distribution */}
          <div className="rounded-xl border border-[#e7e9ee] bg-white p-2">
            <div className="mb-2 text-[12px] font-bold text-[#101743]">
              Job Grade Distribution
            </div>

            <div className="flex items-center gap-2">
              {/* Chart */}
              <div className="relative flex h-[90px] w-[90px] shrink-0 items-center justify-center">
                <PieChart width={90} height={90}>
                  <Pie
                    data={gradeDistribution}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={26}
                    outerRadius={42}
                    stroke="none"
                  >
                    {gradeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>

                {/* Center Text */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[14px] font-bold leading-none text-[#101743]">
                    12
                  </span>

                  <span className="mt-0.5 text-[7px] leading-none ">
                    Designations
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-1 flex-col gap-1">
                {gradeDistribution.map((g) => (
                  <div
                    key={g.name}
                    className="flex items-center justify-between text-[10px]"
                  >
                    <span className="flex items-center gap-1.5 text-[#31365c]">
                      <span
                        className="h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ backgroundColor: g.color }}
                      />

                      {g.name} ({g.value})
                    </span>

                    <span className="font-semibold text-[#101743]">
                      {g.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="flex flex-col gap-2 rounded-xl border border-[#e4e6ff] bg-[#f3f4ff] p-2">
            <div className="flex items-start gap-2">

              <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#153ee7]" />
              <p className="text-[12px] font-bold text-[#101743]">Tip</p>
            </div>

            <div>

              <p className="mt-0.5 text-[11px] leading-[16px] text-[#31365c]">
                Keep job family information up to date to ensure accurate reporting
                and role mapping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <footer className="pt-3 text-center text-[10px] font-medium text-[#565b7b]">
        © 2025 Crewcam HRMS. All rights reserved.
      </footer>
    </main>
  );
}