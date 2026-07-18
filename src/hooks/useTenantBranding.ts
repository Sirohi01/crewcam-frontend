'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getClientSubdomain } from '@/lib/subdomain';
import type { TenantBranding } from '@/lib/branding';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Resolves the current tenant's white-label branding (if any) from the subdomain, for use
 * on the pre-login login page. Uses a plain axios call rather than the shared `api` client
 * since that client attaches an x-tenant-id header left over from any previous session on
 * this browser, which has nothing to do with which subdomain we're actually on.
 */
export function useTenantBranding() {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subdomain = getClientSubdomain();
    if (!subdomain) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    axios
      .get(`${API_URL}/settings/whitelabel/public`, { params: { subdomain } })
      .then((res) => {
        if (!cancelled) setBranding(res.data);
      })
      .catch(() => {
        if (!cancelled) setBranding(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { branding, isLoading };
}
