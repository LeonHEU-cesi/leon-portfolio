import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      // Project 1 — tests unitaires Node/jsdom + @testing-library/react
      {
        extends: true,
        plugins: [react()],
        resolve: {
          alias: {
            "@": path.resolve(dirname, "."),
          },
        },
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["tests/unit/**/*.test.{ts,tsx}"],
          exclude: ["node_modules", ".next", "storybook-static"],
        },
      },
      // Project 2 — tests fonctionnels (TF) en Node sur une vraie base
      // Postgres (CI: service postgres + prisma migrate deploy).
      {
        extends: true,
        resolve: {
          alias: {
            "@": path.resolve(dirname, "."),
          },
        },
        test: {
          name: "tf",
          environment: "node",
          globals: true,
          include: ["tests/tf/**/*.tf.test.ts"],
          exclude: ["node_modules", ".next", "storybook-static"],
        },
      },
      // Project 3 — stories Storybook exécutées comme tests browser via Playwright
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
