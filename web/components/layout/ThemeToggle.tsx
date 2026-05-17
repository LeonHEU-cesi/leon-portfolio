"use client";

import { useTheme } from "next-themes";

import { useHydrated } from "@/lib/hooks/useHydrated";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // Évite l'écart SSR/CSR : on attend l'hydratation pour afficher l'icône
  // qui dépend du thème résolu (light/dark/system).
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <button
        type="button"
        aria-label="Changer de thème"
        className="size-9 rounded-md border border-[var(--border)] bg-transparent"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--border)] bg-transparent text-[var(--fg)] transition-colors hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </>
        ) : (
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        )}
      </svg>
    </button>
  );
}
