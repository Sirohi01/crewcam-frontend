'use client';

import React, { useState } from 'react';
import {
  Home, ChevronRight, CheckCircle2, Download, ArrowRight,
  FileText, Key, Clock, ShieldCheck, Calendar, Info, MessageSquare,
  Wrench, Activity, AlarmClock, ThumbsUp, Building2, Users,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────
// NOTE: This component assumes the sidebar and top bar already exist in the
// parent layout (e.g. app/(super-admin)/layout.tsx). Do not render them here.
// ─────────────────────────────────────────────────────────────────────────

const TABS = ['Access Overview', 'Access Granted', 'Credentials & Instructions', 'Data Access Scope', 'Terms & Conditions'];

const NEXT_STEPS = [
  { icon: Wrench, title: 'Work in Progress', desc: 'Crewcam team will perform the maintenance activity.' },
  { icon: Activity, title: 'Activity Monitoring', desc: 'All activities are logged and monitored in real-time.' },
  { icon: AlarmClock, title: 'Access Expiry', desc: 'Access will be automatically revoked on 02 Jun 2025, 6:00 PM.' },
  { icon: ThumbsUp, title: 'Feedback', desc: 'You can provide feedback after the access period.' },
];

const SUMMARY_ROWS = [
  { icon: FileText, label: 'Request ID', value: 'TAR-2025-028' },
  { icon: Building2, label: 'Company', value: 'TechVision Pvt. Ltd.' },
  { icon: Wrench, label: 'Purpose', value: 'System Maintenance', sub: 'Server optimization' },
  { icon: ShieldCheck, label: 'Access Type', value: 'Time-Bound Access' },
  { icon: Key, label: 'Access Level', value: 'Read & Limited Access' },
  { icon: Clock, label: 'Access Duration', value: '3 Days' },
  { icon: Users, label: 'Granted By', value: 'Anjali Sharma', sub: 'HR Manager' },
];

const TIMELINE = [
  { title: 'Request Initiated', time: '30 May 2025, 11:20 AM', by: 'by Rahul Verma (Crewcam)' },
  { title: 'Reviewed by IT Head', time: '30 May 2025, 11:45 AM', by: 'by Sandeep Rao (IT Head)' },
  { title: 'Pending HR Approval', time: '30 May 2025, 01:15 PM' },
  { title: 'HR Approved', time: '30 May 2025, 02:30 PM', by: 'by Anjali Sharma (HR Manager)' },
  { title: 'Access Granted', time: '30 May 2025, 02:35 PM', by: 'Access credentials sent to team.' },
];

// ─────────────────────────────────────────────────────────────────────────
// Small building blocks
// ─────────────────────────────────────────────────────────────────────────
function Breadcrumb() {
  const crumbs = ['Home', 'Technical Access Management', 'Request Details', 'Access Details', 'Access Granted'];
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-zinc-400">
      {crumbs.map((c, i) => (
        <React.Fragment key={c}>
          {i === 0 ? (
            <span className="flex items-center gap-1 text-indigo-600 font-medium"><Home size={11} /> {c}</span>
          ) : i === crumbs.length - 1 ? (
            <span className="font-semibold text-zinc-800">{c}</span>
          ) : (
            <span className="hover:text-indigo-600 cursor-pointer">{c}</span>
          )}
          {i < crumbs.length - 1 && <ChevronRight size={11} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function HeaderBanner() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mt-1.5">
      <div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={22} className="text-emerald-500" />
          <h1 className="text-xl font-bold text-zinc-900">Access Granted Successfully</h1>
        </div>
        <p className="mt-0.5 text-[12.5px] text-zinc-500 ml-[30px]">Technical access has been granted to the Crewcam team for the requested purpose.</p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
          <Download size={13} /> Download Access Letter
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700">
          Go to Active Access <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function MetaCard() {
  const items = [
    { icon: FileText, label: 'Request ID', value: 'TAR-2025-028', badge: 'Approved' },
    { icon: Building2, label: 'Company', value: 'TechVision Pvt. Ltd.' },
    { icon: Wrench, label: 'Purpose', value: 'System Maintenance', sub: 'Server optimization' },
    { icon: ShieldCheck, label: 'Access Type', value: 'Time-Bound Access', accent: true },
    { icon: Calendar, label: 'Access Granted On', value: '30 May 2025, 02:35 PM', sub: 'by Anjali Sharma (HR Manager)' },
  ];
  return (
    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 rounded-sm border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {items.map(({ icon: Icon, label, value, sub, badge, accent }) => (
        <div key={label} className="flex-1 flex items-center gap-2 px-2 py-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon size={14} />
          </span>
          <div>
            <p className="text-[11px] text-zinc-400">{label}</p>
            <p className={`text-[12px] font-bold leading-tight mt-0.5 ${accent ? 'text-indigo-600' : 'text-zinc-900'}`}>{value}</p>
            {badge && <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{badge}</span>}
            {sub && <p className="text-[10px] text-zinc-400 mt-0.5">{sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tabs({ active, onChange }: { active: string; onChange: (tab: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-zinc-200 px-1">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative shrink-0 py-2.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors ${
            active === t ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          {t}
          {active === t && <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-indigo-600" />}
        </button>
      ))}
    </div>
  );
}

function GrantedPanel() {
  return (
    <div className="bg-emerald-50/40 p-2 sm:p-2">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-6 sm:gap-10">
        <div className="shrink-0 grid place-items-center h-28 w-28 rounded-full bg-emerald-100 md:ml-8">
          <ShieldCheck size={56} className="text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-emerald-700">Technical Access Granted</h2>
          <p className="mt-0.5 text-[13px] text-zinc-600">Crewcam technical team can now access the company HRMS as per the approved scope and duration.</p>

          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { icon: Calendar, label: 'Access Start', value: '30 May 2025', sub: '02:35 PM' },
              { icon: Calendar, label: 'Access End', value: '02 Jun 2025', sub: '06:00 PM' },
              { icon: Clock, label: 'Total Duration', value: '3 Days', sub: '(Time-Bound)' },
              { icon: Key, label: 'Access Level', value: 'Read & Limited Access', sub: 'as approved' },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="rounded-md bg-white border border-emerald-100 p-2">
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Icon size={12} className="text-emerald-500" /> {label}
                </div>
                <p className="mt-1 text-[12px] font-semibold text-zinc-900">{value}</p>
                <p className="text-[10.5px] text-zinc-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-sm bg-white border border-emerald-100 p-1.5">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Access credentials have been shared securely with the assigned team members via email.
              They must follow all company policies and security guidelines during the access period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextSteps() {
  return (
    <div>
      <h3 className="text-[13px] font-bold text-zinc-900">Next Steps</h3>
      <div className="mt-1 flex items-stretch">
        {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
          <React.Fragment key={title}>
            <div className="flex-1 min-w-0 rounded-sm border border-zinc-200 bg-white p-2 shadow-sm">
              <div className="flex items-center gap-0.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                  <Icon size={14} />
                </span>
                <p className="text-[12px] font-semibold text-zinc-900">{title}</p>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
            </div>
            {i < NEXT_STEPS.length - 1 && (
              <div className="hidden lg:flex items-center justify-center w-8 shrink-0">
                <ArrowRight size={14} className="text-zinc-600" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function FooterNote() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-sm border border-indigo-100 bg-indigo-50/50 p-2">
      <div className="flex items-start gap-2">
        <Info size={15} className="mt-0.5 shrink-0 text-indigo-500" />
        <p className="text-[12px] text-zinc-600">You can monitor the activity, extend access or revoke access anytime from the Active Access page.</p>
      </div>
      <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-indigo-700 shrink-0">
        Go to Active Access <ArrowRight size={12} />
      </button>
    </div>
  );
}

function ThanksBar() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-sm border border-zinc-200 bg-white p-2">
      <div className="flex items-start gap-2">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-indigo-500" />
        <p className="text-[12px] text-zinc-600">Thank you for trusting Crewcam. We are committed to maintaining the highest standards of security and data privacy.</p>
      </div>
      <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1 text-[11.5px] font-semibold text-zinc-700 hover:bg-zinc-50 shrink-0">
        <MessageSquare size={12} /> Support
      </button>
    </div>
  );
}

// ─── Right rail ─────────────────────────────────────────────────────────────
function AccessSummaryCard() {
  return (
    <div className="rounded-sm border border-zinc-200 bg-white p-2 shadow-sm">
      <p className="text-[12px] font-bold text-zinc-900 mb-2">Access Summary</p>
      <div className="space-y-1.5">
        {SUMMARY_ROWS.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="flex items-start justify-between gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-500 shrink-0">
              <Icon size={11.5} className="text-indigo-400" /> {label}
            </span>
            <span className="text-right">
              <p className="font-semibold text-zinc-900">{value}</p>
              {sub && <p className="text-[9.5px] text-zinc-400">{sub}</p>}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
          <span className="text-zinc-500">Status</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Granted</span>
        </div>
      </div>
    </div>
  );
}

function ActivityTimelineCard() {
  return (
    <div className="rounded-sm border border-zinc-200 bg-white p-2 shadow-sm">
      <p className="text-[12px] font-bold text-zinc-900 mb-2">Activity Timeline</p>
      <div className="space-y-1.5">
        {TIMELINE.map((item, i) => (
          <div key={item.title} className="flex gap-2">
            <div className="flex flex-col items-center">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={10} />
              </span>
              {i < TIMELINE.length - 1 && <span className="w-px flex-1 bg-zinc-200 mt-1" />}
            </div>
            <div className="pb-0.5">
              <p className="text-[11px] font-bold text-zinc-900">{item.title}</p>
              <p className="text-[9.5px] text-zinc-400">{item.time}</p>
              {item.by && <p className="text-[9.5px] text-zinc-400">{item.by}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Page (content only — sidebar & top bar come from the parent layout)

export default function AccessGrantedPage() {
  const [tab, setTab] = useState('Access Granted');

  return (
    <div className="w-full bg-zinc-50 text-zinc-900 px-3 py-2 space-y-2">
      <Breadcrumb />
      <HeaderBanner />
      <MetaCard />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 items-start">
        <div className="min-w-0 space-y-3">
          <div className="rounded-sm border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <Tabs active={tab} onChange={setTab} />
            <GrantedPanel />
          </div>
          <div className="rounded-sm border border-zinc-200 bg-white p-3 shadow-sm space-y-4">
            <NextSteps />
            <FooterNote />
          </div>
          <ThanksBar />
        </div>

        <div className="space-y-3 lg:ml-2 lg:w-[260px] lg:justify-self-end">
          <AccessSummaryCard />
          <ActivityTimelineCard />
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-400 pt-1">
        © 2025 Crewcam HRMS. All Rights Reserved. &nbsp;·&nbsp; Privacy Policy &nbsp;·&nbsp; Terms of Service
      </p>
    </div>
  );
}