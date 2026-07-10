"use client";

import React from 'react';
import {
  ChevronRight,
  Check,
  Info,
  ChevronDown,
  FileText,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Edit,
  Upload,
  FileBadge2,
  FileBadge,
  CreditCard,
  Files
} from 'lucide-react';

export default function AddNewCompany() {
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen bg-zinc-50/50">

      {/* Breadcrumbs */}
      <div className="flex items-center text-[10px] text-zinc-500 font-medium ">
        <span>Home</span>
        <ChevronRight size={12} className="mx-1" />
        <span>Companies</span>
        <ChevronRight size={12} className="mx-1" />
        <span className="text-zinc-800">Add New Company</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between pb-1">
        <div>
          <h1 className="text-[16px] font-bold text-[#020b22]">Add New Company</h1>
          <p className="text-[10px] text-zinc-500">Add primary admin contact and company communication details</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 flex items-center justify-between">
        {/* Step 1 */}
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-emerald-100/80 flex items-center justify-center shrink-0">
            <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#020b22]">Basic Information</span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Completed</span>
          </div>
          <div className="flex-1 h-px bg-slate-200 mx-4 hidden lg:block"></div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-emerald-100/80 flex items-center justify-center shrink-0">
            <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#020b22]">Subscription & Plan</span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Completed</span>
          </div>
          <div className="flex-1 h-px bg-slate-200 mx-4 hidden lg:block"></div>
        </div>

        {/* Step 3 (Active) */}
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-[#020b22] text-white flex items-center justify-center shrink-0 font-bold text-[14px]">
            3
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#020b22]">Admin & Contact</span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Primary contact details</span>
          </div>
          <div className="flex-1 h-px bg-slate-200 mx-4 hidden lg:block"></div>
        </div>

        {/* Step 4 */}
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-[#020b22] flex items-center justify-center shrink-0 font-bold text-[14px] shadow-sm">
            4
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#020b22]">Configuration</span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">System preferences</span>
          </div>
          <div className="flex-1 h-px bg-slate-200 mx-4 hidden lg:block"></div>
        </div>

        {/* Step 5 */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-[#020b22] flex items-center justify-center shrink-0 font-bold text-[14px] shadow-sm">
            5
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#020b22]">Review & Confirm</span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">Verify and create</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 mt-2">

        {/* Left Column (Main Form) */}
        <div className="xl:col-span-3 space-y-2">
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200">

            <div className="px-3 py-1.5 border-b border-zinc-100">
              <h2 className="text-[12px] font-bold text-zinc-900">Primary Admin Contact</h2>
              <p className="text-[10px] text-zinc-500 mb-3">Add the main point of contact for this organization</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Rohit Mehta" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Designation <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="HR Manager" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="email" defaultValue="rohit.mehta@techvision.com" className="h-8 pl-2 pr-6 border border-emerald-500 rounded-md text-[11px] text-zinc-900 focus:outline-none w-full" />
                    <Check size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex h-8 border border-zinc-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <div className="flex items-center gap-1 px-2 bg-zinc-50 border-r border-zinc-300">
                      <div className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded-[1px]"></div>
                      <span className="text-[10px] font-medium">+91</span>
                      <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <input type="text" defaultValue="98765 43210" className="flex-1 px-2 text-[11px] text-zinc-900 focus:outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Alternate Email <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <input type="email" placeholder="Enter alternate email" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Alternate Phone <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <div className="flex h-8 border border-zinc-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <div className="flex items-center gap-1 px-2 bg-zinc-50 border-r border-zinc-300">
                      <div className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded-[1px]"></div>
                      <span className="text-[10px] font-medium">+91</span>
                      <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <input type="text" placeholder="Enter alternate phone" className="flex-1 px-2 text-[11px] text-zinc-900 focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">WhatsApp Number <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <div className="flex h-8 border border-zinc-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <div className="flex items-center gap-1 px-2 bg-zinc-50 border-r border-zinc-300">
                      <div className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded-[1px]"></div>
                      <span className="text-[10px] font-medium">+91</span>
                      <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <input type="text" defaultValue="98765 43210" className="flex-1 px-2 text-[11px] text-zinc-900 focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Preferred Language</label>
                  <div className="relative">
                    <select className="h-8 px-2 w-full border border-zinc-300 rounded-md text-[11px] text-zinc-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                      <option>English</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-2 bg-indigo-50/70 p-2 rounded-md border border-indigo-100">
                <Info size={13} className="text-indigo-600 mt-[1px] shrink-0" />
                <p className="text-[10px] text-indigo-900 font-medium leading-snug">Credentials will be sent to this email address. The admin will have full access to manage company settings and users.</p>
              </div>
            </div>

            <div className="px-3 py-1.5 border-b border-zinc-100">
              <h2 className="text-[12px] font-bold text-zinc-900">Company Communication Details</h2>
              <p className="text-[10px] text-zinc-500 mb-3">Add official communication and operational details</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Official Email <span className="text-red-500">*</span></label>
                  <input type="email" defaultValue="info@techvision.com" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Official Phone <span className="text-red-500">*</span></label>
                  <div className="flex h-8 border border-zinc-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <div className="flex items-center gap-1 px-2 bg-zinc-50 border-r border-zinc-300">
                      <div className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded-[1px]"></div>
                      <span className="text-[10px] font-medium">+91</span>
                      <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <input type="text" defaultValue="0120 456 7890" className="flex-1 px-2 text-[11px] text-zinc-900 focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Support Email</label>
                  <input type="email" defaultValue="support@techvision.com" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Support Phone</label>
                  <div className="flex h-8 border border-zinc-300 rounded-md overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <div className="flex items-center gap-1 px-2 bg-zinc-50 border-r border-zinc-300">
                      <div className="w-3.5 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 rounded-[1px]"></div>
                      <span className="text-[10px] font-medium">+91</span>
                      <ChevronDown size={10} className="text-zinc-500" />
                    </div>
                    <input type="text" defaultValue="0120 456 7891" className="flex-1 px-2 text-[11px] text-zinc-900 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">Company Website</label>
                  <input type="url" defaultValue="https://www.techvision.com" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-zinc-700">LinkedIn Profile <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <input type="url" defaultValue="https://linkedin.com/company/techvision" className="h-8 px-2 border border-zinc-300 rounded-md text-[11px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-semibold text-zinc-700">Company Description <span className="text-zinc-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <textarea
                      defaultValue="TechVision Pvt. Ltd. is a leading IT solutions provider specializing in digital transformation, cloud solutions and enterprise software development."
                      className="h-14 px-2 py-1.5 border border-zinc-300 rounded-md text-[10px] text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full leading-snug"
                    />
                    <span className="absolute bottom-3 right-2  text-[9px] text-zinc-400 bg-white px-1">120/300</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5">
              <h2 className="text-[12px] font-bold text-zinc-900">Documents (Optional)</h2>
              <p className="text-[10px] text-zinc-500 mb-3">Upload any relevant documents for verification and reference</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

                {/* Document Card 1 */}
                <div className="border border-zinc-200 rounded-md p-2 flex flex-col items-center justify-center text-center gap-1.5 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5">
                    <FileBadge size={20} className="text-zinc-500" />
                    <h3 className="text-[10px] font-bold text-zinc-800">Incorporation</h3>
                  </div>
                  <span className="text-[9px] font-semibold text-indigo-600 group-hover:text-indigo-700">Upload File</span>
                  <span className="text-[8px] text-zinc-400">PDF, JPG (Max. 5MB)</span>
                </div>

                {/* Document Card 2 */}
                <div className="border border-zinc-200 rounded-md p-2 flex flex-col items-center justify-center text-center gap-1.5 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5">
                    <FileText size={20} className="text-zinc-500" />
                    <h3 className="text-[10px] font-bold text-zinc-800">GST Certificate</h3>
                  </div>
                  <span className="text-[9px] font-semibold text-indigo-600 group-hover:text-indigo-700">Upload File</span>
                  <span className="text-[8px] text-zinc-400">PDF, JPG (Max. 5MB)</span>
                </div>

                {/* Document Card 3 */}
                <div className="border border-zinc-200 rounded-md p-2 flex flex-col items-center justify-center text-center gap-1.5 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5">
                    <CreditCard size={20} className="text-zinc-500" />
                    <h3 className="text-[10px] font-bold text-zinc-800">PAN Card</h3>
                  </div>
                  <span className="text-[9px] font-semibold text-indigo-600 group-hover:text-indigo-700">Upload File</span>
                  <span className="text-[8px] text-zinc-400">PDF, JPG (Max. 5MB)</span>
                </div>

                {/* Document Card 4 */}
                <div className="border border-zinc-200 rounded-md p-2 flex flex-col items-center justify-center text-center gap-1.5 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-1.5">
                    <Files size={20} className="text-zinc-500" />
                    <h3 className="text-[10px] font-bold text-zinc-800">Other Document</h3>
                  </div>
                  <span className="text-[9px] font-semibold text-indigo-600 group-hover:text-indigo-700">Upload File</span>
                  <span className="text-[8px] text-zinc-400">PDF, JPG (Max. 5MB)</span>
                </div>

              </div>
            </div>

            <div className="px-2 py-1.5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50 rounded-b-lg">
              <button className="flex items-center gap-1.5 border border-zinc-300 bg-white text-zinc-700 text-[11px] font-bold px-3 py-1.5 rounded shadow-sm hover:bg-zinc-50 transition-colors">
                <ArrowLeft size={13} /> Back
              </button>
              <button className="flex items-center gap-1.5 bg-[#020b22] text-white text-[11px] font-bold px-4 py-1.5 rounded shadow-sm hover:bg-zinc-800 transition-colors">
                Save & Next <ArrowRight size={13} className='text-[#bc9a4f]' />
              </button>
            </div>

          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="xl:col-span-1 space-y-2">

          {/* Onboarding Progress */}
          <div className="bg-[#020b22] text-white rounded-lg p-3 shadow-sm">
            <h3 className="font-bold text-[12px] mb-3">Onboarding Progress</h3>

            <div className="flex items-center gap-3">
              <div className="relative h-[55px] w-[55px] shrink-0">
                <svg viewBox="0 0 36 36" className="w-[55px] h-[55px] transform -rotate-90">
                  <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" />
                  <path className="text-[#16a34a]" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white">60%</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-medium text-zinc-400 mb-0.5">Step 3 of 5</span>
                <span className="text-[11px] font-bold text-white mb-0.5">Admin & Contact Details</span>
                <span className="text-[9px] text-zinc-300 leading-tight">You're doing great! Just a few steps to go.</span>
              </div>
            </div>
          </div>

          {/* Setup Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-[11px] text-zinc-900">Setup Summary</h3>
              <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
            </div>

            <div className="flex flex-col gap-2 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-900 font-bold">Company Name</span>
                <span className="font-bold text-zinc-900">TechVision Pvt. Ltd.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-900 font-bold">Corporate ID</span>
                <span className="font-bold text-zinc-900">TECHVISION_001</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-900 font-bold">Industry</span>
                <span className="font-bold text-zinc-900">Information Technology</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-900 font-bold">Company Size</span>
                <span className="font-bold text-zinc-900">201 - 500 Employees</span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-100">
                <span className="text-zinc-900 font-bold">Selected Plan</span>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-zinc-900">Professional</span>
                  <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 mt-0.5">₹ 150 / Emp / Mo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-900 font-bold">Billing Cycle</span>
                <span className="font-bold text-zinc-900">Monthly</span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-100">
                <span className="text-zinc-900 font-bold">Add-on Modules</span>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-zinc-900">Advanced Recruitment</span>
                  <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 mt-0.5">₹ 15 / Emp / Mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#fffbeb] rounded-lg border border-[#fde68a] p-3 flex items-start gap-2 shadow-sm">
            <div className="h-5 w-5 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0 border border-[#fde68a]">
              <Info size={12} strokeWidth={3} />
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-[#92400e] mb-0.5">Note</h4>
              <p className="text-[10px] text-[#b45309] font-medium leading-snug">You can edit all the details before final confirmation in the next step.</p>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-[#020b22] text-white rounded-lg p-3 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[12px] mb-0.5">Need Help?</h4>
                <p className="text-[9px] text-zinc-300 font-medium leading-snug">Our customer success team is here to help you set up your company.</p>
              </div>
            </div>
            <div className='px-11'>
              <button className="w-full flex items-center justify-center gap-1.5 border border-zinc-700 text-[#bc9a4f] text-[12px] font-bold px-3 py-1 rounded-md hover:bg-zinc-800 transition-colors">
                Contact Support <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* <div className="pt-3 pb-2 mt-2 flex items-center justify-between text-[9px] text-zinc-500 font-medium">
        <span>© 2025 Crewcam HRMS. All Rights Reserved.</span>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:text-zinc-800 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-800 transition-colors">Terms of Service</a>
        </div>
      </div> */}

    </div>
  );
}
