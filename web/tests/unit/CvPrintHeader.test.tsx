import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CvPrintHeader } from "@/components/sections/CvPrintHeader";

describe("<CvPrintHeader />", () => {
  it("contient identité + contact, dans un conteneur print-only", () => {
    const { container } = render(<CvPrintHeader />);
    expect(screen.getByText("Léon HEU")).toBeInTheDocument();
    expect(screen.getByText(/leonheu97@gmail\.com/)).toBeInTheDocument();
    expect(container.querySelector(".print-only")).not.toBeNull();
  });

  it("accepte des props personnalisées", () => {
    render(<CvPrintHeader name="Test User" email="t@test.fr" />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText(/t@test\.fr/)).toBeInTheDocument();
  });
});
