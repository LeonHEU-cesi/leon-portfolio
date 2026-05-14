import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("<FeaturedProjects />", () => {
  it("affiche le titre de section et le lien Voir tous les projets", () => {
    render(<FeaturedProjects />);
    expect(screen.getByRole("heading", { name: /sélection récente/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir tous les projets/i })).toHaveAttribute(
      "href",
      "/projets",
    );
  });

  it("affiche 3 cartes de projet", () => {
    render(<FeaturedProjects />);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(3);
  });

  it("affiche le projet leon-portfolio avec ses tags et liens", () => {
    render(<FeaturedProjects />);
    expect(screen.getByText("leon-portfolio")).toBeInTheDocument();
    // 'Next.js' apparaît dans plusieurs projets — on vérifie juste qu'il existe
    expect(screen.getAllByText("Next.js").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /code/i }).length).toBeGreaterThan(0);
  });
});
