import { describe, expect, it } from "vitest";

import type { FeaturedProject } from "@/lib/data/featured-projects";
import { searchProjects } from "@/lib/project-search";

const P: FeaturedProject[] = [
  {
    slug: "a",
    title: "Portfolio Next.js",
    summary: "Site vitrine animé",
    tags: ["Next.js", "Tailwind"],
    imageGradient: "g",
  },
  {
    slug: "b",
    title: "API Laravel",
    summary: "Backend santé mentale",
    tags: ["Laravel", "Postgres"],
    imageGradient: "g",
  },
];

describe("searchProjects (fuse.js lazy, async)", () => {
  it("retourne tout si requête vide (sans charger fuse)", async () => {
    await expect(searchProjects(P, "")).resolves.toHaveLength(2);
    await expect(searchProjects(P, "   ")).resolves.toHaveLength(2);
  });

  it("matche sur le titre", async () => {
    const r = await searchProjects(P, "portfolio");
    expect(r).toHaveLength(1);
    expect(r[0]?.slug).toBe("a");
  });

  it("matche sur un tag", async () => {
    const r = await searchProjects(P, "laravel");
    expect(r[0]?.slug).toBe("b");
  });

  it("retourne [] si aucun résultat", async () => {
    await expect(searchProjects(P, "zzzznomatch")).resolves.toHaveLength(0);
  });
});
