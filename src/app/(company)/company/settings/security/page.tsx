'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, QrCode, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation } from '@tanstack/react-query';

export default function SecurityPage() {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  const [isSettingUp, setIsSettingUp] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  const { data: setupData, refetch: getSetupData, isFetching: isFetchingSetup } = useQuery({
    queryKey: ['setup2fa'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/auth/2fa/setup', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to setup 2FA');
      }
      return res.json();
    },
    enabled: false // Only fetch when they click "Enable 2FA"
  });

  const enableMutation = useMutation({
    mutationFn: async (otpToken: string) => {
      const res = await fetch('http://localhost:8000/api/v1/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token: otpToken })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to verify token');
      }
      return res.json();
    },
    onSuccess: () => {
      alert('2FA has been successfully enabled!');
      setIsSettingUp(false);
      window.location.reload(); // Reload to update state
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  const disableMutation = useMutation({
    mutationFn: async (otpToken: string) => {
      const res = await fetch('http://localhost:8000/api/v1/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token: otpToken })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to verify token');
      }
      return res.json();
    },
    onSuccess: () => {
      alert('2FA has been disabled.');
      window.location.reload(); // Reload to update state
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  const handleStartSetup = () => {
    setIsSettingUp(true);
    getSetupData();
  };

  const handleEnableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) return;
    enableMutation.mutate(tokenInput);
  };

  const handleDisableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput) return;
    disableMutation.mutate(tokenInput);
  };

  // Wait, the user state might not contain twoFactorEnabled if not fetched properly,
  // but let's assume if it is enabled, we show Disable UI.
  // We can just rely on the user object, or we can fetch profile.
  // For now, let's just show an "Enable" button if they haven't set it up.
  // If they have, clicking "Enable" will just return "2FA is already enabled".

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Security</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Account Protection</p>
        </div>
      </div>

      <Card className="max-w-2xl border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account by requiring a code from your authenticator app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {!isSettingUp ? (
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
                <ShieldAlert size={20} className="text-zinc-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-md text-zinc-900 dark:text-zinc-100">Protect Your Account</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Two-factor authentication adds an extra layer of security to your account. To log in, in addition you'll need to provide a 6 digit code.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStartSetup}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Set up Authenticator App
                </button>

                <form onSubmit={handleDisableSubmit} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code to disable"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm w-56"
                  />
                  <button
                    type="submit"
                    disabled={disableMutation.isPending}
                    className="text-sm font-medium px-4 py-2 rounded-md transition-colors border border-zinc-200 hover:bg-zinc-50 text-rose-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {disableMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    Disable 2FA
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isFetchingSetup ? (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 size={16} className="animate-spin" /> Generating QR Code...
                </div>
              ) : setupData ? (
                <>
                  <div className="flex items-start gap-6">
                    <div className="p-2 bg-white border border-zinc-200 rounded-lg shrink-0">
                      <img src={setupData.qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-md">1. Scan QR Code</h3>
                      <p className="text-xs text-zinc-500">
                        Open your authenticator app (like Google Authenticator or Authy) and scan this QR code.
                      </p>

                      <div className="pt-2">
                        <h3 className="text-sm font-md">2. Enter Code</h3>
                        <p className="text-xs text-zinc-500 mb-2">
                          Enter the 6-digit code generated by the app.
                        </p>
                        <form onSubmit={handleEnableSubmit} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="000000"
                            value={tokenInput}
                            onChange={e => setTokenInput(e.target.value)}
                            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm w-32 tracking-widest"
                            maxLength={6}
                          />
                          <button
                            type="submit"
                            disabled={enableMutation.isPending}
                            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {enableMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                            Verify & Enable
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-zinc-100 pt-4">
                    <button
                      onClick={() => setIsSettingUp(false)}
                      className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      Cancel Setup
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-sm text-rose-500">Failed to load setup data. It might already be enabled.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
