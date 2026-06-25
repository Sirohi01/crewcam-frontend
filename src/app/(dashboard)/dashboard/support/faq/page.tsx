'use client';

import React from 'react';
import { 
  Search, ChevronRight, Info, Users, Calendar, FileText, Shield, 
  HelpCircle, ChevronDown, MessageSquare, Send, Headphones, 
  Ticket, Phone, Clock, MessageCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 1, title: 'General', desc: 'General questions and company information', articles: '12 Articles', icon: <Info size={20} />, color: 'text-blue-600 bg-blue-50', linkColor: 'text-blue-600' },
  { id: 2, title: 'Hiring Process', desc: 'Everything about recruitment & hiring', articles: '18 Articles', icon: <Users size={20} />, color: 'text-emerald-600 bg-emerald-50', linkColor: 'text-emerald-600' },
  { id: 3, title: 'Attendance', desc: 'Attendance, leaves & working hours', articles: '14 Articles', icon: <Calendar size={20} />, color: 'text-orange-500 bg-orange-50', linkColor: 'text-orange-500' },
  { id: 4, title: 'Payroll', desc: 'Salary, payslips & compensation', articles: '10 Articles', icon: <FileText size={20} />, color: 'text-rose-500 bg-rose-50', linkColor: 'text-rose-500' },
  { id: 5, title: 'Policies', desc: 'Company policies & guidelines', articles: '16 Articles', icon: <Shield size={20} />, color: 'text-indigo-600 bg-indigo-50', linkColor: 'text-indigo-600' },
];

const POPULAR_QUESTIONS = [
  "How do I apply for leave?",
  "What is the interview process?",
  "How is my performance evaluated?",
  "How can I reset my password?",
  "Where can I view my payslip?",
  "How do I update my personal information?",
  "Who should I contact for IT support?",
  "What are the working hours?",
];

export default function FAQPage() {
  return (
    <div className="flex h-[calc(100vh-3rem)] w-full overflow-hidden bg-white">
      
      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.6);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* LEFT COLUMN - MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-5xl p-4 lg:p-6 flex flex-col gap-5">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">FAQ & Help Center</h1>
            <p className="mt-1 text-sm text-slate-500">Find answers to common questions or get help from our AI assistant.</p>
          </div>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#f8fafc] border border-slate-100 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How can we help you?</h2>
              
              <div className="relative flex items-center mb-4 shadow-sm rounded-full">
                <input 
                  type="text" 
                  placeholder="Search for answers, topics or keywords..." 
                  className="w-full rounded-full border border-slate-200 bg-white py-3 pl-5 pr-12 text-[14px] outline-none placeholder:text-slate-400 focus:border-[#0e4778] focus:ring-1 focus:ring-[#0e4778] transition-all"
                />
                <button className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                  <Search size={16} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-slate-600">Popular searches:</span>
                {['Leave Policy', 'Interview Process', 'Payslip', 'Attendance Rules'].map(tag => (
                  <button key={tag} className="text-[12px] font-bold text-blue-600 hover:underline">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative 3D-like Element */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full blur-2xl opacity-30"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-xl ml-4">
                  <span className="text-white text-5xl font-bold drop-shadow-md">?</span>
                </div>
                {/* Small floating bubble */}
                <div className="absolute -left-4 bottom-2 h-10 w-12 rounded-xl bg-white shadow-lg backdrop-blur-sm border border-slate-100">
                  <div className="flex flex-col gap-1.5 p-2 px-2.5">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-1.5 w-2/3 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -right-2 top-0 h-8 w-10 rounded-xl bg-white shadow-lg backdrop-blur-sm border border-slate-100">
                  <div className="flex flex-col gap-1 p-1.5">
                    <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browse by Category */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-slate-900">Browse by Category</h3>
              <div className="flex gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 shadow-sm"><ChevronLeftIcon /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0e4778] shadow-sm"><ChevronRight size={14} /></button>
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="flex min-w-[180px] flex-col rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm hover:border-slate-200 hover:shadow-md transition-all cursor-pointer shrink-0">
                  <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${cat.color} scale-90`}>
                    {cat.icon}
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-900 mb-1">{cat.title}</h4>
                  <p className="text-[11px] text-slate-500 mb-2 line-clamp-2 leading-snug">{cat.desc}</p>
                  <div className={`mt-auto flex items-center text-[10px] font-bold ${cat.linkColor}`}>
                    {cat.articles} <ArrowRightIcon className="ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Questions */}
          <div className="flex flex-col gap-2 pb-2">
            <h3 className="text-[17px] font-bold text-slate-900">Popular Questions</h3>
            
            <div className="flex flex-col">
              {POPULAR_QUESTIONS.map((q, i) => (
                <div key={i} className={`flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-500 shrink-0">
                      <HelpCircle size={12} />
                    </div>
                    <span className="font-bold text-slate-800 text-[14px]">{q}</span>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-blue-600 hover:bg-slate-50 shadow-sm transition-colors">
                View All FAQs <ArrowRightIcon />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN - SIDEBAR */}
      <div className="hidden xl:flex w-[350px] shrink-0 flex-col overflow-y-auto custom-scrollbar border-l border-slate-100 bg-slate-50/30 p-4">
        
        {/* AI Assistant */}
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              <MessageCircle size={14} />
            </div>
            <h3 className="text-[15px] font-bold text-slate-900">AI Assistant</h3>
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">BETA</span>
          </div>

          <p className="text-[13px] font-medium text-slate-700 mb-3">Hi <b>Manish!</b> How can I help you today?</p>

          <div className="flex flex-col gap-2 mb-3">
            {[
              "How to apply for leave?",
              "How to download payslip?",
              "Interview process details",
              "Company holiday list"
            ].map((prompt, i) => (
              <button key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm text-left">
                <MessageSquare size={14} className="shrink-0 text-indigo-400" />
                {prompt}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-[12px] outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
            <button className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
              <Send size={12} className="-ml-0.5" />
            </button>
          </div>
          
          <p className="mt-3 text-center text-[9px] text-slate-400 font-medium">
            © AI responses may not always be 100% accurate.
          </p>
        </div>

        {/* Need More Help? */}
        <div className="flex flex-col gap-2.5">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900">Need More Help?</h3>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5 leading-snug">Can't find what you're looking for? We're here to help!</p>
          </div>

          <div className="flex flex-col gap-2 mt-0.5">
            {/* Contact HR */}
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                  <Headphones size={16} />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-900">Contact HR</h4>
                  <p className="text-[10px] text-slate-500">hr@crewcam.com</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Submit Ticket */}
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shrink-0">
                  <Ticket size={16} />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-900">Submit a Ticket</h4>
                  <p className="text-[10px] text-slate-500">Raise an issue with support team</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Call Us */}
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-900">Call Us</h4>
                  <p className="text-[10px] text-slate-500">+91 9567258784</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Support Hours */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-100/80 p-2.5 border border-slate-200/60">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shrink-0 shadow-sm border border-slate-100">
                <Clock size={16} />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-slate-900">Support Hours</h4>
                <p className="text-[10px] text-slate-500">Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple helpers for icons
function ChevronLeftIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}

function ArrowRightIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}
