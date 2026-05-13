/**
 * Base URL for canonical and OG URLs. Set VITE_SITE_URL in .env for production.
 * All other SEO values are fetched from the API (admin-configurable).
 * @type {string}
 */
const isPrerendering =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('ReactSnap')

export const SITE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
    : (typeof window !== 'undefined' && !isPrerendering)
      ? window.location.origin
      : 'https://petalsforher.com'
