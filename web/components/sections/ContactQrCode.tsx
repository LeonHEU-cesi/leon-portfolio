import QRCode from "qrcode";

import { CONTACT_EMAIL } from "@/lib/data/socials";
import { buildVCard, vcardDataUri } from "@/lib/vcard";

// Server Component async : QR (SVG inline) encodant une vCard + repli
// téléchargeable .vcf si le scan n'est pas possible.
export async function ContactQrCode() {
  const vcard = buildVCard({
    firstName: "Léon",
    lastName: "HEU",
    email: CONTACT_EMAIL,
    site: "https://leonheu.fr",
    github: "https://github.com/LeonHEU-cesi",
  });

  const svg = await QRCode.toString(vcard, {
    type: "svg",
    margin: 1,
    width: 180,
  });

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-sm uppercase tracking-[0.15em] text-[var(--secondary)]">
        Carte de visite
      </h2>
      <div
        role="img"
        aria-label="QR code vCard de Léon HEU (scanner pour ajouter le contact)"
        className="inline-block rounded-lg border border-[var(--border)] bg-white p-3 [&_svg]:h-44 [&_svg]:w-44"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="mt-3">
        <a
          href={vcardDataUri(vcard)}
          download="leon-heu.vcf"
          className="text-sm text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Télécharger la vCard (.vcf)
        </a>
      </p>
    </div>
  );
}
