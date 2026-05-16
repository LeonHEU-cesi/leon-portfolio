// Génération vCard 3.0 (RFC 6350 simplifié) + data URI téléchargeable.
// Pur, testable, sans dépendance.

export type VCardInput = {
  firstName: string;
  lastName: string;
  email: string;
  site: string;
  github: string;
};

export function buildVCard(input: VCardInput): string {
  const { firstName, lastName, email, site, github } = input;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `URL:${site}`,
    `URL:${github}`,
    "END:VCARD",
  ].join("\r\n");
}

export function vcardDataUri(vcard: string): string {
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
}
