import api from '@/lib/axios';

/** Assets assigned to the signed-in employee — backend /api/v1/me/assets (Phase 1D-3a). */

export interface MyAssetAllocation {
  _id: string;
  allocatedDate: string;
  returnDate?: string;
  condition?: string;
  status: 'Active' | 'Returned';
  assetId: {
    _id: string;
    name: string;
    type: string;
    serialNumber: string;
    purchaseDate?: string;
    purchaseValue?: number;
    status: 'Available' | 'Allocated' | 'Maintenance' | 'Retired';
  } | null;
}

export interface MyAssetIssue {
  _id: string;
  assetId: string;
  subject: string;
  ticketNumber?: string;
  status: string;
  createdAt: string;
}

export const getMyAssets = async (): Promise<{ allocations: MyAssetAllocation[]; openIssues: MyAssetIssue[] }> =>
  (await api.get('/me/assets')).data;
