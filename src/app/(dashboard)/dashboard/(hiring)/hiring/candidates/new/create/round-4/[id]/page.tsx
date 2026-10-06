'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Link2, ArrowRight, ArrowLeft, Flag, CheckCircle2, Lightbulb, Save, Send, ClipboardCheck, Wifi, AlertTriangle, XCircle, Circle, Trophy, ClipboardList, } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

import questionTemplatesData from '../../assessment/questions.json';
const pipelineSteps = ['Upload CV', 'Review & Edit', 'Submit Application', 'AI Screening', 'HOD Review', 'Interview', 'Offer', 'Onboarding'];
const currentStepIndex = 5;

const tabs = ['Written Assessment', 'Instructions', 'Questions', 'Submit Test', 'Result'] as const;
type TabName = typeof tabs[number];

const applicationSummary = [
  { label: 'Application ID', value: 'APP-2026-000124' },
  { label: 'Applied On', value: '15 June 2026, 11:32 AM' },
  { label: 'Current Stage', value: 'Interview – Round 4' },
  { label: 'AI Screening Score', value: '87%' },
];

const assessmentOverview = [
  { label: 'Assessment Type', value: 'Role Based Written Test' },
  { label: 'Total Questions', value: '40' },
  { label: 'Total Marks', value: '100' },
  { label: 'Duration', value: '60 Minutes' },
  { label: 'Passing Marks', value: '60%' },
  { label: 'Negative Marking', value: 'No' },
];

const assistantChecklist = ['Concept understanding', 'Role fitment', 'Clarity of thinking', 'Decision making', 'Problem solving ability', 'Communication in writing'];

const testTips = [
  'Read each question carefully.',
  'Manage your time effectively.',
  'Choose the best and most practical answer.',
  'Review marked questions before submitting.',
];

const instructions = [
  { icon: ClipboardCheck, text: 'The test contains 40 multiple choice questions.' },
  { icon: ClipboardCheck, text: 'Each question carries equal marks.' },
  { icon: Flag, text: 'You can mark questions for review and revisit later.' },
  { icon: Wifi, text: 'Ensure stable internet connection during the test.' },
  { icon: AlertTriangle, text: 'Plagiarism or malpractice will lead to disqualification.' },
];

type QuestionOption = { key: string; text: string };
type Question = {
  id: number;
  category: string;
  scenario: string;
  prompt: string;
  subPrompt?: string;
  options: QuestionOption[];
  correctAnswer: string;
};

// Cast the imported JSON to the expected shape.
const QUESTION_TEMPLATES = questionTemplatesData as Omit<Question, 'id'>[];

function generateQuestions(): Question[] {
  const total = 40;
  return Array.from({ length: total }, (_, i) => {
    const template = QUESTION_TEMPLATES[i % QUESTION_TEMPLATES.length];
    return { id: i + 1, ...template };
  });
}

const questions = generateQuestions();

type QState = 'answered' | 'visited' | 'current' | 'not-visited' | 'marked';

function Card({
  title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 pb-2.5 pt-2">{children}</div>
    </div>
  );
}


function paletteClasses(state: QState) {
  return state === 'current'
    ? 'bg-indigo-600 text-white'
    : state === 'marked'
      ? 'bg-amber-500 text-white'
      : state === 'answered'
        ? 'bg-emerald-500 text-white'
        : state === 'visited'
          ? 'border border-blue-300 bg-blue-50 text-blue-600'
          : 'border border-zinc-200 bg-white text-zinc-500';
}

