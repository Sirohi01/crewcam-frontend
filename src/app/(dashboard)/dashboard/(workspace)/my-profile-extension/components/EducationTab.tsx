'use client';

import React, { useMemo } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, CalendarDays, FileText, Pencil, Plus, Info, Trash2 } from 'lucide-react';
import { useMyDetails } from '@/hooks/useMyProfile';
import { useProfileSectionEditor } from '@/hooks/useProfileSectionEditor';
import { ProfileEntryDialog } from '@/components/profile/ProfileEntryDialog';
import { CERTIFICATION_FIELDS, COURSE_FIELDS, EDUCATION_FIELDS } from '@/components/profile/profileFields';

const fmt = (d?: string) => (d ? moment(d).format('DD MMM YYYY') : '-');
const entriesText = (n: number) => (n === 0 ? 'No entries' : `Showing 1 to ${n} of ${n} entries`);

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-2 py-4 text-center text-xs normal-case text-zinc-400">{text}</td>
    </tr>
  );
}

function RowActions({ onEdit, onDelete, disabled }: { onEdit: () => void; onDelete: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button aria-label="Edit" onClick={onEdit} className="text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={13} /></button>
      <button aria-label="Delete" onClick={onDelete} disabled={disabled} className="text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"><Trash2 size={11} /></button>
    </div>
  );
}

