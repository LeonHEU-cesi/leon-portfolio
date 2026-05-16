import Link from "next/link";

import { getCachedPublicRepos, type GitHubRepo } from "@/lib/services/github";

const MAX_REPOS = 9;

// Présentationnel pur. Si la liste est vide (erreur/quota/token absent),
// la section est totalement masquée — aucun message d'erreur visible.
export function GitHubReposView({ repos }: { repos: ReadonlyArray<GitHubRepo> }) {
  if (repos.length === 0) return null;

  return (
    <section
      className="mt-24 border-t border-[var(--border)] pt-16"
      aria-labelledby="github-repos-title"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
        Open source
      </p>
      <h2
        id="github-repos-title"
        className="mt-2 text-balance text-3xl font-semibold leading-tight sm:text-4xl"
      >
        Mes repos publics
      </h2>

      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li
            key={repo.name}
            className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--primary)]"
          >
            <Link
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
            >
              {repo.name} ↗
            </Link>
            {repo.description && (
              <p className="flex-1 text-sm text-[var(--secondary)]">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-4 pt-1 text-xs text-[var(--secondary)]">
              {repo.language && <span>{repo.language}</span>}
              <span aria-label={`${repo.stars} étoiles`}>★ {repo.stars}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Server Component async : lit le cache 24h (fallback [] géré en amont).
export async function GitHubRepos() {
  const repos = await getCachedPublicRepos();
  return <GitHubReposView repos={repos.slice(0, MAX_REPOS)} />;
}
