import { describe, expect, it } from "vitest";

import { articleToFormInitial } from "@/lib/admin-articles";

describe("articleToFormInitial", () => {
  it("mappe la ligne Prisma (content null → '', tags joints)", () => {
    expect(
      articleToFormInitial({
        title: "A",
        slug: "a",
        summary: "s",
        content: null,
        tags: [{ tag: { slug: "react" } }, { tag: { slug: "next-js" } }],
      }),
    ).toEqual({
      title: "A",
      slug: "a",
      summary: "s",
      content: "",
      tags: "react, next-js",
    });
  });
});
