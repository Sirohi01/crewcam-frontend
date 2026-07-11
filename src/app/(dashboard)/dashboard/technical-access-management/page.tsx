"use client";

import React, { useState } from "react";
import {
    ChevronRight,
    Info,
    X,
    FileText,
    Clock,
    CheckCircle2,
    Ban,
    Users,
    Search,
    SlidersHorizontal,
    Download,
    Eye,
    UserPlus,
    Plus,
    FileEdit,
    UserCheck,
    Monitor,
    Lock,
    Building2,
    Calendar,
    ShieldCheck,
    ChevronLeft,
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import PageLayout from "@/components/ui/pageLayout";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const PAGE_PADDING = "px-4 sm:px-6 lg:px-8";
const SECTION_GAP = "mb-6";
const CARD_PADDING = "p-4";
const CARD_RADIUS = "rounded-xl";
const CARD_BORDER = "border border-gray-200";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type StatusType = "Pending" | "Approved" | "Rejected";

interface Request {
    id: string;
    company: string;
    requestedBy: {
        name: string;
        role: string;
        initials: string;
        avatarColor: string;
    };
    purpose: string;
    purposeSub: string;
    requestedOn: string;
    requestedTime: string;
    status: StatusType;
    hrApproval: {
        name: string;
        role: string;
        date?: string;
        initial: string;
        avatarColor: string;
        textColor: string;
    };
}

/* -------------------------------------------------------------------------- */
/*  Static Data                                                                */
/* -------------------------------------------------------------------------- */

const requests: Request[] = [
    {
        id: "TAR-2025-028",
        company: "TechVision Pvt. Ltd.",
        requestedBy: {
            name: "Rahul Verma",
            role: "Sr. Support Engineer",
            initials: "RV",
            avatarColor: "bg-blue-100 text-blue-700",
        },
        purpose: "System Maintenance",
        purposeSub: "Server optimization",
        requestedOn: "30 May 2025",
        requestedTime: "11:20 AM",
        status: "Pending",
        hrApproval: {
            name: "Anjali Sharma",
            role: "HR Manager",
            initial: "A",
            avatarColor: "bg-gray-400",
            textColor: "text-gray-400",
        },
    },
    {
        id: "TAR-2025-027",
        company: "TechVision Pvt. Ltd.",
        requestedBy: {
            name: "Amit Kumar",
            role: "Technical Lead",
            initials: "AK",
            avatarColor: "bg-blue-100 text-blue-700",
        },
        purpose: "Data Backup",
        purposeSub: "Database backup",
        requestedOn: "29 May 2025",
        requestedTime: "04:45 PM",
        status: "Pending",
        hrApproval: {
            name: "Pooja Verma",
            role: "HR Manager",
            initial: "P",
            avatarColor: "bg-gray-500",
            textColor: "text-gray-500",
        },
    },
    {
        id: "TAR-2025-026",
        company: "Alpha Solutions Inc.",
        requestedBy: {
            name: "Vikram Joshi",
            role: "DevOps Engineer",
            initials: "VJ",
            avatarColor: "bg-blue-100 text-blue-700",
        },
        purpose: "Performance Check",
        purposeSub: "System performance analysis",
        requestedOn: "28 May 2025",
        requestedTime: "10:10 AM",
        status: "Approved",
        hrApproval: {
            name: "Rahul Mehta",
            role: "HR Manager",
            date: "28 May 2025",
            initial: "R",
            avatarColor: "bg-green-600",
            textColor: "text-green-600",
        },
    },
    {
        id: "TAR-2025-025",
        company: "Bright Future Ltd.",
        requestedBy: {
            name: "Neha Singh",
            role: "Support Engineer",
            initials: "NS",
            avatarColor: "bg-pink-100 text-pink-700",
        },
        purpose: "Bug Fixing",
        purposeSub: "Issue resolution",
        requestedOn: "27 May 2025",
        requestedTime: "09:30 AM",
        status: "Approved",
        hrApproval: {
            name: "Pooja Verma",
            role: "HR Manager",
            date: "27 May 2025",
            initial: "P",
            avatarColor: "bg-green-600",
            textColor: "text-green-600",

        },
    },
    {
        id: "TAR-2025-024",
        company: "NextGen Systems",
        requestedBy: {
            name: "Sandeep Rao",
            role: "Sr. Support Engineer",
            initials: "SR",
            avatarColor: "bg-gray-200 ",
        },
        purpose: "Module Update",
        purposeSub: "HR module update",
        requestedOn: "26 May 2025",
        requestedTime: "03:15 PM",
        status: "Rejected",
        hrApproval: {
            name: "Swati Verma",
            role: "HR Manager",
            date: "26 May 2025",
            initial: "S",
            avatarColor: "bg-red-600",
            textColor: "text-red-600",

        },
    },
];

const statTiles = [
    {
        label: "Total Requests",
        value: "28",
        caption: "All Time",
        icon: FileText,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        captionColor: "",
    },
    {
        label: "Pending Approval",
        value: "7",
        caption: "Awaiting HR Approval",
        icon: Clock,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        captionColor: "text-orange-500",
    },
    {
        label: "Approved",
        value: "16",
        caption: "Access Granted",
        icon: CheckCircle2,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        captionColor: "text-green-600",
    },
    {
        label: "Rejected",
        value: "3",
        caption: "Access Denied",
        icon: Ban,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
        captionColor: "text-red-500",
    },
    {
        label: "Active Access",
        value: "9",
        caption: "Currently Active",
        icon: Users,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        captionColor: "text-purple-600",
    },
];

const tabs = [
    "All Requests",
    "Pending Approval",
    "Approved",
    "Active Access",
    "Rejected",
    "Expired Access",
];

const processFlow = [
    {
        step: 1,
        icon: FileEdit,
        title: "Request Initiated",
        desc: "Crewcam team submits access request",
    },
    {
        step: 2,
        icon: UserCheck,
        title: "HR Review & Approval",
        desc: "Company HR reviews and approves",
    },
    {
        step: 3,
        icon: UserCheck,
        title: "Access Granted",
        desc: "Crewcam team gets time-bound access",
    },
    {
        step: 4,
        icon: Monitor,
        title: "Monitoring",
        desc: "Access activity is logged and monitored",
    },
];

const overviewStats = [
    {
        icon: Building2,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        label: "Companies with Active Access",
        value: "9",
        caption: "Out of 16 Approved",
        captionColor: "",
    },
    {
        icon: Calendar,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        label: "Expiring Soon",
        value: "3",
        caption: "Within next 7 days",
        captionColor: "text-orange-500",
    },
    {
        icon: Clock,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        label: "Avg. Access Duration",
        value: "15",
        caption: "Days",
        captionColor: "",
    },
    {
        icon: ShieldCheck,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        label: "Total Access Sessions",
        value: "42",
        caption: "This Month",
        captionColor: "",
    },
];

/* -------------------------------------------------------------------------- */
/*  Small Components                                                          */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: StatusType }) {
    const styles: Record<StatusType, string> = {
        Pending: "bg-orange-100 text-orange-600",
        Approved: "bg-green-100 text-green-600",
        Rejected: "bg-red-100 text-red-500",
    };
    return (
        <span
            className={`inline-flex items-center rounded-md px-1 py-0.5 text-xs font-medium ${styles[status]}`}
        >
            {status}
        </span>
    );
}

