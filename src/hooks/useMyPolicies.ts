'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { acknowledgePolicy, getMyPolicies } from '@/services/myPolicyService';

const KEY = ['me', 'policies'] as const;

export function useMyPolicies() {
  return useQuery({ queryKey: KEY, queryFn: getMyPolicies, staleTime: 60 * 1000 });
}

/** Errors are left to the caller to show. */
export function useAcknowledgePolicy() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: acknowledgePolicy, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}
