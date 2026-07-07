'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';
import {
  Calendar, Video, Clock, MapPin, Navigation, CheckCircle2, Building2,
  Plus, Search, Filter, MoreVertical, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { getCurrentPosition, haversineKm } from '@/lib/geo';
import { geocodeAddress } from '@/lib/geocode';
import moment from 'moment';

type MeetingMode = 'Online' | 'Field';
const PAGE_SIZE = 5;
const STATUS_LABELS: Record<string, string> = { Scheduled: 'Upcoming' };
const statusLabel = (s: string) => STATUS_LABELS[s] || s;

const STATUS_STYLES: Record<string, { text: string; bg: string }> = {
  Scheduled: { text: '#4338ca', bg: '#e0e7ff' },
  Ongoing: { text: '#15803d', bg: '#dcfce7' },
  Completed: { text: '#52525b', bg: '#f4f4f5' },
  Postponed: { text: '#b45309', bg: '#fef3c7' },
  Cancelled: { text: '#be123c', bg: '#ffe4e6' },
};
const statusStyle = (s: string) => STATUS_STYLES[s] || { text: '#4338ca', bg: '#e0e7ff' };

function Avatar({ person, size = 28 }: { person: any; size?: number }) {
  if (person?.profilePictureUrl) {
    return (
      <img
        src={person.profilePictureUrl}
        alt={person.firstName || ''}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border-2 border-white dark:border-zinc-900 shrink-0"
      />
    );
  }
  const initials = person?.firstName ? person.firstName[0].toUpperCase() : '?';
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-indigo-100 text-indigo-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-semibold shrink-0"
    >
      {initials}
    </div>
  );
}

function AvatarStack({ people, max = 3 }: { people: any[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((p, i) => <Avatar key={p?._id || i} person={p} />)}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-[11px] text-zinc-500 font-medium">+{extra} more</span>
      )}
    </div>
  );
}

