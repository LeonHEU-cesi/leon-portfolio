import type { Metadata } from "next";

import { ArticleForm } from "@/components/admin/ArticleForm";

import { createArticle } from "../actions";

export const metadata: Metadata = {
  title: "Admin · Nouvel article",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">Nouvel article</h1>
        <ArticleForm action={createArticle} submitLabel="Créer le brouillon" />
      </div>
    </section>
  );
}
