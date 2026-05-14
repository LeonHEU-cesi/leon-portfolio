import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Léon HEU, développeur full-stack basé en France. Parcours, valeurs et approche tech derrière le portfolio.",
};

const VALUES = [
  {
    title: "Qualité du code",
    body: "Tests TU + fonctionnels + non-régression, typage strict, conventions de commits propres. Pas de TODO en prod.",
  },
  {
    title: "Pédagogie",
    body: "Documenter le pourquoi, pas le quoi. Un dépôt qu'un autre développeur peut reprendre sans réunion.",
  },
  {
    title: "Curiosité",
    body: "Stack moderne, expérimentations animations / accessibilité / performance. Veille active, refus de la facilité.",
  },
] as const;

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">À propos</p>
        <h1 className="mt-2 text-balance text-5xl font-semibold leading-tight sm:text-6xl">
          Bonjour, je suis Léon.
        </h1>
      </header>

      <div className="grid gap-10 md:grid-cols-[2fr_1fr] md:items-start">
        <article className="space-y-5 text-lg leading-relaxed text-[var(--fg)]">
          <p>
            Je suis développeur full-stack basé en France, formé au CESI en Conception et
            Développement d&apos;Applications. J&apos;aime construire des produits utiles, avec un
            soin particulier pour la propreté du code et l&apos;expérience utilisateur.
          </p>
          <p>
            Mon terrain de jeu se trouve à l&apos;intersection du web moderne (Next.js, TypeScript,
            Tailwind), du backend solide (PHP/Laravel, Node, Postgres) et du mobile (Expo, React
            Native). J&apos;ai mené à terme des projets académiques exigeants comme CESIZen avec une
            méthodologie Scrum sprint compressé, Git Flow strict et une stack production
            self-hostée.
          </p>
          <p>
            Au-delà de la technique, je crois fort à la pédagogie : un dépôt qu&apos;on peut
            reprendre sans réunion, un README qui couvre le pourquoi avant le quoi, des commits
            qui racontent une histoire.
          </p>
          <p>
            Ce portfolio est lui-même un terrain d&apos;expérimentation : direction visuelle hybride
            (éditorial sur la landing, tech sombre sur les projets), animations GSAP scroll-driven,
            tests bout-en-bout, déploiement Docker sur Proxmox personnel.
          </p>
        </article>

        <aside aria-hidden="true" className="md:sticky md:top-24">
          <div
            className="aspect-[4/5] w-full rounded-lg border border-[var(--border)] shadow-[var(--shadow-medium)]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.30 0.10 30) 0%, oklch(0.55 0.15 30) 60%, oklch(0.80 0.10 70) 100%)",
            }}
          />
          <p className="mt-3 text-xs text-[var(--secondary)]">
            Portrait Léon — visuel placeholder, photo réelle à venir
          </p>
        </aside>
      </div>

      <section className="mt-20" aria-labelledby="values-title">
        <h2
          id="values-title"
          className="text-balance text-3xl font-semibold leading-tight sm:text-4xl"
        >
          Valeurs &amp; approche
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-5"
            >
              <h3 className="font-[var(--font-display)] text-xl font-semibold tracking-tight">
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--secondary)]">{value.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-20 flex flex-wrap gap-3 border-t border-[var(--border)] pt-10 text-base">
        <Link
          href="/cv"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-fg)] transition-opacity hover:opacity-90"
        >
          Voir mon CV
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-6 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--muted)]"
        >
          Me contacter
        </Link>
      </footer>
    </section>
  );
}
