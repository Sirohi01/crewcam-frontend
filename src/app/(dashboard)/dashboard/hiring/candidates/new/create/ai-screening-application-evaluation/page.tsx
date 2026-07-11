"use client";

import React from 'react';
import {
  CheckCircle,
  Check,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Send,
  FileText,
  Download,
  Eye,
  Plus,
  Phone, Mail, MapPin,
  Minus,
  Maximize2,
  Clock,
  ShieldCheck,
  Star
} from 'lucide-react';
import { CandidateInfo, Note, Skill, PortalView } from './types';
import { FaLinkedin } from 'react-icons/fa';

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
  cgpa: "7.8 CGPA",
  resumeUrl: "https://drive.google.com/file/d/1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN/view?usp=sharing"
};

const defaultNotes: Note[] = [];

const initialSkills: Skill[] = [
  // Matched
  { name: "Sales Strategy", category: "matched", percentage: 90 },
  { name: "Team Leadership", category: "matched", percentage: 85 },
  { name: "Client Relationship Management", category: "matched", percentage: 88 },
  { name: "Business Development", category: "matched", percentage: 80 },
  { name: "CRM", category: "matched", percentage: 87 },
  { name: "Market Analysis", category: "matched", percentage: 82 },
  // Missing
  { name: "Advanced Data Analytics", category: "missing" },
  { name: "PPC / Google Ads", category: "missing" },
  { name: "Digital Marketing", category: "missing" },
  { name: "Salesforce Automation", category: "missing" }
];

// 8 step application journey shown in the top stepper
const steps = [
  { num: 1, label: 'Upload CV', status: 'completed' },
  { num: 2, label: 'Review & Edit', status: 'completed' },
  { num: 3, label: 'Submit Application', status: 'completed' },
  { num: 4, label: 'AI Screening', status: 'active' },
  { num: 5, label: 'HOD Review', status: 'pending' },
  { num: 6, label: 'Interview', status: 'pending' },
  { num: 7, label: 'Offer', status: 'pending' },
  { num: 8, label: 'Onboarding', status: 'pending' },
];

// Vertical application timeline shown in the right column
interface TimelineEvent {
  title: string;
  timestamp?: string;
  description?: string;
  status: "done" | "active" | "pending";
}

const timelineEvents: TimelineEvent[] = [
  {
    title: "Application Submitted",
    timestamp: "15 June 2026, 11:32 AM",
    description: "Application has been submitted successfully.",
    status: "done"
  },
  {
    title: "Review & Edit Completed",
    timestamp: "15 June 2026, 11:40 AM",
    description: "Application details reviewed and updated.",
    status: "done"
  },
  {
    title: "AI Screening",
    timestamp: "15 June 2026, 12:05 PM",
    description: "AI screening is in progress.",
    status: "active"
  },
  { title: "HOD Review", status: "pending" },
  { title: "Interview", status: "pending" },
  { title: "Offer", status: "pending" },
  { title: "Onboarding", status: "pending" }
];

const subTabs = [
  "AI Screening Report",
  "Extracted Information",
  "Resume Match",
  "Skill Analysis",
  "Recommendation"
];

interface EvaluationPageProps {
  setCurrentView: (view: PortalView) => void;
}

