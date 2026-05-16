import type { Metadata } from "next";

import { ProjectsListView } from "@/components/sections/ProjectsList";
import { TagFilter } from "@/components/sections/TagFilter";
import { getAllTags, getPublishedProjects } from "@/lib/projects";
import { parseSelectedTags } from "@/lib/tag-filter";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Catalogue de mes réalisations : applications web, mobile, outillage et infrastructure self-host.",
};

// Page pilotée par la base + filtres dans l'URL : rendu à la requête.
export const dynamic = "force-dynamic";

export default async function ProjetsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string | string[] }>;
}) {
  const params = await searchParams;
  const selected = parseSelectedTags(params.tags);

  const [projects, tags] = await Promise.all([
    getPublishedProjects(selected),
    getAllTags(),
  ]);

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

        <TagFilter tags={tags} selected={selected} />

        <p className="mb-6 text-sm text-[var(--secondary)]" aria-live="polite">
          {projects.length} projet{projects.length > 1 ? "s" : ""}
          {selected.length > 0 ? " filtré" + (projects.length > 1 ? "s" : "") : ""}
        </p>

        <ProjectsListView projects={projects} />
      </div>
    </section>
  );
}
