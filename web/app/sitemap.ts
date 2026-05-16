import type { MetadataRoute } from "next";

import { getPublishedProjects } from "@/lib/projects";
import { buildSitemapEntries, siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getPublishedProjects retombe sur le mock sans DB → jamais d'échec build.
  const projects = await getPublishedProjects();
  return buildSitemapEntries(
    siteUrl(),
    projects.map((project) => project.slug),
  );
}
