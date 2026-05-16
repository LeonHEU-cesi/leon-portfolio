import bcrypt from "bcryptjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getAdminArticle, listAdminArticles } from "@/lib/admin-articles";
import { getAdminProject } from "@/lib/admin-project-detail";
import { listAdminProjects } from "@/lib/admin-projects";
import { getAdminStats } from "@/lib/admin-stats";
import { listTags } from "@/lib/admin-tags";
import { parseCredentials } from "@/lib/credentials";
import { prisma } from "@/lib/prisma";
import { _resetRateLimitStore, rateLimit } from "@/lib/rate-limit";

// TF admin sur vraie base (CI : service Postgres + migrate deploy).
const suite = process.env.DATABASE_URL ? describe : describe.skip;

const PASSWORD = "Sup3rSecret!Pw";
const EMAIL = "tfadmin@test.local";
let userId = "";
let projectId = "";
let articleId = "";

async function authorizeCore(raw: unknown) {
  const parsed = parseCredentials(raw);
  if (!parsed) return null;
  const user = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (!user) return null;
  const ok = await bcrypt.compare(parsed.password, user.password);
  return ok ? { id: user.id, role: user.role } : null;
}

async function cleanup() {
  await prisma.projectTag.deleteMany({
    where: { project: { slug: "tfadmin-proj" } },
  });
  await prisma.project.deleteMany({ where: { slug: "tfadmin-proj" } });
  await prisma.article.deleteMany({ where: { slug: "tfadmin-art" } });
  await prisma.tag.deleteMany({ where: { slug: "tfadmin-tag" } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
}

suite("TF — Admin (DB réelle)", () => {
  beforeAll(async () => {
    await cleanup();
    const user = await prisma.user.create({
      data: {
        email: EMAIL,
        name: "TF Admin",
        role: "admin",
        password: await bcrypt.hash(PASSWORD, 10),
      },
    });
    userId = user.id;
    const tag = await prisma.tag.create({
      data: { slug: "tfadmin-tag", name: "TF Admin Tag" },
    });
    const project = await prisma.project.create({
      data: {
        slug: "tfadmin-proj",
        title: "TF Admin Project",
        summary: "s",
        status: "DRAFT",
        tags: { create: [{ tagId: tag.id }] },
      },
    });
    projectId = project.id;
    const article = await prisma.article.create({
      data: { slug: "tfadmin-art", title: "TF Admin Article", summary: "s", status: "DRAFT" },
    });
    articleId = article.id;
  });

  afterAll(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  it("TF-AUTH-01 — identifiants valides → utilisateur résolu", async () => {
    const res = await authorizeCore({ email: EMAIL, password: PASSWORD });
    expect(res).not.toBeNull();
    expect(res?.id).toBe(userId);
  });

  it("TF-AUTH-02 — mauvais mot de passe / inconnu → null", async () => {
    expect(await authorizeCore({ email: EMAIL, password: "wrong" })).toBeNull();
    expect(
      await authorizeCore({ email: "nobody@test.local", password: PASSWORD }),
    ).toBeNull();
  });

  it("TF-AD-01/02 — listAdminProjects voit le projet + filtre", async () => {
    const all = await listAdminProjects();
    expect(all.some((p) => p.slug === "tfadmin-proj")).toBe(true);
    const filtered = await listAdminProjects({ q: "tfadmin-proj" });
    expect(filtered.map((p) => p.slug)).toContain("tfadmin-proj");
  });

  it("TF-AD-03 — getAdminProject mappe les valeurs du formulaire", async () => {
    const init = await getAdminProject(projectId);
    expect(init?.title).toBe("TF Admin Project");
    expect(init?.tags).toContain("tfadmin-tag");
  });

  it("TF-AD-04/05 — listTags expose le tag + compte projets", async () => {
    const tags = await listTags();
    const t = tags.find((x) => x.slug === "tfadmin-tag");
    expect(t).toBeDefined();
    expect(t?.projectCount).toBeGreaterThanOrEqual(1);
  });

  it("TF-AD-06 — articles DRAFT listés + mapping", async () => {
    const arts = await listAdminArticles();
    expect(arts.some((a) => a.slug === "tfadmin-art")).toBe(true);
    const init = await getAdminArticle(articleId);
    expect(init?.title).toBe("TF Admin Article");
  });

  it("TF-AD-07 — getAdminStats renvoie des compteurs cohérents", async () => {
    const stats = await getAdminStats();
    expect(stats.projects).toBeGreaterThanOrEqual(1);
    expect(stats.tags).toBeGreaterThanOrEqual(1);
    expect(stats.articles).toBeGreaterThanOrEqual(1);
  });

  it("TF-AD — rate limit bloque au-delà du seuil", () => {
    _resetRateLimitStore();
    const key = `tfadmin:${userId}`;
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 60_000).allowed).toBe(true);
    }
    expect(rateLimit(key, 5, 60_000).allowed).toBe(false);
  });
});
