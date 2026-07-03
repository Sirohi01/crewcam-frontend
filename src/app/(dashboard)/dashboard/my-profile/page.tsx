'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye, Edit2, Mail, Phone, CalendarDays, MapPin, CheckCircle2, IndianRupee,
  Download, BriefcaseBusiness, CalendarCheck, Clock, BookOpen, Star,
  Receipt, Goal, CheckSquare, Building, ShieldCheck,
  FileText, CreditCard, ChevronRight, Camera
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const taskData = [
  { name: 'Completed', value: 6, color: '#22c55e' },
  { name: 'In Progress', value: 3, color: '#3b82f6' },
  { name: 'Pending', value: 2, color: '#f59e0b' },
  { name: 'Overdue', value: 1, color: '#ef4444' },
];

export default function MyProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full p-4 space-y-4">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center text-[12px] text-gray-500 mb-0.5">
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="mx-1" />
              <span className="font-medium text-gray-900">My Profile</span>
            </div>
            <h1 className="text-[24px] font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-[12px] text-gray-500 mt-1">View and manage your personal and professional information.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Eye size={16} />
              View Public Profile
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Top Section: Profile Card (Left) + 3 Sections (Right) */}
        <div className="flex flex-col xl:flex-row gap-4">

          {/* Left: Profile Card */}
          <div className="w-full xl:w-[260px] shrink-0">
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex flex-col items-center p-4 pb-3 border-b border-gray-100">
                  <div className="relative mb-3">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rohan Mehta" className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white shadow-sm" />
                    <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera size={14} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-[18px] font-bold text-gray-900 flex items-center justify-center gap-1.5">
                      Rohan Mehta <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                    </h2>
                    <p className="text-[12px] font-medium text-gray-500 mt-1">EMP10234</p>
                    <p className="text-[13px] font-semibold text-gray-900 mt-1">Executive - Sales</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold rounded-full border border-emerald-100">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Mail size={15} className="text-gray-400 shrink-0" />
                    <p className="text-[12px] text-gray-600 break-all leading-tight">rohan.mehta@crewcam.com</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <p className="text-[12px] text-gray-600">+91 98765 43210</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CalendarDays size={15} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[12px] text-gray-900 font-medium">15 Mar 2023</p>
                      <p className="text-[10px] text-gray-500">Date of Joining</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[12px] text-gray-900 font-medium">Noida Office</p>
                      <p className="text-[10px] text-gray-500">Work Location</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-[10px] text-gray-500 font-medium mb-1.5">Reporting to</p>
                  <div className="flex items-center gap-2.5">
                    <img src="https://i.pravatar.cc/150?u=40" alt="Amit Kumar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200" />
                    <div>
                      <p className="text-[12px] font-semibold text-gray-900">Amit Kumar</p>
                      <p className="text-[10px] text-gray-500">Sales Manager</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <button className="w-full flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-[13px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                    <Download size={16} />
                    Download ID Card
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: The 3 Sections */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">

            {/* 1. Personal & Work Information */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4">
              {/* Personal Information */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white relative hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="absolute top-4 right-4">
                  <button className="text-[12px] font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors bg-white">Edit</button>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-3 pb-2.5 border-b border-gray-100">Personal Information</h3>
                  <div className="flex-1 grid grid-cols-3 gap-y-3 gap-x-2 items-start">
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Full Name</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Rohan Mehta</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Marital Status</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Single</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Aadhaar Number</p>
                      <p className="text-[12px] font-semibold text-gray-900 flex items-center gap-1 whitespace-nowrap">
                        XXXX XXXX 1234 <Eye size={12} className="text-gray-400 cursor-pointer" />
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Date of Birth</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">12 Aug 1996</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Blood Group</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">B+</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">PAN Number</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">ABCDE1234F</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Gender</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Male</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Phone Number</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">+91 98765 43210</p>
                    </div>
                    <div className="row-span-2">
                      <p className="text-[11px] text-gray-500 mb-0.5">Emergency Contact</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Neha Mehta <span className="text-gray-400 text-[10px] font-normal">(Sister)</span></p>
                      <p className="text-[12px] font-semibold text-gray-900 mt-0.5 whitespace-nowrap">+91 98123 45678</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Nationality</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Indian</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 mb-0.5">Personal Email</p>
                      <p className="text-[12px] font-semibold text-gray-900 break-all leading-tight">rohan.personal@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Information */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white relative hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="absolute top-4 right-4">
                  <button className="text-[12px] font-semibold text-blue-600 border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors bg-white">Edit</button>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-3 pb-2.5 border-b border-gray-100">Work Information</h3>
                  <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2 items-start">
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Employee ID</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">EMP10234</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Date of Joining</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">15 Mar 2023</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Department</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Sales & Marketing</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Employment Type</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Full Time</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Designation</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Executive - Sales</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Work Location</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Noida Office</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Grade</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">E2</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Probation Period</p>
                      <p className="text-[12px] font-semibold text-gray-900 whitespace-nowrap">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2. Statistics (6 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {[
                { label: 'Total Experience', value: '3 Yrs 2 Mths', sub: 'Overall Experience', icon: <BriefcaseBusiness size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Company Experience', value: '2 Yrs 2 Mths', sub: 'Since 15 Mar 2023', icon: <Building size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Current CTC (Annual)', value: '₹ 8,18,400', sub: 'Cost to Company', icon: <IndianRupee size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Next Increment', value: '01 Dec 2025', sub: 'In 194 Days', icon: <CalendarDays size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Leave Balance', value: '12.5 Days', sub: 'Available', icon: <CalendarCheck size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((stat, i) => (
                <Card key={i} className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 p-3 flex flex-col justify-center">
                  <p className="text-[11px] text-gray-500 mb-2 leading-tight whitespace-nowrap">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-gray-900 whitespace-nowrap">{stat.value}</p>
                      <p className="text-[9px] text-gray-400 leading-tight">{stat.sub}</p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Performance Stat */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 p-3 flex flex-col justify-center">
                <p className="text-[11px] text-gray-500 mb-2 leading-tight whitespace-nowrap">My Performance</p>
                <div className="flex items-center gap-0.5 mb-1">
                  {[1, 2, 3, 4].map(star => <Star key={star} size={12} className="text-amber-400 fill-amber-400" />)}
                  <Star size={12} className="text-gray-200 fill-gray-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 whitespace-nowrap flex items-baseline gap-1">
                    4.2 <span className="text-[10px] font-medium text-gray-500">/ 5</span>
                  </p>
                  <p className="text-[9px] text-gray-400 leading-tight">Current Rating</p>
                </div>
              </Card>
            </div>

            {/* 3. Documents, Pay, Payslips, Links (4 Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">

              {/* Documents */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900">Documents</h3>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="flex-1 space-y-2">
                    {['Aadhaar Card', 'PAN Card', 'Bank Details', 'Education Certificate', 'Experience Letter', 'Offer Letter', 'Photo'].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText size={12} className="text-gray-400" />
                          <span className="text-[11px] text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap">{doc}</span>
                        </div>
                        <span className="text-[9px] font-medium text-emerald-600 shrink-0 ml-1">Verified</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pay & Benefits */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900">Pay & Benefits</h3>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0"><CreditCard size={10} className="text-blue-600" /></div>
                        <span className="text-[11px] text-gray-700 whitespace-nowrap">Current Salary</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-900 whitespace-nowrap">₹ 68,200 <span className="text-[9px] text-gray-400 font-normal">/ Mth</span></span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><IndianRupee size={10} className="text-emerald-600" /></div>
                        <span className="text-[11px] text-gray-700 whitespace-nowrap">Gross (Annual)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-900 whitespace-nowrap">₹ 8,18,400</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0"><IndianRupee size={10} className="text-indigo-600" /></div>
                        <span className="text-[11px] text-gray-700 whitespace-nowrap">Take Home (Mth)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-900 whitespace-nowrap">₹ 45,680</span>
                    </div>
                    <div className="h-px bg-gray-100 my-1.5" />
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 whitespace-nowrap"><ShieldCheck size={10} className="text-gray-400" /> PF Num</span>
                      <span className="text-[10px] text-gray-700 font-mono">PY/NOI/12345/00</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 whitespace-nowrap"><ShieldCheck size={10} className="text-gray-400" /> ESIC Num</span>
                      <span className="text-[10px] text-gray-700 font-mono">5345678901</span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 whitespace-nowrap"><ShieldCheck size={10} className="text-gray-400" /> UAN Num</span>
                      <span className="text-[10px] text-gray-700 font-mono">1012345678</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Payslips */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900">Recent Payslips</h3>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="flex-1 space-y-2 mb-2">
                    {['May 2025', 'Apr 2025', 'Mar 2025', 'Feb 2025', 'Jan 2025'].map((month, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <span className="text-[11px] text-gray-700 whitespace-nowrap">{month}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-gray-900">₹ 45,680</span>
                          <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-sm">Paid</span>
                          <button className="text-blue-500 hover:bg-blue-50 p-0.5 rounded-full transition-colors"><Download size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full text-[11px] font-semibold text-blue-600 border border-blue-200 rounded-full py-1 hover:bg-blue-50 transition-colors mt-auto shrink-0">
                    View All Payslips
                  </button>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center mb-2.5 pb-2 border-b border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900">Quick Links</h3>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-1 mb-2">
                    {[
                      { icon: <CalendarDays size={14} />, label: 'Apply Leave', color: 'text-emerald-600 bg-emerald-50' },
                      { icon: <Clock size={14} />, label: 'My Attend', color: 'text-emerald-600 bg-emerald-50' },
                      { icon: <Receipt size={14} />, label: 'My Payslip', color: 'text-blue-600 bg-blue-50' },
                      { icon: <CreditCard size={14} />, label: 'Reimburse', color: 'text-blue-600 bg-blue-50' },
                      { icon: <Star size={14} />, label: 'Performance', color: 'text-emerald-600 bg-emerald-50' },
                      { icon: <Goal size={14} />, label: 'Goals & OKR', color: 'text-emerald-600 bg-emerald-50' },
                      { icon: <CheckSquare size={14} />, label: 'My Tasks', color: 'text-blue-600 bg-blue-50' },
                      { icon: <FileText size={14} />, label: 'My Requests', color: 'text-blue-600 bg-blue-50' },
                      { icon: <BookOpen size={14} />, label: 'Training', color: 'text-blue-600 bg-blue-50' },
                    ].map((btn, i) => (
                      <button key={i} className="flex flex-col items-center justify-center text-center p-1 rounded-md border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-0.5 ${btn.color} group-hover:scale-105 transition-transform`}>
                          {btn.icon}
                        </div>
                        <span className="text-[9px] text-gray-600 leading-tight whitespace-nowrap">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                  <button className="w-full text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors text-center mt-auto shrink-0">
                    View All Services
                  </button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[1.1fr_0.9fr_1fr] gap-4">

          {/* My Time Log */}
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">My Time Log <span className="text-gray-500 font-normal text-[11px] ml-1">(This Week)</span></h3>
                <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between pr-2">
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Total Logged</p>
                      <p className="text-[18px] font-bold text-gray-900">37h 45m</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5">Billable</p>
                      <p className="text-[18px] font-bold text-gray-900">28h 30m</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                      <span>Weekly Target: 40h</span>
                      <span className="font-bold text-gray-900">79%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '79%' }} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 flex flex-col justify-center">
                  {[
                    { day: 'Mon, 19 May', hours: '8h 30m', w: '90%', barColor: 'bg-blue-600' },
                    { day: 'Tue, 20 May', hours: '9h 15m', w: '100%', barColor: 'bg-blue-600' },
                    { day: 'Wed, 21 May', hours: '8h 45m', w: '100%', badge: 'On Leave' },
                    { day: 'Thu, 22 May', hours: '-', w: '0%', barColor: 'bg-blue-600' },
                    { day: 'Fri, 23 May', hours: '-', w: '0%', barColor: 'bg-blue-600' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center text-[10px]">
                      <span className="w-14 text-gray-600 shrink-0 whitespace-nowrap">{row.day}</span>
                      <div className="flex-1 flex items-center relative h-1 mx-1.5">
                        {row.badge ? (
                          <div className="w-full flex items-center h-[14px] bg-blue-500 rounded-sm justify-center">
                            <span className="text-[8px] font-semibold text-white tracking-wide">{row.badge}</span>
                          </div>
                        ) : (
                          row.w !== '0%' && (
                            <div className={`h-1.5 ${row.barColor} rounded-full`} style={{ width: row.w }} />
                          )
                        )}
                      </div>
                      <span className="w-8 text-right text-gray-600 shrink-0">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Tasks Overview */}
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">My Tasks Overview</h3>
                <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="flex-1 flex items-center justify-center gap-4">
                <div className="relative w-[90px] h-[90px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskData}
                        innerRadius={28}
                        outerRadius={45}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {taskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[20px] font-bold text-gray-900 leading-none">12</span>
                    <span className="text-[9px] text-gray-500 mt-1">Tasks</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Completed', count: 6, pct: '50%', color: 'bg-emerald-500' },
                    { label: 'In Progress', count: 3, pct: '25%', color: 'bg-blue-500' },
                    { label: 'Pending', count: 2, pct: '17%', color: 'bg-amber-500' },
                    { label: 'Overdue', count: 1, pct: '8%', color: 'bg-rose-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                      <span className="text-[11px] text-gray-700 w-[60px] whitespace-nowrap">{item.label}</span>
                      <span className="text-[12px] font-semibold text-gray-900 w-3">{item.count}</span>
                      <span className="text-[9px] text-gray-400 ml-1">({item.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Goals & OKRs */}
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-gray-900">My Goals & OKRs</h3>
                <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="mb-3">
                <select className="w-auto text-[10px] font-medium text-gray-700 border border-gray-200 bg-white rounded px-2 py-1 focus:outline-none focus:border-blue-300">
                  <option>Q2 - 2025 (Apr - Jun)</option>
                  <option>Q1 - 2025 (Jan - Mar)</option>
                </select>
              </div>
              <div className="grid grid-cols-[1fr_50px_40px] gap-2 items-end mb-1.5 border-b border-gray-100 pb-1.5">
                <span className="text-[10px] text-gray-500">Goal / OKR</span>
                <span className="text-[10px] text-gray-500 text-center">Progress</span>
                <span className="text-[10px] text-gray-500 text-right">Status</span>
              </div>
              <div className="flex-1 space-y-2">
                {[
                  { name: 'Increase Sales Revenue', pct: 75, status: 'On Track', color: 'bg-emerald-500', statusColor: 'text-emerald-500' },
                  { name: 'New Client Acquisition', pct: 60, status: 'On Track', color: 'bg-emerald-500', statusColor: 'text-emerald-500' },
                  { name: 'Customer Satisfaction', pct: 90, status: 'On Track', color: 'bg-emerald-500', statusColor: 'text-emerald-500' },
                  { name: 'Improve Lead Conversion', pct: 40, status: 'At Risk', color: 'bg-amber-500', statusColor: 'text-rose-500' },
                ].map((goal, i) => (
                  <div key={i} className="grid grid-cols-[1fr_50px_40px] gap-2 items-center">
                    <span className="text-[11px] text-gray-800 truncate pr-1" title={goal.name}>{goal.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${goal.color} rounded-full`} style={{ width: `${goal.pct}%` }} />
                      </div>
                      <span className="text-[9px] font-medium text-gray-700 w-5 text-right">{goal.pct}%</span>
                    </div>
                    <span className={`text-[9px] font-medium ${goal.statusColor} text-right leading-tight`}>{goal.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
