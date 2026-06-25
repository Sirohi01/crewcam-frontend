
// 'use client';

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { useQuery } from '@tanstack/react-query';
// import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { Activity, ArrowRight, CalendarCheck, CheckCircle2, ChevronDown, Clock3, FilePlus2, ListTodo, Sparkles, Target, TrendingUp, UserPlus, Users } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import api from '@/lib/axios';

// interface DashboardConfig { category: string; effectivePermissions: string[]; widgets: string[]; }

// const FALLBACK_WIDGETS = ['org-headcount', 'team-attendance-today', 'pending-approvals', 'hiring-pipeline-summary'];
// const weeklyActivity = [
//   { day: 'Mon', attendance: 82, target: 78 }, { day: 'Tue', attendance: 88, target: 78 },
//   { day: 'Wed', attendance: 79, target: 78 }, { day: 'Thu', attendance: 91, target: 78 },
//   { day: 'Fri', attendance: 86, target: 78 }, { day: 'Sat', attendance: 64, target: 60 }, { day: 'Sun', attendance: 42, target: 38 },
// ];
// const fallbackPipeline = [{ name: 'Applied', count: 42 }, { name: 'Screening', count: 26 }, { name: 'Interview', count: 18 }, { name: 'Offer', count: 8 }, { name: 'Hired', count: 5 }];
// const departmentData = [{ name: 'Product', value: 88 }, { name: 'Sales', value: 76 }, { name: 'Marketing', value: 69 }, { name: 'Operations', value: 82 }, { name: 'People', value: 72 }];
// const leaveData = [{ name: 'Present', value: 82, color: '#8b5cf6' }, { name: 'On leave', value: 9, color: '#f59e0b' }, { name: 'Remote', value: 6, color: '#38bdf8' }, { name: 'Absent', value: 3, color: '#fb7185' }];

// const META: Record<string, { title: string; icon: React.ReactNode; accent: string; fallback: string; delta: string }> = {
//   'org-headcount': { title: 'Total employees', icon: <Users size={18} />, accent: 'bg-violet-500', fallback: '128', delta: '+12.5%' },
//   'team-attendance-today': { title: 'Team attendance', icon: <Clock3 size={18} />, accent: 'bg-emerald-500', fallback: '82%', delta: '+4.2%' },
//   'department-attendance': { title: 'Department attendance', icon: <Clock3 size={18} />, accent: 'bg-emerald-500', fallback: '82%', delta: '+4.2%' },
//   'my-attendance-today': { title: 'My attendance', icon: <Clock3 size={18} />, accent: 'bg-emerald-500', fallback: 'Present', delta: 'On time' },
//   'pending-approvals': { title: 'Pending approvals', icon: <CheckCircle2 size={18} />, accent: 'bg-amber-500', fallback: '14', delta: '3 urgent' },
//   'hiring-pipeline-summary': { title: 'Active candidates', icon: <UserPlus size={18} />, accent: 'bg-sky-500', fallback: '99', delta: '+18 this week' },
//   'my-leave-balance': { title: 'Leave requests', icon: <CalendarCheck size={18} />, accent: 'bg-rose-500', fallback: '6', delta: '2 awaiting review' },
//   'my-todo': { title: 'My tasks', icon: <ListTodo size={18} />, accent: 'bg-fuchsia-500', fallback: '9', delta: '4 due today' },
//   'department-headcount': { title: 'Dept employees', icon: <Users size={18} />, accent: 'bg-indigo-500', fallback: '32', delta: 'Stable' },
//   'meetings-summary': { title: 'Meetings today', icon: <Activity size={18} />, accent: 'bg-blue-500', fallback: '4', delta: '2 scheduled' },
//   'pms-appraisal-status': { title: 'Appraisals', icon: <Target size={18} />, accent: 'bg-pink-500', fallback: '8', delta: '2 pending' },
//   'communications-summary': { title: 'Announcements', icon: <Activity size={18} />, accent: 'bg-sky-500', fallback: '2', delta: '1 new' },
//   'disciplinary-cases-open': { title: 'Open cases', icon: <CheckCircle2 size={18} />, accent: 'bg-red-500', fallback: '1', delta: 'Review needed' },
//   'exit-formalities-pending': { title: 'Exit formalities', icon: <FilePlus2 size={18} />, accent: 'bg-orange-500', fallback: '2', delta: '1 pending' },
//   'master-data-health': { title: 'Data health', icon: <Sparkles size={18} />, accent: 'bg-emerald-500', fallback: '98%', delta: 'Looks good' },
//   'payroll-pending': { title: 'Payroll tasks', icon: <CheckCircle2 size={18} />, accent: 'bg-fuchsia-500', fallback: '12', delta: 'Due in 3 days' },
//   'obligations-due': { title: 'Obligations due', icon: <Activity size={18} />, accent: 'bg-amber-500', fallback: '5', delta: 'Action required' },
//   'agreements-active': { title: 'Active agreements', icon: <FilePlus2 size={18} />, accent: 'bg-blue-500', fallback: '14', delta: '2 expiring' },
//   'tenant-feature-usage': { title: 'Active users', icon: <Users size={18} />, accent: 'bg-violet-500', fallback: '128', delta: 'Plan healthy' },
//   'developer-tasks': { title: 'Dev tasks', icon: <ListTodo size={18} />, accent: 'bg-zinc-700', fallback: '5', delta: 'In progress' },
// };

