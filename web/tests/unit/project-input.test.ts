import { describe, expect, it } from "vitest";

import { slugify, validateProjectInput } from "@/lib/project-input";

function fd(entries: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

describe("slugify", () => {
  it("normalise accents/espaces/casse", () => {
    expect(slugify("  Léon HEU / Projet ")).toBe("leon-heu-projet");
  });
});

describe("validateProjectInput", () => {
  it("exige titre et résumé", () => {
    expect(validateProjectInput(fd({ summary: "s" }))).toEqual({
      ok: false,
      error: "Le titre est requis.",
    });
    expect(validateProjectInput(fd({ title: "T" }))).toEqual({
      ok: false,
      error: "Le résumé est requis.",
    });
  });

  it("dérive le slug du titre si absent, statut DRAFT par défaut", () => {
    const r = validateProjectInput(fd({ title: "Mon Projet", summary: "s" }));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.slug).toBe("mon-projet");
      expect(r.data.status).toBe("DRAFT");
    }
  });

  it("parse les tags CSV (slugifiés, dédoublonnés) + statut PUBLISHED", () => {
    const r = validateProjectInput(
      fd({
        title: "P",
        summary: "s",
        status: "PUBLISHED",
        tags: "Next.js, next.js , Docker",
      }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.status).toBe("PUBLISHED");
      expect(r.data.tagSlugs).toEqual(["next-js", "docker"]);
    }
  });
});
