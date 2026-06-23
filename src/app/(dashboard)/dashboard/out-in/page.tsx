'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogOut, LogIn, CalendarDays, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function OutInPage() {
  const queryClient = useQueryClient();
  const [type, setType] = useState<'Out' | 'In'>('Out');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: records, isLoading } = useQuery({
    queryKey: ['out-in', 'my'],
    queryFn: async () => (await api.get('/attendance/out-in/my')).data,
  });

  const recordMutation = useMutation({
    mutationFn: async () => (await api.post('/attendance/out-in', { type, reason })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['out-in', 'my'] });
      setReason('');
      setSuccessMsg(`Successfully recorded ${type} time.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setType(type === 'Out' ? 'In' : 'Out');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const currentStatus = records && records.length > 0 ? records[0].type : 'In';
  const isCurrentlyOut = currentStatus === 'Out';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitType = isCurrentlyOut ? 'In' : 'Out';
    if (submitType === 'Out' && !reason.trim()) return alert('Reason is required when going out');
    
    // For 'In', reason is optional, but we still need to send it. If empty, we can just send "Returned"
    const finalReason = submitType === 'In' && !reason.trim() ? 'Returned' : reason;
    
    setType(submitType); // just for the mutation payload
    
    recordMutation.mutateAsync().then(() => {
       // It handles invalidation and clearing inside onSuccess
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-8 w-full">
      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Short Excursions & Breaks</h1>
        <p className="text-sm text-zinc-500 mt-1">Record temporary outings during your workday (e.g., client meetings, bank visits). <strong className="text-indigo-600 dark:text-indigo-400 font-medium">Do not use this for your daily office clock-in/out.</strong></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <Card className="border-zinc-200/80 shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 overflow-hidden">
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                <Clock size={18} className="text-indigo-600 dark:text-indigo-400" /> Current Status
              </CardTitle>
            </div>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-zinc-500">Checking status...</div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {successMsg && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-100 flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      {successMsg}
                    </div>
                  )}
                  
                  <div className={`flex flex-col items-center justify-center p-6 rounded-xl border ${isCurrentlyOut ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30'}`}>
                    <div className={`p-3 rounded-full mb-3 ${isCurrentlyOut ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'}`}>
                      {isCurrentlyOut ? <LogOut size={24} /> : <LogIn size={24} />}
                    </div>
                    <p className={`text-lg font-semibold ${isCurrentlyOut ? 'text-amber-800 dark:text-amber-400' : 'text-emerald-800 dark:text-emerald-400'}`}>
                      {isCurrentlyOut ? 'You are currently OUT' : 'You are currently IN'}
                    </p>
                    <p className="text-xs text-center mt-1 text-zinc-500">
                      {isCurrentlyOut ? 'Record your return when you get back.' : 'Record an excursion if you are leaving.'}
                    </p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {isCurrentlyOut ? 'Return Note (Optional)' : 'Reason for leaving'}
                    </label>
                    <textarea
                      required={!isCurrentlyOut}
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none dark:bg-zinc-800/50"
                      placeholder={isCurrentlyOut ? "e.g. Back from meeting..." : "e.g. Client meeting at downtown..."}
                    />
                  </div>
                  
                  <Button 
                    disabled={recordMutation.isPending} 
                    type="submit" 
                    className={`w-full py-2.5 h-auto text-base font-medium text-white transition-colors ${!isCurrentlyOut ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                  >
                    {recordMutation.isPending ? 'Processing...' : (isCurrentlyOut ? 'Record Coming IN' : 'Record Going OUT')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7 space-y-6">
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Today's Timeline</CardTitle>
                <div className="text-xs font-medium px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full flex items-center gap-1.5">
                  <CalendarDays size={12} /> {moment().format('MMMM D, YYYY')}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center text-zinc-400">
                  <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm">Loading timeline...</p>
                </div>
              ) : records?.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                  <MapPin size={32} className="mb-3 text-zinc-300 dark:text-zinc-600" />
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No excursions recorded today</p>
                  <p className="text-xs text-zinc-500 mt-1">Your out-in logs will appear here.</p>
                </div>
              ) : (
                <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-800 ml-3 space-y-6 pb-2">
                  {records?.map((r: any, i: number) => (
                    <div key={r._id} className="relative">
                      <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${r.type === 'Out' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pl-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${r.type === 'Out' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {r.type === 'Out' ? 'Went Out' : 'Came In'}
                            </span>
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <Clock size={10} /> {moment(r.timestamp).format('hh:mm A')}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{r.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
