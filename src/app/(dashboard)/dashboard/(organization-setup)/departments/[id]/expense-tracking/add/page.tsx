'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import {
    ArrowLeft, Save, Building2, User, Calendar, Wallet, CheckCircle2, XCircle,
    ChevronDown, Trash2, Plus, UploadCloud, X, ArrowDown, Info, Send, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ExpenseItem {
    id: string;
    description: string;
    vendor: string;
    invoice: string;
    qty: number;
    unitCost: number;
    taxPercent: number;
}

export default function AddExpensePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;

    const [expenseTitle, setExpenseTitle] = useState('Office Interior Material Purchase');
    const [expenseCategory, setExpenseCategory] = useState('Office Expenses');
    const [subCategory, setSubCategory] = useState('Stationery & Supplies');
    const [expenseType, setExpenseType] = useState('Operational');
    const [expenseDate, setExpenseDate] = useState('2025-05-15');
    const [costCenter, setCostCenter] = useState('INT-DSN-001 (Interior Design)');
    const [remarks, setRemarks] = useState('Chairs and tables for new workstations as per team expansion plan.');

    const [items, setItems] = useState<ExpenseItem[]>([
        { id: '1', description: 'Ergonomic Office Chair', vendor: 'Featherlite', invoice: 'FL/2025/458', qty: 6, unitCost: 8500, taxPercent: 18 },
        { id: '2', description: 'Designer Desk Table', vendor: 'Urban Ladder', invoice: 'UL/2025/892', qty: 4, unitCost: 12000, taxPercent: 18 },
        { id: '3', description: 'Printer Paper & Stationery', vendor: 'Amazon Business', invoice: 'AB/2025/1176', qty: 1, unitCost: 6800, taxPercent: 18 },
    ]);

    const [attachments, setAttachments] = useState([
        { name: 'Invoice_FL458.pdf', size: '2.4 MB' },
        { name: 'Invoice_UL892.pdf', size: '1.8 MB' },
        { name: 'Amazon_Bill_1176.pdf', size: '1.2 MB' },
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAddItem = () => {
        setItems([...items, { id: Date.now().toString(), description: '', vendor: '', invoice: '', qty: 1, unitCost: 0, taxPercent: 18 }]);
    };

    const handleRemoveItem = (itemId: string) => {
        if (items.length === 1) {
            toast.error("At least one expense item is required.");
            return;
        }
        setItems(items.filter(item => item.id !== itemId));
    };

    const updateItem = (id: string, field: keyof ExpenseItem, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeAttachment = (name: string) => {
        setAttachments(attachments.filter(a => a.name !== name));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            }));
            setAttachments([...attachments, ...newFiles]);
        }
    };

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unitCost), 0);
    const taxTotal = items.reduce((acc, item) => acc + ((item.qty * item.unitCost) * (item.taxPercent / 100)), 0);
    const grandTotal = subtotal + taxTotal;

    const budgetAllocated = 9500000;
    const spentYTD = 1845200;
    const balanceBefore = budgetAllocated - spentYTD;
    const balanceAfter = balanceBefore - grandTotal;
    const utilizedPercent = ((spentYTD / budgetAllocated) * 100).toFixed(2);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!expenseTitle.trim()) newErrors.expenseTitle = 'Required';
        if (!expenseCategory) newErrors.expenseCategory = 'Required';
        if (!expenseDate) newErrors.expenseDate = 'Required';
        if (!costCenter) newErrors.costCenter = 'Required';

        items.forEach((item, index) => {
            if (!item.description.trim()) newErrors[`item_${index}_desc`] = 'Required';
            if (item.qty <= 0) newErrors[`item_${index}_qty`] = 'Invalid';
            if (item.unitCost <= 0) newErrors[`item_${index}_cost`] = 'Invalid';
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fill all required fields correctly.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            toast.success('Expense submitted successfully!');
            // API call would go here
        }
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800 relative min-h-screen">

            {/* BREADCRUMB */}
            <Breadcrumb items={[
                { label: 'Organization Setup' },
                { label: 'Departments', href: '/dashboard/departments' },
                { label: 'Department Details', href: `/dashboard/departments/${id}` },
                { label: 'Expense Tracking', href: `/dashboard/departments/${id}/expense-tracking` },
                { label: 'Add Expense' }
            ]} />

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Expense</h1>
                    <p className="text-[12px] text-slate-500 font-medium mt-0.5">Create a new expense for this department. Submit for approval after adding details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/expense-tracking`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Expense Tracking
                    </Link>
                    <button onClick={handleSubmit} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 border border-blue-600 text-white rounded-md text-[11px] font-semibold hover:bg-blue-700 shadow-sm transition-colors">
                        <Save className="w-3.5 h-3.5" /> Submit for Approval
                    </button>
                </div>
            </div>

            {/* DEPARTMENT SUMMARY CARD */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center divide-x divide-slate-100">
                    {/* Dept */}
                    <div className="flex-1 min-w-[200px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap">Department</p>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-[13px] font-bold text-slate-900 leading-tight whitespace-nowrap">Interior Design</h2>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide whitespace-nowrap">Active</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">Department Code: INT-DSN</p>
                            <p className="text-[11px] font-medium text-slate-600 whitespace-nowrap">Parent: Design & Build</p>
                        </div>
                    </div>

                    {/* Head */}
                    <div className="flex-1 min-w-[150px] p-4 flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul Nair" className="w-10 h-10 rounded-full border border-slate-200 shrink-0" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Department Head</p>
                            <h2 className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">Rahul Nair</h2>
                            <p className="text-[11px] font-medium text-slate-600">Manager</p>
                        </div>
                    </div>

                    {/* FY */}
                    <div className="flex-1 min-w-[120px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Financial Year</p>
                            <h2 className="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">2025 - 2026</h2>
                        </div>
                    </div>

                    {/* Budget Allocated */}
                    <div className="flex-1 min-w-[150px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Budget Allocated</p>
                            <h2 className="text-[15px] font-bold text-slate-900 leading-tight mb-0.5">₹{formatCurrency(budgetAllocated)}</h2>
                        </div>
                    </div>

                    {/* Spent YTD */}
                    <div className="flex-1 min-w-[150px] p-4 flex flex-col justify-center gap-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Spent (YTD)</p>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                            <h2 className="text-[15px] font-bold text-slate-900 leading-tight">₹{formatCurrency(spentYTD)}</h2>
                            <span className="text-[11px] font-bold text-slate-700">{utilizedPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${utilizedPercent}%` }} />
                        </div>
                    </div>

                    {/* Available Budget */}
                    <div className="flex-1 min-w-[150px] p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Available Budget</p>
                            <h2 className="text-[15px] font-bold text-emerald-600 leading-tight mb-0.5">₹{formatCurrency(balanceBefore)}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT */}
            <div className="flex flex-col xl:flex-row mt-2 gap-2 items-start">

                {/* LEFT SECTION (75%) */}
                <div className="w-full xl:flex-1 flex flex-col gap-2 min-w-0">

                    {/* Expense Details Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                            <h3 className="text-[13px] font-bold text-slate-900">Expense Details</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">

                            {/* Row 1 */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-[1.5]">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Expense Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={expenseTitle}
                                        onChange={(e) => setExpenseTitle(e.target.value)}
                                        className={`w-full px-3 py-2 text-[12px] border ${errors.expenseTitle ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded-md focus:outline-none focus:border-blue-400 font-medium text-slate-900`}
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Expense Category <span className="text-red-500">*</span></label>
                                    <select
                                        value={expenseCategory}
                                        onChange={(e) => setExpenseCategory(e.target.value)}
                                        className={`w-full appearance-none pl-3 pr-8 py-2 text-[12px] border ${errors.expenseCategory ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded-md focus:outline-none focus:border-blue-400 font-medium text-slate-900 cursor-pointer`}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Office Expenses">Office Expenses</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                                </div>
                                <div className="flex-1 relative">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Sub Category</label>
                                    <select
                                        value={subCategory}
                                        onChange={(e) => setSubCategory(e.target.value)}
                                        className="w-full appearance-none pl-3 pr-8 py-2 text-[12px] border border-slate-200 rounded-md focus:outline-none focus:border-blue-400 font-medium bg-white text-slate-900 cursor-pointer"
                                    >
                                        <option value="">Select Sub Category</option>
                                        <option value="Stationery & Supplies">Stationery & Supplies</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Furniture">Furniture</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-[1.5]">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-2">Expense Type <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-4 py-1">
                                        {['Operational', 'Project', 'Marketing', 'Training'].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer" onClick={() => setExpenseType(type)}>
                                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${expenseType === type ? 'border-blue-600 border-2' : 'border-slate-300'}`}>
                                                    {expenseType === type && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                                                </div>
                                                <span className={`text-[11px] font-medium ${expenseType === type ? 'text-slate-900' : 'text-slate-700'}`}>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 relative">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Expense Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={expenseDate}
                                            onChange={(e) => setExpenseDate(e.target.value)}
                                            className={`w-full pl-3 pr-3 py-2 text-[12px] border ${errors.expenseDate ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded-md focus:outline-none focus:border-blue-400 font-medium text-slate-900`}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 relative">
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Cost Center <span className="text-red-500">*</span></label>
                                    <select
                                        value={costCenter}
                                        onChange={(e) => setCostCenter(e.target.value)}
                                        className={`w-full appearance-none pl-3 pr-8 py-2 text-[12px] border ${errors.costCenter ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded-md focus:outline-none focus:border-blue-400 font-medium text-slate-900 cursor-pointer`}
                                    >
                                        <option value="">Select Cost Center</option>
                                        <option value="INT-DSN-001 (Interior Design)">INT-DSN-001 (Interior Design)</option>
                                        <option value="MKT-001 (Marketing)">MKT-001 (Marketing)</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expense Items Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[13px] font-bold text-slate-900">Expense Items</h3>
                            <button onClick={handleAddItem} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[11px] font-bold hover:bg-blue-100 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add Item
                            </button>
                        </div>

                        <div className="p-3 w-full">
                            <table className="w-full text-left border-collapse">
                                <colgroup>
                                    <col style={{ width: '3%' }} />
                                    <col style={{ width: '20%' }} />
                                    <col style={{ width: '13%' }} />
                                    <col style={{ width: '12%' }} />
                                    <col style={{ width: '6%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '9%' }} />
                                    <col style={{ width: '7%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '9%' }} />
                                    <col style={{ width: '3%' }} />
                                </colgroup>
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-center">#</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase">Item Description <span className="text-red-500">*</span></th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase">Vendor</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase">Inv. No.</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-center">Qty</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-right">Cost(₹)</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-right">Amount(₹)</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-center">Tax %</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-right">Tax(₹)</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-right">Total(₹)</th>
                                        <th className="py-2 px-1 text-[9.5px] font-bold text-slate-600 uppercase text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, idx) => {
                                        const amount = item.qty * item.unitCost;
                                        const tax = amount * (item.taxPercent / 100);
                                        const total = amount + tax;
                                        return (
                                            <tr key={item.id} className="border-b border-slate-50">
                                                <td className="py-1 px-1 text-[11px] font-medium text-slate-700 text-center">{idx + 1}</td>
                                                <td className="py-1 px-1">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                        placeholder="Description"
                                                        className={`w-full px-1.5 py-1 text-[10.5px] border ${errors[`item_${idx}_desc`] ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded focus:outline-none focus:border-blue-400 font-medium`}
                                                    />
                                                </td>
                                                <td className="py-1 px-1">
                                                    <input
                                                        type="text"
                                                        value={item.vendor}
                                                        onChange={(e) => updateItem(item.id, 'vendor', e.target.value)}
                                                        placeholder="Vendor"
                                                        className="w-full px-1.5 py-1 text-[10.5px] border border-slate-200 rounded focus:outline-none focus:border-blue-400 font-medium bg-white"
                                                    />
                                                </td>
                                                <td className="py-1 px-1">
                                                    <input
                                                        type="text"
                                                        value={item.invoice}
                                                        onChange={(e) => updateItem(item.id, 'invoice', e.target.value)}
                                                        placeholder="Invoice"
                                                        className="w-full px-1.5 py-1 text-[10.5px] border border-slate-200 rounded focus:outline-none focus:border-blue-400 font-medium bg-white"
                                                    />
                                                </td>
                                                <td className="py-1 px-1">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.qty}
                                                        onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                                        className={`w-full px-1.5 py-1 text-[10.5px] border ${errors[`item_${idx}_qty`] ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded focus:outline-none focus:border-blue-400 font-medium text-center`}
                                                    />
                                                </td>
                                                <td className="py-1 px-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.unitCost}
                                                        onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                                        className={`w-full px-1.5 py-1 text-[10.5px] border ${errors[`item_${idx}_cost`] ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} rounded focus:outline-none focus:border-blue-400 font-medium text-right`}
                                                    />
                                                </td>
                                                <td className="py-1 px-1 text-right">
                                                    <span className="text-[10.5px] font-medium text-slate-600 px-1">{formatCurrency(amount)}</span>
                                                </td>
                                                <td className="py-1 px-1 relative">
                                                    <select
                                                        value={item.taxPercent}
                                                        onChange={(e) => updateItem(item.id, 'taxPercent', parseInt(e.target.value))}
                                                        className="w-full appearance-none px-1 py-1 text-[10.5px] border border-slate-200 rounded focus:outline-none font-medium bg-white cursor-pointer text-center"
                                                    >
                                                        <option value="0">0%</option>
                                                        <option value="5">5%</option>
                                                        <option value="12">12%</option>
                                                        <option value="18">18%</option>
                                                        <option value="28">28%</option>
                                                    </select>
                                                </td>
                                                <td className="py-1 px-1 text-right">
                                                    <span className="text-[10.5px] font-medium text-slate-600 px-1">{formatCurrency(tax)}</span>
                                                </td>
                                                <td className="py-1 px-1 text-right">
                                                    <span className="text-[10.5px] font-bold text-slate-900 px-1">{formatCurrency(total)}</span>
                                                </td>
                                                <td className="py-1 px-1 text-center">
                                                    <button onClick={() => handleRemoveItem(item.id)} className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors mx-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {/* Totals Box */}
                            <div className="flex justify-end mt-4 w-full">
                                <div className="w-full max-w-[280px] bg-slate-50 border border-slate-200 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[11px] font-medium text-slate-600">Subtotal</span>
                                        <span className="text-[12px] font-bold text-slate-900">₹{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[11px] font-medium text-slate-600">Total Tax</span>
                                        <span className="text-[12px] font-bold text-slate-900">₹{formatCurrency(taxTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="text-[13px] font-bold text-blue-700">Grand Total</span>
                                        <span className="text-[16px] font-bold text-blue-700">₹{formatCurrency(grandTotal)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments & Remarks Row */}
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Attachments */}
                        <div className="flex-[1.2] bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                            <h3 className="text-[13px] font-bold text-slate-900 mb-3">Attachments</h3>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer mb-3"
                            >
                                <UploadCloud className="w-6 h-6 text-blue-500 mb-2" />
                                <p className="text-[11px] font-bold text-slate-700">Drag & drop files here or click to upload</p>
                                <p className="text-[9px] font-medium text-slate-500 mt-0.5">Supported: PDF, JPG, PNG (Max 10 MB)</p>
                            </div>
                            <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

                            <div className="flex flex-wrap gap-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md py-1 pl-2 pr-1">
                                        <div className="w-4 h-4 rounded bg-rose-100 flex items-center justify-center shrink-0">
                                            <span className="text-[7px] font-bold text-rose-600">PDF</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9.5px] font-bold text-slate-700 truncate max-w-[80px]">{file.name}</p>
                                        </div>
                                        <button onClick={() => removeAttachment(file.name)} className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors ml-0.5"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="flex-[0.8] bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col">
                            <h3 className="text-[13px] font-bold text-slate-900 mb-3">Remarks</h3>
                            <textarea
                                className="w-full flex-1 min-h-[90px] p-2.5 text-[11px] border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 font-medium bg-white text-slate-900 resize-none"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                maxLength={500}
                                placeholder="Add any additional remarks or justifications..."
                            />
                            <div className="text-right mt-1">
                                <span className="text-[10px] font-medium text-slate-400">{remarks.length} / 500</span>
                            </div>
                        </div>
                    </div>

                    {/* Approval Workflow */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-[13px] font-bold text-slate-900 mb-2">Approval Workflow</h3>

                        <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                            {/* Step 1 */}
                            <div className="flex items-center gap-3 bg-blue-50/40 border border-blue-200 rounded-lg p-3 shrink relative flex-1 w-full">
                                <span className="absolute -top-2.5 -left-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">1</span>
                                <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul Nair" className="w-9 h-9 rounded-full border border-blue-200 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-500 mb-0.5 tracking-wide truncate">Department Head</p>
                                    <h4 className="text-[12px] font-bold text-slate-900 leading-tight truncate">Rahul Nair</h4>
                                    <p className="text-[10px] font-medium text-blue-600 mt-0.5 truncate">HOD Approval</p>
                                </div>
                                <span className="absolute -bottom-2.5 -right-1.5 bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-blue-200">(Current)</span>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 md:block hidden" />
                            <ArrowDown className="w-4 h-4 text-slate-300 shrink-0 md:hidden block" />

                            {/* Step 2 */}
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 shrink relative flex-1 opacity-70 w-full">
                                <span className="absolute -top-2.5 -left-1.5 w-5 h-5 bg-slate-300 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">2</span>
                                <img src="https://i.pravatar.cc/150?u=sunita" alt="Sunita Verma" className="w-9 h-9 rounded-full border border-slate-200 shrink-0 grayscale" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-500 mb-0.5 tracking-wide truncate">Finance Head</p>
                                    <h4 className="text-[12px] font-bold text-slate-900 leading-tight truncate">Sunita Verma</h4>
                                    <p className="text-[10px] font-medium text-slate-600 mt-0.5 truncate">Budget Verification</p>
                                </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 md:block hidden" />
                            <ArrowDown className="w-4 h-4 text-slate-300 shrink-0 md:hidden block" />

                            {/* Step 3 */}
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 shrink relative flex-1 opacity-70 w-full">
                                <span className="absolute -top-2.5 -left-1.5 w-5 h-5 bg-slate-300 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">3</span>
                                <img src="https://i.pravatar.cc/150?u=vijay" alt="Vijay Sharma" className="w-9 h-9 rounded-full border border-slate-200 shrink-0 grayscale" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-500 mb-0.5 tracking-wide truncate">Super Admin</p>
                                    <h4 className="text-[12px] font-bold text-slate-900 leading-tight truncate">Vijay Sharma</h4>
                                    <p className="text-[10px] font-medium text-slate-600 mt-0.5 truncate">Final Approval</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT SECTION (280px) */}
                <div className="flex flex-col gap-2 w-full xl:w-[280px] shrink-0">

                    {/* Budget Impact Card */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                        <h3 className="text-[13px] font-bold text-slate-900 mb-4">Budget Impact</h3>

                        <div className="flex justify-center mb-5 relative">
                            {/* SVG Doughnut */}
                            <svg viewBox="0 0 36 36" className="w-28 h-28 circular-chart text-slate-200">
                                <path className="circle-bg fill-none stroke-current" strokeWidth="3.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle fill-none stroke-blue-500" strokeWidth="3.5" strokeDasharray={`${utilizedPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[16px] font-black text-slate-900 leading-none">{utilizedPercent}%</span>
                                <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wide">Utilized</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Total Budget
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">₹{formatCurrency(budgetAllocated)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Spent (YTD)
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">₹{formatCurrency(spentYTD)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> This Expense
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">₹{formatCurrency(grandTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 mt-0.5">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Balance After
                                </div>
                                <span className="text-[11px] font-bold text-slate-900">₹{formatCurrency(balanceAfter)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Department Expenses */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-[13px] font-bold text-slate-900">Recent Expenses</h3>
                            <Link href={`/dashboard/departments/${id}/expense-tracking`} className="text-[10px] font-bold text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="flex flex-col">
                            {/* List Item 1 */}
                            <div className="p-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                        <Wallet className="w-3.5 h-3.5 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate max-w-[100px]">Travel - Site Visit</p>
                                        <p className="text-[9.5px] font-medium text-slate-500">12 May 2025</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-bold text-slate-900 mb-1">₹18,500</p>
                                    <span className="px-1 py-0.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Approved</span>
                                </div>
                            </div>
                            {/* List Item 2 */}
                            <div className="p-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                                        <Wallet className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate max-w-[100px]">Software License</p>
                                        <p className="text-[9.5px] font-medium text-slate-500">08 May 2025</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-bold text-slate-900 mb-1">₹49,000</p>
                                    <span className="px-1 py-0.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Approved</span>
                                </div>
                            </div>
                            {/* List Item 3 */}
                            <div className="p-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                                        <Wallet className="w-3.5 h-3.5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate max-w-[100px]">Team Training</p>
                                        <p className="text-[9.5px] font-medium text-slate-500">05 May 2025</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-bold text-slate-900 mb-1">₹12,000</p>
                                    <span className="px-1 py-0.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Approved</span>
                                </div>
                            </div>
                            {/* List Item 4 */}
                            <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                        <Wallet className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 mb-0.5 truncate max-w-[100px]">Stationery</p>
                                        <p className="text-[9.5px] font-medium text-slate-500">02 May 2025</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-bold text-slate-900 mb-1">₹6,800</p>
                                    <span className="px-1 py-0.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide">Approved</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl shadow-sm p-4 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-[0.07]">
                            <Info className="w-24 h-24 text-amber-600" />
                        </div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                                <Info className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-[13px] font-bold text-amber-900">Quick Info</h3>
                        </div>
                        <ul className="space-y-2 relative z-10">
                            <li className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-[1px]" />
                                <span className="text-[10.5px] font-medium text-amber-900 leading-snug">Ensure invoice/bill is attached</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-[1px]" />
                                <span className="text-[10.5px] font-medium text-amber-900 leading-snug">Expense must be within allocated budget</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-[1px]" />
                                <span className="text-[10.5px] font-medium text-amber-900 leading-snug">Approval required as per workflow</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-[1px]" />
                                <span className="text-[10.5px] font-medium text-amber-900 leading-snug">GST details are auto-calculated</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* BOTTOM STICKY ACTION BAR */}
            <div className="px-2 flex justify-end gap-2 z-50">
                <Link href="/dashboard/expense-tracking" className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    Cancel
                </Link>
                <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 rounded-md text-[12px] font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                    <Send className="w-3.5 h-3.5" /> Submit for Approval
                </button>
            </div>

        </div>
    );
}
