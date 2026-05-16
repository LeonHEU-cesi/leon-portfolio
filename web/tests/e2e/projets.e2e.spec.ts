import { expect, test } from "@playwright/test";

// Sans base en CI (job e2e), /projets retombe sur le mock (fallback 2.3) :
// le parcours reste déterministe sans Postgres.
test.describe("Parcours catalogue Projets", () => {
  test("TE-01 — /projets affiche le catalogue", async ({ page }) => {
    await page.goto("/projets");
    await expect(page.getByRole("heading", { level: 1, name: /projets/i })).toBeVisible();
    await expect(page.getByRole("article").first()).toBeVisible();
  });

  test("TE-03 — filtre tag (URL sync) puis catalogue → détail → retour", async ({
    page,
  }) => {
    await page.goto("/projets");

    // Filtre : 1er chip "Filtrer par …" → l'URL porte ?tags=
    await page.getByRole("link", { name: /filtrer par/i }).first().click();
    await expect(page).toHaveURL(/\?tags=/);
    await expect(page.getByRole("article").first()).toBeVisible();

    // Catalogue → détail via le lien interne de la carte
    const detailLink = page.locator('article a[href^="/projets/"]').first();
    const href = await detailLink.getAttribute("href");
    expect(href).toBeTruthy();
    await detailLink.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Retour catalogue
    await page.getByRole("link", { name: /tous les projets/i }).click();
    await expect(page).toHaveURL(/\/projets$/);
  });
});