/** Education tab of the unified My Profile page. Same data and editors as /dashboard/my-profile/education-details. */
export function EducationTab({ profileCard }: { comingSoon?: (what: string) => () => void, profileCard?: React.ReactNode }) {
  const { data: details, isLoading } = useMyDetails();
  const education = useProfileSectionEditor('education', details?.education, 'Qualification');
  const certifications = useProfileSectionEditor('certifications', details?.certifications, 'Certification');
  const courses = useProfileSectionEditor('courses', details?.courses, 'Course');
  const latest = useMemo(
    () => [...education.rows].filter((e) => e.yearOfPassing).sort((a, b) => (b.yearOfPassing || 0) - (a.yearOfPassing || 0))[0],
    [education.rows]
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col xl:flex-row gap-1 h-full">
        {profileCard && (
          <div className="w-full xl:w-[220px] shrink-0 h-full">
            {profileCard}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1 h-full">
          {/* Education Summary */}
          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden shrink-0">
            <CardHeader className="px-2 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
              <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Education Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-1.5 grid grid-cols-2 lg:grid-cols-4 gap-1.5">
              <StatTile icon={GraduationCap} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Total Qualifications" value={String(education.rows.length)} sub="All Degrees/Diplomas" />
              <StatTile icon={Award} bg="bg-emerald-50 dark:bg-emerald-900/20" color="text-emerald-600" label="Highest Qualification" value={latest ? `${latest.qualification}${latest.specialization ? ` (${latest.specialization})` : ''}` : '-'} sub="Most recently completed" />
              <StatTile icon={CalendarDays} bg="bg-amber-50 dark:bg-amber-900/20" color="text-amber-600" label="Latest Year of Passing" value={latest?.yearOfPassing ? String(latest.yearOfPassing) : '-'} sub={latest?.institution} />
              <StatTile icon={FileText} bg="bg-purple-50 dark:bg-purple-900/20" color="text-purple-600" label="Certifications" value={String(certifications.rows.length)} sub="Additional Certificates" />
            </CardContent>
          </Card>

          {/* Academic Qualifications */}
          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden flex flex-col flex-1">
            <CardHeader className="flex-row items-center justify-between px-2 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-1 text-zinc-800 dark:text-zinc-100">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <GraduationCap size={11} className="text-blue-600" />
                </div>
                Academic Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto pb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Qualification</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Institute / University</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Board / University</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Year of Passing</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Percentage / CGPA</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Mode</th>
                      <th className="h-9 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Specialization</th>
                      <th className="h-9 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="capitalize">
                    {isLoading && <EmptyRow colSpan={8} text="Loading…" />}
                    {!isLoading && education.rows.length === 0 && <EmptyRow colSpan={8} text="No qualifications added yet." />}
                    {education.rows.map((row) => (
                      <tr key={row._id || row.qualification} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                        <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200">{row.qualification}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={row.institution}>{row.institution}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={row.board}>{row.board || '-'}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.yearOfPassing ?? '-'}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.score || '-'}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300">{row.mode || '-'}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300">{row.specialization || '-'}</td>
                        <td className="px-2 py-1.5 align-middle">
                          <RowActions onEdit={() => education.openEdit(row)} onDelete={() => education.remove(row)} disabled={education.isSaving} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-8">
                <p className="text-[11px] text-zinc-500 font-medium">{entriesText(education.rows.length)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Certifications and Courses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">

        {/* Certifications */}
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden flex flex-col min-w-0">
          <CardHeader className="flex-row items-center justify-between px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-1 text-zinc-800 dark:text-zinc-100">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Award size={11} className="text-blue-600" />
              </div>
              Certifications
            </CardTitle>
            <button onClick={certifications.openAdd} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
              <Plus size={13} /> Add Certification
            </button>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Certification Name</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Issued By</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Issue Date</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Expiry Date</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Credential ID</th>
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody className="capitalize">
                  {!isLoading && certifications.rows.length === 0 && <EmptyRow colSpan={6} text="No certifications added yet." />}
                  {certifications.rows.map((row) => (
                    <tr key={row._id || row.name} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.issuedBy || '-'}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{fmt(row.issueDate)}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{fmt(row.expiryDate)}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.credentialId || '-'}</td>
                      <td className="px-2 py-1.5 align-middle">
                        <RowActions onEdit={() => certifications.openEdit(row)} onDelete={() => certifications.remove(row)} disabled={certifications.isSaving} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
              <p className="text-[11px] text-zinc-500 font-medium">{entriesText(certifications.rows.length)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Add-on Courses */}
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden flex flex-col min-w-0">
          <CardHeader className="flex-row items-center justify-between px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-1 text-zinc-800 dark:text-zinc-100">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Award size={11} className="text-blue-600" />
              </div>
              Add-on Courses / Workshops
            </CardTitle>
            <button onClick={courses.openAdd} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
              <Plus size={13} /> Add Course
            </button>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Course / Workshop</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Institute / Provider</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Year</th>
                    <th className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Duration</th>
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody className="capitalize">
                  {!isLoading && courses.rows.length === 0 && <EmptyRow colSpan={5} text="No courses added yet." />}
                  {courses.rows.map((row) => (
                    <tr key={row._id || row.name} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.provider || '-'}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.year ?? '-'}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.duration || '-'}</td>
                      <td className="px-2 py-1.5 align-middle">
                        <RowActions onEdit={() => courses.openEdit(row)} onDelete={() => courses.remove(row)} disabled={courses.isSaving} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
              <p className="text-[11px] text-zinc-500 font-medium">{entriesText(courses.rows.length)}</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Notice Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-1.5 flex items-center gap-1.5 dark:bg-indigo-900/20 dark:border-indigo-900/40">
        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
          <Info size={13} className="text-white" />
        </div>
        <p className="text-xs text-indigo-900 dark:text-indigo-300">
          Keep your educational information updated. It helps us in internal assessments, registrations and career development opportunities.
        </p>
      </div>

      <ProfileEntryDialog fields={EDUCATION_FIELDS} {...education.dialog} />
      <ProfileEntryDialog fields={CERTIFICATION_FIELDS} {...certifications.dialog} />
      <ProfileEntryDialog fields={COURSE_FIELDS} {...courses.dialog} />
    </div>
  );
}

function StatTile({ icon: Icon, bg, color, label, value, sub }: {
  icon: any; bg: string; color: string; label: string; value: string; sub?: string;
}) {
  return (
    <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
      <CardContent className="p-1.5 flex items-center gap-1.5">
        <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
          <Icon size={12} className={color} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{value}</p>
          {sub && <p className="text-[10px] text-zinc-400 truncate">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
