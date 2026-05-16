// Validation pure de la forme des identifiants (sans I/O) — testable,
// réutilisée par le provider Credentials d'Auth.js.
export type ParsedCredentials = { email: string; password: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function parseCredentials(raw: unknown): ParsedCredentials | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as Record<string, unknown>;
  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  const password =
    typeof record.password === "string" ? record.password : "";
  if (!email || !password) return null;
  if (!EMAIL_RE.test(email)) return null;
  return { email, password };
}
