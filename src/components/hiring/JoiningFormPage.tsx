'use client';
'use client';
import { useState, useEffect } from 'react';
import {
  ClipboardList, Check, Save, RotateCcw, Search, ChevronDown, Loader2, User, Lightbulb, Meh, Glasses, Ruler, AlertTriangle, Info
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormField, FormInput, FormSelect, FormRadioGroup } from '@/components/common/FormComponents';
import { PrintButton } from '@/components/common/PrintButton';
import { PrintHeader } from '@/components/common/PrintHeader';
import { DataTable } from '@/components/shared/DataTable';
import StepGate from './StepGate';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import api from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useMasterDataStore } from '@/store/masterDataStore';
import { useAuthStore } from '@/store/authStore';
import { WebcamCapture } from '@/components/common/WebcamCapture';

const SectionHeader = ({ id, title, subText }: { id: number, title: string, subText?: string }) => (
  <div className="border-b border-slate-100 pb-2 mb-3 mt-4">
    <h3 className="text-[12px] font-bold text-[#0d3c68] uppercase tracking-wider flex items-center gap-2">
      <span className="bg-[#0d3c68] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{id}</span>
      {title}
    </h3>
    {subText && <p className="text-[10px] text-slate-500 mt-0.5 ml-7">{subText}</p>}
  </div>
);