// function valueFor(key: string, data: any, fallback: string) {
//   if (!data || data.dataAvailable === false) return fallback;
//   if (key === 'my-attendance-today') return data.status || fallback;
//   if (key === 'my-leave-balance' || key === 'pending-approvals') return String(data.pending ?? fallback);
//   if (key.includes('attendance')) {
//     const present = Number(data.presentToday ?? 0); const total = Number(data.teamSize ?? 0);
//     return total ? `${Math.round((present / total) * 100)}%` : fallback;
//   }
//   if (key.includes('headcount')) return String(data.count ?? fallback);
//   if (key === 'hiring-pipeline-summary') return String(Object.values(data).reduce((sum: number, value) => sum + Number(value || 0), 0) || fallback);
//   return String(data.count ?? fallback);
// }

// // ─── Hero Slider ─────────────────────────────────────────────────────────────
// const SLIDES = [
//   { imageUrl: '/bannerImg/img1.png' },
//   { imageUrl: '/bannerImg/img2.png' },
//   { imageUrl: '/bannerImg/img3.jpg' },
// ];

// function HeroSlider() {
//   const [current, setCurrent] = useState(0);
//   const [fading, setFading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [paused, setPaused] = useState(false);

//   const progressRef = useRef(0);
//   const pausedRef = useRef(false);
//   const rafRef = useRef<number | null>(null);
//   const lastRef = useRef<number | null>(null);
//   const currentRef = useRef(0);
//   const DURATION = 7000;

//   const { data: dynamicBanners, isLoading: bannersLoading } = useQuery({
//     queryKey: ['dashboard', 'banners'],
//     queryFn: async () => (await api.get('/dashboard/banners')).data,
//     staleTime: 30_000,
//   });

//   const activeSlides = bannersLoading ? SLIDES : (dynamicBanners?.length ? dynamicBanners : SLIDES);

//   useEffect(() => {
//     setCurrent(0);
//     currentRef.current = 0;
//   }, [dynamicBanners]);

//   useEffect(() => {
//     pausedRef.current = paused;
//   }, [paused]);

//   const goTo = useCallback((index: number) => {
//     if (index === currentRef.current) return;
//     setFading(true);
//     progressRef.current = 0;
//     setTimeout(() => {
//       currentRef.current = index;
//       setCurrent(index);
//       setFading(false);
//     }, 220);
//   }, []);

//   useEffect(() => {
//     const tick = (ts: number) => {
//       if (!lastRef.current) lastRef.current = ts;
//       const dt = ts - lastRef.current;
//       lastRef.current = ts;
//       if (!pausedRef.current) {
//         progressRef.current += (dt / DURATION) * 100;
//         setProgress(Math.min(progressRef.current, 100));
//         if (progressRef.current >= 100) {
//           progressRef.current = 0;
//           const next = (currentRef.current + 1) % activeSlides.length;
//           setFading(true);
//           setTimeout(() => {
//             currentRef.current = next;
//             setCurrent(next);
//             setFading(false);
//           }, 220);
//         }
//       }
//       rafRef.current = requestAnimationFrame(tick);
//     };
//     rafRef.current = requestAnimationFrame(tick);
//     return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
//   }, [activeSlides.length]);

