import { describe, expect, it } from "vitest";

import { buildCsp, securityHeaders } from "@/lib/security-headers";

describe("buildCsp", () => {
  it("contient les directives clés", () => {
    const csp = buildCsp();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });
});

describe("securityHeaders", () => {
  it("expose HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, CSP", () => {
    const byKey = Object.fromEntries(
      securityHeaders.map((h) => [h.key, h.value]),
    );
    expect(byKey["Strict-Transport-Security"]).toContain("max-age=63072000");
    expect(byKey["X-Frame-Options"]).toBe("DENY");
    expect(byKey["X-Content-Type-Options"]).toBe("nosniff");
    expect(byKey["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(byKey["Content-Security-Policy"]).toBeTruthy();
  });
});
