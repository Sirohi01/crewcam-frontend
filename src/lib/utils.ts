import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEmployeeId(id?: string | null): string {
  if (!id) return '';
  let str = String(id).trim();
  // Strip 'EMP-' prefix if it was attached before a 4-part code
  if (/^EMP-[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+$/i.test(str)) {
    str = str.replace(/^EMP-/i, '');
  }
  if (/^EMP-[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/i.test(str)) {
    str = str.replace(/^EMP-/i, '');
  }
  // If it's a 4-segment hyphenated code (e.g. NAM-HQ-26-0011 or CC-HQ-26-001), convert to slashes
  if (/^[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+$/i.test(str)) {
    return str.replace(/-/g, '/').toUpperCase();
  }
  // If it's already slash separated (e.g. NAM/HQ/26/0011), ensure uppercase
  if (/^[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/i.test(str)) {
    return str.toUpperCase();
  }
  return str;
}
