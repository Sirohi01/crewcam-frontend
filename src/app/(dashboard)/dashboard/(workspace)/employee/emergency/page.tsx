'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useMyDetails } from '@/hooks/useMyProfile';
import { useProfileSectionEditor } from '@/hooks/useProfileSectionEditor';
import { useCancelAlert, useMyEmergency, useTriggerAlert } from '@/hooks/useEmergency';
import { ProfileEntryDialog } from '@/components/profile/ProfileEntryDialog';
import { EMERGENCY_FIELDS } from '@/components/profile/profileFields';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmergencyAlert } from '@/services/emergencyService';
import { BookOpen, Bell, Shield, Plus, Flame, ShieldAlert, Phone, MessageSquare, Pencil, MapPin, HeartPulse, DoorOpen, CheckCircle2, AlertTriangle, PlusCircle, FileText, Loader2, XCircle, Clock } from 'lucide-react';

// Icon/colour for a helpline, guessed from its label; HR names the helplines.
const HELPLINE_STYLES: { match: RegExp; icon: React.ElementType; accent: string }[] = [
  { match: /fire/i, icon: Flame, accent: 'bg-orange-50 text-orange-600' },
  { match: /medic|ambulance|doctor|health/i, icon: Plus, accent: 'bg-emerald-50 text-emerald-600' },
  { match: /women|woman|posh/i, icon: ShieldAlert, accent: 'bg-violet-50 text-violet-600' },
];
const helplineStyle = (label: string) => HELPLINE_STYLES.find((h) => h.match.test(label)) || { icon: Shield, accent: 'bg-blue-50 text-blue-600' };

// General guidance, shown until the company adds its own tips.
const DEFAULT_TIPS = [
  'Familiarize yourself with exit routes and assembly points',
  'Keep emergency contacts updated always',
  'Do not use elevators during fire or any emergency',
  'Report any unsafe condition to admin immediately',
  'Stay calm and follow instructions during emergencies',
];

const ALERT_STATUS: Record<EmergencyAlert['status'], { label: string; icon: React.ElementType; color: string }> = {
  Active: { label: 'Alert raised', icon: AlertTriangle, color: 'text-rose-500' },
  Acknowledged: { label: 'Help is on the way', icon: Clock, color: 'text-amber-500' },
  Resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-500' },
  Cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-zinc-400' },
};

const personName = (p?: { firstName: string; lastName?: string } | null) => (p ? `${p.firstName} ${p.lastName || ''}`.trim() : '');

