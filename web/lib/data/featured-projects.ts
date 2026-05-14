// Mock data pour la section "Projets phares" de l'accueil.
// Sera remplacée par une vraie query Prisma au Sprint 2 (module Projets),
// quand le user aura initialisé Postgres en local + migrate + seed.

export type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  tags: ReadonlyArray<string>;
  repoUrl?: string;
  demoUrl?: string;
  imageGradient: string;
};

export const FEATURED_PROJECTS: ReadonlyArray<FeaturedProject> = [
  {
    slug: "leon-portfolio",
    title: "leon-portfolio",
    summary:
      "Portfolio personnel dynamique et animé. Next.js 15, Tailwind v4, Prisma, Postgres, Expo.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Postgres"],
    repoUrl: "https://github.com/LeonHEU-cesi/leon-portfolio",
    demoUrl: "https://leonheu.fr",
    imageGradient: "linear-gradient(135deg, oklch(0.30 0.10 30) 0%, oklch(0.55 0.15 30) 100%)",
  },
  {
    slug: "cesizen",
    title: "CESIZen",
    summary:
      "Application santé mentale (CESI Bloc 2). Laravel + Next.js + Expo + Postgres, 3 surfaces clientes.",
    tags: ["Laravel", "Next.js", "Expo", "Postgres"],
    repoUrl: "https://github.com/LeonHEU-cesi/cesizen",
    imageGradient: "linear-gradient(135deg, oklch(0.78 0.15 220) 0%, oklch(0.70 0.14 290) 100%)",
  },
  {
    slug: "tasknest",
    title: "Tasknest",
    summary:
      "Gestionnaire de tâches collaboratif (concept). Préfigure un side product avec auth multi-tenant.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    imageGradient: "linear-gradient(135deg, oklch(0.52 0.05 60) 0%, oklch(0.80 0.10 70) 100%)",
  },
] as const;
