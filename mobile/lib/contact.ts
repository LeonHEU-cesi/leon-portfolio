// Helpers purs de contact mobile (testables sans I/O).
export const CONTACT_EMAIL = 'leonheu97@gmail.com';
export const GITHUB_URL = 'https://github.com/LeonHEU-cesi';

export function buildMailtoUrl(email: string, subject?: string): string {
  const base = `mailto:${email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
