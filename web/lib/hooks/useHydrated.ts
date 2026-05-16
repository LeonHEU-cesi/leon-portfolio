"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `false` côté serveur et au 1er rendu client, `true` après hydratation —
 * sans effet ni setState (cf. #6.15). Pour le contenu dépendant du client
 * (thème résolu, etc.) en évitant l'écart SSR/CSR.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
