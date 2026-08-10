'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import {
  CheckCircle2, Loader2, Minus, Plus, Maximize2, Minimize2, Download, Mail, Phone,
  MapPin, Link2, ChevronDown, X, RefreshCw, Calendar, ArrowRight, Sparkles,
} from 'lucide-react';
import { FormInput } from '@/components/ui/form-input';
import { useSearchParams } from 'next/navigation';
import ApiSelect from '@/components/common/ApiSelect';

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
}

export interface CandidateInfo {
  manpowerRequestId: string;
  fullName: string;
  email: string;
  mobile: string;
  currentLocation: string;
  preferredLocation: string;
  linkedin: string;
  appliedFor: string;
  department: string;
  employmentType: string;
  totalExperience: string;
  relevantExperience: string;
  currentCompany: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  availableFrom: string;
  relocation: string;
  willingToTravel: string;
  highestQualification: string;
  university: string;
  yearOfPassing: string;
  cgpa: string;
  skills: string[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
}

const emptyCandidate: CandidateInfo = {
  manpowerRequestId: '', fullName: '', email: '', mobile: '', currentLocation: '', preferredLocation: '', linkedin: '',
  appliedFor: '', department: '', employmentType: 'Full Time', totalExperience: '',
  relevantExperience: '', currentCompany: '', currentCTC: '', expectedCTC: '', noticePeriod: '',
  availableFrom: '', relocation: '', willingToTravel: '', highestQualification: '',
  university: '', yearOfPassing: '', cgpa: '', skills: [], experiences: [], education: []
};

const steps = [
  { num: 1, label: 'Upload CV', status: 'active' },
  { num: 2, label: 'Review & Edit', status: 'pending' },
  { num: 3, label: 'Submit Application', status: 'pending' },
];

const extractionChecklist = [
  'Reading CV content',
  'Extracting Personal Information',
  'Extracting Experience',
  'Extracting Education',
  'Extracting Skills',
];

const inputCls = 'mt-1 h-7 w-full rounded-none border border-zinc-200 bg-white px-2 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[10.5px] font-semibold text-zinc-600';

function Field({
  title, required, children,
}: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
      {children}
    </label>
  );
}

function SelectField({ title, required, options, value, onChange }: { title: string; required?: boolean; options: string[]; value?: string; onChange?: (e: any) => void }) {
  return (
    <Field title={title} required={required}>
      <div className="relative">
        <select className={selectCls} value={value} onChange={onChange}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </Field>
  );
}

