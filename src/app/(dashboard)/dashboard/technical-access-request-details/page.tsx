"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Download,
  ChevronDown,
  FileText,
  Building2,
  Briefcase,
  Calendar,
  User,
  Phone,
  Info,
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import PageLayout from "@/components/ui/pageLayout";

/* -------------------------------------------------------------------------- */
/*  Spacing constants — kept tight everywhere per design spec                 */
/* -------------------------------------------------------------------------- */

const GAP = "gap-2";
const PAD = "p-2";
const CARD_PAD = "p-4";
const CARD_RADIUS = "rounded-lg";
const CARD_BORDER = "border border-gray-200";
const PAGE_PADDING = "px-4 sm:px-6 lg:px-8";

/* -------------------------------------------------------------------------- */
/*  Types & data                                                              */
/* -------------------------------------------------------------------------- */

const tabs = [
  "Request Overview",
  "Access Details",
  "Data Access Scope",
  "Approvals",
  "Activity Log",
];

const requestInfoRows = [
  { icon: FileText, label: "Request ID", value: "TAR-2025-028" },
  { icon: Building2, label: "Company Name", value: "TechVision Pvt. Ltd." },
  {
    icon: Briefcase,
    label: "Purpose",
    value: "System Maintenance",
    sub: "Server optimization",
  },
  { icon: Calendar, label: "Requested On", value: "30 May 2025, 11:20 AM" },
];

const accessTimeRows = [
  {
    icon: Calendar,
    label: "Requested Start Date",
    value: "31 May 2025, 09:00 AM",
  },
  {
    icon: Calendar,
    label: "Requested End Date",
    value: "02 Jun 2025, 06:00 PM",
  },
  { icon: Calendar, label: "Total Duration", value: "3 Days" },
  { icon: FileText, label: "Access Type", value: "Time-Bound Access" },
];

const requestStatusSteps = [
  {
    step: 1,
    title: "Request Initiated",
    desc: "30 May 2025, 11:20 AM",
    sub: "Rahul Verma (Crewcam)",
    state: "done",
  },
  {
    step: 2,
    title: "Pending HR Approval",
    desc: "Awaiting approval from company HR",
    state: "current",
  },
  {
    step: 3,
    title: "Access Granted",
    desc: "Pending",
    state: "upcoming",
  },
  {
    step: 4,
    title: "Access Completed",
    desc: "Pending",
    state: "upcoming",
  },
];

