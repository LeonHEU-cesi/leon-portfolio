import type { ProjectFormInitial } from "@/components/admin/ProjectForm";

export type AdminArticleRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
};

export async function listAdminArticles(): Promise<AdminArticleRow[]> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, slug: true, title: true, status: true },
    });
    return rows;
  } catch (error) {
    console.error("[admin] listAdminArticles a échoué, fallback []:", error);
    return [];
  }
}

type ArticleRow = {
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  tags: { tag: { slug: string } }[];
};

// Réutilise la forme ProjectFormInitial (champs communs) pour ArticleForm.
export function articleToFormInitial(
  row: ArticleRow,
): Pick<ProjectFormInitial, "title" | "slug" | "summary" | "content" | "tags"> {
  return {
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content ?? "",
    tags: row.tags.map((t) => t.tag.slug).join(", "),
  };
}

export async function getAdminArticle(id: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.article.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    return row ? articleToFormInitial(row) : null;
  } catch (error) {
    console.error("[admin] getAdminArticle:", error);
    return null;
  }
}
