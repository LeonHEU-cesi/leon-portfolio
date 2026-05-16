import Link from "next/link";

import type { FeaturedProject } from "@/lib/data/featured-projects";

import { FeaturedProjectCard } from "./FeaturedProjectCard";

// Présentationnel pur (testable sans DB ni async) : la récupération des
// données est assurée par <FeaturedProjects /> (Server Component async).
export function FeaturedProjectsView({
  projects,
}: {
  projects: ReadonlyArray<FeaturedProject>;
}) {
  return (
    <section
      className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="featured-projects-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
              Projets phares
            </p>
            <h2
              id="featured-projects-title"
              className="mt-2 text-balance text-3xl font-semibold leading-tight sm:text-4xl"
            >
              Sélection récente
            </h2>
          </div>
          <Link
            href="/projets"
            className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
          >
            Voir tous les projets →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <FeaturedProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
