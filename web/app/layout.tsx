import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ModeProvider } from "@/components/providers/ModeProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { personJsonLd } from "@/lib/json-ld";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Léon HEU — Portfolio",
    template: "%s · Léon HEU",
  },
  description:
    "Portfolio personnel de Léon HEU, développeur full-stack basé en France. Projets, parcours, compétences et hub GitHub.",
  authors: [{ name: "Léon HEU" }],
  creator: "Léon HEU",
  metadataBase: new URL(process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-mode="editorial"
      className={[
        fraunces.variable,
        inter.variable,
        geistSans.variable,
        geistMono.variable,
        "h-full",
        "antialiased",
      ].join(" ")}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <ThemeProvider>
          <ModeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
