// Helpers purs pour le filtrage par tags synchronisé à l'URL (?tags=a,b).
// Aucune dépendance React/Prisma → 100 % testable unitairement.

export function parseSelectedTags(param?: string | string[]): string[] {
  if (!param) return [];
  const raw = Array.isArray(param) ? param.join(",") : param;
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((slug) => slug.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

// Renvoie l'URL avec le tag basculé (ajout/retrait), tags triés pour une
// URL canonique partageable et un cache HTTP stable.
export function toggleTagHref(
  selected: ReadonlyArray<string>,
  slug: string,
  basePath = "/projets",
): string {
  const next = new Set(selected);
  if (next.has(slug)) {
    next.delete(slug);
  } else {
    next.add(slug);
  }
  const tags = Array.from(next).sort();
  return tags.length === 0 ? basePath : `${basePath}?tags=${tags.join(",")}`;
}
