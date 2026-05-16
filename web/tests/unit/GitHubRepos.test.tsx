import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GitHubReposView } from "@/components/sections/GitHubRepos";
import type { GitHubRepo } from "@/lib/services/github";

const REPOS: GitHubRepo[] = [
  {
    name: "leon-portfolio",
    description: "Portfolio perso",
    htmlUrl: "https://github.com/LeonHEU-cesi/leon-portfolio",
    stars: 4,
    language: "TypeScript",
    topics: [],
    pushedAt: "2026-05-10T00:00:00Z",
  },
];

describe("<GitHubReposView />", () => {
  it("affiche les repos avec lien externe sécurisé, langage et stars", () => {
    render(<GitHubReposView repos={REPOS} />);
    expect(
      screen.getByRole("heading", { name: /mes repos publics/i }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /leon-portfolio/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByLabelText(/4 étoiles/i)).toBeInTheDocument();
  });

  it("ne rend rien si aucun repo (dégradation silencieuse)", () => {
    const { container } = render(<GitHubReposView repos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
