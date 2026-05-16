import Link from "next/link";

import type { TagOption } from "@/lib/projects";
import { toggleTagHref } from "@/lib/tag-filter";

function chipClass(active: boolean): string {
  const base =
    "rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]";
  return active
    ? `${base} border-[var(--primary)] bg-[var(--primary)] text-[var(--bg)]`
    : `${base} border-[var(--border)] bg-[var(--muted)] text-[var(--secondary)] hover:border-[var(--primary)] hover:text-[var(--foreground)]`;
}

// Filtres rendus côté serveur sous forme de liens (état porté par l'URL) :
// fonctionne sans JS, partageable, focusable et navigable au clavier nativement.
export function TagFilter({
  tags,
  selected,
}: {
  tags: ReadonlyArray<TagOption>;
  selected: ReadonlyArray<string>;
}) {
  if (tags.length === 0) return null;
  const noneActive = selected.length === 0;

  return (
    <nav aria-label="Filtres par tag" className="mb-10 flex flex-wrap items-center gap-2">
      <Link
        href="/projets"
        aria-label="Afficher tous les projets (réinitialiser les filtres)"
        data-active={noneActive}
        aria-current={noneActive ? "true" : undefined}
        className={chipClass(noneActive)}
      >
        Tous
      </Link>
      {tags.map((tag) => {
        const active = selected.includes(tag.slug);
        return (
          <Link
            key={tag.slug}
            href={toggleTagHref(selected, tag.slug)}
            aria-label={
              active ? `Retirer le filtre ${tag.name}` : `Filtrer par ${tag.name}`
            }
            data-active={active}
            aria-current={active ? "true" : undefined}
            className={chipClass(active)}
          >
            {tag.name}
          </Link>
        );
      })}
    </nav>
  );
}
