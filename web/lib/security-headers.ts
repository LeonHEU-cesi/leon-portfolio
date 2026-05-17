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

// CSP assouplie pour la seule route /api/docs : Scalar est chargé depuis
// jsDelivr (script + styles + polices) et récupère le spec same-origin.
// Le reste du site garde la CSP stricte (cf. next.config.ts, source exclut
// /api/docs). 'unsafe-eval' scopé ici uniquement (#7.4).
const SCALAR_CDN = 'https://cdn.jsdelivr.net';

export function buildScalarCsp(): string {
  return buildCsp()
    .replace(
      "script-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${SCALAR_CDN}`,
    )
    .replace(
      "style-src 'self' 'unsafe-inline'",
      `style-src 'self' 'unsafe-inline' ${SCALAR_CDN} https://fonts.googleapis.com`,
    )
    .replace(
      "font-src 'self' data:",
      `font-src 'self' data: ${SCALAR_CDN} https://fonts.gstatic.com`,
    )
    .replace(
      "connect-src 'self' https:",
      `connect-src 'self' https: ${SCALAR_CDN}`,
    );
}

const sharedHardeningHeaders: { key: string; value: string }[] = [
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

export const securityHeaders: { key: string; value: string }[] = [
  { key: 'Content-Security-Policy', value: buildCsp() },
  ...sharedHardeningHeaders,
];

// Mêmes garanties (HSTS, nosniff, anti-clickjacking…) mais CSP élargie au
// CDN Scalar, appliquée uniquement à /api/docs.
export const scalarSecurityHeaders: { key: string; value: string }[] = [
  { key: 'Content-Security-Policy', value: buildScalarCsp() },
  ...sharedHardeningHeaders,
];
