import api from '@/lib/axios';

/** The signed-in employee's helpdesk tickets — backend /api/v1/me/tickets (Phase 1D-1). */

export type TicketCategory = 'IT' | 'HR' | 'Finance' | 'Facility' | 'Other';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In_Progress' | 'Resolved' | 'Closed';

export const TICKET_CATEGORY_LABEL: Record<TicketCategory, string> = {
  IT: 'IT Support',
  HR: 'HR Services',
  Finance: 'Payroll & Finance',
  Facility: 'Facility',
  Other: 'Other',
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  Open: 'Open',
  In_Progress: 'In Progress',
  Resolved: 'Resolved',
  Closed: 'Closed',
};

export interface MyTicket {
  _id: string;
  ticketNumber?: string;
  department: TicketCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  resolution?: string;
  resolvedAt?: string;
  rating?: number;
  assignedTo?: { firstName: string; lastName: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyTicketsResponse {
  tickets: MyTicket[];
  stats: { total: number; open: number; inProgress: number; resolvedThisMonth: number; avgResolutionHours: number | null };
  ratePrompt: { _id: string; subject: string; ticketNumber?: string } | null;
}

export interface NewTicket {
  department: TicketCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
}

export const getMyTickets = async (): Promise<MyTicketsResponse> => (await api.get('/me/tickets')).data;

export const raiseTicket = async (payload: NewTicket) => (await api.post('/me/tickets', payload)).data;

export const rateTicket = async ({ id, rating, feedback }: { id: string; rating: number; feedback?: string }) =>
  (await api.post(`/me/tickets/${id}/rating`, { rating, feedback })).data;
