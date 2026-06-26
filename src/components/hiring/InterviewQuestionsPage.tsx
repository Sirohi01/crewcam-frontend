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

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0"><MessageSquareText size={16} /></div>
          <div>
            <h1 className="text-lg font-md leading-tight">Interview Questions</h1>
            <p className="text-xs text-zinc-500 flex items-center gap-1.5 flex-wrap">
              <span className="font-md text-zinc-700 dark:text-zinc-300">{candidateName}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Briefcase size={12} /> {candidate.jobRole || '-'}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-indigo-600 font-md"><CalendarClock size={12} /> {interview.roundType} round</span>
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" disabled={generateQuestions.isPending} onClick={() => generateQuestions.mutate()}>
          {generateQuestions.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <RefreshCw size={14} className="mr-1.5" />}
          {questions.length > 0 ? 'Regenerate all' : 'Generate questions'}
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
          <Card className="border-dashed border-zinc-200 dark:border-zinc-700">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-zinc-500 mb-3">No questions yet for this {interview.roundType} round.</p>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={generateQuestions.isPending} onClick={() => generateQuestions.mutate()}>
                {generateQuestions.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Sparkles size={14} className="mr-1.5" />}
                Generate with AI
              </Button>
            </CardContent>
          </Card>
        )}

        {questions.map((q, i) => {
          const isExpanded = expanded.has(i);
          const isAnswering = answeringIndex === i && generateAnswer.isPending;
          return (
            <Card key={i} className="border-zinc-200 shadow-sm dark:border-zinc-800">
              <CardContent className="p-3.5">
                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-md flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">{q.question}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {q.suggestedAnswer ? (
                        <button onClick={() => toggleExpanded(i)} className="inline-flex items-center gap-1 text-xs font-md text-indigo-600 hover:underline">
                          <Lightbulb size={12} /> {isExpanded ? 'Hide' : 'Show'} suggested answer {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      ) : (
                        <button onClick={() => generateAnswer.mutate(i)} disabled={isAnswering} className="inline-flex items-center gap-1 text-xs font-md text-indigo-600 hover:underline disabled:opacity-50">
                          {isAnswering ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} />} {isAnswering ? 'Generating answer…' : 'Get suggested answer'}
                        </button>
                      )}
                      <button onClick={() => deleteQuestion.mutate(i)} disabled={deleteQuestion.isPending} className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-rose-600 disabled:opacity-50">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                    {isExpanded && q.suggestedAnswer && (
                      <div className="mt-2.5 rounded-md bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-3 flex gap-2">
                        <Lightbulb size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-indigo-500 mb-1">Benchmark answer — what a strong response covers</p>
                          <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{q.suggestedAnswer}</p>
                          <button onClick={() => generateAnswer.mutate(i)} disabled={isAnswering} className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline disabled:opacity-50">
                            {isAnswering ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Regenerate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-3.5">
          <p className="text-xs font-md text-zinc-700 dark:text-zinc-300 mb-2">Add your own question</p>
          <div className="flex gap-2">
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newQuestion.trim()) addQuestion.mutate(newQuestion.trim()); }}
              placeholder="Type a question to add to this round..."
              className="flex-1 h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={!newQuestion.trim() || addQuestion.isPending} onClick={() => addQuestion.mutate(newQuestion.trim())}>
              {addQuestion.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />}
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
