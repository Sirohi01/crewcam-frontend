'use client';

import React, { useState } from 'react';
import {
  Home, ChevronRight, Search, Sparkles, Bell, Headphones, ChevronDown,
  Download, Printer, Building2, Calendar, ShieldCheck, Clock, CheckCircle2,
  XCircle, ArrowLeft, Save, Send, Info, LayoutGrid, Users, DollarSign,
  Receipt, CreditCard, BarChart3, BrainCircuit, LifeBuoy, Wrench, Layers,
  Plug, FileBarChart, Settings, ChevronsUpDown,
} from 'lucide-react';

// ─── Static data ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Control Center', icon: LayoutGrid },
  { label: 'Companies', icon: Building2, active: true },
  { label: 'Workforce', icon: Users },
  { label: 'Revenue & Finance', icon: DollarSign },
  { label: 'Billing & Invoices', icon: Receipt },
  { label: 'Subscriptions', icon: CreditCard },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'AI Insights', icon: BrainCircuit },
  { label: 'Support Center', icon: LifeBuoy },
  { label: 'Implementations', icon: Wrench },
  { label: 'Sales CRM', icon: Layers },
  { label: 'Integrations', icon: Plug },
  { label: 'Reports', icon: FileBarChart },
  { label: 'Settings', icon: Settings },
];

const QUICK_COMPANIES = [
  { name: 'TechVision Pvt. Ltd.', letter: 'T', color: 'bg-blue-600', active: true },
  { name: 'Alpha Solutions Inc.', letter: 'A', color: 'bg-emerald-600' },
  { name: 'Bright Future Ltd.', letter: 'B', color: 'bg-red-500' },
  { name: 'NextGen Systems', letter: 'N', color: 'bg-purple-600' },
  { name: 'Global Enterprises', letter: 'G', color: 'bg-amber-500' },
];

const BREADCRUMB = ['Home', 'Technical Access Management', 'Request Details', 'Access Details', 'Terms & Conditions'];

const TABS = ['Access Overview', 'Access Granted', 'Credentials & Instructions', 'Data Access Scope', 'Terms & Conditions', 'Activity Log', 'Active Access'];

const TERMS = [
  {
    title: 'Authorized Access Only',
    body: 'Crewcam technical team will only access the HRMS system for the purpose mentioned in this request. Any access beyond the approved scope requires fresh written approval from the company HR.',
  },
  {
    title: 'Confidentiality',
    body: 'All company data accessed will be kept strictly confidential. Crewcam will not share, copy, or disclose any data to third parties under any circumstances.',
  },
  {
    title: 'Data Protection',
    body: 'Crewcam will comply with all applicable data protection laws and company policies. Sensitive personal data (PAN, Bank, Salary, etc.) will be accessed only if required.',
  },
  {
    title: 'Activity Monitoring',
    body: 'All activities performed during the access period will be logged and monitored. The company reserves the right to review all logs and reports.',
  },
  {
    title: 'No Data Modification',
    body: 'Crewcam technical team will not modify, delete, or alter any company data unless explicitly authorized by the company HR in writing.',
  },
  {
    title: 'Access Duration',
    body: 'Access is time-bound as mentioned. Crewcam will ensure access is revoked immediately after the purpose is completed or upon expiration.',
  },
  {
    title: 'Compliance',
    body: 'Crewcam will follow all security guidelines, system usage policies, and compliance requirements of the company.',
  },
  {
    title: 'Liability',
    body: 'In case of any violation of these terms, the company has the right to revoke access immediately and take appropriate legal action.',
  },
];

