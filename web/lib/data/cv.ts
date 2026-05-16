// Données CV typées. Parcours d'un étudiant CESI CDA (formation + projets) —
// pas d'employeur fictif : entrées formation / projets factuelles.

export type CvEntry = {
  id: string;
  period: string;
  // Année de début pour le tri antéchronologique.
  start: number;
  role: string;
  org: string;
  kind: "Formation" | "Projet" | "Expérience";
  points: string[];
};

export const CV_EXPERIENCES: ReadonlyArray<CvEntry> = [
  {
    id: "cesi-cda",
    period: "2024 — en cours",
    start: 2024,
    role: "Concepteur Développeur d'Applications (CDA)",
    org: "CESI — École d'ingénieurs",
    kind: "Formation",
    points: [
      "Conception et développement d'applications full-stack en mode projet",
      "Méthodologie Scrum, Git Flow, intégration continue",
      "Modélisation (UML, MLD), qualité logicielle et tests",
    ],
  },
  {
    id: "leon-portfolio",
    period: "2026",
    start: 2026,
    role: "Portfolio personnel — leon-portfolio",
    org: "Side project",
    kind: "Projet",
    points: [
      "Next.js 16 + TypeScript strict + Tailwind v4 + Prisma/PostgreSQL",
      "Theming dynamique par route, animations GSAP/Framer, accessibilité AA",
      "CI GitHub Actions (TU + TF sur base réelle + E2E Playwright), self-host Proxmox",
    ],
  },
  {
    id: "cesizen",
    period: "2025",
    start: 2025,
    role: "CESIZen — application santé mentale (Bloc 2)",
    org: "Projet académique CESI",
    kind: "Projet",
    points: [
      "Architecture multi-clients : API Laravel, web Next.js, mobile Expo",
      "Authentification, modules métier, PostgreSQL, tests TU/TF/TNR",
      "Sprint compressé, Git Flow strict, CI multi-surfaces",
    ],
  },
];
