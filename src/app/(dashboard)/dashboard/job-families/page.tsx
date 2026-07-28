"use client";

import React from "react";
import {
  Download,
  Plus,
  ChevronDown,
  Search,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  UserRound,
  BarChart3,
  Megaphone,
  ShoppingBag,
  Headphones,
  Laptop,
  Wrench,
  Shield,
  PlusCircle,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadCrumb";

type JobFamily = {
  id: number;
  name: string;
  code: string;
  description: string;
  designations: number;
  employees: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  codeBg: string;
  codeColor: string;
};

const jobFamilies: JobFamily[] = [
  {
    id: 1,
    name: "Human Resources",
    code: "HR",
    description:
      "Includes all roles related to HR management, recruitment, employee relations and policies.",
    designations: 8,
    employees: 45,
    icon: <Users size={16} strokeWidth={2} />,
    iconBg: "bg-[#eeeaff]",
    iconColor: "text-[#6246d9]",
    codeBg: "bg-[#f1eaff]",
    codeColor: "text-[#6246d9]",
  },
  {
    id: 2,
    name: "Finance & Accounts",
    code: "FIN",
    description:
      "Includes roles for accounting, budgeting, finance, taxation and auditing.",
    designations: 10,
    employees: 58,
    icon: <BarChart3 size={16} strokeWidth={2} />,
    iconBg: "bg-[#e9f9ed]",
    iconColor: "text-[#36a34a]",
    codeBg: "bg-[#eaf8e9]",
    codeColor: "text-[#369b42]",
  },
  {
    id: 3,
    name: "Marketing",
    code: "MKT",
    description:
      "Includes brand management, digital marketing, market research and communications.",
    designations: 7,
    employees: 32,
    icon: <Megaphone size={16} strokeWidth={2} />,
    iconBg: "bg-[#f0eaff]",
    iconColor: "text-[#5d42dc]",
    codeBg: "bg-[#eef0ff]",
    codeColor: "text-[#4b50c8]",
  },
  {
    id: 4,
    name: "Sales",
    code: "SAL",
    description:
      "Includes business development, sales operations, key account management.",
    designations: 9,
    employees: 67,
    icon: <ShoppingBag size={16} strokeWidth={2} />,
    iconBg: "bg-[#fff3e3]",
    iconColor: "text-[#e88b16]",
    codeBg: "bg-[#fff4e6]",
    codeColor: "text-[#d77e12]",
  },
  {
    id: 5,
    name: "Customer Support",
    code: "CS",
    description:
      "Includes customer service, tech support, call center and client success roles.",
    designations: 6,
    employees: 48,
    icon: <Headphones size={16} strokeWidth={2} />,
    iconBg: "bg-[#e8f8fa]",
    iconColor: "text-[#239aa8]",
    codeBg: "bg-[#e7f7f8]",
    codeColor: "text-[#268e98]",
  },
  {
    id: 6,
    name: "Information Technology",
    code: "IT",
    description:
      "Includes all roles related to technology, software development, infrastructure and IT support.",
    designations: 12,
    employees: 86,
    icon: <Laptop size={16} strokeWidth={2} />,
    iconBg: "bg-[#eaf3ff]",
    iconColor: "text-[#2474d5]",
    codeBg: "bg-[#eaf2ff]",
    codeColor: "text-[#3176c9]",
  },
  {
    id: 7,
    name: "Operations",
    code: "OPS",
    description:
      "Includes production, supply chain, logistics and operations management.",
    designations: 9,
    employees: 71,
    icon: <Wrench size={16} strokeWidth={2} />,
    iconBg: "bg-[#ffeaf3]",
    iconColor: "text-[#e32b83]",
    codeBg: "bg-[#ffedf6]",
    codeColor: "text-[#db2980]",
  },
  {
    id: 8,
    name: "Administration",
    code: "ADM",
    description:
      "Includes office administration, facility, legal and compliance roles.",
    designations: 7,
    employees: 25,
    icon: <Shield size={16} strokeWidth={2} />,
    iconBg: "bg-[#fff7e4]",
    iconColor: "text-[#eba817]",
    codeBg: "bg-[#fff5df]",
    codeColor: "text-[#e49a0c]",
  },
];

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-[#e8eaf0] bg-white p-2">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold leading-tight text-[#111943]">
            {title}
          </p>

          <p className="text-base font-bold leading-tight text-[#101743]">
            {value}
          </p>

          <p className="truncate text-[10px] leading-tight text-[#31365c]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JobFamiliesPage() {
  const router = useRouter()
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      {/* Breadcrumb */}
     <Breadcrumb
  items={[
    { label: "Organization Setup", href: "/dashboard" },
    { label: "Job Families" },
  ]}
/>

      {/* Header */}
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mt-1 text-[24px] font-bold text-zinc-900">
            Job Families
          </h1>

          <p className="mt-0.5 text-xs text-zinc-400">
            Manage and organize job families to group related roles and
            maintain consistency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#e0e4eb] bg-white px-3 text-[11px] font-semibold text-[#101743] sm:flex-none">
            <Download size={14} strokeWidth={2} />
            Export
          </button>

        <button
  onClick={() => router.push("/dashboard/add-job-family")}
  className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#153ee7] px-3 text-[11px] font-semibold text-white shadow-[0_2px_5px_rgba(21,62,231,0.25)] sm:flex-none"
>
  <PlusCircle size={14} strokeWidth={2} />
  Add New Job Family
</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <SummaryCard
          icon={<BriefcaseBusiness size={18} />}
          title="Total Job Families"
          value="8"
          subtitle="Active Families"
          iconBg="bg-[#eeeaff]"
          iconColor="text-[#6246d9]"
        />

        <SummaryCard
          icon={<Building2 size={18} />}
          title="Total Designations"
          value="68"
          subtitle="Under These Families"
          iconBg="bg-[#e6f8ec]"
          iconColor="text-[#2da348]"
        />

        <SummaryCard
          icon={<Users size={18} />}
          title="Total Employees"
          value="432"
          subtitle="Mapped to Families"
          iconBg="bg-[#fff4df]"
          iconColor="text-[#ec8a13]"
        />

        <SummaryCard
          icon={<UserRound size={18} />}
          title="Average Employees / Family"
          value="54"
          subtitle="Across All Families"
          iconBg="bg-[#eaf3ff]"
          iconColor="text-[#2672d0]"
        />
      </div>

      {/* Table Container */}
      <section className="overflow-hidden rounded-xl border border-[#e7e9ee] bg-white">
        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-[#edf0f4] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <button className="flex h-6 w-full items-center justify-between rounded-md border border-[#e0e4eb] bg-white px-2.5 text-[11px] font-semibold text-[#101743] sm:w-[120px]">
            All Status
            <ChevronDown size={14} />
          </button>

          <div className="flex h-6 w-full items-center gap-1.5 rounded-md border border-[#e0e4eb] px-2.5 sm:w-[200px]">
            <Search size={14} className="shrink-0 text-[#101743]" />
            <input
              placeholder="Search job families..."
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#101743]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
    <div className="min-w-[920px]">
  <div className="grid grid-cols-[40px_240px_100px_300px_110px_100px_90px_1fr] items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold text-zinc-800">
    <span>#</span>
    <span>Job Family Name</span>
    <span>Family Code</span>
    <span>Description</span>
    <span className="text-center">Designations</span>
    <span className="text-center">Employees</span>
    <span className="text-center">Status</span>
    <span className="text-center">Actions</span>
  </div>

  {jobFamilies.map((family) => (
    <Link href='/dashboard/job-family-detail'  key={family.id}>
    <div
      key={family.id}
      className="grid min-h-[46px] grid-cols-[40px_240px_100px_300px_110px_100px_90px_1fr] items-center gap-2 border-b border-zinc-100 px-3 py-1.5 text-[11px] text-zinc-800"
    >
      <span>{family.id}</span>

      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${family.iconBg} ${family.iconColor}`}
        >
          {family.icon}
        </div>

        <span className="whitespace-nowrap font-semibold">
          {family.name}
        </span>
      </div>

      <div>
        <span
          className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${family.codeBg} ${family.codeColor}`}
        >
          {family.code}
        </span>
      </div>

      <p className="line-clamp-2 max-w-[280px] text-[11px] font-medium leading-snug text-zinc-600">
        {family.description}
      </p>

      <span className="text-center font-medium">
        {family.designations}
      </span>

      <span className="text-center font-medium">
        {family.employees}
      </span>

      <div className="flex justify-center">
        <span className="rounded border border-[#c6ead0] bg-[#e9f8ec] px-2 py-0.5 text-[10px] font-semibold text-[#22923d]">
          Active
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-blue-600">
          <Eye size={14} />
        </button>

        <button className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800">
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
    </Link>
  ))}
</div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] font-medium">
            Showing 1 to 8 of 8 entries
          </span>

          <div className="flex items-center gap-1.5">
            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ef] text-[#7d8495]">
              <ChevronLeft size={14} />
            </button>

            <button className="flex h-7 w-7 items-center justify-center rounded bg-[#153ee7] text-[11px] font-bold text-white">
              1
            </button>

            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ef] text-[#7d8495]">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <footer className="pt-2 text-center text-[10px] font-medium text-[#565b7b]">
        © 2025 Crewcam HRMS. All rights reserved.
      </footer>
    </main>
  );
}