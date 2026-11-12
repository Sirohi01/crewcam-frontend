'use client';

import React from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeRequestKind, KIND_LABEL, cancelMyChangeRequest, getMyChangeRequests } from '@/services/changeRequestService';

/**
 * The employee's pending and recently decided change requests for one kind. Shows
 * nothing when there are none, so it can sit on a page without affecting its layout.
 */
export function MyChangeRequestsBanner({ kind }: { kind: ChangeRequestKind }) {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['me', 'change-requests'], queryFn: getMyChangeRequests, staleTime: 30 * 1000 });
  const cancel = useMutation({
    mutationFn: cancelMyChangeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'change-requests'] });
      toast.success('Request cancelled');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not cancel'),
  });

  const recentCutoff = moment().subtract(14, 'days');
  const shown = data.filter((r) => r.kind === kind && (r.status === 'Pending' || ((r.status === 'Approved' || r.status === 'Rejected') && moment(r.reviewedAt).isAfter(recentCutoff))));
  if (shown.length === 0) return null;

  return (
    <div className="mb-2 space-y-1">
      {shown.map((r) => (
        <div
          key={r._id}
          className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[11px] ${
            r.status === 'Pending' ? 'border-amber-200 bg-amber-50 text-amber-800' : r.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            {r.status === 'Pending' ? <Clock size={12} /> : r.status === 'Approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            <span className="font-semibold">{KIND_LABEL[r.kind]} change {r.status === 'Pending' ? 'awaiting HR approval' : r.status.toLowerCase()}:</span>
            {r.summary.map((s) => `${s.label} → ${s.to}`).join(', ')}
            {r.status === 'Rejected' && r.reviewerComment && <span>(Reason: {r.reviewerComment})</span>}
          </span>
          {r.status === 'Pending' && (
            <button onClick={() => cancel.mutate(r._id)} disabled={cancel.isPending} className="font-semibold underline hover:no-underline disabled:opacity-50">
              Cancel request
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
