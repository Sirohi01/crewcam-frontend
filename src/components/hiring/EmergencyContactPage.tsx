'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, Heart } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import StepGate from './StepGate';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';

export default function EmergencyContactPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'emergency-contact', candidateId], queryFn: async () => (await api.get(`/hiring/emergency-contact?candidateId=${candidateId}`)).data });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'emergencyContact');
  const locked = stepState?.gate?.unlocked === false;

  const { register, control, handleSubmit } = useForm({
    defaultValues: { contacts: [{ isPrimary: 'true', name: '', relationship: '', phone: '', alternatePhone: '', email: '', address: '' }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });

  const saveMutation = useMutation({
    mutationFn: async (v: any) => (await api.post('/hiring/emergency-contact', { ...v, candidateId })).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'emergency-contact', candidateId] }); queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); },
  });
  const verifyMutation = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/emergency-contact/${id}/verify`, {})).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'emergency-contact', candidateId] }),
  });

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP 12 · ONBOARDING</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">EMERGENCY CONTACT DETAILS</h1>
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

      {records.length > 0 && (
        <div>
            <DataTable
              columns={[
                { key: 'index', label: 'S.NO', render: (_: any, __: any, idx: number) => idx + 1, width: '60px', align: 'center' as const },
                { key: 'employeeName', label: 'EMPLOYEE NAME', width: '180px', render: () => `${candidate?.firstName || ''} ${candidate?.lastName || ''}` },
                { key: 'designation', label: 'POSITION', width: '150px', render: () => candidate?.jobRole || 'N/A' },
                { key: 'primaryContact', label: 'EMERGENCY CONTACT', width: '180px', render: (_: any, r: any) => r.contacts?.find((c: any) => c.isPrimary)?.name || 'N/A' },
                { key: 'primaryPhone', label: 'CONTACT NO.', width: '130px', render: (_: any, r: any) => r.contacts?.find((c: any) => c.isPrimary)?.phone || 'N/A' },
                { key: 'empCode', label: 'EMP CODE', width: '100px', render: () => candidate?.employeeCode || 'N/A' },
                { key: 'bloodGroup', label: 'BLOOD GROUP', width: '100px', align: 'center' as const, render: (_: any, r: any) => r.medicalInfo?.bloodGroup || '—' },
                { key: 'status', label: 'STATUS', width: '120px', align: 'center' as const, render: (s: any) => <span className={`rounded-[3px] border px-2.5 py-0.5 text-[10px] font-bold uppercase ${s === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{s || 'Pending'}</span> },
                { key: 'updatedAt', label: 'LAST UPDATE', width: '150px', render: (_: any, r: any) => r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-GB') : 'N/A' },
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
          {/* Emergency Contacts */}
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Heart size={15} className="text-rose-500" /> Emergency Contacts</CardTitle>
              <Button type="button" variant="outline" size="sm" className="gap-1 h-7" onClick={() => append({ isPrimary: 'false', name: '', relationship: '', phone: '', alternatePhone: '', email: '', address: '' } as any)}>
                <Plus size={13} /> Add Contact
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-zinc-500">Contact {i + 1}</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input {...register(`contacts.${i}.isPrimary` as any)} type="checkbox" value="true" className="h-3.5 w-3.5" />
                      <span className="text-xs text-zinc-600">Primary</span>
                    </label>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    {[['name','Name*','text'],['relationship','Relationship*','text'],['phone','Phone*','text'],['alternatePhone','Alternate Phone','text'],['email','Email','text'],['address','Address','text']].map(([k,l,t]) => (
                      <label key={k}><span className={lbl}>{l}</span><input {...register(`contacts.${i}.${k}` as any)} type={t} className={inp} /></label>
                    ))}
                  </div>
                  {fields.length > 1 && <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 text-rose-500" onClick={() => remove(i)}><Trash2 size={13} /></Button>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Medical Info */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <Heart size={15} className="text-rose-500" /><h3 className="text-sm font-semibold">Medical Information</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label><span className={lbl}>Blood Group</span>
                  <select {...register('medicalInfo.bloodGroup' as any)} className={inp}>
                    <option value="">Select...</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label><span className={lbl}>Insurance Policy No.</span><input {...register('medicalInfo.insurancePolicyNumber' as any)} className={inp} /></label>
                <label className="md:col-span-2"><span className={lbl}>Known Allergies</span><textarea {...register('medicalInfo.knownAllergies' as any)} rows={2} className={inp} /></label>
                <label className="md:col-span-2"><span className={lbl}>Chronic Conditions</span><textarea {...register('medicalInfo.chronicConditions' as any)} rows={2} className={inp} /></label>
                <label><span className={lbl}>Current Medications</span><input {...register('medicalInfo.currentMedications' as any)} className={inp} /></label>
                <label><span className={lbl}>Doctor's Name</span><input {...register('medicalInfo.doctorName' as any)} className={inp} /></label>
                <label><span className={lbl}>Doctor's Phone</span><input {...register('medicalInfo.doctorPhone' as any)} className={inp} /></label>
                <label><span className={lbl}>Preferred Hospital</span><input {...register('medicalInfo.hospitalPreference' as any)} className={inp} /></label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saveMutation.isPending} className="w-full gap-2 bg-rose-600 hover:bg-rose-700 text-white">
            <Save size={16} /> {saveMutation.isPending ? 'Saving...' : 'Save Emergency Contact Details'}
          </Button>
        </form>
      )}
      {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
      </div>
    </div>
  );
}
