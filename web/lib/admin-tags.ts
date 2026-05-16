export type AdminTagRow = {
  id: string;
  slug: string;
  name: string;
  projectCount: number;
};

// Liste des tags + nombre de projets liés. Prisma lazy + fallback [].
export async function listTags(): Promise<AdminTagRow[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { projects: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      projectCount: row._count.projects,
    }));
  } catch (error) {
    console.error("[admin] listTags a échoué, fallback []:", error);
    return [];
  }
}
