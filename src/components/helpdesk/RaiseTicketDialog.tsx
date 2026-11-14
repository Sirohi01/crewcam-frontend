'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRaiseTicket } from '@/hooks/useMyTickets';
import { TICKET_CATEGORY_LABEL, TicketCategory, TicketPriority } from '@/services/helpdeskService';

/** Employee-side "Raise New Request" form for the helpdesk. */
export function RaiseTicketDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Raise a new request</DialogTitle>
        </DialogHeader>
        {open && <TicketForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function TicketForm({ onClose }: { onClose: () => void }) {
  const raise = useRaiseTicket();
  const [department, setDepartment] = useState<TicketCategory>('IT');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (subject.trim().length < 3) return setError('Subject must be at least 3 characters.');
    if (description.trim().length < 5) return setError('Describe the issue in a few words.');
    try {
      const res = await raise.mutateAsync({ department, priority, subject: subject.trim(), description: description.trim() });
      toast.success(res?.message || 'Request raised');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not raise the request.');
    }
  };

  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500';

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 py-1 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Category
        <select value={department} onChange={(e) => setDepartment(e.target.value as TicketCategory)} className={input}>
          {(Object.keys(TICKET_CATEGORY_LABEL) as TicketCategory[]).map((c) => <option key={c} value={c}>{TICKET_CATEGORY_LABEL[c]}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Priority
        <select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={input}>
          {['Low', 'Medium', 'High', 'Urgent'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Subject
        <input value={subject} maxLength={150} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Laptop not starting" className={input} />
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Description
        <textarea rows={4} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened, and since when?" className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-blue-500" />
      </label>
      {error && <p className="sm:col-span-2 text-[11px] text-rose-500">{error}</p>}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} disabled={raise.isPending} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
        <button type="submit" disabled={raise.isPending} className="flex items-center gap-1.5 rounded-md bg-[#1d4ed8] px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {raise.isPending && <Loader2 size={13} className="animate-spin" />} Submit
        </button>
      </div>
    </form>
  );
}
