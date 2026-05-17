import type { FeaturedProject } from "@/lib/data/featured-projects";

// Recherche floue client. `fuse.js` est chargé **paresseusement** (import
// dynamique) : il sort du bundle initial de /projets (gain perf #6.6),
// chargé seulement à la 1re recherche non vide. Pure/testable.
export async function searchProjects(
  projects: ReadonlyArray<FeaturedProject>,
  query: string,
): Promise<FeaturedProject[]> {
  const q = query.trim();
  if (!q) return [...projects];

  const { default: Fuse } = await import("fuse.js");
  const fuse = new Fuse([...projects], {
    keys: ["title", "summary", "tags"],
    threshold: 0.4,
    ignoreLocation: true,
  });
  return fuse.search(q).map((result) => result.item);
}
