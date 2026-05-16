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

describe("searchProjects", () => {
  it("retourne tout si requête vide", () => {
    expect(searchProjects(P, "")).toHaveLength(2);
    expect(searchProjects(P, "   ")).toHaveLength(2);
  });

  it("matche sur le titre", () => {
    const r = searchProjects(P, "portfolio");
    expect(r).toHaveLength(1);
    expect(r[0]?.slug).toBe("a");
  });

  it("matche sur un tag", () => {
    const r = searchProjects(P, "laravel");
    expect(r[0]?.slug).toBe("b");
  });

  it("retourne [] si aucun résultat", () => {
    expect(searchProjects(P, "zzzznomatch")).toHaveLength(0);
  });
});
