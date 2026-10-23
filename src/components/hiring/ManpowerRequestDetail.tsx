'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Briefcase, Building2, CalendarDays, CheckCircle2, Clock,
  Cpu, FileText, Flag, Gift, GraduationCap, Heart, IndianRupee,
  ListChecks, MapPin, Pencil, ShieldCheck, Tag, Target, Trash2, User, UserMinus, Users,
  Wallet, Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { openFileUrl } from '@/lib/fileUrls';

function value(text: any) {
  if (text === undefined || text === null || text === '') return '-';
  if (typeof text === 'string' || typeof text === 'number') return text;
  if (typeof text === 'boolean') return text ? 'Yes' : 'No';
  return text.name || `${text.firstName || ''} ${text.lastName || ''}`.trim() || '-';
}

function formatDate(date: any) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(date: any) {
  if (!date) return '-';
  const d = new Date(date);
  return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border border-amber-200/60',
  Approved: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  Rejected: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  'In Progress': 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
  'On Hold': 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  Completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
};

function Card({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[2px] border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-2.5 py-1.5">
          <h3 className="text-[12px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-2.5 pb-2.5 pt-2">{children}</div>
    </div>
  );
}

const tabs = ['Overview', 'Core Details', 'Requirement Notes', 'Approval & Status'];

