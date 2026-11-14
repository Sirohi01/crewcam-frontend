import api from '@/lib/axios';

/** Company policies that apply to the signed-in employee — backend /api/v1/me/policies (Phase 1D-2). */

export interface MyPolicy {
  _id: string;
  title: string;
  code: string;
  category: string;
  subCategory?: string;
  type: 'Mandatory' | 'Recommended' | 'Informational';
  effectiveFrom: string;
  version: string;
  shortDescription: string;
  detailedDescription?: string;
  documentUrl?: string;
  requiresAck: boolean;
  acknowledgedAt: string | null;
  updatedAt: string;
  updatedBy?: { firstName: string; lastName?: string } | null;
}

export interface MyPoliciesResponse {
  items: MyPolicy[];
  summary: { total: number; mandatory: number; pendingAck: number; acknowledged: number; updatedRecently: number };
}

export const getMyPolicies = async (): Promise<MyPoliciesResponse> => (await api.get('/me/policies')).data;

export const acknowledgePolicy = async (id: string) => (await api.post(`/me/policies/${id}/acknowledge`, { agree: true })).data;
