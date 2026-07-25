'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { useDivisionForm } from '@/context/DivisionFormContext';
import { Card, Field, inputCls, textareaCls } from './FormHelpers';

export function AdditionalDetailsCard() {
    const { formData, updateFormData } = useDivisionForm();

    return (
        <Card title={<><FileText size={16} className="text-indigo-600 mr-1" /> Additional Details</>}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3">
                {/* Row 1 */}
                <Field title="Total Employees (Approx.)">
                    <input 
                        type="text" 
                        value={formData.totalEmployees} 
                        onChange={e => updateFormData({ totalEmployees: e.target.value })} 
                        className={inputCls} 
                        placeholder="Enter approx. number" 
                    />
                </Field>
                <Field title="Total Departments (Approx.)">
                    <input 
                        type="text" 
                        value={formData.totalDepartments} 
                        onChange={e => updateFormData({ totalDepartments: e.target.value })} 
                        className={inputCls} 
                        placeholder="Enter approx. number" 
                    />
                </Field>
                <Field title="Budget (FY 25-26) (₹)" helpText="Estimated annual budget for this division">
                    <div className="relative flex items-center">
                        <div className="absolute left-0 top-1 bottom-0 flex items-center justify-center w-8 bg-zinc-50 border border-zinc-200 border-r-0 rounded-l-md text-zinc-500 text-[12px] h-[30px] font-medium mt-[2px]">
                            ₹
                        </div>
                        <input 
                            type="text" 
                            value={formData.budget} 
                            onChange={e => updateFormData({ budget: e.target.value })} 
                            className={`${inputCls} pl-10`} 
                            placeholder="Enter budget amount" 
                        />
                    </div>
                </Field>
            </div>

            {/* Key Functions / Responsibilities */}
            <div className="mt-5">
                <Field title="Key Functions / Responsibilities">
                    <div className="relative mt-1">
                        <textarea 
                            value={formData.keyResponsibilities}
                            onChange={e => updateFormData({ keyResponsibilities: e.target.value })}
                            className={textareaCls} 
                            placeholder="Enter key functions or responsibilities handled by this division..."
                            maxLength={500}
                        />
                        <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400">
                            {formData.keyResponsibilities.length} / 500
                        </div>
                    </div>
                </Field>
            </div>
        </Card>
    );
}
