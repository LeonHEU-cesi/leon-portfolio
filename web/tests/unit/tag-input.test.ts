import { describe, expect, it } from "vitest";

import { normalizeTagName } from "@/lib/tag-input";

describe("normalizeTagName", () => {
  it("refuse vide / trop long", () => {
    expect(normalizeTagName("")).toEqual({
      ok: false,
      error: "Le nom du tag est requis.",
    });
    expect(normalizeTagName("x".repeat(41)).ok).toBe(false);
  });

  it("normalise nom + slug", () => {
    expect(normalizeTagName("  Next.js  ")).toEqual({
      ok: true,
      name: "Next.js",
      slug: "next-js",
    });
  });
});
