'use client';

import React, { useMemo } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Briefcase, Edit2, Trash2, Phone, Mail, Globe, MapPin,
  Info, CheckCircle2, Building2, UserCircle2, CalendarDays, User
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMyDetails, useMyProfile } from '@/hooks/useMyProfile';
import type { ProfileSectionEditor } from '@/hooks/useProfileSectionEditor';
import { ProfileEntryDialog } from '@/components/profile/ProfileEntryDialog';
import { EXPERIENCE_FIELDS } from '@/components/profile/profileFields';
import type { ExperienceEntry } from '@/services/meService';

const INDUSTRY_COLORS = ['#2563EB', '#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#14B8A6'];

/** Whole months between start and end (or today for a current role). */
const monthsIn = (e: ExperienceEntry) => {
  if (!e.startDate) return 0;
  const end = e.endDate ? moment(e.endDate) : moment();
  return Math.max(0, end.diff(moment(e.startDate), 'months'));
};

const formatTenure = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [y > 0 ? `${y} yr${y > 1 ? 's' : ''}` : '', m > 0 ? `${m} mth` : ''].filter(Boolean);
  return parts.join(' ') || '0 mth';
};

const formatRange = (e: ExperienceEntry) => {
  const start = e.startDate ? moment(e.startDate).format('MMM YYYY') : '—';
  return `${start} - ${e.endDate ? moment(e.endDate).format('MMM YYYY') : 'Present'}`;
};

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');

/** Experience tab of the unified My Profile page — data from /me/details (experience section). */
// The page owns the editor so its header "Add Experience" button opens the same form.
type ExperienceEditor = ProfileSectionEditor<'experience'>;

