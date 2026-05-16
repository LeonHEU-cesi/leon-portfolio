import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CvTimelineView } from "@/components/sections/CvTimeline";
import type { CvEntry } from "@/lib/data/cv";

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

const ENTRIES: CvEntry[] = [
  {
    id: "old",
    period: "2024",
    start: 2024,
    role: "Ancien",
    org: "Org A",
    kind: "Formation",
    points: ["point a"],
  },
  {
    id: "recent",
    period: "2026",
    start: 2026,
    role: "Récent",
    org: "Org B",
    kind: "Projet",
    points: ["point b"],
  },
];

describe("<CvTimelineView />", () => {
  it("affiche une entrée par expérience avec rôle, org et points", () => {
    render(<CvTimelineView entries={ENTRIES} />);
    expect(screen.getByRole("heading", { name: /récent/i })).toBeInTheDocument();
    expect(screen.getByText("Org A")).toBeInTheDocument();
    expect(screen.getByText("point b")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(2);
  });

  it("ordonne les entrées en antéchronologique (plus récent d'abord)", () => {
    render(<CvTimelineView entries={ENTRIES} />);
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings[0]).toMatch(/récent/i);
    expect(headings[1]).toMatch(/ancien/i);
  });
});
