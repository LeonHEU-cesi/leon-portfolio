"use client";

import { useActionState } from "react";

import type { ArticleFormState } from "@/app/admin/articles/actions";

export type ArticleFormInitial = {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  tags?: string;
};

type Action = (
  state: ArticleFormState,
  formData: FormData,
) => Promise<ArticleFormState>;

const field =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm";

export function ArticleForm({
  action,
  initial = {},
  submitLabel = "Enregistrer",
}: {
  action: Action;
  initial?: ArticleFormInitial;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<ArticleFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-[var(--secondary)]">
        Les articles restent en brouillon (pas de page publique en V1).
      </p>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Titre</span>
        <input name="title" defaultValue={initial.title} required className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Slug (auto si vide)</span>
        <input name="slug" defaultValue={initial.slug} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Résumé</span>
        <input name="summary" defaultValue={initial.summary} required className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Contenu (Markdown)</span>
        <textarea name="content" defaultValue={initial.content} rows={8} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          Tags (slugs séparés par des virgules)
        </span>
        <input name="tags" defaultValue={initial.tags} className={field} />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-[var(--destructive,#dc2626)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}
