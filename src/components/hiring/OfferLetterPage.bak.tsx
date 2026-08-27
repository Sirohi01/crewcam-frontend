'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Save, RotateCcw, ChevronDown, } from 'lucide-react';
import { FormField, FormInput,FormSelect } from '@/components/common/FormComponents';
import { HiringStepLayout } from './HiringStepLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintHeader } from '@/components/common/PrintHeader';
import { DataTable } from '@/components/common/DataTable';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useMasterDataStore } from '@/store/masterDataStore';

export default function OfferLetterPage({ candidateId }: { candidateId: string }) {
    // Cache-buster: 2026-02-17-17-30
    const router = useRouter();
    const { departments, designations, employees, isLoading: masterDataLoading, fetchMasterData } = useMasterDataStore();
    const departmentOptions = departments.map(d => ({ value: d.name || '', label: d.name || '' }));
    const designationOptions = designations.map(d => ({ value: d.title || d.name || '', label: d.title || d.name || '' }));
    const employeeOptions = employees.map(e => ({ value: (e.firstName || '') + ' ' + (e.lastName || ''), label: (e.firstName || '') + ' ' + (e.lastName || '') }));
    const { user } = useAuthStore();
    const currentUsername = (user as any)?.username || (user as any)?.name || 'Admin';

    const documentChecklistApi = {
        getAll: () => api.get('/hiring/document-checklists').then(res => res.data),
    };
    const selectionApi = {
        getAll: () => api.get('/hiring/selection-approvals').then(res => res.data),
    };
    const manpowerApi = {
        getAll: () => api.get('/hiring/manpower-requisitions').then(res => res.data),
    };
    const offerLetterApi = {
        getAll: () => api.get('/hiring/offer-letter').then(res => res.data),
        create: (data: any) => api.post(`/hiring/offer-letter`, data).then(res => res.data),
        update: (id: string, data: any) => api.patch(`/hiring/offer-letter/${id}`, data).then(res => res.data),
        delete: (id: string) => api.delete(`/hiring/offer-letter/${id}`).then(res => res.data),
    };

    const location = (typeof window !== 'undefined' ? window.history : { state: null }) as any;
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
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPreFilled, setIsPreFilled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [formData, setFormData] = useState({
        _id: '',
        // Employee Details
        candidateName: '',
        empCode: '',
        address: '',
        date: new Date().toISOString().split('T')[0],
        department: '',
        designation: '',
        // Work Location
        location: 'Mohan Nagar, Ghaziabad',
        reportingTo: '',
        joiningDate: '',
        joiningTime: '09:30',
        probationPeriod: 'six (6) months',
        
        // Contact Details (from Step9)
        mobileNumber: '',
        emailId: '',
        currentAddress: '',
        
        // Identification Details (from Step9)
        aadhaarNumber: '',
        panNumber: '',
        
        // Bank Details (from Step9)
        accountHolderName: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifscCode: '',
        
        // Salary Details
        monthlyCTC: '',
        annualCTC: '',
        workScheduleDays: 'Monday to Saturday',
        workScheduleTimeStart: '09:30',
        workScheduleTimeEnd: '18:30',
        status: 'active'
    });

    // 1. Initial data fetch
    useEffect(() => {
        fetchRecords();
    }, []);

    // 2. Handle pre-fill from navigation state
    useEffect(() => {
        if (location.state?.preFill && !showForm && !isEditing) {
            const preFill = location.state.preFill;
            console.log('Step13: Processing preFill data:', preFill);

            // Format joining date
            const fmtDate = (val: any): string => {
                if (!val) return '';
                const s = typeof val === 'object' ? (val?.toISOString?.() || '') : String(val);
                return s.includes('T') ? s.split('T')[0] : s;
            };

            // Salary mapping helpers
            const monthlyCandidate = preFill.proposedMonthlyCTC || preFill.monthlyCTC || preFill.monthlyGross || preFill.salaryRangeFrom || '';
            const annualCandidate = preFill.proposedAnnualCTC || preFill.annualCTC || '';

            const normalizeMoney = (val: any) => {
                if (val === null || val === undefined) return '';
                const s = String(val).trim();
                if (!s) return '';
                const n = Number(s.replace(/,/g, ''));
                return Number.isFinite(n) ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
            };

            const normalizedMonthly = normalizeMoney(monthlyCandidate);
            const normalizedAnnual = normalizeMoney(annualCandidate) || (normalizedMonthly ? normalizeMoney(Number(normalizedMonthly.replace(/,/g, '')) * 12) : '');

            setFormData(prev => ({
                ...prev,
                candidateName: preFill.fullName || preFill.candidateName || prev.candidateName,
                empCode: preFill.empCode || preFill.employeeCode || prev.empCode,
                department: preFill.department || prev.department,
                designation: preFill.designation || preFill.position || prev.designation,
                joiningDate: fmtDate(preFill.joiningDate || preFill.doj) || prev.joiningDate,
                location: preFill.workLocation || preFill.location || prev.location,
                reportingTo: preFill.reportingTo || preFill.reportingManager || prev.reportingTo,
                address: preFill.currentAddress || preFill.address || prev.address,
                mobileNumber: preFill.mobileNumber || prev.mobileNumber,
                emailId: preFill.personalEmailId || preFill.emailId || prev.emailId,
                currentAddress: preFill.currentAddress || prev.currentAddress,
                aadhaarNumber: preFill.aadhaarNumber || prev.aadhaarNumber,
                panNumber: preFill.panNumber || prev.panNumber,
                accountHolderName: preFill.accountHolderName || prev.accountHolderName,
                bankName: preFill.bankName || prev.bankName,
                branchName: preFill.branchName || prev.branchName,
                accountNumber: preFill.accountNumber || prev.accountNumber,
                ifscCode: preFill.ifscCode || prev.ifscCode,
                monthlyCTC: normalizedMonthly || prev.monthlyCTC,
                annualCTC: normalizedAnnual || prev.annualCTC,
            }));

            setIsPreFilled(true);
            setShowForm(true);
        }
    }, [location.state]);

    // 2.5. Fetch salary range from manpowerApi when designation changes
    useEffect(() => {
        const fetchSalaryRangeForDesignation = async () => {
            if (!formData.designation || (formData.monthlyCTC && formData.annualCTC)) return; // Skip if designation is empty or salary already set
            
            try {
                const manpowerData = await manpowerApi.getAll();
                const manpowerList = Array.isArray(manpowerData) ? manpowerData : (manpowerData?.data || []);
                
                // Find matching designation in manpower data
                const matchingManpower = manpowerList.find((mp: any) => 
                    mp.designation?.toLowerCase() === formData.designation.toLowerCase()
                );
                
                if (matchingManpower) {
                    console.log('Step13: Auto-filling salary from manpower:', matchingManpower);
                    
                    const normalizeMoney = (val: any) => {
                        if (val === null || val === undefined) return '';
                        const s = String(val).trim();
                        if (!s) return '';
                        const n = Number(s.replace(/,/g, ''));
                        return Number.isFinite(n) ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
                    };
                    
                    // Get salary range from manpower (salaryRangeFrom or monthlyCTC)
                    const monthlySalary = matchingManpower.salaryRangeFrom || matchingManpower.monthlyCTC || '';
                    const annualSalary = matchingManpower.salaryRangeTo || matchingManpower.annualCTC || '';
                    
                    const normalizedMonthly = normalizeMoney(monthlySalary);
                    const normalizedAnnual = normalizeMoney(annualSalary) || (normalizedMonthly ? normalizeMoney(Number(normalizedMonthly.replace(/,/g, '')) * 12) : '');
                    
                    setFormData(prev => ({
                        ...prev,
                        monthlyCTC: normalizedMonthly || prev.monthlyCTC,
                        annualCTC: normalizedAnnual || prev.annualCTC
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch salary range from manpower:', error);
            }
        };

        fetchSalaryRangeForDesignation();
    }, [formData.designation]);



    // 3. Restore/Merge from DB records
    useEffect(() => {
        if (records.length === 0) return;

        const identifierName = (location.state?.preFill?.fullName || location.state?.preFill?.candidateName || formData.candidateName || '').toLowerCase();
        const identifierCode = location.state?.preFill?.empCode || location.state?.preFill?.employeeCode || formData.empCode || '';

        if (!identifierName && !identifierCode) return;

        const existingRecord = records.find(r => 
            (identifierCode && r.empCode === identifierCode) ||
            (identifierName && r.candidateName?.toLowerCase() === identifierName)
        );

        if (existingRecord) {
            console.log('Step13: Matching DB record found, merging data...');
            setFormData(prev => ({
                ...prev,
                ...existingRecord,
                // SAFE MERGE: Preserve preFill values if DB values are empty
                reportingTo: existingRecord.reportingTo || prev.reportingTo,
                location: existingRecord.location || prev.location,
                joiningDate: (existingRecord.joiningDate || '').split('T')[0] || prev.joiningDate,
                date: (existingRecord.date || '').split('T')[0] || prev.date,
                address: existingRecord.address || prev.address,
                mobileNumber: existingRecord.mobileNumber || prev.mobileNumber,
                emailId: existingRecord.emailId || prev.emailId,
                currentAddress: existingRecord.currentAddress || prev.currentAddress,
                aadhaarNumber: existingRecord.aadhaarNumber || prev.aadhaarNumber,
                panNumber: existingRecord.panNumber || prev.panNumber,
                accountHolderName: existingRecord.accountHolderName || prev.accountHolderName,
                bankName: existingRecord.bankName || prev.bankName,
                branchName: existingRecord.branchName || prev.branchName,
                accountNumber: existingRecord.accountNumber || prev.accountNumber,
                ifscCode: existingRecord.ifscCode || prev.ifscCode,
            }));
            
            setIsEditing(true);
            setIsPreFilled(true);
        }
    }, [records, location.state, formData.candidateName, formData.empCode]);

    // 4. Fetch Reporting To from Manpower API if missing
    useEffect(() => {
        const fetchReportingTo = async () => {
            // Only fetch if we have department and designation but missing reportingTo
            if (showForm && !formData.reportingTo && formData.department && formData.designation) {
                try {
                    const data = await manpowerApi.getAll();
                    const list = Array.isArray(data) ? data : (data?.data || []);
                    
                    // Match by department and designation/position
                    const matchedRequisition = list.find((req: any) => 
                        req.department === formData.department && 
                        (req.position === formData.designation || req.jobTitle === formData.designation)
                    );

                    if (matchedRequisition && matchedRequisition.reportingTo) {
                        setFormData(prev => ({
                            ...prev,
                            reportingTo: matchedRequisition.reportingTo
                        }));
                    }
                } catch (error) {
                    console.error('Step13: Error fetching manpower data:', error);
                }
            }
        };

        fetchReportingTo();
    }, [showForm, formData.department, formData.designation, formData.reportingTo]);

    // 4.5. Fetch Employee Code and DOJ from specific APIs if missing
    useEffect(() => {
        const fetchAdditionalInfo = async () => {
            const identifierName = (location.state?.preFill?.fullName || location.state?.preFill?.candidateName || formData.candidateName || '').toLowerCase();
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
                    if (match && match.empCode) {
                        setFormData(prev => ({ ...prev, empCode: match.empCode }));
                    }
                }

                // Fetch DOJ from Selection Approval API if missing
                if (!formData.joiningDate) {
                    const selectionData = await selectionApi.getAll();
                    const selectionList = Array.isArray(selectionData) ? selectionData : (selectionData?.data || []);
                    const match = selectionList.find((r: any) => 
                        (identifierCode && r.empCode === identifierCode) ||
                        (identifierName && r.candidateName?.toLowerCase() === identifierName)
                    );
                    if (match && match.dateOfJoining) {
                        setFormData(prev => ({ ...prev, joiningDate: match.dateOfJoining.split('T')[0] }));
                    }
                }
            } catch (error) {
                console.error('Step13: Error fetching additional pre-fill data:', error);
            }
        };

        if (showForm) {
            fetchAdditionalInfo();
        }
    }, [showForm, formData.candidateName, location.state]);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const data = await offerLetterApi.getAll();
            const list = Array.isArray(data) ? data : (data?.data || []);
            setRecords(list);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch offer letters');
        } finally {
            setLoading(false);
        }
    };

    // designationOptions from useMasterData (all designations)

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setFormData({
            _id: '',
            // Employee Details
            candidateName: '',
            empCode: '',
            address: '',
            date: new Date().toISOString().split('T')[0],
            department: '',
            designation: '',
            location: 'Mohan Nagar, Ghaziabad',
            reportingTo: '',
            monthlyCTC: '',
            annualCTC: '',
            workScheduleDays: 'Monday to Saturday',
            workScheduleTimeStart: '09:30',
            workScheduleTimeEnd: '18:30',
            joiningDate: '',
            joiningTime: '09:30',
            probationPeriod: 'six (6) months',
            
            // Contact Details
            mobileNumber: '',
            emailId: '',
            currentAddress: '',
            
            // Identification Details
            aadhaarNumber: '',
            panNumber: '',
            
            // Bank Details
            accountHolderName: '',
            bankName: '',
            branchName: '',
            accountNumber: '',
            ifscCode: '',
            status: 'active'
        });
        setIsEditing(false);
        setIsPreFilled(false);
        // Clear selection if any
        setRecords(prev => [...prev]); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { _id, workScheduleTimeStart, workScheduleTimeEnd, ...rest } = formData;
            
            // Convert 24-hour time to 12-hour format with AM/PM
            const formatTime = (time24: string) => {
                const [hours, minutes] = time24.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return `${hour12}:${minutes} ${ampm}`;
            };
            
            // Combine start and end time for work schedule
            const workScheduleTime = `${formatTime(workScheduleTimeStart)} to ${formatTime(workScheduleTimeEnd)}`;
            
            // Convert joining time to 12-hour format
            const joiningTimeFormatted = rest.joiningTime.includes(':') && !rest.joiningTime.includes('AM') && !rest.joiningTime.includes('PM')
                ? formatTime(rest.joiningTime)
                : rest.joiningTime;
            
            const submitData = {
                ...rest,
                joiningTime: joiningTimeFormatted,
                workScheduleTime
            };

            if (isEditing && _id) {
                await offerLetterApi.update(_id, submitData);
                toast.success('Offer Letter has been updated successfully.');
            } else {
                await offerLetterApi.create(submitData);
                toast.success('Offer Letter has been saved successfully.');
            }
            setShowForm(false);
            handleReset();
            fetchRecords();
            navigate(window.location.pathname, { replace: true, state: {} });
        } catch (error: any) {
            toast.error(error.message || 'Failed to save offer letter');
        }
    };

    const handleEdit = (record: any) => {
        // Parse workScheduleTime back to separate start and end times
        const parseTime = (timeStr: string) => {
            // Parse "9:30 AM to 6:30 PM" format
            if (timeStr && timeStr.includes(' to ')) {
                const [startStr, endStr] = timeStr.split(' to ');
                
                const convertTo24Hour = (time12: string) => {
                    const [time, period] = time12.trim().split(' ');
                    let [hours, minutes] = time.split(':');
                    let hour = parseInt(hours);
                    
                    if (period === 'PM' && hour !== 12) hour += 12;
                    if (period === 'AM' && hour === 12) hour = 0;
                    
                    return `${hour.toString().padStart(2, '0')}:${minutes}`;
                };
                
                return {
                    start: convertTo24Hour(startStr),
                    end: convertTo24Hour(endStr)
                };
            }
            return { start: '09:30', end: '18:30' };
        };
        
        // Parse joining time from "9:30 AM" to "09:30"
        const parseJoiningTime = (timeStr: string) => {
            if (timeStr && (timeStr.includes('AM') || timeStr.includes('PM'))) {
                const [time, period] = timeStr.trim().split(' ');
                let [hours, minutes] = time.split(':');
                let hour = parseInt(hours);
                
                if (period === 'PM' && hour !== 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                
                return `${hour.toString().padStart(2, '0')}:${minutes}`;
            }
            return timeStr || '09:30';
        };
        
        const { start, end } = parseTime(record.workScheduleTime);
        
        setFormData({
            ...record,
            date: record.date ? record.date.split('T')[0] : '',
            joiningDate: record.joiningDate ? record.joiningDate.split('T')[0] : '',
            joiningTime: parseJoiningTime(record.joiningTime),
            workScheduleTimeStart: start,
            workScheduleTimeEnd: end,
        });
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            await offerLetterApi.delete(id);
            fetchRecords();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete record');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await offerLetterApi.update(id, { status: newStatus });
            fetchRecords();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const handleNextStep = (row?: any) => {
        const candidateData = row
            ? {
                ...location.state?.preFill,
                // Employee Details
                candidateName: row.candidateName || location.state?.preFill?.candidateName || row.fullName,
                fullName: row.candidateName || location.state?.preFill?.fullName || row.fullName,
                empCode: row.empCode || location.state?.preFill?.empCode,
                employeeCode: row.empCode || location.state?.preFill?.employeeCode,
                department: row.department || location.state?.preFill?.department,
                designation: row.designation || location.state?.preFill?.designation,
                position: row.designation || location.state?.preFill?.position,
                doj: row.joiningDate || location.state?.preFill?.doj ? row.joiningDate.split('T')[0] : '',
                joiningDate: row.joiningDate || location.state?.preFill?.joiningDate ? row.joiningDate.split('T')[0] : '',
                workLocation: row.location || location.state?.preFill?.workLocation,
                reportingTo: row.reportingTo || location.state?.preFill?.reportingTo,
                currentAddress: row.address || location.state?.preFill?.currentAddress,
                
                // Salary Details
                monthlyCTC: row.monthlyCTC || location.state?.preFill?.monthlyCTC,
                annualCTC: row.annualCTC || location.state?.preFill?.annualCTC,
                
                // Contact Details
                mobileNumber: row.mobileNumber || location.state?.preFill?.mobileNumber,
                personalEmailId: row.emailId || location.state?.preFill?.personalEmailId,
                
                // Identification Details
                aadhaarNumber: row.aadhaarNumber || location.state?.preFill?.aadhaarNumber,
                panNumber: row.panNumber || location.state?.preFill?.panNumber,
                
                // Bank Details
                accountHolderName: row.accountHolderName || location.state?.preFill?.accountHolderName,
                bankName: row.bankName || location.state?.preFill?.bankName,
                branchName: row.branchName || location.state?.preFill?.branchName,
                accountNumber: row.accountNumber || location.state?.preFill?.accountNumber,
                ifscCode: row.ifscCode || location.state?.preFill?.ifscCode,
            }
            : {
                ...location.state?.preFill,
                // Employee Details
                candidateName: formData.candidateName || location.state?.preFill?.candidateName,
                fullName: formData.candidateName || location.state?.preFill?.fullName,
                empCode: formData.empCode || location.state?.preFill?.empCode,
                employeeCode: formData.empCode || location.state?.preFill?.employeeCode,
                department: formData.department || location.state?.preFill?.department,
                designation: formData.designation || location.state?.preFill?.designation,
                position: formData.designation || location.state?.preFill?.position,
                doj: formData.joiningDate || location.state?.preFill?.doj,
                joiningDate: formData.joiningDate || location.state?.preFill?.joiningDate,
                workLocation: formData.location || location.state?.preFill?.workLocation,
                reportingTo: formData.reportingTo || location.state?.preFill?.reportingTo,
                currentAddress: formData.address || location.state?.preFill?.currentAddress,
                
                // Salary Details
                monthlyCTC: formData.monthlyCTC || location.state?.preFill?.monthlyCTC,
                annualCTC: formData.annualCTC || location.state?.preFill?.annualCTC,
                
                // Contact Details
                mobileNumber: formData.mobileNumber || location.state?.preFill?.mobileNumber,
                personalEmailId: formData.emailId || location.state?.preFill?.personalEmailId,
                
                // Identification Details
                aadhaarNumber: formData.aadhaarNumber || location.state?.preFill?.aadhaarNumber,
                panNumber: formData.panNumber || location.state?.preFill?.panNumber,
                
                // Bank Details
                accountHolderName: formData.accountHolderName || location.state?.preFill?.accountHolderName,
                bankName: formData.bankName || location.state?.preFill?.bankName,
                branchName: formData.branchName || location.state?.preFill?.branchName,
                accountNumber: formData.accountNumber || location.state?.preFill?.accountNumber,
                ifscCode: formData.ifscCode || location.state?.preFill?.ifscCode,
            };
        console.log('Step13 - Passing ALL data to Step14:', candidateData); // Debug log
        navigate('/hiring/step-14', { state: { preFill: candidateData } });
    };

    const handleBulkDelete = async (rows: any[]) => {
        try {
            await Promise.all(rows.map(r => offerLetterApi.delete(r._id)));
            toast.success(`${rows.length} record${rows.length > 1 ? 's' : ''} deleted successfully`);
            fetchRecords();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete selected records');
        }
    };

    const onView = (id: string) => {
        router.push(`/hiring/step-13/view/${id}`);
    };

    const filteredRecords = records.filter(rec =>
        rec.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate paginated data
            
    return (
        <HiringStepLayout candidateId={candidateId} stepId="offer-letter">
            <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800 w-full overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base uppercase">OFFER LETTER</CardTitle>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">

            

            <PrintHeader title="Step 13 - Offer Letter" subtitle="Formal Offer of Employment (Recruitment Division)" />

            {showForm ? (
                <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between no-print">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-1 rounded-full">
                                <FileText size={16} className="text-green-600" />
                            </div>
                            <h2 className="text-[13px] font-bold text-[#0d3c68] uppercase tracking-tight">
                                Offer Letter Form (Recruitment Division)
                            </h2>
                        </div>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                handleReset();
                                navigate(window.location.pathname, { replace: true, state: {} });
                            }}
                            className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tight pr-2"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="p-2">
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="space-y-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">1</span>
                                    Candidate & Appointment Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                    <FormField label="Candidate Name:" required>
                                        <FormInput 
                                            value={formData.candidateName} 
                                            onChange={(e) => handleChange('candidateName', e.target.value)} 
                                            required 
                                            placeholder="Full Name" 
                                            readOnly={isPreFilled}
                                            className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                        />
                                    </FormField>
                                    <FormField label="Department:" required>
                                        {isPreFilled ? (
                                            <FormInput 
                                                value={formData.department} 
                                                readOnly 
                                                className="bg-slate-50 cursor-not-allowed"
                                            />
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
                                    <FormField label="Designation:" required>
                                        {isPreFilled ? (
                                            <FormInput 
                                                value={formData.designation} 
                                                readOnly 
                                                className="bg-slate-50 cursor-not-allowed"
                                            />
                                        ) : (
                                            <FormSelect
                                                options={designationOptions}
                                                value={formData.designation}
                                                onChange={(e) => handleChange('designation', e.target.value)}
                                                required
                                                placeholder="Select Designation"
                                            />
                                        )}
                                    </FormField>
                                    <FormField label="Offer Date:" required>
                                        <FormInput type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} required />
                                    </FormField>
                                    <FormField label="Joining Date:" required>
                                        <FormInput 
                                            type="date" 
                                            value={formData.joiningDate} 
                                            onChange={(e) => handleChange('joiningDate', e.target.value)} 
                                            required 
                                            readOnly={isPreFilled}
                                            className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                        />
                                    </FormField>
                                    <FormField label="Joining Time (Reporting):" required>
                                        <FormInput 
                                            type="time" 
                                            value={formData.joiningTime.includes(':') ? formData.joiningTime : '09:30'} 
                                            onChange={(e) => handleChange('joiningTime', e.target.value)} 
                                            required 
                                        />
                                    </FormField>
                                    <FormField label="Work Location:" required className="md:col-span-1">
                                        <FormInput 
                                            value={formData.location} 
                                            onChange={(e) => handleChange('location', e.target.value)} 
                                            required 
                                            placeholder="e.g. Head Office in Ghaziabad" 
                                            readOnly={isPreFilled}
                                            className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                        />
                                    </FormField>
                                    <FormField label="Reporting To:" required>
                                        <FormInput 
                                            value={formData.reportingTo} 
                                            onChange={(e) => handleChange('reportingTo', e.target.value)} 
                                            required 
                                            readOnly={isPreFilled}
                                            className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                            // className={cn(isPreFilled && "bg-slate-50 cursor-not-allowed")}
                                        />
                                    </FormField>
                                    <FormField label="Probation Period:" required>
                                        <FormInput value={formData.probationPeriod} onChange={(e) => handleChange('probationPeriod', e.target.value)} required placeholder="e.g. six (6) months" />
                                    </FormField>
                                    <FormField label="Address:" required className="md:col-span-1">
                                        <FormInput value={formData.address} onChange={(e) => handleChange('address', e.target.value)} required placeholder="e.g. Head Office in Ghaziabad" />
                                    </FormField>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="bg-[#0d3c68] text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-full">2</span>
                                    Salary & Work Schedule
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <FormField label="Monthly CTC (₹):" required>
                                        <FormInput value={formData.monthlyCTC} onChange={(e) => handleChange('monthlyCTC', e.target.value)} required placeholder="e.g. 28,000" />
                                    </FormField>
                                    <FormField label="Annual CTC (₹):" required>
                                        <FormInput value={formData.annualCTC} onChange={(e) => handleChange('annualCTC', e.target.value)} required placeholder="e.g. 3,36,000" />
                                    </FormField>
                                    <FormField label="Regular Working Days:" required className="md:col-span-1.5">
                                        <FormInput value={formData.workScheduleDays} onChange={(e) => handleChange('workScheduleDays', e.target.value)} required placeholder="e.g. Monday to Saturday" />
                                    </FormField>
                                    <FormField label="Regular Office Hours:" required className="md:col-span-1.5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={formData.workScheduleTimeStart}
                                                onChange={(e) => handleChange('workScheduleTimeStart', e.target.value)}
                                                required
                                                className="flex-1 h-8 px-2 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all"
                                            />
                                            <span className="text-slate-500 text-sm font-medium">to</span>
                                            <input
                                                type="time"
                                                value={formData.workScheduleTimeEnd}
                                                onChange={(e) => handleChange('workScheduleTimeEnd', e.target.value)}
                                                required
                                                className="flex-1 h-8 px-2 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all"
                                            />
                                        </div>
                                    </FormField>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-4 no-print">
                                <div className="text-[11px] text-slate-500 italic uppercase">
                                    * Fields marked with asterisk are mandatory
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            handleReset();
                                            navigate(window.location.pathname, { replace: true, state: {} });
                                        }}
                                        className="h-8 px-4 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-[4px] shadow-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                                    >
                                        <RotateCcw size={14} />
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="h-8 px-4 text-white text-[11px] font-bold rounded-[4px] shadow-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider bg-[#0d3c68] hover:bg-[#0a2e52]"
                                    >
                                        <Save size={14} />
                                        SAVE OFFER LETTER
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="no-print mt-3 animate-in fade-in duration-300">
                    <div className="bg-white rounded-b-[4px] shadow-sm border-x border-b border-slate-200 overflow-hidden">
                        <DataTable
                            columns={[
                                {
                                    key: 'sno',
                                    label: 'S.No',
                                    width: '60px',
                                    align: 'center',
                                    render: (_: any, __: any, index: number) => (
                                        <span className="text-slate-500 font-medium">{index + 1}</span>
                                    )
                                },
                                { key: 'candidateName', label: 'Candidate Name', width: '200px' },
                                { key: 'designation', label: 'Designation', width: '180px' },
                                {
                                    key: 'monthlyCTC',
                                    label: 'Monthly CTC',
                                    width: '120px',
                                    render: (val: any) => <span className="font-bold">₹{val}</span>
                                },
                                {
                                    key: 'joiningDate',
                                    label: 'Joining Date',
                                    width: '120px',
                                    render: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A'
                                },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    width: '100px',
                                    align: 'center',
                                    render: (val: any, row: any) => (
                                        <div className="relative inline-block">
                                            <select
                                                value={val}
                                                className={cn(
                                                    "appearance-none cursor-pointer pl-2 pr-7 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider transition-all border outline-none",
                                                    val === 'active'
                                                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                                )}
                                                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <ChevronDown
                                                size={10}
                                                className={cn(
                                                    "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none",
                                                    val === 'active' ? "text-green-700" : "text-red-700"
                                                )}
                                            />
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
                            onView={(row) => onView(row._id)}
                            onNextStep={handleNextStep}
                            selectable
                            onBulkDelete={handleBulkDelete}
                            loading={loading}
                        />
                    </div>

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
            </CardContent>
        </Card>
    </HiringStepLayout>
    );
}
