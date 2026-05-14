"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Détecte la préférence utilisateur `prefers-reduced-motion: reduce`.
 * Retourne `false` côté serveur (SSR-safe) et avant l'hydratation.
 * Met à jour en temps réel si l'utilisateur change la préférence OS.
 *
 * Cf. US-VI-06 et `Docs/claude/leon-portfolio/Cahier_de_tests.md` TU-VI-02.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(QUERY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
