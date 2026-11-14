'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyTickets, raiseTicket, rateTicket } from '@/services/helpdeskService';

const KEY = ['me', 'tickets'] as const;

export function useMyTickets() {
  return useQuery({ queryKey: KEY, queryFn: getMyTickets, staleTime: 30 * 1000 });
}

/** Errors are left to the caller to show. */
export function useRaiseTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: raiseTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.invalidateQueries({ queryKey: ['me', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['me', 'assets'] });
    },
  });
}

export function useRateTicket() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: rateTicket, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}
