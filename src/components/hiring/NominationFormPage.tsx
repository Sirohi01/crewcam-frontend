'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Save, Trash2, FileText, CheckCircle2, Users, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import { DataTable } from '@/components/shared/DataTable';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-zinc-700 dark:bg-zinc-950';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

export default function NominationFormPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'nomination', candidateId], queryFn: async () => (await api.get(`/hiring/nomination?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'nomination');
  const locked = stepState?.gate?.unlocked === false;

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: { nominationType: '', nominees: [{ name: '', relationship: '', dob: '', sharePercentage: '', isMinor: 'false', guardianName: '', guardianRelationship: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'nominees' });
  const nominees = watch('nominees');
  const totalShare = nominees.reduce((s: number, n: any) => s + (Number(n.sharePercentage) || 0), 0);

  const [saveError, setSaveError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async (values: any) => (await api.post('/hiring/nomination', { ...values, candidateId })).data,
    onSuccess: () => { setSaveError(null); queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'nomination', candidateId] }); queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); },
    onError: (err: any) => { setSaveError(err?.response?.data?.message || 'Failed to save nomination. Please try again.'); },
  });
  const pdfMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/nomination/${id}/generate-pdf`)).data,
    onSuccess: (data) => { const url = data.pdfUrl; if (url) window.open(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${url}`, '_blank'); queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'nomination', candidateId] }); },
  });
  const verifyMutation = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/nomination/${id}/verify`, {})).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'nomination', candidateId] }),
  });

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP 10 · ONBOARDING</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">NOMINATION FORM</h1>
            {candidate && <p className="mt-1 text-[12px] text-slate-500">{candidate.firstName} {candidate.lastName} · {candidate.jobRole}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <StepGate unlocked={!locked} blockedBy={stepState?.gate?.blockedBy || []} compact />
            <Button variant="ghost" className="h-8 gap-2 px-3 text-xs border border-slate-200" onClick={() => router.push(`/company/hiring/${candidateId}`)}>
              <ArrowLeft size={14} /> Back
            </Button>
          </div>
        </div>
        <div className="mt-3 h-[3px] w-full bg-[#0d3c68] rounded-full" />
      </div>

      <div className="px-4 space-y-4">

      {/* Saved Records Table */}
      {records.length > 0 && (
        <div>
            <DataTable
              columns={[
                { key: 'index', label: 'S.NO', render: (_: any, __: any, index: number) => index + 1, width: '60px', align: 'center' as const },
                { key: 'employeeName', label: 'EMPLOYEE NAME', width: '200px', render: () => `${candidate?.firstName || ''} ${candidate?.lastName || ''}` },
                { key: 'designation', label: 'POSITION', width: '150px', render: () => candidate?.jobRole || 'N/A' },
                { key: 'department', label: 'DEPARTMENT', width: '150px', render: () => candidate?.department || 'N/A' },
                { key: 'mobileNumber', label: 'PHONE NUMBER', width: '120px', render: () => candidate?.phone || 'N/A' },
                { key: 'emailId', label: 'EMAIL', width: '200px', render: () => candidate?.email || 'N/A' },
                { key: 'empCode', label: 'EMP CODE', width: '100px', render: () => candidate?.employeeCode || 'N/A' },
                { key: 'nominee1', label: 'NOMINEE 1', width: '150px', render: (_: any, r: any) => r.nominees?.[0]?.name || '-' },
                { key: 'nominee2', label: 'NOMINEE 2', width: '150px', render: (_: any, r: any) => r.nominees?.[1]?.name || '-' },
                { key: 'approvalStatus', label: 'VERIFICATION', width: '130px', align: 'center' as const, render: (_: any, r: any) => <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${r.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{r.status}</span> },
                { key: 'status', label: 'STATUS', width: '100px', align: 'center' as const, render: () => <span className="rounded px-2 py-1 text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">ACTIVE</span> },
                { key: 'updatedAt', label: 'LAST UPDATE', width: '150px', render: (_: any, r: any) => r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'N/A' },
                { key: 'actions', label: 'ACTION', align: 'center' as const, render: (_: any, r: any) => (
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); pdfMutation.mutate(r._id); }}><FileText size={10} /> PDF</Button>
                    {r.status !== 'Verified' && <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-[10px] text-emerald-600 border-emerald-200" onClick={(e) => { e.stopPropagation(); verifyMutation.mutate(r._id); }}><CheckCircle2 size={10} /> Verify</Button>}
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
                <Users size={16} className="text-violet-600" /><h3 className="text-sm font-semibold">Nomination Details</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <label><span className={lbl}>Nomination Type<span className="text-rose-500 ml-0.5">*</span></span>
                  <select {...register('nominationType', { required: true })} className={inp}>
                    <option value="">Select...</option>
                    {['PF', 'Gratuity', 'Insurance'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label><span className={lbl}>Declaration Date</span><input {...register('declarationDate' as any)} type="date" className={inp} /></label>
                <label><span className={lbl}>Declaration Place</span><input {...register('declarationPlace' as any)} className={inp} /></label>
                <label><span className={lbl}>Witness Name</span><input {...register('witnessName' as any)} className={inp} /></label>
                <label><span className={lbl}>Witness Designation</span><input {...register('witnessDesignation' as any)} className={inp} /></label>
              </div>
            </CardContent>
          </Card>

          {/* Share Validation Banner */}
          <div className={`rounded-lg p-3 text-sm flex items-center gap-2 ${totalShare === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : totalShare > 100 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            {totalShare === 100 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            Total share allocated: <strong>{totalShare}%</strong> {totalShare !== 100 && `— must equal 100%`}
          </div>

          {/* Nominees */}
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Nominees</CardTitle>
              <Button type="button" variant="outline" size="sm" className="gap-1 h-7" onClick={() => append({ name: '', relationship: '', dob: '', sharePercentage: '', isMinor: 'false', guardianName: '', guardianRelationship: '' } as any)}>
                <Plus size={13} /> Add Nominee
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, i) => {
                const isMinor = nominees[i]?.isMinor === 'true';
                return (
                  <div key={f.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 relative">
                    <div className="text-xs font-semibold text-zinc-500 mb-2">Nominee {i + 1}</div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <label><span className={lbl}>Name*</span><input {...register(`nominees.${i}.name` as any, { required: true })} className={inp} /></label>
                      <label><span className={lbl}>Relationship*</span><input {...register(`nominees.${i}.relationship` as any, { required: true })} className={inp} /></label>
                      <label><span className={lbl}>Date of Birth</span><input {...register(`nominees.${i}.dob` as any)} type="date" className={inp} /></label>
                      <label><span className={lbl}>Share %*</span><input {...register(`nominees.${i}.sharePercentage` as any, { required: true })} type="number" min={0} max={100} className={inp} /></label>
                      <label><span className={lbl}>Is Minor?</span>
                        <select {...register(`nominees.${i}.isMinor` as any)} className={inp}>
                          <option value="false">No</option><option value="true">Yes</option>
                        </select>
                      </label>
                      <label><span className={lbl}>Address</span><input {...register(`nominees.${i}.address` as any)} className={inp} /></label>
                      {isMinor && (<>
                        <label><span className={lbl}>Guardian Name</span><input {...register(`nominees.${i}.guardianName` as any)} className={inp} /></label>
                        <label><span className={lbl}>Guardian Relationship</span><input {...register(`nominees.${i}.guardianRelationship` as any)} className={inp} /></label>
                        <label><span className={lbl}>Guardian Address</span><input {...register(`nominees.${i}.guardianAddress` as any)} className={inp} /></label>
                      </>)}
                    </div>
                    {fields.length > 1 && <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 text-rose-500" onClick={() => remove(i)}><Trash2 size={13} /></Button>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Button type="submit" disabled={saveMutation.isPending || totalShare !== 100} className="gap-2 bg-violet-600 hover:bg-violet-700 text-white w-full">
            <Save size={16} /> {saveMutation.isPending ? 'Saving...' : 'Save Nomination Form'}
          </Button>
          {totalShare !== 100 && <p className="text-xs text-center text-rose-600">Share percentages must total 100% before saving.</p>}
          {saveError && <p className="text-xs text-center text-rose-600 mt-1">{saveError}</p>}
        </form>
      )}
      {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
      </div>
    </div>
  );
}
