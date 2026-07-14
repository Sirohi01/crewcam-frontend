'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Save, Loader2, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function WhitelabelPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [companyNameOverride, setCompanyNameOverride] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [poweredByLabel, setPoweredByLabel] = useState('');
  const [poweredByLogoUrl, setPoweredByLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [poweredByUploading, setPoweredByUploading] = useState(false);
  const [poweredByUploadError, setPoweredByUploadError] = useState('');
  const poweredByFileInputRef = useRef<HTMLInputElement>(null);

  const { data: whitelabel, isLoading } = useQuery({
    queryKey: ['whitelabel'],
    queryFn: async () => {
      const res = await api.get('/settings/whitelabel');
      return res.data;
    },
  });

  useEffect(() => {
    if (whitelabel) {
      setPrimaryColor(whitelabel.primaryColor || '#4f46e5');
      setCompanyNameOverride(whitelabel.companyNameOverride || '');
      setLogoUrl(whitelabel.logoUrl || '');
      setPoweredByLabel(whitelabel.poweredByLabel || '');
      setPoweredByLogoUrl(whitelabel.poweredByLogoUrl || '');
    }
  }, [whitelabel]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.put('/settings/whitelabel', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelabel'] });
      alert('Whitelabel settings saved successfully!');
    },
  });

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLogoUrl(res.data.url);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePoweredByLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPoweredByUploadError('');
    setPoweredByUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPoweredByLogoUrl(res.data.url);
    } catch (err: any) {
      setPoweredByUploadError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setPoweredByUploading(false);
      if (poweredByFileInputRef.current) poweredByFileInputRef.current.value = '';
    }
  };

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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors disabled:opacity-60"
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Company logo" className="h-14 max-w-[220px] object-contain mb-2" />
              ) : (
                <Upload size={20} className="mb-2" />
              )}
              {uploading ? (
                <span className="text-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Uploading...</span>
              ) : (
                <>
                  <span className="text-sm">{logoUrl ? 'Click to replace logo' : 'Click to upload or drag and drop'}</span>
                  <span className="text-xs mt-1">PNG, JPG, or WEBP (max. 5MB)</span>
                </>
              )}
            </button>
            {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}
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

          <div className="grid gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-2">Powered By (reseller / partner attribution)</label>
            <p className="text-xs text-zinc-500">Shown above the login form on your workspace's login page. Leave empty to hide it.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <input
                  type="text"
                  placeholder="e.g. Design House India Pvt. Ltd."
                  value={poweredByLabel}
                  onChange={(e) => setPoweredByLabel(e.target.value)}
                  className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <input
                  ref={poweredByFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handlePoweredByLogoSelect}
                />
                <button
                  type="button"
                  onClick={() => poweredByFileInputRef.current?.click()}
                  disabled={poweredByUploading}
                  className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-3 flex items-center justify-center gap-2 text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors disabled:opacity-60"
                >
                  {poweredByLogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poweredByLogoUrl} alt="Powered by logo" className="h-8 max-w-[160px] object-contain" />
                  ) : (
                    <>
                      <Upload size={16} />
                      <span className="text-sm">{poweredByUploading ? 'Uploading...' : 'Upload partner logo'}</span>
                    </>
                  )}
                </button>
                {poweredByUploadError && <p className="text-xs text-rose-600">{poweredByUploadError}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => updateMutation.mutate({ primaryColor, companyNameOverride, logoUrl, poweredByLabel, poweredByLogoUrl })}
              disabled={updateMutation.isPending || isLoading || uploading}
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
