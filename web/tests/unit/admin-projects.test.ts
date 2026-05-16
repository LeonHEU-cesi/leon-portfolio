import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { project: { findMany } } }));

import { listAdminProjects } from "@/lib/admin-projects";

beforeEach(() => findMany.mockReset());

describe("listAdminProjects", () => {
  it("mappe les lignes (tous statuts) avec compte de tags", async () => {
    findMany.mockResolvedValue([
      { id: "1", slug: "a", title: "A", status: "DRAFT", tags: [{}, {}] },
    ]);
    const rows = await listAdminProjects();
    expect(rows[0]).toEqual({
      id: "1",
      slug: "a",
      title: "A",
      status: "DRAFT",
      tagCount: 2,
    });
  });

  it("applique recherche + filtre statut dans le where", async () => {
    findMany.mockResolvedValue([]);
    await listAdminProjects({ q: "port", status: "PUBLISHED" });
    const where = findMany.mock.calls[0]![0].where;
    expect(where.status).toBe("PUBLISHED");
    expect(where.OR).toEqual([
      { title: { contains: "port", mode: "insensitive" } },
      { slug: { contains: "port", mode: "insensitive" } },
    ]);
  });

  // Note : le chemin fallback `catch { return [] }` est un boilerplate
  // identique à celui déjà couvert par projects-data.test.ts ; on ne le
  // re-teste pas ici (mock de rejet fragile avec la capture d'erreur vitest).
});
