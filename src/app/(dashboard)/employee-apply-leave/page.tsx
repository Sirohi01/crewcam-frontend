'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useApplyLeave, useMyLeaveBalances } from '@/hooks/useMyLeave';
import { uploadFile } from '@/services/uploadService';
import {
  ChevronRight,
  ClipboardList,
  Calendar as CalendarIcon,
  UploadCloud,
  Send,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const BADGES = ['bg-emerald-50 text-emerald-600', 'bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600', 'bg-violet-50 text-violet-600', 'bg-zinc-100 text-zinc-500'];
const abbreviation = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]?.toUpperCase()).join('').slice(0, 4);
const MAX_FILE_BYTES = 5 * 1024 * 1024; // matches the /upload limit

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
  const [reason, setReason] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // ─── Validation errors ──────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const { data: profile } = useMyProfile();
  const { data: balances = [] } = useMyLeaveBalances();
  const applyLeave = useApplyLeave();
  const [uploading, setUploading] = useState(false);
  const submitting = uploading || applyLeave.isPending;

  // Days requested — derived, never stored.
  const numDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    if (halfDay) return 0.5;
    return Math.max(0, moment(toDate).diff(moment(fromDate), 'days') + 1);
  }, [fromDate, toDate, halfDay]);

  const selectedBalance = balances.find((b) => String(b.leaveTypeId) === leaveType);
  const manager = profile?.reportingToId;
  const approvalFlow = [
    { role: 'Employee', name: profile ? `${profile.firstName} ${profile.lastName}` : '' },
    { role: 'Reporting Manager', name: manager ? `${manager.firstName} ${manager.lastName}` : 'Not assigned' },
    { role: 'HR Department', name: '' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!leaveType) errs.leaveType = 'Please select a leave type.';
    if (!fromDate) errs.fromDate = 'From date is required.';
    if (!toDate) errs.toDate = 'To date is required.';
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate))
      errs.toDate = 'To date cannot be before from date.';
    if (halfDay && fromDate && toDate && fromDate !== toDate) errs.toDate = 'A half day must start and end on the same date.';
    if (halfDay && !session) errs.session = 'Choose the first or second half.';
    if (file && file.size > MAX_FILE_BYTES) errs.file = 'File must be 5 MB or smaller.';
    if (!reason.trim()) errs.reason = 'Reason is required.';
    else if (reason.trim().length < 10) errs.reason = 'Reason must be at least 10 characters.';
    if (!mobile.trim()) errs.mobile = 'Mobile number is required.';
    else if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s/g, '')))
      errs.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    void submit();
  };

  const submit = async () => {
    try {
      let attachmentUrl: string | undefined;
      if (file) {
        setUploading(true);
        attachmentUrl = await uploadFile(file);
        setUploading(false);
      }
      await applyLeave.mutateAsync({
        leaveTypeId: leaveType,
        startDate: fromDate,
        endDate: toDate,
        reason: reason.trim(),
        isHalfDay: halfDay,
        ...(halfDay && session && { halfDaySession: session }),
        contactNumber: mobile || undefined,
        contactEmail: email || undefined,
        attachmentUrl,
      });
      toast.success('Leave request submitted');
      router.push('/dashboard/employee-leave');
    } catch (err: any) {
      setUploading(false);
      toast.error(err?.response?.data?.message || 'Could not submit your leave request');
    }
  };

  const handleBlur = (field: string) => () => {
    if (submitted) setErrors(validate());
    else {
      const errs = validate();
      setErrors((prev) => ({ ...prev, [field]: errs[field] || '' }));
    }
  };

  const ic = (field: string) =>
    `w-full rounded-lg border ${errors[field] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : 'border-zinc-200 focus:border-blue-500'} bg-white px-2.5 py-1.5 text-[12px] text-zinc-600 outline-none focus:ring-2 transition-colors`;

  // A plain helper, not a component: defining components inside render remounts them every time.
  const errorMsg = (field: string) =>
    errors[field] ? <p className="mt-1 text-[10.5px] text-rose-500">{errors[field]}</p> : null;

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

              <form onSubmit={handleSubmit} noValidate className="space-y-1.5">
                <div>
                  <Label required>Leave Type</Label>
                  <select
                    value={leaveType}
                    onChange={(e) => { setLeaveType(e.target.value); }}
                    onBlur={handleBlur('leaveType')}
                    className={ic('leaveType')}
                  >
                    <option value="">-- Select Leave Type --</option>
                    {balances.map((b) => (
                      <option key={String(b.leaveTypeId)} value={String(b.leaveTypeId)}>
                        {b.leaveTypeName} ({abbreviation(b.leaveTypeName)})
                      </option>
                    ))}
                  </select>
                  {errorMsg('leaveType')}
                  <p className="mt-1 text-[11px] text-zinc-400">
                    {selectedBalance
                      ? `${Math.max(0, selectedBalance.balance)} day(s) available.${numDays > selectedBalance.balance ? ' This request exceeds your balance; HR may treat the extra days as unpaid.' : ''}`
                      : 'Choose the type of leave you want to apply for.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  <div>
                    <Label required>From Date</Label>
                    <div className="relative">
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        onBlur={handleBlur('fromDate')}
                        className={ic('fromDate') + ' pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer'}
                      />
                      <CalendarIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                    {errorMsg('fromDate')}
                  </div>
                  <div>
                    <Label required>To Date</Label>
                    <div className="relative">
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        onBlur={handleBlur('toDate')}
                        className={ic('toDate') + ' pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer'}
                      />
                      <CalendarIcon size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                    {errorMsg('toDate')}
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
                      <input type="radio" name="session" checked={session === 'first'} onChange={() => setSession('first')} className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500" />
                      First Half (Before 1:00 PM)
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-zinc-600">
                      <input type="radio" name="session" checked={session === 'second'} onChange={() => setSession('second')} className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500" />
                      Second Half (After 1:00 PM)
                    </label>
                  </div>
                  {errorMsg('session')}
                </div>

                <div>
                  <Label>Number of Days</Label>
                  <input type="text" readOnly value={numDays} className="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[12px] text-zinc-500 outline-none" />
                  <p className="mt-1 text-[11px] text-zinc-400">Total leave days will be calculated automatically.</p>
                </div>

                <div>
                  <Label required>Reason for Leave</Label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={handleBlur('reason')}
                    placeholder="Enter reason for leave application"
                    rows={2}
                    className={ic('reason').replace('rounded-lg', 'rounded-lg resize-none')}
                  />
                  {errorMsg('reason')}
                  <p className="mt-1 text-[11px] text-zinc-400">Minimum 10 characters</p>
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
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        onBlur={handleBlur('mobile')}
                        placeholder="e.g. 9876543210"
                        className={ic('mobile')}
                      />
                      {errorMsg('mobile')}
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.replace(/\s/g, '').toLowerCase())}
                        maxLength={100}
                        onBlur={handleBlur('email')}
                        placeholder="Enter email address"
                        className={ic('email')}
                      />
                      {errorMsg('email')}
                    </div>
                  </div>
                </div>

                {/* Upload Document */}
                <div className="mt-1.5">
                  <h2 className="mb-1 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                    <StepBadge n={3} /> Upload Document (Optional)
                  </h2>
                  <p className="mb-1 text-[11px] text-zinc-400">Upload supporting document if required (e.g., medical certificate)</p>
                  {file ? (
                    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className="shrink-0 text-blue-600" />
                        <span className="truncate text-[12.5px] font-medium text-zinc-700">{file.name}</span>
                        <span className="shrink-0 text-[11px] text-zinc-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button type="button" onClick={() => setFile(null)} className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-3 text-center hover:bg-zinc-50">
                      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      <div className="flex items-center gap-1.5">
                        <UploadCloud size={16} className="text-zinc-400" />
                        <p className="text-[12px] text-zinc-600">
                          Drag and drop or <span className="font-semibold text-blue-600">click to browse</span>
                        </p>
                      </div>
                      <p className="text-[10.5px] text-zinc-400">Supported formats: PDF, JPG, PNG (Max. 5MB)</p>
                    </label>
                  )}
                  {errorMsg('file')}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} {uploading ? 'Uploading…' : 'Submit Leave Request'}
                  </button>
                  <Link href="/dashboard/employee-leave" className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                    Cancel
                  </Link>
                </div>
              </form>
            </Card>
          </div>

          {/* Right column */}
          <div className="min-w-0 space-y-1.5">
            {/* Leave Balance Summary */}
            <Card className="p-2">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                  <ClipboardList size={16} className="text-blue-600" /> Leave Balance Summary
                </h2>
                <span className="whitespace-nowrap text-[11px] text-zinc-400">As on {moment().format('DD MMM YYYY')}</span>
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
                  {balances.length === 0 && (
                    <tr><td colSpan={4} className="py-3 text-center text-[12px] text-zinc-400">No leave types set up yet.</td></tr>
                  )}
                  {balances.map((row, i) => (
                    <tr key={String(row.leaveTypeId)} className="border-t border-zinc-100 text-[12.5px] text-zinc-600">
                      <td className="py-2 pr-2">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${BADGES[i % BADGES.length]}`} title={row.leaveTypeName}>
                          {abbreviation(row.leaveTypeName)}
                        </span>
                      </td>
                      <td className="py-2 pr-2 whitespace-nowrap">{Math.max(0, row.balance)} Days</td>
                      <td className="py-2 pr-2 whitespace-nowrap">{row.takenThisYear} Days</td>
                      <td className="py-2 whitespace-nowrap">{row.defaultDays + row.creditedDays} Days</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link href="/dashboard/employee-leave" className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 hover:text-blue-700">
                View All Balances <ArrowRight size={13} />
              </Link>
            </Card>

            {/* Leave Policy Highlights */}
            <Card className="p-2">
              <h2 className="mb-1.5 flex items-center gap-2 text-[14px] font-bold text-zinc-900">
                <ShieldCheck size={16} className="text-blue-600" /> Leave Policy Highlights
              </h2>
              <div className="space-y-1">
                {balances.map((b) => (
                  <div key={String(b.leaveTypeId)} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span className="text-[12px] text-zinc-600">{b.leaveTypeName}: {b.defaultDays} days per year.</span>
                  </div>
                ))}
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="text-[12px] text-zinc-600">Requests can&apos;t overlap a leave you already have pending or approved.</span>
                </div>
              </div>
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
                Track the status of your request on your Leave page.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}