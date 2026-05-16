import type { Metadata } from "next";
import Link from "next/link";

import { listAdminArticles } from "@/lib/admin-articles";

export const metadata: Metadata = {
  title: "Admin · Articles",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const rows = await listAdminArticles();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="aa-title">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 id="aa-title" className="text-3xl font-semibold">
            Articles
          </h1>
          <Link
            href="/admin/articles/new"
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
          >
            + Nouvel article
          </Link>
        </div>

        {rows.length === 0 ? (
          <p role="status" className="text-[var(--secondary)]">
            Aucun article.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center gap-4 py-3">
                <span className="flex-1">{row.title}</span>
                <span className="font-mono text-xs text-[var(--secondary)]">
                  {row.status}
                </span>
                <Link
                  href={`/admin/articles/${row.id}`}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Éditer
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
