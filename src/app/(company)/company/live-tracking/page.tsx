'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ShieldCheck, Loader2, CheckCircle2, Navigation, Users, Map, History } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function LiveTrackingPage() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = React.useState<string>('');

  const { data: consentData, isLoading: loadingConsent } = useQuery({
    queryKey: ['tracking', 'consent', 'mine'],
    queryFn: async () => (await api.get('/tracking/consent/mine')).data,
  });

  const { data: teamLocations, isLoading: loadingTeam } = useQuery({
    queryKey: ['tracking', 'team'],
    queryFn: async () => (await api.get('/tracking/team')).data,
    retry: false,
  });

  const { data: userHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['tracking', 'history', selectedUserId],
    queryFn: async () => (await api.get(`/tracking/history/${selectedUserId}`)).data,
    enabled: !!selectedUserId,
    retry: false,
  });

  const consentMutation = useMutation({
    mutationFn: async (consentGiven: boolean) => (await api.put('/tracking/consent', { consentGiven })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracking', 'consent', 'mine'] }),
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const pingMutation = useMutation({
    mutationFn: async () => {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      return (await api.post('/tracking/ping', { lat: pos.coords.latitude, lng: pos.coords.longitude })).data;
    },
    onSuccess: () => alert('Location shared'),
    onError: (err: any) => alert(err.response?.data?.message || err.message || 'Could not get location'),
  });

  const enabledForMe = consentData?.enabledForMyRole;
  const hasConsented = consentData?.consent?.consentGiven;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <header className="pb-3 border-b border-zinc-200/70 dark:border-zinc-800">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Employee Live Tracking</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Consent-based location sharing for field roles only</p>
      </header>

      {/* Consent */}
      <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
            <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" /> My Consent
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loadingConsent ? (
            <div className="py-2 text-[13px] text-zinc-500 flex items-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : !enabledForMe ? (
            <div className="text-[13px] text-zinc-500 border border-dashed rounded-lg py-6 text-center dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              Live tracking isn't enabled for your role. Nothing to consent to.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Status chip */}
              <div className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${hasConsented ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                {hasConsented ? <CheckCircle2 size={12} /> : <ShieldCheck size={12} />}
                {hasConsented ? 'Sharing enabled' : 'Not sharing'}
              </div>

              <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Your role has live tracking enabled. Sharing your location is voluntary — you can revoke consent at any time. Location history is automatically deleted after 30 days.
              </p>

              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <button
                  onClick={() => consentMutation.mutate(true)}
                  disabled={consentMutation.isPending || hasConsented}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 disabled:cursor-not-allowed ${hasConsented ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  {consentMutation.isPending && !hasConsented && <Loader2 size={14} className="animate-spin" />}
                  {hasConsented ? 'Consent given' : 'Give consent'}
                </button>

                {hasConsented && (
                  <button
                    onClick={() => consentMutation.mutate(false)}
                    disabled={consentMutation.isPending}
                    className="px-3.5 py-2 text-[13px] font-medium rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  >
                    Revoke consent
                  </button>
                )}

                {hasConsented && (
                  <button
                    onClick={() => pingMutation.mutate()}
                    disabled={pingMutation.isPending}
                    className="px-3.5 py-2 text-[13px] font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {pingMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                    Share current location
                  </button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team locations */}
      <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
            <Users size={16} className="text-indigo-600 dark:text-indigo-400" /> Team Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loadingTeam ? (
            <div className="py-4 text-center text-[13px] text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </div>
          ) : teamLocations?.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-zinc-500 border border-dashed rounded-lg dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              No consented team members with recent location pings.
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {teamLocations?.map((loc: any) => (
                <li
                  key={loc._id}
                  onClick={() => {
                    setSelectedUserId(loc._id);
                    setSelectedUserName(loc.employeeName);
                  }}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm hover:bg-zinc-50/70 transition-colors dark:border-zinc-800 dark:hover:bg-zinc-800/40 cursor-pointer"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <MapPin size={14} />
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 flex-1 truncate">{loc.employeeName}</span>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">View Path</span>
                  <span className="text-zinc-400 text-xs whitespace-nowrap">{moment(loc.recordedAt).fromNow()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUserId} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map size={18} className="text-indigo-600" /> Today's Route: {selectedUserName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {loadingHistory ? (
              <div className="py-10 text-center text-[13px] text-zinc-500 flex justify-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Fetching route history...
              </div>
            ) : userHistory?.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-zinc-500">No tracking data found for today.</div>
            ) : (
              <div className="flex flex-col gap-4 pl-2 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                {userHistory?.map((point: any, index: number) => {
                  const isFirst = index === 0;
                  const isLast = index === userHistory.length - 1;
                  return (
                    <div key={point._id} className="flex gap-4 relative z-10">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${isFirst ? 'bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/30' : isLast ? 'bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/30' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>
                      <div>
                        <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                          {isFirst ? 'Started tracking' : isLast ? 'Latest location' : 'Ping recorded'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5 font-medium tabular-nums">
                          {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">{moment(point.recordedAt).format('hh:mm A')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {userHistory && userHistory.length > 0 && (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <a
                href={`https://www.google.com/maps/dir/${userHistory.map((p: any) => `${p.lat},${p.lng}`).join('/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-medium rounded-md inline-flex items-center gap-2 transition-colors"
              >
                <MapPin size={14} /> View Full Route on Google Maps
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}