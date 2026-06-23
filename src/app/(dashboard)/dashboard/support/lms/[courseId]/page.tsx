'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
  PlayCircle, CheckCircle2, Circle, ArrowLeft, Loader2, ChevronLeft, ChevronRight,
  FileText, Video as VideoIcon, Clock, Sparkles, ListChecks
} from 'lucide-react';
import Link from 'next/link';

// Resolve a material URL into a renderable type + source
const getMaterial = (url?: string) => {
  if (!url) return { type: 'none' as const, src: '' };
  const lower = url.toLowerCase();

  let yt: string | null = null;
  if (url.includes('youtube.com/watch?v=')) yt = url.split('v=')[1].split('&')[0];
  else if (url.includes('youtu.be/')) yt = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com/embed/')) yt = url.split('embed/')[1].split('?')[0];
  else if (url.includes('youtube.com/shorts/')) yt = url.split('shorts/')[1].split('?')[0];
  if (yt) return { type: 'youtube' as const, src: `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0` };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/.test(lower)) return { type: 'video' as const, src: url };
  if (/\.pdf(\?.*)?$/.test(lower)) return { type: 'pdf' as const, src: url };
  return { type: 'iframe' as const, src: url };
};

const ProgressRing = ({ value, size = 40, stroke = 4, done = false }: { value: number; size?: number; stroke?: number; done?: boolean }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-zinc-200 dark:stroke-zinc-700" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${done ? 'stroke-emerald-500' : 'stroke-indigo-600 dark:stroke-indigo-400'}`}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
        {value}%
      </span>
    </div>
  );
};

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  useEffect(() => {
    fetchTraining();
  }, [courseId]);

  const fetchTraining = async () => {
    try {
      const res = await api.get('/support/lms/trainings');
      const tr = res.data.find((t: any) => t.courseId?._id === courseId);
      if (tr) {
        setTraining(tr);
        const course = tr.courseId;
        const uncompletedIndex = course.modules.findIndex((m: any) => !tr.completedModules?.includes(m._id));
        setActiveModuleIndex(uncompletedIndex !== -1 ? uncompletedIndex : 0);
      } else {
        alert('You are not enrolled in this course');
        router.push('/dashboard/support/lms');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleCompleted = async (moduleId: string) => {
    setCompleting(true);
    try {
      const course = training.courseId;
      const isLastUncompleted = course.modules.filter((m: any) => !training.completedModules?.includes(m._id)).length === 1;

      const payload: any = { completedModuleId: moduleId };
      if (isLastUncompleted) {
        payload.status = 'Completed';
      } else if (training.status === 'Not_Started') {
        payload.status = 'In_Progress';
      }

      await api.put(`/support/lms/trainings/${training._id}`, payload);

      if (activeModuleIndex < course.modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
      }

      fetchTraining();
    } catch (error) {
      console.error(error);
      alert('Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 h-[80vh] items-center justify-center text-zinc-500">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading your course…</p>
      </div>
    );
  }

  if (!training || !training.courseId) return null;

  const course = training.courseId;
  const activeModule = course.modules[activeModuleIndex];
  const material = getMaterial(activeModule?.materialsUrl);

  const completedCount = training.completedModules?.length || 0;
  const totalCount = course.modules.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const courseDone = progressPercent === 100;

  const isActiveCompleted = training.completedModules?.includes(activeModule?._id);
  const goPrev = () => setActiveModuleIndex(i => Math.max(0, i - 1));
  const goNext = () => setActiveModuleIndex(i => Math.min(totalCount - 1, i + 1));

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/support/lms" className="grid place-items-center h-9 w-9 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 line-clamp-1">{course.title}</h1>
              {courseDone && (
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <CheckCircle2 size={11} /> Done
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{completedCount} of {totalCount} modules completed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-32 sm:w-44 hidden sm:block">
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${courseDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <ProgressRing value={progressPercent} done={courseDone} />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900">
        {/* Player + controls */}
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden min-w-0">
          <div className="flex-1 relative bg-black min-h-0">
            {!activeModule ? (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">No module selected</div>
            ) : material.type === 'video' ? (
              <video key={material.src} src={material.src} controls autoPlay className="w-full h-full bg-black" />
            ) : material.type === 'none' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-2">
                <FileText size={32} />
                <p className="text-sm">No material attached to this module.</p>
              </div>
            ) : (
              <iframe
                key={material.src}
                src={material.src}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Control bar */}
          {activeModule && (
            <div className="shrink-0 border-t border-zinc-800 bg-zinc-900 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 uppercase tracking-wide">
                  {material.type === 'pdf' ? <FileText size={12} /> : <VideoIcon size={12} />}
                  Module {activeModuleIndex + 1} of {totalCount}
                </p>
                <h3 className="text-white font-semibold text-sm sm:text-base truncate mt-0.5">{activeModule.title}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={goPrev} disabled={activeModuleIndex === 0} className="grid place-items-center h-9 w-9 rounded-lg text-zinc-300 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Previous">
                  <ChevronLeft size={18} />
                </button>

                {isActiveCompleted ? (
                  <span className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/15">
                    <CheckCircle2 size={16} /> <span className="hidden sm:inline">Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => markModuleCompleted(activeModule._id)}
                    disabled={completing}
                    className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 transition-all active:scale-[0.98]"
                  >
                    {completing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    <span className="hidden sm:inline">Mark complete</span>
                  </button>
                )}

                <button onClick={goNext} disabled={activeModuleIndex === totalCount - 1} className="grid place-items-center h-9 w-9 rounded-lg text-zinc-300 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Next">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-zinc-50 dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-[45vh] lg:h-auto overflow-y-auto">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <ListChecks size={18} className="text-indigo-600 dark:text-indigo-400" /> Course content
              </h2>
              <span className="text-xs font-semibold text-zinc-500 tabular-nums">{completedCount}/{totalCount}</span>
            </div>
          </div>

          {courseDone && (
            <div className="m-3 mb-0 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-500 text-white shrink-0">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Course complete!</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400/80">Nice work — you finished every module.</p>
              </div>
            </div>
          )}

          <div className="flex-1 p-3 space-y-1.5">
            {course.modules.map((module: any, index: number) => {
              const isCompleted = training.completedModules?.includes(module._id);
              const isActive = activeModuleIndex === index;

              return (
                <button
                  key={module._id || index}
                  onClick={() => setActiveModuleIndex(index)}
                  className={`w-full text-left p-3 rounded-xl cursor-pointer transition-all border ${isActive
                      ? 'bg-white dark:bg-zinc-800 border-indigo-200 dark:border-indigo-500/30 shadow-sm ring-1 ring-indigo-500/10'
                      : 'bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : isActive ? (
                        <PlayCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Circle size={18} className="text-zinc-300 dark:text-zinc-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-indigo-900 dark:text-indigo-100' : isCompleted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        <span className="text-zinc-400 dark:text-zinc-600">{index + 1}.</span> {module.title}
                      </p>
                      {module.duration > 0 && (
                        <p className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                          <Clock size={11} /> {module.duration} min
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}