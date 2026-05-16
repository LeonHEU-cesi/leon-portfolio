import type { Metadata } from "next";

import { AddTagForm } from "@/components/admin/AddTagForm";
import { listTags } from "@/lib/admin-tags";

import { createTag, deleteTag, renameTag } from "./actions";

export const metadata: Metadata = {
  title: "Admin · Tags",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await listTags();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="tags-title">
      <div className="mx-auto max-w-3xl">
        <h1 id="tags-title" className="mb-8 text-3xl font-semibold">
          Tags
        </h1>

        <AddTagForm action={createTag} />

        {tags.length === 0 ? (
          <p role="status" className="text-[var(--secondary)]">
            Aucun tag.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex flex-wrap items-center gap-3 py-3"
              >
                <form
                  action={renameTag.bind(null, tag.id)}
                  className="flex items-center gap-2"
                >
                  <input
                    name="name"
                    defaultValue={tag.name}
                    aria-label={`Renommer le tag ${tag.name}`}
                    className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded border border-[var(--border)] px-3 py-1 text-xs"
                  >
                    Renommer
                  </button>
                </form>
                <span className="font-mono text-xs text-[var(--secondary)]">
                  {tag.slug} · {tag.projectCount} projet(s)
                </span>
                <form
                  action={deleteTag.bind(null, tag.id)}
                  className="ml-auto"
                >
                  <button
                    type="submit"
                    className="rounded border border-[var(--destructive,#dc2626)] px-3 py-1 text-xs text-[var(--destructive,#dc2626)]"
                  >
                    Supprimer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
