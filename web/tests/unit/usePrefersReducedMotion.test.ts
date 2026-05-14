import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Listener = (event: MediaQueryListEvent) => void;

function createMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<Listener>();
  const matchMedia = vi.fn((query: string) => ({
    matches: initialMatches,
    media: query,
    onchange: null,
    addEventListener: vi.fn((_event: string, listener: Listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_event: string, listener: Listener) => listeners.delete(listener)),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  return {
    matchMedia,
    triggerChange(matches: boolean) {
      listeners.forEach((listener) =>
        listener({ matches, media: "(prefers-reduced-motion: reduce)" } as MediaQueryListEvent),
      );
    },
  };
}

describe("usePrefersReducedMotion", () => {
  let mock: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    mock = createMatchMediaMock(false);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mock.matchMedia,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("retourne false par défaut quand l'OS n'a pas la préférence reduce", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("retourne true quand matchMedia reporte matches: true", () => {
    mock = createMatchMediaMock(true);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mock.matchMedia,
    });
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("met à jour la valeur quand la préférence OS change en runtime", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mock.triggerChange(true);
    });
    expect(result.current).toBe(true);

    act(() => {
      mock.triggerChange(false);
    });
    expect(result.current).toBe(false);
  });

  it("appelle removeEventListener au démontage du composant (cleanup)", () => {
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    const mediaQueryInstance = mock.matchMedia.mock.results[0]?.value as
      | { removeEventListener: { mock: { calls: unknown[][] } } }
      | undefined;
    unmount();
    expect(mediaQueryInstance?.removeEventListener.mock.calls.length).toBeGreaterThan(0);
  });
});
