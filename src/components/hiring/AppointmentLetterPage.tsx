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
import toast from 'react-hot-toast';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';
import { useMasterDataStore } from '@/store/masterDataStore';
import { formatEmployeeId } from '@/lib/utils';

const inp = 'w-full h-8 rounded-[2px] border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]';
const lbl = 'block text-[11px] font-bold text-slate-700 uppercase tracking-tight mb-1';

export default function AppointmentLetterPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { departments, designations, locations, fetchMasterData, isLoaded } = useMasterDataStore();

  const { data: candidate } = useQuery<any>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
    enabled: !!candidateId,
  });
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
        employeeCode: formatEmployeeId(latest.employeeCode || latest.empCode || latest.uniqueId || latest.candidateCode || candidate?.employeeCode || candidate?.uniqueId || candidate?.candidateCode || ''),
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
        defaultData.employeeCode = formatEmployeeId(candidate.employeeCode || candidate.uniqueId || candidate.candidateCode || '');
      }

      reset(defaultData);
    }
  }, [records, offerLetterData, selectionData, candidate, reset, isLoaded]);

  const saveMutation = useMutation({
    mutationFn: async (v: any) => {
      const { _id, createdAt, updatedAt, __v, status, issuedDate, acknowledgedDate, workingHoursStart, workingHoursEnd, ...submitData } = v;
      
      const empCode = formatEmployeeId(v.employeeCode || candidate?.employeeCode || candidate?.uniqueId || candidate?.candidateCode || '');
      const payload = {
        ...submitData,
        employeeCode: empCode,
        uniqueId: empCode,
        candidateCode: empCode,
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
        <CardContent className="p-0">
          {!locked ? (
            <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-0">
              <div className="grid lg:grid-cols-[1fr_300px] divide-x divide-slate-100">
                {/* LEFT COLUMN */}
                <div className="p-6 space-y-8 bg-white">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">1</span>
                      Role & Department
                    </h3>
                    <div className="grid gap-3 md:grid-cols-5">
                      <label>
                        <span className={lbl}>Employee ID / Code</span>
                        <input {...register('employeeCode')} className={`${inp} font-mono bg-slate-50 font-semibold`} placeholder="e.g. NAM/HQ/26/0011" />
                      </label>
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
                              className="bg-white border-slate-200 rounded-[2px]"
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
                              className="bg-white border-slate-200 rounded-[2px]"
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
                    <textarea {...register('letterContent')} className="w-full h-64 min-h-[250px] p-3 rounded-[2px] border border-slate-200 bg-white text-xs outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] resize-y" placeholder="Enter the full appointment letter body. This content will be preserved in the PDF even if candidate details change later." />
                  </div>

                  <div className="flex flex-col justify-start items-stretch gap-2 pt-6">
                    <button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="flex items-center justify-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                    >
                      <Save className="h-4 w-4" />
                      {saveMutation.isPending ? 'SAVING...' : 'SAVE STEP RECORD'}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/appointment-letter`, '_blank')}
                      className="flex items-center justify-center gap-2 px-8 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[2px] tracking-wide"
                    >
                      PRINT REVIEW & PRINT
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