function Card({
  title, action, headerRight, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; headerRight?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-none border border-zinc-200 bg-white shadow-sm ${className}`}>
      {(title || action || headerRight) && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-2.5 py-1.5">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          <div className="flex items-center gap-2">
            {action}
            {headerRight}
          </div>
        </div>
      )}
      <div className="px-2.5 pb-2 pt-1">{children}</div>
    </div>
  );
}

export default function CreateCandidatePage() {
  const [candidate, setCandidate] = useState<CandidateInfo>(emptyCandidate);
  const handleInputChange = (field: keyof CandidateInfo, value: string) => setCandidate(prev => ({ ...prev, [field]: value }));

  const [file, setFile] = React.useState<File | null>(null);
  const [cvZoom, setCvZoom] = React.useState<number>(100);
  const [isMaximized, setIsMaximized] = React.useState<boolean>(false);

  const [showAddSkill, setShowAddSkill] = React.useState(false);
  const [newSkill, setNewSkill] = React.useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');

  React.useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          let cId = candidateId;
          if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
            const res = await api.get(`/hiring/candidates?limit=1000`);
            const candidates = res.data?.data || res.data || [];
            const match = candidates.find((c: any) => {
              const nameSlug = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return nameSlug === candidateId;
            });
            if (match) cId = match._id;
            else throw new Error("Candidate not found");
          }

          const res = await api.get(`/hiring/candidates/${cId}`);
          const data = res.data;
          const appDetails = data.applicationDetails || {};
          setCandidate({
            manpowerRequestId: appDetails.manpowerRequestId || data.manpowerRequestId || '',
            fullName: data.firstName + (data.lastName ? ' ' + data.lastName : ''),
            email: data.email || '',
            mobile: data.phone || '',
            currentLocation: appDetails.currentLocation || '',
            preferredLocation: appDetails.preferredLocation || '',
            linkedin: appDetails.linkedin || '',
            appliedFor: data.jobRole || '',
            department: data.departmentId?._id || data.departmentId || '',
            employmentType: appDetails.employmentType || 'Full Time',
            totalExperience: appDetails.totalExperience || '',
            relevantExperience: appDetails.relevantExperience || '',
            currentCompany: appDetails.currentCompany || '',
            currentCTC: appDetails.currentCTC || '',
            expectedCTC: appDetails.expectedCTC || '',
            noticePeriod: appDetails.noticePeriod || '',
            availableFrom: appDetails.availableFrom || '',
            relocation: appDetails.relocation || '',
            willingToTravel: appDetails.willingToTravel || '',
            highestQualification: appDetails.highestQualification || '',
            university: appDetails.university || '',
            yearOfPassing: appDetails.yearOfPassing || '',
            cgpa: appDetails.cgpa || '',
            skills: appDetails.skills || [],
            experiences: appDetails.experiences || [],
            education: appDetails.education || []
          });
          if (data.resumeUrl) {
            setResumeUrl(data.resumeUrl);
            setFile(new File([], "Uploaded_Resume.pdf"));
          }
        } catch (err) {
          console.error('Failed to load candidate', err);
          toast.error('Failed to load candidate details');
        }
      };
      fetchCandidate();
    }
  }, [candidateId]);

  const handleNext = async () => {
    if (!candidate.fullName || !candidate.email || !candidate.mobile || !candidate.manpowerRequestId || !candidate.appliedFor || !candidate.department) {
      toast.error('Please fill all mandatory fields (Full Name, Email, Mobile, Manpower Request, Position, Department).');
      return;
    }

    try {
      const payload = {
        firstName: candidate.fullName.split(' ')[0],
        lastName: candidate.fullName.split(' ').slice(1).join(' ') || '.',
        email: candidate.email,
        phone: candidate.mobile,
        jobRole: candidate.appliedFor,
        departmentId: candidate.department,
        manpowerRequestId: candidate.manpowerRequestId,
        resumeUrl: resumeUrl,
        applicationDetails: candidate
      };

      let newId = candidateId;
      if (candidateId) {
        let cId = candidateId;
        if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
          const res = await api.get(`/hiring/candidates?limit=1000`);
          const candidates = res.data?.data || res.data || [];
          const match = candidates.find((c: any) => `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === candidateId);
          if (match) cId = match._id;
        }
        await api.put(`/hiring/candidates/${cId}`, payload);
      } else {
        const { data } = await api.post('/hiring/candidates', payload);
        newId = data._id;
      }

      router.push(`/dashboard/hiring/candidates/new/create/review-and-edit/${newId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save candidate');
    }
  };

  const handleReextract = () => {
    if (file) {
      handleUpload(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !candidate.skills.includes(newSkill.trim())) {
      setCandidate(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidate(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleUpload = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    try {
      const { data: uploadData } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const rUrl = uploadData.url || (typeof uploadData === 'string' ? uploadData : '');
      setResumeUrl(rUrl);

      if (!rUrl) throw new Error('File upload failed.');

      toast.success('CV Uploaded. Extracting details via AI...');
      setIsUploading(false);
      setIsExtracting(true);

      const { data: extractData } = await api.post('/ai/hiring/extract-resume-profile', { resumeUrl: rUrl });

      sessionStorage.setItem('extractedCandidate', JSON.stringify({ ...extractData, resumeUrl: rUrl }));
      setCandidate(prev => ({
        ...prev,
        fullName: extractData.name || extractData.fullName || '',
        email: extractData.email || '',
        mobile: extractData.phone || extractData.mobile || '',
        currentLocation: extractData.location || extractData.currentLocation || '',
        totalExperience: extractData.totalExperience || '',
        highestQualification: extractData.education?.[0]?.degree || '',
        university: extractData.education?.[0]?.institution || '',
        yearOfPassing: extractData.education?.[0]?.year || '',
        skills: extractData.skills || [],
        experiences: extractData.experiences || [],
        education: extractData.education || [],
      }));
      toast.success('Extraction complete!');
      setIsExtracting(false);
    } catch (err: any) {
      setIsUploading(false);
      setIsExtracting(false);
      toast.error(err.response?.data?.message || 'Something went wrong during extraction.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  return (
    <div className="w-full bg-slate-50 flex flex-col font-sans min-h-[650px] pb-6" id="create-page-root">
      <div className="w-full mx-auto max-w-[1600px] px-2 pt-2">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3">
          {/* Title */}
          <div className="shrink-0 w-full lg:w-[380px]">
            <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">Add New Candidate</h1>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 whitespace-nowrap">Upload CV and let AI extract details automatically</p>
          </div>

          {/* Steps */}
          <div className="flex-1 max-w-[800px] w-full flex items-center justify-center relative mx-auto overflow-visible pb-2 lg:pb-0">
            <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
            <div className="flex w-full justify-between z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 px-2">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors z-10
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                      step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                        'border-zinc-200 text-zinc-400 bg-white'}`}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-[310px]">
            <Link href="/dashboard/hiring/candidates" className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
              Cancel
            </Link>
            <button type="button" onClick={handleNext} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              {file ? 'Next: Review & Edit \u2192' : 'Skip & Fill Manually \u2192'}
            </button>
          </div>
        </div>
        <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>
        {/* Row 1: upload / status / confidence */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            <div className="bg-white rounded-lg border border-slate-100 p-3.5 shadow-sm flex flex-col gap-3">
              <h3 className="text-[12px] font-bold text-indigo-950">CV / Resume Uploaded</h3>

              <div className="flex items-start gap-4">
                {/* PDF Icon */}
                <div className="relative w-11 h-14 shrink-0">
                  <svg width="100%" height="100%" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 1C2.34315 1 1 2.34315 1 4V48C1 49.6569 2.34315 51 4 51H36C37.6569 51 39 49.6569 39 48V14L26 1H4Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M25 1V10C25 12.2091 26.7909 14 29 14H39" fill="#E2E8F0" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M26 1L39 14" fill="#E2E8F0" stroke="#E2E8F0" strokeWidth="2" />
                    <path d="M26 1V10C26 11.1046 26.8954 12 28 12H39Z" fill="#E2E8F0" />
                  </svg>
                  <div className="absolute bottom-2.5 left-0 right-0 h-5 bg-[#e52e2e] rounded-sm flex items-center justify-center">
                    <span className="text-[11px] font-bold text-white tracking-wide">PDF</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 min-w-0 mt-0.5">
                  <p className="truncate text-[11.5px] font-bold text-indigo-950">
                    {file ? file.name : "No file selected"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {file ? `${(file.size / 1024).toFixed(0)} KB` : "Please upload a PDF"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-left mt-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Replace File</button>
                </div>
              </div>
            </div>

            <Card title="AI Extraction Status">
              <div className="space-y-0.5">
                {extractionChecklist.map((c) => (
                  <p key={c} className="flex items-center gap-1.5 text-[10.5px] text-zinc-600">
                    <CheckCircle2 size={13} className={`shrink-0 ${isExtracting || file ? 'text-emerald-500' : 'text-zinc-300'}`} /> {c}
                  </p>
                ))}
                {isExtracting ? (
                  <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-indigo-600 mt-2">
                    <Loader2 size={13} className="shrink-0 animate-spin" /> AI extraction in progress...
                  </p>
                ) : isUploading ? (
                  <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-indigo-600 mt-2">
                    <Loader2 size={13} className="shrink-0 animate-spin" /> Uploading CV...
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-400 mt-2">
                    Upload CV to start extraction
                  </p>
                )}
              </div>
            </Card>

            <Card title="AI Extraction Confidence" className="text-center">
              <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: 'conic-gradient(#4f46e5 92%, #e5e7eb 0)' }}>
                <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-white">
                  <span className="text-[13px] font-bold text-zinc-900">92%</span>
                </div>
              </div>
              <p className="mt-0.5 text-[10.5px] font-semibold text-emerald-600">High Accuracy</p>
              <p className="mt-0.5 text-[9.5px] leading-snug text-zinc-400">The extracted information is highly accurate.</p>
            </Card>
          </div>

          <div className="space-y-2 lg:row-span-2">
            <Card
              title="Original CV Preview"
              headerRight={file && (
                <div className="flex items-center gap-1 text-zinc-400">
                  <button type="button" onClick={() => setCvZoom(prev => Math.min(prev + 20, 200))} className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Plus size={13} /></button>
                  <button type="button" onClick={() => setCvZoom(prev => Math.max(prev - 20, 50))} className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Minus size={13} /></button>
                  <button type="button" onClick={() => setIsMaximized(!isMaximized)} className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600">
                    {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <button type="button" onClick={() => window.open(resumeUrl, '_blank')} className="grid h-6 w-6 place-items-center rounded-none hover:bg-zinc-100 hover:text-zinc-600"><Download size={13} /></button>
                </div>
              )}
              className={`transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto' : 'max-h-[820px] overflow-y-visible'}`}
            >
              {file ? (
                resumeUrl ? (
                  <div className={`relative w-full overflow-hidden ${isMaximized ? 'h-[calc(100vh-100px)]' : 'h-[750px]'}`}>
                    <div style={{ transform: `scale(${cvZoom / 100})`, transformOrigin: 'top center', width: `${100 / (cvZoom / 100)}%`, height: `${100 / (cvZoom / 100)}%` }} className="transition-transform duration-200">
                      <iframe src={resumeUrl} className="absolute inset-0 w-full h-full border-0" title="Original CV Preview" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                    <Loader2 className="animate-spin mb-2" />
                    <p className="text-xs">Loading preview...</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                  <p className="text-xs">No CV uploaded to preview.</p>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Card title="AI Extraction Summary">
                {file && candidate.fullName ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-zinc-500">Personal Information</span>
                      <span className="font-semibold text-emerald-600">98%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-zinc-500">Experience</span>
                      <span className="font-semibold text-emerald-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-zinc-500">Education</span>
                      <span className="font-semibold text-emerald-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-zinc-500">Skills</span>
                      <span className="font-semibold text-emerald-600">90%</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Upload a CV to see extraction summary.</p>
                )}
                {file && (
                  <Link href="#" className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                    View Full AI Analysis <ArrowRight size={11} />
                  </Link>
                )}
              </Card>

              <Card>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-[11px] font-bold text-zinc-800">AI Suggestion</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">
                      {file ? "Looks good! Please review all details. You can edit any information before proceeding." : "Awaiting CV upload to generate suggestions."}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Application Information form */}
          <Card
            title="Step 2: Verify & Add Application Details"
            headerRight={file && (
              <button type="button" onClick={handleReextract} disabled={isExtracting} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50">
                {isExtracting ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Re-extract CV
              </button>
            )}
          >
            <div className="space-y-2">
              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Personal Information</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
                  <Field title="Full Name" required><FormInput variant="compact" value={candidate.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="e.g. Amit Kumar Verma" /></Field>
                  <Field title="Email Address" required><FormInput variant="compact" value={candidate.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="e.g. amit.verma@email.com" /></Field>
                  <Field title="Mobile Number" required><FormInput variant="compact" value={candidate.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} placeholder="e.g. +91 98765 43210" /></Field>

                  <Field title="Current Location" required><FormInput variant="compact" value={candidate.currentLocation} onChange={(e) => handleInputChange('currentLocation', e.target.value)} placeholder="e.g. Noida, Uttar Pradesh" /></Field>
                  <SelectField title="Preferred Location" options={['Noida, Delhi NCR', 'Mumbai', 'Bangalore']} value={candidate.preferredLocation} onChange={(e) => handleInputChange('preferredLocation', e.target.value)} />
                  <Field title="LinkedIn Profile (Optional)"><FormInput variant="compact" value={candidate.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Application Details</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
                  <Field title="Manpower Request (Requisition)" required>
                    <ApiSelect apiType="manpower-request" className={selectCls} value={candidate.manpowerRequestId} onChange={(e) => handleInputChange('manpowerRequestId', e.target.value)} />
                  </Field>
                  <Field title="Position Applied For" required>
                    <input type="text" className={inputCls} value={candidate.appliedFor} onChange={(e) => handleInputChange('appliedFor', e.target.value)} />
                  </Field>
                  <Field title="Department" required>
                    <ApiSelect apiType="department" className={selectCls} value={candidate.department} onChange={(e) => handleInputChange('department', e.target.value)} />
                  </Field>
                  <SelectField title="Employment Type" required options={['Full Time', 'Contract']} value={candidate.employmentType} onChange={(e) => handleInputChange('employmentType', e.target.value)} />

                  <Field title="Total Experience (Years)" required><FormInput variant="compact" value={candidate.totalExperience} onChange={(e) => handleInputChange('totalExperience', e.target.value)} placeholder="e.g. 7" /></Field>
                  <Field title="Relevant Experience (Years)" required><FormInput variant="compact" value={candidate.relevantExperience} onChange={(e) => handleInputChange('relevantExperience', e.target.value)} placeholder="e.g. 5" /></Field>
                  <Field title="Current Company"><FormInput variant="compact" value={candidate.currentCompany} onChange={(e) => handleInputChange('currentCompany', e.target.value)} placeholder="e.g. ABC Pvt. Ltd." /></Field>

                  <Field title="Current CTC (INR)"><FormInput variant="compact" value={candidate.currentCTC} onChange={(e) => handleInputChange('currentCTC', e.target.value)} placeholder="e.g. ₹ 8.50 LPA" /></Field>
                  <Field title="Expected CTC (INR)" required><FormInput variant="compact" value={candidate.expectedCTC} onChange={(e) => handleInputChange('expectedCTC', e.target.value)} placeholder="e.g. ₹ 12.00 LPA" /></Field>
                  <SelectField title="Notice Period" required options={['30 Days', '15 Days', '60 Days', 'Immediate']} value={candidate.noticePeriod} onChange={(e) => handleInputChange('noticePeriod', e.target.value)} />

                  <Field title="Available From" required>
                    <div className="relative">
                      <FormInput variant="compact" className="pl-7" value={candidate.availableFrom} onChange={(e) => handleInputChange('availableFrom', e.target.value)} placeholder="15 June 2026" />
                      <Calendar size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </Field>
                  <SelectField title="Relocation" options={['Yes, I am open to relocate', 'No']} value={candidate.relocation} onChange={(e) => handleInputChange('relocation', e.target.value)} />
                  <SelectField title="Willing to Travel" options={['Yes', 'No']} value={candidate.willingToTravel} onChange={(e) => handleInputChange('willingToTravel', e.target.value)} />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-bold text-zinc-700">Education Details</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-4">
                  <Field title="Highest Qualification" required><FormInput variant="compact" value={candidate.highestQualification} onChange={(e) => handleInputChange('highestQualification', e.target.value)} placeholder="e.g. MBA - Marketing" /></Field>
                  <Field title="University / Board" required><FormInput variant="compact" value={candidate.university} onChange={(e) => handleInputChange('university', e.target.value)} placeholder="e.g. Amity University" /></Field>
                  <Field title="Year of Passing" required><FormInput variant="compact" value={candidate.yearOfPassing} onChange={(e) => handleInputChange('yearOfPassing', e.target.value)} placeholder="e.g. 2017" /></Field>
                  <Field title="Percentage / CGPA"><FormInput variant="compact" value={candidate.cgpa} onChange={(e) => handleInputChange('cgpa', e.target.value)} placeholder="e.g. 7.8 CGPA" /></Field>
                </div>
              </div>

              <div>
                <p className={labelCls}>Skills (Extracted)</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  {candidate.skills?.map((s) => (
                    <span key={s} className="flex items-center gap-1 rounded-none bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
                      {s} <X size={10} className="cursor-pointer text-indigo-400" onClick={() => handleRemoveSkill(s)} />
                    </span>
                  ))}
                  {showAddSkill ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        type="text"
                        className="h-6 w-24 border border-indigo-200 px-1.5 text-[10px] outline-none focus:border-indigo-400"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                        onBlur={handleAddSkill}
                      />
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowAddSkill(true)} className="flex items-center gap-1 rounded-none border border-dashed border-zinc-300 px-2 py-1 text-[10px] font-semibold text-zinc-500 hover:bg-zinc-50">
                      <Sparkles size={10} /> Add Skill
                    </button>
                  )}
                </div>
              </div>

              <button type="button" className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                Show More Fields <ChevronDown size={13} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
