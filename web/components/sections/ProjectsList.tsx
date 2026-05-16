import type { FeaturedProject } from "@/lib/data/featured-projects";

import { FeaturedProjectCard } from "./FeaturedProjectCard";

// Présentationnel pur : grille de cartes ou état vide. La récupération des
// données (et le filtrage tags #2.4) est gérée par la page Server Component.
export function ProjectsListView({
  projects,
}: {
  projects: ReadonlyArray<FeaturedProject>;
}) {
  if (projects.length === 0) {
    return (
      <p
        role="status"
        className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-8 text-center text-[var(--secondary)]"
      >
        Aucun projet ne correspond pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <FeaturedProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
