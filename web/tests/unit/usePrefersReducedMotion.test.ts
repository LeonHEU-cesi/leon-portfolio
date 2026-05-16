import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Listener = () => void;

// Mock adapté à useSyncExternalStore : matchMedia est appelé plusieurs
// fois (subscribe + getSnapshot), `matches` est un état partagé mutable.
function createMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<Listener>();
  const state = { matches: initialMatches };
  const removeEventListener = vi.fn(
    (_e: string, l: Listener) => listeners.delete(l),
  );
  const matchMedia = vi.fn((query: string) => ({
    get matches() {
      return state.matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_e: string, l: Listener) => listeners.add(l),
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  return {
    matchMedia,
    removeEventListener,
    triggerChange(matches: boolean) {
      state.matches = matches;
      listeners.forEach((l) => l());
    },
  };
}

describe("usePrefersReducedMotion", () => {
  let mock: ReturnType<typeof createMatchMediaMock>;

  function install(initial: boolean) {
    mock = createMatchMediaMock(initial);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mock.matchMedia,
    });
  }

  beforeEach(() => install(false));
  afterEach(() => vi.clearAllMocks());

  it("retourne false par défaut", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("retourne true quand matchMedia reporte matches: true", () => {
    install(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("met à jour la valeur quand la préférence OS change", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    act(() => mock.triggerChange(true));
    expect(result.current).toBe(true);
    act(() => mock.triggerChange(false));
    expect(result.current).toBe(false);
  });

  it("retire le listener au démontage (cleanup)", () => {
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    unmount();
    expect(mock.removeEventListener.mock.calls.length).toBeGreaterThan(0);
  });
});
