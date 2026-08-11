"use client";
import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Minus,
  Download,
  Search,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Loader2,
  ArrowRight,
  RefreshCw,
  Check,
  Globe,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  Pen,
} from "lucide-react";

import { FaLinkedin, FaLinkedinIn } from "react-icons/fa";
import { CandidateInfo, PortalView, ExperienceEntry } from '../types';
import ApiSelect from '@/components/common/ApiSelect';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

const emptyCandidate: CandidateInfo = {
  manpowerRequestId: "",
  fullName: "",
  email: "",
  mobile: "",
  currentLocation: "",
  preferredLocation: "",
  linkedin: "",
  appliedFor: "",
  department: "",
  employmentType: "Full Time",
  totalExperience: "",
  relevantExperience: "",
  currentCompany: "",
  currentCTC: "",
  expectedCTC: "",
  noticePeriod: "",
  availableFrom: "",
  relocation: "",
  willingToTravel: "",
  highestQualification: "",
  university: "",
  yearOfPassing: "",
  cgpa: "",
  skills: [],
  experiences: [],
  education: []
};

export default function ReviewPage() {
  const router = useRouter();
  // Local Data State
  const [candidate, setCandidate] = React.useState<CandidateInfo>(emptyCandidate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [experiences, setExperiences] = React.useState<ExperienceEntry[]>([]);
  const [resumeUrl, setResumeUrl] = React.useState('');

  const params = useParams() as { id: string };
  const candidateId = params?.id;

  React.useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          let cId = candidateId;
          // If it's a slug, find the candidate first
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

        if (appDetails.experiences && appDetails.experiences.length > 0) {
          setExperiences(appDetails.experiences);
        }
        if (data.resumeUrl) setResumeUrl(data.resumeUrl);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load candidate details');
      }
    };
    fetchCandidate();
  }
}, [candidateId]);

  const handleSubmitApplication = async () => {
    try {
      let cId = candidateId;
      if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
        const res = await api.get(`/hiring/candidates?limit=1000`);
        const candidates = res.data?.data || res.data || [];
        const match = candidates.find((c: any) => `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === candidateId);
        if (match) cId = match._id;
      }
      
      await api.put(`/hiring/candidates/${cId}`, {
        manpowerRequestId: candidate.manpowerRequestId,
        firstName: candidate.fullName.split(' ')[0] || '',
        lastName: candidate.fullName.split(' ').slice(1).join(' ') || '.',
        email: candidate.email,
        phone: candidate.mobile,
        jobRole: candidate.appliedFor,
        departmentId: candidate.department,
        resumeUrl,
        applicationDetails: {
          ...candidate,
          experiences
        }
      });
      toast.success('Candidate details saved!');
      router.push(`/dashboard/hiring/candidates/new/create/submit-application/${candidateId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update candidate');
    }
  };

  const steps = [
    { num: 1, label: 'Upload CV', status: 'completed' },
    { num: 2, label: 'Review & Edit', status: 'active' },
    { num: 3, label: 'Submit Application', status: 'pending' },
    { num: 4, label: 'AI Screening', status: 'pending' },
    { num: 5, label: 'HOD Review', status: 'pending' },
    { num: 6, label: 'Interview', status: 'pending' },
    { num: 7, label: 'Offer', status: 'pending' },
    { num: 8, label: 'Onboarding', status: 'pending' },
  ];

  // Interactive UI states
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  const [isReextracting, setIsReextracting] = React.useState<boolean>(false);
  const [cvZoom, setCvZoom] = React.useState<number>(100);
  const [isMaximized, setIsMaximized] = React.useState<boolean>(false);

  // Auto-sync checks
  const handleInputChange = (field: keyof CandidateInfo, value: string) => {
    setCandidate((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Experience handlers
  const handleExperienceChange = (expId: string, field: keyof Omit<ExperienceEntry, 'id' | 'bullets'>, value: string) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === expId ? { ...exp, [field]: value } : exp
    ));
    setHasUnsavedChanges(true);
  };

  const handleBulletChange = (expId: string, bulletIndex: number, value: string) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === expId
        ? { ...exp, bullets: exp.bullets.map((b: string, i: number) => i === bulletIndex ? value : b) }
        : exp
    ));
    setHasUnsavedChanges(true);
  };

  const addBullet = (expId: string) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
    ));
    setHasUnsavedChanges(true);
  };

  const removeBullet = (expId: string, bulletIndex: number) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === expId ? { ...exp, bullets: exp.bullets.filter((_: string, i: number) => i !== bulletIndex) } : exp
    ));
    setHasUnsavedChanges(true);
  };

  const addExperience = () => {
    const newExp: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      role: "",
      company: "",
      employmentType: "Full Time",
      startDate: "",
      endDate: "",
      bullets: [""]
    };
    setExperiences(prev => [newExp, ...prev]);
    setHasUnsavedChanges(true);
  };

  const removeExperience = (expId: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== expId));
    setHasUnsavedChanges(true);
  };

  const handleDiscard = () => {
    setCandidate(emptyCandidate);
    setExperiences([]);
    setHasUnsavedChanges(false);
    router.push('/dashboard/hiring/candidates');
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  // Simulated AI Re-extract
  const triggerReextract = () => {
    setIsReextracting(true);
    setTimeout(() => {
      setIsReextracting(false);
      setCandidate((prev: any) => ({
        ...prev,
        fullName: "Amit Kumar Verma",
        currentCTC: "8.50 LPA",
        expectedCTC: "12.00 LPA",
        totalExperience: "7"
      }));
      setHasUnsavedChanges(false);
    }, 1200);
  };

  const handleAcceptSuggestions = () => {
    setCandidate((prev: any) => ({
      ...prev,
      fullName: "Amit Kumar Verma",
      currentCTC: "8.50 LPA",
      expectedCTC: "12.00 LPA",
      totalExperience: "7"
    }));
    setShowSuggestions(false);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="w-full bg-slate-50 flex flex-col font-sans select-none" id="review-page-root">
      <div className="w-full mx-auto max-w-[1600px] px-2 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3">
          <div className="shrink-0 w-full lg:w-auto">
            <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">Review &amp; Edit Candidate</h1>
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500 whitespace-nowrap">Review AI extracted details and edit if required before submitting</p>
          </div>

          {/* Steps */}
          <div className="flex-1 max-w-[800px] w-full flex items-center justify-center relative mx-auto overflow-visible pb-2 lg:pb-0">
            <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0 hidden md:block"></div>
            <div className="flex w-full justify-between z-10 gap-4 md:gap-0">
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1 bg-slate-50 lg:bg-transparent min-w-[60px]">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                      step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                        'border-zinc-200 text-zinc-400 bg-white'}`}>
                    {step.status === 'completed' ? <Check className="w-3 h-3" strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
            <button
              onClick={() => router.push(`/dashboard/hiring/candidates/new/create?id=${candidateId}`)}
              className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors"
            >
              &larr; Back to Edit
            </button>
            <button
              onClick={handleSubmitApplication}
              className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Submit Application &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-zinc-200 w-full shrink-0"></div>
      {/* =========================================================================
          MAIN CONTAINER
          ========================================================================= */}
      <div className="flex-1 lg:h-[87%] overflow-visible lg:overflow-hidden flex flex-col lg:flex-row gap-2 p-2">
        <div
          className="w-full h-auto lg:h-full flex flex-col lg:flex-row gap-2 overflow-visible lg:overflow-hidden"
          id="review-step-container"
        >
          {/* Left Column: Form Section */}
          <div className="w-full lg:w-[68%] h-auto lg:h-full flex flex-col  overflow-visible lg:overflow-hidden shadow-sm" id="candidate-form-card">

            {/* Candidate Overview Header Card */}
            <div className="bg-white rounded-lg mb-4 border-b border-indigo-100 p-2 w-full">
              <div className="flex w-full items-start gap-2">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 border-2 border-indigo-500 overflow-hidden bg-indigo-100 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Amit"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <h2 className="font-display font-bold text-sm text-indigo-950 leading-tight">
                      {candidate.fullName}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-200 whitespace-nowrap">
                      AI Extracted
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-[10px] mt-2">
                    <span className="flex items-center gap-0.5"> {candidate.appliedFor}</span>


                  </div>
                  <div className="flex w-full justify-between gap-2 mt-0.5 text-[10px]">
                    {/* Left Section */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1 text-[10px] ">
                      {/* Email & Mobile */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1 shrink-0">
                          <Phone className="w-3 h-3 text-indigo-700 shrink-0" />
                          <span>{candidate.mobile}</span>
                        </div>
                        <div className="flex items-center gap-1 min-w-0">
                          <Mail className="w-3 h-3 text-indigo-700 shrink-0" />
                          <span className="truncate">{candidate.email}</span>
                        </div>

                      </div>

                      {/* Location & LinkedIn */}
                      <div className="flex flex-col flex-wrap gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-3 h-3 text-indigo-700 shrink-0" />
                          <span className="truncate">{candidate.currentLocation}</span>
                        </div>

                        {candidate.linkedin && (
                          <div className="flex items-center gap-1 min-w-0">
                            <FaLinkedinIn className="w-3 h-3 text-[#0A66C2] shrink-0" />
                            <span className="truncate">{candidate.linkedin}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="self-start flex items-center gap-2 md:gap-6 shrink-0 border-l border-gray-300 p-4 ml-auto">
                      <div className="">
                        <div className="text-[8px] uppercase font-semibold text-indigo-900">
                          Applied For
                        </div>
                        <div
                          className="font-bold text-[9px] truncate"
                          title={candidate.appliedFor}
                        >
                          {candidate.appliedFor}
                        </div>
                      </div>

                      <div className="">
                        <div className="text-[8px] uppercase font-semibold text-indigo-900">
                          Department
                        </div>
                        <div
                          className="font-bold text-[9px] truncate"
                          title={candidate.department}
                        >
                          {candidate.department}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-[8px] uppercase font-semibold text-indigo-900">
                          Employement Type
                        </div>
                        <div className="font-bold text-[9px]">
                          {candidate.employmentType}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-[8px] uppercase font-semibold text-indigo-900">
                          Notice Period
                        </div>
                        <div className="font-bold text-[9px]">
                          {candidate.noticePeriod}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg">

              {/* Re-extract action row (tabs removed, all sections shown stacked below) */}
              <div className="flex items-center justify-end  p-1.5" id="form-action-bar">
                <button
                  onClick={triggerReextract}
                  disabled={isReextracting}
                  className="px-2 py-1 lg:py-0.5 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded flex items-center gap-1 hover:bg-indigo-100 disabled:opacity-50 whitespace-nowrap shrink-0"
                  id="reextract-btn"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isReextracting ? 'animate-spin' : ''}`} />
                  <span>{isReextracting ? 'Extracting...' : 'Re-extract CV'}</span>
                </button>
              </div>

              {/* All Form Sections Stacked (no tabs) */}
              <div className="flex-1 overflow-visible lg:overflow-y-auto p-4 pt-0 space-y-4" id="form-scrollable-area">

                {/* Category 1: Personal Information */}
                <div className="space-y-1.5" id="personal-info-block">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Full Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Email Address <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        value={candidate.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Mobile Number <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Current Location <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.currentLocation}
                        onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Preferred Location</label>
                      <select
                        value={candidate.preferredLocation}
                        onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      >
                        <option value="Noida, Delhi NCR">Noida, Delhi NCR</option>
                        <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                        <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">LinkedIn Profile (Optional)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={candidate.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          className="w-full pl-1.5 pr-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none  truncate"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 2: Application Details */}
                <div className="space-y-1.5" id="application-info-block">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      Application Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-3">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Manpower Request (Requisition) <span className="text-rose-500">*</span></label>
                      <ApiSelect
                        apiType="manpower-request"
                        value={candidate.manpowerRequestId}
                        onChange={(e: any) => handleInputChange('manpowerRequestId', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Position Applied For <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.appliedFor}
                        onChange={(e) => handleInputChange('appliedFor', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Department <span className="text-rose-500">*</span></label>
                      <ApiSelect
                        apiType="department"
                        value={candidate.department}
                        onChange={(e: any) => handleInputChange('department', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none"
                        placeholderText="Select Department"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Employment Type <span className="text-rose-500">*</span></label>
                      <select
                        value={candidate.employmentType}
                        onChange={(e) => handleInputChange('employmentType', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Total Experience (Years) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.totalExperience}
                        onChange={(e) => handleInputChange('totalExperience', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Relevant Experience (Years) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.relevantExperience}
                        onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Current Company</label>
                      <input
                        type="text"
                        value={candidate.currentCompany}
                        onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Current CTC (INR) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          value={candidate.currentCTC}
                          onChange={(e) => handleInputChange('currentCTC', e.target.value)}
                          className="w-full pl-6 pr-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                        />
                        <span className="text-[10px] font-semibold text-indigo-900 absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Expected CTC (INR) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          value={candidate.expectedCTC}
                          onChange={(e) => handleInputChange('expectedCTC', e.target.value)}
                          className="w-full pl-6 pr-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                        />
                        <span className="text-[10px] font-semibold text-indigo-900 absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Notice Period <span className="text-rose-500">*</span></label>
                      <select
                        value={candidate.noticePeriod}
                        onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category 3: Education & Credentials */}
                <div className="space-y-1.5" id="education-info-block">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      Education Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Highest Qualification <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.highestQualification}
                        onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">University / Board <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Year of Passing <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.yearOfPassing}
                        onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Percentage / CGPA <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.cgpa}
                        onChange={(e) => handleInputChange('cgpa', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Education qualification successfully saved!")}
                    className="text-[10px] text-indigo-700 hover:text-indigo-950 font-semibold flex items-center gap-0.5 pt-1 focus:outline-none"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Education Qualification</span>
                  </button>
                </div>

                {/* Category 4: Experience / Timeline (Editable) */}
                <div className="space-y-1.5" id="experience-info-block">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      Experience Timeline
                    </h3>
                    <button
                      onClick={addExperience}
                      className="text-[10px] text-indigo-700 hover:text-indigo-950 font-semibold flex items-center gap-0.5 focus:outline-none whitespace-nowrap"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {experiences.map((exp, expIdx) => (
                      <div key={exp.id} className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-semibold text-indigo-900 uppercase tracking-wide">
                            {expIdx === 0 ? "Current / Most Recent" : `Entry ${expIdx + 1}`}
                          </span>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="p-1 sm:p-0.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Remove this experience"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-semibold text-indigo-950">Role / Designation</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                              className="w-full px-2 h-8 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-semibold text-indigo-950">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                              className="w-full px-2 h-8 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-semibold text-indigo-950">Employment Type</label>
                            <select
                              value={exp.employmentType}
                              onChange={(e) => handleExperienceChange(exp.id, 'employmentType', e.target.value)}
                              className="w-full px-1.5 h-8 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                            >
                              <option value="Full Time">Full Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-semibold text-indigo-950">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                placeholder="e.g. Jun 2021"
                                className="w-full px-2 h-8 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[10px] font-semibold text-indigo-950">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                placeholder="Present"
                                className="w-full px-2 h-8 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          <label className="text-[10px] font-semibold text-indigo-950">Key Responsibilities</label>
                          {exp.bullets.map((bullet: string, bulletIdx: number) => (
                            <div key={bulletIdx} className="flex items-start gap-1">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleBulletChange(exp.id, bulletIdx, e.target.value)}
                                className="flex-1 min-w-0 px-2 h-8 text-[11px] bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                              />
                              <button
                                onClick={() => removeBullet(exp.id, bulletIdx)}
                                disabled={exp.bullets.length === 1}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded disabled:opacity-30 shrink-0"
                                title="Remove bullet"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addBullet(exp.id)}
                            className="text-[10px] text-indigo-700 hover:text-indigo-950 font-semibold flex items-center gap-0.5 pt-0.5"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Bullet Point</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {experiences.length === 0 && (
                      <div className="text-center text-[10px]  py-4 border border-dashed border-slate-300 rounded">
                        No experience entries. Click "Add Experience" to create one.
                      </div>
                    )}
                  </div>
                </div>

                {/* Category 5: Other Information */}
                <div className="space-y-1.5" id="other-info-block">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-700" />
                      Other Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Available From</label>
                      <input
                        type="text"
                        value={candidate.availableFrom}
                        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                        className="w-full px-2 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Willingness to Relocate</label>
                      <select
                        value={candidate.relocation}
                        onChange={(e) => handleInputChange('relocation', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      >
                        <option value="Yes, I am open to relocate">Yes, open to relocate</option>
                        <option value="No">No</option>
                        <option value="Remote only">Remote only</option>
                      </select>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-semibold text-indigo-950">Willing to Travel</label>
                      <select
                        value={candidate.willingToTravel}
                        onChange={(e) => handleInputChange('willingToTravel', e.target.value)}
                        className="w-full px-1.5 h-8 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Occasional">Occasional</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Save & Discard Action Row */}
              <div className="p-2 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center items-stretch justify-between gap-2" id="form-action-footer">

                <div className="flex items-center gap-x-4 gap-y-2 text-xs">
                  <button
                    onClick={handleDiscard}
                    disabled={!hasUnsavedChanges}
                    className="flex-1 sm:flex-none justify-center px-3 h-8 text-xs border border-slate-300  rounded font-medium hover:bg-slate-100 disabled:opacity-50 transition-colors flex items-center"
                  >
                    Discard
                  </button>
                  {/* {hasUnsavedChanges ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Unsaved edits pending
                  </span>
                ) : (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    All changes saved locally
                  </span>
                )} */}
                  <span className="text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    All changes saved locally
                  </span>
                </div>

                <div className="flex items-center gap-1">

                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none justify-center px-3 h-8 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                  >
                    Save Progress
                  </button>

                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Original CV Preview & AI Summary */}
          <div className={`w-full lg:w-[32%] flex flex-col gap-2 overflow-visible lg:overflow-visible transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-50 bg-white shadow-2xl lg:w-auto h-auto' : 'h-auto lg:h-[calc(100vh-2rem)]'}`} id="cv-preview-and-ai-panel">

            {/* 1. Original CV Preview - rendered document (matches uploaded resume look), no live iframe */}
            <div className={`bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm shrink-0 lg:shrink ${isMaximized ? 'flex-1 h-full' : 'h-[800px] lg:flex-[3]'}`} id="cv-pdf-viewer">
              {/* Toolbar */}
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-indigo-950">Original CV Preview</span>
                <div className="flex items-center gap-1 ">
                  <button
                    onClick={() => setCvZoom(z => Math.max(50, z - 20))}
                    className="p-0.5 hover:text-indigo-700"
                    title="Zoom out"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-mono w-8 text-center ">{cvZoom}%</span>
                  <button
                    onClick={() => setCvZoom(z => Math.min(200, z + 20))}
                    className="p-0.5 hover:text-indigo-700"
                    title="Zoom in"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-0.5 hover:text-indigo-700 ml-1"
                    title={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { if (resumeUrl) window.open(resumeUrl, '_blank') }}
                    className="p-0.5 hover:text-indigo-700 ml-1"
                    title="Download PDF"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  {isMaximized && (
                    <button onClick={() => setIsMaximized(false)} className="ml-2 text-rose-500 hover:text-rose-600"><X size={16} /></button>
                  )}
                </div>
              </div>

              {/* Rendered resume content */}
              <div className="flex-1 overflow-hidden relative">
                {resumeUrl ? (
                  <div style={{ transform: `scale(${cvZoom / 100})`, transformOrigin: 'top center', width: `${100 / (cvZoom / 100)}%`, height: `${100 / (cvZoom / 100)}%` }} className="transition-transform duration-200">
                    <iframe src={resumeUrl} className="w-full h-full border-0" title="Original CV Preview" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-xs text-zinc-400 p-4 text-center">
                    <p>No CV uploaded.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-x-4 gap-y-2 flex-col md:flex-row">
              {/* 2. AI Extraction Verification & Summary Checklist */}
              <div className=" bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between shadow-sm overflow-visible lg:overflow-hidden shrink-0" id="accuracy-checklist-card gap-x-4 gap-y-2 flex-1">
                <div className=''>
                  <div className="flex items-center justify-between mb-1.5 pb-0.5 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      AI Extraction Accuracy
                    </h4>
                    {/* <span className="bg-indigo-100 text-indigo-950 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                    Avg: 92%
                  </span> */}
                  </div>

                  <div className="space-y-1 text-xs ">
                    {[
                      { label: "Personal Information", confidence: 95 },
                      { label: "Application Details", confidence: 92 },
                      { label: "Education Details", confidence: 92 },
                      { label: "Experience Details", confidence: 91 },
                      { label: "Skills Check", confidence: 88 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1 rounded gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-medium ">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50 shrink-0" />
                          {item.label}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 font-mono shrink-0">
                          {item.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Smart Suggestion panel */}
              </div>
              <div className="mt-1 bg-indigo-50 p-4 rounded border border-indigo-100 space-y-1 flex-1" id="ai-smart-suggestions ">
                <div className="flex items-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-950 block">AI Suggestion</span>
                    <span className="text-[9px]  leadind-loose block">
                      We found multipe possible matches for your experience
                    </span>
                    <span className="text-[9px] mt-2 leadind-loose block">
                      Please verify the details for accuracy.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuggestions(true)}
                  className="w-full h-8 text-[10px] bg-white text-indigo-700 border border-indigo-200 rounded font-semibold hover:bg-indigo-50 transition-colors mt-4"
                >
                  Review Suggestions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Modal */}
      {
        showSuggestions && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 z-50"
          >
            <div
              className="bg-white rounded-lg border border-slate-200 max-w-md w-full max-h-[90vh] overflow-y-auto p-3.5 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-700 animate-spin" />
                  <h3 className="text-xs font-bold text-indigo-950">AI Extraction Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 hover:bg-slate-100 rounded  text-xs font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-[10.5px]  leading-relaxed">
                <p>
                  Our parsing algorithms detected alternative match coefficients for Amit Kumar Verma:
                </p>

                <div className="space-y-1.5">
                  <div className="p-1.5 bg-emerald-50 rounded border border-emerald-100">
                    <span className="font-semibold text-emerald-950 block">1. Target Location Check (98% Confidence)</span>
                    <span>Matched "Noida, Delhi NCR" with Preferred Location instead of current address. Form matches successfully updated.</span>
                  </div>
                  <div className="p-1.5 bg-indigo-50 rounded border border-indigo-100">
                    <span className="font-semibold text-indigo-950 block">2. CTC Extracted (95% Confidence)</span>
                    <span>Current CTC: ₹ 8.50 LPA, Expected CTC: ₹ 12.00 LPA. Notice period is 30 Days. Matches successfully updated.</span>
                  </div>
                  <div className="p-1.5 bg-indigo-50 rounded border border-indigo-100">
                    <span className="font-semibold text-indigo-950 block">3. Years of Experience (91% Confidence)</span>
                    <span>Extracted 7 Years from ABC Pvt Ltd and XYZ Solutions history. Matches successfully updated.</span>
                  </div>
                </div>

                <p className="text-[9px]  italic">
                  *AI generated details are suggestions based on the uploaded document structure. Verify details before submitting.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-x-4 gap-y-2 pt-1.5 border-t border-slate-100">
                <button
                  onClick={handleAcceptSuggestions}
                  className="px-2.5 h-8 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded animate-pulse"
                >
                  Accept & Update Form
                </button>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="px-2.5 h-8 text-[10px] border border-slate-200  rounded font-medium hover:bg-slate-50"
                >
                  Close Suggestions
                </button>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}