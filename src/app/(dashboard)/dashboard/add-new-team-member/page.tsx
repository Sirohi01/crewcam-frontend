'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
    UserPlus, ArrowLeft, Save, ChevronRight, ChevronDown, UploadCloud,
    Calendar, Plus, ClipboardList, Circle, CheckCircle2, FileText,
    IdCard, GraduationCap, File as FileIcon, Info
} from 'lucide-react';

const checklistItems = [
    { label: 'Personal Information', done: false },
    { label: 'Job Information', done: false },
    { label: 'Compensation Information', done: false },
    { label: 'Access & Permissions', done: false },
    { label: 'Documents', done: false },
];

const documentList = [
    { label: 'Aadhar Card', icon: IdCard, color: 'text-rose-500' },
    { label: 'PAN Card', icon: IdCard, color: 'text-blue-500' },
    { label: 'Resume / CV', icon: FileText, color: 'text-indigo-500' },
    { label: 'Educational Certificates', icon: GraduationCap, color: 'text-emerald-500' },
    { label: 'Other Documents', icon: FileIcon, color: 'text-amber-500' },
];

const departmentOptions = ['Interior Design', 'Design & Build', 'Business Development', 'Administration', 'IT'];
const designationOptions = ['Senior Interior Designer', 'Interior Designer', 'Project Coordinator', 'Site Supervisor', 'HR Executive'];
const reportingToOptions = ['Rahul Nair', 'Amit Verma', 'Neha Joshi', 'Design & Build Head Office'];
const businessUnitOptions = ['Projects', 'Design & Build', 'Interior Solutions', 'Retail Solutions'];
const costCenterOptions = ['CC-DB-INT-01', 'CC-PRJ-01', 'CC-ADM-01'];
const jobGradeOptions = ['Grade A', 'Grade B', 'Grade C', 'Grade D'];
const employmentTypeOptions = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
const probationOptions = ['1 Month', '3 Months', '6 Months', 'None'];
const workLocationOptions = ['Noida - Head Office', 'Bengaluru Branch', 'Mumbai Branch', 'Remote'];
const payStructureOptions = ['Standard', 'Executive', 'Contractual'];
const currencyOptions = ['INR', 'USD', 'EUR'];
const paymentFrequencyOptions = ['Monthly', 'Bi-Weekly', 'Weekly'];
const userRoleOptions = ['Admin', 'Manager', 'Employee', 'HR Executive'];
const systemAccessOptions = ['Full Access', 'Limited Access', 'View Only'];
const genderOptions = ['Male', 'Female', 'Other'];
const maritalStatusOptions = ['Single', 'Married', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function SelectField({
    label, required, value, onChange, options, placeholder,
}: {
    label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-zinc-700">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative" ref={ref}>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full h-10 px-3 flex items-center justify-between border border-zinc-200 rounded-md text-[12.5px] bg-white hover:border-zinc-300 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <span className={value ? 'text-zinc-800' : 'text-zinc-400'}>{value || placeholder}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {open && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-30 max-h-52 overflow-y-auto">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TextField({
    label, required, value, onChange, placeholder, type = 'text',
}: {
    label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-zinc-700">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-10 px-3 border border-zinc-200 rounded-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-zinc-300 transition-colors"
            />
        </div>
    );
}

export default function AddNewTeamMemberPage() {
    const router = useRouter();

    // Personal Information
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [personalEmail, setPersonalEmail] = useState('');
    const [personalMobile, setPersonalMobile] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

    // Job Information
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [reportingTo, setReportingTo] = useState('');
    const [businessUnit, setBusinessUnit] = useState('');
    const [costCenter, setCostCenter] = useState('');
    const [jobGrade, setJobGrade] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [dateOfJoining, setDateOfJoining] = useState('');
    const [probationPeriod, setProbationPeriod] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');
    const [workLocation, setWorkLocation] = useState('');

    // Compensation
    const [payStructure, setPayStructure] = useState('');
    const [ctc, setCtc] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [paymentFrequency, setPaymentFrequency] = useState('');

    // Access & Permissions
    const [userRole, setUserRole] = useState('');
    const [systemAccess, setSystemAccess] = useState('');
    const [hrmsPortal, setHrmsPortal] = useState(true);
    const [selfServicePortal, setSelfServicePortal] = useState(true);
    const [attendanceSystem, setAttendanceSystem] = useState(true);
    const [othersAccess, setOthersAccess] = useState(false);
    const [othersAccessNote, setOthersAccessNote] = useState('');

    // Documents
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});

    const employeeId = 'Auto-generated';

    const handleSaveNext = () => {
        if (!firstName || !lastName || !dob || !gender || !personalEmail || !personalMobile) {
            toast.error('Please fill all required Personal Information fields');
            return;
        }
        toast.success('Team member details saved. Proceeding to next step...');
    };

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 mb-0.5">
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Workforce</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/dashboard/team-members" className="hover:text-indigo-600 transition-colors">Team Members</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 font-semibold">Add New Team Member</span>
            </div>

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 leading-tight">Add New Team Member</h1>
                        <p className="text-[12px] text-zinc-500">Add a new employee to your organization.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard/team-members')}
                        className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Team Members
                    </button>
                    <button
                        onClick={handleSaveNext}
                        className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Save className="w-3.5 h-3.5" /> Save & Next
                    </button>
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 items-start">

                {/* LEFT: FORM */}
                <div className="xl:col-span-3 flex flex-col gap-2">

                    {/* 1. PERSONAL INFORMATION */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">1. Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Profile Photo */}
                            <div className="flex flex-col gap-1 md:row-span-2">
                                <label className="text-[12px] font-semibold text-zinc-700">Profile Photo</label>
                                <label className="flex-1 min-h-[130px] border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        className="hidden"
                                        onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                                    />
                                    <UploadCloud className="w-6 h-6 text-indigo-500" />
                                    <span className="text-[11.5px] font-semibold text-indigo-600">{profilePhoto ? profilePhoto.name : 'Upload Photo'}</span>
                                    <span className="text-[10px] text-zinc-400">JPG, PNG (Max 2MB)</span>
                                </label>
                            </div>

                            <TextField label="First Name" required value={firstName} onChange={setFirstName} placeholder="Enter first name" />
                            <TextField label="Middle Name" value={middleName} onChange={setMiddleName} placeholder="Enter middle name" />
                            <TextField label="Last Name" required value={lastName} onChange={setLastName} placeholder="Enter last name" />

                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Date of Birth <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        placeholder="DD MMM YYYY"
                                        className="w-full h-10 pl-3 pr-9 border border-zinc-200 rounded-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <SelectField label="Gender" required value={gender} onChange={setGender} options={genderOptions} placeholder="Select Gender" />
                            <SelectField label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={maritalStatusOptions} placeholder="Select Status" />

                            <TextField label="Personal Email" required value={personalEmail} onChange={setPersonalEmail} placeholder="Enter personal email" type="email" />

                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Personal Mobile <span className="text-rose-500">*</span></label>
                                <div className="flex">
                                    <div className="flex items-center gap-1 h-10 px-2.5 border border-r-0 border-zinc-200 rounded-l-md bg-zinc-50 text-[12.5px] font-medium text-zinc-600 shrink-0">
                                        🇮🇳 +91
                                    </div>
                                    <input
                                        type="tel"
                                        value={personalMobile}
                                        onChange={(e) => setPersonalMobile(e.target.value)}
                                        placeholder="Enter mobile number"
                                        className="w-full h-10 px-3 border border-zinc-200 rounded-r-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <SelectField label="Blood Group" value={bloodGroup} onChange={setBloodGroup} options={bloodGroupOptions} placeholder="Select Blood Group" />
                        </div>
                    </div>

                    {/* 2. JOB INFORMATION */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">2. Job Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <SelectField label="Department" required value={department} onChange={setDepartment} options={departmentOptions} placeholder="Select Department" />
                            <SelectField label="Designation" required value={designation} onChange={setDesignation} options={designationOptions} placeholder="Select Designation" />

                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Employee ID <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={employeeId}
                                    disabled
                                    className="w-full h-10 px-3 border border-zinc-200 rounded-md text-[12.5px] bg-zinc-50 text-zinc-400 cursor-not-allowed"
                                />
                            </div>

                            <SelectField label="Reporting To" required value={reportingTo} onChange={setReportingTo} options={reportingToOptions} placeholder="Select Reporting Manager" />
                            <SelectField label="Business Unit" value={businessUnit} onChange={setBusinessUnit} options={businessUnitOptions} placeholder="Select Business Unit" />
                            <SelectField label="Cost Center" value={costCenter} onChange={setCostCenter} options={costCenterOptions} placeholder="Select Cost Center" />
                            <SelectField label="Job Grade" value={jobGrade} onChange={setJobGrade} options={jobGradeOptions} placeholder="Select Job Grade" />
                            <SelectField label="Employment Type" required value={employmentType} onChange={setEmploymentType} options={employmentTypeOptions} placeholder="Select Employment Type" />

                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">Date of Joining <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dateOfJoining}
                                        onChange={(e) => setDateOfJoining(e.target.value)}
                                        placeholder="DD MMM YYYY"
                                        className="w-full h-10 pl-3 pr-9 border border-zinc-200 rounded-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <SelectField label="Probation Period (Months)" value={probationPeriod} onChange={setProbationPeriod} options={probationOptions} placeholder="Select Probation Period" />
                            <TextField label="Notice Period (Days)" value={noticePeriod} onChange={setNoticePeriod} placeholder="Enter notice period" type="number" />
                            <SelectField label="Work Location" required value={workLocation} onChange={setWorkLocation} options={workLocationOptions} placeholder="Select Work Location" />
                        </div>
                    </div>

                    {/* 3. COMPENSATION INFORMATION */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">3. Compensation Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <SelectField label="Pay Structure" required value={payStructure} onChange={setPayStructure} options={payStructureOptions} placeholder="Select Pay Structure" />

                            <div className="flex flex-col gap-1">
                                <label className="text-[12px] font-semibold text-zinc-700">CTC (Annual) <span className="text-rose-500">*</span></label>
                                <div className="flex">
                                    <div className="flex items-center h-10 px-2.5 border border-r-0 border-zinc-200 rounded-l-md bg-zinc-50 text-[12.5px] font-medium text-zinc-600 shrink-0">
                                        ₹
                                    </div>
                                    <input
                                        type="text"
                                        value={ctc}
                                        onChange={(e) => setCtc(e.target.value)}
                                        placeholder="Enter annual CTC"
                                        className="w-full h-10 px-3 border border-zinc-200 rounded-r-md text-[12.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <SelectField label="Currency" required value={currency} onChange={setCurrency} options={currencyOptions} placeholder="Select Currency" />
                            <SelectField label="Payment Frequency" required value={paymentFrequency} onChange={setPaymentFrequency} options={paymentFrequencyOptions} placeholder="Select Frequency" />
                        </div>
                        <button className="flex items-center gap-1.5 mt-3 text-[12px] font-semibold text-indigo-600 hover:underline">
                            <Plus className="w-3.5 h-3.5" /> Add Salary Details
                        </button>
                    </div>

                    {/* 4. ACCESS & PERMISSIONS */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13.5px] font-bold text-zinc-800 mb-3">4. Access & Permissions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <SelectField label="User Role" required value={userRole} onChange={setUserRole} options={userRoleOptions} placeholder="Select User Role" />
                            <SelectField label="System Access" required value={systemAccess} onChange={setSystemAccess} options={systemAccessOptions} placeholder="Select Access Level" />
                        </div>

                        <label className="text-[12px] font-semibold text-zinc-700 block mb-2">Provide Access To</label>
                        <div className="flex flex-wrap items-center gap-5">
                            <label className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-700 cursor-pointer">
                                <input type="checkbox" checked={hrmsPortal} onChange={(e) => setHrmsPortal(e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                HRMS Portal
                            </label>
                            <label className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-700 cursor-pointer">
                                <input type="checkbox" checked={selfServicePortal} onChange={(e) => setSelfServicePortal(e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                Self Service Portal
                            </label>
                            <label className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-700 cursor-pointer">
                                <input type="checkbox" checked={attendanceSystem} onChange={(e) => setAttendanceSystem(e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                Attendance System
                            </label>
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-2 text-[12.5px] font-medium text-zinc-700 cursor-pointer shrink-0">
                                    <input type="checkbox" checked={othersAccess} onChange={(e) => setOthersAccess(e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                    Others
                                </label>
                                <input
                                    type="text"
                                    disabled={!othersAccess}
                                    value={othersAccessNote}
                                    onChange={(e) => setOthersAccessNote(e.target.value)}
                                    placeholder="Specify system access"
                                    className="h-8 px-2.5 border border-zinc-200 rounded-md text-[11.5px] bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-zinc-50 disabled:cursor-not-allowed w-40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM ACTION BAR */}
                    <div className="flex items-center justify-between bg-white border border-zinc-200 shadow-sm rounded-xl p-3">
                        <button
                            onClick={() => router.push('/dashboard/team-members')}
                            className="h-9 px-4 border border-zinc-200 rounded-md text-[12.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveNext}
                            className="flex items-center gap-1.5 h-9 px-4 bg-indigo-600 text-white rounded-md text-[12.5px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Save className="w-3.5 h-3.5" /> Save & Next
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-1 flex flex-col gap-2">

                    {/* Checklist */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-3 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-indigo-500" /> Checklist
                        </h2>
                        <div className="flex flex-col gap-2.5">
                            {checklistItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                    {item.done ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-zinc-300 shrink-0" />
                                    )}
                                    <span className="text-[12px] font-medium text-zinc-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" /> Documents
                        </h2>
                        <p className="text-[11px] text-zinc-500 mb-3">Upload employee documents</p>

                        <label className="block border-2 border-dashed border-zinc-200 rounded-lg p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors mb-3">
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        toast.success(`${e.target.files.length} file(s) selected`);
                                    }
                                }}
                            />
                            <UploadCloud className="w-5 h-5 text-indigo-500" />
                            <span className="text-[11.5px] font-semibold text-indigo-600 text-center">Drag & drop files here</span>
                            <span className="text-[10.5px] text-zinc-400">or click to browse</span>
                            <span className="text-[10px] text-zinc-400 text-center">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</span>
                        </label>

                        <div className="flex flex-col gap-2.5">
                            {documentList.map((doc, idx) => {
                                const DocIcon = doc.icon;
                                const isUploaded = uploadedDocs[doc.label];
                                return (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DocIcon className={`w-4 h-4 ${doc.color} shrink-0`} />
                                            <span className="text-[11.5px] font-medium text-zinc-700">{doc.label}</span>
                                        </div>
                                        <span className={`text-[10.5px] font-semibold ${isUploaded ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                            {isUploaded ? 'Uploaded' : 'Not uploaded'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[13px] font-bold text-zinc-800 mb-2">Quick Info</h2>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex gap-2.5">
                            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-emerald-700 font-medium leading-relaxed">
                                Once saved, login credentials will be sent to the employee's official email / mobile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
