// En-têtes de sécurité (pur, testable). CSP sans nonce en V1
// ('unsafe-inline' style/script toléré pour Next/Tailwind ; durcissement
// nonce prévu V2). Objectif Mozilla Observatory B+.
const CSP_DIRECTIVES: Record<string, string> = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline'",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: blob: https:",
  'font-src': "'self' data:",
  'connect-src': "'self' https:",
  'frame-ancestors': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'",
  'object-src': "'none'",
};

export function buildCsp(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([k, v]) => `${k} ${v}`)
    .join('; ');
}

export const securityHeaders: { key: string; value: string }[] = [
  { key: 'Content-Security-Policy', value: buildCsp() },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];
