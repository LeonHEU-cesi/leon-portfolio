import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CvSectionsView } from "@/components/sections/CvSections";

const PROPS = {
  skills: [{ category: "Front-end", items: ["Next.js", "TypeScript"] }],
  formations: [{ period: "2024", title: "CDA", org: "CESI" }],
  langues: [{ name: "Français", level: "Maternelle" }],
  loisirs: ["Homelab"],
};

describe("<CvSectionsView />", () => {
  it("affiche les 4 sections avec leur contenu", () => {
    render(<CvSectionsView {...PROPS} />);
    expect(screen.getByRole("heading", { name: /compétences/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /formations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /langues/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /loisirs/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("CDA")).toBeInTheDocument();
    expect(screen.getByText("Homelab")).toBeInTheDocument();
  });
});
