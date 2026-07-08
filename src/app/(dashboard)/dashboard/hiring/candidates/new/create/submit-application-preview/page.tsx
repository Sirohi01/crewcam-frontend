"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  Check,
  Download,
  ExternalLink,
  User,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  Info,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

/* --------------------------------------------------------------------- */
/* Types                                                                 */
/* --------------------------------------------------------------------- */

type StepStatus = "done" | "active" | "upcoming";

interface StepItem {
  id: number;
  label: string;
  status: StepStatus;
}

interface ReviewSection {
  id: string;
  title: string;
  summary: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface ExtractionMetric {
  label: string;
  confidence: number;
}

interface CandidateSummary {
  fullName: string;
  role: string;
  email: string;
  mobile: string;
  currentLocation: string;
  linkedin: string;
  appliedFor: string;
  department: string;
  employmentType: string;
  noticePeriod: string;
  expectedCTC: string;
  availableFrom: string;
  photoUrl: string;
}

interface SubmitApplicationPreviewProps {
  onBack?: () => void;
  onSubmit?: () => void;
  onEditSection?: (sectionId: string) => void;
}

/* --------------------------------------------------------------------- */
/* Static data                                                           */
/* --------------------------------------------------------------------- */

const steps: StepItem[] = [
  { id: 1, label: "Upload CV", status: "done" },
  { id: 2, label: "Review & Edit", status: "done" },
  { id: 3, label: "Submit Application", status: "active" },
];

const candidate: CandidateSummary = {
  fullName: "Amit Kumar Verma",
  role: "Sales Manager",
  email: "amit.verma@email.com",
  mobile: "+91 98765 43210",
  currentLocation: "Noida, Uttar Pradesh",
  linkedin: "linkedin.com/in/amitverma",
  appliedFor: "Sales Manager",
  department: "Sales & Marketing",
  employmentType: "Full Time",
  noticePeriod: "30 Days",
  expectedCTC: "₹ 12.00 LPA",
  availableFrom: "15 June 2026",
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
};

const reviewSections: ReviewSection[] = [
  {
    id: "personal",
    title: "Personal Information",
    summary: "Amit Kumar Verma • amit.verma@email.com • +91 98765 43210 • Noida, Uttar Pradesh",
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "application",
    title: "Application Details",
    summary: "Sales Manager • Sales & Marketing • Full Time • 7 Years Exp • Expected CTC: ₹ 12.00 LPA",
    icon: Briefcase,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "education",
    title: "Education & Skills",
    summary: "MBA - Marketing (Amity University) • BBA (Delhi University) • 8 Skills",
    icon: GraduationCap,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    id: "experience",
    title: "Experience",
    summary: "7 Years of Total Experience • 3 Companies • Sales & Business Development",
    icon: Briefcase,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "other",
    title: "Other Information",
    summary: "Available From: 15 June 2026 • Notice Period: 30 Days • Relocation: Yes",
    icon: Info,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    id: "documents",
    title: "Documents",
    summary: "CV: Amit_Kumar_Verma_Resume.pdf • Size: 245 KB",
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

const extractionMetrics: ExtractionMetric[] = [
  { label: "Personal Information", confidence: 95 },
  { label: "Application Details", confidence: 92 },
  { label: "Education Details", confidence: 92 },
  { label: "Experience Details", confidence: 91 },
  { label: "Skills Match", confidence: 88 },
];

const cvDriveFileId = "1v9E-G1x-oau8y8te_QeluAIW7z5NHBpN";
const cvDriveViewUrl = `https://drive.google.com/file/d/${cvDriveFileId}/view?usp=drive_link`;
const cvDrivePreviewUrl = `https://drive.google.com/file/d/${cvDriveFileId}/preview`;
const cvDriveDownloadUrl = `https://drive.google.com/uc?export=download&id=${cvDriveFileId}`;

/* --------------------------------------------------------------------- */
/* Component                                                             */
/* --------------------------------------------------------------------- */

export default function SubmitApplicationPreview({
  onBack,
  onSubmit,
  onEditSection,
}: SubmitApplicationPreviewProps) {
  const [declared, setDeclared] = useState<boolean>(true);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleEdit = (id: string) => {
    if (onEditSection) onEditSection(id);
  };

  const handleSubmit = () => {
    if (!declared || submitting) return;
    setSubmitting(true);
    if (onSubmit) onSubmit();
    window.setTimeout(() => setSubmitting(false), 1200);
    window.open('/dashboard/hiring/candidates/new/create/submit-application', '_blank')
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <div
      className="w-full bg-slate-50 flex flex-col font-sans min-h-[650px] lg:h-[calc(100%-48px)] lg:overflow-hidden"
      id="submit-application-root"
    >
      {/* ================= Header ================= */}
      <header className="w-full bg-white border-b border-slate-200 px-2 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shrink-0">
        <div className="flex flex-col min-w-0">
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Submit Application</h1>
          <p className="text-[10px] leading-tight">
            Review all details before submitting the application for screening
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-1 text-xs shrink-0">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] border ${step.status === "done"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : step.status === "active"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-100 text-slate-600 border-slate-300"
                    }`}
                >
                  {step.status === "done" ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    step.id
                  )}
                </span>

                <span
                  className={`whitespace-nowrap ${step.status === "active"
                      ? "text-indigo-900 font-bold"
                      : "font-medium text-slate-700"
                    }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`w-6 h-[1px] shrink-0 ${step.status === "done" ? "bg-emerald-300" : "bg-slate-200"
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 sm:flex-none justify-center px-2 py-1 text-[11px] font-medium border border-slate-300 text-slate-700 rounded flex items-center gap-1 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!declared || submitting}
            className="flex-1 sm:flex-none justify-center px-2 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded flex items-center gap-1 hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <Send className="w-3 h-3" />
            <span>{submitting ? "Submitting..." : "Submit Application"}</span>
          </button>
        </div>
      </header>

      {/* ================= Main ================= */}
      <div className="flex-1 lg:min-h-0 flex flex-col lg:flex-row gap-2 p-2 lg:overflow-hidden">
        {/* ---------- Left column ---------- */}
        <div className="w-full lg:w-[64%] flex flex-col gap-2 lg:h-full lg:min-h-0 lg:overflow-hidden">
          {/* Candidate summary card */}
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col sm:flex-row flex-start gap-2 shrink-0">
            <div className="flex gap-2 min-w-0">
              <img
                src={candidate.photoUrl}
                alt={candidate.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 truncate">{candidate.fullName}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2" />
                    AI Extracted
                  </span>
                </div>
                <span className="text-[10px]  block truncate">{candidate.role}</span>
                <div className="flex flex-col gap-x-2 gap-y-0.5 mt-1 text-[9px]">
                  <div className="flex flex-wrap gap-2">
                    <a href={`tel:${candidate.mobile}`} className="flex items-center gap-0.5 hover:text-indigo-700">
                      <Phone className="w-2.5 h-2.5" /> {candidate.mobile}
                    </a>
                    <a href={`mailto:${candidate.email}`} className="flex items-center gap-0.5 hover:text-indigo-700 truncate">
                      <Mail className="w-2.5 h-2.5" /> {candidate.email}
                    </a>
                  </div>
                  <div>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {candidate.currentLocation}
                    </span>
                  </div>
                  <a
                    href={`https://${candidate.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-0.5 hover:text-indigo-700 truncate"
                  >
                    <FaLinkedin className="w-2.5 h-2.5" /> {candidate.linkedin}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-2 sm:ml-4 text-[9px] shrink-0">
              <div className="flex flex-col border-r border-slate-100 px-2">
                <div className="pb-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Applied For
                  </div>
                  <div className="font-bold text-slate-900">{candidate.appliedFor}</div>
                </div>

                <div className="py-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Department
                  </div>
                  <div className="font-bold text-slate-900">{candidate.department}</div>
                </div>

                <div className="py-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Employment Type
                  </div>
                  <div className="font-bold text-slate-900">{candidate.employmentType}</div>
                </div>

                <div className="pt-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Notice Period
                  </div>
                  <div className="font-bold text-slate-900">{candidate.noticePeriod}</div>
                </div>
              </div>

              <div className="flex flex-col px-2">
                <div className="pb-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Expected CTC
                  </div>
                  <div className="font-bold text-slate-900">{candidate.expectedCTC}</div>
                </div>

                <div className="py-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Available From
                  </div>
                  <div className="font-bold text-slate-900">{candidate.availableFrom}</div>
                </div>

                <div className="pt-1">
                  <div className="font-semibold text-[8px] tracking-wider text-slate-500">
                    Current Location
                  </div>
                  <div className="font-bold text-slate-900">{candidate.currentLocation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Review list + declaration + next steps */}
          <div className="flex-1 lg:min-h-0 bg-white border border-slate-200 rounded-lg flex flex-col lg:overflow-hidden">
            <div className="px-2 py-1.5 border-b border-slate-100 shrink-0">
              <h2 className="text-xs font-bold text-indigo-700">Review Application Details</h2>
            </div>

            <div className="flex-1 lg:overflow-y-auto p-2 space-y-1.5">
              {reviewSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.id}
                    className="flex items-center gap-2 p-1.5 border border-slate-100 rounded hover:border-slate-200 transition-colors"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-indigo-100`}>
                      <Icon className={`w-3.5 h-3.5 text-indigo-600`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-900">{section.title}</div>
                      <div className="text-[9px]  truncate">{section.summary}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEdit(section.id)}
                      className="px-2 py-1 text-[9px] font-bold border border-slate-300 text-slate-700 rounded hover:bg-slate-50 shrink-0 transition-colors"
                    >
                      Edit
                    </button>
                    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                );
              })}

              {/* Declaration */}
            </div>
            <button
              type="button"
              onClick={() => setDeclared((v) => !v)}
              className="w-full flex items-start justify-between gap-2 p-2 rounded border border-indigo-100 bg-indigo-50 text-left mt-2"
            >
              <div>
                <div className="text-[10px] font-bold text-indigo-900">Declaration</div>
                <div className="text-[9px] ">
                  I confirm that the information provided is true and correct to the best of my knowledge.
                </div>
              </div>
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${declared ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300"
                  }`}
              >
                {declared && <Check className="w-2.5 h-2.5 text-white" />}
              </span>
            </button>

            {/* What happens next */}
            <div className="flex items-start gap-2 p-2 rounded border border-emerald-100 bg-emerald-50">
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
              <div>
                <div className="text-[10px] font-bold text-emerald-900">What happens next?</div>
                <div className="text-[9px] ">
                  Once submitted, this application will be sent for AI screening and then reviewed by the HOD.
                  You will be notified about the next steps via email.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handleBack}
                className="px-2 py-1.5 text-[11px] font-bold border border-indigo-300 text-indigo-700 rounded flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Edit</span>
              </button>
              <div className="flex flex-col items-stretch sm:items-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!declared || submitting}
                  className="px-3 py-1.5 text-[11px] font-bold bg-indigo-600 text-white rounded flex items-center justify-center gap-1 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                </button>
                <span className="text-[8px]  mt-0.5 text-center sm:text-right text-indigo-600 font-semibold">Application will be sent for screening</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Right column ---------- */}
        <div className="w-full lg:w-[36%] flex flex-col gap-2 lg:h-full lg:min-h-0 lg:overflow-hidden">
          {/* CV Preview */}
          <div className="h-[560px] lg:h-auto lg:flex-[4] lg:min-h-0 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shrink-0 lg:shrink">
            <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between gap-1 shrink-0">
              <span className="text-[11px] font-bold truncate">Original CV Preview</span>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={cvDriveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-1.5 h-5 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-[8px] font-bold  gap-0.5"
                  aria-label="Open CV in Google Drive"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  Open
                </a>
                <a
                  href={cvDriveDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50"
                  aria-label="Download CV"
                >
                  <Download className="w-2.5 h-2.5 " />
                </a>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-slate-100">
              <iframe
                src={cvDrivePreviewUrl}
                className="w-full h-full border-0"
                allow="autoplay"
                title="Original_CV.pdf"
              />
            </div>
          </div>

          {/* AI Extraction Summary + Suggestion */}
          <div className="lg:flex-[1.3] lg:min-h-0 flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg p-2 lg:overflow-y-auto">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-900">AI Extraction Summary</span>
              </div>
              <div className="space-y-1">
                {extractionMetrics.map((m) => (
                  <div key={m.label} className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1 text-[9px] text-slate-700 truncate">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      {m.label}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 shrink-0">{m.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            {showSuggestion && (
              <div className="flex-1 min-w-0 bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <BadgeCheck className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-900">AI Suggestion</span>
                  </div>
                  <p className="text-[9px]  leading-snug">
                    The extracted information looks good. Please review all details before submitting.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuggestion(false)}
                  className="mt-1 px-2 py-1 text-[9px] font-bold bg-white text-indigo-700 border border-indigo-200 rounded flex items-center justify-center gap-0.5 hover:bg-indigo-100 transition-colors"
                >
                  View Suggestions
                  <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}