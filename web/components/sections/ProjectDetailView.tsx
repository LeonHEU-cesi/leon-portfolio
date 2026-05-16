import Link from "next/link";

import type { ProjectDetail } from "@/lib/projects";

// Présentationnel pur. Le contenu est du Markdown brut (champ TEXT) ; le
// rendu MDX riche est prévu en V2 — ici on préserve les sauts de ligne.
export function ProjectDetailView({ project }: { project: ProjectDetail }) {
  return (
    <article className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projets"
          className="text-sm text-[var(--secondary)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
        >
          ← Tous les projets
        </Link>

        <div
          className="mt-6 aspect-[16/7] w-full rounded-lg"
          style={{ background: project.imageGradient }}
          aria-hidden="true"
        />

        <h1 className="mt-8 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--secondary)]">{project.summary}</p>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-xs text-[var(--secondary)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline-offset-2 hover:underline"
            >
              Code source →
            </Link>
          )}
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Démo en ligne ↗
            </Link>
          )}
        </div>

        <div className="mt-10 whitespace-pre-line leading-relaxed text-[var(--foreground)]">
          {project.content ?? project.summary}
        </div>
      </div>
    </article>
  );
}
