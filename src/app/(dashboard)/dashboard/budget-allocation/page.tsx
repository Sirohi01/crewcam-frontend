'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Wallet, ArrowLeft, Edit2, ChevronDown, ChevronRight, LayoutGrid, PieChart,
    Users2, FileText, History, Building2, Laptop, UserCircle2, Calendar,
    ShieldCheck, CheckCircle2, Users, BarChart2, Coins, Link2
} from 'lucide-react';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_SUB_DEPARTMENT = {
    name: 'Budget Allocation',
    shortName: 'Budget Allocation',
    code: 'BA-DB-001',
    description: 'Handles budgeting, cost planning, expense control and financial allocation for all projects and operations.',
    department: 'Design & Build',
    parentDepartment: 'Design & Build',
    departmentHead: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=deptHead1' },
    reportingTo: 'Finance Head',
    businessUnit: 'Design House – Projects',
    costCenter: 'CC-DB-001',
    location: 'Noida Head Office',
    effectiveDate: '2025-06-01',
    createdBy: 'Vijay Sharma (Super Admin)',
    createdOn: '01 Jun 2025 10:25 AM',
    lastUpdated: '01 Jun 2025 10:25 AM by Vijay Sharma',
    status: 'Active',
};

const budgetSummary = {
    financialYear: 'FY 2025-26',
    totalBudget: 12000000,
    allocatedBudget: 9550000,
    utilizedAmount: 4875250,
    availableAmount: 4674750,
    utilizationPct: 40.63,
    financialYearRange: '01 Apr 2025 - 31 Mar 2026',
    budgetOwner: 'Rahul Nair',
    budgetApproval: 'Approved',
    approvedBy: 'Vijay Sharma (Super Admin)',
    approvedOn: '20 May 2025',
};

const hierarchy = [
    { name: 'Design House India Pvt. Ltd.', role: 'Organization', icon: Building2, current: false },
    { name: 'Design & Build', role: 'Department', icon: Laptop, current: false },
    { name: 'Budget Allocation', role: 'Sub Department (Current)', icon: Wallet, current: true },
];

const keyResponsibilities = [
    'Prepare annual and project-wise budgets.',
    'Monitor budget utilization and variances.',
    'Ensure cost control and financial discipline.',
    'Provide budget reports and forecasts.',
    'Coordinate with departments for approvals.',
];

const quickLinks = [
    { label: 'View Team Members (6)', icon: Users },
    { label: 'View Budget Reports', icon: BarChart2 },
    { label: 'View Related Cost Centers', icon: Coins },
    { label: 'View Audit Trail', icon: Link2 },
];

