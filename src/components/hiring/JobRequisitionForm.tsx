'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase, Clock3, UserCheck, Percent, Wallet, ChevronDown, Save, Send,
  FileText, ListChecks, Target, TrendingUp, Lightbulb, RotateCcw, Plus,
  UploadCloud, MessageCircle, X,
} from 'lucide-react';
import api from '@/lib/axios';
import ApiSelect from '@/components/common/ApiSelect';

const KPIS = [
  { label: 'Open Positions', value: '42', icon: Briefcase, accent: 'bg-blue-50 text-blue-600', trend: '8 from last month', up: true },
  { label: 'Active Requisitions', value: '18', icon: FileText, accent: 'bg-emerald-50 text-emerald-600', trend: '12% from last month', up: true },
  { label: 'Avg. Time to Hire', value: '18 Days', icon: Clock3, accent: 'bg-amber-50 text-amber-600', trend: '2 days from last month', up: false },
  { label: 'Positions Filled', value: '24', icon: UserCheck, accent: 'bg-violet-50 text-violet-600', trend: '10 from last month', up: true },
  { label: 'Offer Acceptance Rate', value: '87%', icon: Percent, accent: 'bg-pink-50 text-pink-600', trend: '7% from last month', up: true },
  { label: 'Cost Per Hire', value: '₹ 8,750', icon: Wallet, accent: 'bg-teal-50 text-teal-600', trend: '7% from last month', up: true },
];

const aiActions = [
  { title: 'Generate Job Description (JD)', detail: 'Based on Job Title & Role', icon: FileText },
  { title: 'Generate Key Responsibilities', detail: 'AI generated role based responsibilities', icon: ListChecks },
  { title: 'Suggest KPIs', detail: 'Industry standard KPI suggestions', icon: Target },
  { title: 'Salary Benchmark', detail: 'Get market salary range', icon: TrendingUp },
  { title: 'Smart Justification', detail: 'AI suggested business justification', icon: Lightbulb },
];

const approvalSteps = [
  { title: 'Manager Approval', name: 'Manager Name', status: 'Pending' },
  { title: 'HR Approval', name: 'HR Manager', status: 'Pending' },
  { title: 'Finance Approval', name: 'Finance Head', status: 'Pending' },
  { title: 'Final Approval', name: 'CEO', status: 'Pending' },
];

const inputCls = 'mt-0.5 h-8 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-[11.5px] text-zinc-800 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const textAreaCls = 'mt-0.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11.5px] text-zinc-800 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Field({
  title, required, children, hint, error
}: { title: string; required?: boolean; children: React.ReactNode; hint?: string; error?: any }) {
  return (
    <label className="block">
      <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
      {children}
      {error && <span className="mt-1 block text-[10px] text-rose-500">{error.message?.toString() || 'This field is required'}</span>}
      {hint && <span className="mt-1 block text-right text-[9px] text-zinc-400">{hint}</span>}
    </label>
  );
}

function Card({
  title, action, children, className = '',
}: { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-1.5">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 py-1.5">{children}</div>
    </div>
  );
}

function SectionCard({
  number, title, children,
}: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-1.5">
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">{number}</span>
        <h2 className="text-[12.5px] font-bold text-zinc-800">{title}</h2>
      </div>
      <div className="space-y-2 px-3 py-1.5">{children}</div>
    </div>
  );
}

