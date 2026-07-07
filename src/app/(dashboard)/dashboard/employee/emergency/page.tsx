import React from 'react';
import Link from 'next/link';
import {
  BookOpen, Bell, Shield, Plus, Flame, ShieldAlert, Phone, MessageSquare, Pencil,
  MapPin, HeartPulse, DoorOpen, CheckCircle2, AlertTriangle, PlusCircle, FileText,
} from 'lucide-react';

// Dummy data matching the screenshot — no backend endpoint for this yet.
const helplines = [
  { label: 'Security Helpline', number: '+91 98765 43210', icon: Shield, accent: 'bg-blue-50 text-blue-600' },
  { label: 'Medical Assistance', number: '+91 98765 43211', icon: Plus, accent: 'bg-emerald-50 text-emerald-600' },
  { label: 'Fire Safety', number: '+91 98765 43212', icon: Flame, accent: 'bg-orange-50 text-orange-600' },
  { label: 'Women Safety Helpline', number: '+91 98765 43213', icon: ShieldAlert, accent: 'bg-violet-50 text-violet-600' },
];

const emergencyContacts = [
  { name: 'Neha Mehta', phone: '+91 98765 12121', relation: 'Wife', tag: 'Primary', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rakesh Mehta', phone: '+91 98765 23232', relation: 'Father', tag: 'Secondary', avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
  { name: 'Pooja Mehta', phone: '+91 98765 34343', relation: 'Sister', tag: 'Secondary', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Arjun Sharma', phone: '+91 98765 45454', relation: 'Friend', tag: 'Secondary', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
];

const importantInfo = [
  { icon: MapPin, accent: 'bg-blue-50 text-blue-600', label: 'Office Address', detail: 'Plot No. 123, Sector 62,\nNoida, Uttar Pradesh - 201309' },
  { icon: Plus, accent: 'bg-emerald-50 text-emerald-600', label: 'Nearest Hospital', detail: 'Felix Hospital, Sector 62, Noida\n(2.4 km away)' },
  { icon: ShieldAlert, accent: 'bg-amber-50 text-amber-600', label: 'Assembly Point', detail: 'Main Parking Area - Gate 2' },
  { icon: HeartPulse, accent: 'bg-rose-50 text-rose-600', label: 'AED (Defibrillator) Location', detail: 'Ground Floor, Reception Area' },
  { icon: DoorOpen, accent: 'bg-teal-50 text-teal-600', label: 'Emergency Exits', detail: 'Check floor plan for all exits' },
];

const recentAlerts = [
  { icon: CheckCircle2, color: 'text-emerald-500', title: 'Emergency Drill Completed', detail: 'Fire drill conducted on 20 May 2024', date: '20 May 2024', time: '10:30 AM' },
  { icon: AlertTriangle, color: 'text-amber-500', title: 'Power Outage', detail: 'Power outage in Building A', date: '15 May 2024', time: '02:15 PM' },
  { icon: CheckCircle2, color: 'text-emerald-500', title: 'System Check', detail: 'Emergency system check completed', date: '10 May 2024', time: '11:20 AM' },
];

const safetyTips = [
  'Familiarize yourself with exit routes and assembly points',
  'Keep emergency contacts updated always',
  'Do not use elevators during fire or any emergency',
  'Report any unsafe condition to admin immediately',
  'Stay calm and follow instructions during emergencies',
];

function Card({
  title, action, className = '', children, footer,
}: { title?: string; action?: React.ReactNode; className?: string; children?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className={`flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[13px] font-bold text-[#1a1c21]">{title}</h3>
          {action}
        </div>
      )}
      <div className="flex-1 px-3 py-2">{children}</div>
      {footer && <div className="border-t border-zinc-100 px-3 py-2">{footer}</div>}
    </div>
  );
}

function ViewLink({ href, label = 'View All' }: { href: string; label?: string }) {
  return <Link href={href} className="shrink-0 text-[11px] font-semibold text-blue-600 hover:text-blue-700">{label}</Link>;
}

export default function EmergencyPage() {
  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] space-y-2 p-1">
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-0 flex items-center gap-2 text-[10px] text-zinc-500">
              <span>Dashboard</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Emergency</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Emergency</h1>
            <p className="mt-1 text-[10px] text-zinc-500">Your safety is our priority. Quick access to help, contacts and important information.</p>
          </div>
          <button type="button" className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
            <BookOpen size={12} /> Emergency Guide
          </button>
        </div>

        {/* SOS banner */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white px-3 py-1.5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-600 text-[13px] font-extrabold text-white">SOS</span>
            <div>
              <p className="text-[14px] font-bold text-[#1a1c21]">In Case of Emergency</p>
              <p className="text-[11px] text-zinc-500">Tap the button to alert security and notify your emergency contacts.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <button type="button" className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-rose-700">
              <Bell size={14} /> Trigger Emergency Alert
            </button>
            <span className="text-[9.5px] font-medium text-rose-500">Use only in real emergencies</span>
          </div>
        </div>

        {/* Helpline cards */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {helplines.map((h) => (
            <div key={h.label} className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${h.accent}`}>
                <h.icon size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] text-zinc-500">{h.label}</p>
                <p className="text-[13.5px] font-bold text-[#1a1c21]">{h.number}</p>
                <p className="mb-1 text-[9.5px] font-semibold text-emerald-600">24/7 Available</p>
                <button type="button" className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
                  <Phone size={11} /> Call Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contacts / Info / Alerts+Tips */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <Card
            title="My Emergency Contacts"
            action={<ViewLink href="/dashboard/employee/family" label="Manage Contacts" />}
            footer={(
              <button type="button" className="flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                <PlusCircle size={13} /> Add Emergency Contact
              </button>
            )}
          >
            <div className="space-y-2">
              {emergencyContacts.map((c) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.avatar} alt={c.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-[#1a1c21]">{c.name}</p>
                    <p className="truncate text-[10px] text-zinc-500">{c.phone}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${c.tag === 'Primary' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{c.tag}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-emerald-600 hover:bg-emerald-50"><Phone size={11} /></button>
                    <button type="button" className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-blue-600 hover:bg-blue-50"><MessageSquare size={11} /></button>
                    <button type="button" className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50"><Pencil size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Important Information" footer={(
            <button type="button" className="flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
              <BookOpen size={12} /> View Office Safety Map
            </button>
          )}
          >
            <div className="space-y-2">
              {importantInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-2.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${info.accent}`}>
                    <info.icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold text-[#1a1c21]">{info.label}</p>
                    <p className="whitespace-pre-line text-[10px] leading-snug text-zinc-500">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-2">
            <Card title="Recent Alerts" action={<ViewLink href="/dashboard/employee/emergency" />}>
              <div className="space-y-1">
                {recentAlerts.map((a) => (
                  <div key={a.title} className="flex items-start gap-2.5">
                    <a.icon size={15} className={`mt-0.5 shrink-0 ${a.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-semibold text-[#1a1c21]">{a.title}</p>
                      <p className="truncate text-[10px] text-zinc-500">{a.detail}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[9.5px] text-zinc-400">{a.date}</p>
                      <p className="text-[9.5px] text-zinc-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Safety Tips" action={<ViewLink href="/dashboard/employee/emergency" />}>
              <div className="space-y-1">
                {safetyTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-blue-600" />
                    <p className="text-[11px] leading-snug text-zinc-600">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer banner */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
              <Shield size={22} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-[#1a1c21]">We Care About Your Safety</p>
              <p className="text-[11px] text-zinc-500">CrewCam is committed to providing a safe and secure work environment.<br className="hidden sm:block" /> In case of any emergency, help is just a click away.</p>
            </div>
          </div>
          <button type="button" className="flex shrink-0 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
            <FileText size={13} /> Safety Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
