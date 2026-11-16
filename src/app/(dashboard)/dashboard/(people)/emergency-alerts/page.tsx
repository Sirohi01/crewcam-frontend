'use client';

import React, { useState } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, MapPin, Phone, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  EmergencyAlert,
  Helpline,
  SafetySettings,
  getSafetySettings,
  listAlerts,
  mapsUrl,
  respondToAlert,
  saveSafetySettings,
} from '@/services/emergencyService';
import { uploadFile } from '@/services/uploadService';

const FILTERS = [
  { id: 'open', label: 'Open' },
  { id: 'Resolved', label: 'Resolved' },
  { id: 'Cancelled', label: 'Cancelled' },
  { id: '', label: 'All' },
];

const STATUS_STYLE: Record<EmergencyAlert['status'], string> = {
  Active: 'bg-rose-50 text-rose-700 border-rose-200',
  Acknowledged: 'bg-amber-50 text-amber-700 border-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
};

const NOTICE_LABEL = { sent: 'texted', 'not-configured': 'not texted (no SMS provider)', failed: 'text failed' } as const;
const person = (p?: { firstName: string; lastName?: string } | null) => (p ? `${p.firstName} ${p.lastName || ''}`.trim() : '');

/**
 * Responders' console for emergency alerts (EMERGENCY_RESPOND) and the company's safety
 * information shown on every employee's Emergency page (editing needs ORG_WRITE).
 */
