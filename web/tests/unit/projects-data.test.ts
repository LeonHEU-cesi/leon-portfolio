import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { project: { findMany } } }));

import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";
import { getFeaturedProjects, getPublishedProjects, mapProjectToCard } from "@/lib/projects";

beforeEach(() => {
  findMany.mockReset();
});

describe("mapProjectToCard", () => {
  it("aplatit les tags, normalise null→undefined et dérive un gradient", () => {
    const card = mapProjectToCard({
      slug: "demo",
      title: "Demo",
      summary: "résumé",
      repoUrl: null,
      demoUrl: "https://demo.test",
      tags: [{ tag: { name: "React" } }, { tag: { name: "TypeScript" } }],
    });
    expect(card.tags).toEqual(["React", "TypeScript"]);
    expect(card.repoUrl).toBeUndefined();
    expect(card.demoUrl).toBe("https://demo.test");
    expect(card.imageGradient).toContain("linear-gradient");
  });
});

describe("getPublishedProjects", () => {
  it("mappe les projets renvoyés par Prisma", async () => {
    findMany.mockResolvedValue([
      {
        slug: "a",
        title: "A",
        summary: "sa",
        repoUrl: null,
        demoUrl: null,
        tags: [{ tag: { name: "Next.js" } }],
      },
    ]);
    const result = await getPublishedProjects();
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("a");
    expect(result[0]?.tags).toEqual(["Next.js"]);
  });

  it("retombe sur le mock si la requête échoue", async () => {
    findMany.mockRejectedValue(new Error("DB indisponible"));
    const result = await getPublishedProjects();
    expect(result).toEqual([...FEATURED_PROJECTS]);
  });
});

describe("getFeaturedProjects", () => {
  it("retombe sur le mock (tronqué) si la base ne renvoie rien", async () => {
    findMany.mockResolvedValue([]);
    const result = await getFeaturedProjects(2);
    expect(result).toHaveLength(2);
  });

  it("respecte la limite take et mappe les lignes", async () => {
    findMany.mockResolvedValue([
      { slug: "f1", title: "F1", summary: "s", repoUrl: null, demoUrl: null, tags: [] },
    ]);
    const result = await getFeaturedProjects(3);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 3, where: expect.objectContaining({ isFeatured: true }) }),
    );
    expect(result[0]?.slug).toBe("f1");
  });
});
