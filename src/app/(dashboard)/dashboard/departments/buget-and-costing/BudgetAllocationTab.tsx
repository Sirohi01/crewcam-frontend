import React from 'react';
import {
    CheckCircle2, Building2, Wallet, Receipt, Tag, Building, ArrowRight,
    FileText, Clock, GitBranch, Users
} from 'lucide-react';

export default function BudgetAllocationTab() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 items-start w-full animate-in fade-in duration-300">
            {/* COLUMN 1: Sub Department Information */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 w-full xl:col-span-4">
                <h3 className="text-[13px] font-bold text-slate-900 mb-3">Sub Department Information</h3>
                <div className="flex flex-col text-[11.5px]">
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Sub Department Name</span>
                        <span className="font-bold text-slate-900">Budget Allocation</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Short Name</span>
                        <span className="font-bold text-slate-900">Budget Allocation</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Sub Department Code</span>
                        <span className="font-bold text-slate-900">BA-DB-001</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Description</span>
                        <span className="font-bold text-slate-900 leading-snug">Handles budgeting, cost planning, expense control and financial allocation for all projects and operations.</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Department</span>
                        <span className="font-bold text-slate-900">Design & Build</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Parent Department</span>
                        <span className="font-bold text-slate-900">Design & Build</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600 mt-1">Department Head</span>
                        <div className="flex items-center gap-2">
                            <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul Nair" className="w-6 h-6 rounded-full border border-slate-200" />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 leading-tight">Rahul Nair</span>
                                <span className="text-[10px] font-medium text-slate-500 leading-tight">Manager</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Reporting To</span>
                        <span className="font-bold text-slate-900">Finance Head</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Business Unit</span>
                        <span className="font-bold text-slate-900">Design House – Projects</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Cost Center</span>
                        <span className="font-bold text-slate-900">CC-DB-001</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Location</span>
                        <span className="font-bold text-slate-900">Noida Head Office</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Created By</span>
                        <span className="font-bold text-slate-900">Vijay Sharma (Super Admin)</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Created On</span>
                        <span className="font-bold text-slate-900">01 Jun 2025 10:25 AM</span>
                    </div>
                    <div className="flex items-start pt-2.5">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Last Updated</span>
                        <span className="font-bold text-slate-900">01 Jun 2025 10:25 AM by Vijay Sharma</span>
                    </div>
                </div>
            </div>

            {/* COLUMN 2: Budget Summary */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 w-full xl:col-span-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-bold text-slate-900">Budget Summary (FY 2025-26)</h3>
                    <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">View Details</button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8 pl-2">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Total Budget</p>
                            <h4 className="text-[16px] font-black text-slate-900 tracking-tight">₹ 1,20,00,000</h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Allocated Budget</p>
                            <h4 className="text-[16px] font-black text-slate-900 tracking-tight">₹ 95,50,000</h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                            <Receipt className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Utilized Amount</p>
                            <h4 className="text-[16px] font-black text-slate-900 tracking-tight">₹ 48,75,250</h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-slate-700 mb-0.5">Available Amount</p>
                            <h4 className="text-[16px] font-black text-slate-900 tracking-tight">₹ 46,74,750</h4>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                    <div className="flex items-center justify-between mb-2 text-[11px]">
                        <span className="font-bold text-slate-700">Budget Utilization</span>
                        <span className="font-bold text-blue-600">40.63%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '40.63%' }}></div>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500">₹48,75,250 of ₹1,20,00,000 used</p>
                </div>

                <div className="h-[1px] w-full bg-slate-100 mb-4"></div>

                <div className="flex flex-col text-[11.5px]">
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Financial Year</span>
                        <span className="font-bold text-slate-900">01 Apr 2025 - 31 Mar 2026</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Budget Owner</span>
                        <span className="font-bold text-slate-900">Rahul Nair</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Budget Approval</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Approved</span>
                    </div>
                    <div className="flex items-start py-2.5 border-b border-slate-100">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Approved By</span>
                        <span className="font-bold text-slate-900">Vijay Sharma (Super Admin)</span>
                    </div>
                    <div className="flex items-start pt-2.5">
                        <span className="w-44 shrink-0 font-semibold text-slate-600">Approved On</span>
                        <span className="font-bold text-slate-900">20 May 2025</span>
                    </div>
                </div>
            </div>

            {/* COLUMN 3: RIGHT SIDEBAR */}
            <div className="w-full xl:col-span-3 flex flex-col gap-2">

                {/* Hierarchy Preview */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    <h3 className="text-[13px] font-bold text-slate-900 mb-4">Hierarchy Preview</h3>
                    <div className="flex flex-col relative pl-4">
                        {/* Vertical Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-slate-200"></div>

                        {/* Node 1 */}
                        <div className="flex items-start gap-3 relative z-10 mb-4">
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm mt-0.5">
                                <Building className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Design House India Pvt. Ltd.</h4>
                                <p className="text-[10px] font-medium text-slate-500">Organization</p>
                            </div>
                        </div>

                        {/* Node 2 */}
                        <div className="flex items-start gap-3 relative z-10 mb-4">
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm mt-0.5">
                                <Building2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Design & Build</h4>
                                <p className="text-[10px] font-medium text-slate-500">Department</p>
                            </div>
                        </div>

                        {/* Node 3 */}
                        <div className="flex items-start gap-3 relative z-10">
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm mt-0.5">
                                <GitBranch className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                                <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Budget Allocation</h4>
                                <p className="text-[10px] font-medium text-slate-500">Sub Department (Current)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Responsibilities */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    <h3 className="text-[13px] font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] font-semibold text-slate-700 leading-snug">Prepare annual and project-wise budgets.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] font-semibold text-slate-700 leading-snug">Monitor budget utilization and variances.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] font-semibold text-slate-700 leading-snug">Ensure cost control and financial discipline.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] font-semibold text-slate-700 leading-snug">Provide budget reports and forecasts.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11.5px] font-semibold text-slate-700 leading-snug">Coordinate with departments for approvals.</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                    <h3 className="text-[13px] font-bold text-slate-900 mb-3">Quick Links</h3>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <Users className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">View Team Members (6)</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                        <button className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <FileText className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">View Budget Reports</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                        <button className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <Building className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">View Related Cost Centers</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                        <button className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-[11.5px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">View Audit Trail</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