export default function EmergencyAlertsPage() {
  const [tab, setTab] = useState<'alerts' | 'settings'>('alerts');
  return (
    <div className="space-y-4 p-1">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Emergency Alerts</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          Alerts employees raise from their Emergency page, and the safety information they see there.
        </p>
      </div>
      <div className="flex gap-2 border-b border-zinc-200">
        {([['alerts', 'Alerts'], ['settings', 'Safety Information']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3 pb-2 text-[13px] font-semibold transition-colors ${tab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'alerts' ? <AlertsTab /> : <SettingsTab />}
    </div>
  );
}

function AlertsTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('open');
  const { data, isLoading, error } = useQuery({
    queryKey: ['emergency-alerts', filter],
    queryFn: () => listAlerts(filter),
    refetchInterval: 20000, // responders should see new alerts without refreshing
  });
  const respond = useMutation({
    mutationFn: respondToAlert,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['emergency-alerts'] });
      toast.success(res?.message || 'Updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Could not update the alert'),
  });
  const forbidden = (error as any)?.response?.status === 403;

  const resolve = (a: EmergencyAlert) => {
    const note = window.prompt('What happened / how was it resolved? (optional)', '');
    if (note === null) return;
    respond.mutate({ id: a._id, status: 'Resolved', note: note.trim() || undefined });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id || 'all'}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${filter === f.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}
          >
            {f.label}{f.id === 'open' && data?.openCount ? ` (${data.openCount})` : ''}
          </button>
        ))}
      </div>
      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="p-0">
          {forbidden ? (
            <p className="p-6 text-center text-[13px] text-zinc-500">You need the Emergency Respond permission to see alerts.</p>
          ) : isLoading ? (
            <p className="p-6 text-center text-[13px] text-zinc-400">Loading…</p>
          ) : !data?.alerts.length ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <ShieldAlert size={28} className="text-zinc-300" />
              <p className="text-[13px] text-zinc-500">No {filter === 'open' ? 'open ' : ''}alerts.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {data.alerts.map((a) => {
                const emp = typeof a.userId === 'object' ? a.userId : null;
                return (
                  <div key={a._id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13.5px] font-semibold text-zinc-900">{emp ? person(emp) : 'Employee'}</p>
                        {emp?.employeeCode && <span className="text-[11px] text-zinc-400">{emp.employeeCode}</span>}
                        {emp?.departmentId?.name && <span className="text-[11px] text-zinc-400">· {emp.departmentId.name}</span>}
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                      </div>
                      <p className="text-[12px] text-zinc-500">{moment(a.createdAt).format('DD MMM YYYY, hh:mm A')} · {moment(a.createdAt).fromNow()}</p>
                      {a.message && <p className="text-[12.5px] text-zinc-700">&ldquo;{a.message}&rdquo;</p>}
                      <div className="flex flex-wrap gap-3 text-[12px]">
                        {emp?.mobileNumber && <a href={`tel:${emp.mobileNumber}`} className="inline-flex items-center gap-1 font-semibold text-emerald-600"><Phone size={12} /> {emp.mobileNumber}</a>}
                        {a.location && (
                          <a href={mapsUrl(a.location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-blue-600">
                            <MapPin size={12} /> Location{a.location.accuracy ? ` (±${a.location.accuracy} m)` : ''}
                          </a>
                        )}
                      </div>
                      {a.contactNotices.length > 0 && (
                        <p className="text-[11.5px] text-zinc-500">Emergency contacts: {a.contactNotices.map((n) => `${n.name} — ${NOTICE_LABEL[n.result]}`).join('; ')}</p>
                      )}
                      {a.acknowledgedBy && <p className="text-[11.5px] text-zinc-500">Acknowledged by {person(a.acknowledgedBy)} {moment(a.acknowledgedAt).fromNow()}</p>}
                      {a.resolvedAt && <p className="text-[11.5px] text-zinc-500">{a.status === 'Cancelled' ? 'Cancelled' : `Resolved by ${person(a.resolvedBy)}`} {moment(a.resolvedAt).fromNow()}{a.resolutionNote ? ` — ${a.resolutionNote}` : ''}</p>}
                    </div>
                    {(a.status === 'Active' || a.status === 'Acknowledged') && (
                      <div className="flex shrink-0 gap-2">
                        {a.status === 'Active' && (
                          <button onClick={() => respond.mutate({ id: a._id, status: 'Acknowledged' })} disabled={respond.isPending} className="rounded-md bg-amber-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
                            I&apos;m responding
                          </button>
                        )}
                        <button onClick={() => resolve(a)} disabled={respond.isPending} className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60">
                          <CheckCircle2 size={13} /> Resolve
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function SettingsTab() {
  const { data, isLoading, error } = useQuery({ queryKey: ['emergency-settings'], queryFn: getSafetySettings });
  if ((error as any)?.response?.status === 403) {
    return <p className="p-6 text-center text-[13px] text-zinc-500">You need the Organization (read) permission to see safety information.</p>;
  }
  if (isLoading || !data) return <p className="p-6 text-center text-[13px] text-zinc-400">Loading…</p>;
  return <SettingsForm initial={data} />;
}

const TEXT_FIELDS: { key: keyof SafetySettings; label: string; placeholder: string }[] = [
  { key: 'officeAddress', label: 'Office address', placeholder: 'Leave blank to use the company address' },
  { key: 'nearestHospital', label: 'Nearest hospital', placeholder: 'e.g. City Hospital, Sector 62 (2.4 km)' },
  { key: 'assemblyPoint', label: 'Assembly point', placeholder: 'e.g. Main parking — Gate 2' },
  { key: 'aedLocation', label: 'AED (defibrillator) location', placeholder: 'e.g. Ground floor reception' },
  { key: 'emergencyExits', label: 'Emergency exits', placeholder: 'e.g. Stairwells at both ends of each floor' },
];

function SettingsForm({ initial }: { initial: SafetySettings }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SafetySettings>({ ...initial, helplines: initial.helplines ?? [], safetyTips: initial.safetyTips ?? [] });
  const [tipsText, setTipsText] = useState((initial.safetyTips ?? []).join('\n'));
  const [uploading, setUploading] = useState<'' | 'guideUrl' | 'safetyMapUrl'>('');

  const save = useMutation({
    mutationFn: saveSafetySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-settings'] });
      toast.success('Safety information saved');
    },
    onError: (err: any) => toast.error(err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || 'Could not save'),
  });

  const setHelpline = (i: number, patch: Partial<Helpline>) =>
    setForm({ ...form, helplines: form.helplines.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) });

  const upload = async (key: 'guideUrl' | 'safetyMapUrl', file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Files must be 5 MB or smaller');
    try {
      setUploading(key);
      setForm({ ...form, [key]: await uploadFile(file, file.name) });
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading('');
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate({
      helplines: form.helplines.filter((h) => h.label.trim() && h.number.trim()),
      officeAddress: form.officeAddress || '',
      nearestHospital: form.nearestHospital || '',
      assemblyPoint: form.assemblyPoint || '',
      aedLocation: form.aedLocation || '',
      emergencyExits: form.emergencyExits || '',
      safetyTips: tipsText.split('\n').map((t) => t.trim()).filter(Boolean).slice(0, 10),
      guideUrl: form.guideUrl || '',
      safetyMapUrl: form.safetyMapUrl || '',
      smsEmergencyContacts: form.smsEmergencyContacts,
    });
  };

  const input = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[12.5px] outline-none focus:border-indigo-500';

  return (
    <form onSubmit={submit} className="space-y-4">
      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-zinc-900">Helplines</h3>
            <button type="button" disabled={form.helplines.length >= 8} onClick={() => setForm({ ...form, helplines: [...form.helplines, { label: '', number: '', available24x7: true }] })} className="inline-flex items-center gap-1 text-[12px] font-semibold text-indigo-600 disabled:opacity-40">
              <Plus size={13} /> Add helpline
            </button>
          </div>
          {form.helplines.length === 0 && <p className="text-[12px] text-zinc-500">No helplines yet. Employees are shown the national emergency number 112 until you add some.</p>}
          {form.helplines.map((h, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
              <input value={h.label} maxLength={60} onChange={(e) => setHelpline(i, { label: e.target.value })} placeholder="e.g. Security desk" className={input} />
              <input value={h.number} maxLength={20} onChange={(e) => setHelpline(i, { number: e.target.value })} placeholder="+91 98765 43210" className={input} />
              <label className="flex items-center gap-1.5 text-[12px] text-zinc-600">
                <input type="checkbox" checked={h.available24x7} onChange={(e) => setHelpline(i, { available24x7: e.target.checked })} /> 24/7
              </label>
              <button type="button" onClick={() => setForm({ ...form, helplines: form.helplines.filter((_, idx) => idx !== i) })} className="grid h-8 w-8 place-items-center rounded-md border border-zinc-200 text-zinc-400 hover:text-rose-600" aria-label="Remove helpline">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <h3 className="sm:col-span-2 text-[14px] font-semibold text-zinc-900">Office safety details</h3>
          {TEXT_FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-[12px] text-zinc-600">{f.label}
              <input value={(form[f.key] as string) || ''} maxLength={300} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={input} />
            </label>
          ))}
          {(['guideUrl', 'safetyMapUrl'] as const).map((key) => (
            <label key={key} className="flex flex-col gap-1 text-[12px] text-zinc-600">{key === 'guideUrl' ? 'Emergency guide (PDF)' : 'Office safety map (PDF or image)'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => upload(key, e.target.files?.[0])} className="text-[12px]" />
              <span className="text-[11px] text-zinc-400">
                {uploading === key ? 'Uploading…' : form[key] ? <>Attached — <a href={form[key]} target="_blank" rel="noopener noreferrer" className="text-indigo-600">view</a> · <button type="button" onClick={() => setForm({ ...form, [key]: '' })} className="text-rose-600">remove</button></> : 'Not attached'}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm">
        <CardContent className="space-y-3 p-4">
          <h3 className="text-[14px] font-semibold text-zinc-900">Safety tips</h3>
          <textarea rows={5} value={tipsText} onChange={(e) => setTipsText(e.target.value)} placeholder="One tip per line (up to 10). Leave empty to show general safety tips." className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-[12.5px] outline-none focus:border-indigo-500" />
          <label className="flex items-start gap-2 text-[12.5px] text-zinc-700">
            <input type="checkbox" checked={form.smsEmergencyContacts} onChange={(e) => setForm({ ...form, smsEmergencyContacts: e.target.checked })} className="mt-0.5" />
            <span>Also text the employee&apos;s emergency contacts when they trigger an alert. <span className="text-zinc-400">Needs an SMS provider; without one, each alert shows the texts were not sent.</span></span>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button type="submit" disabled={save.isPending || !!uploading} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {save.isPending && <Loader2 size={14} className="animate-spin" />} Save safety information
        </button>
      </div>
    </form>
  );
}
