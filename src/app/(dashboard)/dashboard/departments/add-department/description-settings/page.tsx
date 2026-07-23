'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import {
    Building2, User, Calendar, Users, CheckCircle2,
    Eye, MapPin, Building, Briefcase, UserCheck, ChevronDown,
    Save, ArrowRight, ArrowLeft, Settings, FileText, CloudUpload
} from 'lucide-react';

const steps = [
    { num: 1, label: 'Basic Information', status: 'completed' },
    { num: 2, label: 'Department Head', status: 'completed' },
    { num: 3, label: 'Description & Settings', status: 'active' },
    { num: 4, label: 'Review & Create', status: 'pending' },
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

function SelectField({ title, required, options, helpText, defaultValue }: { title: string; required?: boolean; options: string[]; helpText?: string; defaultValue?: string }) {
    return (
        <Field title={title} required={required} helpText={helpText}>
            <div className="relative">
                <select className={selectCls} defaultValue={defaultValue || options[0]}>
                    {options.map((o) => <option key={o}>{o}</option>)}
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
                <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-1">
                    <h3 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">{title}</h3>
                    {action}
                </div>
            )}
            <div className="px-3 pb-3 pt-1">{children}</div>
        </div>
    );
}

export default function AddDepartmentDescriptionSettings() {
    return (
        <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-screen">
            <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">

                {/* Header */}
                <PageHeader
                    title="Add Department"
                    description="Create a new department to organize your teams and streamline operations."
                    icon={<Building2 size={20} />}
                    breadcrumbs={[
                        { label: 'Organization Setup', href: '/dashboard' },
                        { label: 'Departments', href: '/dashboard/departments' },
                        { label: 'Add Department' }
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

                        {/* Section 3: Description & Settings */}
                        <Card title={<><span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px]">3</span> Description & Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 mt-2">
                                <Field title="Department Purpose" required>
                                    <div className="relative mt-1">
                                        <textarea
                                            className={`${inputCls} h-[70px] py-2 leading-relaxed resize-none`}
                                            defaultValue="To create innovative and functional design solutions for retail stores, exhibitions and corporate interiors."
                                        />
                                        <div className="absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400 font-medium">109 / 300</div>
                                    </div>
                                </Field>

                                <Field title="Key Responsibilities" helpText="(comma separated)" required>
                                    <div className="relative mt-1">
                                        <textarea
                                            className={`${inputCls} h-[70px] py-2 leading-relaxed resize-none`}
                                            defaultValue="Retail Design, Exhibition Design, 3D Visualization, Working Drawings, BOQ, Material Selection, Client Presentation, Site Design Support"
                                        />
                                        <div className="absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400 font-medium">102 / 500</div>
                                    </div>
                                </Field>

                                <Field title="Employee Capacity" required helpText="Maximum number of employees">
                                    <div className="relative w-full">
                                        <input type="text" defaultValue="50" className={`${inputCls} pr-8`} />
                                        <Users size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>

                                <Field title="Department Keywords (Optional)" helpText="Helps in search and analytics">
                                    <input type="text" defaultValue="Design, Creative, Interior, 3D, Visualization" className={inputCls} />
                                </Field>
                            </div>
                        </Card>

                        {/* Section: Additional Settings */}
                        <Card title={<><Settings size={14} className="text-zinc-600 mr-1" /> Additional Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3 mt-2">
                                <SelectField title="Working Days" options={['Monday - Saturday']} helpText="Select working days" />
                                <SelectField title="Default Shift" options={['General Shift (09:30 AM - 06:30 PM)']} helpText="Select default shift" />
                                <Field title="Is Active" required helpText="Inactive departments will be hidden">
                                    <div className="flex items-center mt-2 h-5">
                                        <div className="w-9 h-5 bg-indigo-600 rounded-full flex items-center px-0.5 cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4"></div>
                                        </div>
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Section: Documents (Optional) */}
                        <Card title={<><FileText size={14} className="text-indigo-600 mr-1" /> Documents (Optional)</>}>
                            <p className="text-[11px] text-zinc-500 mb-3 mt-0.5">Upload department related documents (SOPs, Guidelines, Structure, etc.)</p>
                            <div className="border border-dashed border-indigo-200 rounded-lg p-[18px] flex flex-col items-center justify-center text-center hover:bg-indigo-50/20 transition-colors cursor-pointer bg-white">
                                <CloudUpload size={24} className="text-indigo-500 mb-2" strokeWidth={1.5} />
                                <p className="text-[12px] font-semibold text-zinc-700">Drag & drop files here or <span className="text-indigo-600 hover:underline">click to upload</span></p>
                                <p className="text-[10px] text-zinc-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (Max. 10MB each)</p>
                            </div>
                        </Card>

                    </div>

                    {/* Right Sidebar Area */}
                    <div className="space-y-2">

                        {/* Preview Card */}
                        <Card title={<><Eye size={14} className="text-indigo-600 mr-2" /> Department Preview</>}>
                            <div className="flex items-start gap-3 mt-2 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md shadow-indigo-600/20">
                                    DS
                                </div>
                                <div>
                                    <h3 className="text-[14px] font-bold text-zinc-900 leading-tight">Design Studio</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="px-1.5 py-[2px] rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold border border-emerald-100 uppercase tracking-wider">Active</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-1.5 font-medium flex items-center gap-1">
                                        <span className="font-semibold text-zinc-700">DS</span> &bull; Core Department
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-4">
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Building size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Parent Department</div>
                                    <div className="font-semibold text-zinc-800">Business Operations</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px]">
                                    <div className="text-zinc-400 mt-0.5"><Briefcase size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800">Retail Interiors & Exhibition</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-1">
                                    <div className="text-zinc-400 mt-1"><User size={14} /></div>
                                    <div className="text-zinc-500 mt-[3px] font-medium">Department Head</div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/150?u=aman" alt="Aman" className="w-7 h-7 rounded-full border border-zinc-200 shadow-sm" />
                                        <div className="leading-tight">
                                            <div className="font-bold text-zinc-800 text-[11.5px]">Aman Malhotra</div>
                                            <div className="text-[9.5px] text-zinc-500 font-medium mt-[1px]">Design Director</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-0.5">
                                    <div className="text-zinc-400 mt-1"><UserCheck size={14} /></div>
                                    <div className="text-zinc-500 mt-[3px] font-medium">Reporting To</div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/150?u=rajesh" alt="Rajesh" className="w-7 h-7 rounded-full border border-zinc-200 shadow-sm" />
                                        <div className="leading-tight">
                                            <div className="font-bold text-zinc-800 text-[11.5px]">Rajesh Sharma</div>
                                            <div className="text-[9.5px] text-zinc-500 font-medium mt-[1px]">Managing Director</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-4 items-start text-[11px] mt-1">
                                    <div className="text-zinc-400 mt-0.5"><MapPin size={14} /></div>
                                    <div className="text-zinc-500 font-medium">Location</div>
                                    <div className="font-semibold text-zinc-800">Noida - Head Office</div>
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

                        {/* Quick Info Card */}
                        <Card title="Quick Info">
                            <div className="grid grid-cols-4 gap-2 text-center mt-2">
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Users size={16} className="text-indigo-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[13px]">50</div>
                                    <div className="text-[9px] text-zinc-500">Capacity</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Building size={16} className="text-indigo-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[13px]">Core</div>
                                    <div className="text-[9px] text-zinc-500">Type</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Users size={16} className="text-indigo-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[13px]">1</div>
                                    <div className="text-[9px] text-zinc-500 whitespace-nowrap">Sub Dept.</div>
                                </div>
                                <div className="py-2.5 px-1 border border-zinc-100 rounded-lg bg-zinc-50/50 flex flex-col items-center justify-center">
                                    <Calendar size={16} className="text-indigo-600 mb-1.5" />
                                    <div className="font-bold text-zinc-800 text-[10px] leading-tight">01 May<br />2025</div>
                                    <div className="text-[8px] text-zinc-500 mt-[2px] leading-tight">Effective<br />From</div>
                                </div>
                            </div>
                        </Card>

                        {/* Tips Card */}
                        <Card title={<><span className="text-indigo-600 text-[14px] mr-1">💡</span> Tips</>}>
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
            <div className="pb-2 px-2 flex items-center justify-between shadow-sm w-[67%] mt-auto pt-2">
                <Link href="/dashboard/departments/add-department/department-head" className="flex items-center justify-center h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                    <ArrowLeft size={14} className="mr-1.5" /> Back: Department Head
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 shadow-sm transition-colors">
                        <Save size={14} /> Save Draft
                    </button>
                    <Link href="/dashboard/departments/add-department/review-department-details" className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
                        Next: Review & Create <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
