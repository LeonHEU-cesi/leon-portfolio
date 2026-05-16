import type { ApiProjectDetail } from '@/lib/api';

const SITE = (process.env.EXPO_PUBLIC_SITE_URL ?? 'https://leonheu.fr').replace(
  /\/+$/,
  '',
);

// Pur : message de partage d'un projet (lien web public). Testable.
export function buildShareMessage(project: ApiProjectDetail): string {
  return `${project.title} — ${project.summary}\n${SITE}/projets/${project.slug}`;
}
