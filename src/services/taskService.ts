import api from '@/lib/axios';

/** The signed-in employee's tasks — backend /api/v1/todos (self-scoped) and /me/team (Phase 1D-1). */

export type TaskStatus = 'Pending' | 'In_Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface MyTask {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedTo?: string;
  completedAt?: string;
  assignedBy?: { _id: string; firstName: string; lastName: string } | null;
  createdAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  relatedTo?: string;
}

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName?: string;
  employeeCode?: string;
  designationId?: { name: string } | null;
}

export const getMyTasks = async (): Promise<MyTask[]> => (await api.get('/todos')).data;

export const createTask = async (payload: TaskInput) => (await api.post('/todos', payload)).data;

export const assignTask = async (payload: TaskInput & { assigneeId: string }) => (await api.post('/todos/assign', payload)).data;

export const updateTask = async ({ id, ...payload }: Partial<TaskInput> & { id: string; status?: TaskStatus }) =>
  (await api.put(`/todos/${id}`, payload)).data;

export const deleteTask = async (id: string) => (await api.delete(`/todos/${id}`)).data;

export const getMyTeam = async (): Promise<TeamMember[]> => (await api.get('/me/team')).data;
