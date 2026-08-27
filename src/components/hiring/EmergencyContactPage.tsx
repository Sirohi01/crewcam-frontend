'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Save, RotateCcw } from 'lucide-react';
import { FormField, FormInput, FormSelect, FormCheckbox } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function EmergencyContactPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const currentUsername = `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || 'Admin';

    const [loading, setLoading] = useState(true);
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        
        // Employee Details
        employeeName: '',
        empCode: '',
        designation: '',
        department: '',
        dateOfJoining: '',
        workLocation: '',
        reportingTo: '',

        // Contacts
        primaryName: '',
        primaryRelation: '',
        primaryMobile: '',
        primaryAlternateNo: '',
        primaryAddress: '',
        secondaryName: '',
        secondaryRelation: '',
        secondaryMobile: '',
        secondaryAlternateNo: '',
        secondaryAddress: '',
        
        // Medical
        bloodGroup: '',
        knownMedicalConditions: 'No',
        allergies: 'No',
        regularMedication: 'No',
        
        // Docs
        docs: {
            aadhaarNominee: false,
            aadhaarGuardian: false,
            aadhaarEmployee: false,
            other: false
        },
        otherDocText: '',

        // HR Verification
        verifiedBy: '',
        verificationDate: '',
        hrRemarks: '',
    });

    const fetchEmergencyData = async () => {
        try {
            setLoading(true);
            const candidateRes = await api.get(`/hiring/candidates/${candidateId}`);
            const cand = candidateRes.data;

            const res = await api.get('/hiring/emergency-contact', { params: { candidateId } });
            const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);

            if (list.length > 0) {
                const row = list[0];
                setFormData({
                    ...row,
                    docs: row.docs || {
                        aadhaarNominee: false,
                        aadhaarGuardian: false,
                        aadhaarEmployee: false,
                        other: false
                    },
                    bloodGroup: row.medicalInfo?.bloodGroup || row.bloodGroup || '',
                    employeeName: row.employeeName || `${cand.firstName} ${cand.lastName || ''}`.trim(),
                    empCode: row.empCode || cand.employeeCode || '',
                    designation: row.designation || cand.jobRole || '',
                    department: row.department || cand.department || '',
                    dateOfJoining: row.dateOfJoining ? row.dateOfJoining.split('T')[0] : '',
                    workLocation: row.workLocation || cand.workLocation || '',
                    reportingTo: row.reportingTo || cand.reportingTo || '',
                    verificationDate: row.verificationDate ? row.verificationDate.split('T')[0] : '',
                    verifiedBy: row.verifiedBy || currentUsername
                });
                setIsPreFilled(true);
            } else {
                setFormData(prev => ({
                    ...prev,
                    employeeName: `${cand.firstName} ${cand.lastName || ''}`.trim(),
                    empCode: cand.employeeCode || '',
                    designation: cand.jobRole || '',
                    department: cand.department || '',
                    workLocation: cand.workLocation || '',
                    reportingTo: cand.reportingTo || '',
                    verifiedBy: currentUsername,
                }));
            }
        } catch (error: any) {
            toast.error('Failed to load emergency contact details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (candidateId) {
            fetchEmergencyData();
        }
    }, [candidateId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDocChange = (field: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            docs: { ...prev.docs, [field]: value }
        }));
    };

    const handleSave = async () => {
        try {
            const { _id, ...submitData } = formData;
            
            const payload = {
                ...submitData,
                candidateId,
                medicalInfo: {
                    bloodGroup: submitData.bloodGroup,
                }
            };

            if (_id) {
                await api.put(`/hiring/emergency-contact/${_id}`, payload);
                toast.success('Emergency contact details updated successfully.');
            } else {
                await api.post('/hiring/emergency-contact', payload);
                toast.success('Emergency contact details saved successfully.');
            }
            fetchEmergencyData();
            setTimeout(() => {
                router.push('/dashboard/hiring/steps/emergency-contact');
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save emergency contact information');
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
        <HiringStepLayout candidateId={candidateId} stepId="emergency-contact">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">EMERGENCY CONTACT FORM</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                    <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                        <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                                <Phone className="h-4 w-4 text-[#0d3c68]" />
                                Emergency Contact Details
                            </h2>
                        </div>

                        <div className="p-3 space-y-4">
                            {/* 1. EMPLOYEE DETAILS */}
                            <div className="space-y-4">
                                <SectionHeader id={1} title="Employee Details" />
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <FormField label="1. Employee Name:">
                                        <FormInput
                                            value={formData.employeeName}
                                            onChange={(e) => handleChange('employeeName', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Employee Code (HR):">
                                        <FormInput
                                            value={formData.empCode}
                                            onChange={(e) => handleChange('empCode', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="2. Designation:">
                                        <FormInput
                                            value={formData.designation}
                                            onChange={(e) => handleChange('designation', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Department:">
                                        <FormInput
                                            value={formData.department}
                                            onChange={(e) => handleChange('department', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="3. Date of Joining:">
                                        <FormInput
                                            type="date"
                                            value={formData.dateOfJoining}
                                            onChange={(e) => handleChange('dateOfJoining', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Work Location:">
                                        <FormInput
                                            value={formData.workLocation}
                                            onChange={(e) => handleChange('workLocation', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Reporting To:">
                                        <FormInput
                                            value={formData.reportingTo}
                                            onChange={(e) => handleChange('reportingTo', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* 2. PRIMARY EMERGENCY CONTACT */}
                            <div className="space-y-4 mt-6">
                                <SectionHeader id={2} title="Primary Emergency Contact" subText="(This person will be contacted first in case of emergency.)" />
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <FormField label="Full Name:" required>
                                        <FormInput value={formData.primaryName} onChange={(e) => handleChange('primaryName', e.target.value)} placeholder="e.g., Jane Doe" />
                                    </FormField>
                                    <FormField label="Relationship:" required>
                                        <FormInput value={formData.primaryRelation} onChange={(e) => handleChange('primaryRelation', e.target.value)} placeholder="e.g., Spouse" />
                                    </FormField>
                                    <FormField label="Mobile No.:" required>
                                        <FormInput value={formData.primaryMobile} onChange={(e) => handleChange('primaryMobile', e.target.value)} placeholder="e.g., 9876543210" />
                                    </FormField>
                                    <FormField label="Alternate Number:">
                                        <FormInput value={formData.primaryAlternateNo} onChange={(e) => handleChange('primaryAlternateNo', e.target.value)} placeholder="Optional" />
                                    </FormField>
                                    <FormField label="Full Address:" className="md:col-span-1">
                                        <FormInput value={formData.primaryAddress} onChange={(e) => handleChange('primaryAddress', e.target.value)} placeholder="Enter full address" />
                                    </FormField>
                                </div>
                            </div>

                            {/* 3. SECONDARY EMERGENCY CONTACT */}
                            <div className="space-y-4 mt-6">
                                <SectionHeader id={3} title="Secondary Emergency Contact" subText="(Optional but Recommended)" />
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <FormField label="Full Name:">
                                        <FormInput value={formData.secondaryName} onChange={(e) => handleChange('secondaryName', e.target.value)} placeholder="e.g., John Smith" />
                                    </FormField>
                                    <FormField label="Relationship:">
                                        <FormInput value={formData.secondaryRelation} onChange={(e) => handleChange('secondaryRelation', e.target.value)} placeholder="e.g., Brother" />
                                    </FormField>
                                    <FormField label="Mobile No.:">
                                        <FormInput value={formData.secondaryMobile} onChange={(e) => handleChange('secondaryMobile', e.target.value)} placeholder="e.g., 9876501234" />
                                    </FormField>
                                    <FormField label="Alternate Number:">
                                        <FormInput value={formData.secondaryAlternateNo} onChange={(e) => handleChange('secondaryAlternateNo', e.target.value)} placeholder="Optional" />
                                    </FormField>
                                    <FormField label="Full Address:" className="md:col-span-1">
                                        <FormInput value={formData.secondaryAddress} onChange={(e) => handleChange('secondaryAddress', e.target.value)} placeholder="Enter full address" />
                                    </FormField>
                                </div>
                            </div>

                            {/* 4. MEDICAL INFORMATION */}
                            <div className="space-y-4 mt-6">
                                <SectionHeader id={4} title="Medical Information" subText="(Shared only to help the company respond properly in an emergency.)" />
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <FormField label="Blood Group:">
                                        <FormSelect
                                            options={[
                                                { value: 'A+', label: 'A+' }, { value: 'A-', label: 'A-' },
                                                { value: 'B+', label: 'B+' }, { value: 'B-', label: 'B-' },
                                                { value: 'AB+', label: 'AB+' }, { value: 'AB-', label: 'AB-' },
                                                { value: 'O+', label: 'O+' }, { value: 'O-', label: 'O-' }
                                            ]}
                                            value={formData.bloodGroup}
                                            onChange={(e) => handleChange('bloodGroup', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Known Medical Conditions:">
                                        <FormInput value={formData.knownMedicalConditions} onChange={(e) => handleChange('knownMedicalConditions', e.target.value)} placeholder="No or Specify" />
                                    </FormField>
                                    <FormField label="Allergies (if any):">
                                        <FormInput value={formData.allergies} onChange={(e) => handleChange('allergies', e.target.value)} placeholder="No or Specify" />
                                    </FormField>
                                    <FormField label="Regular Medication:">
                                        <FormInput value={formData.regularMedication} onChange={(e) => handleChange('regularMedication', e.target.value)} placeholder="No or Specify" />
                                    </FormField>
                                </div>
                            </div>
                            
                            {/* 5. DOCUMENTS SUBMITTED */}
                            <div className="space-y-4 mt-6">
                                <SectionHeader id={5} title="Documents Submitted" />
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                                    <FormCheckbox
                                        label="Aadhaar of Nominee(s)"
                                        checked={formData.docs.aadhaarNominee}
                                        onChange={(e) => handleDocChange('aadhaarNominee', e.target.checked)}
                                    />
                                    <FormCheckbox
                                        label="Aadhaar of Guardian"
                                        checked={formData.docs.aadhaarGuardian}
                                        onChange={(e) => handleDocChange('aadhaarGuardian', e.target.checked)}
                                    />
                                    <FormCheckbox
                                        label="Employee's Aadhaar"
                                        checked={formData.docs.aadhaarEmployee}
                                        onChange={(e) => handleDocChange('aadhaarEmployee', e.target.checked)}
                                    />
                                    <div className="flex items-center gap-0">
                                        <FormCheckbox
                                            label="Any Other:"
                                            checked={formData.docs.other}
                                            onChange={(e) => handleDocChange('other', e.target.checked)}
                                            className="min-w-fit"
                                        />
                                        {formData.docs.other && (
                                            <FormInput
                                                placeholder="Specify Document Name"
                                                value={formData.otherDocText}
                                                onChange={(e) => handleChange('otherDocText', e.target.value)}
                                                className="h-7"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 6. EMPLOYEE DECLARATION */}
                            <div className="space-y-4 pt-4 mt-6">
                                <SectionHeader id={6} title="Employee Declaration" />
                                <div className="bg-slate-50/50 p-4 rounded space-y-4">
                                    <ul className="list-disc pl-5 text-[12px] text-slate-600 italic leading-relaxed space-y-1">
                                        <li>I hereby declare that the above details are true and correct to the best of my knowledge.</li>
                                        <li>I will immediately inform HR if any emergency contact details change.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* 7. HR VERIFICATION */}
                            <div className="space-y-4 mt-6">
                                <SectionHeader id={7} title="HR Verification Section" />
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <FormField label="Verified By:">
                                        <FormInput value={formData.verifiedBy} readOnly className="bg-slate-50 cursor-default" onChange={(e) => handleChange('verifiedBy', e.target.value)} />
                                    </FormField>
                                    <FormField label="Verification Date:">
                                        <FormInput type="date" value={formData.verificationDate} onChange={(e) => handleChange('verificationDate', e.target.value)} />
                                    </FormField>
                                    <FormField label="Remarks (If Any):" className="md:col-span-3">
                                        <FormInput value={formData.hrRemarks} onChange={(e) => handleChange('hrRemarks', e.target.value)} placeholder="Any remarks..." />
                                    </FormField>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/dashboard/hiring/steps/emergency-contact')}
                                        className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all rounded-[2px]"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                                    >
                                        <Save className="h-4 w-4" />
                                        SAVE DETAILS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </HiringStepLayout>
    );
}
