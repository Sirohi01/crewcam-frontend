'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, ArrowLeft, Award, Briefcase, Camera, CheckCircle2, ChevronRight, Circle,
  FileText, Loader2, Mail, MessageSquareText, Phone, Sparkles, Square, Star, Target, Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';

type RecordingState = 'idle' | 'recording' | 'uploading' | 'analyzed' | 'error';

const VERDICT_STYLE: Record<string, string> = {
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  adequate: 'bg-blue-50 text-blue-700 border-blue-200',
  weak: 'bg-amber-50 text-amber-700 border-amber-200',
  no_answer: 'bg-rose-50 text-rose-700 border-rose-200',
};

const RECOMMENDATION_STYLE: Record<string, string> = {
  strong_hire: 'bg-emerald-100 text-emerald-700',
  hire: 'bg-blue-100 text-blue-700',
  lean_no: 'bg-amber-100 text-amber-700',
  no_hire: 'bg-rose-100 text-rose-700',
};

const ROUND_FOCUS: Record<string, string> = {
  'Walk-In': 'Confirm background accuracy, availability and immediate fit. Keep it quick and simple.',
  Telephonic: 'First-call screening — gauge communication clarity, motivation and notice period before investing more rounds.',
  Technical: 'Deep technical assessment — probe hands-on depth in the role’s required skills and real problem-solving.',
  HR: 'Behavioral and culture fit — past conduct, teamwork, conflict handling and soft-skill scenarios.',
  'HR & HOD': 'Combined behavioral and role fit — culture fit alongside whether experience matches the job requirements.',
  Managerial: 'Ownership and leadership — decision-making, prioritization and how they’d approach the key responsibilities.',
  Final: 'Closing round — career goals, compensation expectations, and any open concerns before an offer.',
};

const STATUS_BADGE: Record<string, string> = {
  Scheduled: 'bg-blue-50 text-blue-700',
  In_Progress: 'bg-purple-50 text-purple-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-rose-50 text-rose-700',
  No_Show: 'bg-amber-50 text-amber-700',
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={11} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

const MIME_PRIORITY = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return MIME_PRIORITY.find((type) => MediaRecorder.isTypeSupported(type));
}

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) return <img src={src} alt={name} className="h-12 w-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0" />;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold flex items-center justify-center border border-indigo-200 shrink-0">
      {initials}
    </div>
  );
}