//   const slide = activeSlides[current] ?? activeSlides[0];
//   if (!slide) return null;

//   return (
//     <section
//       className="relative overflow-hidden rounded-2xl shadow-md"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >

//       {/* Full banner image */}
//       <div
//         className="w-full"
//         style={{
//           opacity: fading ? 0 : 1,
//           transition: 'opacity 0.22s ease',
//         }}
//       >
//         <img
//           src={slide.imageUrl}
//           alt=""
//           aria-hidden="true"
//           className="w-full object-cover"
//           style={{ display: 'block' }}
//           onError={(e) => {
//             // hide broken image gracefully
//             (e.target as HTMLImageElement).style.display = 'none';
//           }}
//         />
//       </div>
//     </section>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function DashboardPage() {
//   const { data: config, isLoading } = useQuery<DashboardConfig>({ queryKey: ['dashboard', 'config'], queryFn: async () => (await api.get('/dashboard/config')).data });
//   const liveWidgets = config?.widgets?.length ? config.widgets : FALLBACK_WIDGETS;
//   const primaryWidgets = [...liveWidgets, ...FALLBACK_WIDGETS.filter((key) => !liveWidgets.includes(key))].slice(0, 4);
//   const { data: hiring } = useQuery({ queryKey: ['dashboard', 'widget', 'hiring-pipeline-summary'], queryFn: async () => (await api.get('/dashboard/widget-data/hiring-pipeline-summary')).data });
//   const { data: attendance } = useQuery({ queryKey: ['dashboard', 'widget', 'team-attendance-today'], queryFn: async () => (await api.get('/dashboard/widget-data/team-attendance-today')).data });
//   const pipelineData = Object.entries(hiring || {}).map(([name, value]) => ({ name, count: Number(value || 0) })).filter((row) => row.count > 0);
//   const resolvedPipeline = pipelineData.length ? pipelineData : fallbackPipeline;
//   const pipelineTotal = resolvedPipeline.reduce((total, item) => total + item.count, 0);
//   const present = Number(attendance?.presentToday || 0); const teamSize = Number(attendance?.teamSize || 0);
//   const attendanceBreakdown = teamSize ? [{ name: 'Present', value: present, color: '#8b5cf6' }, { name: 'Not marked', value: Math.max(0, teamSize - present), color: '#e4e4e7' }] : leaveData;
//   const attendanceRate = teamSize ? Math.round((present / teamSize) * 100) : 82;

//   return (
//     <main className="capitalize mx-auto max-w-[1600px] space-y-2 pb-2">

//       <HeroSlider />

//       <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
//         <div>
//           <h2 className="text-lg font-md tracking-tight text-zinc-900">Operations at a glance</h2>
//           <p className="text-sm text-zinc-500">A concise snapshot of your organization&apos;s momentum.</p>
//         </div>
//         <button className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 shadow-sm">
//           This week <ChevronDown size={14} />
//         </button>
//       </div>

//       <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
//         {isLoading
//           ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[122px] animate-pulse rounded-2xl bg-zinc-100" />)
//           : primaryWidgets.map((key) => <KpiCard key={key} widgetKey={key} />)}
//       </section>

