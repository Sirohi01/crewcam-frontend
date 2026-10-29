'use client';

import React, { useState } from 'react';
import { Globe, RefreshCw, Loader2, Plus, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';

// Shared by Settings → Integrations and Company Profile — both just render this, so the
// "career-site" connection(s) (what this tenant's own careers page(s) need to get jobs/applied
// candidates pulled in and have jobs posted back out) are configured and documented in exactly
// one place, not duplicated per screen. A tenant with more than one website just has more than
// one of these connections — see "+ Add Another Website" below — each kept separate by its own
// Site Label, so jobs/candidates pulled from each stay attributed to the right one.
const FIELDS: { name: string; label: string; type: string; hint?: string; required?: boolean }[] = [
  { name: 'siteKey', label: 'Site Label', type: 'text', hint: 'Only needed if you connect more than one website, e.g. "Main Site", "Academy"' },
  { name: 'baseUrl', label: 'Website / API Base URL', type: 'url', hint: 'e.g. https://yourcompany.com', required: true },
  { name: 'jobsPath', label: 'Jobs List Path (to get jobs)', type: 'text', hint: 'Defaults to /api/careers/jobs' },
  { name: 'applicationsPath', label: 'Applied Candidates Path (to get resumes)', type: 'text', hint: 'Defaults to /api/careers/integrations/applications' },
  { name: 'listPath', label: 'Path to list in response', type: 'text', hint: 'Defaults to "data", e.g. "vacancies" if the response is { vacancies: [...] }' },
  { name: 'fieldMap', label: 'Field name mapping (JSON)', type: 'text', hint: 'Optional — only needed if your site names fields differently, e.g. {"totalOpenings":"vacancyCount"}' },
  { name: 'postPath', label: 'Create-Job Path (to post jobs)', type: 'text', hint: 'Only if your site accepts new jobs via API, e.g. /api/careers/integrations/jobs' },
  { name: 'apiKey', label: 'API Key', type: 'password', hint: 'Required by most sites to authorize posting a job / pulling candidates — ask whoever manages your site\'s backend for this' },
];

export default function CareerSiteConnectionCard() {
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null); // integration _id being edited, or 'new'
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => (await api.get('/settings/integrations')).data,
  });

  const sites: any[] = (integrations || []).filter((i: any) => i.provider === 'career-site');

  // Non-secret fields (baseUrl, jobsPath, ...) come back as their real saved value;
  // apiKey still comes back as '********' — never prefill that, so leaving it untouched
  // and saving doesn't overwrite the real key with the literal mask string.
  const openEdit = (site: any) => {
    const prefill: Record<string, string> = {};
    if (site?.credentials) {
      for (const f of FIELDS) {
        const val = site.credentials[f.name];
        if (val && val !== '********') prefill[f.name] = val;
      }
    }
    setValues(prefill);
    setOpenId(site._id);
  };

  const openNew = () => {
    setValues({});
    setOpenId('new');
  };

  const saveMutation = useMutation({
    mutationFn: async (credentials: Record<string, string>) =>
      openId && openId !== 'new'
        ? (await api.put(`/settings/integrations/${openId}`, { credentials, isActive: true })).data
        : (await api.post('/settings/integrations', { provider: 'career-site', credentials, isActive: true })).data,
    onSuccess: () => {
      toast.success('Career page connection saved');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setOpenId(null);
      setValues({});
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to save connection'),
  });

  const disconnectMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/settings/integrations/${id}`)).data,
    onSuccess: () => {
      toast.success('Career page connection removed');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });

  const syncJobsMutation = useMutation({
    mutationFn: async () => (await api.post('/hiring/manpower-request/sync-career-site')).data,
    onSuccess: (data: any) => toast.success(`Synced: ${data.created || 0} new, ${data.updated || 0} updated job(s) from ${data.sites || 1} site(s).`),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to sync jobs from your career page(s).'),
  });

  const syncCandidatesMutation = useMutation({
    mutationFn: async () => (await api.post('/hiring/candidates/sync-career-site')).data,
    onSuccess: (data: any) => toast.success(`Synced: ${data.created || 0} new, ${data.updated || 0} updated candidate(s) from ${data.sites || 1} site(s).`),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to sync candidates from your career page(s).'),
  });

  const renderForm = () => (
    <div className="flex flex-col gap-3">
      {FIELDS.map((f) => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-600">
            {f.label}{f.required && <span className="text-rose-500"> *</span>}
          </label>
          <input
            type={f.type}
            value={values[f.name] || ''}
            onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            className="w-full rounded-md border border-zinc-200 px-3 py-1.5 text-sm"
            placeholder={f.name === 'apiKey' && openId !== 'new' ? 'Leave blank to keep current key' : f.hint}
          />
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => { setOpenId(null); setValues({}); }}
          className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={saveMutation.isPending || !values.baseUrl}
          onClick={() => saveMutation.mutate(values)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Connection'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-[2px] border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68]">
          <Globe size={14} /> Career Page Connection{sites.length > 1 ? 's' : ''}
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sites.length ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
          {sites.length ? `${sites.length} Connected` : 'Not Connected'}
        </span>
      </div>
      <div className="p-4">
        <p className="mb-3 text-xs text-zinc-500 leading-snug">
          Connect your own company website's careers page(s) so jobs posted there automatically show up in HR-CRM's
          Jobs list, applied candidates + resumes get pulled into the Candidates list, and jobs you post from
          HR-CRM (when "Website" is ticked) get sent out to it. If your company runs more than one website, connect
          each one separately below. Fill in whatever your site's own backend needs — ask your website developer
          if you're unsure which fields apply.
        </p>

        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-zinc-400" />
        ) : (
          <div className="flex flex-col gap-3">
            {sites.map((site) => (
              <div key={site._id} className="rounded-md border border-zinc-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">
                    {site.credentials?.siteKey || site.credentials?.baseUrl || 'Website'}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${site.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                    {site.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                {openId === site._id ? (
                  renderForm()
                ) : (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => syncJobsMutation.mutate()}
                      disabled={syncJobsMutation.isPending}
                      className="flex items-center gap-1.5 h-8 rounded-md border border-zinc-200 px-3 text-xs font-medium text-indigo-600 hover:bg-zinc-50"
                    >
                      <RefreshCw size={13} className={syncJobsMutation.isPending ? 'animate-spin' : ''} />
                      Sync Jobs
                    </button>
                    <button
                      type="button"
                      onClick={() => syncCandidatesMutation.mutate()}
                      disabled={syncCandidatesMutation.isPending}
                      className="flex items-center gap-1.5 h-8 rounded-md border border-zinc-200 px-3 text-xs font-medium text-indigo-600 hover:bg-zinc-50"
                    >
                      <Users size={13} className={syncCandidatesMutation.isPending ? 'animate-spin' : ''} />
                      Sync Candidates
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(site)}
                      className="h-8 rounded-md border border-zinc-200 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => disconnectMutation.mutate(site._id)}
                      disabled={disconnectMutation.isPending}
                      className="h-8 rounded-md border border-zinc-200 px-3 text-xs font-medium text-rose-600 hover:bg-zinc-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            {openId === 'new' ? (
              <div className="rounded-md border border-dashed border-indigo-300 p-3">{renderForm()}</div>
            ) : (
              <button
                type="button"
                onClick={openNew}
                className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-zinc-50"
              >
                <Plus size={14} /> {sites.length ? 'Add Another Website' : 'Connect a Website'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
