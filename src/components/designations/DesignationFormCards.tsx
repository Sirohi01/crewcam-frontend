'use client';

import React from 'react';
import { FileText, User, LayoutList, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Card, Field, SelectField, inputCls, textareaCls } from '@/components/divisions/FormHelpers';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function DesignationFormCards({ formData, setFormData }: { formData?: any, setFormData?: any }) {
  const handleChange = (field: string) => (e: any) => {
    if (setFormData) {
      setFormData((prev: any) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const { data: jobGrades = [] } = useQuery({
    queryKey: ['job-grades'],
    queryFn: async () => {
      const res = await api.get('/job-grades');
      return res.data;
    }
  });

  const { data: jobFamilies = [] } = useQuery({
    queryKey: ['job-families'],
    queryFn: async () => {
      const res = await api.get('/job-families');
      return res.data;
    }
  });

  return (
    <div className="space-y-3">

      {/* Designation Information Card */}
      <Card title={<><FileText size={16} className="text-blue-600 mr-1" /> Designation Information</>}>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-2">
          <Field title="Designation Name" required helpText="e.g., Senior Manager">
            <input type="text" className={inputCls} placeholder="Enter designation name" value={formData?.name || ''} onChange={handleChange('name')} />
          </Field>
          <Field title="Short Code" required helpText="e.g., SR. MGR (max 10 characters)">
            <input type="text" className={inputCls} placeholder="Enter short code" maxLength={10} value={formData?.code || ''} onChange={handleChange('code')} />
          </Field>
          <Field title="Job Grade" required>
            <select className={inputCls} value={formData?.jobGrade || ''} onChange={handleChange('jobGrade')}>
              <option value="">Select Job Grade</option>
              {jobGrades.map((jg: any) => (
                <option key={jg._id} value={jg._id}>{jg.name} ({jg.code})</option>
              ))}
            </select>
          </Field>
          <Field title="Job Family" required>
            <select className={inputCls} value={formData?.jobFamily || ''} onChange={handleChange('jobFamily')}>
              <option value="">Select Job Family</option>
              {jobFamilies.map((jf: any) => (
                <option key={jf._id} value={jf._id}>{jf.name} ({jf.code})</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-2">
          <SelectField title="Business Unit" required options={['Retail Interiors', 'Corporate']} value={formData?.businessUnit || ''} onChange={handleChange('businessUnit')} />
          <SelectField title="Division" required options={['Design Studio', 'Operations']} value={formData?.division || ''} onChange={handleChange('division')} />
          <SelectField title="Department" required options={['Space Planning', '3D Visualisation']} value={formData?.department || ''} onChange={handleChange('department')} />
          <SelectField title="Reports To (Designation / Role)" options={['Managing Director', 'General Manager']} helpText="Immediate reporting role / designation" value={formData?.reportsToDesignationId || ''} onChange={handleChange('reportsToDesignationId')} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-2">
          <SelectField title="Employment Type" options={['Full Time', 'Part Time', 'Contract']} helpText="e.g., Full Time, Part Time, Contract" value={formData?.employmentType || ''} onChange={handleChange('employmentType')} />
          <SelectField title="FLSA / Overtime Type" options={['Exempt', 'Non-Exempt']} helpText="e.g., Exempt, Non-Exempt" value={formData?.flsaType || ''} onChange={handleChange('flsaType')} />
          <SelectField title="Status" required options={['Active', 'Inactive']} helpText="Choose current status" value={formData?.isActive ? 'Active' : 'Inactive'} onChange={(e: any) => setFormData?.((p: any) => ({ ...p, isActive: e.target.value === 'Active' }))} />

          <Field title="Effective From" required helpText="From when this designation is active">
            <div className="relative">
              <input type="date" className={`${inputCls}`} placeholder="Select date" value={formData?.effectiveFrom || ''} onChange={handleChange('effectiveFrom')} />
            </div>
          </Field>
        </div>

        {/* Summary */}
        <div className="mt-2">
          <Field title="Designation Summary">
            <div className="relative mt-1">
              <textarea
                className={textareaCls}
                placeholder="Enter a brief summary of this designation, its purpose and key responsibilities..."
                maxLength={500}
                value={formData?.summary || ''}
                onChange={handleChange('summary')}
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-zinc-400">{(formData?.summary || '').length}/500</span>
            </div>
          </Field>
        </div>
      </Card>

      {/* Role Details Card */}
      <Card title={<><User size={16} className="text-blue-600 mr-1" /> Role Details</>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mt-2">

          {/* Key Responsibilities */}
          <div>
            <Field title="Key Responsibilities">
              <div className="relative mt-1">
                <textarea
                  className={`${textareaCls} min-h-[120px] leading-relaxed`}
                  placeholder="List the primary responsibilities for this role.&#10;• Responsibility 1&#10;• Responsibility 2&#10;• ..."
                  maxLength={1000}
                  value={formData?.keyResponsibilities || ''}
                  onChange={handleChange('keyResponsibilities')}
                />
                <span className="absolute bottom-2 right-2 text-[10px] text-zinc-400">{(formData?.keyResponsibilities || '').length}/1000</span>
              </div>
            </Field>
          </div>

          {/* Key Skills / Competencies */}
          <div>
            <Field title="Key Skills / Competencies">
              <div className="relative mt-1">
                <textarea
                  className={`${textareaCls} min-h-[120px] leading-relaxed`}
                  placeholder="List key skills required for this role.&#10;• Skill 1&#10;• Skill 2&#10;• ..."
                  maxLength={500}
                  value={formData?.keySkills || ''}
                  onChange={handleChange('keySkills')}
                />
                <span className="absolute bottom-2 right-2 text-[10px] text-zinc-400">{(formData?.keySkills || '').length}/500</span>
              </div>
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 mt-4">
          <Field title="Qualification" helpText="Minimum qualification required.">
            <input type="text" className={inputCls} placeholder="e.g., MBA, B.Tech, CA, Any Graduate" value={formData?.qualification || ''} onChange={handleChange('qualification')} />
          </Field>
          <Field title="Experience Required" helpText="Minimum years of experience.">
            <input type="text" className={inputCls} placeholder="e.g., 5+ years" value={formData?.experienceRequired || ''} onChange={handleChange('experienceRequired')} />
          </Field>
        </div>
      </Card>

      {/* Additional Details Card */}
      <Card title={<><LayoutList size={16} className="text-blue-600 mr-1" /> Additional Details (Optional)</>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 mt-2">
          <SelectField title="CTC Range (₹)" options={['3-5 LPA', '5-10 LPA', '10-20 LPA']} value={formData?.ctcRange || ''} onChange={handleChange('ctcRange')} />
          <SelectField title="Designation Level" options={['Executive', 'Managerial', 'Senior Management']} helpText="e.g., Executive, Managerial, Senior Management" value={formData?.designationLevel || ''} onChange={handleChange('designationLevel')} />
          <SelectField title="Location" options={['Delhi (HQ)', 'Mumbai', 'Bangalore']} helpText="Primary work location" value={formData?.location || ''} onChange={handleChange('location')} />
          <Field title="Remarks">
            <div className="relative">
              <input type="text" className={inputCls} placeholder="Enter any additional remarks..." maxLength={200} value={formData?.remarks || ''} onChange={handleChange('remarks')} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400">{(formData?.remarks || '').length}/200</span>
            </div>
          </Field>
        </div>
      </Card>

    </div>
  );
}
