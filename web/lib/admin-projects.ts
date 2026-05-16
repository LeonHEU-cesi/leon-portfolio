import { ProjectStatus } from "@prisma/client";

export type AdminProjectRow = {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  tagCount: number;
};

export type AdminProjectsQuery = { q?: string; status?: string };

// Liste admin (tous statuts) + recherche titre/slug + filtre statut.
// Prisma lazy + fallback [] (build/DB indispo → page non bloquée).
export async function listAdminProjects(
  query: AdminProjectsQuery = {},
): Promise<AdminProjectRow[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const q = query.q?.trim();
    const status =
      query.status === "PUBLISHED" || query.status === "DRAFT"
        ? (query.status as ProjectStatus)
        : undefined;

    const rows = await prisma.project.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
      tagCount: row.tags.length,
    }));
  } catch (error) {
    console.error("[admin] listAdminProjects a échoué, fallback []:", error);
    return [];
  }
}
