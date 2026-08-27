'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, FileText, CheckCircle2, Briefcase } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import { DataTable } from '@/components/shared/DataTable';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

export default function AppointmentLetterPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId], queryFn: async () => (await api.get(`/hiring/appointment-letter?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'appointmentLetter');
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (records.length > 0) {
      const latest = records[0];
      reset({
        ...latest,
        joiningDate: latest.joiningDate ? new Date(latest.joiningDate).toISOString().split('T')[0] : '',
      });
    }
  }, [records, reset]);

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      const { _id, createdAt, updatedAt, __v, status, issuedDate, acknowledgedDate, ...submitData } = v;
      if (_id) {
        return (await api.put(`/hiring/appointment-letter/${_id}`, { ...submitData, candidateId })).data;
      }
      return (await api.post('/hiring/appointment-letter', { ...submitData, candidateId })).data;
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] }); 
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); 
      setTimeout(() => {
        router.push('/dashboard/hiring/steps/appointment-letter');
      }, 500);
    },
  });
  const pdfMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/appointment-letter/${id}/generate-pdf`)).data,
    onSuccess: (data) => { if (data.pdfUrl) window.open(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${data.pdfUrl}`, '_blank'); queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] }); },
  });
  const ackMutation = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/appointment-letter/${id}/acknowledge`, {})).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] }),
  });

  const Section = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 mb-3 dark:border-zinc-800">
      <Briefcase size={14} className="text-amber-600" />
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
    </div>
  );

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP 17 · OFFER &amp; LEGAL</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">APPOINTMENT LETTER</h1>
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
            <Card>
              <CardContent className="pt-5 space-y-4">
                <Section title="Role & Department" />
                <div className="grid gap-3 md:grid-cols-4">
                  <label><span className={lbl}>Designation*</span><input {...register('designation', { required: 'Required' })} className={inp} placeholder="e.g. Frontend Developer" />{errors.designation && <p className="text-xs text-rose-600 mt-1">{errors.designation.message as string}</p>}</label>
                  <label><span className={lbl}>Department</span><input {...register('departmentName')} className={inp} placeholder="e.g. Engineering" /></label>
                  <label><span className={lbl}>Reporting To</span><input {...register('reportingTo')} className={inp} placeholder="e.g. John Doe" /></label>
                  <label><span className={lbl}>Work Location</span><input {...register('workLocation')} className={inp} placeholder="e.g. Remote" /></label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 space-y-4">
                <Section title="Joining & Probation" />
                <div className="grid gap-3 md:grid-cols-3">
                  <label><span className={lbl}>Joining Date</span><input {...register('joiningDate')} type="date" className={inp} /></label>
                  <label><span className={lbl}>Probation (months)</span><input {...register('probationPeriodMonths')} type="number" className={inp} defaultValue={6} /></label>
                  <label><span className={lbl}>Payment Mode</span>
                    <select {...register('paymentMode')} className="w-full h-[38px] rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950">
                      <option value="">Select...</option>
                      {['Bank Transfer', 'Cheque', 'Cash'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 space-y-4">
                <Section title="Compensation (CTC)" />
                <div className="grid gap-3 md:grid-cols-2">
                  <label><span className={lbl}>Annual CTC (₹)</span><input {...register('ctc')} type="number" className={inp} placeholder="e.g. 500000" /></label>
                  <label><span className={lbl}>CTC In Words</span><input {...register('ctcInWords')} className={inp} placeholder="e.g. Three Lakhs Per Annum" /></label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 space-y-4">
                <Section title="Working Hours" />
                <div className="grid gap-3 md:grid-cols-3">
                  <label><span className={lbl}>Working Hours</span><input {...register('workingHours')} className={inp} placeholder="e.g. 9:00 AM – 6:00 PM" /></label>
                  <label><span className={lbl}>Working Days</span><input {...register('workingDays')} className={inp} placeholder="e.g. Mon–Sat" /></label>
                  <label><span className={lbl}>Weekly Off</span><input {...register('weeklyOff')} className={inp} placeholder="e.g. Sunday" /></label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 space-y-4">
                <Section title="Letter Content" />
                <textarea {...register('letterContent')} rows={4} className={inp} placeholder="Enter the full appointment letter body. This content will be preserved in the PDF even if candidate details change later." />
              </CardContent>
            </Card>

            <div className='flex justify-end my-6'>
              <Button type="submit" disabled={saveMutation.isPending} className="px-4 py-1.5  bg-amber-600 hover:bg-amber-700 text-white">
                <Save size={16} /> {saveMutation.isPending ? 'Saving...' : 'Save Appointment Letter'}
              </Button>
            </div>
          </form>
        )}
        {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
      </div>
    </div>
  );
}