export default function JoiningFormPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const joiningApi = {
    create: (data: any) => api.post('/hiring/joining-form', data),
    update: (id: string, data: any) => api.put('/hiring/joining-form/' + id, data),
    delete: (id: string) => api.delete('/hiring/joining-form/' + id)
  };
  const documentChecklistApi = { getAll: () => api.get('/hiring/doc-checklist') };
  const selectionApi = { getAll: () => api.get('/hiring/selection-approval') };

  const location = { state: null as any };

  const queryClient = useQueryClient();
  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const stepState = pipeline?.steps?.find((s: any) => s.key === 'employeeJoiningForm');
  const locked = stepState?.gate?.unlocked === false;

  const { departments, designations, employees, isLoading: masterDataLoading, fetchMasterData } = useMasterDataStore();
  const departmentOptions = departments.map(d => ({ value: d.name || '', label: d.name || '' }));
  const designationOptions = designations.map(d => ({ value: d.title || d.name || '', label: d.title || d.name || '' }));
  const employeeOptions = employees.map(e => ({ value: (e.firstName || '') + ' ' + (e.lastName || ''), label: (e.firstName || '') + ' ' + (e.lastName || '') }));
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreFilled, setIsPreFilled] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    // 1. PERSONAL DETAILS
    fullName: '',
    gender: '',
    fatherMotherName: '',
    dob: '',
    bloodGroup: '',
    nationality: 'Indian',
    maritalStatus: '',
    marriageAnniversary: '',

    // 2. CONTACT DETAILS
    currentAddress: '',
    mobileNumber: '',
    alternateNumber: '',
    personalEmailId: '',

    // 3. POSITION & EMPLOYMENT DETAILS
    designation: '',
    department: '',
    joiningDate: '',
    reportingManager: '',
    workLocation: 'Head Office (Mohannagar, Ghaziabad)',
    employeeCategory: '',
    empCode: '',

    // 4. IDENTIFICATION DETAILS
    aadhaarNumber: '',
    panNumber: '',
    drivingLicense: '',
    passportNumber: '',

    // 5. BANK ACCOUNT DETAILS
    accountHolderName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',

    // 6. EMERGENCY CONTACT DETAILS
    emergencyName: '',
    emergencyRelationship: '',
    emergencyMobile: '',
    emergencyAlternate: '',
    emergencyAddress: '',

    // 7. EDUCATION DETAILS
    education: [
      { id: '1', qualification: '10th', institution: '', year: '', percentage: '', submittals: 'No' },
      { id: '2', qualification: '12th', institution: '', year: '', percentage: '', submittals: 'No' },
      { id: '3', qualification: 'Graduation', institution: '', year: '', percentage: '', submittals: 'No' },
      { id: '4', qualification: 'Post Graduation', institution: '', year: '', percentage: '', submittals: 'No' },
      { id: '5', qualification: 'Other', institution: '', year: '', percentage: '', submittals: 'No' },
    ],

    // 8. PREVIOUS EMPLOYMENT DETAILS
    lastEmployerName: '',
    lastDesignation: '',
    lastDoj: '',
    lastDol: '',
    totalExperience: '',
    lastSalary: '',
    reasonForLeaving: '',

    // 9. DOCUMENT SUBMISSION STATUS
    docs: [
      { id: '1', name: 'Aadhaar Card', status: 'No' },
      { id: '2', name: 'PAN Card', status: 'No' },
      { id: '3', name: '10th Marksheet', status: 'No' },
      { id: '4', name: '12th Marksheet', status: 'No' },
      { id: '5', name: 'Graduation Certificate', status: 'No' },
      { id: '6', name: 'Experience Letters', status: 'No' },
      { id: '7', name: 'Last 3 Salary Slips', status: 'No' },
    ],
    verifiedBy: '',

    // 10. DECLARATIONS & APPROVALS
    employeeSignature: '',
    employeeSignDate: '',
    hrVerifiedBy: '',
    hrDesignation: '',
    hrDate: '',
    hrRemarks: '',

    // 11. OPERATIONAL DETAILS (New)
    attendanceBy: '',
    dutyReportLocation: '',
    weakOff: '',
    dutyShift: '',
    dutyTiming: '',
    dutyInTime: '09:00',
    dutyOutTime: '18:00',
    crewcamRole: '',
    employeeImage: '',
    multiDaySchedule: [
      { day: 'Sunday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Monday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Tuesday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Wednesday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Thursday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Friday', checkIn: '09:00', checkOut: '18:00' },
      { day: 'Saturday', checkIn: '09:00', checkOut: '18:00' },
    ],
  });

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await api.get('/hiring/joining-form', { params: { candidateId } }).then(res => Array.isArray(res.data) ? res.data : res.data.data);
      const list = Array.isArray(data) ? data : (data?.data || []);
      setDataList(list);
    } catch (error) {
      toast.error('Error - ' + 'Failed to fetch joining records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employees || employees.length === 0) return;
    const currentUsername = (user as any)?.username || (user as any)?.name || '';
    const hrEmployee = employees.find(emp =>
      emp.employeeName?.toLowerCase() === currentUsername.toLowerCase() ||
      emp.department?.toLowerCase() === 'hr'
    );
    const hrName = hrEmployee?.employeeName || currentUsername || 'Admin';
    setFormData(prev => ({
      ...prev,
      hrVerifiedBy: prev.hrVerifiedBy || hrName
    }));
  }, [employees, user]);

  // 1. Initial data fetch
  useEffect(() => {
    fetchForms();
    fetchMasterData();
  }, []);

  // 2. Handle pre-fill from navigation state
  useEffect(() => {
    if (location.state?.preFill && !showForm) {
      const preFill = location.state.preFill;
      console.log('Step9: Processing preFill data:', preFill);

      // Format joining date properly
      let joiningDateFormatted = '';
      if (preFill.joiningDate) {
        joiningDateFormatted = preFill.joiningDate.includes('T')
          ? preFill.joiningDate.split('T')[0]
          : preFill.joiningDate;
      } else if (preFill.doj) {
        joiningDateFormatted = preFill.doj.includes('T')
          ? preFill.doj.split('T')[0]
          : preFill.doj;
      }

      setFormData(prev => ({
        ...prev,
        fullName: preFill.fullName || preFill.candidateName || prev.fullName,
        department: preFill.department || prev.department,
        designation: preFill.designation || preFill.position || prev.designation,
        joiningDate: joiningDateFormatted || prev.joiningDate,
        personalEmailId: preFill.personalEmailId || preFill.emailId || prev.personalEmailId,
        mobileNumber: preFill.mobileNumber || preFill.phoneNo || prev.mobileNumber,
        workLocation: preFill.workLocation || prev.workLocation,
        reportingManager: preFill.reportingTo || prev.reportingManager,
        currentAddress: preFill.currentAddress || prev.currentAddress,
        empCode: preFill.empCode || preFill.employeeCode || prev.empCode,
      }));

      setIsPreFilled(true);
      setShowForm(true);
    }
  }, [location.state]);

  // 2b. Handle pre-fill from Candidate profile, Selection Approval, and Joining Confirmation if no existing form is present
  useEffect(() => {
    if (!showForm && candidate && dataList.length === 0 && !editId) {
      console.log('Step9: Prefilling from candidate data');
      
      Promise.all([
        api.get('/hiring/selection-approval', { params: { candidateId } }).catch(() => ({ data: { data: [] } })),
        api.get('/hiring/joining-confirmation', { params: { candidateId } }).catch(() => ({ data: { data: [] } }))
      ]).then(([approvalRes, confirmationRes]) => {
        const approvals = Array.isArray(approvalRes.data?.data) ? approvalRes.data.data : (Array.isArray(approvalRes.data) ? approvalRes.data : [approvalRes.data]);
        const approval = approvals?.find((a: any) => a && (a.candidateId === candidateId || a.candidateId?._id === candidateId));
        
        const confirmations = Array.isArray(confirmationRes.data?.data) ? confirmationRes.data.data : (Array.isArray(confirmationRes.data) ? confirmationRes.data : [confirmationRes.data]);
        const confirmation = confirmations?.find((c: any) => c && (c.candidateId === candidateId || c.candidateId?._id === candidateId));
        
        const confirmedDOJ = confirmation?.confirmedJoiningDate || confirmation?.joiningDate;
        const approvalDOJ = approval?.joiningDate;
        const finalDOJ = (confirmedDOJ && confirmedDOJ !== 'N/A') ? confirmedDOJ : ((approvalDOJ && approvalDOJ !== 'N/A') ? approvalDOJ : null);
        
        setFormData(prev => ({
          ...prev,
          fullName: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || prev.fullName,
          personalEmailId: candidate.email || prev.personalEmailId,
          mobileNumber: candidate.phone || candidate.mobile || prev.mobileNumber,
          department: (candidate.departmentId?.name || candidate.departmentId?.departmentName || (approval?.department !== 'N/A' ? approval?.department : null) || prev.department),
          designation: candidate.jobRole || (approval?.designation !== 'N/A' ? approval?.designation : null) || prev.designation,
          workLocation: (confirmation?.reportingLocation !== 'N/A' ? confirmation?.reportingLocation : null) || (approval?.workLocation !== 'N/A' ? approval?.workLocation : null) || prev.workLocation,
          reportingManager: (confirmation?.reportingTo !== 'N/A' ? confirmation?.reportingTo : null) || (approval?.reportingTo !== 'N/A' ? approval?.reportingTo : null) || prev.reportingManager,
          joiningDate: finalDOJ ? String(finalDOJ).split('T')[0] : prev.joiningDate,
          gender: candidate.gender || prev.gender,
          dob: candidate.dob ? candidate.dob.split('T')[0] : prev.dob,
          currentAddress: candidate.address || prev.currentAddress,
          empCode: candidate.candidateCode || prev.empCode,
        }));
        setIsPreFilled(true);
        setShowForm(true);
      });
    }
  }, [candidate, employees, dataList, showForm, editId]);

  // 3. Restore/Merge from DB records
  useEffect(() => {
    if (dataList.length === 0) return;

    let existingRecord = null;

    if (editId) {
      existingRecord = dataList.find(r => r._id === editId);
    } else {
      existingRecord = dataList[0];
    }

    if (existingRecord) {
      console.log('Step9: Matching DB record found, merging data...');
      setFormData(prev => ({
        ...prev,
        fullName: existingRecord.personalDetails?.fullName || prev.fullName,
        dob: (existingRecord.personalDetails?.dob || '').split('T')[0] || prev.dob,
        gender: existingRecord.personalDetails?.gender || prev.gender,
        maritalStatus: existingRecord.personalDetails?.maritalStatus || prev.maritalStatus,
        marriageAnniversary: (existingRecord.personalDetails?.marriageAnniversary || '').split('T')[0] || prev.marriageAnniversary,
        bloodGroup: existingRecord.personalDetails?.bloodGroup || prev.bloodGroup,
        nationality: existingRecord.personalDetails?.nationality || prev.nationality,
        fatherMotherName: existingRecord.personalDetails?.fatherMotherName || prev.fatherMotherName,

        mobileNumber: existingRecord.contactDetails?.mobileNumber || prev.mobileNumber,
        alternateNumber: existingRecord.contactDetails?.alternateNumber || prev.alternateNumber,
        personalEmailId: existingRecord.personalEmailId || existingRecord.contactDetails?.personalEmail || prev.personalEmailId,
        currentAddress: existingRecord.contactDetails?.currentAddress || prev.currentAddress,

        designation: existingRecord.positionDetails?.designation || prev.designation,
        department: existingRecord.positionDetails?.department || prev.department,
        joiningDate: (existingRecord.positionDetails?.joiningDate || '').split('T')[0] || prev.joiningDate,
        reportingManager: existingRecord.positionDetails?.reportingManager || prev.reportingManager,
        workLocation: existingRecord.positionDetails?.workLocation || prev.workLocation,
        employeeCategory: existingRecord.positionDetails?.employeeCategory || prev.employeeCategory,
        empCode: existingRecord.positionDetails?.empCode || prev.empCode,

        aadhaarNumber: existingRecord.identificationDetails?.aadhaarNumber || prev.aadhaarNumber,
        panNumber: existingRecord.identificationDetails?.panNumber || prev.panNumber,
        drivingLicense: existingRecord.identificationDetails?.drivingLicense || prev.drivingLicense,
        passportNumber: existingRecord.identificationDetails?.passportNumber || prev.passportNumber,

        accountHolderName: existingRecord.bankDetails?.accountHolderName || prev.accountHolderName,
        bankName: existingRecord.bankDetails?.bankName || prev.bankName,
        branchName: existingRecord.bankDetails?.branchName || prev.branchName,
        accountNumber: existingRecord.bankDetails?.accountNumber || prev.accountNumber,
        ifscCode: existingRecord.bankDetails?.ifscCode || prev.ifscCode,

        emergencyName: existingRecord.emergencyName || prev.emergencyName,
        emergencyRelationship: existingRecord.emergencyRelationship || prev.emergencyRelationship,
        emergencyMobile: existingRecord.emergencyMobile || prev.emergencyMobile,
        emergencyAlternate: existingRecord.emergencyAlternate || prev.emergencyAlternate,
        emergencyAddress: existingRecord.emergencyAddress || prev.emergencyAddress,

        lastEmployerName: existingRecord.lastEmployerName || prev.lastEmployerName,
        lastDesignation: existingRecord.lastDesignation || prev.lastDesignation,
        lastDoj: (existingRecord.lastDoj || '').split('T')[0] || prev.lastDoj,
        lastDol: (existingRecord.lastDol || '').split('T')[0] || prev.lastDol,
        lastSalary: existingRecord.lastSalary || prev.lastSalary,
        totalExperience: existingRecord.totalExperience || prev.totalExperience,
        reasonForLeaving: existingRecord.reasonForLeaving || prev.reasonForLeaving,

        education: existingRecord.educationDetails?.length ? prev.education.map((item: any, i: number) => {
          const ed = existingRecord.educationDetails[i];
          if (!ed) return item;
          return { ...item, qualification: ed.qualification || item.qualification, institution: ed.institution || '', year: ed.yearOfPassing || '', percentage: ed.percentage || '', submittals: ed.documentSubmitted ? 'Yes' : 'No' };
        }) : prev.education,

        docs: existingRecord.documents?.length ? prev.docs.map((item: any, i: number) => {
          const doc = existingRecord.documents.find((d: any) => d.name === item.name) || existingRecord.documents[i];
          if (!doc) return item;
          return { ...item, status: doc.status || 'No' };
        }) : prev.docs,

        attendanceBy: existingRecord.operationalDetails?.attendanceMode || prev.attendanceBy,
        dutyReportLocation: existingRecord.operationalDetails?.dutyLocation || prev.dutyReportLocation,
        weakOff: existingRecord.operationalDetails?.weeklyOff || prev.weakOff,
        dutyShift: existingRecord.operationalDetails?.shift || prev.dutyShift,
        dutyTiming: existingRecord.operationalDetails?.dutyTimingFrom ? 'Single' : prev.dutyTiming,
        dutyInTime: existingRecord.operationalDetails?.dutyTimingFrom || prev.dutyInTime,
        dutyOutTime: existingRecord.operationalDetails?.dutyTimingTo || prev.dutyOutTime,
        crewcamRole: existingRecord.operationalDetails?.crewcamRole || prev.crewcamRole,
        employeeImage: existingRecord.employeeImage || prev.employeeImage,

        hrVerifiedBy: existingRecord.declaration?.hrVerifiedBy || prev.hrVerifiedBy,
        hrDesignation: existingRecord.declaration?.hrDesignation || prev.hrDesignation,
        hrDate: (existingRecord.declaration?.hrDate || '').split('T')[0] || prev.hrDate,
        hrRemarks: existingRecord.declaration?.hrRemarks || prev.hrRemarks,
      }));

      setEditingId(existingRecord._id);
      setIsPreFilled(true);
    }
  }, [dataList, location.state, formData.fullName, formData.empCode, editId]);

  // 4.5. Fetch Employee Code and DOJ from specific APIs if missing
  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      const identifierName = (location.state?.preFill?.fullName || location.state?.preFill?.candidateName || formData.fullName || '').toLowerCase();
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
        console.error('Step9: Error fetching additional pre-fill data:', error);
      }
    };

    if (showForm) {
      fetchAdditionalInfo();
    }
  }, [showForm, formData.fullName, location.state]);

  // navigate to the next workflow page, optionally using data from a specific row
  const handleNextStep = (row?: any) => {
    // Helper to format ISO date strings to YYYY-MM-DD
    const fmtDate = (val: any): string => {
      if (!val) return '';
      const s = typeof val === 'object' ? val?.toISOString?.() || '' : String(val);
      return s.includes('T') ? s.split('T')[0] : s;
    };

    const candidateData = row
      ? {
        // Personal Details
        fullName: row.personalDetails?.fullName || '',
        dob: fmtDate(row.personalDetails?.dob),
        gender: row.personalDetails?.gender || '',
        fatherHusbandSpouse: row.personalDetails?.fatherMotherName || '',
        fatherMotherName: row.personalDetails?.fatherMotherName || '',
        nationality: row.personalDetails?.nationality || 'Indian',
        bloodGroup: row.personalDetails?.bloodGroup || '',
        maritalStatus: row.personalDetails?.maritalStatus || '',
        marriageAnniversary: fmtDate(row.personalDetails?.marriageAnniversary),

        // Contact Details
        currentAddress: row.contactDetails?.currentAddress || '',
        mobileNumber: row.contactDetails?.mobileNumber || '',
        alternateNumber: row.contactDetails?.alternateNumber || '',
        personalEmailId: row.personalEmailId || row.contactDetails?.personalEmail || '',
        emailId: row.personalEmailId || row.contactDetails?.personalEmail || '',

        // Employment Details
        department: row.positionDetails?.department || '',
        designation: row.positionDetails?.designation || '',
        position: row.positionDetails?.designation || '',
        joiningDate: fmtDate(row.positionDetails?.joiningDate),
        doj: fmtDate(row.positionDetails?.joiningDate),
        workLocation: row.positionDetails?.workLocation || '',
        reportingTo: row.positionDetails?.reportingManager || '',
        reportingManager: row.positionDetails?.reportingManager || '',
        empCode: row.positionDetails?.empCode || '',
        employeeCode: row.positionDetails?.empCode || '',
        employeeCategory: row.positionDetails?.employeeCategory || '',

        // Identification Details
        aadhaarNumber: row.identificationDetails?.aadhaarNumber || '',
        panNumber: row.identificationDetails?.panNumber || '',
        drivingLicense: row.identificationDetails?.drivingLicense || '',
        passportNumber: row.identificationDetails?.passportNumber || '',

        // Bank Account Details
        accountHolderName: row.bankDetails?.accountHolderName || '',
        bankName: row.bankDetails?.bankName || '',
        branchName: row.bankDetails?.branchName || '',
        accountNumber: row.bankDetails?.accountNumber || '',
        ifscCode: row.bankDetails?.ifscCode || '',

        // Emergency Contact
        emergencyName: row.emergencyContact?.name || '',
        emergencyRelationship: row.emergencyContact?.relationship || '',
        emergencyMobile: row.emergencyContact?.mobileNumber || '',
        emergencyAddress: row.emergencyContact?.address || '',
      }
      : {
        // Personal Details
        fullName: formData.fullName,
        dob: fmtDate(formData.dob),
        gender: formData.gender,
        fatherHusbandSpouse: formData.fatherMotherName,
        fatherMotherName: formData.fatherMotherName,
        nationality: formData.nationality,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus,
        marriageAnniversary: formData.marriageAnniversary,

        // Contact Details
        currentAddress: formData.currentAddress,
        mobileNumber: formData.mobileNumber,
        alternateNumber: formData.alternateNumber,
        personalEmailId: formData.personalEmailId,
        emailId: formData.personalEmailId,

        // Employment Details
        department: formData.department,
        designation: formData.designation,
        position: formData.designation,
        joiningDate: fmtDate(formData.joiningDate),
        doj: fmtDate(formData.joiningDate),
        workLocation: formData.workLocation,
        reportingTo: formData.reportingManager,
        reportingManager: formData.reportingManager,
        empCode: formData.empCode,
        employeeCode: formData.empCode,
        employeeCategory: formData.employeeCategory,

        // Identification Details
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        drivingLicense: formData.drivingLicense,
        passportNumber: formData.passportNumber,

        // Bank Account Details
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        branchName: formData.branchName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,

        // Emergency Contact
        emergencyName: formData.emergencyName,
        emergencyRelationship: formData.emergencyRelationship,
        emergencyMobile: formData.emergencyMobile,
        emergencyAddress: formData.emergencyAddress,

        // Operational Details
        attendanceBy: formData.attendanceBy,
        dutyReportLocation: formData.dutyReportLocation,
        weakOff: formData.weakOff,
        dutyShift: formData.dutyShift,
        dutyTiming: formData.dutyTiming,
        dutyInTime: formData.dutyInTime,
        dutyOutTime: formData.dutyOutTime,
        crewcamRole: formData.crewcamRole,
        employeeImage: formData.employeeImage,
        multiDaySchedule: formData.multiDaySchedule,
      };
    console.log('Step9 - Passing ALL data to Step10:', candidateData); // Debug log
    router.push('/hiring/step-10');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleDocStatusChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      docs: prev.docs.map(item => item.id === id ? { ...item, status: value } : item)
    }));
  };

  const validateForm = () => {
    console.log('Step9 - Starting validation for formData:', formData);

    // Required Fields Check
    const requiredFields = [
      { field: 'fullName', label: 'Full Name' },
      { field: 'gender', label: 'Gender' },
      { field: 'dob', label: 'Date of Birth' },
      { field: 'fatherMotherName', label: "Parent's Name" },
      { field: 'currentAddress', label: 'Current Address' },
      { field: 'mobileNumber', label: 'Mobile Number' },
      { field: 'personalEmailId', label: 'Personal Email ID' },
      { field: 'designation', label: 'Designation' },
      { field: 'department', label: 'Department' },
      { field: 'joiningDate', label: 'Date of Joining' },
      { field: 'employeeCategory', label: 'Employee Category' },
      { field: 'aadhaarNumber', label: 'Aadhaar Number' },
      { field: 'panNumber', label: 'PAN Number' },
      { field: 'accountHolderName', label: 'Account Holder Name' },
      { field: 'bankName', label: 'Bank Name' },
      { field: 'branchName', label: 'Branch Name' },
      { field: 'accountNumber', label: 'Account Number' },
      { field: 'ifscCode', label: 'IFSC Code' },
      { field: 'emergencyName', label: 'Emergency Contact Name' },
      { field: 'emergencyRelationship', label: 'Emergency Relationship' },
      { field: 'emergencyMobile', label: 'Emergency Mobile' },
      { field: 'emergencyAddress', label: 'Emergency Address' }
    ];

    for (const { field, label } of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        console.warn(`Step9 Validation - Missing required field: ${label}`);
        toast.error('Validation Error - ' + `${label} is required`);
        return false;
      }
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.personalEmailId.trim())) {
      console.warn('Step9 Validation - Invalid Email:', formData.personalEmailId);
      toast.error('Validation Error - ' + 'Please enter a valid Email ID');
      return false;
    }

    // Mobile Number Validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber.trim())) {
      console.warn('Step9 Validation - Invalid Mobile:', formData.mobileNumber);
      toast.error('Validation Error - ' + 'Mobile Number must be 10 digits');
      return false;
    }

    if (formData.alternateNumber && formData.alternateNumber.trim() !== '' && !mobileRegex.test(formData.alternateNumber.trim())) {
      console.warn('Step9 Validation - Invalid Alternate Mobile:', formData.alternateNumber);
      toast.error('Validation Error - ' + 'Alternate Number must be 10 digits');
      return false;
    }

    if (!mobileRegex.test(formData.emergencyMobile.trim())) {
      console.warn('Step9 Validation - Invalid Emergency Mobile:', formData.emergencyMobile);
      toast.error('Validation Error - ' + 'Emergency Mobile must be 10 digits');
      return false;
    }

    // Aadhaar Validation (12 digits)
    const aadhaarRegex = /^[0-9]{12}$/;
    const cleanAadhaar = formData.aadhaarNumber.replace(/[\s-]/g, '');
    if (!aadhaarRegex.test(cleanAadhaar)) {
      console.warn('Step9 Validation - Invalid Aadhaar:', formData.aadhaarNumber);
      toast.error('Validation Error - ' + 'Aadhaar Number must be 12 digits');
      return false;
    }

    // PAN Validation
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (!panRegex.test(formData.panNumber.trim().toUpperCase())) {
      console.warn('Step9 Validation - Invalid PAN:', formData.panNumber);
      toast.error('Validation Error - ' + 'Please enter a valid PAN Number');
      return false;
    }

    // IFSC Validation
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifscCode.trim().toUpperCase())) {
      console.warn('Step9 Validation - Invalid IFSC:', formData.ifscCode);
      toast.error('Validation Error - ' + 'Please enter a valid IFSC Code');
      return false;
    }

    console.log('Step9 - Validation passed successfully');
    return true;
  };

  const handleReset = () => {
    setEditingId(null);
    setIsPreFilled(false);
    setFormData({
      fullName: '', gender: '', fatherMotherName: '', dob: '', bloodGroup: '', nationality: 'Indian', maritalStatus: '', marriageAnniversary: '',
      currentAddress: '', mobileNumber: '', alternateNumber: '', personalEmailId: '', designation: '', department: '', joiningDate: '',
      reportingManager: '', workLocation: 'Head Office (Mohannagar, Ghaziabad)', employeeCategory: '', empCode: '', aadhaarNumber: '', panNumber: '',
      drivingLicense: '', passportNumber: '', accountHolderName: '', bankName: '', branchName: '', accountNumber: '', ifscCode: '',
      emergencyName: '', emergencyRelationship: '', emergencyMobile: '', emergencyAlternate: '', emergencyAddress: '',
      education: [
        { id: '1', qualification: '10th', institution: '', year: '', percentage: '', submittals: 'No' },
        { id: '2', qualification: '12th', institution: '', year: '', percentage: '', submittals: 'No' },
        { id: '3', qualification: 'Graduation', institution: '', year: '', percentage: '', submittals: 'No' },
        { id: '4', qualification: 'Post Graduation', institution: '', year: '', percentage: '', submittals: 'No' },
        { id: '5', qualification: 'Other', institution: '', year: '', percentage: '', submittals: 'No' }
      ],
      lastEmployerName: '', lastDesignation: '', lastDoj: '', lastDol: '', totalExperience: '', lastSalary: '', reasonForLeaving: '',
      docs: [
        { id: '1', name: 'Aadhaar Card', status: 'No' },
        { id: '2', name: 'PAN Card', status: 'No' },
        { id: '3', name: '10th Marksheet', status: 'No' },
        { id: '4', name: '12th Marksheet', status: 'No' },
        { id: '5', name: 'Graduation Certificate', status: 'No' },
        { id: '6', name: 'Experience Letters', status: 'No' },
        { id: '7', name: 'Last 3 Salary Slips', status: 'No' }
      ],
      verifiedBy: '', employeeSignature: '', employeeSignDate: '', hrVerifiedBy: '', hrDesignation: '', hrDate: '', hrRemarks: '',
      attendanceBy: '', dutyReportLocation: '', weakOff: '', dutyShift: '', dutyTiming: '', dutyInTime: '09:00', dutyOutTime: '18:00', crewcamRole: '', employeeImage: '',
      multiDaySchedule: [
        { day: 'Sunday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Monday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Tuesday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Wednesday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Thursday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Friday', checkIn: '09:00', checkOut: '18:00' },
        { day: 'Saturday', checkIn: '09:00', checkOut: '18:00' },
      ],
    });
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const sanitizedData = {
        candidateId,
        personalEmailId: formData.personalEmailId,
        emergencyName: formData.emergencyName,
        emergencyRelationship: formData.emergencyRelationship,
        emergencyMobile: formData.emergencyMobile,
        emergencyAlternate: formData.emergencyAlternate,
        emergencyAddress: formData.emergencyAddress,
        lastEmployerName: formData.lastEmployerName,
        lastDesignation: formData.lastDesignation,
        lastDoj: formData.lastDoj,
        lastDol: formData.lastDol,
        lastSalary: formData.lastSalary,
        totalExperience: formData.totalExperience,
        reasonForLeaving: formData.reasonForLeaving,
        employeeImage: formData.employeeImage,

        personalDetails: {
          fullName: formData.fullName,
          dob: formData.dob ? new Date(formData.dob) : undefined,
          gender: formData.gender,
          maritalStatus: formData.maritalStatus,
          marriageAnniversary: formData.marriageAnniversary ? new Date(formData.marriageAnniversary) : undefined,
          bloodGroup: formData.bloodGroup,
          nationality: formData.nationality,
          fatherMotherName: formData.fatherMotherName,
        },
        contactDetails: {
          mobileNumber: formData.mobileNumber,
          alternateNumber: formData.alternateNumber,
          personalEmail: formData.personalEmailId,
          currentAddress: formData.currentAddress,
        },
        positionDetails: {
          designation: formData.designation,
          department: formData.department,
          joiningDate: formData.joiningDate ? new Date(formData.joiningDate) : undefined,
          reportingManager: formData.reportingManager,
          workLocation: formData.workLocation,
          employeeCategory: formData.employeeCategory,
          empCode: formData.empCode,
        },
        identificationDetails: {
          aadhaarNumber: formData.aadhaarNumber.replace(/[\s-]/g, ''),
          panNumber: formData.panNumber.trim().toUpperCase(),
          drivingLicense: formData.drivingLicense,
          passportNumber: formData.passportNumber,
        },
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          branchName: formData.branchName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.trim().toUpperCase(),
        },
        educationDetails: formData.education.map(ed => ({
          qualification: ed.qualification,
          institution: ed.institution,
          yearOfPassing: ed.year,
          percentage: ed.percentage,
          documentSubmitted: ed.submittals === 'Yes'
        })),
        documents: formData.docs.map(doc => ({
          name: doc.name,
          status: doc.status
        })),
        operationalDetails: {
          attendanceMode: formData.attendanceBy,
          dutyLocation: formData.dutyReportLocation,
          weeklyOff: formData.weakOff,
          shift: formData.dutyShift,
          dutyTimingFrom: formData.dutyInTime,
          dutyTimingTo: formData.dutyOutTime,
          crewcamRole: formData.crewcamRole,
        },
        declaration: {
          employeeSignature: formData.employeeSignature,
          signDate: formData.employeeSignDate ? new Date(formData.employeeSignDate) : undefined,
          hrVerifiedBy: formData.hrVerifiedBy,
          hrDesignation: formData.hrDesignation,
          hrDate: formData.hrDate ? new Date(formData.hrDate) : undefined,
          hrRemarks: formData.hrRemarks,
        }
      };

      if (editingId) {
        await joiningApi.update(editingId, sanitizedData);
        toast.success('Success - ' + 'Joining record updated successfully');
      } else {
        await joiningApi.create(sanitizedData);
        toast.success('Success - ' + 'Joining documentation record created successfully');
      }
      router.push(`/dashboard/hiring/steps/joining-form`);
    } catch (error: any) {
      toast.error('Error - ' + error.message || 'Failed to save record');
    }
  };

  const handleBulkDelete = async (rows: any[]) => {
    try {
      await Promise.all(rows.map(r => joiningApi.delete(r._id)));
      toast.success('Deleted - ' + `${rows.length} record${rows.length > 1 ? 's' : ''} deleted successfully`);
      fetchForms();
    } catch (error: any) {
      toast.error('Error - ' + error.message || 'Failed to delete selected records');
    }
  };

  // Calculate paginated data

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm no-print">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">HIRING · STEP 9 · ONBOARDING</p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">EMPLOYEE JOINING FORM</h1>
            {candidate && <p className="mt-1 text-[12px] text-slate-500">{candidate.firstName} {candidate.lastName} · {candidate.jobRole}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <StepGate unlocked={!locked} blockedBy={stepState?.gate?.blockedBy || []} compact />
            <Button variant="ghost" className="h-8 gap-2 px-3 text-xs border border-slate-200" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>
              <ArrowLeft size={14} /> Back
            </Button>
          </div>
        </div>
        <div className="mt-3 h-[3px] w-full bg-[#0d3c68] rounded-full" />
      </div>

      <div className="px-4 space-y-4">

        <div className="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 no-print">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <ClipboardList className="h-4 w-4 text-[#0d3c68]" />
              Employee Onboarding Information Sheet
            </h2>
          </div>

          <div className="p-5 space-y-4">
            {/* 1. PERSONAL DETAILS */}
            <div className="bg-slate-50/30 p-2 border border-slate-100 rounded">
              <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <FormField label="1. Full Name (Aadhaar):" required className="md:col-span-1">
                  <FormInput value={formData.fullName} placeholder="e.g. John Doe" onChange={(e) => handleChange('fullName', e.target.value)} required />
                </FormField>
                <FormField label="2. Gender:" required>
                  <FormSelect
                    options={['Male', 'Female', 'Other'].map(opt => ({ value: opt, label: opt }))}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    placeholder="Select Gender"
                    required />
                </FormField>
                <FormField label="3. Date of Birth:" required>
                  <FormInput type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} required />
                </FormField>
                <FormField label="4. Blood Group:">
                  <FormSelect
                    options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(opt => ({ value: opt, label: opt }))}
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)} />
                </FormField>
                <FormField label="5. Parent's Name:" required className="md:col-span-1">
                  <FormInput value={formData.fatherMotherName} placeholder="e.g. Richard Doe" onChange={(e) => handleChange('fatherMotherName', e.target.value)} required />
                </FormField>
                <FormField label="6. Nationality:" required>
                  <FormInput value={formData.nationality} placeholder="e.g. Indian" onChange={(e) => handleChange('nationality', e.target.value)} readOnly className="bg-slate-50" />
                </FormField>
                <FormField label="7. Marital Status:" className="md:col-span-1">
                  <FormSelect
                    options={[{ value: '', label: 'Select' }, { value: 'Single', label: 'Single' }, { value: 'Married', label: 'Married' }, { value: 'Divorced', label: 'Divorced' }, { value: 'Widowed', label: 'Widowed' }].map(opt => ({ value: opt.value, label: opt.label }))}
                    value={formData.maritalStatus}
                    onChange={(e) => {
                      handleChange('maritalStatus', e.target.value);
                      if (e.target.value !== 'Married') {
                        handleChange('marriageAnniversary', '');
                      }
                    }} />
                </FormField>
                {formData.maritalStatus === 'Married' && (
                  <FormField label="8. Marriage Anniversary:" className="md:col-span-1">
                    <FormInput
                      type="date"
                      value={formData.marriageAnniversary}
                      onChange={(e) => handleChange('marriageAnniversary', e.target.value)} />
                  </FormField>
                )}
              </div>
            </div>

            {/* 2. CONTACT DETAILS */}
            <div className="bg-slate-50/30 p-2 border border-slate-100 rounded">
              <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <FormField label="8. Current Address:" required>
                  <FormInput
                    type="text"
                    value={formData.currentAddress} placeholder="e.g. 123 Main St, City, State, ZIP"
                    onChange={(e) => handleChange("currentAddress", e.target.value)}
                    required />
                </FormField>
                <FormField label="9. Mobile Number:" required>
                  <FormInput
                    type="tel"
                    value={formData.mobileNumber} placeholder="e.g. 9876543210"
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                    required />
                </FormField>
                <FormField label="10. Alternate No.:">
                  <FormInput
                    type="tel"
                    value={formData.alternateNumber} placeholder="e.g. 9876543210"
                    onChange={(e) => handleChange("alternateNumber", e.target.value)} />
                </FormField>
                <FormField label="11. Personal Email ID:" required>
                  <FormInput
                    type="email"
                    value={formData.personalEmailId} placeholder="e.g. john.doe@example.com"
                    onChange={(e) => handleChange("personalEmailId", e.target.value)}
                    required
                    readOnly={isPreFilled} />
                </FormField>
              </div>
            </div>

            {/* 3. POSITION & EMPLOYMENT */}
            <div className="space-y-2">
              <SectionHeader id={3} title="Position & Employment Details" subText="Job Role & Allocation" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <FormField label="12. Designation:" required>
                  {isPreFilled ? (
                    <FormInput value={formData.designation} placeholder="e.g. Software Engineer" readOnly />
                  ) : (
                    <FormSelect
                      options={designationOptions}
                      value={formData.designation}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      required
                      placeholder="Select Designation" />
                  )}
                </FormField>
                <FormField label="13. Department:" required>
                  {isPreFilled ? (
                    <FormInput value={formData.department} placeholder="e.g. Engineering" readOnly />
                  ) : (
                    <FormSelect
                      options={departmentOptions}
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      required
                      placeholder="Select Department" />
                  )}
                </FormField>
                <FormField label="14. Reporting Manager:" required>
                  <FormInput value={formData.reportingManager} placeholder="e.g. Jane Smith" onChange={(e) => handleChange('reportingManager', e.target.value)} required readOnly={isPreFilled} />
                </FormField>
                <FormField label="15. Date of Joining:" required>
                  <FormInput type="date" value={formData.joiningDate} onChange={(e) => handleChange('joiningDate', e.target.value)} required readOnly={isPreFilled} />
                </FormField>
                <FormField label="16. Work Location:" className="md:col-span-1">
                  <FormInput value={formData.workLocation} placeholder="e.g. New York Office" onChange={(e) => handleChange('workLocation', e.target.value)} readOnly={isPreFilled} className={cn("font-normal", isPreFilled && "bg-slate-50")} />
                </FormField>
                <FormField label="17. Employee Code:">
                  <FormInput
                    value={formData.empCode} placeholder="e.g. EMP001"
                    onChange={(e) => handleChange('empCode', e.target.value)} />
                </FormField>

                <FormField label="18. Employee Category:" required className="md:col-span-3">
                  <FormRadioGroup
                    name="category"
                    options={[
                      { value: 'Full-Time', label: 'Full-Time' },
                      { value: 'Part-Time', label: 'Part-Time' },
                      { value: 'Contract', label: 'Contract' },
                      { value: 'Intern', label: 'Intern' }
                    ]}
                    value={formData.employeeCategory}
                    onChange={(val) => handleChange('employeeCategory', val)}
                    className="h-7" />
                </FormField>
              </div>
            </div>

            {/* 4 & 5. ID & BANK */}
            <div className="space-y-3">
              <SectionHeader id={4} title="Identification Details" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField label="18. Aadhaar No:" required>
                  <FormInput value={formData.aadhaarNumber} placeholder="e.g. 1234 5678 9012" onChange={(e) => handleChange('aadhaarNumber', e.target.value)} required />
                </FormField>

                <FormField label="19. PAN Number:" required>
                  <FormInput value={formData.panNumber} placeholder="e.g. ABCDE1234F" onChange={(e) => handleChange('panNumber', e.target.value)} required />
                </FormField>

                <FormField label="20. Driving License:">
                  <FormInput value={formData.drivingLicense} placeholder="e.g. DL-1234567890" onChange={(e) => handleChange('drivingLicense', e.target.value)} />
                </FormField>

                <FormField label="21. Passport No:">
                  <FormInput value={formData.passportNumber} placeholder="e.g. A1234567" onChange={(e) => handleChange('passportNumber', e.target.value)} />
                </FormField>
              </div>
            </div>

            {/* 5. BANK ACCOUNT DETAILS */}
            <div className="space-y-3">
              <SectionHeader id={5} title="Bank Account Details" subText="For Salary Processing" />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <FormField label="22. Account Holder:" required>
                  <FormInput value={formData.accountHolderName} placeholder="e.g. John Doe" onChange={(e) => handleChange('accountHolderName', e.target.value)} required />
                </FormField>

                <FormField label="23. Bank Name:" required>
                  <FormInput value={formData.bankName} placeholder="e.g. State Bank of India" onChange={(e) => handleChange('bankName', e.target.value)} required />
                </FormField>

                <FormField label="24. Branch Name:" required>
                  <FormInput value={formData.branchName} placeholder="e.g. Main Branch" onChange={(e) => handleChange('branchName', e.target.value)} required />
                </FormField>

                <FormField label="25. IFSC Code:" required>
                  <FormInput value={formData.ifscCode} placeholder="e.g. SBIN0001234" onChange={(e) => handleChange('ifscCode', e.target.value)} required />
                </FormField>

                <FormField label="26. Account Number:" required className="md:col-span-1">
                  <FormInput value={formData.accountNumber} placeholder="e.g. 123456789012" onChange={(e) => handleChange('accountNumber', e.target.value)} required />
                </FormField>
              </div>
            </div>

            {/* 6. EMERGENCY CONTACT */}
            <div className="bg-slate-50/30 p-2 border border-slate-100 rounded">
              <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Emergency Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <FormField label="27. Contact Name:" required className="md:col-span-1">
                  <FormInput value={formData.emergencyName} placeholder="e.g. Jane Doe" onChange={(e) => handleChange('emergencyName', e.target.value)} required />
                </FormField>
                <FormField label="28. Relationship:" required>
                  <FormInput value={formData.emergencyRelationship} placeholder="e.g. Spouse / Sibling" onChange={(e) => handleChange('emergencyRelationship', e.target.value)} required />
                </FormField>
                <FormField label="29. Mobile No.:" required>
                  <FormInput type="tel" value={formData.emergencyMobile} placeholder="e.g. 9876543210" onChange={(e) => handleChange('emergencyMobile', e.target.value)} required />
                </FormField>
                <FormField label="30. Alternate No.:">
                  <FormInput type="tel" value={formData.emergencyAlternate} placeholder="e.g. 9876543210" onChange={(e) => handleChange('emergencyAlternate', e.target.value)} />
                </FormField>
                <FormField label="31. Contact's Address:" required className="md:col-span-1">
                  <FormInput value={formData.emergencyAddress} placeholder="e.g. 123 Main St, City, State" onChange={(e) => handleChange('emergencyAddress', e.target.value)} required />
                </FormField>
              </div>
            </div>

            {/* 7. EDUCATION */}
            <div className="space-y-3">
              <SectionHeader id={7} title="Education Details" subText="Academic Credentials" />
              <div className="overflow-hidden rounded-[2px]">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left w-40">Qualification</th>
                      <th className="text-left">Institution / University</th>
                      <th className="text-center w-32">Year</th>
                      <th className="text-center w-32">%/Grade</th>
                      <th className="text-center w-32">Submittals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.education.map((edu, idx) => (
                      <tr key={edu.id || `edu-${idx}`}>
                        <td className="text-[12px] font-bold text-[#0d3c68] bg-slate-50/30">{edu.qualification}</td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="block w-full min-w-full h-8 px-2 text-[12px] focus:outline-none focus:bg-slate-50 bg-transparent border border-transparent hover:border-slate-200 rounded"
                            placeholder="Institution Name"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="block w-full min-w-full h-8 px-2 text-[12px] text-center focus:outline-none focus:bg-slate-50 bg-transparent border border-transparent hover:border-slate-200 rounded"
                            placeholder="YYYY"
                            value={edu.year}
                            onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            className="block w-full min-w-full h-8 px-2 text-[12px] text-center focus:outline-none focus:bg-slate-50 bg-transparent border border-transparent hover:border-slate-200 rounded"
                            placeholder="e.g. 85%"
                            value={edu.percentage}
                            onChange={(e) => handleEducationChange(edu.id, 'percentage', e.target.value)} />
                        </td>
                        <td className="p-1">
                          <select
                            className="block w-full min-w-full h-8 text-[12px] text-center cursor-pointer focus:outline-none bg-transparent border border-transparent hover:border-slate-200 rounded"
                            value={edu.submittals}
                            onChange={(e) => handleEducationChange(edu.id, 'submittals', e.target.value)}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8. PREVIOUS EMPLOYMENT */}
            <div className="bg-slate-50/30 p-2 border border-slate-100 rounded">
              <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                Previous Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <FormField label="32. Last Employer Name:" className="md:col-span-1">
                  <FormInput value={formData.lastEmployerName} placeholder="e.g. Previous Tech Inc." onChange={(e) => handleChange('lastEmployerName', e.target.value)} />
                </FormField>
                <FormField label="33. Last Designation:">
                  <FormInput value={formData.lastDesignation} placeholder="e.g. Junior Developer" onChange={(e) => handleChange('lastDesignation', e.target.value)} />
                </FormField>
                <FormField label="34. Last CTC:">
                  <FormInput value={formData.lastSalary} placeholder="e.g. 50000" onChange={(e) => handleChange('lastSalary', e.target.value)} />
                </FormField>
                <FormField label="35. Date of Joining:">
                  <FormInput type="date" value={formData.lastDoj} onChange={(e) => handleChange('lastDoj', e.target.value)} />
                </FormField>
                <FormField label="36. Date of Leaving:">
                  <FormInput type="date" value={formData.lastDol} onChange={(e) => handleChange('lastDol', e.target.value)} />
                </FormField>
                <FormField label="37. Experience (Years):">
                  <FormInput value={formData.totalExperience} placeholder="e.g. 2 Years 5 Months" onChange={(e) => handleChange('totalExperience', e.target.value)} />
                </FormField>
                <FormField label="38. Reason for Leaving:">
                  <FormInput value={formData.reasonForLeaving} placeholder="e.g. Career Growth" onChange={(e) => handleChange('reasonForLeaving', e.target.value)} />
                </FormField>
              </div>
            </div>

            {/* 9. DOCUMENT STATUS */}
            <div className="space-y-4">
              <SectionHeader id={9} title="Document Submission Status" subText="Mandatory Checklist" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-1">
                {formData.docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded">
                    <label className="flex items-center gap-2 cursor-pointer group flex-1">
                      <span className="text-[12px] font-normal text-slate-700 group-hover:text-[#0d3c68] transition-colors">{doc.id}. {doc.name}</span>
                    </label>
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-4 h-4 border-2 border-[#0d3c68]/30 rounded-[2px] checked:bg-[#0d3c68] checked:border-[#0d3c68] transition-all cursor-pointer"
                        checked={doc.status === 'Yes'}
                        onChange={(e) => handleDocStatusChange(doc.id, e.target.checked ? 'Yes' : 'No')} />
                      <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. OPERATIONAL DETAILS */}
            <div className="space-y-4">
              <SectionHeader id={10} title="Operational Details" subText="Attendance & Logistics" />
              <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2 gap-y-1">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Employee Attendance By</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.attendanceBy}
                    onChange={(e) => handleChange('attendanceBy', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["CrewCam", "BioMetric"].map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Duty Report Location</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.dutyReportLocation}
                    onChange={(e) => handleChange('dutyReportLocation', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["Single", "Multiple"].map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Weekly Off</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.weakOff}
                    onChange={(e) => handleChange('weakOff', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "None"].map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Duty Shift</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.dutyShift}
                    onChange={(e) => handleChange('dutyShift', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["Day", "Night"].map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Employee Crewcam Role</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.crewcamRole}
                    onChange={(e) => handleChange('crewcamRole', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["HOD", "Super Admin", "Admin", "HR", "User"].map((item, index) => (
                      <option value={item.toLowerCase()} key={index}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Employee Duty Timing</label>
                  <select
                    className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                    value={formData.dutyTiming}
                    onChange={(e) => handleChange('dutyTiming', e.target.value)}
                  >
                    <option value="">Select option</option>
                    {["Single", "Multiple"].map((item, index) => (
                      <option value={item} key={index}>{item}</option>
                    ))}
                  </select>
                </div>

                {formData.dutyTiming === 'Single' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Duty In Time</label>
                      <input
                        type="time"
                        className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                        value={formData.dutyInTime}
                        onChange={(e) => handleChange('dutyInTime', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Duty Out Time</label>
                      <input
                        type="time"
                        className="w-full h-8 px-3 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white"
                        value={formData.dutyOutTime}
                        onChange={(e) => handleChange('dutyOutTime', e.target.value)} />
                    </div>
                  </>
                )}


              </div>

              {formData.dutyTiming === 'Multiple' && (
                <div className="mt-2 px-2">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <span className="h-4 w-1 bg-[#0d3c68] rounded-full" />
                        Weekly Duty Schedule
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium italic">* Set timings for all working days</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {formData.multiDaySchedule?.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center gap-2 bg-white p-1 rounded border border-slate-100 shadow-sm transition-all hover:border-slate-200">
                          <div className="w-full md:w-36 bg-slate-50 px-3 py-1 rounded text-[10px] font-bold text-slate-700 flex items-center justify-between border border-slate-200/30">
                            <span className="uppercase tracking-wider">{item.day}</span>
                            <span className="text-red-500 font-bold">*</span>
                          </div>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                            <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-50 focus-within:ring-1 focus-within:ring-[#0d3c68] transition-all">
                              <span className="bg-slate-100/50 px-3 py-1 text-[9px] font-bold text-slate-500 border-r border-slate-200 whitespace-nowrap min-w-[110px] text-center uppercase">Check In Time</span>
                              <input
                                type="time"
                                className="w-full px-2 py-1 text-[11px] font-medium focus:outline-none bg-white"
                                value={item.checkIn}
                                onChange={(e) => {
                                  const newSchedule = [...formData.multiDaySchedule];
                                  newSchedule[idx].checkIn = e.target.value;
                                  handleChange('multiDaySchedule', newSchedule);
                                }} />
                            </div>
                            <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-50 focus-within:ring-1 focus-within:ring-[#0d3c68] transition-all">
                              <span className="bg-slate-100/50 px-3 py-1 text-[9px] font-bold text-slate-500 border-r border-slate-200 whitespace-nowrap min-w-[110px] text-center uppercase">Check Out Time</span>
                              <input
                                type="time"
                                className="w-full px-2 py-1 text-[11px] font-medium focus:outline-none bg-white"
                                value={item.checkOut}
                                onChange={(e) => {
                                  const newSchedule = [...formData.multiDaySchedule];
                                  newSchedule[idx].checkOut = e.target.value;
                                  handleChange('multiDaySchedule', newSchedule);
                                }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pl-6">
                <label className="text-[14px] font-bold text-slate-700 uppercase tracking-tight block pt-4">Employee Image Capture</label>

                <div className="flex flex-col md:flex-row items-start gap-8 bg-blue-50/30 p-4 rounded-lg border border-blue-100/50">
                  <div className="space-y-2">
                    <WebcamCapture
                      initialImage={formData.employeeImage}
                      captureImage={(img) => handleChange('employeeImage', img)}
                      className="mt-1" />
                    <div className="flex items-center gap-2 text-[#0d3c68]">
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Live Viewfinder</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 pt-2">
                    <div className="space-y-1">
                      <h5 className="text-[12px] font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <span className="h-5 w-1 bg-[#0d3c68] rounded-full" />
                        Capture Instructions
                      </h5>
                      <p className="text-[11px] text-slate-500 italic">Please follow these guidelines for a valid audit photo:</p>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon: <User className="h-3 w-3" />, text: "Face centrally in frame" },
                        { icon: <Lightbulb className="h-3 w-3" />, text: "Environment well-lit" },
                        { icon: <Meh className="h-3 w-3" />, text: "Neutral expression" },
                        { icon: <Glasses className="h-3 w-3" />, text: "No hats/sunglasses" },
                        { icon: <Ruler className="h-3 w-3" />, text: "2 feet distance" }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[10px] text-slate-700 bg-white/50 p-1.5 rounded border border-slate-100 shadow-sm hover:bg-white transition-colors">
                          <span className="text-[#0d3c68] shrink-0">{item.icon}</span>
                          <span className="font-medium truncate">{item.text}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-1">
                      <div className="bg-amber-50/50 border border-amber-200/30 p-1.5 rounded flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                        <p className="text-[9px] font-bold text-amber-800 uppercase leading-none">Used for AI Attendance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 11. DECISION MATRIX / DECLARATIONS */}
            <div className="space-y-2 pt-4">
              <SectionHeader id={10} title="Smart Declarations & HR Matrix" />
              <div className="bg-slate-50/50 p-4 rounded border border-slate-100 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase border-l-2 border-[#0d3c68] pl-2">11.1 Employee Undertaking</h4>
                  <p className="text-[12px] text-slate-600 italic leading-relaxed">
                    I hereby declare that all information provided in this form is true, complete, and correct to the best of my knowledge.
                    I understand that any false or misleading information discovered later may lead to immediate termination of my employment contract.
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase border-l-2 border-green-600 pl-2">11.2 HR Verification & Final Approval</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField label="HR Verified By:">
                      <FormInput
                        value={formData.hrVerifiedBy || "Sadhana"}
                        readOnly
                        className="h-8 bg-gray-100" />
                    </FormField>
                    <FormField label="Designation:">
                      <FormSelect
                        options={designationOptions}
                        value={formData.designation}
                        onChange={(e) => handleChange('designation', e.target.value)}
                        required
                        placeholder="Select Designation"
                        className='h-8' />
                    </FormField>
                    {/* <FormField label="Date:">
                                            <FormInput type="date" value={formData.hrDate} onChange={(e) => handleChange('hrDate', e.target.value)} className="h-8" />
                                        </FormField> */}
                    <FormField label="HR Remarks:">
                      <FormInput value={formData.hrRemarks} onChange={(e) => handleChange('hrRemarks', e.target.value)} placeholder="Final HR comments..." className="h-8" />
                    </FormField>
                  </div>

                  {/* FORM FOOTER */}
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-[2px]"
                    >
                      <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                      RESET FORM
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                    >
                      <Save className="h-4 w-4" />
                      SAVE JOINING FORM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                @media print {
                    .section-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                    .bg-[#0d3c68] { background-color: #0d3c68 !important; -webkit-print-color-adjust: exact; }
                    .text-white { color: white !important; }
                    .border-slate-200 { border-color: #e2e8f0 !important; }
                    .bg-slate-50 { background-color: #f8fafc !important; }
                    .btn, .no-print { display: none !important; }
                }
            `}</style>
      </div>
    </div>
  );
}
