import Link from "next/link";

import type { AdminStats } from "@/lib/admin-stats";

const NAV = [
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/articles", label: "Articles" },
];

// Présentationnel pur. `logoutAction` injectée → testable sans serveur.
export function AdminDashboardView({
  stats,
  userName,
  logoutAction,
}: {
  stats: AdminStats;
  userName?: string | null;
  logoutAction: () => void | Promise<void>;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="admin-title">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 id="admin-title" className="text-3xl font-semibold">
              Administration
            </h1>
            {userName && (
              <p className="text-sm text-[var(--secondary)]">
                Connecté en tant que {userName}
              </p>
            )}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              Se déconnecter
            </button>
          </form>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(
            [
              ["Projets", stats.projects],
              ["Articles", stats.articles],
              ["Tags", stats.tags],
            ] as const
          ).map(([label, value]) => (
            <li
              key={label}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-6"
            >
              <p className="text-3xl font-semibold">{value}</p>
              <p className="text-sm text-[var(--secondary)]">{label}</p>
            </li>
          ))}
        </ul>

        <nav aria-label="Sections admin" className="mt-10 flex flex-wrap gap-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
            >
              Gérer {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
