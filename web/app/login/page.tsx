import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/LoginForm";

import { authenticate } from "./actions";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="login-title">
      <div className="mx-auto max-w-sm">
        <h1 id="login-title" className="mb-2 text-3xl font-semibold">
          Connexion
        </h1>
        <p className="mb-8 text-sm text-[var(--secondary)]">
          Espace d&apos;administration réservé.
        </p>
        <LoginForm action={authenticate} callbackUrl={callbackUrl ?? "/admin"} />
      </div>
    </section>
  );
}
