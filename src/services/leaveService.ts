import api from '@/lib/axios';

/** The signed-in employee's leave — backend /api/v1/leaves (self-scoped routes). */

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  defaultDays: number;
  creditedDays: number;
  takenThisYear: number;
  pendingDays: number;
  balance: number;
}

export interface MyLeaveRequest {
  _id: string;
  leaveTypeId?: { _id: string; name: string } | null;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  isHalfDay?: boolean;
  halfDaySession?: 'first' | 'second';
  rejectionReason?: string;
  createdAt: string;
}

export interface ApplyLeavePayload {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay?: boolean;
  halfDaySession?: 'first' | 'second';
  contactNumber?: string;
  contactEmail?: string;
  attachmentUrl?: string;
}

export const getMyLeaveBalances = async (): Promise<LeaveBalance[]> => (await api.get('/leaves/statistics')).data.stats;

export const getMyLeaveRequests = async (): Promise<MyLeaveRequest[]> => (await api.get('/leaves/my-leaves')).data;

export const applyForLeave = async (payload: ApplyLeavePayload) => (await api.post('/leaves/apply', payload)).data;

/** Multipart upload through /upload (type/size checked server-side); returns the stored URL. */
export const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  return (await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.url;
};

/** Days a request consumes — mirrors the backend's leaveDays(). */
export const requestDays = (r: Pick<MyLeaveRequest, 'startDate' | 'endDate' | 'isHalfDay'>) => {
  if (r.isHalfDay) return 0.5;
  const ms = new Date(r.endDate).setHours(0, 0, 0, 0) - new Date(r.startDate).setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000) + 1;
};
