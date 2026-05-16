import type { MetadataRoute } from "next";

const STATIC_PATHS = [
  "",
  "/projets",
  "/cv",
  "/about",
  "/contact",
  "/mentions-legales",
] as const;

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://leonheu.fr").replace(
    /\/+$/,
    "",
  );
}

// Pur : routes statiques + pages projets publiés. Testable sans Next.
export function buildSitemapEntries(
  baseUrl: string,
  projectSlugs: ReadonlyArray<string>,
): MetadataRoute.Sitemap {
  const base = baseUrl.replace(/\/+$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${base}/projets/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...projectEntries];
}
