'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignTask, createTask, deleteTask, getMyTasks, getMyTeam, updateTask } from '@/services/taskService';

// Same key as the older /dashboard/todos board, so both stay in sync.
const KEY = ['todos'] as const;

export function useMyTasks() {
  return useQuery({ queryKey: KEY, queryFn: getMyTasks, staleTime: 30 * 1000 });
}

export function useMyTeam() {
  return useQuery({ queryKey: ['me', 'team'], queryFn: getMyTeam, staleTime: 5 * 60 * 1000 });
}

/** Errors are left to the caller to show. */
function useTaskMutation<T>(fn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }) });
}

export const useCreateTask = () => useTaskMutation(createTask);
export const useAssignTask = () => useTaskMutation(assignTask);
export const useUpdateTask = () => useTaskMutation(updateTask);
export const useDeleteTask = () => useTaskMutation(deleteTask);
