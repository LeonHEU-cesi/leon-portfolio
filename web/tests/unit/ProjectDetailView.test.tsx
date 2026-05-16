import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectDetailView } from "@/components/sections/ProjectDetailView";
import type { ProjectDetail } from "@/lib/projects";

const BASE: ProjectDetail = {
  slug: "leon-portfolio",
  title: "leon-portfolio",
  summary: "Portfolio personnel.",
  content: "## Contexte\nProjet vitrine.",
  repoUrl: "https://github.com/LeonHEU-cesi/leon-portfolio",
  demoUrl: "https://leonheu.fr",
  tags: ["Next.js", "TypeScript"],
  imageGradient: "linear-gradient(135deg, #000 0%, #111 100%)",
};

describe("<ProjectDetailView />", () => {
  it("affiche le titre, les tags, le contenu et les liens", () => {
    render(<ProjectDetailView project={BASE} />);
    expect(screen.getByRole("heading", { level: 1, name: /leon-portfolio/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText(/projet vitrine/i)).toBeInTheDocument();
    const repo = screen.getByRole("link", { name: /code source/i });
    expect(repo).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: /tous les projets/i })).toHaveAttribute(
      "href",
      "/projets",
    );
  });

  it("retombe sur le résumé si pas de contenu (résumé + corps)", () => {
    render(<ProjectDetailView project={{ ...BASE, content: undefined }} />);
    // Le résumé s'affiche en intro ET comme corps de remplacement.
    expect(screen.getAllByText("Portfolio personnel.")).toHaveLength(2);
  });
});
