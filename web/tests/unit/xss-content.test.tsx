import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectDetailView } from "@/components/sections/ProjectDetailView";
import type { ProjectDetail } from "@/lib/projects";

// TS-INPUT-02 — le `content` projet/article est rendu en TEXTE échappé
// (React), pas en HTML. Aucun `dangerouslySetInnerHTML` sur de l'input
// utilisateur (le seul usage = QR SVG depuis `qrcode`, données constantes).
describe("XSS — rendu du contenu utilisateur", () => {
  it("un content contenant du HTML/script est rendu échappé, pas exécuté", () => {
    const malicious =
      '<script>window.__xss=1</script><img src=x onerror="window.__xss=1">';
    const project: ProjectDetail = {
      slug: "x",
      title: "X",
      summary: "résumé",
      content: malicious,
      tags: [],
      imageGradient: "g",
    };

    const { container } = render(<ProjectDetailView project={project} />);

    // Aucun élément script/img injecté à partir du contenu
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector('img[src="x"]')).toBeNull();
    // Le texte brut (échappé) est bien présent
    expect(container.textContent).toContain("<script>window.__xss=1</script>");
    expect(
      (globalThis as { __xss?: number }).__xss,
    ).toBeUndefined();
  });
});
