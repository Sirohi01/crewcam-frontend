"use client";

import React, { useState } from "react";
import {
  Download,
  Plus,
  Upload,
  ChevronDown,
  Search,
  Eye,
  Pencil,
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
  Trash2,
  Network,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadCrumb";
import BulkUploadModal, { ColumnConfig } from "@/components/upload/bulkUploadModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface DivisionRow {
  divisionName: string;
  divisionCode: string;
  description: string;
  businessUnit: string;
  divisionHead: string;
  status: string;
}

const divisionColumns: ColumnConfig<DivisionRow>[] = [
  { key: "divisionName", label: "Division Name", required: true, unique: true, sampleValue: "Enterprise Solutions" },
  { key: "divisionCode", label: "Division Code", required: true, unique: true, sampleValue: "ES" },
  { key: "description", label: "Description", required: true, sampleValue: "Handles enterprise clients and B2B software solutions" },
  { key: "businessUnit", label: "Business Unit", sampleValue: "Technology" },
  { key: "divisionHead", label: "Division Head", sampleValue: "EMP102" },
  { key: "status", label: "Status", required: true, sampleValue: "Active", validate: (v) => (["active", "inactive"].includes(String(v).toLowerCase()) ? null : "Status must be Active or Inactive") },
];

type Division = {
  id: number;
  name: string;
  code: string;
  description: string;
  departments: number;
  employees: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  codeBg: string;
  codeColor: string;
};

