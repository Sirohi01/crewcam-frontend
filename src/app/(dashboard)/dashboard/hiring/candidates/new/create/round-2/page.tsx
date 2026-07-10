'use client';

import React from 'react';
import {
  ArrowLeft, Square, Phone, Mail, MapPin, Link2, ExternalLink,
  CheckCircle2, Clock, Check, Info, FileText, Share2, HelpCircle,
  FileQuestion, Bold, Italic, Underline, List, ListOrdered, Code,
  ThumbsUp, Flag, StopCircle, User, Sparkles
} from 'lucide-react';

export default function InterviewUI() {
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">


      {/* Header & Steps */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4  pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Interview – Round 2</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Technical Interview – AI Powered</p>
        </div>

          {/* Stepper */}
          <div className="flex-1 flex items-center justify-center overflow-x-hidden px-2">
            <div className="flex items-center justify-center w-full">
              {[
                { num: 1, label: 'Upload CV', state: 'done' },
                { num: 2, label: 'Review & Edit', state: 'done' },
                { num: 3, label: 'Submit Application', state: 'done' },
                { num: 4, label: 'AI Screening', state: 'done' },
                { num: 5, label: 'HOD Review', state: 'done' },
                { num: 6, label: 'Interview', state: 'active' },
                { num: 7, label: 'Offer', state: 'pending' },
                { num: 8, label: 'Onboarding', state: 'pending' },
              ].map((step, i, arr) => (
                <React.Fragment key={step.num}>
                  <div className="flex flex-col items-center gap-1 w-12 sm:w-14 lg:w-16">
                    <div className={`h-5 w-5 lg:h-6 lg:w-6 rounded-full flex items-center justify-center text-[9px] lg:text-[10px] font-bold border ${step.state === 'active' ? 'bg-indigo-700 border-indigo-700 text-white' :
                      step.state === 'done' ? 'bg-white border-zinc-300 text-zinc-500' :
                        'bg-white border-zinc-200 text-zinc-400'
                      }`}>
                      {step.num}
                    </div>
                    <span className={`text-[8px] lg:text-[9px] text-center leading-tight font-medium ${step.state === 'active' ? 'text-indigo-700' : 'text-zinc-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`h-[1px] w-6 sm:w-5 lg:w-8 shrink-0 -mt-4 lg:-mt-5 ${step.state === 'done' ? 'bg-zinc-300' : 'bg-zinc-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-zinc-50 shadow-sm whitespace-nowrap">
              <ArrowLeft size={13} /> Back to Applications
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors whitespace-nowrap">
              End Interview <StopCircle size={14} />
            </button>
          </div>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Profile Card */}
          <div className="xl:col-span-2 py-4">
            <div className="flex flex-col md:flex-row items-start gap-5">
              <img src="https://i.pravatar.cc/150?u=amit" alt="Amit" className="h-20 w-20 rounded-lg object-cover border border-zinc-200 shadow-sm shrink-0" />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {/* Col 1 */}
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-bold text-zinc-900">Amit Kumar Verma</h2>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Round 2 In Progress</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">Sales Manager</p>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[10px] text-zinc-600 mt-1">
                    <span className="flex items-center gap-1.5"><Phone size={12} className="text-zinc-400" /> +91 98765 43210</span>
                    <span className="flex items-center gap-1.5"><Mail size={12} className="text-zinc-400" /> amit.verma@email.com</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-400" /> Noida, Uttar Pradesh</span>
                    <span className="flex items-center gap-1.5"><Link2 size={12} className="text-zinc-400" /> linkedin.com/in/amitverma</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="flex flex-col gap-3 border-l border-zinc-200 pl-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Applied For</p>
                    <p className="text-[11px] font-bold text-zinc-900">Sales Manager</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Department</p>
                    <p className="text-[11px] font-bold text-zinc-900">Sales & Marketing</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Experience</p>
                    <p className="text-[11px] font-bold text-zinc-900">-</p>
                  </div>
                </div>

                {/* Col 3 */}
                <div className="flex flex-col justify-between border-l border-zinc-200 pl-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Current Round</p>
                    <p className="text-[11px] font-bold text-zinc-900">Round 2 – Technical Interview</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] text-zinc-500 font-medium mb-1">Interviewer</p>
                    <div className="flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?u=anjali" alt="Anjali" className="h-7 w-7 rounded-full object-cover border border-zinc-200" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-900">Anjali Mehta</span>
                        <span className="text-[9px] text-zinc-500">HR Manager</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 w-fit text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                    View Candidate Profile →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Application Summary Card */}
          <div className="py-4 flex flex-col justify-center border border-zinc-100 shadow-sm p-4 rounded-lg">
            <h3 className="text-[13px] font-bold text-zinc-900 mb-4">Application Summary</h3>
            <div className="flex flex-col gap-3 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1.5"><FileText size={12} className="text-indigo-600" /> Application ID</span>
                <span className="font-bold text-zinc-900">APP-2026-000124</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1.5"><Clock size={12} className="text-indigo-600" /> Applied On</span>
                <span className="font-bold text-zinc-900">15 Jun 2026, 11:32 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1.5"><HelpCircle size={12} className="text-indigo-600" /> Current Stage</span>
                <span className="font-bold text-zinc-900">Interview - Round 2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1.5"><Sparkles size={12} className="text-indigo-600" /> AI Screening Score</span>
                <span className="font-bold text-zinc-900">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 flex items-center gap-1.5"><User size={12} className="text-indigo-600" /> HOD Review</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Recommended</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-zinc-200 px-2">
          <button className="pb-2 text-[12px] font-bold text-indigo-700 border-b-2 border-indigo-700">Interview</button>
          <button className="pb-2 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 border-b-2 border-transparent">AI Questions</button>
          <button className="pb-2 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 border-b-2 border-transparent">Notes</button>
          <button className="pb-2 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 border-b-2 border-transparent">Attachments</button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">

          {/* Left Column (Progress) */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
              <h3 className="text-[12px] font-bold text-zinc-900 mb-1">Round Progress</h3>
              <p className="text-[10px] text-zinc-500 font-medium mb-6">Round 2 of 5<br />Technical Interview</p>

              <div className="flex items-center justify-center mb-6 relative">
                <div className="h-28 w-28 rounded-full border-[6px] border-emerald-600 border-t-zinc-100 border-l-zinc-100 flex flex-col items-center justify-center bg-white shadow-sm">
                  <span className="text-[9px] text-zinc-500 font-medium mb-0.5">Time Remaining</span>
                  <span className="text-2xl font-bold text-emerald-600 leading-none mb-1">32:45</span>
                  <span className="text-[9px] text-zinc-400">of 40:00</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4 text-[11px]">
                <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-bold">10</span></div>
                <div className="flex items-center justify-between"><span className="text-zinc-500">Answered</span><span className="font-bold">2</span></div>
                <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-bold">8</span></div>
              </div>

              <div className="mt-6 bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
                <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                  All questions are AI-generated based on the role, your profile, and previous answers.
                </p>
              </div>
            </div>


          </div>

          {/* Center Column (Question Area) */}
          <div className="lg:col-span-6 flex flex-col gap-4 h-full">
            <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-[15px] font-bold text-zinc-900">Question 3 of 10</h2>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Technical – Data Analysis</span>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 bg-white border border-rose-200 px-2 py-1 rounded hover:bg-rose-50 transition-colors shadow-sm">
                  <Flag size={12} /> Flag Question
                </button>
              </div>

              <p className="text-[13px] font-bold text-zinc-900 mb-4 leading-relaxed">
                You are given a large sales dataset with millions of records. How would you design a reliable and efficient data pipeline to process, clean, and analyze this data for reporting insights?
              </p>

              <div className="bg-[#f5f3ff] border border-indigo-100 rounded-lg p-3 mb-4 flex items-start gap-2">
                <Sparkles size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-indigo-900">AI Insight</span>
                  <p className="text-[11px] text-indigo-700 mt-1 leading-relaxed">This question evaluates your understanding of data engineering concepts, ETL/ELT pipeline design, data processing tools, and scalability.</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col border border-zinc-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
                <div className="flex items-center gap-2 border-b border-zinc-200 p-2 bg-zinc-50">
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Bold size={13} /></button>
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Italic size={13} /></button>
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Underline size={13} /></button>
                  <div className="w-px h-4 bg-zinc-300 mx-1" />
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><List size={13} /></button>
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><ListOrdered size={13} /></button>
                  <div className="w-px h-4 bg-zinc-300 mx-1" />
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Link2 size={13} /></button>
                  <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Code size={13} /></button>
                </div>
                <textarea
                  className="flex-1 w-full resize-none p-3 text-[12px] text-zinc-800 outline-none min-h-[150px]"
                  placeholder="Type your answer here..."
                ></textarea>
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-t border-zinc-100">
                  <span className="text-[10px] text-zinc-500">Minimum 50 words</span>
                  <span className="text-[10px] text-zinc-500 font-medium">0 / 2500</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 mt-3 mb-4">
                <CheckCircle2 size={13} />
                <span className="text-[10px] font-medium">Your answer is auto-saved</span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <button className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 bg-white border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 shadow-sm transition-colors">
                  <ArrowLeft size={13} /> Previous Question
                </button>
                <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-800 shadow-sm transition-colors">
                  Next Question <ArrowLeft size={13} className="rotate-180" />
                </button>
              </div>
            </div>


          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <div className="bg-[#f8f7ff] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indigo-600" />
                <h3 className="text-[12px] font-bold text-indigo-900">AI Interview Assistant</h3>
                <span className="text-[8px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">BETA</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Questions are generated in real-time based on your role & experience.",
                  "Answers are analyzed for technical accuracy, depth & clarity.",
                  "Use diagrams or code snippets wherever applicable.",
                  "Stay concise, structured and solution-focused."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 bg-indigo-100/50 rounded flex items-center justify-center shrink-0">
                      {i === 0 ? <HelpCircle size={10} className="text-indigo-600" /> :
                        i === 1 ? <FileQuestion size={10} className="text-indigo-600" /> :
                          i === 2 ? <Code size={10} className="text-indigo-600" /> :
                            <CheckCircle2 size={10} className="text-indigo-600" />}
                    </div>
                    <p className="text-[10px] text-indigo-900/80 leading-relaxed font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col">
              <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Rounds Overview</h3>
              <div className="relative pl-3 flex flex-col gap-5">
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-zinc-200 z-0"></div>

                <div className="relative z-10 flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-zinc-900">Round 1</span>
                    <span className="text-[9px] text-zinc-500">AI Screening Interview</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Completed</span>
                    <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-3 bg-[#f8f7ff] p-3 -mx-3 rounded-lg">
                  <div className="h-5 w-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-indigo-600" /></div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-indigo-700">Round 2</span>
                    <span className="text-[9px] font-semibold text-indigo-700">Technical Interview</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">In Progress</span>
                    <span className="text-[9px] text-indigo-500 font-medium">40 Min</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-3 opacity-60">
                  <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">3</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-zinc-800">Round 3</span>
                    <span className="text-[9px] text-zinc-500">Managerial Interview</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                    <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-3 opacity-60">
                  <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">4</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-zinc-800">Round 4</span>
                    <span className="text-[9px] text-zinc-500">Written Assessment</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                    <span className="text-[9px] text-zinc-500 font-medium">45 Min</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-start gap-3 opacity-60">
                  <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">5</div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-zinc-800">Round 5</span>
                    <span className="text-[9px] text-zinc-500">HR Interview</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                    <span className="text-[9px] text-zinc-500 font-medium">25 Min</span>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>

        {/* Bottom Grid: 3 columns with gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 ">

          {/* Your Previous Answer */}
          <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-zinc-900 mb-4">Your Previous Answer (Q2)</h3>
            <div className="flex items-start gap-2 mb-3">
              <div className="h-5 w-5 bg-[#f0f9f4] text-emerald-600 rounded flex items-center justify-center shrink-0 font-bold text-[9px] border border-emerald-100">Q.2</div>
              <p className="text-[10px] font-bold text-zinc-900 mt-0.5 leading-relaxed">Explain a time when you used data to influence a critical business decision. What was the impact?</p>
            </div>
            <div className="bg-[#f4fbf7] rounded p-3 text-[10px] text-zinc-700 border border-emerald-50 mt-3 line-clamp-3 leading-relaxed">
              I analyzed customer purchase patterns and identified a drop in repeat orders. Based on the insights, we improved the follow-up strategy which increased repeat orders by 18% in the next quarter.
              <div className="text-right w-full mt-3">
                <button className="text-[9px] font-bold text-indigo-700 hover:underline">View Full Answer</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: HelpCircle, label: 'Request Clarification', desc: 'Ask for more details about the question' },
                { icon: FileText, label: 'Add Interview Note', desc: 'Make a note about candidate\'s response' },
                { icon: Share2, label: 'Share Feedback', desc: 'Share feedback with the interview panel' },
                { icon: Code, label: 'Add Code Snippet / Attachment', desc: 'Upload diagram, code, or file' },
              ].map((action, i) => (
                <button key={i} className="flex items-start gap-3 text-left group">
                  <div className="p-1.5 bg-[#f8f7ff] group-hover:bg-indigo-50 text-indigo-600 rounded mt-0.5 border border-indigo-50">
                    <action.icon size={13} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-800 group-hover:text-indigo-700">{action.label}</span>
                    <span className="text-[9px] text-zinc-500">{action.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interview Guidelines */}
          <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Guidelines</h3>
            <ul className="flex flex-col gap-3 text-[10px] text-zinc-600">
              <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Ensure a quiet environment.</li>
              <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Use headphones for better experience.</li>
              <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Do not refresh or close the browser.</li>
              <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> AI will evaluate your responses in real-time.</li>
              <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> You can use notepad for rough work.</li>
            </ul>
            <button className="text-[10px] font-bold text-indigo-700 hover:underline mt-5 flex items-center gap-1">
              Need Help? View Guidelines <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

