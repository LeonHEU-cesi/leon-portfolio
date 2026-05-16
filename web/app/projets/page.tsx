import type { Metadata } from "next";

import { ProjectsListView } from "@/components/sections/ProjectsList";
import { getPublishedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Catalogue de mes réalisations : applications web, mobile, outillage et infrastructure self-host.",
};

// Page pilotée par la base (édition admin au Sprint 4) : pas de
// pré-rendu statique au build, rendu à la requête.
export const dynamic = "force-dynamic";

export default async function ProjetsPage() {
  const projects = await getPublishedProjects();

  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="projets-title"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
            Catalogue
          </p>
          <h1
            id="projets-title"
            className="mt-2 text-balance text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Projets
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--secondary)]">
            Sélection de réalisations : applications web, mobile, outillage et
            infrastructure self-host.
          </p>
        </header>

        <ProjectsListView projects={projects} />
      </div>
    </section>
  );
}
