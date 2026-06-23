'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, FileText, CheckCircle2, Shield } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

function PolicyPage({ candidateId, stepKey, apiPath, title, step, color, contentField, versionField, titleField }:
  { candidateId: string; stepKey: string; apiPath: string; title: string; step: number; color: string; contentField: string; versionField: string; titleField: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', apiPath, candidateId], queryFn: async () => (await api.get(`${apiPath}?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === stepKey);
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit } = useForm({
    defaultValues: { hasRead: false, understands: false, agreesToComply: false, understandsConsequences: false, agreesToAbide: false }
  });

  const saveMutation = useMutation({
    mutationFn: async (v: any) => (await api.post(apiPath, { ...v, candidateId, status: 'Accepted', acceptedAt: new Date(), ipAddress: 'client' })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hiring-step-records', apiPath, candidateId] }); queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); },
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

      <div className="px-4 space-y-4 max-w-3xl mx-auto">

      {records.length > 0 && (
        <div>
            <DataTable
              columns={[
                { key: 'index', label: 'S.NO', render: (_: any, __: any, idx: number) => idx + 1, width: '60px', align: 'center' as const },
                { key: 'employeeName', label: 'EMPLOYEE NAME', width: '180px', render: () => `${candidate?.firstName || ''} ${candidate?.lastName || ''}` },
                { key: 'designation', label: 'POSITION', width: '150px', render: () => candidate?.jobRole || 'N/A' },
                { key: 'signerName', label: 'SIGNER NAME', width: '160px', render: (_: any, r: any) => r.signerName || 'N/A' },
                { key: 'acceptedAt', label: 'ACCEPTED ON', width: '140px', render: (_: any, r: any) => r.acceptedAt ? new Date(r.acceptedAt).toLocaleDateString('en-GB') : 'N/A' },
                { key: 'status', label: 'STATUS', width: '120px', align: 'center' as const, render: (s: any) => <span className="rounded-[3px] border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-700">{s || 'Accepted'}</span> },
                { key: 'actions', label: 'ACTION', align: 'center' as const, render: (_: any, r: any) => (
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); pdfMutation.mutate(r._id); }}><FileText size={10} /> PDF</Button>
                  </div>
                )}
              ]}
              data={records}
              showActions={false}
              showPrint={false}
              pageSize={5}
            />
        </div>
      )}

      {!locked && (
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <Shield size={15} className="text-indigo-600" /><h3 className="text-sm font-semibold">Policy Details</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label><span className={lbl}>Version</span><input {...register(versionField as any)} className={inp} /></label>
                <label><span className={lbl}>Title</span><input {...register(titleField as any)} className={inp} /></label>
                <label><span className={lbl}>Signer Name*</span><input {...register('signerName' as any, { required: true })} className={inp} /></label>
                <label><span className={lbl}>Signer Designation</span><input {...register('signerDesignation' as any)} className={inp} /></label>
                <label className="md:col-span-2"><span className={lbl}>Policy Content Snapshot</span>
                  <textarea {...register(contentField as any)} rows={6} className={inp} placeholder="Paste or type the policy content — this snapshot will be frozen in the PDF." />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgement Checkboxes */}
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <CheckCircle2 size={15} className="text-emerald-600" /><h3 className="text-sm font-semibold">Acknowledgement</h3>
              </div>
              <p className="text-xs text-zinc-500">All checkboxes must be confirmed before saving.</p>
              {[
                ['hasRead', 'I have fully read the policy document.'],
                ['understands', 'I understand the policies and my responsibilities.'],
                ['agreesToComply', 'I agree to comply with all stated policies.'],
                ...(stepKey === 'conductAcceptance' ? [
                  ['understandsConsequences', 'I understand the consequences of non-compliance.'],
                  ['agreesToAbide', 'I agree to abide by the Code of Conduct at all times.'],
                ] : []),
              ].map(([k, l]) => (
                <label key={k} className="flex items-start gap-2 cursor-pointer">
                  <input {...register(k as any)} type="checkbox" className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{l}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" disabled={saveMutation.isPending} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <CheckCircle2 size={16} /> {saveMutation.isPending ? 'Saving...' : `Record ${title}`}
          </Button>
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
    contentField="policyContentSnapshot" versionField="policyVersion" titleField="policyTitle" />;
}

export function CodeOfConductPage({ candidateId }: { candidateId: string }) {
  return <PolicyPage candidateId={candidateId} stepKey="conductAcceptance" apiPath="/hiring/code-of-conduct-accept"
    title="Code of Conduct Acceptance" step={16} color="bg-gradient-to-br from-zinc-700 via-zinc-600 to-slate-700"
    contentField="conductContentSnapshot" versionField="version" titleField="conductTitle" />;
}
