'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function WhitelabelPage() {
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();

  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [companyNameOverride, setCompanyNameOverride] = useState('');

  const { data: whitelabel, isLoading } = useQuery({
    queryKey: ['whitelabel'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/settings/whitelabel', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch whitelabel');
      return res.json();
    },
    enabled: !!token
  });

  useEffect(() => {
    if (whitelabel) {
      setPrimaryColor(whitelabel.primaryColor || '#4f46e5');
      setCompanyNameOverride(whitelabel.companyNameOverride || '');
    }
  }, [whitelabel]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('http://localhost:8000/api/v1/settings/whitelabel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update whitelabel');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelabel'] });
      alert('Whitelabel settings saved successfully!');
    }
  });
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Whitelabel Settings</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Brand Customization</p>
        </div>
      </div>

      <Card className="max-w-2xl border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={18} className="text-indigo-600" />
            Brand Assets
          </CardTitle>
          <CardDescription>Upload your company logo and define your brand colors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company Logo</label>
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
              <span className="text-sm">Click to upload or drag and drop</span>
              <span className="text-xs mt-1">SVG, PNG, or JPG (max. 2MB)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded border border-zinc-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Company Name Override</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp Portal"
                value={companyNameOverride}
                onChange={(e) => setCompanyNameOverride(e.target.value)}
                className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => updateMutation.mutate({ primaryColor, companyNameOverride })}
              disabled={updateMutation.isPending || isLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
