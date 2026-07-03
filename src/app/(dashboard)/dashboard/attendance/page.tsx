'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock, CheckCircle2, History, Loader2, MapPin, AlertTriangle,
  ChevronLeft, ChevronRight, CalendarDays, Flame, ClipboardEdit,
  FileClock, Timer, Home, Info,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';
import {
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function formatHours(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

type DayCategory = 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent' | 'Weekly Off' | null;

const LATE_CUTOFF_MIN = 9 * 60 + 30; // 9:30 AM grace cutoff

function classifyDay(dateStr: string, record: any | undefined, isFuture: boolean): DayCategory {
  const isSunday = moment(dateStr).day() === 0;
  if (!record) {
    if (isFuture) return null;
    return isSunday ? 'Weekly Off' : 'Absent';
  }
  if (record.status === 'Half-Day') return 'Half Day';
  if (record.status === 'On Leave') return 'On Leave';
  if (record.status === 'Absent') return 'Absent';
  if (record.clockInTime) {
    const t = moment(record.clockInTime);
    if (t.hours() * 60 + t.minutes() > LATE_CUTOFF_MIN) return 'Late';
  }
  return 'Present';
}

const CATEGORY_STYLE: Record<string, { dot: string; badge: string; color: string }> = {
  'Present': { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', color: '#22c55e' },
  'Late': { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', color: '#f59e0b' },
  'Half Day': { dot: 'bg-purple-500', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', color: '#a855f7' },
  'On Leave': { dot: 'bg-sky-500', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400', color: '#0ea5e9' },
  'Weekly Off': { dot: 'bg-zinc-400', badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400', color: '#a1a1aa' },
  'Absent': { dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400', color: '#f43f5e' },
};

function TrendDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.value === null || payload.value === undefined) return null;
  const style = CATEGORY_STYLE[payload.category as string];
  return <circle cx={cx} cy={cy} r={3} fill={style?.color || '#6366f1'} stroke="#fff" strokeWidth={1} />;
}

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const todayStr = moment().format('YYYY-MM-DD');

  const [calendarMonth, setCalendarMonth] = useState(() => moment().startOf('month'));
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [view, setView] = useState<'calendar' | 'daily'>('calendar');
  const [weekOffset, setWeekOffset] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const itemsPerPage = 8;

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const { data: allRecords, isLoading } = useQuery({
    queryKey: ['my-attendance-all'],
    queryFn: async () => (await api.get('/attendance/my-attendance')).data as any[],
  });

  const { data: employeeRes } = useQuery({
    queryKey: ['current-employee'],
    queryFn: async () => (await api.get('/employees/current')).data,
  });
  const branch = employeeRes?.data?.branchId;

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setLocationError("Couldn't get your location. Allow location access and try again.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const clockInMutation = useMutation({
    mutationFn: async (location: { lat: number, lng: number }) => (await api.post('/attendance/clock-in', location)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-attendance-all'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const clockOutMutation = useMutation({
    mutationFn: async (location: { lat: number, lng: number }) => (await api.post('/attendance/clock-out', location)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-attendance-all'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleClockIn = () => { if (!userLocation) return requestLocation(); clockInMutation.mutate(userLocation); };
  const handleClockOut = () => { if (!userLocation) return requestLocation(); clockOutMutation.mutate(userLocation); };

  let distance: number | null = null;
  if (userLocation && branch?.lat && branch?.lng) {
    distance = getDistanceInMeters(userLocation.lat, userLocation.lng, branch.lat, branch.lng);
  }
  const isTooFar = distance !== null && distance > 50;

  const recordsByDate = useMemo(() => {
    const map: Record<string, any> = {};
    (allRecords || []).forEach((r: any) => { map[moment(r.date).format('YYYY-MM-DD')] = r; });
    return map;
  }, [allRecords]);

  const todayRecord = recordsByDate[todayStr];
  const isClockedOut = !!todayRecord?.clockOutTime;

  // ---- Weekly stats ----
  const weekStart = useMemo(() => moment().startOf('isoWeek').add(weekOffset, 'weeks'), [weekOffset]);
  const weekly = useMemo(() => {
    let presentDays = 0, workingDays = 0, hours = 0;
    for (let i = 0; i < 7; i++) {
      const d = moment(weekStart).add(i, 'days');
      if (d.day() !== 0) workingDays++;
      if (d.isAfter(moment(), 'day')) continue;
      const rec = recordsByDate[d.format('YYYY-MM-DD')];
      if (rec) {
        hours += rec.totalHours || 0;
        if (rec.status !== 'Absent') presentDays++;
      }
    }
    return { presentDays, workingDays, hours, targetHours: workingDays * 8 };
  }, [weekStart, recordsByDate]);

  // ---- Month-to-date stats ----
  const mtd = useMemo(() => {
    let present = 0, absent = 0, late = 0, workingDays = 0;
    const cursor = moment().startOf('month');
    const today = moment();
    while (cursor.isSameOrBefore(today, 'day')) {
      const dateStr = cursor.format('YYYY-MM-DD');
      const cat = classifyDay(dateStr, recordsByDate[dateStr], false);
      if (cat && cat !== 'Weekly Off') {
        workingDays++;
        if (cat === 'Present' || cat === 'Late') present++;
        if (cat === 'Absent') absent++;
        if (cat === 'Late') late++;
      }
      cursor.add(1, 'day');
    }
    return { present, absent, late, workingDays, pct: workingDays > 0 ? Math.round((present / workingDays) * 100) : 0 };
  }, [recordsByDate]);

  // ---- Streak ----
  const streak = useMemo(() => {
    const dates = Object.keys(recordsByDate).sort();
    if (dates.length === 0) return { current: 0, best: 0 };
    const cursor = moment(dates[0]);
    const today = moment();
    let run = 0, best = 0, current = 0;
    while (cursor.isSameOrBefore(today, 'day')) {
      const dateStr = cursor.format('YYYY-MM-DD');
      if (cursor.day() !== 0) {
        const cat = classifyDay(dateStr, recordsByDate[dateStr], false);
        if (cat && cat !== 'Absent') run++; else run = 0;
        best = Math.max(best, run);
        current = run;
      }
      cursor.add(1, 'day');
    }
    return { current, best };
  }, [recordsByDate]);

  // ---- Calendar grid ----
  const calendarDays = useMemo(() => {
    const startOfMonth = moment(calendarMonth).startOf('month');
    const endOfMonth = moment(calendarMonth).endOf('month');
    const gridStart = moment(startOfMonth).startOf('isoWeek');
    const gridEnd = moment(endOfMonth).endOf('isoWeek');
    const days: { date: moment.Moment; inMonth: boolean }[] = [];
    const cursor = moment(gridStart);
    while (cursor.isSameOrBefore(gridEnd, 'day')) {
      days.push({ date: moment(cursor), inMonth: cursor.month() === calendarMonth.month() });
      cursor.add(1, 'day');
    }
    return days;
  }, [calendarMonth]);

  // ---- Month summary (for donut) ----
  const monthSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    const start = moment(calendarMonth).startOf('month');
    const end = moment.min(moment(calendarMonth).endOf('month'), moment());
    const cursor = moment(start);
    let workingDaysElapsed = 0, presentIsh = 0;
    while (cursor.isSameOrBefore(end, 'day')) {
      const dateStr = cursor.format('YYYY-MM-DD');
      const cat = classifyDay(dateStr, recordsByDate[dateStr], false);
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
        if (cat !== 'Weekly Off') {
          workingDaysElapsed++;
          if (cat !== 'Absent') presentIsh++;
        }
      }
      cursor.add(1, 'day');
    }
    const totalDays = Object.values(counts).reduce((a, b) => a + b, 0);
    return {
      counts, workingDaysElapsed, totalDays,
      pct: workingDaysElapsed > 0 ? Math.round((presentIsh / workingDaysElapsed) * 100) : 0,
    };
  }, [calendarMonth, recordsByDate]);

  const pieData = useMemo(() => Object.entries(monthSummary.counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: CATEGORY_STYLE[name]?.color || '#a1a1aa' })),
    [monthSummary]);

  // ---- Trend (last 30 days) ----
  const trendData = useMemo(() => {
    const arr: { label: string; value: number | null; category: DayCategory }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = moment().subtract(i, 'days');
      const dateStr = d.format('YYYY-MM-DD');
      const cat = classifyDay(dateStr, recordsByDate[dateStr], false);
      let value: number | null = null;
      if (cat === 'Present' || cat === 'Late') value = 100;
      else if (cat === 'Half Day') value = 50;
      else if (cat === 'On Leave') value = 30;
      else if (cat === 'Absent') value = 0;
      arr.push({ label: d.format('DD MMM'), value, category: cat });
    }
    return arr;
  }, [recordsByDate]);

  const sortedLogs = allRecords || [];
  const totalLogPages = Math.max(1, Math.ceil(sortedLogs.length / itemsPerPage));

  const quickActions = [
    { label: 'Request Regularization', icon: ClipboardEdit, bg: 'bg-indigo-50 dark:bg-indigo-900/20', color: 'text-indigo-600', onClick: () => alert('Regularization requests are coming soon.') },
    { label: 'View Punch History', icon: History, bg: 'bg-sky-50 dark:bg-sky-900/20', color: 'text-sky-600', onClick: () => document.getElementById('attendance-logs')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
    { label: 'Attendance Correction', icon: FileClock, bg: 'bg-amber-50 dark:bg-amber-900/20', color: 'text-amber-600', onClick: () => alert('Attendance correction requests are coming soon.') },
    { label: 'My Timesheet', icon: Clock, bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-600', onClick: () => alert('Timesheet view is coming soon.') },
    { label: 'Overtime Request', icon: Timer, bg: 'bg-rose-50 dark:bg-rose-900/20', color: 'text-rose-600', onClick: () => alert('Overtime requests are coming soon.') },
    { label: 'Work From Home Request', icon: Home, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-600', onClick: () => alert('Work from home requests are coming soon.') },
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 px-4 sm:px-6 pt-4 pb-6 w-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">My Attendance</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Track your attendance, working hours and logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-1.5 py-1.5">
            <button onClick={() => setWeekOffset(o => o - 1)} className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 px-1 tabular-nums">
              {weekStart.format('DD MMM YYYY')} - {moment(weekStart).add(6, 'days').format('DD MMM YYYY')}
            </span>
            <button onClick={() => setWeekOffset(o => Math.min(0, o + 1))} disabled={weekOffset >= 0} className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
          <button
            onClick={() => alert('Regularization requests are coming soon.')}
            className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 transition-colors"
          >
            <ClipboardEdit size={13} /> Request Regularization
          </button>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Weekly Status</p>
              <p className="text-base font-semibold text-emerald-600 mt-1">{weekly.presentDays > 0 ? 'Present' : '—'}</p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{weekly.presentDays} Days</p>
              <p className="text-xs text-zinc-500">of {weekly.workingDays} Working Days</p>
            </div>
            <div className="h-11 w-11 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
              <CalendarDays size={20} className="text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Total Working Hours</p>
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{formatHours(weekly.hours)}</p>
            <p className="text-xs text-zinc-500">of {formatHours(weekly.targetHours)}</p>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, weekly.targetHours > 0 ? (weekly.hours / weekly.targetHours) * 100 : 0)}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-2">Attendance % (MTD)</p>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 rounded-full grid place-items-center shrink-0" style={{ background: `conic-gradient(#22c55e ${mtd.pct}%, #e4e4e7 0)` }}>
                <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-900 grid place-items-center text-xs font-semibold text-zinc-800 dark:text-zinc-100">{mtd.pct}%</div>
              </div>
              <div className="text-[11px] space-y-1 flex-1">
                <div className="flex justify-between gap-2"><span className="text-zinc-500">Present</span><span className="font-medium text-zinc-800 dark:text-zinc-200">{mtd.present}</span></div>
                <div className="flex justify-between gap-2"><span className="text-zinc-500">Absent</span><span className="font-medium text-zinc-800 dark:text-zinc-200">{mtd.absent}</span></div>
                <div className="flex justify-between gap-2"><span className="text-zinc-500">Late</span><span className="font-medium text-zinc-800 dark:text-zinc-200">{mtd.late}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
          <CardContent className="p-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Current Streak</p>
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mt-1">{streak.current} <span className="text-xs font-normal text-zinc-500">Days</span></p>
              <p className="text-[11px] text-zinc-400 mt-1">Best: {streak.best} Days</p>
            </div>
            <div className="h-11 w-11 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
              <Flame size={20} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
          <CardContent className="p-4">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Last Punch (Today)</p>
            {!todayRecord ? (
              <>
                <p className="text-sm font-medium text-zinc-500 mt-1">Not clocked in</p>
                {locationError && <p className="text-[10px] text-rose-500 mt-1">{locationError}</p>}
                {isTooFar && !locationError && <p className="text-[10px] text-amber-600 mt-1">Too far from {branch?.name || 'branch'} ({Math.round(distance!)} m)</p>}
                <button
                  onClick={handleClockIn}
                  disabled={clockInMutation.isPending || isLocating || !userLocation || isTooFar}
                  className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {(clockInMutation.isPending || isLocating) && <Loader2 size={13} className="animate-spin" />}
                  {isLocating ? 'Locating…' : 'Clock In'}
                </button>
              </>
            ) : !isClockedOut ? (
              <>
                <p className="text-base font-semibold text-emerald-600 mt-1">Check In</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">{moment(todayRecord.clockInTime).format('hh:mm A')}</p>
                <button
                  onClick={handleClockOut}
                  disabled={clockOutMutation.isPending || !userLocation || isTooFar}
                  className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {clockOutMutation.isPending && <Loader2 size={13} className="animate-spin" />}
                  Clock Out
                </button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-rose-600 mt-1">Check Out</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">{moment(todayRecord.clockOutTime).format('hh:mm A')}</p>
                <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1"><MapPin size={11} /> {branch?.name || 'Office'}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Calendar / Daily Log / Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="flex-row items-center justify-between gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-md p-0.5">
              <button onClick={() => setView('calendar')} className={`px-2.5 py-1 text-xs font-medium rounded ${view === 'calendar' ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>Calendar</button>
              <button onClick={() => setView('daily')} className={`px-2.5 py-1 text-xs font-medium rounded ${view === 'daily' ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>Daily View</button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCalendarMonth(m => moment(m).subtract(1, 'month'))} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"><ChevronLeft size={15} /></button>
              <span className="text-xs font-semibold w-24 text-center">{calendarMonth.format('MMMM YYYY')}</span>
              <button onClick={() => setCalendarMonth(m => moment(m).add(1, 'month'))} disabled={calendarMonth.isSame(moment(), 'month')} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded disabled:opacity-30"><ChevronRight size={15} /></button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {view === 'calendar' ? (
              <>
                <div className="grid grid-cols-7 text-center mb-0.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="text-[9px] font-semibold text-zinc-400 py-0.5">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {calendarDays.map(({ date, inMonth }) => {
                    const dateStr = date.format('YYYY-MM-DD');
                    const isFuture = date.isAfter(moment(), 'day');
                    const cat = classifyDay(dateStr, recordsByDate[dateStr], isFuture);
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDate;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-full py-1.5 rounded-md flex flex-col items-center justify-center gap-0.5 text-[11px] transition-colors
                          ${!inMonth ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-700 dark:text-zinc-300'}
                          ${isToday ? 'bg-indigo-600 text-white font-semibold' : isSelected ? 'ring-1 ring-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'}`}
                      >
                        {date.date()}
                        {cat && !isToday && <span className={`h-1 w-1 rounded-full ${CATEGORY_STYLE[cat].dot}`} />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  {Object.entries(CATEGORY_STYLE).map(([key, s]) => (
                    <div key={key} className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {key}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
                {calendarDays.filter(d => d.inMonth).map(({ date }) => {
                  const dateStr = date.format('YYYY-MM-DD');
                  const isFuture = date.isAfter(moment(), 'day');
                  const cat = classifyDay(dateStr, recordsByDate[dateStr], isFuture);
                  const isSelected = dateStr === selectedDate;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-300' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'}`}
                    >
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{date.format('DD MMM, ddd')}</span>
                      {cat ? <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${CATEGORY_STYLE[cat].badge}`}>{cat}</span> : <span className="text-[10px] text-zinc-300">—</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Daily Log - {moment(selectedDate).format('DD MMMM YYYY')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {(() => {
              const rec = recordsByDate[selectedDate];
              const isFuture = moment(selectedDate).isAfter(moment(), 'day');
              const cat = classifyDay(selectedDate, rec, isFuture);
              if (!cat) return <p className="text-xs text-zinc-400 text-center py-8">No data for this date yet.</p>;
              const style = CATEGORY_STYLE[cat];
              return (
                <>
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 mb-3 ${style.badge}`}>
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    <div>
                      <p className="text-sm font-semibold">{cat}</p>
                      {rec && branch?.name && <p className="text-[11px] opacity-80">Working from {branch.name}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 text-xs">Check In</span>
                      <span className="font-medium tabular-nums">{rec?.clockInTime ? moment(rec.clockInTime).format('hh:mm A') : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-500 text-xs">Check Out</span>
                      <span className="font-medium tabular-nums">{rec?.clockOutTime ? moment(rec.clockOutTime).format('hh:mm A') : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-zinc-500 text-xs">Total Working Hours</span>
                      <span className="font-semibold text-indigo-600">{rec?.totalHours ? formatHours(rec.totalHours) : '—'}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Attendance Summary ({calendarMonth.format('MMMM YYYY')})</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {pieData.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8">No attendance data for this month yet.</p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="h-[110px] w-[110px] relative shrink-0">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={35} outerRadius={52} paddingAngle={2} stroke="none">
                          {pieData.map(d => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{monthSummary.pct}%</span>
                      <span className="text-[9px] text-zinc-500">Attendance</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs flex-1">
                    {pieData.map(d => (
                      <div key={d.name} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />{d.name}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{d.value} Day{d.value !== 1 ? 's' : ''} ({monthSummary.totalDays > 0 ? Math.round((d.value / monthSummary.totalDays) * 100) : 0}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <span className="text-zinc-500">Working Days <b className="text-zinc-800 dark:text-zinc-200 ml-1">{monthSummary.workingDaysElapsed}</b></span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Logs / Trend / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[10fr_7fr_7fr] gap-4">
        <Card id="attendance-logs" className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
              <History size={16} className="text-indigo-600 dark:text-indigo-400" /> Attendance Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-6 text-center text-[13px] text-zinc-500 flex flex-col items-center gap-2">
                <Loader2 size={18} className="animate-spin text-zinc-400" /> Loading history…
              </div>
            ) : sortedLogs.length === 0 ? (
              <div className="m-3 py-6 flex flex-col items-center justify-center text-center text-zinc-400 border border-dashed rounded-lg dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                <History size={24} className="mb-2 text-zinc-300 dark:text-zinc-700" />
                <p className="font-medium text-zinc-600 dark:text-zinc-400 text-sm">No attendance records yet</p>
                <p className="text-xs text-zinc-500 mt-0.5">Clock in today to start your track.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col">
                <div className="w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50">
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Date</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Day</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Check In</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Check Out</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Hours</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLogs.slice((logsPage - 1) * itemsPerPage, logsPage * itemsPerPage).map((record: any) => (
                        <tr key={record._id} className="border-b border-zinc-100 last:border-0 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 dark:border-zinc-800/70">
                          <td className="px-4 py-2.5 align-middle font-medium text-zinc-900 dark:text-zinc-100">{moment(record.date).format('MMM DD, YYYY')}</td>
                          <td className="px-4 py-2.5 align-middle text-zinc-500 dark:text-zinc-400">{moment(record.date).format('ddd')}</td>
                          <td className="px-4 py-2.5 align-middle font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{record.clockInTime ? moment(record.clockInTime).format('hh:mm A') : '—'}</td>
                          <td className="px-4 py-2.5 align-middle font-medium text-rose-600 dark:text-rose-400 tabular-nums">{record.clockOutTime ? moment(record.clockOutTime).format('hh:mm A') : '—'}</td>
                          <td className="px-4 py-2.5 align-middle text-zinc-600 dark:text-zinc-400 tabular-nums">{record.totalHours ? formatHours(record.totalHours) : '—'}</td>
                          <td className="px-4 py-2.5 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {sortedLogs.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-xs text-zinc-500">
                      Showing {(logsPage - 1) * itemsPerPage + 1} to {Math.min(logsPage * itemsPerPage, sortedLogs.length)} of {sortedLogs.length} entries
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => setLogsPage(p => Math.max(1, p - 1))} disabled={logsPage === 1} className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Prev</button>
                      <button onClick={() => setLogsPage(p => Math.min(totalLogPages, p + 1))} disabled={logsPage >= totalLogPages} className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Attendance Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, left: -20, right: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f1f4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} interval={4} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} width={28} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} labelFormatter={(l) => l} formatter={(_v: any, _n: any, p: any) => [p.payload.category || 'No data', 'Status']} />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={<TrendDot />} connectNulls={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-2.5 grid grid-cols-2 gap-1.5">
              {quickActions.map(a => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="flex flex-col items-center gap-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors text-center"
                >
                  <div className={`h-6 w-6 rounded-md flex items-center justify-center ${a.bg}`}>
                    <a.icon size={13} className={a.color} />
                  </div>
                  <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 leading-tight">{a.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5"><Info size={13} className="text-indigo-500" /> Note</p>
              <ul className="flex flex-col gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 list-disc list-inside">
                <li>Please ensure to check-in within office timing.</li>
                <li>Late arrivals beyond grace time will be marked.</li>
                <li>Regularize your attendance within 2 working days.</li>
                <li>Contact HR for any attendance related queries.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
