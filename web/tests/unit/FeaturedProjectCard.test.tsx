import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeaturedProjectCard } from "@/components/sections/FeaturedProjectCard";
import type { FeaturedProject } from "@/lib/data/featured-projects";

const reducedMotion = vi.fn(() => false);
vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => reducedMotion(),
}));

const PROJECT: FeaturedProject = {
  slug: "x",
  title: "Projet X",
  summary: "Résumé.",
  tags: ["Next.js"],
  repoUrl: "https://repo",
  demoUrl: "https://demo",
  imageGradient: "linear-gradient(135deg,#000,#111)",
};

describe("<FeaturedProjectCard />", () => {
  it("rend la carte (titre, tag, liens externes sécurisés)", () => {
    reducedMotion.mockReturnValue(false);
    render(<FeaturedProjectCard project={PROJECT} />);
    expect(screen.getByRole("heading", { name: /projet x/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("reste rendu en mode reduced-motion (hover désactivé, pas de crash)", () => {
    reducedMotion.mockReturnValue(true);
    render(<FeaturedProjectCard project={PROJECT} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});
