'use client';

import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/axios';
import {
  Plus, Search, BookOpen, CheckCircle2, PlayCircle, X, ChevronRight,
  GraduationCap, LayoutDashboard, Trash2, Clock, Layers, Sparkles, TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Consistent gradient based on a string (course title)
const getGradient = (str: string) => {
  const gradients = [
    'from-indigo-500 via-purple-500 to-fuchsia-500',
    'from-emerald-400 via-teal-500 to-cyan-500',
    'from-rose-400 via-red-400 to-orange-500',
    'from-blue-500 via-sky-500 to-teal-400',
    'from-fuchsia-500 via-pink-500 to-rose-500',
    'from-violet-500 via-indigo-500 to-blue-600',
    'from-amber-400 via-orange-500 to-rose-500',
  ];
  let hash = 0;
  if (!str) return gradients[0];
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const totalDuration = (modules: any[] = []) =>
  modules.reduce((sum, m) => sum + (Number(m?.duration) || 0), 0);

const formatMins = (mins: number) => {
  if (!mins) return null;
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// Small circular progress ring
const ProgressRing = ({ value, size = 44, stroke = 4, done = false }: { value: number; size?: number; stroke?: number; done?: boolean }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-zinc-100 dark:stroke-zinc-800" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${done ? 'stroke-emerald-500' : 'stroke-indigo-600 dark:stroke-indigo-400'}`}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-bold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
        {value}%
      </span>
    </div>
  );
};

export default function LMSPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-learning'>('catalog');
  const [query, setQuery] = useState('');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [modules, setModules] = useState([{ title: '', materialsUrl: '', duration: '' }]);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch both catalog + my learning together so enrollment state and stats are always accurate
  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, trainingsRes] = await Promise.allSettled([
        api.get('/support/lms/courses'),
        api.get('/support/lms/trainings'),
      ]);
      if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value.data);
      if (trainingsRes.status === 'fulfilled') setTrainings(trainingsRes.value.data);
    } catch (error) {
      console.error('Error fetching LMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return alert('Title and description are required');
    const validModules = modules.filter(m => m.title && m.materialsUrl);
    if (validModules.length === 0) return alert('Add at least one module with a title and material URL');

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        modules: validModules.map(m => ({
          title: m.title,
          materialsUrl: m.materialsUrl,
          duration: m.duration ? parseInt(m.duration) : 0,
        })),
      };
      await api.post('/support/lms/courses', payload);
      setIsAddModalOpen(false);
      setFormData({ title: '', description: '' });
      setModules([{ title: '', materialsUrl: '', duration: '' }]);
      fetchData();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const addModuleField = () => setModules([...modules, { title: '', materialsUrl: '', duration: '' }]);
  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setModules(newModules);
  };
  const removeModule = (index: number) => {
    if (modules.length === 1) return;
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.post('/support/lms/trainings/enroll', { courseId });
      await fetchData();
      setActiveTab('my-learning');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  // ---- Derived data ----
  const enrolledCourseIds = useMemo(
    () => new Set(trainings.map(t => t.courseId?._id).filter(Boolean)),
    [trainings]
  );

  const completedCount = useMemo(
    () => trainings.filter(t => {
      const total = t.courseId?.modules?.length || 0;
      const done = t.completedModules?.length || 0;
      return t.status === 'Completed' || (total > 0 && done === total);
    }).length,
    [trainings]
  );

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c =>
      c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    );
  }, [courses, query]);

  const filteredTrainings = useMemo(() => {
    const q = query.trim().toLowerCase();
    const valid = trainings.filter(t => t.courseId);
    if (!q) return valid;
    return valid.filter(t => t.courseId?.title?.toLowerCase().includes(q));
  }, [trainings, query]);

  const stats = [
    { label: 'Courses available', value: courses.length, icon: BookOpen, tint: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { label: 'Enrolled', value: enrolledCourseIds.size, icon: TrendingUp, tint: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
    { label: 'Completed', value: completedCount, icon: CheckCircle2, tint: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-8 w-full">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/40 p-6">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-24 top-8 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Academy &amp; LMS</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">Grow your skills with company training programs.</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90 duration-300" /> Add Course
          </button>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-3 sm:gap-4 mt-6">
          {stats.map(s => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur px-3 py-3 sm:px-4">
              <div className={`grid place-items-center h-10 w-10 rounded-lg shrink-0 ${s.tint}`}>
                <s.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold leading-none text-zinc-900 dark:text-zinc-50 tabular-nums">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Controls: tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
          >
            <LayoutDashboard size={16} /> Catalog
          </button>
          <button
            onClick={() => setActiveTab('my-learning')}
            className={`px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'my-learning' ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
          >
            <PlayCircle size={16} /> My Learning
            {enrolledCourseIds.size > 0 && (
              <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                {enrolledCourseIds.size}
              </span>
            )}
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={activeTab === 'catalog' ? 'Search courses…' : 'Search my courses…'}
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-9 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'catalog' ? (
              filteredCourses.length > 0 ? (
                filteredCourses.map(course => {
                  const gradient = getGradient(course.title);
                  const isEnrolled = enrolledCourseIds.has(course._id);
                  const totalModules = course.modules?.length || 0;
                  const mins = formatMins(totalDuration(course.modules));
                  const isEnrolling = enrollingId === course._id;

                  return (
                    <Card key={course._id} className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden group hover:shadow-xl hover:shadow-zinc-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white dark:bg-zinc-900">
                      {/* Cover */}
                      <div className={`h-32 w-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.6) 0, transparent 45%)' }} />
                        <BookOpen size={44} className="text-white/40 transition-transform duration-500 group-hover:scale-110" />
                        {isEnrolled && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/90 text-emerald-600 shadow-sm">
                            <CheckCircle2 size={11} /> Enrolled
                          </span>
                        )}
                      </div>

                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1"><Layers size={13} /> {totalModules} {totalModules === 1 ? 'module' : 'modules'}</span>
                          {mins && <span className="flex items-center gap-1"><Clock size={13} /> {mins}</span>}
                        </div>
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 flex-1">{course.description}</p>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                          {isEnrolled ? (
                            <Link
                              href={`/dashboard/support/lms/${course._id}`}
                              className="w-full py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              Continue Learning <PlayCircle size={16} />
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course._id)}
                              disabled={isEnrolling}
                              className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                              {isEnrolling ? (
                                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Enrolling…</>
                              ) : (
                                <>Enroll Now <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>
                              )}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <EmptyState
                  icon={query ? Search : BookOpen}
                  title={query ? 'No matching courses' : 'No courses yet'}
                  subtitle={query ? `Nothing found for “${query}”. Try a different search.` : 'New training programs will show up here once they’re published.'}
                />
              )
            ) : (
              filteredTrainings.length > 0 ? (
                filteredTrainings.map(training => {
                  const totalModules = training.courseId.modules?.length || 0;
                  const completedModules = training.completedModules?.length || 0;
                  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
                  const isCompleted = training.status === 'Completed' || progress === 100;
                  const gradient = getGradient(training.courseId.title);

                  return (
                    <Card key={training._id} className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden relative flex flex-col h-full bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-900/5 hover:-translate-y-1 transition-all duration-300">
                      {/* Accent strip */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${isCompleted ? 'from-emerald-400 to-teal-500' : gradient}`} />

                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 line-clamp-1">{training.courseId.title}</h3>
                          <ProgressRing value={progress} done={isCompleted} />
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 flex items-center gap-1.5">
                          <Layers size={13} /> {completedModules} of {totalModules} modules done
                        </p>

                        <div className="mt-auto">
                          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <Link
                            href={`/dashboard/support/lms/${training.courseId._id}`}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98] ${isCompleted
                              ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                          >
                            {isCompleted ? (<><Sparkles size={16} /> Review Course</>) : (<>Continue Learning <PlayCircle size={16} /></>)}
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <EmptyState
                  icon={PlayCircle}
                  title={query ? 'No matching courses' : 'Nothing in progress'}
                  subtitle={query ? `Nothing found for “${query}”.` : 'Enroll in a course from the catalog to start learning.'}
                  action={!query ? { label: 'Browse catalog', onClick: () => setActiveTab('catalog') } : undefined}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Add Course Drawer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="w-full max-w-xl h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Add new course</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Build a multi-part learning module.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors dark:hover:bg-zinc-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Course information</h4>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Course title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-transparent dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Information Security 101" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2.5 border rounded-lg text-sm bg-transparent dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="What will employees learn?" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Modules ({modules.length})</h4>
                  <button type="button" onClick={addModuleField} className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700">
                    <Plus size={14} /> Add part
                  </button>
                </div>

                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-xl space-y-3 relative">
                      <div className="flex justify-between items-center mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          <span className="grid place-items-center h-5 w-5 rounded-md bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px]">{index + 1}</span>
                          Part {index + 1}
                        </span>
                        {modules.length > 1 && (
                          <button type="button" onClick={() => removeModule(index)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-md transition-colors dark:hover:bg-rose-500/10">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Module title</label>
                        <input required type="text" value={module.title} onChange={e => updateModule(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:border-indigo-500 outline-none" placeholder="e.g. Introduction & Basics" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Material URL (YouTube / MP4 / PDF)</label>
                        <input required type="url" value={module.materialsUrl} onChange={e => updateModule(index, 'materialsUrl', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:border-indigo-500 outline-none" placeholder="https://youtube.com/watch?v=..." />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Duration (minutes, optional)</label>
                        <input type="number" min="1" value={module.duration} onChange={e => updateModule(index, 'duration', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:border-indigo-500 outline-none" placeholder="e.g. 15" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
              <button type="submit" onClick={handleCreateCourse} disabled={submitting} className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white shadow-sm rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                {submitting ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Publishing…</>) : 'Publish Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function EmptyState({ icon: Icon, title, subtitle, action }: { icon: any; title: string; subtitle: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="grid place-items-center h-16 w-16 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 mb-4 shadow-sm">
        <Icon size={28} className="text-zinc-400 dark:text-zinc-500" />
      </div>
      <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs">{subtitle}</p>
      {action && (
        <button onClick={action.onClick} className="mt-5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-lg transition-colors flex items-center gap-1.5">
          {action.label} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}