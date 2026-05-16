import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MentionsLegalesPage from "@/app/mentions-legales/page";

describe("Page /mentions-legales", () => {
  it("affiche le H1 et les sections légales clés", () => {
    render(<MentionsLegalesPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /mentions légales/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /éditeur/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hébergement/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /données personnelles/i }),
    ).toBeInTheDocument();
  });

  it("indique l'absence de collecte de données", () => {
    render(<MentionsLegalesPage />);
    expect(screen.getByText(/ne collecte aucune donnée personnelle/i)).toBeInTheDocument();
  });
});
