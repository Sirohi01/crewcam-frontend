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
  Download,
  Search,
  Sparkles,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  RefreshCw,
  Check,
  Globe,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

import { FaLinkedin, FaLinkedinIn } from "react-icons/fa";
import { CandidateInfo, PortalView } from './types';

const defaultCandidate: CandidateInfo = {
  fullName: "Amit Kumar Verma",
  email: "amit.verma@email.com",
  mobile: "+91 98765 43210",
  currentLocation: "Noida, Uttar Pradesh",
  preferredLocation: "Noida, Delhi NCR",
  linkedin: "https://linkedin.com/in/amitverma",
  appliedFor: "Sales Manager",
  department: "Sales & Marketing",
  employmentType: "Full Time",
  totalExperience: "7",
  relevantExperience: "7",
  currentCompany: "ABC Pvt. Ltd.",
  currentCTC: "8.50 LPA",
  expectedCTC: "12.00 LPA",
  noticePeriod: "30 Days",
  availableFrom: "15 June 2026",
  relocation: "Yes, I am open to relocate",
  willingToTravel: "Yes",
  highestQualification: "MBA - Marketing",
  university: "Amity University, Noida",
  yearOfPassing: "2017",
  cgpa: "7.8 CGPA"
};

interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

const defaultExperiences: ExperienceEntry[] = [
  {
    id: "exp-1",
    role: "Sales Manager",
    company: "ABC Pvt. Ltd.",
    employmentType: "Full Time",
    startDate: "Jun 2021",
    endDate: "Present",
    bullets: [
      "Leading a team of 10 sales executives and managing key enterprise accounts.",
      "Achieved 125% of annual sales target for 2 consecutive years.",
      "Developed strategic sales plans and increased market share by 16%."
    ]
  },
  {
    id: "exp-2",
    role: "Senior Sales Executive",
    company: "XYZ Solutions Pvt. Ltd.",
    employmentType: "Full Time",
    startDate: "May 2019",
    endDate: "May 2021",
    bullets: [
      "Managed client acquisition and retention across Delhi NCR.",
      "Consistently met and exceeded quarterly sales targets."
    ]
  }
];

interface ReviewPageProps {
  setCurrentView: (view: PortalView) => void;
}

