import { beforeEach, describe, expect, it, vi } from "vitest";

const { getPublishedProjects, getProjectBySlug } = vi.hoisted(() => ({
  getPublishedProjects: vi.fn(),
  getProjectBySlug: vi.fn(),
}));
vi.mock("@/lib/projects", () => ({ getPublishedProjects, getProjectBySlug }));

import { GET as getList } from "@/app/api/projects/route";
import { GET as getDetail } from "@/app/api/projects/[slug]/route";

beforeEach(() => {
  getPublishedProjects.mockReset();
  getProjectBySlug.mockReset();
});

describe("GET /api/projects", () => {
  it("renvoie la liste JSON + en-têtes cache/CORS", async () => {
    getPublishedProjects.mockResolvedValue([{ slug: "a" }]);
    const res = await getList(new Request("https://x/api/projects"));
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    await expect(res.json()).resolves.toEqual({ projects: [{ slug: "a" }] });
  });

  it("transmet le filtre tags", async () => {
    getPublishedProjects.mockResolvedValue([]);
    await getList(new Request("https://x/api/projects?tags=react,docker"));
    expect(getPublishedProjects).toHaveBeenCalledWith(["react", "docker"]);
  });
});

describe("GET /api/projects/[slug]", () => {
  it("renvoie le détail si trouvé", async () => {
    getProjectBySlug.mockResolvedValue({ slug: "leon" });
    const res = await getDetail(new Request("https://x"), {
      params: Promise.resolve({ slug: "leon" }),
    });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ project: { slug: "leon" } });
  });

  it("404 JSON si introuvable", async () => {
    getProjectBySlug.mockResolvedValue(null);
    const res = await getDetail(new Request("https://x"), {
      params: Promise.resolve({ slug: "nope" }),
    });
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Projet introuvable." });
  });
});
