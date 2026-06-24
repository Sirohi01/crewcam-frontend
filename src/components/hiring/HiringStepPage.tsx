'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, useFieldArray, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import { ArrayFieldConfig, getHiringStepById, HiringStepConfig, StepField } from '@/lib/hiringSteps';
import { openFileUrl } from '@/lib/fileUrls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import StepChecklist from './StepChecklist';

const inputClass = 'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobRole: string;
  status: string;
}

interface PipelineStep {
  key: string;
  stepNumber: number;
  status: string;
  checklist: { item: string; done: boolean; doneAt?: string }[];
  gate: { unlocked: boolean; blockedBy: string[] };
}

interface PipelineState {
  candidateId: string;
  employeeId?: string;
  currentStep: number;
  steps: PipelineStep[];
}

const numericField = (required?: boolean) => {
  const schema = z.preprocess((value) => {
    if (value === '' || value === undefined || value === null) return undefined;
    return Number(value);
  }, required ? z.number() : z.number().optional());
  return schema;
};

const scalarFieldSchema = (field: StepField) => {
  if (field.type === 'number') return numericField(field.required);
  const base = z.string();
  return field.required ? base.min(1, `${field.label} is required`) : base.optional().or(z.literal(''));
};

const assignNestedSchema = (shape: Record<string, z.ZodTypeAny>, path: string, schema: z.ZodTypeAny) => {
  const parts = path.split('.');
  let cursor = shape;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (!cursor[key]) cursor[key] = z.object({}).passthrough();
    const existing = cursor[key] as z.ZodObject<any>;
    cursor = existing.shape;
  }
  cursor[parts[parts.length - 1]] = schema;
};

const arraySchema = (field: ArrayFieldConfig) => {
  if (field.scalarArray) {
    return z.array(z.object({ value: z.string().min(1, 'Required') })).optional();
  }

  const rowShape: Record<string, z.ZodTypeAny> = {};
  for (const subField of field.subFields) {
    rowShape[subField.name] = scalarFieldSchema(subField);
  }
  return z.array(z.object(rowShape)).optional();
};

const buildSchema = (step: HiringStepConfig) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  step.fields.forEach((field) => assignNestedSchema(shape, field.name, scalarFieldSchema(field)));
  (step.arrayFields || []).forEach((field) => {
    shape[field.name] = arraySchema(field);
  });
  return z.object(shape).passthrough();
};

const defaultValuesFor = (step: HiringStepConfig) => {
  const defaults: Record<string, unknown> = {};
  for (const field of step.arrayFields || []) {
    // Optional multi-record sections must stay empty until the user explicitly
    // adds a row; a blank required row otherwise blocks a valid submission.
    defaults[field.name] = [];
  }
  return defaults;
};

const normalizePayload = (values: FieldValues, step: HiringStepConfig, entityId: string) => {
  const payload: Record<string, unknown> = { [step.entityField]: entityId, ...values };
  for (const arrayField of step.arrayFields || []) {
    const rows = Array.isArray(values[arrayField.name]) ? values[arrayField.name] : [];
    if (arrayField.scalarArray) {
      payload[arrayField.name] = rows.map((row: any) => row.value).filter(Boolean);
    } else {
      payload[arrayField.name] = rows.filter((row: any) => Object.values(row || {}).some(Boolean));
    }
  }
  return payload;
};

const maskSensitive = (key: string, value: unknown) => {
  if (value === undefined || value === null || value === '') return '—';
  const text = String(value);
  if (/accountNumber|panNumber/i.test(key)) {
    if (text.length <= 4 || text.includes('*')) return text;
    return `${'*'.repeat(Math.max(text.length - 4, 0))}${text.slice(-4)}`;
  }
  return text;
};

