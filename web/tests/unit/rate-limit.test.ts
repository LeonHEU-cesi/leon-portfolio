import { beforeEach, describe, expect, it } from "vitest";

import { _resetRateLimitStore, rateLimit } from "@/lib/rate-limit";

beforeEach(() => {
  _resetRateLimitStore();
});

describe("rateLimit", () => {
  it("autorise jusqu'à la limite puis bloque", () => {
    const k = "k1";
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(k, 5, 1000, 1000).allowed).toBe(true);
    }
    const blocked = rateLimit(k, 5, 1000, 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("réinitialise après la fenêtre", () => {
    const k = "k2";
    for (let i = 0; i < 5; i++) rateLimit(k, 5, 1000, 1000);
    expect(rateLimit(k, 5, 1000, 1000).allowed).toBe(false);
    // Fenêtre expirée → de nouveau autorisé
    expect(rateLimit(k, 5, 1000, 2001).allowed).toBe(true);
  });

  it("isole les clés", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", 5, 1000, 1000);
    expect(rateLimit("a", 5, 1000, 1000).allowed).toBe(false);
    expect(rateLimit("b", 5, 1000, 1000).allowed).toBe(true);
  });
});
