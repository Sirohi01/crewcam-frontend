'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Save, Printer, Plus, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { HiringStepLayout } from '@/components/hiring/HiringStepLayout';

const DEFAULT_MODULES = [
  'Welcome & Registration',
  'Company Introduction',
  'HR Documentation (NDA, IT Policy, Bank)',
  'HR Policies Overview',
  'IT & Systems Briefing',
  'Office Tour',
  'Departmental Introduction',
  'Role & Responsibilities Orientation',
  'Safety & Compliance Briefing',
  'Detailed product/service overview',
  'KPI orientation & goal setting'
];

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

const FormInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-colors disabled:bg-slate-50 disabled:text-slate-500"
    {...props}
  />
));
FormInput.displayName = 'FormInput';

const FormSelect = React.forwardRef<HTMLSelectElement, React.InputHTMLAttributes<HTMLSelectElement>>((props, ref) => (
  <select
    ref={ref}
    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-colors disabled:bg-slate-50 disabled:text-slate-500"
    {...props}
  >
    {props.children}
  </select>
));
FormSelect.displayName = 'FormSelect';

export default function InductionPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit');
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, reset, watch, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      employeeName: '',
      uniqueId: '',
      department: '',
      designation: '',
      joiningDate: '',
      inductionDate: new Date().toISOString().split('T')[0],
      overallStatus: 'Scheduled',
      feedback: '',
      modules: DEFAULT_MODULES.map(m => ({ moduleName: m, completed: false, completedDate: '' }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modules'
  });

  const { data: records, isLoading: isRecordsLoading } = useQuery<any[]>({
    queryKey: ['induction', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/induction', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
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
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    }
  });

  const { data: candidate } = useQuery<any>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data
  });

  useEffect(() => {
    if (isRecordsLoading || !selectionData || !candidate) return;
    if (isDirty) return;

    if (records && records.length > 0) {
      let targetRecord = null;
      if (editId) {
        targetRecord = records.find(r => r._id === editId);
      }
      if (!targetRecord) {
        targetRecord = records[records.length - 1];
      }

      reset({
        ...targetRecord,
        employeeName: targetRecord.employeeName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
        inductionDate: targetRecord.inductionDate ? new Date(targetRecord.inductionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        joiningDate: targetRecord.joiningDate ? new Date(targetRecord.joiningDate).toISOString().split('T')[0] : '',
        modules: targetRecord.modules?.length > 0 ? targetRecord.modules.map((m: any) => ({
          ...m,
          completedDate: m.completedDate ? new Date(m.completedDate).toISOString().split('T')[0] : ''
        })) : DEFAULT_MODULES.map(m => ({ moduleName: m, completed: false, completedDate: '' }))
      });
    } else {
      let defaultData: any = {};
      const sel = selectionData && selectionData.length > 0 ? selectionData[0] : null;

      if (sel) {
        defaultData.designation = sel.designation || '';
        defaultData.department = sel.department || '';
      }

      if (candidate) {
        defaultData.employeeName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
        defaultData.designation = candidate.jobRole || defaultData.designation;
      }

      reset({
        ...defaultData,
        inductionDate: new Date().toISOString().split('T')[0],
        overallStatus: 'Scheduled',
        modules: DEFAULT_MODULES.map(m => ({ moduleName: m, completed: false, completedDate: '' }))
      });
    }
  }, [records, isRecordsLoading, selectionData, candidate, isDirty, reset, editId]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, candidateId };
      if (editId) {
        return await api.put(`/hiring/induction/${editId}`, payload);
      } else if (records && records.length > 0 && records[0]._id) {
        return await api.put(`/hiring/induction/${records[0]._id}`, payload);
      }
      return await api.post('/hiring/induction', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records'] });
      queryClient.invalidateQueries({ queryKey: ['induction'] });
      toast.success('Induction details saved successfully');
      router.push('/dashboard/hiring/steps/induction');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save induction details');
    }
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const handlePrint = () => {
    router.push(`/dashboard/hiring/${candidateId}/print/induction`);
  };

  const handleNewModule = () => {
    const name = window.prompt('Enter new module name:');
    if (name && name.trim()) {
      append({ moduleName: name.trim(), completed: false, completedDate: '' });
    }
  };

  return (
    <HiringStepLayout candidateId={candidateId} stepId="induction">
      <div className="section-card shadow-sm border-slate-200 overflow-hidden no-print mt-6 bg-white">
        <div className="bg-white px-3 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <ClipboardList className="h-4 w-4 text-[#0d3c68]" />
            Induction Schedule
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
                  <FormInput {...register('employeeName')} readOnly />
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
                <FormField label="Induction Date:" required>
                  <FormInput type="date" {...register('inductionDate')} />
                </FormField>
                <FormField label="Overall Status:" required>
                  <FormSelect {...register('overallStatus')}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </FormSelect>
                </FormField>
              </div>
            </div>

            {/* SECTION 2: MODULES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">2</span>
                  Induction Modules
                </h3>
                <button
                  type="button"
                  onClick={handleNewModule}
                  className="text-[10px] flex items-center gap-1 font-bold text-[#0d3c68] hover:underline"
                >
                  <Plus className="h-3 w-3" /> ADD MODULE
                </button>
              </div>

              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200 w-12 text-center">S.No.</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200">Module Name</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200 w-32 text-center">Completed</th>
                      <th className="px-4 py-2.5 text-[10px] font-bold text-[#0d3c68] uppercase border-r border-slate-200 w-40">Completion Date</th>
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
                            {...register(`modules.${idx}.moduleName`)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-[11px] font-bold text-slate-800"
                            placeholder="Enter Module Name"
                          />
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100 text-center">
                          <input
                            type="checkbox"
                            {...register(`modules.${idx}.completed`)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue(`modules.${idx}.completedDate`, new Date().toISOString().split('T')[0]);
                              } else {
                                setValue(`modules.${idx}.completedDate`, '');
                              }
                            }}
                            className="rounded-sm border-slate-300 text-[#0d3c68] focus:ring-[#0d3c68] h-4 w-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2 border-r border-slate-100">
                          <input
                            type="date"
                            {...register(`modules.${idx}.completedDate`)}
                            className="w-full bg-transparent border border-slate-200 rounded-sm focus:outline-none focus:border-[#0d3c68] p-1 text-[11px]"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => remove(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">3</span>
                Remarks / Feedback
              </h3>
              <textarea
                {...register('feedback')}
                className="w-full p-2 text-xs border border-slate-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] min-h-[60px]"
                placeholder="Enter any remarks or feedback regarding the induction..."
              ></textarea>
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
