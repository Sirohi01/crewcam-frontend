'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Search, FileText, ChevronDown, Check, FileCheck2 } from 'lucide-react';
import { FormField, FormInput, FormSelect, FormRadioGroup, FormTextarea } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintButton } from '@/components/common/PrintButton';
import { PrintHeader } from '@/components/common/PrintHeader';
import { DataTable } from '@/components/common/DataTable';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useMasterDataStore } from '@/store/masterDataStore';

const INITIAL_FORM_DATA = {
    type: 'request' as 'request' | 'report',
    // Common fields
    candidateName: '',
    department: '',
    position: '',
    workLocation: '',
    reportingTo: '',
    mobileNo: '',
    emailId: '',
    empCode: '',
    status: 'active',

    // --- REQUEST FORM DATA ---
    fullName: '',
    joiningDate: '',
    positionFor: '',
    homeNo: '',
    alternateNo: '',
    currentAddress: '',
    currentState: 'Uttar Pradesh',
    currentCityPin: '',
    currentCountry: 'Bharat',
    permanentAddress: '',
    permanentState: 'Uttar Pradesh',
    permanentCityPin: '',
    permanentCountry: 'Bharat',

    docs: {
        aadhaarCard: false, panCard: false, marksheet10: false, marksheet12: false,
        graduationCert: false, pgCert: false, expCerts: false, relievingLetter: false,
        prevApptLetters: false, salarySlips3Months: false, bankStatements3Months: false, policeVerif: false,
    },

    ref1: { name: '', designation: '', relationship: '', organization: '', mobileNo: '', emailId: '', durationKnown: '' },
    ref2: { name: '', designation: '', relationship: '', organization: '', mobileNo: '', emailId: '', durationKnown: '' },

    bgvType: {
        idVerification: false, addressVerification: false, employmentVerification: false,
        policeVerification: false, educationVerification: false, referenceCheck: false, completePackage: false,
    },

    requestedBy: '',
    requestDate: '',
    requestDesignation: 'HR Manager',
    priorityLevel: 'Normal',

    requestApprovals: {
        hrManager: { name: '', signature: '', date: '' },
        deptHead: { name: '', signature: '', date: '' },
        director: { name: '', signature: '', date: '' },
    },

    // --- REPORT FORM DATA ---
    reportCandidateName: '',
    reportPosition: '',
    reportEmpCode: '',
    reportDepartment: '',
    reportDOJ: '',
    reportMobileNo: '',
    reportEmailId: '',

    verifResults: {
        id: { verified: false, discrepancy: false, remarks: '' },
        address: { verified: false, discrepancy: false, remarks: '' },
        education: {
            tenth: { verified: false, remarks: '' },
            twelfth: { verified: false, remarks: '' },
            graduation: { verified: false, remarks: '' },
            postGrad: { verified: false, remarks: '' },
        },
        employment: {
            employer1: { verified: false, remarks: '' },
            employer2: { verified: false, remarks: '' },
        },
        reference: {
            ref1: { outcome: '', comments: '' },
            ref2: { outcome: '', comments: '' },
        },
        criminal: { clear: false, recordFound: false, details: '' },
    },

    verifSummary: {
        overallResult: '',
        hrRemark: '',
    },

    reportApprovals: {
        hrManager: { name: '', signature: '', date: '' },
        director: { name: '', signature: '', date: '' },
    }
};

