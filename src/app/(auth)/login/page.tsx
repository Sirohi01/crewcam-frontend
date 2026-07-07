'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Loader2, Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight,
  CalendarCheck, Wallet, Users, ScanFace, MapPin, Bot,
  CalendarClock, BarChart3, ShieldCheck,
} from 'lucide-react';

const REMEMBERED_EMAIL_KEY = 'crewcam_remembered_email';

const FEATURES = [
  { icon: ScanFace, label: 'AI Face Recognition' },
  { icon: CalendarCheck, label: 'Smart Attendance' },
  { icon: Wallet, label: 'Payroll Automation' },
  { icon: CalendarClock, label: 'Shift Management' },
  { icon: MapPin, label: 'Live Employee Tracking' },
  { icon: Sparkles, label: 'AI Recruitment' },
];

const FLOATING_CARDS = [
  { icon: CalendarCheck, title: 'Attendance', subtitle: 'Real-time tracking', className: 'top-[2%] left-[2%]', accent: 'bg-emerald-50 text-emerald-600', delay: '0s' },
  { icon: Wallet, title: 'Payroll', subtitle: 'Automated runs', className: 'top-0 left-1/2 -translate-x-1/2', accent: 'bg-amber-50 text-amber-600', delay: '0.6s' },
  { icon: Users, title: 'Employees', subtitle: 'Unified directory', className: 'top-[2%] right-[0%]', accent: 'bg-blue-50 text-blue-600', delay: '1.2s' },
  { icon: ScanFace, title: 'AI Match', subtitle: 'Candidate scoring', className: 'top-1/2 left-0 -translate-y-1/2', accent: 'bg-violet-50 text-violet-600', delay: '1.8s' },
  { icon: CalendarClock, title: 'Schedule', subtitle: 'Shift planning', className: 'top-1/2 right-0 -translate-y-1/2', accent: 'bg-rose-50 text-rose-600', delay: '0.3s' },
  { icon: MapPin, title: 'Live Tracking', subtitle: 'Field staff visibility', className: 'bottom-0 left-[6%]', accent: 'bg-cyan-50 text-cyan-600', delay: '0.9s' },
  { icon: BarChart3, title: 'Performance', subtitle: 'Goals & reviews', className: 'bottom-0 left-1/2 -translate-x-1/2', accent: 'bg-indigo-50 text-indigo-600', delay: '1.5s' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [totpToken, setTotpToken] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(REMEMBERED_EMAIL_KEY) : null;
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (rememberMe) localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      else localStorage.removeItem(REMEMBERED_EMAIL_KEY);

      if (requires2FA) {
        const response = await api.post('/auth/login-2fa', { email, password, token: totpToken });
        const { user, token } = response.data;
        setAuth(user, user.tenantId);
        router.push(user.tenantId && user.tenantId !== 'SUPER_ADMIN' ? '/dashboard' : '/super-admin');
      } else {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.requires2FA) {
          setRequires2FA(true);
          return;
        }
        const { user, token } = response.data;
        setAuth(user, user.tenantId);
        router.push(user.tenantId && user.tenantId !== 'SUPER_ADMIN' ? '/dashboard' : '/super-admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">

      {/* Left: Branding / Product Showcase */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col h-full overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-100">
        {/* Ambient color blobs for depth */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle,#c7d2fe_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 p-7 flex flex-col h-full min-h-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <span className="text-white font-md text-base">C</span>
            </div>
            <div>
              <p className="text-base font-md tracking-tight text-zinc-900 leading-none">CrewCam</p>
              <p className="text-[11px] text-zinc-500 tracking-wide">HR CLOUD</p>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-white/70 border border-indigo-100 px-3 py-1 text-[11px] font-medium text-indigo-700 shadow-sm shrink-0">
            <Sparkles size={12} /> AI-Powered HR Platform
          </div>

          <h1 className="mt-3 text-[28px] font-md tracking-tight text-zinc-900 leading-[1.15] max-w-md shrink-0">
            The Future of <span className="text-indigo-600">Intelligent</span> Workforce Management
          </h1>
          <p className="mt-2 text-[13px] text-zinc-500 max-w-sm shrink-0">
            Recruit faster. Track smarter. Pay instantly. Manage confidently.
          </p>

          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 shrink-0">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-[12.5px] text-zinc-700">
                <span className="h-6 w-6 rounded-md bg-white border border-zinc-100 shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                  <f.icon size={12} />
                </span>
                {f.label}
              </li>
            ))}
          </ul>

          {/* Floating feature cards + AI core */}
          <div className="relative flex-1 mt-2 min-h-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-44 w-44 rounded-full bg-indigo-400/20 blur-2xl animate-glow-pulse" />
                <div className="absolute h-40 w-40 rounded-full border border-indigo-200/70 animate-pulse" />
                <div className="absolute h-28 w-28 rounded-full border border-indigo-300/70" />
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rotate-45 shadow-2xl shadow-indigo-600/50 flex items-center justify-center ring-4 ring-white/60">
                  <div className="-rotate-45 flex flex-col items-center text-white">
                    <Bot size={16} />
                    <span className="text-[8px] font-md mt-0.5 tracking-wider">AI CORE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistant bubble */}
            <div className="hidden xl:flex absolute top-[6%] right-[14%] items-center gap-1.5 rounded-xl rounded-br-sm bg-white shadow-lg border border-zinc-100 px-2.5 py-1.5 max-w-[150px] animate-float-soft">
              <Bot size={13} className="text-indigo-500 shrink-0" />
              <p className="text-[10px] text-zinc-600 leading-tight">Hi! I'm your AI HR Assistant.</p>
            </div>

            {FLOATING_CARDS.map((c) => (
              <div
                key={c.title}
                style={{ animationDelay: c.delay }}
                className={`hidden xl:flex absolute ${c.className} animate-float-soft items-center gap-2 rounded-xl bg-white/95 backdrop-blur border border-white shadow-[0_8px_24px_-8px_rgba(79,70,229,0.25)] px-2.5 py-1.5 hover:shadow-[0_10px_28px_-6px_rgba(79,70,229,0.35)] transition-shadow`}
              >
                <span className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${c.accent}`}>
                  <c.icon size={12} />
                </span>
                <div>
                  <p className="text-[10px] font-md text-zinc-800 leading-none">{c.title}</p>
                  <p className="text-[8px] text-zinc-400">{c.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="relative flex w-full flex-col justify-center h-full overflow-y-auto px-8 lg:w-1/2 xl:px-20 bg-[radial-gradient(ellipse_at_top_right,_#eef2ff_0%,_white_55%)]">
        <div className="mx-auto w-full max-w-[380px] py-6">

          <div className="flex items-center gap-2 mb-6 lg:hidden text-zinc-900">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-md text-sm">C</span>
            </div>
            <span className="text-lg font-md tracking-tight">CrewCam HR Cloud</span>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white/90 backdrop-blur-sm shadow-[0_20px_50px_-20px_rgba(79,70,229,0.25)] p-7">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 ring-1 ring-indigo-100 flex items-center justify-center text-2xl mb-3">👋</div>
              <h1 className="text-xl font-md tracking-tight text-zinc-900">Welcome Back</h1>
              <p className="text-sm text-zinc-500 mt-1">Good to see you again! Sign in to continue.</p>
            </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                Email Address
              </Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="h-11 pl-10 pr-4 text-sm border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-colors shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={requires2FA}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                Password
              </Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="h-11 pl-10 pr-11 text-sm border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-colors shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={requires2FA}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {requires2FA && (
              <div className="space-y-1.5">
                <Label htmlFor="totpToken" className="text-xs font-md uppercase tracking-wider text-zinc-600">
                  Authentication Code (2FA)
                </Label>
                <Input
                  id="totpToken"
                  type="text"
                  placeholder="123456"
                  required
                  autoFocus
                  className="h-11 px-4 border-zinc-200 bg-white rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-colors shadow-sm text-center tracking-widest text-lg"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  maxLength={6}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                />
                Remember Me
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                <p className="text-sm font-medium text-rose-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  {requires2FA ? 'Verify & Continue' : 'Continue'} <ArrowRight size={15} />
                </span>
              )}
            </Button>
          </form>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck size={12} className="text-indigo-400" /> Secured with JWT &amp; 2FA encryption
          </div>

          <p className="mt-3 text-center text-xs text-zinc-400">
            Workspace access is provisioned by CrewCam. Contact your administrator or{' '}
            <a href="mailto:support@crewcam.app" className="font-md text-zinc-600 hover:underline">CrewCam Support</a>{' '}
            if you need help signing in.
          </p>
        </div>
      </div>

    </div>
  );
}
