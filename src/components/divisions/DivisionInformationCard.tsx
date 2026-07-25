'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { useDivisionForm } from '@/context/DivisionFormContext';
import { Card, Field, SelectField, inputCls, textareaCls } from './FormHelpers';

export function DivisionInformationCard() {
    const { formData, updateFormData } = useDivisionForm();

    return (
        <Card title={<><Building2 size={16} className="text-indigo-600 mr-1" /> Division Information</>}>
            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-3">
                {/* Row 1 */}
                <Field title="Division Name" required helpText="e.g., Interior Division">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => updateFormData({ name: e.target.value })}
                        className={inputCls}
                        placeholder="Enter division name"
                    />
                </Field>
                <Field title="Division Code" required helpText="e.g., DIV-ID (max 10 characters)">
                    <input
                        type="text"
                        value={formData.code}
                        onChange={e => updateFormData({ code: e.target.value })}
                        className={inputCls}
                        placeholder="Enter short code"
                        maxLength={10}
                    />
                </Field>
                <SelectField
                    title="Business Unit"
                    required
                    value={formData.businessUnit}
                    onChange={e => updateFormData({ businessUnit: e.target.value })}
                    options={['Retail Interiors & Exhibition', 'Corporate', 'Sales']}
                    helpText="Choose the BU this division belongs to"
                />

                {/* Row 2 */}
                <SelectField
                    title="Head / Owner"
                    required
                    value={formData.headEmployeeId}
                    onChange={e => updateFormData({ headEmployeeId: e.target.value })}
                    options={['Aman Malhotra', 'Neha Sethi']}
                    helpText="Person responsible for this division"
                />
                <SelectField
                    title="Parent Division"
                    value={formData.parentDivisionId}
                    onChange={e => updateFormData({ parentDivisionId: e.target.value })}
                    options={['Main Operations', 'Support Systems']}
                    helpText="Choose parent division (optional)"
                />
                <Field title="Status" required helpText="Choose current status">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 z-10 pointer-events-none shadow-sm"></div>
                        <select
                            value={formData.isActive ? 'Active' : 'Inactive'}
                            onChange={e => updateFormData({ isActive: e.target.value === 'Active' })}
                            className={`${inputCls} appearance-none pl-7 text-zinc-900 font-medium`}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </Field>
            </div>

            {/* Division Description */}
            <div className="mt-2">
                <Field title="Division Description">
                    <div className="relative mt-1">
                        <textarea
                            value={formData.description}
                            onChange={e => updateFormData({ description: e.target.value })}
                            className={textareaCls}
                            placeholder="Enter a brief description about this division, its purpose and key responsibilities..."
                            maxLength={500}
                        />
                        <div className="absolute bottom-2 right-2 text-[10px] text-zinc-400">
                            {formData.description.length} / 500
                        </div>
                    </div>
                </Field>
            </div>
        </Card>
    );
}
