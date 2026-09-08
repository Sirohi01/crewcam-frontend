'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, FileText, Briefcase, Clock, FileSignature, Wallet, UserCheck } from 'lucide-react';
import api from '@/lib/axios';
import { FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function AppointmentLetterPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      toast.success('Appointment letter saved successfully');
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] }); 
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); 
      setTimeout(() => {
        router.push('/dashboard/hiring/steps/appointment-letter');
      }, 500);
    },
    onError: () => {
      toast.error('Failed to save appointment letter');
    }
  });

  const SectionHeader = ({ id, title, icon: Icon }: { id: number, title: string, icon: any }) => (
    <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-4">
      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
        <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">{id}</span>
        {title}
      </h3>
      <Icon className="h-4 w-4 text-slate-300" />
    </div>
  );

  return (
    <HiringStepLayout candidateId={candidateId} stepId="appointment-letter">
      <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-base uppercase">APPOINTMENT LETTER</CardTitle>
        </CardHeader>
        <CardContent className="w-full overflow-hidden">
          {!locked ? (
            <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
              <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                    <FileText className="h-4 w-4 text-[#0d3c68]" />
                    Appointment Details
                  </h2>
                </div>

                <div className="p-3 space-y-4">
                  {/* 1. ROLE & DEPARTMENT */}
                  <div className="space-y-4">
                    <SectionHeader id={1} title="Role & Department" icon={UserCheck} />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField label="Designation*" error={errors.designation?.message as string}>
                        <FormInput {...register('designation', { required: 'Required' })} placeholder="e.g. Frontend Developer" />
                      </FormField>
                      <FormField label="Department">
                        <FormInput {...register('departmentName')} placeholder="e.g. Engineering" />
                      </FormField>
                      <FormField label="Reporting To">
                        <FormInput {...register('reportingTo')} placeholder="e.g. John Doe" />
                      </FormField>
                      <FormField label="Work Location">
                        <FormInput {...register('workLocation')} placeholder="e.g. Remote" />
                      </FormField>
                    </div>
                  </div>

                  {/* 2. JOINING & PROBATION */}
                  <div className="space-y-4 mt-6">
                    <SectionHeader id={2} title="Joining & Probation" icon={Briefcase} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="Joining Date">
                        <FormInput type="date" {...register('joiningDate')} />
                      </FormField>
                      <FormField label="Probation (months)">
                        <FormInput type="number" {...register('probationPeriodMonths')} defaultValue={6} />
                      </FormField>
                      <FormField label="Payment Mode">
                        <FormSelect 
                          {...register('paymentMode')} 
                          options={[
                            { value: 'Bank Transfer', label: 'Bank Transfer' },
                            { value: 'Cheque', label: 'Cheque' },
                            { value: 'Cash', label: 'Cash' }
                          ]} 
                          placeholder="Select..."
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* 3. COMPENSATION */}
                  <div className="space-y-4 mt-6">
                    <SectionHeader id={3} title="Compensation (CTC)" icon={Wallet} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Annual CTC (₹)">
                        <FormInput type="number" {...register('ctc')} placeholder="e.g. 500000" />
                      </FormField>
                      <FormField label="CTC In Words">
                        <FormInput {...register('ctcInWords')} placeholder="e.g. Three Lakhs Per Annum" />
                      </FormField>
                    </div>
                  </div>

                  {/* 4. WORKING HOURS */}
                  <div className="space-y-4 mt-6">
                    <SectionHeader id={4} title="Working Hours" icon={Clock} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField label="Working Hours">
                        <FormInput {...register('workingHours')} placeholder="e.g. 9:00 AM – 6:00 PM" />
                      </FormField>
                      <FormField label="Working Days">
                        <FormInput {...register('workingDays')} placeholder="e.g. Mon–Sat" />
                      </FormField>
                      <FormField label="Weekly Off">
                        <FormInput {...register('weeklyOff')} placeholder="e.g. Sunday" />
                      </FormField>
                    </div>
                  </div>

                  {/* 5. LETTER CONTENT */}
                  <div className="space-y-4 mt-6">
                    <SectionHeader id={5} title="Letter Content" icon={FileSignature} />
                    <div className="grid grid-cols-1 gap-4">
                      <FormField label="Full Letter Body">
                        <FormTextarea 
                          {...register('letterContent')} 
                          rows={6} 
                          placeholder="Enter the full appointment letter body. This content will be preserved in the PDF even if candidate details change later." 
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-6">
                    <button
                      type="button"
                      onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/appointment-letter`, '_blank')}
                      className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all rounded-[2px]"
                    >
                      PRINT
                    </button>
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                    >
                      <Save className="h-4 w-4" />
                      {saveMutation.isPending ? 'SAVING...' : 'SAVE DETAILS'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-8 text-center text-sm text-zinc-500 bg-slate-50 mt-4 rounded border border-slate-200">
              This step is locked. Please complete the previous steps.
            </div>
          )}
        </CardContent>
      </Card>
    </HiringStepLayout>
  );
}
