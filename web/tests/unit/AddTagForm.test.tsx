import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AddTagForm } from "@/components/admin/AddTagForm";

describe("<AddTagForm />", () => {
  it("rend le champ + bouton", () => {
    render(<AddTagForm action={vi.fn(async () => ({}))} />);
    expect(screen.getByRole("textbox", { name: /nom du nouveau tag/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ajouter/i })).toBeInTheDocument();
  });

  it("affiche l'erreur renvoyée par l'action", async () => {
    const user = userEvent.setup();
    render(<AddTagForm action={vi.fn(async () => ({ error: "Ce tag existe déjà." }))} />);
    await user.type(screen.getByRole("textbox"), "React");
    await user.click(screen.getByRole("button", { name: /ajouter/i }));
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/existe déjà/i),
    );
  });
});
