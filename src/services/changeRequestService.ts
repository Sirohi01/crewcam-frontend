import api from '@/lib/axios';

/** HR-approved changes to HR-owned profile data (Phase 1E). */

export type ChangeRequestKind = 'identity' | 'bank';
export type ChangeRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface ChangeSummaryItem {
  field: string;
  label: string;
  from: string; // masked where sensitive
  to: string;
}

export interface ChangeRequest {
  _id: string;
  kind: ChangeRequestKind;
  summary: ChangeSummaryItem[];
  status: ChangeRequestStatus;
  employeeComment?: string;
  attachmentUrl?: string;
  reviewerComment?: string;
  reviewedAt?: string;
  reviewerId?: { firstName: string; lastName: string } | null;
  userId?: { _id: string; firstName: string; lastName: string; employeeCode?: string; email?: string } | string;
  createdAt: string;
}

export interface ChangeRequestDetail extends ChangeRequest {
  proposed: Record<string, string>; // full values, reviewers only
}

// Employee
export const getMyChangeRequests = async (): Promise<ChangeRequest[]> => (await api.get('/me/change-requests')).data.data;
export const submitChangeRequest = async (body: { kind: ChangeRequestKind; changes: Record<string, unknown>; comment?: string; attachmentUrl?: string }) =>
  (await api.post('/me/change-requests', body)).data.data as ChangeRequest;
export const cancelMyChangeRequest = async (id: string) => (await api.post(`/me/change-requests/${id}/cancel`)).data;

// HR (EMPLOYEE_WRITE)
export const listChangeRequests = async (status: ChangeRequestStatus): Promise<ChangeRequest[]> =>
  (await api.get('/change-requests', { params: { status } })).data.data;
export const getChangeRequest = async (id: string): Promise<ChangeRequestDetail> => (await api.get(`/change-requests/${id}`)).data.data;
export const reviewChangeRequest = async (id: string, decision: 'Approved' | 'Rejected', comment?: string) =>
  (await api.put(`/change-requests/${id}/review`, { decision, comment })).data;

export const KIND_LABEL: Record<ChangeRequestKind, string> = { identity: 'Personal details', bank: 'Bank account' };
