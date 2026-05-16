import { expect, test } from "@playwright/test";

// TF-WEB-04 / TF-WEB-08 — parcours CV, Contact et recherche projets.
// Déterministe sans base (fallback mock pour /projets en CI).
// Les requêtes sont scopées à <main> : le Header/Footer global expose
// aussi des liens Email/GitHub (sinon strict mode violation Playwright).
test.describe("Parcours CV / Contact / Recherche", () => {
  test("TF-WEB-04 — /cv : titre, timeline, bouton PDF", async ({ page }) => {
    await page.goto("/cv");
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(main.getByRole("heading", { name: /expériences/i })).toBeVisible();
    await expect(
      main.getByRole("button", { name: /télécharger le cv en pdf/i }),
    ).toBeVisible();
  });

  test("TF-WEB-04 — /contact : email, GitHub, copier", async ({ page }) => {
    await page.goto("/contact");
    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
    const email = main.getByRole("link", { name: /^email/i });
    await expect(email).toHaveAttribute("href", /^mailto:/);
    await expect(main.getByRole("link", { name: /github/i })).toBeVisible();
    await expect(
      main.getByRole("button", { name: /copier l'adresse email/i }),
    ).toBeVisible();
  });

  test("TF-WEB-08 — /projets : recherche client filtre la liste", async ({
    page,
  }) => {
    await page.goto("/projets");
    const main = page.getByRole("main");
    expect(await main.getByRole("article").count()).toBeGreaterThan(0);

    await main.getByRole("searchbox").fill("zzzznomatch");
    await expect(main.getByRole("status")).toContainText(/aucun projet/i);

    await main.getByRole("searchbox").fill("");
    await expect(main.getByRole("article").first()).toBeVisible();
  });
});
