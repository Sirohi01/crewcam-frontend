'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyRequests, withdrawRequest } from '@/services/myRequestsService';

const KEY = ['me', 'requests'] as const;

export function useMyRequests() {
  return useQuery({ queryKey: KEY, queryFn: getMyRequests, staleTime: 30 * 1000 });
}

/** Withdraws, then refreshes this list and the module-specific ones. Errors are left to the caller. */
export function useWithdrawRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawRequest,
    onSuccess: () => {
      for (const key of [KEY, ['me', 'leave-requests'], ['me', 'leave-balances'], ['me', 'expenses'], ['me', 'change-requests']]) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
  });
}
