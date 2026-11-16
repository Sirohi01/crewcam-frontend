import api from '@/lib/axios';

/** Emergency alerts and company safety information — backend /me/emergency and /emergency (Phase 1D-3b). */

export type EmergencyAlertStatus = 'Active' | 'Acknowledged' | 'Resolved' | 'Cancelled';

export interface Helpline {
  label: string;
  number: string;
  available24x7: boolean;
}

export interface SafetySettings {
  helplines: Helpline[];
  officeAddress?: string;
  nearestHospital?: string;
  assemblyPoint?: string;
  aedLocation?: string;
  emergencyExits?: string;
  safetyTips: string[];
  guideUrl?: string;
  safetyMapUrl?: string;
  smsEmergencyContacts: boolean;
}

type Person = { firstName: string; lastName?: string } | null;

export interface EmergencyAlert {
  _id: string;
  status: EmergencyAlertStatus;
  message?: string;
  location?: { lat: number; lng: number; accuracy?: number };
  respondersNotified: number;
  contactNotices: { name: string; mobile: string; result: 'sent' | 'not-configured' | 'failed' }[];
  acknowledgedBy?: Person;
  acknowledgedAt?: string;
  resolvedBy?: Person;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
  userId?: { _id: string; firstName: string; lastName?: string; employeeCode?: string; mobileNumber?: string; departmentId?: { name: string } | null } | string;
}

export interface MyEmergency {
  settings: SafetySettings & { configured: boolean };
  alerts: EmergencyAlert[];
  activeAlert: EmergencyAlert | null;
}

export const getMyEmergency = async (): Promise<MyEmergency> => (await api.get('/me/emergency')).data;

export const triggerAlert = async (payload: { message?: string; location?: { lat: number; lng: number; accuracy?: number } }) =>
  (await api.post('/me/emergency/alerts', payload)).data as { message: string; alert: EmergencyAlert; duplicate?: boolean };

export const cancelAlert = async (id: string) => (await api.post(`/me/emergency/alerts/${id}/cancel`)).data;

export const listAlerts = async (status: string): Promise<{ alerts: EmergencyAlert[]; openCount: number }> =>
  (await api.get('/emergency/alerts', { params: { status: status || undefined } })).data;

export const respondToAlert = async ({ id, status, note }: { id: string; status: 'Acknowledged' | 'Resolved'; note?: string }) =>
  (await api.patch(`/emergency/alerts/${id}`, { status, note })).data;

export const getSafetySettings = async (): Promise<SafetySettings> => (await api.get('/emergency/settings')).data;

export const saveSafetySettings = async (payload: Partial<SafetySettings>) => (await api.put('/emergency/settings', payload)).data;

export const mapsUrl = (loc?: { lat: number; lng: number }) => (loc ? `https://maps.google.com/?q=${loc.lat},${loc.lng}` : '');
