import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProjectsListView } from "@/components/sections/ProjectsList";
import { FEATURED_PROJECTS } from "@/lib/data/featured-projects";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

describe("<ProjectsListView />", () => {
  it("affiche une carte par projet", () => {
    render(<ProjectsListView projects={FEATURED_PROJECTS} />);
    expect(screen.getAllByRole("article")).toHaveLength(FEATURED_PROJECTS.length);
  });

  it("affiche un état vide accessible si aucun projet", () => {
    render(<ProjectsListView projects={[]} />);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByRole("status")).toHaveTextContent(/aucun projet/i);
  });
});
