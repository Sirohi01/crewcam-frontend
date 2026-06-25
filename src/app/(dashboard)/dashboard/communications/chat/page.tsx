'use client';

import React, { useState } from 'react';
import { 
  Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, 
  ChevronLeft, FileText, FileSpreadsheet,
  Check, CheckCheck, Menu, AlignLeft, Edit, Mail
} from 'lucide-react';
import Image from 'next/image';

const CHAT_LIST = [
  { id: 1, name: 'Sohil Sirohi', time: '11:42 AM', preview: "Thanks! I'll review and get back...", unread: 2, online: true, active: true },
  { id: 2, name: 'Hiring Team', time: '11:30 AM', preview: 'Neha: Please check the evaluation...', unread: 5, online: false, isGroup: true },
  { id: 3, name: 'Riya Sharma', time: '10:15 AM', preview: 'Can you share the update?', unread: 1, online: true },
  { id: 4, name: 'Mohit Verma', time: '9:48 AM', preview: 'Meeting at 3 PM', unread: 0, online: false },
  { id: 5, name: 'Onboarding Team', time: 'Yesterday', preview: 'Ankit: Welcome onboard!', unread: 0, online: false, isGroup: true },
  { id: 6, name: 'Priya Patel', time: 'Yesterday', preview: 'Document received, thank you.', unread: 0, online: false },
  { id: 7, name: 'Amit Singh', time: 'Yesterday', preview: "Let's connect tomorrow.", unread: 0, online: true },
  { id: 8, name: 'CTC Discussion', time: '2d ago', preview: 'You: Sure, will update.', unread: 0, online: false, isGroup: true },
  { id: 9, name: 'Vikram Joshi', time: '2d ago', preview: 'Great work!', unread: 0, online: false },
];

