'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setDone(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm text-center space-y-3">
        <p className="text-sm text-rose-600">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          <ArrowLeft size={14} /> Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm text-center space-y-3">
        <CheckCircle2 className="mx-auto text-emerald-500" size={32} />
        <h1 className="text-lg font-md text-zinc-900">Password reset</h1>
        <p className="text-sm text-zinc-500">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-md tracking-tight text-zinc-900 mb-1.5">Reset Password</h1>
      <p className="text-sm text-zinc-500 mb-6">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-md uppercase tracking-wider text-zinc-600">New Password</Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="password"
              type="password"
              required
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="h-12 pl-10 pr-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-xs font-md uppercase tracking-wider text-zinc-600">Confirm Password</Label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              id="confirmPassword"
              type="password"
              required
              className="h-12 pl-10 pr-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
            <p className="text-sm font-medium text-rose-600">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full h-12 text-base font-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-md shadow-indigo-600/20">
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resetting...</> : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-2 mb-10 text-zinc-900">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <span className="text-white font-md text-sm">C</span>
          </div>
          <span className="text-lg font-md tracking-tight">CrewCam HR Cloud</span>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
