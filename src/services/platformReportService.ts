import api from '@/lib/axios';

/** "Report a problem" — goes to the CrewCam team (backend /api/v1/me/platform-reports). */

export type PlatformIssueType = 'bug' | 'question' | 'feedback';

export interface PlatformReport {
  issueType: PlatformIssueType;
  description: string;
  pageUrl?: string;
  screenshotUrl?: string;
}

export const sendPlatformReport = async (payload: PlatformReport): Promise<{ message: string; ticket: { ticketNumber?: string } }> =>
  (await api.post('/me/platform-reports', payload)).data;
