'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, Save } from 'lucide-react';
import { FormField, FormInput, FormSelect, FormCheckbox } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useMasterDataStore } from '@/store/masterDataStore';
import { useAuthStore } from '@/store/authStore';

export default function NominationFormPage({ candidateId }: { candidateId: string }) {
    const router = useRouter();

    const { departments, designations, fetchMasterData } = useMasterDataStore();
    const departmentOptions = departments.map(d => ({ value: d.name || '', label: d.name || '' }));
    const designationOptions = designations.map(d => ({ value: d.title || d.name || '', label: d.title || d.name || '' }));
    const { user } = useAuthStore();
    const currentUsername = `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || 'Admin';

    const [loading, setLoading] = React.useState(true);
    const [isPreFilled, setIsPreFilled] = React.useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        employeeName: '',
        empCode: '',
        designation: '',
        department: '',
        fatherHusbandSpouse: '',
        dob: '',
        gender: '',
        mobileNumber: '',
        emailId: '',
        dateOfJoining: '',
        workLocation: '',
        reportingTo: '',
        currentAddress: '',
        aadhaarNumber: '',
        panNumber: '',
        drivingLicense: '',
        passportNumber: '',
        accountHolderName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifscCode: '',
        nominee1FullName: '',
        nominee1Relationship: '',
        nominee1Dob: '',
        nominee1Mobile: '',
        nominee1Address: '',
        nominee1Percentage: '100',
        nominee2FullName: '',
        nominee2Relationship: '',
        nominee2Dob: '',
        nominee2Mobile: '',
        nominee2Address: '',
        nominee2Percentage: '',
        guardianName: '',
        guardianMobile: '',
        guardianRelationship: '',
        guardianAddress: '',
        docs: {
            aadhaarNominee: false,
            aadhaarGuardian: false,
            aadhaarEmployee: false,
            other: false
        },
        otherDocText: '',
        verifiedBy: currentUsername,
        verifierRemarks: '',
        hrRemarks: '',
        employeeSignatureDate: '',
        verifierDate: '',
        hrDate: '',
        status: 'active'
    });

    const setField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchMasterData();
        fetchNominationData();
    }, [candidateId]);

    const fetchNominationData = async () => {
        try {
            setLoading(true);
            const candidateRes = await api.get(`/hiring/candidates/${candidateId}`);
            const cand = candidateRes.data;

            let fetchedEmpCode = cand.employeeCode || '';
            let fetchedDoj = '';
            let fetchedDob = '';
            let fetchedGender = '';
            let fetchedFather = '';
            let fetchedAddress = '';
            let fetchedAadhaar = '';
            let fetchedPan = '';

            try {
                const docRes = await api.get('/hiring/doc-checklist', { params: { candidateId } });
                const docList = Array.isArray(docRes.data) ? docRes.data : (docRes.data?.data || []);
                if (docList.length > 0) fetchedEmpCode = docList[0].empCode || docList[0].employeeCode || fetchedEmpCode;
            } catch (e) { }

            try {
                const selRes = await api.get('/hiring/selection-approval', { params: { candidateId } });
                const selList = Array.isArray(selRes.data) ? selRes.data : (selRes.data?.data || []);
                if (selList.length > 0) {
                    const sel = selList[0];
                    const dateRaw = sel.dateOfJoining || sel.joiningDate;
                    if (dateRaw) fetchedDoj = new Date(dateRaw).toISOString().split('T')[0];
                }
            } catch (e) { }

            try {
                const joinRes = await api.get('/hiring/joining-form', { params: { candidateId } });
                const joinList = Array.isArray(joinRes.data) ? joinRes.data : (joinRes.data?.data || []);
                if (joinList.length > 0) {
                    const jf = joinList[0];
                    if (jf.dob) fetchedDob = new Date(jf.dob).toISOString().split('T')[0];
                    fetchedGender = jf.gender || '';
                    fetchedFather = jf.fatherName || jf.fatherHusbandSpouse || jf.fatherMotherName || '';
                    fetchedAddress = jf.currentAddress || jf.permanentAddress || '';
                    fetchedAadhaar = jf.aadhaarNumber || '';
                    fetchedPan = jf.panNumber || '';
                }
            } catch (e) { }

            const appDetails = cand.applicationDetails || {};
            if (!fetchedDob && appDetails.dateOfBirth) fetchedDob = new Date(appDetails.dateOfBirth).toISOString().split('T')[0];
            if (!fetchedGender && appDetails.gender) fetchedGender = appDetails.gender;
            
            const defaultDesignation = cand.jobRole || appDetails.title || '';
            const defaultDepartment = cand.departmentId?.name || cand.department || '';
            const defaultEmployeeName = cand.firstName + ' ' + (cand.lastName || '');

            const nomRes = await api.get('/hiring/nomination', { params: { candidateId } });
            const list = Array.isArray(nomRes.data) ? nomRes.data : (nomRes.data?.data || []);

            if (list.length > 0) {
                const row = list[0];
                setFormData({
                    ...row,
                    docs: row.docs || formData.docs,
                    employeeName: row.employeeName || defaultEmployeeName,
                    empCode: row.empCode || fetchedEmpCode,
                    designation: row.designation || defaultDesignation,
                    department: row.department || defaultDepartment,
                    emailId: row.emailId || cand.email || '',
                    mobileNumber: row.mobileNumber || cand.phone || '',
                    dob: row.dob ? new Date(row.dob).toISOString().split('T')[0] : fetchedDob,
                    dateOfJoining: row.dateOfJoining ? new Date(row.dateOfJoining).toISOString().split('T')[0] : fetchedDoj,
                    gender: row.gender || fetchedGender,
                    fatherName: row.fatherName || fetchedFather,
                    maritalStatus: row.maritalStatus || '',
                    presentAddress: row.presentAddress || fetchedAddress,
                    permanentAddress: row.permanentAddress || fetchedAddress,
                    aadhaarNo: row.aadhaarNo || fetchedAadhaar,
                    panNo: row.panNo || fetchedPan,
                    nominee1Dob: row.nominee1Dob ? new Date(row.nominee1Dob).toISOString().split('T')[0] : '',
                    nominee2Dob: row.nominee2Dob ? new Date(row.nominee2Dob).toISOString().split('T')[0] : '',
                    employeeSignatureDate: row.employeeSignatureDate ? new Date(row.employeeSignatureDate).toISOString().split('T')[0] : '',
                    verifierDate: row.verifierDate ? new Date(row.verifierDate).toISOString().split('T')[0] : '',
                    hrDate: row.hrDate ? new Date(row.hrDate).toISOString().split('T')[0] : '',
                });
                setIsPreFilled(true);
            } else {
                setFormData(prev => ({
                    ...prev,
                    employeeName: defaultEmployeeName,
                    empCode: fetchedEmpCode,
                    designation: defaultDesignation,
                    department: defaultDepartment,
                    emailId: cand.email || '',
                    mobileNumber: cand.phone || '',
                    dob: fetchedDob,
                    dateOfJoining: fetchedDoj,
                    gender: fetchedGender,
                    fatherName: fetchedFather,
                    presentAddress: fetchedAddress,
                    permanentAddress: fetchedAddress,
                    aadhaarNo: fetchedAadhaar,
                    panNo: fetchedPan,
                }));
            }
        } catch (error: any) {
            console.error('Failed to load nomination data', error);
            toast.error('Failed to load nomination data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => setField(field, value);
    const handleDocChange = (field: string, value: boolean) => setField('docs', { ...formData.docs, [field]: value });

    const handleSave = async () => {
        try {
            const { _id, ...submitData } = formData as any;
            let nominees = [];
            if (submitData.nominee1FullName) {
                nominees.push({
                    name: submitData.nominee1FullName,
                    relationship: submitData.nominee1Relationship,
                    dob: submitData.nominee1Dob || undefined,
                    sharePercentage: Number(submitData.nominee1Percentage) || 0,
                    address: submitData.nominee1Address,
                    isMinor: !!submitData.guardianName,
                    guardianName: submitData.guardianName,
                    guardianRelationship: submitData.guardianRelationship,
                    guardianAddress: submitData.guardianAddress
                });
            }
            if (submitData.nominee2FullName) {
                nominees.push({
                    name: submitData.nominee2FullName,
                    relationship: submitData.nominee2Relationship,
                    dob: submitData.nominee2Dob || undefined,
                    sharePercentage: Number(submitData.nominee2Percentage) || 0,
                    address: submitData.nominee2Address,
                    isMinor: false
                });
            }

            const payload = {
                ...submitData,
                candidateId,
                nominationType: 'PF',
                nominees
            };

            if (_id) {
                await api.put(`/hiring/nomination/${_id}`, payload);
                toast.success('Nomination details updated successfully.');
            } else {
                await api.post('/hiring/nomination', payload);
                toast.success('Nomination details saved successfully.');
            }
            fetchNominationData();
            setTimeout(() => {
                router.push('/dashboard/hiring/steps/nomination');
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save nomination');
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
        <HiringStepLayout candidateId={candidateId} stepId="nomination">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-0 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">NOMINATION FORM</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">



                    <div className="section-card shadow-sm border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print mt-4">
                        <div className="bg-white  pb-3 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
                                <FileCheck className="h-4 w-4 text-[#0d3c68]" />
                                Employee Nomination Details
                            </h2>
                        </div>

                        <div className="p-3 space-y-4">
                            {/* 1. EMPLOYEE DETAILS */}
                            <SectionHeader id={1} title="Employee Details" />
                            <div className="grid grid-cols-1 md:grid-cols-5 print:grid-cols-2 gap-4">
                                <FormField label="1. Employee Name:" required>
                                    <FormInput placeholder="Enter Employee Name" value={formData.employeeName} onChange={(e) => handleChange("employeeName", e.target.value)} required readOnly={isPreFilled} />
                                </FormField>
                                <FormField label="EMP Code (HR):">
                                    <FormInput placeholder="Enter EMP Code" value={formData.empCode} onChange={(e) => handleChange("empCode", e.target.value)} />
                                </FormField>
                                <FormField label="2. Designation:" required>
                                    <FormSelect options={designationOptions} value={formData.designation} onChange={(e) => handleChange("designation", e.target.value)} required placeholder="Select Designation" />
                                </FormField>
                                <FormField label="Department:" required>
                                    <FormSelect options={departmentOptions} value={formData.department} onChange={(e) => handleChange("department", e.target.value)} required placeholder="Select Department" />
                                </FormField>
                                <FormField label="3. Father's / Spouse Name:">
                                    <FormInput placeholder="Enter Father's / Spouse Name" value={formData.fatherHusbandSpouse} onChange={(e) => handleChange("fatherHusbandSpouse", e.target.value)} />
                                </FormField>
                                <FormField label="4. Date of Birth:" required>
                                    <FormInput type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
                                </FormField>
                                <FormField label="Gender:" required>
                                    <FormSelect options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} required />
                                </FormField>
                                <FormField label="Date of Joining:" required>
                                    <FormInput type="date" value={formData.dateOfJoining} onChange={(e) => handleChange("dateOfJoining", e.target.value)} required />
                                </FormField>
                                <FormField label="Mobile Number:" required>
                                    <FormInput placeholder="Enter Mobile Number" type="tel" value={formData.mobileNumber} onChange={(e) => handleChange("mobileNumber", e.target.value)} required />
                                </FormField>
                                <FormField label="Email ID:" required>
                                    <FormInput placeholder="Enter Email ID" type="email" value={formData.emailId} onChange={(e) => handleChange("emailId", e.target.value)} required />
                                </FormField>
                            </div>

                            {/* 2. NOMINATION DETAILS */}
                            <div className="space-y-4 pt-4">
                                <SectionHeader id={2} title="Nomination Details (PF, Gratuity, ESIC)" />
                                {/* Nominee 1 */}
                                <div className="bg-slate-50/50 p-3 rounded border border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1">Nominee 1</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                        <FormField label="Full Name:" className="md:col-span-2">
                                            <FormInput placeholder="Enter Full Name" value={formData.nominee1FullName} onChange={(e) => handleChange('nominee1FullName', e.target.value)} />
                                        </FormField>
                                        <FormField label="Relationship:">
                                            <FormSelect options={[{ value: '', label: 'Select' }, { value: 'Spouse', label: 'Spouse' }, { value: 'Father', label: 'Father' }, { value: 'Mother', label: 'Mother' }, { value: 'Son', label: 'Son' }, { value: 'Daughter', label: 'Daughter' }, { value: 'Other', label: 'Other' }]} value={formData.nominee1Relationship} onChange={(e) => handleChange('nominee1Relationship', e.target.value)} />
                                        </FormField>
                                        <FormField label="DOB:">
                                            <FormInput type="date" value={formData.nominee1Dob} onChange={(e) => handleChange('nominee1Dob', e.target.value)} />
                                        </FormField>
                                        <FormField label="Share (%):">
                                            <FormInput placeholder="e.g. 100" type="number" min="1" max="100" value={formData.nominee1Percentage} onChange={(e) => handleChange('nominee1Percentage', e.target.value)} />
                                        </FormField>
                                        <FormField label="Address:">
                                            <FormInput placeholder="Enter Address" value={formData.nominee1Address} onChange={(e) => handleChange('nominee1Address', e.target.value)} />
                                        </FormField>
                                    </div>
                                </div>
                                {/* Nominee 2 */}
                                <div className="bg-slate-50/50 p-3 rounded border border-slate-100 mt-2">
                                    <h4 className="text-xs font-bold text-slate-700 mb-3 border-b border-slate-200 pb-1">Nominee 2 (Optional)</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                        <FormField label="Full Name:" className="md:col-span-2">
                                            <FormInput placeholder="Enter Full Name" value={formData.nominee2FullName} onChange={(e) => handleChange('nominee2FullName', e.target.value)} />
                                        </FormField>
                                        <FormField label="Relationship:">
                                            <FormSelect options={[{ value: '', label: 'Select' }, { value: 'Spouse', label: 'Spouse' }, { value: 'Father', label: 'Father' }, { value: 'Mother', label: 'Mother' }, { value: 'Son', label: 'Son' }, { value: 'Daughter', label: 'Daughter' }, { value: 'Other', label: 'Other' }]} value={formData.nominee2Relationship} onChange={(e) => handleChange('nominee2Relationship', e.target.value)} />
                                        </FormField>
                                        <FormField label="DOB:">
                                            <FormInput type="date" value={formData.nominee2Dob} onChange={(e) => handleChange('nominee2Dob', e.target.value)} />
                                        </FormField>
                                        <FormField label="Share (%):">
                                            <FormInput placeholder="e.g. 50" type="number" min="1" max="100" value={formData.nominee2Percentage} onChange={(e) => handleChange('nominee2Percentage', e.target.value)} />
                                        </FormField>
                                        <FormField label="Address:">
                                            <FormInput placeholder="Enter Address" value={formData.nominee2Address} onChange={(e) => handleChange('nominee2Address', e.target.value)} />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* 3. GUARDIAN DETAILS */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <SectionHeader id={3} title="Guardian Details (If Nominee is a Minor)" subText="Fill only if any nominee is below 18 years" />
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <FormField label="1. Guardian Name:">
                                        <FormInput placeholder="Enter Guardian Name" value={formData.guardianName} onChange={(e) => handleChange('guardianName', e.target.value)} />
                                    </FormField>
                                    <FormField label="Mobile Number:">
                                        <FormInput placeholder="Enter Mobile Number" type="tel" value={formData.guardianMobile} onChange={(e) => handleChange('guardianMobile', e.target.value)} />
                                    </FormField>
                                    <FormField label="3. Address:" className="md:col-span-1">
                                        <FormInput placeholder="Enter Address" value={formData.guardianAddress} onChange={(e) => handleChange('guardianAddress', e.target.value)} />
                                    </FormField>
                                    <FormField label="2. Relationship with Minor:" className="md:col-span-2">
                                        <FormInput placeholder="Enter Relationship" value={formData.guardianRelationship} onChange={(e) => handleChange('guardianRelationship', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>

                            {/* 4. DOCUMENTS SUBMITTED */}
                            <div className="space-y-4">
                                <SectionHeader id={4} title="Documents Submitted" />
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                                    <FormCheckbox label="Aadhaar of Nominee(s)" checked={formData.docs.aadhaarNominee} onChange={(e) => handleDocChange('aadhaarNominee', e.target.checked)} />
                                    <FormCheckbox className='col-span-1' label="Aadhaar of Guardian" checked={formData.docs.aadhaarGuardian} onChange={(e) => handleDocChange('aadhaarGuardian', e.target.checked)} />
                                    <FormCheckbox label="Employee's Aadhaar" checked={formData.docs.aadhaarEmployee} onChange={(e) => handleDocChange('aadhaarEmployee', e.target.checked)} />
                                    <div className="flex items-center gap-0">
                                        <FormCheckbox label="Any Other:" checked={formData.docs.other} onChange={(e) => handleDocChange('other', e.target.checked)} className="min-w-fit" />
                                        {formData.docs.other && (
                                            <FormInput placeholder="Specify Document" value={formData.otherDocText} onChange={(e) => handleChange('otherDocText', e.target.value)} className="h-7" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 5. HR SECTION */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <SectionHeader id={5} title="HR Section (Verifier review)" />
                                <div className="grid grid-cols-4 gap-4">
                                    <FormField label="• HR Verified By:">
                                        <FormInput value={formData.verifiedBy} readOnly className="bg-slate-50 cursor-default" />
                                    </FormField>
                                    <FormField label="• Verifier Remarks:">
                                        <FormInput placeholder="Enter Remarks" value={formData.verifierRemarks} onChange={(e) => handleChange('verifierRemarks', e.target.value)} />
                                    </FormField>
                                    <FormField label="• HR Remarks Date:" className="md:col-span-1">
                                        <FormInput type="date" value={formData.hrRemarks} onChange={(e) => handleChange('hrRemarks', e.target.value)} />
                                    </FormField>
                                </div>
                            </div>

                            {/* 6. FORM FOOTER */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4">
                                    <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide">
                                        <Save className="h-4 w-4" />
                                        SAVE NOMINATION
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
