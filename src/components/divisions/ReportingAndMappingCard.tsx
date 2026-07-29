'use client';

import React from 'react';
import { GitMerge } from 'lucide-react';
import { useDivisionForm } from '@/context/DivisionFormContext';
import { Card, Field, SelectField, labelCls } from './FormHelpers';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';

export function ReportingAndMappingCard() {
    const { formData, updateFormData } = useDivisionForm();

    const departmentOptions = [
        { label: 'HR Department', value: 'hr' },
        { label: 'IT Department', value: 'it' },
        { label: 'Finance Department', value: 'finance' },
    ];

    return (
        <Card title={<><GitMerge size={16} className="text-indigo-600 mr-1" /> Reporting & Mapping</>}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-1 xl:grid-cols-2 lg:content-start">
                    <SelectField 
                        title="Report To (BU Head / Owner)" 
                        required 
                        value={formData.reportToId} 
                        onChange={e => updateFormData({ reportToId: e.target.value })} 
                        options={['Vikram Singh', 'Rahul Bajaj']} 
                        helpText="Reporting manager for this division" 
                    />
                    
                    <div className="block">
                        <span className={labelCls}>Linked Departments</span>
                        <div className="mt-1">
                            <MultiSearchableDropdown
                                options={departmentOptions}
                                values={formData.linkedDepartments}
                                onChange={(vals) => updateFormData({ linkedDepartments: vals })}
                                placeholder="Select Departments"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-tight">Departments under this division</p>
                    </div>
                </div>

                {/* Right Section - Hierarchy Diagram */}
                <div className="flex flex-col items-center justify-center pt-2 lg:pt-0">
                    <span className={`${labelCls} mb-4 block w-full text-center`}>Division Placement</span>
                    
                    <div className="flex flex-col items-center">
                        {/* Business Unit Node */}
                        <div className="px-6 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold w-40 text-center">
                            Business Unit
                        </div>
                        
                        {/* Arrow Down */}
                        <div className="h-4 border-l border-zinc-300 w-px"></div>
                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-zinc-300 -mt-px"></div>
                        <div className="h-2 w-px"></div>
                        
                        {/* Division (New) Node */}
                        <div className="px-6 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-semibold w-40 text-center shadow-sm">
                            Division (New)
                        </div>
                        
                        {/* Arrow Down */}
                        <div className="h-4 border-l border-zinc-300 w-px"></div>
                        <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-zinc-300 -mt-px"></div>
                        <div className="h-2 w-px"></div>
                        
                        {/* Departments Node */}
                        <div className="px-6 py-1.5 rounded bg-purple-50 border border-purple-200 text-purple-600 text-[11px] font-semibold w-40 text-center">
                            Departments
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
