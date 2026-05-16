import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { getAdminProject } from "@/lib/admin-project-detail";

import { deleteProject, updateProject } from "../actions";

export const metadata: Metadata = {
  title: "Admin · Éditer un projet",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initial = await getAdminProject(id);
  if (!initial) notFound();

  const update = updateProject.bind(null, id);
  const remove = deleteProject.bind(null, id);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">Éditer le projet</h1>
        <ProjectForm
          action={update}
          initial={initial}
          submitLabel="Mettre à jour"
        />
        <form action={remove} className="mt-8 border-t border-[var(--border)] pt-6">
          <button
            type="submit"
            className="rounded-full border border-[var(--destructive,#dc2626)] px-4 py-2 text-sm text-[var(--destructive,#dc2626)] hover:bg-[var(--destructive,#dc2626)] hover:text-white"
          >
            Supprimer ce projet
          </button>
        </form>
      </div>
    </section>
  );
}
