import React from 'react';
import {
  Building2, MapPin, BadgeCheck, CalendarDays, Briefcase, Network, Layers, Building,
  User, UserCog, Mail, Phone, PhoneCall, Clock, Calendar, FileClock,
  IndianRupee, CalendarCheck, ShieldCheck, FileCheck2, ScrollText, HeartHandshake, Eye,
  Edit, ArrowRight, Shield
} from 'lucide-react';

export function MoreInfoTab({ profileCard }: { profileCard?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 h-full">
      <div className="flex flex-col xl:flex-row gap-1 h-full">
        {profileCard && (
          <div className="w-full xl:w-[220px] shrink-0 h-full">
            {profileCard}
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {/* Company Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                <Building2 size={12} className="text-[#1d4ed8]" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Company Information</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Building size={10} className="text-[#1d4ed8] shrink-0" /> Company Name</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">CrewCam Technologies Pvt. Ltd.</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><MapPin size={10} className="text-[#1d4ed8] shrink-0" /> Company Address</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Plot No. 123, Sector 62,<br />Noida, Uttar Pradesh - 201309</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><BadgeCheck size={10} className="text-[#1d4ed8] shrink-0" /> Employee ID</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">EMP10234</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><CalendarDays size={10} className="text-[#1d4ed8] shrink-0" /> Date of Joining</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">15 Mar 2023 (1 Yr 2 Months)</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Briefcase size={10} className="text-[#1d4ed8] shrink-0" /> Employment Type</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Permanent</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Network size={10} className="text-[#1d4ed8] shrink-0" /> Business Unit</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Sales & Marketing</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Layers size={10} className="text-[#1d4ed8] shrink-0" /> Department</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Sales</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><MapPin size={10} className="text-[#1d4ed8] shrink-0" /> Location</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Noida Office</span>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                <User size={12} className="text-[#1d4ed8]" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Work Information</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><User size={10} className="text-[#1d4ed8] shrink-0" /> Designation</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Executive - Sales</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><UserCog size={10} className="text-[#1d4ed8] shrink-0" /> Reporting Manager</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Amit Kumar</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Mail size={10} className="text-[#1d4ed8] shrink-0" /> Work Email</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right break-all">rohan.mehta@crewcam.com</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Phone size={10} className="text-[#1d4ed8] shrink-0" /> Work Phone</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">+91 98765 43210</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><PhoneCall size={10} className="text-[#1d4ed8] shrink-0" /> Office Extension</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">4321</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Clock size={10} className="text-[#1d4ed8] shrink-0" /> Working Hours</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">9:30 AM - 6:30 PM</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><Calendar size={10} className="text-[#1d4ed8] shrink-0" /> Week Off</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Sunday</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><FileClock size={10} className="text-[#1d4ed8] shrink-0" /> Notice Period</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">30 Days</span>
              </div>
            </div>
          </div>

          {/* Compensation Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-50">
                <IndianRupee size={12} className="text-emerald-600" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Compensation Information</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><IndianRupee size={10} className="text-zinc-400 shrink-0" /> CTC (Annual)</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">₹ 8,40,000</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><IndianRupee size={10} className="text-zinc-400 shrink-0" /> Fixed Pay (Annual)</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">₹ 6,00,000</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><IndianRupee size={10} className="text-zinc-400 shrink-0" /> Variable Pay (Annual)</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">₹ 2,40,000</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><CalendarCheck size={10} className="text-zinc-400 shrink-0" /> Pay Frequency</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">Monthly</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><CalendarDays size={10} className="text-zinc-400 shrink-0" /> Effective From</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">15 Mar 2023</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><ShieldCheck size={10} className="text-zinc-400 shrink-0" /> PF Number</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">UPNOI1234567890</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><ShieldCheck size={10} className="text-zinc-400 shrink-0" /> ESIC Number</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">5345678901</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 w-1/3 flex items-center gap-1"><ShieldCheck size={10} className="text-zinc-400 shrink-0" /> UAN Number</span>
                <span className="font-medium text-zinc-900 w-2/3 text-right">101234567890</span>
              </div>
            </div>
          </div>

          {/* Statutory Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-rose-50">
                <ShieldCheck size={12} className="text-rose-600" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Statutory Information</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">PAN Number</span>
                <span className="font-medium text-zinc-900">ABCDE1234F</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Aadhaar Number</span>
                <span className="font-medium text-zinc-900">XXXX XXXX 5678</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">PF Number</span>
                <span className="font-medium text-zinc-900">UPNOI1234567890</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">ESIC Number</span>
                <span className="font-medium text-zinc-900">5345678901</span>
              </div>
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50 transition-colors">
              <Eye size={12} /> View All Statutory Details
            </button>
          </div>

          {/* Additional Information */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-purple-50">
                <FileCheck2 size={12} className="text-purple-600" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Additional Information</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Blood Group</span>
                <span className="font-medium text-zinc-900">O+</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Marital Status</span>
                <span className="font-medium text-zinc-900">Married</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Nationality</span>
                <span className="font-medium text-zinc-900">Indian</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Languages Known</span>
                <span className="font-medium text-zinc-900">English, Hindi</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Hobbies</span>
                <span className="font-medium text-zinc-900">Reading, Travelling, Music</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-zinc-500">Passport Number</span>
                <span className="font-medium text-zinc-900">Z1234567</span>
              </div>
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50 transition-colors">
              <Edit size={12} /> Edit Additional Information
            </button>
          </div>

          {/* Company Policies */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
            <div className="mb-2 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                <ScrollText size={12} className="text-[#1d4ed8]" />
              </div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Company Policies</h3>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              {[
                { name: 'Code of Conduct' },
                { name: 'Leave Policy' },
                { name: 'Attendance Policy' },
                { name: 'IT & Internet Policy' },
                { name: 'POSH Policy' }
              ].map((policy, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-zinc-50 p-0.5 rounded transition-colors">
                  <div className="flex items-center gap-1.5">
                    <ScrollText size={12} className="text-[#1d4ed8]" />
                    <span className="font-medium text-zinc-700 group-hover:text-[#1d4ed8]">{policy.name}</span>
                  </div>
                  <ArrowRight size={12} className="text-zinc-400 group-hover:text-[#1d4ed8]" />
                </div>
              ))}
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50 transition-colors">
              <ScrollText size={12} /> View All Policies
            </button>
          </div>

        </div>
      </div>

      {/* Footer Alert */}
      <div className="mt-1 rounded-xl bg-[#f0f4ff] border border-blue-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 bg-blue-500 text-white rounded-md p-1.5">
            <Shield size={16} />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-zinc-900">Your Information is Safe</h4>
            <p className="text-[10px] text-zinc-600 font-medium">We are committed to protecting your personal information.</p>
            <p className="text-[10px] text-zinc-600 font-medium">Your data is used only for official purposes and is kept confidential.</p>
          </div>
        </div>
        <button className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm shrink-0">
          <ShieldCheck size={12} className="text-[#1d4ed8]" /> View Privacy Policy
        </button>
      </div>

    </div>
  );
}
