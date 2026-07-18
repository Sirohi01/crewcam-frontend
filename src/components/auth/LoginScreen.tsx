'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { getClientSubdomain } from '@/lib/subdomain';
import { applyBrandColors } from '@/lib/branding';
import { useTenantBranding } from '@/hooks/useTenantBranding';
import { CrewcamLogo } from '@/components/branding/CrewcamLogo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Loader2, User, ShieldCheck, ArrowRight,
  CalendarCheck, IndianRupee, Users, GraduationCap,
  TrendingUp, PieChart, FolderOpen, Building2, Globe,
  Sun, Moon, ChevronDown, Info, UsersRound,
} from 'lucide-react';

const OTP_RESEND_SECONDS = 30;

const FEATURES = [
  { icon: Users, label: 'Employee Management' },
  { icon: CalendarCheck, label: 'Attendance & Leave' },
  { icon: IndianRupee, label: 'Payroll Management' },
  { icon: TrendingUp, label: 'Performance Analytics' },
  { icon: GraduationCap, label: 'Learning & Development' },
  { icon: ShieldCheck, label: 'Compliance & Policies' },
  { icon: PieChart, label: 'Reports & Insights' },
  { icon: FolderOpen, label: 'Document Management' },
];

const STATS = [
  { icon: Users, value: '5000+', label: 'Employees' },
  { icon: Building2, value: '200+', label: 'Organizations' },
  { icon: Globe, value: '25+', label: 'Countries' },
  { icon: ShieldCheck, value: '99.9%', label: 'System Uptime' },
];

type Variant = 'employee' | 'employer';

const VARIANT_COPY: Record<Variant, {
  heading: string;
  icon: typeof UsersRound;
  switchHref: string;
  switchLabel: string;
}> = {
  employee: {
    heading: 'Employee Login',
    icon: UsersRound,
    switchHref: '/employer-login',
    switchLabel: 'Are you a Company Admin? Employer Login',
  },
  employer: {
    heading: 'Employer Login',
    icon: Building2,
    switchHref: '/login',
    switchLabel: 'Are you an Employee? Employee Login',
  },
};

