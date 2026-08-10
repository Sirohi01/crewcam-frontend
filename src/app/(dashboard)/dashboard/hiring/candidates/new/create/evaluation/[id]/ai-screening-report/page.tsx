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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Section: Circle (Left) & Stats (Right) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Left: Circle */}
              <div className="flex flex-col items-center justify-center shrink-0 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <CircularProgress percentage={87} colorClass="text-emerald-500" textClass="text-emerald-600" />
                <p className="text-center text-[13px] font-bold text-emerald-600 mt-3">Good Match</p>
                <p className="text-center text-[11px] font-medium text-zinc-500 mt-1">Based on Role Requirements</p>
              </div>

              {/* Right: Stats List */}
              <div className="flex-1 space-y-3 w-full">
                <h4 className="text-[13px] font-bold text-zinc-900 border-b border-zinc-100 pb-2 mb-4">Compatibility Breakdown</h4>
                {[
                  { label: 'Skills Match', val: 90 },
                  { label: 'Experience Match', val: 85 },
                  { label: 'Education Match', val: 80 },
                  { label: 'CTC Compatibility', val: 75 },
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
                  {[
                    'Sales Strategy', 'Team Leadership', 'Client Relationship Management',
                    'Business Development', 'CRM'
                  ].map(s => (
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
                  {[
                    'Advanced Data Analytics', 'PPC / Google Ads', 'Digital Marketing'
                  ].map(s => (
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
