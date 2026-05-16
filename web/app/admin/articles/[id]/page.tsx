import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/ArticleForm";
import { getAdminArticle } from "@/lib/admin-articles";

import { deleteArticle, updateArticle } from "../actions";

export const metadata: Metadata = {
  title: "Admin · Éditer un article",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initial = await getAdminArticle(id);
  if (!initial) notFound();

  const update = updateArticle.bind(null, id);
  const remove = deleteArticle.bind(null, id);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">Éditer l&apos;article</h1>
        <ArticleForm action={update} initial={initial} submitLabel="Mettre à jour" />
        <form action={remove} className="mt-8 border-t border-[var(--border)] pt-6">
          <button
            type="submit"
            className="rounded-full border border-[var(--destructive,#dc2626)] px-4 py-2 text-sm text-[var(--destructive,#dc2626)]"
          >
            Supprimer cet article
          </button>
        </form>
      </div>
    </section>
  );
}