const recordDisplayValue = (key: string, value: any) => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'number') return Math.round(value).toLocaleString('en-IN');
  if (key === 'candidateId' && typeof value === 'object') return `${value.firstName || ''} ${value.lastName || ''}`.trim() || 'Candidate';
  if (key === 'employeeId' && typeof value === 'object') return `${value.firstName || ''} ${value.lastName || ''}`.trim() || value.employeeCode || 'Employee';
  if (key === 'approvalChain' && Array.isArray(value)) return value.map((entry: any) => {
    const approver = entry.approverId;
    const name = typeof approver === 'object' ? `${approver.firstName || ''} ${approver.lastName || ''}`.trim() : 'Selected approver';
    return `${entry.role || 'Approver'}: ${name} — ${entry.status || 'Pending'}`;
  }).join(' | ');
  if (Array.isArray(value)) return value.map((entry) => typeof entry === 'number' ? Math.round(entry).toLocaleString('en-IN') : (typeof entry === 'object' ? JSON.stringify(entry) : String(entry))).join(', ');
  if (typeof value === 'object') return value.firstName ? `${value.firstName} ${value.lastName || ''}`.trim() : (value.name || value.title || 'Saved details');
  return maskSensitive(key, value);
};
const recordLabel = (key: string) => key
  .replace(/([A-Z])/g, ' $1')
  .replace(/[._]/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase())
  .trim();

