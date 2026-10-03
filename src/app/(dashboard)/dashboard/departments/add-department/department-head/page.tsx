'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import {
    Building2, ChevronRight, User, Calendar, Users, CheckCircle2,
    HelpCircle, Eye, MapPin, Building, Briefcase, UserCheck, ChevronDown,
    X, Save, ArrowRight, ArrowLeft,
    ShieldCheck, Map, Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ApiSearchableSelect } from '@/components/common/ApiSearchableSelect';

const steps = [
    { num: 1, label: 'Basic Information', status: 'completed', link: '/dashboard/departments/add-department/basic-info' },
    { num: 2, label: 'Department Head', status: 'active', link: '/dashboard/departments/add-department/department-head' },
    { num: 3, label: 'Description & Settings', status: 'pending', link: '/dashboard/departments/add-department/description' },
    { num: 4, label: 'Review & Create', status: 'pending', link: '/dashboard/departments/add-department/review' },
];

const inputCls = 'mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[11px] font-semibold text-zinc-700';
const helpTextCls = 'text-[10px] text-zinc-400 mt-1 leading-tight';

function Field({
    title, required, children, helpText
}: { title: string; required?: boolean; children: React.ReactNode; helpText?: string }) {
    return (
        <label className="block">
            <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
            {children}
            {helpText && <p className={helpTextCls}>{helpText}</p>}
        </label>
    );
}

function SelectField({ title, required, options, helpText, value, onChange }: { title: string; required?: boolean; options: string[]; helpText?: string; value?: string; onChange?: (e: any) => void }) {
    return (
        <Field title={title} required={required} helpText={helpText}>
            <div className="relative">
                <select className={selectCls} value={value} onChange={onChange || (() => {})}>
                    <option value="" disabled>Select {title}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
        </Field>
    );
}

function Card({
    title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center justify-between gap-2 px-3 pt-2.5">
                    <h3 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">{title}</h3>
                    {action}
                </div>
            )}
            <div className="px-3 pb-3 pt-1">{children}</div>
        </div>
    );
}

