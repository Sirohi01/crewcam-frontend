'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Briefcase, Building2, CalendarDays, CheckCircle2, Clock,
  Cpu, FileText, Flag, Gift, GraduationCap, Heart, IndianRupee,
  ListChecks, MapPin, Pencil, Save, Send, ShieldCheck, Tag, Target, User,
  Users, Wallet, Zap, RotateCcw, Loader2, Sparkles, ChevronDown, ArrowLeft
} from 'lucide-react';
import api from '@/lib/axios';
import ApiSelect from '@/components/common/ApiSelect';

function toDateInputValue(val: any) {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function formatDate(date: any) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}

function formatDateTime(date: any) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '-';
  }
}

const inputCls = 'mt-0.5 h-7 w-full rounded-[2px] border border-zinc-200 bg-white px-2 text-[11px] text-zinc-800 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const textAreaCls = 'mt-0.5 w-full resize-y rounded-[2px] border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-800 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const labelCls = 'text-[10px] font-medium text-zinc-400 block leading-tight';

function FormField({
  label,
  required,
  children,
  hint,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  error?: any;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <b className="text-rose-500"> *</b>}
      </span>
      {children}
      {error && <span className="mt-0.5 block text-[9.5px] text-rose-500">{error.message?.toString() || 'Required field'}</span>}
      {hint && <span className="mt-0.5 block text-right text-[8.5px] text-zinc-400">{hint}</span>}
    </label>
  );
}

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

const STATUS_BADGE: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border border-amber-200/60',
  Approved: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
  Rejected: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  'In Progress': 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
  'On Hold': 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  Completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
};

