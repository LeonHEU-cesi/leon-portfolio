import { defineConfig, devices } from "@playwright/test";

// Smoke tests post-déploiement : ciblent une instance DÉJÀ déployée
// (pas de webServer). URL paramétrable via SMOKE_BASE_URL.
// Exécution : npm run test:smoke (cf. deploiement-prod.md, lancé par Léon
// après mise en prod ; aussi appelé par deploy-prod.yml si configuré).
export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.SMOKE_BASE_URL ?? "http://localhost:3000",
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
