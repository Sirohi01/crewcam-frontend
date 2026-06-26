'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, ArrowLeft, Briefcase, CalendarClock, ChevronDown, ChevronUp, Lightbulb,
  Loader2, MessageSquareText, Plus, RefreshCw, Sparkles, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';

export default function InterviewQuestionsPage({ interviewId }: { interviewId: string }) {
  const qc = useQueryClient();
  const [newQuestion, setNewQuestion] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [answeringIndex, setAnsweringIndex] = useState<number | null>(null);

  const { data: interview, isLoading } = useQuery<any>({
    queryKey: ['interview-detail', interviewId],
    queryFn: async () => (await api.get(`/hiring/interviews/detail/${interviewId}`)).data,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['interview-detail', interviewId] });

  const generateQuestions = useMutation({
    mutationFn: async () => (await api.post(`/ai/hiring/interviews/${interviewId}/generate-questions`)).data,
    onSuccess: () => refresh(),
  });
  const addQuestion = useMutation({
    mutationFn: async (question: string) => (await api.post(`/hiring/interviews/${interviewId}/questions`, { question })).data,
    onSuccess: () => { setNewQuestion(''); refresh(); },
  });
  const deleteQuestion = useMutation({
    mutationFn: async (index: number) => (await api.delete(`/hiring/interviews/${interviewId}/questions/${index}`)).data,
    onSuccess: () => refresh(),
  });
  const generateAnswer = useMutation({
    mutationFn: async (index: number) => {
      setAnsweringIndex(index);
      return (await api.post(`/ai/hiring/interviews/${interviewId}/questions/${index}/answer`)).data;
    },
    onSuccess: (_data, index) => {
      setExpanded((prev) => new Set(prev).add(index));
      setAnsweringIndex(null);
      refresh();
    },
    onError: () => setAnsweringIndex(null),
  });

  const toggleExpanded = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  if (isLoading) return <div className="p-6 text-sm text-zinc-500">Loading interview...</div>;
  if (!interview) return <div className="p-6 text-sm text-zinc-500">Interview not found.</div>;

  const candidate = interview.candidateId || {};
  const candidateName = candidate.firstName ? `${candidate.firstName} ${candidate.lastName || ''}`.trim() : 'Unknown candidate';
  const questions: Array<{ question: string; suggestedAnswer?: string }> = interview.interviewQuestions || [];

  return (
    <div className="space-y-3 pb-10">
      <Link href="/dashboard/hiring/interviews/list" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-600">
        <ArrowLeft size={13} /> Back to interview register
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageSquareText size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Interview Questions</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                {candidateName}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:border-blue-900/50">
                <Briefcase size={10} /> {candidate.jobRole || '-'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-900/50">
                <CalendarClock size={10} /> {interview.roundType} Round
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" disabled={generateQuestions.isPending} onClick={() => generateQuestions.mutate()}>
          {generateQuestions.isPending ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Sparkles size={14} className="mr-2" />}
          {questions.length > 0 ? 'Regenerate All' : 'Generate with AI'}
        </Button>
      </div>

      {generateQuestions.isError && (
        <div className="flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertTriangle size={16} />
          {(generateQuestions.error as any)?.response?.data?.message || 'Could not generate questions.'}
        </div>
      )}

      <div className="space-y-2.5">
        {questions.length === 0 && (
          <div className="py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50 mt-4">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No questions generated yet</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Click the button below to automatically generate role-specific interview questions for this {interview.roundType} round using AI.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6" disabled={generateQuestions.isPending} onClick={() => generateQuestions.mutate()}>
              {generateQuestions.isPending ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Sparkles size={16} className="mr-2" />}
              Generate Questions
            </Button>
          </div>
        )}

        {questions.map((q, i) => {
          const isExpanded = expanded.has(i);
          const isAnswering = answeringIndex === i && generateAnswer.isPending;
          return (
            <div key={i} className="group relative rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
              <div className="flex gap-4 p-5">
                <div className="flex flex-col items-center">
                  <span className="h-8 w-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">{i + 1}</span>
                  {isExpanded && <div className="w-px h-full bg-slate-200 mt-2 dark:bg-zinc-800"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium leading-relaxed text-slate-900 dark:text-zinc-100">{q.question}</p>
                  <div className="mt-4 flex items-center gap-4">
                    {q.suggestedAnswer ? (
                      <button onClick={() => toggleExpanded(i)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                        <Lightbulb size={14} /> {isExpanded ? 'Hide Answer' : 'Show Suggested Answer'} {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    ) : (
                      <button onClick={() => generateAnswer.mutate(i)} disabled={isAnswering} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isAnswering ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />} {isAnswering ? 'Generating...' : 'Get Suggested Answer'}
                      </button>
                    )}
                    <button onClick={() => deleteQuestion.mutate(i)} disabled={deleteQuestion.isPending} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto sm:ml-0 opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <Trash2 size={14} /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                  
                  {isExpanded && q.suggestedAnswer && (
                    <div className="mt-5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-4 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-xl"></div>
                      <div className="flex gap-3 pl-2">
                        <Lightbulb size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Benchmark Answer</p>
                          <p className="text-[13px] leading-relaxed text-slate-700 dark:text-zinc-300">{q.suggestedAnswer}</p>
                          <button onClick={() => generateAnswer.mutate(i)} disabled={isAnswering} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors">
                            {isAnswering ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Regenerate Answer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Add Custom Question</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newQuestion.trim()) addQuestion.mutate(newQuestion.trim()); }}
            placeholder="Type a specific question you want to ask in this round..."
            className="flex-1 h-10 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:border-zinc-700 dark:bg-zinc-800 dark:focus:bg-zinc-900"
          />
          <Button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" disabled={!newQuestion.trim() || addQuestion.isPending} onClick={() => addQuestion.mutate(newQuestion.trim())}>
            {addQuestion.isPending ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
}
