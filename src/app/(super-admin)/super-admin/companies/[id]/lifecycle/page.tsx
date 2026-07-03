'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Circle, Loader2 } from 'lucide-react';
import { CompanyBillingPanel } from '@/components/shared/CompanyBillingPanel';
import api from '@/lib/axios';

const EXCEPTION_STATUSES = ['SUSPENDED', 'EXPIRED', 'CLOSED'];

export default function CompanyLifecyclePage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [note, setNote] = useState('');
  const [overrideStatus, setOverrideStatus] = useState('');
  const [advancing, setAdvancing] = useState(false);
  const [settingStatus, setSettingStatus] = useState(false);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'lifecycle', id],
    queryFn: async () => (await api.get(`/super-admin/tenants/${id}/lifecycle`)).data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'lifecycle', id] });

  const handleAdvance = async () => {
    setError('');
    setAdvancing(true);
    try {
      await api.post(`/super-admin/tenants/${id}/lifecycle/advance`, { note: note || undefined });
      setNote('');
      invalidate();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to advance lifecycle status');
    } finally {
      setAdvancing(false);
    }
  };

  const handleSetStatus = async (status: string) => {
    if (!status) return;
    setError('');
    setSettingStatus(true);
    try {
      await api.post(`/super-admin/tenants/${id}/lifecycle`, { status, note: note || undefined });
      setNote('');
      setOverrideStatus('');
      invalidate();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to set lifecycle status');
    } finally {
      setSettingStatus(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-zinc-400 text-sm">Loading lifecycle...</div>;
  if (!data) return <div className="p-8 text-center text-rose-500 text-sm">Company not found.</div>;

  const { tenant, sequence, labels, events } = data;
  const currentIndex = sequence.indexOf(tenant.lifecycleStatus);
  const isException = currentIndex === -1;
  const canAdvance = !isException && currentIndex < sequence.length - 1;

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/companies" className="text-zinc-400 hover:text-zinc-600">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">{tenant.name} — Lifecycle</h1>
          <p className="text-xs text-zinc-500">
            Current status: <span className="font-medium text-indigo-600">{labels[tenant.lifecycleStatus]}</span>
            {tenant.lifecycleUpdatedAt && <> · updated {new Date(tenant.lifecycleUpdatedAt).toLocaleString()}</>}
          </p>
        </div>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200/80 shadow-sm rounded-lg">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md">Stage Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isException && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              This company is currently in an exception state ({labels[tenant.lifecycleStatus]}) — outside the standard forward sequence.
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {sequence.map((status: string, i: number) => {
              const done = !isException && i < currentIndex;
              const active = !isException && i === currentIndex;
              return (
                <div
                  key={status}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium border ${
                    active ? 'bg-indigo-600 text-white border-indigo-600'
                      : done ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                  }`}
                >
                  {done ? <Check size={12} /> : <Circle size={8} className={active ? 'fill-white' : ''} />}
                  {labels[status]}
                </div>
              );
            })}
          </div>

          <div className="mt-5 space-y-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for this transition (visible in the timeline and notification)..."
              rows={2}
              className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleAdvance}
                disabled={!canAdvance || advancing}
                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
              >
                {advancing ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                Advance to Next Stage{canAdvance ? `: ${labels[sequence[currentIndex + 1]]}` : ''}
              </Button>

              <div className="flex items-center gap-2">
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white"
                >
                  <option value="">Set status to...</option>
                  {sequence.map((s: string) => <option key={s} value={s}>{labels[s]}</option>)}
                  {EXCEPTION_STATUSES.map((s) => <option key={s} value={s}>{labels[s]}</option>)}
                </select>
                <Button
                  variant="outline"
                  disabled={!overrideStatus || settingStatus}
                  onClick={() => handleSetStatus(overrideStatus)}
                  className="h-8 text-xs"
                >
                  {settingStatus ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Apply
                </Button>
              </div>

              {tenant.lifecycleStatus === 'SUSPENDED' && (
                <Button onClick={() => handleSetStatus('ACTIVE')} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">Reactivate</Button>
              )}
              {(tenant.lifecycleStatus === 'ACTIVE' || tenant.lifecycleStatus === 'LIVE') && (
                <Button onClick={() => handleSetStatus('SUSPENDED')} variant="outline" className="h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50">Suspend</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CompanyBillingPanel
        tenantId={id}
        companyName={tenant.name}
        currentPackageId={tenant.packageId?._id}
        currentBillingCycle={tenant.billingCycle}
      />

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {(events || []).map((evt: any) => (
              <div key={evt._id} className="px-4 py-3 flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-md shrink-0 mt-0.5">
                  {evt.toStatus.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700">
                    {evt.fromStatus ? <>Moved from <span className="font-medium">{labels[evt.fromStatus]}</span> to </> : <>Set to </>}
                    <span className="font-medium text-indigo-600">{labels[evt.toStatus]}</span>
                  </p>
                  {evt.note && <p className="text-[11px] text-zinc-500 mt-0.5">{evt.note}</p>}
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {evt.changedBy ? `${evt.changedBy.firstName || ''} ${evt.changedBy.lastName || ''}`.trim() || evt.changedBy.email : 'System'} · {new Date(evt.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(events || []).length === 0 && (
              <div className="p-8 text-center text-zinc-400 text-xs">No lifecycle events yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
