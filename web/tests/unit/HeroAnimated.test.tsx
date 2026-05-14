import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeroAnimated } from "@/components/sections/HeroAnimated";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

vi.mock("@gsap/react", () => ({
  useGSAP: () => undefined,
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
    })),
    to: vi.fn(),
    set: vi.fn(),
  },
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { name: "ScrollTrigger" },
}));

describe("<HeroAnimated />", () => {
  it("affiche le kicker, les 3 mots du titre, le sous-titre et les CTAs", () => {
    render(<HeroAnimated />);
    expect(screen.getByText(/Portfolio · Léon HEU/i)).toBeInTheDocument();
    expect(screen.getByText("Développeur")).toBeInTheDocument();
    expect(screen.getByText("full-stack")).toBeInTheDocument();
    expect(screen.getByText("basé en France.")).toBeInTheDocument();
    expect(screen.getByText(/Portfolio personnel/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir les projets/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mon parcours/i })).toBeInTheDocument();
  });

  it("expose un titre H1 avec id 'hero-title' et aria-labelledby sur la section", () => {
    render(<HeroAnimated />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("id", "hero-title");
  });
});
