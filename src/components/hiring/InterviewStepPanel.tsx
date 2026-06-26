'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';
import moment from 'moment';
import StepGate from './StepGate';

const inputClass = 'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700';

const ROUND_TYPES = ['Telephonic', 'Technical', 'HR', 'Managerial', 'Final'];

interface Interview {
  _id: string;
  roundType: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In_Progress' | 'Completed' | 'Cancelled' | 'No_Show';
  rating?: number;
  feedback?: string;
  interviewerId?: { firstName: string; lastName: string };
}

export default function InterviewStepPanel({
  candidateId, employees, gate,
}: { candidateId: string; employees: any[]; gate: { unlocked: boolean; blockedBy: string[] } }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ roundType: 'Telephonic', interviewerId: '', scheduledDate: '', meetingLink: '' });
  const [feedbackOpenFor, setFeedbackOpenFor] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ status: 'Completed', rating: 3, feedback: '' });

  const { data: interviews } = useQuery<Interview[]>({
    queryKey: ['interviews', candidateId],
    queryFn: async () => (await api.get(`/hiring/interviews/${candidateId}`)).data,
    enabled: !!candidateId,
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => (await api.post('/hiring/interviews', { ...form, candidateId })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      setForm({ roundType: 'Telephonic', interviewerId: '', scheduledDate: '', meetingLink: '' });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (interviewId: string) => (await api.put(`/hiring/interviews/${interviewId}/feedback`, feedbackForm)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      setFeedbackOpenFor(null);
      setFeedbackForm({ status: 'Completed', rating: 3, feedback: '' });
    },
  });

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <CalendarClock size={15} className="text-indigo-600" /> Interview
        </CardTitle>
        <StepGate unlocked={gate.unlocked} blockedBy={gate.blockedBy} compact />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {(interviews || []).map((iv) => (
          <div key={iv._id} className="border rounded-lg p-3 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-md text-sm text-zinc-900 dark:text-zinc-100">{iv.roundType}</span>
                <span className="text-xs text-zinc-500 ml-2">{moment(iv.scheduledDate).format('MMM DD, YYYY HH:mm')}</span>
                {iv.interviewerId && <span className="text-xs text-zinc-500 ml-2">with {iv.interviewerId.firstName} {iv.interviewerId.lastName}</span>}
              </div>
              <span className={`text-[10px] font-md px-2 py-0.5 rounded-full ${iv.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : iv.status === 'Scheduled' ? 'bg-indigo-100 text-indigo-700' : iv.status === 'In_Progress' ? 'bg-purple-100 text-purple-700' : 'bg-rose-100 text-rose-700'}`}>
                {iv.status}
              </span>
            </div>
            {iv.feedback && <p className="text-xs text-zinc-600 dark:text-zinc-400">{iv.feedback} {iv.rating ? `(rated ${iv.rating}/5)` : ''}</p>}
            {iv.status === 'Scheduled' && (
              feedbackOpenFor === iv._id ? (
                <div className="flex flex-col gap-2 mt-1">
                  <select value={feedbackForm.status} onChange={(e) => setFeedbackForm({ ...feedbackForm, status: e.target.value })} className={inputClass}>
                    <option value="Completed">Completed</option>
                    <option value="No_Show">No Show</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {feedbackForm.status === 'Completed' && (
                    <select value={feedbackForm.rating} onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })} className={inputClass}>
                      {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}/5</option>)}
                    </select>
                  )}
                  <textarea value={feedbackForm.feedback} onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })} className={inputClass} rows={2} placeholder="Feedback notes..." />
                  <div className="flex gap-2">
                    <Button className="text-xs h-7 px-2 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={feedbackMutation.isPending} onClick={() => feedbackMutation.mutate(iv._id)}>
                      Submit
                    </Button>
                    <Button variant="ghost" className="text-xs h-7 px-2" onClick={() => setFeedbackOpenFor(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="text-xs h-7 px-2 w-fit" onClick={() => setFeedbackOpenFor(iv._id)}>
                  <CheckCircle2 size={13} className="mr-1" /> Submit Feedback
                </Button>
              )
            )}
          </div>
        ))}

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 grid grid-cols-2 gap-3">
          <select value={form.roundType} onChange={(e) => setForm({ ...form, roundType: e.target.value })} className={inputClass}>
            {ROUND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.interviewerId} onChange={(e) => setForm({ ...form, interviewerId: e.target.value })} className={inputClass}>
            <option value="">Select interviewer...</option>
            {employees.map((e: any) => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
          </select>
          <input type="datetime-local" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className={inputClass} />
          <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} className={inputClass} placeholder="Meeting link (optional)" />
          <Button
            className="col-span-2 text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!form.interviewerId || !form.scheduledDate || scheduleMutation.isPending}
            onClick={() => scheduleMutation.mutate()}
          >
            {scheduleMutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
