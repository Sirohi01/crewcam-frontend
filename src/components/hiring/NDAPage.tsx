'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save } from 'lucide-react';
import { FormField, FormInput, FormSelect } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useMasterDataStore } from '@/store/masterDataStore';

export default function NDAPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const { departments, designations, fetchMasterData } = useMasterDataStore();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        _id: '',
        candidateName: '',
        fatherName: '',
        age: '',
        department: '',
        designation: '',
        residentOf1: '',
        residentOf2: '',
        witness1Name: '',
        witness1Address: '',
        witness1Date: '',
        witness2Name: '',
        witness2Address: '',
        witness2Date: '',
        documentContent: '',
    });

    const fetchNDA = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/hiring/nda?candidateId=${candidateId}`);

            // Auto-fetch defaults
            let fetchedCandidateName = '';
            let fetchedFatherName = '';
            let fetchedDepartment = '';
            let fetchedDesignation = '';
            let fetchedAddress = '';
            let fetchedAge = '';

            try {
                const candidateRes = await api.get(`/hiring/candidates/${candidateId}`);
                const cand = candidateRes.data;
                fetchedCandidateName = `${cand.firstName} ${cand.lastName || ''}`.trim();
                fetchedDepartment = cand.departmentId?.name || cand.department || '';
                fetchedDesignation = cand.jobRole || '';
            } catch (e) { }

            try {
                const joinRes = await api.get('/hiring/joining-form', { params: { candidateId } });
                const joinList = Array.isArray(joinRes.data) ? joinRes.data : (joinRes.data?.data || []);
                if (joinList.length > 0) {
                    const jf = joinList[0];
                    fetchedFatherName = jf.fatherName || jf.fatherHusbandSpouse || jf.fatherMotherName || '';
                    fetchedAddress = jf.currentAddress || jf.permanentAddress || '';
                    
                    if (jf.dob) {
                        const birthDate = new Date(jf.dob);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                        fetchedAge = age.toString();
                    }
                }
            } catch (e) { }

            try {
                if (!fetchedDepartment || !fetchedDesignation) {
                    const nomRes = await api.get('/hiring/nomination', { params: { candidateId } });
                    const nomList = Array.isArray(nomRes.data) ? nomRes.data : (nomRes.data?.data || []);
                    if (nomList.length > 0) {
                        const nom = nomList[0];
                        if (!fetchedDepartment && nom.department) fetchedDepartment = nom.department;
                        if (!fetchedDesignation && nom.designation) fetchedDesignation = nom.designation;
                        if (!fetchedFatherName && nom.fatherName) fetchedFatherName = nom.fatherName;
                    }
                }
            } catch (e) { }

            if (data && Array.isArray(data) && data.length > 0) {
                const record = data[0];
                setFormData(prev => ({
                    ...prev,
                    _id: record._id,
                    candidateName: record.candidateName || fetchedCandidateName || prev.candidateName,
                    fatherName: record.fatherName || fetchedFatherName || prev.fatherName,
                    age: record.age || fetchedAge || prev.age,
                    department: record.department || fetchedDepartment || prev.department,
                    designation: record.designation || fetchedDesignation || prev.designation,
                    residentOf1: record.residentOf1 || fetchedAddress || prev.residentOf1,
                    residentOf2: record.residentOf2 || fetchedAddress || prev.residentOf2,
                    witness1Name: record.witness1Name || prev.witness1Name,
                    witness1Address: record.witness1Address || prev.witness1Address,
                    witness1Date: record.witness1Date ? new Date(record.witness1Date).toISOString().split('T')[0] : prev.witness1Date,
                    witness2Name: record.witness2Name || prev.witness2Name,
                    witness2Address: record.witness2Address || prev.witness2Address,
                    witness2Date: record.witness2Date ? new Date(record.witness2Date).toISOString().split('T')[0] : prev.witness2Date,
                    documentContent: record.documentContent || prev.documentContent,
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    candidateName: fetchedCandidateName || prev.candidateName,
                    fatherName: fetchedFatherName || prev.fatherName,
                    age: fetchedAge || prev.age,
                    department: fetchedDepartment || prev.department,
                    designation: fetchedDesignation || prev.designation,
                    residentOf1: fetchedAddress || prev.residentOf1,
                    residentOf2: fetchedAddress || prev.residentOf2,
                }));
            }
        } catch (error) {
            console.error('Error fetching NDA details:', error);
            toast.error('Failed to load NDA details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (candidateId) {
            fetchMasterData();
            fetchNDA();
        }
    }, [candidateId]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const { _id, ...submitData } = formData;

            const payload = {
                ...submitData,
                candidateId,
            };

            if (_id) {
                await api.put(`/hiring/nda/${_id}`, payload);
                toast.success('NDA updated successfully.');
            } else {
                await api.post('/hiring/nda', payload);
                toast.success('NDA saved successfully.');
            }
            fetchNDA();
            setTimeout(() => {
                router.push(`/dashboard/hiring/${candidateId}/steps/it-policy-accept`);
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save NDA information');
        }
    };

    const handleSign = async () => {
        try {
            if (!formData._id) {
                toast.error('Please save the NDA first before signing.');
                return;
            }
            await api.put(`/hiring/nda/${formData._id}/sign`);
            toast.success('NDA signed and step completed successfully.');
            fetchNDA();
            setTimeout(() => {
                router.push(`/dashboard/hiring/${candidateId}/steps/it-policy-accept`);
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to sign NDA');
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-sm text-slate-500">Loading form data...</div>;
    }

    return (
        <HiringStepLayout candidateId={candidateId} stepId="nda">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">STEP 14. NDA</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                    <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                        <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                                <FileText className="h-4 w-4 text-[#0d3c68]" />
                                Non-Disclosure Agreement Details
                            </h2>
                        </div>

                        <div className="p-3 space-y-4">
                            {/* Party Details */}
                            <div className="space-y-2">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                                    Party Details (The Employee)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                    <FormField label="Candidate Name">
                                        <FormInput
                                            value={formData.candidateName}
                                            onChange={(e) => handleChange('candidateName', e.target.value)}
                                            placeholder="Full Name"
                                        />
                                    </FormField>
                                    <FormField label="Father's Name">
                                        <FormInput
                                            value={formData.fatherName}
                                            onChange={(e) => handleChange('fatherName', e.target.value)}
                                            placeholder="S/o"
                                        />
                                    </FormField>
                                    <FormField label="Age">
                                        <FormInput
                                            value={formData.age}
                                            onChange={(e) => handleChange('age', e.target.value)}
                                            placeholder="Aged about"
                                        />
                                    </FormField>

                                    <FormField label="Department">
                                        <FormSelect
                                            options={departments.map((d: any) => ({ value: d.name, label: d.name }))}
                                            value={formData.department}
                                            onChange={(e) => handleChange('department', e.target.value)}
                                            placeholder="Select Department"
                                        />
                                    </FormField>
                                    <FormField label="Appointed As (Designation)">
                                        <FormSelect
                                            options={designations.map((d: any) => ({ value: d.name, label: d.name }))}
                                            value={formData.designation}
                                            onChange={(e) => handleChange('designation', e.target.value)}
                                            placeholder="Select Designation"
                                        />
                                    </FormField>
                                    <FormField label="Resident Of (Line 1)" className="md:col-span-2">
                                        <FormInput
                                            value={formData.residentOf1}
                                            onChange={(e) => handleChange('residentOf1', e.target.value)}
                                            placeholder="Address Line 1"
                                        />
                                    </FormField>
                                    <FormField label="Resident Of (Line 2)">
                                        <FormInput
                                            value={formData.residentOf2}
                                            onChange={(e) => handleChange('residentOf2', e.target.value)}
                                            placeholder="Address Line 2"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* 1st Witness */}
                                <div className="bg-slate-50 p-2 rounded-[2px]">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                                        1st Witness Details
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <FormField label="Name" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                value={formData.witness1Name}
                                                onChange={(e) => handleChange('witness1Name', e.target.value)}
                                            />
                                        </FormField>

                                        <FormField label="Address" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                value={formData.witness1Address}
                                                onChange={(e) => handleChange('witness1Address', e.target.value)}
                                            />
                                        </FormField>

                                        <FormField label="Date" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                type="date"
                                                value={formData.witness1Date}
                                                onChange={(e) => handleChange('witness1Date', e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {/* 2nd Witness */}
                                <div className="bg-slate-50 p-2 rounded-[2px]">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                                        2nd Witness Details
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <FormField label="Name" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                value={formData.witness2Name}
                                                onChange={(e) => handleChange('witness2Name', e.target.value)}
                                            />
                                        </FormField>

                                        <FormField label="Address" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                value={formData.witness2Address}
                                                onChange={(e) => handleChange('witness2Address', e.target.value)}
                                            />
                                        </FormField>

                                        <FormField label="Date" className="space-y-0.5">
                                            <FormInput
                                                className="h-8"
                                                type="date"
                                                value={formData.witness2Date}
                                                onChange={(e) => handleChange('witness2Date', e.target.value)}
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <FormField label="NDA Content">
                                    <textarea
                                        value={formData.documentContent}
                                        onChange={(e) => handleChange('documentContent', e.target.value)}
                                        placeholder="Non-Disclosure Agreement terms..."
                                        className="w-full h-32 p-3 border border-slate-200 rounded-[2px] text-xs outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] transition-all resize-none"
                                    />
                                </FormField>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-start items-center gap-4 pt-2">
                                <button
                                    onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/nda`, '_blank')}
                                    className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-slate-600 text-white hover:bg-slate-700 shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
                                >
                                    PRINT
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#1a1a1a] text-white hover:bg-black shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Step Record
                                </button>
                                {formData._id && (
                                    <button
                                        onClick={handleSign}
                                        className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2f52] shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Sign & Complete NDA
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>
        </HiringStepLayout>
    );
}
