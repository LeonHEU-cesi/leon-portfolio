import { expect, test } from "@playwright/test";

// TE-04 — garde admin + login. Déterministe sans DB en CI : la garde
// middleware n'a pas besoin de DB ; sans DB, authorize échoue → message
// générique (anti-énumération). Requêtes scopées à <main> (Header/Footer).
test.describe("Admin — authentification", () => {
  test("TE-04 — /admin non connecté redirige vers /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1, name: /connexion/i }),
    ).toBeVisible();
  });

  test("TE-04 — identifiants invalides → message générique", async ({ page }) => {
    await page.goto("/login");
    const main = page.getByRole("main");
    await main.getByLabel(/email/i).fill("bad@test.local");
    await main.getByLabel(/mot de passe/i).fill("wrongpass");
    await main.getByRole("button", { name: /se connecter/i }).click();
    await expect(main.getByRole("alert")).toBeVisible();
  });
});
