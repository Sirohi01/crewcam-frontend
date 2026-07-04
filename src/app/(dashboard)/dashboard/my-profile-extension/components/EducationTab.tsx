import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, CalendarDays, FileText, ChevronDown, Eye, Pencil, Plus, Info, Trash2 } from 'lucide-react';

export const EDUCATION_SUMMARY_DATA = {
  total: { value: "5", sub: "All Degrees/Diplomas" },
  highest: { value: "MBA (Marketing)", sub: "Post Graduation" },
  years: { value: "17 Years", sub: "Till Post Graduation" },
  certifications: { value: "3", sub: "Additional Certificates" }
};

export const ACADEMIC_QUALIFICATIONS_DATA = [
  { qual: 'MBA (Marketing)', inst: 'Symbiosis Pune', board: 'Symbiosis Int', year: '2021', score: '78.60%', mode: 'Full Time', spec: 'Marketing' },
  { qual: 'BBA', inst: 'Delhi University', board: 'DU', year: '2018', score: '72.30%', mode: 'Full Time', spec: 'General' },
  { qual: '12th (CBSE)', inst: 'Kendriya Vidyalaya', board: 'CBSE', year: '2015', score: '81.20%', mode: 'Full Time', spec: 'Commerce' },
  { qual: '10th (CBSE)', inst: 'Kendriya Vidyalaya', board: 'CBSE', year: '2013', score: '85.60%', mode: 'Full Time', spec: 'N/A' },
];

export const CERTIFICATIONS_DATA = [
  { name: 'Google Ads Certification', issuer: 'Google', issue: '10 Jan 2023', expiry: '-', id: 'GOOG-AD-45678' },
  { name: 'HubSpot Inbound Marketing', issuer: 'HubSpot Academy', issue: '15 Jun 2022', expiry: '-', id: 'HS-IM-78945' },
  { name: 'Advanced Excel Certification', issuer: 'Coursera', issue: '20 Sep 2021', expiry: '-', id: 'CRS-EX-12345' },
];

export const ADD_ON_COURSES_DATA = [
  { name: 'Financial Modeling', inst: 'Udemy', year: '2022', duration: '2 Months' },
  { name: 'Brand Management', inst: 'IIM Bangalore (Executive Ed.)', year: '2021', duration: '1 Month' },
];

export function EducationTab({ comingSoon, profileCard }: { comingSoon: (what: string) => () => void, profileCard?: React.ReactNode }) {
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
              <StatTile icon={GraduationCap} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Total Qualifications" value={EDUCATION_SUMMARY_DATA.total.value} sub={EDUCATION_SUMMARY_DATA.total.sub} />
              <StatTile icon={Award} bg="bg-emerald-50 dark:bg-emerald-900/20" color="text-emerald-600" label="Highest Qualification" value={EDUCATION_SUMMARY_DATA.highest.value} sub={EDUCATION_SUMMARY_DATA.highest.sub} />
              <StatTile icon={CalendarDays} bg="bg-amber-50 dark:bg-amber-900/20" color="text-amber-600" label="Years of Education" value={EDUCATION_SUMMARY_DATA.years.value} sub={EDUCATION_SUMMARY_DATA.years.sub} />
              <StatTile icon={FileText} bg="bg-purple-50 dark:bg-purple-900/20" color="text-purple-600" label="Certifications" value={EDUCATION_SUMMARY_DATA.certifications.value} sub={EDUCATION_SUMMARY_DATA.certifications.sub} />
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
              <div className="flex items-center gap-1.5">
                <a href="#" className="text-[11px] font-medium text-blue-600 hover:text-blue-700">View Timeline</a>
                <button className="text-[11px] font-medium text-zinc-600 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 flex items-center gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  All <ChevronDown size={11} />
                </button>
              </div>
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
                      <th className="h-9 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Document</th>
                      <th className="h-9 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACADEMIC_QUALIFICATIONS_DATA.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                        <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200">{row.qual}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={row.inst}>{row.inst}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={row.board}>{row.board}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.year}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.score}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300">{row.mode}</td>
                        <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300">{row.spec}</td>
                        <td className="px-2 py-1.5 align-middle text-center">
                          <button onClick={comingSoon('View Document')} className="inline-flex p-1 text-zinc-600 hover:text-zinc-900 rounded transition-colors"><FileText size={13} /></button>
                        </td>
                        <td className="px-2 py-1.5 align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={comingSoon('View Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Eye size={11} /></button>
                            <button onClick={comingSoon('Edit Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={13} /></button>
                            <button onClick={comingSoon('Delete Record')} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 size={11} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-8">
                <p className="text-[11px] text-zinc-500 font-medium">Showing 1 to 4 of 4 entries</p>
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
            <button onClick={comingSoon('Add Certification')} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
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
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Document</th>
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {CERTIFICATIONS_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.issuer}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.issue}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.expiry}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.id}</td>
                      <td className="px-2 py-1.5 align-middle text-center">
                        <button onClick={comingSoon('View Document')} className="inline-flex p-1 text-zinc-600 hover:text-zinc-900 rounded transition-colors"><FileText size={13} /></button>
                      </td>
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={comingSoon('View Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Eye size={11} /></button>
                          <button onClick={comingSoon('Edit Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={13} /></button>
                          <button onClick={comingSoon('Delete Record')} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
              <p className="text-[11px] text-zinc-500 font-medium">Showing 1 to 3 of 3 entries</p>
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
            <button onClick={comingSoon('Add Course')} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
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
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Document</th>
                    <th className="h-7 px-2 text-center align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ADD_ON_COURSES_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="px-2 py-1.5 align-middle text-xs font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{row.name}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.inst}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.year}</td>
                      <td className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{row.duration}</td>
                      <td className="px-2 py-1.5 align-middle text-center">
                        <button onClick={comingSoon('View Document')} className="inline-flex p-1 text-zinc-600 hover:text-zinc-900 rounded transition-colors"><FileText size={13} /></button>
                      </td>
                      <td className="px-2 py-1.5 align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={comingSoon('View Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Eye size={11} /></button>
                          <button onClick={comingSoon('Edit Record')} className="text-blue-500 hover:text-blue-700 transition-colors"><Pencil size={13} /></button>
                          <button onClick={comingSoon('Delete Record')} className="text-rose-500 hover:text-rose-700 transition-colors"><Trash2 size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-2 py-1.5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
              <p className="text-[11px] text-zinc-500 font-medium">Showing 1 to 2 of 2 entries</p>
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