function Card({
  title, action, className = '', children, footer,
}: { title?: string; action?: React.ReactNode; className?: string; children?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className={`flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[13px] font-bold text-[#1a1c21]">{title}</h3>
          {action}
        </div>
      )}
      <div className="flex-1 px-3 py-2">{children}</div>
      {footer && <div className="border-t border-zinc-100 px-3 py-2">{footer}</div>}
    </div>
  );
}

function ViewLink({ href, label = 'View All' }: { href: string; label?: string }) {
  return <Link href={href} className="shrink-0 text-[11px] font-semibold text-blue-600 hover:text-blue-700">{label}</Link>;
}

export default function EmergencyPage() {
  const { data: details, isLoading } = useMyDetails();
  const contacts = useProfileSectionEditor('emergencyContacts', details?.emergencyContacts, 'Emergency Contact');
  const { data: emergency } = useMyEmergency();
  const cancel = useCancelAlert();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const settings = emergency?.settings;
  const active = emergency?.activeAlert || null;
  const tips = settings?.safetyTips?.length ? settings.safetyTips : DEFAULT_TIPS;

  const importantInfo = [
    { icon: MapPin, accent: 'bg-blue-50 text-blue-600', label: 'Office Address', detail: settings?.officeAddress },
    { icon: Plus, accent: 'bg-emerald-50 text-emerald-600', label: 'Nearest Hospital', detail: settings?.nearestHospital },
    { icon: ShieldAlert, accent: 'bg-amber-50 text-amber-600', label: 'Assembly Point', detail: settings?.assemblyPoint },
    { icon: HeartPulse, accent: 'bg-rose-50 text-rose-600', label: 'AED (Defibrillator) Location', detail: settings?.aedLocation },
    { icon: DoorOpen, accent: 'bg-teal-50 text-teal-600', label: 'Emergency Exits', detail: settings?.emergencyExits },
  ].filter((i) => i.detail);

  const cancelActive = async () => {
    if (!active || !window.confirm('Cancel your emergency alert? Responders will be told it is no longer needed.')) return;
    try {
      await cancel.mutateAsync(active._id);
      toast.success('Alert cancelled');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not cancel the alert');
    }
  };

  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] space-y-2 p-1">
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-0 flex items-center gap-2 text-[10px] text-zinc-500">
              <span>Dashboard</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Emergency</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Emergency</h1>
            <p className="mt-1 text-[10px] text-zinc-500">Your safety is our priority. Quick access to help, contacts and important information.</p>
          </div>
          {settings?.guideUrl && (
            <a href={settings.guideUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <BookOpen size={12} /> Emergency Guide
            </a>
          )}
        </div>

        {/* SOS banner */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-100 bg-gradient-to-r from-rose-50 to-white px-3 py-1.5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-rose-600 text-[13px] font-extrabold text-white">SOS</span>
            {active ? (
              <div>
                <p className="text-[14px] font-bold text-[#1a1c21]">{ALERT_STATUS[active.status].label}</p>
                <p className="text-[11px] text-zinc-500">
                  {active.status === 'Acknowledged'
                    ? `${personName(active.acknowledgedBy) || 'A responder'} saw your alert ${moment(active.acknowledgedAt).fromNow()} and is responding.`
                    : active.respondersNotified
                      ? `Raised ${moment(active.createdAt).fromNow()} — ${active.respondersNotified} responder(s) notified. Stay where you are if it is safe.`
                      : 'Raised — but no responder is set up for your company. Call a helpline below.'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[14px] font-bold text-[#1a1c21]">In Case of Emergency</p>
                <p className="text-[11px] text-zinc-500">
                  Tap the button to alert your company&apos;s responders and your manager{settings?.smsEmergencyContacts ? ', and to text your emergency contacts' : ''}.
                </p>
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {active ? (
              <button type="button" onClick={cancelActive} disabled={cancel.isPending} className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-[12px] font-bold text-rose-600 shadow-sm hover:bg-rose-50 disabled:opacity-60">
                <XCircle size={14} /> Cancel Alert
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmOpen(true)} className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-rose-700">
                <Bell size={14} /> Trigger Emergency Alert
              </button>
            )}
            <span className="text-[9.5px] font-medium text-rose-500">{active ? 'Cancel only if help is no longer needed' : 'Use only in real emergencies'}</span>
          </div>
        </div>

        {/* Helpline cards */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {(settings?.helplines ?? []).map((h) => {
            const st = helplineStyle(h.label);
            return (
              <div key={`${h.label}-${h.number}`} className="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${st.accent}`}>
                  <st.icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] text-zinc-500">{h.label}</p>
                  <p className="text-[13.5px] font-bold text-[#1a1c21]">{h.number}</p>
                  <p className={`mb-1 text-[9.5px] font-semibold ${h.available24x7 ? 'text-emerald-600' : 'text-zinc-400'}`}>{h.available24x7 ? '24/7 Available' : 'Office hours'}</p>
                  <a href={`tel:${h.number.replace(/[\s-]/g, '')}`} className="flex w-max items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-1 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
                    <Phone size={11} /> Call Now
                  </a>
                </div>
              </div>
            );
          })}
          {settings && settings.helplines.length === 0 && (
            <div className="col-span-2 flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm lg:col-span-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600"><Phone size={16} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-[#1a1c21]">Your company hasn&apos;t added helpline numbers yet.</p>
                <p className="text-[10.5px] text-zinc-500">In India, dial <a href="tel:112" className="font-bold text-rose-600">112</a> for police, fire or ambulance.</p>
              </div>
            </div>
          )}
        </div>

        {/* Contacts / Info / Alerts+Tips */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <Card
            title="My Emergency Contacts"
            action={<ViewLink href="/dashboard/employee/family" label="Manage Contacts" />}
            footer={(
              <button type="button" onClick={contacts.openAdd} className="flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                <PlusCircle size={13} /> Add Emergency Contact
              </button>
            )}
          >
            <div className="space-y-2">
              {isLoading && <p className="py-3 text-center text-[10px] text-zinc-400">Loading…</p>}
              {!isLoading && contacts.rows.length === 0 && (
                <p className="py-3 text-center text-[10px] text-zinc-500">No emergency contacts yet. Add someone we can reach if you need help.</p>
              )}
              {contacts.rows.map((c) => (
                <div key={c._id || c.name} className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-[12px] font-bold text-blue-600">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold text-[#1a1c21]">{c.name} <span className="font-normal text-zinc-400">· {c.relationship}</span></p>
                    <p className="truncate text-[10px] text-zinc-500">{c.mobile}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${c.isPrimary ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{c.isPrimary ? 'Primary' : 'Secondary'}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <a href={`tel:${c.mobile.replace(/\s+/g, '')}`} aria-label={`Call ${c.name}`} className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-emerald-600 hover:bg-emerald-50"><Phone size={11} /></a>
                    <a href={`sms:${c.mobile.replace(/\s+/g, '')}`} aria-label={`Message ${c.name}`} className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-blue-600 hover:bg-blue-50"><MessageSquare size={11} /></a>
                    <button type="button" aria-label={`Edit ${c.name}`} onClick={() => contacts.openEdit(c)} className="grid h-6 w-6 place-items-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50"><Pencil size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Important Information" footer={settings?.safetyMapUrl ? (
            <a href={settings.safetyMapUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
              <BookOpen size={12} /> View Office Safety Map
            </a>
          ) : undefined}
          >
            <div className="space-y-2">
              {importantInfo.length === 0 && (
                <p className="py-3 text-center text-[10px] text-zinc-500">Your company hasn&apos;t added office safety details yet.</p>
              )}
              {importantInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-2.5">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${info.accent}`}>
                    <info.icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold text-[#1a1c21]">{info.label}</p>
                    <p className="whitespace-pre-line text-[10px] leading-snug text-zinc-500">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-2">
            <Card title="My Recent Alerts">
              <div className="space-y-1">
                {(emergency?.alerts ?? []).length === 0 && <p className="py-2 text-center text-[10px] text-zinc-500">You haven&apos;t raised any alerts.</p>}
                {(emergency?.alerts ?? []).slice(0, 4).map((a) => {
                  const st = ALERT_STATUS[a.status];
                  return (
                    <div key={a._id} className="flex items-start gap-2.5">
                      <st.icon size={15} className={`mt-0.5 shrink-0 ${st.color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11.5px] font-semibold text-[#1a1c21]">{st.label}</p>
                        <p className="truncate text-[10px] text-zinc-500">
                          {a.resolutionNote || a.message || (a.status === 'Acknowledged' ? `By ${personName(a.acknowledgedBy)}` : `${a.respondersNotified} responder(s) notified`)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[9.5px] text-zinc-400">{moment(a.createdAt).format('DD MMM YYYY')}</p>
                        <p className="text-[9.5px] text-zinc-400">{moment(a.createdAt).format('hh:mm A')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Safety Tips">
              <div className="space-y-1">
                {tips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-blue-600" />
                    <p className="text-[11px] leading-snug text-zinc-600">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer banner */}
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
              <Shield size={22} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-[#1a1c21]">We Care About Your Safety</p>
              <p className="text-[11px] text-zinc-500">Your company is committed to providing a safe and secure work environment.<br className="hidden sm:block" /> In case of any emergency, help is just a click away.</p>
            </div>
          </div>
          {settings?.guideUrl && (
            <a href={settings.guideUrl} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <FileText size={13} /> Safety Guidelines
            </a>
          )}
        </div>
      </div>
      <ProfileEntryDialog fields={EMERGENCY_FIELDS} {...contacts.dialog} />
      <TriggerDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} />
    </div>
  );
}

/** Confirm before paging responders; optionally share location and a short note. */
function TriggerDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[15px] text-rose-600">Trigger an emergency alert?</DialogTitle>
        </DialogHeader>
        {open && <TriggerForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

const currentPosition = () =>
  new Promise<{ lat: number; lng: number; accuracy?: number } | undefined>((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(undefined);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => resolve(undefined), // denied or unavailable — still send the alert
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });

function TriggerForm({ onClose }: { onClose: () => void }) {
  const trigger = useTriggerAlert();
  const [message, setMessage] = useState('');
  const [shareLocation, setShareLocation] = useState(true);
  const [locating, setLocating] = useState(false);

  const send = async () => {
    try {
      setLocating(shareLocation);
      const location = shareLocation ? await currentPosition() : undefined;
      setLocating(false);
      const res = await trigger.mutateAsync({ message: message.trim() || undefined, location });
      toast.success(res.message, { duration: 6000 });
      onClose();
    } catch (err: any) {
      setLocating(false);
      toast.error(err?.response?.data?.message || 'Could not raise the alert — call a helpline now');
    }
  };

  const busy = locating || trigger.isPending;

  return (
    <div className="flex flex-col gap-3 text-[12px] text-zinc-700">
      <p>Your company&apos;s responders and your manager will be notified immediately. Use this only in a real emergency.</p>
      <label className="flex flex-col gap-1 text-[11px] text-zinc-600">What&apos;s happening? (optional)
        <textarea rows={2} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Medical emergency, 3rd floor pantry" className="rounded-md border border-zinc-200 px-2 py-1.5 text-[12px] outline-none focus:border-rose-400" />
      </label>
      <label className="flex items-start gap-2 text-[11.5px]">
        <input type="checkbox" checked={shareLocation} onChange={(e) => setShareLocation(e.target.checked)} className="mt-0.5" />
        Share my current location with responders
      </label>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} disabled={busy} className="rounded-md border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50">Cancel</button>
        <button type="button" onClick={send} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-2 text-[12px] font-bold text-white hover:bg-rose-700 disabled:opacity-60">
          {busy && <Loader2 size={13} className="animate-spin" />} {locating ? 'Getting location…' : 'Send Alert'}
        </button>
      </div>
    </div>
  );
}
