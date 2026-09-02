'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, FileText, CheckCircle2, RotateCcw, Laptop, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { HiringStepLayout } from './HiringStepLayout';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';
import { useMasterDataStore } from '@/store/masterDataStore';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const FormField = ({ label, required, children, className }: any) => (
  <div className={className}>
    <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const FormInput = React.forwardRef<HTMLInputElement, any>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "w-full h-7 px-2 bg-white border text-[13px] transition-all duration-200 border-[#cbd5e1] hover:border-[#94a3b8]",
      "placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68]",
      className
    )}
    style={{ borderRadius: '2px' }}
    {...props}
  />
));
FormInput.displayName = 'FormInput';

const FormSelect = React.forwardRef<HTMLSelectElement, any>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full h-7 px-2 bg-white border text-[13px] transition-all duration-200 cursor-pointer border-[#cbd5e1] hover:border-[#94a3b8]",
      "focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68]",
      className
    )}
    style={{ borderRadius: '2px' }}
    {...props}
  >
    {children}
  </select>
));
FormSelect.displayName = 'FormSelect';

export default function AssetAccessPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { departments, designations, fetchMasterData, isLoaded } = useMasterDataStore();

  useEffect(() => {
    if (!isLoaded) fetchMasterData();
  }, [isLoaded, fetchMasterData]);

  const { data: pipeline, isLoading: isPipelineLoading } = useQuery({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
  });

  const { data: records = [], isLoading: isRecordsLoading } = useQuery({
    queryKey: ['hiring-step-records', 'asset-access', candidateId],
    queryFn: async () => {
      const response = await api.get(`/hiring/asset-access?candidateId=${candidateId}`);
      return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
  });

  const { data: candidate, isLoading: isCandidateLoading } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
  });

  const { data: selectionData = [] } = useQuery({
    queryKey: ['hiring-step-records', 'selection-approval', candidateId],
    queryFn: async () => {
      const res = await api.get(`/hiring/selection-approval?candidateId=${candidateId}`);
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    },
  });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'assetAccessForm');
  const locked = stepState?.gate?.unlocked === false;

  const { register, handleSubmit, reset, watch, control, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      candidateName: '',
      department: '',
      designation: '',
      uniqueId: '',
      personalEmail: '',
      officialEmail: '',
      mobileNumber: '',
      access_email: [] as string[],
      access_system: [] as string[],
      access_device: [] as string[],
      system_other: '',
      sharedFolder_other: '',
      accessLevel: 'Standard User',
      restrictedRolesDetailed: '',
      deviceType: '',
      serialNo: '',
      modelNo: '',
      softwareInstalled: '',
      usePersonalDevice: false,
      assets: [
        { name: 'Diary / Notebook', desc: '', qty: '1', cond: 'New', remarks: '' },
        { name: 'Pen Set', desc: '', qty: '1', cond: 'New', remarks: '' },
        { name: 'ID Card & Lanyard', desc: '', qty: '1', cond: 'New', remarks: '' },
        { name: 'File Folders', desc: '', qty: '5', cond: 'New', remarks: '' },
        { name: 'Other Items (Specify)', desc: '', qty: '', cond: '', remarks: '' }
      ],
      processedBy: '',
      accessCreatedOn: '',
      itemsIssued: {
        laptopNo: '',
        mobileDevice: '',
        socialMediaAccount: '',
        charger: false,
        softwareInstalledIT: false,
        emailAccountCreated: false,
        wifiCredentials: false
      },
      itRemarks: ''
    }
  });

  const { fields: assetFields, replace: replaceAssets } = useFieldArray({
    control,
    name: 'assets'
  });

  useEffect(() => {
    if (isRecordsLoading || isCandidateLoading || isPipelineLoading) return;
    if (isDirty) return;

    if (records.length > 0) {
      const latest = records[records.length - 1];
      reset({
        ...latest,
        access_email: latest.access_email || [],
        access_system: latest.access_system || [],
        access_device: latest.access_device || [],
        assets: latest.assets || [],
        itemsIssued: latest.itemsIssued || {}
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
        defaultData.personalEmail = candidate.email || '';
        defaultData.mobileNumber = candidate.phone || '';
      }

      reset({
        ...defaultData,
        accessLevel: 'Standard User',
        assets: [
          { name: 'Diary / Notebook', desc: '', qty: '1', cond: 'New', remarks: '' },
          { name: 'Pen Set', desc: '', qty: '1', cond: 'New', remarks: '' },
          { name: 'ID Card & Lanyard', desc: '', qty: '1', cond: 'New', remarks: '' },
          { name: 'File Folders', desc: '', qty: '5', cond: 'New', remarks: '' },
          { name: 'Other Items (Specify)', desc: '', qty: '', cond: '', remarks: '' }
        ],
        itemsIssued: {
          laptopNo: '',
          mobileDevice: '',
          socialMediaAccount: '',
          charger: false,
          softwareInstalledIT: false,
          emailAccountCreated: false,
          wifiCredentials: false
        }
      });
    }
  }, [records, candidate, selectionData, isRecordsLoading, isCandidateLoading, isPipelineLoading, reset, isDirty]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        candidateId,
      };
      if (records.length > 0 && records[0]._id) {
        return api.put(`/hiring/asset-access/${records[0]._id}`, payload);
      }
      return api.post('/hiring/asset-access', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records'] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline'] });
      router.push(`/dashboard/hiring/steps/asset-access`);
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const handlePrint = () => {
    router.push(`/dashboard/hiring/${candidateId}/print/asset-access`);
  };

  const currentAccessEmail = watch('access_email') || [];
  const currentAccessSystem = watch('access_system') || [];
  const currentAccessDevice = watch('access_device') || [];
  const currentItemsIssued = watch('itemsIssued') || {};
  const currentUsePersonal = watch('usePersonalDevice');

  return (
    <HiringStepLayout candidateId={candidateId} stepId="asset-access">
        <div className="section-card shadow-sm border-slate-200 overflow-hidden no-print mt-6 bg-white">
          <div className="bg-white px-3 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                  <Laptop className="h-4 w-4 text-[#0d3c68]" />
                  IT Assets / IT Access / Stationery Form (Filled by Recruitment Division)
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                    <FormField label="Employee Name:" required>
                        <FormInput {...register('candidateName')} readOnly />
                    </FormField>
                    <FormField label="Department:" required>
                        <FormSelect {...register('department')}>
                            <option value="">Select Department</option>
                            {departments.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </FormSelect>
                    </FormField>
                    <FormField label="Designation:" required>
                        <FormSelect {...register('designation')}>
                            <option value="">Select Designation</option>
                            {designations.map((d: any) => <option key={d._id} value={d.name}>{d.name}</option>)}
                        </FormSelect>
                    </FormField>
                    <FormField label="Unique ID (if issued):">
                        <FormInput {...register('uniqueId')} />
                    </FormField>
                    <FormField label="Personal Email:">
                        <FormInput {...register('personalEmail')} />
                    </FormField>
                    <FormField label="Official Email ID:">
                        <FormInput {...register('officialEmail')} />
                    </FormField>
                    <FormField label="Mobile Number:">
                        <FormInput {...register('mobileNumber')} />
                    </FormField>
                </div>
              </div>

              {/* SECTIONS 2 & 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                          <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">2</span>
                          IT Access
                      </h3>
                      <div className="space-y-3">
                          <div className="p-3 bg-slate-50/50 rounded-sm border border-slate-100">
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 font-poppins italic">A. Email & Communication Access</label>
                              <div className="grid grid-cols-2 gap-2">
                                  {['Official Email ID', 'Calendar Access', 'Mailing Groups / Distribution Lists', 'Video Conferencing Tools (Meet/Zoom)'].map(opt => (
                                      <label key={opt} className="flex items-center gap-2 text-xs text-slate-600">
                                          <input
                                              type="checkbox"
                                              checked={currentAccessEmail.includes(opt)}
                                              onChange={(e) => {
                                                  const newVal = e.target.checked
                                                      ? [...currentAccessEmail, opt]
                                                      : currentAccessEmail.filter(i => i !== opt);
                                                  setValue('access_email', newVal, { shouldDirty: true });
                                              }}
                                              className="rounded-sm border-slate-300 text-[#0d3c68] focus:ring-[#0d3c68]"
                                          />
                                          {opt}
                                      </label>
                                  ))}
                              </div>
                          </div>
                          <div className="p-3 bg-slate-50/50 rounded-sm border border-slate-100">
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 font-poppins italic">B. System / Application Access</label>
                              <div className="grid grid-cols-2 gap-2">
                                  {['CRM System', 'Finance / Billing Software', 'HRMS / Attendance App', 'Project Management Tools', 'Sales Tools / Lead System', 'Internal Portals / Dashboards', 'Cloud Storage'].map(opt => (
                                      <label key={opt} className="flex items-center gap-2 text-xs text-slate-600">
                                          <input
                                              type="checkbox"
                                              checked={currentAccessSystem.includes(opt)}
                                              onChange={(e) => {
                                                  const newVal = e.target.checked
                                                      ? [...currentAccessSystem, opt]
                                                      : currentAccessSystem.filter(i => i !== opt);
                                                  setValue('access_system', newVal, { shouldDirty: true });
                                              }}
                                              className="rounded-sm border-slate-300 text-[#0d3c68] focus:ring-[#0d3c68]"
                                          />
                                          {opt}
                                      </label>
                                  ))}
                                  <div className="col-span-2 mt-1">
                                      <FormField label="Any Other:">
                                          <FormInput {...register('system_other')} placeholder="Specify other applications..." />
                                      </FormField>
                                  </div>
                              </div>
                          </div>
                          <div className="p-3 bg-slate-50/50 rounded-sm border border-slate-100">
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 font-poppins italic">C. Device & Network Access</label>
                              <div className="grid grid-cols-2 gap-2">
                                  {['Laptop / Desktop Assigned', 'Biometric Access', 'Mobile Phone', 'Wi-Fi / Internet Access', 'Charger / Accessories', 'VPN Access'].map(opt => (
                                      <label key={opt} className="flex items-center gap-2 text-xs text-slate-600">
                                          <input
                                              type="checkbox"
                                              checked={currentAccessDevice.includes(opt)}
                                              onChange={(e) => {
                                                  const newVal = e.target.checked
                                                      ? [...currentAccessDevice, opt]
                                                      : currentAccessDevice.filter(i => i !== opt);
                                                  setValue('access_device', newVal, { shouldDirty: true });
                                              }}
                                              className="rounded-sm border-slate-300 text-[#0d3c68] focus:ring-[#0d3c68]"
                                          />
                                          {opt}
                                      </label>
                                  ))}
                                  <div className="col-span-2 mt-2">
                                      <FormField label="Shared Folder Access (Specify):">
                                          <FormInput
                                              {...register('sharedFolder_other')}
                                              placeholder="Specify folders or access details..."
                                          />
                                      </FormField>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                              <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">3</span>
                              Access Level Required
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                              <div className="flex gap-4 p-2 bg-slate-50/50 border border-slate-200 rounded-sm">
                                  {['Basic User', 'Standard User', 'Manager / Admin Access'].map(lvl => (
                                      <label key={lvl} className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                                          <input
                                              type="radio"
                                              value={lvl}
                                              {...register('accessLevel')}
                                              className="text-[#0d3c68] focus:ring-[#0d3c68]"
                                          />
                                          {lvl}
                                      </label>
                                  ))}
                              </div>
                              <FormField label="Restricted Access (Confidential Roles):">
                                  <FormInput
                                      {...register('restrictedRolesDetailed')}
                                      placeholder="Specify roles or restrictions..."
                                  />
                              </FormField>
                          </div>
                      </div>

                      <div className="space-y-4 pt-2">
                          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                              <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">4</span>
                              Personal Device Declaration (If applicable)
                          </h3>
                          <div className="grid grid-cols-3 gap-3">
                              <FormField label="Device Type:">
                                  <FormInput {...register('deviceType')} />
                              </FormField>
                              <FormField label="Serial No.:">
                                  <FormInput {...register('serialNo')} />
                              </FormField>
                              <FormField label="Model No.:">
                                  <FormInput {...register('modelNo')} />
                              </FormField>
                              <div className="col-span-3">
                                  <FormField label="Software Installed:">
                                      <FormInput {...register('softwareInstalled')} />
                                  </FormField>
                              </div>
                              <div className="col-span-3 p-3 bg-blue-50/50 border border-blue-100 rounded-sm">
                                  <label className="flex items-start gap-3 text-[11px] text-blue-900 leading-normal">
                                      <input
                                          type="checkbox"
                                          checked={currentUsePersonal}
                                          onChange={(e) => setValue('usePersonalDevice', e.target.checked, { shouldDirty: true })}
                                          className="mt-0.5 rounded-sm border-blue-300 text-[#0d3c68] focus:ring-[#0d3c68]"
                                      />
                                      <span>Employee requests to use a personal laptop/mobile for Company work. I understand that personal devices must be checked and cleared by the IT Team before use.</span>
                                  </label>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* SECTION 5: PHYSICAL ASSETS */}
              <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                      <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">5</span>
                      Physical Assets & Stationery
                  </h3>
                  <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider border-r border-slate-200 w-12 text-center">S No.</th>
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider border-r border-slate-200">Asset Name</th>
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider border-r border-slate-200">Description</th>
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider border-r border-slate-200 w-24">Quantity</th>
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider border-r border-slate-200 w-32">Condition</th>
                                  <th className="px-4 py-2 text-[10px] font-bold text-[#0d3c68] uppercase tracking-wider">Remarks</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {assetFields.map((field, idx) => (
                                  <tr key={field.id} className="hover:bg-slate-50/30 transition-colors">
                                      <td className="px-4 py-2 border-r border-slate-100 text-[11px] text-center font-medium bg-slate-50/50">{idx + 1}</td>
                                      <td className="px-4 py-2 border-r border-slate-100 text-[11px] font-bold text-slate-800">{field.name}</td>
                                      <td className="px-4 py-2 border-r border-slate-100 p-0">
                                          <input
                                              {...register(`assets.${idx}.desc`)}
                                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-1 focus:ring-inset focus:ring-[#0d3c68] text-[11px] outline-none"
                                              placeholder="Model/Specs..."
                                          />
                                      </td>
                                      <td className="px-4 py-2 border-r border-slate-100 p-0">
                                          <input
                                              type="number"
                                              {...register(`assets.${idx}.qty`)}
                                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-1 focus:ring-inset focus:ring-[#0d3c68] text-[11px] text-center outline-none"
                                          />
                                      </td>
                                      <td className="px-4 py-2 border-r border-slate-100 p-0">
                                          <input
                                              {...register(`assets.${idx}.cond`)}
                                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-1 focus:ring-inset focus:ring-[#0d3c68] text-[11px] outline-none"
                                          />
                                      </td>
                                      <td className="px-4 py-2 p-0">
                                          <input
                                              {...register(`assets.${idx}.remarks`)}
                                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-1 focus:ring-inset focus:ring-[#0d3c68] text-[11px] outline-none"
                                          />
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* SECTION 6: IT DEPARTMENT SECTION (FOR IT USE ONLY) */}
              <div className="space-y-4 pt-4">
                  <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                      <span className="bg-orange-600 text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">6</span>
                      IT Department Section (For IT Use Only)
                  </h3>
                  <div className="p-4 bg-orange-50/30 border border-orange-100 rounded-sm space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <FormField label="IT Staff Name:">
                              <FormInput {...register('processedBy')} />
                          </FormField>
                          <FormField label="Access Created On (Date):">
                              <FormInput type="date" {...register('accessCreatedOn')} />
                          </FormField>
                          <FormField label="Laptop No./Tag:">
                                  <FormInput {...register('itemsIssued.laptopNo')} />
                              </FormField>
                              <FormField label="Mobile Device / SIM:">
                                  <FormInput {...register('itemsIssued.mobileDevice')} />
                              </FormField>
                              <FormField label="Social Media Access):">
                                  <FormInput {...register('itemsIssued.socialMediaAccount')} />
                              </FormField>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Checklist of Items Issued:</label>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                  { label: 'Charger & Bag Issued', key: 'charger' },
                                  { label: 'Standard Software Loaded', key: 'softwareInstalledIT' },
                                  { label: 'Official Email Account Created', key: 'emailAccountCreated' },
                                  { label: 'Wi-Fi Credentials Shared', key: 'wifiCredentials' }
                              ].map(chk => (
                                  <label key={chk.key} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                                      <input
                                          type="checkbox"
                                          checked={(currentItemsIssued as any)[chk.key] || false}
                                          onChange={(e) => setValue(`itemsIssued.${chk.key}` as any, e.target.checked, { shouldDirty: true })}
                                          className="rounded-sm border-slate-300 text-orange-600 focus:ring-orange-600"
                                      />
                                      {chk.label}
                                  </label>
                              ))}
                          </div>
                          <FormField label="Remarks (if any):">
                              <textarea
                                  {...register('itRemarks')}
                                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                  rows={2}
                              />
                          </FormField>
                      </div>
                  </div>
              </div>

              {/* FORM FOOTER */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 -mx-3 -mb-3 px-5 py-3 border-t border-slate-100 mt-6">
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic max-w-lg">
                      I confirm that this record represents an accurate inventory of IT assets and access assigned to the employee.
                  </p>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {records.length > 0 && (
                          <button type="button" onClick={handlePrint} className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-[2px]">
                              <FileText className="h-3.5 w-3.5" />
                              PRINT REVIEW & PRINT
                          </button>
                      )}
                      <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide disabled:opacity-50">
                          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {records.length > 0 ? 'UPDATE ASSETS' : 'SAVE ASSETS'}
                      </button>
                  </div>
              </div>

            </form>
          </div>
        </div>
    </HiringStepLayout>
  );
}
