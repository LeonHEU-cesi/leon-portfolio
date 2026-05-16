import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProjectForm } from "@/components/admin/ProjectForm";

describe("<ProjectForm />", () => {
  it("rend les champs et pré-remplit depuis initial", () => {
    render(
      <ProjectForm
        action={vi.fn(async () => ({}))}
        initial={{ title: "Mon Projet", status: "PUBLISHED" }}
        submitLabel="Créer le projet"
      />,
    );
    expect(screen.getByRole("textbox", { name: /titre/i })).toHaveValue("Mon Projet");
    expect(screen.getByRole("combobox", { name: /statut/i })).toHaveValue("PUBLISHED");
    expect(screen.getByRole("button", { name: /créer le projet/i })).toBeInTheDocument();
  });
});
