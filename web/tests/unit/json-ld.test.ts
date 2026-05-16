import { describe, expect, it } from "vitest";

import { personJsonLd } from "@/lib/json-ld";

describe("personJsonLd", () => {
  it("produit un schema Person valide", () => {
    const ld = personJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Léon HEU");
    expect(ld.sameAs).toContain("https://github.com/LeonHEU-cesi");
    expect(ld.url).toMatch(/^https?:\/\//);
  });
});
