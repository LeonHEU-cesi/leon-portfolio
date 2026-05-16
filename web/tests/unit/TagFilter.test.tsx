import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TagFilter } from "@/components/sections/TagFilter";

const TAGS = [
  { slug: "nextjs", name: "Next.js" },
  { slug: "docker", name: "Docker" },
];

describe("<TagFilter />", () => {
  it("affiche le lien Tous et un chip par tag", () => {
    render(<TagFilter tags={TAGS} selected={[]} />);
    expect(screen.getByRole("link", { name: /tous les projets/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /filtrer par next\.js/i })).toHaveAttribute(
      "href",
      "/projets?tags=nextjs",
    );
  });

  it("marque le tag actif (aria-label retrait + aria-current) et propose le toggle off", () => {
    render(<TagFilter tags={TAGS} selected={["docker"]} />);
    const active = screen.getByRole("link", { name: /retirer le filtre docker/i });
    expect(active).toHaveAttribute("aria-current", "true");
    expect(active).toHaveAttribute("href", "/projets");
  });

  it("ne rend rien si aucun tag", () => {
    const { container } = render(<TagFilter tags={[]} selected={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
