'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChangeRequestKind, submitChangeRequest } from '@/services/changeRequestService';
import { uploadFile } from '@/services/leaveService';

type Field = { key: string; label: string; type?: 'text' | 'date' | 'select'; options?: string[]; placeholder?: string };

const FIELDS: Record<ChangeRequestKind, Field[]> = {
  identity: [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
    { key: 'panNumber', label: 'PAN', placeholder: 'ABCDE1234F' },
    { key: 'aadhaarNumber', label: 'Aadhaar', placeholder: '12 digits' },
    { key: 'uanNumber', label: 'UAN', placeholder: '12 digits' },
  ],
  bank: [
    { key: 'bankName', label: 'Bank Name' },
    { key: 'accountHolderName', label: 'Account Holder' },
    { key: 'accountNumber', label: 'Account Number' },
    { key: 'ifscCode', label: 'IFSC', placeholder: 'HDFC0001234' },
    { key: 'branchName', label: 'Branch' },
    { key: 'accountType', label: 'Account Type', type: 'select', options: ['Savings', 'Current'] },
    { key: 'micrCode', label: 'MICR', placeholder: '9 digits' },
  ],
};

const TITLE: Record<ChangeRequestKind, string> = {
  identity: 'Request a change to your personal details',
  bank: 'Request a change to your salary bank account',
};

/**
 * Employee-side request for HR-owned data. Only the fields filled in are sent; HR
 * reviews the request (with any proof attached) before anything changes.
 */
export function ChangeRequestDialog({ kind, open, onClose }: { kind: ChangeRequestKind; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{TITLE[kind]}</DialogTitle>
        </DialogHeader>
        {open && <RequestForm kind={kind} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function RequestForm({ kind, onClose }: { kind: ChangeRequestKind; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: submitChangeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'change-requests'] });
      toast.success('Sent to HR for approval');
      onClose();
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const changes = Object.fromEntries(Object.entries(values).filter(([, v]) => v.trim() !== ''));
    if (Object.keys(changes).length === 0) return setError('Fill in at least one field you want changed.');
    if (file && file.size > 5 * 1024 * 1024) return setError('Proof document must be 5 MB or smaller.');
    try {
      let attachmentUrl: string | undefined;
      if (file) {
        setUploading(true);
        attachmentUrl = await uploadFile(file);
        setUploading(false);
      }
      await mutation.mutateAsync({ kind, changes, comment: comment.trim() || undefined, attachmentUrl });
    } catch (err: any) {
      setUploading(false);
      setError(err?.response?.data?.message || 'Could not send the request.');
    }
  };

  const busy = uploading || mutation.isPending;
  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500';

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 py-1 sm:grid-cols-2 max-h-[65vh] overflow-y-auto">
      <p className="sm:col-span-2 text-[11.5px] text-zinc-500">
        Fill in only what should change. HR verifies the request {kind === 'bank' ? '(attach a cancelled cheque or passbook page) ' : '(attach proof such as your PAN card) '}
        before it takes effect.
      </p>
      {FIELDS[kind].map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-[11px] text-zinc-600">
          {f.label}
          {f.type === 'select' ? (
            <select value={values[f.key] || ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className={input}>
              <option value="">No change</option>
              {f.options!.map((o) => <option key={o} value={o}>{o[0].toUpperCase() + o.slice(1)}</option>)}
            </select>
          ) : (
            <input
              type={f.type === 'date' ? 'date' : 'text'}
              value={values[f.key] || ''}
              placeholder={f.placeholder || 'No change'}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className={input}
            />
          )}
        </label>
      ))}
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Reason / note for HR
        <textarea rows={2} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-blue-500" />
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Proof document (PDF, JPG, PNG — max 5 MB)
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-[11px]" />
      </label>
      {error && <p className="sm:col-span-2 text-[11px] text-rose-500">{error}</p>}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} disabled={busy} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
        <button type="submit" disabled={busy} className="flex items-center gap-1.5 rounded-md bg-[#1d4ed8] px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy && <Loader2 size={13} className="animate-spin" />} {uploading ? 'Uploading…' : 'Send to HR'}
        </button>
      </div>
    </form>
  );
}
