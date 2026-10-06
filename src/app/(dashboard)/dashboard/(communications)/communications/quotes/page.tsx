'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, MessageSquare, Quote, CalendarPlus, BellRing } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function DailyQuotesPage() {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['daily-quotes'],
    queryFn: async () => (await api.get('/communication/daily-quotes')).data,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async () => (await api.post('/communication/daily-quotes', { text, author, scheduledDate })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quotes'] });
      setText('');
      setAuthor('');
      setScheduledDate('');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });
  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-10 max-w-[1400px] mx-auto">
      <section className="relative overflow-hidden rounded-[26px] bg-[#1a1423] px-6 py-8 text-white shadow-[0_18px_45px_-22px_rgba(236,72,153,0.6)] md:px-8 md:py-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-28 w-28 rounded-full bg-rose-400/15 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <Megaphone className="text-pink-400" size={28} />
              Daily Quotes
            </h1>
            <p className="text-sm text-pink-100 max-w-xl">
              Inspire and motivate your workforce by scheduling thought-provoking quotes to be displayed on the main company dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/communications/notifications" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-pink-500/20 hover:-translate-y-0.5">
              <BellRing size={16} className="text-pink-300" /> HR Notifications
            </Link>
            <Link href="/dashboard/communications/queries" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-pink-500/20 hover:-translate-y-0.5">
              <MessageSquare size={16} className="text-pink-300" /> Queries
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <Card className="md:col-span-4 rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl sticky top-4">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
            <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
              <CalendarPlus size={18} className="text-indigo-600" /> Schedule a Quote
            </CardTitle>
            <CardDescription className="text-xs mt-1">Add a new quote to be displayed on a specific date.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim() || !scheduledDate) return alert('Text and scheduled date are required');
                createMutation.mutate();
              }}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Quote Text</label>
                <textarea 
                  required 
                  rows={4} 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="The only way to do great work is to love what you do."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Author (Optional)</label>
                <input 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="Steve Jobs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Scheduled Display Date</label>
                <input 
                  type="date" 
                  required 
                  value={scheduledDate} 
                  onChange={(e) => setScheduledDate(e.target.value)} 
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                />
              </div>
              <Button disabled={createMutation.isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <Megaphone size={14} /> {createMutation.isPending ? 'Scheduling...' : 'Schedule Quote'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
            <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
              <Quote size={18} className="text-indigo-600" /> Upcoming Quotes
            </CardTitle>
            <CardDescription className="text-xs mt-1">Review the list of scheduled daily quotes.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            {isLoading ? (
              <div className="py-10 text-center text-sm text-zinc-500">Loading quotes...</div>
            ) : quotes?.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">No quotes scheduled yet.</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {quotes?.map((q: any) => {
                  const isPast = moment(q.scheduledDate).isBefore(moment(), 'day');
                  const isToday = moment(q.scheduledDate).isSame(moment(), 'day');
                  return (
                    <div key={q._id} className={`p-5 transition-colors hover:bg-zinc-50/50 ${isPast ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex gap-3">
                          <span className="mt-1 text-zinc-300 shrink-0"><Quote size={24} className="fill-current" /></span>
                          <div>
                            <blockquote className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed max-w-2xl">
                              &ldquo;{q.text}&rdquo;
                            </blockquote>
                            <div className="text-xs text-zinc-500 mt-2 font-medium">
                              {q.author ? `— ${q.author}` : '— Unknown'}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block mb-1 ${isToday ? 'bg-indigo-100 text-indigo-700' : isPast ? 'bg-zinc-100 text-zinc-600' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isToday ? 'Today' : isPast ? 'Past' : 'Upcoming'}
                          </div>
                          <div className="text-[11px] font-medium text-zinc-500 block">
                            {moment(q.scheduledDate).format('MMM DD, YYYY')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
