import React from 'react';
import {
  ShieldAlert, PhoneCall, Plus, Shield, Activity, Flame, MessageCircle, MapPin, Building2,
  Users, HeartPulse, DoorOpen, Map, FileText, CheckCircle2, MoreVertical, Edit2, Trash2, Phone, MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const contacts = [
  { name: 'Neha Mehta', relation: 'Sister', phone: '+91 98765 12345', priority: 'Primary', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rajesh Mehta', relation: 'Father', phone: '+91 98110 11222', priority: 'Secondary', avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
  { name: 'Sushma Mehta', relation: 'Mother', phone: '+91 98110 11333', priority: 'Secondary', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Aryan Mehta', relation: 'Brother', phone: '+91 98765 54321', priority: 'Secondary', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

export function EmergencyTab({ profileCard }: { profileCard?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-[16px] font-bold text-zinc-900">Emergency</h2>
          <p className="text-[11px] text-zinc-500">Quick access to help, contacts and important information.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
          <FileText size={14} className="text-[#1d4ed8]" /> Emergency Guide
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-2 h-full">
        {/* Profile Card Sidebar */}
        {profileCard && (
          <div className="w-full xl:w-[220px] shrink-0 self-stretch flex flex-col">
            {profileCard}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">

          {/* Top Banner Alert */}
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-rose-500 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
                SOS
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-zinc-900">In Case of Emergency</h3>
                <p className="text-[11px] text-zinc-600 font-medium">Tap the button to alert security and notify your emergency contacts.</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <button className="flex items-center gap-1.5 rounded-md bg-rose-600 px-4 py-2 text-[12px] font-bold text-white hover:bg-rose-700 transition-colors shadow-md">
                <ShieldAlert size={16} /> Trigger Emergency Alert
              </button>
              <p className="text-[9px] text-rose-500 mt-1 font-medium">Use only in real emergencies</p>
            </div>
          </div>

          {/* 4 Helpline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { title: 'Security Helpline', number: '+91 98765 43210', icon: <Shield size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
              { title: 'Medical Assistance', number: '+91 98765 43211', icon: <Activity size={18} className="text-emerald-600" />, bg: 'bg-emerald-50' },
              { title: 'Fire Safety', number: '+91 98765 43212', icon: <Flame size={18} className="text-amber-500" />, bg: 'bg-amber-50' },
              { title: 'Women Safety Helpline', number: '+91 98765 43213', icon: <Shield size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
            ].map((help, i) => (
              <Card key={i} className="border-zinc-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-3 flex flex-col items-center text-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${help.bg}`}>
                    {help.icon}
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-700">{help.title}</h4>
                  <p className="text-[14px] font-black text-zinc-900 mt-0.5">{help.number}</p>
                  <p className="text-[9px] font-medium text-emerald-600 mt-0.5 mb-2">24/7 Available</p>
                  <button className="w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                    <PhoneCall size={12} /> Call Now
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Middle Row (Contacts, Info, Safety Tips) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-1">

            {/* Contacts Table */}
            <div className="lg:col-span-6 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex flex-col h-full">
              <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-50">
                    <ShieldAlert size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[12px] font-bold text-zinc-900">My Emergency Contacts</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                    <Plus size={12} /> Add Contact
                  </button>
                  <MoreVertical size={14} className="text-zinc-400 cursor-pointer" />
                </div>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                      <th className="pb-2 font-semibold">Name</th>
                      <th className="pb-2 font-semibold">Relationship</th>
                      <th className="pb-2 font-semibold">Mobile Number</th>
                      <th className="pb-2 font-semibold text-center">Priority</th>
                      <th className="pb-2 font-semibold text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 text-[11px]">
                    {contacts.map((c, i) => (
                      <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <img src={c.avatar} alt="" className="h-7 w-7 rounded-full object-cover shadow-sm border border-zinc-100" />
                            <span className="font-bold text-zinc-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-zinc-600 font-medium">{c.relation}</td>
                        <td className="py-2.5 text-zinc-800 font-medium">{c.phone}</td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold border ${c.priority === 'Primary' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center justify-end gap-1.5 pr-2">
                            <button className="p-1 rounded text-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-colors" title="Call"><Phone size={12} /></button>
                            <button className="p-1 rounded text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors" title="Message"><MessageSquare size={12} /></button>
                            <button className="p-1 rounded text-zinc-400 border border-zinc-200 hover:bg-zinc-50 transition-colors" title="Edit"><Edit2 size={12} /></button>
                            <button className="p-1 rounded text-rose-500 border border-rose-100 hover:bg-rose-50 transition-colors" title="Delete"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                * Primary contact will be notified first in case of an emergency.
              </p>
            </div>

            {/* Important Info */}
            <div className="lg:col-span-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex flex-col h-full">
              <div className="mb-3 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-50">
                  <FileText size={12} className="text-[#1d4ed8]" />
                </div>
                <h3 className="text-[12px] font-bold text-zinc-900">Important Information</h3>
              </div>
              <div className="flex-1 space-y-3 text-[11px]">
                <div className="flex gap-2">
                  <MapPin size={14} className="text-[#1d4ed8] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Office Address</p>
                    <p className="text-zinc-600 mt-0.5 leading-snug">Plot No. 123, Sector 62,<br />Noida, Uttar Pradesh - 201309</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Nearest Hospital</p>
                    <p className="text-zinc-600 mt-0.5 leading-snug">Felix Hospital, Sector 62, Noida<br />(2.4 km away)</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Users size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Assembly Point</p>
                    <p className="text-zinc-600 mt-0.5">Main Parking Area - Gate 2</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <HeartPulse size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">AED (Defibrillator) Location</p>
                    <p className="text-zinc-600 mt-0.5">Ground Floor, Reception Area</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <DoorOpen size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">Emergency Exits</p>
                    <p className="text-zinc-600 mt-0.5">Check floor plan for all exits</p>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-[#1d4ed8] hover:bg-zinc-50 transition-colors">
                <Map size={12} /> View Office Safety Map
              </button>
            </div>

            {/* Safety Tips */}
            <div className="lg:col-span-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex flex-col h-full">
              <div className="mb-3 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
                <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-50">
                  <ShieldAlert size={12} className="text-[#1d4ed8]" />
                </div>
                <h3 className="text-[12px] font-bold text-zinc-900">Safety Tips</h3>
              </div>
              <div className="flex-1 space-y-2.5">
                {[
                  'Familiarize yourself with exit routes and assembly points',
                  'Keep emergency contacts updated always',
                  'Do not use elevators during fire or any emergency',
                  'Report any unsafe condition to admin immediately',
                  'Stay calm and follow instructions during emergencies'
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <CheckCircle2 size={13} className="text-[#1d4ed8] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-zinc-700 leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-[#1d4ed8] hover:bg-zinc-50 transition-colors">
                <FileText size={12} /> Safety Guidelines
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="rounded-xl bg-[#f0f4ff] border border-blue-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm mt-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white border border-blue-200 text-[#1d4ed8] rounded-full flex items-center justify-center shadow-sm">
            <Shield size={20} className="fill-blue-50" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-zinc-900">We Care About Your Safety</h4>
            <p className="text-[11px] text-zinc-700 mt-0.5">CrewCam is committed to providing a safe and secure work environment.</p>
            <p className="text-[11px] text-zinc-700">In case of any emergency, help is just a click away.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[11px] text-zinc-500 font-medium hidden md:block">For any immediate assistance, contact HR Support.</p>
          <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-[11px] font-bold text-[#1d4ed8] hover:bg-zinc-50 shadow-sm shrink-0">
            <PhoneCall size={14} /> Contact HR
          </button>
        </div>
      </div>
    </div>
  );
}
