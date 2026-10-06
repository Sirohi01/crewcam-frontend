'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Smartphone, History, Megaphone, Users, BellRing, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';

type Tab = 'push' | 'email' | 'logs';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('push');

  const [type, setType] = useState<'Email' | 'SMS'>('Email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientIds, setRecipientIds] = useState<string[]>([]);

  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifAudience, setNotifAudience] = useState<'All' | 'Department' | 'Branch'>('All');

  const { data: employees } = useQuery({
    queryKey: ['employees', 'picker'],
    queryFn: async () => (await api.get('/employees')).data,
    retry: false,
  });
  const employeeList = Array.isArray(employees) ? employees : employees?.data || [];
  
  const employeeOptions = useMemo(
    () => employeeList.map((emp: any) => ({ label: `${emp.firstName} ${emp.lastName || ''} (${emp.email})`.trim(), value: emp._id })),
    [employeeList]
  );

  const { data: logs, isLoading: isLogsLoading } = useQuery({
    queryKey: ['communication-logs'],
    queryFn: async () => (await api.get('/communication/logs')).data,
    retry: false,
  });

  const sendMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/communication/send', payload)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communication-logs'] });
      setSubject('');
      setContent('');
      setRecipientIds([]);
      alert(data.message);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientIds.length === 0) return alert('Please select at least one recipient');
    sendMutation.mutate({ type, recipientIds, subject: type === 'Email' ? subject : undefined, content });
  };

  const notifyMutation = useMutation({
    mutationFn: async () => (await api.post('/communication/notifications', { title: notifTitle, message: notifMessage, audienceType: notifAudience })).data,
    onSuccess: (data) => {
      setNotifTitle('');
      setNotifMessage('');
      alert(data.message);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    notifyMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 pb-10 max-w-[1400px] mx-auto">
      <section className="relative overflow-hidden rounded-[26px] bg-[#17142c] px-6 py-8 text-white shadow-[0_18px_45px_-22px_rgba(76,29,149,0.8)] md:px-8 md:py-10">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-28 w-28 rounded-full bg-cyan-400/15 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
              <BellRing className="text-violet-400" size={28} />
              HR Notifications
            </h1>
            <p className="text-sm text-indigo-200 max-w-xl">
              Broadcast critical alerts or send targeted emails and SMS messages to your workforce instantly. Keep your team aligned and informed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/communications/quotes" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-indigo-500/20 hover:-translate-y-0.5">
              <Megaphone size={16} className="text-indigo-300" /> Daily Quotes
            </Link>
            <Link href="/dashboard/communications/queries" className="text-xs font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-indigo-500/20 hover:-translate-y-0.5">
              <MessageSquare size={16} className="text-indigo-300" /> Queries
            </Link>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-1 p-1 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg w-fit border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('push')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'push' ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
        >
          <BellRing size={14} /> Push Notification
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'email' ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
        >
          <Mail size={14} /> Email / SMS
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
        >
          <History size={14} /> Communication Logs
        </button>
      </div>

      <div>
        {activeTab === 'push' && (
          <Card className="rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                <BellRing size={18} className="text-indigo-600" />
                In-App Notification
              </CardTitle>
              <CardDescription className="text-xs mt-1">Broadcast a push notification to users logged into the platform.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleNotify} className="flex flex-col gap-5 max-w-2xl">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Target Audience</label>
                  <select value={notifAudience} onChange={(e) => setNotifAudience(e.target.value as any)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                    <option value="All">All Employees</option>
                    <option value="Department">My Department</option>
                    <option value="Branch">My Branch</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Notification Title</label>
                  <input required value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g., Office closed this Friday" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Message Body</label>
                  <textarea required rows={4} value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Type the notification details here..." />
                </div>
                <Button disabled={notifyMutation.isPending} type="submit" className="w-full sm:w-auto self-start bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Send size={14} /> {notifyMutation.isPending ? 'Sending...' : 'Broadcast Notification'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'email' && (
          <Card className="rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                <Mail size={18} className="text-indigo-600" />
                Compose Direct Message
              </CardTitle>
              <CardDescription className="text-xs mt-1">Send an Email or SMS to specific employees.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSend} className="flex flex-col gap-5 max-w-2xl">
                <div className="flex items-center gap-6 p-1">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" checked={type === 'Email'} onChange={() => setType('Email')} className="text-indigo-600 w-4 h-4" />
                    <Mail size={16} className={type === 'Email' ? 'text-indigo-600' : 'text-zinc-400'} /> <span className={type === 'Email' ? 'text-zinc-900' : 'text-zinc-500'}>Email</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" checked={type === 'SMS'} onChange={() => setType('SMS')} className="text-indigo-600 w-4 h-4" />
                    <Smartphone size={16} className={type === 'SMS' ? 'text-indigo-600' : 'text-zinc-400'} /> <span className={type === 'SMS' ? 'text-zinc-900' : 'text-zinc-500'}>SMS</span>
                  </label>
                </div>

                <div className="relative z-20">
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Select Recipients</label>
                  <MultiSearchableDropdown
                    options={employeeOptions}
                    values={recipientIds}
                    onChange={setRecipientIds}
                    placeholder="Search and select employees..."
                  />
                </div>

                {type === 'Email' && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Email Subject</label>
                    <input
                      required
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      type="text"
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Important Update..."
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-zinc-700 mb-1.5 block">Message Content</label>
                  <textarea
                    required
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Type your message here..."
                  />
                </div>

                <Button disabled={sendMutation.isPending} type="submit" className="w-full sm:w-auto self-start bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Send size={14} /> {sendMutation.isPending ? 'Sending...' : `Send ${type}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'logs' && (
          <Card className="rounded-[20px] border-zinc-200 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-none overflow-hidden transition-all hover:shadow-xl">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-5 pt-6 px-6">
              <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                <History size={18} className="text-indigo-600" />
                Delivery Logs
              </CardTitle>
              <CardDescription className="text-xs mt-1">History of sent emails and SMS messages.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {isLogsLoading ? (
                <div className="py-10 text-center text-sm text-zinc-500">Loading history...</div>
              ) : logs?.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-500">No communication logs found.</div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
                  {logs?.map((log: any) => (
                    <div key={log._id} className="p-4 hover:bg-zinc-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {log.type === 'Email' ? <Mail size={14} className="text-zinc-400" /> : <Smartphone size={14} className="text-zinc-400" />}
                          <span className="truncate max-w-[300px]" title={log.recipientIds?.map((r: any) => `${r.firstName} ${r.lastName}`).join(', ')}>
                            {log.recipientIds?.map((r: any) => `${r.firstName} ${r.lastName}`).join(', ') || 'Unknown recipient'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${log.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.status}
                        </span>
                      </div>

                      {log.subject && <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-2 mb-1">{log.subject}</div>}

                      <div className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-md border border-zinc-100 dark:border-zinc-800 mt-2 whitespace-pre-wrap">
                        {log.messageBody}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-3">
                        <span className="font-medium">Sent by: {log.senderId?.firstName} {log.senderId?.lastName}</span>
                        <span>{moment(log.createdAt).format('MMM DD, YYYY · hh:mm A')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
