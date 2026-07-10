"use client";

import React from 'react';
import {
  CheckCircle,
  Mail,
  AlertCircle,
  FileText,
  Download,
  MessageSquare,
  Send,
  ChevronRight,
  Sparkles,
  ClipboardList,
  Gift,
  UserCheck,
  Headphones,
  Clock,
  MapPin,
  IndianRupee,
  Hash,
  Calendar,
  Plus,
  LayoutDashboard,
  Briefcase
} from 'lucide-react';
import { CandidateInfo, Note, PortalView } from './types';
import PageLayout from '@/components/ui/pageLayout';

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

const defaultNotes: Note[] = [
];

// 8-step application journey (matches full stepper in the reference design)
type StepStatus = "completed" | "current" | "pending";
interface JourneyStep {
  label: string;
  status: StepStatus;
}

const journeySteps: JourneyStep[] = [
  { label: "Upload CV", status: "completed" },
  { label: "Review & Edit", status: "completed" },
  { label: "Submit Application", status: "current" },
  { label: "AI Screening", status: "pending" },
  { label: "HOD Review", status: "pending" },
  { label: "Interview", status: "pending" },
  { label: "Offer", status: "pending" },
  { label: "Onboarding", status: "pending" }
];

interface SubmittedPageProps {
  setCurrentView: (view: PortalView) => void;
}

