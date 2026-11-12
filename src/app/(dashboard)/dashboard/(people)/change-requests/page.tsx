'use client';

import React, { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ClipboardList, Eye, Loader2, Paperclip, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChangeRequest,
  ChangeRequestStatus,
  KIND_LABEL,
  getChangeRequest,
  listChangeRequests,
  reviewChangeRequest,
} from '@/services/changeRequestService';

const STATUSES: ChangeRequestStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
const STATUS_STYLE: Record<ChangeRequestStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

const employeeName = (r: ChangeRequest) =>
  typeof r.userId === 'object' && r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : 'Employee';

/**
 * HR review of employees' requests to change HR-owned data (Phase 1E). Requires
 * EMPLOYEE_WRITE (enforced by the API). Approving applies the change immediately.
 */
export default function ProfileChangeRequestsPage() {
  const [status, setStatus] = useState<ChangeRequestStatus>('Pending');
  const [openId, setOpenId] = useState<string | null>(null);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['change-requests', status],
    queryFn: () => listChangeRequests(status),
  });
  const forbidden = (error as any)?.response?.status === 403;

  return (
    <div className="space-y-4 p-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Profile Change Requests</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          Employees&apos; requests to change their name, date of birth, statutory IDs or salary bank account. Nothing changes until you approve.
        </p>
      </div>

      <div className="flex gap-2 border-b border-zinc-200">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`-mb-px border-b-2 px-3 pb-2 text-[13px] font-semibold transition-colors ${status === s ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="p-0">
          {forbidden ? (
            <p className="p-6 text-center text-[13px] text-zinc-500">You need the Employee Management (write) permission to review change requests.</p>
          ) : isLoading ? (
            <p className="p-6 text-center text-[13px] text-zinc-400">Loading…</p>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <ClipboardList size={28} className="text-zinc-300" />
              <p className="text-[13px] text-zinc-500">No {status.toLowerCase()} requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60 text-[11.5px] font-semibold text-zinc-500">
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Requested changes</th>
                    <th className="px-4 py-2">Submitted</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r._id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-zinc-800">{employeeName(r)}</p>
                        {typeof r.userId === 'object' && r.userId?.employeeCode && <p className="text-[11px] text-zinc-400">{r.userId.employeeCode}</p>}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-600">{KIND_LABEL[r.kind]}</td>
                      <td className="px-4 py-2.5 text-zinc-600">{r.summary.map((s) => s.label).join(', ')}</td>
                      <td className="px-4 py-2.5 text-zinc-500">{moment(r.createdAt).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-2.5">
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button onClick={() => setOpenId(r._id)} className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50">
                          <Eye size={13} /> {r.status === 'Pending' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ReviewDialog id={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}

function ReviewDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[15px]">Change request</DialogTitle>
        </DialogHeader>
        {id && <ReviewBody key={id} id={id} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function ReviewBody({ id, onDone }: { id: string; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const { data: request, isLoading } = useQuery({ queryKey: ['change-request', id], queryFn: () => getChangeRequest(id) });

  const review = useMutation({
    mutationFn: (decision: 'Approved' | 'Rejected') => reviewChangeRequest(id, decision, comment.trim() || undefined),
    onSuccess: (_res, decision) => {
      queryClient.invalidateQueries({ queryKey: ['change-requests'] });
      toast.success(decision === 'Approved' ? 'Approved and applied' : 'Request rejected');
      onDone();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not complete the review'),
  });

  if (isLoading || !request) return <p className="py-6 text-center text-[13px] text-zinc-400">Loading…</p>;
  const pending = request.status === 'Pending';

  return (
    <div className="space-y-3 py-1 text-[12.5px]">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-zinc-800">{employeeName(request)} · {KIND_LABEL[request.kind]}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[request.status]}`}>{request.status}</span>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] font-semibold text-zinc-400">
            <th className="py-1">Field</th>
            <th className="py-1">Current</th>
            <th className="py-1">Requested</th>
          </tr>
        </thead>
        <tbody>
          {request.summary.map((s) => (
            <tr key={s.field} className="border-t border-zinc-100">
              <td className="py-1.5 text-zinc-600">{s.label}</td>
              <td className="py-1.5 text-zinc-500">{s.from || '—'}</td>
              {/* Reviewers see the full requested value to verify it against the proof. */}
              <td className="py-1.5 font-semibold text-zinc-900">{request.proposed?.[s.field] ?? s.to}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {request.employeeComment && <p className="rounded-md bg-zinc-50 p-2 text-zinc-700">Employee note: {request.employeeComment}</p>}
      {request.attachmentUrl ? (
        <a href={request.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
          <Paperclip size={13} /> View proof document
        </a>
      ) : (
        <p className="text-[11.5px] text-amber-700">No proof document attached.</p>
      )}

      {pending ? (
        <>
          <textarea
            rows={2}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment (required when rejecting)"
            className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-[12.5px] outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => review.mutate('Rejected')}
              disabled={review.isPending || !comment.trim()}
              title={!comment.trim() ? 'Add a reason to reject' : undefined}
              className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-2 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              <XCircle size={14} /> Reject
            </button>
            <button
              onClick={() => review.mutate('Approved')}
              disabled={review.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-[12.5px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {review.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve &amp; apply
            </button>
          </div>
        </>
      ) : (
        <p className="text-[11.5px] text-zinc-500">
          {request.status} {request.reviewedAt && `on ${moment(request.reviewedAt).format('DD MMM YYYY')}`}
          {request.reviewerId && ` by ${request.reviewerId.firstName} ${request.reviewerId.lastName}`}
          {request.reviewerComment && ` — ${request.reviewerComment}`}
        </p>
      )}
    </div>
  );
}
