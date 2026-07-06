'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ClipboardList,
  Calendar as CalendarIcon,
  UploadCloud,
  Send,
  Save,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const leaveBalanceSummary = [
  { type: 'CL', badge: 'bg-emerald-50 text-emerald-600', available: '8.5 Days', taken: '3.5 Days', entitlement: '12 Days' },
  { type: 'PL', badge: 'bg-blue-50 text-blue-600', available: '12 Days', taken: '8 Days', entitlement: '20 Days' },
  { type: 'SL', badge: 'bg-orange-50 text-orange-600', available: '6 Days', taken: '2 Days', entitlement: '8 Days' },
  { type: 'WFH', badge: 'bg-violet-50 text-violet-600', available: '4 Days', taken: '2 Days', entitlement: '6 Days' },
  { type: 'CO', badge: 'bg-zinc-100 text-zinc-500', available: '3 Days', taken: '1 Day', entitlement: '4 Days' },
];

const policyHighlights = [
  'CL cannot be availed for more than 2 days continuously.',
  'Please apply for leave at least 2 days in advance.',
  'Sick Leave requires upload of medical certificate if more than 2 days.',
  'Comp Off must be availed within 3 months from the date of credit.',
];

const approvalFlow = [
  { role: 'Employee', name: 'Rohan Mehta' },
  { role: 'Reporting Manager', name: 'Amit Kumar' },
  { role: 'HR Department', name: '' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small pieces
// ─────────────────────────────────────────────────────────────────────────────

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-600 text-[12px] font-bold text-white">
      {n}
    </span>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[13px] font-semibold text-zinc-700">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ApplyLeavePage() {
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [halfDay, setHalfDay] = useState(false);
  const [session, setSession] = useState<'first' | 'second' | ''>('');
  const [numDays, setNumDays] = useState(0);
  const [reason, setReason] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7F8FA]">
      <div className="mx-auto w-full max-w-[1300px] space-y-1 p-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[13px] text-zinc-400">
          <Link href="/dashboard" className="hover:text-zinc-600">Dashboard</Link>
          <ChevronRight size={13} />
          <Link href="/dashboard/leaves" className="hover:text-zinc-600">Leave</Link>
          <ChevronRight size={13} />
          <span className="font-[13px] text-zinc-800">Apply Leave</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-[20px] font-bold text-zinc-900">Apply Leave</h1>
          <p className="mt-0.5 text-[13px] text-zinc-400">Fill in the details below to apply for leave.</p>
        </div>

        {/* Main grid */}
        <div className="grid w-full grid-cols-1 gap-1.5 xl:grid-cols-[1fr_340px]">
          {/* Left column — form */}
          <div className="min-w-0 space-y-1">
            {/* Leave Details */}
            <Card className="p-2">
              <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                <StepBadge n={1} /> Leave Details
              </h2>

              <div className="space-y-1.5">
                <div>
                  <Label required>Leave Type</Label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Leave Type --</option>
                    <option value="CL">Casual Leave (CL)</option>
                    <option value="PL">Privilege Leave (PL)</option>
                    <option value="SL">Sick Leave (SL)</option>
                    <option value="WFH">Work From Home (WFH)</option>
                    <option value="CO">Comp Off</option>
                  </select>
                  <p className="mt-1 text-[11px] text-zinc-400">Choose the type of leave you want to apply for.</p>
                </div>

                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div>
                    <Label required>From Date</Label>
                    <div className="relative">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        placeholder="Select From Date"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 pr-8 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                      />
                      <CalendarIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>
                  <div>
                    <Label required>To Date</Label>
                    <div className="relative">
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        placeholder="Select To Date"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 pr-8 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                      />
                      <CalendarIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[13px] font-semibold text-zinc-700">
                    <input
                      type="checkbox"
                      checked={halfDay}
                      onChange={(e) => setHalfDay(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    Half Day
                  </label>
                  <p className="mt-1 pl-6 text-[11.5px] text-zinc-400">Check if you are applying for Half Day leave</p>
                </div>

                <div>
                  <p className="mb-1 text-[13px] font-semibold text-zinc-700">Session</p>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-[13px] text-zinc-600">
                      <input
                        type="radio"
                        name="session"
                        checked={session === 'first'}
                        onChange={() => setSession('first')}
                        className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      First Half (Before 1:00 PM)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-zinc-600">
                      <input
                        type="radio"
                        name="session"
                        checked={session === 'second'}
                        onChange={() => setSession('second')}
                        className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      Second Half (After 1:00 PM)
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Number of Days</Label>
                  <input
                    type="text"
                    readOnly
                    value={numDays}
                    className="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[12px] text-zinc-500 outline-none"
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">Total leave days will be calculated automatically.</p>
                </div>

                <div>
                  <Label required>Reason for Leave</Label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for leave application"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">Minimum 10 characters</p>
                </div>
              </div>

              {/* Contact During Leave */}
              <div className="mt-1.5">
                <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                  <StepBadge n={2} /> Contact During Leave
                </h2>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div>
                    <Label required>Mobile Number</Label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] text-zinc-600 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Document */}
              <div className="mt-1.5">
                <h2 className="mb-1 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                  <StepBadge n={3} /> Upload Document (Optional)
                </h2>
                <p className="mb-1 text-[11px] text-zinc-400">Upload supporting document if required (e.g., medical certificate)</p>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-3 text-center hover:bg-zinc-50">
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  <div className="flex items-center gap-1.5">
                    <UploadCloud size={16} className="text-zinc-400" />
                    <p className="text-[12px] text-zinc-600">
                      Drag and drop or <span className="font-semibold text-blue-600">click to browse</span>
                    </p>
                  </div>
                  <p className="text-[10.5px] text-zinc-400">Supported formats: PDF, JPG, PNG (Max. 5MB)</p>
                </label>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                <Send size={14} /> Submit Leave Request
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                <Save size={14} /> Save as Draft
              </button>
            </div>
          </div>

          {/* Right column */}
          <div className="min-w-0 space-y-1.5">
            {/* Leave Balance Summary */}
            <Card className="p-2">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                  <ClipboardList size={16} className="text-blue-600" /> Leave Balance Summary
                </h2>
                <span className="whitespace-nowrap text-[11px] text-zinc-400">As on 24 May 2025</span>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-zinc-400">
                    <th className="pb-2 pr-2 font-semibold">Leave Type</th>
                    <th className="pb-2 pr-2 font-semibold">Available</th>
                    <th className="pb-2 pr-2 font-semibold">Taken</th>
                    <th className="pb-2 font-semibold">Entitlement</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalanceSummary.map((row) => (
                    <tr key={row.type} className="border-t border-zinc-100 text-[12.5px] text-zinc-600">
                      <td className="py-2 pr-2">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${row.badge}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2 pr-2 whitespace-nowrap">{row.available}</td>
                      <td className="py-2 pr-2 whitespace-nowrap">{row.taken}</td>
                      <td className="py-2 whitespace-nowrap">{row.entitlement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link href="/dashboard/leaves" className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:text-blue-700">
                View All Balances <ArrowRight size={13} />
              </Link>
            </Card>

            {/* Leave Policy Highlights */}
            <Card className="p-2">
              <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                <ShieldCheck size={16} className="text-blue-600" /> Leave Policy Highlights
              </h2>
              <div className="space-y-1">
                {policyHighlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span className="text-[12px] text-zinc-600">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/leaves/policy" className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:text-blue-700">
                View Leave Policy <ArrowRight size={13} />
              </Link>
            </Card>

            {/* Approval Flow */}
            <Card className="p-2">
              <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                <Users size={16} className="text-blue-600" /> Approval Flow
              </h2>
              <div className="flex items-center justify-between gap-1.5">
                {approvalFlow.map((step, i) => (
                  <React.Fragment key={step.role}>
                    <div className="flex-1 rounded-lg border border-zinc-200 px-2 py-2.5 text-center">
                      <p className="text-[11.5px] font-bold text-zinc-800">{step.role}</p>
                      {step.name && <p className="mt-0.5 text-[11px] text-zinc-400">{step.name}</p>}
                    </div>
                    {i < approvalFlow.length - 1 && (
                      <ArrowRight size={14} className="shrink-0 text-zinc-300" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-1.5 text-[11.5px] text-zinc-400">
                You will be notified via email and dashboard once your leave request is approved or rejected.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}