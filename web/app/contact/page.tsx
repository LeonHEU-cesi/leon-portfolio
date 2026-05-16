import type { Metadata } from "next";

import { ContactQrCode } from "@/components/sections/ContactQrCode";
import { ContactView } from "@/components/sections/ContactView";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/data/socials";

export const metadata: Metadata = {
  title: "Contact",
  description: "Me contacter : email, GitHub, LinkedIn.",
};

export default function ContactPage() {
  return (
    <section
      className="px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)]">
            Contact
          </p>
          <h1
            id="contact-title"
            className="mt-2 text-balance text-4xl font-semibold leading-tight sm:text-5xl"
          >
            Travaillons ensemble
          </h1>
          <p className="mt-4 text-[var(--secondary)]">
            Disponible pour échanger autour d&apos;un projet, d&apos;une
            alternance ou d&apos;une opportunité. Le plus simple reste l&apos;email.
          </p>
        </header>

        <ContactView
          socials={SOCIALS}
          action={<CopyEmailButton email={CONTACT_EMAIL} />}
        />

        <ContactQrCode />
      </div>
    </section>
  );
}
