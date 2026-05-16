"use client";

import { useActionState } from "react";

import type { ProjectFormState } from "@/app/admin/projects/actions";

export type ProjectFormInitial = {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  repoUrl?: string;
  demoUrl?: string;
  status?: string;
  tags?: string;
};

type Action = (
  state: ProjectFormState,
  formData: FormData,
) => Promise<ProjectFormState>;

const field =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm";

export function ProjectForm({
  action,
  initial = {},
  submitLabel = "Enregistrer",
}: {
  action: Action;
  initial?: ProjectFormInitial;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-4">
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
        <textarea name="content" defaultValue={initial.content} rows={6} className={field} />
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Repo URL</span>
          <input name="repoUrl" defaultValue={initial.repoUrl} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Démo URL</span>
          <input name="demoUrl" defaultValue={initial.demoUrl} className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Statut</span>
        <select name="status" defaultValue={initial.status ?? "DRAFT"} className={field}>
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
        </select>
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
