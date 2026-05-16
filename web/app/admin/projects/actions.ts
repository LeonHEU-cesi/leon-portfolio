"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateProjectInput } from "@/lib/project-input";

export type ProjectFormState = { error?: string };

async function persist(
  formData: FormData,
  id?: string,
): Promise<ProjectFormState> {
  const result = validateProjectInput(formData);
  if (!result.ok) return { error: result.error };
  const { tagSlugs, ...data } = result.data;

  try {
    const { prisma } = await import("@/lib/prisma");
    const clash = await prisma.project.findUnique({
      where: { slug: data.slug },
    });
    if (clash && clash.id !== id) {
      return { error: "Ce slug est déjà utilisé." };
    }

    const tagsWrite = {
      deleteMany: {},
      create: tagSlugs.map((slug) => ({
        tag: {
          connectOrCreate: {
            where: { slug },
            create: { slug, name: slug },
          },
        },
      })),
    };

    if (id) {
      await prisma.project.update({
        where: { id },
        data: { ...data, tags: tagsWrite },
      });
    } else {
      await prisma.project.create({
        data: {
          ...data,
          tags: { create: tagsWrite.create },
        },
      });
    }
  } catch (error) {
    console.error("[admin] persist project:", error);
    return { error: "Échec de l'enregistrement." };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  return persist(formData);
}

export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  return persist(formData, id);
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteProject:", error);
  }
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
