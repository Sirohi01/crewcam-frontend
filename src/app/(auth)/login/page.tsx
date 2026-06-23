'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Command } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [totpToken, setTotpToken] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (requires2FA) {
        const response = await api.post('/auth/login-2fa', { email, password, token: totpToken });
        const { user } = response.data;
        setAuth(user, user.tenantId);

        if (user.tenantId && user.tenantId !== 'SUPER_ADMIN') {
          router.push('/dashboard');
        } else {
          router.push('/super-admin');
        }
      } else {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.requires2FA) {
          setRequires2FA(true);
          return;
        }

        const { user } = response.data;
        setAuth(user, user.tenantId);

        if (user.tenantId && user.tenantId !== 'SUPER_ADMIN') {
          router.push('/dashboard');
        } else {
          router.push('/super-admin');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">

      {/* Left Side: Stunning Architectural Image */}
      <div className="relative hidden w-1/2 lg:block">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')" }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />

        {/* Content over image */}
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Command className="w-8 h-8" />
            <span className="text-2xl font-md tracking-tight">CREWCAM</span>
          </div>
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-snug">
              "The most powerful tool we've used to unify our workforce and scale our operations globally."
            </p>
            <footer className="text-sm font-medium text-zinc-300">Sofia Davis, VP of Operations</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Ultra Clean Minimalist Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden text-zinc-900">
            <Command className="w-6 h-6" />
            <span className="text-xl font-md tracking-tight">CREWCAM</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-md tracking-tight text-zinc-900 mb-2">Sign in to your account</h1>
            <p className="text-sm text-zinc-500">Enter your email and password to access the portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                className="h-12 px-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                  Password
                </Label>
                <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 px-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={requires2FA}
              />
            </div>

            {requires2FA && (
              <div className="space-y-2">
                <Label htmlFor="totpToken" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                  Authentication Code (2FA)
                </Label>
                <Input
                  id="totpToken"
                  type="text"
                  placeholder="123456"
                  required
                  className="h-12 px-4 text-base border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors shadow-sm text-center tracking-widest text-lg"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  maxLength={6}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-md bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            By clicking continue, you agree to our{' '}
            <a href="#" className="font-md text-zinc-900 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="font-md text-zinc-900 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

    </div>
  );
}
