import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup automatique après chaque test pour éviter les fuites entre tests.
afterEach(() => {
  cleanup();
});
