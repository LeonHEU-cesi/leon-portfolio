import { beforeEach, describe, expect, it, vi } from "vitest";

const projectFindMany = vi.fn();
const projectFindUnique = vi.fn();
const tagFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: { findMany: projectFindMany, findUnique: projectFindUnique },
    tag: { findMany: tagFindMany },
  },
}));

import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";
import {
  getAllTags,
  getFeaturedProjects,
  getProjectBySlug,
  getPublishedProjects,
  mapProjectToCard,
} from "@/lib/projects";

beforeEach(() => {
  projectFindMany.mockReset();
  projectFindUnique.mockReset();
  tagFindMany.mockReset();
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
    projectFindMany.mockResolvedValue([
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
  });

  it("ajoute le filtre tags quand des slugs sont fournis", async () => {
    projectFindMany.mockResolvedValue([]);
    await getPublishedProjects(["react", "docker"]);
    expect(projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { some: { tag: { slug: { in: ["react", "docker"] } } } },
        }),
      }),
    );
  });

  it("retombe sur le mock si la requête échoue", async () => {
    projectFindMany.mockRejectedValue(new Error("DB indisponible"));
    expect(await getPublishedProjects()).toEqual([...FEATURED_PROJECTS]);
  });
});

describe("getFeaturedProjects", () => {
  it("retombe sur le mock (tronqué) si la base ne renvoie rien", async () => {
    projectFindMany.mockResolvedValue([]);
    expect(await getFeaturedProjects(2)).toHaveLength(2);
  });
});

describe("getAllTags", () => {
  it("renvoie les tags triés depuis la base", async () => {
    tagFindMany.mockResolvedValue([
      { slug: "docker", name: "Docker" },
      { slug: "nextjs", name: "Next.js" },
    ]);
    const tags = await getAllTags();
    expect(tags.map((t) => t.slug)).toEqual(["docker", "nextjs"]);
  });

  it("retombe sur les tags du mock si la base échoue", async () => {
    tagFindMany.mockRejectedValue(new Error("DB down"));
    const tags = await getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0]).toHaveProperty("slug");
    expect(tags[0]).toHaveProperty("name");
  });
});

describe("getProjectBySlug", () => {
  it("mappe un projet publié", async () => {
    projectFindUnique.mockResolvedValue({
      slug: "leon-portfolio",
      title: "leon-portfolio",
      summary: "résumé",
      content: "## Contenu",
      repoUrl: "https://repo",
      demoUrl: null,
      status: "PUBLISHED",
      tags: [{ tag: { name: "Next.js" } }],
    });
    const detail = await getProjectBySlug("leon-portfolio");
    expect(detail?.title).toBe("leon-portfolio");
    expect(detail?.content).toBe("## Contenu");
    expect(detail?.tags).toEqual(["Next.js"]);
    expect(detail?.demoUrl).toBeUndefined();
  });

  it("retourne null si le projet est en DRAFT", async () => {
    projectFindUnique.mockResolvedValue({
      slug: "demo",
      title: "Demo",
      summary: "s",
      content: null,
      repoUrl: null,
      demoUrl: null,
      status: "DRAFT",
      tags: [],
    });
    expect(await getProjectBySlug("demo")).toBeNull();
  });

  it("retourne null si le slug est inconnu", async () => {
    projectFindUnique.mockResolvedValue(null);
    expect(await getProjectBySlug("inconnu")).toBeNull();
  });

  it("fallback mock si la DB échoue (slug connu) sinon null", async () => {
    projectFindUnique.mockRejectedValue(new Error("DB down"));
    const known = await getProjectBySlug(FEATURED_PROJECTS[0]!.slug);
    expect(known?.slug).toBe(FEATURED_PROJECTS[0]!.slug);
    expect(await getProjectBySlug("slug-absent-du-mock")).toBeNull();
  });
});
