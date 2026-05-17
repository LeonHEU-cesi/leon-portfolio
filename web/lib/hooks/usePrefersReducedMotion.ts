"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Détecte la préférence `prefers-reduced-motion: reduce`.
 * `useSyncExternalStore` : SSR-safe (false serveur/avant hydratation),
 * réactif, sans effet ni setState (cf. #6.15).
 *
 * Cf. US-VI-06 et `Docs/claude/leon-portfolio/Cahier_de_tests.md` TU-VI-02.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