const defaultDivisions: Division[] = [
  {
    id: 1,
    name: "Corporate Operations",
    code: "CORP",
    description: "Core corporate operations including finance, legal, and administration.",
    departments: 5,
    employees: 150,
    icon: <Building2 size={16} strokeWidth={2} />,
    iconBg: "bg-[#eeeaff]",
    iconColor: "text-[#6246d9]",
    codeBg: "bg-[#f1eaff]",
    codeColor: "text-[#6246d9]",
  },
  {
    id: 2,
    name: "Technology & Product",
    code: "TECH",
    description: "Technology infrastructure, software development and product management.",
    departments: 8,
    employees: 350,
    icon: <Laptop size={16} strokeWidth={2} />,
    iconBg: "bg-[#eaf3ff]",
    iconColor: "text-[#2474d5]",
    codeBg: "bg-[#eaf2ff]",
    codeColor: "text-[#3176c9]",
  },
  {
    id: 3,
    name: "Sales & Marketing",
    code: "S&M",
    description: "Global sales, marketing, branding and client relations.",
    departments: 6,
    employees: 220,
    icon: <Megaphone size={16} strokeWidth={2} />,
    iconBg: "bg-[#f0eaff]",
    iconColor: "text-[#5d42dc]",
    codeBg: "bg-[#eef0ff]",
    codeColor: "text-[#4b50c8]",
  },
  {
    id: 4,
    name: "Customer Success",
    code: "CS",
    description: "Customer support, client onboarding and success management.",
    departments: 4,
    employees: 180,
    icon: <Headphones size={16} strokeWidth={2} />,
    iconBg: "bg-[#e8f8fa]",
    iconColor: "text-[#239aa8]",
    codeBg: "bg-[#e7f7f8]",
    codeColor: "text-[#268e98]",
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

export default function DivisionsPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data: apiDivisions = [], isLoading } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await api.get("/divisions");
      return res.data?.data || res.data || [];
    },
  });

  const { data: apiDepartments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return res.data?.data || res.data || [];
    },
  });

  const { data: apiEmployees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data?.data || res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/divisions/${id}`);
    },
    onSuccess: () => {
      toast.success("Division deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete division");
    },
  });

  // Map backend data to UI format with default icons/colors if needed
  const mappedDivisions = apiDivisions.map((div: any, index: number) => {
    // Pick an icon from the hardcoded list or fallback
    const template = defaultDivisions[index % defaultDivisions.length];
    return {
      _id: div._id || div.id,
      id: index + 1,
      name: div.name || div.divisionName,
      code: div.code || div.divisionCode,
      description: div.description || template.description,
      departments: apiDepartments.filter((d: any) => d.divisionId === div._id).length || 0,
      employees: 0, // Need accurate employee mapping
      icon: template.icon,
      iconBg: template.iconBg,
      iconColor: template.iconColor,
      codeBg: template.codeBg,
      codeColor: template.codeColor,
      isActive: div.isActive !== false
    };
  });

  const filtered = mappedDivisions.filter((div: any) =>
    (div.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (div.code || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const activeCount = apiDivisions.filter((div: any) => div.isActive !== false).length;

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-2 overflow-x-hidden bg-zinc-50/40 p-2 sm:p-2">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Organization Setup", href: "/dashboard" },
          { label: "Divisions" },
        ]}
      />

      {/* Header */}
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mt-1 text-[24px] font-bold text-zinc-900">
            Divisions
          </h1>

          <p className="mt-0.5 text-xs text-zinc-400">
            Manage and organize divisions to structure major functional areas within the organization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#e0e4eb] bg-white px-3 text-[11px] font-semibold text-[#101743] sm:flex-none"
          >
            <Upload size={14} strokeWidth={2} />
            Import
          </button>

          <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#e0e4eb] bg-white px-3 text-[11px] font-semibold text-[#101743] sm:flex-none">
            <Download size={14} strokeWidth={2} />
            Export
          </button>

          <button
            onClick={() => router.push("/dashboard/divisions/add-division")}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#153ee7] px-3 text-[11px] font-semibold text-white shadow-[0_2px_5px_rgba(21,62,231,0.25)] sm:flex-none"
          >
            <PlusCircle size={14} strokeWidth={2} />
            Add New Division
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Network size={18} />}
          title="Total Divisions"
          value={apiDivisions.length.toString()}
          subtitle="Total recorded"
          iconBg="bg-[#eeeaff]"
          iconColor="text-[#6246d9]"
        />

        <SummaryCard
          icon={<BriefcaseBusiness size={18} />}
          title="Total Departments"
          value={apiDepartments?.length?.toString()}
          subtitle="Under These Divisions"
          iconBg="bg-[#e6f8ec]"
          iconColor="text-[#2da348]"
        />

        <SummaryCard
          icon={<Users size={18} />}
          title="Total Employees"
          value={apiEmployees?.length?.toString()}
          subtitle="Mapped to Divisions"
          iconBg="bg-[#fff4df]"
          iconColor="text-[#ec8a13]"
        />

        <SummaryCard
          icon={<UserRound size={18} />}
          title="Average Employees / Division"
          value={apiDivisions.length ? Math.round(apiEmployees.length / apiDivisions.length).toString() : "0"}
          subtitle="Across All Divisions"
          iconBg="bg-[#eaf3ff]"
          iconColor="text-[#2672d0]"
        />
      </div>

      {/* Table Container */}
      <section className="overflow-hidden rounded-xl border border-[#e7e9ee] bg-white">
        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-[#edf0f4] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <button className="flex h-8 w-full items-center justify-between rounded-md border border-[#e0e4eb] bg-white px-2.5 text-[11px] font-semibold text-[#101743] sm:w-[120px]">
            All Status
            <ChevronDown size={14} />
          </button>

          <div className="flex h-8 w-full items-center gap-1.5 rounded-md border border-[#e0e4eb] px-2.5 sm:w-[200px]">
            <Search size={14} className="shrink-0 text-[#101743]" />
            <input
              placeholder="Search divisions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-[#101743]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[40px_240px_100px_300px_110px_100px_90px_1fr] items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold text-zinc-800">
              <span>#</span>
              <span>Division Name</span>
              <span>Division Code</span>
              <span>Description</span>
              <span className="text-center">Departments</span>
              <span className="text-center">Employees</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-zinc-500">Loading...</div>
            ) : paginatedData.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No divisions found.</div>
            ) : (
              paginatedData.map((div: any) => (
                <div
                  key={div._id}
                  className="grid min-h-[46px] grid-cols-[40px_240px_100px_300px_110px_100px_90px_1fr] items-center gap-2 border-b border-zinc-100 px-3 py-1.5 text-[11px] text-zinc-800"
                >
                  <span>{div.id}</span>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${div.iconBg} ${div.iconColor}`}
                    >
                      {div.icon}
                    </div>

                    <span className="whitespace-nowrap font-semibold hover:text-blue-600 cursor-pointer" onClick={() => router.push(`/dashboard/divisions/add-new-division?editId=${div._id}`)}>
                      {div.name}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${div.codeBg} ${div.codeColor}`}
                    >
                      {div.code}
                    </span>
                  </div>

                  <p className="line-clamp-2 max-w-[280px] text-[11px] font-medium leading-snug text-zinc-600">
                    {div.description}
                  </p>

                  <span className="text-center font-medium">
                    {div.departments}
                  </span>

                  <span className="text-center font-medium">
                    {div.employees}
                  </span>

                  <div className="flex justify-center">
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${div.isActive ? 'border-[#c6ead0] bg-[#e9f8ec] text-[#22923d]' : 'border-red-200 bg-red-50 text-red-600'}`}>
                      {div.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => router.push(`/dashboard/divisions/add-new-division?editId=${div._id}`)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-blue-600 hover:bg-zinc-50"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this division?')) {
                          deleteMutation.mutate(div._id);
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-red-600 hover:bg-zinc-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[11px] font-medium">
            Showing {(currentPage - 1) * rowsPerPage + (filtered.length > 0 ? 1 : 0)} to{" "}
            {Math.min(currentPage * rowsPerPage, filtered.length)} of{" "}
            {filtered.length} entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p: any) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ef] text-[#7d8495] hover:bg-zinc-50 disabled:opacity-50"
            >
              <ChevronLeft size={14} />
            </button>

            <button className="flex h-7 w-7 items-center justify-center rounded bg-[#153ee7] text-[11px] font-bold text-white">
              {currentPage}
            </button>

            <button
              onClick={() => setCurrentPage((p: any) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded border border-[#e6e9ef] text-[#7d8495] hover:bg-zinc-50 disabled:opacity-50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <footer className="pt-2 text-center text-[10px] font-medium text-[#565b7b]">
        © 2025 Crewcam HRMS. All rights reserved.
      </footer>

      <BulkUploadModal<DivisionRow>
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Upload Division Data"
        description="Upload an Excel file to import divisions in bulk."
        sampleFileName="Division_Example.xlsx"
        columns={divisionColumns}
        onImport={async (rows) => {
          console.log("Importing divisions:", rows);
        }}
      />
    </main>
  );
}
