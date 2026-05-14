import Link from "next/link";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/LeonHEU-cesi" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:leon@leonheu.fr" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)] py-8 transition-colors">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-[var(--secondary)] sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {year} Léon HEU. Tous droits réservés.{" "}
          <Link
            href="/mentions-legales"
            className="underline-offset-2 transition-colors hover:text-[var(--fg)] hover:underline"
          >
            Mentions légales
          </Link>
        </p>
        <ul className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition-colors hover:text-[var(--fg)]"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