//       <section className="grid gap-2 xl:grid-cols-12">
//         <ChartCard className="xl:col-span-7" title="Attendance trend" subtitle="Daily check-ins across the past 7 days" action="View attendance" href="/dashboard/attendance/today">
//           <div className="h-[185px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={weeklyActivity} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
//                 <defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={.35} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={.01} /></linearGradient></defs>
//                 <CartesianGrid vertical={false} stroke="#eeeef2" />
//                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} domain={[0, 100]} />
//                 <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', boxShadow: '0 10px 25px -10px rgba(0,0,0,.16)' }} />
//                 <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#7c3aed" strokeWidth={3} fill="url(#attendanceFill)" />
//                 <Line type="monotone" dataKey="target" name="Target" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </ChartCard>
//         <ChartCard className="xl:col-span-5" title="Today's workforce" subtitle={`${attendanceRate}% attendance marked`}>
//           <div className="flex h-[185px] items-center">
//             <div className="relative h-[165px] w-[57%]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart><Pie data={attendanceBreakdown} dataKey="value" innerRadius={45} outerRadius={65} paddingAngle={3} stroke="none">{attendanceBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart>
//               </ResponsiveContainer>
//               <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><strong className="text-xl tracking-tight">{attendanceRate}%</strong><span className="text-[10px] text-zinc-500">checked in</span></div>
//             </div>
//             <div className="flex-1 space-y-2">{attendanceBreakdown.map((item) => <div key={item.name} className="flex items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 text-zinc-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><b className="text-zinc-900">{item.value}%</b></div>)}</div>
//           </div>
//         </ChartCard>
//       </section>

//       <section className="grid gap-2 xl:grid-cols-12">
//         <ChartCard className="xl:col-span-4" title="Hiring pipeline" subtitle="Candidates by current stage" action="Open pipeline" href="/dashboard/hiring/pipeline">
//           <div className="flex h-[185px] items-center">
//             <div className="relative h-[175px] w-[48%]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart><Pie data={resolvedPipeline} dataKey="count" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">{resolvedPipeline.map((item, index) => <Cell key={item.name} fill={['#38bdf8', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7'][index % 5]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', boxShadow: '0 10px 25px -10px rgba(0,0,0,.16)' }} /></PieChart>
//               </ResponsiveContainer>
//               <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><strong className="text-xl tracking-tight text-zinc-900">{pipelineTotal}</strong><span className="text-[10px] text-zinc-500">candidates</span></div>
//             </div>
//             <div className="flex-1 space-y-2">{resolvedPipeline.map((item, index) => <div key={item.name} className="flex items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 text-zinc-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#38bdf8', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7'][index % 5] }} />{item.name}</span><b className="text-zinc-900">{item.count}</b></div>)}</div>
//           </div>
//         </ChartCard>
//         <ChartCard className="xl:col-span-5" title="Team health" subtitle="Department engagement score">
//           <div className="h-[185px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <RadarChart data={departmentData} cx="50%" cy="50%" outerRadius="63%"><PolarGrid /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717a' }} /><Radar dataKey="value" name="Score" stroke="#ec4899" fill="#ec4899" fillOpacity={.24} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7' }} /></RadarChart>
//             </ResponsiveContainer>
//           </div>
//         </ChartCard>
//         <Card className="border-zinc-200/80 bg-gradient-to-b from-white to-violet-50/40 shadow-sm xl:col-span-3">
//           <CardContent className="flex h-full min-h-[250px] flex-col p-4">
//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700"><Target size={18} /></span>
//             <h3 className="mt-3 text-base font-md">Weekly focus</h3>
//             <p className="mt-1 text-sm leading-5 text-zinc-500">You&apos;re moving well. A few small actions can keep the week on track.</p>
//             <div className="mt-3 space-y-2"><Focus text="Review 3 pending approvals" done /><Focus text="Schedule 2 final interviews" /><Focus text="Publish team Friday update" /></div>
//             <Link href="/dashboard/todos" className="mt-auto inline-flex items-center gap-1.5 text-sm font-md text-violet-700">Open task board <ArrowRight size={15} /></Link>
//           </CardContent>
//         </Card>
//       </section>

