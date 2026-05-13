/**
 * Headers alinhados ao `vercel.json` para testar CSP localmente (`vite preview`).
 * Manter `CONTENT_SECURITY_POLICY` idêntico ao valor em vercel.json → headers → Content-Security-Policy.
 */
export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com https://www.google.com https://fonts.googleapis.com; frame-src https://www.google.com";

/** HSTS só faz sentido em HTTPS na Vercel; omitido no preview local. */
export const previewSecurityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
};
