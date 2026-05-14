import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";

describe("AboutPage", () => {
  it("affiche le H1 'Bonjour, je suis Léon.'", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/bonjour, je suis léon/i);
  });

  it("affiche au moins 4 paragraphes de bio", () => {
    const { container } = render(<AboutPage />);
    const articleParagraphs = container.querySelectorAll("article p");
    expect(articleParagraphs.length).toBeGreaterThanOrEqual(3);
  });

  it("affiche les 3 valeurs (Qualité, Pédagogie, Curiosité) en tant que H3", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 3, name: /qualité du code/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^pédagogie$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /^curiosité$/i })).toBeInTheDocument();
  });

  it("propose des CTA vers CV et Contact", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: /voir mon cv/i })).toHaveAttribute("href", "/cv");
    expect(screen.getByRole("link", { name: /me contacter/i })).toHaveAttribute("href", "/contact");
  });
});
