'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

export type QuickActionType = 'schedule' | 'call' | 'email';

const TITLES: Record<QuickActionType, string> = { schedule: 'Schedule Follow-Up', call: 'Log Call', email: 'Send Email' };

export default function QuickActionModal({
  type, leadId, leads, onClose, onDone,
}: { type: QuickActionType; leadId: string; leads: { _id: string; companyName: string }[]; onClose: () => void; onDone: () => void }) {
  const [selectedLeadId, setSelectedLeadId] = useState(leadId);
  const [followUpDate, setFollowUpDate] = useState('');
  const [note, setNote] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) { setError('Select a lead first.'); return; }
    setError('');
    setSubmitting(true);
    try {
      if (type === 'schedule') {
        if (!followUpDate) { setError('Pick a date.'); setSubmitting(false); return; }
        await api.put(`/super-admin/leads/${selectedLeadId}`, { followUpDate: new Date(followUpDate).toISOString() });
      } else if (type === 'call') {
        if (!note.trim()) { setError('Add a note.'); setSubmitting(false); return; }
        await api.post(`/super-admin/leads/${selectedLeadId}/notes`, { note: `Logged call: ${note}` });
      } else {
        if (!subject.trim() || !message.trim()) { setError('Subject and message are required.'); setSubmitting(false); return; }
        await api.post(`/super-admin/leads/${selectedLeadId}/send-email`, { subject, message });
      }
      onDone();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Action failed');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50">
        <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
          <h2 className="text-sm font-md text-zinc-900">{TITLES[type]}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
          <div className="space-y-1">
            <label className="block text-xs font-md text-zinc-700">Lead</label>
            <select required value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2">
              <option value="">Select a lead</option>
              {leads.map((l) => <option key={l._id} value={l._id}>{l.companyName}</option>)}
            </select>
          </div>
          {type === 'schedule' && (
            <div className="space-y-1">
              <label className="block text-xs font-md text-zinc-700">Next Follow-Up Date</label>
              <input required type="datetime-local" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
            </div>
          )}
          {type === 'call' && (
            <div className="space-y-1">
              <label className="block text-xs font-md text-zinc-700">Call Notes</label>
              <textarea required value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
            </div>
          )}
          {type === 'email' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Subject</label>
                <input required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Message</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
            </>
          )}
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">{submitting ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