export default function ReviewPage({
  setCurrentView
}: ReviewPageProps) {
  // Local Data State
  const [candidate, setCandidate] = React.useState<CandidateInfo>(defaultCandidate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [experiences, setExperiences] = React.useState<ExperienceEntry[]>(defaultExperiences);

  // Interactive UI states
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  const [isReextracting, setIsReextracting] = React.useState<boolean>(false);

  // Auto-sync checks
  const handleInputChange = (field: keyof CandidateInfo, value: string) => {
    setCandidate(prev => ({
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
        ? { ...exp, bullets: exp.bullets.map((b, i) => i === bulletIndex ? value : b) }
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
      exp.id === expId ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) } : exp
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
    setCandidate(defaultCandidate);
    setExperiences(defaultExperiences);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
  };

  // Simulated AI Re-extract
  const triggerReextract = () => {
    setIsReextracting(true);
    setTimeout(() => {
      setIsReextracting(false);
      setCandidate(prev => ({
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
    setCandidate(prev => ({
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
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-slate-50 font-sans  select-none" id="review-page-root">
      <section className="min-h-[70px] lg:h-[6%] lg:min-h-[38px] bg-white border-b border-slate-100 px-3 py-2 lg:py-1 flex flex-col lg:flex-row lg:items-center items-start justify-between gap-2 shrink-0">
        <div className="flex flex-col">
          <span className="text-xs font-bold ">Review & Edit Candidate</span>
          <span className="text-[10px] font-medium">Verify extracted AI fields & match stats</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
          <div className="flex flex-col items-center gap-1 text-xs shrink-0">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px] border border-emerald-300">✓</span>
            <span className="font-medium whitespace-nowrap">Upload CV</span>
          </div>
          <div className="w-6 h-[1px] bg-slate-300 shrink-0 self-start mt-2"></div>
          <div className="flex flex-col items-center gap-1 text-xs shrink-0">
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">2</span>
            <span className="text-indigo-900 font-bold whitespace-nowrap">Review & Edit</span>
          </div>
          <div className="w-6 h-[1px] bg-slate-200 shrink-0 self-start mt-2"></div>
          <div className="flex flex-col items-center gap-1 text-xs shrink-0">
            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[9px] border border-slate-300">3</span>
            <span className="font-medium whitespace-nowrap">Submit Application</span>
          </div>
        </div>

        <div className="flex items-center gap-1 w-full lg:w-auto">
          <button
            onClick={handleDiscard}
            className="flex-1 lg:flex-none justify-center px-2 py-1.5 lg:py-0.5 text-xs border border-slate-300  rounded hover:bg-slate-50 font-medium flex items-center"
          >
            Reset
          </button>
          <button
            // onClick={() => setCurrentView('submitted')}
            onClick={() => window.open('/dashboard/hiring/candidates/new/create/submit-application-preview')}

            className="flex-1 lg:flex-none justify-center px-2 py-1.5 lg:py-0.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 font-medium transition-colors"
          >
            <span>Submit Form</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          MAIN CONTAINER
          ========================================================================= */}
      <div className="flex-1 lg:h-[87%] overflow-visible lg:overflow-hidden flex flex-col lg:flex-row bg-slate-50 gap-2 p-2">
        <div
          className="w-full h-auto lg:h-full flex flex-col lg:flex-row gap-2 overflow-visible lg:overflow-hidden"
          id="review-step-container"
        >
          {/* Left Column: Form Section */}
          <div className="w-full lg:w-[68%] h-auto lg:h-full flex flex-col bg-white rounded-lg border border-slate-200 overflow-visible lg:overflow-hidden shadow-sm" id="candidate-form-card">

            {/* Candidate Overview Header Card */}
            <div className="bg-indigo-50/60 p-2 border-b border-indigo-100 flex flex-col sm:flex-row  items-start justify-between gap-2" id="form-header-summary">
              <div className="flex items-center gap-2 min-w-0">
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
                <div className="min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <h2 className="font-display font-bold text-sm text-indigo-950 leading-tight">
                      {candidate.fullName}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200 whitespace-nowrap">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                      AI Extracted
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-[10px] ">
                    <span className="flex items-center gap-0.5"> {candidate.appliedFor}</span>


                  </div>
                  <div className="flex flex-col gap-x-2 gap-y-0.5 mt-0.5 text-[10px] ">
                    <div className="flex flex-col gap-x-3 gap-y-1 text-[10px] text-slate-700 gap-1">

                      <div className='flex gap-1'>

                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-indigo-700 shrink-0" />
                          {candidate.email}
                        </span>

                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-indigo-700 shrink-0" />
                          {candidate.mobile}
                        </span>
                      </div>

                      <div>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-700 shrink-0" />
                        {candidate.currentLocation}
                      </span>
                      {candidate.linkedin && (
                        <span className="flex items-center gap-1">
                          <FaLinkedinIn className="w-3 h-3 text-[#0A66C2] shrink-0" />
                          {candidate.linkedin}
                        </span>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-1 text-[10px] shrink-0">
                <div className="p-1 rounded border border-slate-200 min-w-[60px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Applied For</div>
                  <div className="font-bold  truncate text-[9px]">{candidate.appliedFor}</div>
                </div>
                <div className="p-1 rounded border border-slate-200 min-w-[65px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Department</div>
                  <div className="font-bold  truncate text-[9px]">{candidate.department}</div>
                </div>
                <div className="p-1 rounded border border-slate-200 min-w-[55px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Notice Period</div>
                  <div className="font-bold  text-[9px]">{candidate.noticePeriod}</div>
                </div>
              </div>
            </div>

            {/* Re-extract action row (tabs removed, all sections shown stacked below) */}
            <div className="flex items-center justify-end border-b border-slate-100 bg-slate-50/50 p-1.5" id="form-action-bar">
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
            <div className="flex-1 overflow-visible lg:overflow-y-auto p-2 space-y-4" id="form-scrollable-area">

              {/* Category 1: Personal Information */}
              <div className="space-y-1.5" id="personal-info-block">
                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-700" />
                    Personal Information
                  </h3>
                  <span className="text-[9px]  font-mono hidden sm:inline">Fields extracted by AI</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      value={candidate.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Mobile Number <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Current Location <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.currentLocation}
                      onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Preferred Location</label>
                    <select
                      value={candidate.preferredLocation}
                      onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    >
                      <option value="Noida, Delhi NCR">Noida, Delhi NCR</option>
                      <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                      <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">LinkedIn Profile (Optional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={candidate.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none  truncate"
                      />
                      <FaLinkedin className="w-3.5 h-3.5 text-indigo-700 absolute left-1.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 2: Application Details */}
              <div className="space-y-1.5" id="application-info-block">
                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                    Application Details
                  </h3>
                  <span className="text-[9px]  font-mono hidden sm:inline">Job & role parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Position Applied For <span className="text-rose-500">*</span></label>
                    <select
                      value={candidate.appliedFor}
                      onChange={(e) => handleInputChange('appliedFor', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    >
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Senior Sales Executive">Senior Sales Executive</option>
                      <option value="Marketing Director">Marketing Director</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Department <span className="text-rose-500">*</span></label>
                    <select
                      value={candidate.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    >
                      <option value="Sales & Marketing">Sales & Marketing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product Development">Product Development</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Employment Type <span className="text-rose-500">*</span></label>
                    <select
                      value={candidate.employmentType}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Total Experience (Years) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.totalExperience}
                      onChange={(e) => handleInputChange('totalExperience', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Relevant Experience (Years) <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.relevantExperience}
                      onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Current Company</label>
                    <input
                      type="text"
                      value={candidate.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Current CTC (INR) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={candidate.currentCTC}
                        onChange={(e) => handleInputChange('currentCTC', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                      <span className="text-[10px] font-bold text-indigo-900 absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Expected CTC (INR) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={candidate.expectedCTC}
                        onChange={(e) => handleInputChange('expectedCTC', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                      />
                      <span className="text-[10px] font-bold text-indigo-900 absolute left-2 top-1/2 -translate-y-1/2">₹</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Notice Period <span className="text-rose-500">*</span></label>
                    <select
                      value={candidate.noticePeriod}
                      onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
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
                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
                    Education Details
                  </h3>
                  <span className="text-[9px]  font-mono hidden sm:inline">Academic achievements</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Highest Qualification <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.highestQualification}
                      onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">University / Board <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Year of Passing <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.yearOfPassing}
                      onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Percentage / CGPA <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={candidate.cgpa}
                      onChange={(e) => handleInputChange('cgpa', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert("Education qualification successfully saved!")}
                  className="text-[10px] text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-0.5 pt-1 focus:outline-none"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Another Education Qualification</span>
                </button>
              </div>

              {/* Category 4: Experience / Timeline (Editable) */}
              <div className="space-y-1.5" id="experience-info-block">
                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5 gap-2">
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                    Experience Timeline
                  </h3>
                  <button
                    onClick={addExperience}
                    className="text-[10px] text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-0.5 focus:outline-none whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {experiences.map((exp, expIdx) => (
                    <div key={exp.id} className="bg-slate-50 p-2 rounded border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-indigo-900 uppercase tracking-wide">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-indigo-950">Role / Designation</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                            className="w-full px-2 py-1.5 sm:py-1 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-indigo-950">Company Name</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                            className="w-full px-2 py-1.5 sm:py-1 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-indigo-950">Employment Type</label>
                          <select
                            value={exp.employmentType}
                            onChange={(e) => handleExperienceChange(exp.id, 'employmentType', e.target.value)}
                            className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                          >
                            <option value="Full Time">Full Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-bold text-indigo-950">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                              placeholder="e.g. Jun 2021"
                              className="w-full px-2 py-1.5 sm:py-1 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                            />
                          </div>
                          <div className="space-y-0.5">
                            <label className="text-[10px] font-bold text-indigo-950">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate}
                              onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                              placeholder="Present"
                              className="w-full px-2 py-1.5 sm:py-1 text-xs bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pt-0.5">
                        <label className="text-[10px] font-bold text-indigo-950">Key Responsibilities</label>
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex items-start gap-1">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => handleBulletChange(exp.id, bulletIdx, e.target.value)}
                              className="flex-1 min-w-0 px-2 py-1.5 sm:py-1 text-[11px] bg-white border border-slate-200 rounded focus:border-indigo-500 focus:outline-none "
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
                          className="text-[10px] text-indigo-700 hover:text-indigo-950 font-bold flex items-center gap-0.5 pt-0.5"
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
                <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                  <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-700" />
                    Other Information
                  </h3>
                  <span className="text-[9px]  font-mono hidden sm:inline">Preferences</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Available From</label>
                    <input
                      type="text"
                      value={candidate.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      className="w-full px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Willingness to Relocate</label>
                    <select
                      value={candidate.relocation}
                      onChange={(e) => handleInputChange('relocation', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
                    >
                      <option value="Yes, I am open to relocate">Yes, open to relocate</option>
                      <option value="No">No</option>
                      <option value="Remote only">Remote only</option>
                    </select>
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-indigo-950">Willing to Travel</label>
                    <select
                      value={candidate.willingToTravel}
                      onChange={(e) => handleInputChange('willingToTravel', e.target.value)}
                      className="w-full px-1.5 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none "
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
              <div className="flex items-center gap-1.5 text-xs">
                {hasUnsavedChanges ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Unsaved edits pending
                  </span>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    All changes saved locally
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleDiscard}
                  disabled={!hasUnsavedChanges}
                  className="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:py-1 text-xs border border-slate-300  rounded font-medium hover:bg-slate-100 disabled:opacity-50 transition-colors flex items-center"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:py-1 text-xs bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                >
                  Save Progress
                </button>
                <button
                  onClick={() => setCurrentView('submitted')}
                  className="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:py-1 text-xs bg-indigo-850 hover:bg-indigo-900 text-white rounded font-bold flex items-center gap-1 shadow-xs transition-all whitespace-nowrap"
                >
                  <span>Submit Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Original CV Preview & AI Summary */}
          <div className="w-full lg:w-[32%] h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-hidden" id="cv-preview-and-ai-panel">

            {/* 1. Original CV Preview Window - Google Drive Embed */}
            <div className="h-[360px] sm:h-[420px] lg:h-auto lg:flex-[3] bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm shrink-0 lg:shrink" id="cv-pdf-viewer">
              {/* Toolbar */}
              <div className="bg-slate-900 px-2 py-1.5 border-b border-[#1e2021] flex items-center justify-between gap-1 shrink-0 text-white">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileText className="w-3.5 h-3.5  shrink-0" />
                  <span className="text-[10px] font-bold tracking-tight select-none truncate">Original_CV.pdf</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://drive.google.com/file/d/1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-1 hover:bg-slate-800 rounded  hover:text-white flex items-center gap-1 text-[9px]"
                    title="Open in Google Drive"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                  <a
                    href="https://drive.google.com/uc?export=download&id=1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 sm:p-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-[9px] font-bold flex items-center gap-0.5"
                    title="Download PDF"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline text-[8px]">Download</span>
                  </a>
                </div>
              </div>

              {/* Drive iframe */}
              <div className="flex-1 overflow-hidden bg-[#525659]">
                <iframe
                  src="https://drive.google.com/file/d/1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN/preview"
                  className="w-full h-full border-0"
                  allow="autoplay"
                  title="Original_CV.pdf"
                />
              </div>
            </div>

            {/* 2. AI Extraction Verification & Summary Checklist */}
            <div className="lg:flex-[2] bg-white rounded-lg border border-slate-200 p-2 flex flex-col justify-between shadow-sm overflow-visible lg:overflow-hidden shrink-0" id="accuracy-checklist-card">
              <div>
                <div className="flex items-center justify-between mb-1.5 pb-0.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                    AI Extraction Accuracy
                  </h4>
                  <span className="bg-indigo-100 text-indigo-950 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                    Avg: 92%
                  </span>
                </div>

                <div className="space-y-1 text-xs ">
                  {[
                    { label: "Personal Information", confidence: 95 },
                    { label: "Application Details", confidence: 92 },
                    { label: "Education Details", confidence: 92 },
                    { label: "Experience Details", confidence: 91 },
                    { label: "Skills Check", confidence: 88 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-1 rounded border border-slate-100 gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-medium ">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50 shrink-0" />
                        {item.label}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 font-mono shrink-0">
                        {item.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Smart Suggestion panel */}
              <div className="mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100 space-y-1" id="ai-smart-suggestions">
                <div className="flex items-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-indigo-950 block">AI Recommendation Match</span>
                    <span className="text-[9px]  leading-normal block">
                      Amit's profile matches 87% of the Sales Manager role requirements. Click to view suggestions.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuggestions(true)}
                  className="w-full py-1.5 sm:py-1 text-[10px] bg-white text-indigo-700 border border-indigo-200 rounded font-bold hover:bg-indigo-50 transition-colors"
                >
                  Review AI Suggestions
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Suggestions Modal */}
      {showSuggestions && (
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
                className="p-1 hover:bg-slate-100 rounded  text-xs font-bold"
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
                  <span className="font-bold text-emerald-950 block">1. Target Location Check (98% Confidence)</span>
                  <span>Matched "Noida, Delhi NCR" with Preferred Location instead of current address. Form matches successfully updated.</span>
                </div>
                <div className="p-1.5 bg-indigo-50 rounded border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">2. CTC Extracted (95% Confidence)</span>
                  <span>Current CTC: ₹ 8.50 LPA, Expected CTC: ₹ 12.00 LPA. Notice period is 30 Days. Matches successfully updated.</span>
                </div>
                <div className="p-1.5 bg-indigo-50 rounded border border-indigo-100">
                  <span className="font-bold text-indigo-950 block">3. Years of Experience (91% Confidence)</span>
                  <span>Extracted 7 Years from ABC Pvt Ltd and XYZ Solutions history. Matches successfully updated.</span>
                </div>
              </div>

              <p className="text-[9px]  italic">
                *AI generated details are suggestions based on the uploaded document structure. Verify details before submitting.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-1.5 pt-1.5 border-t border-slate-100">
              <button
                onClick={handleAcceptSuggestions}
                className="px-2.5 py-1.5 sm:py-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded animate-pulse"
              >
                Accept & Update Form
              </button>
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-2.5 py-1.5 sm:py-1 text-[10px] border border-slate-200  rounded font-medium hover:bg-slate-50"
              >
                Close Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}