export default function LiveInterviewSession({ interviewId }: { interviewId: string }) {
  const qc = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recordingStateByIndex, setRecordingStateByIndex] = useState<Record<number, RecordingState>>({});
  const [recordingErrorByIndex, setRecordingErrorByIndex] = useState<Record<number, string>>({});
  const [noteDraft, setNoteDraft] = useState<Record<number, string>>({});

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const { data: interview, isLoading } = useQuery<any>({
    queryKey: ['interview-detail', interviewId],
    queryFn: async () => (await api.get(`/hiring/interviews/detail/${interviewId}`)).data,
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['interview-detail', interviewId] });

  const candidateId = interview?.candidateId?._id;
  const { data: candidateHistory } = useQuery<any[]>({
    queryKey: ['candidate-interview-history', candidateId],
    queryFn: async () => (await api.get(`/hiring/interviews/${candidateId}`)).data,
    enabled: Boolean(candidateId),
  });
  const previousRounds = (candidateHistory || [])
    .filter((iv) => iv._id !== interviewId)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const isTelephonic = interview?.roundType === 'Telephonic';
  const sessionLive = interview?.status === 'In_Progress';
  const sessionEnded = interview?.status === 'Completed';

  useEffect(() => {
    if (isTelephonic || !interview || sessionEnded) return;
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: { width: { ideal: 854 }, height: { ideal: 480 } }, audio: true })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream;
      })
      .catch(() => setCameraError('Camera/microphone permission was denied or no device is available. Grant access to start recording.'));

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [isTelephonic, Boolean(interview), sessionEnded]);

  const startSession = useMutation({
    mutationFn: async () => (await api.post(`/ai/hiring/interviews/${interviewId}/start`)).data,
    onSuccess: () => refresh(),
  });

  const uploadRecording = useMutation({
    mutationFn: async ({ index, blob, mimeType }: { index: number; blob: Blob; mimeType: string }) => {
      const formData = new FormData();
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      formData.append('recording', blob, `answer-${index}.${ext}`);
      return (await api.post(`/ai/hiring/interviews/${interviewId}/questions/${index}/recording`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })).data;
    },
    onSuccess: (_data, { index }) => {
      setRecordingStateByIndex((prev) => ({ ...prev, [index]: 'analyzed' }));
      refresh();
    },
    onError: (err: any, { index }) => {
      setRecordingStateByIndex((prev) => ({ ...prev, [index]: 'error' }));
      setRecordingErrorByIndex((prev) => ({ ...prev, [index]: err.response?.data?.message || 'Could not analyze this answer.' }));
    },
  });

  const saveNote = useMutation({
    mutationFn: async ({ index, note }: { index: number; note: string }) =>
      (await api.put(`/hiring/interviews/${interviewId}/questions/${index}/note`, { note })).data,
    onSuccess: () => refresh(),
  });

  const endSession = useMutation({
    mutationFn: async () => (await api.post(`/ai/hiring/interviews/${interviewId}/end`)).data,
    onSuccess: () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      refresh();
    },
  });

  const startRecording = (index: number) => {
    if (!streamRef.current) return;
    const mimeType = pickSupportedMimeType();
    chunksRef.current = [];
    const recorder = mimeType ? new MediaRecorder(streamRef.current, { mimeType }) : new MediaRecorder(streamRef.current);
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || 'video/webm' });
      setRecordingStateByIndex((prev) => ({ ...prev, [index]: 'uploading' }));
      uploadRecording.mutate({ index, blob, mimeType: recorder.mimeType || mimeType || 'video/webm' });
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecordingStateByIndex((prev) => ({ ...prev, [index]: 'recording' }));
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
  };

  if (isLoading) return <div className="p-6 text-sm text-zinc-500">Loading interview...</div>;
  if (!interview) return <div className="p-6 text-sm text-zinc-500">Interview not found.</div>;

  const candidate = interview.candidateId || {};
  const candidateName = candidate.firstName ? `${candidate.firstName} ${candidate.lastName || ''}`.trim() : 'Unknown candidate';
  const questions: Array<any> = interview.interviewQuestions || [];
  const overallAnalysis = interview.overallAnalysis;

  const activeQuestion = questions[currentIndex];
  const activeRecordingState = recordingStateByIndex[currentIndex] || 'idle';
  const showSplitLayout = questions.length > 0 && !sessionEnded && !isTelephonic;

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-12">
      <Link href={`/company/hiring/interviews/questions/${interviewId}`} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-600">
        <ArrowLeft size={13} /> Back to interview prep
      </Link>

      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-indigo-50/40 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-indigo-950/10 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar name={candidateName} src={candidate.profileImageUrl} />
            <div>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{candidateName}</p>
              <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1"><Briefcase size={11} /> {candidate.jobRole || '-'}</span>
                {candidate.email && <span className="inline-flex items-center gap-1"><Mail size={11} /> {candidate.email}</span>}
                {candidate.phone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {candidate.phone}</span>}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {candidate.status && <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">{candidate.status}</span>}
                {candidate.source && <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">Source: {candidate.source}</span>}
                {typeof candidate.rating === 'number' && candidate.rating > 0 && <StarRow rating={candidate.rating} />}
                {candidate.resumeUrl && (
                  <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline">
                    <FileText size={11} /> Resume
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200 shadow-sm dark:bg-zinc-900 dark:border-indigo-900/50">
              <Circle size={8} className={sessionLive ? 'fill-purple-500 text-purple-500 animate-pulse' : sessionEnded ? 'fill-emerald-500 text-emerald-500' : 'fill-blue-500 text-blue-500'} />
              {interview.roundType} Round — {interview.status === 'In_Progress' ? 'In Progress' : interview.status.replace('_', ' ')}
            </span>
            {!isTelephonic && questions.length > 0 && !sessionEnded && (
              <p className="text-[11px] text-zinc-400 mt-1.5">Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}</p>
            )}
          </div>
        </div>

        {!isTelephonic && questions.length > 0 && !sessionEnded && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        )}
      </div>

      <div className={showSplitLayout ? 'grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start' : 'space-y-4'}>
        <div className="space-y-4">
          {!sessionEnded && (
            <div className="flex gap-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-4">
              <Target size={15} className="text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-indigo-500 mb-1 font-semibold">This round's focus</p>
                <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{ROUND_FOCUS[interview.roundType] || 'General fit and skills assessment for this round.'}</p>
              </div>
            </div>
          )}

          {previousRounds.length > 0 && (
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2.5 flex items-center gap-1 font-semibold"><Award size={11} /> Earlier rounds for this candidate</p>
                <div className="space-y-2">
                  {previousRounds.map((iv: any) => (
                    <div key={iv._id} className="flex items-center justify-between gap-2 text-xs flex-wrap">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{iv.roundType}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_BADGE[iv.status] || 'bg-zinc-100 text-zinc-600'}`}>{String(iv.status).replace('_', ' ')}</span>
                      {typeof iv.rating === 'number' && iv.rating > 0 && <StarRow rating={iv.rating} />}
                      {iv.overallAnalysis?.recommendation && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${RECOMMENDATION_STYLE[iv.overallAnalysis.recommendation] || 'bg-zinc-100 text-zinc-600'}`}>
                          {String(iv.overallAnalysis.recommendation).replace('_', ' ')}
                        </span>
                      )}
                      <span className="ml-auto text-zinc-400 truncate max-w-[45%]">{iv.feedback || iv.overallAnalysis?.summary || ''}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {questions.length === 0 && (
            <Card className="border-dashed border-zinc-200 dark:border-zinc-700">
              <CardContent className="p-8 text-center text-sm text-zinc-500">
                No interview questions yet. Go back and generate questions before starting the session.
              </CardContent>
            </Card>
          )}

          {sessionEnded && overallAnalysis && (
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Overall Interview Summary</h2>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${RECOMMENDATION_STYLE[overallAnalysis.recommendation] || 'bg-zinc-100 text-zinc-700'}`}>
                    {String(overallAnalysis.recommendation || '').replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{overallAnalysis.summary}</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-emerald-600 mb-1.5">Strengths</p>
                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                      {(overallAnalysis.strengths || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-rose-600 mb-1.5">Concerns</p>
                    <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                      {(overallAnalysis.concerns || []).map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {questions.length > 0 && !sessionEnded && isTelephonic && (
            <div className="space-y-2.5">
              <p className="text-xs text-zinc-500">Telephonic round — no camera. Type what the candidate said per question, then end the session for an overall summary.</p>
              {questions.map((q: any, i: number) => (
                <Card key={i} className="border-zinc-200 shadow-sm dark:border-zinc-800">
                  <CardContent className="p-4 space-y-2.5">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{i + 1}. {q.question}</p>
                    <textarea
                      value={noteDraft[i] ?? q.transcript ?? ''}
                      onChange={(e) => setNoteDraft((prev) => ({ ...prev, [i]: e.target.value }))}
                      placeholder="Type the candidate's answer / your notes..."
                      className="w-full min-h-20 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <Button size="sm" variant="outline" disabled={saveNote.isPending} onClick={() => saveNote.mutate({ index: i, note: noteDraft[i] ?? q.transcript ?? '' })}>
                      Save Note
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={endSession.isPending} onClick={() => endSession.mutate()}>
                  {endSession.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <MessageSquareText size={14} className="mr-1.5" />}
                  End Interview
                </Button>
              </div>
            </div>
          )}

          {showSplitLayout && sessionLive && activeQuestion && (
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
              <CardContent className="p-5 space-y-3.5">
                <p className="text-[15px] font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">{currentIndex + 1}. {activeQuestion.question}</p>

                {activeRecordingState === 'idle' && !activeQuestion.answerAnalysis && (
                  <p className="text-xs text-zinc-400">Use the camera panel on the right to record this answer.</p>
                )}
                {activeRecordingState === 'uploading' && (
                  <p className="text-xs text-indigo-500 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Analyzing the recorded answer...</p>
                )}
                {activeRecordingState === 'error' && (
                  <p className="text-xs text-rose-600 flex items-center gap-1"><AlertTriangle size={12} /> {recordingErrorByIndex[currentIndex] || 'Could not analyze this answer.'} Retry from the camera panel.</p>
                )}

                {activeQuestion.answerAnalysis && (
                  <div className={`rounded-lg border p-3.5 space-y-1.5 ${VERDICT_STYLE[activeQuestion.answerAnalysis.verdict] || 'bg-zinc-50 border-zinc-200'}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide">{activeQuestion.answerAnalysis.verdict?.replace('_', ' ')}</p>
                    <p className="text-xs leading-relaxed">{activeQuestion.answerAnalysis.reasoning}</p>
                    {activeQuestion.answerAnalysis.followUpSuggestion && (
                      <div className="mt-2 rounded bg-white/70 dark:bg-zinc-900/40 p-2.5 border border-dashed border-current">
                        <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1"><Sparkles size={11} /> Suggested follow-up (not added to the list)</p>
                        <p className="text-xs mt-0.5">{activeQuestion.answerAnalysis.followUpSuggestion}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between pt-1">
                  {currentIndex < questions.length - 1 ? (
                    <Button
                      variant="outline"
                      disabled={!activeQuestion.answerAnalysis}
                      onClick={() => setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))}
                    >
                      Next Question <ChevronRight size={14} className="ml-1.5" />
                    </Button>
                  ) : <div />}
                  <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={endSession.isPending} onClick={() => endSession.mutate()}>
                    {endSession.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <MessageSquareText size={14} className="mr-1.5" />}
                    End Interview
                  </Button>
                </div>
                {endSession.isError && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-600"><AlertTriangle size={13} /> {(endSession.error as any)?.response?.data?.message || 'Could not generate the overall summary.'}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {showSplitLayout && (
          <div className="lg:sticky lg:top-4 space-y-3">
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 overflow-hidden">
              <div className="relative bg-zinc-950 aspect-[4/3]">
                <video ref={videoPreviewRef} muted autoPlay playsInline className="w-full h-full object-cover" />
                {sessionLive && (
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Circle size={7} className={activeRecordingState === 'recording' ? 'fill-rose-500 text-rose-500 animate-pulse' : 'fill-emerald-400 text-emerald-400'} />
                    {activeRecordingState === 'recording' ? 'Recording' : 'Live'}
                  </span>
                )}
              </div>
              <CardContent className="p-4 space-y-2.5">
                {cameraError && (
                  <div className="flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                    <AlertTriangle size={13} className="shrink-0" /> {cameraError}
                  </div>
                )}

                {!sessionLive ? (
                  <Button className="bg-indigo-600 hover:bg-indigo-700 w-full" disabled={startSession.isPending || !streamRef.current} onClick={() => startSession.mutate()}>
                    {startSession.isPending ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Video size={14} className="mr-1.5" />}
                    Start Interview
                  </Button>
                ) : (
                  <>
                    {(activeRecordingState === 'idle' || !activeRecordingState) && !activeQuestion?.answerAnalysis && (
                      <Button className="bg-rose-600 hover:bg-rose-700 w-full" onClick={() => startRecording(currentIndex)}>
                        <Camera size={14} className="mr-1.5" /> Start Recording
                      </Button>
                    )}
                    {activeRecordingState === 'recording' && (
                      <Button variant="outline" className="w-full border-rose-300 text-rose-600" onClick={stopRecording}>
                        <Square size={14} className="mr-1.5 fill-rose-600" /> Stop Recording
                      </Button>
                    )}
                    {activeRecordingState === 'uploading' && (
                      <Button disabled className="w-full bg-zinc-200 text-zinc-500">
                        <Loader2 size={14} className="mr-1.5 animate-spin" /> Analyzing...
                      </Button>
                    )}
                    {activeRecordingState === 'error' && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-rose-600 text-center">{recordingErrorByIndex[currentIndex] || 'Could not analyze this answer.'}</p>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => startRecording(currentIndex)}>Retry recording</Button>
                      </div>
                    )}
                    {activeQuestion?.answerAnalysis && activeRecordingState !== 'recording' && (
                      <p className="text-[11px] text-center text-emerald-600 flex items-center justify-center gap-1"><CheckCircle2 size={12} /> Answer analyzed</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
