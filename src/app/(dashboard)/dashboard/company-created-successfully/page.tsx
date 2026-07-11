"use client";

import React from "react";
import {
    ChevronRight,
    ExternalLink,
    Check,
    Building2,
    Tag,
    Users,
    IndianRupee,
    Zap,
    UserPlus,
    Upload,
    Settings,
    Wallet,
    Rocket,
    ArrowLeft,
    ArrowRight,
    Calendar,
    MessageCircle,
    Headset,
    Download,
    UserCog,
    Award,
    CalendarClock,
    ClipboardList,
    SlidersHorizontal,
    FileText,
    UsersRound,
    CalendarCheck2,
    Wallet2,
} from "lucide-react";
import PageLayout from "@/components/ui/pageLayout";
import Image from "next/image";
import celebration from "@/assets/celebrate.webp"
import building from "@/assets/buildings.webp"
/* -------------------------------------------------------------------------- */
/*  Spacing constants — kept tight everywhere per design spec                 */
/* -------------------------------------------------------------------------- */

const GAP = "gap-2";
const PAD = "p-2";
const CARD_PAD = "p-4";
const CARD_RADIUS = "rounded-lg";
const CARD_BORDER = "border border-gray-300";
const PAGE_PADDING = "px-4 sm:px-6 lg:px-8";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const companySummary = [
    { icon: Building2, label: "Company Name", value: "TechVision Pvt. Ltd." },
    { icon: Tag, label: "Plan", value: "Professional" },
    { icon: Users, label: "Employees (Estimated)", value: "100" },
    { icon: Wallet, label: "Billing", value: "₹ 150 / Employee / Month" },
];

const onboardingSteps = [
    {
        step: 1,
        title: "Company Created",
        status: "May 23, 2025 11:45 AM",
        state: "done",
    },
    { step: 2, title: "Invite Admin Users", status: "Pending", state: "current" },
    { step: 3, title: "Import Employees", status: "Pending", state: "upcoming" },
    { step: 4, title: "Configure Modules", status: "Pending", state: "upcoming" },
    { step: 5, title: "Go Live", status: "Pending", state: "upcoming" },
];

const nextSteps = [
    {
        step: 1,
        title: "Company Created",
        desc: "Completed",
        sub: "May 23, 2025 11:45 AM",
        state: "done",
    },
    {
        step: 2,
        title: "Invite Admin Users",
        desc: "Add your team to",
        sub: "manage the company",
        state: "current",
        button: "Invite Now",
    },
    {
        step: 3,
        title: "Import Employees",
        desc: "Upload employee data",
        sub: "in bulk or add manually",
        state: "upcoming",
        button: "Import Now",
    },
    {
        step: 4,
        title: "Configure Modules",
        desc: "Enable and configure",
        sub: "required modules",
        state: "upcoming",
        button: "Configure",
    },
    {
        step: 5,
        title: "Run Payroll Setup",
        desc: "Configure salary structure",
        sub: "and payroll settings",
        state: "upcoming",
        button: "Setup Payroll",
    },
    {
        step: 6,
        title: "Go Live",
        desc: "Start using Crewcam",
        sub: "with your team",
        state: "upcoming",
        button: "Go Live",
    },
];

const companyDetails = [
    { label: "Company Name", value: "TechVision Pvt. Ltd." },
    { label: "Company ID", value: "TECHVISION_001" },
    { label: "Industry", value: "Information Technology" },
    { label: "Company Size", value: "201 – 500 Employees" },
    { label: "Plan", value: "Professional" },
    { label: "Billing", value: "₹ 150 / Employee / Month" },
];

const mostEnabledModules = [
    { icon: UsersRound, label: "Employee\nManagement" },
    { icon: CalendarCheck2, label: "Attendance\nManagement" },
    { icon: ClipboardList, label: "Leave\nManagement" },
    { icon: Wallet2, label: "Payroll\nManagement" },
];