export default function ManpowerRequestDetail({ id }: { id: string }) {
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  const qc = useQueryClient();

  const { data: request, isLoading } = useQuery({
    queryKey: ['manpower-request', id],
    queryFn: async () => (await api.get(`/hiring/manpower-request/${id}`)).data,
  });

  const generatePdf = useMutation({
    mutationFn: async () => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data,
    onSuccess: (payload) => {
      qc.invalidateQueries({ queryKey: ['manpower-request', id] });
      openFileUrl(payload.pdfUrl);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => (await api.delete(`/hiring/manpower-request/${id}`)).data,
    onSuccess: () => {
      toast.success('Requisition deleted successfully');
      qc.invalidateQueries({ queryKey: ['manpower-requests'] });
      qc.invalidateQueries({ queryKey: ['manpower-request-stats'] });
      router.push('/dashboard/hiring/manpower');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete requisition');
    },
  });

  if (isLoading) return <div className="p-8 text-center text-xs font-medium text-zinc-500">Loading manpower request details...</div>;
  if (!request) return <div className="p-8 text-center text-xs font-medium text-zinc-500">Manpower request record not found.</div>;

  const departmentName = value(request.departmentId);
  const positionTitle = request.jobTitle || request.designationId?.name || request.designation || 'Position';
  const locationText = value(request.locationBranchId) !== '-' ? value(request.locationBranchId) : request.workLocation || '-';
  const reportingToName = value(request.reportingTo);
  const requestedByName = value(request.requestedBy);
  const approvedByName = value(request.approvedBy);
  const employmentTypeText = request.employmentTypes?.join(', ') || request.employmentType || '-';
  const hiringReasonText = request.hiringReasons?.join(', ') || request.reasonForHiring || '-';
  const salaryRangeText = request.salaryCtcMin || request.salaryCtcMax ? `${request.salaryCtcMin || '-'} to ${request.salaryCtcMax || '-'}` : '-';
  const requestIdShort = String((request as any)._id || id).slice(-8).toUpperCase();
  const currentStatus = request.status || 'Pending';

  const showAll = tab === 'Overview';
  const showCore = showAll || tab === 'Core Details';
  const showNotes = showAll || tab === 'Requirement Notes';
  const showApproval = showAll || tab === 'Approval & Status';

  return (
    <div className="font-sans">
      <div className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Manpower Requisition Details</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Hiring Process</span> <span>›</span> <span>Step 1</span> <span>›</span>
              <span className="font-semibold text-zinc-700">Manpower Requisition Details</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/hiring/manpower"
              className="flex items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              Back
            </Link>
            <Link
              href={`/dashboard/hiring/manpower/${id}/edit`}
              className="flex items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              <Pencil size={13} /> Edit
            </Link>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (confirm('Are you sure you want to delete this requisition? This will permanently remove it from the database.')) {
                  deleteMutation.mutate();
                }
              }}
              className="flex items-center gap-1.5 rounded-[2px] border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 shadow-sm hover:bg-rose-50 disabled:opacity-50"
            >
              <Trash2 size={13} /> {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              disabled={generatePdf.isPending}
              onClick={() => generatePdf.mutate()}
              className="flex items-center gap-1.5 rounded-[2px] bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              <FileText size={13} /> {generatePdf.isPending ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </div>

        {/* Profile / Requisition Banner */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div className="row-span-2 shrink-0 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-[2px] bg-indigo-50 text-indigo-600">
                <Briefcase size={26} />
              </span>
              <span className={`mt-1.5 inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${STATUS_BADGE[currentStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                {currentStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-[220px] flex-1">
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-zinc-900">
                  {positionTitle}
                  {request.isUrgent && (
                    <span className="rounded-[2px] bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600 border border-rose-100">
                      Urgent
                    </span>
                  )}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-zinc-600">
                  <span>{departmentName}</span>
                  <span className="text-zinc-300">•</span>
                  <span>{locationText}</span>
                  <span className="rounded-[2px] bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-600">
                    {request.recruitmentStatus || request.status || 'Active'}
                  </span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-zinc-500">
                  <span className="flex items-center gap-1"><User size={11} className="text-zinc-400" /> Reporting to: <strong className="font-semibold text-zinc-700">{reportingToName}</strong></span>
                  <span className="flex items-center gap-1"><User size={11} className="text-zinc-400" /> Requested by: <strong className="font-semibold text-zinc-700">{requestedByName}</strong></span>
                  <span className="flex items-center gap-1"><Users size={11} className="text-zinc-400" /> Positions: <strong className="font-semibold text-zinc-700">{request.numberOfPositions ?? '-'}</strong></span>
                </div>
              </div>

              <div className="shrink-0 space-y-1 text-[10.5px]">
                <div className="flex items-center gap-6"><span className="text-zinc-400">Request ID</span><span className="ml-auto font-semibold text-zinc-800">{requestIdShort}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Request Date</span><span className="ml-auto font-semibold text-zinc-800">{formatDate(request.requestDate)}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Priority</span><span className="ml-auto font-semibold text-zinc-800">{request.priority || '-'}</span></div>
              </div>
            </div>

            <div className="mt-1.5 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-1.5 text-[10.5px] leading-tight sm:grid-cols-3 lg:grid-cols-6">
              <div><p className="text-zinc-400 leading-tight">Total Positions</p><p className="font-semibold leading-tight text-zinc-800">{request.numberOfPositions ?? '-'}</p></div>
              <div><p className="text-zinc-400 leading-tight">Employment Type</p><p className="font-semibold leading-tight text-zinc-800">{employmentTypeText}</p></div>
              <div><p className="text-zinc-400 leading-tight">Reason for Hiring</p><p className="font-semibold leading-tight text-zinc-800">{hiringReasonText}</p></div>
              <div><p className="text-zinc-400 leading-tight">Salary Range</p><p className="font-semibold leading-tight text-zinc-800">{salaryRangeText}</p></div>
              <div><p className="text-zinc-400 leading-tight">Budget CTC</p><p className="font-semibold leading-tight text-zinc-800">{request.budgetCTC ?? '-'}</p></div>
              <div><p className="text-zinc-400 leading-tight">Required Joining</p><p className="font-semibold leading-tight text-zinc-800">{formatDate(request.requiredJoiningDate)}</p></div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600">Requisition Status</span>
                <span className={`rounded-[2px] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ${STATUS_BADGE[currentStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                  {currentStatus}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-[2px] bg-zinc-100">
                <div
                  className={`h-full rounded-[2px] ${currentStatus === 'Approved' ? 'bg-emerald-500 w-full' : currentStatus === 'Rejected' ? 'bg-rose-500 w-full' : 'bg-indigo-600 w-1/2'}`}
                />
              </div>
              <div className="mt-2 space-y-1 text-[10.5px]">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Recruitment Status</span>
                  <span className="font-semibold text-zinc-800">{request.recruitmentStatus || request.status || '-'}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Urgent Requirement</span>
                  <span className={`font-semibold ${request.isUrgent ? 'text-rose-600' : 'text-zinc-800'}`}>{request.isUrgent ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Declaration</span>
                  <span className="font-semibold text-zinc-800">{request.declarationAccepted ? 'Accepted' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 border-t border-zinc-100 pt-1.5 text-[10px] text-zinc-400">
              <p>Last Updated: <span className="font-semibold text-zinc-700">{formatDateTime((request as any).updatedAt)}</span></p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto rounded-[2px] border border-zinc-200 bg-white px-3 py-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold transition-colors ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-2">
            {/* Core Details & Job Description */}
            {showCore && (
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <Card title="Core Details">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px]">
                    <div><p className="text-zinc-400">Department</p><p className="font-semibold text-zinc-800">{departmentName}</p></div>
                    <div><p className="text-zinc-400">Position / Job Title</p><p className="font-semibold text-zinc-800">{positionTitle}</p></div>
                    <div><p className="text-zinc-400">Work Location</p><p className="font-semibold text-zinc-800">{locationText}</p></div>
                    <div><p className="text-zinc-400">Reporting To</p><p className="font-semibold text-zinc-800">{reportingToName}</p></div>
                    <div><p className="text-zinc-400">Requested By</p><p className="font-semibold text-zinc-800">{requestedByName}</p></div>
                    <div><p className="text-zinc-400">Positions</p><p className="font-semibold text-zinc-800">{request.numberOfPositions ?? '-'}</p></div>
                    <div><p className="text-zinc-400">Employment Type</p><p className="font-semibold text-zinc-800">{employmentTypeText}</p></div>
                    <div><p className="text-zinc-400">Reason for Hiring</p><p className="font-semibold text-zinc-800">{hiringReasonText}</p></div>
                    <div><p className="text-zinc-400">Priority</p><p className="font-semibold text-zinc-800">{request.priority || '-'}</p></div>
                    <div><p className="text-zinc-400">Salary Range</p><p className="font-semibold text-zinc-800">{salaryRangeText}</p></div>
                    <div><p className="text-zinc-400">Budget CTC</p><p className="font-semibold text-zinc-800">{request.budgetCTC ?? '-'}</p></div>
                    <div><p className="text-zinc-400">Request Date</p><p className="font-semibold text-zinc-800">{formatDate(request.requestDate)}</p></div>
                    <div><p className="text-zinc-400">Required Joining Date</p><p className="font-semibold text-zinc-800">{formatDate(request.requiredJoiningDate)}</p></div>
                    <div><p className="text-zinc-400">Urgent Requirement</p><p className="font-semibold text-zinc-800">{request.isUrgent ? 'Yes' : 'No'}</p></div>
                    <div><p className="text-zinc-400">Recruitment Status</p><p className="font-semibold text-zinc-800">{request.recruitmentStatus || request.status || '-'}</p></div>
                  </div>
                </Card>

                <Card title="Job Description Summary">
                  <div className="space-y-2 text-[10.5px]">
                    <div>
                      <p className="text-zinc-400 mb-1">Job Description Summary</p>
                      <p className="leading-relaxed text-zinc-700 whitespace-pre-wrap bg-zinc-50/70 p-2 rounded-[2px] border border-zinc-100">
                        {request.jobDescriptionSummary || '-'}
                      </p>
                    </div>
                    {request.detailedJustification && (
                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400 mb-1">Detailed Justification</p>
                        <p className="leading-relaxed text-zinc-700 whitespace-pre-wrap bg-zinc-50/70 p-2 rounded-[2px] border border-zinc-100">
                          {request.detailedJustification}
                        </p>
                      </div>
                    )}
                    {request.replacementName && (
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-1.5">
                        <span className="text-zinc-400">Replacement Employee</span>
                        <span className="font-semibold text-zinc-800">{request.replacementName}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Requirement Notes: Skills, Qualifications, Responsibilities, Benefits */}
            {showNotes && (
              <>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <Card title="Skills & Competencies">
                    <div className="space-y-2.5 text-[10.5px]">
                      <div>
                        <p className="text-zinc-400 mb-1">Technical Skills</p>
                        {request.technicalSkills ? (
                          <div className="flex flex-wrap gap-1.5">
                            {String(request.technicalSkills)
                              .split(/[,、\n]+/)
                              .map((s: string) => s.trim())
                              .filter(Boolean)
                              .map((s: string) => (
                                <span key={s} className="rounded-[2px] bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                                  {s}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <p className="font-semibold text-zinc-800">-</p>
                        )}
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400 mb-1">Soft Skills</p>
                        {request.softSkills ? (
                          <div className="flex flex-wrap gap-1.5">
                            {String(request.softSkills)
                              .split(/[,、\n]+/)
                              .map((s: string) => s.trim())
                              .filter(Boolean)
                              .map((s: string) => (
                                <span key={s} className="rounded-[2px] bg-zinc-50 border border-zinc-200/70 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                                  {s}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <p className="font-semibold text-zinc-800">-</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card title="Qualifications & Experience">
                    <div className="space-y-2 text-[10.5px]">
                      <div>
                        <p className="text-zinc-400">Experience Requirement</p>
                        <p className="mt-0.5 font-semibold text-zinc-800">{request.experienceReq || '-'}</p>
                      </div>
                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400">Qualification Requirement</p>
                        <p className="mt-0.5 font-semibold text-zinc-800">{request.qualificationReq || '-'}</p>
                      </div>
                      {!request.detailedJustification && (
                        <div className="border-t border-zinc-100 pt-2">
                          <p className="text-zinc-400">Detailed Justification</p>
                          <p className="mt-0.5 text-zinc-800">{request.detailedJustification || '-'}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <Card title="Key Responsibilities & KRA">
                    <div className="space-y-2 text-[10.5px]">
                      <div>
                        <p className="text-zinc-400 mb-1">Key Responsibilities</p>
                        {request.keyResponsibilities?.length ? (
                          <ul className="list-disc space-y-0.5 pl-4 text-zinc-700 leading-relaxed">
                            {request.keyResponsibilities.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-semibold text-zinc-800">{request.keyResponsibilities || '-'}</p>
                        )}
                      </div>
                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400 mb-0.5">KRA Report</p>
                        <p className="leading-relaxed text-zinc-700 whitespace-pre-wrap">{request.kraReport || '-'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compensation & Benefits">
                    <div className="space-y-2 text-[10.5px]">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-zinc-400">Salary Range</p>
                          <p className="font-semibold text-zinc-800">{salaryRangeText}</p>
                        </div>
                        <div>
                          <p className="text-zinc-400">Budget CTC</p>
                          <p className="font-semibold text-zinc-800">{request.budgetCTC ?? '-'}</p>
                        </div>
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400 mb-1">Benefits</p>
                        {request.benefits?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {request.benefits.map((b: string, i: number) => (
                              <span key={i} className="rounded-[2px] bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                                {b}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="font-semibold text-zinc-800">{request.benefits || '-'}</p>
                        )}
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <p className="text-zinc-400">Other Benefits</p>
                        <p className="mt-0.5 font-semibold text-zinc-800">{request.otherBenefits || '-'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>

          {/* Sidebar / Right Details Column */}
          <div className="space-y-2">
            {showApproval && (
              <Card title="Approval & Status">
                <div className="space-y-1.5 text-[10.5px]">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
                    <span className="text-zinc-400">Status</span>
                    <span className={`rounded-[2px] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ${STATUS_BADGE[currentStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                      {currentStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Approved By</span>
                    <span className="font-semibold text-zinc-800">{approvedByName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Approval Date</span>
                    <span className="font-semibold text-zinc-800">{formatDate(request.approvalDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Request Received On</span>
                    <span className="font-semibold text-zinc-800">{formatDate(request.requestReceivedOn)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Recruitment Start Date</span>
                    <span className="font-semibold text-zinc-800">{formatDate(request.recruitmentStartDate)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-1.5">
                    <span className="text-zinc-400">Declaration Accepted</span>
                    <span className={`font-semibold ${request.declarationAccepted ? 'text-emerald-600' : 'text-zinc-700'}`}>
                      {request.declarationAccepted ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {request.status === 'Rejected' && request.rejectionReason && (
                    <div className="mt-2 rounded-[2px] bg-rose-50 p-2 border border-rose-200 text-rose-700">
                      <p className="font-bold text-[10px]">Rejection Reason:</p>
                      <p className="mt-0.5 text-[10.5px] leading-snug">{request.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card title="Quick Actions">
              <div className="space-y-1.5">
                <button
                  type="button"
                  disabled={generatePdf.isPending}
                  onClick={() => generatePdf.mutate()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] bg-indigo-600 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                >
                  <FileText size={12} /> {generatePdf.isPending ? 'Generating PDF...' : 'Generate PDF'}
                </button>
                <Link
                  href={`/dashboard/hiring/manpower/${id}/edit`}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm"
                >
                  <Pencil size={12} /> Edit Requisition
                </Link>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this requisition? This will permanently remove it from the database.')) {
                      deleteMutation.mutate();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-rose-200 bg-white py-1.5 text-[10.5px] font-semibold text-rose-600 hover:bg-rose-50 shadow-sm disabled:opacity-50"
                >
                  <Trash2 size={12} /> {deleteMutation.isPending ? 'Deleting...' : 'Delete Requisition'}
                </button>
                <Link
                  href="/dashboard/hiring/manpower"
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm"
                >
                  Back to Requisitions
                </Link>
              </div>
            </Card>

            <Card title="Requisition Audit">
              <div className="space-y-1.5 text-[10px] text-zinc-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Clock size={11} className="text-zinc-400" /> Created On</span>
                  <span className="font-medium text-zinc-700">{formatDateTime((request as any).createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Clock size={11} className="text-zinc-400" /> Last Updated</span>
                  <span className="font-medium text-zinc-700">{formatDateTime((request as any).updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Tag size={11} className="text-zinc-400" /> Request ID</span>
                  <span className="font-mono font-medium text-zinc-700">{requestIdShort}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-zinc-400" /> Approved By</span>
                  <span className="font-medium text-zinc-700">{approvedByName}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Meta Strip */}
        <div className="rounded-[2px] border border-zinc-200 bg-white px-3 py-2 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[10.5px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-zinc-400" /> Created On: <strong className="font-semibold text-zinc-700">{formatDateTime((request as any).createdAt)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-zinc-400" /> Last Updated: <strong className="font-semibold text-zinc-700">{formatDateTime((request as any).updatedAt)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Tag size={12} className="text-zinc-400" /> Request ID: <strong className="font-semibold text-zinc-700">{requestIdShort}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-zinc-400" /> Approved By: <strong className="font-semibold text-zinc-700">{approvedByName}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
