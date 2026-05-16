// Coordonnées de contact. Email/GitHub factuels ; handle LinkedIn à
// confirmer par Léon (donnée éditable, pas un placeholder de code).
export const CONTACT_EMAIL = "leonheu97@gmail.com";

export type Social = { label: string; href: string; external: boolean };

export const SOCIALS: ReadonlyArray<Social> = [
  {
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/LeonHEU-cesi",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/leon-heu",
    external: true,
  },
];
