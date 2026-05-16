import { ProjectStatus } from "@prisma/client";

import { FEATURED_PROJECTS, type FeaturedProject } from "@/lib/data/featured-projects";

// La carte projet partage le même contrat que la home (réutilisation du composant).
export type ProjectCard = FeaturedProject;

// Les projets DB n'ont pas de gradient stocké : on en dérive un déterministe
// depuis le slug pour garder un visuel cohérent sans dépendre d'un upload image.
function gradientFromSlug(slug: string): string {
  let hue = 0;
  for (let i = 0; i < slug.length; i++) {
    hue = (hue * 31 + slug.charCodeAt(i)) % 360;
  }
  const hue2 = (hue + 40) % 360;
  return `linear-gradient(135deg, oklch(0.45 0.12 ${hue}) 0%, oklch(0.70 0.13 ${hue2}) 100%)`;
}

type ProjectWithTags = {
  slug: string;
  title: string;
  summary: string;
  repoUrl: string | null;
  demoUrl: string | null;
  tags: { tag: { name: string } }[];
};

export function mapProjectToCard(project: ProjectWithTags): ProjectCard {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    tags: project.tags.map((pt) => pt.tag.name),
    repoUrl: project.repoUrl ?? undefined,
    demoUrl: project.demoUrl ?? undefined,
    imageGradient: gradientFromSlug(project.slug),
  };
}

// Import dynamique du client Prisma : évite de construire `PrismaClient` au
// chargement du module (sinon `next build` sans DATABASE_URL planterait à
// l'import). La construction et la requête sont ainsi dans le try/catch.
async function loadPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

const tagsInclude = { tags: { include: { tag: true } } } as const;

export async function getPublishedProjects(): Promise<ProjectCard[]> {
  try {
    const prisma = await loadPrisma();
    const rows = await prisma.project.findMany({
      where: { status: ProjectStatus.PUBLISHED },
      include: tagsInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => mapProjectToCard(row));
  } catch (error) {
    console.error("[projects] getPublishedProjects a échoué, fallback mock:", error);
    return [...FEATURED_PROJECTS];
  }
}

export async function getFeaturedProjects(take = 3): Promise<ProjectCard[]> {
  try {
    const prisma = await loadPrisma();
    const rows = await prisma.project.findMany({
      where: { status: ProjectStatus.PUBLISHED, isFeatured: true },
      include: tagsInclude,
      orderBy: { createdAt: "desc" },
      take,
    });
    if (rows.length === 0) {
      return [...FEATURED_PROJECTS].slice(0, take);
    }
    return rows.map((row) => mapProjectToCard(row));
  } catch (error) {
    console.error("[projects] getFeaturedProjects a échoué, fallback mock:", error);
    return [...FEATURED_PROJECTS].slice(0, take);
  }
}
