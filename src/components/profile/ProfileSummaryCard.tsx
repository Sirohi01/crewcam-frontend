'use client';

import React from 'react';
import moment from 'moment';
import { Mail, Phone, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import type { MyProfile } from '@/services/meService';

/** Initials avatar, used when the employee has no profile photo. */
function Avatar({ src, name, className }: { src?: string; name: string; className: string }) {
  if (src) return <img src={src} alt={name} className={`${className} object-cover`} />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className={`${className} grid place-items-center bg-blue-50 font-bold text-[#1d4ed8]`} aria-label={name}>
      {initials || '?'}
    </div>
  );
}

/**
 * Left-hand profile card shared by the My Profile tab pages (Family, Bank, Education,
 * Emergency…). Markup unchanged from the original static pages; data now comes from
 * GET /me/profile.
 */
export function ProfileSummaryCard({ profile, isLoading }: { profile?: MyProfile; isLoading?: boolean }) {
  if (isLoading || !profile) {
    return (
      <div className="col-span-1 h-full">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col items-center h-full animate-pulse">
          <div className="mb-4 h-24 w-24 rounded-full bg-zinc-100" />
          <div className="h-3 w-24 rounded bg-zinc-100" />
          <div className="mt-2 h-2 w-16 rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const name = `${profile.firstName} ${profile.lastName}`.trim();
  const role = profile.designationId?.name || profile.designation || profile.roleId?.name || '';
  const manager = profile.reportingToId;
  const managerName = manager ? `${manager.firstName} ${manager.lastName}`.trim() : '';
  const isActive = profile.isActive !== false && profile.employmentStatus !== 'ex';

  return (
    <div className="col-span-1 h-full">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col items-center text-center h-full">
        <div className="relative mb-4">
          <Avatar src={profile.profilePictureUrl} name={name} className="h-24 w-24 rounded-full border border-zinc-200 p-1 bg-white shadow-sm text-xl" />
        </div>
        <h2 className="flex items-center gap-2 text-[10px] font-bold text-zinc-900">
          {name} {isActive && <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-100" />}
        </h2>
        {profile.employeeCode && <p className="mt-1 text-[10px] font-medium text-zinc-500">{profile.employeeCode}</p>}
        {role && <p className="text-[10px] text-zinc-500">{role}</p>}
        <span
          className={`mt-3 inline-block rounded-md px-3 py-1 text-[10px] font-semibold border ${
            isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>

        <div className="mt-6 w-full space-y-4 border-t border-zinc-100 pt-6 text-left">
          <div className="flex items-center gap-3 text-[10px]">
            <Mail size={12} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-700 truncate">{profile.email}</span>
          </div>
          {profile.mobileNumber && (
            <div className="flex items-center gap-3 text-[10px]">
              <Phone size={12} className="text-zinc-400 shrink-0" />
              <span className="text-zinc-700">{profile.mobileNumber}</span>
            </div>
          )}
          {profile.dateOfJoining && (
            <div className="flex items-start gap-3 text-[10px]">
              <Calendar size={12} className="text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-900">{moment(profile.dateOfJoining).format('DD MMM YYYY')}</p>
                <p className="text-[10px] text-zinc-500">Date of Joining</p>
              </div>
            </div>
          )}
          {profile.branchId?.name && (
            <div className="flex items-start gap-3 text-[10px]">
              <MapPin size={12} className="text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-900">{profile.branchId.name}</p>
                <p className="text-[10px] text-zinc-500">Work Location</p>
              </div>
            </div>
          )}

          {manager && (
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-3">
              <Avatar src={manager.profilePictureUrl} name={managerName} className="h-9 w-9 rounded-full border border-zinc-200 text-[10px]" />
              <div>
                <p className="text-[10px] text-zinc-500">Reporting To</p>
                <p className="text-[10px] font-semibold text-[#1d4ed8]">{managerName}</p>
                {manager.designation && <p className="text-[10px] text-zinc-500">{manager.designation}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
