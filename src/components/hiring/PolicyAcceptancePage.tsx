'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Shield, CheckCircle2, FileText } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { FormField, FormInput, FormTextarea, FormCheckbox } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

function PolicyPage({ candidateId, stepKey, apiPath, title, step, color, contentField, versionField, titleField, labelPrefix = 'Policy' }:
  { candidateId: string; stepKey: string; apiPath: string; title: string; step: number; color: string; contentField: string; versionField: string; titleField: string; labelPrefix?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');
  const queryClient = useQueryClient();

  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', apiPath, candidateId], queryFn: async () => (await api.get(`${apiPath}?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === stepKey);
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { hasRead: false, understands: false, agreesToComply: false, understandsConsequences: false, agreesToAbide: false, [versionField]: '', [titleField]: '', signerName: '', signerDesignation: '', [contentField]: '' } as any
  });

  useEffect(() => {
    let defaultRecord: any = null;
    if (records.length > 0) {
      defaultRecord = editId ? records.find((r: any) => r._id === editId) : records[0];
    }

    if (defaultRecord) {
      reset(defaultRecord);
    } else if (candidate) {
      reset({
        hasRead: false, understands: false, agreesToComply: false, understandsConsequences: false, agreesToAbide: false,
        [versionField]: '', [titleField]: '',
        signerName: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
        signerDesignation: candidate.jobRole || '',
        [contentField]: ''
      });
    }
  }, [editId, records, reset, candidate, versionField, titleField, contentField]);

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      const payload = { ...v, candidateId, status: 'Accepted', acceptedAt: new Date(), ipAddress: 'client' };
      if (editId) {
        return (await api.put(`${apiPath}/${editId}`, payload)).data;
      }
      return (await api.post(apiPath, payload)).data;
    },
    onSuccess: () => { 
      toast.success(`${labelPrefix} accepted successfully`);
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', apiPath, candidateId] }); 
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); 
      setTimeout(() => {
        const stepId = stepKey === 'itPolicyAcceptance' ? 'it-policy-accept' : 'code-of-conduct-accept';
        router.push(`/dashboard/hiring/steps/${stepId}`);
      }, 500);
    },
    onError: () => {
      toast.error(`Failed to record ${labelPrefix} acceptance`);
    }
  });

  const SectionHeader = ({ id, sectionTitle, icon: Icon }: { id: number, sectionTitle: string, icon: any }) => (
    <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-4">
      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
        <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">{id}</span>
        {sectionTitle}
      </h3>
      <Icon className="h-4 w-4 text-slate-300" />
    </div>
  );

  return (
<<<<<<< HEAD
    <HiringStepLayout candidateId={candidateId} stepId={stepKey === 'itPolicyAcceptance' ? 'it-policy-accept' : 'code-of-conduct-accept'}>
      <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-base uppercase">{title.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-hidden">
          {!locked ? (
            <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
              <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                    <Shield className="h-4 w-4 text-[#0d3c68]" />
                    Policy Details
                  </h2>
=======
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
>>>>>>> 7851ce0e735311be5718e4055267c415b5c74ce5
                </div>
                
                <div className="p-3 space-y-4">
                  {/* 1. POLICY DETAILS */}
                  <div className="space-y-4">
                    <SectionHeader id={1} sectionTitle="Policy Details" icon={FileText} />
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

                  {/* 2. ACKNOWLEDGEMENT */}
                  <div className="space-y-4 mt-6">
                    <SectionHeader id={2} sectionTitle="Acknowledgement" icon={CheckCircle2} />
                    <p className="text-xs text-zinc-500 mb-2">All checkboxes must be confirmed before saving.</p>
                    <div className="space-y-3">
                      {[
                        ['hasRead', `I have fully read the ${labelPrefix} document.`],
                        ['understands', 'I understand the policies and my responsibilities.'],
                        ['agreesToComply', 'I agree to comply with all stated policies.'],
                        ...(stepKey === 'conductAcceptance' ? [
                          ['understandsConsequences', 'I understand the consequences of non-compliance.'],
                          ['agreesToAbide', 'I agree to abide by the Code of Conduct at all times.'],
                        ] : []),
                      ].map(([k, l]) => (
                        <FormCheckbox key={k} {...register(k as any)} label={l as string} />
                      ))}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-6">
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/hiring/steps/${stepKey === 'itPolicyAcceptance' ? 'it-policy-accept' : 'code-of-conduct-accept'}`)}
                      className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all rounded-[2px]"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                    >
                      <Save className="h-4 w-4" />
                      {saveMutation.isPending ? 'RECORDING...' : `RECORD ${labelPrefix.toUpperCase()}`}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-sm text-zinc-500 bg-slate-50 mt-4 rounded border border-slate-200">
              This step is locked. Please complete the previous steps.
            </div>
<<<<<<< HEAD
          )}
        </CardContent>
      </Card>
    </HiringStepLayout>
=======

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
      </div>
    </div>
>>>>>>> 7851ce0e735311be5718e4055267c415b5c74ce5
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
