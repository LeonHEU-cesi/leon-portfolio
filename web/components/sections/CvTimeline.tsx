"use client";

import { motion } from "framer-motion";

import type { CvEntry } from "@/lib/data/cv";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

// Timeline verticale antéchronologique, entrées révélées au scroll
// (désactivé si prefers-reduced-motion → rendu statique immédiat).
export function CvTimelineView({
  entries,
}: {
  entries: ReadonlyArray<CvEntry>;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const ordered = [...entries].sort((a, b) => b.start - a.start);

  return (
    <ol className="relative ml-3 border-l border-[var(--border)]">
      {ordered.map((entry) => (
        <motion.li
          key={entry.id}
          className="mb-12 ml-6"
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span
            className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border border-[var(--bg)] bg-[var(--primary)]"
            aria-hidden="true"
          />
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--secondary)]">
            {entry.period} · {entry.kind}
          </p>
          <h3 className="mt-1 font-[var(--font-display)] text-xl font-semibold tracking-tight">
            {entry.role}
          </h3>
          <p className="text-sm text-[var(--secondary)]">{entry.org}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]">
            {entry.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
