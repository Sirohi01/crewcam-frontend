'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus, X, Send, FileText } from 'lucide-react';
import api from '@/lib/axios';

const STAGE_COLOR: Record<string, string> = {
  LEAD: 'bg-blue-100 text-blue-700',
  DEMO_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL_SENT: 'bg-violet-100 text-violet-700',
  QUOTATION_APPROVED: 'bg-amber-100 text-amber-700',
  WON: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-zinc-100 text-zinc-500',
};

const PROPOSAL_STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-600',
  SENT: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  EXPIRED: 'bg-rose-100 text-rose-700',
};

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

const EMPTY_ITEM = { description: '', amount: 0 };

export default function LeadOverviewPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [validDays, setValidDays] = useState(14);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['super-admin', 'lead', id],
    queryFn: async () => (await api.get(`/super-admin/leads/${id}`)).data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'lead', id] });

  const openModal = () => { setItems([{ ...EMPTY_ITEM }]); setValidDays(14); setFormError(''); setIsModalOpen(true); };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, [field]: field === 'amount' ? Number(value) || 0 : value } : it));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const validItems = items.filter((it) => it.description.trim() && it.amount > 0);
    if (validItems.length === 0) {
      setFormError('Add at least one line item with a description and amount');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/super-admin/leads/${id}/proposals`, { items: validItems, validDays });
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to generate proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async (proposalId: string) => {
    setSendingId(proposalId);
    setActionError('');
    try {
      await api.post(`/super-admin/leads/${id}/proposals/${proposalId}/send`);
      invalidate();
    } catch (e: any) {
      setActionError(e?.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSendingId(null);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-zinc-400 text-sm">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-center text-rose-500 text-sm">Lead not found.</div>;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/leads" className="text-zinc-400 hover:text-zinc-600">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">{lead.companyName}</h1>
          <p className="text-xs text-zinc-500 flex items-center gap-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STAGE_COLOR[lead.stage]}`}>{lead.stage}</span>
            {lead.contactName} · {lead.contactEmail}
          </p>
        </div>
      </div>

      {actionError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{actionError}</div>}

      <Card className="border-zinc-200/80 shadow-sm rounded-lg">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div><p className="text-zinc-400">Source</p><p className="font-medium text-zinc-900">{lead.source}</p></div>
          <div><p className="text-zinc-400">Estimated Value</p><p className="font-medium text-zinc-900">{formatMoney(lead.estimatedValue, lead.currency)}</p></div>
          <div><p className="text-zinc-400">Phone</p><p className="font-medium text-zinc-900">{lead.contactPhone || '—'}</p></div>
          <div><p className="text-zinc-400">Created</p><p className="font-medium text-zinc-900">{new Date(lead.createdAt).toLocaleDateString()}</p></div>
          {lead.notes && <div className="col-span-full"><p className="text-zinc-400">Notes</p><p className="text-zinc-700">{lead.notes}</p></div>}
          {lead.stage === 'LOST' && lead.lostReason && <div className="col-span-full"><p className="text-zinc-400">Lost Reason</p><p className="text-rose-600">{lead.lostReason}</p></div>}
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md">Proposals</CardTitle>
          <Button onClick={openModal} className="h-7 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus size={13} className="mr-1" /> Generate Proposal
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {(lead.proposals || []).map((p: any) => (
              <div key={p._id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-900 flex items-center gap-2">
                    {p.proposalNumber}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PROPOSAL_STATUS_COLOR[p.status]}`}>{p.status}</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {formatMoney(p.totalAmount, p.currency)} · valid until {p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {p.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                      <FileText size={13} /> PDF
                    </a>
                  )}
                  {p.status === 'DRAFT' && (
                    <Button
                      size="sm"
                      disabled={sendingId === p._id}
                      onClick={() => handleSend(p._id)}
                      className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {sendingId === p._id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="mr-1" />}
                      Send
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {(lead.proposals || []).length === 0 && (
              <div className="p-8 text-center text-zinc-400 text-xs">No proposals generated yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md">Status History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {(lead.stageHistory || []).slice().reverse().map((h: any, i: number) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-md shrink-0 mt-0.5">
                  {h.toStage.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700">
                    {h.fromStage ? <>Moved from <span className="font-medium">{h.fromStage}</span> to </> : <>Created at </>}
                    <span className="font-medium text-indigo-600">{h.toStage}</span>
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {h.changedBy ? `${h.changedBy.firstName || ''} ${h.changedBy.lastName || ''}`.trim() || h.changedBy.email : 'System'} · {new Date(h.changedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(lead.stageHistory || []).length === 0 && (
              <div className="p-8 text-center text-zinc-400 text-xs">No status changes yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200/50 my-auto">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Generate Proposal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}

              <div className="space-y-2">
                <label className="block text-xs font-md text-zinc-700">Line Items *</label>
                {items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                      className="flex-1 border border-zinc-200 rounded-lg text-sm px-3 py-2"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Amount"
                      value={it.amount || ''}
                      onChange={(e) => handleItemChange(i, 'amount', e.target.value)}
                      className="w-32 border border-zinc-200 rounded-lg text-sm px-3 py-2"
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600 px-1">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setItems((prev) => [...prev, { ...EMPTY_ITEM }])} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  + Add line item
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Valid For (days)</label>
                <input
                  type="number"
                  min={1}
                  value={validDays}
                  onChange={(e) => setValidDays(Number(e.target.value) || 14)}
                  className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {submitting ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Generate Proposal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
