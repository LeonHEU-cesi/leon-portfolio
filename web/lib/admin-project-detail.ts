import type { ProjectFormInitial } from "@/components/admin/ProjectForm";

type ProjectRow = {
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  status: string;
  tags: { tag: { slug: string } }[];
};

// Mappe une ligne Prisma vers les valeurs initiales du formulaire. Pur.
export function toFormInitial(row: ProjectRow): ProjectFormInitial {
  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content ?? "",
    repoUrl: row.repoUrl ?? "",
    demoUrl: row.demoUrl ?? "",
    status: row.status,
    tags: row.tags.map((t) => t.tag.slug).join(", "),
  };
}

// Récupère un projet admin par id (Prisma lazy + fallback null).
export async function getAdminProject(
  id: string,
): Promise<ProjectFormInitial | null> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.project.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    return row ? toFormInitial(row) : null;
  } catch (error) {
    console.error("[admin] getAdminProject:", error);
    return null;
  }
}
