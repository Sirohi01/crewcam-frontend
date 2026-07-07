'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, Plus, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface ActionItem {
  description: string;
  status: 'Open' | 'Done';
  assignedTo?: string;
  dueDate?: string;
}

export default function MeetingMoMPage() {
  const params = useParams();
  const meetingId = params.id as string;
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const { data: mom, isLoading } = useQuery({
    queryKey: ['meetings', meetingId, 'mom'],
    queryFn: async () => (await api.get(`/meetings/${meetingId}/mom`)).data,
    retry: false,
  });

  const { data: meeting } = useQuery({
    queryKey: ['meetings', meetingId],
    queryFn: async () => (await api.get('/meetings')).data,
    select: (all: any[]) => all.find((m) => m._id === meetingId),
  });
  const assigneeOptions = useMemo(() => {
    if (!meeting) return [];
    const list = [meeting.organizerId, ...(meeting.attendeeIds || [])].filter(Boolean);
    return [...new Map(list.map((u: any) => [u._id, u])).values()];
  }, [meeting]);

  useEffect(() => {
    if (mom) {
      setContent(mom.content || '');
      setActionItems((mom.actionItems || []).map((a: any) => ({
        description: a.description,
        status: a.status,
        assignedTo: a.assignedTo?._id || a.assignedTo || '',
        dueDate: a.dueDate ? String(a.dueDate).slice(0, 10) : '',
      })));
    }
  }, [mom]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = actionItems.map((item) => ({
        description: item.description,
        status: item.status,
        ...(item.assignedTo ? { assignedTo: item.assignedTo } : {}),
        ...(item.dueDate ? { dueDate: item.dueDate } : {}),
      }));
      return (await api.put(`/meetings/${meetingId}/mom`, { content, actionItems: payload })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', meetingId, 'mom'] });
      alert('MoM saved');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px]">
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Meeting MoM</h1>
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Minutes of meeting — human-recorded</p>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader className="p-4 sm:p-5">
          <CardTitle className="text-md flex items-center gap-2">
            <FileSignature size={16} className="text-indigo-600" /> Minutes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-md text-zinc-700 mb-1 block">Content</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none"
                  placeholder="Discussion points, decisions made..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-md text-zinc-700">Action Items</label>
                  <button
                    type="button"
                    onClick={() => setActionItems([...actionItems, { description: '', status: 'Open', assignedTo: '', dueDate: '' }])}
                    className="text-xs text-indigo-600 inline-flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {actionItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <input
                        value={item.description}
                        onChange={(e) => {
                          const next = [...actionItems];
                          next[i] = { ...next[i], description: e.target.value };
                          setActionItems(next);
                        }}
                        className="flex-1 min-w-[160px] rounded-md border border-zinc-300 px-3 py-2 text-sm"
                        placeholder="Action item..."
                      />
                      <select
                        value={item.assignedTo || ''}
                        onChange={(e) => {
                          const next = [...actionItems];
                          next[i] = { ...next[i], assignedTo: e.target.value };
                          setActionItems(next);
                        }}
                        className="rounded-md border border-zinc-300 px-2 py-2 text-xs"
                      >
                        <option value="">Unassigned</option>
                        {assigneeOptions.map((u: any) => (
                          <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={item.dueDate || ''}
                        onChange={(e) => {
                          const next = [...actionItems];
                          next[i] = { ...next[i], dueDate: e.target.value };
                          setActionItems(next);
                        }}
                        className="rounded-md border border-zinc-300 px-2 py-2 text-xs"
                      />
                      <select
                        value={item.status}
                        onChange={(e) => {
                          const next = [...actionItems];
                          next[i] = { ...next[i], status: e.target.value as 'Open' | 'Done' };
                          setActionItems(next);
                        }}
                        className="rounded-md border border-zinc-300 px-2 py-2 text-xs"
                      >
                        <option value="Open">Open</option>
                        <option value="Done">Done</option>
                      </select>
                      <button onClick={() => setActionItems(actionItems.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button disabled={saveMutation.isPending || !content.trim()} onClick={() => saveMutation.mutate()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {saveMutation.isPending ? 'Saving...' : 'Save MoM'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
