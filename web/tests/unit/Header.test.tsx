import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Header } from "@/components/layout/Header";

const pathnameMock = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
}));

describe("<Header />", () => {
  beforeEach(() => {
    pathnameMock.mockReset();
  });

  it("rend les 5 items de navigation principale", () => {
    pathnameMock.mockReturnValue("/");
    render(<Header />);

    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projets" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CV" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "À propos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("marque Accueil comme page courante sur /", () => {
    pathnameMock.mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("aria-current", "page");
  });

  it("marque Projets comme page courante sur /projets/slug", () => {
    pathnameMock.mockReturnValue("/projets/leon-portfolio");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute("aria-current");
  });

  it("marque About comme page courante sur /about", () => {
    pathnameMock.mockReturnValue("/about");
    render(<Header />);
    expect(screen.getByRole("link", { name: "À propos" })).toHaveAttribute("aria-current", "page");
  });

  it("contient un logo cliquable vers /", () => {
    pathnameMock.mockReturnValue("/");
    render(<Header />);
    const logo = screen.getByRole("link", { name: /léon heu/i });
    expect(logo).toHaveAttribute("href", "/");
  });
});
