'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import {
    Building2, ChevronRight, User, Calendar, Users, CheckCircle2,
    HelpCircle, Eye, MapPin, Building, Briefcase, UserCheck, ChevronDown,
    X, Save, ArrowRight
} from 'lucide-react';

const steps = [
    { num: 1, label: 'Basic Information', status: 'active' },
    { num: 2, label: 'Department Head', status: 'pending' },
    { num: 3, label: 'Description & Settings', status: 'pending' },
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
                <div className="flex items-center justify-between gap-2 px-3 pt-2.5">
                    <h3 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">{title}</h3>
                    {action}
                </div>
            )}
            <div className="px-3 pb-3 pt-1">{children}</div>
        </div>
    );
}

export default function AddDepartmentBasicInfo() {
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

                        {/* Section 1: Basic Information */}
                        <Card title={<><span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px]">1</span> Basic Information</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-3 mt-0.5 ">
                                <Field title="Department Name" required helpText="e.g. Design Studio">
                                    <input type="text" defaultValue="Design Studio" className={inputCls} placeholder="e.g. Design Studio" />
                                </Field>
                                <Field title="Department Code" required helpText="Auto generated">
                                    <input type="text" defaultValue="DS" className={inputCls} />
                                </Field>

                                <SelectField title="Parent Department" options={['Business Operations', 'IT', 'HR']} helpText="Select parent department (if any)" />
                                <SelectField title="Department Type" required options={['Core Department', 'Support', 'Admin', 'Other']} helpText="Core / Support / Admin / Other" />

                                <SelectField title="Business Unit" required options={['Retail Interiors & Exhibition', 'Corporate', 'Sales']} helpText="Select business unit" />

                                <Field title="Status" required helpText="Active departments are visible in system">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 z-10 pointer-events-none shadow-sm"></div>
                                        <select className={`${selectCls} pl-7 text-zinc-900 font-medium`}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Section 2: Department Head */}
                        <Card title={<><span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px]">2</span> Department Head</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-3 mt-0.5">
                                <Field title="Department Head (HOD)" required>
                                    <div className="relative flex items-center border border-indigo-200 bg-indigo-50/50 px-2 py-1 mt-1 cursor-pointer h-8 rounded-md transition-colors hover:border-indigo-300">
                                        <img src="https://i.pravatar.cc/150?u=aman" alt="User" className="w-5 h-5 rounded-full border border-white shrink-0 shadow-sm" />
                                        <div className="ml-2 flex-1 overflow-hidden leading-tight">
                                            <p className="text-[11px] font-bold text-zinc-900 truncate">Aman Malhotra</p>
                                            <p className="text-[9px] text-zinc-500 truncate font-medium">Design Director</p>
                                        </div>
                                        <div className="flex items-center shrink-0">
                                            <X size={12} className="text-zinc-400 hover:text-rose-500 cursor-pointer mx-1" />
                                            <ChevronDown size={14} className="text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </Field>

                                <SelectField title="Reporting To" required options={['Rajesh Sharma']} helpText="Select reporting manager" />

                                <Field title="Effective Date" required helpText="From when this department will be active">
                                    <div className="relative">
                                        <input type="text" defaultValue="01 May 2025" className={`${inputCls} pr-8`} />
                                        <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* Section 3: Description & Settings */}
                        <Card title={<><span className="flex items-center justify-center bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px]">3</span> Description & Settings</>}>
                            <div className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 mt-0.5">
                                <Field title="Department Purpose">
                                    <div className="relative">
                                        <textarea
                                            className={`${inputCls} h-[70px] py-2 leading-relaxed`}
                                            defaultValue="To create innovative and functional design solutions for retail stores, exhibitions and corporate interiors."
                                        />
                                        <div className="absolute bottom-1.5 left-2.5 text-[9px] text-zinc-400 font-medium">109 / 300</div>
                                    </div>
                                </Field>

                                <Field title="Key Responsibilities" helpText="(comma separated)">
                                    <div className="relative">
                                        <textarea
                                            className={`${inputCls} h-[70px] py-2 leading-relaxed`}
                                            defaultValue="Retail Design, Exhibition Design, 3D Visualization, Working Drawings, BOQ, Material Selection, Client Presentation, Site Design Support"
                                        />
                                        <div className="absolute bottom-1.5 left-2.5 text-[9px] text-zinc-400 font-medium">102 / 300</div>
                                    </div>
                                </Field>

                                <Field title="Employee Capacity" helpText="Maximum number of employees">
                                    <div className="relative w-full sm:w-1/2">
                                        <input type="text" defaultValue="50" className={`${inputCls} pr-8`} />
                                        <Users size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </Card>

                    </div>

                    {/* Right Sidebar Area */}
                    <div className="space-y-2">

                        {/* Preview Card */}
                        <Card title={<><Eye size={14} className="text-indigo-600 mr-2" /> Department Preview</>}>
                            <div className="flex items-start gap-3 mt-1 mb-4">
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

                        {/* Tips Card */}
                        <Card title={<><span className="text-indigo-600 text-[14px] mr-1">💡</span> Tips</>}>
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
                        <div className="bg-indigo-50/60 border border-zinc-200 rounded-xl p-5 flex ">
                            <div className="pr-2">
                                <h4 className="text-[14px] font-bold text-zinc-900 mb-1.5">Need Help?</h4>
                                <p className="text-[12px] text-zinc-600 mb-4 font-medium leading-relaxed">Learn more about departments in HRMS.</p>
                            </div>
                            <button type="button" className="px-4 whitespace-nowrap mt-7 flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white h-9 text-[12px] font-bold text-indigo-700 hover:bg-indigo-50 shadow-sm transition-colors">
                                <HelpCircle size={14} /> View Guide
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="pb-2 px-2 flex items-center justify-between shadow-sm w-[67%]">
                <Link href="/dashboard/departments" className="flex items-center justify-center h-8 px-5 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
                    Cancel
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 shadow-sm transition-colors">
                        <Save size={14} /> Save Draft
                    </button>
                    <Link href="/dashboard/departments/add-department/department-head" className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
                        Next: Department Head <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
