export type AdminStats = { projects: number; articles: number; tags: number };

// Compteurs admin. Import Prisma paresseux + fallback zéros (build sans
// DB OK, page jamais en erreur).
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const [projects, articles, tags] = await Promise.all([
      prisma.project.count(),
      prisma.article.count(),
      prisma.tag.count(),
    ]);
    return { projects, articles, tags };
  } catch (error) {
    console.error("[admin] getAdminStats a échoué, fallback 0:", error);
    return { projects: 0, articles: 0, tags: 0 };
  }
}
