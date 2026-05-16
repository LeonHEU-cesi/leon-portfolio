import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminProjectsTable } from "@/components/admin/AdminProjectsTable";

describe("<AdminProjectsTable />", () => {
  it("affiche les lignes + lien éditer + bouton nouveau", () => {
    render(
      <AdminProjectsTable
        rows={[
          { id: "p1", slug: "leon", title: "Leon", status: "PUBLISHED", tagCount: 3 },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /nouveau projet/i })).toHaveAttribute(
      "href",
      "/admin/projects/new",
    );
    expect(screen.getByRole("link", { name: /éditer/i })).toHaveAttribute(
      "href",
      "/admin/projects/p1",
    );
    expect(screen.getByText("Leon")).toBeInTheDocument();
  });

  it("état vide accessible", () => {
    render(<AdminProjectsTable rows={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent(/aucun projet/i);
  });
});
