import api from '@/lib/axios';

/** Notifications addressed to the signed-in user — backend /api/v1/me/notifications (Phase 1D-1). */

export interface MyNotification {
  _id: string;
  title: string;
  message: string;
  link?: string;
  priority: 'Normal' | 'High';
  audienceType: 'All' | 'Role' | 'Department' | 'Branch' | 'User';
  isDirect: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationFilters {
  status?: 'read' | 'unread';
  priority?: 'High' | 'Normal';
  kind?: 'direct' | 'announcement';
  from?: string; // YYYY-MM-DD
}

export interface NotificationPage {
  items: MyNotification[];
  hasMore: boolean;
  summary: { total: number; unread: number; important: number; thisWeek: number };
}

export const getMyNotifications = async (filters: NotificationFilters, before?: string): Promise<NotificationPage> =>
  (await api.get('/me/notifications', { params: { ...filters, before } })).data;

export const markNotificationRead = async (id: string) => (await api.post(`/me/notifications/${id}/read`)).data;

export const markAllNotificationsRead = async () => (await api.post('/me/notifications/read-all')).data;
