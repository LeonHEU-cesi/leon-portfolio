import { test, expect } from "@playwright/test";

// Smoke prod (#7.10) — vérifie qu'un déploiement live répond et que le
// durcissement (#6.x) est bien actif. Mappe Cahier_de_tests TF-WEB-01..08.
// Lancé par Léon après mise en prod (cf. deploiement-prod.md).

test("TF-WEB-01 — accueil répond et rend le hero", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.getByRole("main")).toBeVisible();
});

test("TF-WEB-02 — catalogue projets accessible", async ({ page }) => {
  const res = await page.goto("/projets");
  expect(res?.status()).toBeLessThan(400);
  await expect(page.getByRole("main")).toBeVisible();
});

test("TF-WEB-03 — page CV accessible", async ({ page }) => {
  const res = await page.goto("/cv");
  expect(res?.status()).toBeLessThan(400);
});

test("TF-WEB-04 — API publique renvoie du JSON projets", async ({ request }) => {
  const res = await request.get("/api/projects");
  expect(res.ok()).toBeTruthy();
  const body = (await res.json()) as { projects: unknown[] };
  expect(Array.isArray(body.projects)).toBe(true);
});

test("TF-WEB-05 — détail projet inexistant -> 404 JSON", async ({ request }) => {
  const res = await request.get("/api/projects/__inexistant__");
  expect(res.status()).toBe(404);
});

test("TF-WEB-06 — en-têtes de sécurité présents", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toBeTruthy();
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["strict-transport-security"]).toContain("max-age=");
});

test("TF-WEB-07 — /admin protégé (redirection login)", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/(login|api\/auth)/);
});

test("TF-WEB-08 — UI de doc API servie", async ({ request }) => {
  const res = await request.get("/api/openapi");
  expect(res.ok()).toBeTruthy();
  const spec = (await res.json()) as { openapi: string };
  expect(spec.openapi).toBe("3.1.0");
});