export default function AssessmentRoundPage() {
  const [candidate, setCandidate] = React.useState<any>(null);

  const params = useParams() as { id: string };
  const candidateId = params?.id;
  const router = useRouter();

  React.useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          let cId = candidateId;
          if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
            const res = await api.get(`/hiring/candidates?limit=1000`);
            const candidates = res.data?.data || res.data || [];
            const match = candidates.find((c: any) => {
              const nameSlug = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return nameSlug === candidateId;
            });
            if (match) cId = match._id;
            else throw new Error("Candidate not found");
          }

          const res = await api.get(`/hiring/candidates/${cId}`);
          const data = res.data;
          const appDetails = data.applicationDetails || {};

          setCandidate({
            _id: data._id,
            fullName: data.firstName + (data.lastName ? ' ' + data.lastName : ''),
            email: data.email || '',
            mobile: data.phone || '',
            currentLocation: appDetails.currentLocation || '',
            linkedin: appDetails.linkedin || '',
            appliedFor: data.jobRole || '',
            department: data.departmentId?.name || data.departmentId || '',
            employmentType: appDetails.employmentType || 'Full Time',
            totalExperience: appDetails.totalExperience || '',
            expectedCTC: appDetails.expectedCTC || '',
            noticePeriod: appDetails.noticePeriod || '',
            resumeUrl: data.resumeUrl
          });
        } catch (err) {
          console.error(err);
          toast.error('Failed to load candidate details');
        }
      };
      fetchCandidate();
    }
  }, [candidateId]);

  // Seed with the same starting scenario as the original mock:
  // question 1 & 2 already answered, question 3 is current.
  const [activeTab, setActiveTab] = useState<TabName>('Instructions');
  const [currentQuestion, setCurrentQuestion] = useState<number>(3);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({ 1: 'B', 2: 'C', 3: 'C' });
  const [visited, setVisited] = useState<Set<number>>(new Set([1, 2, 3]));
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const totalSeconds = 3600;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  React.useEffect(() => {
    let timer: any;
    if (hasStarted && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSubmitted) {
      setIsSubmitted(true);
      setActiveTab('Result');
    }
    return () => clearInterval(timer);
  }, [hasStarted, timeLeft, isSubmitted]);

  const totalQuestions = questions.length;
  const attempted = Object.keys(selectedAnswers).length;
  const remaining = totalQuestions - attempted;
  const markedCount = marked.size;
  const progressPct = Math.round((attempted / totalQuestions) * 100);

  const activeQuestion = useMemo(
    () => questions.find((q) => q.id === currentQuestion)!,
    [currentQuestion],);

  const goToQuestion = (n: number) => {
    if (n < 1 || n > totalQuestions) return;
    setCurrentQuestion(n);
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(n);
      return next;
    });
    setActiveTab('Written Assessment');
  };

  const handlePrevious = () => goToQuestion(currentQuestion - 1);
  const handleNext = () => goToQuestion(currentQuestion + 1);

  const handleSelectOption = (questionId: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  };

  const toggleMarkForReview = (questionId: number = currentQuestion) => {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const getQuestionState = (n: number): QState => {
    if (n === currentQuestion && activeTab === 'Written Assessment') return 'current';
    if (marked.has(n)) return 'marked';
    if (selectedAnswers[n]) return 'answered';
    if (visited.has(n)) return 'visited';
    return 'not-visited';
  };

  const isMarkedCurrent = marked.has(currentQuestion);

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    setActiveTab('Result');
  };

  // Result calculations
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length;
  const incorrectCount = attempted - correctCount;
  const unattemptedCount = totalQuestions - attempted;
  const scorePct = Math.round((correctCount / totalQuestions) * 100);
  const marksObtained = correctCount * (100 / totalQuestions);
  const isPass = scorePct >= 60;

  const timeProgressPct = Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100));
  const mm = Math.floor(timeLeft / 60);
  const ss = timeLeft % 60;
  const totalMm = Math.floor(totalSeconds / 60);

  if (!candidate) return <div className="p-8 text-center text-zinc-500 font-medium">Loading candidate details...</div>;

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Interview – Round 4</h1>
          <p className="mt-0.5 text-[10.5px] text-zinc-500">Written Assessment – AI Powered</p>
        </div>

        <div className="flex items-center gap-1.5">
          {pipelineSteps.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="h-px w-5 bg-zinc-200" />}
              <div className="flex flex-col items-center gap-1">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i === currentStepIndex ? 'bg-indigo-600 text-white' : 'border border-zinc-200 bg-white text-zinc-400'}`}>
                  {i + 1}
                </span>
                <span className={`whitespace-nowrap text-[8.5px] font-semibold ${i === currentStepIndex ? 'text-zinc-800' : 'text-zinc-400'}`}>{s}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/hiring/candidates" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
            <ArrowLeft size={13} /> Back to Applications
          </Link>
          <button type="button" onClick={() => {
            let completedRounds = JSON.parse(localStorage.getItem('ai_completed_rounds') || '[]');
            if (!completedRounds.includes(4)) completedRounds.push(4);
            localStorage.setItem('ai_completed_rounds', JSON.stringify(completedRounds));
            toast.success('Interview Completed!');
            try {
              const storedMap = JSON.parse(localStorage.getItem('ai_completed_rounds_map') || '{}');
              storedMap[candidateId] = Math.max(storedMap[candidateId] || 0, 4);
              localStorage.setItem('ai_completed_rounds_map', JSON.stringify(storedMap));
            } catch (e) {}
            router.push(`/dashboard/hiring/candidates/new/create/round-5/${candidateId}`);
          }} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
            End & Next Round
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7fr_3fr]">
        <div className="space-y-2">
          {/* Candidate banner */}
          <Card>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[auto_1fr_1fr_1fr]">
              <div className="flex items-start gap-3">
                <span className="h-16 w-16 shrink-0 rounded-full bg-zinc-200" />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-bold text-zinc-900">
                    {candidate.fullName}
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Round 4 In Progress</span>
                  </p>
                  <p className="text-[10.5px] text-zinc-500">{candidate.appliedFor}</p>
                  <div className="mt-1 space-y-0.5 text-[10px] text-zinc-500">
                    <p className="flex items-center gap-1"><Phone size={11} className="text-zinc-400" /> {candidate.mobile} <Mail size={11} className="ml-2 text-zinc-400" /> {candidate.email}</p>
                    <p className="flex items-center gap-1"><MapPin size={11} className="text-zinc-400" /> {candidate.currentLocation}</p>
                    <p className="flex items-center gap-1"><Link2 size={11} className="text-zinc-400" /> {candidate.linkedin}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div><p className="text-zinc-400">Applied For</p><p className="font-bold text-zinc-800">{candidate.appliedFor}</p></div>
                <div><p className="text-zinc-400">Department</p><p className="font-bold text-zinc-800">{candidate.department}</p></div>
                <div><p className="text-zinc-400">Experience</p><p className="font-bold text-zinc-800">{candidate.totalExperience} Years</p></div>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div><p className="text-zinc-400">Current Round</p><p className="font-bold text-zinc-800">Round 4 – Written Assessment</p></div>
              </div>

              <div className="space-y-1.5 text-[10.5px]">
                <div><p className="text-zinc-400">Assessment Type</p><p className="font-bold text-zinc-800">Role Based Written Test</p></div>
                <div><p className="text-zinc-400">Duration</p><p className="font-bold text-zinc-800">60 Minutes</p></div>
                <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                  View Candidate Profile <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-3 py-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => (!hasStarted && t !== 'Instructions' ? toast.error('Please start the assessment first.') : setActiveTab(t))}
                className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold ${t === activeTab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'} ${!hasStarted && t !== 'Instructions' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ===================== TAB: WRITTEN ASSESSMENT ===================== */}
          {activeTab === 'Written Assessment' && (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_2.4fr]">
              <Card title="Written Assessment in Progress">
                <p className="text-[10px] leading-snug text-zinc-500">This is a role-based written assessment with AI-generated questions.</p>
                <div
                  className="relative mx-auto my-3 grid h-[114px] w-[114px] place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#4f46e5 ${timeProgressPct}%, #e5e7eb 0)`,
                  }}
                >
                  <div className="flex h-[94px] w-[94px] flex-col items-center justify-center rounded-full bg-white text-center">
                    <p className="text-[10px] leading-tight text-zinc-500">
                      Time Remaining
                    </p>

                    <p className="text-[18px] font-bold leading-tight text-zinc-900">
                      {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
                    </p>

                    <p className="text-[9px] leading-tight text-zinc-500">
                      of {String(totalMm).padStart(2, '0')}:00
                    </p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-zinc-100 pt-2 text-[10.5px]">
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-semibold text-zinc-800">{totalQuestions}</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Attempted</span><span className="font-semibold text-zinc-800">{attempted}</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-semibold text-zinc-800">{remaining}</span></div>
                </div>

                <div className="mt-2 rounded-lg bg-indigo-50/60 px-2 py-1.5 text-[9.5px] leading-snug text-indigo-700/80">
                  Auto-submit when time ends. Do not refresh or close the browser.
                </div>
              </Card>

              <div className="space-y-2">
                <Card
                  title={<>Question {activeQuestion.id} of {totalQuestions} <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9.5px] font-semibold text-indigo-600">{activeQuestion.category}</span></>}
                  action={(
                    <button
                      type="button"
                      onClick={() => toggleMarkForReview()}
                      className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold ${isMarkedCurrent
                        ? 'border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100'
                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                    >
                      <Flag size={11} /> {isMarkedCurrent ? 'Marked for Review' : 'Mark for Review'}
                    </button>
                  )}
                >
                  <p className="text-[11.5px] font-semibold leading-snug text-zinc-800">
                    {activeQuestion.scenario}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-700">{activeQuestion.prompt}</p>
                  {activeQuestion.subPrompt && (
                    <p className="text-[11px] text-zinc-700">{activeQuestion.subPrompt}</p>
                  )}

                  <div className="mt-2.5 space-y-1.5">
                    {activeQuestion.options.map((o) => {
                      const isSelected = selectedAnswers[activeQuestion.id] === o.key;
                      return (
                        <label
                          key={o.key}
                          className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-2.5 py-2 text-[10.5px] ${isSelected ? 'border-indigo-300 bg-indigo-50/50' : 'border-zinc-200 hover:bg-zinc-50'}`}
                        >
                          <input
                            type="radio"
                            name={`q${activeQuestion.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectOption(activeQuestion.id, o.key)}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-indigo-600"
                          />
                          <span className="text-zinc-700"><b>{o.key}.</b> {o.text}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 1}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft size={12} /> Previous Question
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentQuestion === totalQuestions}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Question <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Card title="AI Assessment Assistant" action={<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">BETA</span>}>
                    <p className="mb-1.5 text-[10px] leading-snug text-zinc-500">Our AI analyzes your responses in real-time to evaluate:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {assistantChecklist.map((c) => (
                        <p key={c} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                          <CheckCircle2 size={12} className="shrink-0 text-emerald-500" /> {c}
                        </p>
                      ))}
                    </div>
                  </Card>

                  <Card title={<span className="flex items-center gap-1.5"><Lightbulb size={13} className="text-amber-500" /> Test Tips</span>}>
                    <ul className="space-y-1 text-[10.5px] text-zinc-600 pl-3">
                      {testTips.map((t) => <li key={t} className="list-disc ">{t}</li>)}
                    </ul>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                    <Save size={13} /> Save &amp; Exit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Submit Test')}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Submit Test <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB: INSTRUCTIONS ===================== */}
          {activeTab === 'Instructions' && (
            <Card title="Test Instructions">
              <p className="text-[10.5px] leading-snug text-zinc-500">Please read all the instructions carefully before you begin or resume the written assessment.</p>
              <div className="mt-3 space-y-2.5">
                {instructions.map((it) => (
                  <p key={it.text} className="flex items-start gap-2 text-[11px] leading-snug text-zinc-700">
                    <it.icon size={15} className="mt-0.5 shrink-0 text-indigo-500" /> {it.text}
                  </p>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-indigo-50/60 px-3 py-2 text-[10px] leading-snug text-indigo-700/80">
                Once you begin, the timer cannot be paused. Make sure you are in a quiet, distraction-free environment.
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => { setHasStarted(true); setActiveTab('Written Assessment'); }}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  {hasStarted ? 'Resume Assessment' : 'Start Assessment'} <ArrowRight size={13} />
                </button>
              </div>
            </Card>
          )}

          {/* ===================== TAB: QUESTIONS (all 40 at once) ===================== */}
          {activeTab === 'Questions' && (
            <div className="space-y-2">
              <Card title={`All Questions (${attempted} of ${totalQuestions} attempted)`}>
                <p className="text-[10.5px] text-zinc-500">Answer any question directly below — your progress syncs with the Written Assessment tab.</p>
              </Card>

              {questions.map((q) => {
                const isMarkedQ = marked.has(q.id);
                return (
                  <Card
                    key={q.id}
                    title={<>Question {q.id} of {totalQuestions} <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9.5px] font-semibold text-indigo-600">{q.category}</span></>}
                    action={(
                      <button
                        type="button"
                        onClick={() => toggleMarkForReview(q.id)}
                        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-semibold ${isMarkedQ
                          ? 'border-amber-300 bg-amber-50 text-amber-600 hover:bg-amber-100'
                          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                      >
                        <Flag size={11} /> {isMarkedQ ? 'Marked' : 'Mark for Review'}
                      </button>
                    )}
                  >
                    <p className="text-[11.5px] font-semibold leading-snug text-zinc-800">{q.scenario}</p>
                    <p className="mt-1 text-[11px] text-zinc-700">{q.prompt}</p>
                    {q.subPrompt && <p className="text-[11px] text-zinc-700">{q.subPrompt}</p>}

                    <div className="mt-2.5 space-y-1.5">
                      {q.options.map((o) => {
                        const isSelected = selectedAnswers[q.id] === o.key;
                        return (
                          <label
                            key={o.key}
                            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-2.5 py-2 text-[10.5px] ${isSelected ? 'border-indigo-300 bg-indigo-50/50' : 'border-zinc-200 hover:bg-zinc-50'}`}
                          >
                            <input
                              type="radio"
                              name={`all-q${q.id}`}
                              checked={isSelected}
                              onChange={() => handleSelectOption(q.id, o.key)}
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-indigo-600"
                            />
                            <span className="text-zinc-700"><b>{o.key}.</b> {o.text}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('Submit Test')}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Submit Test <Send size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB: SUBMIT TEST ===================== */}
          {activeTab === 'Submit Test' && (
            <div className="space-y-2">
              <Card title="Review Before Submitting">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-lg bg-emerald-50 px-2.5 py-2 text-center">
                    <p className="text-[16px] font-bold text-emerald-600">{attempted}</p>
                    <p className="text-[9.5px] text-emerald-700/80">Answered</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 px-2.5 py-2 text-center">
                    <p className="text-[16px] font-bold text-zinc-600">{remaining}</p>
                    <p className="text-[9.5px] text-zinc-500">Unanswered</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 px-2.5 py-2 text-center">
                    <p className="text-[16px] font-bold text-amber-600">{markedCount}</p>
                    <p className="text-[9.5px] text-amber-700/80">Marked for Review</p>
                  </div>
                  <div className="rounded-lg bg-indigo-50 px-2.5 py-2 text-center">
                    <p className="text-[16px] font-bold text-indigo-600">{totalQuestions}</p>
                    <p className="text-[9.5px] text-indigo-700/80">Total Questions</p>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[10.5px] font-semibold text-emerald-600">
                    <CheckCircle2 size={14} /> Your test has already been submitted. You can view it under the Result tab.
                  </div>
                )}

                {!isSubmitted && remaining > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[10.5px] leading-snug text-amber-700">
                    <AlertTriangle size={14} className="shrink-0" /> You still have {remaining} unanswered question{remaining > 1 ? 's' : ''}. You can submit anyway — unanswered questions will be marked incorrect.
                  </div>
                )}
              </Card>

              <Card title="Question Status">
                <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
                  {questions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => goToQuestion(q.id)}
                      className={`grid h-7 w-full place-items-center rounded text-[10px] font-semibold ${paletteClasses(getQuestionState(q.id))}`}
                    >
                      {q.id}
                    </button>
                  ))}
                </div>
              </Card>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('Written Assessment')}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
                >
                  <ArrowLeft size={13} /> Back to Test
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  disabled={isSubmitted}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm &amp; Submit Test <Send size={13} />
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB: RESULT ===================== */}
          {activeTab === 'Result' && (
            isSubmitted ? (
              <div className="space-y-2">
                <Card>
                  <div className="flex flex-col items-center gap-2 py-3 text-center">
                    <span className={`grid h-14 w-14 place-items-center rounded-full ${isPass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Trophy size={26} />
                    </span>
                    <p className="text-[15px] font-bold text-zinc-900">{isPass ? 'Congratulations! You Passed' : 'You Did Not Clear the Test'}</p>
                    <p className="text-[11px] text-zinc-500">Written Assessment · Interview – Round 4</p>
                    <span className={`mt-1 rounded-full px-3 py-1 text-[11px] font-bold ${isPass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {scorePct}% Score
                    </span>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Card>
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
                      <div>
                        <p className="text-[14px] font-bold text-zinc-900">{correctCount}</p>
                        <p className="text-[9.5px] text-zinc-500">Correct</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-600"><XCircle size={16} /></span>
                      <div>
                        <p className="text-[14px] font-bold text-zinc-900">{incorrectCount}</p>
                        <p className="text-[9.5px] text-zinc-500">Incorrect</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500"><Circle size={16} /></span>
                      <div>
                        <p className="text-[14px] font-bold text-zinc-900">{unattemptedCount}</p>
                        <p className="text-[9.5px] text-zinc-500">Unattempted</p>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600"><ClipboardList size={16} /></span>
                      <div>
                        <p className="text-[14px] font-bold text-zinc-900">{marksObtained.toFixed(1)}/100</p>
                        <p className="text-[9.5px] text-zinc-500">Marks Obtained</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card title="Score Breakdown">
                  <div className="space-y-1.5 text-[10.5px]">
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Total Marks</span><span className="font-semibold text-zinc-800">100</span></div>
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Passing Marks</span><span className="font-semibold text-zinc-800">60%</span></div>
                    <div className="flex items-center justify-between"><span className="text-zinc-500">Marks Obtained</span><span className="font-semibold text-zinc-800">{marksObtained.toFixed(1)}</span></div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Result</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${isPass ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPass ? 'Pass' : 'Fail'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card title="Test Result">
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100 text-zinc-400"><ClipboardList size={22} /></span>
                  <p className="text-[12px] font-semibold text-zinc-700">You haven&apos;t submitted the test yet.</p>
                  <p className="text-[10.5px] text-zinc-500">Complete and submit the written assessment to view your result here.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('Submit Test')}
                    className="mt-1 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Go to Submit Test <ArrowRight size={13} />
                  </button>
                </div>
              </Card>
            )
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-2">
          <Card title="Application Summary">
            <div className="space-y-1.5">
              {applicationSummary.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="text-right font-semibold text-zinc-800">{s.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-2 text-[10.5px]">
                <span className="text-zinc-500">HOD Review</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-600">Recommended</span>
              </div>
            </div>
          </Card>

          <Card title="Assessment Overview">
            <div className="space-y-1.5">
              {assessmentOverview.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="text-right font-semibold text-zinc-800">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Question Palette">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-zinc-500">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-zinc-300 bg-white" /> Not Visited</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-blue-300 bg-blue-50" /> Visited</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Answered</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Marked for Review</span>
            </div>
            <div className="mt-2 grid grid-cols-10 gap-1">
              {questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goToQuestion(q.id)}
                  className={`grid h-6 w-6 place-items-center rounded text-[9.5px] font-semibold transition-colors ${paletteClasses(getQuestionState(q.id))}`}
                >
                  {q.id}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Instructions">
            <div className="space-y-1.5">
              {instructions.map((it) => (
                <p key={it.text} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-zinc-600">
                  <it.icon size={13} className="mt-0.5 shrink-0 text-indigo-500" /> {it.text}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
