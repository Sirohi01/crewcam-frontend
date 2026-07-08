'use client';

import React from 'react';
import {
  CheckCircle2, Clock, MapPin, FileText,
  Download, Plus, Headphones, Target, FileCheck, Users, Briefcase, UserPlus, Info,
  Check, ArrowLeft
} from 'lucide-react';

export default function ApplicationSubmittedUI() {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-2 font-sans text-zinc-900 bg-white min-h-screen">

      {/* Top Header — full width */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2 pb-2 border-b border-zinc-100">
        <div>
          <h1 className="text-[18px] lg:text-[20px] font-bold text-zinc-900 mb-0.5">Application Submitted Successfully!</h1>
          <p className="text-[11px] text-zinc-500">Your application has been submitted for the position of <span className="font-bold text-zinc-700">Sales Manager</span></p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 font-bold text-[11px] hover:bg-zinc-50 shadow-sm transition-colors">
            Go to Dashboard
          </button>
          <button className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-bold text-[11px] hover:bg-indigo-800 shadow-sm transition-colors">
            View My Applications
          </button>
        </div>
      </div>

      {/* Main 2-column grid — sidebar starts from top alongside stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-9 flex flex-col gap-2">

          {/* Stepper — inside left column */}
          <div className="w-full pb-5 border-b border-zinc-100">
            <div className="flex items-center justify-between w-full">
              {[
                { num: 1, label: 'Upload CV', state: 'done' },
                { num: 2, label: 'Review & Edit', state: 'done' },
                { num: 3, label: 'Submit Application', state: 'active' },
                { num: 4, label: 'AI Screening', state: 'pending' },
                { num: 5, label: 'HOD Review', state: 'pending' },
                { num: 6, label: 'Interview', state: 'pending' },
                { num: 7, label: 'Offer', state: 'pending' },
                { num: 8, label: 'Onboarding', state: 'pending' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${step.state === 'active'
                      ? 'bg-indigo-700 border-indigo-700 text-white shadow'
                      : step.state === 'done'
                        ? 'bg-white border-zinc-300 text-indigo-600'
                        : 'bg-white border-zinc-200 text-zinc-400'
                      }`}>
                      {step.state === 'done' ? <Check size={12} strokeWidth={3} /> : step.num}
                    </div>
                    <span className={`text-[9px] text-center leading-tight font-semibold whitespace-nowrap ${step.state === 'active' ? 'text-indigo-900 font-bold' :
                      step.state === 'done' ? 'text-zinc-600' : 'text-zinc-400'
                      }`}>
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`h-[1.5px] flex-1 mx-1 -mt-4 ${step.state === 'done' ? 'bg-indigo-200' : 'bg-zinc-100'
                      }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Success Banner */}
          <div className="bg-[#edfbf3] border border-emerald-100 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
            {/* Decorative diamonds */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute top-3 right-[36%] h-4 w-4 rotate-45 border border-emerald-200 opacity-50" />
              <div className="absolute bottom-3 right-[29%] h-3 w-3 rotate-45 border border-emerald-200 opacity-40" />
              <div className="absolute top-1/2 right-[41%] h-2.5 w-2.5 rotate-45 bg-emerald-100 opacity-50" />
              <div className="absolute top-2 right-[25%] h-2 w-2 rotate-45 bg-emerald-200 opacity-30" />
            </div>

            {/* Left: check + text */}
            <div className="flex items-center gap-4 z-10 relative">
              <div className="h-11 w-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Check size={22} strokeWidth={3} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[15px] lg:text-[17px] font-bold text-emerald-800 leading-tight">Thank you, Amit Kumar Verma!</h2>
                <p className="text-[11px] text-zinc-700">Your application for <span className="font-bold">Sales Manager</span> has been submitted successfully.</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Application ID: <span className="font-bold text-indigo-700">APP-2026-000124</span></p>
              </div>
            </div>

            {/* Right: envelope illustration */}
            <div className="hidden md:flex items-center justify-center shrink-0 z-10 mr-6">
              <div className="relative h-20 w-24">
                <div className="absolute inset-0 bg-white rounded-md border border-emerald-200 shadow-sm" />
                <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden">
                  <div className="w-full h-10 bg-emerald-100 border-b border-emerald-200"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                </div>
                <div className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next? */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-[14px] font-bold text-zinc-900 mb-0.5">What Happens Next?</h3>
              <p className="text-[11px] text-zinc-500">We follow a systematic process to review every application fairly.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {[
                { title: 'AI Screening', desc: 'Our AI will analyze your CV and match it with the job requirements.', time: '1-2 Days', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                { title: 'HOD Review', desc: 'The hiring manager will review your profile and AI screening report.', time: '2-3 Days', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                { title: 'Interview', desc: 'If shortlisted, our team will contact you for interview scheduling.', time: '3-5 Days', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { title: 'Offer', desc: 'Selected candidates will receive an offer based on the discussion.', time: 'As per process', icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                { title: 'Onboarding', desc: "Welcome aboard! We'll help you through the joining process.", time: 'After Offer', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              ].map((step, i) => (
                <div key={i} className="border border-zinc-100 rounded-xl p-3.5 bg-white shadow-sm flex flex-col items-start relative hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-lg ${step.bg} ${step.color} mb-2.5`}>
                    <step.icon size={16} />
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-900 mb-1.5">{step.title}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed mb-3 flex-1">{step.desc}</p>
                  <span className={`text-[9px] font-bold ${step.color} ${step.bg} px-2 py-1 rounded border ${step.border} w-full text-center`}>
                    {step.time}
                  </span>
                  {i < 4 && (
                    <div className="hidden xl:block absolute -right-2 top-1/2 -translate-y-1/2 text-zinc-300 z-10">
                      <ArrowLeft size={14} className="rotate-180" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email Updates */}
          <div className="bg-[#f8f7ff] rounded-xl p-3.5 flex items-center gap-3 border border-indigo-50">
            <Info size={15} className="text-indigo-500 shrink-0" />
            <p className="text-[11px] text-indigo-900">
              You will receive email updates at <span className="font-bold">amit.verma@email.com</span> and SMS on <span className="font-bold">+91 98765 43210</span> for every update.
            </p>
          </div>

          {/* Documents + Need Help */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Documents Submitted */}
            <div className="border border-zinc-100 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4">
              <h3 className="text-[12px] font-bold text-zinc-900">Documents Submitted</h3>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-start gap-2.5">
                  <div className="bg-red-50 text-red-600 px-1.5 py-1 rounded text-[8px] font-bold border border-red-100 mt-0.5">PDF</div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-900">Amit_Kumar_Verma_Resume.pdf</span>
                    <span className="text-[10px] text-zinc-500">245 KB</span>
                    <span className="text-[9px] text-zinc-400 mt-0.5">Uploaded on: 15 June 2026 | 11:32 AM</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded hover:bg-indigo-50 transition-colors shrink-0">
                  <Download size={11} /> Download
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="bg-amber-50 text-amber-600 p-1.5 rounded border border-amber-100">
                    <FileText size={13} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-900">Notes</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">You can add any additional information for the recruiter.</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 border border-indigo-100 px-2.5 py-1.5 rounded hover:bg-indigo-50 transition-colors shrink-0">
                  <Plus size={11} /> Add Note
                </button>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-[#f8f7ff] rounded-xl p-5 border border-indigo-50 flex flex-col items-start justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                  <Headphones size={18} />
                </div>
                <h3 className="text-[13px] font-bold text-indigo-950">Need Help?</h3>
              </div>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed mb-4">
                If you have any queries regarding your application, feel free to reach out to our HR team.
              </p>
              <button className="bg-white text-indigo-700 font-bold text-[11px] px-5 py-2.5 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-50 transition-colors">
                Contact HR Team
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Sidebar, starts from top (alongside stepper) */}
        <div className="lg:col-span-3 flex flex-col gap-2">

          {/* Application Summary */}
          <div className="border border-zinc-100 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4">
            <h3 className="text-[12px] font-bold text-zinc-900">Application Summary</h3>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-indigo-100 overflow-hidden shrink-0 border border-zinc-100 flex items-center justify-center text-indigo-600 font-bold text-base">
                AV
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-zinc-900">Amit Kumar Verma</span>
                <span className="text-[10px] text-zinc-500 mb-1">Sales Manager</span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-max">
                  Application Submitted
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-[10px] pt-1 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5"><FileText size={12} className="text-indigo-400" /> Application ID</span>
                <span className="font-bold text-zinc-900 text-[10px]">APP-2026-000124</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" /> Applied On</span>
                <span className="font-bold text-zinc-900 text-right">15 June 2026, 11:32 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5"><Briefcase size={12} className="text-indigo-400" /> Expected CTC</span>
                <span className="font-bold text-zinc-900">₹ 12.00 LPA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5"><FileText size={12} className="text-indigo-400" /> Notice Period</span>
                <span className="font-bold text-zinc-900">30 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 flex items-center gap-1.5"><MapPin size={12} className="text-indigo-400" /> Current Location</span>
                <span className="font-bold text-zinc-900 text-right">Noida, Uttar Pradesh</span>
              </div>
            </div>
          </div>

          {/* Application Activity */}
          <div className="border border-zinc-100 rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4 flex-1">
            <h3 className="text-[12px] font-bold text-zinc-900">Application Activity</h3>
            <div className="relative flex flex-col gap-5 pl-3">
              <div className="absolute left-[17px] top-3 bottom-5 w-px bg-zinc-200 z-0"></div>

              <div className="relative z-10 flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-900">Application Submitted</span>
                  <span className="text-[9px] text-zinc-500 mb-1">15 June 2026, 11:32 AM</span>
                  <span className="text-[10px] text-zinc-600 leading-relaxed">Your application has been submitted successfully.</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-900">Awaiting AI Screening</span>
                  <span className="text-[9px] text-zinc-500 mb-1">15 June 2026, 11:32 AM</span>
                  <span className="text-[10px] text-zinc-600 leading-relaxed">Your CV is queued for AI screening.</span>
                </div>
              </div>

              {['HOD Review', 'Interview', 'Offer', 'Onboarding'].map((title, i) => (
                <div key={i} className="relative z-10 flex items-start gap-3 opacity-50">
                  <div className="h-6 w-6 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-zinc-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-700">{title}</span>
                    <span className="text-[9px] text-zinc-400">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
