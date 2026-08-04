"use client";

import React, { useState } from 'react';
import {
    ChevronRight, ArrowLeft, Building2, Download, Check,
    Clock, Calendar, Users, Edit3, Copy, Power, FileText, Info, User
} from 'lucide-react';
import Link from 'next/link';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Department Details', 'Approval Workflow', 'View Approval Workflow'];

export default function ViewApprovalWorkflowPage() {
    return (
        <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800 bg-slate-100 min-h-screen overflow-x-hidden">

            {/* Breadcrumb & Top Action */}
            <div className="flex items-center justify-between mb-0 flex-wrap gap-2">
                <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 flex-wrap">
                    {BREADCRUMB.map((crumb, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                            <span className={i === BREADCRUMB.length - 1 ? 'text-indigo-700 font-bold' : 'hover:text-slate-700 cursor-pointer transition-colors'}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-1 mt-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[18px] font-extrabold text-slate-900 leading-tight">View Approval Workflow</h1>
                        <p className="text-[11.5px] text-slate-600 font-medium">View the complete approval workflow for this department and related transactions.</p>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Department Details
                </button>
            </div>

            {/* Department Card */}
            <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-md mb-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-bold text-slate-500">Department</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-extrabold text-slate-900 leading-none">Interior Design</span>
                            <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-extrabold">Active</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9.5px] text-slate-600 font-medium">Department Code: <span className="font-bold text-slate-800">INT-DSN</span></span>
                            <span className="text-[9.5px] text-slate-600 font-medium">Parent Department: <span className="font-bold text-slate-800">Design & Build</span></span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                <div className="flex items-center gap-2">
                    <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul Nair" className="w-8 h-8 rounded-full border border-slate-200" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 mb-0.5">Department Head</span>
                        <span className="text-[12px] font-extrabold text-slate-900 leading-tight">Rahul Nair</span>
                        <span className="text-[10px] text-slate-600 font-medium">Manager</span>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                <div className="flex flex-col max-w-[200px]">
                    <span className="text-[9px] font-bold text-slate-500 mb-0.5">Description</span>
                    <span className="text-[10.5px] text-slate-800 font-medium leading-snug">Handles all interior design projects, concepts and execution.</span>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 mb-0.5">Total Employees</span>
                        <span className="text-[14px] font-extrabold text-slate-900 leading-none">12</span>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-slate-200"></div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 mb-0.5">Created On</span>
                        <span className="text-[12px] font-extrabold text-slate-900 leading-none">15 May 2025</span>
                    </div>
                </div>

            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-300 mt-2 mb-2 px-1">
                <button className="pb-2 text-[11px] font-bold text-indigo-700 border-b-2 border-indigo-700">Workflow Overview</button>
                <button className="pb-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors">Transaction Coverage</button>
                <button className="pb-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors">Workflow Rules</button>
                <button className="pb-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors">Escalation Matrix</button>
                <button className="pb-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors">History</button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

                {/* Left Side: Approval Flow */}
                <div className="lg:col-span-8 flex flex-col gap-2 h-full">

                    <div className="bg-white border border-slate-300 rounded-lg shadow-md p-4 flex-1">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="text-[14px] font-extrabold text-slate-900">Approval Flow</h2>
                                <p className="text-[10.5px] text-slate-500 font-medium">Step-by-step approval sequence for transactions in this department.</p>
                            </div>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                <Download className="w-3.5 h-3.5" /> Download Workflow
                            </button>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 pb-2 text-[9px] font-extrabold text-slate-500 tracking-wider ml-12">
                            <div className="col-span-3">Approver</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-2">Approval Type</div>
                            <div className="col-span-4">Action on Pending</div>
                        </div>

                        {/* Stepper */}
                        <div className="relative mt-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-200 border-l border-dashed border-slate-300 z-0"></div>

                            {/* Step 1 */}
                            <div className="flex items-center mb-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border-2 border-white ring-1 ring-emerald-100">1</div>
                                <div className="flex-1 ml-6 border border-slate-100 rounded-lg py-1.5 px-2.5 shadow-sm bg-white grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-extrabold text-slate-900">Initiator</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Request Raised</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-700">Employee</span>
                                        <span className="text-[9px] text-slate-500">Requester</span>
                                    </div>
                                    <div className="col-span-2 text-[10.5px] font-bold text-slate-700">Initiate</div>
                                    <div className="col-span-4 flex items-center justify-between">
                                        <span className="text-[10.5px] font-medium text-slate-500">-</span>
                                        <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-bold">Auto Initiate</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center mb-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border-2 border-white ring-1 ring-blue-100">2</div>
                                <div className="flex-1 ml-6 border border-slate-100 rounded-lg py-1.5 px-2.5 shadow-sm bg-white grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-extrabold text-slate-900">Reporting Manager</span>
                                            <span className="text-[9px] text-slate-500 font-medium">First Level Approval</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-700">Direct Manager</span>
                                        <span className="text-[9px] text-slate-500">Manager</span>
                                    </div>
                                    <div className="col-span-2 text-[10.5px] font-bold text-slate-700">Approve / Reject</div>
                                    <div className="col-span-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700">After 2 Days</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Reminder</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                            <Clock className="w-3 h-3" /> 2 Day(s)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center mb-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border-2 border-white ring-1 ring-indigo-100">3</div>
                                <div className="flex-1 ml-6 border border-slate-100 rounded-lg py-1.5 px-2.5 shadow-sm bg-white grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-extrabold text-slate-900">Department Head</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Second Level Approval</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-700">Rahul Nair</span>
                                        <span className="text-[9px] text-slate-500">Department Head</span>
                                    </div>
                                    <div className="col-span-2 text-[10.5px] font-bold text-slate-700">Approve / Reject</div>
                                    <div className="col-span-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700">After 2 Days</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Reminder</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                            <Clock className="w-3 h-3" /> 2 Day(s)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-center mb-6 relative z-10">
                                <div className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border-2 border-white ring-1 ring-orange-100">4</div>
                                <div className="flex-1 ml-6 border border-slate-100 rounded-lg py-1.5 px-2.5 shadow-sm bg-white grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-extrabold text-slate-900">Finance Approval</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Budget & Cost Check</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-700">Finance Manager</span>
                                        <span className="text-[9px] text-slate-500">Finance</span>
                                    </div>
                                    <div className="col-span-2 text-[10.5px] font-bold text-slate-700">Approve / Reject</div>
                                    <div className="col-span-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700">After 2 Days</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Reminder</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                            <Clock className="w-3 h-3" /> 2 Day(s)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex items-center relative z-10">
                                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border-2 border-white ring-1 ring-teal-100">5</div>
                                <div className="flex-1 ml-6 border border-slate-100 rounded-lg py-1.5 px-2.5 shadow-sm bg-white grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                            <User className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-extrabold text-slate-900">Final Approval</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Final Authorization</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-700">Admin / GM</span>
                                        <span className="text-[9px] text-slate-500">General Manager</span>
                                    </div>
                                    <div className="col-span-2 text-[10.5px] font-bold text-slate-700">Approve / Reject</div>
                                    <div className="col-span-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700">After 2 Days</span>
                                            <span className="text-[9px] text-slate-500 font-medium">Reminder</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                                            <Clock className="w-3 h-3" /> 2 Day(s)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Info Banner */}
                    <div className="bg-indigo-100/50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2 shadow-sm">
                        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-[10.5px] text-slate-700 font-medium pt-0.5">If an approver rejects a request, it will be sent back to the previous approver for review.</p>
                    </div>

                </div>

                {/* Right Side: Cards */}
                <div className="lg:col-span-4 flex flex-col gap-2 h-full">

                    {/* Workflow Summary */}
                    <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md">
                        <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 pb-2 border-b border-slate-100">Workflow Summary</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10.5px] font-medium text-slate-600">Total Approval Levels</span>
                                <span className="text-[11px] font-extrabold text-slate-900">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10.5px] font-medium text-slate-600">Active Workflow</span>
                                <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-extrabold">Yes</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10.5px] font-medium text-slate-600">Last Updated</span>
                                <span className="text-[11px] font-bold text-slate-800">15 May 2025 10:30 AM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10.5px] font-medium text-slate-600">Updated By</span>
                                <span className="text-[11px] font-bold text-slate-800">Vijay Sharma</span>
                            </div>
                        </div>
                    </div>

                    {/* Applicable Transactions */}
                    <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md flex-1">
                        <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 pb-2 border-b border-slate-100">Applicable Transactions</h3>
                        <div className="flex flex-col gap-2.5">
                            {[
                                'Leave Request', 'Expense Claim', 'Reimbursement (Imprest)',
                                'Purchase Request', 'Asset Request', 'Training Request',
                                'Overtime Request', 'Change Request'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700">
                                    <Check className="w-3.5 h-3.5 text-slate-600" strokeWidth={3} />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-md">
                        <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 pb-2 border-b border-slate-100">Quick Actions</h3>
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-2 text-[10.5px] font-bold text-indigo-700 hover:text-indigo-800 transition-colors text-left">
                                <div className="w-5 h-5 rounded bg-indigo-50 flex items-center justify-center"><Edit3 className="w-3 h-3" /></div>
                                Edit Workflow
                            </button>
                            <button className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 hover:text-slate-900 transition-colors text-left">
                                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center"><Copy className="w-3 h-3" /></div>
                                Clone Workflow
                            </button>
                            <button className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 hover:text-slate-900 transition-colors text-left">
                                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center"><Power className="w-3 h-3" /></div>
                                Deactivate Workflow
                            </button>
                            <button className="flex items-center gap-2 text-[10.5px] font-bold text-slate-700 hover:text-slate-900 transition-colors text-left">
                                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center"><FileText className="w-3 h-3" /></div>
                                Workflow History Report
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
