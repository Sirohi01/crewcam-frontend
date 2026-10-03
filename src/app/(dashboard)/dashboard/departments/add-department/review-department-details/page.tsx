'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import { createDepartment, updateDepartment } from '@/services/departmentService';
import { useRouter } from 'next/navigation';
import {
    Building2, User, Calendar, Users, CheckCircle2,
    Eye, MapPin, Building, Briefcase, UserCheck, ChevronDown,
    Save, ArrowLeft, Settings, FileText, Info, Edit, Sparkles, Check, ClipboardList, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const steps = [
    { num: 1, label: 'Basic Information', status: 'completed' },
    { num: 2, label: 'Department Head', status: 'completed' },
    { num: 3, label: 'Description & Settings', status: 'completed' },
    { num: 4, label: 'Review & Create', status: 'active' },
];

function Card({
    title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2 border-b border-zinc-50">
                    <h3 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">{title}</h3>
                    {action}
                </div>
            )}
            <div className="px-3 pb-3 pt-2">{children}</div>
        </div>
    );
}

function InfoRow({ label, value, valueClass = '', vertical = false }: { label: string; value: React.ReactNode; valueClass?: string, vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="mb-3">
                <div className="text-zinc-500 font-medium text-[11px] mb-1">{label}</div>
                <div className={`font-semibold text-zinc-800 text-[11px] leading-relaxed ${valueClass}`}>{value}</div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-[115px_10px_1fr] items-start text-[11px] mb-2.5">
            <div className="text-zinc-500 font-medium">{label}</div>
            <div className="text-zinc-400 font-medium">:</div>
            <div className={`font-semibold text-zinc-800 leading-snug  ${valueClass}`}>{value}</div>
        </div>
    );
}

