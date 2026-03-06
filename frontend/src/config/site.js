/**
 * Base URL for canonical and OG URLs. Set VITE_SITE_URL in .env for production.
 * All other SEO values are fetched from the API (admin-configurable).
 * @type {string}
 */
export const SITE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : (typeof window !== 'undefined' ? window.location.origin : 'https://petalsforher.com')