export default function MeetingsPage() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMeetingId, setEditMeetingId] = useState<string | null>(null);
  const [currentPos, setCurrentPos] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Could not get live location', err)
      );
    }
  }, []);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<'All' | MeetingMode>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState(() => moment().format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [mode, setMode] = useState<MeetingMode>('Online');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);

  const { data: statusData } = useQuery({
    queryKey: ['master-data', 'statuses', 'Meeting'],
    queryFn: async () => (await api.get('/master-data/statuses', { params: { category: 'Meeting', limit: 50 } })).data,
  });
  const meetingStatuses: string[] = useMemo(() => {
    const items = statusData?.data || [];
    const names = items.map((s: any) => s.name as string);
    return names.length > 0 ? names : ['Scheduled', 'Ongoing', 'Completed', 'Postponed', 'Cancelled'];
  }, [statusData]);

  const { data: allMeetings, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => (await api.get('/meetings')).data,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees', 'picker'],
    queryFn: async () => (await api.get('/employees')).data,
    retry: false,
  });
  const employeeList = Array.isArray(employees) ? employees : employees?.data || [];
  const employeeOptions = useMemo(
    () => employeeList.map((emp: any) => ({ label: `${emp.firstName} ${emp.lastName || ''}`.trim(), value: emp._id })),
    [employeeList]
  );

  const counts = useMemo(() => {
    const list = Array.isArray(allMeetings) ? allMeetings : [];
    const c: Record<string, number> = { All: list.length };
    meetingStatuses.forEach((s) => { c[s] = 0; });
    list.forEach((m: any) => { c[m.status] = (c[m.status] || 0) + 1; });
    return c;
  }, [allMeetings, meetingStatuses]);

  const statusTabs = useMemo(() => ['All', ...meetingStatuses], [meetingStatuses]);

  const filteredMeetings = useMemo(() => {
    let list = Array.isArray(allMeetings) ? allMeetings : [];
    if (statusFilter !== 'All') list = list.filter((m: any) => m.status === statusFilter);
    if (modeFilter !== 'All') list = list.filter((m: any) => m.mode === modeFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((m: any) => m.title.toLowerCase().includes(q));
    }
    return list;
  }, [allMeetings, statusFilter, modeFilter, searchTerm]);

  useEffect(() => { setPage(1); }, [statusFilter, modeFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredMeetings.length / PAGE_SIZE));
  const pageMeetings = filteredMeetings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Distance & time gap from the previous Field meeting with captured coordinates,
  // computed off the full chronological list so filtering the view doesn't change it.
  const meetingGaps = useMemo(() => {
    const gaps = new Map<string, { km: number; formattedTime: string; from: string }>();
    const list = Array.isArray(allMeetings)
      ? [...allMeetings].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      : [];

    let prevFieldMeeting: any = null;
    for (const m of list) {
      if (m.mode === 'Field' && typeof m.lat === 'number' && typeof m.lng === 'number') {
        if (prevFieldMeeting) {
          // Only calculate travel gap if the meetings are on the exact same day
          const isSameDay = moment(m.startTime).isSame(moment(prevFieldMeeting.startTime), 'day');
          if (isSameDay) {
            const km = haversineKm({ lat: prevFieldMeeting.lat, lng: prevFieldMeeting.lng }, { lat: m.lat, lng: m.lng });
            const diffSeconds = moment(m.startTime).diff(moment(prevFieldMeeting.endTime), 'seconds');

            let formattedTime = '';
            if (diffSeconds < 0) {
              formattedTime = 'overlapping';
            } else {
              const h = Math.floor(diffSeconds / 3600);
              const min = Math.floor((diffSeconds % 3600) / 60);
              formattedTime = h > 0 ? `${h} hr ${min} min gap` : `${min} min gap`;
            }
            gaps.set(m._id, { km, formattedTime, from: prevFieldMeeting.title });
          }
        }
        prevFieldMeeting = m;
      }
    }
    return gaps;
  }, [allMeetings]);

  const resetForm = () => {
    setEditMeetingId(null);
    setTitle('');
    setDescription('');
    setMeetingDate(moment().format('YYYY-MM-DD'));
    setStartTime('');
    setEndTime('');
    setMeetingLink('');
    setLocation('');
    setAddress('');
    setPincode('');
    setCity('');
    setState('');
    setCountry('India');
    setCoords(null);
    setMode('Online');
    setAttendeeIds([]);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/meetings', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      resetForm();
      setIsModalOpen(false);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => (await api.put(`/meetings/${editMeetingId}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      resetForm();
      setIsModalOpen(false);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => (await api.put(`/meetings/${id}/status`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    let createdLat: number | undefined;
    let createdLng: number | undefined;
    try {
      const pos = await getCurrentPosition();
      createdLat = pos.coords.latitude;
      createdLng = pos.coords.longitude;
    } catch (err) {
      console.warn('Could not capture live creation location:', err);
    }

    const payload = {
      title, description, attendeeIds, mode, location,
      startTime: `${meetingDate}T${startTime}`,
      endTime: `${meetingDate}T${endTime}`,
      meetingLink,
      ...(mode === 'Field' ? { address, pincode, city, state, country, lat: coords?.lat, lng: coords?.lng, createdLat, createdLng } : {}),
    };
    if (editMeetingId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const openEdit = (meeting: any) => {
    setEditMeetingId(meeting._id);
    setTitle(meeting.title || '');
    setDescription(meeting.description || '');
    setMeetingDate(moment(meeting.startTime).format('YYYY-MM-DD'));
    setStartTime(moment(meeting.startTime).format('HH:mm'));
    setEndTime(moment(meeting.endTime).format('HH:mm'));
    setMode(meeting.mode || 'Online');
    setMeetingLink(meeting.meetingLink || '');
    setLocation(meeting.location || '');
    setAddress(meeting.address || '');
    setPincode(meeting.pincode || '');
    setCity(meeting.city || '');
    setState(meeting.state || '');
    setCountry(meeting.country || 'India');
    setAttendeeIds(meeting.attendeeIds?.map((a: any) => a._id) || []);
    if (meeting.lat && meeting.lng) setCoords({ lat: meeting.lat, lng: meeting.lng });
    setIsModalOpen(true);
  };

  const handlePincodeChange = async (val: string) => {
    setPincode(val);
    if (val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setCity(po.District);
          setState(po.State);
          setCountry(po.Country || 'India');
        }
      } catch (err) {
        console.error('Failed to fetch pincode details', err);
      }
    }
  };

  const handleDetectLocation = async () => {
    const queries = [
      [address, city, state, pincode, country].filter(Boolean).join(', '),
      [city, state, pincode, country].filter(Boolean).join(', '),
      [city, state, country].filter(Boolean).join(', '),
    ].filter(q => q.length > 0);

    if (queries.length === 0) {
      alert('Please enter address details to fetch coordinates.');
      return;
    }
    setDetecting(true);
    try {
      const geoCoords = await geocodeAddress(queries);
      if (geoCoords) {
        setCoords(geoCoords);
      } else {
        alert('Could not find coordinates for this address. Try simplifying it.');
      }
    } catch (err: any) {
      alert(err.message || 'Could not fetch coordinates');
    } finally {
      setDetecting(false);
    }
  };

  const canTransition = (meeting: any) =>
    meeting.organizerId?._id === (user?._id || user?.id) || (meeting.attendeeIds || []).some((a: any) => a._id === (user?._id || user?.id));
  const getBranchDistance = (meeting: any) => {
    const branch = meeting.organizerId?.branchId;
    if (meeting.mode !== 'Field' || typeof meeting.lat !== 'number' || typeof meeting.lng !== 'number') return null;
    if (!branch || typeof branch.lat !== 'number' || typeof branch.lng !== 'number') return null;
    return { km: haversineKm({ lat: branch.lat, lng: branch.lng }, { lat: meeting.lat, lng: meeting.lng }), branchName: branch.name };
  };

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Meetings</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Schedule & join meetings with your team or clients</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-8">
          <Plus size={16} /> Schedule Meeting
        </Button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex-wrap">
          {statusTabs.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 ${statusFilter === s ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400'}`}
            >
              {s === 'All' ? 'All' : statusLabel(s)}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusFilter === s ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700'}`}>
                {counts[s] || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meetings..."
              className="pl-8 pr-3 py-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 w-56"
            />
          </div>
          <details className="relative">
            <summary className="list-none cursor-pointer p-2 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Filter size={14} />
            </summary>
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg p-1 z-20">
              {(['All', 'Online', 'Field'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeFilter(m)}
                  className={`w-full text-left text-xs px-2 py-1.5 rounded ${modeFilter === m ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                >
                  {m === 'All' ? 'All Modes' : m}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          {statusFilter === 'All' ? 'All Meetings' : `${statusLabel(statusFilter)} Meetings`}
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-sm text-zinc-500">Loading meetings...</div>
        ) : filteredMeetings.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500">No meetings found.</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {pageMeetings.map((meeting: any) => {
              const gap = meetingGaps.get(meeting._id);
              const isCancelled = meeting.status === 'Cancelled';
              const isCompleted = meeting.status === 'Completed';
              const style = statusStyle(meeting.status);
              const people = [...new Map(
                [meeting.organizerId, ...(meeting.attendeeIds || [])].filter(Boolean).map((p: any) => [p._id, p])
              ).values()];
              const start = moment(meeting.startTime);
              const branchDistance = getBranchDistance(meeting);
              const branch = meeting.organizerId?.branchId;
              const createdDistance = meeting.mode === 'Field' && typeof meeting.lat === 'number' && typeof meeting.lng === 'number' && typeof meeting.createdLat === 'number' && typeof meeting.createdLng === 'number'
                ? haversineKm({ lat: meeting.createdLat, lng: meeting.createdLng }, { lat: meeting.lat, lng: meeting.lng })
                : null;
              const currentToSiteDistance = meeting.mode === 'Field' && typeof meeting.lat === 'number' && typeof meeting.lng === 'number' && currentPos != null
                ? haversineKm(currentPos, { lat: meeting.lat, lng: meeting.lng })
                : null;
              const currentToBranchDistance = branch?.lat != null && branch?.lng != null && currentPos != null
                ? haversineKm(currentPos, { lat: branch.lat, lng: branch.lng })
                : null;

              return (
                <div key={meeting._id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  <div className="w-16 shrink-0 text-center rounded-lg border border-zinc-100 dark:border-zinc-800 py-1.5">
                    <div className="text-[9px] font-semibold uppercase" style={{ color: style.text }}>{statusLabel(meeting.status)}</div>
                    <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">{start.format('DD')}</div>
                    <div className="text-[10px] text-zinc-400">{start.format('MMM YYYY')}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate ${isCancelled ? 'line-through opacity-50' : ''}`}>{meeting.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {start.format('hh:mm A')} - {moment(meeting.endTime).format('hh:mm A')}</span>
                      <span className="inline-flex items-center gap-1">
                        {meeting.mode === 'Field' ? <MapPin size={11} /> : <Video size={11} />}
                        {meeting.mode}{meeting.mode === 'Field' && (meeting.location || meeting.city) ? ` · ${meeting.location || meeting.city}` : ''}
                      </span>
                    </div>
                    {gap && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Navigation size={11} /> {gap.km.toFixed(1)} km, {gap.formattedTime} from &quot;{gap.from}&quot;
                      </div>
                    )}
                    {branchDistance && (
                      <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-0.5 flex items-center gap-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 size={11} />
                          {branchDistance.km < 0.05
                            ? `At ${branchDistance.branchName} branch`
                            : `${branchDistance.km.toFixed(1)} km from ${branchDistance.branchName} branch`}
                        </span>
                        {branchDistance.km >= 0.05 && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 ml-1">
                            <Clock size={11} /> ~{Math.floor(Math.round((branchDistance.km / 40) * 60) / 60) > 0 ? `${Math.floor(Math.round((branchDistance.km / 40) * 60) / 60)}h ${Math.round((branchDistance.km / 40) * 60) % 60}m` : `${Math.round((branchDistance.km / 40) * 60)} min`} drive
                          </span>
                        )}
                      </div>
                    )}
                    {createdDistance != null && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {createdDistance.toFixed(1)} km from creation location
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 ml-1">
                          <Clock size={11} /> ~{Math.floor(Math.round((createdDistance / 40) * 60) / 60) > 0 ? `${Math.floor(Math.round((createdDistance / 40) * 60) / 60)}h ${Math.round((createdDistance / 40) * 60) % 60}m` : `${Math.round((createdDistance / 40) * 60)} min`} drive
                        </span>
                      </div>
                    )}

                    {currentToBranchDistance != null && (
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Navigation size={11} />
                          {currentToBranchDistance.toFixed(1)} km from your location to branch
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 ml-1">
                          <Clock size={11} /> ~{Math.floor(Math.round((currentToBranchDistance / 40) * 60) / 60) > 0 ? `${Math.floor(Math.round((currentToBranchDistance / 40) * 60) / 60)}h ${Math.round((currentToBranchDistance / 40) * 60) % 60}m` : `${Math.round((currentToBranchDistance / 40) * 60)} min`} drive
                        </span>
                      </div>
                    )}
                    <div className="mt-2">
                      <AvatarStack people={people} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {meeting.meetingLink && !isCancelled && !isCompleted && (
                      <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="text-xs font-medium border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                        Join Meeting
                      </a>
                    )}
                    <Link href={`/company/meetings/${meeting._id}`} className="text-xs font-medium border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 transition-colors">
                      View Details
                    </Link>
                    <Link href={`/company/meetings/${meeting._id}/mom`} className="text-xs font-medium border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 transition-colors">
                      View MoM
                    </Link>
                    {String(meeting.organizerId?._id) === String(user?._id || user?.id) && meeting.status === 'Scheduled' && (
                      <button onClick={() => openEdit(meeting)} className="text-xs font-medium border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-md hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 transition-colors">
                        Edit
                      </button>
                    )}

                    {!isCancelled && !isCompleted && canTransition(meeting) && (
                      <details className="relative">
                        <summary className="list-none cursor-pointer p-1.5 rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <MoreVertical size={16} />
                        </summary>
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg p-1 z-20">
                          <button
                            type="button"
                            onClick={() => statusMutation.mutate({ id: meeting._id, status: 'Completed' })}
                            disabled={statusMutation.isPending}
                            className="w-full text-left text-xs px-2 py-1.5 rounded text-emerald-600 hover:bg-emerald-50 inline-flex items-center gap-1.5"
                          >
                            <CheckCircle2 size={12} /> Mark Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this meeting?')) {
                                statusMutation.mutate({ id: meeting._id, status: 'Cancelled' });
                              }
                            }}
                            disabled={statusMutation.isPending}
                            className="w-full text-left text-xs px-2 py-1.5 rounded text-rose-600 hover:bg-rose-50"
                          >
                            Cancel Meeting
                          </button>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredMeetings.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredMeetings.length)} of {filteredMeetings.length} meetings
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded-md ${p === page ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`max-h-[88vh] overflow-y-auto transition-[max-width] ${mode === 'Field' ? 'sm:max-w-2xl' : ''}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar size={16} className="text-indigo-600" /> {editMeetingId ? 'Edit Meeting' : 'Schedule Meeting'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-700 mb-1 block">Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="Sprint Planning" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode('Online')} className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 ${mode === 'Online' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                <Video size={12} /> Online
              </button>
              <button type="button" onClick={() => setMode('Field')} className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 ${mode === 'Field' ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                <MapPin size={12} /> Field / In-Person
              </button>
            </div>

            {mode === 'Online' && (
              <div>
                <label className="text-xs font-medium text-zinc-700 mb-1 block">Meeting Link</label>
                <input required value={meetingLink} onChange={e => setMeetingLink(e.target.value)} type="url" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="https://meet.google.com/..." />
              </div>
            )}

            {mode === 'Field' && (
              <div className="flex flex-col gap-3 p-3 rounded-md bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">Site / Location Name</label>
                    <input value={location} onChange={e => setLocation(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="Client Office, Site A" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">Address</label>
                    <input required value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="House No, Building, Street" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">Pincode</label>
                    <input value={pincode} onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))} maxLength={6} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. 110001" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">State</label>
                    <input value={state} onChange={e => setState(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 mb-1 block">Country</label>
                    <input value={country} onChange={e => setCountry(e.target.value)} type="text" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium border border-indigo-200 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  <Navigation size={12} />
                  {detecting ? 'Fetching...' : coords ? `Coordinates captured (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})` : 'Fetch Coordinates from Address'}
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-700 mb-1 block">Meeting Date</label>
              <input
                required
                value={meetingDate}
                min={moment().format('YYYY-MM-DD')}
                onChange={e => setMeetingDate(e.target.value)}
                type="date"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-700 mb-1 block">Start Time</label>
                <input required value={startTime} onChange={e => setStartTime(e.target.value)} type="time" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-700 mb-1 block">End Time</label>
                <input required value={endTime} onChange={e => setEndTime(e.target.value)} type="time" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 mb-1 block">Description (Optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" rows={2} placeholder="Add meeting description..." />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-700 mb-1 block">Attendees</label>
              <MultiSearchableDropdown
                options={employeeOptions}
                values={attendeeIds}
                onChange={setAttendeeIds}
                placeholder="Select attendees..."
              />
            </div>
            <Button disabled={createMutation.isPending || updateMutation.isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editMeetingId ? 'Update Meeting' : 'Schedule Meeting'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
