import { afterEach, describe, expect, it, vi } from "vitest";

import { buildSitemapEntries, siteUrl } from "@/lib/seo";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("siteUrl", () => {
  it("défaut https://leonheu.fr, sans slash final", () => {
    expect(siteUrl()).toBe("https://leonheu.fr");
  });

  it("respecte NEXT_PUBLIC_SITE_URL (slash final retiré)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.leonheu.fr/");
    expect(siteUrl()).toBe("https://staging.leonheu.fr");
  });
});

describe("buildSitemapEntries", () => {
  it("inclut les routes statiques + les projets, URLs absolues", () => {
    const entries = buildSitemapEntries("https://leonheu.fr", ["leon-portfolio"]);
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://leonheu.fr/");
    expect(urls).toContain("https://leonheu.fr/projets");
    expect(urls).toContain("https://leonheu.fr/mentions-legales");
    expect(urls).toContain("https://leonheu.fr/projets/leon-portfolio");
    expect(entries.find((e) => e.url === "https://leonheu.fr/")?.priority).toBe(1);
  });
});