//       <section className="grid gap-2 lg:grid-cols-2">
//         <ChartCard title="Workload distribution" subtitle="Active work across teams">
//           <div className="h-[165px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={[{ name: 'Product', open: 28, done: 42 }, { name: 'Sales', open: 20, done: 34 }, { name: 'Ops', open: 15, done: 30 }, { name: 'People', open: 12, done: 19 }]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
//                 <CartesianGrid vertical={false} stroke="#eeeef2" />
//                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
//                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
//                 <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7' }} />
//                 <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
//                 <Bar dataKey="done" name="Completed" stackId="a" fill="#8b5cf6" radius={[0, 0, 5, 5]} />
//                 <Bar dataKey="open" name="Open" stackId="a" fill="#ddd6fe" radius={[5, 5, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </ChartCard>
//         <Card className="border-zinc-200/80 shadow-sm">
//           <CardContent className="p-4">
//             <div className="flex items-start justify-between"><div><p className="text-sm font-md">Quick actions</p><p className="mt-0.5 text-xs text-zinc-500">The things that need a human touch.</p></div><Sparkles size={18} className="text-violet-500" /></div>
//             <div className="mt-3 grid gap-2 sm:grid-cols-3">
//               <QuickAction href="/dashboard/hiring/manpower" icon={<FilePlus2 size={17} />} label="New requisition" />
//               <QuickAction href="/dashboard/attendance/today" icon={<Activity size={17} />} label="Check attendance" />
//               <QuickAction href="/dashboard/hiring/pipeline" icon={<UserPlus size={17} />} label="Review candidates" />
//               <QuickAction href="/dashboard/leaves" icon={<CalendarCheck size={17} />} label="Manage leaves" />
//               <QuickAction href="/dashboard/todos" icon={<ListTodo size={17} />} label="My task board" />
//               <QuickAction href="/dashboard/employees" icon={<Users size={17} />} label="Employee directory" />
//               <QuickAction href="/dashboard/leave-credit" icon={<CalendarCheck size={17} />} label="Credit leave balance" />
//               <QuickAction href="/dashboard/meetings" icon={<Activity size={17} />} label="Plan a meeting" />
//               <QuickAction href="/dashboard/settings/company" icon={<Sparkles size={17} />} label="Company settings" />
//             </div>
//           </CardContent>
//         </Card>
//       </section>
//     </main>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function KpiCard({ widgetKey }: { widgetKey: string }) {
//   const meta = META[widgetKey] || META['org-headcount'];
//   const { data, isLoading } = useQuery({ queryKey: ['dashboard', 'widget', widgetKey], queryFn: async () => (await api.get(`/dashboard/widget-data/${widgetKey}`)).data });
//   return (
//     <Card className="group h-[90px] overflow-hidden border-zinc-200/80 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
//       <CardContent className="relative flex h-full items-center gap-3 p-3">
//         <div className={`absolute right-0 top-0 h-14 w-14 translate-x-4 -translate-y-4 rounded-full opacity-[.11] ${meta.accent}`} />
//         <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white shadow-sm ${meta.accent}`}>{meta.icon}</span>
//         <div className="relative min-w-0 flex-1">
//           <div className="flex items-center justify-between gap-1">
//             <p className="text-xs font-medium text-zinc-500 truncate">{meta.title}</p>
//             <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-600"><TrendingUp size={11} />{meta.delta}</span>
//           </div>
//           <p className="text-xl font-semibold tracking-tight text-zinc-900">{isLoading ? '—' : valueFor(widgetKey, data, meta.fallback)}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function ChartCard({ title, subtitle, action, href, className = '', children }: { title: string; subtitle: string; action?: string; href?: string; className?: string; children: React.ReactNode }) {
//   return (
//     <Card className={`border-zinc-200/80 shadow-sm ${className}`}>
//       <CardContent className="p-4">
//         <div className="mb-2 flex items-start justify-between gap-3">
//           <div><h3 className="text-sm font-md text-zinc-900">{title}</h3><p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p></div>
//           {action && href && <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-xs font-md text-violet-700">{action}<ArrowRight size={13} /></Link>}
//         </div>
//         {children}
//       </CardContent>
//     </Card>
//   );
// }

// function Focus({ text, done = false }: { text: string; done?: boolean }) {
//   return (
//     <div className="flex items-center gap-2.5 text-xs text-zinc-600">
//       <span className={`grid h-5 w-5 place-items-center rounded-full border ${done ? 'border-emerald-200 bg-emerald-100 text-emerald-600' : 'border-zinc-200 bg-white text-transparent'}`}><CheckCircle2 size={12} /></span>
//       {text}
//     </div>
//   );
// }

// function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
//   return (
//     <Link href={href} className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs font-medium text-zinc-700 transition hover:border-violet-200 hover:bg-violet-50">
//       <span className="text-violet-600">{icon}</span>{label}<ArrowRight size={13} className="ml-auto text-zinc-400" />
//     </Link>
//   );
// }