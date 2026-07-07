'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, BadgeCheck, Briefcase, Building2, CalendarDays, Clock, Cpu, FileText,
  Flag, Gift, GraduationCap, Heart, IndianRupee, ListChecks, MapPin, Pencil, ShieldCheck,
  Tag, Target, User, UserMinus, Users, Wallet, Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

const PALETTE = ['bg-indigo-100 text-indigo-600', 'bg-violet-100 text-violet-600', 'bg-emerald-100 text-emerald-600', 'bg-blue-100 text-blue-600', 'bg-amber-100 text-amber-600', 'bg-rose-100 text-rose-600'];

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
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  'On Hold': 'bg-zinc-100 text-zinc-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

function MiniCard({ icon: Icon, label, value: val, cls, badge }: { icon: any; label: string; value: React.ReactNode; cls: string; badge?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-zinc-100 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${cls}`}><Icon size={15} /></div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</p>
        {badge ? (
          <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-md ${STATUS_BADGE[String(val)] || 'bg-zinc-100 text-zinc-700'}`}>{val}</span>
        ) : (
          <p className="text-sm font-md text-zinc-900 dark:text-zinc-100 truncate">{val}</p>
        )}
      </div>
    </div>
  );
}

function NoteCard({ icon: Icon, label, cls, children }: { icon: any; label: string; cls: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${cls}`}><Icon size={12} /></div>
        <p className="text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</p>
      </div>
      <div className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">{children}</div>
    </div>
  );
}

export default function ManpowerRequestDetail({ id }: { id: string }) {
  const qc = useQueryClient();
  const { data: request, isLoading } = useQuery({ queryKey: ['manpower-request', id], queryFn: async () => (await api.get(`/hiring/manpower-request/${id}`)).data });
  const generatePdf = useMutation({
    mutationFn: async () => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data,
    onSuccess: (payload) => {
      qc.invalidateQueries({ queryKey: ['manpower-request', id] });
      openFileUrl(payload.pdfUrl);
    },
  });

  if (isLoading) return <div className="p-6 text-sm text-zinc-500">Loading manpower request...</div>;
  if (!request) return <div className="p-6 text-sm text-zinc-500">Manpower request not found.</div>;

  const coreDetails: Array<[any, string, any, boolean?]> = [
    [Building2, 'Department', value(request.departmentId)],
    [Briefcase, 'Position / Job Title', request.jobTitle || request.designation || '-'],
    [MapPin, 'Work Location', value(request.locationBranchId) !== '-' ? value(request.locationBranchId) : request.workLocation || '-'],
    [User, 'Reporting To', value(request.reportingTo)],
    [User, 'Requested By', value(request.requestedBy)],
    [Users, 'Positions', request.numberOfPositions ?? '-'],
    [Clock, 'Employment Type', request.employmentTypes?.join(', ') || request.employmentType || '-'],
    [Flag, 'Reason for Hiring', request.hiringReasons?.join(', ') || request.reasonForHiring || '-'],
    [Zap, 'Priority', request.priority || '-'],
    [IndianRupee, 'Salary Range', request.salaryCtcMin || request.salaryCtcMax ? `${request.salaryCtcMin || '-'} to ${request.salaryCtcMax || '-'}` : '-'],
    [Wallet, 'Budget CTC', request.budgetCTC ?? '-'],
    [CalendarDays, 'Request Date', formatDate(request.requestDate)],
    [CalendarDays, 'Required Joining Date', formatDate(request.requiredJoiningDate)],
    [AlertTriangle, 'Urgent Requirement', request.isUrgent ? 'Yes' : 'No'],
    [BadgeCheck, 'Recruitment Status', request.recruitmentStatus || request.status || '-', true],
  ];

  const requirementNotes: Array<[any, string, any]> = [
    [FileText, 'Detailed Justification', request.detailedJustification || '-'],
    ...(request.replacementName ? [[UserMinus, 'Replacement Employee', request.replacementName] as [any, string, any]] : []),
    [FileText, 'Job Description Summary', request.jobDescriptionSummary || '-'],
    [Target, 'KRA Report', request.kraReport || '-'],
    [ListChecks, 'Key Responsibilities', request.keyResponsibilities?.length ? request.keyResponsibilities.join('\n') : '-'],
    [GraduationCap, 'Qualification Requirement', request.qualificationReq || '-'],
    [BadgeCheck, 'Experience Requirement', request.experienceReq || '-'],
    [Cpu, 'Technical Skills', request.technicalSkills || '-'],
    [Heart, 'Soft Skills', request.softSkills || '-'],
    [Gift, 'Benefits', request.benefits?.length ? request.benefits.join(', ') : '-'],
    [Gift, 'Other Benefits', request.otherBenefits || '-'],
  ];

  const approvalDetails: Array<[any, string, any, boolean?]> = [
    [BadgeCheck, 'Status', request.status || '-', true],
    [User, 'Approved By', value(request.approvedBy)],
    [CalendarDays, 'Approval Date', formatDate(request.approvalDate)],
    [CalendarDays, 'Request Received On', formatDate(request.requestReceivedOn)],
    [CalendarDays, 'Recruitment Start Date', formatDate(request.recruitmentStartDate)],
    [ShieldCheck, 'Declaration Accepted', request.declarationAccepted ? 'Yes' : 'No'],
    ...(request.status === 'Rejected' && request.rejectionReason ? [[AlertTriangle, 'Rejection Reason', request.rejectionReason] as [any, string, any]] : []),
  ];

  return (
    <div className="mx-auto max-w-[1300px] space-y-3 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <div>
          <p className="text-[11px] font-md uppercase tracking-wider text-indigo-600">Hiring process · Step 1</p>
          <h1 className="mt-1 text-lg font-md leading-tight">Manpower Requisition Details</h1>
          <p className="text-xs text-zinc-500">View the source requisition record before candidate intake.</p>
        </div>
        <div className="flex gap-2">
          {request.status === 'Pending' && <Button variant="outline" size="sm" asChild><Link href={`/company/hiring/manpower/${id}/edit`}><Pencil size={13} className="mr-1.5" />Edit</Link></Button>}
          <Button size="sm" disabled={generatePdf.isPending} onClick={() => generatePdf.mutate()} className="bg-indigo-600 hover:bg-indigo-700"><FileText size={13} className="mr-1.5" />Generate PDF</Button>
        </div>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center gap-2 px-3 pt-3"><FileText size={14} className="text-indigo-600" /><p className="text-sm font-md">Core Details</p></div>
        <CardContent className="grid gap-2 p-3 sm:grid-cols-2 md:grid-cols-3">
          {coreDetails.map(([Icon, label, val, badge], i) => (
            <MiniCard key={label} icon={Icon} label={label} value={val} badge={badge} cls={PALETTE[i % PALETTE.length]} />
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center gap-2 px-3 pt-3"><FileText size={14} className="text-indigo-600" /><p className="text-sm font-md">Requirement Notes</p></div>
        <CardContent className="grid gap-2 p-3 md:grid-cols-2">
          {requirementNotes.map(([Icon, label, val], i) => (
            <NoteCard key={label} icon={Icon} label={label} cls={PALETTE[i % PALETTE.length]}>{val}</NoteCard>
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center gap-2 px-3 pt-3"><ShieldCheck size={14} className="text-indigo-600" /><p className="text-sm font-md">Approval & Status</p></div>
        <CardContent className="grid gap-2 p-3 sm:grid-cols-2 md:grid-cols-3">
          {approvalDetails.map(([Icon, label, val, badge], i) => (
            <MiniCard key={label} icon={Icon} label={label} value={val} badge={badge} cls={PALETTE[i % PALETTE.length]} />
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><Clock size={13} /> Created On <span className="font-md text-zinc-700 dark:text-zinc-300">{formatDateTime((request as any).createdAt)}</span></span>
          <span className="flex items-center gap-1.5"><Clock size={13} /> Last Updated <span className="font-md text-zinc-700 dark:text-zinc-300">{formatDateTime((request as any).updatedAt)}</span></span>
          <span className="flex items-center gap-1.5"><Tag size={13} /> Request ID <span className="font-md text-zinc-700 dark:text-zinc-300">{String((request as any)._id).slice(-8).toUpperCase()}</span></span>
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Approved By <span className="font-md text-zinc-700 dark:text-zinc-300">{value(request.approvedBy)}</span></span>
        </CardContent>
      </Card>
    </div>
  );
}
