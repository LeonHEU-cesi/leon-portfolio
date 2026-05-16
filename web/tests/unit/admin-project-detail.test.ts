import { describe, expect, it } from "vitest";

import { toFormInitial } from "@/lib/admin-project-detail";

describe("toFormInitial", () => {
  it("mappe une ligne Prisma vers les valeurs du formulaire", () => {
    const init = toFormInitial({
      title: "Leon",
      slug: "leon",
      summary: "résumé",
      content: null,
      repoUrl: "https://repo",
      demoUrl: null,
      status: "PUBLISHED",
      tags: [{ tag: { slug: "next-js" } }, { tag: { slug: "docker" } }],
    });
    expect(init).toEqual({
      title: "Leon",
      slug: "leon",
      summary: "résumé",
      content: "",
      repoUrl: "https://repo",
      demoUrl: "",
      status: "PUBLISHED",
      tags: "next-js, docker",
    });
  });
});
