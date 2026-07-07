'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, Loader2, CalendarDays, Edit3, ShieldAlert, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import moment from 'moment';

export default function HRAttendanceOverridePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));

  const [existingRecord, setExistingRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    clockInTime: '',
    clockOutTime: '',
    status: 'Present',
    reason: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedUser && selectedDate) {
      fetchAttendance();
    } else {
      setExistingRecord(null);
      setFormData({ clockInTime: '', clockOutTime: '', status: 'Present', reason: '' });
    }
  }, [selectedUser, selectedDate]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?limit=1000');
      setEmployees(res.data.data || []);
    } catch (e: any) {
      setError('Failed to load employees');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get(`/attendance/tenant-attendance?date=${selectedDate}`);
      const records = res.data || [];
      const userRecord = records.find((r: any) => r.userId?._id === selectedUser || r.userId === selectedUser);

      if (userRecord) {
        setExistingRecord(userRecord);
        setFormData({
          clockInTime: userRecord.clockInTime ? moment(userRecord.clockInTime).format('HH:mm') : '',
          clockOutTime: userRecord.clockOutTime ? moment(userRecord.clockOutTime).format('HH:mm') : '',
          status: userRecord.status || 'Present',
          reason: ''
        });
      } else {
        setExistingRecord(null);
        setFormData({
          clockInTime: '09:00',
          clockOutTime: '18:00',
          status: 'Present',
          reason: ''
        });
      }
    } catch (e: any) {
      setError('Failed to load attendance record');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedDate) {
      return setError('Please select an employee and date');
    }
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      userId: selectedUser,
      date: selectedDate,
      clockInTime: formData.clockInTime ? `${selectedDate}T${formData.clockInTime}:00` : null,
      clockOutTime: formData.clockOutTime ? `${selectedDate}T${formData.clockOutTime}:00` : null,
      status: formData.status,
      reason: formData.reason
    };

    try {
      if (existingRecord) {
        await api.put(`/attendance/hr-override/${existingRecord._id}`, payload);
        setSuccess('Attendance updated successfully');
      } else {
        await api.post('/attendance/hr-override', payload);
        setSuccess('Attendance created successfully');
      }
      fetchAttendance();

      // Auto-dismiss success after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100";
  const labelClass = "text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400";

  return (
    <div className="min-h-full pb-8 bg-zinc-50/40 dark:bg-zinc-950 -m-6 p-5 lg:p-8">
      <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">

        {/* Header */}
        <header className="flex items-start gap-3 mb-5 pb-4 border-b border-zinc-200/70 dark:border-zinc-800">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Attendance Override</h1>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-xl">
              Manually create or correct employee attendance records. All actions here are logged for compliance.
            </p>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] font-medium text-rose-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-200">
            <XCircle size={16} className="text-rose-500 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-200">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* LEFT: Selection */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Target Selection</CardTitle>
                <CardDescription className="text-xs">Choose the employee and date to override.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-4">
                <div className="space-y-1.5 group">
                  <label className={labelClass}>
                    <User size={13} /> Employee
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose employee…</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.firstName} {emp.lastName} ({emp.employeeId || emp.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 group">
                  <label className={labelClass}>
                    <CalendarDays size={13} /> Target Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Note */}
            <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/30 flex items-start gap-2.5">
              <ShieldAlert size={16} className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <p className="text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-200/70">
                Overrides affect payroll and leave calculations. Confirm you have authorization before modifying existing data.
              </p>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="lg:col-span-8">
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden h-full flex flex-col">
              {(!selectedUser || !selectedDate) ? (
                // Empty
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center min-h-[420px]">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                    <Edit3 size={26} className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Awaiting selection</h3>
                  <p className="text-zinc-500 max-w-xs text-[13px] leading-relaxed">
                    Select an employee and date on the left to view or modify their attendance record.
                  </p>
                </div>
              ) : loading ? (
                // Loading
                <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[420px]">
                  <div className="relative w-10 h-10">
                    <div className="w-10 h-10 rounded-full border-[3px] border-indigo-100 dark:border-indigo-900/30"></div>
                    <div className="w-10 h-10 rounded-full border-[3px] border-indigo-600 dark:border-indigo-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-[13px] font-medium text-zinc-500 mt-3">Retrieving records…</p>
                </div>
              ) : (
                // Form
                <div className="flex-1 flex flex-col animate-in fade-in duration-200">
                  <div className={`px-5 py-3 border-b flex items-center gap-3 ${existingRecord ? 'bg-amber-50/60 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30' : 'bg-emerald-50/60 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30'}`}>
                    <div className={`p-1.5 rounded-md ${existingRecord ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'}`}>
                      {existingRecord ? <Edit3 size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <h3 className={`text-[13px] font-semibold ${existingRecord ? 'text-amber-900 dark:text-amber-200' : 'text-emerald-900 dark:text-emerald-200'}`}>
                        {existingRecord ? 'Editing existing record' : 'Creating new record'}
                      </h3>
                      <p className={`text-xs ${existingRecord ? 'text-amber-700/70 dark:text-amber-400/70' : 'text-emerald-700/70 dark:text-emerald-400/70'}`}>
                        {moment(selectedDate).format('dddd, MMMM Do YYYY')}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="p-5 flex-1 flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 group">
                        <label className={labelClass}>Check-In Time</label>
                        <input
                          type="time"
                          value={formData.clockInTime}
                          onChange={(e) => setFormData({ ...formData, clockInTime: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1.5 group">
                        <label className={labelClass}>Check-Out Time</label>
                        <input
                          type="time"
                          value={formData.clockOutTime}
                          onChange={(e) => setFormData({ ...formData, clockOutTime: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label className={labelClass}>Attendance Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={inputClass}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half-Day">Half-Day</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 group flex-1">
                      <label className={labelClass}>Reason for Override (Optional)</label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Provide administrative justification for this override…"
                        rows={3}
                        className="w-full rounded-lg border border-zinc-200 bg-white p-3 text-sm font-medium resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none transition-all dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                      />
                    </div>

                    <div className="pt-4 mt-auto border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-10 rounded-lg shadow-sm font-semibold text-sm transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-60"
                      >
                        {saving ? (
                          <><Loader2 size={16} className="animate-spin" /> Saving…</>
                        ) : (
                          <>Save override <ChevronRight size={16} /></>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}