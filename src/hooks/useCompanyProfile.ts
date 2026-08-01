'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompanyProfile, CompanyProfile } from '@/services/companyService';

export function useCompanyProfile() {
  return useQuery<CompanyProfile>({
    queryKey: ['companyProfile'],
    queryFn: getCompanyProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}