'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Share2, Save, RotateCcw, Laptop, CheckSquare, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { HiringStepLayout } from '@/components/hiring/HiringStepLayout';

const PLATFORMS = ['FB', 'IG', 'LinkedIn', 'X', 'YT'];

function FormField({ label, children, required, className }: { label: string; children: React.ReactNode; required?: boolean, className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const FormInput = React.forwardRef<HTMLInputElement, any>((props, ref) => (
  <input ref={ref} className="w-full h-7 px-2 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] disabled:bg-slate-50 disabled:text-slate-500" {...props} />
));
FormInput.displayName = 'FormInput';

const FormSelect = React.forwardRef<HTMLSelectElement, any>((props, ref) => (
  <select ref={ref} className="w-full h-7 px-2 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] disabled:bg-slate-50 disabled:text-slate-500" {...props} />
));
FormSelect.displayName = 'FormSelect';

export default function EngagementConfirmPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidate, isLoading: isCandidateLoading } = useQuery<any>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data
  });

  const { data: pipeline, isLoading: isPipelineLoading } = useQuery<any>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data
  });

  const { data: records, isLoading: isRecordsLoading } = useQuery<any[]>({
    queryKey: ['engagement-confirmation', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/engagement-confirm', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const { data: departments } = useQuery<any[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/companies/departments');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
  });

  const { data: designations } = useQuery<any[]>({
    queryKey: ['designations'],
    queryFn: async () => {
      const response = await api.get('/designations');
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
  });

  const { data: selectionData } = useQuery<any[]>({
    queryKey: ['selection-approval', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/selection-approval', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const { register, handleSubmit, reset, control, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      candidateName: '',
      uniqueId: '',
      department: '',
      designation: '',
      joiningDate: '',
      officialMobileNo: '',
      engagementData: [] as any[]
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'engagementData'
  });

  useEffect(() => {
    if (isRecordsLoading || isCandidateLoading || isPipelineLoading) return;
    if (isDirty) return;

    if (records && records.length > 0) {
      const latest = records[records.length - 1];
      reset({
        ...latest,
        candidateName: latest.employeeName || latest.candidateName || '',
        engagementData: latest.engagementData || []
      });
    } else {
      let defaultData: any = {};
      const sel = selectionData && selectionData.length > 0 ? selectionData[0] : null;

      if (sel) {
        defaultData.designation = sel.designation || '';
        defaultData.department = sel.department || '';
      }

      if (candidate) {
        defaultData.candidateName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
        defaultData.officialMobileNo = candidate.phone || '';
        defaultData.department = candidate.departmentId?.name || candidate.departmentId?.departmentName || defaultData.department;
        defaultData.designation = candidate.jobRole || defaultData.designation;
      }

      if (pipeline && pipeline.joiningDate) {
        defaultData.joiningDate = new Date(pipeline.joiningDate).toISOString().split('T')[0];
      }

      reset({
        ...defaultData,
        engagementData: [
          { brand: 'Brand 1', platforms: { FB: false, IG: false, LinkedIn: false, X: false, YT: false } },
          { brand: 'Brand 2', platforms: { FB: false, IG: false, LinkedIn: false, X: false, YT: false } },
          { brand: 'Brand 3', platforms: { FB: false, IG: false, LinkedIn: false, X: false, YT: false } }
        ]
      });
    }
  }, [records, candidate, selectionData, pipeline, isRecordsLoading, isCandidateLoading, isPipelineLoading, reset, isDirty]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, candidateId, employeeName: data.candidateName };
      if (records && records.length > 0 && records[0]._id) {
        return api.put(`/hiring/engagement-confirm/${records[0]._id}`, payload);
      }
      return api.post('/hiring/engagement-confirm', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline'] });
      toast.success('Record saved successfully');
      router.push(`/dashboard/hiring/steps/engagement-confirm`);
    },
    onError: () => {
      toast.error('Failed to save record');
    }
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const handlePrint = () => {
    router.push(`/dashboard/hiring/${candidateId}/print/engagement-confirm`);
  };

  const currentEngagementData = watch('engagementData') || [];

  return (
    <HiringStepLayout candidateId={candidateId} stepId="engagement-confirm">
      <div className="section-card shadow-sm border-slate-200 overflow-hidden no-print mt-6 bg-white">
        <div className="bg-white px-3 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <Share2 className="h-4 w-4 text-[#0d3c68]" />
            Engagement Confirmation Form
          </h2>
        </div>

        <div className="p-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* SECTION 1: EMPLOYEE INFO */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">1</span>
                Employee Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <FormField label="Employee Name:" required>
                  <FormInput {...register('candidateName')} readOnly />
                </FormField>
                <FormField label="Unique ID:">
                  <FormInput {...register('uniqueId')} />
                </FormField>
                <FormField label="Department:" required>
                  <FormSelect {...register('department')}>
                    <option value="">Select Department</option>
                    {departments?.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </FormSelect>
                </FormField>
                <FormField label="Designation:" required>
                  <FormSelect {...register('designation')}>
                    <option value="">Select Designation</option>
                    {designations?.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                  </FormSelect>
                </FormField>
                <FormField label="Joining Date:">
                  <FormInput type="date" {...register('joiningDate')} />
                </FormField>
                <FormField label="Official Mobile No:">
                  <FormInput {...register('officialMobileNo')} />
                </FormField>
              </div>
            </div>

            {/* SECTION 2: Follow/Subscribe */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">2</span>
                Follow/Subscribe Verification
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200 w-12 text-center">S.No.</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200">Brand / Page</th>
                      {PLATFORMS.map(p => (
                        <th key={p} className="px-2 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200 w-16 text-center">{p}</th>
                      ))}
                      <th className="px-2 py-2.5 text-[10px] font-bold text-red-500 uppercase w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fields.map((field: any, idx: number) => (
                      <tr key={field.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-4 py-2 border-r border-slate-100 text-[11px] text-center font-medium bg-slate-50/50">{idx + 1}</td>
                        <td className="px-4 py-2 border-r border-slate-100 text-[11px] font-bold text-slate-800">
                          <input
                            type="text"
                            {...register(`engagementData.${idx}.brand`)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[11px] font-bold text-slate-800"
                            placeholder="Enter Brand Name"
                          />
                        </td>
                        {PLATFORMS.map(p => (
                          <td key={p} className="px-2 py-2 border-r border-slate-100 text-center">
                            <input
                              type="checkbox"
                              {...register(`engagementData.${idx}.platforms.${p}`)}
                              className="rounded-sm border-slate-300 text-[#0d3c68] focus:ring-[#0d3c68] h-4 w-4 cursor-pointer"
                            />
                          </td>
                        ))}
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const currentData = watch('engagementData') || [];
                              setValue('engagementData', currentData.filter((_: any, i: number) => i !== idx));
                            }}
                            className="text-[10px] text-red-500 hover:underline font-bold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-2 bg-slate-50 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      const currentData = watch('engagementData') || [];
                      setValue('engagementData', [
                        ...currentData,
                        { brand: `Brand ${currentData.length + 1}`, platforms: { FB: false, IG: false, LinkedIn: false, X: false, YT: false } }
                      ]);
                    }}
                    className="text-[10px] font-bold text-[#0d3c68] hover:underline"
                  >
                    + ADD ROW
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: Commitment */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-4">
              <h3 className="text-[11px] font-bold text-[#0d3c68] uppercase border-b border-slate-200 pb-1">3. Employee Commitment</h3>
              <ul className="space-y-2">
                {[
                  "I will regularly Like, Comment, and Share all important posts published on the official social media pages.",
                  "I will not post any negative or inappropriate comments about the Company.",
                  "I will arrange at least 10 genuine Google Reviews for each brand listed.",
                  "I understand that social media engagement is part of my professional responsibility.",
                ].map((point, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600">
                    <CheckSquare className="h-3.5 w-3.5 text-[#0d3c68] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button type="button" onClick={handlePrint} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-[2px] transition-colors border border-slate-200">
                <Printer className="h-4 w-4" />
                PRINT / PREVIEW
              </button>
              <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] rounded-[2px] transition-colors disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'SAVING...' : 'SAVE RECORD'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </HiringStepLayout>
  );
}
