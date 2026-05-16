import Link from "next/link";

import type { Social } from "@/lib/data/socials";

// Présentationnel pur : liste des canaux de contact. Le bouton "Copier
// l'email" (client) est injecté via `action` pour rester testable.
export function ContactView({
  socials,
  action,
}: {
  socials: ReadonlyArray<Social>;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <ul className="space-y-3">
        {socials.map((social) => (
          <li key={social.label}>
            <Link
              href={social.href}
              {...(social.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-lg text-[var(--primary)] underline-offset-4 hover:underline"
              aria-label={
                social.external
                  ? `${social.label} (nouvel onglet)`
                  : social.label
              }
            >
              {social.label} →
            </Link>
          </li>
        ))}
      </ul>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
