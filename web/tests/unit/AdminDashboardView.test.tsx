import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

describe("<AdminDashboardView />", () => {
  it("affiche les compteurs, l'utilisateur et les liens de gestion", () => {
    render(
      <AdminDashboardView
        stats={{ projects: 5, articles: 2, tags: 8 }}
        userName="Léon HEU"
        logoutAction={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { name: /administration/i })).toBeInTheDocument();
    expect(screen.getByText(/connecté en tant que léon heu/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gérer projets/i })).toHaveAttribute(
      "href",
      "/admin/projects",
    );
    expect(screen.getByRole("button", { name: /se déconnecter/i })).toBeInTheDocument();
  });
});
