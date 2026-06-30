'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, KeyRound, Building2 } from 'lucide-react';
import api from '@/lib/axios';

const PROVIDER_INFO: Record<string, { blurb: string; recommended?: boolean }> = {
  OpenAI: { blurb: 'GPT-4o-mini — cheap, reliable, widely supported.' },
  Gemini: { blurb: 'Gemini Flash — generous free tier, fastest to set up cost-effectively.', recommended: true },
  Anthropic: { blurb: 'Claude Haiku — strong reasoning at a low per-token cost.' },
};

export default function SuperAdminAiProvidersPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { apiKey: string; model: string }>>({});
  const [customModelProviders, setCustomModelProviders] = useState<Record<string, boolean>>({});
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/super-admin/tenants').then((res) => setTenants(res.data || []));
  }, []);

  const fetchProviders = async (forTenantId: string) => {
    if (!forTenantId) return;
    setLoading(true);
    try {
      const res = await api.get('/super-admin/ai-providers', { params: { tenantId: forTenantId } });
      setProviders(res.data || []);
      setDrafts((prev) => {
        const next = { ...prev };
        (res.data || []).forEach((p: any) => { next[p.provider] = { apiKey: '', model: p.model }; });
        return next;
      });
      setCustomModelProviders((prev) => {
        const next = { ...prev };
        (res.data || []).forEach((p: any) => {
          const knownValues = (p.availableModels || []).map((m: any) => m.value);
          next[p.provider] = !knownValues.includes(p.model);
        });
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProviders([]);
    setDrafts({});
    if (tenantId) fetchProviders(tenantId);
  }, [tenantId]);

  const save = async (provider: string, isActive: boolean) => {
    setSavingProvider(provider);
    try {
      const draft = drafts[provider] || { apiKey: '', model: '' };
      await api.put('/super-admin/ai-providers', {
        tenantId,
        provider,
        apiKey: draft.apiKey || undefined,
        model: draft.model || undefined,
        isActive,
      });
      setDrafts((prev) => ({ ...prev, [provider]: { ...prev[provider], apiKey: '' } }));
      await fetchProviders(tenantId);
    } finally {
      setSavingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">AI Providers</h1>
        <p className="text-xs text-zinc-500">
          AI keys are assigned per company — each tenant gets its own key/model per provider, never a key it
          can see or edit itself. Pick a company below to manage its providers.
        </p>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-4">
          <label className="block text-[11px] font-md text-zinc-700 mb-1.5 flex items-center gap-1"><Building2 size={12} /> Company</label>
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full md:w-80 border border-zinc-200 rounded-md text-sm px-3 py-2"
          >
            <option value="">Select a company…</option>
            {tenants.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </CardContent>
      </Card>

      {!tenantId && (
        <p className="text-xs text-zinc-500 px-1">Select a company above to view and configure its AI providers.</p>
      )}

      {tenantId && loading && <p className="text-xs text-zinc-500 px-1">Loading…</p>}

      {tenantId && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {providers.map((p: any) => {
            const info = PROVIDER_INFO[p.provider] || { blurb: '' };
            const draft = drafts[p.provider] || { apiKey: '', model: p.model };
            return (
              <Card key={p.provider} className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-600" />
                      <span className="font-md text-sm">{p.provider}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {info.blurb}
                    {info.recommended && <span className="ml-1 font-medium text-emerald-600">Recommended — free tier.</span>}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-md text-zinc-700">Model</label>
                      <button
                        type="button"
                        className="text-[10px] text-indigo-600 hover:underline"
                        onClick={() => setCustomModelProviders((prev) => ({ ...prev, [p.provider]: !prev[p.provider] }))}
                      >
                        {customModelProviders[p.provider] ? 'Choose from list' : 'Use custom model name'}
                      </button>
                    </div>
                    {customModelProviders[p.provider] ? (
                      <input
                        value={draft.model}
                        placeholder="e.g. gpt-4.1-nano"
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [p.provider]: { ...prev[p.provider], model: e.target.value } }))}
                        className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5"
                      />
                    ) : (
                      <select
                        value={draft.model}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [p.provider]: { ...prev[p.provider], model: e.target.value } }))}
                        className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5"
                      >
                        {(p.availableModels || []).map((m: any) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-md text-zinc-700 flex items-center gap-1">
                      <KeyRound size={12} /> API Key {p.hasApiKey && <span className="text-zinc-400">({p.apiKey})</span>}
                    </label>
                    <input
                      type="password"
                      placeholder={p.hasApiKey ? 'Leave blank to keep existing key' : 'Enter API key'}
                      value={draft.apiKey}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [p.provider]: { ...prev[p.provider], apiKey: e.target.value } }))}
                      className="w-full border border-zinc-200 rounded-md text-xs px-3 py-1.5"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {p.isActive ? (
                      <Button size="sm" variant="outline" className="text-xs h-8 text-rose-600" disabled={savingProvider === p.provider} onClick={() => save(p.provider, false)}>
                        Deactivate
                      </Button>
                    ) : (
                      <Button size="sm" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700" disabled={savingProvider === p.provider} onClick={() => save(p.provider, true)}>
                        Save &amp; Activate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
