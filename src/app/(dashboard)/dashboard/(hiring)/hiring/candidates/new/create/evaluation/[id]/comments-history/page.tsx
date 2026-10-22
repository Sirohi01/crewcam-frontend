'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, User, Sparkles, Loader2 } from 'lucide-react';
import { useCandidate } from '../layout';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function CommentsHistoryTab() {
  const { candidate } = useCandidate();
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['candidate-audit-logs', candidate?._id],
    queryFn: async () => {
      const res = await api.get(`/audit-logs?candidateId=${candidate?._id}`);
      return res.data.data;
    },
    enabled: !!candidate?._id,
  });

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      setIsSubmitting(true);
      await api.post('/audit-logs', {
        action: 'ADD_NOTE',
        module: 'Hiring',
        status: 'SUCCESS',
        details: { candidateId: candidate?._id, note: note.trim() }
      });
      toast.success('Note added successfully');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['candidate-audit-logs', candidate?._id] });
    } catch (err) {
      console.error(err);
      toast.error('Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!candidate) return null;

  return (
    <div className="xl:col-span-12 flex flex-col gap-3 h-full">
      <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="px-3 py-3 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
          <CardTitle className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500" /> Comments & Internal History
          </CardTitle>
          <p className="text-[12px] font-medium text-zinc-500 mt-1">Review internal discussions and stage progression history.</p>
        </CardHeader>
        <CardContent className="p-3 flex-1 flex flex-col gap-6 bg-zinc-50/30">

          {/* Add Comment Input */}
          <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
            <h4 className="text-[12px] font-bold text-zinc-900 mb-2">Add Internal Note</h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-[80px] rounded-lg border border-zinc-200 p-3 text-[13px] font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
              placeholder="Type an internal note about this candidate..."
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleAddNote} disabled={isSubmitting || !note.trim()} className="h-8 px-4 text-[11px] font-bold bg-zinc-900 hover:bg-zinc-800 text-white">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                Add Note
              </Button>
            </div>
          </div>

          <div className="h-[1px] bg-zinc-100 w-full my-2"></div>

          {/* Activity Feed */}
          <div className="space-y-3 flex-1 pb-2">
            <h4 className="text-[13px] font-bold text-zinc-900">Recent Activity</h4>

            {isLoading ? (
              <div className="text-zinc-500 text-[12px]">Loading activity...</div>
            ) : (() => {
              const filteredLogs = auditLogs ? auditLogs.filter((log: any) => ['HIRING_STEP_TRANSITION', 'CANDIDATE_STATUS_UPDATE', 'EVALUATION_SUBMITTED', 'ADD_NOTE'].includes(log.action)) : [];
              if (filteredLogs.length === 0) {
                return <div className="text-zinc-500 text-[12px] italic">No recent activity found for this candidate.</div>;
              }
              return filteredLogs.map((log: any, i: number) => {
                const isSystem = !log.userId;
                const authorName = isSystem ? 'System' : `${log.userId.firstName} ${log.userId.lastName || ''}`.trim();
                let actionText = 'performed an action';
                let descText = `Action: ${log.action}`;
                
                if (log.action === 'HIRING_STEP_TRANSITION') {
                  actionText = 'changed candidate stage';
                  descText = `Status updated to ${log.details?.after || 'Unknown'} at step ${log.details?.stepKey || 'Unknown'}`;
                } else if (log.action === 'CANDIDATE_STATUS_UPDATE') {
                  actionText = 'updated candidate status';
                  descText = `Status changed to ${log.details?.after || 'Unknown'}`;
                } else if (log.action === 'EVALUATION_SUBMITTED') {
                  actionText = 'submitted evaluation';
                  descText = 'Evaluation details and rating saved.';
                } else if (log.action === 'ADD_NOTE') {
                  actionText = 'added an internal note';
                  descText = log.details?.note || 'Note added.';
                }

                return (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${isSystem ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
                      {isSystem ? <Sparkles className="w-4 h-4 text-emerald-500" /> : <User className="w-4 h-4 text-indigo-500" />}
                    </div>
                    <div className="flex-1">
                      <div className={`bg-white p-3 rounded-xl border border-zinc-200 shadow-sm ${isSystem ? 'opacity-90' : ''}`}>
                        <div className="flex justify-between items-start mb-1.5">
                          <p className="text-[12px] font-bold text-zinc-900">{authorName} <span className="text-zinc-400 font-medium">{actionText}</span></p>
                          <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[12px] text-zinc-600 leading-relaxed">
                          {descText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
