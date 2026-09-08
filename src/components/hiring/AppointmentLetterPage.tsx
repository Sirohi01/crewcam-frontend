'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, FileText, Briefcase, Clock, FileSignature, Wallet, UserCheck } from 'lucide-react';
import api from '@/lib/axios';
import { FormField, FormInput, FormSelect, FormTextarea } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import toast from 'react-hot-toast';
=======
import StepGate from './StepGate';
import { DataTable } from '@/components/shared/DataTable';
import { HiringStepLayout } from './HiringStepLayout';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';
import { useMasterDataStore } from '@/store/masterDataStore';

const inp = 'w-full h-[38px] rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';
>>>>>>> 7851ce0e735311be5718e4055267c415b5c74ce5

export default function AppointmentLetterPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { departments, designations, locations, fetchMasterData, isLoaded } = useMasterDataStore();

  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records = [] } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId], queryFn: async () => (await api.get(`/hiring/appointment-letter?candidateId=${candidateId}`)).data });
  const { data: offerLetterData } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'offer-letter', candidateId], queryFn: async () => { const res = await api.get(`/hiring/offer-letter?candidateId=${candidateId}`); return Array.isArray(res.data) ? res.data : (res.data?.data || []); } });
  const { data: selectionData } = useQuery<any[]>({ queryKey: ['hiring-step-records', 'selection-approval', candidateId], queryFn: async () => { const res = await api.get('/hiring/selection-approval', { params: { candidateId } }); return Array.isArray(res.data) ? res.data : (res.data?.data || []); } });

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'appointmentLetter');
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm();

  const currentDesignation = watch('designation');
  const currentDepartmentName = watch('departmentName');
  const currentWorkLocation = watch('workLocation');

  const DAYS_OPTIONS = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  useEffect(() => {
    if (records.length > 0) {
      const latest = records[0];
      let start = '', end = '';
      if (latest.workingHours) {
        [start, end] = latest.workingHours.split(' - ');
      }
      reset({
        ...latest,
        joiningDate: latest.joiningDate ? new Date(latest.joiningDate).toISOString().split('T')[0] : '',
        workingHoursStart: start || '',
        workingHoursEnd: end || '',
        workingDays: Array.isArray(latest.workingDays) ? latest.workingDays : (latest.workingDays ? latest.workingDays.split(', ') : []),
        weeklyOff: Array.isArray(latest.weeklyOff) ? latest.weeklyOff : (latest.weeklyOff ? latest.weeklyOff.split(', ') : ['Sunday']),
      });
    } else {
      let defaultData: any = {};

      const sel = selectionData && selectionData.length > 0 ? selectionData[0] : null;
      const ol = offerLetterData && offerLetterData.length > 0 ? offerLetterData[0] : null;

      // Extract from Selection Approval first
      if (sel) {
        defaultData.designation = sel.designation || '';
        defaultData.departmentName = sel.department || '';
        defaultData.workLocation = sel.workLocation || '';
        defaultData.reportingTo = sel.reportingTo || '';
        defaultData.ctc = sel.proposedAnnualCTC || '';
        if (sel.dateOfJoining || sel.joiningDate) {
          defaultData.joiningDate = new Date(sel.dateOfJoining || sel.joiningDate).toISOString().split('T')[0];
        }
      }

      // Override with Offer Letter if available
      if (ol) {
        if (ol.designation) defaultData.designation = ol.designation;
        if (ol.department) defaultData.departmentName = ol.department;
        if (ol.reportingTo) defaultData.reportingTo = ol.reportingTo;
        if (ol.location) defaultData.workLocation = ol.location;
        if (ol.joiningDate) defaultData.joiningDate = new Date(ol.joiningDate).toISOString().split('T')[0];
        if (ol.annualCTC) defaultData.ctc = ol.annualCTC;
        if (ol.workScheduleDays) {
          defaultData.workingDays = ol.workScheduleDays.split(', ');
        }
        if (ol.workScheduleTimeStart) defaultData.workingHoursStart = ol.workScheduleTimeStart;
        if (ol.workScheduleTimeEnd) defaultData.workingHoursEnd = ol.workScheduleTimeEnd;
      }

      defaultData.probationPeriodMonths = defaultData.probationPeriodMonths || 6;
      defaultData.weeklyOff = defaultData.weeklyOff || ['Sunday'];

      // Fallback to Candidate details
      if (candidate) {
        if (!defaultData.designation) defaultData.designation = candidate.jobRole || '';
        if (!defaultData.departmentName) defaultData.departmentName = candidate.departmentId?.name || candidate.department || '';
      }

      reset(defaultData);
    }
  }, [records, offerLetterData, selectionData, candidate, reset, isLoaded]);

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      const { _id, createdAt, updatedAt, __v, status, issuedDate, acknowledgedDate, workingHoursStart, workingHoursEnd, ...submitData } = v;
      
      const payload = {
        ...submitData,
        candidateId,
        workingDays: Array.isArray(v.workingDays) ? v.workingDays.join(', ') : v.workingDays,
        weeklyOff: Array.isArray(v.weeklyOff) ? v.weeklyOff.join(', ') : v.weeklyOff,
        workingHours: workingHoursStart && workingHoursEnd ? `${workingHoursStart} - ${workingHoursEnd}` : (workingHoursStart || ''),
      };

      if (_id) {
        return (await api.put(`/hiring/appointment-letter/${_id}`, payload)).data;
      }
      return (await api.post('/hiring/appointment-letter', payload)).data;
    },
