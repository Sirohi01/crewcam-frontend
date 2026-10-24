'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import {
    Building2, User, Calendar, Users, CheckCircle2,
    Eye, Building, Briefcase, UserCheck,
    Save, ArrowRight, ArrowLeft,
    ShieldCheck, Map, Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ApiSearchableSelect } from '@/components/common/ApiSearchableSelect';
import { isValidDepartmentEmail, isValidProbationPeriod } from '@/lib/departmentValidation';
import { Field, Card, fieldCls, WizardStepper, buildWizardSteps } from '@/components/departments/FormPrimitives';

export default function AddDepartmentHead() {
    const navigate = useRouter();
    const { formData, updateFormData, updateMeta } = useDepartmentForm();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!formData.effectiveDate) next.effectiveDate = 'Effective Date is required.';
        if (!formData.businessUnit) next.businessUnit = 'Business Unit is required.';
        if (!isValidDepartmentEmail(formData.departmentEmail)) next.departmentEmail = 'Not a valid email address.';
        if (!isValidProbationPeriod(formData.probationPeriodMonths)) next.probationPeriodMonths = 'Must be 0-24 months.';

        setErrors(next);
        if (Object.keys(next).length > 0) return;
        navigate.push('/dashboard/departments/add-department/description-settings');
    };

    const handleSaveDraft = () => {
        localStorage.setItem('departmentFormDraft', JSON.stringify(formData));
        toast.success('Draft saved successfully!');
    };

    return (
        <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-screen">
            <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">

                {/* Header */}
                <PageHeader
                    title={formData._id ? "Edit Department" : "Add Department"}
                    description={formData._id ? "Step 2 of 4: Department Head — Update leadership and reporting structure for this department." : "Step 2 of 4: Department Head — Assign leadership and reporting structure for this department."}
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

                        <WizardStepper steps={buildWizardSteps('department-head')} onNavigate={navigate.push} />

                        {/* Department Leadership Card */}
                        <Card title={<><ShieldCheck size={16} className="text-blue-600 mr-1" /> Department Leadership</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 mt-1">
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

                                <Field title="Reporting To" helpText="Can be assigned later">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="employee"
                                            value={formData.reportingToId}
                                            onChange={(val) => updateFormData({ reportingToId: val })}
                                            onLabelChange={(label) => updateMeta({ reportingToName: label })}
                                            placeholder="Select Manager"
                                        />
                                    </div>
                                </Field>

                                <Field title="Assistant / Co-Head" helpText="Optional">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="employee"
                                            value={formData.assistantCoHeadId}
                                            onChange={(val) => updateFormData({ assistantCoHeadId: val })}
                                            onLabelChange={(label) => updateMeta({ assistantCoHeadName: label })}
                                            placeholder="Select assistant or co-head"
                                        />
                                    </div>
                                </Field>

                                <Field title="Effective Date" required helpText="From when this department will be active" error={errors.effectiveDate}>
                                    <input type="date" value={formData.effectiveDate} onChange={e => updateFormData({ effectiveDate: e.target.value })} className={fieldCls(Boolean(errors.effectiveDate))} />
                                </Field>

                                <Field title="Probation Period (Months)" helpText="For new employees in this department" error={errors.probationPeriodMonths}>
                                    <input type="text" inputMode="numeric" value={formData.probationPeriodMonths} onChange={e => updateFormData({ probationPeriodMonths: e.target.value.replace(/[^0-9]/g, '') })} className={fieldCls(Boolean(errors.probationPeriodMonths))} placeholder="e.g. 3" />
                                </Field>

                                <Field title="Department Email" helpText="Official email for this department" error={errors.departmentEmail}>
                                    <input type="email" value={formData.departmentEmail} onChange={e => updateFormData({ departmentEmail: e.target.value })} className={fieldCls(Boolean(errors.departmentEmail))} placeholder="e.g. designstudio@yourcompany.com" />
                                </Field>
                            </div>
                        </Card>

                        {/* Location & Cost Center Card */}
                        <Card title={<><Map size={16} className="text-blue-600 mr-1" /> Location & Cost Center</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 mt-1">
                                <Field title="Location" helpText="Defaults to Head Office if left blank">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="branch"
                                            value={formData.branchId}
                                            onChange={(val) => updateFormData({ branchId: val })}
                                            onLabelChange={(label) => updateMeta({ branchName: label })}
                                            placeholder="Select Location"
                                        />
                                    </div>
                                </Field>

                                <Field title="Cost Center" helpText="Optional">
                                    <input type="text" value={formData.costCenter} onChange={e => updateFormData({ costCenter: e.target.value })} className={fieldCls(false)} placeholder="e.g. CC-101" />
                                </Field>

                                <Field title="Business Unit" required helpText="Select business unit" error={errors.businessUnit}>
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="business-unit"
                                            value={formData.businessUnit}
                                            onChange={(val) => updateFormData({ businessUnit: val })}
                                            onLabelChange={(label) => updateMeta({ businessUnitName: label })}
                                            placeholder="Select Business Unit"
                                        />
                                    </div>
                                </Field>

                                <Field title="Budget Owner" helpText="Person responsible for budget">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="employee"
                                            value={formData.budgetOwnerId || ''}
                                            onChange={(val) => updateFormData({ budgetOwnerId: val })}
                                            onLabelChange={(label) => updateMeta({ budgetOwnerName: label })}
                                            placeholder="Select Budget Owner"
                                        />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Bottom Footer Actions */}
                        <div className="pb-2 flex flex-wrap items-center justify-between gap-2 shadow-sm w-full mt-4">
                            <Link href="/dashboard/departments/add-department/basic-info" className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                                <ArrowLeft size={14} /> Back: Basic Information
                            </Link>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={handleSaveDraft} className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-blue-700 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 shadow-sm transition-colors">
                                    <Save size={14} /> Save Draft
                                </button>
                                <button type="button" onClick={handleNext} className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors">
                                    Next: Description & Settings <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                    </div>
                    {/* Right Sidebar Area */}
                    <div className="space-y-2 min-w-0">

                        {/* Preview Card */}
                        <Card title={<><Eye size={13} className="text-blue-600 mr-2" /> {formData._id ? 'Edit Preview' : 'Department Preview'}</>}>
                            <div className="flex items-start gap-3 mt-1 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-bold shrink-0 shadow-md shadow-blue-600/20">
                                    {formData.code || 'DS'}
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-zinc-900 leading-tight">{formData.name || 'Department Name'}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className={`px-1.5 py-[2px] rounded ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} text-[9px] font-bold border uppercase tracking-wider`}>
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-1 font-medium flex items-center gap-1">
                                        <span className="font-semibold text-zinc-700">{formData.code}</span> &bull; {formData.departmentType || 'Core Department'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-zinc-100 pt-2">
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Building size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Parent Department</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.branchName || formData.branchId || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Briefcase size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.businessUnitName || formData.businessUnit || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><User size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Department Head</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.hodName || formData.hodEmployeeId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400 mt-0.5"><UserCheck size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Reporting To</div>
                                    <div className="font-semibold text-zinc-800 truncate">{formData._meta?.reportingToName || formData.reportingToId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Users size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Employee Capacity</div>
                                    <div className="font-semibold text-zinc-800">{formData.employeeCapacity || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Calendar size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Effective From</div>
                                    <div className="font-semibold text-zinc-800">{formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Progress Card */}
                        <Card>
                            <div className="flex items-center gap-1.5 mb-2 px-1">
                                <h3 className="text-[12px] font-bold text-zinc-800">Progress</h3>
                            </div>
                            <div className="space-y-2">
                                {buildWizardSteps('department-head').map((step) => (
                                    <div key={step.key} className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                            {step.status === 'completed' ? (
                                                <CheckCircle2 size={13} className="text-emerald-500" />
                                            ) : (
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${step.status === 'active' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>{step.num}</div>
                                            )}
                                            <span className={`font-medium ${step.status === 'active' ? 'font-bold text-zinc-900' : step.status === 'completed' ? 'text-zinc-700' : 'text-zinc-500'}`}>{step.label}</span>
                                        </div>
                                        <span className={`font-bold text-[10px] ${step.status === 'completed' ? 'text-emerald-600' : step.status === 'active' ? 'text-blue-600' : 'text-zinc-400'}`}>
                                            {step.status === 'completed' ? 'Completed' : step.status === 'active' ? 'In Progress' : 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Tip Card */}
                        <div className="bg-blue-50/60 border border-blue-100/60 rounded-xl p-3 flex gap-2.5">
                            <Lightbulb size={14} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[11px] font-bold text-zinc-900 mb-0.5">Tip</h4>
                                <p className="text-[9.5px] text-zinc-600 font-medium leading-relaxed">
                                    Assign the right leader and reporting manager to ensure clear accountability and smooth operations.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
