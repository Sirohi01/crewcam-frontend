'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plug } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

const AVAILABLE_INTEGRATIONS = [
  { provider: 'OpenAI', description: 'Powers AI Resume Screening and AI Employee Summary (Phase C/C2). Server-side only — the frontend never sees this key.' },
  { provider: 'SMTP', description: 'Configure custom email server for sending notifications.' },
  { provider: 'Twilio', description: 'Send SMS notifications and alerts via Twilio API.' },
  { provider: 'WhatsApp Business', description: 'Send automated updates to employees via WhatsApp.' },
  { provider: 'Slack', description: 'Send notifications and alerts to a Slack channel.' },
  { provider: 'Stripe', description: 'Process payments and manage subscriptions.' }
];

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => (await api.get('/settings/integrations')).data,
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Integrations</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Manage third-party tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {AVAILABLE_INTEGRATIONS.map(def => {
          const connected = integrations?.find((i: any) => i.provider === def.provider && i.isActive);
          return (
            <IntegrationCard
              key={def.provider}
              provider={def.provider}
              description={def.description}
              status={connected ? 'Connected' : 'Not Connected'}
            />
          );
        })}
      </div>
    </div>
  );
}

const INTEGRATION_FIELDS: Record<string, { name: string, label: string, type: string }[]> = {
  'SMTP': [
    { name: 'host', label: 'SMTP Host', type: 'text' },
    { name: 'port', label: 'SMTP Port', type: 'number' },
    { name: 'user', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
  ],
  'Twilio': [
    { name: 'accountSid', label: 'Account SID', type: 'text' },
    { name: 'authToken', label: 'Auth Token', type: 'password' },
    { name: 'fromNumber', label: 'From Number', type: 'text' },
  ],
  'WhatsApp Business': [
    { name: 'phoneNumberId', label: 'Phone Number ID', type: 'text' },
    { name: 'accessToken', label: 'Access Token', type: 'password' },
  ],
  'Slack': [
    { name: 'webhookUrl', label: 'Webhook URL', type: 'url' },
  ],
  'Stripe': [
    { name: 'publishableKey', label: 'Publishable Key', type: 'text' },
    { name: 'secretKey', label: 'Secret Key', type: 'password' },
  ]
};

function IntegrationCard({ provider, description, status }: any) {
  const isConnected = status === 'Connected';
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const fields = INTEGRATION_FIELDS[provider] || [{ name: 'apiKey', label: 'API Key', type: 'password' }];

  const configureMutation = useMutation({
    mutationFn: async (payload: any) => (await api.put('/settings/integrations', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsOpen(false);
      setCredentials({});
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plug size={18} className="text-indigo-600" />
            {provider}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${isConnected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
            {status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isOpen && !isConnected && (
          <div className="my-3 flex flex-col gap-3">
            {fields.map(field => (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-xs font-md text-zinc-600">{field.label}</label>
                <input
                  type={field.type}
                  value={credentials[field.name] || ''}
                  onChange={(e) => setCredentials({ ...credentials, [field.name]: e.target.value })}
                  className="w-full rounded-md border border-zinc-200 px-3 py-1.5 text-sm"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end pt-2 gap-2">
          {isConnected ? (
            <button
              onClick={() => configureMutation.mutate({ provider, isActive: false })}
              disabled={configureMutation.isPending}
              className="text-sm font-medium px-4 py-2 rounded-md transition-colors border border-zinc-200 hover:bg-zinc-50 text-rose-600"
            >
              Disconnect
            </button>
          ) : (
            <>
              {isOpen && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium px-4 py-2 rounded-md transition-colors text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (isOpen) {
                    configureMutation.mutate({ provider, credentials, isActive: true });
                  } else {
                    setIsOpen(true);
                  }
                }}
                disabled={configureMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
              >
                {isOpen ? 'Save Credentials' : 'Configure'}
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
