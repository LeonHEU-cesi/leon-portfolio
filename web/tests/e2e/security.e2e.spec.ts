import { expect, test } from "@playwright/test";

// #6.4 — vérifie que les en-têtes de sécurité (#6.1) sont bien servis.
test.describe("Sécurité — en-têtes HTTP", () => {
  test("la home renvoie CSP, X-Frame-Options, nosniff, Referrer-Policy", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response).not.toBeNull();
    const headers = response!.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
