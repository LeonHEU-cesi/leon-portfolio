"use client";

import { useMemo, useState } from "react";

import type { FeaturedProject } from "@/lib/data/featured-projects";
import { searchProjects } from "@/lib/project-search";

import { ProjectsListView } from "./ProjectsList";

// Recherche client temps réel, complémentaire du filtre tags (serveur, URL).
// Filtrage instantané (dataset portfolio réduit → pas de debounce nécessaire).
// SSR : rendu initial = liste complète, donc dégradation propre sans JS.
export function ProjectsSearch({
  projects,
}: {
  projects: ReadonlyArray<FeaturedProject>;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => searchProjects(projects, query),
    [projects, query],
  );

  return (
    <div>
      <div className="mb-8">
        <label htmlFor="project-search" className="sr-only">
          Rechercher un projet
        </label>
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher (titre, techno, mot-clé)…"
          aria-controls="projects-results"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        />
      </div>
      <div id="projects-results" aria-live="polite">
        <ProjectsListView projects={results} />
      </div>
    </div>
  );
}
