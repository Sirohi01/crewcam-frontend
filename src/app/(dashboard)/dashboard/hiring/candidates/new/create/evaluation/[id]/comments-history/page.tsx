'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, User, Sparkles } from 'lucide-react';
import { useCandidate } from '../layout';
import { Button } from '@/components/ui/button';

export default function CommentsHistoryTab() {
  const { candidate } = useCandidate();

  if (!candidate) return null;

  return (
    <div className="xl:col-span-12 flex flex-col gap-3 h-full">
      <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
          <CardTitle className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500" /> Comments & Internal History
          </CardTitle>
          <p className="text-[12px] font-medium text-zinc-500 mt-1">Review internal discussions and stage progression history.</p>
        </CardHeader>
        <CardContent className="p-5 flex-1 flex flex-col gap-6 bg-zinc-50/30">

          {/* Add Comment Input */}
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-[12px] font-bold text-zinc-900 mb-2">Add Internal Note</h4>
            <textarea
              className="w-full h-[80px] rounded-lg border border-zinc-200 p-3 text-[13px] font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
              placeholder="Type an internal note about this candidate..."
            />
            <div className="flex justify-end mt-2">
              <Button className="h-8 px-4 text-[11px] font-bold bg-zinc-900 hover:bg-zinc-800 text-white">
                Add Note
              </Button>
            </div>
          </div>

          <div className="h-[1px] bg-zinc-100 w-full my-2"></div>

          {/* Activity Feed */}
          <div className="space-y-5 flex-1 pb-4">
            <h4 className="text-[13px] font-bold text-zinc-900">Recent Activity</h4>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex-1">
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-sm">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[12px] font-bold text-zinc-900">Rajeev Sharma <span className="text-zinc-400 font-medium">added a note</span></p>
                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 hours ago</span>
                  </div>
                  <p className="text-[12px] text-zinc-600 leading-relaxed">
                    Reviewed the AI screening report. The candidate has a very strong profile match but might lack advanced data analytics skills. Need to probe deeper during the interview phase.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-sm opacity-80">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-[12px] font-bold text-zinc-900">System <span className="text-zinc-400 font-medium">completed AI Screening</span></p>
                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 1 day ago</span>
                  </div>
                  <p className="text-[12px] text-zinc-600 leading-relaxed">
                    Candidate scored 87% overall profile match. Moved to HOD Review stage automatically.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
