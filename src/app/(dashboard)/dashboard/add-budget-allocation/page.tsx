'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    FileText, ArrowLeft, Save, ChevronRight, ChevronDown, Building2, Calendar,
    Users, MapPin, Plus, Edit2, Trash2, Info, Copy, Upload, Download, BarChart2
} from 'lucide-react';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_DEPARTMENT = {
    name: 'Interior Design',
    status: 'Active',
    code: 'INT-DSN',
    parentDepartment: 'Design & Build',
    head: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=deptHead1' },
    financialYear: '2025 - 2026',
    financialYearRange: '01 Apr 2025 - 31 Mar 2026',
    totalEmployees: 12,
    location: 'Noida, Uttar Pradesh',
};

interface BudgetHead {
    id: string;
    head: string;
    description: string;
    annual: number;
    q1: number;
    q2: number;
    q3: number;
    q4: number;
}

const MOCK_BUDGET_HEADS: BudgetHead[] = [
    { id: 'bh1', head: 'Salaries & Wages', description: 'Salaries, allowances, bonuses', annual: 7200000, q1: 1800000, q2: 1800000, q3: 1800000, q4: 1800000 },
    { id: 'bh2', head: 'Office Expenses', description: 'Office supplies, stationery, printing', annual: 600000, q1: 150000, q2: 150000, q3: 150000, q4: 150000 },
    { id: 'bh3', head: 'Travel & Conveyance', description: 'Local/Outstation travel, fuel', annual: 400000, q1: 100000, q2: 100000, q3: 100000, q4: 100000 },
    { id: 'bh4', head: 'Training & Development', description: 'Employee training, workshops', annual: 300000, q1: 75000, q2: 75000, q3: 75000, q4: 75000 },
    { id: 'bh5', head: 'Marketing & Branding', description: 'Marketing, advertising, events', annual: 500000, q1: 125000, q2: 125000, q3: 125000, q4: 125000 },
    { id: 'bh6', head: 'Software & Licenses', description: 'Software subscriptions, licenses', annual: 200000, q1: 50000, q2: 50000, q3: 50000, q4: 50000 },
    { id: 'bh7', head: 'Miscellaneous', description: 'Other miscellaneous expenses', annual: 300000, q1: 75000, q2: 75000, q3: 75000, q4: 75000 },
];

const financialYearOptions = ['2025 - 2026 (01 Apr 2025 - 31 Mar 2026)', '2024 - 2025 (01 Apr 2024 - 31 Mar 2025)', '2026 - 2027 (01 Apr 2026 - 31 Mar 2027)'];
const budgetTypeOptions = ['Department Budget', 'Project Budget', 'Capital Budget'];
const currencyOptions = ['INR - Indian Rupee (₹)', 'USD - US Dollar ($)', 'EUR - Euro (€)'];
const budgetOwnerOptions = ['Rahul Nair (Department Head)', 'Amit Verma (Finance Head)'];
const preparedByOptions = ['Vijay Sharma (Super Admin)', 'Neha Joshi (HR Executive)'];

const quickActions = [
    { label: 'Copy from Previous Year', icon: Copy },
    { label: 'Import from Excel', icon: Upload },
    { label: 'Download Template', icon: Download },
    { label: 'View Budget Reports', icon: BarChart2 },
];
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number) => {
    return `₹ ${new Intl.NumberFormat('en-IN').format(amount)}`;
};

const numberToWordsIndian = (num: number): string => {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const twoDigits = (n: number): string => {
        if (n < 20) return ones[n];
        return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };
    const threeDigits = (n: number): string => {
        if (n < 100) return twoDigits(n);
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
    };

    let result = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const hundred = num;

    if (crore) result += threeDigits(crore) + ' Crore ';
    if (lakh) result += threeDigits(lakh) + ' Lakh ';
    if (thousand) result += threeDigits(thousand) + ' Thousand ';
    if (hundred) result += threeDigits(hundred);

    return result.trim();
};

