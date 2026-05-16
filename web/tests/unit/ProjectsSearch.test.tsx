import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectsSearch } from "@/components/sections/ProjectsSearch";
import type { FeaturedProject } from "@/lib/data/featured-projects";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

const P: FeaturedProject[] = [
  { slug: "a", title: "Portfolio Next", summary: "s", tags: ["Next.js"], imageGradient: "g" },
  { slug: "b", title: "API Laravel", summary: "s", tags: ["Laravel"], imageGradient: "g" },
];

describe("<ProjectsSearch />", () => {
  it("affiche toute la liste puis filtre à la saisie", async () => {
    const user = userEvent.setup();
    render(<ProjectsSearch projects={P} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);

    await user.type(screen.getByRole("searchbox"), "laravel");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("API Laravel")).toBeInTheDocument();
  });

  it("affiche l'état vide si aucun résultat", async () => {
    const user = userEvent.setup();
    render(<ProjectsSearch projects={P} />);
    await user.type(screen.getByRole("searchbox"), "zzzznomatch");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent(/aucun projet/i);
  });
});
