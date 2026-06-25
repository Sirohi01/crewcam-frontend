'use client';

import React, { useState } from 'react';
import { 
  FileText, Calendar, Users, Clock, UserPlus, CheckCircle2, 
  Upload, Edit, Lock, ChevronDown, Calendar as CalendarIcon,
  Bell, Check, RefreshCcw, BellRing, ExternalLink
} from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'unread', label: 'Unread', count: 5 },
  { id: 'important', label: 'Important', count: 3 },
];

const NOTIFICATIONS = [
  {
    group: "Today - 26 May 2026",
    items: [
      { id: 1, icon: <FileText size={18} />, color: "text-blue-600 bg-blue-50", title: "New policy added", desc: "Leave Policy 2026 has been added to company policies.", time: "2m ago", unread: true },
      { id: 2, icon: <Calendar size={18} />, color: "text-emerald-600 bg-emerald-50", title: "Interview scheduled", desc: "Sohil Sirohi interview on 26 May at 11:00 AM.", time: "15m ago", unread: true },
      { id: 3, icon: <Users size={18} />, color: "text-orange-500 bg-orange-50", title: "Attendance regularization", desc: "3 attendance regularization requests are pending approval.", time: "1h ago", unread: true },
      { id: 4, icon: <FileText size={18} />, color: "text-purple-600 bg-purple-50", title: "Payslip generated", desc: "April 2026 payslip is ready. You can download it now.", time: "3h ago", unread: true },
      { id: 5, icon: <Clock size={18} />, color: "text-blue-600 bg-blue-50", title: "System update", desc: "CrewCam will be updated tonight between 11:00 PM – 1:00 AM.", time: "1d ago", unread: false },
    ]
  },
  {
    group: "Yesterday - 25 May 2026",
    items: [
      { id: 6, icon: <UserPlus size={18} />, color: "text-emerald-600 bg-emerald-50", title: "New employee onboarding", desc: "Riya Sharma has been added to the organization.", time: "Yesterday, 4:30 PM", unread: false },
      { id: 7, icon: <CheckCircle2 size={18} />, color: "text-emerald-600 bg-emerald-50", title: "Leave request approved", desc: "Mohit Verma's leave request from 28 May to 30 May has been approved.", time: "Yesterday, 2:15 PM", unread: false },
      { id: 8, icon: <Upload size={18} />, color: "text-purple-600 bg-purple-50", title: "Document uploaded", desc: "Sohil Sirohi uploaded document 'Education Certificate.pdf'.", time: "Yesterday, 11:45 AM", unread: false },
      { id: 9, icon: <Edit size={18} />, color: "text-orange-500 bg-orange-50", title: "Task assignment", desc: "You have been assigned a new task 'Interview Feedback'.", time: "Yesterday, 10:30 AM", unread: false },
    ]
  },
  {
    group: "24 May 2026",
    items: [
      { id: 10, icon: <Lock size={18} />, color: "text-blue-600 bg-blue-50", title: "Password changed", desc: "Your password was changed successfully.", time: "24 May 2026, 9:20 PM", unread: false },
    ]
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full overflow-hidden bg-[#fafbfd]">
      
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
      `}</style>

      {/* LEFT COLUMN - MAIN LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-4xl p-4 lg:p-5 flex flex-col gap-4">
          
          {/* Header */}
          <div>
            <h1 className="text-[22px] font-bold text-slate-900">All Notifications</h1>
            <p className="text-[13px] text-slate-500 mt-1">Stay updated with all important alerts and activities.</p>
          </div>

          {/* Tabs & Actions */}
          <div className="flex items-center justify-between border-b border-slate-200">
            <div className="flex gap-6">
              {TABS.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-[#2563eb] text-[#2563eb]' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="text-[14px] font-bold">{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pb-3">
              <button className="text-[13px] font-bold text-blue-600 hover:underline">
                Mark all as read
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
                <RefreshCcw size={14} className="text-slate-400" />
                Most Recent
                <ChevronDown size={14} className="text-slate-400 ml-1" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-4">
            {NOTIFICATIONS.map((group, gIdx) => (
              <div key={gIdx} className="flex flex-col gap-2.5">
                <h3 className="text-[13px] font-bold text-slate-900">{group.group}</h3>
                
                <div className="flex flex-col rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                  {group.items.map((notif, nIdx) => (
                    <div 
                      key={notif.id} 
                      className={`flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        nIdx !== group.items.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${notif.color} scale-90`}>
                        {notif.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-900 leading-tight">{notif.title}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5">{notif.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span className="text-[10px] font-semibold text-slate-400">{notif.time}</span>
                        <div className={`h-2 w-2 rounded-full ${notif.unread ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-2 pb-8">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-blue-600 hover:bg-slate-50 shadow-sm transition-colors">
              Load more
              <ChevronDown size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN - SIDEBAR */}
      <div className="hidden xl:flex w-[340px] shrink-0 flex-col overflow-y-auto custom-scrollbar p-5 pl-0 gap-4">
        
        {/* Filter Notifications */}
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-[14px] font-bold text-slate-900 mb-3">Filter Notifications</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Type</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-[13px] font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>All Types</option>
                  <option>Alerts</option>
                  <option>Updates</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Priority</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-[13px] font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Normal</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Date</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                  <RefreshCcw size={14} className="text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Select date range" 
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-[13px] font-medium text-slate-600 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  readOnly
                />
                <CalendarIcon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700">Status</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-[13px] font-medium text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Read</option>
                  <option>Unread</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button className="w-full rounded-xl bg-[#2563eb] py-2.5 text-[13px] font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                Apply Filters
              </button>
              <button className="w-full rounded-xl bg-transparent py-2.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Notification Summary */}
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="text-[14px] font-bold text-slate-900 mb-3">Notification Summary</h3>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Bell size={14} />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">Total Notifications</span>
              </div>
              <span className="text-[14px] font-bold text-slate-900">12</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Check size={14} />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">Unread</span>
              </div>
              <span className="text-[14px] font-bold text-slate-900">5</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <BellRing size={14} />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">Important</span>
              </div>
              <span className="text-[14px] font-bold text-slate-900">3</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <CalendarIcon size={14} />
                </div>
                <span className="text-[13px] font-semibold text-slate-700">This Week</span>
              </div>
              <span className="text-[14px] font-bold text-slate-900">18</span>
            </div>
          </div>
        </div>

        {/* Need Help Card */}
        <div className="relative overflow-hidden flex flex-col rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="relative z-10 pr-12">
            <h3 className="text-[13px] font-bold text-slate-900 mb-1">Need help with notifications?</h3>
            <p className="text-[11px] text-slate-500 leading-snug mb-3">
              Learn how to manage your notification preferences and settings.
            </p>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm w-max">
              Go to Help Center
              <ExternalLink size={12} />
            </button>
          </div>
          
          {/* Mock Graphic */}
          <div className="absolute -right-4 bottom-1 h-16 w-20 opacity-80">
            <div className="relative h-full w-full">
              <div className="absolute right-4 bottom-2 h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg transform -rotate-12">
                <Bell size={24} className="text-white fill-white" />
              </div>
              <div className="absolute right-12 top-2 h-3 w-5 rounded-full bg-indigo-200 border border-white shadow-sm"></div>
              <div className="absolute right-2 top-4 h-2.5 w-2.5 rounded-full bg-purple-300"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
