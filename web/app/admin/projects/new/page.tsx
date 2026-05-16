import type { Metadata } from "next";

import { ProjectForm } from "@/components/admin/ProjectForm";

import { createProject } from "../actions";

export const metadata: Metadata = {
  title: "Admin · Nouveau projet",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold">Nouveau projet</h1>
        <ProjectForm action={createProject} submitLabel="Créer le projet" />
      </div>
    </section>
  );
}
