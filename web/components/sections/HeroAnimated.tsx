"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE_LINE_1 = "Développeur";
const TITLE_LINE_2 = "full-stack";
const TITLE_LINE_3 = "basé en France.";

export function HeroAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) {
        // Aucune animation, affichage statique.
        gsap.set(
          [
            "[data-hero='kicker']",
            "[data-hero='word']",
            "[data-hero='subtitle']",
            "[data-hero='ctas']",
            "[data-hero='scroll-hint']",
          ],
          { opacity: 1, y: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

      tl.fromTo(
        "[data-hero='kicker']",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0 },
      )
        .fromTo(
          "[data-hero='word']",
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.4",
        )
        .fromTo(
          "[data-hero='subtitle']",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          "[data-hero='ctas']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2",
        )
        .fromTo(
          "[data-hero='scroll-hint']",
          { opacity: 0, y: 8 },
          { opacity: 0.6, y: 0, duration: 0.6 },
          "+=0.1",
        );

      // Légère parallax sur le titre via ScrollTrigger.
      gsap.to("[data-hero='title-wrapper']", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={containerRef}
      className="relative isolate flex min-h-[80vh] flex-col justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6">
        <p
          data-hero="kicker"
          className="text-xs uppercase tracking-[0.2em] text-[var(--secondary)] opacity-0"
        >
          Portfolio · Léon HEU
        </p>

        <h1
          id="hero-title"
          data-hero="title-wrapper"
          className="text-balance text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
        >
          <span className="block">
            <span data-hero="word" className="inline-block opacity-0">
              {TITLE_LINE_1}
            </span>
          </span>
          <span className="block">
            <span data-hero="word" className="inline-block opacity-0">
              {TITLE_LINE_2}
            </span>
          </span>
          <span className="block text-[var(--accent)]">
            <span data-hero="word" className="inline-block opacity-0">
              {TITLE_LINE_3}
            </span>
          </span>
        </h1>

        <p
          data-hero="subtitle"
          className="max-w-xl text-pretty text-lg text-[var(--secondary)] opacity-0"
        >
          Portfolio personnel, projets curés, hub GitHub et notes techniques. Tailwind, Next.js,
          Postgres, Expo.
        </p>

        <div data-hero="ctas" className="flex flex-wrap gap-3 pt-2 opacity-0">
          <Link
            href="/projets"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--primary)] px-6 text-sm font-medium text-[var(--primary-fg)] transition-opacity hover:opacity-90"
          >
            Voir les projets
          </Link>
          <Link
            href="/cv"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-6 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--muted)]"
          >
            Mon parcours
          </Link>
        </div>
      </div>

      <span
        data-hero="scroll-hint"
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-[var(--secondary)] opacity-0"
        aria-hidden="true"
      >
        Scroll ↓
      </span>
    </section>
  );
}
