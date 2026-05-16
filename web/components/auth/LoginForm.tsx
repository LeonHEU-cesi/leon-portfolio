"use client";

import { useActionState } from "react";

import type { LoginState } from "@/app/login/actions";

type Action = (state: LoginState, formData: FormData) => Promise<LoginState>;

// Présentationnel : l'action est injectée (testable sans serveur).
export function LoginForm({
  action,
  callbackUrl = "/admin",
}: {
  action: Action;
  callbackUrl?: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-[var(--destructive,#dc2626)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-opacity disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
