"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateArticleInput } from "@/lib/article-input";

export type ArticleFormState = { error?: string };

async function persist(
  formData: FormData,
  id?: string,
): Promise<ArticleFormState> {
  const result = validateArticleInput(formData);
  if (!result.ok) return { error: result.error };
  const { tagSlugs, ...data } = result.data;

  try {
    const { prisma } = await import("@/lib/prisma");
    const clash = await prisma.article.findUnique({
      where: { slug: data.slug },
    });
    if (clash && clash.id !== id) {
      return { error: "Ce slug est déjà utilisé." };
    }

    const tagCreate = tagSlugs.map((slug) => ({
      tag: {
        connectOrCreate: {
          where: { slug },
          create: { slug, name: slug },
        },
      },
    }));

    if (id) {
      await prisma.article.update({
        where: { id },
        // V1 : statut forcé DRAFT (pas de publication).
        data: { ...data, status: "DRAFT", tags: { deleteMany: {}, create: tagCreate } },
      });
    } else {
      await prisma.article.create({
        data: { ...data, status: "DRAFT", tags: { create: tagCreate } },
      });
    }
  } catch (error) {
    console.error("[admin] persist article:", error);
    return { error: "Échec de l'enregistrement." };
  }

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function createArticle(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  return persist(formData);
}

export async function updateArticle(
  id: string,
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  return persist(formData, id);
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.article.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteArticle:", error);
  }
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}
