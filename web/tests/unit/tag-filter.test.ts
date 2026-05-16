import { describe, expect, it } from "vitest";

import { parseSelectedTags, toggleTagHref } from "@/lib/tag-filter";

describe("parseSelectedTags", () => {
  it("retourne [] si absent", () => {
    expect(parseSelectedTags(undefined)).toEqual([]);
    expect(parseSelectedTags("")).toEqual([]);
  });

  it("découpe, trim, lowercase et dédoublonne", () => {
    expect(parseSelectedTags("React, nextjs ,REACT")).toEqual(["react", "nextjs"]);
  });

  it("supporte la forme tableau (clé répétée)", () => {
    expect(parseSelectedTags(["react", "nextjs"])).toEqual(["react", "nextjs"]);
  });
});

describe("toggleTagHref", () => {
  it("ajoute un tag et trie", () => {
    expect(toggleTagHref(["nextjs"], "docker")).toBe("/projets?tags=docker,nextjs");
  });

  it("retire un tag déjà présent", () => {
    expect(toggleTagHref(["docker", "nextjs"], "docker")).toBe("/projets?tags=nextjs");
  });

  it("revient au chemin de base si plus aucun tag", () => {
    expect(toggleTagHref(["docker"], "docker")).toBe("/projets");
  });
});
