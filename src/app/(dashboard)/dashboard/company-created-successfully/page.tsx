"use client";

import React from 'react';
import { 
  Building2, 
  Users, 
  Activity,
  CreditCard,
  Check,
  ChevronRight,
  PlayCircle,
  CalendarDays,
  Calendar,
  Settings,
  Upload,
  Download,
  Award,
  Headphones,
  MessageCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function CompanyCreatedUI() {
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center text-[10px] text-zinc-500 mb-1 font-medium">
        <span>Home</span>
        <ChevronRight size={12} className="mx-1" />
        <span>Companies</span>
        <ChevronRight size={12} className="mx-1" />
        <span>Add New Company</span>
        <ChevronRight size={12} className="mx-1" />
        <span className="text-zinc-800">Review & Confirm</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between pb-1">
        <div>
          <h1 className="text-[16px] font-bold text-zinc-900 flex items-center gap-1.5">
            Company Created Successfully! <span role="img" aria-label="party">🎉</span>
          </h1>
          <p className="text-[10px] text-zinc-500 mt-0.5">TechVision Pvt. Ltd. has been created and is ready for setup</p>
        </div>
        <button className="flex items-center gap-1 rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors">
          View Company Dashboard <ExternalLink size={11} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 mt-1">
        
        {/* Top Left Card (Dark Blue) */}
        <div className="xl:col-span-2 bg-[#020b22] text-white rounded-lg p-3 relative overflow-hidden flex flex-col justify-between shadow-sm">
          {/* Decorative elements behind */}
          <div className="absolute right-0 bottom-0 opacity-30 pointer-events-none">
            <svg width="150" height="75" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 150V50H280V150H250Z" fill="url(#paint0_linear)"/>
              <path d="M220 150V80H245V150H220Z" fill="url(#paint1_linear)"/>
              <path d="M190 150V30H215V150H190Z" fill="url(#paint2_linear)"/>
              <path d="M150 150V100H185V150H150Z" fill="url(#paint3_linear)"/>
              <path d="M110 150V60H145V150H110Z" fill="url(#paint4_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="265" y1="50" x2="265" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" stopOpacity="0.8"/>
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="232.5" y1="80" x2="232.5" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" stopOpacity="0.6"/>
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="202.5" y1="30" x2="202.5" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" stopOpacity="0.9"/>
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint3_linear" x1="167.5" y1="100" x2="167.5" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" stopOpacity="0.5"/>
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint4_linear" x1="127.5" y1="60" x2="127.5" y2="150" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" stopOpacity="0.7"/>
                  <stop offset="1" stopColor="#1e3a8a" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="absolute left-2 top-2 opacity-40 pointer-events-none transform scale-75">
            <svg width="100" height="100" viewBox="0 0 150 150" fill="none">
              <circle cx="20" cy="20" r="2" fill="#ef4444" />
              <circle cx="80" cy="10" r="3" fill="#eab308" />
              <circle cx="130" cy="40" r="2" fill="#3b82f6" />
              <circle cx="10" cy="80" r="2.5" fill="#22c55e" />
              <circle cx="120" cy="100" r="2" fill="#a855f7" />
              <circle cx="50" cy="120" r="3" fill="#f97316" />
            </svg>
          </div>

          <div className="flex items-start gap-2 relative z-10">
            {/* Checkmark circle */}
            <div className="h-8 w-8 rounded-full bg-[#16a34a] flex items-center justify-center border-[2px] border-[#16a34a]/20 shadow-[0_0_8px_rgba(22,163,74,0.4)] shrink-0 mt-0.5">
              <Check size={16} className="text-white" strokeWidth={3.5} />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[12px] font-bold tracking-tight">Congratulations! Your company is now live.</h2>
              <p className="text-[9px] text-zinc-300 font-medium mt-0.5">Company ID: <span className="text-white font-bold">TECHVISION_001</span></p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4 relative z-10 border-t border-zinc-700/50 pt-3">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-zinc-400 text-[8px] font-semibold uppercase tracking-wider mb-0.5"><Building2 size={9}/> Company Name</span>
              <span className="font-bold text-[10px] text-white">TechVision Pvt. Ltd.</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-zinc-400 text-[8px] font-semibold uppercase tracking-wider mb-0.5"><Activity size={9}/> Plan</span>
              <span className="font-bold text-[10px] text-white">Professional</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-zinc-400 text-[8px] font-semibold uppercase tracking-wider mb-0.5"><Users size={9}/> Employees</span>
              <span className="font-bold text-[10px] text-white">100 <span className="text-zinc-400 font-normal">(Est.)</span></span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-zinc-400 text-[8px] font-semibold uppercase tracking-wider mb-0.5"><CreditCard size={9}/> Billing</span>
              <span className="font-bold text-[10px] text-white">₹ 150 / Emp / Mo</span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-zinc-400 text-[8px] font-semibold uppercase tracking-wider mb-0.5"><PlayCircle size={9}/> Status</span>
              <span className="inline-block bg-[#713f12] text-[#fef08a] px-1.5 py-[1px] rounded text-[8px] font-bold border border-[#a16207] w-fit shadow-inner">Setup Pending</span>
            </div>
          </div>
        </div>

        {/* Top Right Card (Dark Blue) */}
        <div className="bg-[#020b22] text-white rounded-lg p-3 row-span-2 flex flex-col shadow-sm">
          <h3 className="font-bold text-[11px] mb-3">Onboarding Progress</h3>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full border-[3px] border-[#1e293b] border-t-[#16a34a] border-r-[#16a34a] flex items-center justify-center shrink-0">
              <span className="font-bold text-[11px]">20%</span>
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] text-zinc-400 font-bold">Step 1 of 5</p>
              <p className="font-bold text-[10px]">Company Created</p>
              <p className="text-[8px] text-zinc-300 leading-tight">You're off to a great start!<br/>Complete the next steps.</p>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col relative pl-2">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[15px] top-[8px] bottom-3 w-px bg-zinc-800 z-0"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-3 group">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 text-[8px] font-bold shadow-[0_0_8px_rgba(22,163,74,0.3)]">1</div>
                  <span className="text-[10px] font-bold text-white">Company Created</span>
                </div>
                <span className="text-[8px] font-medium text-zinc-400">May 23, 11:45 AM</span>
              </div>
              
              <div className="relative z-10 flex items-center justify-between mb-3 group">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-white text-[#020b22] flex items-center justify-center shrink-0 text-[8px] font-bold shadow-sm border border-white">2</div>
                  <span className="text-[10px] font-bold text-white">Invite Admins</span>
                </div>
                <span className="text-[8px] font-medium text-zinc-500">Pending</span>
              </div>

              <div className="relative z-10 flex items-center justify-between mb-3 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#1e293b] text-zinc-400 flex items-center justify-center shrink-0 text-[8px] font-bold border border-zinc-700">3</div>
                  <span className="text-[10px] font-semibold text-zinc-300">Import Employees</span>
                </div>
                <span className="text-[8px] font-medium text-zinc-500">Pending</span>
              </div>

              <div className="relative z-10 flex items-center justify-between mb-3 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#1e293b] text-zinc-400 flex items-center justify-center shrink-0 text-[8px] font-bold border border-zinc-700">4</div>
                  <span className="text-[10px] font-semibold text-zinc-300">Configure Modules</span>
                </div>
                <span className="text-[8px] font-medium text-zinc-500">Pending</span>
              </div>

              <div className="relative z-10 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[#1e293b] text-zinc-400 flex items-center justify-center shrink-0 text-[8px] font-bold border border-zinc-700">5</div>
                  <span className="text-[10px] font-semibold text-zinc-300">Go Live</span>
                </div>
                <span className="text-[8px] font-medium text-zinc-500">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Full Width Card (What's Next) */}
        <div className="xl:col-span-2 bg-white rounded-lg p-3 border border-zinc-200 shadow-sm">
          <h3 className="font-bold text-[11px] text-zinc-900 mb-2">What's Next? <span className="font-medium text-zinc-500 text-[9px] ml-1">Follow these steps to go live</span></h3>
          
          <div className="mt-3 hidden lg:block overflow-hidden">
            <div className="flex items-start justify-between relative px-2">
              {/* Horizontal Connecting Line */}
              <div className="absolute top-[8px] left-[8%] right-[8%] h-px bg-zinc-200 z-0"></div>
              
              {/* Step 1 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center">
                <div className="h-5 w-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[10px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">
                  <Check size={10} strokeWidth={3} />
                </div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Company<br/>Created</span>
                <span className="text-[8px] font-bold text-[#16a34a] mb-0.5">Completed</span>
                <span className="text-[7px] text-zinc-400 font-medium">May 23, 11:45 AM</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center">
                <div className="h-5 w-5 rounded-full bg-[#020b22] text-white flex items-center justify-center text-[9px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">2</div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Invite Admin<br/>Users</span>
                <span className="text-[8px] text-zinc-500 mb-2 px-1 leading-snug h-5 overflow-hidden">Add your team to manage</span>
                <button className="bg-[#020b22] text-white text-[8px] font-bold px-2 py-1 rounded shadow-sm hover:bg-zinc-800 transition-colors">Invite Now</button>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-500 flex items-center justify-center text-[9px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">3</div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Import<br/>Employees</span>
                <span className="text-[8px] text-zinc-500 mb-2 px-1 leading-snug h-5 overflow-hidden">Upload data in bulk</span>
                <button className="bg-white border border-zinc-200 text-zinc-700 text-[8px] font-bold px-2 py-1 rounded shadow-sm">Import Now</button>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-500 flex items-center justify-center text-[9px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">4</div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Configure<br/>Modules</span>
                <span className="text-[8px] text-zinc-500 mb-2 px-1 leading-snug h-5 overflow-hidden">Enable required modules</span>
                <button className="bg-white border border-zinc-200 text-zinc-700 text-[8px] font-bold px-2 py-1 rounded shadow-sm">Configure</button>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-500 flex items-center justify-center text-[9px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">5</div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Run Payroll<br/>Setup</span>
                <span className="text-[8px] text-zinc-500 mb-2 px-1 leading-snug h-5 overflow-hidden">Configure salary settings</span>
                <button className="bg-white border border-zinc-200 text-zinc-700 text-[8px] font-bold px-2 py-1 rounded shadow-sm">Setup Payroll</button>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center w-[16%] relative z-10 text-center opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-500 flex items-center justify-center text-[9px] font-bold mb-1.5 outline outline-[3px] outline-white shadow-sm shrink-0">6</div>
                <span className="text-[9px] font-bold text-zinc-900 mb-0.5 leading-tight">Go Live<br/>&nbsp;</span>
                <span className="text-[8px] text-zinc-500 mb-2 px-1 leading-snug h-5 overflow-hidden">Start using Crewcam</span>
                <button className="bg-white border border-zinc-200 text-zinc-700 text-[8px] font-bold px-2 py-1 rounded shadow-sm">Go Live</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2 items-stretch">
        
        {/* Company Details */}
        <div className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] text-zinc-900">Company Details</h3>
            <button className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View Details</button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
              <div className="h-7 w-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building2 size={13} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-wide">Company Name</span>
                <span className="font-bold text-[10px] text-zinc-900">TechVision Pvt. Ltd.</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 flex-1 text-[9px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Company ID</span>
                <span className="font-bold text-zinc-900">TECHVISION_001</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Industry</span>
                <span className="font-bold text-zinc-900 text-right">Information Technology</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Company Size</span>
                <span className="font-bold text-zinc-900">201 - 500 Employees</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Plan</span>
                <span className="font-bold text-zinc-900">Professional</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Billing</span>
                <span className="font-bold text-zinc-900">₹ 150 / Emp / Mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access */}
        <div className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] text-zinc-900">Admin Access</h3>
            <button className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Manage Admins</button>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full border-[2.5px] border-[#16a34a] flex items-center justify-center text-[9px] font-bold text-zinc-900 shrink-0">1/1</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-900">Admin Users</span>
              <span className="text-[8px] font-medium text-zinc-500">Allocated Quota</span>
            </div>
          </div>

          <div className="border border-zinc-100 rounded-md p-2 bg-zinc-50 flex flex-col gap-1 mb-3 shadow-sm">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-zinc-900">Rohit Mehta</span>
                <span className="bg-indigo-100 text-indigo-700 text-[7px] font-bold px-1 py-0.5 rounded">Primary</span>
              </div>
              <span className="text-[#16a34a] text-[8px] font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></div> Active</span>
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">rohit@techvision.com</span>
            <span className="text-[9px] text-zinc-400">HR Manager</span>
          </div>
          
          <div className="mt-auto pt-2">
            <button className="w-full flex items-center justify-center gap-1.5 border border-zinc-200 text-zinc-700 bg-white text-[9px] font-bold px-2 py-1.5 rounded-md shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all">
              <Users size={11} /> Invite More Admins
            </button>
          </div>
        </div>

        {/* Module Status */}
        <div className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[11px] text-zinc-900">Module Status</h3>
            <button className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All</button>
          </div>
          
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100">
            <div className="relative h-10 w-10 shrink-0">
              <svg viewBox="0 0 36 36" className="w-10 h-10 transform -rotate-90">
                <path className="text-zinc-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <path className="text-[#16a34a]" strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="text-[11px] font-bold leading-none text-zinc-900">10</span>
                <span className="text-[7px] text-zinc-500 font-semibold mt-[1px] text-center leading-tight">of 12<br/>Mod</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-semibold text-zinc-600 w-full pl-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></div> Enabled</div>
                <span className="font-bold text-zinc-900">10</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Disabled</div>
                <span className="font-bold text-zinc-900">2</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div> N/A</div>
                <span className="font-bold text-zinc-900">0</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <h4 className="text-[9px] font-bold text-zinc-900 mb-2">Most Enabled Modules</h4>
            <div className="grid grid-cols-4 gap-1 text-center text-[7px] font-semibold text-zinc-500">
              <div className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group">
                <div className="h-6 w-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform"><Users size={10}/></div> 
                <span className="leading-tight">Employee<br/>Mgmt</span>
              </div>
              <div className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group">
                <div className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform"><CalendarDays size={10}/></div> 
                <span className="leading-tight">Attendance<br/>Mgmt</span>
              </div>
              <div className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group">
                <div className="h-6 w-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform"><Calendar size={10}/></div> 
                <span className="leading-tight">Leave<br/>Mgmt</span>
              </div>
              <div className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer group">
                <div className="h-6 w-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform"><CreditCard size={10}/></div> 
                <span className="leading-tight">Payroll<br/>Mgmt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Right Sidebar) & You're in Good Hands */}
        <div className="flex flex-col gap-2 h-full">
          <div className="bg-white rounded-lg p-3 border border-zinc-200 shadow-sm flex-1">
            <h3 className="font-bold text-[11px] text-zinc-900 mb-2">Quick Actions</h3>
            <div className="flex flex-col text-[10px] font-semibold text-zinc-700">
              <button className="flex items-center justify-between py-1.5 border-b border-zinc-50 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Users size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Invite Admin Users</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between py-1.5 border-b border-zinc-50 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Upload size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Import Employees</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between py-1.5 border-b border-zinc-50 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Settings size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Configure Modules</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between py-1.5 border-b border-zinc-50 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Calendar size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Setup Payroll</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between py-1.5 border-b border-zinc-50 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Building2 size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Customize Profile</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between py-1.5 hover:text-indigo-600 group transition-colors">
                <span className="flex items-center gap-1.5"><Download size={11} className="text-zinc-400 group-hover:text-indigo-600 transition-colors"/> Download Guide</span> <ChevronRight size={11} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="bg-[#020b22] text-white rounded-lg p-3 shadow-sm flex items-start gap-2 shrink-0 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none text-white">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="h-7 w-7 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/30 relative z-10">
              <Award size={14} />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-[10px] mb-0.5 text-yellow-500">You're in Good Hands!</h4>
              <p className="text-[8px] text-zinc-300 leading-snug mb-1 font-medium">Over 10,000+ organizations trust Crewcam.</p>
              <p className="text-[8px] font-bold text-white">Welcome to the family! 🚀</p>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Banner & Footer Actions */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-3 mt-2 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Headphones size={14} />
          </div>
          <div>
            <h3 className="font-bold text-[11px] text-zinc-900 mb-0.5">Need Help Getting Started?</h3>
            <p className="text-[9px] text-zinc-500 font-medium">Our customer success team is here to help you with setup and onboarding.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1 border border-[#16a34a] text-[#16a34a] bg-white text-[9px] font-bold px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors shadow-sm">
            <CalendarDays size={11} /> Schedule Call
          </button>
          <button className="flex items-center gap-1 bg-[#16a34a] text-white text-[9px] font-bold px-3 py-1.5 rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
            <MessageCircle size={11} /> Chat Support
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button className="flex items-center gap-1 border border-zinc-200 bg-white text-zinc-700 text-[10px] font-bold px-3 py-1.5 rounded shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all">
          <ArrowLeft size={11} /> Back to Companies
        </button>
        <button className="flex items-center gap-1 bg-[#020b22] text-white text-[10px] font-bold px-4 py-1.5 rounded shadow-sm hover:bg-zinc-800 transition-all hover:-translate-y-0.5">
          Go to Company Dashboard <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
