'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationFilters,
} from '@/services/notificationFeedService';

const KEY = ['me', 'notifications'] as const;

/** Pages of 20, newest first; "Load more" asks for items older than the last one shown. */
export function useMyNotifications(filters: NotificationFilters) {
  return useInfiniteQuery({
    queryKey: [...KEY, filters],
    queryFn: ({ pageParam }) => getMyNotifications(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.items[last.items.length - 1]?.createdAt : undefined),
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: markNotificationRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: markAllNotificationsRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}
