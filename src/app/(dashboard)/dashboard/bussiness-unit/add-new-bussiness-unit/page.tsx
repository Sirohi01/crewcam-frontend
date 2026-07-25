'use client';
import React from 'react';
import Link from 'next/link';
import {
    ChevronRight, Building, ArrowLeft, Save, UploadCloud,
    CheckCircle2, Info, Link as LinkIcon, DollarSign, Image as ImageIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';

// Reusable Input Field Components
const inputCls = 'mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[11px] font-semibold text-zinc-700';
const helpTextCls = 'text-[10px] text-zinc-400 mt-1 leading-tight';

function Field({ title, required, children, helpText }: { title: string; required?: boolean; children: React.ReactNode; helpText?: string }) {
    return (
        <label className="block">
            <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
            {children}
            {helpText && <p className={helpTextCls}>{helpText}</p>}
        </label>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-50">
            <div className="text-indigo-600">{icon}</div>
            <h2 className="text-[12px] font-bold text-indigo-900">{title}</h2>
        </div>
    );
}

export default function AddNewBusinessUnitPage() {
    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div>
                    <div className="text-[11px] font-medium text-zinc-500 mb-1 flex items-center gap-2">
                        <span className="cursor-pointer hover:text-zinc-700">Organization Setup</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="cursor-pointer hover:text-zinc-700">Departments</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="cursor-pointer hover:text-zinc-700">Business Units</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600 font-semibold cursor-pointer">Add New Business Unit</span>
                    </div>
                    <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Add New Business Unit</h1>
                    <p className="text-[11px] text-zinc-500">Create a new business unit (BU) and define its details.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/bussiness-unit/bussinessunit-bu" className="flex items-center gap-1.5 h-8 px-3 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Business Units
                    </Link>
                    <button className="flex items-center gap-1.5 h-8 px-4 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Save className="w-3.5 h-3.5" /> Save Business Unit
                    </button>
                </div>
            </div>

            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-stretch">

                {/* LEFT SECTION (Forms) */}
                <div className="xl:col-span-7 flex flex-col gap-2 h-full">
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex flex-col gap-3">

                        {/* Business Unit Information */}
                        <div>
                            <SectionHeader icon={<Building className="w-4 h-4" />} title="Business Unit Information" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Business Unit Name" required>
                                    <input type="text" className={inputCls} placeholder="Enter business unit name" />
                                </Field>
                                <Field title="BU Code" required helpText="Short code (e.g., BU-RI)">
                                    <input type="text" className={inputCls} placeholder="Enter unique BU code" />
                                </Field>
                                <Field title="Head / Owner" required helpText="Person responsible for this BU">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Select BU Head / Owner</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Parent Business Unit" helpText="Choose the parent business unit">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Select parent BU (if any)</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                                <Field title="Business Unit Type" required helpText="e.g., Operational, Support, Revenue">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Select BU type</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                                <Field title="Status" required helpText="Choose current status">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>

                            <div className="mb-0.5">
                                <Field title="Business Unit Description">
                                    <textarea
                                        className="mt-1 w-full rounded-md border border-zinc-200 bg-white p-2.5 text-[11px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px] resize-none"
                                        placeholder="Enter a brief description about this business unit, its objectives and key focus areas..."
                                    />
                                    <div className="text-right text-[9px] text-zinc-400 mt-1">0/500</div>
                                </Field>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <SectionHeader icon={<LinkIcon className="w-4 h-4" />} title="Additional Details" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Established On">
                                    <input type="date" className={inputCls} placeholder="Select date" />
                                </Field>
                                <Field title="Total Employees (Approx.)">
                                    <input type="number" className={inputCls} placeholder="Enter approx. number" />
                                </Field>
                                <Field title="Total Departments (Approx.)">
                                    <input type="number" className={inputCls} placeholder="Enter approx. number" />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Field title="Primary Focus Area">
                                    <input type="text" className={inputCls} placeholder="e.g., Retail Solutions, Interior Design, Corporate Services" />
                                </Field>
                                <Field title="Key Services / Products">
                                    <input type="text" className={inputCls} placeholder="Enter key services or products offered" />
                                </Field>
                            </div>
                        </div>

                        {/* Budget & Financial Details (Optional) */}
                        <div>
                            <SectionHeader icon={<DollarSign className="w-4 h-4" />} title="Budget & Financial Details (Optional)" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Field title="Annual Budget (FY 25-26)" helpText="Enter budget amount">
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-[10px] text-zinc-500 text-[11px]">₹</span>
                                        <input type="text" className={`${inputCls} pl-7`} placeholder="Enter annual budget" />
                                    </div>
                                </Field>
                                <Field title="Cost Centers" helpText="Link one or more cost centers">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Select cost centers</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                                <Field title="Financial Owner" helpText="Person responsible for financials">
                                    <div className="relative">
                                        <select className={selectCls}>
                                            <option>Select financial owner</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </div>

                    </Card>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-3 flex flex-col gap-3 h-full">

                    {/* Business Unit Icon Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-1">Business Unit Icon</h2>
                        <p className="text-[11px] text-zinc-500 mb-4">Upload an icon or choose from library to represent this BU.</p>

                        <div className="flex gap-3 h-[140px]">
                            {/* Upload Box */}
                            <div className="w-1/3 border border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer p-2.5">
                                <UploadCloud className="w-7 h-7 text-indigo-500 mb-2" />
                                <span className="text-[11px] font-bold text-zinc-700 text-center leading-tight mb-1">Upload Icon</span>
                                <span className="text-[9px] text-zinc-400 text-center">PNG, JPG (Max 2MB)</span>
                            </div>

                            {/* Choose from Library Box */}
                            <div className="w-2/3 border border-zinc-200 rounded-lg p-2.5 flex flex-col">
                                <span className="text-[11px] font-bold text-zinc-700 text-center mb-2.5">Choose from Library</span>
                                <div className="grid grid-cols-3 gap-2 flex-1 place-items-center">
                                    <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-100"><ImageIcon className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center cursor-pointer hover:bg-amber-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer hover:bg-rose-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center cursor-pointer hover:bg-teal-100"><Building className="w-4 h-4" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Why Add Business Unit Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex-1">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-3">Why Add Business Unit?</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Helps in organizing departments and resources under a specific business unit.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Enables budget allocation and cost management at BU level.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Provides better reporting and performance tracking.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Improves accountability and decision making.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Note Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-[14px] font-bold text-zinc-800">Note</h2>
                        </div>
                        <ul className="list-disc pl-5 flex flex-col gap-2.5">
                            <li className="text-[12px] text-zinc-600 leading-relaxed pl-1">All fields marked with <b className="text-rose-500">*</b> are mandatory.</li>
                            <li className="text-[12px] text-zinc-600 leading-relaxed pl-1">You can edit business unit details anytime from the business unit list.</li>
                        </ul>
                    </Card>

                </div>
            </div>

        </div>
    );
}
