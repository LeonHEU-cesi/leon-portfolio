"use client";

import { useActionState } from "react";

import type { TagState } from "@/app/admin/tags/actions";

type Action = (state: TagState, formData: FormData) => Promise<TagState>;

export function AddTagForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState<TagState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="mb-8 flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Nouveau tag</span>
        <input
          name="name"
          required
          aria-label="Nom du nouveau tag"
          className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-60"
      >
        {pending ? "Ajout…" : "Ajouter"}
      </button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-[var(--destructive,#dc2626)]">
          {state.error}
        </p>
      )}
    </form>
  );
}
