'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye, Edit2, Mail, Phone, CalendarDays, MapPin, CheckCircle2,
  ChevronRight, Plus, GraduationCap, Award, Calendar,
  FileText, Trash2, Info
} from 'lucide-react';
import { useMyDetails, useMyProfile } from '@/hooks/useMyProfile';
import { useProfileSectionEditor } from '@/hooks/useProfileSectionEditor';
import { ProfileEntryDialog } from '@/components/profile/ProfileEntryDialog';
import { CERTIFICATION_FIELDS, COURSE_FIELDS, EDUCATION_FIELDS } from '@/components/profile/profileFields';

const fmt = (d?: string) => (d ? moment(d).format('DD MMM YYYY') : '-');

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-6 text-center text-[13px] text-gray-400">{text}</td>
    </tr>
  );
}

function RowActions({ onEdit, onDelete, disabled }: { onEdit: () => void; onDelete: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button aria-label="Edit" onClick={onEdit} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button>
      <button aria-label="Delete" onClick={onDelete} disabled={disabled} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-50"><Trash2 size={16} /></button>
    </div>
  );
}

const entriesText = (n: number) => (n === 0 ? 'No entries' : `Showing 1 to ${n} of ${n} entries`);

export default function EducationDetailsPage() {
  const { data: profile } = useMyProfile();
  const { data: details, isLoading } = useMyDetails();

  const education = useProfileSectionEditor('education', details?.education, 'Qualification');
  const certifications = useProfileSectionEditor('certifications', details?.certifications, 'Certification');
  const courses = useProfileSectionEditor('courses', details?.courses, 'Course');

  // Highest = most recently completed qualification; good enough without a degree ranking.
  const latest = useMemo(
    () => [...education.rows].filter((e) => e.yearOfPassing).sort((a, b) => (b.yearOfPassing || 0) - (a.yearOfPassing || 0))[0],
    [education.rows]
  );

  const name = profile ? `${profile.firstName} ${profile.lastName}`.trim() : '';
  const role = profile?.designationId?.name || profile?.designation || '';
  const manager = profile?.reportingToId;
  const initials = (n: string) => n.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');

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
            <Link href="/dashboard/view-public-profile" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Eye size={18} />
              View Public Profile
            </Link>
            <button onClick={education.openAdd} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
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
                    {profile?.profilePictureUrl ? (
                      <img src={profile.profilePictureUrl} alt={name} className="w-[112px] h-[112px] rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                      <div className="w-[112px] h-[112px] rounded-full border-4 border-white shadow-sm bg-blue-50 grid place-items-center text-[28px] font-bold text-blue-600">
                        {initials(name) || '…'}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-[22px] font-bold text-gray-900 flex items-center justify-center gap-1.5">
                      {name} {profile && <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />}
                    </h2>
                    {profile?.employeeCode && <p className="text-[13px] font-medium text-gray-500 mt-1">{profile.employeeCode}</p>}
                    {role && <p className="text-[15px] font-semibold text-gray-900 mt-1">{role}</p>}
                    {profile && (
                      <span className="inline-block mt-3 px-4 py-1 bg-emerald-50 text-emerald-600 text-[13px] font-semibold rounded-full border border-emerald-100">
                        {profile.employmentStatus === 'ex' ? 'Inactive' : 'Active'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400 shrink-0" />
                    <p className="text-[13px] text-gray-600 truncate">{profile?.email}</p>
                  </div>
                  {profile?.mobileNumber && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-gray-400 shrink-0" />
                      <p className="text-[13px] text-gray-600">{profile.mobileNumber}</p>
                    </div>
                  )}
                  {profile?.dateOfJoining && (
                    <div className="flex items-center gap-3">
                      <CalendarDays size={18} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[13px] text-gray-900 font-medium">{fmt(profile.dateOfJoining)}</p>
                        <p className="text-[11px] text-gray-500">Date of Joining</p>
                      </div>
                    </div>
                  )}
                  {profile?.branchId?.name && (
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[13px] text-gray-900 font-medium">{profile.branchId.name}</p>
                        <p className="text-[11px] text-gray-500">Work Location</p>
                      </div>
                    </div>
                  )}
                </div>

                {manager && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                    <p className="text-[11px] text-gray-500 font-medium mb-2">Reporting To</p>
                    <div className="flex items-center gap-3">
                      {manager.profilePictureUrl ? (
                        <img src={manager.profilePictureUrl} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full shadow-sm border border-gray-200 bg-blue-50 grid place-items-center text-[12px] font-bold text-blue-600">
                          {initials(`${manager.firstName} ${manager.lastName}`)}
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">{manager.firstName} {manager.lastName}</p>
                        {manager.designation && <p className="text-[11px] text-gray-500">{manager.designation}</p>}
                      </div>
                    </div>
                  </div>
                )}
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
                      <p className="text-xl font-bold text-gray-900">{education.rows.length}</p>
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
                      <p className="text-xl font-bold text-gray-900">{latest ? `${latest.qualification}${latest.specialization ? ` (${latest.specialization})` : ''}` : '-'}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">Most recently completed</p>
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
                  </div>

                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Calendar className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Latest Year of Passing</p>
                      <p className="text-xl font-bold text-gray-900">{latest?.yearOfPassing ?? '-'}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">{latest ? latest.institution : 'Add a qualification'}</p>
                    </div>
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gray-200" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <FileText className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">Certifications</p>
                      <p className="text-xl font-bold text-gray-900">{certifications.rows.length}</p>
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
                      <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading && <EmptyRow colSpan={8} text="Loading…" />}
                    {!isLoading && education.rows.length === 0 && <EmptyRow colSpan={8} text="No qualifications added yet." />}
                    {education.rows.map((row) => (
                      <tr key={row._id || row.qualification} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.qualification}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600 max-w-[200px] truncate" title={row.institution}>{row.institution}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600 max-w-[200px] truncate" title={row.board}>{row.board || '-'}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.yearOfPassing ?? '-'}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.score || '-'}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.mode || '-'}</td>
                        <td className="px-4 py-2 text-[13px] text-gray-600">{row.specialization || '-'}</td>
                        <td className="px-4 py-2">
                          <RowActions onEdit={() => education.openEdit(row)} onDelete={() => education.remove(row)} disabled={education.isSaving} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-[12px] text-gray-500">{entriesText(education.rows.length)}</p>
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
                  <button onClick={certifications.openAdd} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700">
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
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {!isLoading && certifications.rows.length === 0 && <EmptyRow colSpan={6} text="No certifications added yet." />}
                      {certifications.rows.map((row) => (
                        <tr key={row._id || row.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.issuedBy || '-'}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600 whitespace-nowrap">{fmt(row.issueDate)}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600 text-center">{fmt(row.expiryDate)}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.credentialId || '-'}</td>
                          <td className="px-4 py-2">
                            <RowActions onEdit={() => certifications.openEdit(row)} onDelete={() => certifications.remove(row)} disabled={certifications.isSaving} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <p className="text-[12px] text-gray-500">{entriesText(certifications.rows.length)}</p>
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
                  <button onClick={courses.openAdd} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700">
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
                        <th className="px-4 py-2 text-[12px] font-semibold text-gray-900 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {!isLoading && courses.rows.length === 0 && <EmptyRow colSpan={5} text="No courses added yet." />}
                      {courses.rows.map((row) => (
                        <tr key={row._id || row.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-[13px] font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.provider || '-'}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.year ?? '-'}</td>
                          <td className="px-4 py-2 text-[13px] text-gray-600">{row.duration || '-'}</td>
                          <td className="px-4 py-2">
                            <RowActions onEdit={() => courses.openEdit(row)} onDelete={() => courses.remove(row)} disabled={courses.isSaving} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                  <p className="text-[12px] text-gray-500">{entriesText(courses.rows.length)}</p>
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

      <ProfileEntryDialog fields={EDUCATION_FIELDS} {...education.dialog} />
      <ProfileEntryDialog fields={CERTIFICATION_FIELDS} {...certifications.dialog} />
      <ProfileEntryDialog fields={COURSE_FIELDS} {...courses.dialog} />
    </div>
  );
}