<<<<<<< HEAD
    onSuccess: () => { 
      toast.success('Appointment letter saved successfully');
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] }); 
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] }); 
=======
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'appointment-letter', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
>>>>>>> 7851ce0e735311be5718e4055267c415b5c74ce5
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
<<<<<<< HEAD
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
=======
        <CardContent className="p-0">
          <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-0">
            <div className="grid lg:grid-cols-[1fr_300px] divide-x divide-slate-100">
              {/* LEFT COLUMN */}
              <div className="p-6 space-y-8 bg-white">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">1</span>
                    Role & Department
                  </h3>
                  <div className="grid gap-3 md:grid-cols-4">
                    <label>
                      <span className={lbl}>Designation*</span>
                      <select {...register('designation', { required: 'Required' })} className={inp}>
                        <option value="">Select Designation</option>
                        {currentDesignation && !designations.find((d: any) => d.name === currentDesignation) && (
                          <option value={currentDesignation}>{currentDesignation}</option>
                        )}
                        {designations.map((d: any) => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
                      </select>
                      {errors.designation && <p className="text-xs text-rose-600 mt-1">{errors.designation.message as string}</p>}
                    </label>
                    <label>
                      <span className={lbl}>Department</span>
                      <select {...register('departmentName')} className={inp}>
                        <option value="">Select Department</option>
                        {currentDepartmentName && !departments.find((d: any) => d.name === currentDepartmentName) && (
                          <option value={currentDepartmentName}>{currentDepartmentName}</option>
                        )}
                        {departments.map((d: any) => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
                      </select>
                    </label>
                    <label><span className={lbl}>Reporting To</span><input {...register('reportingTo')} className={inp} placeholder="Reporting To" /></label>
                    <label>
                      <span className={lbl}>Work Location</span>
                      <select {...register('workLocation')} className={inp}>
                        <option value="">Select Location</option>
                        {currentWorkLocation && !locations.find((d: any) => d.name === currentWorkLocation) && (
                          <option value={currentWorkLocation}>{currentWorkLocation}</option>
                        )}
                        {locations.map((d: any) => <option key={d._id || d.name} value={d.name}>{d.name}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">2</span>
                    Joining & Probation
                  </h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label><span className={lbl}>Joining Date</span><input {...register('joiningDate')} type="date" className={inp} /></label>
                    <label><span className={lbl}>Probation (months)</span><input {...register('probationPeriodMonths')} type="number" className={inp} defaultValue={6} /></label>
                    <label><span className={lbl}>Payment Mode</span>
                      <select {...register('paymentMode')} className={inp}>
                        <option value="">Select...</option>
                        {['Bank Transfer', 'Cheque', 'Cash'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">3</span>
                    Compensation (CTC)
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label><span className={lbl}>Annual CTC (₹)</span><input {...register('ctc')} type="number" className={inp} placeholder="500000" /></label>
                    <label><span className={lbl}>CTC In Words</span><input {...register('ctcInWords')} className={inp} placeholder="Three Lakhs Per Annum" /></label>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">4</span>
                    Working Hours
                  </h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label>
                      <span className={lbl}>Working Hours</span>
                      <div className="flex items-center gap-2">
                        <input type="time" {...register('workingHoursStart')} className={inp} style={{ padding: '0 8px' }} />
                        <span className="text-slate-500 text-xs">to</span>
                        <input type="time" {...register('workingHoursEnd')} className={inp} style={{ padding: '0 8px' }} />
                      </div>
                    </label>
                    <label>
                      <span className={lbl}>Working Days</span>
                      <Controller
                        name="workingDays"
                        control={control}
                        render={({ field }) => (
                          <MultiSearchableDropdown
                            options={DAYS_OPTIONS}
                            values={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select days..."
                            className="bg-white border-zinc-200"
                          />
                        )}
                      />
                    </label>
                    <label>
                      <span className={lbl}>Weekly Off</span>
                      <Controller
                        name="weeklyOff"
                        control={control}
                        render={({ field }) => (
                          <MultiSearchableDropdown
                            options={DAYS_OPTIONS}
                            values={field.value || []}
                            onChange={field.onChange}
                            placeholder="Select days..."
                            className="bg-white border-zinc-200"
                          />
                        )}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="p-6 bg-slate-50 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4 uppercase tracking-wide">Letter Content</h3>
                  <textarea {...register('letterContent')} className={inp.replace('h-[38px]', 'h-64 min-h-[250px] p-3') + " text-xs resize-y"} placeholder="Enter the full appointment letter body. This content will be preserved in the PDF even if candidate details change later." />
                </div>

                <div className="flex flex-col justify-start items-stretch gap-2 pt-6">
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="flex items-center justify-center gap-2 px-8 py-2 text-xs font-bold bg-[#1a1a1a] text-white hover:bg-black shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? 'Saving...' : 'Save Step Record'}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/appointment-letter`, '_blank')}
                    className="flex items-center justify-center gap-2 px-8 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[4px] tracking-wide"
                  >
                    PRINT REVIEW & PRINT
                  </button>
                </div>
              </div>
            </div>
          </form>
>>>>>>> 7851ce0e735311be5718e4055267c415b5c74ce5
        </CardContent>
      </Card>
    </HiringStepLayout>
  );
}
