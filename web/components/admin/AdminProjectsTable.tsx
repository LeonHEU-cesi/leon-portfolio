import Link from "next/link";

import type { AdminProjectRow } from "@/lib/admin-projects";

export function AdminProjectsTable({
  rows,
  q = "",
  status = "",
}: {
  rows: ReadonlyArray<AdminProjectRow>;
  q?: string;
  status?: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="ap-title">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 id="ap-title" className="text-3xl font-semibold">
            Projets
          </h1>
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
          >
            + Nouveau projet
          </Link>
        </div>

        <form method="get" className="mb-6 flex flex-wrap gap-3" role="search">
          <input
            type="search"
            name="q"
            defaultValue={q}
            aria-label="Rechercher un projet"
            placeholder="Titre ou slug…"
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={status}
            aria-label="Filtrer par statut"
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm"
          >
            <option value="">Tous statuts</option>
            <option value="PUBLISHED">Publiés</option>
            <option value="DRAFT">Brouillons</option>
          </select>
          <button
            type="submit"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
          >
            Filtrer
          </button>
        </form>

        {rows.length === 0 ? (
          <p role="status" className="text-[var(--secondary)]">
            Aucun projet.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="py-2">Titre</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Tags</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)]">
                  <td className="py-2">{row.title}</td>
                  <td className="py-2 font-mono text-xs">{row.slug}</td>
                  <td className="py-2">{row.status}</td>
                  <td className="py-2">{row.tagCount}</td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/admin/projects/${row.id}`}
                      className="text-[var(--primary)] hover:underline"
                    >
                      Éditer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
