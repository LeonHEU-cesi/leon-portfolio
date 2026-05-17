import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site leonheu.fr — éditeur, hébergement, propriété intellectuelle, données personnelles.",
};

export default function MentionsLegalesPage() {
  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="legal-title"
    >
      <div className="mx-auto max-w-2xl space-y-10">
        <header>
          <h1
            id="legal-title"
            className="text-balance text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Mentions légales
          </h1>
        </header>

        <section aria-labelledby="legal-editeur">
          <h2 id="legal-editeur" className="mb-2 text-2xl font-semibold">
            Éditeur
          </h2>
          <p className="text-[var(--secondary)]">
            Ce site personnel est édité par Léon HEU, étudiant Concepteur
            Développeur d&apos;Applications. Directeur de la publication :
            Léon HEU. Contact : {CONTACT_EMAIL}.
          </p>
        </section>

        <section aria-labelledby="legal-hebergement">
          <h2 id="legal-hebergement" className="mb-2 text-2xl font-semibold">
            Hébergement
          </h2>
          <p className="text-[var(--secondary)]">
            Site auto-hébergé sur une infrastructure personnelle. Le nom de
            domaine est enregistré auprès d&apos;un bureau d&apos;enregistrement
            français.
          </p>
        </section>

        <section aria-labelledby="legal-pi">
          <h2 id="legal-pi" className="mb-2 text-2xl font-semibold">
            Propriété intellectuelle
          </h2>
          <p className="text-[var(--secondary)]">
            Sauf mention contraire, le code source et les contenus de ce site
            sont la propriété de Léon HEU. Toute réutilisation requiert une
            autorisation explicite.
          </p>
        </section>

        <section aria-labelledby="legal-donnees">
          <h2 id="legal-donnees" className="mb-2 text-2xl font-semibold">
            Données personnelles &amp; cookies
          </h2>
          <p className="text-[var(--secondary)]">
            Ce site vitrine ne collecte aucune donnée personnelle : aucun
            formulaire, aucune création de compte côté visiteur, aucun cookie
            de mesure d&apos;audience ni traceur tiers. La prise de contact se
            fait par email, à l&apos;initiative du visiteur.
          </p>
        </section>

        <section aria-labelledby="legal-liens">
          <h2 id="legal-liens" className="mb-2 text-2xl font-semibold">
            Liens externes
          </h2>
          <p className="text-[var(--secondary)]">
            Le site renvoie vers des plateformes tierces (GitHub, LinkedIn). Le
            contenu de ces sites n&apos;engage pas la responsabilité de
            l&apos;éditeur.
          </p>
        </section>
      </div>
    </section>
  );
}
