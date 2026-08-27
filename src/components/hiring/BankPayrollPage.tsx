'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Save, AlertCircle } from 'lucide-react';
import { FormField, FormInput, FormSelect, FormCheckbox } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function BankPayrollPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const currentUsername = `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || 'Admin';

    const [loading, setLoading] = React.useState(true);
    const [isPreFilled, setIsPreFilled] = React.useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        micrCode: '',
        accountType: '',
        paymentMode: '',
        panNumber: '',
        aadhaarNumber: '',
        uanNumber: '',
        pfAccountNumber: '',
        esiNumber: '',
        pfApplicable: false,
        esiApplicable: false,
        ptApplicable: false,
        lwfApplicable: false,
        hrVerifiedBy: currentUsername,
        hrRemarks: '',
        status: 'active'
    });

    const setField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchBankPayrollData();
    }, [candidateId]);

    const fetchBankPayrollData = async () => {
        try {
            setLoading(true);
            const candidateRes = await api.get(`/hiring/candidates/${candidateId}`);
            const cand = candidateRes.data;

            const res = await api.get('/hiring/bank-payroll', { params: { candidateId } });
            const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);

            if (list.length > 0) {
                const row = list[0];
                setFormData({
                    ...row,
                    employeeName: row.employeeName || `${cand.firstName} ${cand.lastName || ''}`.trim(),
                    empCode: row.empCode || cand.employeeCode || '',
                    designation: row.designation || cand.jobRole || '',
                    department: row.department || cand.department || '',
                    hrVerifiedBy: row.hrVerifiedBy || currentUsername
                });
                setIsPreFilled(true);
            } else {
                setFormData(prev => ({
                    ...prev,
                    accountHolderName: `${cand.firstName} ${cand.lastName || ''}`.trim(),
                    employeeName: `${cand.firstName} ${cand.lastName || ''}`.trim(),
                    empCode: cand.employeeCode || '',
                    designation: cand.jobRole || '',
                    department: cand.department || '',
                }));
            }
        } catch (error: any) {
            console.error('Failed to load bank & payroll data', error);
            toast.error('Failed to load bank & payroll data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => setField(field, value);

    const handleSave = async () => {
        try {
            const { _id, ...submitData } = formData as any;
            
            // Basic validation
            if (!submitData.bankName || !submitData.accountHolderName || !submitData.accountNumber || !submitData.ifscCode) {
                toast.error('Please fill all mandatory bank account fields.');
                return;
            }

            const payload = {
                ...submitData,
                candidateId,
            };

            if (_id) {
                await api.put(`/hiring/bank-payroll/${_id}`, payload);
                toast.success('Bank & payroll details updated successfully.');
            } else {
                await api.post('/hiring/bank-payroll', payload);
                toast.success('Bank & payroll details saved successfully.');
            }
            fetchBankPayrollData();
            setTimeout(() => {
                router.push('/dashboard/hiring/steps/bank-payroll');
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save bank & payroll information');
        }
    };

    const SectionHeader = ({ id, title, subText }: { id: number, title: string, subText?: string }) => (
        <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-4">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">{id}</span>
                {title}
            </h3>
            {subText && <span className="text-[10px] text-slate-500 font-medium italic">{subText}</span>}
        </div>
    );

    if (loading) {
        return <div className="p-10 text-center text-sm text-slate-500">Loading form data...</div>;
    }

    return (
        <HiringStepLayout candidateId={candidateId} stepId="bank-payroll">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">BANK &amp; PAYROLL FORM</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-800 mt-4 mb-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        Account number, PAN and Aadhaar are encrypted at rest. They are masked in list view — full values are accessible only through authorized PDF actions.
                    </div>

                    <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                        <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                                <CreditCard className="h-4 w-4 text-[#0d3c68]" />
                                Employee Bank & Payroll Details
                            </h2>
                        </div>

                        <div className="p-3 space-y-4">
                            {/* 1. BANK ACCOUNT DETAILS */}
                            <SectionHeader id={1} title="Bank Account Details" />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <FormField label="Bank Name:" required>
                                    <FormInput placeholder="Enter Bank Name" value={formData.bankName} onChange={(e) => handleChange("bankName", e.target.value)} required />
                                </FormField>
                                <FormField label="Account Holder Name:" required>
                                    <FormInput placeholder="Enter Account Holder Name" value={formData.accountHolderName} onChange={(e) => handleChange("accountHolderName", e.target.value)} required />
                                </FormField>
                                <FormField label="Account Number:" required>
                                    <FormInput placeholder="Enter Account Number" value={formData.accountNumber} onChange={(e) => handleChange("accountNumber", e.target.value)} required />
                                </FormField>
                                <FormField label="IFSC Code:" required>
                                    <FormInput placeholder="Enter IFSC Code" value={formData.ifscCode} onChange={(e) => handleChange("ifscCode", e.target.value)} required />
                                </FormField>
                                <FormField label="Branch Name:">
                                    <FormInput placeholder="Enter Branch Name" value={formData.branchName} onChange={(e) => handleChange("branchName", e.target.value)} />
                                </FormField>
                                <FormField label="MICR Code:">
                                    <FormInput placeholder="Enter MICR Code" value={formData.micrCode} onChange={(e) => handleChange("micrCode", e.target.value)} />
                                </FormField>
                                <FormField label="Account Type:">
                                    <FormSelect options={[{ value: 'Savings', label: 'Savings' }, { value: 'Current', label: 'Current' }]} value={formData.accountType} onChange={(e) => handleChange("accountType", e.target.value)} placeholder="Select..." />
                                </FormField>
                                <FormField label="Payment Mode:">
                                    <FormSelect options={[{ value: 'Bank Transfer', label: 'Bank Transfer' }, { value: 'Cheque', label: 'Cheque' }, { value: 'Cash', label: 'Cash' }]} value={formData.paymentMode} onChange={(e) => handleChange("paymentMode", e.target.value)} placeholder="Select..." />
                                </FormField>
                            </div>

                            {/* 2. STATUTORY IDENTIFIERS */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <SectionHeader id={2} title="Statutory Identifiers" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField label="PAN Number:">
                                        <FormInput placeholder="ABCDE1234F" value={formData.panNumber} onChange={(e) => handleChange('panNumber', e.target.value)} />
                                    </FormField>
                                    <FormField label="Aadhaar Number:">
                                        <FormInput placeholder="XXXX XXXX XXXX" value={formData.aadhaarNumber} onChange={(e) => handleChange('aadhaarNumber', e.target.value)} />
                                    </FormField>
                                    <FormField label="UAN Number:">
                                        <FormInput placeholder="Enter UAN" value={formData.uanNumber} onChange={(e) => handleChange('uanNumber', e.target.value)} />
                                    </FormField>
                                    <FormField label="PF Account Number:">
                                        <FormInput placeholder="Enter PF Account No" value={formData.pfAccountNumber} onChange={(e) => handleChange('pfAccountNumber', e.target.value)} />
                                    </FormField>
                                    <FormField label="ESI Number:">
                                        <FormInput placeholder="Enter ESI Number" value={formData.esiNumber} onChange={(e) => handleChange('esiNumber', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>

                            {/* 3. PAYROLL APPLICABILITY */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <SectionHeader id={3} title="Payroll Applicability" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <FormCheckbox label="PF Applicable" checked={formData.pfApplicable} onChange={(e) => handleChange('pfApplicable', e.target.checked)} />
                                    <FormCheckbox label="ESI Applicable" checked={formData.esiApplicable} onChange={(e) => handleChange('esiApplicable', e.target.checked)} />
                                    <FormCheckbox label="Professional Tax" checked={formData.ptApplicable} onChange={(e) => handleChange('ptApplicable', e.target.checked)} />
                                    <FormCheckbox label="Labour Welfare Fund" checked={formData.lwfApplicable} onChange={(e) => handleChange('lwfApplicable', e.target.checked)} />
                                </div>
                            </div>

                            {/* 4. HR SECTION */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <SectionHeader id={4} title="HR Verification" />
                                <div className="grid grid-cols-4 gap-4">
                                    <FormField label="• HR Verified By:">
                                        <FormInput value={formData.hrVerifiedBy} readOnly className="bg-slate-50 cursor-default" />
                                    </FormField>
                                    <FormField label="• HR Remarks:" className="md:col-span-3">
                                        <FormInput placeholder="Enter Remarks" value={formData.hrRemarks} onChange={(e) => handleChange('hrRemarks', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>

                            {/* FORM FOOTER */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4">
                                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide">
                                        <Save className="h-4 w-4" />
                                        SAVE INFORMATION
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @media print {
                            .section-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                            .bg-[#0d3c68] { background-color: #0d3c68 !important; -webkit-print-color-adjust: exact; }
                            .text-white { color: white !important; }
                            .border-slate-200 { border-color: #e2e8f0 !important; }
                            .bg-slate-50 { background-color: #f8fafc !important; }
                            .btn, .no-print { display: none !important; }
                        }
                    `}</style>
                </CardContent>
            </Card>
        </HiringStepLayout>
    );
}
