import api from '@/lib/axios';
import { cancelLeave } from './leaveService';
import { withdrawExpense } from './expenseService';
import { cancelMyChangeRequest } from './changeRequestService';

/** Everything the signed-in employee has requested, across modules — backend /api/v1/me/requests (Phase 1D-2). */

export type RequestKind = 'leave' | 'reimbursement' | 'profile-change' | 'ticket' | 'query';
export type RequestStatus = 'In Progress' | 'Approved' | 'Rejected' | 'Withdrawn';

export interface MyRequest {
  id: string;
  kind: RequestKind;
  title: string;
  reference: string;
  status: RequestStatus;
  rawStatus: string;
  requestedOn: string;
  updatedOn: string;
  decidedBy?: string;
  note?: string;
  canWithdraw: boolean;
  link: string;
}

export interface MyRequestsResponse {
  items: MyRequest[];
  summary: { total: number; inProgress: number; approved: number; rejected: number; withdrawn: number };
}

export const REQUEST_KIND_LABEL: Record<RequestKind, string> = {
  leave: 'Leave',
  reimbursement: 'Reimbursement',
  'profile-change': 'Profile Change',
  ticket: 'Helpdesk',
  query: 'HR Query',
};

export const getMyRequests = async (): Promise<MyRequestsResponse> => (await api.get('/me/requests')).data;

/** Withdraw a pending request with the endpoint that owns it. */
export const withdrawRequest = async (r: Pick<MyRequest, 'id' | 'kind'>) => {
  if (r.kind === 'leave') return cancelLeave(r.id);
  if (r.kind === 'reimbursement') return withdrawExpense(r.id);
  if (r.kind === 'profile-change') return cancelMyChangeRequest(r.id);
  throw new Error('This request cannot be withdrawn');
};