export default function JobRequisitionForm({ id }: { id?: string }) {
  const isEditMode = !!id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  // Watch values for the summary card
  const watchedJobTitle = watch('jobTitle');
  const watchedDepartment = watch('departmentId');
  const watchedLocation = watch('locationBranchId');
  const watchedPositions = watch('numberOfPositions');
  const watchedEmploymentType = watch('employmentType');
  const watchedPriority = watch('priority');
  const watchedJoining = watch('requiredJoiningDate');

  const getArray = (res: any) => Array.isArray(res?.data) ? res.data : (res?.data?.data || []);

  const { data: deptRes } = useQuery({ queryKey: ['departments'], queryFn: () => api.get('/companies/departments') });
  const activeDepartments = getArray(deptRes).filter((d: any) => d.isActive !== false);

  const { data: empRes } = useQuery({ queryKey: ['employees'], queryFn: () => api.get('/employees') });
  const activeEmployees = getArray(empRes).filter((e: any) => e.isActive !== false);

  const { data: buRes } = useQuery({ queryKey: ['business-units'], queryFn: () => api.get('/business-units') });
  const activeBusinessUnits = getArray(buRes).filter((b: any) => b.status === 'Active');

  const { data: branchRes } = useQuery({ queryKey: ['branches'], queryFn: () => api.get('/companies/branches') });
  const activeBranches = getArray(branchRes).filter((b: any) => b.isActive !== false);

  const { data: desigRes } = useQuery({ queryKey: ['designations'], queryFn: () => api.get('/designations') });
  const activeDesignations = getArray(desigRes).filter((d: any) => d.isActive !== false);

  // Fetch for edit mode
  useQuery({
    queryKey: ['manpower-request', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/hiring/manpower-request/${id}`);
      const data = res.data;
      // Pre-process dates for inputs
      if (data.requiredJoiningDate) data.requiredJoiningDate = new Date(data.requiredJoiningDate).toISOString().split('T')[0];
      if (data.requestDate) data.requestDate = new Date(data.requestDate).toISOString().split('T')[0];

      // Flatten populated objects back to IDs for the dropdowns
      if (data.departmentId?._id) data.departmentId = data.departmentId._id;
      if (data.locationBranchId?._id) data.locationBranchId = data.locationBranchId._id;
      if (data.reportingTo?._id) data.reportingTo = data.reportingTo._id;
      if (data.requestedBy?._id) data.requestedBy = data.requestedBy._id;

      reset(data);
      return data;
    },
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // Map data appropriately
      if (isEditMode) {
        return api.put(`/hiring/manpower-request/${id}`, data);
      }
      return api.post('/hiring/manpower-request', data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? 'Requisition updated successfully' : 'Requisition created successfully');
      queryClient.invalidateQueries({ queryKey: ['manpower-requests'] });
      router.push('/dashboard/hiring/manpower');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save requisition');
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const getDeptName = (deptId: string) => activeDepartments.find((d: any) => d._id === deptId)?.name || 'Select Dept';
  const getBranchName = (branchId: string) => activeBranches.find((b: any) => b._id === branchId)?.name || 'Select Branch';

  const requestSummary = [
    { label: 'Requisition Title', value: watchedJobTitle || 'Not set' },
    { label: 'Department', value: watchedDepartment ? getDeptName(watchedDepartment) : 'Not set' },
    { label: 'Location', value: watchedLocation ? getBranchName(watchedLocation) : 'Not set' },
    { label: 'No. of Positions', value: watchedPositions || '1' },
    { label: 'Employment Type', value: watchedEmploymentType || 'Full Time' },
    { label: 'Priority', value: watchedPriority || 'Medium' },
    { label: 'Expected Joining', value: watchedJoining || 'Not set' },
  ];

  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{isEditMode ? 'Edit Job Requisition' : 'Create Job Requisition'}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Recruitment</span> <span>›</span> <span>Job Requisition</span> <span>›</span>
              <span className="font-semibold text-zinc-700">{isEditMode ? 'Edit Request' : 'Create New Request'}</span>
            </p>
          </div>
          {/* <Link href="/dashboard/hiring/manpower/new/classic" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
            Need the classic form?
          </Link> */}
          <div className="flex gap-2">
            <button onClick={() => router.back()} className='w-[100px] bg-gray-200 hover:bg-gray-300 text-[11px] font-semibold py-1 rounded-lg cursor-pointer'>Cancel</button>
            <button onClick={() => document.getElementById('submitForm')?.click()} type="button" className="flex flex-1 h-8 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Save size={13} /> {isEditMode ? 'Update Draft' : 'Save as Draft'}
            </button>
            <button onClick={() => {
              // To keep it simple, we use the same endpoint but ideally you might set status to 'Pending Approval' instead of draft
              document.getElementById('submitForm')?.click();
            }} type="button" className="flex flex-1 h-8 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700 whitespace-nowrap">
              <Send size={13} /> Submit for Approval
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {KPIS.map((s) => (
            <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.accent}`}>
                  <s.icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] text-zinc-500 leading-tight">{s.label}</p>
                  <p className="text-lg font-bold leading-tight text-zinc-900">{s.value}</p>
                  <p className={`truncate text-[9px] font-semibold leading-tight ${s.up ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {s.up ? '↗' : '↘'} {s.trend}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content: form + sidebar */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          {/* Form */}
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <SectionCard number={1} title="Requisition Details">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field title="Requisition Title" required error={errors.jobTitle}>
                  <input className={inputCls} placeholder="e.g. Sales Executive - North Region" {...register('jobTitle', { required: true })} />
                </Field>
                <Field title="Department" required error={errors.departmentId}>
                  <ApiSelect apiType="department" className={selectCls} placeholderText="Select Department" {...register('departmentId', { required: true })} />
                </Field>
                <Field title="Reporting Manager" required error={errors.reportingTo}>
                  <ApiSelect apiType="employee" className={selectCls} placeholderText="Select Manager" {...register('reportingTo')} />
                </Field>
                <Field title="Business Unit" error={errors.businessUnit}>
                  <ApiSelect apiType="business-unit" className={selectCls} placeholderText="Select Business Unit" {...register('businessUnit')} />
                </Field>
                <Field title="Location" required error={errors.locationBranchId}>
                  <ApiSelect apiType="branch" className={selectCls} placeholderText="Select Branch" {...register('locationBranchId', { required: true })} />
                </Field>
                <Field title="Job Type" required error={errors.employmentType}>
                  <div className="relative">
                    <select className={selectCls} {...register('employmentType', { required: true })}>
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <Field title="Expected Joining Date" required error={errors.requiredJoiningDate}>
                  <input type="date" className={inputCls} {...register('requiredJoiningDate', { required: true })} />
                </Field>
                <Field title="No. of Positions" required error={errors.numberOfPositions}>
                  <input type="number" className={inputCls} {...register('numberOfPositions', { required: true, valueAsNumber: true })} defaultValue={1} />
                </Field>
                <Field title="Priority" required error={errors.priority}>
                  <div className="relative">
                    <select className={selectCls} {...register('priority', { required: true })}>
                      <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Urgent">Urgent</option>
                    </select>
                    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <Field title="Requisition Raised By" required error={errors.requestedBy}>
                  <ApiSelect apiType="employee" className={selectCls} placeholderText="Select Employee" {...register('requestedBy', { required: true })} />
                </Field>

                <div className="sm:col-span-2 xl:col-span-4">
                  <Field title="Requisition Justification" required hint="0 / 500" error={errors.justification}>
                    <textarea
                      className={`${textAreaCls} h-16`}
                      placeholder="Why is this requisition needed?"
                      {...register('justification')}
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard number={2} title="Job Details">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_2fr]">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field title="Designation" required error={errors.designation}>
                      <div className="relative">
                        <select className={selectCls} {...register('designation', { required: true })}>
                          <option value="">Select Designation</option>
                          {activeDesignations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </select>
                        <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      </div>
                    </Field>
                    <Field title="Work Location"><input className={inputCls} {...register('workLocation')} placeholder="Specific location..." /></Field>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Field title="Job Description Summary" required hint="0 / 1500" error={errors.jobDescriptionSummary}>
                      <textarea className={`${textAreaCls} h-20`} {...register('jobDescriptionSummary', { required: true })} />
                    </Field>
                    <Field title="Detailed Justification" hint="0 / 1500" error={errors.detailedJustification}>
                      <textarea className={`${textAreaCls} h-20`} {...register('detailedJustification')} />
                    </Field>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200">
                  <div className="border-b border-zinc-100 px-3 py-1.5">
                    <span className="text-[11px] font-semibold text-zinc-700">Key Performance Indicators (KPIs) <b className="text-rose-500">*</b></span>
                  </div>
                  <div className="divide-y divide-zinc-100 px-3 py-2">
                    <p className="text-xs text-zinc-400">KPI definition will be integrated in future phases.</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard number={3} title="Replacement Details (If Applicable)">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field title="Employee Being Replaced" error={errors.replacementName}>
                  <div className="relative">
                    <select className={selectCls} {...register('replacementName')}>
                      <option value="">Select Employee</option>
                      {activeEmployees.map((e: any) => <option key={e._id} value={`${e.firstName} ${e.lastName}`}>{e.firstName} {e.lastName}</option>)}
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <Field title="Replacement Reason" error={errors.reasonForHiring}>
                  <div className="relative">
                    <select className={selectCls} {...register('reasonForHiring')}>
                      <option value="New Position">New Position</option>
                      <option value="Replacement">Replacement</option>
                      <option value="Expansion">Expansion</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Retired">Retired</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <Field title="Impact of Vacancy" error={errors.impactOfVacancy}>
                  <div className="relative">
                    <select className={selectCls} {...register('impactOfVacancy')}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
              </div>
            </SectionCard>

            <SectionCard number={4} title="Compensation Details">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <Field title="Minimum Salary (CTC)" required error={errors.salaryCtcMin}><input type="number" className={inputCls} {...register('salaryCtcMin', { required: true, valueAsNumber: true })} /></Field>
                <Field title="Maximum Salary (CTC)" required error={errors.salaryCtcMax}><input type="number" className={inputCls} {...register('salaryCtcMax', { required: true, valueAsNumber: true })} /></Field>
                <Field title="Budget CTC" error={errors.budgetCTC}><input type="number" className={inputCls} {...register('budgetCTC', { valueAsNumber: true })} /></Field>
                <Field title="Currency" required error={errors.currency}>
                  <div className="relative">
                    <select className={selectCls} {...register('currency')}>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
                <Field title="Salary Type" required error={errors.salaryType}>
                  <div className="relative">
                    <select className={selectCls} {...register('salaryType')}>
                      <option value="Per Month">Per Month</option>
                      <option value="Per Annum">Per Annum</option>
                    </select>
                    <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Hidden submit button to trigger form from custom buttons */}
            <button type="submit" id="submitForm" className="hidden">Submit</button>
          </form>

          {/* Sidebar */}
          <div className="space-y-2">
            {/* <div className="flex gap-2">
              <button onClick={() => document.getElementById('submitForm')?.click()} type="button" className="flex flex-1 h-8 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                <Save size={13} /> {isEditMode ? 'Update Draft' : 'Save as Draft'}
              </button>
              <button onClick={() => {
                // To keep it simple, we use the same endpoint but ideally you might set status to 'Pending Approval' instead of draft
                document.getElementById('submitForm')?.click();
              }} type="button" className="flex flex-1 h-8 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700 whitespace-nowrap">
                <Send size={13} /> Submit for Approval
              </button>
            </div> */}

            <Card
              title="AI Assistant"
              action={<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">Beta</span>}
            >
              <p className="mb-1.5 text-[10.5px] leading-snug text-zinc-500">Let AI help you create a complete and accurate job requisition.</p>
              <div className="space-y-1">
                {aiActions.map((a) => (
                  <button key={a.title} type="button" className="flex w-full items-start gap-2.5 rounded-lg border border-zinc-100 px-2.5 py-1.5 text-left hover:bg-indigo-50/40">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><a.icon size={14} /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-[10.5px] font-semibold text-zinc-800">{a.title}</span>
                      <span className="block truncate text-[9.5px] text-zinc-400">{a.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 border-t border-zinc-100 pt-1.5 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                <RotateCcw size={11} /> Regenerate All with AI
              </button>
            </Card>

            <Card title="Request Summary">
              <div className="space-y-2">
                {requestSummary.map((r) => (
                  <div key={r.label} className="flex items-start justify-between gap-2 text-[10.5px]">
                    <span className="shrink-0 text-zinc-500">{r.label}</span>
                    <span className="text-right font-semibold text-zinc-800">{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Approval Workflow">
              <div className="space-y-0">
                {approvalSteps.map((s, i) => (
                  <div key={s.title} className="relative flex gap-2.5 pb-2 last:pb-0">
                    {i < approvalSteps.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />}
                    <span className="relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border-2 border-indigo-500 bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold text-zinc-800">{s.title}</p>
                      <p className="truncate text-[9.5px] text-zinc-400">{s.name}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">{s.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Floating AI chat bubble */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <div className="max-w-[220px] rounded-xl rounded-br-sm border border-zinc-200 bg-white px-3 py-2 text-[10.5px] text-zinc-600 shadow-md">
            Hi! Need help in generating JD or KPIs?
          </div>
          <button type="button" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
