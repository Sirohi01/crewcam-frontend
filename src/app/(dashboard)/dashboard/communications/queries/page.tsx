'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BellRing, Megaphone, Send, HelpCircle, User, CheckCircle2, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

const STATUS_BADGE: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
  Open: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <HelpCircle size={12} /> },
  InProgress: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Clock size={12} /> },
  Resolved: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 size={12} /> },
};

export default function QueriesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'mine' | 'all'>('mine');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<Record<string, string>>({});

  const { data: myQueries, isLoading: loadingMine } = useQuery({
    queryKey: ['queries', 'mine'],
    queryFn: async () => (await api.get('/queries/mine')).data,
    enabled: activeTab === 'mine',
  });

  const { data: allQueries, isLoading: loadingAll } = useQuery({
    queryKey: ['queries', 'all'],
    queryFn: async () => (await api.get('/queries')).data,
    enabled: activeTab === 'all',
    retry: false,
  });

  const raiseMutation = useMutation({
    mutationFn: async () => (await api.post('/queries', { subject, message })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queries', 'mine'] });
      setSubject('');
      setMessage('');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) =>
      (await api.put(`/queries/${id}/respond`, { response, status: 'Resolved' })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queries', 'all'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-10 max-w-[1400px] mx-auto">
      <section className="relative overflow-hidden rounded-[26px] bg-[#111827] px-6 py-8 text-white shadow-[0_18px_45px_-22px_rgba(16,185,129,0.5)] md:px-8 md:py-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-28 w-28 rounded-full bg-teal-400/15 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <MessageSquare className="text-emerald-400" size={28} />
              Employee Queries
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl">
              A centralized helpdesk for your workforce. Employees can ask questions, and HR can efficiently resolve them with clear communication.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/communications/notifications" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-0.5">
              <BellRing size={16} className="text-emerald-300" /> HR Notifications
            </Link>
            <Link href="/dashboard/communications/quotes" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-emerald-500/20 hover:-translate-y-0.5">
              <Megaphone size={16} className="text-emerald-300" /> Daily Quotes
            </Link>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-1 p-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg w-fit border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'mine' ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
        >
          <User size={14} /> My Queries
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
        >
          <HelpCircle size={14} /> All Queries (HR View)
        </button>
      </div>

      {activeTab === 'mine' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <Card className="md:col-span-4 rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl sticky top-4">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                <HelpCircle size={18} className="text-indigo-600" /> Raise a New Query
              </CardTitle>
              <CardDescription className="text-xs mt-1">Have a question regarding policies, payroll, or IT? Ask here.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!subject.trim() || !message.trim()) return;
                  raiseMutation.mutate();
                }}
                className="flex flex-col gap-5"
              >
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Subject</label>
                  <input 
                    required 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="e.g., Leave policy clarification" 
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Detailed Question</label>
                  <textarea 
                    required 
                    rows={5} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Describe what you need help with..." 
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <Button disabled={raiseMutation.isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Send size={14} /> {raiseMutation.isPending ? 'Submitting...' : 'Submit Query'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-8 rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                <MessageSquare size={18} className="text-indigo-600" /> My Submitted Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {loadingMine ? (
                <div className="py-10 text-center text-sm text-zinc-500">Loading your queries...</div>
              ) : myQueries?.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-500">You haven't raised any queries yet.</div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {myQueries?.map((q: any) => {
                    const badge = STATUS_BADGE[q.status] || STATUS_BADGE['Open'];
                    return (
                      <div key={q._id} className="p-5 hover:bg-zinc-50/50 transition-colors">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{q.subject}</h3>
                          <span className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                            {badge.icon} {q.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">{q.message}</div>
                        <div className="text-[10px] text-zinc-400 font-medium">{moment(q.createdAt).format('MMMM DD, YYYY · hh:mm A')}</div>
                        
                        {q.response && (
                          <div className="mt-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-lg p-3 relative">
                            <div className="absolute -top-2 left-4 px-1 bg-white dark:bg-zinc-900 text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                              HR Response
                            </div>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{q.response}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'all' && (
        <Card className="rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
            <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
              <MessageSquare size={18} className="text-indigo-600" /> HR Inbox
            </CardTitle>
            <CardDescription className="text-xs mt-1">Review and resolve queries submitted by the workforce.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            {loadingAll ? (
              <div className="py-10 text-center text-sm text-zinc-500">Loading queries inbox...</div>
            ) : allQueries?.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">Inbox is completely clear. No queries found.</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[700px] overflow-y-auto">
                {allQueries?.map((q: any) => {
                  const badge = STATUS_BADGE[q.status] || STATUS_BADGE['Open'];
                  return (
                    <div key={q._id} className="p-5 hover:bg-zinc-50/50 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{q.subject}</h3>
                            <span className={`flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                              {q.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1 font-medium">
                            <User size={12} className="text-zinc-400" />
                            {q.raisedBy?.firstName} {q.raisedBy?.lastName} <span className="opacity-50 mx-1">•</span> {moment(q.createdAt).format('MMM DD, YYYY · hh:mm A')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-zinc-700 dark:text-zinc-300 mt-3 bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 p-3 rounded-md">
                        {q.message}
                      </div>
                      
                      {q.status !== 'Resolved' && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 items-end">
                          <div className="flex-1 w-full">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1 block">Your Reply</label>
                            <input
                              value={responses[q._id] || ''}
                              onChange={(e) => setResponses({ ...responses, [q._id]: e.target.value })}
                              placeholder="Type a helpful response to resolve this query..."
                              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && responses[q._id]?.trim()) {
                                  e.preventDefault();
                                  respondMutation.mutate({ id: q._id, response: responses[q._id] });
                                }
                              }}
                            />
                          </div>
                          <Button
                            onClick={() => responses[q._id]?.trim() && respondMutation.mutate({ id: q._id, response: responses[q._id] })}
                            disabled={respondMutation.isPending || !responses[q._id]?.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 gap-1.5 w-full sm:w-auto"
                          >
                            <CheckCircle2 size={14} /> Mark Resolved
                          </Button>
                        </div>
                      )}
                      
                      {q.response && (
                        <div className="mt-4 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-lg p-3 relative">
                          <div className="absolute -top-2 left-4 px-1 bg-white dark:bg-zinc-900 text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle2 size={10} /> Resolution Provided
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{q.response}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
