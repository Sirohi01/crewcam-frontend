'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applyForLeave, getMyLeaveBalances, getMyLeaveRequests } from '@/services/leaveService';

const KEYS = {
  balances: ['me', 'leave-balances'] as const,
  requests: ['me', 'leave-requests'] as const,
};

export function useMyLeaveBalances() {
  return useQuery({ queryKey: KEYS.balances, queryFn: getMyLeaveBalances, staleTime: 60 * 1000 });
}

export function useMyLeaveRequests() {
  return useQuery({ queryKey: KEYS.requests, queryFn: getMyLeaveRequests, staleTime: 30 * 1000 });
}

/** Submits a leave request and refreshes balances and history. Errors are left to the caller to show. */
export function useApplyLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyForLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.balances });
      queryClient.invalidateQueries({ queryKey: KEYS.requests });
    },
  });
}
