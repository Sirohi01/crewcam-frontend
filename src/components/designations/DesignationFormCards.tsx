'use client';

import React from 'react';
import { FileText, User, LayoutList, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Card, Field, SelectField, inputCls, textareaCls } from '@/components/divisions/FormHelpers';

export default function DesignationFormCards({ formData, setFormData }: { formData?: any, setFormData?: any }) {
  const handleChange = (field: string) => (e: any) => {
    if (setFormData) {
      setFormData((prev: any) => ({ ...prev, [field]: e.target.value }));
    }
  };

  return (
    <div className="space-y-1">

      {/* Designation Information Card */}
      <Card title={<><FileText size={16} className="text-blue-600 mr-1" /> Designation Information</>}>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-1 mt-2">
          <Field title="Designation Name" required helpText="e.g., Senior Manager">
            <input type="text" className={inputCls} placeholder="Enter designation name" value={formData?.name || ''} onChange={handleChange('name')} />
          </Field>
          <Field title="Short Code" required helpText="e.g., SR. MGR (10 characters)">
            <input type="text" className={inputCls} placeholder="Enter short code" maxLength={10} />
          </Field>
          <SelectField title="Job Grade" required options={['JG-10', 'JG-09', 'JG-08', 'JG-07']} value={formData?.jobGrade || ''} onChange={handleChange('jobGrade')} />
          <SelectField title="Job Family" required options={['Leadership', 'Management', 'Professional']} value={formData?.jobFamily || ''} onChange={handleChange('jobFamily')} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-1 mt-2">
          <SelectField title="Business Unit" required options={['Retail Interiors', 'Corporate']} />
          <SelectField title="Division" required options={['Design Studio', 'Operations']} />
          <SelectField title="Department" required options={['Space Planning', '3D Visualisation']} />
          <SelectField title="Reports To (Designation)" options={['Managing Director', 'General Manager']} helpText="Immediate reporting role" />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-1 mt-2">
          <SelectField title="Employment Type" options={['Full Time', 'Part Time', 'Contract']} helpText="e.g., Full, Part Time, Contract" />
          <SelectField title="FLSA / Overtime Type" options={['Exempt', 'Non-Exempt']} helpText="e.g., Exempt, Non-Exempt" />
          <SelectField title="Status" required options={['Active', 'Inactive']} helpText="Choose current status" value="Active" />

          <Field title="Effective From" required helpText="From when this designation is active">
            <div className="relative">
              <input type="date" className={`${inputCls}`} placeholder="Select date" value={formData?.effectiveFrom || ''} onChange={handleChange('effectiveFrom')} />
            </div>
          </Field>
        </div>

        {/* Summary */}
        <div className="mt-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5 gap-y-1 mt-2">

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1.5 gap-y-1 mt-1">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1.5 gap-y-1 mt-2">
          <SelectField title="CTC Range (₹)" options={['3-5 LPA', '5-10 LPA', '10-20 LPA']} />
          <SelectField title="Designation Level" options={['Executive', 'Managerial', 'Senior Management']} helpText="e.g., Executive, Managerial, Senior Management" />
          <SelectField title="Location" options={['Delhi (HQ)', 'Mumbai', 'Bangalore']} helpText="Primary work location" />
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
