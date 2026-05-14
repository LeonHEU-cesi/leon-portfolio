import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-widest text-[var(--secondary)]">
        Portfolio · Léon HEU
      </p>
      <h1 className="text-balance text-5xl font-semibold leading-tight sm:text-6xl">
        Développeur full-stack
        <br />
        <span className="text-[var(--accent)]">basé en France.</span>
      </h1>
      <p className="max-w-xl text-pretty text-lg text-[var(--secondary)]">
        Page d&apos;accueil minimaliste posée au Sprint 0. Le hero animé GSAP arrivera au Sprint 1
        (#voir issue 1.4).
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/projets"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-fg)] transition-opacity hover:opacity-90"
        >
          Voir les projets
        </Link>
        <Link
          href="/cv"
          className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-6 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--muted)]"
        >
          Mon parcours
        </Link>
      </div>
    </section>
  );
}
