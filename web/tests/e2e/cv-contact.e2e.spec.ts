import { expect, test } from "@playwright/test";

// TF-WEB-04 / TF-WEB-08 — parcours CV, Contact et recherche projets.
// Déterministe sans base (fallback mock pour /projets en CI).
test.describe("Parcours CV / Contact / Recherche", () => {
  test("TF-WEB-04 — /cv : titre, timeline, bouton PDF", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /expériences/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /télécharger le cv en pdf/i }),
    ).toBeVisible();
  });

  test("TF-WEB-04 — /contact : email, GitHub, copier", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const email = page.getByRole("link", { name: /^email/i });
    await expect(email).toHaveAttribute("href", /^mailto:/);
    await expect(page.getByRole("link", { name: /github/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /copier l'adresse email/i })).toBeVisible();
  });

  test("TF-WEB-08 — /projets : recherche client filtre la liste", async ({
    page,
  }) => {
    await page.goto("/projets");
    const before = await page.getByRole("article").count();
    expect(before).toBeGreaterThan(0);

    await page.getByRole("searchbox").fill("zzzznomatch");
    await expect(page.getByRole("status")).toContainText(/aucun projet/i);

    await page.getByRole("searchbox").fill("");
    await expect(page.getByRole("article").first()).toBeVisible();
  });
});
