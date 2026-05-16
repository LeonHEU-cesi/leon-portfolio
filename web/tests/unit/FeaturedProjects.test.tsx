import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeaturedProjectsView } from "@/components/sections/FeaturedProjectsView";
import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("<FeaturedProjectsView />", () => {
  it("affiche le titre de section et le lien Voir tous les projets", () => {
    render(<FeaturedProjectsView projects={FEATURED_PROJECTS} />);
    expect(screen.getByRole("heading", { name: /sélection récente/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir tous les projets/i })).toHaveAttribute(
      "href",
      "/projets",
    );
  });

  it("affiche une carte par projet fourni", () => {
    render(<FeaturedProjectsView projects={FEATURED_PROJECTS} />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(FEATURED_PROJECTS.length);
  });

  it("affiche le projet leon-portfolio avec ses tags et liens", () => {
    render(<FeaturedProjectsView projects={FEATURED_PROJECTS} />);
    expect(screen.getByText("leon-portfolio")).toBeInTheDocument();
    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /code/i }).length).toBeGreaterThan(0);
  });
});
