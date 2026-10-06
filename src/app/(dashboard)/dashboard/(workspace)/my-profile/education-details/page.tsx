'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye, Edit2, Mail, Phone, CalendarDays, MapPin, CheckCircle2,
  ChevronRight, Camera, Plus, GraduationCap, Award, Calendar,
  FileText, ChevronDown, Trash2, Info
} from 'lucide-react';

export default function EducationDetailsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full p-4 space-y-4">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-[13px] text-gray-500 mb-1">
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="mx-1" />
              <Link href="/dashboard/my-profile" className="hover:text-blue-600 transition-colors">My Profile</Link>
              <ChevronRight size={14} className="mx-1" />
              <span className="font-medium text-gray-900">Education Details</span>
            </div>
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Education Details</h1>
            <p className="text-[13px] text-gray-500 mt-1">View and manage your educational qualifications and certifications.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Eye size={18} />
              View Public Profile
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={18} />
              Add Education
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col xl:flex-row gap-4">
          
          {/* Left: Profile Card */}
          <div className="w-full xl:w-[320px] shrink-0">
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white h-full flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex flex-col items-center p-5 pb-4 border-b border-gray-100">
                  <div className="relative mb-4">
                    <img src="https://i.pravatar.cc/150?u=43" alt="Rohan Mehta" className="w-[112px] h-[112px] rounded-full object-cover border-4 border-white shadow-sm" />
                    <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera size={14} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-[22px] font-bold text-gray-900 flex items-center justify-center gap-1.5">
                      Rohan Mehta <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
                    </h2>
                    <p className="text-[13px] font-medium text-gray-500 mt-1">EMP10234</p>
                    <p className="text-[15px] font-semibold text-gray-900 mt-1">Executive - Sales</p>
                    <span className="inline-block mt-3 px-4 py-1 bg-emerald-50 text-emerald-600 text-[13px] font-semibold rounded-full border border-emerald-100">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400 shrink-0" />
                    <p className="text-[13px] text-gray-600 truncate">rohan.mehta@crewcam.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400 shrink-0" />
                    <p className="text-[13px] text-gray-600">+91 98765 43210</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[13px] text-gray-900 font-medium">15 Mar 2023</p>
                      <p className="text-[11px] text-gray-500">Date of Joining</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[13px] text-gray-900 font-medium">Noida Office</p>
                      <p className="text-[11px] text-gray-500">Work Location</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <p className="text-[11px] text-gray-500 font-medium mb-2">Reporting To</p>
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=40" alt="Amit Kumar" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">Amit Kumar</p>
                      <p className="text-[11px] text-gray-500">Sales Manager</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Area */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            
            {/* Education Summary Card */}
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-4">
                <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Education Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Total Qualifications</p>
                      <p className="text-xl font-bold text-gray-900">5</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">All Degrees/Diplomas</p>
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Award className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Highest Qualification</p>
                      <p className="text-xl font-bold text-gray-900">MBA (Marketing)</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">Post Graduation</p>
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Calendar className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Years of Education</p>
                      <p className="text-xl font-bold text-gray-900">17 Years</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">Till Post Graduation</p>
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <FileText className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Certifications</p>
                      <p className="text-xl font-bold text-gray-900">3</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">Additional Certificates</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Academic Qualifications Table */}
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <GraduationCap className="text-blue-600" size={18} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-gray-900">Academic Qualifications</h3>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-[13px] font-semibold text-blue-600 hover:text-blue-700">View Timeline</a>
                  <div className="flex items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white cursor-pointer hover:bg-gray-50">
                    <span className="text-[13px] font-medium text-gray-700 mr-2">All</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Qualification</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Institute / University</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Board / University</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 whitespace-nowrap">Year of Passing</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 whitespace-nowrap">Percentage / CGPA</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Mode</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Specialization</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Document</th>
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { qual: 'MBA (Marketing)', inst: 'Symbiosis Institute of Business Management, Pune', board: 'Symbiosis International (Deemed University)', year: '2021', perc: '78.60%', mode: 'Full Time', spec: 'Marketing' },
                      { qual: 'BBA', inst: 'Delhi University', board: 'University of Delhi', year: '2018', perc: '72.30%', mode: 'Full Time', spec: 'Business Administration' },
                      { qual: '12th (CBSE)', inst: 'Kendriya Vidyalaya', board: 'CBSE', year: '2015', perc: '81.20%', mode: 'Full Time', spec: 'Commerce' },
                      { qual: '10th (CBSE)', inst: 'Kendriya Vidyalaya', board: 'CBSE', year: '2013', perc: '85.60%', mode: 'Full Time', spec: 'General' },
                      { qual: 'Diploma in Digital Marketing', inst: 'NIIT', board: 'NIIT', year: '2022', perc: 'A', mode: 'Part Time', spec: 'Digital Marketing' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.qual}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600 max-w-[200px] truncate" title={row.inst}>{row.inst}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600 max-w-[200px] truncate" title={row.board}>{row.board}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.year}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.perc}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.mode}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.spec}</td>
                        <td className="px-4 py-2 text-center">
                          <button className="inline-flex p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <FileText size={16} />
                          </button>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={16} /></button>
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                            <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-[12px] text-gray-500">Showing 1 to 5 of 5 entries</p>
              </div>
            </Card>

            {/* Row 3: Certifications & Courses */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              
              {/* Certifications Table */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col overflow-hidden min-w-0">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Award className="text-blue-600" size={18} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-gray-900">Certifications</h3>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700">
                    <Plus size={16} /> Add Certification
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Certification Name</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Issued By</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 whitespace-nowrap">Issue Date</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 whitespace-nowrap">Expiry Date</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Credential ID</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Document</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Google Ads Certification', issuer: 'Google', issue: '10 Jan 2023', expiry: '-', id: 'GOOG-AD-45678' },
                        { name: 'HubSpot Inbound Marketing', issuer: 'HubSpot Academy', issue: '15 Jun 2022', expiry: '-', id: 'HS-IM-78945' },
                        { name: 'Advanced Excel Certification', issuer: 'Coursera', issue: '20 Sep 2021', expiry: '-', id: 'CRS-EX-12345' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.issuer}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600 whitespace-nowrap">{row.issue}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600 text-center">{row.expiry}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.id}</td>
                          <td className="px-4 py-2 text-center">
                            <button className="inline-flex p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <FileText size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={16} /></button>
                              <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <p className="text-[12px] text-gray-500">Showing 1 to 3 of 3 entries</p>
                </div>
              </Card>

              {/* Add-on Courses Table */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col overflow-hidden min-w-0">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Award className="text-blue-600" size={18} />
                    </div>
                    <h3 className="text-[16px] font-semibold text-gray-900">Add-on Courses / Workshops</h3>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700">
                    <Plus size={16} /> Add Course
                  </button>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Course / Workshop</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Institute / Provider</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Year</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900">Duration</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Document</th>
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: 'Financial Modeling', inst: 'Udemy', year: '2022', duration: '2 Months' },
                        { name: 'Brand Management', inst: 'IIM Bangalore (Executive Ed.)', year: '2021', duration: '1 Month' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.inst}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.year}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.duration}</td>
                          <td className="px-4 py-2 text-center">
                            <button className="inline-flex p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <FileText size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={16} /></button>
                              <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <p className="text-[12px] text-gray-500">Showing 1 to 2 of 2 entries</p>
                </div>
              </Card>

            </div>

            {/* Notice Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Info size={14} className="text-white" />
              </div>
              <p className="text-[13px] text-gray-700">
                Keep your educational information updated. It helps us in internal assessments, registrations and career development opportunities.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