export default function JobRequisitionForm({ id }: { id?: string }) {
  const isEditMode = Boolean(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('Overview');

  const { register, control, handleSubmit, reset, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      jobTitle: '',
      designation: '',
      departmentId: '',
      locationBranchId: '',
      workLocation: '',
      reportingTo: '',
      requestedBy: '',
      numberOfPositions: 1,
      employmentType: 'Full-time',
      reasonForHiring: 'New Position',
      priority: 'Medium',
      salaryCtcMin: '',
      salaryCtcMax: '',
      budgetCTC: '',
      requestDate: toDateInputValue(new Date()),
      requiredJoiningDate: '',
      isUrgent: false,
      recruitmentStatus: 'Posted',
      status: 'Pending',
      jobDescriptionSummary: '',
      detailedJustification: '',
      replacementName: '',
      technicalSkills: '',
      softSkills: '',
      experienceReq: '',
      qualificationReq: '',
      keyResponsibilities: '',
      kraReport: '',
      benefits: '',
      otherBenefits: '',
      approvedBy: '',
      approvalDate: '',
      requestReceivedOn: '',
      recruitmentStartDate: '',
      declarationAccepted: false,
      rejectionReason: '',
    }
  });

  // Watched values for live banner preview
  const watchedStatus = watch('status') || 'Pending';
  const watchedPriority = watch('priority') || 'Medium';
  const watchedIsUrgent = watch('isUrgent');
  const watchedTitle = watch('jobTitle');
  const watchedPositions = watch('numberOfPositions') || 1;
  const watchedRecruitmentStatus = watch('recruitmentStatus') || 'Posted';
  const watchedDepartmentId = watch('departmentId');
  const watchedLocationBranchId = watch('locationBranchId');
  const watchedWorkLocation = watch('workLocation');
  const watchedEmploymentType = watch('employmentType');
  const watchedReasonForHiring = watch('reasonForHiring');
  const watchedSalaryMin = watch('salaryCtcMin');
  const watchedSalaryMax = watch('salaryCtcMax');
  const watchedBudgetCTC = watch('budgetCTC');
  const watchedJoiningDate = watch('requiredJoiningDate');
  const watchedRequestDate = watch('requestDate');
  const watchedDeclaration = watch('declarationAccepted');

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['manpower-request', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/hiring/manpower-request/${id}`);
      return res.data;
    },
    enabled: isEditMode,
  });

  // Pre-fill form values reliably whenever initialData arrives
  useEffect(() => {
    if (initialData) {
      const data = initialData;
      const formatted: any = {
        jobTitle: data.jobTitle || data.designation || '',
        designation: data.designation || data.jobTitle || '',
        requiredJoiningDate: toDateInputValue(data.requiredJoiningDate),
        requestDate: toDateInputValue(data.requestDate || data.createdAt),
        approvalDate: toDateInputValue(data.approvalDate),
        requestReceivedOn: toDateInputValue(data.requestReceivedOn),
        recruitmentStartDate: toDateInputValue(data.recruitmentStartDate),
        departmentId: data.departmentId?._id || data.departmentId || '',
        locationBranchId: data.locationBranchId?._id || data.locationBranchId || '',
        workLocation: data.workLocation || data.locationBranchId?.name || data.locationBranchId?.location || '',
        reportingTo: data.reportingTo?._id || data.reportingTo || '',
        requestedBy: data.requestedBy?._id || data.requestedBy || '',
        approvedBy: data.approvedBy?._id || data.approvedBy || '',
        technicalSkills: Array.isArray(data.technicalSkills) ? data.technicalSkills.join(', ') : (data.technicalSkills || ''),
        softSkills: Array.isArray(data.softSkills) ? data.softSkills.join(', ') : (data.softSkills || ''),
        keyResponsibilities: Array.isArray(data.keyResponsibilities) ? data.keyResponsibilities.join('\n') : (data.keyResponsibilities || ''),
        benefits: Array.isArray(data.benefits) ? data.benefits.join(', ') : (data.benefits || ''),
        employmentType: data.employmentType || (Array.isArray(data.employmentTypes) && data.employmentTypes[0]) || 'Full-time',
        reasonForHiring: data.reasonForHiring || (Array.isArray(data.hiringReasons) && data.hiringReasons[0]) || 'New Position',
        numberOfPositions: data.numberOfPositions ?? 1,
        priority: data.priority || 'Medium',
        salaryCtcMin: data.salaryCtcMin !== undefined && data.salaryCtcMin !== null ? String(data.salaryCtcMin) : '',
        salaryCtcMax: data.salaryCtcMax !== undefined && data.salaryCtcMax !== null ? String(data.salaryCtcMax) : '',
        budgetCTC: data.budgetCTC !== undefined && data.budgetCTC !== null ? String(data.budgetCTC) : '',
        isUrgent: Boolean(data.isUrgent),
        declarationAccepted: Boolean(data.declarationAccepted),
        status: data.status || 'Pending',
        recruitmentStatus: data.recruitmentStatus || data.status || 'Posted',
        jobDescriptionSummary: data.jobDescriptionSummary || '',
        detailedJustification: data.detailedJustification || data.justification || '',
        replacementName: data.replacementName || '',
        kraReport: data.kraReport || '',
        qualificationReq: data.qualificationReq || '',
        experienceReq: data.experienceReq || '',
        otherBenefits: data.otherBenefits || '',
        rejectionReason: data.rejectionReason || '',
      };

      reset(formatted);
    }
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const payload: any = {
        jobTitle: data.jobTitle?.trim() || data.designation?.trim() || 'Untitled Requisition',
        designation: data.designation?.trim() || data.jobTitle?.trim() || '',
        numberOfPositions: Number(data.numberOfPositions) || 1,
        employmentType: data.employmentType || 'Full-time',
        employmentTypes: [data.employmentType || 'Full-time'],
        reasonForHiring: data.reasonForHiring || 'New Position',
        hiringReasons: [data.reasonForHiring || 'New Position'],
        priority: data.priority || 'Medium',
        salaryCtcMin: data.salaryCtcMin !== '' ? Number(data.salaryCtcMin) : undefined,
        salaryCtcMax: data.salaryCtcMax !== '' ? Number(data.salaryCtcMax) : undefined,
        budgetCTC: data.budgetCTC !== '' ? Number(data.budgetCTC) : undefined,
        requestDate: data.requestDate ? new Date(data.requestDate) : undefined,
        requiredJoiningDate: data.requiredJoiningDate ? new Date(data.requiredJoiningDate) : undefined,
        isUrgent: Boolean(data.isUrgent),
        recruitmentStatus: data.recruitmentStatus || 'Posted',
        status: data.status || 'Pending',
        jobDescriptionSummary: data.jobDescriptionSummary || '',
        detailedJustification: data.detailedJustification || '',
        justification: data.detailedJustification || '',
        replacementName: data.replacementName || '',
        kraReport: data.kraReport || '',
        qualificationReq: data.qualificationReq || '',
        experienceReq: data.experienceReq || '',
        otherBenefits: data.otherBenefits || '',
        workLocation: data.workLocation || '',
        declarationAccepted: Boolean(data.declarationAccepted),
        rejectionReason: data.rejectionReason || '',
      };

      // Handle ObjectId fields (omit or send valid ID, never empty string)
      if (data.departmentId && data.departmentId.trim()) payload.departmentId = data.departmentId;
      if (data.locationBranchId && data.locationBranchId.trim()) payload.locationBranchId = data.locationBranchId;
      if (data.reportingTo && data.reportingTo.trim()) payload.reportingTo = data.reportingTo;
      if (data.requestedBy && data.requestedBy.trim()) payload.requestedBy = data.requestedBy;
      if (data.approvedBy && data.approvedBy.trim()) payload.approvedBy = data.approvedBy;

      if (data.approvalDate) payload.approvalDate = new Date(data.approvalDate);
      if (data.requestReceivedOn) payload.requestReceivedOn = new Date(data.requestReceivedOn);
      if (data.recruitmentStartDate) payload.recruitmentStartDate = new Date(data.recruitmentStartDate);

      // Handle array string conversions
      if (typeof data.technicalSkills === 'string') {
        payload.technicalSkills = data.technicalSkills.split(/[,、\n]+/).map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.technicalSkills)) {
        payload.technicalSkills = data.technicalSkills;
      }

      if (typeof data.softSkills === 'string') {
        payload.softSkills = data.softSkills.split(/[,、\n]+/).map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.softSkills)) {
        payload.softSkills = data.softSkills;
      }

      if (typeof data.keyResponsibilities === 'string') {
        payload.keyResponsibilities = data.keyResponsibilities.split('\n').map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.keyResponsibilities)) {
        payload.keyResponsibilities = data.keyResponsibilities;
      }

      if (typeof data.benefits === 'string') {
        payload.benefits = data.benefits.split(/[,、\n]+/).map((s: string) => s.trim()).filter(Boolean);
      } else if (Array.isArray(data.benefits)) {
        payload.benefits = data.benefits;
      }

      if (isEditMode) {
        return (await api.put(`/hiring/manpower-request/${id}`, payload)).data;
      }
      return (await api.post('/hiring/manpower-request', payload)).data;
    },
    onSuccess: (res) => {
      toast.success(isEditMode ? 'Requisition updated successfully in database!' : 'Requisition created successfully in database!');
      queryClient.invalidateQueries({ queryKey: ['manpower-requests'] });
      queryClient.invalidateQueries({ queryKey: ['manpower-request', id] });
      queryClient.invalidateQueries({ queryKey: ['manpower-request-stats'] });
      if (isEditMode) {
        router.push(`/dashboard/hiring/manpower/${id}`);
      } else {
        const newId = res?._id || res?.id;
        if (newId) router.push(`/dashboard/hiring/manpower/${newId}`);
        else router.push('/dashboard/hiring/manpower');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to save requisition');
    },
  });

  const aiMutation = useMutation({
    mutationFn: async () => {
      const jobTitle = getValues('jobTitle') || getValues('designation');
      const designation = getValues('designation') || jobTitle;
      const departmentId = getValues('departmentId');

      if (!jobTitle) throw new Error('Job Title is required to generate AI content');

      const res = await api.post('/ai/hiring/generate-jd-kra', {
        jobTitle,
        designation,
        departmentId: departmentId || undefined,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.jobDescriptionSummary) setValue('jobDescriptionSummary', data.jobDescriptionSummary);
      if (data.kraReport) setValue('kraReport', data.kraReport);
      if (data.keyResponsibilities?.length) {
        setValue('keyResponsibilities', Array.isArray(data.keyResponsibilities) ? data.keyResponsibilities.join('\n') : data.keyResponsibilities);
      }
      toast.success('AI suggestions added to form!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'AI generation failed');
    },
  });

  const onSubmit = (formData: any) => {
    mutation.mutate(formData);
  };

  if (isEditMode && isLoading) {
    return <div className="p-8 text-center text-xs font-medium text-zinc-500">Loading requisition details for editing...</div>;
  }

  const showAll = tab === 'Overview';
  const showCore = showAll || tab === 'Core Details';
  const showNotes = showAll || tab === 'Requirement Notes';
  const showApproval = showAll || tab === 'Approval & Status';

  const requestIdShort = String(initialData?._id || id || 'NEW').slice(-8).toUpperCase();
  const salaryRangeSummary = watchedSalaryMin || watchedSalaryMax ? `₹ ${watchedSalaryMin || '-'} to ${watchedSalaryMax || '-'}` : '-';

  return (
    <div className="font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{isEditMode ? 'Edit Manpower Requisition' : 'Create Manpower Requisition'}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Hiring Process</span> <span>›</span> <span>Step 1</span> <span>›</span>
              <span className="font-semibold text-zinc-700">{isEditMode ? 'Edit Requisition Details' : 'New Requisition Form'}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={isEditMode ? `/dashboard/hiring/manpower/${id}` : '/dashboard/hiring/manpower'}
              className="flex items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-1.5 rounded-[2px] bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {mutation.isPending ? 'Saving to Database...' : isEditMode ? 'Save Changes' : 'Create Requisition'}
            </button>
          </div>
        </div>

        {/* Live Requisition Profile Banner (Reflecting changes live) */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div className="row-span-2 shrink-0 text-center flex flex-col items-center">
              <span className="grid h-16 w-16 place-items-center rounded-[2px] bg-indigo-50 text-indigo-600">
                <Briefcase size={26} />
              </span>
              <span className={`mt-1.5 inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${STATUS_BADGE[watchedStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                {watchedStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-[220px] flex-1">
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-zinc-900">
                  {watchedTitle || 'Untitled Position'}
                  {watchedIsUrgent && (
                    <span className="rounded-[2px] bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600 border border-rose-100">
                      Urgent
                    </span>
                  )}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-zinc-600">
                  <span>{initialData?.departmentId?.name || 'Department'}</span>
                  <span className="text-zinc-300">•</span>
                  <span>{watchedWorkLocation || initialData?.locationBranchId?.name || 'Work Location'}</span>
                  <span className="rounded-[2px] bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-600">
                    {watchedRecruitmentStatus}
                  </span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-zinc-500">
                  <span className="flex items-center gap-1"><User size={11} className="text-zinc-400" /> Reporting to: <strong className="font-semibold text-zinc-700">{initialData?.reportingTo?.firstName ? `${initialData.reportingTo.firstName} ${initialData.reportingTo.lastName || ''}` : 'Manager'}</strong></span>
                  <span className="flex items-center gap-1"><User size={11} className="text-zinc-400" /> Requested by: <strong className="font-semibold text-zinc-700">{initialData?.requestedBy?.firstName ? `${initialData.requestedBy.firstName} ${initialData.requestedBy.lastName || ''}` : 'Employee'}</strong></span>
                  <span className="flex items-center gap-1"><Users size={11} className="text-zinc-400" /> Positions: <strong className="font-semibold text-zinc-700">{watchedPositions}</strong></span>
                </div>
              </div>

              <div className="shrink-0 space-y-1 text-[10.5px]">
                <div className="flex items-center gap-6"><span className="text-zinc-400">Request ID</span><span className="ml-auto font-mono font-semibold text-zinc-800">{requestIdShort}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Request Date</span><span className="ml-auto font-semibold text-zinc-800">{formatDate(watchedRequestDate)}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Priority</span><span className="ml-auto font-semibold text-zinc-800">{watchedPriority}</span></div>
              </div>
            </div>

            <div className="mt-1.5 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-1.5 text-[10.5px] leading-tight sm:grid-cols-3 lg:grid-cols-6">
              <div><p className="text-zinc-400 leading-tight">Total Positions</p><p className="font-semibold leading-tight text-zinc-800">{watchedPositions}</p></div>
              <div><p className="text-zinc-400 leading-tight">Employment Type</p><p className="font-semibold leading-tight text-zinc-800">{watchedEmploymentType}</p></div>
              <div><p className="text-zinc-400 leading-tight">Reason for Hiring</p><p className="font-semibold leading-tight text-zinc-800">{watchedReasonForHiring}</p></div>
              <div><p className="text-zinc-400 leading-tight">Salary Range</p><p className="font-semibold leading-tight text-zinc-800">{salaryRangeSummary}</p></div>
              <div><p className="text-zinc-400 leading-tight">Budget CTC</p><p className="font-semibold leading-tight text-zinc-800">{watchedBudgetCTC ? `₹ ${watchedBudgetCTC}` : '-'}</p></div>
              <div><p className="text-zinc-400 leading-tight">Required Joining</p><p className="font-semibold leading-tight text-zinc-800">{formatDate(watchedJoiningDate)}</p></div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-600">Requisition Status</span>
                <span className={`rounded-[2px] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ${STATUS_BADGE[watchedStatus] || 'bg-zinc-100 text-zinc-700'}`}>
                  {watchedStatus}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-[2px] bg-zinc-100">
                <div
                  className={`h-full rounded-[2px] ${watchedStatus === 'Approved' ? 'bg-emerald-500 w-full' : watchedStatus === 'Rejected' ? 'bg-rose-500 w-full' : 'bg-indigo-600 w-1/2'}`}
                />
              </div>
              <div className="mt-2 space-y-1.5 text-[10.5px]">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Recruitment Status:</span>
                  <span className="font-semibold text-zinc-800">{watchedRecruitmentStatus}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Urgent Requirement:</span>
                  <span className={`font-semibold ${watchedIsUrgent ? 'text-rose-600' : 'text-zinc-800'}`}>{watchedIsUrgent ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Declaration:</span>
                  <span className="font-semibold text-zinc-800">{watchedDeclaration ? 'Accepted' : 'No'}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 border-t border-zinc-100 pt-1.5 text-[10px] text-zinc-400">
              <p>Last Updated: <span className="font-semibold text-zinc-700">{formatDateTime(initialData?.updatedAt || new Date())}</span></p>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
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
                    <FormField label="Department" required error={errors.departmentId}>
                      <Controller
                        name="departmentId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <ApiSelect
                            apiType="department"
                            placeholderText="Select Department *"
                            className={selectCls}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Position / Job Title" required error={errors.jobTitle}>
                      <input {...register('jobTitle', { required: true })} placeholder="e.g. Software Developer" className={inputCls} />
                    </FormField>

                    <FormField label="Work Location">
                      <input {...register('workLocation')} placeholder="e.g. Remote, Head Office, Noida" className={inputCls} />
                    </FormField>

                    <FormField label="Branch Location">
                      <Controller
                        name="locationBranchId"
                        control={control}
                        render={({ field }) => (
                          <ApiSelect
                            apiType="branch"
                            placeholderText="Select Branch Location"
                            className={selectCls}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Reporting To">
                      <Controller
                        name="reportingTo"
                        control={control}
                        render={({ field }) => (
                          <ApiSelect
                            apiType="employee"
                            placeholderText="Select Reporting Manager"
                            className={selectCls}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Requested By">
                      <Controller
                        name="requestedBy"
                        control={control}
                        render={({ field }) => (
                          <ApiSelect
                            apiType="employee"
                            placeholderText="Select Requesting Employee"
                            className={selectCls}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        )}
                      />
                    </FormField>

                    <FormField label="Positions" required error={errors.numberOfPositions}>
                      <input type="number" min={1} {...register('numberOfPositions', { required: true, valueAsNumber: true })} className={inputCls} />
                    </FormField>

                    <FormField label="Employment Type">
                      <select {...register('employmentType')} className={selectCls}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </FormField>

                    <FormField label="Reason for Hiring">
                      <select {...register('reasonForHiring')} className={selectCls}>
                        <option value="New Position">New Position</option>
                        <option value="Replacement">Replacement</option>
                        <option value="Expansion">Expansion</option>
                        <option value="Resigned">Resigned</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </FormField>

                    <FormField label="Priority">
                      <select {...register('priority')} className={selectCls}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </FormField>

                    <FormField label="Request Date">
                      <input type="date" {...register('requestDate')} className={inputCls} />
                    </FormField>

                    <FormField label="Required Joining Date">
                      <input type="date" {...register('requiredJoiningDate')} className={inputCls} />
                    </FormField>

                    <FormField label="Recruitment Status">
                      <select {...register('recruitmentStatus')} className={selectCls}>
                        <option value="Posted">Posted</option>
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </FormField>

                    <div className="flex items-center pt-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" {...register('isUrgent')} className="rounded-[2px]" />
                        <span className="text-[11px] font-semibold text-rose-600">Urgent Requirement</span>
                      </label>
                    </div>
                  </div>
                </Card>

                <Card
                  title="Job Description Summary"
                  action={
                    <button
                      type="button"
                      disabled={aiMutation.isPending}
                      onClick={() => aiMutation.mutate()}
                      className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    >
                      {aiMutation.isPending ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      AI Suggest JD
                    </button>
                  }
                >
                  <div className="space-y-2 text-[10.5px]">
                    <FormField label="Job Description Summary" required error={errors.jobDescriptionSummary}>
                      <textarea
                        {...register('jobDescriptionSummary', { required: true })}
                        rows={4}
                        placeholder="Enter full job description summary..."
                        className={textAreaCls}
                      />
                    </FormField>

                    <FormField label="Detailed Justification">
                      <textarea
                        {...register('detailedJustification')}
                        rows={3}
                        placeholder="Business justification for hiring for this position..."
                        className={textAreaCls}
                      />
                    </FormField>

                    <FormField label="Replacement Employee (If applicable)">
                      <input
                        {...register('replacementName')}
                        placeholder="Name of employee being replaced (if any)"
                        className={inputCls}
                      />
                    </FormField>
                  </div>
                </Card>
              </div>
            )}

            {/* Requirement Notes */}
            {showNotes && (
              <>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <Card title="Skills & Competencies">
                    <div className="space-y-2.5 text-[10.5px]">
                      <FormField label="Technical Skills" hint="Separate skills with commas">
                        <textarea
                          {...register('technicalSkills')}
                          rows={3}
                          placeholder="e.g. JavaScript, React, Node.js, TypeScript, SQL, Git"
                          className={textAreaCls}
                        />
                      </FormField>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="Soft Skills" hint="Separate skills with commas">
                          <textarea
                            {...register('softSkills')}
                            rows={2}
                            placeholder="e.g. Communication, Problem Solving, Leadership, Team Collaboration"
                            className={textAreaCls}
                          />
                        </FormField>
                      </div>
                    </div>
                  </Card>

                  <Card title="Qualifications & Experience">
                    <div className="space-y-2 text-[10.5px]">
                      <FormField label="Experience Requirement">
                        <input
                          {...register('experienceReq')}
                          placeholder="e.g. 3-5 Years of relevant experience"
                          className={inputCls}
                        />
                      </FormField>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="Qualification Requirement">
                          <input
                            {...register('qualificationReq')}
                            placeholder="e.g. B.Tech / MCA in Computer Science or equivalent"
                            className={inputCls}
                          />
                        </FormField>
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="Designation (Job Title / Role)">
                          <input
                            {...register('designation')}
                            placeholder="e.g. Senior Software Developer"
                            className={inputCls}
                          />
                        </FormField>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <Card title="Key Responsibilities & KRA">
                    <div className="space-y-2 text-[10.5px]">
                      <FormField label="Key Responsibilities" hint="Enter one responsibility per line">
                        <textarea
                          {...register('keyResponsibilities')}
                          rows={4}
                          placeholder="Write key responsibilities (each on a new line)..."
                          className={textAreaCls}
                        />
                      </FormField>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="KRA Report (Key Result Areas)">
                          <textarea
                            {...register('kraReport')}
                            rows={3}
                            placeholder="Key result areas and performance deliverables..."
                            className={textAreaCls}
                          />
                        </FormField>
                      </div>
                    </div>
                  </Card>

                  <Card title="Compensation & Benefits">
                    <div className="space-y-2 text-[10.5px]">
                      <div className="grid grid-cols-2 gap-2">
                        <FormField label="Salary CTC Min (₹)">
                          <input
                            type="number"
                            placeholder="e.g. 500000"
                            {...register('salaryCtcMin')}
                            className={inputCls}
                          />
                        </FormField>
                        <FormField label="Salary CTC Max (₹)">
                          <input
                            type="number"
                            placeholder="e.g. 800000"
                            {...register('salaryCtcMax')}
                            className={inputCls}
                          />
                        </FormField>
                      </div>

                      <FormField label="Budget CTC (₹)">
                        <input
                          type="number"
                          placeholder="e.g. 700000"
                          {...register('budgetCTC')}
                          className={inputCls}
                        />
                      </FormField>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="Benefits" hint="Separate benefits with commas">
                          <input
                            {...register('benefits')}
                            placeholder="e.g. Health Insurance, Provident Fund, Annual Bonus"
                            className={inputCls}
                          />
                        </FormField>
                      </div>

                      <div className="border-t border-zinc-100 pt-2">
                        <FormField label="Other Benefits">
                          <input
                            {...register('otherBenefits')}
                            placeholder="e.g. Flexible working hours, learning allowance"
                            className={inputCls}
                          />
                        </FormField>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-2">
            {showApproval && (
              <Card title="Approval & Status">
                <div className="space-y-2 text-[10.5px]">
                  <FormField label="Approval Status">
                    <select {...register('status')} className={selectCls}>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </FormField>

                  <FormField label="Approved By">
                    <Controller
                      name="approvedBy"
                      control={control}
                      render={({ field }) => (
                        <ApiSelect
                          apiType="employee"
                          placeholderText="Select Approver"
                          className={selectCls}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </FormField>

                  <FormField label="Approval Date">
                    <input type="date" {...register('approvalDate')} className={inputCls} />
                  </FormField>

                  <FormField label="Request Received On">
                    <input type="date" {...register('requestReceivedOn')} className={inputCls} />
                  </FormField>

                  <FormField label="Recruitment Start Date">
                    <input type="date" {...register('recruitmentStartDate')} className={inputCls} />
                  </FormField>

                  <div className="border-t border-zinc-100 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" {...register('declarationAccepted')} className="rounded-[2px]" />
                      <span className="text-[11px] font-semibold text-zinc-700">Declaration Accepted</span>
                    </label>
                  </div>

                  {watchedStatus === 'Rejected' && (
                    <div className="border-t border-rose-100 pt-2">
                      <FormField label="Rejection Reason">
                        <textarea
                          {...register('rejectionReason')}
                          rows={2}
                          placeholder="Specify reason for rejection..."
                          className={textAreaCls}
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card title="AI Assistant">
              <div className="space-y-1.5 text-[10.5px]">
                <p className="text-zinc-500 leading-snug">Generate JD, KRA, and key responsibilities with AI based on Job Title.</p>
                <button
                  type="button"
                  disabled={aiMutation.isPending}
                  onClick={() => aiMutation.mutate()}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-[2px] border border-indigo-200 bg-indigo-50/50 py-1.5 text-[10.5px] font-semibold text-indigo-700 hover:bg-indigo-100/60 disabled:opacity-50"
                >
                  {aiMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {aiMutation.isPending ? 'Generating with AI...' : 'Auto-Fill with AI'}
                </button>
              </div>
            </Card>

            <Card title="Actions">
              <div className="space-y-1.5">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] bg-indigo-600 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                >
                  {mutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {mutation.isPending ? 'Saving to Database...' : isEditMode ? 'Save Changes' : 'Create Requisition'}
                </button>

                <Link
                  href={isEditMode ? `/dashboard/hiring/manpower/${id}` : '/dashboard/hiring/manpower'}
                  className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm"
                >
                  Cancel
                </Link>

                {isEditMode && (
                  <Link
                    href={`/dashboard/hiring/manpower/${id}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white py-1.5 text-[10.5px] font-semibold text-indigo-600 hover:bg-indigo-50 shadow-sm"
                  >
                    View Requisition Details
                  </Link>
                )}
              </div>
            </Card>

            <Card title="Requisition Audit">
              <div className="space-y-1.5 text-[10px] text-zinc-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Clock size={11} className="text-zinc-400" /> Created</span>
                  <span className="font-medium text-zinc-700">{formatDateTime(initialData?.createdAt || new Date())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Clock size={11} className="text-zinc-400" /> Last Updated</span>
                  <span className="font-medium text-zinc-700">{formatDateTime(initialData?.updatedAt || new Date())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><Tag size={11} className="text-zinc-400" /> ID</span>
                  <span className="font-mono font-medium text-zinc-700">{requestIdShort}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
