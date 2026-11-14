'use client';

import React, { useState } from 'react';
import moment from 'moment';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAssignTask, useCreateTask, useMyTeam, useUpdateTask } from '@/hooks/useMyTasks';
import { MyTask, TaskPriority, TaskStatus } from '@/services/taskService';

export type TaskDialogMode = { kind: 'create' } | { kind: 'assign' } | { kind: 'edit'; task: MyTask };

const TITLES = { create: 'Add a task', assign: 'Assign a task to your team', edit: 'Edit task' };

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = { Pending: 'To Do', In_Progress: 'In Progress', Completed: 'Completed' };

/**
 * Add, edit or delegate a task. A task someone else assigned to you can only have its
 * status changed — the backend enforces the same rule.
 */
export function TaskDialog({ mode, onClose }: { mode: TaskDialogMode | null; onClose: () => void }) {
  return (
    <Dialog open={!!mode} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{mode ? TITLES[mode.kind] : ''}</DialogTitle>
        </DialogHeader>
        {mode && <TaskForm key={mode.kind === 'edit' ? mode.task._id : mode.kind} mode={mode} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function TaskForm({ mode, onClose }: { mode: TaskDialogMode; onClose: () => void }) {
  const task = mode.kind === 'edit' ? mode.task : undefined;
  const delegated = !!task?.assignedBy;
  const create = useCreateTask();
  const assign = useAssignTask();
  const update = useUpdateTask();
  const { data: team = [] } = useMyTeam();

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'Medium');
  const [relatedTo, setRelatedTo] = useState(task?.relatedTo ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'Pending');
  const [assigneeId, setAssigneeId] = useState('');
  const [error, setError] = useState('');

  const busy = create.isPending || assign.isPending || update.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fields = { title: title.trim(), description: description.trim(), dueDate, priority, relatedTo: relatedTo.trim() };
    if (!delegated && !fields.title) return setError('Give the task a title.');
    if (mode.kind === 'assign' && !assigneeId) return setError('Choose who the task is for.');
    try {
      if (mode.kind === 'create') await create.mutateAsync(fields);
      else if (mode.kind === 'assign') await assign.mutateAsync({ ...fields, assigneeId });
      else await update.mutateAsync(delegated ? { id: task!._id, status } : { id: task!._id, ...fields, status });
      toast.success(mode.kind === 'assign' ? 'Task assigned' : mode.kind === 'create' ? 'Task added' : 'Task updated');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save the task.');
    }
  };

  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12px] outline-none focus:border-blue-500 disabled:bg-zinc-50 disabled:text-zinc-500';

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3 py-1 sm:grid-cols-2">
      {delegated && (
        <p className="sm:col-span-2 text-[11.5px] text-zinc-500">
          Assigned by {task!.assignedBy!.firstName} {task!.assignedBy!.lastName}. You can update its status.
        </p>
      )}
      {mode.kind === 'assign' && (
        <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Assign to
          <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={input}>
            <option value="">Select a team member</option>
            {team.map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName || ''}{m.designationId?.name ? ` — ${m.designationId.name}` : ''}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Title
        <input value={title} disabled={delegated} maxLength={200} onChange={(e) => setTitle(e.target.value)} className={input} />
      </label>
      <label className="sm:col-span-2 flex flex-col gap-1 text-[11px] text-zinc-600">Details
        <textarea rows={2} value={description} disabled={delegated} maxLength={2000} onChange={(e) => setDescription(e.target.value)} className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-blue-500 disabled:bg-zinc-50 disabled:text-zinc-500" />
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Due date
        <input type="date" value={dueDate} disabled={delegated} onChange={(e) => setDueDate(e.target.value)} className={input} />
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Priority
        <select value={priority} disabled={delegated} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={input}>
          {['High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Related to
        <input value={relatedTo} disabled={delegated} maxLength={120} placeholder="Project, client…" onChange={(e) => setRelatedTo(e.target.value)} className={input} />
      </label>
      {mode.kind === 'edit' && (
        <label className="flex flex-col gap-1 text-[11px] text-zinc-600">Status
          <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={input}>
            {(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((s) => <option key={s} value={s}>{TASK_STATUS_LABEL[s]}</option>)}
          </select>
        </label>
      )}
      {error && <p className="sm:col-span-2 text-[11px] text-rose-500">{error}</p>}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} disabled={busy} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
        <button type="submit" disabled={busy} className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {busy && <Loader2 size={13} className="animate-spin" />} {mode.kind === 'assign' ? 'Assign' : 'Save'}
        </button>
      </div>
    </form>
  );
}