export default function SubmittedPage({
  setCurrentView
}: SubmittedPageProps) {
  // Local State
  const [candidate, setCandidate] = React.useState<CandidateInfo>(defaultCandidate);
  const [notes, setNotes] = React.useState<Note[]>(defaultNotes);
  const [newNoteText, setNewNoteText] = React.useState<string>("");
  const [showNoteInput, setShowNoteInput] = React.useState<boolean>(false);

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

const handleDownloadCV = () => {
  const link = document.createElement('a');
  link.href = "https://drive.google.com/uc?export=download&id=1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN";
  link.download = 'CV.pdf';
  link.click();
};

  const pipelineSteps = [
    { title: "AI Screening", delay: "1-2 Days", desc: "Our AI will analyze your CV and match it with the job requirements.", icon: Sparkles, active: true, stage: 'evaluation' as PortalView },
    { title: "HOD Review", delay: "2-3 Days", desc: "The hiring manager will review your profile and AI screening report.", icon: ClipboardList, active: false, stage: 'submitted' as PortalView },
    { title: "Interview", delay: "3-5 Days", desc: "If shortlisted, our team will contact you for interview scheduling.", icon: MessageSquare, active: false, stage: 'submitted' as PortalView },
    { title: "Offer", delay: "As per process", desc: "Selected candidates will receive an offer based on the discussion.", icon: Gift, active: false, stage: 'submitted' as PortalView },
    { title: "Onboarding", delay: "After Offer", desc: "Welcome aboard! We'll help you through the joining process.", icon: UserCheck, active: false, stage: 'submitted' as PortalView }
  ];

  const summaryFields = [
    { icon: Hash, label: "Application ID", value: "APP-2026-000124" },
    { icon: Calendar, label: "Applied On", value: "15 June 2026, 11:32 AM" },
    { icon: IndianRupee, label: "Expected CTC", value: `₹ ${candidate.expectedCTC}` },
    { icon: Clock, label: "Notice Period", value: candidate.noticePeriod },
    { icon: MapPin, label: "Current Location", value: candidate.currentLocation }
  ];

  return (
    <PageLayout>
    <div className="w-full h-auto overflow-y-auto lg:overflow-hidden flex flex-col bg-slate-50 font-sans text-slate-900 select-none" id="submitted-page-root">
      <header className="min-h-[70px] lg:h-[9%] lg:min-h-[56px] bg-white border-b border-slate-100 px-3 lg:px-4 py-2 lg:py-0 flex flex-col md:flex-row md:items-center items-start justify-between gap-2 shrink-0">
        <div>
          <h1 className="font-display font-bold text-base sm:text-lg text-indigo-950 leading-tight">
            Application Submitted Successfully!
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Your application has been submitted for the position of{" "}
            <span className="font-bold text-slate-900">{candidate.appliedFor}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => alert("Navigating to Dashboard...")}
            className="flex-1 sm:flex-none justify-center px-3 py-2 sm:py-1.5 text-xs border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {/* <LayoutDashboard className="w-3.5 h-3.5" /> */}
            <span className="hidden xs:inline sm:inline">Go to Dashboard</span>
          </button>
          <button
            onClick={() => alert("Navigating to My Applications...")}
            className="flex-1 sm:flex-none justify-center px-3 py-2 sm:py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {/* <Briefcase className="w-3.5 h-3.5" /> */}
            <span>View My Applications</span>
          </button>
        </div>
      </header>

   

      {/* =========================================================================
          3. MAIN CONTAINER
          ========================================================================= */}
      <div className="flex-1 lg:h-[84%] overflow-visible lg:overflow-hidden flex flex-col bg-slate-50 gap-2 p-2">
        <div
          className="w-full h-auto lg:h-full flex flex-col lg:flex-row gap-2 overflow-visible lg:overflow-hidden"
          id="submitted-step-container"
        >
          {/* Left Column: Success Details, Timeline & Docs (68% width) */}
          <div className="w-full lg:w-[70%] h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-y-auto lg:pr-1" id="submitted-left-column">
   {/* =========================================================================
          2. FULL 8-STEP JOURNEY STEPPER
          ========================================================================= */}
      <section className="min-h-[46px] lg:h-[7%] bg-white border-b border-slate-100 px-3 lg:px-4 py-1.5 lg:py-0 flex items-center overflow-x-auto shrink-0">
        <div className="w-full min-w-max lg:min-w-0 flex items-center justify-between gap-1 lg:gap-0">
          {journeySteps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1 min-w-[56px] lg:min-w-[64px]">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border-2 ${
                    step.status === "completed"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                      : step.status === "current"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-400 border-slate-300"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </span>
                <span
                  className={`text-[9px] font-medium text-center leading-tight whitespace-nowrap ${
                    step.status === "pending" ? "text-slate-400" : "text-slate-800"
                  } ${step.status === "current" ? "font-bold text-indigo-950" : ""}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < journeySteps.length - 1 && (
                <div
                  className={`flex-1 min-w-[16px] h-[2px] mb-4 ${
                    step.status === "completed" ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
            {/* 1. Main Welcome Congrats Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs" id="congrats-card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-300 text-emerald-700 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm text-emerald-950">
                    Thank you, {candidate.fullName}!
                  </h2>
                  <p className="text-[11px] text-slate-800 leading-relaxed mt-0.5">
                    Your application for <span className="font-bold text-indigo-950">{candidate.appliedFor}</span> has been submitted successfully.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono text-emerald-800 py-0.5 rounded  font-bold">
                      Application ID: APP-2026-000124
                    </span>
                    {/* <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                      Status: Awaiting AI Screening
                    </span> */}
                  </div>
                </div>
              </div>

              <div className="hidden md:block bg-white p-2 rounded-lg border border-emerald-100 shadow-xs shrink-0">
                <Mail className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
            </div>

            {/* 2. "What Happens Next?" Pipeline Milestones */}
            <div className="space-y-1" id="pipeline-milestones">
              <div className="flex items-center justify-between my-4">
                <div>
                  <h3 className="text-xs font-bold text-indigo-950">What Happens Next?</h3>
                  <p className="text-xs text-slate-600 mt-0.5">We follow a systematic process to review every application fairly.</p>
                </div>
              </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-1.5 my-4">
  {pipelineSteps.map((step, idx) => {
    const Icon = step.icon;

    return (
      <div key={idx} className="flex items-center">
        {/* Card */}
        <div
          onClick={() => {
            if (step.stage === "evaluation") {
              setCurrentView("evaluation");
            } else {
              alert(
                `This represents the subsequent ${step.title} stage. You can click on "AI Screening" to view detailed scoring!`
              );
            }
          }}
          className={`flex-1 p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col ${
            step.active
              ? "bg-indigo-50 border-indigo-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 ${
              step.active
                ? "bg-indigo-100 text-indigo-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>

          <span
            className={`text-[10px] font-bold ${
              step.active ? "text-indigo-950" : "text-slate-800"
            }`}
          >
            {step.title}
          </span>

          <p className="text-[9px] text-slate-700 leading-tight mt-1 flex-1">
            {step.desc}
          </p>

          <span
            className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full mt-1.5 self-start ${
              step.active
                ? "bg-indigo-100 text-indigo-800"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {step.delay}
          </span>
        </div>

        {/* Arrow (Desktop only) */}
        {idx < pipelineSteps.length - 1 && (
          <div className="hidden md:flex items-center justify-center mx-3 shrink-0">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>
    );
  })}
</div>
            </div>

            {/* 3. Info Banner regarding SMS / Email Updates */}
            <div className="bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 flex items-start sm:items-center gap-2 text-[10px] text-indigo-950" id="sms-info-banner">
              <AlertCircle className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              <span>
                You will receive email updates at<span className="font-bold underline break-all">{candidate.email}</span> and SMS on <span className="font-bold">{candidate.mobile}</span> for every update.
              </span>
            </div>

            {/* 4. Documents Submitted (full width) */}
      

            {/* 5. Bottom Grid: Notes & Need Help (matches reference layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2" id="submitted-bottom-grid">
<div className='rounded-lg border border-slate-200 p-4 bg-white flex flex-col gap-4'>
      <div className="border-b border-slate-200  shadow-sm" id="documents-box">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1 mb-1.5 pb-0.5 border-b border-slate-100">
                <FileText className="w-3.5 h-3.5 text-indigo-700" />
                Documents Submitted
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-2 p-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="bg-rose-100 text-rose-700 font-bold px-1.5 py-1 text-[9px] rounded uppercase shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-900 block truncate max-w-[220px]">
                      {candidate.fullName.replace(/\s+/g, '_')}_Resume.pdf
                    </span>
                    <span className="text-[8px] text-slate-600 block">
                      245 KB
                    </span>
                       <span className="text-[8px] text-slate-600 block">
                      Uploaded on 15 June 2026 | 11:32 AM
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadCV}
                  className="p-1.5 sm:p-1 hover:bg-indigo-50 border border-slate-200 rounded text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5 transition-colors text-[9px] font-bold shrink-0"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>
              {/* Left Box: Notes */}
              <div className=" flex flex-col shadow-sm" id="recruiter-notes-box">
                <div className="flex items-center justify-between mb-1 pb-0.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-700" />
                    Notes ({notes.length})
                  </h4>
                  <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className="px-2 py-1 sm:py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-[9px] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Note
                  </button>
                </div>

                {!showNoteInput && notes.length === 0 && (
                  <p className="text-[9px] text-slate-600 leading-normal mt-1">
                    You can add any additional information for the recruiter.
                  </p>
                )}

                {showNoteInput && (
                  <div className="flex gap-1.5 my-1.5">
                    <input
                      type="text"
                      placeholder="Type notes for recruiters..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote();
                      }}
                      autoFocus
                      className="flex-1 min-w-0 px-2 py-1.5 sm:py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-900"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-2.5 py-1.5 sm:py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-xs flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="space-y-1 max-h-[120px] sm:max-h-[85px] overflow-y-auto pr-1 mt-1">
                  {notes.map(note => (
                    <div key={note.id} className="p-1 bg-slate-50 rounded border border-slate-100 text-[9px] leading-tight text-slate-800">
                      <p className="text-slate-900 font-medium">{note.text}</p>
                      <span className="text-[8px] text-slate-600 font-bold block mt-0.5 text-right">
                        {note.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
</div>

              {/* Right Box: Need Help */}
              <div className="bg-indigo-50/50 rounded-lg border border-indigo-100 p-4 flex flex-col justify-between shadow-sm" id="need-help-box">
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-700 flex-shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-indigo-950 text-xs block">Need Help?</span>
                    <p className="text-xs text-slate-800 leading-normal mt-0.5">
                      If you have any queries regarding your application, feel free to reach out to our HR team.
                    </p>
                <button
                  onClick={() => alert("Connecting to HR Talent Team...\nHotline: hr-support@portal.com")}
                  className="px-2 py-1.5 sm:py-1 bg-white border border-indigo-300 text-indigo-700 rounded text-[10px] font-bold hover:bg-indigo-100 transition-colors mt-2 self-start"
                >
                  Contact HR Team
                </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Application Summary Card & Vertical Activity Logs (32% width) */}
          <div className="w-full lg:w-[30%] h-auto lg:h-full flex flex-col gap-2 overflow-visible lg:overflow-hidden" id="submitted-right-column">

            {/* 1. Candidate Application Summary Badge */}
            <div className="bg-white rounded-lg border border-slate-200 p-2 flex flex-col items-center text-center shadow-sm shrink-0" id="submitted-summary-badge">
              <div className="flex self-start gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-600 overflow-hidden bg-indigo-50">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="Amit"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
<div className='flex flex-col items-start min-w-0'>

              <h3 className="font-display font-bold text-xs text-indigo-950 mt-1 leading-none">
                {candidate.fullName}
              </h3>
              <p className="text-[9px] text-slate-800 font-semibold mt-0.5">
                {candidate.appliedFor} • {candidate.department}
              </p>

              <span className="bg-indigo-100 text-indigo-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 border border-indigo-200">
                Application Submitted Successfully
              </span>
</div>
</div>
              {/* Summary fields Table with icons */}
              <div className="w-full mt-2 space-y-1 text-left text-[10px] text-slate-800 border-t border-slate-100 pt-1.5">
                {summaryFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.label} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 font-medium text-slate-600 shrink-0">
                        <Icon className="w-3 h-3 text-indigo-600" />
                        {field.label}
                      </span>
                      <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-[120px]">{field.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Interactive Application Activity Vertical Timeline */}
            <div className="lg:flex-1 bg-white rounded-lg border border-slate-200 p-2 flex flex-col shadow-sm overflow-visible lg:overflow-hidden min-h-[280px] lg:min-h-0" id="activity-logs-box">
              <span className="text-xs font-bold text-indigo-950 border-b border-slate-100 pb-1 mb-1.5 block">
                Application Activity Tracker
              </span>

              <div className="flex-1 overflow-visible lg:overflow-y-auto pr-0.5 space-y-3.5 max-h-[420px] lg:max-h-none">
                {[
                  { title: "Application Submitted", date: "15 June 2026, 11:32 AM", active: true, checked: true, desc: "Your application has been submitted successfully" },
                  { title: "Awaiting AI Screening", date: "15 June 2026, 11:32 AM", active: true, checked: false, desc: "CV matches queued for algorithmic screening.", current: true },
                  { title: "HOD Review", date: "Pending", active: false, checked: false, desc: "" },
                  { title: "Interview", date: "Pending", active: false, checked: false, desc: "" },
                  { title: "Offer", date: "Pending", active: false, checked: false, desc: "" },
                  { title: "Onboarding", date: "Pending", active: false, checked: false, desc: "" }
                ].map((act, i) => (
                  <div key={i} className="flex gap-2 text-[10px]">
                    <div className="flex flex-col items-center shrink-0">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] border ${
                        act.checked
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                          : act.current
                          ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse'
                          : 'bg-slate-100 border-slate-300 text-slate-500'
                      }`}>
                        {act.checked ? "✓" : act.current ? <Clock className="w-2.5 h-2.5" /> : i + 1}
                      </span>
                      {i < 5 && <div className={`w-[2px] flex-1 min-h-[14px] mt-1 ${act.active ? 'bg-indigo-400' : 'bg-slate-200'}`} />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex flex-wrap flex-col justify-between gap-x-2">
                        <span className={`font-bold ${act.active ? 'text-indigo-950' : 'text-slate-800'}`}>
                          {act.title}
                        </span>
                        <span className="text-[7.5px] text-slate-600 font-semibold font-mono whitespace-nowrap">
                          {act.date}
                        </span>
                      </div>
                      <p className="text-[8.5px] text-slate-700 leading-tight mt-0.5">
                        {act.desc}
                      </p>
                    
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}