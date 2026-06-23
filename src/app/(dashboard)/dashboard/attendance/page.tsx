'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, History, Loader2, TrendingUp, Users, MapPin, AlertTriangle, LogOut } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

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

export default function AttendancePage() {
  const queryClient = useQueryClient();
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [myPage, setMyPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);
  const itemsPerPage = 10;

  const { data: myAttendance, isLoading } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: async () => (await api.get('/attendance/my-attendance')).data,
  });

  const { data: tenantAttendance } = useQuery({
    queryKey: ['tenant-attendance'],
    queryFn: async () => (await api.get('/attendance/tenant-attendance')).data,
    retry: false,
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
      setLocationError("Geolocation is not supported by your browser.");
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-attendance'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const clockOutMutation = useMutation({
    mutationFn: async (location: { lat: number, lng: number }) => (await api.post('/attendance/clock-out', location)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-attendance'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleClockIn = () => {
    if (!userLocation) return requestLocation();
    clockInMutation.mutate(userLocation);
  };

  const handleClockOut = () => {
    if (!userLocation) return requestLocation();
    clockOutMutation.mutate(userLocation);
  };

  const todayStr = moment().startOf('day').format();
  const todayRecord = myAttendance?.find((r: any) => moment(r.date).isSame(moment(todayStr), 'day'));

  const isClockedIn = !!todayRecord;
  const isClockedOut = !!todayRecord?.clockOutTime;

  let distance = null;
  if (userLocation && branch?.lat && branch?.lng) {
    distance = getDistanceInMeters(userLocation.lat, userLocation.lng, branch.lat, branch.lng);
  }

  const isTooFar = distance !== null && distance > 50;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 w-full">
      {/* Page header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">My Attendance</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Mark your daily presence from your assigned branch</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/out-in" className="text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-700 px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors">
            <LogOut size={13} /> Short Excursions
          </Link>
          <Link href="/dashboard/leave-statistics" className="text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-700 px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors">
            <TrendingUp size={13} /> Leave Statistics
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Time clock column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
              <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Time Clock &amp; Location</CardTitle>
            </div>

            <CardContent className="p-0">
              {/* Map */}
              <div className="bg-zinc-100 dark:bg-zinc-900 h-[200px] w-full relative">
                {userLocation ? (
                  <iframe
                    title="Your current location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=16&output=embed`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
                    <MapPin size={28} className="opacity-50" />
                    <p className="text-[13px]">{isLocating ? 'Acquiring GPS signal…' : 'Location map unavailable'}</p>
                  </div>
                )}

                {distance !== null && (
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1.5 border backdrop-blur-md ${isTooFar ? 'bg-rose-500/90 text-white border-rose-600/40' : 'bg-emerald-500/90 text-white border-emerald-600/40'}`}>
                    {isTooFar ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    {distance > 1000 ? (distance / 1000).toFixed(1) + ' km' : Math.round(distance) + ' m'} from branch
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Clock readout */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="text-[44px] leading-none font-light tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                    {moment().format('HH:mm')}
                  </div>
                  <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1.5">
                    {moment().format('dddd, MMMM Do YYYY')}
                  </div>
                </div>

                {locationError && (
                  <div className="mb-3 bg-rose-50 text-rose-700 text-[13px] p-3 rounded-md border border-rose-100 flex items-start gap-2 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-300">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <p className="font-semibold">Location error</p>
                      <p className="mt-0.5">{locationError}</p>
                    </div>
                  </div>
                )}

                {isTooFar && !locationError && (
                  <div className="mb-3 bg-amber-50 text-amber-800 text-[13px] p-3 rounded-md border border-amber-200 flex items-start gap-2 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300">
                    <MapPin size={15} className="shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">Out of range</p>
                      <p className="mt-0.5">Be within 50 m of <b>{branch?.name || 'your assigned branch'}</b> to mark attendance.</p>
                      <button onClick={requestLocation} className="text-amber-700 dark:text-amber-300 underline font-medium mt-1 hover:text-amber-900 dark:hover:text-amber-200">
                        Refresh location
                      </button>
                    </div>
                  </div>
                )}

                {!userLocation && !locationError && !isLocating && (
                  <button onClick={requestLocation} className="w-full mb-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[13px] font-medium py-2 rounded-md transition-colors border border-zinc-200 flex items-center justify-center gap-2 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                    <MapPin size={15} /> Fetch location automatically
                  </button>
                )}

                {/* Action */}
                <div className="w-full flex flex-col gap-2.5">
                  {!isClockedIn ? (
                    <button
                      onClick={handleClockIn}
                      disabled={clockInMutation.isPending || isLoading || !userLocation || isTooFar}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {clockInMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                      {!userLocation ? 'Getting location…' : 'Clock in now'}
                    </button>
                  ) : !isClockedOut ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="text-center text-[13px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                        Clocked in at {moment(todayRecord.clockInTime).format('hh:mm A')}
                      </div>
                      <button
                        onClick={handleClockOut}
                        disabled={clockOutMutation.isPending || isLoading || !userLocation || isTooFar}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold py-3 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {clockOutMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                        {!userLocation ? 'Getting location…' : 'Clock out'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-[13px] text-zinc-600 font-medium py-3 bg-zinc-50 rounded-lg border border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      Shift completed for today
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                <History size={16} className="text-indigo-600 dark:text-indigo-400" />
                Recent History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-10 text-center text-[13px] text-zinc-500 flex flex-col items-center gap-2">
                  <Loader2 size={20} className="animate-spin text-zinc-400" />
                  Loading history…
                </div>
              ) : myAttendance?.length === 0 ? (
                <div className="m-4 py-10 flex flex-col items-center justify-center text-center text-zinc-400 border border-dashed rounded-lg dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                  <History size={32} className="mb-3 text-zinc-300 dark:text-zinc-700" />
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
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Clock In</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Clock Out</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Hours</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-semibold text-zinc-500 dark:text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAttendance?.slice((myPage - 1) * itemsPerPage, myPage * itemsPerPage).map((record: any) => (
                        <tr key={record._id} className="border-b border-zinc-100 last:border-0 transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 dark:border-zinc-800/70">
                          <td className="px-4 py-2.5 align-middle font-medium text-zinc-900 dark:text-zinc-100">{moment(record.date).format('MMM DD, YYYY')}</td>
                          <td className="px-4 py-2.5 align-middle font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{moment(record.clockInTime).format('hh:mm A')}</td>
                          <td className="px-4 py-2.5 align-middle font-medium text-rose-600 dark:text-rose-400 tabular-nums">{record.clockOutTime ? moment(record.clockOutTime).format('hh:mm A') : '—'}</td>
                          <td className="px-4 py-2.5 align-middle text-zinc-600 dark:text-zinc-400 tabular-nums">{record.totalHours ? record.totalHours.toFixed(2) + ' hrs' : '—'}</td>
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
                {myAttendance && myAttendance.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-xs text-zinc-500">
                      Showing {(myPage - 1) * itemsPerPage + 1} to {Math.min(myPage * itemsPerPage, myAttendance.length)} of {myAttendance.length} entries
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setMyPage(p => Math.max(1, p - 1))}
                        disabled={myPage === 1}
                        className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setMyPage(p => Math.min(Math.ceil(myAttendance.length / itemsPerPage), p + 1))}
                        disabled={myPage >= Math.ceil((myAttendance?.length || 0) / itemsPerPage)}
                        className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </div>
              )}
            </CardContent>
          </Card>

          {tenantAttendance && tenantAttendance.length > 0 && (
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                  <Users size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Company Attendance
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5">Admin</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full flex flex-col">
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="h-9 px-4 text-left align-middle text-xs font-medium text-zinc-500">Employee</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-medium text-zinc-500">Date</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-medium text-zinc-500">In / Out</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-medium text-zinc-500">Hours</th>
                        <th className="h-9 px-4 text-left align-middle text-xs font-medium text-zinc-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenantAttendance?.slice((companyPage - 1) * itemsPerPage, companyPage * itemsPerPage).map((record: any) => (
                        <tr key={record._id} className="border-b border-zinc-100 last:border-0 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30 dark:border-zinc-800/70">
                          <td className="px-4 py-2.5 align-middle">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">{record.userId?.firstName} {record.userId?.lastName}</p>
                            <p className="text-xs text-zinc-500">{record.userId?.email}</p>
                          </td>
                          <td className="px-4 py-2.5 align-middle text-zinc-600 dark:text-zinc-400">{moment(record.date).format('MMM DD')}</td>
                          <td className="px-4 py-2.5 align-middle tabular-nums">
                            <span className="text-emerald-600 font-medium">{moment(record.clockInTime).format('HH:mm')}</span>
                            <span className="text-zinc-400 mx-1">–</span>
                            <span className="text-rose-600 font-medium">{record.clockOutTime ? moment(record.clockOutTime).format('HH:mm') : '··'}</span>
                          </td>
                          <td className="px-4 py-2.5 align-middle text-zinc-600 dark:text-zinc-400 tabular-nums">{record.totalHours ? record.totalHours.toFixed(1) + 'h' : '—'}</td>
                          <td className="px-4 py-2.5 align-middle">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${record.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tenantAttendance && tenantAttendance.length > itemsPerPage && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <span className="text-xs text-zinc-500">
                      Showing {(companyPage - 1) * itemsPerPage + 1} to {Math.min(companyPage * itemsPerPage, tenantAttendance.length)} of {tenantAttendance.length} entries
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCompanyPage(p => Math.max(1, p - 1))}
                        disabled={companyPage === 1}
                        className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setCompanyPage(p => Math.min(Math.ceil(tenantAttendance.length / itemsPerPage), p + 1))}
                        disabled={companyPage >= Math.ceil((tenantAttendance?.length || 0) / itemsPerPage)}
                        className="px-2.5 py-1 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-md disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  );
}