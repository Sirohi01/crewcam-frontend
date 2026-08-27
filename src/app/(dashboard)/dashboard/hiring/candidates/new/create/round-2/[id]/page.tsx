'use client';

import React from 'react';
import {
  ArrowLeft, Square, Phone, Mail, MapPin, Link2, ExternalLink,
  CheckCircle2, Clock, Check, Info, FileText, Share2, HelpCircle,
  FileQuestion, Bold, Italic, Underline, List, ListOrdered, Code,
  ThumbsUp, Flag, StopCircle, User, Sparkles, X, Loader2, AlertTriangle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const DUMMY_QUESTIONS = [
  { category: 'Time Management', text: 'How do you prioritize multiple tasks when working under tight deadlines?', insight: 'This evaluates your ability to manage stress and organize tasks efficiently.' },
  { category: 'Leadership & People Management', text: 'Describe a situation where you had to manage a low-performing team. What steps did you take to improve their performance and what was the outcome?', insight: 'This question evaluates your leadership style, ability to motivate teams, problem-solving skills, and focus on results.' },
  { category: 'Technical - Data Analysis', text: 'You are given a large sales dataset with millions of records. How would you design a reliable and efficient data pipeline to process, clean, and analyze this data for reporting insights?', insight: 'This question evaluates your understanding of data engineering concepts, ETL/ELT pipeline design, data processing tools, and scalability.' },
  { category: 'Conflict Resolution', text: 'Tell me about a time you had a disagreement with a stakeholder or peer. How did you resolve it?', insight: 'This tests your communication skills and ability to find win-win solutions.' },
  { category: 'Strategic Thinking', text: 'How do you align your team\'s goals with the broader objectives of the organization?', insight: 'This evaluates strategic thinking and ability to communicate company vision effectively.' },
  { category: 'Change Management', text: 'Describe a time when you had to lead your team through a significant organizational change.', insight: 'Assesses adaptability, leadership during uncertainty, and change management skills.' },
  { category: 'Performance Evaluation', text: 'How do you approach giving constructive feedback to a high-performing employee who has a negative attitude?', insight: 'Tests emotional intelligence and performance management capabilities.' },
  { category: 'Decision Making', text: 'Tell me about a time you had to make a difficult decision with incomplete information.', insight: 'Evaluates analytical skills, risk assessment, and decisiveness.' },
  { category: 'Technical - Security', text: 'What is your strategy for ensuring data security and compliance when deploying applications to a public cloud environment?', insight: 'Assesses knowledge of cloud security best practices, IAM, and compliance frameworks.' },
  { category: 'Innovation & Growth', text: 'How do you encourage innovation and continuous learning within your team?', insight: 'Assesses your commitment to team development and fostering a growth mindset.' }
];

export default function InterviewUI() {
  const user = useAuthStore(state => state.user);
  const [candidate, setCandidate] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>(() => Array(DUMMY_QUESTIONS.length).fill(''));
  const totalSeconds = 40 * 60;
  
  const [isAiConnected, setIsAiConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [activeQuestions, setActiveQuestions] = React.useState(DUMMY_QUESTIONS);

  const [activeTab, setActiveTab] = React.useState('Interview');
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [interviewId, setInterviewId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasStarted && !isCompleted) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [hasStarted, isCompleted]);

  const initInterview = async () => {
    const userId = user?._id || user?.id;
    if (!candidate || !userId) return;
    try {
      setIsConnecting(true);
      // Fetch candidate's interviews
      const { data: interviews } = await api.get(`/hiring/interviews/${candidate._id}`);
      let activeInterview = interviews.find((i: any) => i.roundType === 'Technical');

      if (!activeInterview) {
        const res = await api.post('/hiring/interviews', {
          candidateId: candidate._id,
          interviewerId: userId,
          roundType: 'Technical',
          scheduledDate: new Date().toISOString(),
        });
        activeInterview = res.data;
      }

      setInterviewId(activeInterview._id);

      if (activeInterview.interviewQuestions && activeInterview.interviewQuestions.length > 0) {
        const mappedQuestions = activeInterview.interviewQuestions.map((q: any) => ({
          ...q,
          category: 'Technical',
          text: q.question,
          insight: q.answerAnalysis?.reasoning || 'Evaluates candidate response.'
        }));
        setActiveQuestions(mappedQuestions);
        setAnswers(mappedQuestions.map((q: any) => q.transcript || ''));
      } else {
        const role = candidate.appliedFor || 'Full Stack Developer';
        const generatedQuestions = [
          { category: 'Technical Architecture', text: `Based on your experience as a ${role}, how would you design a scalable architecture to handle high-throughput real-time data?`, insight: `Evaluates your ability to apply past experience to complex new scenarios specific to ${role}.` },
          { category: 'Problem Solving', text: `Describe a challenging technical issue you faced while working as a ${role}. What steps did you take to debug and resolve it?`, insight: `Assesses analytical skills, debugging methodology, and resilience under pressure.` },
          { category: 'Best Practices & Security', text: `What are the core security and performance best practices you implement in your day-to-day work as a ${role}?`, insight: `Checks your adherence to industry standards, security-first mindset, and proactive quality assurance.` },
          { category: 'Cross-functional Collaboration', text: `How do you handle disagreements on technical approaches with other engineers or product managers when delivering ${role} features?`, insight: `Evaluates teamwork, communication skills, and ability to influence without authority.` },
          { category: 'Continuous Innovation', text: `What recent technological advancements in the field of ${role} are you most excited about, and how have you experimented with them?`, insight: `Checks continuous learning, passion for the domain, and proactive upskilling.` }
        ];

        const dbQuestions = generatedQuestions.map(q => ({
          question: q.text,
          answerAnalysis: { verdict: 'no_answer', reasoning: q.insight }
        }));

        await api.put(`/hiring/interviews/${activeInterview._id}/questions`, { questions: dbQuestions });

        setActiveQuestions(generatedQuestions);
        setAnswers(Array(generatedQuestions.length).fill(''));
      }

      if (activeInterview.status === 'Completed') {
        setIsCompleted(true);
        setActiveTab('AI Questions');
        setIsAiConnected(false);
        setIsConnecting(false);
        setHasStarted(true);
      } else {
        setIsOffline(false);
        setIsAiConnected(true);
        setIsConnecting(false);
        setHasStarted(true);
        toast.success('Interview Session Started!');
      }
    } catch (error) {
      setIsOffline(true);
      setIsAiConnected(true);
      setIsConnecting(false);
      setHasStarted(true);
      setActiveQuestions(DUMMY_QUESTIONS);
      setAnswers(Array(DUMMY_QUESTIONS.length).fill(''));
      toast.success('Interview Session Started (Offline Mode)');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndExam = async () => {
    try {
      if (interviewId) {
        await api.put(`/hiring/interviews/${interviewId}/feedback`, { status: 'Completed', rating: 0, feedback: 'Completed via AI Round 2' });
      }
      setIsCompleted(true);
      setActiveTab('AI Questions');
      setIsAiConnected(false);
      setHasStarted(false);
      toast.success('Interview Completed!');
      window.open(`/dashboard/hiring/candidates/new/create/round-3/${candidateId}`, '_blank');
    } catch (e) {
      toast.error('Failed to end interview');
    }
  };

  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleSaveAnswer = async () => {
    if (!interviewId) return;
    const currentAns = answers[currentQuestionIndex];
    if (!currentAns) return;

    try {
      setIsSaving(true);
      const dbQuestions = activeQuestions.map((q: any, idx: number) => ({
        question: q.text,
        transcript: answers[idx] || '',
        answerAnalysis: {
          verdict: idx === currentQuestionIndex ? (currentAns.length > 50 ? 'adequate' : 'weak') : (q.answerAnalysis?.verdict || 'no_answer'),
          reasoning: q.insight
        }
      }));

      await api.put(`/hiring/interviews/${interviewId}/questions`, { questions: dbQuestions });
      toast.success('Answer auto-saved');
    } catch (error) {
      toast.error('Failed to save answer');
    } finally {
      setIsSaving(false);
    }
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a.trim().length > 0).length;

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

  if (!candidate) return <div className="p-8 text-center text-zinc-500 font-medium">Loading candidate details...</div>;
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">


      {/* Header & Steps */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4  pb-2">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Interview – Round 2</h1>
          <p className="text-[11px] text-zinc-500 mt-0.5">Technical Interview – AI Powered</p>
        </div>

        {/* Steps */}
        <div className="flex-1 max-w-[550px] xl:max-w-[600px] w-full flex items-center justify-center relative mx-auto">
          <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
          <div className="flex w-full justify-between z-10">
            {[
              { num: 1, label: 'Upload CV', status: 'completed' },
              { num: 2, label: 'Review & Edit', status: 'completed' },
              { num: 3, label: 'Submit Application', status: 'completed' },
              { num: 4, label: 'AI Screening', status: 'completed' },
              { num: 5, label: 'HOD Review', status: 'completed' },
              { num: 6, label: 'Interview', status: 'active' },
              { num: 7, label: 'Offer', status: 'pending' },
              { num: 8, label: 'Onboarding', status: 'pending' },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1 bg-slate-50 lg:bg-transparent">
                <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                    step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                      'border-zinc-200 text-zinc-400 bg-white'}`}>
                  {step.status === 'completed' ? <Check className="w-3 h-3" strokeWidth={3} /> : step.num}
                </div>
                <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-[280px] xl:w-[340px]">
          <button onClick={() => router.push(`/dashboard/hiring/candidates/new/create/interview-process/${candidateId}`)} className="flex items-center justify-center h-8 px-3 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Process
          </button>
          {!isCompleted && hasStarted && (
            <button onClick={handleEndExam} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              End Exam & Next Round <StopCircle className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
      <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="xl:col-span-2 p-4 bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-5 w-full">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Candidate" className="h-20 w-20 rounded-lg object-cover border border-zinc-200 shadow-sm shrink-0" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {/* Col 1 */}
              <div className="flex flex-col gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold text-zinc-900">{candidate.fullName}</h2>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Round 2 In Progress</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium">{candidate.appliedFor}</p>
                </div>
                <div className="flex flex-col gap-1.5 text-[10px] text-zinc-600 mt-1">
                  <span className="flex items-center gap-1.5"><Phone size={12} className="text-zinc-400" /> {candidate.mobile}</span>
                  <span className="flex items-center gap-1.5"><Mail size={12} className="text-zinc-400" /> {candidate.email}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-zinc-400" /> {candidate.currentLocation}</span>
                  <span className="flex items-center gap-1.5 hover:underline cursor-pointer" onClick={() => window.open(candidate.linkedin, '_blank')}><Link2 size={12} className="text-zinc-400" /> {candidate.linkedin}</span>
                </div>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col gap-3 border-l border-zinc-200 pl-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Applied For</p>
                  <p className="text-[11px] font-bold text-zinc-900">{candidate.appliedFor}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Department</p>
                  <p className="text-[11px] font-bold text-zinc-900">{candidate.department}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Experience</p>
                  <p className="text-[11px] font-bold text-zinc-900">{candidate.totalExperience} Years</p>
                </div>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col justify-between border-l border-zinc-200 pl-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium mb-0.5">Current Round</p>
                  <p className="text-[11px] font-bold text-zinc-900">Round 2 – Technical Interview</p>
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-zinc-500 font-medium mb-1">Interviewer</p>
                  <div className="flex items-center gap-2">
                    <img src="https://i.pravatar.cc/150?u=anjali" alt="Anjali" className="h-7 w-7 rounded-full object-cover border border-zinc-200" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-zinc-900">Anjali Mehta</span>
                      <span className="text-[9px] text-zinc-500">HR Manager</span>
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-fit text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                  View Candidate Profile →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Application Summary Card */}
        <div className="py-4 flex flex-col justify-center border border-zinc-100 shadow-sm p-4 rounded-lg bg-white">
          <h3 className="text-[13px] font-bold text-zinc-900 mb-4">Application Summary</h3>
          <div className="flex flex-col gap-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><FileText size={12} className="text-indigo-600" /> Application ID</span>
              <span className="font-bold text-zinc-900">APP-{candidateId?.slice(-6).toUpperCase() || '100124'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><Clock size={12} className="text-indigo-600" /> Applied On</span>
              <span className="font-bold text-zinc-900">15 Jun 2026, 11:32 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><HelpCircle size={12} className="text-indigo-600" /> Current Stage</span>
              <span className="font-bold text-zinc-900">Interview - Round 2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><Sparkles size={12} className="text-indigo-600" /> AI Screening Score</span>
              <span className="font-bold text-zinc-900">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1.5"><User size={12} className="text-indigo-600" /> HOD Review</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Recommended</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-200 px-2">
        {['Interview', 'AI Questions', 'Notes', 'Attachments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-[12px] font-bold border-b-2 transition-colors ${
              activeTab === tab
                ? 'text-indigo-700 border-indigo-700'
                : 'text-zinc-500 border-transparent hover:text-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Interview' && (
        <>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">

        {/* Left Column (Progress) */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-full">
          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-1">Round Progress</h3>
            <p className="text-[10px] text-zinc-500 font-medium mb-6">Round 2 of 5<br />Technical Interview</p>

            <div className="flex items-center justify-center mb-6 relative w-28 h-28 mx-auto">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" strokeWidth="8" className="text-zinc-100 stroke-current" />
                <circle cx="50" cy="50" r="46" fill="transparent" strokeWidth="8"
                  className="text-emerald-600 stroke-current transition-all duration-1000 ease-linear"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (timeElapsed / totalSeconds)}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-2 flex flex-col items-center justify-center bg-white shadow-[0_0_15px_rgba(0,0,0,0.03)] rounded-full z-10">
                <span className="text-[9px] text-zinc-500 font-medium mb-0.5">Time Elapsed</span>
                <span className="text-2xl font-bold text-emerald-600 leading-none mb-1">{formatTime(timeElapsed)}</span>
                <span className="text-[9px] text-zinc-400">of 40:00</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4 text-[11px]">
              <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-bold">{activeQuestions.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-500">Answered</span><span className="font-bold">{answeredCount}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-bold">{activeQuestions.length - answeredCount}</span></div>
            </div>

            <div className="mt-6 bg-indigo-50/50 rounded-lg p-3 border border-indigo-100">
              <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                All questions are AI-generated based on the role, your profile, and previous answers.
              </p>
            </div>
          </div>


        </div>

        {/* Center Column (Question Area) */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[15px] font-bold text-zinc-900">Question {currentQuestionIndex + 1} of {activeQuestions.length}</h2>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{currentQuestion.category}</span>
              </div>
              <button className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 bg-white border border-rose-200 px-2 py-1 rounded hover:bg-rose-50 transition-colors shadow-sm">
                <Flag size={12} /> Flag Question
              </button>
            </div>

            <p className="text-[13px] font-bold text-zinc-900 mb-4 leading-relaxed">
              {currentQuestion.text}
            </p>

            <div className="bg-[#f5f3ff] border border-indigo-100 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Sparkles size={14} className="text-indigo-600 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-indigo-900">AI Insight</span>
                <p className="text-[11px] text-indigo-700 mt-1 leading-relaxed">{currentQuestion.insight}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col border border-zinc-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
              <div className="flex items-center gap-2 border-b border-zinc-200 p-2 bg-zinc-50">
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Bold size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Italic size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Underline size={13} /></button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><List size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><ListOrdered size={13} /></button>
                <div className="w-px h-4 bg-zinc-300 mx-1" />
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Link2 size={13} /></button>
                <button className="p-1 hover:bg-zinc-200 rounded text-zinc-600"><Code size={13} /></button>
              </div>
              <textarea
                className="flex-1 w-full resize-none p-3 text-[12px] text-zinc-800 outline-none min-h-[150px]"
                placeholder="Type your answer here..."
                value={answers[currentQuestionIndex]}
                onBlur={handleSaveAnswer}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestionIndex] = e.target.value;
                  setAnswers(newAnswers);
                }}
              ></textarea>
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-500">Minimum 50 words</span>
                <span className="text-[10px] text-zinc-500 font-medium">{answers[currentQuestionIndex].split(/\s+/).filter(Boolean).length} / 2500</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-600 mt-3 mb-4">
              <CheckCircle2 size={13} />
              <span className="text-[10px] font-medium">
                {isSaving ? 'Saving...' : 'Your answer is auto-saved'}
              </span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 bg-white border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 shadow-sm transition-colors disabled:opacity-50">
                <ArrowLeft size={13} /> Previous Question
              </button>
              <button 
                onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === activeQuestions.length - 1}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-indigo-700 px-6 py-2 rounded-lg hover:bg-indigo-800 shadow-sm transition-colors disabled:opacity-50">
                Next Question <ArrowLeft size={13} className="rotate-180" />
              </button>
            </div>
          </div>


        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <div className="bg-[#f8f7ff] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-600" />
              <h3 className="text-[12px] font-bold text-indigo-900">AI Interview Assistant</h3>
              <span className="text-[8px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">BETA</span>
            </div>
            {!hasStarted && !isCompleted && (
              <div className="mb-4">
                <button 
                  onClick={initInterview}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2 rounded-lg shadow-sm transition-colors disabled:opacity-70"
                >
                  {isConnecting ? <><Loader2 size={13} className="animate-spin" /> Connecting...</> : 'Start Test'}
                </button>
              </div>
            )}
            {isAiConnected && isOffline && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-medium p-2 rounded-lg flex items-center gap-1.5">
                <AlertTriangle size={12} className="shrink-0" />
                <span>Operating in Offline Mode. Using fallback questions.</span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {[
                "Questions are generated in real-time based on your role & experience.",
                "Answers are analyzed for technical accuracy, depth & clarity.",
                "Use diagrams or code snippets wherever applicable.",
                "Stay concise, structured and solution-focused."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 bg-indigo-100/50 rounded flex items-center justify-center shrink-0">
                    {i === 0 ? <HelpCircle size={10} className="text-indigo-600" /> :
                      i === 1 ? <FileQuestion size={10} className="text-indigo-600" /> :
                        i === 2 ? <Code size={10} className="text-indigo-600" /> :
                          <CheckCircle2 size={10} className="text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-indigo-900/80 leading-relaxed font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-100 bg-white shadow-sm flex flex-col">
            <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Rounds Overview</h3>
            <div className="relative pl-3 flex flex-col gap-5">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-zinc-200 z-0"></div>

              <div className="relative z-10 flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5"><Check size={10} strokeWidth={3} /></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-900">Round 1</span>
                  <span className="text-[9px] text-zinc-500">AI Screening Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Completed</span>
                  <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 bg-[#f8f7ff] p-3 -mx-3 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shrink-0 mt-0.5"><div className="h-2 w-2 rounded-full bg-indigo-600" /></div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-indigo-700">Round 2</span>
                  <span className="text-[9px] font-semibold text-indigo-700">Technical Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">In Progress</span>
                  <span className="text-[9px] text-indigo-500 font-medium">40 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">3</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 3</span>
                  <span className="text-[9px] text-zinc-500">Managerial Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">30 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">4</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 4</span>
                  <span className="text-[9px] text-zinc-500">Written Assessment</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">45 Min</span>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-white border border-zinc-300 text-zinc-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold">5</div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-zinc-800">Round 5</span>
                  <span className="text-[9px] text-zinc-500">HR Interview</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-zinc-500">Pending</span>
                  <span className="text-[9px] text-zinc-500 font-medium">25 Min</span>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>

      {/* Bottom Grid: 3 columns with gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 ">

        {/* Your Previous Answer */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          {currentQuestionIndex > 0 ? (
            <>
              <h3 className="text-[11px] font-bold text-zinc-900 mb-4">Your Previous Answer (Q{currentQuestionIndex})</h3>
              <div className="flex items-start gap-2 mb-3">
                <div className="h-5 w-5 bg-[#f0f9f4] text-emerald-600 rounded flex items-center justify-center shrink-0 font-bold text-[9px] border border-emerald-100">Q.{currentQuestionIndex}</div>
                <p className="text-[10px] font-bold text-zinc-900 mt-0.5 leading-relaxed">{activeQuestions[currentQuestionIndex - 1]?.text}</p>
              </div>
              <div className="bg-[#f4fbf7] rounded p-3 text-[10px] text-zinc-700 border border-emerald-50 mt-3 line-clamp-3 leading-relaxed">
                {answers[currentQuestionIndex - 1] || "No answer provided."}
                <div className="text-right w-full mt-3">
                  <button onClick={() => setIsModalOpen(true)} className="text-[9px] font-bold text-indigo-700 hover:underline">View Full Answer</button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[11px] text-zinc-500 font-medium">No previous answer available.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            {[
              { icon: HelpCircle, label: 'Request Clarification', desc: 'Ask for more details about the question' },
              { icon: FileText, label: 'Add Interview Note', desc: 'Make a note about candidate\'s response' },
              { icon: Share2, label: 'Share Feedback', desc: 'Share feedback with the interview panel' },
              { icon: Code, label: 'Add Code Snippet / Attachment', desc: 'Upload diagram, code, or file' },
            ].map((action, i) => (
              <button key={i} className="flex items-start gap-3 text-left group">
                <div className="p-1.5 bg-[#f8f7ff] group-hover:bg-indigo-50 text-indigo-600 rounded mt-0.5 border border-indigo-50">
                  <action.icon size={13} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-800 group-hover:text-indigo-700">{action.label}</span>
                  <span className="text-[9px] text-zinc-500">{action.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Guidelines */}
        <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-sm">
          <h3 className="text-[12px] font-bold text-zinc-900 mb-4">Interview Guidelines</h3>
          <ul className="flex flex-col gap-3 text-[10px] text-zinc-600">
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Ensure a quiet environment.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Use headphones for better experience.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> Do not refresh or close the browser.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> AI will evaluate your responses in real-time.</li>
            <li className="flex items-start gap-2"><div className="mt-0.5 h-3 w-3 rounded-full border border-zinc-300 flex items-center justify-center shrink-0"><div className="h-1 w-1 bg-zinc-400 rounded-full" /></div> You can use notepad for rough work.</li>
          </ul>
          <button className="text-[10px] font-bold text-indigo-700 hover:underline mt-5 flex items-center gap-1">
            Need Help? View Guidelines <ExternalLink size={10} />
          </button>
        </div>
      </div>
      </>
      )}

      {activeTab === 'AI Questions' && (
        <div className="mt-4 p-5 rounded-xl border border-zinc-100 bg-white shadow-sm">
          <h3 className="text-[14px] font-bold text-zinc-900 mb-4">AI Interview Questions & Answers</h3>
          <div className="flex flex-col gap-6">
            {activeQuestions.length === 0 ? (
              <p className="text-[12px] text-zinc-500">No questions available yet.</p>
            ) : (
              activeQuestions.map((q: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 font-bold text-[9px] border border-indigo-100 mt-0.5">
                      Q.{idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-indigo-600 mb-0.5">{q.category}</span>
                      <p className="text-[12px] font-bold text-zinc-900 leading-relaxed">{q.text || q.question}</p>
                    </div>
                  </div>
                  <div className="ml-7 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <p className="text-[11px] text-zinc-700 whitespace-pre-wrap leading-relaxed">
                      {answers[idx] ? answers[idx] : <span className="italic text-zinc-400">No answer provided.</span>}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {(activeTab === 'Notes' || activeTab === 'Attachments') && (
        <div className="mt-4 p-8 rounded-xl border border-dashed border-zinc-200 bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <FileText className="text-zinc-300 w-8 h-8 mb-2" />
          <h3 className="text-[13px] font-bold text-zinc-900">{activeTab}</h3>
          <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">This section is coming soon. You will be able to manage {activeTab.toLowerCase()} here.</p>
        </div>
      )}

      {isModalOpen && currentQuestionIndex > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 p-4">
              <h3 className="text-[14px] font-bold text-zinc-900">Your Previous Answer</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-md p-1.5 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-6 w-6 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 font-bold text-[10px] border border-indigo-100">
                  Q.{currentQuestionIndex}
                </div>
                <p className="text-[13px] font-bold text-zinc-900 mt-0.5 leading-relaxed">
                  {activeQuestions[currentQuestionIndex - 1]?.text}
                </p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-4 text-[12px] text-zinc-700 border border-zinc-200 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {answers[currentQuestionIndex - 1] || "No answer provided."}
              </div>
            </div>
            <div className="border-t border-zinc-100 p-4 flex justify-end">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-lg shadow-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

