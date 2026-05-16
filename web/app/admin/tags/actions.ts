"use server";

import { revalidatePath } from "next/cache";

import { normalizeTagName } from "@/lib/tag-input";

export type TagState = { error?: string };

export async function createTag(
  _prev: TagState,
  formData: FormData,
): Promise<TagState> {
  const result = normalizeTagName(formData.get("name"));
  if (!result.ok) return { error: result.error };
  try {
    const { prisma } = await import("@/lib/prisma");
    const clash = await prisma.tag.findUnique({ where: { slug: result.slug } });
    if (clash) return { error: "Ce tag existe déjà." };
    await prisma.tag.create({
      data: { slug: result.slug, name: result.name },
    });
  } catch (error) {
    console.error("[admin] createTag:", error);
    return { error: "Échec de la création." };
  }
  revalidatePath("/admin/tags");
  return {};
}

export async function renameTag(id: string, formData: FormData): Promise<void> {
  const result = normalizeTagName(formData.get("name"));
  if (!result.ok) return;
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.tag.update({
      where: { id },
      data: { name: result.name, slug: result.slug },
    });
  } catch (error) {
    console.error("[admin] renameTag:", error);
  }
  revalidatePath("/admin/tags");
}

export async function deleteTag(id: string): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.tag.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteTag:", error);
  }
  revalidatePath("/admin/tags");
}
