"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import type { FeaturedProject } from "@/lib/data/featured-projects";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.article
      whileHover={prefersReduced ? undefined : { y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)] transition-[box-shadow,border-color] duration-200 hover:border-[var(--primary)] hover:shadow-[var(--shadow-medium)]"
    >
      <div
        className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
        style={{ background: project.imageGradient }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-[var(--font-display)] text-xl font-semibold tracking-tight">
          <Link
            href={`/projets/${project.slug}`}
            className="underline-offset-4 outline-offset-4 hover:text-[var(--primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            {project.title}
          </Link>
        </h3>
        <p className="flex-1 text-sm text-[var(--secondary)]">{project.summary}</p>
        <ul className="flex flex-wrap gap-2 pt-1" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--secondary)]"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="flex gap-3 pt-2 text-sm">
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline-offset-2 hover:underline"
            >
              Code →
            </Link>
          )}
          {project.demoUrl && (
            <Link
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Démo ↗
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