function SelectField({
    label, required, value, onChange, options, placeholder, className = '',
}: {
    label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; placeholder: string; className?: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-[12px] font-semibold text-zinc-700">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full h-10 px-3 flex items-center justify-between border border-zinc-200 rounded-md text-[12.5px] bg-white hover:border-zinc-300 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <span className={`truncate ${value ? 'text-zinc-800' : 'text-zinc-400'}`}>{value || placeholder}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {open && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-30 max-h-52 overflow-y-auto">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AddBudgetAllocationPage() {
    const router = useRouter();

    const [financialYear, setFinancialYear] = useState(financialYearOptions[0]);
    const [budgetType, setBudgetType] = useState(budgetTypeOptions[0]);
    const [currency, setCurrency] = useState(currencyOptions[0]);
    const [allocationDate, setAllocationDate] = useState('15 May 2025');
    const [budgetOwner, setBudgetOwner] = useState(budgetOwnerOptions[0]);
    const [preparedBy, setPreparedBy] = useState(preparedByOptions[0]);
    const [notes, setNotes] = useState('');

    const [budgetHeads, setBudgetHeads] = useState<BudgetHead[]>(MOCK_BUDGET_HEADS);

    const dept = MOCK_DEPARTMENT;
    const createdBy = 'Vijay Sharma';
    const createdOn = '15 May 2025 10:30 AM';
    const lastUpdated = '15 May 2025 10:30 AM';
    const totalSpent = 1845200;

    const totals = budgetHeads.reduce(
        (acc, b) => ({
            annual: acc.annual + b.annual,
            q1: acc.q1 + b.q1,
            q2: acc.q2 + b.q2,
            q3: acc.q3 + b.q3,
            q4: acc.q4 + b.q4,
        }),
        { annual: 0, q1: 0, q2: 0, q3: 0, q4: 0 }
    );

    const quarterlyAverage = Math.round(totals.annual / 4);
    const utilization = totals.annual > 0 ? ((totalSpent / totals.q1) * 100).toFixed(2) : '0.00';

    const updateField = (id: string, field: keyof BudgetHead, value: string) => {
        setBudgetHeads((prev) =>
            prev.map((b) => (b.id === id ? { ...b, [field]: field === 'head' || field === 'description' ? value : Number(value.replace(/[^0-9]/g, '')) || 0 } : b))
        );
    };

    const handleDeleteRow = (id: string) => {
        setBudgetHeads((prev) => prev.filter((b) => b.id !== id));
        toast.success('Budget head removed');
    };

    const handleAddBudgetHead = () => {
        const newRow: BudgetHead = {
            id: `bh_${Date.now()}`,
            head: '',
            description: '',
            annual: 0,
            q1: 0,
            q2: 0,
            q3: 0,
            q4: 0,
        };
        setBudgetHeads((prev) => [...prev, newRow]);
    };

    const handleSave = () => {
        if (budgetHeads.some((b) => !b.head.trim())) {
            toast.error('Please fill in all Budget Head names');
            return;
        }
        toast.success('Budget allocation saved successfully');
    };

    const totalInWords = `${numberToWordsIndian(totals.annual)} Rupees Only`;

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 mb-0.5 flex-wrap">
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Organization Setup</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments" className="hover:text-indigo-600 transition-colors">Departments</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments/details" className="hover:text-indigo-600 transition-colors">Department Details</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/departments/budget-allocation" className="hover:text-indigo-600 transition-colors">Budget Allocation</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 font-semibold">Add Budget Allocation</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Add Budget Allocation</h1>
                        <p className="text-[12px] text-zinc-500">Create budget allocation for this department for a specific financial year.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard/departments/budget-allocation')}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Budget Allocation
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Save className="w-3.5 h-3.5" /> Save Budget Allocation
                    </button>
                </div>
            </div>

            {/* DEPARTMENT INFO CARD */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-5 gap-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Department</p>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-bold text-zinc-900">{dept.name}</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold">{dept.status}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Department Code: {dept.code}</p>
                        <p className="text-[11px] text-zinc-500">Parent Department: {dept.parentDepartment}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <img src={dept.head?.avatarUrl} alt="Department Head" className="w-9 h-9 rounded-full border border-zinc-200 shrink-0" />
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Department Head</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.head?.firstName} {dept.head?.lastName}</p>
                        <p className="text-[10.5px] text-zinc-500">{dept.head?.designation}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Financial Year</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.financialYear}</p>
                        <p className="text-[10px] text-zinc-400">{dept.financialYearRange}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Total Employees</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.totalEmployees}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10.5px] text-zinc-500">Location</p>
                        <p className="text-[13px] font-bold text-zinc-800">{dept.location}</p>
                    </div>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">

                {/* LEFT: FORM */}
                <div className="xl:col-span-3 flex flex-col gap-2">

                    {/* BUDGET DETAILS */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">Budget Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 mb-2">
                            <SelectField label="Financial Year" required value={financialYear} onChange={setFinancialYear} options={financialYearOptions} placeholder="Select Financial Year" />
                            <SelectField label="Budget Type" required value={budgetType} onChange={setBudgetType} options={budgetTypeOptions} placeholder="Select Budget Type" />
                            <SelectField label="Currency" required value={currency} onChange={setCurrency} options={currencyOptions} placeholder="Select Currency" />
                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Allocation Date <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={allocationDate}
                                        onChange={(e) => setAllocationDate(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3 border border-zinc-200 rounded-md text-[12.5px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <SelectField label="Budget Owner" required value={budgetOwner} onChange={setBudgetOwner} options={budgetOwnerOptions} placeholder="Select Budget Owner" />
                            <SelectField label="Prepared By" required value={preparedBy} onChange={setPreparedBy} options={preparedByOptions} placeholder="Select Preparer" />
                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter any notes or remarks..."
                                    className="w-full h-10 px-3 border border-zinc-200 rounded-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BUDGET ALLOCATION TABLE */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-[13.5px] font-bold text-zinc-800">Budget Allocation (by Head)</h2>
                            <button
                                onClick={handleAddBudgetHead}
                                className="flex items-center gap-1.5 h-8 px-3 border border-indigo-200 bg-indigo-50 text-indigo-600 rounded-md text-[11.5px] font-semibold hover:bg-indigo-100 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Budget Head
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50">
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">#</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Budget Head</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Description</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Annual Budget (₹)</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Q1 (Apr-Jun)</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Q2 (Jul-Sep)</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Q3 (Oct-Dec)</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Q4 (Jan-Mar)</th>
                                        <th className="py-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11.5px]">
                                    {budgetHeads.map((b, idx) => (
                                        <tr key={b.id} className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors">
                                            <td className="py-2 px-2 text-zinc-500 font-semibold align-middle">{idx + 1}</td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={b.head}
                                                    onChange={(e) => updateField(b.id, 'head', e.target.value)}
                                                    placeholder="Budget head"
                                                    className="w-32 font-bold text-zinc-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={b.description}
                                                    onChange={(e) => updateField(b.id, 'description', e.target.value)}
                                                    placeholder="Description"
                                                    className="w-36 text-zinc-600 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={formatCurrency(b.annual)}
                                                    onChange={(e) => updateField(b.id, 'annual', e.target.value)}
                                                    className="w-24 font-semibold text-zinc-800 bg-white border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={formatCurrency(b.q1)}
                                                    onChange={(e) => updateField(b.id, 'q1', e.target.value)}
                                                    className="w-24 text-zinc-700 bg-white border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={formatCurrency(b.q2)}
                                                    onChange={(e) => updateField(b.id, 'q2', e.target.value)}
                                                    className="w-24 text-zinc-700 bg-white border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={formatCurrency(b.q3)}
                                                    onChange={(e) => updateField(b.id, 'q3', e.target.value)}
                                                    className="w-24 text-zinc-700 bg-white border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                                            </td>
                                            <td className="py-2 px-2 align-middle">
                                                <input
                                                    type="text"
                                                    value={formatCurrency(b.q4)}
                                                    onChange={(e) => updateField(b.id, 'q4', e.target.value)}
                                                    className="w-24 text-zinc-700 bg-white border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                            </td>
                                            <td className="py-2 px-2 align-middle text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRow(b.id)}
                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Delete">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-indigo-50/50 font-bold">
                                        <td className="py-2.5 px-2" colSpan={3}>
                                            <span className="text-zinc-800 pl-1">Total Budget</span>
                                        </td>
                                        <td className="py-2.5 px-2 text-zinc-900">{formatCurrency(totals.annual)}</td>
                                        <td className="py-2.5 px-2 text-zinc-900">{formatCurrency(totals.q1)}</td>
                                        <td className="py-2.5 px-2 text-zinc-900">{formatCurrency(totals.q2)}</td>
                                        <td className="py-2.5 px-2 text-zinc-900">{formatCurrency(totals.q3)}</td>
                                        <td className="py-2.5 px-2 text-zinc-900">{formatCurrency(totals.q4)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-[11.5px] text-zinc-600 mt-3">
                            Total (in words): <span className="font-bold text-zinc-800">{totalInWords}</span>
                        </p>
                    </div>

                    {/* NOTE BOX */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-md p-2 flex gap-3">
                        <div className="text-indigo-500 shrink-0 mt-0.5">
                            <Info className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-[12.5px] font-bold text-zinc-800 mb-1.5">Note</h3>
                            <ul className="list-disc list-inside space-y-1 text-[11.5px] text-zinc-600">
                                <li>Budget allocation can be modified until it is approved.</li>
                                <li>After approval, changes require admin approval.</li>
                            </ul>
                        </div>
                    </div>

                    {/* BOTTOM ACTION BAR */}
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => router.push('/dashboard/departments/budget-allocation')}
                            className="h-9 px-4 bg-white border border-zinc-200 rounded-md text-[12.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button onClick={handleSave}
                            className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 text-white rounded-md text-[12.5px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                            <Save className="w-3.5 h-3.5" /> Save Budget Allocation
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-1 flex flex-col gap-2">

                    {/* Budget Summary */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Budget Summary</h2>
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-[10.5px] text-zinc-500">Total Annual Budget</p>
                                <p className="text-[17px] font-bold text-emerald-600">{formatCurrency(totals.annual)}</p>
                            </div>
                            <div>
                                <p className="text-[10.5px] text-zinc-500">Quarterly Average</p>
                                <p className="text-[15px] font-bold text-emerald-600">{formatCurrency(quarterlyAverage)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] text-zinc-500">Budget Heads</p>
                                <p className="text-[12px] font-bold text-zinc-800">{budgetHeads.length}</p>
                            </div>
                            <div className="border-t border-zinc-100 pt-2.5 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-zinc-500">Created By</span>
                                    <span className="font-semibold text-zinc-800">{createdBy}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-zinc-500">Created On</span>
                                    <span className="font-semibold text-zinc-800">{createdOn}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-zinc-500">Last Updated</span>
                                    <span className="font-semibold text-zinc-800">{lastUpdated}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Utilization */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Budget Utilization (YTD)</h2>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11.5px] text-zinc-500">Total Spent</span>
                            <span className="text-[13px] font-bold text-zinc-800">{formatCurrency(totalSpent)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="text-zinc-500 font-medium">Utilization</span>
                            <span className="text-zinc-800 font-bold">{utilization}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(Number(utilization), 100)}%` }} />
                        </div>
                        <p className="text-[10.5px] text-zinc-400">of 1st Quarter Budget ({formatCurrency(totals.q1)})</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Quick Actions</h2>
                        <div className="flex flex-col gap-1">
                            {quickActions.map((action, idx) => {
                                const ActionIcon = action.icon;
                                return (
                                    <button
                                        key={idx}
                                        className="flex items-center gap-2.5 px-2 py-2 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <ActionIcon className="w-4 h-4 text-indigo-500" /> {action.label}
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