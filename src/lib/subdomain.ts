const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'localhost'];
const SUBDOMAIN_FORMAT = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Resolves the tenant subdomain from the current browser location, e.g. "acme" from
 * acme.crewcam.com or acme.localhost:3000. Returns null for the default app domain,
 * reserved words, bare localhost, and IP hosts — the login page falls back to default
 * Crewcam branding in all of those cases.
 */
export function getClientSubdomain(): string | null {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname.toLowerCase();
  const firstLabel = hostname.split('.')[0];
  if (!firstLabel) return null;
  if (RESERVED_SUBDOMAINS.includes(firstLabel)) return null;
  if (/^\d+$/.test(firstLabel)) return null; // first octet of an IPv4 host
  if (!SUBDOMAIN_FORMAT.test(firstLabel)) return null;
  return firstLabel;
}
