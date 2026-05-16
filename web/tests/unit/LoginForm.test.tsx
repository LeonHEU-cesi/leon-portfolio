import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/LoginForm";

describe("<LoginForm />", () => {
  it("rend les champs accessibles + callbackUrl caché", () => {
    const action = vi.fn(async () => ({}));
    const { container } = render(
      <LoginForm action={action} callbackUrl="/admin/projects" />,
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/mot de passe/i)).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: /se connecter/i })).toBeInTheDocument();
    expect(
      container.querySelector('input[name="callbackUrl"]'),
    ).toHaveValue("/admin/projects");
  });

  it("affiche l'erreur générique renvoyée par l'action", async () => {
    const action = vi.fn(async () => ({ error: "Identifiants invalides." }));
    const user = userEvent.setup();
    render(<LoginForm action={action} />);

    await user.type(screen.getByLabelText(/email/i), "a@b.fr");
    await user.type(screen.getByLabelText(/mot de passe/i), "secret");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/identifiants invalides/i),
    );
  });
});