export default function EvaluationPage({
  setCurrentView
}: EvaluationPageProps) {
  // Local State
  const [candidate] = React.useState<CandidateInfo>(defaultCandidate);
  const [skills] = React.useState<Skill[]>(initialSkills);
  const [notes, setNotes] = React.useState<Note[]>(defaultNotes);
  const [newNoteText, setNewNoteText] = React.useState<string>("");
  const [activeSubTab, setActiveSubTab] = React.useState<string>(subTabs[0]);
  const [zoom, setZoom] = React.useState<number>(100);

  // Add a Note (interactive)
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: newNoteText,
      timestamp: "07 July 2026 | 03:07 PM"
    };
    setNotes([newNote, ...notes]);
    setNewNoteText("");
  };
  const handlePreviewCV = () => {
    window.open(candidate.resumeUrl, '_blank');
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = candidate.resumeUrl;
    link.download = `${candidate.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    link.click();
  };
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      {/* HEADER & HORIZONTAL STEP INDICATOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-2">
        {/* Title */}
        <div className="shrink-0 w-full lg:w-[380px]">
          <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">AI Screening &ndash; Application Evaluation</h1>
          <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Application ID: APP-2026-000124</p>
        </div>

        {/* Steps */}
        <div className="flex-1 max-w-[650px] w-full flex items-center justify-center relative mx-auto">
          <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
          <div className="flex w-full justify-between z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1 bg-slate-50 lg:bg-transparent">
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
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentView('submitted')}
            className="flex items-center justify-center h-8 px-3 rounded-md text-[11px] font-semibold text-indigo-700 border border-indigo-200 bg-white hover:bg-indigo-50 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Back to Applications
          </button>
          <button
            onClick={() => {
              window.open('/dashboard/hiring/candidates/new/create/evaluation', '_blank')
              setCurrentView('submitted');
            }}
            className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            Move to HOD Review &rarr;
          </button>
        </div>
      </div>

      <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>

      <div
        className="w-full lg:h-[calc(100vh-120px)] lg:min-h-[650px] overflow-y-auto lg:overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-900 select-none rounded-xl"
        id="evaluation-page-root"
      >

        {/* =========================================================================
          3. MAIN CONTAINER
          ========================================================================= */}
        <div className="flex-1 lg:h-[73%] overflow-visible lg:overflow-hidden flex flex-col lg:flex-row bg-slate-50 gap-2 p-2">
          <div
            className="w-full h-auto lg:h-full flex flex-col lg:flex-row gap-2 overflow-visible lg:overflow-hidden"
            id="evaluation-step-container"
          >
            {/* Left Column: AI Screening Report Breakdown (68% width on desktop) */}
            <div className="w-full lg:w-[68%] h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-hidden" id="evaluation-left-column">
              <div className="flex flex-col bg-white rounded-lg border border-slate-200 overflow-visible lg:overflow-hidden shadow-sm lg:flex-1">

                {/* Score Summary Title Hero */}
                <div
                  className="bg-slate-50 p-2 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center items-start justify-between gap-2 bg-white"
                  id="eval-header-panel"
                >
                  <div className="flex gap-2 w-full lg:w-auto">
                    <div className="w-16 h-16 rounded-lg border border-indigo-400 overflow-hidden bg-indigo-50 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                        alt="Amit"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <h2 className="font-display font-bold text-xs text-indigo-950 leading-none">
                          {candidate.fullName}
                        </h2>
                        <span className="bg-indigo-100 text-indigo-950 text-[9px] font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                          AI Screening in Progress
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[8.5px] text-slate-500 mt-1">
                        <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{candidate.mobile}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[8.5px] text-slate-500 mt-1">
                        <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{candidate.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[8.5px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{candidate.currentLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[8.5px] text-slate-500 mt-1">
                        <FaLinkedin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{candidate.linkedin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full lg:w-auto">
                    {/* Left Column */}
                    <div className="space-y-2 pr-2 border-r border-slate-200">
                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Applied For</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          {candidate.appliedFor}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Department</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          {candidate.department}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-slate-500">
                          Employment Type
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          {candidate.employmentType}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2 pl-2">
                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Experience</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          {candidate.totalExperience} Years
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Expected CTC</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          ₹ {candidate.expectedCTC}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Notice Period</p>
                        <p className="mt-0.5 text-xs font-semibold text-slate-900">
                          {candidate.noticePeriod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Tab selection inside screen 3 */}
                <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50 p-1 gap-1" id="eval-subtabs">
                  {subTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubTab(tab)}
                      className={
                        "px-2 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap shrink-0 " +
                        (activeSubTab === tab
                          ? "font-bold text-indigo-950 bg-white shadow-xs border border-slate-200"
                          : "text-indigo-900 hover:bg-slate-100/60")
                      }
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Main Screening details body scroll box */}
                <div className="flex-1 overflow-visible lg:overflow-y-auto p-2 space-y-2.5" id="eval-scroll-area">

                  {/* Grid 1: Gauge Chart & Progress Bars (Compact) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

                    {/* SVG Gauge block */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] uppercase font-bold text-indigo-950 mb-1.5">
                        AI Match Screening Score
                      </span>

                      <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Circular progress SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="#10b981"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - 0.87)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>

                        <div className="absolute text-center">
                          <span className="text-xl font-bold text-slate-900 block font-mono">
                            87%
                          </span>
                          <span className="text-[8px] font-bold text-emerald-800 bg-emerald-100/70 px-1 py-0.2 rounded">
                            Good Match
                          </span>
                        </div>
                      </div>

                      <p className="text-[9px] text-slate-800 leading-normal mt-2 max-w-[200px]">
                        This candidate is a good match for the {candidate.appliedFor} role. Score calculated based on JD match, skills, experience & other factors.
                      </p>
                    </div>

                    {/* Score Breakdown progress list */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1.5 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-indigo-950">
                        Score Breakdown Parameters
                      </span>

                      <div className="space-y-1.5 text-xs text-slate-800">
                        {[
                          { label: "Skills Match Ratio", val: 90, color: "bg-emerald-500" },
                          { label: "Experience & Tenure", val: 85, color: "bg-emerald-500" },
                          { label: "Education & Credentials", val: 80, color: "bg-emerald-500" },
                          { label: "Expected CTC Compatibility", val: 75, color: "bg-indigo-500" },
                          { label: "Overall Profile Cohesion", val: 87, color: "bg-emerald-600" }
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <div className="flex justify-between text-[9px] font-medium">
                              <span className="text-slate-900">{item.label}</span>
                              <span className="font-bold text-indigo-950 font-mono">{item.val}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div style={{ width: `${item.val}%` }} className={`h-full ${item.color}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                    {/* Grid 2: Core Matched Skills & Missing Skills (list style w/ links) */}

                    {/* Top Matched Skills block */}
                    <div className="bg-emerald-50/40 p-2 rounded-lg border border-emerald-100 flex flex-col">
                      <h4 className="text-[10px] uppercase font-bold text-emerald-950 flex items-center gap-1 mb-1.5 pb-0.5 border-b border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Top Matched Skills
                      </h4>

                      <div className="space-y-1 text-[9px] text-slate-800">
                        {skills.filter(s => s.category === 'matched').map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white p-1 rounded border border-emerald-200/50">
                            <span className="w-3 h-3 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-800 shrink-0">✓</span>
                            <span className="font-medium text-slate-900">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                      <button className="text-[9px] font-bold text-indigo-700 hover:text-indigo-900 text-left mt-1.5">
                        View All Skills ({skills.length}) →
                      </button>
                    </div>

                    {/* Missing Skills block */}
                    <div className="bg-amber-50/40 p-2 rounded-lg border border-amber-100 flex flex-col">
                      <h4 className="text-[10px] uppercase font-bold text-amber-950 flex items-center gap-1 mb-1.5 pb-0.5 border-b border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Missing / To Improve
                      </h4>

                      <div className="space-y-1 text-[9px] text-slate-800">
                        {skills.filter(s => s.category === 'missing').map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-white p-1 rounded border border-amber-200/50">
                            <span className="w-3 h-3 rounded-full bg-amber-100 flex items-center justify-center text-[8px] font-bold text-amber-800 shrink-0">!</span>
                            <span className="font-medium text-slate-900">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                      <button className="text-[9px] font-bold text-amber-700 hover:text-amber-900 text-left mt-1.5">
                        View Improvement Tips →
                      </button>
                    </div>

                  </div>

                  {/* Grid 3: Extracted Summary (AI) + Original CV + Resume Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">

                    {/* Extracted Summary (AI) */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-indigo-950 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Extracted Summary (AI)
                      </span>
                      <p className="text-[9px] text-slate-700 leading-relaxed flex-1">
                        Results-driven Sales Manager with {candidate.totalExperience}+ years of experience in B2B sales, team leadership, and business development. Proven track record in achieving revenue targets, building strong client relationships and driving growth.
                      </p>
                      <button className="text-[9px] font-bold text-indigo-700 hover:text-indigo-900 text-left mt-1.5">
                        View Full Extracted Text →
                      </button>
                    </div>

                    {/* Original CV */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-indigo-950 mb-1.5">
                        Original CV
                      </span>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded border border-slate-200 mb-1.5">
                        <div className="w-7 h-7 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-slate-900 truncate">Amit_Kumar_Verma_Resume.pdf</p>
                          <p className="text-[8px] text-slate-500">245 KB • Uploaded on 15 June 2026, 11:32 AM</p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-auto">
                        <button
                          onClick={handlePreviewCV}
                          className="flex-1 flex items-center justify-center gap-1 text-[9px] font-bold text-indigo-700 border border-indigo-200 rounded py-1 hover:bg-indigo-50"
                        >
                          <Eye className="w-3 h-3" />
                          Preview CV
                        </button>
                        <button
                          onClick={handleDownloadCV}
                          className="flex-1 flex items-center justify-center gap-1 text-[9px] font-bold text-white bg-indigo-600 rounded py-1 hover:bg-indigo-700"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-col overflow-hidden h-[380px] sm:col-span-2 lg:col-span-1 lg:h-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-indigo-950">Resume Preview</span>
                        <div className="flex items-center gap-0.5 text-slate-500">
                          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-0.5 hover:text-indigo-700">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[8px] font-mono w-7 text-center">{zoom}%</span>
                          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-0.5 hover:text-indigo-700">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={handlePreviewCV} className="p-0.5 hover:text-indigo-700">
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded overflow-hidden relative">
                        <iframe
                          src={candidate.resumeUrl}
                          title="Resume Preview"
                          className="absolute top-0 left-0 border-0"
                          style={{
                            width: `${100 / (zoom / 100)}%`,
                            height: `${100 / (zoom / 100)}%`,
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top left'
                          }}
                        />
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* AI Recommendation full-width footer bar */}
              <div
                className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex flex-col sm:flex-row sm:items-center items-start justify-between gap-2 shrink-0"
                id="eval-recommendation-footer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-950 flex items-center gap-1">
                      AI Recommendation
                    </span>
                    <p className="text-[9px] text-emerald-900 leading-snug">
                      This candidate has a good match for the role based on the job description. We recommend moving this application to HOD Review.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      alert("Moving application to HOD Review Stage!");
                      setCurrentView('submitted');
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 shadow-xs transition-all text-xs"
                  >
                    <span>Recommended</span>
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      alert("Moving application to HOD Review Stage!");
                      setCurrentView('submitted');
                    }}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center gap-1 shadow-xs transition-all text-xs"
                  >
                    <span>Send to HOD Review</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert("Shortlisted Amit Kumar Verma for Departmental Interview stage!")}
                    className="px-2.5 py-1 bg-white text-indigo-950 font-bold border border-indigo-200 rounded hover:bg-indigo-50 transition-colors text-xs"
                  >
                    Shortlist for Interview
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Application Summary, Timeline & Recruiter Notes (32% width on desktop) */}
            <div className="w-full lg:w-[32%] h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-hidden" id="evaluation-right-column">

              {/* 1. Application Summary */}
              <div className="bg-white rounded-lg border border-slate-200 p-2 shadow-sm space-y-2 shrink-0">
                <span className="text-xs font-bold text-indigo-950 border-b border-slate-100 pb-1 block">
                  Application Summary
                </span>

                <div className="space-y-1.5 text-[10px] text-slate-800">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Application ID</span>
                    <span className="font-bold text-slate-900 font-mono">APP-2026-000124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Applied On</span>
                    <span className="font-bold text-slate-900">15 June 2026, 11:32 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Current Stage</span>
                    <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                      AI Screening
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Source</span>
                    <span className="font-bold text-indigo-950">Company Website</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Current Status</span>
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                      Under AI Review
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Application Timeline */}
              <div
                className="bg-white rounded-lg border border-slate-200 p-2 shadow-sm overflow-visible lg:overflow-y-auto shrink-0 lg:shrink"
                id="application-timeline-panel"
              >
                <span className="text-xs font-bold text-indigo-950 border-b border-slate-100 pb-1 mb-2 block">
                  Application Timeline
                </span>

                <div className="relative pl-4 space-y-3">
                  <div className="absolute left-[7px] top-1 bottom-1 w-[1.5px] bg-slate-200"></div>
                  {timelineEvents.map((event, idx) => (
                    <div key={idx} className="relative">
                      <span
                        className={
                          "absolute -left-4 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold border-2 " +
                          (event.status === "done"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : event.status === "active"
                              ? "bg-white border-indigo-600 text-indigo-600"
                              : "bg-white border-slate-300 text-slate-300")
                        }
                      >
                        {event.status === "done" ? "✓" : event.status === "active" ? "●" : ""}
                      </span>
                      <p className={"text-[10px] font-bold " + (event.status === "pending" ? "text-slate-400" : "text-slate-900")}>
                        {event.title}
                      </p>
                      {event.timestamp && (
                        <p className="text-[8.5px] text-indigo-700 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {event.timestamp}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-[8.5px] text-slate-500 leading-snug">{event.description}</p>
                      )}
                      {event.status === "pending" && (
                        <p className="text-[8.5px] text-slate-400">Pending</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Recruiter Notes Block */}
              <div
                className="lg:flex-1 bg-white rounded-lg border border-slate-200 p-2 flex flex-col shadow-sm overflow-visible lg:overflow-hidden min-h-[220px] lg:min-h-0"
                id="recruiter-notes-panel"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5">
                  <span className="text-xs font-bold text-indigo-950 block">
                    Recruiter Notes
                  </span>
                  <span className="text-[9px] font-bold text-indigo-700 flex items-center gap-0.5">
                    <Plus className="w-3 h-3" />
                    Add Note
                  </span>
                </div>

                {/* Input form to add note */}
                <div className="flex flex-col sm:flex-row gap-1 mb-1.5">
                  <input
                    type="text"
                    placeholder="Add recruiter feedback note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddNote();
                    }}
                    className="flex-1 px-2 py-0.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-950"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-2 py-0.5 bg-indigo-600 text-white font-bold rounded text-xs hover:bg-indigo-700 shrink-0"
                  >
                    Save
                  </button>
                </div>

                {/* Display list of active recruiter notes */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                  {notes.map((note) => (
                    <div key={note.id} className="p-1.5 bg-slate-50 rounded border border-slate-100 text-[10px] leading-snug">
                      <p className="text-slate-950 font-medium">{note.text}</p>
                      <span className="text-[8px] text-slate-600 font-bold block mt-1 text-right">
                        {note.timestamp}
                      </span>
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <div className="text-center py-4 text-[10px] text-slate-600">
                      No notes added yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}