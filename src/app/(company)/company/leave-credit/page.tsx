'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRightLeft, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function LeaveCreditPage() {
  const [userId, setUserId] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [days, setDays] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: employees } = useQuery({
    queryKey: ['employees', 'picker'],
    queryFn: async () => (await api.get('/employees')).data,
    retry: false,
  });
  const employeeList = Array.isArray(employees) ? employees : employees?.data || [];

  const { data: leaveTypes } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: async () => (await api.get('/master-data/leave-types')).data,
  });

  const creditMutation = useMutation({
    mutationFn: async () => (await api.post('/leaves/credit', { userId, leaveTypeId, days: Number(days), reason })).data,
    onSuccess: () => {
      setSuccessMsg('Leave credited successfully');
      setUserId('');
      setLeaveTypeId('');
      setDays('');
      setReason('');
      setTimeout(() => setSuccessMsg(''), 4000);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !leaveTypeId || !days || !reason) return alert('All fields are required');

    const emp = employeeList.find((e: any) => e._id === userId);
    const lt = leaveTypes?.data?.find((t: any) => t._id === leaveTypeId);

    if (window.confirm(`Are you sure you want to credit ${days} days of ${lt?.name} to ${emp?.firstName} ${emp?.lastName}?\n\nReason: ${reason}\n\nThis action will be audited.`)) {
      creditMutation.mutate();
    }
  };

  const inputClass = "w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-2.5 h-9 text-sm focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50";
  const labelClass = "text-xs font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300 pb-5 w-full">
      {/* Header */}
      <header className="pb-2.5 border-b border-zinc-200/70 dark:border-zinc-800">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Leave Credit</h1>
        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-600" /> Manually credit leave days — securely audited like a financial transaction
        </p>
      </header>

      <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
        <div className="h-1 w-full bg-indigo-600" />
        <div className="px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">Manual Credit Transaction</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Add leaves to an employee's balance.</p>
            </div>
          </div>
          <ArrowRightLeft size={18} className="text-zinc-200 dark:text-zinc-700" />
        </div>

        <CardContent className="p-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-2.5 rounded-md border border-emerald-100 flex items-start gap-2 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300">
                <CheckCircle2 size={15} className="mt-0.5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold">Transaction successful</p>
                  <p className="text-emerald-600 dark:text-emerald-400 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Beneficiary Employee</label>
                <select required value={userId} onChange={(e) => setUserId(e.target.value)} className={inputClass}>
                  <option value="">Select employee…</option>
                  {employeeList.map((emp: any) => (
                    <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.email})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Leave Account Type</label>
                <select required value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)} className={inputClass}>
                  <option value="">Select type…</option>
                  {leaveTypes?.data?.map((lt: any) => (
                    <option key={lt._id} value={lt._id}>{lt.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Credit Amount (Days)</label>
              <div className="relative">
                <input
                  type="number" min="0.5" step="0.5" required value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 pl-2.5 pr-14 h-11 text-lg font-semibold tracking-tight tabular-nums focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                  placeholder="0.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Days</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Transaction Reason &amp; Audit Note</label>
              <textarea
                required rows={3} value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-2.5 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                placeholder="Why is this leave being credited? This will be permanently logged."
              />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/50 rounded-md p-2.5 flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-800 dark:text-amber-400">
                <p className="font-semibold mb-0.5">Audit warning</p>
                <p>This transaction is irreversible and will be permanently recorded in the system audit logs under your user ID.</p>
              </div>
            </div>

            <Button disabled={creditMutation.isPending} type="submit" className="w-full h-10 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {creditMutation.isPending && <Loader2 size={15} className="animate-spin" />}
              {creditMutation.isPending ? 'Processing transaction…' : 'Authorize & credit leave'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}