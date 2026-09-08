'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm, useFieldArray, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText, Plus, Save, ShieldCheck, Trash2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import api from '@/lib/axios';
import { ArrayFieldConfig, getHiringStepById, HiringStepConfig, StepField } from '@/lib/hiringSteps';
import { openFileUrl } from '@/lib/fileUrls';

import { HiringStepLayout } from './HiringStepLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import StepChecklist from './StepChecklist';
import toast from 'react-hot-toast';

const inputClass = "w-full h-7 px-2 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] disabled:bg-slate-50 disabled:text-slate-500";
const selectClass = "w-full h-7 px-2 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68]";
const textareaClass = "w-full px-2 py-1.5 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] resize-none";

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
  const payload: Record<string, unknown> = { ...values, [step.entityField]: entityId };
  if (step.entityField === 'candidateId') {
    if (payload.employeeId && !/^[0-9a-fA-F]{24}$/.test(String(payload.employeeId))) {
      delete payload.employeeId;
    }
  }
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
  if (Array.isArray(value)) return value.map((entry) => {
    if (typeof entry === 'number') return Math.round(entry).toLocaleString('en-IN');
    if (typeof entry === 'object' && entry !== null) {
      return Object.entries(entry)
        .filter(([k]) => k !== '_id' && k !== '__v')
        .map(([k, v]) => `${recordLabel(k)}: ${v}`)
        .join(', ');
    }
    return String(entry);
  }).join(' | ');
  if (typeof value === 'object') return value.firstName ? `${value.firstName} ${value.lastName || ''}`.trim() : (value.name || value.title || 'Saved details');
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T|$)/.test(value)) return new Date(value).toLocaleDateString('en-GB');
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
        <select {...register(field.name)} className={selectClass}>
          <option value="">Select {field.label}...</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {error && <div className="mt-0.5 text-[11px] text-red-500">{error}</div>}
      </>
    );
  }
  if (field.type === 'textarea') {
    return (
      <>
        <textarea {...register(field.name)} className={textareaClass} rows={3} placeholder={field.placeholder || `Enter ${field.label}`} />
        {error && <div className="mt-0.5 text-[11px] text-red-500">{error}</div>}
      </>
    );
  }
  return (
    <>
      <input {...register(field.name)} type={field.type} className={inputClass} placeholder={field.placeholder || `Enter ${field.label}`} />
      {error && <div className="mt-0.5 text-[11px] text-red-500">{error}</div>}
    </>
  );
}

