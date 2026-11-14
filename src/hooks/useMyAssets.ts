'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyAssets } from '@/services/myAssetService';

export function useMyAssets() {
  return useQuery({ queryKey: ['me', 'assets'], queryFn: getMyAssets, staleTime: 60 * 1000 });
}