function FieldInput({ field, register, error }: { field: StepField; register: any; error?: string }) {
  if (field.type === 'select') {
    return (
      <>
        <select {...register(field.name)} className={inputClass}>
          <option value="">Select...</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
      </>
    );
  }
  if (field.type === 'textarea') {
    return (
      <>
        <textarea {...register(field.name)} className={inputClass} rows={4} />
        {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
      </>
    );
  }
  return (
    <>
      <input {...register(field.name)} type={field.type} className={inputClass} />
      {error && <div className="mt-1 text-xs text-rose-600">{error}</div>}
    </>
  );
}

function ArrayFieldEditor({ field, control, register, setValue, employees = [] }: { field: ArrayFieldConfig; control: any; register: any; setValue: any; employees?: any[] }) {
  const { fields, append, remove } = useFieldArray({ control, name: field.name });

  return (
    <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-md text-zinc-800 dark:text-zinc-100">{field.label}</div>
        <Button type="button" variant="outline" className="h-8 gap-2 px-2 text-xs" onClick={() => append({})}>
          <Plus size={14} /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((row, index) => (
          <div key={row.id} className="grid gap-2 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900 md:grid-cols-[1fr_auto]">
            <div className="grid gap-2 md:grid-cols-2">
              {field.subFields.map((subField) => (
                <label key={subField.name} className="text-xs font-md text-zinc-600 dark:text-zinc-300">
                  {subField.label}
                  {field.employeePicker && subField.name === 'approverId' ? (() => {
                    const registration = register(`${field.name}.${index}.${subField.name}`);
                    return <select {...registration} onChange={(event) => {
                      registration.onChange(event);
                      const employee = employees.find((entry: any) => entry._id === event.target.value);
                      setValue(`${field.name}.${index}.role`, employee?.roleId?.name || 'Employee', { shouldDirty: true, shouldValidate: true });
                    }} className={`${inputClass} mt-1`}>
                      <option value="">Select employee...</option>
                      {employees.map((employee: any) => <option key={employee._id} value={employee._id}>{employee.firstName} {employee.lastName} {employee.employeeCode ? `(${employee.employeeCode})` : ''}</option>)}
                    </select>
                  })() : field.employeePicker && subField.name === 'role' ? (
                    <input {...register(`${field.name}.${index}.${subField.name}`)} readOnly className={`${inputClass} mt-1 bg-zinc-100 text-zinc-600`} placeholder="Auto-filled from selected employee" />
                  ) : subField.type === 'select' ? (
                    <select {...register(`${field.name}.${index}.${subField.name}`)} className={`${inputClass} mt-1`}>
                      <option value="">Select...</option>
                      {subField.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input {...register(`${field.name}.${index}.${subField.name}`)} type={subField.type} className={`${inputClass} mt-1`} />
                  )}
                </label>
              ))}
            </div>
            <Button type="button" variant="ghost" className="h-9 w-9 p-0 text-rose-600" onClick={() => remove(index)}>
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HiringStepPage({ candidateId, stepId }: { candidateId: string; stepId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const step = getHiringStepById(stepId);

  const { data: candidate } = useQuery<Candidate>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
    enabled: !!candidateId,
  });

  const { data: pipeline } = useQuery<PipelineState>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
    enabled: !!candidateId,
  });

  const { data: hiringProfile } = useQuery<any>({
    queryKey: ['candidate-hiring-profile', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/hiring-profile`)).data,
    enabled: !!candidateId,
  });

  const entityId = step?.entityField === 'employeeId' ? pipeline?.employeeId : candidateId;
  const stepState = step ? pipeline?.steps.find((entry) => entry.key === step.stepKey) : undefined;

  const { data: approvalEmployees = [] } = useQuery<any[]>({
    queryKey: ['selection-approval-employees'],
    queryFn: async () => (await api.get('/employees')).data.data || [],
    enabled: step?.id === 'selection-approval',
  });

  const { data: records = [] } = useQuery<any[]>({
    queryKey: ['hiring-step-records', step?.id, entityId],
    queryFn: async () => {
      const response = await api.get(`${step!.apiPath}?${step!.entityField}=${entityId}`);
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
    enabled: !!step && !!entityId,
  });

  const form = useForm({
    resolver: step ? zodResolver(buildSchema(step)) : undefined,
    defaultValues: step ? defaultValuesFor(step) : {},
  });

  React.useEffect(() => {
    if (!step || !hiringProfile || form.formState.isDirty) return;
    const profileCandidate = hiringProfile.candidate || {};
    const manpower = hiringProfile.manpower || {};
    const evaluation = hiringProfile.evaluation || {};
    const selection = hiringProfile.selectionApproval || {};
    const ctc = hiringProfile.ctcBreakup || {};
    const loi = hiringProfile.loi || {};
    const joining = hiringProfile.joiningForm || {};
    const personal = joining.personalDetails || {};
    const contact = joining.contactDetails || {};
    const position = joining.positionDetails || {};

    const shared = {
      designation: manpower.designation || loi.designation || position.designation || profileCandidate.jobRole || '',
      jobRole: manpower.designation || position.designation || profileCandidate.jobRole || '',
      proposedCTC: selection.proposedCTC || ctc.annualCTC || evaluation.proposedSalaryMax || '',
      budgetedCTC: selection.budgetedCTC || manpower.budgetCTC || manpower.salaryCtcMax || '',
      recruitmentSource: selection.recruitmentSource || profileCandidate.source || '',
      recruitmentSummary: selection.recruitmentSummary || manpower.jobDescriptionSummary || '',
      justificationForVariance: selection.justificationForVariance || manpower.detailedJustification || manpower.justification || '',
      approvalNotes: selection.approvalNotes || evaluation.hodRemarks || evaluation.hrRemarks || evaluation.interviewerRemarks || '',
      annualCTC: ctc.annualCTC || selection.proposedCTC || evaluation.proposedSalaryMax || '',
      joiningDate: loi.joiningDate || position.joiningDate || manpower.requiredJoiningDate || '',
      confirmedJoiningDate: hiringProfile.joiningConfirmation?.confirmedJoiningDate || loi.joiningDate || manpower.requiredJoiningDate || '',
      'personalDetails.fullName': personal.fullName || `${profileCandidate.firstName || ''} ${profileCandidate.lastName || ''}`.trim(),
      'personalDetails.dob': personal.dob || profileCandidate.applicationDetails?.dateOfBirth || '',
      'contactDetails.mobileNumber': contact.mobileNumber || profileCandidate.phone || '',
      'contactDetails.personalEmail': contact.personalEmail || profileCandidate.email || '',
      'positionDetails.designation': position.designation || manpower.designation || profileCandidate.jobRole || '',
      'positionDetails.department': position.department || manpower.departmentName || '',
      'positionDetails.joiningDate': position.joiningDate || loi.joiningDate || manpower.requiredJoiningDate || '',
      'positionDetails.reportingManager': position.reportingManager || manpower.reportingToName || '',
      'positionDetails.workLocation': position.workLocation || manpower.workLocation || '',
      strengths: evaluation.strengths || '',
      areasOfImprovement: evaluation.improvementAreas || '',
    };
    const values: Record<string, any> = defaultValuesFor(step);
    Object.entries(shared).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) return;
      const parts = key.split('.');
      let cursor = values;
      parts.slice(0, -1).forEach((part) => { cursor[part] = cursor[part] || {}; cursor = cursor[part]; });
      const isDateField = /date$/i.test(parts[parts.length - 1]);
      cursor[parts[parts.length - 1]] = value instanceof Date ? value.toISOString().slice(0, 10) : (isDateField && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value);
    });
    form.reset(values);
  }, [form, hiringProfile, step]);
  const annualCtc = Number(form.watch('annualCTC') || 0);
  const monthlyGross = annualCtc > 0 ? annualCtc / 12 : 0;

  const createMutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      if (!step || !entityId) throw new Error('Step is not ready');
      const payload = normalizePayload(values, step, entityId);
      return (await api.post(step.apiPath, payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-hiring-profile', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', step?.id, entityId] });
    },
    onError: (error: any) => {
      window.alert(error?.response?.data?.message || error?.response?.data?.error || `Unable to save ${step?.title || 'this record'}`);
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ recordId, action }: { recordId: string; action: NonNullable<HiringStepConfig['postCreateActions']>[number] }) => {
      const url = `${step!.apiPath}/${recordId}${action.pathSuffix}`;
      return action.method === 'POST'
        ? (await api.post(url, action.payload || {})).data
        : (await api.put(url, action.payload || {})).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-hiring-profile', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', step?.id, entityId] });
    },
    onError: (error: any) => {
      window.alert(error?.response?.data?.message || error?.response?.data?.error || `Unable to complete this action for ${step?.title || 'this record'}`);
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (recordId: string) => (await api.post(`${step!.apiPath}/${recordId}/generate-pdf`)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', step?.id, entityId] });
      const url = data.pdfUrl || data.loi?.pdfUrl || data.offer?.pdfUrl || data.nda?.pdfUrl || data.letter?.pdfUrl || data.card?.pdfUrl;
      openFileUrl(url);
    },
  });

  if (!step) {
    return <div className="p-6 text-sm text-zinc-500">Unknown hiring step.</div>;
  }

  const latest = records[0];
  const locked = step.entityField === 'employeeId' ? !entityId : stepState?.gate.unlocked === false;

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-4 pb-8">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Button variant="ghost" className="h-8 gap-2 px-2 text-xs" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>
          <ArrowLeft size={14} /> Candidate Workflow
        </Button>
        <StepGate unlocked={!locked} blockedBy={step.entityField === 'employeeId' && !entityId ? ['employeeId'] : stepState?.gate.blockedBy || []} compact />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Step {step.step}. {step.title}</CardTitle>
              {candidate && <div className="text-xs text-zinc-500">{candidate.firstName} {candidate.lastName} · {candidate.jobRole} · {candidate.email}</div>}
            </CardHeader>
            <CardContent>
              {locked ? (
                <StepGate unlocked={false} blockedBy={step.entityField === 'employeeId' && !entityId ? ['employeeId'] : stepState?.gate.blockedBy || []} />
              ) : (
                <form onSubmit={form.handleSubmit((values) => createMutation.mutate(values))} className="space-y-4">
                  {step.id === 'evaluation' && (
                    <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="text-sm font-md text-zinc-800 dark:text-zinc-100">AI Evaluation Rows</div>
                      <div className="mt-1 text-xs text-zinc-500">No AI resume, voice, or video evaluation rows yet.</div>
                    </div>
                  )}

                  {step.id === 'ctc-breakup' && annualCtc > 0 && (
                    <div className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-3">
                      <div>
                        <div className="text-xs font-md uppercase text-zinc-500">Annual CTC</div>
                        <div className="mt-1 font-md text-zinc-900 dark:text-zinc-100">{annualCtc.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs font-md uppercase text-zinc-500">Monthly Gross</div>
                        <div className="mt-1 font-md text-zinc-900 dark:text-zinc-100">{monthlyGross.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      </div>
                      <div>
                        <div className="text-xs font-md uppercase text-zinc-500">Backend Calculator</div>
                        <div className="mt-1 text-zinc-600 dark:text-zinc-300">Final take-home is calculated after save.</div>
                      </div>
                    </div>
                  )}

                  {step.id === 'bgv' && (
                    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      BGV report actions are restricted to the backend permission gate; sensitive discrepancy detail is not rendered in this list view.
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    {step.fields.map((field) => (
                      <label key={field.name} className={field.type === 'textarea' ? 'text-xs font-md text-zinc-600 dark:text-zinc-300 md:col-span-2' : 'text-xs font-md text-zinc-600 dark:text-zinc-300'}>
                        {field.label}
                        <div className="mt-1">
                          <FieldInput field={field} register={form.register} error={(form.formState.errors as any)[field.name]?.message} />
                        </div>
                      </label>
                    ))}
                  </div>

                  {(step.arrayFields || []).map((field) => (
                    <ArrayFieldEditor key={field.name} field={field} control={form.control} register={form.register} setValue={form.setValue} employees={approvalEmployees} />
                  ))}

                  <Button type="submit" disabled={createMutation.isPending} className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                    <Save size={16} /> {createMutation.isPending ? 'Saving...' : 'Save Step Record'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {records.length === 0 && <div className="text-sm text-zinc-500">No records for this step yet.</div>}
              {records.map((record) => (
                <div key={record._id} className="rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-md text-zinc-900 dark:text-zinc-100">{record.status || record.finalStatus || record.overallStatus || record.signedStatus || 'Saved'}</div>
                    <div className="flex gap-2">
                      {step.hasPdf && (
                        <Button type="button" variant="outline" className="h-8 gap-2 px-2 text-xs" onClick={() => pdfMutation.mutate(record._id)}>
                          <FileText size={14} /> PDF
                        </Button>
                      )}
                      {(step.postCreateActions || []).filter((action) => !(step.id === 'selection-approval' && record.finalStatus && record.finalStatus !== 'Pending')).map((action) => (
                        <Button
                          key={action.label}
                          type="button"
                          variant="outline"
                          className="h-8 gap-2 px-2 text-xs"
                          onClick={() => actionMutation.mutate({ recordId: record._id, action })}
                        >
                          <ShieldCheck size={14} /> {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-x-5 gap-y-2 text-xs text-zinc-500 md:grid-cols-2">
                    {Object.entries(record).filter(([key]) => !['_id', '__v', 'tenantId', 'createdAt', 'updatedAt'].includes(key)).map(([key, value]) => (
                      <div key={key} className={key === 'approvalChain' || typeof value === 'object' ? 'md:col-span-2' : ''}>
                        <span className="font-md text-zinc-600 dark:text-zinc-300">{recordLabel(key)}: </span>
                        <span className="break-words">{recordDisplayValue(key, value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <StepChecklist items={stepState?.checklist} />
          <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pipeline State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="font-md">{stepState?.status || 'pending'}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Current Step</span><span className="font-md">{pipeline?.currentStep || 1}</span></div>
              {step.entityField === 'employeeId' && !entityId && (
                <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-700">Link an employee through Step 9 before this post-joining step can be used.</div>
              )}
              <Link href={`/dashboard/hiring/${candidateId}`} className="block pt-2 text-xs font-md text-zinc-700 underline dark:text-zinc-200">
                View all hiring steps
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