function Avatar({
    initials,
    colorClass,
    size = "h-5 w-5",
}: {
    initials: string;
    colorClass: string;
    size?: string;
}) {
    return (
        <div
            className={`${size} ${colorClass} flex items-center justify-center rounded-full text-xs font-semibold shrink-0`}
        >
            {initials}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

const TechnicalAccessManagementPage = () => {
    const [showBanner, setShowBanner] = useState(true);
    const [activeTab, setActiveTab] = useState("All Requests");

    return (
        <div className="min-h-screen bg-gray-50">
            <PageLayout>
                {/* Breadcrumb */}
                <nav className="mb-2 flex items-center gap-1.5 text-sm">
                    <a href="#" className="text-blue-600 hover:underline">
                        Home
                    </a>
                    <ChevronRight className="h-3.5 w-3.5 " />
                    <a href="#" className="text-blue-600 hover:underline">
                        Companies
                    </a>
                    <ChevronRight className="h-3.5 w-3.5 " />
                    <a href="#" className="text-blue-600 hover:underline">
                        TechVision Pvt. Ltd.
                    </a>
                    <ChevronRight className="h-3.5 w-3.5 " />
                    <span className="">Technical Access Management</span>
                </nav>

                {/* Title */}
                <h1 className="text-[28px] font-bold leading-tight text-gray-900">
                    Technical Access Management
                </h1>
                <p className="mb-5 text-sm ">
                    Crewcam technical team can access company HRMS data only after
                    written approval from the company&apos;s HR.
                </p>

                {/* Info Banner */}
                {showBanner && (
                    <div
                        className={`${SECTION_GAP} flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-2`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                                <Info className="h-3.5 w-3.5 text-white" />
                            </span>
                            <p className="text-sm ">
                                For security and compliance, all technical access requests
                                must be initiated, reviewed and approved by the company HR.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBanner(false)}
                            aria-label="Dismiss"
                            className=" hover:"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Stat Tiles */}
                <div
                    className={`${SECTION_GAP} grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5`}
                >
                    {statTiles.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PADDING} flex items-start gap-3`}
                            >
                                <span
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                                >
                                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                </span>
                                <div>
                                    <p className="text-sm ">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p className={`text-xs ${stat.captionColor}`}>
                                        {stat.caption}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div
                    className={`bg-white ${CARD_BORDER} rounded-t-xl px-4 pt-4`}
                >
                    <div className="flex flex-col gap-2 border-b border-gray-100 pb-0 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap gap-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap border-b-2 pb-3 text-xs font-medium transition-colors ${activeTab === tab
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent  hover:text-gray-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="mb-3 flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    className="w-48 rounded-lg border border-gray-200 py-1 pr-9 pl-3 text-sm  placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-56"
                                />
                                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1 text-sm  hover:bg-gray-50">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filter
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1 text-sm  hover:bg-gray-50">
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
                {/* Main Content: Table + Sidebar */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_320px]">
                    {/* Left column */}
                    <div className="min-w-0">
                        {/* Tabs + Search/Filter/Export */}


                        {/* Table */}
                        <div
                            className={`overflow-hidden border-x border-b border-gray-200 bg-white ${CARD_BORDER} ${CARD_RADIUS}`}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left text-[10px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-[10px] font-semibold ">
                                            <th className="px-2 py-3">Request ID</th>
                                            <th className="px-2 py-3">Company Name</th>
                                            <th className="px-2 py-3">Requested By (Crewcam)</th>
                                            <th className="px-2 py-3">Purpose</th>
                                            <th className="px-2 py-3">Requested On</th>
                                            <th className="px-2 py-3">Status</th>
                                            <th className="px-2 py-3">HR Approval</th>
                                            <th className="px-2 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[10px]">
                                        {requests.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                            >
                                                <td className="px-2 py-2">
                                                    <span className="text-blue-600 font-medium bg-blue-200 p-1 rounded-sm">
                                                        {req.id}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 ">
                                                    {req.company}
                                                </td>
                                                <td className="px-2 py-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar
                                                            size="h-6 w-6"
                                                            initials={req.requestedBy.initials}
                                                            colorClass={req.requestedBy.avatarColor}
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {req.requestedBy.name}
                                                            </p>
                                                            <p className="text-xs ">
                                                                {req.requestedBy.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <p className="font-medium text-gray-800">
                                                        {req.purpose}
                                                    </p>
                                                    <p className="text-xs ">
                                                        {req.purposeSub}
                                                    </p>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <p className="">{req.requestedOn}</p>
                                                    <p className="text-xs ">
                                                        {req.requestedTime}
                                                    </p>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <StatusBadge status={req.status} />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar
                                                            initials={req.hrApproval.initial}
                                                            colorClass={`${req.hrApproval.avatarColor} text-white`}
                                                            size="h-6 w-6"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {req.hrApproval.name}
                                                            </p>
                                                            <p className="text-[10px] ">
                                                                {req.hrApproval.role}
                                                            </p>
                                                            {req.hrApproval.date && (
                                                                <p className={`${req.hrApproval.textColor} text-[10px] `}>
                                                                    {req.hrApproval.date}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-sm border border-gray-200  hover:bg-gray-50">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs ">
                                    Showing 1 to 5 of 28 entries
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button className="flex h-5 w-5 items-center justify-center rounded-sm border border-gray-200  hover:bg-gray-50">
                                        <ChevronLeft className="h-3 w-3" />
                                    </button>
                                    {["1", "2", "3", "4", "5", "...", "6"].map((p, i) => (
                                        <button
                                            key={i}
                                            className={`flex h-5 w-5 items-center justify-center rounded-sm text-xs ${p === "1"
                                                ? "bg-blue-600 text-white"
                                                : " hover:bg-gray-50 border-gray-200 border"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button className="flex h-5 w-5 items-center justify-center rounded-sm border border-gray-200  hover:bg-gray-50">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span>Rows per page:</span>
                                    <button className="flex items-center gap-1 rounded-sm border border-gray-200 px-2.5 py-1.5">
                                        5 <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`mt-2 bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PADDING}`}
                        >
                            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Active Technical Access Overview
                                    </h3>
                                    <p className="text-sm ">
                                        Overview of currently active access granted to Crewcam team
                                    </p>
                                </div>
                                <a
                                    href="#"
                                    className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-blue-600 hover:underline"
                                >
                                    View All Active Access
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {overviewStats.map((stat) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={stat.label} className="flex items-start gap-3">
                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                                            >
                                                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                            </span>
                                            <div>
                                                <p className="text-[10px]">{stat.label}</p>
                                                <p className="text-xs font-semibold">
                                                    {stat.value}
                                                </p>
                                                <p className={`text-[10px] ${stat.captionColor}`}>
                                                    {stat.caption}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="flex flex-col gap-2">
                        {/* Request New Access Card */}
                        <div
                            className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PADDING} `}
                        >
                            <div className="flex gap-2">

                                <div className="mb-3 flex h-11 min-w-11 items-center justify-center rounded-lg bg-blue-100">
                                    <UserPlus className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>

                                    <h3 className="mb-1.5 text-sm font-semibold text-gray-900">
                                        Request New Technical Access
                                    </h3>
                                    <p className="mb-4 text-xs ">
                                        Need technical support or maintenance from Crewcam team?
                                        Raise a new access request.
                                    </p>

                                </div>
                            </div>
                            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                                New Access Request
                            </button>
                        </div>

                        {/* Access Process Flow */}
                        <div
                            className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PADDING}`}
                        >
                            <h3 className="mb-4 text-base font-semibold text-gray-900">
                                Access Process Flow
                            </h3>
                            <div className="relative flex flex-col gap-6">
                                {processFlow.map((item, idx) => {
                                    const Icon = item.icon;
                                    const isLast = idx === processFlow.length - 1;
                                    return (
                                        <div key={item.step} className="relative flex gap-3">
                                            {!isLast && (
                                                <span className="absolute left-3.5 top-8 h-full w-px bg-blue-100" />
                                            )}
                                            <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                                {item.step}
                                            </span>
                                            <div className="flex items-start gap-2">
                                                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-800">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs ">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4 mt-4">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400">
                                    <Lock className="h-4 w-4 text-white" />
                                </span>
                                <p className="text-xs">
                                    All access is time-bound, purpose-specific and monitored for
                                    security.
                                </p>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Active Technical Access Overview */}


                {/* Footer */}
                {/* <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-gray-100 pt-5 text-xs  sm:flex-row">
          <p>© 2025 Crewcam HRMS. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:">
              Privacy Policy
            </a>
            <a href="#" className="hover:">
              Terms of Service
            </a>
          </div>
        </div> */}
            </PageLayout>
        </div>
    );
};

export default TechnicalAccessManagementPage;