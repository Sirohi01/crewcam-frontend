'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, FileText, CheckCircle2, CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import { DataTable } from '@/components/shared/DataTable';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-zinc-700 dark:bg-zinc-950';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

export default function BankPayrollPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'bank-payroll', candidateId], queryFn: async () => (await api.get(`/hiring/bank-payroll?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'bankPayrollInfo');
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, formState: { errors } } = useForm();

  const saveMutation = useMutation({
    mutationFn: async (v: any) => (await api.post('/hiring/bank-payroll', { ...v, candidateId })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'bank-payroll', candidateId] }); queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); },
  });
  const pdfMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/bank-payroll/${id}/generate-pdf`)).data,
    onSuccess: (data) => { if (data.pdfUrl) window.open(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${data.pdfUrl}`, '_blank'); queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'bank-payroll', candidateId] }); },
  });
  const verifyMutation = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/bank-payroll/${id}/verify`, {})).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'bank-payroll', candidateId] }),
  });

  const Section = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
      <Icon size={15} className="text-blue-600" />
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
    </div>
  );

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP 11 · ONBOARDING</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">BANK &amp; PAYROLL FORM</h1>
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
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-800">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        Account number, PAN and Aadhaar are encrypted at rest. They are masked in list view — full values are accessible only through authorized PDF actions.
      </div>

      {records.length > 0 && (
        <div>
            <DataTable
              columns={[
                { key: 'index', label: 'S.NO', render: (_: any, __: any, index: number) => index + 1, width: '60px', align: 'center' as const },
                { key: 'employeeName', label: 'EMPLOYEE NAME', width: '180px', render: () => `${candidate?.firstName || ''} ${candidate?.lastName || ''}` },
                { key: 'empCode', label: 'EMPLOYEE CODE', width: '120px', render: () => candidate?.employeeCode || 'N/A' },
                { key: 'designation', label: 'POSITION', width: '150px', render: () => candidate?.jobRole || 'N/A' },
                { key: 'bankName', label: 'BANK NAME', width: '150px' },
                { key: 'accountNumber', label: 'ACCOUNT NO.', width: '140px' },
                { key: 'approvalStatus', label: 'VERIFICATION', width: '130px', align: 'center' as const, render: (_: any, r: any) => <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${r.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{r.status}</span> },
                { key: 'status', label: 'STATUS', width: '130px', align: 'center' as const, render: () => <span className="rounded px-2 py-1 text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">ACTIVE</span> },
                { key: 'updatedAt', label: 'LAST UPDATE', width: '160px', render: (_: any, r: any) => r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'N/A' },
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
          {/* Bank Account */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <Section title="Bank Account Details" icon={CreditCard} />
              <div className="grid gap-3 md:grid-cols-2">
                <label><span className={lbl}>Bank Name*</span><input {...register('bankName', { required: 'Required' })} className={inp} />{errors.bankName && <p className="text-xs text-rose-600 mt-1">{errors.bankName.message as string}</p>}</label>
                <label><span className={lbl}>Account Holder Name*</span><input {...register('accountHolderName', { required: 'Required' })} className={inp} /></label>
                <label><span className={lbl}>Account Number*</span><input {...register('accountNumber', { required: 'Required' })} className={inp} /></label>
                <label><span className={lbl}>IFSC Code*</span><input {...register('ifscCode', { required: 'Required' })} className={inp} /></label>
                <label><span className={lbl}>Branch Name</span><input {...register('branchName')} className={inp} /></label>
                <label><span className={lbl}>MICR Code</span><input {...register('micrCode')} className={inp} /></label>
                <label><span className={lbl}>Account Type</span>
                  <select {...register('accountType')} className={inp}>
                    <option value="">Select...</option>
                    <option>Savings</option><option>Current</option>
                  </select>
                </label>
                <label><span className={lbl}>Payment Mode</span>
                  <select {...register('paymentMode')} className={inp}>
                    <option value="">Select...</option>
                    {['Bank Transfer', 'Cheque', 'Cash'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Statutory IDs */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <Section title="Statutory Identifiers" icon={ShieldCheck} />
              <div className="grid gap-3 md:grid-cols-2">
                <label><span className={lbl}>PAN Number</span><input {...register('panNumber')} className={inp} placeholder="ABCDE1234F" /></label>
                <label><span className={lbl}>Aadhaar Number</span><input {...register('aadhaarNumber')} className={inp} placeholder="XXXX XXXX XXXX" /></label>
                <label><span className={lbl}>UAN Number</span><input {...register('uanNumber')} className={inp} /></label>
                <label><span className={lbl}>PF Account Number</span><input {...register('pfAccountNumber')} className={inp} /></label>
                <label><span className={lbl}>ESI Number</span><input {...register('esiNumber')} className={inp} /></label>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Flags */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <Section title="Payroll Applicability" icon={ShieldCheck} />
              <div className="grid gap-3 md:grid-cols-4">
                {[['pfApplicable', 'PF Applicable'], ['esiApplicable', 'ESI Applicable'], ['ptApplicable', 'Professional Tax'], ['lwfApplicable', 'Labour Welfare Fund']].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input {...register(k as any)} type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-indigo-600" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{l}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HR Verification */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <Section title="HR Verification" icon={CheckCircle2} />
              <div className="grid gap-3 md:grid-cols-2">
                <label><span className={lbl}>HR Verified By</span><input {...register('hrVerifiedBy')} className={inp} /></label>
                <label className="md:col-span-2"><span className={lbl}>HR Remarks</span><textarea {...register('hrRemarks')} rows={2} className={inp} /></label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saveMutation.isPending} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Save size={16} /> {saveMutation.isPending ? 'Saving...' : 'Save Bank & Payroll Information'}
          </Button>
        </form>
      )}
      {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
      </div>
    </div>
  );
}
