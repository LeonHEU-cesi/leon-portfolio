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

export type CvSkillGroup = { category: string; items: string[] };
export type CvFormation = { period: string; title: string; org: string };
export type CvLangue = { name: string; level: string };

export const CV_SKILLS: ReadonlyArray<CvSkillGroup> = [
  {
    category: "Front-end",
    items: ["Next.js / React", "TypeScript", "Tailwind CSS", "Framer Motion / GSAP"],
  },
  {
    category: "Back-end",
    items: ["Node.js", "Laravel / PHP", "API REST", "Prisma / Eloquent"],
  },
  {
    category: "Données & Infra",
    items: ["PostgreSQL", "Docker Compose", "Caddy", "Proxmox (self-host)"],
  },
  {
    category: "Mobile & Qualité",
    items: ["Expo / React Native", "Vitest / Playwright", "GitHub Actions CI/CD", "Scrum / Git Flow"],
  },
];

export const CV_FORMATIONS: ReadonlyArray<CvFormation> = [
  {
    period: "2024 — en cours",
    title: "Concepteur Développeur d'Applications (RNCP niveau 6)",
    org: "CESI — École d'ingénieurs",
  },
];

export const CV_LANGUES: ReadonlyArray<CvLangue> = [
  { name: "Français", level: "Langue maternelle" },
  { name: "Anglais", level: "Technique — lecture/écriture courantes (B2)" },
];

export const CV_LOISIRS: ReadonlyArray<string> = [
  "Homelab & auto-hébergement (Proxmox, Docker)",
  "Veille technologique web & open source",
  "Projets logiciels personnels",
];

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
