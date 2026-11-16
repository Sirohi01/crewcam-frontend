'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelAlert, getMyEmergency, triggerAlert } from '@/services/emergencyService';

const KEY = ['me', 'emergency'] as const;

/** While an alert is open, poll so the employee sees "acknowledged" without refreshing. */
export function useMyEmergency() {
  return useQuery({
    queryKey: KEY,
    queryFn: getMyEmergency,
    refetchInterval: (query) => (query.state.data?.activeAlert ? 15000 : false),
  });
}

/** Errors are left to the caller to show. */
export function useTriggerAlert() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: triggerAlert, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export function useCancelAlert() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: cancelAlert, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}
