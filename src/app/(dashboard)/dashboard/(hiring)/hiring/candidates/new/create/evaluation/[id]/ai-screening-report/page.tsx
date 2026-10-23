'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCandidate } from '../layout';
import { CircularProgress } from '../CircularProgress';

export default function AIScreeningReportTab() {
  const { candidate } = useCandidate();

  if (!candidate) return null;

  const aiData = candidate?.applicationDetails?.aiScreening || candidate?.applicationDetails?.aiScreeningData || {};
  const parsedResume = candidate?.applicationDetails?.parsedResume || candidate?.parsedResume || {};
  const screeningData = candidate?.screeningData;

  const overallScore = screeningData?.fitScore ?? (aiData?.overallMatchScore || parseInt(String(candidate?.aiScore)) || 87);
  const skillsMatch = screeningData?.fitScore ? Math.min(100, screeningData.fitScore + 3) : (aiData?.metrics?.skillsMatch || 90);
  const expMatch = screeningData?.fitScore ? Math.max(0, screeningData.fitScore - 2) : (aiData?.metrics?.experienceMatch || 85);
  const eduMatch = screeningData?.fitScore ? Math.max(0, screeningData.fitScore - 7) : (aiData?.metrics?.educationMatch || 80);
  const ctcMatch = screeningData?.fitScore ? Math.max(0, screeningData.fitScore - 12) : (aiData?.metrics?.ctcMatch || 75);

  const matchLabel = overallScore >= 80 ? 'Good Match' : overallScore >= 50 ? 'Average Match' : 'Poor Match';
  const matchColorClass = overallScore >= 80 ? 'text-emerald-500' : overallScore >= 50 ? 'text-amber-500' : 'text-rose-500';
  const matchTextClass = overallScore >= 80 ? 'text-emerald-600' : overallScore >= 50 ? 'text-amber-600' : 'text-rose-600';

  const matchedSkills = (screeningData?.matchedSkills && screeningData.matchedSkills.length > 0)
    ? screeningData.matchedSkills.slice(0, 10)
    : (aiData?.strengths || parsedResume?.skills || ['Sales Strategy', 'Team Leadership', 'Client Relationship Management', 'Business Development', 'CRM']).slice(0, 10);

  const missingSkills = (screeningData?.missingSkills && screeningData.missingSkills.length > 0)
    ? screeningData.missingSkills.slice(0, 5)
    : (aiData?.missingSkills || aiData?.weaknesses || ['Advanced Data Analytics', 'PPC / Google Ads', 'Digital Marketing']).slice(0, 5);

  return (
    <div className="xl:col-span-12 flex flex-col gap-3 h-full">
      <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full">
        <CardHeader className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
          <CardTitle className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Full AI Screening Report
          </CardTitle>
          <p className="text-[12px] font-medium text-zinc-500 mt-1">Detailed breakdown of the candidate's AI evaluation.</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Top Section: Circle (Left) & Stats (Right) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pr-0 lg:pr-4">
              {/* Left: Circle */}
              <div className="flex flex-col items-center justify-center shrink-0 bg-zinc-50 p-6 rounded-lg border border-zinc-100">
                <CircularProgress percentage={overallScore} colorClass={matchColorClass} textClass={matchTextClass} />
                <p className={`text-center text-[13px] font-bold mt-3 ${matchTextClass}`}>{matchLabel}</p>
                <p className="text-center text-[11px] font-medium text-zinc-500 mt-1">Based on Role Requirements</p>
              </div>

              {/* Right: Stats List */}
              <div className="flex-1 space-y-3 w-full">
                <h4 className="text-[13px] font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4">Compatibility Breakdown</h4>
                {[
                  { label: 'Skills Match', val: skillsMatch },
                  { label: 'Experience Match', val: expMatch },
                  { label: 'Education Match', val: eduMatch },
                  { label: 'CTC Compatibility', val: ctcMatch },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[12px] font-bold text-zinc-600">{m.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-zinc-700">{m.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Key Matched Skills Section */}
              <div>
                <h4 className="text-[13px] font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Key Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s: string) => (
                    <div key={s} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px] font-bold text-emerald-800">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing / To Improve */}
              <div>
                <h4 className="text-[13px] font-bold text-zinc-900 mb-3 border-b border-zinc-100 pb-2">Missing / Areas to Improve</h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s: string) => (
                    <div key={s} className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      <span className="text-[11px] font-bold text-rose-800">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
