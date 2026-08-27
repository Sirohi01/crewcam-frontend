'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save } from 'lucide-react';
import { FormField, FormInput } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function NDAPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();
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

            if (data && Array.isArray(data) && data.length > 0) {
                const record = data[0];
                setFormData(prev => ({
                    ...prev,
                    _id: record._id,
                    candidateName: record.candidateName || prev.candidateName,
                    fatherName: record.fatherName || prev.fatherName,
                    age: record.age || prev.age,
                    department: record.department || prev.department,
                    designation: record.designation || prev.designation,
                    residentOf1: record.residentOf1 || prev.residentOf1,
                    residentOf2: record.residentOf2 || prev.residentOf2,
                    witness1Name: record.witness1Name || prev.witness1Name,
                    witness1Address: record.witness1Address || prev.witness1Address,
                    witness1Date: record.witness1Date ? new Date(record.witness1Date).toISOString().split('T')[0] : prev.witness1Date,
                    witness2Name: record.witness2Name || prev.witness2Name,
                    witness2Address: record.witness2Address || prev.witness2Address,
                    witness2Date: record.witness2Date ? new Date(record.witness2Date).toISOString().split('T')[0] : prev.witness2Date,
                    documentContent: record.documentContent || prev.documentContent,
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Candidate Name">
                                    <FormInput
                                        value={formData.candidateName}
                                        onChange={(e) => handleChange('candidateName', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Father Name">
                                    <FormInput
                                        value={formData.fatherName}
                                        onChange={(e) => handleChange('fatherName', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Age">
                                    <FormInput
                                        value={formData.age}
                                        onChange={(e) => handleChange('age', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Department">
                                    <FormInput
                                        value={formData.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                        placeholder="e.g., Software Developer"
                                    />
                                </FormField>

                                <FormField label="Designation">
                                    <FormInput
                                        value={formData.designation}
                                        onChange={(e) => handleChange('designation', e.target.value)}
                                        placeholder="e.g., Frontend Developer"
                                    />
                                </FormField>
                                <FormField label="Resident Of1">
                                    <FormInput
                                        value={formData.residentOf1}
                                        onChange={(e) => handleChange('residentOf1', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Resident Of2">
                                    <FormInput
                                        value={formData.residentOf2}
                                        onChange={(e) => handleChange('residentOf2', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Witness1 Name">
                                    <FormInput
                                        value={formData.witness1Name}
                                        onChange={(e) => handleChange('witness1Name', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Witness1 Address">
                                    <FormInput
                                        value={formData.witness1Address}
                                        onChange={(e) => handleChange('witness1Address', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Witness1 Date">
                                    <FormInput
                                        value={formData.witness1Date}
                                        onChange={(e) => handleChange('witness1Date', e.target.value)}
                                        placeholder="e.g., Value"
                                        type="date"
                                    />
                                </FormField>

                                <FormField label="Witness2 Name">
                                    <FormInput
                                        value={formData.witness2Name}
                                        onChange={(e) => handleChange('witness2Name', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Witness2 Address">
                                    <FormInput
                                        value={formData.witness2Address}
                                        onChange={(e) => handleChange('witness2Address', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Witness2 Date">
                                    <FormInput
                                        value={formData.witness2Date}
                                        onChange={(e) => handleChange('witness2Date', e.target.value)}
                                        placeholder="e.g., Value"
                                        type="date"
                                    />
                                </FormField>
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
