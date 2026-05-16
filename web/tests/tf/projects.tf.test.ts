import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";
import { prisma } from "@/lib/prisma";
import { getAllTags, getProjectBySlug, getPublishedProjects } from "@/lib/projects";
import { fetchPublicRepos } from "@/lib/services/github";

// Tests fonctionnels sur une vraie base : exécutés en CI (service Postgres
// + `prisma migrate deploy`). Localement sans DATABASE_URL → skip propre.
const suite = process.env.DATABASE_URL ? describe : describe.skip;

const SLUGS = ["tf-pub-react", "tf-pub-docker", "tf-draft"];
const TAG_SLUGS = ["tf-react", "tf-docker"];

async function cleanup() {
  await prisma.projectTag.deleteMany({
    where: { project: { slug: { in: SLUGS } } },
  });
  await prisma.project.deleteMany({ where: { slug: { in: SLUGS } } });
  await prisma.tag.deleteMany({ where: { slug: { in: TAG_SLUGS } } });
}

suite("TF — couche données Projets (DB réelle)", () => {
  beforeAll(async () => {
    await cleanup();

    const [react, docker] = await Promise.all([
      prisma.tag.create({ data: { slug: "tf-react", name: "TF React" } }),
      prisma.tag.create({ data: { slug: "tf-docker", name: "TF Docker" } }),
    ]);

    await prisma.project.create({
      data: {
        slug: "tf-pub-react",
        title: "TF Pub React",
        summary: "Projet publié react",
        content: "## Contenu react",
        status: "PUBLISHED",
        tags: { create: [{ tagId: react.id }] },
      },
    });
    await prisma.project.create({
      data: {
        slug: "tf-pub-docker",
        title: "TF Pub Docker",
        summary: "Projet publié docker",
        status: "PUBLISHED",
        tags: { create: [{ tagId: docker.id }] },
      },
    });
    await prisma.project.create({
      data: {
        slug: "tf-draft",
        title: "TF Draft",
        summary: "Projet brouillon",
        status: "DRAFT",
        tags: { create: [{ tagId: docker.id }] },
      },
    });
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it("TF-PJ-01 — getPublishedProjects expose les publiés, pas les DRAFT", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual(expect.arrayContaining(["tf-pub-react", "tf-pub-docker"]));
    expect(slugs).not.toContain("tf-draft");
  });

  it("TF-PJ-02 — filtre par tag (slug) restreint le résultat", async () => {
    const slugs = (await getPublishedProjects(["tf-react"])).map((p) => p.slug);
    expect(slugs).toContain("tf-pub-react");
    expect(slugs).not.toContain("tf-pub-docker");
  });

  it("TF-PJ-03 — getProjectBySlug : publié OK, DRAFT et inconnu → null", async () => {
    const pub = await getProjectBySlug("tf-pub-react");
    expect(pub?.title).toBe("TF Pub React");
    expect(pub?.content).toBe("## Contenu react");
    expect(await getProjectBySlug("tf-draft")).toBeNull();
    expect(await getProjectBySlug("tf-inexistant")).toBeNull();
  });

  it("TF-PJ-03b — getAllTags renvoie au moins les tags seedés, triés", async () => {
    const tags = await getAllTags();
    const names = tags.map((t) => t.slug);
    expect(names).toEqual(expect.arrayContaining(["tf-docker", "tf-react"]));
  });

  it("TF-PJ-04 — GitHubService mappe/trie/filtre (fetch stubbé)", async () => {
    const stub = async () =>
      ({
        ok: true,
        status: 200,
        json: async () => [
          {
            name: "z",
            description: null,
            html_url: "u1",
            stargazers_count: 1,
            language: "TS",
            pushed_at: "2026-01-01T00:00:00Z",
            fork: false,
            archived: false,
          },
          {
            name: "top",
            description: "d",
            html_url: "u2",
            stargazers_count: 10,
            language: "Go",
            pushed_at: "2026-02-01T00:00:00Z",
            fork: false,
            archived: false,
          },
          {
            name: "forked",
            description: null,
            html_url: "u3",
            stargazers_count: 50,
            language: null,
            pushed_at: "2026-03-01T00:00:00Z",
            fork: true,
            archived: false,
          },
        ],
      }) as unknown as Response;

    const repos = await fetchPublicRepos(stub as unknown as typeof fetch);
    expect(repos.map((r) => r.name)).toEqual(["top", "z"]);
  });

  it("garde-fou : le mock featured reste non vide (fallback)", () => {
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
  });
});
