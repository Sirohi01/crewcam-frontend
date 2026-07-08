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
} from "lucide-react";

import { FaLinkedin } from "react-icons/fa";
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

interface ReviewPageProps {
  setCurrentView: (view: PortalView) => void;
}

export default function ReviewPage({
  setCurrentView
}: ReviewPageProps) {
  // Local Data State
  const [candidate, setCandidate] = React.useState<CandidateInfo>(defaultCandidate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>('personal');

  // Interactive UI zoom states for CV
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);
  const [isReextracting, setIsReextracting] = React.useState<boolean>(false);

  // High-fidelity interactive PDF viewer simulation states
  const [pdfPage, setPdfPage] = React.useState<number>(1);
  const [pdfSearchQuery, setPdfSearchQuery] = React.useState<string>("");
  const [pdfShowHighlights, setPdfShowHighlights] = React.useState<boolean>(true);
  const [pdfSidebarOpen, setPdfSidebarOpen] = React.useState<boolean>(false);

  // Auto-sync checks
  const handleInputChange = (field: keyof CandidateInfo, value: string) => {
    setCandidate(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleDiscard = () => {
    setCandidate(defaultCandidate);
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

  const handleDownloadCV = () => {
    const text = `RESUME: ${candidate.fullName}\nEmail: ${candidate.email}\nPhone: ${candidate.mobile}\nExperience: ${candidate.totalExperience} Years`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

  // Highlight helper for search querying inside resume
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="bg-yellow-300 text-slate-950 font-semibold px-0.5 rounded shadow-xs">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-900 select-none" id="review-page-root">

      {/* =========================================================================
          1. PORTAL HEADER (Now locally part of Page 1)
          ========================================================================= */}
      {/* <header className="h-[7%] min-h-[48px] bg-indigo-950 px-3 flex items-center justify-between border-b border-indigo-900 shadow-md"> */}
      {/* <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded-md text-white">
            <Sparkles className="w-4 h-4 animate-pulse text-indigo-100" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">
              Candidate Portal
            </h1>
            <p className="text-[10px] text-indigo-200 leading-none mt-1">
              Interactive Application Evaluation Dashboard
            </p>
          </div>
        </div> */}

      {/* Local Page Selector inside Page 1 */}
      {/* <div className="bg-indigo-900/60 p-1 rounded-lg flex items-center gap-1 border border-indigo-800" id="global-page-selector">
          <button 
            className="px-2 py-1 text-xs font-bold rounded bg-indigo-600 text-white shadow-sm flex items-center gap-1"
          >
            <span>📝</span>
            <span className="hidden md:inline">1. Review & Edit</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('submitted')}
            className="px-2 py-1 text-xs font-medium rounded text-indigo-200 hover:text-white hover:bg-indigo-800/40 transition-all flex items-center gap-1"
          >
            <span>🎉</span>
            <span className="hidden md:inline">2. Submitted Success</span>
          </button>

          <button 
            onClick={() => setCurrentView('evaluation')}
            className="px-2 py-1 text-xs font-medium rounded text-indigo-200 hover:text-white hover:bg-indigo-800/40 transition-all flex items-center gap-1"
          >
            <span>🤖</span>
            <span className="hidden md:inline">3. AI Evaluation</span>
          </button>
        </div> */}

      {/* <div className="flex items-center gap-2 text-indigo-100 text-xs">
          <span className="bg-indigo-900 px-2 py-0.5 rounded text-[10px] font-mono border border-indigo-800 text-indigo-300">
            APP-2026-000124
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-emerald-400 font-medium hidden sm:inline">Active Session</span>
        </div> */}
      {/* </header> */}

      {/* =========================================================================
          2. STEPPER PROGRESS BAR (Now locally part of Page 1)
          ========================================================================= */}
      <section className="h-[6%] min-h-[38px] bg-white border-b border-slate-100 px-3 py-1 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">Review & Edit Candidate</span>
          <span className="text-[10px] text-slate-500 font-medium">Verify extracted AI fields & match stats</span>
        </div>

        {/* 3 Step progress */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px] border border-emerald-300">✓</span>
            <span className="text-slate-500 font-medium">Upload CV</span>
          </div>
          <div className="w-6 h-[1px] bg-slate-300"></div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">2</span>
            <span className="text-indigo-900 font-bold">Review & Edit</span>
          </div>
          <div className="w-6 h-[1px] bg-slate-200"></div>
          <div className="flex items-center gap-1 text-xs">
            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[9px] border border-slate-300">3</span>
            <span className="text-slate-500 font-medium">Submit Application</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleDiscard}
            className="px-2 py-0.5 text-xs border border-slate-300 text-slate-800 rounded hover:bg-slate-50 font-medium"
          >
            Reset
          </button>
          <button
            // onClick={() => setCurrentView('submitted')}
            onClick={() => window.open('/dashboard/hiring/candidates/new/create/application-submitted')}
            className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 font-medium transition-colors"
          >
            <span>Submit Form</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. MAIN CONTAINER
          ========================================================================= */}
      <div className="h-[87%] flex-1 overflow-hidden flex bg-slate-50 gap-2 p-2">
        <div
          className="w-full h-full flex gap-2 overflow-hidden"
          id="review-step-container"
        >
          {/* Left Column: Form Section (70% width, independently scrollable) */}
          <div className="w-[68%] h-full flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm" id="candidate-form-card">

            {/* Candidate Overview Header Card inside Form (Dense) */}
            <div className="bg-indigo-50/60 p-2 border-b border-indigo-100 flex items-center justify-between gap-2" id="form-header-summary">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden bg-indigo-100 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Amit"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="font-display font-bold text-sm text-indigo-950 leading-tight">
                      {candidate.fullName}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 border border-emerald-200">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                      AI Extracted
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-slate-800">
                    <span className="flex items-center gap-0.5"><Briefcase className="w-2.5 h-2.5 text-indigo-800" /> {candidate.appliedFor}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5 text-indigo-800" /> {candidate.currentLocation}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5 text-indigo-800" /> {candidate.mobile}</span>
                  </div>
                </div>
              </div>

              {/* High level status summary boxes */}
              <div className="hidden sm:flex items-center gap-1 text-[10px]">
                <div className="bg-white p-1 rounded border border-slate-200 text-center min-w-[60px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Applied For</div>
                  <div className="font-bold text-slate-800 truncate text-[9px]">{candidate.appliedFor}</div>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200 text-center min-w-[65px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Department</div>
                  <div className="font-bold text-slate-800 truncate text-[9px]">{candidate.department}</div>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200 text-center min-w-[55px]">
                  <div className="text-[8px] uppercase font-bold text-indigo-900">Notice Period</div>
                  <div className="font-bold text-slate-800 text-[9px]">{candidate.noticePeriod}</div>
                </div>
              </div>
            </div>

            {/* Sub-navigation tabs inside review */}
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 gap-1" id="form-sub-tabs">
              {[
                { id: 'personal', label: 'Personal Information' },
                { id: 'application', label: 'Application Details' },
                { id: 'education', label: 'Education & Skills' },
                { id: 'experience', label: 'Experience' },
                { id: 'other', label: 'Other Information' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${activeTab === tab.id
                    ? 'bg-white text-indigo-950 border border-slate-200 shadow-xs font-bold'
                    : 'text-indigo-900 hover:text-indigo-950 hover:bg-slate-100/60'
                    }`}
                  id={`tab-btn-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Re-extract dynamic CV option */}
              <button
                onClick={triggerReextract}
                disabled={isReextracting}
                className="ml-auto px-2 py-0.5 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded flex items-center gap-1 hover:bg-indigo-100 disabled:opacity-50"
                id="reextract-btn"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isReextracting ? 'animate-spin' : ''}`} />
                <span>{isReextracting ? 'Extracting...' : 'Re-extract CV'}</span>
              </button>
            </div>

            {/* Editable Form Fields Scroll Box (Main Left Body) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3" id="form-scrollable-area">

              {/* Category 1: Personal Information */}
              {(activeTab === 'personal') && (
                <div className="space-y-1.5" id="personal-info-block">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-700" />
                      Personal Information
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">Fields extracted by AI</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Full Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Email Address <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        value={candidate.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Mobile Number <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Current Location <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.currentLocation}
                        onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Preferred Location</label>
                      <select
                        value={candidate.preferredLocation}
                        onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
                          className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800 truncate"
                        />
                        <FaLinkedin className="w-3.5 h-3.5 text-indigo-700 absolute left-1.5 top-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 2: Application Details */}
              {(activeTab === 'application') && (
                <div className="space-y-1.5" id="application-info-block">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                      Application Details
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">Job & role parameters</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Position Applied For <span className="text-rose-500">*</span></label>
                      <select
                        value={candidate.appliedFor}
                        onChange={(e) => handleInputChange('appliedFor', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Relevant Experience (Years) <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.relevantExperience}
                        onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Current Company</label>
                      <input
                        type="text"
                        value={candidate.currentCompany}
                        onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Current CTC (INR) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          value={candidate.currentCTC}
                          onChange={(e) => handleInputChange('currentCTC', e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                        />
                        <span className="text-[10px] font-bold text-indigo-900 absolute left-2 top-1.5">₹</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Expected CTC (INR) <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          value={candidate.expectedCTC}
                          onChange={(e) => handleInputChange('expectedCTC', e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                        />
                        <span className="text-[10px] font-bold text-indigo-900 absolute left-2 top-1.5">₹</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Notice Period <span className="text-rose-500">*</span></label>
                      <select
                        value={candidate.noticePeriod}
                        onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
              )}

              {/* Category 3: Education & Credentials */}
              {(activeTab === 'education') && (
                <div className="space-y-1.5" id="education-info-block">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
                      Education Details
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">Academic achievements</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Highest Qualification <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.highestQualification}
                        onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">University / Board <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Year of Passing <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.yearOfPassing}
                        onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Percentage / CGPA <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={candidate.cgpa}
                        onChange={(e) => handleInputChange('cgpa', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
              )}

              {/* Category 4: Experience / Timeline */}
              {(activeTab === 'experience') && (
                <div className="space-y-1.5" id="experience-info-block">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                      Experience Timeline
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">Work History</span>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="relative border-l-2 border-indigo-200 pl-3 space-y-3 py-1 text-xs text-slate-800">

                      {/* Item 1 */}
                      <div className="relative">
                        <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-indigo-600"></span>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Sales Manager</span>
                          <span className="text-[9px] text-slate-600 font-semibold font-mono">Jun 2021 – Present</span>
                        </div>
                        <span className="text-[10px] text-indigo-950 font-medium block">ABC Pvt. Ltd. • Full Time</span>
                        <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[10px] text-slate-700 leading-snug">
                          <li>Leading a team of 10 sales executives and managing key enterprise accounts.</li>
                          <li>Achieved 125% of annual sales target for 2 consecutive years.</li>
                          <li>Developed strategic sales plans and increased market share by 16%.</li>
                        </ul>
                      </div>

                      {/* Item 2 */}
                      <div className="relative">
                        <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-indigo-400"></span>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Senior Sales Executive</span>
                          <span className="text-[9px] text-slate-600 font-semibold font-mono">May 2019 – May 2021</span>
                        </div>
                        <span className="text-[10px] text-indigo-950 font-medium block">XYZ Solutions Pvt. Ltd. • Full Time</span>
                        <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[10px] text-slate-700 leading-snug">
                          <li>Managed client acquisition and retention across Delhi NCR.</li>
                          <li>Consistently met and exceeded quarterly sales targets.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 5: Other Information */}
              {(activeTab === 'other') && (
                <div className="space-y-1.5" id="other-info-block">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <h3 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-700" />
                      Other Information
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono">Preferences</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Available From</label>
                      <input
                        type="text"
                        value={candidate.availableFrom}
                        onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-indigo-950">Willingness to Relocate</label>
                      <select
                        value={candidate.relocation}
                        onChange={(e) => handleInputChange('relocation', e.target.value)}
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
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
                        className="w-full px-1.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Occasional">Occasional</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Save & Discard Action Row */}
            <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between" id="form-action-footer">
              <div className="flex items-center gap-1.5 text-xs">
                {hasUnsavedChanges ? (
                  <span className="text-amber-700 font-bold flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Unsaved edits pending
                  </span>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    All changes saved locally
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleDiscard}
                  disabled={!hasUnsavedChanges}
                  className="px-3 py-1 text-xs border border-slate-300 text-slate-900 rounded font-medium hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-xs hover:shadow-md transition-all flex items-center gap-1"
                >
                  Save Progress
                </button>
                <button
                  onClick={() => setCurrentView('submitted')}
                  className="px-3 py-1 text-xs bg-indigo-850 hover:bg-indigo-900 text-white rounded font-bold flex items-center gap-1 shadow-xs transition-all"
                >
                  <span>Submit Candidate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Original CV Preview & AI Summary (32% width) */}
          <div className="w-[32%] h-full flex flex-col gap-2 overflow-hidden" id="cv-preview-and-ai-panel">

            {/* 1. Original CV Preview Window - High-Fidelity PDF Viewer Simulation */}
            <div className="flex-[3] bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col shadow-sm" id="cv-pdf-viewer">
              {/* Custom PDF Toolbar */}
              <div className="bg-slate-900 px-2 py-1.5 border-b border-[#1e2021] flex flex-wrap items-center justify-between gap-1 shrink-0 text-white">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPdfSidebarOpen(!pdfSidebarOpen)}
                    className={`p-1 rounded text-slate-400 hover:text-white transition-colors ${pdfSidebarOpen ? 'bg-slate-800 text-indigo-400' : ''}`}
                    title="Toggle PDF Side Thumbnails"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold tracking-tight select-none">Original_CV.pdf</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 bg-slate-800 rounded px-1.5 py-0.5">
                  <button
                    onClick={() => setPdfPage(1)}
                    disabled={pdfPage === 1}
                    className="text-[10px] text-slate-400 hover:text-white disabled:opacity-30 font-bold px-0.5"
                  >
                    ◄
                  </button>
                  <span className="text-[9px] font-mono select-none px-1">
                    {pdfPage} / 2
                  </span>
                  <button
                    onClick={() => setPdfPage(2)}
                    disabled={pdfPage === 2}
                    className="text-[10px] text-slate-400 hover:text-white disabled:opacity-30 font-bold px-0.5"
                  >
                    ►
                  </button>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
                    className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] font-mono min-w-[28px] text-center select-none">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                    className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleDownloadCV}
                    className="p-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-[9px] font-bold flex items-center gap-0.5 ml-1"
                    title="Download PDF"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline text-[8px]">Doc</span>
                  </button>
                </div>
              </div>

              {/* Interactive Document PDF Settings bar */}
              <div className="bg-slate-950/90 border-b border-[#2d3032] p-1 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-1 flex-1 max-w-[120px]">
                  <div className="relative w-full">
                    <Search className="w-2.5 h-2.5 text-slate-500 absolute left-1 top-1.5" />
                    <input
                      type="text"
                      placeholder="Find in CV..."
                      value={pdfSearchQuery}
                      onChange={(e) => setPdfSearchQuery(e.target.value)}
                      className="w-full bg-[#1e2021] border border-slate-700 rounded pl-4 pr-3 py-0.5 text-[9px] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {pdfSearchQuery && (
                      <button
                        onClick={() => setPdfSearchQuery("")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <label className="flex items-center gap-1 cursor-pointer select-none text-[9px]">
                    <input
                      type="checkbox"
                      checked={pdfShowHighlights}
                      onChange={() => setPdfShowHighlights(prev => !prev)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#1e2021] w-3 h-3"
                    />
                    <span>Show AI Zones</span>
                  </label>
                  <span className="text-[8px] px-1 bg-slate-800 text-emerald-400 font-bold rounded">7 Years Experience</span>
                </div>
              </div>

              {/* Split Workspace View */}
              <div className="flex-1 flex overflow-hidden bg-[#525659]">
                {/* Mini Thumbnails Sidebar */}
                {pdfSidebarOpen && (
                  <div className="w-14 bg-[#2d3032] border-r border-[#1e2021] flex flex-col gap-2 p-1.5 overflow-y-auto shrink-0">
                    {/* Page 1 Thumbnail */}
                    <button
                      onClick={() => setPdfPage(1)}
                      className={`w-full text-center group transition-transform ${pdfPage === 1 ? 'scale-[1.03]' : ''}`}
                    >
                      <div className={`w-full aspect-[1/1.414] bg-white border rounded shadow-xs p-1 flex flex-col justify-between text-[4px] leading-[1px] select-none text-slate-300 pointer-events-none ${pdfPage === 1 ? 'border-2 border-indigo-500' : 'border-slate-700 group-hover:border-slate-500'}`}>
                        <div className="border-b border-slate-200 pb-0.5">
                          <div className="h-[2px] w-6 bg-slate-400 mb-0.5"></div>
                          <div className="h-[1px] w-10 bg-slate-300"></div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="h-[1px] w-full bg-slate-200"></div>
                          <div className="h-[1px] w-full bg-slate-200"></div>
                          <div className="h-[1px] w-full bg-slate-200"></div>
                          <div className="h-[1px] w-8 bg-slate-200"></div>
                        </div>
                        <div className="border-t border-slate-200 pt-0.5">
                          <div className="h-[1px] w-4 bg-slate-300"></div>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono font-bold block mt-0.5 text-slate-400">P1</span>
                    </button>

                    {/* Page 2 Thumbnail */}
                    <button
                      onClick={() => setPdfPage(2)}
                      className={`w-full text-center group transition-transform ${pdfPage === 2 ? 'scale-[1.03]' : ''}`}
                    >
                      <div className={`w-full aspect-[1/1.414] bg-white border rounded shadow-xs p-1 flex flex-col justify-between text-[4px] leading-[1px] select-none text-slate-300 pointer-events-none ${pdfPage === 2 ? 'border-2 border-indigo-500' : 'border-slate-700 group-hover:border-slate-500'}`}>
                        <div className="border-b border-slate-200 pb-0.5">
                          <div className="h-[1px] w-8 bg-slate-300"></div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="h-[1px] w-full bg-slate-200"></div>
                          <div className="h-[1px] w-full bg-slate-200"></div>
                          <div className="h-[1px] w-6 bg-slate-200"></div>
                        </div>
                        <div className="border-t border-slate-200 pt-0.5">
                          <div className="h-[1px] w-6 bg-slate-300"></div>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono font-bold block mt-0.5 text-slate-400">P2</span>
                    </button>
                  </div>
                )}

                {/* Main Canvas with native dark grey background */}
                <div className="flex-1 overflow-auto p-3 flex justify-center items-start">
                  <div
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    className="w-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.45)] border border-[#1e2021] text-slate-950 p-4 relative transition-transform duration-100 select-text font-serif leading-relaxed text-[9px] aspect-[1/1.414]"
                  >
                    {/* ----------------- PAGE 1 ----------------- */}
                    {pdfPage === 1 ? (
                      <div className="space-y-3 h-full flex flex-col justify-between animate-fade-in">
                        {/* Page top header */}
                        <div className="flex justify-between items-center text-[7px] text-slate-400 border-b border-slate-200 pb-1 font-mono uppercase tracking-wider">
                          <span>Resume: Amit Kumar Verma</span>
                          <span>Page 1 of 2</span>
                        </div>

                        <div className="space-y-2 flex-1">
                          {/* Resume Header Name and Address */}
                          <div className="text-center space-y-1 pb-2 border-b-2 border-slate-800 relative">
                            {pdfShowHighlights && (
                              <div className="absolute inset-x-0 -top-1 -bottom-1 bg-yellow-200/25 border-2 border-dashed border-yellow-500 rounded px-1 pointer-events-none flex items-center justify-end">
                                <span className="bg-yellow-500 text-white font-mono font-bold text-[6px] px-1 rounded shadow-xs translate-y-2">AI EXTRACT: Candidate Name</span>
                              </div>
                            )}
                            <h2 className="text-sm font-bold tracking-tight font-sans uppercase">
                              {highlightText("Amit Kumar Verma", pdfSearchQuery)}
                            </h2>
                            <p className="text-[7.5px] font-sans text-slate-600 font-medium tracking-wide">
                              Sales & Business Development Professional • 7+ Years Experience
                            </p>
                            <div className="text-[7px] font-sans text-slate-500 flex justify-center items-center gap-1.5 flex-wrap">
                              <span>Email: {highlightText("amit.verma@email.com", pdfSearchQuery)}</span>
                              <span>•</span>
                              <span>Phone: {highlightText("+91 98765 43210", pdfSearchQuery)}</span>
                              <span>•</span>
                              <span>Location: {highlightText("Noida, Uttar Pradesh", pdfSearchQuery)}</span>
                            </div>
                          </div>

                          {/* Career Summary */}
                          <div className="space-y-1">
                            <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                              Professional Summary
                            </h3>
                            <p className="text-[7.5px] text-slate-800 text-justify leading-relaxed">
                              {highlightText("Results-driven Sales Manager with 7+ years of professional experience in B2B sales development, major account management, and client relationship management. Demonstrated record of success driving team expansion, leading 10 sales executives, and exceeding key revenue targets by up to 125%. Proven skill set in strategic market planning, salesforce CRM implementation, and business pipeline automation.", pdfSearchQuery)}
                            </p>
                          </div>

                          {/* Core Competencies */}
                          <div className="space-y-1">
                            <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                              Core Competencies
                            </h3>
                            <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-[7px] text-slate-800 font-sans">
                              <div>• {highlightText("Enterprise Sales & B2B", pdfSearchQuery)}</div>
                              <div>• {highlightText("Team Leadership & Mentoring", pdfSearchQuery)}</div>
                              <div>• {highlightText("Client Relationship (CRM)", pdfSearchQuery)}</div>
                              <div>• {highlightText("Salesforce Automations", pdfSearchQuery)}</div>
                              <div>• {highlightText("Strategic Market Expansion", pdfSearchQuery)}</div>
                              <div>• {highlightText("Revenue Growth & Retention", pdfSearchQuery)}</div>
                            </div>
                          </div>

                          {/* Work Experience */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center border-b border-slate-300 pb-0.5">
                              <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider">
                                Professional Experience
                              </h3>
                              <span className="text-[7px] text-slate-400 font-sans">June 2017 – Present</span>
                            </div>

                            <div className="space-y-2">
                              {/* Company 1 */}
                              <div className="space-y-1 relative">
                                {pdfShowHighlights && (
                                  <div className="absolute -inset-x-1 -inset-y-0.5 bg-yellow-200/20 border border-dashed border-yellow-500 rounded pointer-events-none flex items-start justify-end p-0.5">
                                    <span className="bg-yellow-500 text-white font-mono font-bold text-[5.5px] px-0.5 rounded shadow-xs">AI MATCH: Active Employer (ABC Pvt Ltd)</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-sans text-[8px] font-bold text-slate-900">
                                  <span>{highlightText("Sales Manager — ABC Pvt. Ltd.", pdfSearchQuery)}</span>
                                  <span>{highlightText("June 2021 – Present", pdfSearchQuery)}</span>
                                </div>
                                <p className="text-[7.5px] text-slate-500 font-sans italic">Role: Managing Enterprise Accounts & Regional Teams</p>
                                <ul className="list-disc list-outside pl-3 text-[7.5px] text-slate-800 space-y-0.5">
                                  <li>{highlightText("Directly manage and lead a team of 10 executive members, achieving 125% of annual revenue target.", pdfSearchQuery)}</li>
                                  <li>{highlightText("Acquired 15+ major enterprise clients across North India, driving over ₹1.2 Cr in new contract value.", pdfSearchQuery)}</li>
                                  <li>{highlightText("Streamlined business lead pipeline tracking using automated custom CRM dashboards.", pdfSearchQuery)}</li>
                                </ul>
                              </div>

                              {/* Company 2 */}
                              <div className="space-y-1">
                                <div className="flex justify-between font-sans text-[8px] font-bold text-slate-900">
                                  <span>{highlightText("Senior Sales Executive — XYZ Solutions", pdfSearchQuery)}</span>
                                  <span>{highlightText("May 2019 – May 2021", pdfSearchQuery)}</span>
                                </div>
                                <p className="text-[7.5px] text-slate-500 font-sans italic">Role: B2B Acquisition & Client Retention</p>
                                <ul className="list-disc list-outside pl-3 text-[7.5px] text-slate-800 space-y-0.5">
                                  <li>{highlightText("Exceeded personal quarterly sales quotas consistently by 15-20% through aggressive outbound strategy.", pdfSearchQuery)}</li>
                                  <li>{highlightText("Spearheaded local marketing and advertising collaborations in Delhi NCR zone.", pdfSearchQuery)}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Page Footer */}
                        <div className="border-t border-slate-200 pt-1 text-center text-[7px] text-slate-400 font-sans">
                          <span>Confidential Resume - Amit Kumar Verma • Noida, UP, India</span>
                        </div>
                      </div>
                    ) : (
                      /* ----------------- PAGE 2 ----------------- */
                      <div className="space-y-3 h-full flex flex-col justify-between animate-fade-in">
                        {/* Page top header */}
                        <div className="flex justify-between items-center text-[7px] text-slate-400 border-b border-slate-200 pb-1 font-mono uppercase tracking-wider">
                          <span>Resume: Amit Kumar Verma</span>
                          <span>Page 2 of 2</span>
                        </div>

                        <div className="space-y-3 flex-1">
                          {/* Work Experience Continued */}
                          <div className="space-y-1">
                            <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                              Professional Experience (Continued)
                            </h3>
                            <div className="space-y-1">
                              <div className="flex justify-between font-sans text-[8px] font-bold text-slate-900">
                                <span>{highlightText("Sales Executive — Global Tech Enterprises", pdfSearchQuery)}</span>
                                <span>{highlightText("July 2017 – April 2019", pdfSearchQuery)}</span>
                              </div>
                              <ul className="list-disc list-outside pl-3 text-[7.5px] text-slate-800 space-y-0.5">
                                <li>{highlightText("Developed outbound business opportunities and conducted cold-pitches to corporate clients.", pdfSearchQuery)}</li>
                                <li>{highlightText("Coordinated with design teams to structure engaging product presentation decks.", pdfSearchQuery)}</li>
                              </ul>
                            </div>
                          </div>

                          {/* Education Section */}
                          <div className="space-y-1.5 relative">
                            {pdfShowHighlights && (
                              <div className="absolute -inset-x-1 -inset-y-0.5 bg-yellow-200/20 border border-dashed border-yellow-500 rounded pointer-events-none flex items-start justify-end p-0.5">
                                <span className="bg-yellow-500 text-white font-mono font-bold text-[5.5px] px-0.5 rounded shadow-xs">AI MATCH: Highest Qualification</span>
                              </div>
                            )}
                            <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                              Education & Academics
                            </h3>
                            <div className="space-y-2 text-[7.5px] text-slate-800">
                              <div className="space-y-0.5">
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{highlightText("MBA (Master of Business Administration) — Marketing", pdfSearchQuery)}</span>
                                  <span>{highlightText("Class of 2017", pdfSearchQuery)}</span>
                                </div>
                                <div className="flex justify-between font-sans text-slate-500 text-[7px]">
                                  <span>{highlightText("Amity University, Noida", pdfSearchQuery)}</span>
                                  <span>CGPA: {highlightText("7.8 / 10.0", pdfSearchQuery)}</span>
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{highlightText("Bachelor of Commerce (B.Com Hons)", pdfSearchQuery)}</span>
                                  <span>{highlightText("Class of 2015", pdfSearchQuery)}</span>
                                </div>
                                <div className="flex justify-between font-sans text-slate-500 text-[7px]">
                                  <span>{highlightText("Delhi University, New Delhi", pdfSearchQuery)}</span>
                                  <span>Score: {highlightText("72%", pdfSearchQuery)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Certifications */}
                          <div className="space-y-1">
                            <h3 className="font-sans font-bold text-[8px] text-indigo-950 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                              Certifications & Languages
                            </h3>
                            <div className="grid grid-cols-2 gap-x-4 text-[7px] text-slate-800 font-sans space-y-0.5">
                              <div className="space-y-0.5 col-span-2">
                                <div>• {highlightText("Certified Sales Professional (CSP) – 2021", pdfSearchQuery)}</div>
                                <div>• {highlightText("HubSpot Inbound Sales Certified Specialist – 2020", pdfSearchQuery)}</div>
                                <div>• {highlightText("Advanced Diploma in Corporate Negotiating – 2018", pdfSearchQuery)}</div>
                              </div>
                              <div className="pt-1">
                                <span className="font-bold">Languages:</span> English (Fluent), Hindi (Native)
                              </div>
                            </div>
                          </div>

                          {/* Interactive Declarations / Verified Seal Stamp */}
                          <div className="border border-emerald-200 bg-emerald-50/40 rounded-sm p-1.5 flex items-center justify-between gap-1 text-[7px] text-emerald-950">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[7.5px] block text-emerald-900 font-sans">Security Verified & Scanned</span>
                              <p className="text-[6.5px] text-slate-600 font-sans leading-tight">This document has been parsed and verified secure by the HR AI Extraction Core.</p>
                            </div>
                            <div className="border border-emerald-500 border-dashed text-emerald-600 font-bold font-mono px-1 py-0.5 text-[6.5px] uppercase rounded-xs rotate-[-2deg] tracking-wide shrink-0">
                              Verified Match
                            </div>
                          </div>
                        </div>

                        {/* Page Footer */}
                        <div className="border-t border-slate-200 pt-1 text-center text-[7px] text-slate-400 font-sans">
                          <span>Confidential Resume - Amit Kumar Verma • Amity Alumnus</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. AI Extraction Verification & Summary Checklist */}
            <div className="flex-[2] bg-white rounded-lg border border-slate-200 p-2 flex flex-col justify-between shadow-sm overflow-hidden" id="accuracy-checklist-card">
              <div>
                <div className="flex items-center justify-between mb-1.5 pb-0.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                    AI Extraction Accuracy
                  </h4>
                  <span className="bg-indigo-100 text-indigo-950 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">
                    Avg: 92%
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-800">
                  {[
                    { label: "Personal Information", confidence: 95 },
                    { label: "Application Details", confidence: 92 },
                    { label: "Education Details", confidence: 92 },
                    { label: "Experience Details", confidence: 91 },
                    { label: "Skills Check", confidence: 88 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-1 rounded border border-slate-100">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                        {item.label}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 font-mono">
                        {item.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Smart Suggestion panel */}
              <div className="mt-1 bg-indigo-50 p-1.5 rounded border border-indigo-100 space-y-1" id="ai-smart-suggestions">
                <div className="flex items-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-700 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-indigo-950 block">AI Recommendation Match</span>
                    <span className="text-[9px] text-slate-800 leading-normal block">
                      Amit's profile matches 87% of the Sales Manager role requirements. Click to view suggestions.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuggestions(true)}
                  className="w-full py-1 text-[10px] bg-white text-indigo-700 border border-indigo-200 rounded font-bold hover:bg-indigo-50 transition-colors"
                >
                  Review AI Suggestions
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Suggestions Modal inside Page 1 */}
        {showSuggestions && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 z-50"
          >
            <div
              className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-3.5 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-700 animate-spin" />
                  <h3 className="text-xs font-bold text-indigo-950">AI Extraction Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-800 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-[10.5px] text-slate-800 leading-relaxed">
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

                <p className="text-[9px] text-slate-600 italic">
                  *AI generated details are suggestions based on the uploaded document structure. Verify details before submitting.
                </p>
              </div>

              <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                <button
                  onClick={handleAcceptSuggestions}
                  className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded animate-pulse"
                >
                  Accept & Update Form
                </button>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="px-2.5 py-1 text-[10px] border border-slate-200 text-slate-900 rounded font-medium hover:bg-slate-50"
                >
                  Close Suggestions
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