const quickActions = [
    { icon: UserPlus, label: "Invite Admin Users" },
    { icon: Upload, label: "Import Employees" },
    { icon: Settings, label: "Configure Modules" },
    { icon: FileText, label: "Setup Payroll" },
    { icon: UserCog, label: "Customize Company Profile" },
    { icon: Download, label: "Download Setup Guide" },
];

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

const CompanyCreatedSuccessFully = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageLayout>
                {/* Breadcrumb */}
                <nav className={`mb-2 flex items-center ${GAP} text-xs text-blue-800`}>
                    <a href="#" className="text-blue-800 hover:underline">
                        Home
                    </a>
                    <ChevronRight className="h-3 w-3 " />
                    <a href="#" className="text-blue-800 hover:underline">
                        Companies
                    </a>
                    <ChevronRight className="h-3 w-3 " />
                    <a href="#" className="text-blue-800 hover:underline">
                        Add New Company
                    </a>
                    <ChevronRight className="h-3 w-3 " />
                    <span className="">Review &amp; Confirm</span>
                </nav>

                {/* Title row */}
                <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Company Created Successfully! 🎉
                        </h1>
                        <p className="text-xs ">
                            TechVision Pvt. Ltd. has been created and is ready for setup
                        </p>
                    </div>
                    <button
                        className={`flex items-center ${GAP} rounded-lg border border-blue-800 text-blue-800 px-3 py-2 text-xs font-medium  hover:bg-gray-50`}
                    >
                        View Company Dashboard
                        <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Main 2-column layout */}
                <div className={`grid grid-cols-1 ${GAP} lg:grid-cols-[1fr_320px]`}>
                    {/* LEFT COLUMN */}
                    <div className={`flex flex-col ${GAP} min-w-0`}>
                        {/* Hero banner */}
                        <div className="relative overflow-hidden rounded-lg bg-[#000d2a] p-5 border border-gray-300 flex-row flex gap-2">
                            <Image src={celebration} width={100} height={100} alt="celebrate" className="object-contain" />
                          <div className="pl-2 relative z-10">
                            <h2 className="text-white font-semibold">Congratulatios! Your Company is now live.</h2>
                            <p className="text-white text-xs pt-1">Company ID: TECHVISION_001</p>
                            <div className="relative mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
                                {[
                                    ...companySummary,
                                    {
                                        label: "Go Live Status",
                                        icon: Zap,
                                        value: null, // handled separately below
                                    },
                                ].map((item, idx, arr) => {
                                    const Icon = item.icon;
                                    const isLast = idx === arr.length - 1;
                                    return (
                                        <div
                                            key={item.label}
                                            className={`px-4 first:pl-0 ${!isLast ? "border-r border-white/30" : ""}`}
                                        >
                                            <div className="mb-1 flex items-center gap-1.5 text-[8px] text-white">
                                                <Icon className="h-3 w-3 text-white" />
                                                {item.label}
                                            </div>
                                            {item.value ? (
                                                <p className="text-[8px] font-semibold text-white">{item.value}</p>
                                            ) : (
                                                <span className="inline-block rounded-md bg-amber-500/20 border border-amber-500/50 px-2 py-1 text-[8px] font-semibold text-amber-400">
                                                    Setup Pending
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                          </div>
<Image src={building} width={100} height={100} alt="building" className="absolute right-0 bottom-0 z-0" />
                        </div>

                        {/* What's Next */}
                        <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                            <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                What&apos;s Next?{" "}
                                <span className="font-normal ">
                                    Follow these steps to go live
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                                {nextSteps.map((step) => {
                                    const circleClass =
                                        step.state === "done"
                                            ? "bg-green-500 text-white"
                                            : step.state === "current"
                                                ? "bg-[#0B1D3A] text-white"
                                                : "bg-gray-100  border border-gray-300";
                                    return (
                                        <div key={step.step} className="flex flex-col items-center text-center">
                                            <span
                                                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${circleClass}`}
                                            >
                                                {step.state === "done" ? (
                                                    <Check className="h-4 w-4" strokeWidth={3} />
                                                ) : (
                                                    step.step
                                                )}
                                            </span>
                                            <p className="text-xs font-semibold text-gray-900">
                                                {step.title}
                                            </p>
                                            <p
                                                className={`text-[10px] ${step.state === "done"
                                                        ? "text-green-600"
                                                        : ""
                                                    }`}
                                            >
                                                {step.desc}
                                            </p>
                                            <p className="mb-2 text-[11px] ">
                                                {step.sub}
                                            </p>
                                            {step.button && (
                                                <button
                                                    className={`w-full rounded-md px-2 py-1 text-[11px] font-medium ${step.state === "current"
                                                            ? "bg-[#0B1D3A] text-white"
                                                            : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {step.button}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3 cards row */}
                        <div className={`grid grid-cols-1 ${GAP} md:grid-cols-3`}>
                            {/* Company Details */}
                            <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Company Details
                                    </h3>
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                                        View Details
                                    </a>
                                </div>
                                <div className="flex gap-3">

                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-gray-300">
                                        <Building2 className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {companyDetails.map((row) => (
                                            <div key={row.label} className="flex items-center justify-between gap-2">
                                                <p className="text-[10px] ">{row.label}</p>
                                                <p className="text-right text-[10px] font-medium text-gray-800">
                                                    {row.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Access */}
                            <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Admin Access
                                    </h3>
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                                        Manage Admins
                                    </a>
                                </div>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="relative flex h-14 w-14 items-center justify-center">
                                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#9CA3AF" strokeWidth="10" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#22C55E"
                                                strokeWidth="10"
                                                strokeDasharray={2 * Math.PI * 42}
                                                strokeDashoffset={0}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-xs font-bold text-gray-900">
                                            1/1
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold">Admin Users Added</p>
                                </div>

                                <div className="mb-4 rounded-lg border border-gray-300 p-2">
                                    <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-xs font-semibold text-gray-800">
                                                Rohit Mehta
                                            </p>
                                            <span className="rounded-md bg-purple-100 border border-purple-300 px-1.5 py-0.5 text-[10px] font-medium text-purple-600">
                                                Primary
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-medium text-green-600 bg-green-200 rounded-lg px-1">
                                            Active
                                        </span>
                                    </div>
                                    <p className="text-xs ">
                                        rohit.mehta@techvision.com
                                    </p>
                                    <p className="text-xs ">HR Manager</p>
                                </div>

                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Invite More Admins
                                </button>
                            </div>

                            {/* Module Status */}
                            <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Module Status
                                    </h3>
                                    <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
                                        View All Modules
                                    </a>
                                </div>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="relative flex h-16 w-16 items-center justify-center">
                                        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#FCA5A5" strokeWidth="10" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#22C55E"
                                                strokeWidth="10"
                                                strokeDasharray={2 * Math.PI * 42}
                                                strokeDashoffset={2 * Math.PI * 42 * (1 - 10 / 12)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-base font-bold text-gray-900">10</span>
                                            <span className="text-[9px] ">of 12</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            <p className="text-xs ">Enabled</p>
                                            <p className="ml-auto text-xs font-medium text-gray-800">10</p>
                                        </div>
                                        <div className="mb-1 flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                            <p className="text-xs ">Disabled</p>
                                            <p className="ml-auto text-xs font-medium text-gray-800">2</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-gray-300" />
                                            <p className="text-xs ">Not Available</p>
                                            <p className="ml-auto text-xs font-medium text-gray-800">0</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-2 text-xs ">Modules Enabled</p>
                                <p className="mb-3 text-xs font-semibold text-gray-700">
                                    Most Enabled Modules
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {mostEnabledModules.map((m) => {
                                        const Icon = m.icon;
                                        return (
                                            <div key={m.label} className="flex flex-col items-center text-center">
                                                <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 ">
                                                    <Icon className="h-4 w-4 text-purple-600" />
                                                </span>
                                                <p className="whitespace-pre-line text-[10px] leading-tight ">
                                                    {m.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 border border-gray-300">
                                        <Headset className="h-6 w-6 text-green-600" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Need Help Getting Started?
                                        </p>
                                        <p className="text-xs max-w-[280px]">
                                            Our customer success team is here to help you with
                                            setup and onboarding.
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex shrink-0 flex-wrap items-center ${GAP}`}>
                                    <button className="flex items-center gap-2 rounded-lg border border-green-400 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Schedule a Setup Call
                                    </button>
                                    <button className="flex items-center gap-2 rounded-lg bg-green-600 border border-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        Chat with Support
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom buttons */}
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Companies
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-[#0B1D3A] border border-[#0B1D3A] px-4 py-2 text-xs font-medium text-white hover:bg-[#0B1D3A]/90">
                                Go to Company Dashboard
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={`flex flex-col ${GAP}`}>
                        {/* Onboarding Progress */}
                        <div className="rounded-lg bg-[#0B1D3A] p-4 border border-gray-300">
                            <h3 className="mb-4 text-sm font-semibold text-white">
                                Onboarding Progress
                            </h3>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#1E3A5F" strokeWidth="10" />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="#22C55E"
                                            strokeWidth="10"
                                            strokeDasharray={2 * Math.PI * 42}
                                            strokeDashoffset={2 * Math.PI * 42 * (1 - 0.2)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-sm font-bold text-white">
                                        20%
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[11px] ">Step 1 of 5</p>
                                    <p className="text-sm font-semibold text-white">
                                        Company Created
                                    </p>
                                    <p className="text-[11px] text-white">
                                        You&apos;re off to a great start!
                                    </p>
                                    <p className="text-[11px] text-white">
                                        Complete the next steps to go live.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                {onboardingSteps.map((step, idx) => {
                                    const isLast = idx === onboardingSteps.length - 1;
                                    const circleClass =
                                        step.state === "done"
                                            ? "bg-green-500 text-white"
                                            : step.state === "current"
                                                ? "bg-blue-500 text-white"
                                                : "bg-[#1E3A5F] ";
                                    return (
                                        <div key={step.step} className="relative flex gap-2 pb-4 last:pb-0">
                                            {!isLast && (
                                                <span className="absolute left-3 top-6 h-full w-px bg-[#1E3A5F]" />
                                            )}
                                            <span
                                                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${circleClass} text-white`}
                                            >

                                                {step.step}
                                            </span>
                                            <div className="flex flex-1 items-center justify-between gap-2">
                                                <p className="text-xs font-medium text-white">
                                                    {step.title}
                                                </p>
                                                <p
                                                    className={`whitespace-nowrap text-[11px] ${step.state === "done"
                                                            ? "text-white"
                                                            : "text-white"
                                                        }`}
                                                >
                                                    {step.status}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={`bg-white ${CARD_BORDER} ${CARD_RADIUS} ${CARD_PAD}`}>
                            <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                Quick Actions
                            </h3>
                            <div className="flex flex-col">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.label}
                                            className="flex items-center justify-between gap-2 border-b border-gray-300 py-2 last:border-0 text-left hover:bg-gray-50"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 " />
                                                <span className="text-xs text-gray-700">
                                                    {action.label}
                                                </span>
                                            </span>
                                            <ChevronRight className="h-3.5 w-3.5 " />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* You're in Good Hands */}
                         <div className="rounded-lg bg-[#0B1D3A] p-4 flex gap-2">
                          
                                <Award className="h-16 w-16 text-amber-400" />
                            <div>

                                <p className="mb-2 text-xs font-semibold text-amber-400">
                                    You&apos;re in Good Hands!
                                </p>
                                <p className="text-xs text-white">
                                    Over 10,000+ organizations trust Crewcam to manage their
                                    workforce.
                                </p>
                                <p className="mt-2 text-xs text-white">
                                    Welcome to the Crewcam family! 🚀
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </PageLayout>
        </div>
    );
};

export default CompanyCreatedSuccessFully;