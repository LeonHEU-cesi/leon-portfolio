import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CopyEmailButton } from "@/components/ui/CopyEmailButton";

describe("<CopyEmailButton />", () => {
  it("copie l'email et affiche un retour visuel", async () => {
    // userEvent.setup() fournit un presse-papier fonctionnel en jsdom.
    const user = userEvent.setup();
    render(<CopyEmailButton email="a@b.fr" />);

    expect(screen.getByRole("button")).toHaveTextContent(/copier l'email/i);
    await user.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveTextContent(/copié/i),
    );
    await expect(navigator.clipboard.readText()).resolves.toBe("a@b.fr");
  });
});
