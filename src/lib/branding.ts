export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  themeMode?: 'light' | 'dark' | 'system';
  companyNameOverride?: string;
  poweredByLabel?: string;
  poweredByLogoUrl?: string;
}

/**
 * Applies a tenant's brand colors as scoped CSS custom properties on the given element,
 * rather than overwriting shadcn's app-wide --primary/--secondary HSL tokens. Kept separate
 * so this can be reused later to theme the authenticated dashboard shell per tenant too.
 */
export function applyBrandColors(el: HTMLElement, branding: TenantBranding) {
  if (branding.primaryColor) el.style.setProperty('--brand-primary', branding.primaryColor);
  if (branding.secondaryColor) el.style.setProperty('--brand-secondary', branding.secondaryColor);
}
