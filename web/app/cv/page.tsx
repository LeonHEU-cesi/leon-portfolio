import type { Metadata } from "next";

import { CvSectionsView } from "@/components/sections/CvSections";
import { CvTimelineView } from "@/components/sections/CvTimeline";
import { PrintButton } from "@/components/ui/PrintButton";
import {
  CV_EXPERIENCES,
  CV_FORMATIONS,
  CV_LANGUES,
  CV_LOISIRS,
  CV_SKILLS,
} from "@/lib/data/cv";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Parcours de Léon HEU : formation CESI CDA, projets full-stack (web, mobile, infrastructure).",
};

export default function CvPage() {
  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="cv-title"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
            Parcours
          </p>
          <h1
            id="cv-title"
            className="mt-2 text-balance text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Curriculum
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--secondary)]">
            Formation et projets full-stack — du concept à la mise en
            production self-host.
          </p>
          <div className="mt-6">
            <PrintButton />
          </div>
        </header>

        <h2 className="mb-8 text-2xl font-semibold">Expériences &amp; projets</h2>
        <CvTimelineView entries={CV_EXPERIENCES} />

        <CvSectionsView
          skills={CV_SKILLS}
          formations={CV_FORMATIONS}
          langues={CV_LANGUES}
          loisirs={CV_LOISIRS}
        />
      </div>
    </section>
  );
}
