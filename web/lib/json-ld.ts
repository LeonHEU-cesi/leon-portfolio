// JSON-LD schema.org Person (pur, données constantes — pas d'input user).
export function personJsonLd() {
  const site = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://leonheu.fr"
  ).replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Léon HEU",
    url: site,
    jobTitle: "Développeur full-stack",
    sameAs: ["https://github.com/LeonHEU-cesi"],
  } as const;
}