const MESSAGES = [
  { id: 1, sender: 'Sohil', text: 'Hi Sohil, just checking in on your interview process. How is everything going?', time: '11:30 AM', isMine: false },
  { id: 2, sender: 'Me', text: 'Hi Manish, the process is going great. Completed the technical round today.', time: '11:32 AM', isMine: true },
  { id: 3, sender: 'Sohil', text: 'Awesome! When is the next round scheduled?', time: '11:33 AM', isMine: false },
  { id: 4, sender: 'Me', text: 'HR round is scheduled for tomorrow at 11 AM.', time: '11:34 AM', isMine: true },
  { id: 5, sender: 'Sohil', text: 'Perfect, let me know if you need anything from my side.', time: '11:35 AM', isMine: false },
  { id: 6, sender: 'Me', text: "Thanks! I'll review and get back to you.", time: '11:42 AM', isMine: true },
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [rightTab, setRightTab] = useState('Details');
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full overflow-hidden bg-white">
      {/* Scrollbar Styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
      
      {/* 1. LEFT SIDEBAR - CHATS LIST */}
      <div className="flex w-[320px] shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Header */}
        <div className="flex h-[60px] items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Chats</h2>
          <div className="flex gap-2 text-slate-500">
            <button className="p-1.5 hover:bg-slate-100 rounded-md"><AlignLeft size={18} /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded-md"><Menu size={18} /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded-md"><Edit size={18} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-[#0e4778] focus:ring-1 focus:ring-[#0e4778] transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-4 pb-3 border-b border-slate-100 shrink-0">
          {['All', 'Unread', 'Groups', 'Direct'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                activeTab === tab ? 'border border-[#0e4778] text-[#0e4778]' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
              {tab === 'Unread' && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">5</span>}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {CHAT_LIST.map(chat => (
            <div 
              key={chat.id} 
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${chat.active ? 'bg-slate-50 border-l-2 border-[#0e4778]' : 'border-l-2 border-transparent'}`}
            >
              <div className="relative h-12 w-12 shrink-0 rounded-full bg-slate-200">
                {chat.isGroup ? (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <Menu size={20} />
                  </div>
                ) : (
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="" className="h-full w-full rounded-full object-cover" />
                )}
                {chat.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`truncate text-sm ${chat.active ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{chat.name}</h3>
                  <span className={`text-[11px] ${chat.unread > 0 ? 'font-bold text-emerald-600' : 'text-slate-400'}`}>{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`truncate text-[13px] ${chat.unread > 0 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{chat.preview}</p>
                  {chat.unread > 0 ? (
                    <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white ml-2">
                      {chat.unread}
                    </span>
                  ) : (
                    <CheckCheck size={14} className="text-[#0ea5e9] shrink-0 ml-2" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE - MAIN CHAT AREA */}
      <div className="flex flex-1 flex-col min-w-0 bg-slate-50/50">
        {/* Header */}
        <div className="flex h-[60px] items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-slate-800"><ChevronLeft size={20} /></button>
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setShowRightSidebar(!showRightSidebar)}
            >
              <div className="relative h-10 w-10 shrink-0">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="" className="h-full w-full rounded-full object-cover group-hover:ring-2 group-hover:ring-emerald-500 transition-all" />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight group-hover:text-[#0e4778] transition-colors">Sohil Sirohi</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-800 transition-colors"><Search size={18} /></button>
            <button className="hover:text-slate-800 transition-colors"><Phone size={18} /></button>
            <button className="hover:text-slate-800 transition-colors"><Video size={18} /></button>
            <button className="hover:text-slate-800 transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
          <div className="flex justify-center my-2">
            <span className="rounded-full bg-slate-200/60 px-3 py-1 text-xs font-semibold text-slate-500">Today</span>
          </div>

          {MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
              <div className="flex max-w-[75%] items-end gap-2">
                {!msg.isMine && (
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="" className="mb-1 h-8 w-8 shrink-0 rounded-full object-cover" />
                )}
                
                <div className="flex flex-col gap-1">
                  <div className={`relative px-4 py-3 text-sm shadow-sm ${
                    msg.isMine 
                      ? 'rounded-2xl rounded-tr-sm bg-[#dcfce3] text-slate-900 border border-[#bbf7d0]' 
                      : 'rounded-2xl rounded-tl-sm bg-white border border-slate-200 text-slate-800'
                  }`}>
                    {msg.text}
                    <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-medium ${msg.isMine ? 'text-emerald-700/80' : 'text-slate-400'}`}>
                      {msg.time}
                      {msg.isMine && <CheckCheck size={12} className="text-[#0ea5e9]" />}
                    </div>
                  </div>
                </div>

                {msg.isMine && (
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="" className="mb-1 h-8 w-8 shrink-0 rounded-full object-cover border border-slate-200" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-slate-200 bg-white p-3 shrink-0">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-slate-300 focus-within:bg-white transition-colors">
            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent px-2 py-1 text-[15px] outline-none placeholder:text-slate-400"
            />
            <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"><Smile size={20} /></button>
            <button className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e] text-white hover:bg-emerald-600 transition-colors shadow-sm">
              <Send size={18} className="-ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR - DETAILS */}
      {showRightSidebar && (
        <div className="hidden lg:flex w-[350px] shrink-0 flex-col border-l border-slate-200 bg-white overflow-y-auto custom-scrollbar">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 pt-4 shrink-0">
            {['Details', 'Media', 'Files', 'Links'].map(tab => (
              <button 
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`pb-3 text-sm font-semibold transition-colors ${
                  rightTab === tab ? 'border-b-2 border-[#0e4778] text-[#0e4778]' : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {rightTab === 'Details' && (
            <div className="flex flex-col p-6">
              {/* Profile Info */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-3 h-24 w-24">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="" className="h-full w-full rounded-full object-cover border-[3px] border-white shadow-sm ring-1 ring-slate-100" />
                  <div className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Sohil Sirohi</h2>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  Online
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 flex justify-center gap-6">
                {[
                  { icon: <Phone size={20} />, label: 'Audio' },
                  { icon: <Video size={20} />, label: 'Video' },
                  { icon: <Check size={20} />, label: 'Profile' },
                  { icon: <Search size={20} />, label: 'Search' },
                ].map((act, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-100 group-hover:text-slate-900 border border-slate-100 shadow-sm">
                      {act.icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{act.label}</span>
                  </div>
                ))}
              </div>

              <div className="my-8 h-px w-full bg-slate-100"></div>

              {/* About */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-900">About</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  HR Manager at Website<br/>
                  Handling recruitment and HR operations.
                </p>
              </div>

              <div className="my-6 h-px w-full bg-slate-100"></div>

              {/* Contact */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900">Contact</h3>
                <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  sohilsirohi02@gmail.com
                </div>
                <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  9567258784
                </div>
              </div>

              <div className="my-6 h-px w-full bg-slate-100"></div>

              {/* Shared Media */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Shared Media</h3>
                  <button className="text-xs font-semibold text-[#0e4778] hover:underline">View all</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" alt="" className="aspect-square w-full rounded-lg object-cover border border-slate-200" />
                  <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=200" alt="" className="aspect-square w-full rounded-lg object-cover border border-slate-200" />
                  <div className="relative aspect-square w-full cursor-pointer rounded-lg border border-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=200" alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-bold text-white">+12</div>
                  </div>
                </div>
              </div>

              <div className="my-6 h-px w-full bg-slate-100"></div>

              {/* Files */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Files</h3>
                  <button className="text-xs font-semibold text-[#0e4778] hover:underline">View all</button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-[13px] font-semibold text-slate-900">Sohil_Resume.pdf</h4>
                      <p className="text-[11px] font-medium text-slate-500">PDF • 1.2 MB</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">Yesterday</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-[13px] font-semibold text-slate-900">Interview_Evaluation_Sheet.xls</h4>
                      <p className="text-[11px] font-medium text-slate-500">XLSX • 850 KB</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">2d ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-[13px] font-semibold text-slate-900">CTC_Breakup_Sohil.pdf</h4>
                      <p className="text-[11px] font-medium text-slate-500">PDF • 480 KB</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">3d ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