export default function BGVRequestForm({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editIdParam = searchParams.get('edit');
    const location = { state: null as any };
    const queryClient = useQueryClient();

    const { departments, designations, employees, isLoading: masterDataLoading, fetchMasterData } = useMasterDataStore();
    const departmentOptions = departments.map(d => ({ value: d.name || '', label: d.name || '' }));
    const designationOptions = designations.map(d => ({ value: d.title || d.name || '', label: d.title || d.name || '' }));
    const employeeOptions = employees.map(e => ({ value: (e.firstName || '') + ' ' + (e.lastName || ''), label: (e.firstName || '') + ' ' + (e.lastName || '') }));
    const getCurrentUsername = () => {
        try {
            const userStr = localStorage.getItem('user');
            const currentUser = userStr ? JSON.parse(userStr) : null;
            return currentUser?.username || 'Admin';
        } catch {
            return 'Admin';
        }
    };
    const currentUsername = getCurrentUsername();

    const [activeTab, setActiveTab] = useState<'request' | 'report'>('request');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [preFillData, setPreFillData] = useState<any>(null);

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const documentChecklistApi = {
        getAll: () => api.get('/hiring/document-checklists').then(res => res.data),
    };

    const bgvApi = {
        delete: (id: string) => api.delete(`/hiring/bgv/${id}`).then(res => res.data),
        update: (id: string, data: any) => api.patch(`/hiring/bgv/${id}`, data).then(res => res.data),
    };

    const navigate = (path: string, options?: any) => {
        if (options?.state) {
            window.history.replaceState(options.state, '');
        }
        if (options?.replace) {
            router.replace(path);
        } else {
            router.push(path);
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchMasterData();

        if (location.state?.preFill && !showForm) {
            const preFill = location.state.preFill;
            console.log('Step8 received preFill data:', preFill); // Debug log
            setPreFillData(preFill);

            setFormData(prev => ({
                ...prev,
                type: 'request', // Default to request tab for pre-fill

                // Candidate Details (Section A)
                candidateName: preFill.fullName || preFill.candidateName || prev.candidateName,
                fullName: preFill.fullName || preFill.candidateName || prev.fullName,
                joiningDate: preFill.joiningDate ? preFill.joiningDate.split('T')[0] : prev.joiningDate,
                department: preFill.department || prev.department,
                position: preFill.positionFor || preFill.position || prev.position,
                positionFor: preFill.positionFor || preFill.position || prev.positionFor,

                // Contact Details
                emailId: preFill.emailId || prev.emailId,
                mobileNo: preFill.phoneNo || preFill.mobileNo || prev.mobileNo,

                // Location & Reporting
                workLocation: preFill.workLocation || preFill.location || prev.workLocation,
                reportingTo: preFill.reportingTo || prev.reportingTo,

                // Employee Code (from Step7)
                empCode: preFill.empCode || preFill.employeeCode || prev.empCode,
                reportEmpCode: preFill.empCode || preFill.employeeCode || prev.reportEmpCode,

                // HR Confirmation Section (Section E)
                requestedBy: preFill.requestedBy || currentUsername || prev.requestedBy,
                requestDate: new Date().toISOString().split('T')[0], // Today's date
                requestDesignation: preFill.requestDesignation || 'HR Manager',

                // Report Tab Fields (for consistency)
                reportCandidateName: preFill.fullName || preFill.candidateName || prev.reportCandidateName,
                reportPosition: preFill.positionFor || preFill.position || prev.reportPosition,
                reportDepartment: preFill.department || prev.reportDepartment,
                reportDOJ: preFill.joiningDate ? preFill.joiningDate.split('T')[0] : prev.reportDOJ,
                reportEmailId: preFill.emailId || prev.reportEmailId,
                reportMobileNo: preFill.phoneNo || preFill.mobileNo || prev.reportMobileNo,
            }));
            setIsPreFilled(true);
            setActiveTab('request');
            setShowForm(true);
        }

        setFormData((prev) => ({
            ...prev,
            requestedBy: prev.requestedBy || currentUsername
        }));
    }, [location.state]);

    // Auto-fill HR employee as Requested By
    useEffect(() => {
        if (!employees || employees.length === 0) return;

        const hrEmployee = employees.find(emp =>
            emp.department?.toLowerCase() === 'hr' ||
            emp.designation?.toLowerCase().includes('hr')
        );

        if (hrEmployee && !formData.requestedBy) {
            setFormData(prev => ({
                ...prev,
                requestedBy: hrEmployee.employeeName || currentUsername,
                requestDesignation:
                    hrEmployee.designation?.designationName ||
                    hrEmployee.designation?.roleName ||
                    (typeof hrEmployee.designation === 'string'
                        ? hrEmployee.designation
                        : 'HR Manager')
            }));
        }
    }, [employees, formData.requestedBy]);

    // 3.5. Fetch Employee Code and DOJ from specific APIs if missing
    useEffect(() => {
        const fetchAdditionalInfo = async () => {
            const identifierName = (location.state?.preFill?.fullName || location.state?.preFill?.candidateName || formData.candidateName || formData.fullName || '').toLowerCase();
            const identifierCode = location.state?.preFill?.empCode || location.state?.preFill?.employeeCode || formData.empCode || '';

            if (!identifierName && !identifierCode) return;
            if (formData.empCode && formData.joiningDate) return; // Already have both

            try {
                // Fetch Employee Code from Document Checklist API if missing
                if (!formData.empCode) {
                    const checklistData = await documentChecklistApi.getAll();
                    const checklistList = Array.isArray(checklistData) ? checklistData : (checklistData?.data || []);
                    const match = checklistList.find((r: any) =>
                        (identifierCode && r.empCode === identifierCode) ||
                        (identifierName && r.candidateName?.toLowerCase() === identifierName)
                    );
                    if (match && match.dateOfJoining) {
                        setFormData(prev => ({ ...prev, joiningDate: match.dateOfJoining.split('T')[0] }));
                    }
                }
            } catch (error) {
                console.error('Step8: Error fetching additional pre-fill data:', error);
            }
        };

        if (showForm) {
            fetchAdditionalInfo();
        }
    }, [showForm, formData.candidateName, formData.fullName, location.state]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const data = await api.get('/hiring/bgv', { params: { candidateId } }).then(res => Array.isArray(res.data) ? res.data : res.data.data);
            const list = Array.isArray(data) ? data : (data?.data || []);
            setRecords(list);
        } catch (error: any) {
            toast.error('Error - ' + error.message || 'Failed to fetch BGV records');
        } finally {
            setLoading(false);
        }
    };

    const getDesignationsByDepartment = (deptName: string) => {
        if (!deptName) return designations;
        return designations.filter((d: any) =>
            d.department === deptName ||
            d.departmentName === deptName ||
            d.department?.name === deptName
        );
    };

    const requestDesignationOptions = getDesignationsByDepartment(formData.department).map((d: any) => ({
        value: d.title || d.name || '',
        label: d.title || d.name || ''
    }));

    const reportDesignationOptions = getDesignationsByDepartment(formData.reportDepartment).map((d: any) => ({
        value: d.title || d.name || '',
        label: d.title || d.name || ''
    }));

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: string, child: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: { ...(prev as any)[parent], [child]: value }
        }));
    };

    const handleDocChange = (docField: string, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            docs: { ...prev.docs, [docField]: value }
        }));
    };

    const handleBgvTypeChange = (typeField: string, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            bgvType: { ...prev.bgvType, [typeField]: value }
        }));
    };

    const handleRefChange = (refKey: 'ref1' | 'ref2', field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [refKey]: { ...prev[refKey], [field]: value }
        }));
    };

    const handleApprovalChange = (type: 'requestApprovals' | 'reportApprovals', role: string, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [type]: {
                ...(prev as any)[type],
                [role]: { ...(prev as any)[type][role], [field]: value }
            }
        }));
    };

    const handleVerifResultChange = (category: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            verifResults: {
                ...prev.verifResults,
                [category]: { ...(prev.verifResults as any)[category], [field]: value }
            }
        }));
    };

    const handleNestedVerifChange = (category: string, subCategory: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            verifResults: {
                ...prev.verifResults,
                [category]: {
                    ...(prev.verifResults as any)[category],
                    [subCategory]: { ...(prev.verifResults as any)[category][subCategory], [field]: value }
                }
            }
        }));
    };

    const handleReset = () => {
        setFormData(INITIAL_FORM_DATA);
        setIsPreFilled(false);
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { _id: formId, ...restFormData } = formData as any;
            const submitData = {
                ...restFormData,
                type: activeTab,
                candidateName: activeTab === 'request' ? formData.fullName : formData.reportCandidateName,
                department: activeTab === 'request' ? formData.department : formData.reportDepartment,
                position: activeTab === 'request' ? formData.positionFor : formData.reportPosition,
                mobileNo: activeTab === 'request' ? formData.mobileNo : (formData as any).reportMobileNo || formData.mobileNo,
                emailId: activeTab === 'request' ? formData.emailId : (formData as any).reportEmailId || formData.emailId,
                workLocation: formData.workLocation
            };

            // Use formData._id as primary check (survives reset), fall back to currentId
            const editId = formId || (isEditing ? currentId : null);

            if (editId) {
                await api.put(`/hiring/bgv/${editId}`, submitData).then(res => res.data);
                toast.success('Updated - ' + 'BGV record has been updated successfully.');
            } else {
                await api.post('/hiring/bgv', { ...submitData, candidateId }).then(res => res.data);
                toast.success('Saved - ' + 'BGV record has been saved successfully.');
            }
            setShowForm(false);
            handleReset();
            fetchRecords();
            fetchMasterData();
        } catch (error: any) {
            toast.error('Error - ' + error.message || 'Failed to save BGV record');
        }
    };

    const handleEdit = (record: any) => {
        // Handle potential legacy nested data or missing fields
        const unpackedData = {
            ...record,
            ...(record.requestData || {}),
            ...(record.reportData || {})
        };

        const formattedRecord = {
            ...INITIAL_FORM_DATA, // Start with a complete initial state
            ...unpackedData, // Overlay with record data
            joiningDate: unpackedData.joiningDate ? unpackedData.joiningDate.split('T')[0] : '',
            requestDate: unpackedData.requestDate ? unpackedData.requestDate.split('T')[0] : '',
            reportDOJ: unpackedData.reportDOJ ? unpackedData.reportDOJ.split('T')[0] : '',
        };

        // Deep merge nested objects to ensure completeness
        if (unpackedData.docs) formattedRecord.docs = { ...INITIAL_FORM_DATA.docs, ...unpackedData.docs };
        if (unpackedData.ref1) formattedRecord.ref1 = { ...INITIAL_FORM_DATA.ref1, ...unpackedData.ref1 };
        if (unpackedData.ref2) formattedRecord.ref2 = { ...INITIAL_FORM_DATA.ref2, ...unpackedData.ref2 };
        if (unpackedData.bgvType) formattedRecord.bgvType = { ...INITIAL_FORM_DATA.bgvType, ...unpackedData.bgvType };
        if (unpackedData.requestApprovals) formattedRecord.requestApprovals = { ...INITIAL_FORM_DATA.requestApprovals, ...unpackedData.requestApprovals };

        if (unpackedData.verifResults) {
            formattedRecord.verifResults = { ...INITIAL_FORM_DATA.verifResults, ...unpackedData.verifResults };
            // Deep merge sub-objects within verifResults
            if (unpackedData.verifResults.id) formattedRecord.verifResults.id = { ...INITIAL_FORM_DATA.verifResults.id, ...unpackedData.verifResults.id };
            if (unpackedData.verifResults.address) formattedRecord.verifResults.address = { ...INITIAL_FORM_DATA.verifResults.address, ...unpackedData.verifResults.address };
            if (unpackedData.verifResults.education) formattedRecord.verifResults.education = { ...INITIAL_FORM_DATA.verifResults.education, ...unpackedData.verifResults.education };
            if (unpackedData.verifResults.employment) formattedRecord.verifResults.employment = { ...INITIAL_FORM_DATA.verifResults.employment, ...unpackedData.verifResults.employment };
            if (unpackedData.verifResults.reference) formattedRecord.verifResults.reference = { ...INITIAL_FORM_DATA.verifResults.reference, ...unpackedData.verifResults.reference };
            if (unpackedData.verifResults.criminal) formattedRecord.verifResults.criminal = { ...INITIAL_FORM_DATA.verifResults.criminal, ...unpackedData.verifResults.criminal };
        }

        if (unpackedData.verifSummary) formattedRecord.verifSummary = { ...INITIAL_FORM_DATA.verifSummary, ...unpackedData.verifSummary };
        if (unpackedData.reportApprovals) formattedRecord.reportApprovals = { ...INITIAL_FORM_DATA.reportApprovals, ...unpackedData.reportApprovals };

        // Fix dates in approvals
        if (formattedRecord.requestApprovals) {
            Object.keys(formattedRecord.requestApprovals).forEach(role => {
                if ((formattedRecord.requestApprovals as any)[role] && (formattedRecord.requestApprovals as any)[role].date) {
                    (formattedRecord.requestApprovals as any)[role].date = (formattedRecord.requestApprovals as any)[role].date.split('T')[0];
                }
            });
        }
        if (formattedRecord.reportApprovals) {
            Object.keys(formattedRecord.reportApprovals).forEach(role => {
                if ((formattedRecord.reportApprovals as any)[role] && (formattedRecord.reportApprovals as any)[role].date) {
                    (formattedRecord.reportApprovals as any)[role].date = (formattedRecord.reportApprovals as any)[role].date.split('T')[0];
                }
            });
        }

        // Ensure _id is stored in formData for safe update detection
        (formattedRecord as any)._id = record._id;
        setFormData(formattedRecord);
        setIsEditing(true);
        setCurrentId(record._id);
        setActiveTab(record.type || 'request');
        setIsPreFilled(false);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/hiring/bgv/${id}`);
            fetchRecords();
            fetchMasterData();
        } catch (error: any) {
            toast.error('Error - ' + error.message || 'Failed to delete record');
        }
    };

    const handleBulkDelete = async (rows: any[]) => {
        try {
            await Promise.all(rows.map(r => bgvApi.delete(r._id)));
            toast.success('Deleted - ' + `${rows.length} record${rows.length > 1 ? 's' : ''} deleted successfully`);
            fetchRecords();
            fetchMasterData();
        } catch (error: any) {
            toast.error('Error - ' + error.message || 'Failed to delete selected records');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await bgvApi.update(id, { status: newStatus });
            fetchRecords();
            fetchMasterData();
        } catch (error: any) {
            toast.error('Error - ' + 'Failed to update status');
        }
    };

    const filteredRecords = records.filter(rec =>
        rec.type === activeTab && (
            rec.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rec.department?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleNextStep = (record: any) => {
        console.log('Step8 - Passing to Step9:', record); // Debug log

        // Format joining date
        const joiningDate = record.joiningDate || record.dateOfJoining || '';
        const formattedJoiningDate = joiningDate && joiningDate.includes('T')
            ? joiningDate.split('T')[0]
            : joiningDate;

        console.log('Step8 - Formatted joiningDate for Step9:', formattedJoiningDate); // Debug log

        navigate(`/dashboard/hiring/${candidateId}/steps/joining-form`, {
            state: {
                preFill: {
                    ...preFillData,
                    candidateName: record.candidateName || record.fullName || '',
                    fullName: record.fullName || record.candidateName || '',
                    position: record.position || record.positionFor || '',
                    designation: record.positionFor || record.position || '',
                    department: record.department || '',
                    emailId: record.emailId || '',
                    phoneNo: record.mobileNo || '',
                    mobileNumber: record.mobileNo || '',
                    workLocation: record.workLocation || '',
                    reportingTo: record.reportingTo || '',
                    currentAddress: record.currentAddress || '',
                    joiningDate: formattedJoiningDate,
                    empCode: record.empCode || preFillData?.empCode,
                    employeeCode: record.empCode || preFillData?.empCode || preFillData?.employeeCode,
                    doj: formattedJoiningDate, // Also pass as doj for compatibility
                }
            }
        });
    };

    useEffect(() => {
        if (editIdParam && records.length > 0 && !hasInitialLoaded) {
            const recordToEdit = records.find((r: any) => r._id === editIdParam);
            if (recordToEdit) {
                handleEdit(recordToEdit);
                setEditId(editIdParam);
                setHasInitialLoaded(true);
            }
        }
    }, [editIdParam, records, hasInitialLoaded]);

    return (
        <div className="mx-auto max-w-[1500px] pb-10">
            <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex items-center justify-between no-print mb-4">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">STEP 8 - BGV REQUEST & REPORT</h1>
                <div className="flex gap-2">
                    <button onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/bgv`, '_blank')} className="px-4 py-2 border rounded text-sm hover:bg-slate-50 transition-colors">Print Form</button>
                    <button onClick={() => router.push(`/dashboard/hiring/${candidateId}`)} className="px-4 py-2 border rounded text-sm hover:bg-slate-50 transition-colors">Back to Pipeline</button>
                </div>
            </div>

            {/* <PrintHeader title="Step 8 - BGV Request Form & Report" subtitle="Background Verification Control" /> */}

            <div className="section-card shadow-sm border-slate-200 overflow-hidden mb-6">
                {/* TAB NAVIGATION - ALWAYS VISIBLE TO TOGGLE BETWEEN REQUESTS AND REPORTS */}
                <div className="bg-slate-50 px-2 pt-2 border-b border-slate-200 flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab('request')}
                        className={cn(
                            "px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-t-[4px] transition-all flex items-center gap-2 border-b-2",
                            activeTab === 'request'
                                ? "bg-white text-[#0d3c68] border-[#0d3c68] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
                                : "text-slate-700 border-transparent hover:text-[#0d3c68]"
                        )}
                    >
                        <ClipboardList className="h-4 w-4" />
                        1. BGV REQUEST FORM
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={cn(
                            "px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-t-[4px] transition-all flex items-center gap-2 border-b-2",
                            activeTab === 'report'
                                ? "bg-white text-[#0d3c68] border-[#0d3c68] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
                                : "text-slate-700 border-transparent hover:text-[#0d3c68]"
                        )}
                    >
                        <FileCheck2 className="h-4 w-4" />
                        2. BGV FINAL REPORT
                    </button>
                    <div className="flex-1" />
                    {showForm && (
                        <button
                            onClick={() => {
                                setShowForm(false);
                                handleReset();
                            }}
                            className="px-4 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded uppercase transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {showForm ? (
                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {activeTab === 'request' ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {/* SECTION A: CANDIDATE DETAILS */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">A</span>
                                            Candidate Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                            <FormField label="Full Name:" required>
                                                <FormInput value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required readOnly={isPreFilled} />
                                            </FormField>
                                            <FormField label="Joining Date:" required>
                                                <FormInput type="date" value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} required readOnly={isPreFilled} />
                                            </FormField>
                                            <FormField label="Position For:" required>
                                                {isPreFilled ? (
                                                    <FormInput value={formData.positionFor} readOnly />
                                                ) : (
                                                    <FormSelect
                                                        options={requestDesignationOptions}
                                                        value={formData.positionFor}
                                                        onChange={(e) => handleChange('positionFor', e.target.value)}
                                                        required
                                                        placeholder="Select Position"
                                                    />
                                                )}
                                            </FormField>
                                            <FormField label="Home No.:">
                                                <FormInput value={formData.homeNo} onChange={(e) => handleChange('homeNo', e.target.value)} />
                                            </FormField>
                                            <FormField label="Department:" required>
                                                {isPreFilled ? (
                                                    <FormInput value={formData.department} readOnly />
                                                ) : (
                                                    <FormSelect
                                                        options={departmentOptions}
                                                        value={formData.department}
                                                        onChange={(e) => handleChange('department', e.target.value)}
                                                        required
                                                        placeholder="Select Department"
                                                    />
                                                )}
                                            </FormField>
                                            <FormField label="Alternate No.:">
                                                <FormInput value={formData.alternateNo} onChange={(e) => handleChange('alternateNo', e.target.value)} />
                                            </FormField>
                                            <FormField label="Reporting To:" required>
                                                <FormInput value={formData.reportingTo} onChange={(e) => handleChange('reportingTo', e.target.value)} required readOnly={isPreFilled} />
                                            </FormField>
                                            <FormField label="Work Location:" required>
                                                <FormInput value={formData.workLocation} onChange={(e) => handleChange('workLocation', e.target.value)} required readOnly={isPreFilled} />
                                            </FormField>
                                            <FormField label="Email ID:" required>
                                                <FormInput
                                                    type="email"
                                                    value={formData.emailId}
                                                    onChange={(e) => handleChange('emailId', e.target.value)}
                                                    required
                                                />
                                            </FormField>

                                            <FormField label="Mobile No.:" required>
                                                <FormInput
                                                    value={formData.mobileNo}
                                                    onChange={(e) => handleChange('mobileNo', e.target.value)}
                                                    required
                                                />
                                            </FormField>

                                        </div>

                                        <div className="space-y-2 mt-4">
                                            {/* Addresses */}
                                            <div className="space-y-2 p-4 bg-white border-2 border-slate-200 rounded shadow-sm hover:border-[#0d3c68]/30 transition-colors">
                                                <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase tracking-widest">Current Address Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
                                                    <FormField label="Current Address:">
                                                        <FormInput value={formData.currentAddress} onChange={(e) => handleChange('currentAddress', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="State:">
                                                        <FormInput value={formData.currentState} onChange={(e) => handleChange('currentState', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="City & Pin Code:">
                                                        <FormInput value={formData.currentCityPin} onChange={(e) => handleChange('currentCityPin', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="Country:">
                                                        <FormInput value={formData.currentCountry} onChange={(e) => handleChange('currentCountry', e.target.value)} />
                                                    </FormField>
                                                </div>
                                            </div>
                                            <div className="space-y-3 p-4 bg-white border-2 border-slate-200 rounded shadow-sm hover:border-[#0d3c68]/30 transition-colors">
                                                <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase tracking-widest">Permanent Address Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
                                                    <FormField label="Permanent Address:">
                                                        <FormInput value={formData.permanentAddress} onChange={(e) => handleChange('permanentAddress', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="State:">
                                                        <FormInput value={formData.permanentState} onChange={(e) => handleChange('permanentState', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="City & Pin Code:">
                                                        <FormInput value={formData.permanentCityPin} onChange={(e) => handleChange('permanentCityPin', e.target.value)} />
                                                    </FormField>
                                                    <FormField label="Country:">
                                                        <FormInput value={formData.permanentCountry} onChange={(e) => handleChange('permanentCountry', e.target.value)} />
                                                    </FormField>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION B: DOCUMENTS */}
                                    <div className="space-y-2 pt-2">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">B</span>
                                            Documents Submitted for Verification
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 bg-slate-50/50 p-4 rounded border-2 border-slate-100">
                                            {[
                                                { id: 'aadhaarCard', label: 'Aadhaar Card' }, { id: 'panCard', label: 'PAN Card' },
                                                { id: 'marksheet10', label: '10th Marksheet' }, { id: 'marksheet12', label: '12th Marksheet' },
                                                { id: 'graduationCert', label: 'Graduation Certificate' }, { id: 'pgCert', label: 'Post Graduate Certificate' },
                                                { id: 'expCerts', label: 'Experience Certificates' }, { id: 'relievingLetter', label: 'Relieving Letter' },
                                                { id: 'prevApptLetters', label: 'Prev Appointment Letters' }, { id: 'salarySlips3Months', label: 'Last 3 Months Salary Slips' },
                                                { id: 'bankStatements3Months', label: 'Last 3 Months Bank Statements' }, { id: 'policeVerif', label: 'Police Verification' },
                                            ].map((doc) => (
                                                <label key={doc.id} className="flex items-center gap-3 cursor-pointer group">
                                                    <div onClick={() => handleDocChange(doc.id, !(formData.docs as any)[doc.id])}
                                                        className={cn("w-5 h-5 border-2 flex items-center justify-center rounded-[2px]", (formData.docs as any)[doc.id] ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                    >
                                                        {(formData.docs as any)[doc.id] && <Check className="h-3.5 w-3.5" />}
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-slate-700">{doc.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION C: REFERENCE CHECK DETAILS */}
                                    <div className="space-y-3 pt-4">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">C</span>
                                            Reference Check Details
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-white border-2 border-slate-200 rounded shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-[#0d3c68] mb-4 uppercase tracking-widest flex items-center gap-2">
                                                    1. Reference 1 – Professional Reference
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-2">
                                                    <FormField label="Name:"><FormInput value={formData.ref1.name} onChange={(e) => handleRefChange('ref1', 'name', e.target.value)} /></FormField>
                                                    <FormField label="Designation:"><FormInput value={formData.ref1.designation} onChange={(e) => handleRefChange('ref1', 'designation', e.target.value)} /></FormField>
                                                    <FormField label="Duration Known:"><FormInput value={formData.ref1.durationKnown} onChange={(e) => handleRefChange('ref1', 'durationKnown', e.target.value)} /></FormField>
                                                    <FormField label="Relationship:"><FormInput value={formData.ref1.relationship} onChange={(e) => handleRefChange('ref1', 'relationship', e.target.value)} /></FormField>
                                                    <FormField label="Organization:"><FormInput value={formData.ref1.organization} onChange={(e) => handleRefChange('ref1', 'organization', e.target.value)} /></FormField>
                                                    <FormField label="Mobile Number:"><FormInput value={formData.ref1.mobileNo} onChange={(e) => handleRefChange('ref1', 'mobileNo', e.target.value)} /></FormField>
                                                    <FormField label="Email ID:"><FormInput value={formData.ref1.emailId} onChange={(e) => handleRefChange('ref1', 'emailId', e.target.value)} /></FormField>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-white border-2 border-slate-200 rounded shadow-sm">
                                                <h4 className="text-[11px] font-extrabold text-[#0d3c68] mb-4 uppercase tracking-widest flex items-center gap-2">
                                                    2. Reference 2 – Professional
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-2">
                                                    <FormField label="Name:"><FormInput value={formData.ref2.name} onChange={(e) => handleRefChange('ref2', 'name', e.target.value)} /></FormField>

                                                    <FormField label="Designation:"><FormInput value={formData.ref2.designation} onChange={(e) => handleRefChange('ref2', 'designation', e.target.value)} /></FormField>
                                                    <FormField label="Duration Known:"><FormInput value={formData.ref2.durationKnown} onChange={(e) => handleRefChange('ref2', 'durationKnown', e.target.value)} /></FormField>
                                                    <FormField label="Relationship:"><FormInput value={formData.ref2.relationship} onChange={(e) => handleRefChange('ref2', 'relationship', e.target.value)} /></FormField>
                                                    <FormField label="Organization:"><FormInput value={formData.ref2.organization} onChange={(e) => handleRefChange('ref2', 'organization', e.target.value)} /></FormField>
                                                    <FormField label="Mobile Number:"><FormInput value={formData.ref2.mobileNo} onChange={(e) => handleRefChange('ref2', 'mobileNo', e.target.value)} /></FormField>
                                                    <FormField label="Email ID:"><FormInput value={formData.ref2.emailId} onChange={(e) => handleRefChange('ref2', 'emailId', e.target.value)} /></FormField>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION D: TYPE OF BGV REQUIRED */}
                                    <div className="space-y-2 pt-4">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">D</span>
                                            Type of BGV Required
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 p-5 rounded border-2 border-slate-100">
                                            {[
                                                { id: 'idVerification', label: 'ID Verification' },
                                                { id: 'addressVerification', label: 'Address Verification' },
                                                { id: 'completePackage', label: 'Complete BGV Package' },
                                                { id: 'employmentVerification', label: 'Employment Verification' },
                                                { id: 'policeVerification', label: 'Police Verification' },
                                                { id: 'educationVerification', label: 'Education Verification' },
                                                { id: 'referenceCheck', label: 'Reference Check' },
                                            ].map((type) => (
                                                <label key={type.id} className="flex items-center gap-3 cursor-pointer">
                                                    <div onClick={() => handleBgvTypeChange(type.id, !(formData.bgvType as any)[type.id])}
                                                        className={cn("w-5 h-5 border-2 flex items-center justify-center rounded-[2px]", (formData.bgvType as any)[type.id] ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                    >
                                                        {(formData.bgvType as any)[type.id] && <Check className="h-3.5 w-3.5" />}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-700">{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SECTION E: HR CONFIRMATION */}
                                    <div className="space-y-2 pt-4">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">E</span>
                                            HR Confirmation
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <FormField label="Request Date:">
                                                <FormInput
                                                    type="date"
                                                    value={formData.requestDate}
                                                    onChange={(e) => handleChange('requestDate', e.target.value)}
                                                    readOnly={isPreFilled}
                                                    className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                                />
                                            </FormField>

                                            <FormField label="Designation:" required>
                                                {isPreFilled ? (
                                                    <FormInput value={formData.positionFor} readOnly />
                                                ) : (
                                                    <FormSelect
                                                        options={requestDesignationOptions}
                                                        value={formData.positionFor}
                                                        onChange={(e) => handleChange('positionFor', e.target.value)}
                                                        required
                                                        placeholder="Select Position"
                                                    />
                                                )}
                                            </FormField>

                                            <FormField label="Priority Level:">
                                                <FormRadioGroup
                                                    name="priorityLevel"
                                                    options={[{ value: 'Normal', label: 'Normal' }, { value: 'Urgent', label: 'Urgent' }]}
                                                    value={formData.priorityLevel}
                                                    onChange={(val) => handleChange('priorityLevel', val)}
                                                />
                                            </FormField>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                handleReset();
                                            }}
                                            className="px-6 py-2 text-xs font-bold text-white bg-red-600 rounded-[2px]"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/bgv`, '_blank')}
                                            className="px-6 py-2 text-xs font-bold text-white bg-slate-600 rounded-[2px]"
                                        >
                                            PRINT
                                        </button>
                                        <button type="submit" className="px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white shadow-md rounded-[2px]">SAVE REQUEST</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {/* REPORT FORM SECTION */}
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">A</span>
                                            Candidate Summary (Final Report)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <FormField label="Candidate Name:"><FormInput value={formData.reportCandidateName} onChange={(e) => handleChange('reportCandidateName', e.target.value)} /></FormField>
                                            <FormField label="Date of Joining:"><FormInput type="date" value={formData.reportDOJ} onChange={(e) => handleChange('reportDOJ', e.target.value)} /></FormField>
                                            <FormField label="Employee Code:"><FormInput value={formData.reportEmpCode} onChange={(e) => handleChange('reportEmpCode', e.target.value)} /></FormField>
                                            <FormField label="Department:">
                                                <FormSelect
                                                    options={departmentOptions}
                                                    value={formData.reportDepartment}
                                                    onChange={(e) => handleChange('reportDepartment', e.target.value)}
                                                    placeholder="Select Department"
                                                />
                                            </FormField>
                                        </div>
                                    </div>

                                    {/* SECTION B: VERIFICATION RESULTS */}
                                    <div className="space-y-2 pt-4">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">B</span>
                                            Verification Results
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* 1. ID Verification */}
                                            <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                                <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">1. ID Verification</h4>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div onClick={() => handleVerifResultChange('id', 'verified', !formData.verifResults.id.verified)}
                                                            className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.id.verified ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                        >
                                                            {formData.verifResults.id.verified && <Check className="h-3 w-3" />}
                                                        </div>
                                                        <span className="text-[10px] font-bold">Verified</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div onClick={() => handleVerifResultChange('id', 'discrepancy', !formData.verifResults.id.discrepancy)}
                                                            className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.id.discrepancy ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-400")}
                                                        >
                                                            {formData.verifResults.id.discrepancy && <Check className="h-3 w-3" />}
                                                        </div>
                                                        <span className="text-[10px] font-bold">Discrepancy Found</span>
                                                    </label>
                                                </div>
                                                <FormField label="Remarks:"><FormInput value={formData.verifResults.id.remarks} onChange={(e) => handleVerifResultChange('id', 'remarks', e.target.value)} /></FormField>
                                            </div>

                                            {/* 2. Address Verification */}
                                            <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                                <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">2. Address Verification</h4>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div onClick={() => handleVerifResultChange('address', 'verified', !formData.verifResults.address.verified)}
                                                            className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.address.verified ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                        >
                                                            {formData.verifResults.address.verified && <Check className="h-3 w-3" />}
                                                        </div>
                                                        <span className="text-[10px] font-bold">Verified</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div onClick={() => handleVerifResultChange('address', 'discrepancy', !formData.verifResults.address.discrepancy)}
                                                            className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.address.discrepancy ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-400")}
                                                        >
                                                            {formData.verifResults.address.discrepancy && <Check className="h-3 w-3" />}
                                                        </div>
                                                        <span className="text-[10px] font-bold">Discrepancy Found</span>
                                                    </label>
                                                </div>
                                                <FormField label="Remarks:"><FormInput value={formData.verifResults.address.remarks} onChange={(e) => handleVerifResultChange('address', 'remarks', e.target.value)} /></FormField>
                                            </div>
                                        </div>

                                        {/* 3. Education Verification */}
                                        <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                            <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">3. Education Verification</h4>
                                            <table className="w-full text-left text-[11px] border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50">
                                                        <th className="p-2 border border-slate-200">Education</th>
                                                        <th className="p-2 border border-slate-200 text-center">Verified</th>
                                                        <th className="p-2 border border-slate-200">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { id: 'tenth', label: '10th' },
                                                        { id: 'twelfth', label: '12th' },
                                                        { id: 'graduation', label: 'Graduation' },
                                                        { id: 'postGrad', label: 'Post-Graduation' }
                                                    ].map((edu) => (
                                                        <tr key={edu.id}>
                                                            <td className="p-2 border border-slate-200 font-bold">{edu.label}</td>
                                                            <td className="p-2 border border-slate-200 text-center">
                                                                <div className="flex justify-center">
                                                                    <div onClick={() => handleNestedVerifChange('education', edu.id, 'verified', !(formData.verifResults.education as any)[edu.id].verified)}
                                                                        className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px] cursor-pointer", (formData.verifResults.education as any)[edu.id].verified ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                                    >
                                                                        {(formData.verifResults.education as any)[edu.id].verified && <Check className="h-3 w-3" />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border border-slate-200">
                                                                <FormInput value={(formData.verifResults.education as any)[edu.id].remarks} onChange={(e) => handleNestedVerifChange('education', edu.id, 'remarks', e.target.value)} className="h-7" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* 4. Employment Verification */}
                                        <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                            <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">4. Employment Verification</h4>
                                            <table className="w-full text-left text-[11px] border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50">
                                                        <th className="p-2 border border-slate-200">Company</th>
                                                        <th className="p-2 border border-slate-200 text-center">Verified</th>
                                                        <th className="p-2 border border-slate-200">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { id: 'employer1', label: 'Previous Employer 1' },
                                                        { id: 'employer2', label: 'Previous Employer 2' }
                                                    ].map((emp) => (
                                                        <tr key={emp.id}>
                                                            <td className="p-2 border border-slate-200 font-bold">{emp.label}</td>
                                                            <td className="p-2 border border-slate-200 text-center">
                                                                <div className="flex justify-center">
                                                                    <div onClick={() => handleNestedVerifChange('employment', emp.id, 'verified', !(formData.verifResults.employment as any)[emp.id].verified)}
                                                                        className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px] cursor-pointer", (formData.verifResults.employment as any)[emp.id].verified ? "bg-[#0d3c68] border-[#0d3c68] text-white" : "bg-white border-slate-400")}
                                                                    >
                                                                        {(formData.verifResults.employment as any)[emp.id].verified && <Check className="h-3 w-3" />}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-1 border border-slate-200">
                                                                <FormInput value={(formData.verifResults.employment as any)[emp.id].remarks} onChange={(e) => handleNestedVerifChange('employment', emp.id, 'remarks', e.target.value)} className="h-7" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* 5. Reference Check */}
                                        <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                            <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">5. Reference Check</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <FormField label="Reference 1 Outcome:">
                                                        <FormRadioGroup
                                                            name="ref1Outcome"
                                                            options={[
                                                                { value: 'Positive', label: 'Positive' },
                                                                { value: 'Neutral', label: 'Neutral' },
                                                                { value: 'Negative', label: 'Negative' }
                                                            ]}
                                                            value={formData.verifResults.reference.ref1.outcome}
                                                            onChange={(val) => handleNestedVerifChange('reference', 'ref1', 'outcome', val)}
                                                        />
                                                    </FormField>
                                                    <FormField label="Comments:"><FormTextarea rows={1} value={formData.verifResults.reference.ref1.comments} onChange={(e) => handleNestedVerifChange('reference', 'ref1', 'comments', e.target.value)} /></FormField>
                                                </div>
                                                <div className="space-y-3">
                                                    <FormField label="Reference 2 Outcome:">
                                                        <FormRadioGroup
                                                            name="ref2Outcome"
                                                            options={[
                                                                { value: 'Positive', label: 'Positive' },
                                                                { value: 'Neutral', label: 'Neutral' },
                                                                { value: 'Negative', label: 'Negative' }
                                                            ]}
                                                            value={formData.verifResults.reference.ref2.outcome}
                                                            onChange={(val) => handleNestedVerifChange('reference', 'ref2', 'outcome', val)}
                                                        />
                                                    </FormField>
                                                    <FormField label="Comments:"><FormTextarea rows={1} value={formData.verifResults.reference.ref2.comments} onChange={(e) => handleNestedVerifChange('reference', 'ref2', 'comments', e.target.value)} /></FormField>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6. Criminal / Police Verification */}
                                        <div className="p-2 bg-white border border-slate-200 rounded space-y-2">
                                            <h4 className="text-[11px] font-bold text-[#0d3c68] uppercase">6. Criminal / Police Verification</h4>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <div onClick={() => handleVerifResultChange('criminal', 'clear', !formData.verifResults.criminal.clear)}
                                                        className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.criminal.clear ? "bg-green-600 border-green-600 text-white" : "bg-white border-slate-400")}
                                                    >
                                                        {formData.verifResults.criminal.clear && <Check className="h-3 w-3" />}
                                                    </div>
                                                    <span className="text-[10px] font-bold">Clear</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <div onClick={() => handleVerifResultChange('criminal', 'recordFound', !formData.verifResults.criminal.recordFound)}
                                                        className={cn("w-4 h-4 border flex items-center justify-center rounded-[2px]", formData.verifResults.criminal.recordFound ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-400")}
                                                    >
                                                        {formData.verifResults.criminal.recordFound && <Check className="h-3 w-3" />}
                                                    </div>
                                                    <span className="text-[10px] font-bold">Record Found</span>
                                                </label>
                                            </div>
                                            <FormField label="Details:"><FormInput value={formData.verifResults.criminal.details} onChange={(e) => handleVerifResultChange('criminal', 'details', e.target.value)} /></FormField>
                                        </div>
                                    </div>

                                    {/* SECTION C: VERIFICATION SUMMARY */}
                                    <div className="space-y-2 pt-2">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">C</span>
                                            Verification Summary
                                        </h3>
                                        <div className="p-2 bg-slate-50 border border-slate-200 rounded space-y-2">
                                            <FormField label="Overall Result:">
                                                <FormRadioGroup
                                                    name="overallResult"
                                                    options={[
                                                        { value: 'Verified – Clear', label: 'Verified – Clear' },
                                                        { value: 'Verified – Minor Observations', label: 'Verified – Minor Observations' },
                                                        { value: 'Discrepancies Found', label: 'Discrepancies Found' },
                                                        { value: 'Rejected – Major Issues', label: 'Rejected – Major Issues' }
                                                    ]}
                                                    value={formData.verifSummary.overallResult}
                                                    onChange={(val) => handleNestedChange('verifSummary', 'overallResult', val)}
                                                    className="grid grid-cols-4 gap-2"
                                                />
                                            </FormField>
                                            <FormField label="HR Overall Remark:"><FormTextarea rows={1} value={formData.verifSummary.hrRemark} onChange={(e) => handleNestedChange('verifSummary', 'hrRemark', e.target.value)} /></FormField>
                                        </div>
                                    </div>

                                    {/* SECTION D: FINAL APPROVAL */}
                                    <div className="space-y-2 pt-2">
                                        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">D</span>
                                            Final Approval
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField label="HR Manager Name:"><FormInput value={formData.reportApprovals.hrManager.name} onChange={(e) => handleApprovalChange('reportApprovals', 'hrManager', 'name', e.target.value)} /></FormField>
                                            <FormField label="Director Name:"><FormInput value={formData.reportApprovals.director.name} onChange={(e) => handleApprovalChange('reportApprovals', 'director', 'name', e.target.value)} /></FormField>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-6 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                handleReset();
                                            }}
                                            className="px-6 py-2 text-xs font-bold text-white bg-red-600 rounded-[2px]"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/bgv`, '_blank')}
                                            className="px-6 py-2 text-xs font-bold text-white bg-slate-600 rounded-[2px]"
                                        >
                                            PRINT
                                        </button>
                                        <button type="submit" className="px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white shadow-md rounded-[2px]">SAVE REPORT</button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    /* DATA TABLE VIEW */
                    <div className="p-0">
                        <DataTable
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            pageSize={itemsPerPage}
                            onPageSizeChange={setItemsPerPage}
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            columns={[
                                {
                                    key: 'sno', label: 'S.No', width: '60px', align: 'center',
                                    render: (_: any, __: any, index: number) => <span className="text-slate-500 font-medium">{index + 1}</span>
                                },
                                { key: 'candidateName', label: 'Candidate Name', width: '180px' },
                                { key: 'position', label: 'Position', width: '130px' },
                                {
                                    key: 'mobileNo',
                                    label: 'Phone Number',
                                    width: '120px',
                                },
                                {
                                    key: 'emailId',
                                    label: 'Email',
                                    width: '200px',
                                    render: (val: any) => (
                                        <a href={`mailto:${val}`} className="text-[#0d3c68] hover:underline transition-all block truncate">
                                            {val}
                                        </a>
                                    )
                                },
                                { key: 'department', label: 'Department', width: '120px' },
                                {
                                    key: 'status', label: 'Status', width: '100px', align: 'center',
                                    render: (val: any, row: any) => (
                                        <div className="relative inline-block">
                                            <select
                                                value={val}
                                                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                                                className={cn("appearance-none cursor-pointer pl-2 pr-7 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider transition-all border outline-none",
                                                    val === 'active' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                                )}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <ChevronDown size={10} className={cn("absolute right-2 top-1/2 -translate-y-1/2", val === 'active' ? "text-green-700" : "text-red-700")} />
                                        </div>
                                    ),
                                },
                                {
                                    key: 'updatedAt',
                                    label: 'Last Update',
                                    width: '160px',
                                    render: (val: any) => (
                                        <span className="text-slate-500 font-medium text-[10px]">
                                            {val ? new Date(val).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }).replace(',', '') : 'N/A'}
                                        </span>
                                    )
                                },
                            ]}
                            data={filteredRecords}
                            onEdit={handleEdit}
                            onDelete={(row) => handleDelete(row._id)}
                            onView={(row) => router.push(`/hiring/step-8/view/${row._id}`)}
                            onNextStep={handleNextStep}
                            selectable
                            onBulkDelete={handleBulkDelete}
                            loading={loading}
                        />

                        <style>{`
                            .data-table td {
                                white-space: nowrap !important;
                                font-size: 11px !important;
                                padding: 8px 12px !important;
                                vertical-align: middle !important;
                            }
                            .data-table th {
                                white-space: nowrap !important;
                                font-size: 11px !important;
                                font-weight: 700 !important;
                                text-transform: uppercase !important;
                                background-color: #0d3c68 !important;
                                color: white !important;
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
}