const tabs = [
    { label: 'Overview', icon: LayoutGrid },
    { label: 'Budget Allocation', icon: PieChart },
    { label: 'Team & Access', icon: Users2 },
    { label: 'Documents', icon: FileText },
    { label: 'History', icon: History },
];
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(amount)}`;
};

const formatSimpleDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function BudgetAllocationDetailsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Overview');
    const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

    const sd = MOCK_SUB_DEPARTMENT;
    const bs = budgetSummary;

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 mb-0.5">
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Organization Setup</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments" className="hover:text-indigo-600 transition-colors">Departments</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments/sub-departments" className="hover:text-indigo-600 transition-colors">Sub Departments</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 font-semibold">Sub Department Details</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-xl font-bold text-zinc-900 leading-tight">{sd.name}</h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10.5px] font-semibold">{sd.status}</span>
                    </div>
                    <p className="text-[12px] text-zinc-500 mt-0.5">View and manage sub department details and budget information.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard/departments/sub-departments')}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sub Departments
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Details
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
                            className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            More Actions <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {isMoreActionsOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                                <button className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50">Duplicate</button>
                                <button className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50">Export as PDF</button>
                                <button className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50">Archive</button>
                                <button className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-rose-600 hover:bg-rose-50">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* INFO BAR */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Sub Department Code</p>
                        <p className="text-[13px] font-bold text-zinc-800">{sd.code}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Department</p>
                        <p className="text-[13px] font-bold text-zinc-800">{sd.department}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Laptop className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Parent Department</p>
                        <p className="text-[13px] font-bold text-zinc-800">{sd.parentDepartment}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <UserCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Reporting To</p>
                        <p className="text-[13px] font-bold text-zinc-800">{sd.reportingTo}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Effective Date</p>
                        <p className="text-[13px] font-bold text-zinc-800">{formatSimpleDate(sd.effectiveDate)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Status</p>
                        <p className="text-[13px] font-bold text-emerald-600">{sd.status}</p>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-6 border-b border-zinc-200 px-1">
                {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => {
                                if (tab.label === 'Overview') {
                                    router.push('/dashboard/departments/sub-department-details');
                                } else if (tab.label === 'Team & Access') {
                                    router.push('/dashboard/team-member');
                                } else if (tab.label === 'Documents') {
                                    router.push('/department-document');
                                } else if (tab.label === 'History') {
                                    router.push('/dashboard/history');
                                } else {
                                    setActiveTab(tab.label);
                                }
                            }}
                            className={`flex items-center gap-1.5 py-2.5 text-[12.5px] font-semibold border-b-2 transition-colors ${
                                activeTab === tab.label
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            <TabIcon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">

                {/* LEFT + MIDDLE COLUMNS */}
                <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-2 items-start">

                    {/* Sub Department Information */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">Sub Department Information</h2>
                        <div className="grid grid-cols-[130px_1fr] gap-y-3 gap-x-2 text-[12px]">
                            <div className="text-zinc-500">Sub Department Name</div>
                            <div className="font-semibold text-zinc-800">{sd.name}</div>

                            <div className="text-zinc-500">Short Name</div>
                            <div className="font-semibold text-zinc-800">{sd.shortName}</div>

                            <div className="text-zinc-500">Sub Department Code</div>
                            <div className="font-semibold text-zinc-800">{sd.code}</div>

                            <div className="text-zinc-500">Description</div>
                            <div className="font-medium text-zinc-700 leading-relaxed">{sd.description}</div>

                            <div className="text-zinc-500">Department</div>
                            <div className="font-semibold text-zinc-800">{sd.department}</div>

                            <div className="text-zinc-500">Parent Department</div>
                            <div className="font-semibold text-zinc-800">{sd.parentDepartment}</div>

                            <div className="text-zinc-500">Department Head</div>
                            <div className="flex items-center gap-2">
                                <img src={sd.departmentHead.avatarUrl} alt="Department Head" className="w-6 h-6 rounded-full border border-zinc-200" />
                                <div className="leading-tight">
                                    <p className="font-semibold text-zinc-800 text-[12px]">{sd.departmentHead.firstName} {sd.departmentHead.lastName}</p>
                                    <p className="text-[10.5px] text-zinc-500">{sd.departmentHead.designation}</p>
                                </div>
                            </div>

                            <div className="text-zinc-500">Reporting To</div>
                            <div className="font-semibold text-zinc-800">{sd.reportingTo}</div>

                            <div className="text-zinc-500">Business Unit</div>
                            <div className="font-semibold text-zinc-800">{sd.businessUnit}</div>

                            <div className="text-zinc-500">Cost Center</div>
                            <div className="font-semibold text-zinc-800">{sd.costCenter}</div>

                            <div className="text-zinc-500">Location</div>
                            <div className="font-semibold text-zinc-800">{sd.location}</div>

                            <div className="text-zinc-500">Created By</div>
                            <div className="font-semibold text-zinc-800">{sd.createdBy}</div>

                            <div className="text-zinc-500">Created On</div>
                            <div className="font-semibold text-zinc-800">{sd.createdOn}</div>

                            <div className="text-zinc-500">Last Updated</div>
                            <div className="font-semibold text-zinc-800">{sd.lastUpdated}</div>
                        </div>
                    </div>

                    {/* Budget Summary */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[13.5px] font-bold text-zinc-800">Budget Summary ({bs.financialYear})</h2>
                            <button className="text-[11.5px] font-semibold text-indigo-600 hover:underline">View Details</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <Wallet className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-[10.5px] text-zinc-500">Total Budget</p>
                                    <p className="text-[13px] font-bold text-zinc-800">{formatCurrency(bs.totalBudget)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Building2 className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-[10.5px] text-zinc-500">Allocated Budget</p>
                                    <p className="text-[13px] font-bold text-zinc-800">{formatCurrency(bs.allocatedBudget)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-[10.5px] text-zinc-500">Utilized Amount</p>
                                    <p className="text-[13px] font-bold text-zinc-800">{formatCurrency(bs.utilizedAmount)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <p className="text-[10.5px] text-zinc-500">Available Amount</p>
                                    <p className="text-[13px] font-bold text-zinc-800">{formatCurrency(bs.availableAmount)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[12px] font-semibold text-zinc-700">Budget Utilization</span>
                                <span className="text-[12px] font-bold text-indigo-600">{bs.utilizationPct}%</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${bs.utilizationPct}%` }} />
                            </div>
                            <p className="text-[10.5px] text-zinc-400 mt-1.5">
                                {formatCurrency(bs.utilizedAmount)} of {formatCurrency(bs.totalBudget)} used
                            </p>
                        </div>

                        <div className="grid grid-cols-[130px_1fr] gap-y-2.5 gap-x-2 text-[12px]">
                            <div className="text-zinc-500">Financial Year</div>
                            <div className="font-semibold text-zinc-800">{bs.financialYearRange}</div>

                            <div className="text-zinc-500">Budget Owner</div>
                            <div className="font-semibold text-zinc-800">{bs.budgetOwner}</div>

                            <div className="text-zinc-500">Budget Approval</div>
                            <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10.5px] font-bold border border-emerald-100">
                                    {bs.budgetApproval}
                                </span>
                            </div>

                            <div className="text-zinc-500">Approved By</div>
                            <div className="font-semibold text-zinc-800">{bs.approvedBy}</div>

                            <div className="text-zinc-500">Approved On</div>
                            <div className="font-semibold text-zinc-800">{bs.approvedOn}</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-1 flex flex-col gap-2">

                    {/* Hierarchy Preview */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Hierarchy Preview</h2>
                        <div className="flex flex-col gap-2 relative">
                            {hierarchy.map((item, idx) => {
                                const ItemIcon = item.icon;
                                return (
                                    <div key={idx} className="relative pl-1">
                                        {idx < hierarchy.length - 1 && (
                                            <div className="absolute left-[19px] top-9 w-0.5 h-4 bg-zinc-200" />
                                        )}
                                        <div className={`flex items-center gap-2.5 rounded-lg ${item.current ? 'bg-indigo-50 p-2 -m-1' : ''}`} style={{ marginLeft: idx * 16 }}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.current ? 'bg-indigo-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                                <ItemIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className={`text-[12px] font-bold ${item.current ? 'text-indigo-700' : 'text-zinc-800'}`}>{item.name}</p>
                                                <p className="text-[10.5px] text-zinc-500">{item.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Key Responsibilities */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Key Responsibilities</h2>
                        <div className="flex flex-col gap-2.5">
                            {keyResponsibilities.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-[11.5px] font-medium text-zinc-700 leading-snug">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Quick Links</h2>
                        <div className="flex flex-col gap-1">
                            {quickLinks.map((link, idx) => {
                                const LinkIcon = link.icon;
                                return (
                                    <button
                                        key={idx}
                                        className="flex items-center justify-between px-2 py-2 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <LinkIcon className="w-4 h-4 text-indigo-500" /> {link.label}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}