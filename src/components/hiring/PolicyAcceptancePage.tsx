'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, FileText, CheckCircle2, Shield } from 'lucide-react';
import api from '@/lib/axios';
import StepGate from './StepGate';
import { Button } from '@/components/ui/button';
import { FormField, FormInput, FormTextarea, FormCheckbox } from '@/components/common/FormComponents';
import { DataTable } from '@/components/shared/DataTable';
import { useEffect } from 'react';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

function PolicyPage({ candidateId, stepKey, apiPath, title, step, color, contentField, versionField, titleField, labelPrefix = 'Policy' }:
  { candidateId: string; stepKey: string; apiPath: string; title: string; step: number; color: string; contentField: string; versionField: string; titleField: string; labelPrefix?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', apiPath, candidateId], queryFn: async () => (await api.get(`${apiPath}?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === stepKey);
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { hasRead: false, understands: false, agreesToComply: false, understandsConsequences: false, agreesToAbide: false, [versionField]: '', [titleField]: '', signerName: '', signerDesignation: '', [contentField]: '' } as any
  });

  useEffect(() => {
    if (editId && records.length > 0) {
      const record = records.find(r => r._id === editId);
      if (record) reset(record);
    }
  }, [editId, records, reset]);

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      const payload = { ...v, candidateId, status: 'Accepted', acceptedAt: new Date(), ipAddress: 'client' };
      if (editId) {
        return (await api.put(`${apiPath}/${editId}`, payload)).data;
      }
      return (await api.post(apiPath, payload)).data;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', apiPath, candidateId] }); 
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); 
      setTimeout(() => {
        const stepId = stepKey === 'itPolicyAcceptance' ? 'it-policy-accept' : 'code-of-conduct-accept';
        router.push(`/dashboard/hiring/steps/${stepId}`);
      }, 500);
    },
  });
  const pdfMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`${apiPath}/${id}/generate-pdf`)).data,
    onSuccess: (data) => { if (data.pdfUrl) window.open(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${data.pdfUrl}`, '_blank'); queryClient.invalidateQueries({ queryKey: ['hiring-step-records', apiPath, candidateId] }); },
  });

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP {step} · ONBOARDING</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">{title.toUpperCase()}</h1>
            {candidate && <p className="mt-1 text-[12px] text-slate-500">{candidate.firstName} {candidate.lastName} · {candidate.jobRole}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <StepGate unlocked={!locked} blockedBy={stepState?.gate?.blockedBy || []} compact />
            <Button variant="ghost" className="h-8 gap-2 px-3 text-xs border border-slate-200" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>
              <ArrowLeft size={14} /> Back
            </Button>
          </div>
        </div>
        <div className="mt-3 h-[3px] w-full bg-[#0d3c68] rounded-full" />
      </div>

      <div className="px-4 space-y-4 w-full mx-auto">

        {!locked && (
          <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
            <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
              <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                  <Shield className="h-4 w-4 text-[#0d3c68]" />
                  Policy Details
                </h2>
              </div>
              <div className="p-3 space-y-3">
                <div className="grid gap-4 md:grid-cols-4">
                  <FormField label={`${labelPrefix} Version`}>
                    <FormInput {...register(versionField as any)} placeholder="Version" />
                  </FormField>
                  <FormField label={`${labelPrefix} Title`}>
                    <FormInput {...register(titleField as any)} placeholder="Title" />
                  </FormField>
                  <FormField label="Signer Name" required>
                    <FormInput {...register('signerName' as any, { required: true })} placeholder="Signer Name" />
                  </FormField>
                  <FormField label="Signer Designation">
                    <FormInput {...register('signerDesignation' as any)} placeholder="Signer Designation" />
                  </FormField>
                </div>
                <div className="pt-2">
                  <FormField label={`${labelPrefix} Content Snapshot`}>
                    <FormTextarea {...register(contentField as any)} rows={3} placeholder={`Paste or type the ${labelPrefix} content — this snapshot will be frozen in the PDF.`} />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Acknowledgement Checkboxes */}
            <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
              <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                  <CheckCircle2 className="h-4 w-4 text-[#0d3c68]" />
                  Acknowledgement
                </h2>
              </div>
              <div className="p-3 space-y-3">
                <p className="text-xs text-zinc-500">All checkboxes must be confirmed before saving.</p>
                {[
                  ['hasRead', `I have fully read the ${labelPrefix} document.`],
                  ['understands', 'I understand the policies and my responsibilities.'],
                  ['agreesToComply', 'I agree to comply with all stated policies.'],
                  ...(stepKey === 'conductAcceptance' ? [
                    ['understandsConsequences', 'I understand the consequences of non-compliance.'],
                    ['agreesToAbide', 'I agree to abide by the Code of Conduct at all times.'],
                  ] : []),
                ].map(([k, l]) => (
                  <FormCheckbox key={k} {...register(k as any)} label={l} />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#1a1a1a] text-white hover:bg-black shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
              >
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Saving...' : `Record ${title}`}
              </button>
            </div>
          </form>
        )}
        {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
      </div>
    </div>
  );
}

export function ITPolicyPage({ candidateId }: { candidateId: string }) {
  return <PolicyPage candidateId={candidateId} stepKey="itPolicyAcceptance" apiPath="/hiring/it-policy-accept"
    title="IT Policy Acceptance" step={15} color="bg-gradient-to-br from-slate-700 via-slate-600 to-indigo-700"
    contentField="policyContentSnapshot" versionField="policyVersion" titleField="policyTitle" labelPrefix="IT Policy" />;
}

export function CodeOfConductPage({ candidateId }: { candidateId: string }) {
  return <PolicyPage candidateId={candidateId} stepKey="conductAcceptance" apiPath="/hiring/code-of-conduct-accept"
    title="Code of Conduct Acceptance" step={16} color="bg-gradient-to-br from-zinc-700 via-zinc-600 to-slate-700"
    contentField="conductContentSnapshot" versionField="version" titleField="conductTitle" labelPrefix="Code of Conduct" />;
}