export default function ReviewDepartmentDetails() {
    const { formData, resetForm } = useDepartmentForm();
    const router = useRouter();

    const handleCreate = async () => {
        try {
            if (formData._id) {
                await updateDepartment(formData._id, formData);
            } else {
                await createDepartment(formData);
            }
            resetForm();
            router.push('/dashboard/departments');
        } catch (error) {
            console.error('Failed to save department', error);
            alert('Failed to save department');
        }
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
                    description={formData._id ? "Review all details before updating the department." : "Review all details before creating the department."}
                    icon={<Building2 size={20} />}
                    breadcrumbs={[
                        { label: 'Organization Setup', href: '/dashboard' },
                        { label: 'Departments', href: '/dashboard/departments' },
                        { label: formData._id ? 'Edit Department' : 'Add Department' }
                    ]}
                />

                <div className="grid grid-cols-1 xl:grid-cols-7 gap-2">

                    {/* Left Content Area */}
                    <div className=" xl:col-span-5 space-y-2">

                        {/* Stepper Card */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm py-4 px-2">
                            <div className="flex items-center justify-between relative w-full mx-auto">
                                <div className="absolute left-[8%] right-[8%] top-[14px] h-[2px] bg-zinc-200 -z-0"></div>
                                <div className="flex w-full justify-between z-10">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold transition-colors z-10
                        ${step.status === 'completed' ? 'bg-white' :
                                                    step.status === 'active' ? 'border-2 border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                                                        'border-2 border-zinc-100 text-zinc-400 bg-zinc-50'}`}>
                                                {step.status === 'completed' ? <CheckCircle2 className="w-7 h-7 text-emerald-500 bg-white rounded-full" strokeWidth={1.5} /> : step.num}
                                            </div>
                                            <span className={`text-[10px] font-bold ${step.status === 'active' ? 'text-indigo-600' : step.status === 'completed' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Title & Edit Button */}
                        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-start justify-between">
                            <div>
                                <h2 className="text-[16px] font-bold text-zinc-900">Review Department Details</h2>
                                <p className="text-[12px] text-zinc-500 font-medium mt-1">Please review all the information below. You can go back and edit if needed.</p>
                            </div>
                            <button type="button" onClick={() => router.push('/dashboard/departments/add-department/basic-info')} className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-lg text-[11px] font-bold text-indigo-700 hover:bg-zinc-50 transition-colors shadow-sm">
                                <Edit size={12} /> Edit All Details
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {/* Basic Information */}
                            <Card title={<><Info size={14} className="text-indigo-600" /> Basic Information</>}>
                                <div className="mt-1">
                                    <InfoRow label="Department Name" value={formData.name || '-'} />
                                    <InfoRow label="Department Code" value={formData.code || '-'} />
                                    <InfoRow label="Location" value={formData._meta?.branchName || formData.branchId || '-'} />
                                    <InfoRow label="Department Type" value={formData.departmentType || 'Core Department'} />
                                    <InfoRow label="Business Unit" value={formData.businessUnit || '-'} />
                                    <InfoRow label="Status" value={<span className={`px-1.5 py-0.5 rounded ${formData.isActive ? 'bg-emerald-100/60 text-emerald-600' : 'bg-rose-100/60 text-rose-600'} text-[10px] font-bold`}>{formData.isActive ? 'Active' : 'Inactive'}</span>} />
                                </div>
                            </Card>

                            {/* Department Head */}
                            <Card title={<><User size={14} className="text-purple-600" /> Department Head</>}>
                                <div className="mt-1">
                                    <InfoRow label="Department Head (HOD)" value={formData._meta?.hodName || formData.hodEmployeeId || '-'} />
                                    <InfoRow label="Reporting To" value={formData._meta?.reportingToName || formData.reportingToId || '-'} />
                                    <InfoRow label="Assistant / Co-Head" value="-" />
                                    <InfoRow label="Effective Date" value={formData.effectiveDate || '-'} />
                                    <InfoRow label="Probation Period" value="-" />
                                    <InfoRow label="Department Email" value="-" />
                                </div>
                            </Card>

                            {/* Location & Cost Center */}
                            <Card title={<><MapPin size={14} className="text-emerald-600" /> Location & Cost Center</>}>
                                <div className="mt-1">
                                    <InfoRow label="Location" value={formData._meta?.branchName || formData.branchId || '-'} />
                                    <InfoRow label="Cost Center" value="-" />
                                    <InfoRow label="Business Unit" value={formData.businessUnit || '-'} />
                                    <InfoRow label="Budget Owner" value={formData._meta?.budgetOwnerName || formData.budgetOwnerId || '-'} />
                                </div>
                            </Card>

                            {/* Description & Settings */}
                            <Card title={<><FileText size={14} className="text-amber-500" /> Description & Settings</>}>
                                <div className="mt-1">
                                    <InfoRow vertical label="Department Purpose" value={formData.description || '-'} />
                                    <InfoRow vertical label="Key Responsibilities" value={formData.keyResponsibilities || '-'} />
                                    <InfoRow label="Employee Capacity" value={formData.employeeCapacity || '-'} />
                                </div>
                            </Card>

                            {/* Additional Settings */}
                            <Card title={<><Settings size={14} className="text-blue-500" /> Additional Settings</>}>
                                <div className="mt-1">
                                    <InfoRow label="Working Days" value={formData.workingDays || '-'} />
                                    <InfoRow label="Default Shift" value={formData.defaultShift || '-'} />
                                    <InfoRow label="Is Active" value={<span className={`px-1.5 py-0.5 rounded ${formData.isActive ? 'bg-emerald-100/60 text-emerald-600' : 'bg-rose-100/60 text-rose-600'} text-[10px] font-bold`}>{formData.isActive ? 'Yes' : 'No'}</span>} />
                                </div>
                            </Card>

                            {/* Documents */}
                            <Card title={<><FileText size={14} className="text-rose-500" /> Documents</>}>
                                <div className="mt-1">
                                    <div className="text-[11px] font-bold text-zinc-900 mb-3">Uploaded Documents</div>
                                    <div className="space-y-3">
                                        {(!formData.documents || formData.documents.length === 0) && (
                                            <div className="text-[11px] text-zinc-500">No documents uploaded.</div>
                                        )}
                                        {formData.documents && formData.documents.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-[11px]">
                                                <div className="flex items-center gap-2 text-rose-500 overflow-hidden">
                                                    <FileText size={14} className="fill-rose-50 shrink-0" />
                                                    <span className="text-zinc-700 font-semibold truncate">{file.name}</span>
                                                </div>
                                                <span className="text-zinc-500 font-medium shrink-0 ml-2">{(file.size / 1024).toFixed(0)} KB</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-zinc-800">Total Files</span>
                                        <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded text-[10px]">{formData.documents?.length || 0} Files</span>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="space-y-2 xl:col-span-2">

                        {/* Preview Card */}
                        <Card title={<><Eye size={14} className="text-indigo-600 mr-2" /> {formData._id ? 'Edit Preview' : 'Department Preview'}</>}>
                            <div className="flex items-start gap-3 mt-1 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md shadow-indigo-600/20">
                                    {formData.code || 'DS'}
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-zinc-900 leading-tight">{formData.name || 'Design Studio'}</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className={`px-1.5 py-[2px] rounded ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} text-[9px] font-bold border uppercase tracking-wider`}>{formData.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-1.5 font-medium flex items-center gap-1">
                                        <span className="font-semibold text-zinc-700">{formData.code || 'DS'}</span> &bull; {formData.departmentType || 'Core Department'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-4">
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Building size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Location</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.branchName || formData.branchId || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Briefcase size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800">{formData.businessUnit || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-1">
                                    <div className="text-zinc-400 mt-0.5"><User size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Department Head</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.hodName || formData.hodEmployeeId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-0.5">
                                    <div className="text-zinc-400 mt-0.5"><UserCheck size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Reporting To</div>
                                    <div className="font-semibold text-zinc-800">{formData._meta?.reportingToName || formData.reportingToId || '-'}</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Users size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Employee Capacity</div>
                                    <div className="font-semibold text-zinc-800">50</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Calendar size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Effective From</div>
                                    <div className="font-semibold text-zinc-800">01 May 2025</div>
                                </div>
                            </div>
                        </Card>

                        {/* What's Next Card */}
                        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-4 mt-2 relative overflow-hidden">
                            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                <Sparkles size={16} className="fill-indigo-100" />
                                <h3 className="font-bold text-[14px] text-zinc-900">What&apos;s Next?</h3>
                            </div>
                            <p className="text-[11px] text-zinc-500 mb-4 font-medium leading-relaxed">
                                After creating the department, you can:
                            </p>

                            <div className="space-y-3 relative z-10">
                                {[
                                    'Add employees to this department',
                                    'Create sub departments',
                                    'Assign goals and KPIs',
                                    'View department analytics'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-[11px]">
                                        <Check size={14} className="text-indigo-600 shrink-0 mt-[1px]" strokeWidth={2.5} />
                                        <span className="text-zinc-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="absolute right-0 -bottom-2 w-28 h-28 opacity-80 pointer-events-none z-0 flex items-end justify-end">
                                <div className="bg-indigo-50/50 rounded-tl-[40px] w-full h-full flex items-center justify-center p-4">
                                    <div className="relative">
                                        <ClipboardList size={40} className="text-indigo-200" strokeWidth={1.5} />
                                        <CheckCircle2 size={18} className="text-emerald-500 absolute -bottom-1 -right-1 bg-white rounded-full fill-emerald-50 border-2 border-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="pb-2 px-2 flex items-center justify-between shadow-sm w-[71.5%] mt-auto pt-2">
                <Link href="/dashboard/departments/add-department/description-settings" className="flex items-center justify-center h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                    <ArrowLeft size={14} className="mr-1.5" /> Back: Description & Settings
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSaveDraft} className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-indigo-700 border border-indigo-200 bg-white hover:bg-indigo-50 shadow-sm transition-colors">
                        <Save size={14} /> Save Draft
                    </button>
                    <button onClick={handleCreate} type="button" className="flex items-center justify-center gap-2 h-8 px-6 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
                        <CheckCircle size={14} /> {formData._id ? 'Update Department' : 'Create Department'}
                    </button>
                </div>
            </div>
        </div>
    );
}