export default function LoginScreen({ variant }: { variant: Variant }) {
  const copy = VARIANT_COPY[variant];
  const rememberedKey = `crewcam_remembered_identifier_${variant}`;

  const [corporateId, setCorporateId] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [redirectHint, setRedirectHint] = useState('');
  const [info, setInfo] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const brandRef = useRef<HTMLDivElement>(null);
  const { branding } = useTenantBranding();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(rememberedKey) : null;
    if (saved) {
      setIdentifier(saved);
      setRememberMe(true);
    }
  }, [rememberedKey]);

  useEffect(() => {
    if (branding && brandRef.current) applyBrandColors(brandRef.current, branding);
  }, [branding]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const handleSendOtp = async () => {
    if (variant === 'employer' && !corporateId) {
      setError('Please enter your Corporate ID first.');
      return;
    }
    if (!identifier) {
      setError('Please enter your User ID (Employee Code / Email) first.');
      return;
    }
    setError('');
    setRedirectHint('');
    setInfo('');
    setSendingOtp(true);
    try {
      const subdomain = getClientSubdomain();
      const response = await api.post('/auth/login/send-otp', {
        identifier,
        subdomain,
        portal: 'employer',
        loginType: variant,
        ...(variant === 'employer' ? { corporateId } : {}),
      });
      setOtpSent(true);
      setResendIn(OTP_RESEND_SECONDS);
      // No SMS provider is configured yet, so the backend echoes the OTP back outside
      // production instead of delivering it — show it here so the flow is testable.
      setInfo(
        response.data.otp
          ? `SMS isn't configured yet — your OTP is ${response.data.otp} (dev only).`
          : 'An OTP has been sent to your registered mobile number.'
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not send OTP. Please try again.');
      setRedirectHint(err.response?.data?.redirectTo || '');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRedirectHint('');

    try {
      if (rememberMe) localStorage.setItem(rememberedKey, identifier);
      else localStorage.removeItem(rememberedKey);

      const subdomain = getClientSubdomain();
      const response = await api.post('/auth/login/verify-otp', {
        identifier,
        otp,
        subdomain,
        portal: 'employer',
        loginType: variant,
        ...(variant === 'employer' ? { corporateId } : {}),
      });
      const { user } = response.data;
      setAuth(user, user.tenantId);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
      setRedirectHint(err.response?.data?.redirectTo || '');
    } finally {
      setLoading(false);
    }
  };

  const isDark = mounted && resolvedTheme === 'dark';
  const brandName = branding?.companyNameOverride;
  const VariantIcon = copy.icon;

  return (
    <div ref={brandRef} className="relative flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
      {/* Full-page background photo, shared behind both panels (desktop only — mobile keeps a plain background) */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/emp-login.jpg"
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-cover object-top dark:hidden ${heroImageFailed ? 'hidden' : ''}`}
          onError={() => setHeroImageFailed(true)}
        />
      </div>

      {/* Left: Branding / Product Showcase */}
      <div className="relative z-10 hidden w-1/2 lg:block h-full shrink-0 overflow-hidden">
        <div className={`relative z-10 flex h-full min-h-0 flex-col justify-center p-8 xl:p-10 ${!isDark && !heroImageFailed && !branding?.logoUrl ? 'pt-40 xl:pt-44' : ''}`}>
          {/* Logo / wordmark — shown for a tenant's custom logo, in dark mode, or if the photo failed to load.
              Otherwise the default Crewcam wordmark is already baked into the photo above. */}
          {(branding?.logoUrl || isDark || heroImageFailed) && (
            <div className="flex items-center gap-3 shrink-0">
              {branding?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={branding.logoUrl} alt={brandName || 'Company logo'} className="h-14 max-w-[180px] object-contain" />
              ) : (
                <CrewcamLogo size={72} className="shrink-0" />
              )}
              <div>
                <p className="text-3xl font-extrabold leading-none tracking-tight text-[var(--brand-primary)] dark:text-white">
                  {brandName || (<>Crew<span className="text-[var(--brand-secondary)]">cam</span></>)}
                </p>
                {!brandName && <p className="mt-1.5 text-sm font-semibold tracking-[0.5em] text-[var(--brand-primary)] dark:text-white">H R M S</p>}
              </div>
            </div>
          )}
          {!brandName && (branding?.logoUrl || isDark || heroImageFailed) && (
            <p className="mt-3 flex items-center gap-2 text-[10px] tracking-[0.25em] text-zinc-500 dark:text-zinc-400 shrink-0">
              <span className="h-px w-6 bg-[var(--brand-secondary)]/60" /> INSIGHT &bull; INNOVATION &bull; IMPACT <span className="h-px w-6 bg-[var(--brand-secondary)]/60" />
            </p>
          )}

          {/* Headline */}
          <h1 className="mt-8 text-[34px] font-extrabold leading-tight text-[var(--brand-primary)] dark:text-white shrink-0 xl:text-[38px]">
            Empowering People.
            <br />
            <span className="text-[var(--brand-secondary)]">Elevating Performance.</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm text-zinc-600 dark:text-zinc-300 shrink-0">
            {brandName || 'Crewcam HRMS'} is a comprehensive platform that simplifies HR operations, boosts productivity and drives organizational excellence.
          </p>

          {/* Feature grid */}
          <div className="relative z-10 mt-8 grid grid-cols-4 gap-3 shrink-0">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/90 p-3 text-center shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:text-[var(--brand-secondary)]">
                  <f.icon size={18} />
                </span>
                <p className="text-[11px] leading-tight text-zinc-700 dark:text-zinc-300">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="relative z-10 mt-6 grid grid-cols-4 gap-3 rounded-xl bg-[var(--brand-primary)] p-4 shrink-0">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={18} className="shrink-0 text-[var(--brand-secondary)]" />
                <div>
                  <p className="text-base font-bold text-white leading-none">{s.value}</p>
                  <p className="mt-0.5 text-[10px] text-slate-300 leading-none">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="relative z-10 flex w-full flex-col justify-center h-full overflow-y-auto px-8 lg:w-1/2 xl:px-20 bg-white lg:bg-transparent dark:bg-zinc-950">
        <div className="absolute right-6 top-6 z-10 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <button type="button" className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            <Globe size={15} /> English <ChevronDown size={13} />
          </button>
          <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {mounted && isDark ? <Sun size={15} /> : <Moon size={15} />}
            {mounted && isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="mx-auto w-full max-w-[380px] py-6">

          <div className="flex items-center gap-2 mb-6 lg:hidden text-zinc-900 dark:text-zinc-50">
            {branding?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={branding.logoUrl} alt={brandName || 'Company logo'} className="h-8 max-w-[160px] object-contain" />
            ) : (
              <CrewcamLogo size={32} />
            )}
            <span className="text-lg font-md tracking-tight">{brandName || 'Crewcam HRMS'}</span>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-7 shadow-[0_20px_50px_-20px_rgba(11,22,56,0.25)] dark:border-zinc-800 dark:bg-zinc-900">
            {branding?.poweredByLogoUrl && (
              <div className="mb-6 flex flex-col items-center text-center">
                <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  <span className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" /> Powered by <span className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" />
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={branding.poweredByLogoUrl} alt={branding.poweredByLabel || 'Partner logo'} className="h-10 max-w-[160px] object-contain" />
                {branding.poweredByLabel && (
                  <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">{branding.poweredByLabel}</p>
                )}
              </div>
            )}

            <div className="mb-6 flex flex-col items-center text-center">
              {branding?.logoUrl ? (
                // The company's own logo, resolved from their subdomain — takes over the
                // generic icon entirely so this reads as their branded portal.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={branding.logoUrl} alt={brandName || 'Company logo'} className="mb-3 h-16 max-w-[220px] object-contain" />
              ) : (
                <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
                  <VariantIcon size={26} className="text-[var(--brand-primary)] dark:text-[var(--brand-secondary)]" />
                </div>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)] dark:text-zinc-50">
                {copy.heading}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to access your {brandName || 'Crewcam HRMS'} account
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-[var(--brand-secondary)]" />
            </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {variant === 'employer' && (
              <div className="space-y-1.5">
                <Label htmlFor="corporateId" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Corporate ID
                </Label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="corporateId"
                    type="text"
                    placeholder="Enter your Corporate ID"
                    required
                    className="h-11 pl-10 pr-4 text-sm border-zinc-200 bg-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] focus-visible:border-[var(--brand-primary)] transition-colors shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                    value={corporateId}
                    onChange={(e) => { setCorporateId(e.target.value); setOtpSent(false); setOtp(''); }}
                    disabled={sendingOtp || loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="identifier" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                User ID (Employee Code / Email)
              </Label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your User ID"
                  required
                  className="h-11 pl-10 pr-4 text-sm border-zinc-200 bg-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] focus-visible:border-[var(--brand-primary)] transition-colors shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setOtpSent(false); setOtp(''); }}
                  disabled={sendingOtp || loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="otp" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                OTP (One Time Password)
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6 digit OTP"
                    required
                    maxLength={6}
                    className="h-11 pl-10 pr-4 text-sm border-zinc-200 bg-white rounded-xl focus-visible:ring-1 focus-visible:ring-[var(--brand-primary)] focus-visible:border-[var(--brand-primary)] transition-colors shadow-sm tracking-widest dark:border-zinc-700 dark:bg-zinc-900"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || loading || resendIn > 0}
                  className="h-11 shrink-0 rounded-xl border-[var(--brand-primary)] px-4 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 dark:text-[var(--brand-secondary)] dark:border-[var(--brand-secondary)]"
                >
                  {sendingOtp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : resendIn > 0 ? (
                    `Resend (${resendIn}s)`
                  ) : otpSent ? 'Resend OTP' : 'Send OTP'}
                </Button>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Info size={12} className="shrink-0" /> OTP will be sent to your registered mobile number
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => { setError(''); setInfo('Please contact your HR administrator to update your registered mobile number.'); }}
                className="text-sm font-medium text-[var(--brand-secondary)] hover:opacity-80 transition-opacity"
              >
                Change Mobile Number?
              </button>
            </div>

            {info && !error && (
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg dark:bg-sky-950/40 dark:border-sky-900">
                <p className="text-sm font-medium text-sky-700 dark:text-sky-400">{info}</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg dark:bg-rose-950/40 dark:border-rose-900">
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
                {redirectHint && (
                  <Link href={redirectHint} className="mt-1 inline-block text-sm font-semibold text-rose-700 underline dark:text-rose-300">
                    Go there now &rarr;
                  </Link>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold bg-[var(--brand-primary)] text-white hover:opacity-90 rounded-xl shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
              disabled={loading || !otpSent}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  Login <ArrowRight size={15} />
                </span>
              )}
            </Button>
          </form>
          </div>

          <p className="mt-4 text-center text-sm">
            <Link href={copy.switchHref} className="font-medium text-[var(--brand-secondary)] hover:opacity-80 transition-opacity">
              {copy.switchLabel}
            </Link>
          </p>

          <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Need help?{' '}
            <a href="mailto:support@crewcam.app" className="font-medium text-[var(--brand-secondary)] hover:opacity-80">
              Contact Support
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
