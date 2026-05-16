import { describe, expect, it } from "vitest";

import { validateArticleInput } from "@/lib/article-input";

function fd(e: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(e)) f.set(k, v);
  return f;
}

describe("validateArticleInput", () => {
  it("exige titre et résumé", () => {
    expect(validateArticleInput(fd({ summary: "s" })).ok).toBe(false);
    expect(validateArticleInput(fd({ title: "T" })).ok).toBe(false);
  });

  it("slug auto + tags slugifiés/dédoublonnés", () => {
    const r = validateArticleInput(
      fd({ title: "Mon Article", summary: "s", tags: "React, react" }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.slug).toBe("mon-article");
      expect(r.data.tagSlugs).toEqual(["react"]);
    }
  });
});
