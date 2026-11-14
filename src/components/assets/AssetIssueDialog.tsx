'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRaiseTicket } from '@/hooks/useMyTickets';
import { uploadFile } from '@/services/uploadService';
import { MyAssetAllocation } from '@/services/myAssetService';

/**
 * Report damage, a fault or a return request for an asset assigned to you. Raised as an
 * IT helpdesk ticket linked to the asset (the backend checks the asset is yours).
 */
export function AssetIssueDialog({ assets, initialAssetId, open, onClose }: {
  assets: MyAssetAllocation[];
  initialAssetId?: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">Report an asset issue</DialogTitle>
        </DialogHeader>
        {open && <IssueForm key={initialAssetId || 'any'} assets={assets} initialAssetId={initialAssetId} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

const ISSUES = ['Not working', 'Damaged', 'Lost or stolen', 'Needs replacement', 'Return request', 'Other'];

function IssueForm({ assets, initialAssetId, onClose }: { assets: MyAssetAllocation[]; initialAssetId?: string; onClose: () => void }) {
  const raise = useRaiseTicket();
  const [assetId, setAssetId] = useState(initialAssetId || assets[0]?.assetId?._id || '');
  const [issue, setIssue] = useState(ISSUES[0]);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const asset = assets.find((a) => a.assetId?._id === assetId)?.assetId;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!asset) return setError('Choose the asset.');
    if (description.trim().length < 5) return setError('Describe the issue in a few words.');
    if (photo && photo.size > 5 * 1024 * 1024) return setError('The photo must be 5 MB or smaller.');
    try {
      let attachmentUrl: string | undefined;
      if (photo) {
        setUploading(true);
        attachmentUrl = await uploadFile(photo, photo.name);
        setUploading(false);
      }
      const res = await raise.mutateAsync({
        department: 'IT',
        priority: issue === 'Lost or stolen' ? 'Urgent' : issue === 'Not working' ? 'High' : 'Medium',
        subject: `${issue}: ${asset.name} (${asset.serialNumber})`.slice(0, 150),
        description: description.trim(),
        assetId: asset._id,
        attachmentUrl,
      });
      toast.success(res?.message || 'Issue reported');
      onClose();
    } catch (err: any) {
      setUploading(false);
      setError(err?.response?.data?.message || 'Could not report the issue.');
    }
  };

  const busy = uploading || raise.isPending;
  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500';

  if (assets.length === 0) {
    return <p className="py-2 text-[12px] text-zinc-500">You have no assets assigned right now. For other IT problems, raise a ticket from the Helpdesk.</p>;
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 py-1 sm:grid-cols-2">
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Asset
        <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className={input}>
          {assets.map((a) => a.assetId && <option key={a.assetId._id} value={a.assetId._id}>{a.assetId.name} — {a.assetId.serialNumber}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">What&apos;s wrong?
        <select value={issue} onChange={(e) => setIssue(e.target.value)} className={input}>
          {ISSUES.map((i) => <option key={i}>{i}</option>)}
        </select>
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Details
        <textarea rows={3} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened, and since when?" className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-blue-500" />
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Photo (optional — JPG or PNG, max 5 MB)
        <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="text-[11px]" />
      </label>
      {error && <p className="sm:col-span-2 text-[11px] text-rose-500">{error}</p>}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} disabled={busy} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
        <button type="submit" disabled={busy} className="flex items-center gap-1.5 rounded-md bg-[#1d4ed8] px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy && <Loader2 size={13} className="animate-spin" />} {uploading ? 'Uploading…' : 'Report to IT'}
        </button>
      </div>
    </form>
  );
}
