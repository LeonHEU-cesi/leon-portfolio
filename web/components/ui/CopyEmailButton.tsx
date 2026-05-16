"use client";

import { useState } from "react";

// Copie l'email dans le presse-papier avec retour visuel. Le lien mailto
// reste la voie principale (dégradation propre si l'API n'est pas dispo).
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copier l'adresse email ${email}`}
      className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      {copied ? "Email copié ✓" : "Copier l'email"}
    </button>
  );
}
