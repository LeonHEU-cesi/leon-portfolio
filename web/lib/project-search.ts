import Fuse from "fuse.js";

import type { FeaturedProject } from "@/lib/data/featured-projects";

// Recherche floue client (titre, résumé, tags). Pure → testable.
// Requête vide = liste inchangée (complémentaire du filtre tags serveur).
export function searchProjects(
  projects: ReadonlyArray<FeaturedProject>,
  query: string,
): FeaturedProject[] {
  const q = query.trim();
  if (!q) return [...projects];

  const fuse = new Fuse([...projects], {
    keys: ["title", "summary", "tags"],
    threshold: 0.4,
    ignoreLocation: true,
  });
  return fuse.search(q).map((result) => result.item);
}
