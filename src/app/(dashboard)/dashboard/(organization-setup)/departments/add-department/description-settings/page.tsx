'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import {
    Building2, User, Calendar, Users, CheckCircle2,
    Eye, Building, Briefcase, UserCheck,
    Save, ArrowRight, ArrowLeft, Settings, FileText, CloudUpload, X, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { isValidEmployeeCapacity } from '@/lib/departmentValidation';
import { Field, SelectField, Card, fieldCls, WizardStepper, buildWizardSteps } from '@/components/departments/FormPrimitives';

const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AddDepartmentDescriptionSettings() {
    const navigate = useRouter();
    const { formData, updateFormData } = useDepartmentForm();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;
        e.target.value = ''; // allow re-selecting the same file name after removal

        setUploading(true);
        try {
            const uploaded = await Promise.all(files.map(async (file) => {
                const body = new FormData();
                body.append('file', file);
                const { data } = await api.post('/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } });
                return { name: file.name, url: data.url as string, size: file.size };
            }));
            updateFormData({ documents: [...(formData.documents || []), ...uploaded.filter((d) => d.url)] });
        } catch {
            toast.error('One or more files failed to upload.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index: number) => {
        const newDocs = [...(formData.documents || [])];
        newDocs.splice(index, 1);
        updateFormData({ documents: newDocs });
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!formData.description.trim()) next.description = 'Department Purpose is required.';
        if (!formData.keyResponsibilities.trim()) next.keyResponsibilities = 'Key Responsibilities is required.';
        if (!formData.employeeCapacity.trim()) next.employeeCapacity = 'Employee Capacity is required.';
        else if (!isValidEmployeeCapacity(formData.employeeCapacity)) next.employeeCapacity = 'Must be a positive whole number.';

        setErrors(next);
        if (Object.keys(next).length > 0) return;
        navigate.push('/dashboard/departments/add-department/review-department-details');
    };

    const clearError = (field: string) => {
        setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
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

                        <WizardStepper steps={buildWizardSteps('description-settings')} onNavigate={navigate.push} />

                        {/* Section 3: Description & Settings */}
                        <Card title={<><span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-4 h-4 text-[9px]">3</span> Description & Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 mt-2">
                                <Field title="Department Purpose" required error={errors.description}>
                                    <div className="relative mt-1">
                                        <textarea
                                            value={formData.description} onChange={e => { updateFormData({ description: e.target.value }); clearError('description'); }}
                                            className={`${fieldCls(Boolean(errors.description))} h-[70px] py-2 leading-relaxed resize-none`}
                                            placeholder="e.g. Oversees all operations related to design and branding"
                                            maxLength={300}
                                        />
                                        <div className="absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400 font-medium">{formData.description.length} / 300</div>
                                    </div>
                                </Field>

                                <Field title="Key Responsibilities" helpText="(comma separated)" required error={errors.keyResponsibilities}>
                                    <div className="relative mt-1">
                                        <textarea
                                            value={formData.keyResponsibilities} onChange={e => { updateFormData({ keyResponsibilities: e.target.value }); clearError('keyResponsibilities'); }}
                                            className={`${fieldCls(Boolean(errors.keyResponsibilities))} h-[70px] py-2 leading-relaxed resize-none`}
                                            placeholder="e.g. UI/UX Design, Branding, User Research"
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400 font-medium">{formData.keyResponsibilities.length} / 500</div>
                                    </div>
                                </Field>

                                <Field title="Employee Capacity" required helpText="Maximum number of employees" error={errors.employeeCapacity}>
                                    <div className="relative w-full">
                                        <input type="text" inputMode="numeric" value={formData.employeeCapacity} onChange={e => { updateFormData({ employeeCapacity: e.target.value.replace(/[^0-9]/g, '') }); clearError('employeeCapacity'); }} className={`${fieldCls(Boolean(errors.employeeCapacity))} pr-8`} placeholder="e.g. 50" />
                                        <Users size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>

                                <Field title="Department Keywords (Optional)" helpText="Helps in search and analytics, comma separated">
                                    <input type="text" value={formData.departmentKeywords} onChange={e => updateFormData({ departmentKeywords: e.target.value })} placeholder="Design, Creative, Interior, 3D, Visualization" className={fieldCls(false)} />
                                </Field>
                            </div>
                        </Card>

                        {/* Section: Additional Settings */}
                        <Card title={<><Settings size={14} className="text-zinc-600 mr-1" /> Additional Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3 mt-2">
                                <SelectField title="Working Days" value={formData.workingDays} onChange={e => updateFormData({ workingDays: e.target.value })} options={['Monday - Saturday', 'Monday - Friday']} helpText="Select working days" />
                                <SelectField title="Default Shift" value={formData.defaultShift} onChange={e => updateFormData({ defaultShift: e.target.value })} options={['General Shift (09:30 AM - 06:30 PM)', 'Morning Shift (06:00 AM - 02:00 PM)']} helpText="Select default shift" />
                                <Field title="Is Active" required helpText="Inactive departments will be hidden">
                                    <div className="flex items-center mt-2 h-5">
                                        <div onClick={() => updateFormData({ isActive: !formData.isActive })} className={`w-9 h-5 ${formData.isActive ? 'bg-blue-600' : 'bg-zinc-300'} rounded-full flex items-center px-0.5 cursor-pointer transition-colors`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Section: Documents (Optional) */}
                        <Card title={<><FileText size={14} className="text-blue-600 mr-1" /> Documents (Optional)</>}>
                            <p className="text-[11px] text-zinc-500 mb-3 mt-0.5">Upload department related documents (SOPs, Guidelines, Structure, etc.)</p>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" disabled={uploading} />
                            <div onClick={() => !uploading && fileInputRef.current?.click()} className={`border border-dashed border-blue-200 rounded-lg p-[18px] flex flex-col items-center justify-center text-center transition-colors bg-white ${uploading ? 'opacity-60 cursor-wait' : 'hover:bg-blue-50/20 cursor-pointer'}`}>
                                {uploading ? (
                                    <Loader2 size={24} className="text-blue-500 mb-2 animate-spin" strokeWidth={1.5} />
                                ) : (
                                    <CloudUpload size={24} className="text-blue-500 mb-2" strokeWidth={1.5} />
                                )}
                                <p className="text-[12px] font-semibold text-zinc-700">
                                    {uploading ? 'Uploading…' : <>Drag & drop files here or <span className="text-blue-600 hover:underline">click to upload</span></>}
                                </p>
                                <p className="text-[10px] text-zinc-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (Max. 10MB each)</p>
                            </div>
                            {formData.documents && formData.documents.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {formData.documents.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 border border-zinc-100 bg-zinc-50 rounded-md text-[11px]">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 overflow-hidden hover:underline">
                                                <FileText size={14} className="text-blue-500 shrink-0" />
                                                <span className="truncate font-medium text-zinc-700">{file.name}</span>
                                            </a>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {file.size ? <span className="text-zinc-400 font-medium">{formatFileSize(file.size)}</span> : null}
                                                <button type="button" onClick={() => removeFile(idx)} className="text-zinc-400 hover:text-rose-500 p-0.5">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                    </div>

                    {/* Right Sidebar Area */}
                    <div className="space-y-2 min-w-0">

                        {/* Preview Card */}
                        <Card title={<><Eye size={14} className="text-blue-600 mr-2" /> {formData._id ? 'Edit Preview' : 'Department Preview'}</>}>
                            <div className="flex items-start gap-3 mt-2 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md shadow-blue-600/20">
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

                        {/* Quick Info Card */}
                        <Card title="Quick Info">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mt-2">
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Users size={16} className="text-blue-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[13px]">{formData.employeeCapacity || '-'}</div>
                                    <div className="text-[9px] text-zinc-500">Capacity</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Building size={16} className="text-blue-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[11px] truncate w-full px-1">{formData.departmentType || '-'}</div>
                                    <div className="text-[9px] text-zinc-500">Type</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Users size={16} className="text-blue-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[13px]">0</div>
                                    <div className="text-[9px] text-zinc-500 whitespace-nowrap">Sub Dept.</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Calendar size={16} className="text-blue-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[10px] leading-tight">
                                        {formData.effectiveDate ? new Date(formData.effectiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}<br />
                                        {formData.effectiveDate ? new Date(formData.effectiveDate).getFullYear() : ''}
                                    </div>
                                    <div className="text-[8px] text-zinc-500 mt-[2px] leading-tight">Effective<br />From</div>
                                </div>
                            </div>
                        </Card>

                        {/* Tips Card */}
                        <Card title={<><span className="text-blue-600 text-[14px] mr-1">💡</span> Tips</>}>
                            <div className="space-y-2 mt-1 pb-1">
                                {[
                                    'Keep the department name short and meaningful.',
                                    'Assign the right department head for accountability.',
                                    'Add keywords to improve search and reporting.',
                                    'Review all details before final creation.'
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2 text-[10.5px]">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[1px]" />
                                        <span className="text-zinc-600 font-medium leading-relaxed">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                    </div>
                </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-auto pb-2 px-2 pt-2 flex flex-wrap items-center justify-between gap-2 shadow-sm w-full xl:w-[calc(66.666%+0.5rem)]">
                <Link href="/dashboard/departments/add-department/department-head" className="flex items-center justify-center h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                    <ArrowLeft size={14} className="mr-1.5" /> Back: Department Head
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSaveDraft} className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-blue-700 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 shadow-sm transition-colors">
                        <Save size={14} /> Save Draft
                    </button>
                    <button type="button" onClick={handleNext} className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors">
                        Next: Review & Create <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
