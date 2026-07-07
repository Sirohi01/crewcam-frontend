'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, CheckCircle2, Trash2, Plus, Calendar as CalendarIcon, Flag, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function TodosPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => (await api.get('/todos')).data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['todos'] });

  const createMutation = useMutation({
    mutationFn: async () => (await api.post('/todos', { title, dueDate: dueDate || undefined, priority })).data,
    onSuccess: () => {
      invalidate();
      setTitle('');
      setDueDate('');
      setPriority('Medium');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: any) => (await api.put(`/todos/${id}`, { status })).data,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/todos/${id}`)).data,
    onSuccess: invalidate,
  });

  const priorityColor: Record<string, string> = {
    High: 'text-rose-700 bg-rose-100/80 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400',
    Medium: 'text-amber-700 bg-amber-100/80 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400',
    Low: 'text-emerald-700 bg-emerald-100/80 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400',
  };

  const getPriorityIconColor = (p: string) => {
    if (p === 'High') return 'text-rose-500';
    if (p === 'Medium') return 'text-amber-500';
    return 'text-emerald-500';
  };

  const pendingCount = todos?.filter((t: any) => t.status !== 'Completed').length ?? 0;

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300 pb-5 w-full">
      {/* Header */}
      <header className="flex items-end justify-between gap-2 pb-2.5 border-b border-zinc-200/70 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Tasks &amp; To-Dos</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Manage your personal tasks and daily goals</p>
        </div>
        {!isLoading && todos?.length > 0 && (
          <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full whitespace-nowrap">
            {pendingCount} pending
          </span>
        )}
      </header>

      {/* Add task */}
      <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-visible">
        <CardContent className="p-1.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              createMutation.mutate();
            }}
            className="flex flex-col sm:flex-row gap-1.5 items-stretch sm:items-center"
          >
            <div className="relative flex-1 w-full">
              <Plus size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border-none pl-8 pr-2.5 py-2 rounded-md text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:font-normal"
                required
              />
            </div>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <CalendarIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full sm:w-[132px] h-9 pl-8 pr-2 rounded-md text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all"
                />
              </div>
              <div className="relative flex-1 sm:flex-none">
                <Flag size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${getPriorityIconColor(priority)}`} />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full sm:w-[104px] h-9 pl-8 pr-2 rounded-md text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <Button disabled={createMutation.isPending} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-9 px-3.5 shrink-0 inline-flex items-center gap-1.5">
                {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <div>
        {isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center text-zinc-400 gap-1.5">
            <Loader2 size={20} className="animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading tasks…</p>
          </div>
        ) : todos?.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
            <ListTodo size={32} className="mb-2 text-zinc-300 dark:text-zinc-700" />
            <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">No tasks yet</p>
            <p className="text-xs text-zinc-500 mt-0.5">Add a task above to get started.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {todos?.map((t: any) => {
              const isCompleted = t.status === 'Completed';
              return (
                <li
                  key={t._id}
                  className={`group flex items-center gap-2.5 rounded-lg border p-2.5 transition-all ${isCompleted ? 'bg-zinc-50/50 border-zinc-100 dark:bg-zinc-900/20 dark:border-zinc-800/50 opacity-70 hover:opacity-100' : 'bg-white border-zinc-200 shadow-sm hover:border-indigo-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-indigo-900/50'}`}
                >
                  <button
                    onClick={() => toggleMutation.mutate({ id: t._id, status: isCompleted ? 'Pending' : 'Completed' })}
                    className="shrink-0 transition-transform active:scale-90"
                    title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium truncate transition-all ${isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {t.title}
                    </p>
                    {t.dueDate && (
                      <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <CalendarIcon size={10} /> {moment(t.dueDate).format('MMM DD, YYYY')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${priorityColor[t.priority]}`}>
                      {t.priority}
                    </span>
                    <button
                      onClick={() => deleteMutation.mutate(t._id)}
                      className="text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}