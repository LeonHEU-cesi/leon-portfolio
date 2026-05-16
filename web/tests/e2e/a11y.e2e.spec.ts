import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// #6.8 — audit axe sur les pages publiques. Bloquant : 0 violation
// `serious`/`critical` (incluant le contraste). Déterministe sans DB.
const PAGES = ["/", "/projets", "/cv", "/about", "/contact"];

for (const path of PAGES) {
  test(`axe — ${path} : 0 violation serious/critical`, async ({ page }) => {
    // Reduced-motion : les composants rendent leur état statique (pas
    // d'opacity:0 d'entrée) → axe mesure les vraies couleurs.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      blocking,
      blocking.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}
