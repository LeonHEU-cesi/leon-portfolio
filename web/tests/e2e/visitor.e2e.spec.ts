import { expect, test } from "@playwright/test";

// Complète la couverture TE : parcours visiteur accueil → projets (TE-02)
// et 404 propres (TE-05). Déterministe sans DB (fallback mock).
test.describe("Parcours visiteur & 404", () => {
  test("TE-02 — accueil → CTA → /projets", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    await main.getByRole("link", { name: /voir tous les projets/i }).click();
    await expect(page).toHaveURL(/\/projets$/);
    await expect(main.getByRole("heading", { level: 1, name: /projets/i })).toBeVisible();
  });

  test("TE-05 — route inconnue → 404", async ({ page }) => {
    const res = await page.goto("/cette-page-nexiste-pas");
    expect(res?.status()).toBe(404);
  });

  test("TE-05 — projet slug inconnu → 404", async ({ page }) => {
    const res = await page.goto("/projets/slug-totalement-inconnu-xyz");
    expect(res?.status()).toBe(404);
  });
});