const activityTimeline = [
  {
    step: 1,
    color: "bg-blue-600",
    title: "Request Initiated",
    date: "30 May 2025",
    time: "11:20 AM",
    desc: "Rahul Verma (Crewcam) submitted the technical access request.",
  },
  {
    step: 2,
    color: "bg-green-600",
    title: "Reviewed by IT Head",
    date: "30 May 2025",
    time: "11:45 AM",
    desc: "Request reviewed and recommended for HR approval.",
    extra: "Reviewed by: Sandeep Rao (IT Head)",
  },
  {
    step: 3,
    color: "bg-orange-500",
    title: "Pending HR Approval",
    date: "30 May 2025",
    time: "11:45 AM",
    desc: "Awaiting approval from HR Manager.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Small components                                                          */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className={`flex items-center ${GAP}`}>
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-blue-600">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="flex justify-between w-full">

        <span className="text-xs flex-1">{label}</span>
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-800">{value}</p>
          {sub && <p className="text-xs ">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

const TechnicalAccessRequestDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("Request Overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <PageLayout>
        {/* Breadcrumb */}
        <nav className={`mb-2 flex items-center ${GAP} text-xs`}>
          <a href="#" className="text-blue-600 hover:underline">
            Home
          </a>
          <ChevronRight className="h-3 w-3 " />
          <a href="#" className="text-blue-600 hover:underline">
            Technical Access Management
          </a>
          <ChevronRight className="h-3 w-3 " />
          <span className="">Request Details</span>
        </nav>

        {/* Title row */}
        <div className="mb-2 flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Technical Access Request Details
            </h1>
            <p className="text-xs ">
              View request information, approval status and access
              configuration
            </p>
          </div>
          <div className={`flex flex-wrap items-center ${GAP}`}>
            <button
              className={`flex items-center ${GAP} rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium  hover:bg-gray-50`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Requests
            </button>
            <button
              className={`flex items-center ${GAP} rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium  hover:bg-gray-50`}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>
            <button
              className={`flex items-center ${GAP} rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700`}
            >
              More Actions
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Summary card */}
        <div
          className={`mb-2 bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex items-start gap-2 lg:col-span-1">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </span>
              <div>
                <p className="text-xs ">Request ID</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-gray-900">
                    TAR-2025-028
                  </p>
                  <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                    Pending
                  </span>
                </div>
                <p className="text-xs ">
                  Requested on 30 May 2025, 11:20 AM
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs ">Purpose</p>
              <p className="text-sm font-semibold text-gray-800">
                System Maintenance
              </p>
              <p className="text-xs ">Server optimization</p>
            </div>

            <div>
              <p className="mb-1 text-xs ">
                Requested By (Crewcam)
              </p>
              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/64?img=12"
                  alt="Rahul Verma"
                  className="h-7 w-7 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Rahul Verma
                  </p>
                  <p className="text-xs ">Sr. Support Engineer</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs ">Company</p>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-600 text-[10px] font-bold text-white">
                  T
                </span>
                <p className="text-sm font-medium text-gray-800">
                  TechVision Pvt. Ltd.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs ">Access Type</p>
              <span className="inline-block rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">
                Time-Bound Access
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`mb-2 flex flex-wrap ${GAP} border-b border-gray-200 bg-white ${CARD_BORDER} ${CARD_RADIUS} px-4 pt-2`}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 pb-2 text-xs font-medium transition-colors ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent  hover:"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className={`grid grid-cols-1 ${GAP} lg:grid-cols-4`}>
          {/* Request Information */}
          <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Request Information
            </h3>
            <div className="flex flex-col gap-3">
              {requestInfoRows.map((row) => (
                <InfoRow key={row.label} {...row} />
              ))}
              <div className={`flex items-center ${GAP}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 ">
                  <User className="h-3.5 w-3.5" />
                </span>
                <div className="flex justify-between w-full">
                  <span className="text-xs flex-1">
                    Requested By (Crewcam)
                  </span>
                  <div className="mt-0.5 flex items-center gap-2 flex-1">
                    <img
                      src="https://i.pravatar.cc/64?img=12"
                      alt="Rahul Verma"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Rahul Verma
                      </p>
                      <p className="text-xs ">
                        Sr. Support Engineer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`flex items-center ${GAP}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 ">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <div className="flex justify-between w-full">
                  <p className="text-xs flex-1">Contact</p>
                  <div className="flex-1">

                    <p className="text-xs font-medium text-gray-800 break-all">
                      rahul.verma@crewcam.com
                    </p>
                    <p className="text-xs font-medium text-gray-800">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Access Time & Duration */}
          <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Access Time &amp; Duration
            </h3>
            <div className="flex flex-col gap-3">
              {accessTimeRows.map((row) => (
                <InfoRow key={row.label} {...row} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 p-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
              <p className="text-xs ">
                Access will be automatically revoked on{" "}
                <span className="block font-semibold text-orange-600">
                  02 Jun 2025, 06:00 PM
                </span>
              </p>
            </div>
          </div>

          {/* Request Status */}
          <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Request Status
            </h3>
            <div className="flex flex-col">
              {requestStatusSteps.map((step, idx) => {
                const isLast = idx === requestStatusSteps.length - 1;
                const circleClass =
                  step.state === "done"
                    ? "bg-blue-600 text-white"
                    : step.state === "current"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-600 text-white";
                const titleClass =
                  step.state === "upcoming"
                    ? ""
                    : "text-gray-900";
                return (
                  <div key={step.step} className="relative flex gap-2 pb-4 last:pb-0">
                    {!isLast && (
                      <span className="absolute left-3 top-6 h-full w-px bg-gray-200" />
                    )}
                    <span
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${circleClass}`}
                    >
                      {step.step}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${titleClass}`}>
                        {step.title}
                      </p>
                      <p className="text-xs ">{step.desc}</p>
                      {step.sub && (
                        <p className="text-xs ">{step.sub}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Progress */}
          <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Approval Progress
            </h3>
            <div className="mb-2 flex flex-col items-center justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * 0.5}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-900">
                  1/2
                </span>
              </div>
              <p className="mt-2 text-xs ">
                Approvals Completed
              </p>
            </div>

            <p className="mb-2 text-xs font-semibold ">
              Pending Approvals (1)
            </p>
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[10px] font-semibold text-white">
                A
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Anjali Sharma
                </p>
                <p className="text-xs ">HR Manager</p>
                <p className="text-xs ">TechVision Pvt. Ltd.</p>
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold ">
              Completed Approvals (1)
            </p>
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/64?img=51"
                alt="Sandeep Rao"
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Sandeep Rao
                </p>
                <p className="text-xs ">IT Head</p>
                <p className="text-xs ">TechVision Pvt. Ltd.</p>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            </div>
          </div>

          {/* Request Justification (spans 2 cols) */}
          <div
            className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD} lg:col-span-2`}
          >
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Request Justification
            </h3>
            <p className="mb-2 text-xs ">
              We need to perform server optimization and clean up redundant
              data to improve system performance.
            </p>
            <p className="text-xs ">
              This includes database maintenance, log cleanup, and
              configuration tuning.
            </p>
          </div>

          {/* Request Activity Timeline (spans 2 cols, 2 rows) */}
          <div
            className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD} lg:col-span-2 lg:row-span-2`}
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Request Activity Timeline
            </h3>
            <div className="flex flex-col">
              {activityTimeline.map((item, idx) => {
                const isLast = idx === activityTimeline.length - 1;
                return (
                  <div key={item.step} className="relative flex gap-2 pb-4 last:pb-0">
                    {!isLast && (
                      <span className="absolute left-3 top-6 h-full w-px bg-gray-200" />
                    )}
                    <span
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${item.color}`}
                    >
                      {item.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-0.5 sm:flex-row sm:items-start">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="whitespace-nowrap text-xs ">
                          {item.date}{" "}
                        </p>
                      </div>
                       <div className="flex flex-col justify-between gap-0.5 sm:flex-row sm:items-start">
                        <div>

                      <p className="text-xs ">{item.desc}</p>
                      {item.extra && (
                        <p className="text-xs">
                          · {item.extra}
                        </p>
                      )}
                      </div>
                          <span className="ml-1 text-xs">{item.time}</span>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attachments (spans 2 cols) */}
          <div
            className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD} lg:col-span-2`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Attachments (2)
              </h3>
              <a
                href="#"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                View All
              </a>
            </div>
            <div className={`grid grid-cols-1 ${GAP} sm:grid-cols-2`}>
              <div
                className={`flex items-center justify-between rounded-lg border border-gray-200 ${PAD} px-3`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-100">
                    <FileText className="h-4 w-4 text-red-500" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Maintenance_Plan.pdf
                    </p>
                    <p className="text-xs ">PDF · 1.2 MB</p>
                  </div>
                </div>
                <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200  hover:bg-gray-50">
                  <FileDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div
                className={`flex items-center justify-between rounded-lg border border-gray-200 ${PAD} px-3`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-100">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Access_Scope_Details.xlsx
                    </p>
                    <p className="text-xs ">XLSX · 245 KB</p>
                  </div>
                </div>
                <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200  hover:bg-gray-50">
                  <FileDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-4 text-xs  sm:flex-row">
          <p>© 2025 Crewcam HRMS. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:">
              Privacy Policy
            </a>
            <a href="#" className="hover:">
              Terms of Service
            </a>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default TechnicalAccessRequestDetailsPage;