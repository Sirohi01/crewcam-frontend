'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-2 mb-10 text-zinc-900">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
            <span className="text-white font-md text-sm">C</span>
          </div>
          <span className="text-lg font-md tracking-tight">CrewCam HR Cloud</span>
        </div>

        {sent ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm text-center space-y-3">
            <CheckCircle2 className="mx-auto text-emerald-500" size={32} />
            <h1 className="text-lg font-md text-zinc-900">Check your email</h1>
            <p className="text-sm text-zinc-500">
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            </p>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 pt-2">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-md tracking-tight text-zinc-900 mb-1.5">Forgot Password</h1>
            <p className="text-sm text-zinc-500 mb-6">Enter your account email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-md uppercase tracking-wider text-zinc-600">Email Address</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="h-12 pl-10 pr-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                  <p className="text-sm font-medium text-rose-600">{error}</p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-md shadow-indigo-600/20">
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : 'Send Reset Link'}
              </Button>
            </form>

            <Link href="/login" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-700">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
