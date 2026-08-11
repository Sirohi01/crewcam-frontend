'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCandidate } from '../layout';
import { MapPin, Phone, Mail, Link as LinkIcon, Briefcase, GraduationCap, Calendar, DollarSign } from 'lucide-react';

export default function ApplicationDetailsTab() {
  const { candidate } = useCandidate();

  if (!candidate) return null;

  return (
    <div className="xl:col-span-12 flex flex-col gap-3 h-full">
      <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
          <CardTitle className="text-[15px] font-bold text-zinc-900">Application Details</CardTitle>
          <p className="text-[12px] font-medium text-zinc-500 mt-1">Detailed overview of the candidate's application and personal information.</p>
        </CardHeader>
        <CardContent className="p-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-zinc-900 border-b border-zinc-100 pb-2">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Email</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Phone</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.mobile}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Location</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <LinkIcon className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">LinkedIn</p>
                    <a href={candidate.linkedin} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-indigo-600 hover:underline">{candidate.linkedin}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h4 className="text-[13px] font-bold text-zinc-900 border-b border-zinc-100 pb-2">Professional Details</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Total Experience</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.totalExperience} Years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Expected CTC</p>
                    <p className="text-[13px] font-bold text-zinc-900">₹ {candidate.expectedCTC}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Notice Period</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.noticePeriod}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Employment Type</p>
                    <p className="text-[13px] font-bold text-zinc-900">{candidate.employmentType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
