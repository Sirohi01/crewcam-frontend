'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Eye, Edit3, Users, Plus, Pencil, Trash2, FileBadge2, UploadCloud, ShieldAlert, Contact } from 'lucide-react';
import { useMyDetails, useMyProfile, useSaveMyDetailsSection } from '@/hooks/useMyProfile';
import { useProfileSectionEditor } from '@/hooks/useProfileSectionEditor';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { ProfileEntryDialog } from '@/components/profile/ProfileEntryDialog';
import { EMERGENCY_FIELDS, FAMILY_FIELDS, FAMILY_INFO_FIELDS, GENDER_OPTIONS } from '@/components/profile/profileFields';
import type { FamilyInfo } from '@/services/meService';

const formatDate = (value?: string) => (value ? moment(value).format('DD MMM YYYY') : '—');
const ageOf = (dob?: string) => (dob ? `${moment().diff(moment(dob), 'years')} Yrs` : '—');
const genderLabel = (g?: string) => GENDER_OPTIONS.find((o) => o.value === g)?.label || '—';

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-4 text-center text-[10px] text-zinc-400">{text}</td>
    </tr>
  );
}

export default function FamilyDetail() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: details, isLoading: detailsLoading } = useMyDetails();

  const family = useProfileSectionEditor('familyMembers', details?.familyMembers, 'Family Member');
  const emergency = useProfileSectionEditor('emergencyContacts', details?.emergencyContacts, 'Emergency Contact');

  const [familyInfoOpen, setFamilyInfoOpen] = useState(false);
  const saveFamilyInfo = useSaveMyDetailsSection('familyInfo', 'Family information saved');
  const info: FamilyInfo = details?.familyInfo || {};
  const dependents = useMemo(() => family.rows.filter((m) => m.isDependent).length, [family.rows]);

  const infoRows: Array<[string, string]> = [
    ['Family Status', info.familyStatus || '—'],
    ['No. of Dependents', String(dependents)],
    ['Spouse Name', info.spouseName || 'N/A'],
    ['Marriage Anniversary', info.marriageAnniversary ? formatDate(info.marriageAnniversary) : 'N/A'],
    ['Family Address', info.familyAddress || '—'],
    ['Blood Group (Self)', profile?.bloodGroup || '—'],
    ['Family Medical History', info.medicalHistory || '—'],
    ['Nominee for PF / ESIC', info.nomineeName ? `${info.nomineeName}${info.nomineeRelationship ? ` (${info.nomineeRelationship})` : ''}` : '—'],
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span>My Profile</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Family Details</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Family Details</h1>
            <p className="text-[10px] text-zinc-500 mt-1">View and manage your family information.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/view-public-profile" className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Eye size={12} /> View Public Profile
            </Link>
            <button onClick={family.openAdd} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-700">
              <Edit3 size={12} /> Edit Family Details
            </button>
          </div>
        </div>

        <ProfileTabs active="Family Details" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
          <ProfileSummaryCard profile={profile} isLoading={profileLoading} />

          {/* Right Content Area */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">

            {/* Family Members Section */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-[#1d4ed8]" />
                  <h3 className="text-[10px] font-bold text-zinc-900">Family Members</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={family.openAdd} className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-100">
                    <Plus size={12} /> Add Family Member
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[#1d4ed8] font-medium text-[10px]">
                      <th className="pb-3 pl-2 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Relationship</th>
                      <th className="pb-3 font-semibold">Date of Birth</th>
                      <th className="pb-3 font-semibold">Age</th>
                      <th className="pb-3 font-semibold">Gender</th>
                      <th className="pb-3 font-semibold">Occupation</th>
                      <th className="pb-3 font-semibold">Mobile Number</th>
                      <th className="pb-3 font-semibold">Email ID</th>
                      <th className="pb-3 font-semibold text-center">Dependent</th>
                      <th className="pb-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {detailsLoading && <EmptyRow colSpan={10} text="Loading…" />}
                    {!detailsLoading && family.rows.length === 0 && <EmptyRow colSpan={10} text="No family members added yet." />}
                    {family.rows.map((member) => (
                      <tr key={member._id || member.name} className="hover:bg-zinc-50/50">
                        <td className="py-1.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="grid h-6 w-6 place-items-center rounded-full border border-zinc-200 bg-blue-50 text-[9px] font-bold text-[#1d4ed8]">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-zinc-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 text-zinc-600">{member.relationship}</td>
                        <td className="py-1.5 text-zinc-600">{formatDate(member.dateOfBirth)}</td>
                        <td className="py-1.5 text-zinc-600">{ageOf(member.dateOfBirth)}</td>
                        <td className="py-1.5 text-zinc-600">{genderLabel(member.gender)}</td>
                        <td className="py-1.5 text-zinc-600 whitespace-pre-line leading-tight">{member.occupation || '—'}</td>
                        <td className="py-1.5 text-zinc-600">{member.mobile || '—'}</td>
                        <td className="py-1.5 text-zinc-600">{member.email || '—'}</td>
                        <td className="py-1.5 text-center">
                          <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-semibold border ${member.isDependent ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-zinc-50 text-zinc-500 border-zinc-200'}`}>
                            {member.isDependent ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-1.5">
                          <div className="flex items-center justify-center gap-2">
                            <button aria-label={`Edit ${member.name}`} onClick={() => family.openEdit(member)} className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50">
                              <Pencil size={12} />
                            </button>
                            <button aria-label={`Delete ${member.name}`} disabled={family.isSaving} onClick={() => family.remove(member)} className="rounded border border-red-100 p-1 text-red-500 hover:bg-red-50 disabled:opacity-50">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[10px] text-zinc-500 font-medium">
                * Dependent members are considered for insurance, tax benefits and other company policies.
              </p>
            </div>

            {/* Emergency & Other Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-2">

              {/* Emergency Contacts */}
              <div className="col-span-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                      <ShieldAlert size={12} className="text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-[11px] font-bold text-zinc-900">Emergency Contacts</h3>
                  </div>
                </div>
                <div className="flex-1">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[#1d4ed8] ">
                        <th className="pb-2 px-0.5 font-semibold">Name</th>
                        <th className="pb-2 px-0.5 font-semibold">Relationship</th>
                        <th className="pb-2 px-0.5 font-semibold">Mobile No.</th>
                        <th className="pb-2 px-0.5 font-semibold">Alternate No.</th>
                        <th className="pb-2 px-0.5 font-semibold">Address</th>
                        <th className="pb-2 px-0.5 font-semibold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {!detailsLoading && emergency.rows.length === 0 && <EmptyRow colSpan={6} text="No emergency contacts added yet." />}
                      {emergency.rows.map((contact) => (
                        <tr key={contact._id || contact.name}>
                          <td className="py-2 px-0.5 font-semibold text-zinc-900">{contact.name}{contact.isPrimary && <span className="ml-1 text-[9px] font-medium text-emerald-600">(Primary)</span>}</td>
                          <td className="py-2 px-0.5 text-zinc-600">{contact.relationship}</td>
                          <td className="py-2 px-0.5 text-zinc-600">{contact.mobile}</td>
                          <td className="py-2 px-0.5 text-zinc-600">{contact.alternateMobile || '—'}</td>
                          <td className="py-2 px-0.5 text-zinc-600 whitespace-pre-line leading-tight">{contact.address || '—'}</td>
                          <td className="py-2 px-0.5">
                            <div className="flex justify-center gap-2">
                              <button aria-label={`Edit ${contact.name}`} onClick={() => emergency.openEdit(contact)} className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50">
                                <Pencil size={12} />
                              </button>
                              <button aria-label={`Delete ${contact.name}`} disabled={emergency.isSaving} onClick={() => emergency.remove(contact)} className="rounded border border-red-100 p-1 text-red-500 hover:bg-red-50 disabled:opacity-50">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button onClick={emergency.openAdd} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                    <Plus size={12} /> Add Emergency Contact
                  </button>
                </div>
              </div>

              {/* Other Family Information */}
              <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                      <Contact size={12} className="text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-[11px] font-bold text-zinc-900">Other Family Information</h3>
                  </div>
                  <button onClick={() => setFamilyInfoOpen(true)} className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50">
                    Edit
                  </button>
                </div>
                <div className="space-y-2 text-[10px] flex-1">
                  {infoRows.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-5">
                      <span className="col-span-2 text-zinc-500">{label}</span>
                      <span className="col-span-3 font-medium text-zinc-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Documents Uploaded Section — document storage arrives in Phase 1D */}
        <div className="mt-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileBadge2 size={12} className="text-[#1d4ed8]" />
            <h3 className="text-[10px] font-bold text-zinc-900">Documents Uploaded</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="rounded-lg border border-[#1d4ed8]/30 bg-blue-50/30 p-4 flex flex-col items-center justify-center text-center min-h-[140px]" title="Coming soon">
              <UploadCloud size={24} className="text-[#1d4ed8] mb-2" />
              <p className="text-[10px] font-semibold text-[#1d4ed8]">Upload Document</p>
              <p className="text-[10px] text-zinc-500 mt-1">Family document upload is coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <ProfileEntryDialog fields={FAMILY_FIELDS} {...family.dialog} />
      <ProfileEntryDialog fields={EMERGENCY_FIELDS} {...emergency.dialog} />
      <ProfileEntryDialog
        open={familyInfoOpen}
        title="Edit Family Information"
        fields={FAMILY_INFO_FIELDS}
        initial={info}
        saving={saveFamilyInfo.isPending}
        onClose={() => setFamilyInfoOpen(false)}
        onSubmit={(values) => saveFamilyInfo.mutate(values as FamilyInfo, { onSuccess: () => setFamilyInfoOpen(false) })}
      />
    </div>
  );
}
