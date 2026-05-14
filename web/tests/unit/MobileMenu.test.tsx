import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MobileMenu } from "@/components/layout/MobileMenu";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => false,
}));

describe("<MobileMenu />", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("rend le bouton burger fermé par défaut", () => {
    render(<MobileMenu />);
    const button = screen.getByRole("button", { name: /ouvrir le menu/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("ouvre le drawer au clic sur le burger", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("affiche les 5 items de navigation quand ouvert", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Projets" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CV" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "À propos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("ferme le drawer avec la touche Escape", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("verrouille le scroll du body pendant l'ouverture", async () => {
    const user = userEvent.setup();
    render(<MobileMenu />);
    expect(document.body.style.overflow).toBe("");
    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    expect(document.body.style.overflow).toBe("hidden");
  });
});
