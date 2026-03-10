import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Base URL for the backend API.
 *
 * - In production (Vercel, etc.), you **must** set NEXT_PUBLIC_API_URL.
 * - In local development, if NEXT_PUBLIC_API_URL is missing, we fall back to http://localhost:5000.
 */
function resolveApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  // In production without a configured API URL, fail loudly in console.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(
      'NEXT_PUBLIC_API_URL is not set. Configure it in your Vercel/hosting environment so the admin can reach the backend.'
    );
  }
  return '';
}

export const API_BASE = resolveApiBase();