export function ExperienceTab({ editor, profileCard }: { editor: ExperienceEditor; profileCard?: React.ReactNode }) {
  const { data: profile } = useMyProfile();
  const { isLoading } = useMyDetails();

  // Most recent first: current roles, then by start date.
  const experiences = useMemo(
    () => [...editor.rows].sort((a, b) => {
      if (!a.endDate !== !b.endDate) return a.endDate ? 1 : -1;
      return moment(b.startDate || 0).valueOf() - moment(a.startDate || 0).valueOf();
    }),
    [editor.rows]
  );

  const stats = useMemo(() => {
    const totalMonths = experiences.reduce((acc, e) => acc + monthsIn(e), 0);
    const byIndustry = new Map<string, number>();
    experiences.forEach((e) => {
      if (!e.industry) return;
      byIndustry.set(e.industry, (byIndustry.get(e.industry) || 0) + monthsIn(e));
    });
    const industryMonths = Array.from(byIndustry.values()).reduce((a, b) => a + b, 0);
    const industryData = Array.from(byIndustry.entries()).map(([name, months], i) => ({
      name,
      months,
      value: industryMonths ? Math.round((months / industryMonths) * 100) : 0,
      color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length],
    }));
    return {
      totalMonths,
      totalCompanies: new Set(experiences.map((e) => e.company.trim().toLowerCase())).size,
      totalRoles: experiences.length,
      avgMonths: experiences.length ? Math.round(totalMonths / experiences.length) : 0,
      industryData,
    };
  }, [experiences]);

  const totalExperienceStr = formatTenure(stats.totalMonths);
  const location = [profile?.currentCity, profile?.currentState, profile?.currentCountry].filter(Boolean).join(', ');

  return (
    <div className="flex flex-col xl:flex-row gap-1">
      {profileCard && (
        <div className="w-full xl:w-[220px] shrink-0">
          {profileCard}
        </div>
      )}
      {/* Left Content Area (70%) */}
      <Card className="flex-1 min-w-0 border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <CardContent className="p-1.5 flex flex-col">
          {/* Top Header */}
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-zinc-50">Work Experience</h2>
            <span className="text-[13px] font-medium text-gray-500">Sorted by: <span className="text-gray-900 dark:text-zinc-200">Most Recent</span></span>
          </div>

          {isLoading && <p className="py-6 text-center text-[12px] text-gray-400">Loading…</p>}
          {!isLoading && experiences.length === 0 && (
            <p className="py-6 text-center text-[12.5px] text-gray-500">No previous experience added yet.</p>
          )}

          {/* Timeline */}
          {experiences.length > 0 && (
            <div className="relative pl-3.5 space-y-0 before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent border-l border-gray-100 dark:border-zinc-800 ml-2">
              {experiences.map((exp, index) => {
                const isCurrent = !exp.endDate;
                const responsibilities = (exp.responsibilities || '').split('\n').map((r) => r.trim()).filter(Boolean);
                const hasReference = exp.referenceName || exp.referencePhone || exp.referenceEmail || exp.companyWebsite;
                return (
                  <div key={exp._id || `${exp.company}-${index}`} className="relative pl-6 sm:pl-8 -mt-px">
                    {/* Timeline dot */}
                    <div className="absolute left-[-5px] top-4 w-[11px] h-[11px] rounded-full border-[2.5px] border-blue-600 bg-white shadow-[0_0_0_3px_#EFF6FF] dark:bg-zinc-900 dark:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] z-10" />

                    <Card className={`border-gray-200 shadow-sm transition-shadow duration-200 dark:border-zinc-800 ${isCurrent ? 'bg-blue-50/40 dark:bg-zinc-800/50' : 'bg-white dark:bg-zinc-900'} ${experiences.length === 1 ? 'rounded-xl' : index === 0 ? 'rounded-t-xl rounded-b-none' : index === experiences.length - 1 ? 'rounded-b-xl rounded-t-none' : 'rounded-none'}`}>
                      <CardContent className="p-1.5 flex flex-col gap-1">
                        {/* Top section: Company details & Actions */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-start gap-1">
                            {/* Initials, not a third-party logo service: no employer names leave the app. */}
                            <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 p-1">
                              <div className="w-full h-full rounded-md bg-gray-100 grid place-items-center text-[13px] font-bold text-gray-600">{initials(exp.company)}</div>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <h3 className="text-[15px] font-bold text-gray-900 dark:text-zinc-50">{exp.company}</h3>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold tracking-wide border border-emerald-100">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-[13.5px] font-medium text-gray-700 dark:text-zinc-300">{exp.designation}</p>

                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                  <CalendarDays size={13} className="text-gray-400" />
                                  <span>{formatRange(exp)}</span>
                                  {exp.startDate && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                                      <span>{formatTenure(monthsIn(exp))}</span>
                                    </>
                                  )}
                                </div>
                                {exp.location && (
                                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <MapPin size={13} className="text-gray-400" />
                                    <span>{exp.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button aria-label={`Edit ${exp.company}`} onClick={() => editor.openEdit(exp)} className="p-2 border border-gray-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors bg-white">
                              <Edit2 size={12} />
                            </button>
                            <button aria-label={`Delete ${exp.company}`} disabled={editor.isSaving} onClick={() => editor.remove(exp)} className="p-2 border border-gray-200 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors bg-white disabled:opacity-50">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {(responsibilities.length > 0 || hasReference) && (
                          <>
                            {/* Divider */}
                            <div className="h-px w-full bg-gray-100 dark:bg-zinc-800" />

                            {/* Middle section: Responsibilities & Contact */}
                            <div className="flex flex-row gap-1 md:gap-6">
                              <div className="flex-1 min-w-0">
                                {responsibilities.length > 0 && (
                                  <>
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-zinc-200 mb-1">Key Responsibilities:</p>
                                    <ul className="space-y-1.5">
                                      {responsibilities.map((resp, i) => (
                                        <li key={i} className="flex items-start gap-1 text-[12.5px] text-gray-600 dark:text-zinc-400">
                                          <span className="w-1 h-1 rounded-full bg-gray-400 mt-1 shrink-0" />
                                          <span className="leading-snug">{resp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>

                              {hasReference && (
                                <div className="w-[200px] md:w-[280px] shrink-0">
                                  <div className="rounded-lg border border-gray-100 bg-white/60 p-3.5 dark:bg-zinc-900/50 dark:border-zinc-800/80">
                                    <p className="text-[11px] font-semibold text-gray-500 mb-1">Contact Details</p>
                                    <div className="space-y-1">
                                      {exp.referenceName && (
                                        <div className="flex items-center gap-1.5">
                                          <User size={13} className="text-gray-400 shrink-0" />
                                          <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-300 truncate">{exp.referenceName}</p>
                                        </div>
                                      )}
                                      {exp.referencePhone && (
                                        <div className="flex items-center gap-1.5">
                                          <Phone size={13} className="text-gray-400 shrink-0" />
                                          <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-300 truncate">{exp.referencePhone}</p>
                                        </div>
                                      )}
                                      {exp.referenceEmail && (
                                        <div className="flex items-center gap-1.5">
                                          <Mail size={13} className="text-gray-400 shrink-0" />
                                          <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-300 truncate">{exp.referenceEmail}</p>
                                        </div>
                                      )}
                                      {exp.companyWebsite && (
                                        <div className="flex items-center gap-1.5">
                                          <Globe size={13} className="text-gray-400 shrink-0" />
                                          <p className="text-[12px] font-medium text-blue-600 truncate">{exp.companyWebsite}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Another Experience Button */}
          <div className="mt-1 flex justify-center">
            <button onClick={editor.openAdd} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50/50 text-blue-600 py-1.5 rounded-xl flex items-center justify-center gap-1 text-[14px] font-semibold transition-colors">
              <span className="text-xl leading-none font-light mb-0.5">+</span> {experiences.length ? 'Add Another Experience' : 'Add Experience'}
            </button>
          </div>

          {/* Notice Card */}
          <div className="mt-1 bg-blue-50/50 border border-blue-100 rounded-xl p-2 flex gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Info size={13} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-gray-900 mb-0.5">Keep Your Experience Updated</h4>
              <p className="text-[12.5px] text-gray-600 leading-snug">
                Accurate experience details help us understand your background better for growth and opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar (30%) */}
      <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-1">

        {/* Card 1: Experience Summary */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-2 py-2 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-[14px] font-bold text-gray-900 flex items-center gap-1"><Briefcase size={13} className="text-blue-600" /> Experience Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-2 lg:p-3 flex flex-col gap-3">
            {[
              { icon: CalendarDays, bg: 'bg-blue-50', color: 'text-blue-600', label: 'Total Experience', value: totalExperienceStr },
              { icon: Building2, bg: 'bg-purple-50', color: 'text-purple-600', label: 'Total Companies', value: String(stats.totalCompanies) },
              { icon: UserCircle2, bg: 'bg-amber-50', color: 'text-amber-600', label: 'Total Roles', value: String(stats.totalRoles) },
              { icon: CalendarDays, bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Average Tenure', value: formatTenure(stats.avgMonths) },
            ].map((tile) => (
              <div key={tile.label} className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-lg ${tile.bg} flex items-center justify-center shrink-0`}>
                  <tile.icon size={14} className={tile.color} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-0.5">{tile.label}</p>
                  <p className="text-sm font-bold text-zinc-900">{tile.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 2: Experience by Industry */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-2 py-2 border-b border-gray-100 dark:border-zinc-800">
            <CardTitle className="text-[14px] font-bold text-gray-900">Experience by Industry</CardTitle>
          </CardHeader>
          {stats.industryData.length === 0 ? (
            <CardContent className="p-3">
              <p className="text-[12px] text-gray-500">Add an industry to your roles to see this breakdown.</p>
            </CardContent>
          ) : (
            <CardContent className="p-3 flex flex-row items-center gap-4">
              <div className="relative w-[110px] h-[110px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.industryData} innerRadius={38} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {stats.industryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[12px] font-bold text-gray-900 leading-tight text-center whitespace-pre-line">{totalExperienceStr.replace(/ (\d+ mth)$/, '\n$1')}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Total</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                {stats.industryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[12px] font-bold text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                      {formatTenure(item.months)} ({item.value}%)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Card 3: Contact Information — the employee's own */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-2 py-2 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center gap-1 space-y-0">
            <UserCircle2 size={13} className="text-blue-600" />
            <CardTitle className="text-[14px] font-bold text-gray-900">Contact Information <span className="text-[11px] text-gray-500 font-normal">(Primary)</span></CardTitle>
          </CardHeader>
          <CardContent className="p-1.5 space-y-1">
            {profile?.mobileNumber && (
              <div className="flex items-start gap-1.5">
                <Phone size={11} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">{profile.mobileNumber}</p>
              </div>
            )}
            {profile?.email && (
              <div className="flex items-start gap-1.5">
                <Mail size={11} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">{profile.email}</p>
              </div>
            )}
            {location && (
              <div className="flex items-start gap-1.5">
                <MapPin size={11} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[12.5px] font-medium text-gray-700 dark:text-zinc-300">{location}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Quick Tips */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader className="px-2 py-2 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center gap-1 space-y-0">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Info size={12} className="text-blue-600" />
            </div>
            <CardTitle className="text-[14px] font-bold text-gray-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="p-1.5 flex flex-col">
            <ul className="space-y-1.5 mb-1">
              {['Add all your relevant work experiences.', 'Include key responsibilities and achievements.', 'Keep your information up to date.'].map((tip) => (
                <li key={tip} className="flex items-start gap-1">
                  <CheckCircle2 size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[12px] text-gray-700 dark:text-zinc-300 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>

      <ProfileEntryDialog fields={EXPERIENCE_FIELDS} {...editor.dialog} />
    </div>
  );
}
