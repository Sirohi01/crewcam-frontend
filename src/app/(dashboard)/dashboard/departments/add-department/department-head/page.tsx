'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import {
    Building2, ChevronRight, User, Calendar, Users, CheckCircle2,
    HelpCircle, Eye, MapPin, Building, Briefcase, UserCheck, ChevronDown,
    X, Save, ArrowRight, ArrowLeft,
    ShieldCheck, Map, Lightbulb
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function AddDepartmentHead() {
    const navigate = useRouter();
    return (
        <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-screen">
            <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">

                {/* Header */}
                <PageHeader
                    title="Add Department"
                    description="Step 2 of 4: Department Head — Assign leadership and reporting structure for this department."
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

                                <Field title="Reporting To" required>
                                    <div className="relative flex items-center border border-indigo-200 bg-indigo-50/50 px-2 py-1 mt-1 cursor-pointer h-8 rounded-md transition-colors hover:border-indigo-300">
                                        <img src="https://i.pravatar.cc/150?u=rajesh" alt="User" className="w-5 h-5 rounded-full border border-white shrink-0 shadow-sm" />
                                        <div className="ml-2 flex-1 overflow-hidden leading-tight">
                                            <p className="text-[11px] font-bold text-zinc-900 truncate">Rajesh Sharma</p>
                                            <p className="text-[9px] text-zinc-500 truncate font-medium">Managing Director</p>
                                        </div>
                                        <div className="flex items-center shrink-0">
                                            <X size={12} className="text-zinc-400 hover:text-rose-500 cursor-pointer mx-1" />
                                            <ChevronDown size={14} className="text-zinc-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </Field>

                                <SelectField title="Assistant / Co-Head (Optional)" options={['Select assistant or co-head']} helpText="Select if applicable" />

                                <Field title="Effective Date" required helpText="From when this department will be active">
                                    <div className="relative">
                                        <input type="text" defaultValue="01 May 2025" className={`${inputCls} pr-8`} />
                                        <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
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
                                <SelectField title="Location" required options={['Noida - Head Office']} helpText="Primary" />

                                <Field title="Cost Center" required helpText="Unique cost center code">
                                    <input type="text" defaultValue="CC-DS-1001" className={inputCls} />
                                </Field>

                                <SelectField title="Business Unit" required options={['Retail Interiors & Exhibition']} helpText="Select business unit" />

                                <Field title="Budget Owner" helpText="Person responsible for budget">
                                    <div className="relative flex items-center border border-indigo-200 bg-indigo-50/50 px-2 py-1 mt-1 cursor-pointer h-8 rounded-md transition-colors hover:border-indigo-300">
                                        <img src="https://i.pravatar.cc/150?u=neha" alt="User" className="w-5 h-5 rounded-full border border-white shrink-0 shadow-sm" />
                                        <div className="ml-2 flex-1 overflow-hidden leading-tight">
                                            <p className="text-[11px] font-bold text-zinc-900 truncate">Neha Sethi</p>
                                            <p className="text-[9px] text-zinc-500 truncate font-medium">GM - Retail</p>
                                        </div>
                                        <div className="flex items-center shrink-0">
                                            <X size={12} className="text-zinc-400 hover:text-rose-500 cursor-pointer mx-1" />
                                            <ChevronDown size={14} className="text-zinc-400 pointer-events-none" />
                                        </div>
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
                                <button type="button" className="flex items-center justify-center gap-2 h-8 px-4 rounded-lg text-[12px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 shadow-sm transition-colors">
                                    <Save size={14} /> Save Draft
                                </button>
                                <Link href="/dashboard/departments/add-department/description" className="flex items-center justify-center gap-2 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
                                    Next: Description & Settings <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                    </div>                    {/* Right Sidebar Area */}
                    <div className="space-y-2">

                        {/* Preview Card */}
                        <Card title={<><Eye size={13} className="text-indigo-600 mr-2" /> Department Preview</>}>
                            <div className="flex items-start gap-3 mt-1 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-base font-bold shrink-0 shadow-md shadow-indigo-600/20">
                                    DS
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-bold text-zinc-900 leading-tight">Design Studio</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="px-1.5 py-[2px] rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold border border-emerald-100 uppercase tracking-wider">Active</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 mt-1 font-medium flex items-center gap-1">
                                        <span className="font-semibold text-zinc-700">DS</span> &bull; Core Department
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-zinc-100 pt-2">
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Building size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Parent Department</div>
                                    <div className="font-semibold text-zinc-800">Business Operations</div>
                                </div>
                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400"><Briefcase size={13} /></div>
                                    <div className="text-zinc-500 font-medium">Business Unit</div>
                                    <div className="font-semibold text-zinc-800">Retail Interiors & Exhibition</div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400 mt-0.5"><User size={13} /></div>
                                    <div className="text-zinc-500 mt-[2px] font-medium">Department Head</div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/150?u=aman" alt="Aman" className="w-6 h-6 rounded-full border border-zinc-200 shadow-sm" />
                                        <div className="leading-tight">
                                            <div className="font-bold text-zinc-800 text-[11px]">Aman Malhotra</div>
                                            <div className="text-[9px] text-zinc-500 font-medium">Design Director</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[20px_110px_1fr] gap-x-2 items-start text-[10.5px]">
                                    <div className="text-zinc-400 mt-0.5"><UserCheck size={13} /></div>
                                    <div className="text-zinc-500 mt-[2px] font-medium">Reporting To</div>
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/150?u=rajesh" alt="Rajesh" className="w-6 h-6 rounded-full border border-zinc-200 shadow-sm" />
                                        <div className="leading-tight">
                                            <div className="font-bold text-zinc-800 text-[11px]">Rajesh Sharma</div>
                                            <div className="text-[9px] text-zinc-500 font-medium">Managing Director</div>
                                        </div>
                                    </div>
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
