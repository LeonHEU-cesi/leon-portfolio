import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactView } from "@/components/sections/ContactView";
import { SOCIALS } from "@/lib/data/socials";

describe("<ContactView />", () => {
  it("affiche email (mailto), GitHub et LinkedIn avec liens externes sécurisés", () => {
    render(<ContactView socials={SOCIALS} />);
    expect(screen.getByRole("link", { name: /^email$/i })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    const gh = screen.getByRole("link", { name: /github/i });
    expect(gh).toHaveAttribute("href", "https://github.com/LeonHEU-cesi");
    expect(gh).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute("target", "_blank");
  });

  it("rend l'action injectée (bouton copier)", () => {
    render(<ContactView socials={SOCIALS} action={<button>Copier</button>} />);
    expect(screen.getByRole("button", { name: /copier/i })).toBeInTheDocument();
  });
});