const NEXT_STEPS = [
  { title: 'After Acceptance', body: 'Credentials will be shared securely with Crewcam team.', icon: CheckCircle2, color: 'text-emerald-500' },
  { title: 'Access Activation', body: 'Crewcam team will start the maintenance activity.', icon: ShieldCheck, color: 'text-indigo-500' },
  { title: 'Monitoring', body: 'All activities will be monitored and logged.', icon: Search, color: 'text-blue-500' },
  { title: 'Access Revocation', body: 'Access will be automatically revoked after completion.', icon: XCircle, color: 'text-red-500' },
];

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#0B1324] text-white h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 font-extrabold text-sm">C</span>
        <div className="leading-tight">
          <p className="font-bold text-[15px] tracking-tight">Crewcam</p>
          <p className="text-[9px] tracking-[0.2em] text-amber-400 font-semibold">HRMS</p>
          <p className="text-[8px] text-zinc-500 tracking-wide">INSIGHT · INNOVATION · IMPACT</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-colors ${
              item.active ? 'bg-amber-500/90 text-zinc-900 font-semibold' : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            <item.icon size={15} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/10 space-y-2">
        <p className="text-[10.5px] font-semibold text-zinc-400">Quick Company Switch</p>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Search Company..."
            className="w-full rounded-md bg-white/5 border border-white/10 pl-7 pr-2 py-1.5 text-[11px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
        <div className="space-y-0.5 max-h-32 overflow-y-auto">
          {QUICK_COMPANIES.map((c) => (
            <button
              key={c.name}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px] transition-colors ${
                c.active ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'text-zinc-300 hover:bg-white/5'
              }`}
            >
              <span className={`grid h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 place-items-center rounded ${c.color} text-[9px] font-bold`}>
                {c.letter}
              </span>
              <span className="truncate">{c.name}</span>
              {c.active && <ChevronDown size={12} className="ml-auto shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-white/10 space-y-1">
        <p className="text-[10.5px] font-semibold text-zinc-400">Platform Status</p>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All Systems Operational
        </p>
        <button className="text-[10.5px] text-indigo-400 hover:underline">View System Status →</button>
      </div>
    </aside>
  );
}

// ─── Top header ─────────────────────────────────────────────────────────────
function TopHeader() {
  return (
    <header className="flex items-center gap-3 bg-[#0B1324] px-4 py-2.5 lg:pl-4">
      <button className="lg:hidden text-white"><LayoutGrid size={20} /></button>
      <div className="relative flex-1 max-w-xl">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          placeholder="Search anything... (Company, Employee, Invoice, Ticket...)"
          className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-14 py-2 text-[12.5px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-zinc-500">Ctrl + K</span>
      </div>

      <div className="ml-auto flex items-center gap-4 text-zinc-200">
        <button className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium">
          <Sparkles size={15} className="text-amber-400" /> AI Assistant
        </button>
        <button className="relative">
          <Bell size={16} />
          <span className="absolute -top-1.5 -right-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-red-500 text-[8px] font-bold">1</span>
          <span className="hidden sm:inline ml-1 text-[12px] font-medium align-middle">Notifications</span>
        </button>
        <button className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium">
          <Headphones size={15} />
          Support
          <span className="grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[8px] font-bold">12</span>
        </button>
        <button className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500 text-[11px] font-bold">VS</span>
          <span className="hidden md:block text-left leading-tight">
            <p className="text-[12px] font-semibold">Vijay Sharma</p>
            <p className="text-[10px] text-zinc-400">Super Admin</p>
          </span>
          <ChevronDown size={13} className="hidden md:block text-zinc-500" />
        </button>
      </div>
    </header>
  );
}

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === 0 ? (
              <span className="flex items-center gap-1 text-indigo-600 font-medium hover:underline cursor-pointer">
                <Home size={12} /> {crumb}
              </span>
            ) : i === BREADCRUMB.length - 1 ? (
              <span className="text-zinc-900 font-semibold">{crumb}</span>
            ) : (
              <span className="text-indigo-600 font-medium hover:underline cursor-pointer">{crumb}</span>
            )}
            {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 leading-tight">Terms &amp; Conditions</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Review and accept the terms &amp; conditions before granting technical access to Crewcam team.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <Download size={14} /> Download Terms &amp; Conditions
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
            <Printer size={14} /> Print Terms &amp; Conditions
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Request info bar ───────────────────────────────────────────────────────
function RequestInfoBar() {
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="min-w-0">
      <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );

  return (
    <div className="rounded-sm border border-zinc-200/80 bg-white shadow-sm p-1">
      <div className="flex items-start divide-x divide-zinc-200">
        <div className="flex items-center gap-0.5 pr-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 px-2">
            <FileTextIcon />
          </span>
          <Field label="Request ID">
            <p className="flex items-center gap-2 text-[12px] font-bold text-zinc-900 whitespace-nowrap">
              TAR-2025-028
              <span className="rounded-full bg-emerald-100 px-4 py-0.5 text-[9.5px] font-bold text-emerald-700">Active</span>
            </p>
            <p className="text-[10.5px] text-zinc-400 whitespace-nowrap">Requested on 30 May 2025, 11:20 AM</p>
          </Field>
        </div>

        <div className="px-4">
          <Field label="Company">
            <p className="flex items-center gap-1.5 text-[13px] font-bold text-zinc-900 whitespace-nowrap">
              <span className="grid h-5 w-5 place-items-center rounded bg-blue-600 text-[10px] font-bold text-white">T</span>
              TechVision Pvt. Ltd.
            </p>
          </Field>
        </div>

        <div className="px-4">
          <Field label="Purpose">
            <p className="text-[13px] font-bold text-zinc-900 whitespace-nowrap">System Maintenance</p>
            <p className="text-[10.5px] text-zinc-400 whitespace-nowrap">Server optimization</p>
          </Field>
        </div>

        <div className="px-4">
          <Field label="Access Type">
            <span className="inline-block mt-0.5 rounded-full bg-purple-100 px-2 py-1 text-[10.5px] font-bold text-purple-700 whitespace-nowrap">Time-Bound Access</span>
          </Field>
        </div>

        <div className="flex items-center gap-2 pl-6">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <Calendar size={17} />
          </span>
          <Field label="Access Duration">
            <p className="text-[11px] font-bold text-zinc-900 whitespace-nowrap">30 May 2025, 02:35 PM</p>
            <p className="text-[10px] text-zinc-400 whitespace-nowrap">to</p>
            <p className="text-[11px] font-bold text-zinc-900 whitespace-nowrap">
              02 Jun 2025, 06:00 PM <span className="text-[10.5px] font-normal text-zinc-400">(3 Days)</span>
            </p>
          </Field>
        </div>
      </div>
    </div>
  );
}

// small inline icon component (avoids importing FileText twice with different names)
function FileTextIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────
function Tabs({ active }: { active: string }) {
  return (
    <div className="rounded-sm border border-zinc-200/80 bg-white shadow-sm px-2">
      <div className="flex items-center gap-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`shrink-0 whitespace-nowrap border-b-2 px-1 py-3 text-[12.5px] font-semibold transition-colors ${
              tab === active ? 'border-indigo-700 text-indigo-700' : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Terms & Conditions content ─────────────────────────────────────────────
function TermsContent() {
  return (
    <div className="rounded-sm border border-zinc-200/80 bg-white shadow-sm p-3 space-y-1">
      <div>
        <h2 className="text-[14px] font-bold text-zinc-900">Terms &amp; Conditions for Technical Access</h2>
        <p className="text-[12px] text-zinc-500 mt-0.5">Please review the following terms carefully.</p>
      </div>

      <ol className="space-y-2">
        {TERMS.map((term, i) => (
          <li key={term.title} className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-700">
              {i + 1}
            </span>
            <div>
              <p className="text-[12.5px] font-bold text-zinc-900">{term.title}</p>
              <p className="text-[12px] text-zinc-500 leading-relaxed mt-0.5">{term.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex items-start gap-2 rounded-lg bg-zinc-50 border border-zinc-200 p-2">
        <Info size={14} className="mt-0.5 shrink-0 text-zinc-400" />
        <p className="text-[11.5px] text-zinc-500">
          By accepting these terms, you acknowledge that you have the authority to grant access on behalf of the company.
        </p>
      </div>
    </div>
  );
}

// ─── Acceptance status card ─────────────────────────────────────────────────
function AcceptanceStatusCard({ accepted, onAccept, onDecline }: { accepted: boolean; onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="rounded-sm border border-zinc-200/80 bg-white shadow-sm p-2 space-y-2">
      <p className="text-[13px] font-bold text-zinc-900">Acceptance Status</p>

      <div className="flex items-start gap-2.5 rounded-lg bg-emerald-50 p-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck size={15} />
        </span>
        <div>
          <p className="text-[12px] font-bold text-emerald-700">{accepted ? 'Accepted' : 'Pending Acceptance'}</p>
          <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
            {accepted ? 'This request has been accepted.' : 'This request is awaiting company HR acceptance.'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1">
        <div>
          <p className="text-[10.5px] font-semibold text-zinc-400">To be accepted by</p>
          <p className="flex items-center gap-1.5 mt-1 font-semibold text-zinc-800">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-pink-200 text-[9px] font-bold text-pink-800">AS</span>
            Anjali Sharma
          </p>
          <p className="text-[10px] text-zinc-400 ml-6.5">HR Manager</p>
        </div>
        <div className="text-right">
          <p className="text-[10.5px] font-semibold text-zinc-400">Acceptance deadline</p>
          <p className="flex items-center gap-1 justify-end mt-1 font-semibold text-zinc-800">
            <Clock size={12} /> 30 May 2025, 01:00 PM
          </p>
          <p className="text-[10px] font-semibold text-red-500">(In 45 minutes)</p>
        </div>
      </div>

      <button
        onClick={onAccept}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-indigo-700 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors"
      >
        <CheckCircle2 size={15} /> Accept Terms &amp; Conditions
      </button>
      <button
        onClick={onDecline}
        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white py-2.5 text-[12.5px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
      >
        <XCircle size={15} /> Decline Request
      </button>
    </div>
  );
}

// ─── What happens next card ─────────────────────────────────────────────────
function WhatsNextCard() {
  return (
    <div className="rounded-sm border border-zinc-200/80 bg-white shadow-sm p-2">
      <p className="text-[13px] font-bold text-zinc-900 mb-3">What Happens Next?</p>
      <ul className="space-y-1">
        {NEXT_STEPS.map((step) => (
          <li key={step.title} className="flex items-start gap-2">
            <step.icon size={15} className={`mt-0.5 shrink-0 ${step.color}`} />
            <div>
              <p className="text-[12px] font-bold text-zinc-800">{step.title}</p>
              <p className="text-[11px] text-zinc-500 leading-snug">{step.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer actions ─────────────────────────────────────────────────────────
function FooterActions() {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
        <ArrowLeft size={14} /> Back to Data Access Scope
      </button>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
          <Save size={14} /> Save as PDF
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
          <Send size={14} /> Submit for Acceptance
        </button>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function TermsConditionsAccessPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto max-w-[1600px] px-4 py-2 space-y-2">
        <PageHeading />
        <RequestInfoBar />
        <Tabs active="Terms & Conditions" />

        <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-4 items-start">
          <div className="min-w-0">
            <TermsContent />
          </div>
          <div className="space-y-2 min-w-0 xl:sticky xl:top-4">
            <AcceptanceStatusCard
              accepted={accepted}
              onAccept={() => setAccepted(true)}
              onDecline={() => setAccepted(false)}
            />
            <WhatsNextCard />
          </div>
        </div>

        <FooterActions />

        <footer className="text-center text-[11px] text-zinc-400 py-3 flex items-center justify-center gap-4 flex-wrap">
          <span>© 2025 Crewcam HRMS. All Rights Reserved.</span>
          <span className="text-indigo-600 hover:underline cursor-pointer">Privacy Policy</span>
          <span className="text-indigo-600 hover:underline cursor-pointer">Terms of Service</span>
        </footer>
      </main>
    </div>
  );
}