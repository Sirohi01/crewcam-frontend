'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { FormField, FormInput, FormSelect } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function OfferLetterPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const { user } = useAuthStore();
    const currentUsername = `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || 'Admin';

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        _id: '',
        candidateName: '',
        department: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        reportingTo: '',
        probationPeriod: '',
        address: '',
        monthlyCTC: '',
        annualCTC: '',
        workScheduleDays: '',
        workScheduleTimeStart: '',
        designation: '',
        joiningDate: '',
        validUntil: '',
        offerContent: '',
    });

    const fetchOfferLetter = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/hiring/offer-letter?candidateId=${candidateId}`);
            
            // Check if we got data back for this candidate
            if (data && Array.isArray(data) && data.length > 0) {
                const record = data[0]; // Assuming one offer letter per candidate
                setFormData(prev => ({
                    ...prev,
                    _id: record._id,
                    candidateName: record.candidateName || prev.candidateName,
                    department: record.department || prev.department,
                    date: record.date ? new Date(record.date).toISOString().split('T')[0] : prev.date,
                    location: record.location || prev.location,
                    reportingTo: record.reportingTo || prev.reportingTo,
                    probationPeriod: record.probationPeriod || prev.probationPeriod,
                    address: record.address || prev.address,
                    monthlyCTC: record.monthlyCTC || prev.monthlyCTC,
                    annualCTC: record.annualCTC || prev.annualCTC,
                    workScheduleDays: record.workScheduleDays || prev.workScheduleDays,
                    workScheduleTimeStart: record.workScheduleTimeStart || prev.workScheduleTimeStart,
                    designation: record.designation || prev.designation,
                    joiningDate: record.joiningDate ? new Date(record.joiningDate).toISOString().split('T')[0] : prev.joiningDate,
                    validUntil: record.validUntil ? new Date(record.validUntil).toISOString().split('T')[0] : prev.validUntil,
                    offerContent: record.offerContent || prev.offerContent,
                }));
            } else {
                // If no Offer Letter, maybe we can fetch Candidate details to prefill name/designation/etc
                try {
                    const { data: pipelineData } = await api.get(`/hiring/candidates/${candidateId}/pipeline`);
                    // This is optional if pipeline has candidate details, else skip
                } catch (e) {
                    // ignore
                }
            }
        } catch (error) {
            console.error('Error fetching Offer Letter details:', error);
            toast.error('Failed to load Offer Letter details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (candidateId) {
            fetchOfferLetter();
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

            // In backend routes, update uses POST if ID doesn't exist? Wait, it's POST to create, PATCH/PUT to update.
            // But offerLetter schema uses POST to /offer-letter to create
            if (_id) {
                await api.put(`/hiring/offer-letter/${_id}`, payload);
                toast.success('Offer Letter updated successfully.');
            } else {
                await api.post('/hiring/offer-letter', payload);
                toast.success('Offer Letter saved successfully.');
            }
            fetchOfferLetter();
            setTimeout(() => {
                router.push('/dashboard/hiring/steps/offer-letter');
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save offer letter information');
        }
    };

    const SectionHeader = ({ id, title }: { id: number, title: string }) => (
        <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-4">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">{id}</span>
                {title}
            </h3>
        </div>
    );

    if (loading) {
        return <div className="p-10 text-center text-sm text-slate-500">Loading form data...</div>;
    }

    return (
        <HiringStepLayout candidateId={candidateId} stepId="offer-letter">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">OFFER LETTER</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                    <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                        <div className="bg-white pb-3 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                                <FileText className="h-4 w-4 text-[#0d3c68]" />
                                Candidate Offer Details
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
                                <FormField label="Department">
                                    <FormInput
                                        value={formData.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                        placeholder="e.g., Software Development"
                                    />
                                </FormField>
                                
                                <FormField label="Date">
                                    <FormInput
                                        value={formData.date}
                                        onChange={(e) => handleChange('date', e.target.value)}
                                        placeholder="e.g., Value"
                                        type="date"
                                    />
                                </FormField>
                                <FormField label="Location">
                                    <FormInput
                                        value={formData.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Reporting To">
                                    <FormInput
                                        value={formData.reportingTo}
                                        onChange={(e) => handleChange('reportingTo', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Probation Period">
                                    <FormInput
                                        value={formData.probationPeriod}
                                        onChange={(e) => handleChange('probationPeriod', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Address">
                                    <FormInput
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Monthly C T C">
                                    <FormInput
                                        value={formData.monthlyCTC}
                                        onChange={(e) => handleChange('monthlyCTC', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Annual C T C">
                                    <FormInput
                                        value={formData.annualCTC}
                                        onChange={(e) => handleChange('annualCTC', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Work Schedule Days">
                                    <FormInput
                                        value={formData.workScheduleDays}
                                        onChange={(e) => handleChange('workScheduleDays', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>

                                <FormField label="Work Schedule Time Start">
                                    <FormInput
                                        value={formData.workScheduleTimeStart}
                                        onChange={(e) => handleChange('workScheduleTimeStart', e.target.value)}
                                        placeholder="e.g., Value"
                                    />
                                </FormField>
                                <FormField label="Designation">
                                    <FormInput
                                        value={formData.designation}
                                        onChange={(e) => handleChange('designation', e.target.value)}
                                        placeholder="e.g., Frontend Developer"
                                    />
                                </FormField>

                                <FormField label="Joining Date">
                                    <FormInput
                                        value={formData.joiningDate}
                                        onChange={(e) => handleChange('joiningDate', e.target.value)}
                                        type="date"
                                    />
                                </FormField>
                                <FormField label="Offer Valid Until">
                                    <FormInput
                                        value={formData.validUntil}
                                        onChange={(e) => handleChange('validUntil', e.target.value)}
                                        type="date"
                                    />
                                </FormField>
                            </div>

                            <div className="pt-2">
                                <FormField label="Offer Content">
                                    <textarea
                                        value={formData.offerContent}
                                        onChange={(e) => handleChange('offerContent', e.target.value)}
                                        placeholder="Dear Candidate, we are pleased to offer you..."
                                        className="w-full h-32 p-3 border border-slate-200 rounded-[2px] text-xs outline-none focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68] transition-all resize-none"
                                    />
                                </FormField>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-start items-center gap-2 pt-6">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#1a1a1a] text-white hover:bg-black shadow-md hover:shadow-lg transition-all rounded-[4px] tracking-wide"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Step Record
                                </button>
                                <button
                                    onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/offerLetter`, '_blank')}
                                    className="flex items-center gap-2 px-8 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[4px] tracking-wide"
                                >
                                    PRINT
                                </button>
                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>
        </HiringStepLayout>
    );
}
