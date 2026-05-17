"use client";

import { useEffect, useState } from "react";

import type { FeaturedProject } from "@/lib/data/featured-projects";
import { searchProjects } from "@/lib/project-search";

import { ProjectsListView } from "./ProjectsList";

// Recherche client temps réel, complémentaire du filtre tags (serveur, URL).
// `searchProjects` charge fuse.js paresseusement (#6.6) → effet async avec
// garde anti-stale. SSR : rendu initial = liste complète (dégradation sans JS).
export function ProjectsSearch({
  projects,
}: {
  projects: ReadonlyArray<FeaturedProject>;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const [searchResults, setSearchResults] = useState<
    ReadonlyArray<FeaturedProject>
  >([]);

  useEffect(() => {
    // Cas requête vide dérivé au rendu (pas de setState synchrone ici).
    if (!trimmed) return;
    let active = true;
    searchProjects(projects, trimmed).then((r) => {
      if (active) setSearchResults(r);
    });
    return () => {
      active = false;
    };
  }, [projects, trimmed]);

  const results = trimmed ? searchResults : projects;

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