export default function AddDepartmentHead() {
    const navigate = useRouter();
    const { formData, updateFormData, updateMeta } = useDepartmentForm();

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        // Just checking effectiveDate and businessUnit as they are required fields mapped to formData.
        // Also checking hodEmployeeId and reportingToId if they are treated as required.
        if (!formData.effectiveDate || !formData.businessUnit) {
            toast.error('Please fill in all required fields to proceed.');
            return;
        }
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
                    <div className="xl:col-span-2 space-y-2">

                        {/* Stepper Card */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm py-4 px-2">
                            <div className="flex items-center justify-between relative w-full mx-auto">
                                <div className="absolute left-[8%] right-[8%] top-[14px] h-[2px] bg-zinc-200 -z-0"></div>
                                <div className="flex w-full justify-between z-10">
                                    {steps.map((step, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => step.link ? navigate.push(step.link) : null}
                                            className={`flex flex-col items-center gap-2 bg-white px-2 ${step.link ? 'cursor-pointer hover:opacity-80' : ''}`}
                                        >
                                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-colors z-10
                        ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                                                    step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                                                        'border-zinc-100 text-zinc-400 bg-zinc-50'}`}>
                                                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" strokeWidth={3} /> : step.num}
                                            </div>
                                            <span className={`text-[10px] font-bold ${step.status === 'active' ? 'text-indigo-600' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Department Leadership Card */}
                        <Card title={<><ShieldCheck size={16} className="text-indigo-600 mr-1" /> Department Leadership</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-3 mt-1">
                                <Field title="Department Head (HOD)" required>
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

                                <Field title="Reporting To" required>
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

                                {/* No assistantHodId in default form data, but we can add it if needed, or omit for now */}

                                <Field title="Effective Date" required helpText="From when this department will be active">
                                    <input type="date" value={formData.effectiveDate} onChange={e => updateFormData({ effectiveDate: e.target.value })} className={inputCls} />
                                </Field>

                                <Field title="Probation Period (Months)" helpText="For new employees in this department">
                                    <input type="text" defaultValue="3" className={inputCls} />
                                </Field>

                                <Field title="Department Email" helpText="Official email for this department">
                                    <input type="text" defaultValue="designstudio@designhouse.co.in" className={inputCls} />
                                </Field>
                            </div>
                        </Card>

                        {/* Location & Cost Center Card */}
                        <Card title={<><Map size={16} className="text-indigo-600 mr-1" /> Location & Cost Center</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-3 mt-1">
                                <Field title="Location" required helpText="Primary">
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

                                <Field title="Cost Center" required helpText="Unique cost center code">
                                    <input type="text" className={inputCls} placeholder="e.g. CC-101" />
                                </Field>

                                <Field title="Business Unit" required helpText="Select business unit">
                                    <div className="mt-1">
                                        <ApiSearchableSelect
                                            apiType="business-unit"
                                            value={formData.businessUnit}
                                            onChange={(val) => updateFormData({ businessUnit: val })}
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
                        <div className="pb-2  flex items-center justify-between shadow-sm w-full mt-4">
                            <Link href="/dashboard/departments/add-department/basic-info" className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                                <ArrowLeft size={14} /> Back: Basic Information
                            </Link>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={handleSaveDraft} className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 shadow-sm transition-colors">
                                    <Save size={14} /> Save Draft
                                </button>
                                <button type="button" onClick={handleNext} className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
                                    Next: Description & Settings <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                    </div>                    {/* Right Sidebar Area */}
                    <div className="space-y-2">

                        {/* Preview Card */}
                        <Card title={<><Eye size={13} className="text-indigo-600 mr-2" /> {formData._id ? 'Edit Preview' : 'Department Preview'}</>}>
                            <div className="flex items-start gap-3 mt-1 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-base font-bold shrink-0 shadow-md shadow-indigo-600/20">
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
                                    <div className="text-zinc-500 font-medium">Location</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.branchName || formData.branchId || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Briefcase size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800">{formData.businessUnit || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><User size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Department Head</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.hodName || formData.hodEmployeeId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400 mt-0.5"><UserCheck size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Reporting To</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.reportingToName || formData.reportingToId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><MapPin size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Location</div>
                                    <div className="font-semibold text-zinc-800">Noida - Head Office</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Users size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Employee Capacity</div>
                                    <div className="font-semibold text-zinc-800">50</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Calendar size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Effective From</div>
                                    <div className="font-semibold text-zinc-800">01 May 2025</div>
                                </div>
                            </div>
                        </Card>

                        {/* Progress Card */}
                        <Card>
                            <div className="flex items-center gap-1.5 mb-2 px-1">
                                <h3 className="text-[12px] font-bold text-zinc-800">Progress</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={13} className="text-emerald-500" />
                                        <span className="font-medium text-zinc-700">Basic Information</span>
                                    </div>
                                    <span className="text-emerald-600 font-bold text-[10px]">Completed</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[8px] font-bold">2</div>
                                        <span className="font-bold text-zinc-900">Department Head</span>
                                    </div>
                                    <span className="text-indigo-600 font-bold text-[10px]">In Progress</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[8px] font-bold">3</div>
                                        <span className="font-medium text-zinc-500">Description & Settings</span>
                                    </div>
                                    <span className="text-zinc-400 font-medium text-[10px]">Pending</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[8px] font-bold">4</div>
                                        <span className="font-medium text-zinc-500">Review & Create</span>
                                    </div>
                                    <span className="text-zinc-400 font-medium text-[10px]">Pending</span>
                                </div>
                            </div>
                        </Card>

                        {/* Tip Card */}
                        <div className="bg-indigo-50/60 border border-indigo-100/60 rounded-xl p-3 flex gap-2.5">
                            <Lightbulb size={14} className="text-indigo-600 shrink-0 mt-0.5" />
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
