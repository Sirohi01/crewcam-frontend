'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import { Building2, User, Calendar, Users, CheckCircle2, HelpCircle, Eye, Building, Briefcase, UserCheck, ChevronDown, Save, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ApiSearchableSelect } from '@/components/common/ApiSearchableSelect';
import { isValidEmployeeCapacity, sanitizeDepartmentCode } from '@/lib/departmentValidation';
import { Field, SelectField, Card, fieldCls, WizardStepper, buildWizardSteps } from '@/components/departments/FormPrimitives';

export default function BasicInformation() {
    const { formData, updateFormData, updateMeta } = useDepartmentForm();
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!formData.name.trim()) next.name = 'Department Name is required.';
        if (!formData.code.trim()) next.code = 'Department Code is required.';
        if (!formData.departmentType.trim()) next.departmentType = 'Department Type is required.';
        if (!formData.businessUnit.trim()) next.businessUnit = 'Business Unit is required.';
        if (!formData.effectiveDate) next.effectiveDate = 'Effective Date is required.';
        if (!isValidEmployeeCapacity(formData.employeeCapacity)) next.employeeCapacity = 'Must be a positive whole number.';

        setErrors(next);
        if (Object.keys(next).length > 0) return;
        router.push('/dashboard/departments/add-department/department-head');
    };

    // Clears a single field's error as soon as it changes, instead of leaving the red
    // border up until the next full validation pass.
    const clearError = (field: string) => {
        setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
    };

    const handleSaveDraft = () => {
        localStorage.setItem('departmentFormDraft', JSON.stringify(formData));
        toast.success('Draft saved successfully!');
    };

    useEffect(() => {
        if (formData.name && !formData.code) {
            const words = formData.name.split(' ').filter(Boolean);
            const code = words.length > 1
                ? words.map(w => w[0]).join('').toUpperCase().substring(0, 5)
                : formData.name.substring(0, 3).toUpperCase();
            updateFormData({ code: sanitizeDepartmentCode(code) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.name]);

    return (
        <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-screen">
            <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">

                {/* Header */}
                <PageHeader
                    title={formData._id ? "Edit Department" : "Add Department"}
                    description={formData._id ? "Update the details of your existing department." : "Create a new department to organize your teams and streamline operations."}
                    icon={<Building2 size={20} />}
                    breadcrumbs={[
                        { label: 'Organization Setup', href: '/dashboard' },
                        { label: 'Departments', href: '/dashboard/departments' },
                        { label: formData._id ? 'Edit Department' : 'Add Department' }
                    ]}
                />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">

                    {/* Left Content Area (Forms) */}
                    <div className="xl:col-span-2 space-y-2 min-w-0">

                        <WizardStepper steps={buildWizardSteps('basic-info')} onNavigate={router.push} />

                        {/* Basic Information */}
                        <Card title={<><span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px]">1</span> Basic Information</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 mt-0.5">
                                <Field title="Department Name" required helpText="e.g. Design Studio" error={errors.name}>
                                    <input type="text" value={formData.name} onChange={e => { updateFormData({ name: e.target.value }); clearError('name'); }} className={fieldCls(Boolean(errors.name))} placeholder="e.g. Design Studio" />
                                </Field>
                                <Field title="Department Code" required helpText="Auto generated" error={errors.code}>
                                    <input type="text" value={formData.code} onChange={e => { updateFormData({ code: sanitizeDepartmentCode(e.target.value) }); clearError('code'); }} className={fieldCls(Boolean(errors.code))} placeholder="e.g. DSGN" maxLength={10} />
                                </Field>

                                <Field title="Parent Department" helpText="Select parent department (if any)">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="branch"
                                            value={formData.branchId}
                                            onChange={(val) => updateFormData({ branchId: val })}
                                            onLabelChange={(label) => updateMeta({ branchName: label })}
                                            placeholder="Select parent department"
                                        />
                                    </div>
                                </Field>
                                <SelectField title="Department Type" value={formData.departmentType} onChange={e => { updateFormData({ departmentType: e.target.value }); clearError('departmentType'); }} required options={['Core Department', 'Support', 'Admin', 'Other']} helpText="Core / Support / Admin / Other" error={errors.departmentType} />

                                <Field title="Business Unit" required helpText="Select business unit" error={errors.businessUnit}>
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="business-unit"
                                            value={formData.businessUnit}
                                            onChange={(val) => { updateFormData({ businessUnit: val }); clearError('businessUnit'); }}
                                            onLabelChange={(label) => updateMeta({ businessUnitName: label })}
                                            placeholder="Select Business Unit"
                                        />
                                    </div>
                                </Field>

                                <Field title="Status" required helpText="Active departments are visible in system">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 z-10 pointer-events-none shadow-sm"></div>
                                        <select value={formData.isActive ? 'Active' : 'Inactive'} onChange={e => updateFormData({ isActive: e.target.value === 'Active' })} className={`${fieldCls(false, 'select')} pl-7 text-zinc-900 font-medium`}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Department Head */}
                        <Card title={<><span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px]">2</span> Department Head</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 mt-0.5">
                                <Field title="Department Head (HOD)" helpText="Can be assigned later">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="employee"
                                            value={formData.hodEmployeeId}
                                            onChange={(val) => updateFormData({ hodEmployeeId: val })}
                                            onLabelChange={(label) => updateMeta({ hodName: label })}
                                            placeholder="Select HOD"
                                        />
                                    </div>
                                </Field>

                                <Field title="Reporting To" helpText="Select reporting manager">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="employee"
                                            value={formData.reportingToId}
                                            onChange={(val) => updateFormData({ reportingToId: val })}
                                            onLabelChange={(label) => updateMeta({ reportingToName: label })}
                                            placeholder="Select Reporting To"
                                        />
                                    </div>
                                </Field>

                                <Field title="Effective Date" required helpText="From when this department will be active" error={errors.effectiveDate}>
                                    <input type="date" value={formData.effectiveDate} onChange={e => { updateFormData({ effectiveDate: e.target.value }); clearError('effectiveDate'); }} className={fieldCls(Boolean(errors.effectiveDate))} />
                                </Field>
                            </div>
                        </Card>

                        {/* Description & Settings */}
                        <Card title={<><span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px]">3</span> Description & Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 mt-0.5">
                                <Field title="Department Purpose">
                                    <div className="relative">
                                        <textarea
                                            value={formData.description} onChange={e => updateFormData({ description: e.target.value })}
                                            className={`${fieldCls(false)} h-[70px] py-2 leading-relaxed`}
                                            placeholder="e.g. Oversees all operations related to design and branding"
                                            maxLength={300}
                                        />
                                        <div className="absolute bottom-1.5 left-2.5 text-[9px] text-zinc-400 font-medium">{formData.description.length} / 300</div>
                                    </div>
                                </Field>

                                <Field title="Key Responsibilities" helpText="(comma separated)">
                                    <div className="relative">
                                        <textarea
                                            value={formData.keyResponsibilities} onChange={e => updateFormData({ keyResponsibilities: e.target.value })}
                                            className={`${fieldCls(false)} h-[70px] py-2 leading-relaxed`}
                                            placeholder="e.g. UI/UX Design, Branding, User Research"
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-1.5 left-2.5 text-[9px] text-zinc-400 font-medium">{formData.keyResponsibilities.length} / 500</div>
                                    </div>
                                </Field>

                                <Field title="Employee Capacity" helpText="Maximum number of employees" error={errors.employeeCapacity}>
                                    <div className="relative w-full sm:w-1/2">
                                        <input type="text" inputMode="numeric" value={formData.employeeCapacity} onChange={e => { updateFormData({ employeeCapacity: e.target.value.replace(/[^0-9]/g, '') }); clearError('employeeCapacity'); }} className={`${fieldCls(Boolean(errors.employeeCapacity))} pr-8`} placeholder="e.g. 50" />
                                        <Users size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                    </div>

                    {/* Right Sidebar Area */}
                    <div className="space-y-2 min-w-0">

                        {/* Preview Card */}
                        <Card title={<><Eye size={14} className="text-blue-600 mr-2" /> {formData._id ? 'Edit Preview' : 'Department Preview'}</>}>
                            <div className="flex items-start gap-3 mt-1 mb-4">
                                <div className="min-w-10 w-auto px-1 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg font-semibold shrink-0 shadow-sm shadow-blue-600/20">
                                    {formData.code || 'DS'}
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-zinc-900 leading-tight">{formData.name || 'Department Name'}</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className={`px-1.5 py-[2px] rounded ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} text-[9px] font-bold border uppercase tracking-wider`}>
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-1.5 font-medium flex items-center gap-1">
                                        <span className="font-semibold text-zinc-700">{formData.code}</span> &bull; {formData.departmentType || 'Core Department'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-4">
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Building size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Parent Department</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.branchName || formData.branchId || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Briefcase size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.businessUnitName || formData.businessUnit || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-1">
                                    <div className="text-zinc-400 mt-0.5"><User size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Department Head</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.hodName || formData.hodEmployeeId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-1">
                                    <div className="text-zinc-400 mt-0.5"><UserCheck size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Reporting To</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.reportingToName || formData.reportingToId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Users size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Employee Capacity</div>
                                    <div className="font-semibold text-zinc-800">{formData.employeeCapacity || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Calendar size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Effective From</div>
                                    <div className="font-semibold text-zinc-800">{formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Tips Card */}
                        <Card title={<><span className="text-blue-600 text-[14px] mr-1">💡</span> Tips</>}>
                            <div className="space-y-2 mt-1 pb-1">
                                {[
                                    'Use a unique and short department name',
                                    'Choose the right parent department',
                                    'Assign a suitable department head',
                                    'Set appropriate employee capacity',
                                    'Review all details before creating'
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10.5px]">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[1px]" />
                                        <span className="text-zinc-600 font-medium leading-relaxed">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Help Card */}
                        <div className="bg-blue-50/60 border border-zinc-200 rounded-xl p-5 flex flex-wrap gap-3">
                            <div className="pr-2 flex-1 min-w-[160px]">
                                <h4 className="text-[14px] font-bold text-zinc-900 mb-1.5">Need Help?</h4>
                                <p className="text-[12px] text-zinc-600 mb-4 font-medium leading-relaxed">Learn more about departments in HRMS.</p>
                            </div>
                            <button type="button" className="px-4 whitespace-nowrap flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white h-9 text-[12px] font-bold text-blue-700 hover:bg-blue-50 shadow-sm transition-colors">
                                <HelpCircle size={14} /> View Guide
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-auto pb-2 px-2 pt-2 flex flex-wrap items-center justify-between gap-2 shadow-sm w-full xl:w-[calc(66.666%+0.5rem)]">
                <Link href="/dashboard/departments" className="flex items-center justify-center h-8 px-5 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                    Cancel
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSaveDraft} className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-blue-700 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 shadow-sm transition-colors">
                        <Save size={14} /> Save Draft
                    </button>
                    <button type="button" onClick={handleNext} className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors">
                        Next: Department Head <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
