import { describe, expect, it } from "vitest";

import { isPlaceholderSecret } from "@/lib/admin-guard";

describe("isPlaceholderSecret", () => {
  it("vrai si vide / absent / trop court", () => {
    expect(isPlaceholderSecret(undefined)).toBe(true);
    expect(isPlaceholderSecret("")).toBe(true);
    expect(isPlaceholderSecret("court")).toBe(true);
  });

  it("vrai pour les placeholders connus", () => {
    expect(isPlaceholderSecret("change_me_avant_prod")).toBe(true);
    expect(isPlaceholderSecret("ChangeMe")).toBe(true);
    expect(isPlaceholderSecret("monPASSWORD123")).toBe(true);
  });

  it("faux pour un secret robuste", () => {
    expect(isPlaceholderSecret("Zx9!kQ7v_Lm2@rT4")).toBe(false);
  });
});
