import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PrintButton } from "@/components/ui/PrintButton";

describe("<PrintButton />", () => {
  it("est accessible et masqué à l'impression (.no-print)", () => {
    render(<PrintButton />);
    const btn = screen.getByRole("button", { name: /télécharger le cv en pdf/i });
    expect(btn).toHaveClass("no-print");
  });

  it("déclenche window.print au clic", () => {
    const printSpy = vi.fn();
    vi.stubGlobal("print", printSpy);
    render(<PrintButton />);
    screen.getByRole("button").click();
    expect(printSpy).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});
