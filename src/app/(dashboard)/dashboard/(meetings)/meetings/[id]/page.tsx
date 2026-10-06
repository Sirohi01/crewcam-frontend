'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Calendar, Clock, MapPin, Edit2, ChevronDown, CheckCircle2, XCircle, Navigation, User, Users, ExternalLink, FileText, Video
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { haversineKm } from '@/lib/geo';
import moment from 'moment';

const STATUS_LABELS: Record<string, string> = { Scheduled: 'Upcoming' };
const statusLabel = (s: string) => STATUS_LABELS[s] || s;

const STATUS_STYLES: Record<string, { text: string; bg: string, border: string }> = {
  Scheduled: { text: '#4338ca', bg: '#e0e7ff', border: '#c7d2fe' },
  Ongoing: { text: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  Completed: { text: '#52525b', bg: '#f4f4f5', border: '#e4e4e7' },
  Postponed: { text: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  Cancelled: { text: '#be123c', bg: '#ffe4e6', border: '#fecdd3' },
};
const statusStyle = (s: string) => STATUS_STYLES[s] || { text: '#4338ca', bg: '#e0e7ff', border: '#c7d2fe' };

function Avatar({ person, size = 32 }: { person: any; size?: number }) {
  if (person?.profilePictureUrl) {
    return (
      <img
        src={person.profilePictureUrl}
        alt={person.firstName || ''}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border-2 border-white dark:border-zinc-900 shrink-0 shadow-sm"
      />
    );
  }
  const initials = person?.firstName ? person.firstName[0].toUpperCase() : '?';
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-indigo-100 text-indigo-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
    >
      {initials}
    </div>
  );
}

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('Could not get live location', err)
      );
    }
  }, []);

  const { data: meeting, isLoading } = useQuery({
    queryKey: ['meetings', meetingId, 'details'],
    queryFn: async () => (await api.get(`/meetings/${meetingId}`)).data,
    retry: false,
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => (await api.put(`/meetings/${meetingId}/status`, { status })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meetings', meetingId, 'details'] });
      setActionsOpen(false);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  if (isLoading) return <div className="py-20 text-center text-sm text-zinc-500">Loading meeting details...</div>;
  if (!meeting) return <div className="py-20 text-center text-sm text-zinc-500">Meeting not found or access denied.</div>;

  const isCancelled = meeting.status === 'Cancelled';
  const isCompleted = meeting.status === 'Completed';
  const style = statusStyle(meeting.status);
  const people = [...new Map(
    [meeting.organizerId, ...(meeting.attendeeIds || [])].filter(Boolean).map((p: any) => [p._id, p])
  ).values()];
  const canTransition = meeting.organizerId?._id === (user?._id || user?.id) || (meeting.attendeeIds || []).some((a: any) => a._id === (user?._id || user?.id));
  const isOrganizer = meeting.organizerId?._id === (user?._id || user?.id);

  const branch = meeting.organizerId?.branchId;
  const branchDistance = meeting.mode === 'Field' && typeof meeting.lat === 'number' && typeof meeting.lng === 'number' && branch?.lat != null && branch?.lng != null
    ? haversineKm({ lat: branch.lat, lng: branch.lng }, { lat: meeting.lat, lng: meeting.lng })
    : null;

  let estimatedTimeStr = null;
  if (branchDistance != null) {
    const totalMinutes = Math.round((branchDistance / 40) * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0) estimatedTimeStr = `${hrs} hr ${mins > 0 ? `${mins} min` : ''}`;
    else estimatedTimeStr = `${mins} min`;
  }

  const createdDistance = meeting.mode === 'Field' && typeof meeting.lat === 'number' && typeof meeting.lng === 'number' && typeof meeting.createdLat === 'number' && typeof meeting.createdLng === 'number'
    ? haversineKm({ lat: meeting.createdLat, lng: meeting.createdLng }, { lat: meeting.lat, lng: meeting.lng })
    : null;

  let createdTimeStr = null;
  if (createdDistance != null) {
    const totalMinutes = Math.round((createdDistance / 40) * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0) createdTimeStr = `${hrs} hr ${mins > 0 ? `${mins} min` : ''}`;
    else createdTimeStr = `${mins} min`;
  }

  const currentToSiteDistance = meeting.mode === 'Field' && typeof meeting.lat === 'number' && typeof meeting.lng === 'number' && currentPos != null
    ? haversineKm(currentPos, { lat: meeting.lat, lng: meeting.lng })
    : null;

  let currentToSiteTimeStr = null;
  if (currentToSiteDistance != null) {
    const totalMinutes = Math.round((currentToSiteDistance / 40) * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0) currentToSiteTimeStr = `${hrs} hr ${mins > 0 ? `${mins} min` : ''}`;
    else currentToSiteTimeStr = `${mins} min`;
  }

  const currentToBranchDistance = branch?.lat != null && branch?.lng != null && currentPos != null
    ? haversineKm(currentPos, { lat: branch.lat, lng: branch.lng })
    : null;

  let currentToBranchTimeStr = null;
  if (currentToBranchDistance != null) {
    const totalMinutes = Math.round((currentToBranchDistance / 40) * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs > 0) currentToBranchTimeStr = `${hrs} hr ${mins > 0 ? `${mins} min` : ''}`;
    else currentToBranchTimeStr = `${mins} min`;
  }

  const durationStr = moment.duration(moment(meeting.endTime).diff(moment(meeting.startTime))).humanize();
  const shortId = `MTG-${meeting._id.substring(18).toUpperCase()}`;

  const googleMapsBranchToSiteUrl = (branch?.lat && branch?.lng && meeting.lat && meeting.lng)
    ? `https://www.google.com/maps/dir/?api=1&origin=${branch.lat},${branch.lng}&destination=${meeting.lat},${meeting.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${meeting.lat || ''},${meeting.lng || ''}`;

  const googleMapsCurrentToSiteUrl = (meeting.lat && meeting.lng)
    ? `https://www.google.com/maps/dir/?api=1&destination=${meeting.lat},${meeting.lng}`
    : undefined;

  const googleMapsCurrentToBranchUrl = (branch?.lat && branch?.lng)
    ? `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
    : undefined;

  return (
    <div className="flex flex-col gap-1 animate-in fade-in duration-300 pb-1 max-w-[1400px]">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Meeting Details</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Full information for this meeting</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOrganizer && meeting.status === 'Scheduled' && (
            <Link href="/dashboard/meetings" className="text-sm font-medium border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              <Edit2 size={14} /> Edit Meeting
            </Link>
          )}

          {!isCancelled && !isCompleted && canTransition && (
            <div className="relative">
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                More Actions <ChevronDown size={14} />
              </button>
              {actionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg p-1.5 z-20">
                  <button onClick={() => statusMutation.mutate('Completed')} className="w-full text-left text-sm px-3 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center gap-2 font-medium">
                    <CheckCircle2 size={14} /> Mark Complete
                  </button>
                  <button onClick={() => { if (confirm('Cancel meeting?')) statusMutation.mutate('Cancelled'); }} className="w-full text-left text-sm px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-2 font-medium mt-1">
                    <XCircle size={14} /> Cancel Meeting
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TOP CARD: MAIN INFO */}
      <Card className="border border-zinc-200 shadow-sm dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row p-4 lg:p-5">

          {/* Left Side: Icon + Details */}
          <div className="flex-1 flex gap-4 lg:gap-5">
            <div className="w-14 h-14 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-[14px] flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 mt-0.5">
              <Calendar size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className={`text-xl font-semibold text-zinc-900 dark:text-zinc-50 ${isCancelled ? 'line-through opacity-50' : ''}`}>
                  {meeting.title}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide" style={{ color: style.text, background: style.bg }}>
                  {statusLabel(meeting.status)}
                </span>
              </div>
              {meeting.description && (
                <p className="text-[13px] text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed max-w-3xl">
                  {meeting.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-12 gap-y-4 mt-4">
                <div className="flex gap-3">
                  <Calendar size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{moment(meeting.startTime).format('DD MMM YYYY')}</div>
                    <div className="text-[11px] text-zinc-500">{moment(meeting.startTime).format('dddd')}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                      {moment(meeting.startTime).format('hh:mm A')} - {moment(meeting.endTime).format('hh:mm A')}
                    </div>
                    <div className="text-[11px] text-zinc-500">{durationStr}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {meeting.mode === 'Field' ? <MapPin size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" /> : <Video size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />}
                  <div>
                    <div className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{meeting.mode} Meeting</div>
                    <div className="text-[11px] text-zinc-500">{meeting.mode === 'Field' ? 'In-Person' : 'Virtual Call'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Status & ID */}
          <div className="mt-6 md:mt-0 md:ml-6 md:pl-6 md:border-l border-zinc-100 dark:border-zinc-800 flex flex-col justify-center min-w-[180px]">
            <div className="mb-4">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Status</div>
              <div className="inline-flex items-center gap-2 text-[13px] font-semibold px-2.5 py-1 rounded-full" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.text }}></div>
                {statusLabel(meeting.status)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Meeting ID</div>
              <div className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300 font-mono bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
                {shortId}
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* BOTTOM CARD: LOCATION & PEOPLE */}
      <Card className="border border-zinc-200 shadow-sm dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
        <div className="flex flex-col lg:flex-row items-stretch">

          {/* Left Side: Details Stack */}
          <div className="flex-1 flex flex-col lg:border-r border-zinc-100 dark:border-zinc-800">

            {/* Row 1: Location */}
            {meeting.mode === 'Field' && (
              <div className="flex gap-4 p-4 lg:px-5 lg:py-4 border-b border-zinc-100 dark:border-zinc-800 items-start">
                <div className="w-12 h-12 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 mt-0.5">
                  <MapPin size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Site Location</div>
                  {meeting.location && <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{meeting.location}</h3>}
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                    {[meeting.address, meeting.city, meeting.state, meeting.pincode, meeting.country].filter(Boolean).join(', ') || 'No address recorded'}
                  </p>
                  {typeof meeting.lat === 'number' && (
                    <div className="text-xs text-zinc-500 mt-2 font-mono">Coordinates: {meeting.lat.toFixed(5)}, {meeting.lng.toFixed(5)}</div>
                  )}
                  {branchDistance != null && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <Navigation size={14} className="fill-current" /> {branchDistance.toFixed(1)} km from {branch.name} branch
                      </div>
                      {estimatedTimeStr && (
                        <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-fit">
                          <Clock size={14} className="fill-current" /> ~{estimatedTimeStr} travel time
                        </div>
                      )}
                    </div>
                  )}
                  {createdDistance != null && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <MapPin size={14} className="fill-current" /> {createdDistance.toFixed(1)} km from creation location
                      </div>
                      {createdTimeStr && (
                        <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-fit">
                          <Clock size={14} className="fill-current" /> ~{createdTimeStr} travel time
                        </div>
                      )}
                    </div>
                  )}

                  {currentToBranchDistance != null && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg w-fit">
                        <Navigation size={14} className="fill-current" /> {currentToBranchDistance.toFixed(1)} km from your current location to branch
                      </div>
                      {currentToBranchTimeStr && (
                        <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-fit">
                          <Clock size={14} className="fill-current" /> ~{currentToBranchTimeStr} travel time
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Row 2: Organizer */}
            <div className="flex gap-4 p-4 lg:px-5 lg:py-3">
              <div className="w-10 h-10 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 mt-0.5">
                <User size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Organizer</div>
                <div className="flex items-center gap-3">
                  <Avatar person={meeting.organizerId} size={28} />
                  <div>
                    <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                      {meeting.organizerId?.firstName} {meeting.organizerId?.lastName}
                    </div>
                    <div className="text-xs font-medium text-zinc-500">
                      {meeting.organizerId?.email}
                      {branch?.name ? <span className="ml-2 text-zinc-400">· {branch.name} branch</span> : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Attendees */}
            <div className="flex gap-4 p-4 lg:px-5 lg:py-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="w-10 h-10 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50 mt-0.5">
                <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Attendees ({people.length})</div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {people.map((p: any) => (
                    <div key={p._id} className="flex items-center gap-2">
                      <Avatar person={p} size={24} />
                      <div className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                        {p.firstName} {p.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer: MoM */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-4 lg:px-5 mt-auto">
              <Link
                href={`/dashboard/meetings/${meeting._id}/mom`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg hover:bg-zinc-50 hover:border-zinc-300 dark:hover:bg-zinc-800 transition-colors shadow-sm"
              >
                <FileText size={14} className="text-indigo-600 dark:text-indigo-400" />
                View MOM
              </Link>
            </div>
          </div>

          {/* Right Side: Google Map (Full Height) */}
          {meeting.mode === 'Field' && (
            <div className="lg:w-[480px] shrink-0 relative bg-zinc-50 dark:bg-zinc-800 min-h-[250px] lg:min-h-full">
              {typeof meeting.lat === 'number' && typeof meeting.lng === 'number' ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${meeting.lat},${meeting.lng}&hl=en&z=14&output=embed`}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(#4338ca 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              )}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
                <a
                  href={googleMapsBranchToSiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5 border border-zinc-200/50 dark:border-zinc-700/50"
                >
                  Branch ➔ Site Map <ExternalLink size={12} />
                </a>
                {googleMapsCurrentToSiteUrl && (
                  <a
                    href={googleMapsCurrentToSiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5 border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    Current ➔ Site Map <ExternalLink size={12} />
                  </a>
                )}
                {googleMapsCurrentToBranchUrl && (
                  <a
                    href={googleMapsCurrentToBranchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95 text-sky-600 dark:text-sky-400 text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-1.5 border border-zinc-200/50 dark:border-zinc-700/50"
                  >
                    Current ➔ Branch Map <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
}
