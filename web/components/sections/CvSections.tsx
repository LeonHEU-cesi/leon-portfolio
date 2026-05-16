import type {
  CvFormation,
  CvLangue,
  CvSkillGroup,
} from "@/lib/data/cv";

// Présentationnel pur (mode editorial) : Compétences / Formations /
// Langues / Loisirs. Sémantique <section> + headings pour l'a11y et le print.
export function CvSectionsView({
  skills,
  formations,
  langues,
  loisirs,
}: {
  skills: ReadonlyArray<CvSkillGroup>;
  formations: ReadonlyArray<CvFormation>;
  langues: ReadonlyArray<CvLangue>;
  loisirs: ReadonlyArray<string>;
}) {
  return (
    <div className="mt-20 space-y-16">
      <section aria-labelledby="cv-skills">
        <h2 id="cv-skills" className="mb-6 text-2xl font-semibold">
          Compétences
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-sm uppercase tracking-[0.15em] text-[var(--secondary)]">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="cv-formations">
        <h2 id="cv-formations" className="mb-6 text-2xl font-semibold">
          Formations
        </h2>
        <ul className="space-y-3">
          {formations.map((formation) => (
            <li key={formation.title}>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--secondary)]">
                {formation.period}
              </p>
              <p className="font-medium">{formation.title}</p>
              <p className="text-sm text-[var(--secondary)]">{formation.org}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-12 sm:grid-cols-2">
        <section aria-labelledby="cv-langues">
          <h2 id="cv-langues" className="mb-6 text-2xl font-semibold">
            Langues
          </h2>
          <ul className="space-y-2">
            {langues.map((langue) => (
              <li key={langue.name} className="text-sm">
                <span className="font-medium">{langue.name}</span> —{" "}
                <span className="text-[var(--secondary)]">{langue.level}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-loisirs">
          <h2 id="cv-loisirs" className="mb-6 text-2xl font-semibold">
            Loisirs
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]">
            {loisirs.map((loisir) => (
              <li key={loisir}>{loisir}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
