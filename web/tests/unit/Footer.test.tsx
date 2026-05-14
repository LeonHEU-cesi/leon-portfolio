import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout/Footer";

describe("<Footer />", () => {
  it("affiche l'année courante dans le copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear} Léon HEU`))).toBeInTheDocument();
  });

  it("contient un lien vers les mentions légales", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /mentions légales/i });
    expect(link).toHaveAttribute("href", "/mentions-legales");
  });

  it("contient les 3 liens sociaux", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
  });

  it("ajoute rel='noopener noreferrer' sur les liens externes (http(s))", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
