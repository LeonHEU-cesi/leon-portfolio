// Limiteur fenêtre fixe en mémoire (par instance serveur — suffisant V1
// self-host ; documenté). Pur (now injectable) → testable.
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export type RateResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateResult {
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
}

// Réservé aux tests.
export function _resetRateLimitStore(): void {
  store.clear();
}
