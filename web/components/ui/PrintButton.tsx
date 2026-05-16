"use client";

// Bouton d'export PDF via le navigateur (window.print) — pas de dépendance
// externe ni de toolchain. Masqué à l'impression (.no-print).
export function PrintButton({ label = "Télécharger le PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Télécharger le CV en PDF (ouvre la boîte d'impression)"
      className="no-print rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
    >
      {label} ↓
    </button>
  );
}