function ArrayFieldEditor({ field, control, register, setValue, employees = [] }: { field: ArrayFieldConfig; control: any; register: any; setValue: any; employees?: any[] }) {
  const { fields, append, remove } = useFieldArray({ control, name: field.name });

  return (
    <div className="rounded-[2px] border border-slate-200 bg-slate-50/50 p-3 space-y-3 mt-2">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <h4 className="text-xs font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
          {field.label}
        </h4>
        <button
          type="button"
          onClick={() => append({})}
          className="inline-flex items-center gap-1 border border-[#0d3c68] text-[#0d3c68] hover:bg-[#0d3c68] hover:text-white px-2 py-0.5 text-[11px] font-bold rounded-[2px] transition-all uppercase"
        >
          <Plus size={12} /> Add Item
        </button>
      </div>
      <div className="space-y-2.5">
        {fields.length === 0 && (
          <div className="text-[12px] text-slate-400 italic py-1">No items added yet. Click &quot;Add Item&quot; to add an entry.</div>
        )}
        {fields.map((row, index) => (
          <div key={row.id} className="grid gap-2.5 rounded-[2px] bg-white p-2.5 border border-slate-200 md:grid-cols-[1fr_auto] items-end shadow-xs">
            <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {field.subFields.map((subField) => (
                <div key={subField.name}>
                  <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
                    {subField.label}
                    {subField.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {field.employeePicker && subField.name === 'approverId' ? (() => {
                    const registration = register(`${field.name}.${index}.${subField.name}`);
                    return (
                      <select {...registration} onChange={(event) => {
                        registration.onChange(event);
                        const employee = employees.find((entry: any) => entry._id === event.target.value);
                        setValue(`${field.name}.${index}.role`, employee?.roleId?.name || 'Employee', { shouldDirty: true, shouldValidate: true });
                      }} className={selectClass}>
                        <option value="">Select employee...</option>
                        {employees.map((employee: any) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.firstName} {employee.lastName} {employee.employeeCode ? `(${employee.employeeCode})` : ''}
                          </option>
                        ))}
                      </select>
                    );
                  })() : field.employeePicker && subField.name === 'role' ? (
                    <input {...register(`${field.name}.${index}.${subField.name}`)} readOnly className={`${inputClass} bg-slate-100 text-slate-600`} placeholder="Auto-filled from selected employee" />
                  ) : subField.type === 'select' ? (
                    <select {...register(`${field.name}.${index}.${subField.name}`)} className={selectClass}>
                      <option value="">Select...</option>
                      {subField.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input {...register(`${field.name}.${index}.${subField.name}`)} type={subField.type} className={inputClass} placeholder={subField.placeholder} />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-600 rounded-[2px] transition-all border border-rose-200"
              onClick={() => remove(index)}
              title="Remove item"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HiringStepPage({ candidateId, stepId }: { candidateId: string; stepId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
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
    const joiningConfirmation = hiringProfile.joiningConfirmation || {};
    const joining = hiringProfile.joiningForm || {};
    const personal = joining.personalDetails || {};
    const contact = joining.contactDetails || {};
    const position = joining.positionDetails || {};

    const shared = {
      candidateName: `${profileCandidate.firstName || ''} ${profileCandidate.lastName || ''}`.trim(),
      employeeName: `${profileCandidate.firstName || ''} ${profileCandidate.lastName || ''}`.trim(),
      department: manpower.departmentName || position.department || '',
      position: manpower.designation || position.designation || profileCandidate.jobRole || '',
      workLocation: manpower.workLocation || position.workLocation || '',
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
      confirmedJoiningDate: joiningConfirmation.confirmedJoiningDate || loi.joiningDate || manpower.requiredJoiningDate || '',
      reportingManagerName: joiningConfirmation.reportingManagerName || `${manpower.reportingTo?.firstName || ''} ${manpower.reportingTo?.lastName || ''}`.trim() || '',
      reportingTime: joiningConfirmation.reportingTime || '09:30 AM',
      reportingLocation: joiningConfirmation.reportingLocation || manpower.workLocation || manpower.locationBranchId?.location || manpower.locationBranchId?.address || '',
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
      uniqueId: position.empCode || records[0]?.uniqueId || hiringProfile.employee?.employeeCode || '',
      employeeId: (hiringProfile.employeeId && /^[0-9a-fA-F]{24}$/.test(String(hiringProfile.employeeId)))
        ? String(hiringProfile.employeeId)
        : (pipeline?.employeeId && /^[0-9a-fA-F]{24}$/.test(String(pipeline.employeeId)))
          ? String(pipeline.employeeId)
          : (records[0]?.employeeId && /^[0-9a-fA-F]{24}$/.test(String(records[0].employeeId)))
            ? String(records[0].employeeId)
            : '',
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
  }, [form, hiringProfile, step, records[0]?.uniqueId]);

  // When editing an existing record from the register table (?edit=recordId),
  // override the form with the saved record's exact field values.
  React.useEffect(() => {
    if (!editId || !step || records.length === 0) return;
    const record = records.find((r: any) => r._id === editId);
    if (!record) return;

    const flattenRecord = (obj: any, prefix = ''): Record<string, any> => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (['_id', '__v', 'tenantId', 'createdAt', 'updatedAt'].includes(key)) continue;
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          Object.assign(result, flattenRecord(value as any, fullKey));
        } else {
          result[fullKey] = value;
        }
      }
      return result;
    };

    const flat = flattenRecord(record);
    const values: Record<string, any> = defaultValuesFor(step);

    // Populate scalar fields from the saved record
    for (const field of step.fields) {
      const val = flat[field.name];
      if (val === undefined || val === null) continue;
      const parts = field.name.split('.');
      let cursor = values;
      parts.slice(0, -1).forEach((part) => { cursor[part] = cursor[part] || {}; cursor = cursor[part]; });
      const isDate = field.type === 'date' || /date$/i.test(parts[parts.length - 1]);
      cursor[parts[parts.length - 1]] = isDate ? (val instanceof Date ? val.toISOString().slice(0, 10) : (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val) ? val.slice(0, 10) : val)) : val;
    }

    // Populate array fields from the saved record
    for (const arrayField of step.arrayFields || []) {
      const arr = record[arrayField.name];
      if (!Array.isArray(arr)) continue;
      if (arrayField.scalarArray) {
        values[arrayField.name] = arr.map((item: any) => ({ value: String(item) }));
      } else {
        values[arrayField.name] = arr.map((item: any) => {
          const row: Record<string, any> = {};
          for (const subField of arrayField.subFields) {
            const rawVal = item[subField.name];
            row[subField.name] = rawVal !== undefined && rawVal !== null
              ? (typeof rawVal === 'object' && rawVal._id ? rawVal._id : rawVal)
              : '';
          }
          return row;
        });
      }
    }

    form.reset(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, records, step]);
  const annualCtc = Number(form.watch('annualCTC') || 0);
  const monthlyGross = annualCtc > 0 ? annualCtc / 12 : 0;

  const createMutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      if (!step || !entityId) throw new Error('Step is not ready');
      const payload = normalizePayload(values, step, entityId);
      if (editId) {
        return (await api.put(`${step.apiPath}/${editId}`, payload)).data;
      }
      return (await api.post(step.apiPath, payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-hiring-profile', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', step?.id, entityId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-register', step?.apiPath] });
      toast.success(`${step?.title || 'Step'} ${editId ? 'updated' : 'saved'} successfully!`);
      if (step) {
        router.push(`/dashboard/hiring/steps/${step.id}`);
      }
    },
    onError: (error: any) => {
      const errDetail = error?.response?.data?.error;
      const errMsg = error?.response?.data?.message;
      const displayMsg = errDetail && errMsg && !errMsg.includes(errDetail)
        ? `${errMsg}: ${errDetail}`
        : (errMsg || errDetail || `Unable to save ${step?.title || 'this record'}`);
      toast.error(displayMsg);
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
      toast.success('Action completed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || `Unable to complete this action for ${step?.title || 'this record'}`);
    },
  });

  const loiStatusMutation = useMutation({
    mutationFn: async ({ recordId, status }: { recordId: string; status: string }) => (await api.put(`/hiring/loi/${recordId}/status`, { status })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', step?.id, entityId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-hiring-profile', candidateId] });
      toast.success('LOI status updated successfully!');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Unable to update LOI status'),
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
  const locked = (step.entityField === 'employeeId' && !entityId) ? true : stepState?.gate.unlocked === false;

  return (
    <HiringStepLayout candidateId={candidateId} stepId={stepId}>
      <div className="section-card shadow-sm border border-slate-200 overflow-hidden bg-white rounded-[2px]">
        {/* Top Header */}
        <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight font-poppins">
            <FileText className="h-4 w-4 text-[#0d3c68]" />
            STEP {step.step}: {step.title}
          </h2>
          {candidate && (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-[2px]">
              {candidate.firstName} {candidate.lastName} · {candidate.jobRole} · {candidate.email}
            </span>
          )}
        </div>

        <div className="p-3.5 space-y-3.5">
          {/* Edit Alert */}
          {editId && (
            <div className="rounded-[2px] bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs text-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-[2px]">Notice</span>
                <span>You are editing an existing record. Changes will update the saved entry.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push(`/dashboard/hiring/${candidateId}/steps/${stepId}`);
                  form.reset(defaultValuesFor(step));
                }}
                className="text-[11px] font-bold text-[#0d3c68] hover:underline uppercase"
              >
                + Create New Instead
              </button>
            </div>
          )}

          <form onSubmit={form.handleSubmit((values) => createMutation.mutate(values))} className="space-y-3.5">
            {/* Form Section Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">{step.step}</span>
                {step.title} Details
              </h3>
            </div>

            {step.id === 'evaluation' && (
              <div className="rounded-[2px] border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
                <div className="text-xs font-bold text-[#0d3c68] uppercase mb-1">AI Evaluation Rows</div>
                No AI resume, voice, or video evaluation rows yet.
              </div>
            )}

            {step.id === 'ctc-breakup' && annualCtc > 0 && (
              <div className="grid gap-3 rounded-[2px] border border-slate-200 bg-slate-50/70 p-3 text-sm md:grid-cols-3">
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Annual CTC</div>
                  <div className="mt-0.5 font-bold text-[#0d3c68] text-base">₹{annualCtc.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Monthly Gross</div>
                  <div className="mt-0.5 font-bold text-slate-800 text-base">₹{monthlyGross.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-500">Backend Calculator</div>
                  <div className="mt-0.5 text-xs text-slate-600">Final take-home is calculated after save.</div>
                </div>
              </div>
            )}

            {step.id === 'bgv' && (
              <div className="rounded-[2px] border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
                BGV report actions are restricted to the backend permission gate; sensitive discrepancy detail is not rendered in this list view.
              </div>
            )}

            {/* Grid of Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {step.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2 lg:col-span-3' : ''}>
                  <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <FieldInput field={field} register={form.register} error={(form.formState.errors as any)[field.name]?.message} />
                </div>
              ))}
            </div>

            {/* Array Fields */}
            {(step.arrayFields || []).map((field) => (
              <ArrayFieldEditor key={field.name} field={field} control={form.control} register={form.register} setValue={form.setValue} employees={approvalEmployees} />
            ))}

            {/* Form Actions */}
            <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => form.reset()}
                className="group flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-[2px] uppercase"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                RESET
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-sm hover:shadow transition-all rounded-[2px] tracking-wide uppercase disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {createMutation.isPending ? 'SAVING...' : (editId ? 'UPDATE RECORD' : 'SAVE STEP RECORD')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Saved Records Section */}
      <div className="mt-4 shadow-sm border border-slate-200 overflow-hidden bg-white rounded-[2px]">
        <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[12px] font-bold text-[#0d3c68] flex items-center gap-1.5 uppercase tracking-tight font-poppins">
            <FileText className="h-3.5 w-3.5 text-[#0d3c68]" />
            Saved Records ({records.length})
          </h3>
        </div>
        <div className="p-3 space-y-2.5">
          {records.length === 0 && <div className="text-xs text-slate-400 italic py-2 text-center">No saved records for this step yet.</div>}
          {records.map((record) => (
            <div key={record._id} className="rounded-[2px] border border-slate-200 p-3 text-xs bg-slate-50/40 hover:bg-slate-50 transition-colors shadow-xs">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 uppercase">Status:</span>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-[2px] bg-emerald-100 text-emerald-800">
                    {record.status || record.finalStatus || record.overallStatus || record.signedStatus || 'Saved'}
                  </span>
                  {record.updatedAt && (
                    <span className="text-[10px] text-slate-400">
                      Updated: {new Date(record.updatedAt).toLocaleDateString('en-GB')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {step.id === 'loi' && (
                    <select
                      value={record.status || 'Draft'}
                      onChange={(event) => loiStatusMutation.mutate({ recordId: record._id, status: event.target.value })}
                      className="h-6 rounded-[2px] border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700"
                    >
                      <option>Draft</option>
                      <option>Sent</option>
                      <option>Accepted</option>
                      <option>Declined</option>
                      <option>Expired</option>
                    </select>
                  )}
                  {step.hasPdf && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-bold rounded-[2px] border border-[#0d3c68] text-[#0d3c68] hover:bg-[#0d3c68] hover:text-white transition-all uppercase"
                      onClick={() => {
                        if (step.id === 'selection-approval' || step.id === 'probation-review') {
                          window.open(`/dashboard/hiring/print/${step.id}/${record._id}`, '_blank');
                        } else {
                          pdfMutation.mutate(record._id);
                        }
                      }}
                    >
                      <FileText size={11} /> {step.id === 'loi' && record.status === 'Draft' ? 'Generate & Send LOI' : 'PDF'}
                    </button>
                  )}
                  {(step.postCreateActions || []).filter((action) => !(step.id === 'selection-approval' && record.finalStatus && record.finalStatus !== 'Pending')).map((action) => {
                    const lower = action.label.toLowerCase();
                    const isApprove = lower.includes('approve') || lower.includes('accept') || lower.includes('confirm') || lower.includes('verify') || lower.includes('issue');
                    const isReject = lower.includes('reject') || lower.includes('decline') || lower.includes('terminate');
                    return (
                      <button
                        key={action.label}
                        type="button"
                        disabled={actionMutation.isPending}
                        onClick={() => actionMutation.mutate({ recordId: record._id, action })}
                        className={`inline-flex items-center gap-1 h-6 px-2 text-[11px] font-bold rounded-[2px] transition-all uppercase ${
                          isApprove
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : isReject
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isApprove ? <CheckCircle size={11} /> : isReject ? <XCircle size={11} /> : <ShieldCheck size={11} />} {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-x-5 gap-y-1.5 text-xs text-slate-600 md:grid-cols-3">
                {Object.entries(record).filter(([key]) => !['_id', '__v', 'tenantId', 'createdAt', 'updatedAt'].includes(key)).map(([key, value]) => (
                  <div key={key} className={key === 'approvalChain' || typeof value === 'object' ? 'md:col-span-3' : ''}>
                    <span className="font-semibold text-slate-700 uppercase text-[10px]">{recordLabel(key)}: </span>
                    <span className="break-words text-slate-900">{recordDisplayValue(key, value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </HiringStepLayout>
  );
}
