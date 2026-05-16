import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { tag: { findMany } } }));

import { listTags } from "@/lib/admin-tags";

beforeEach(() => findMany.mockReset());

describe("listTags", () => {
  it("mappe les tags avec le compte de projets", async () => {
    findMany.mockResolvedValue([
      { id: "1", slug: "react", name: "React", _count: { projects: 3 } },
    ]);
    const rows = await listTags();
    expect(rows).toEqual([
      { id: "1", slug: "react", name: "React", projectCount: 3 },
    ]);
  });
});
