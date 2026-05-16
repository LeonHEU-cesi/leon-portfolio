// Client API mobile (lecture seule) vers l'API publique web (#5.0).
// Base configurable via EXPO_PUBLIC_API_URL (défaut prod).
const BASE = (process.env.EXPO_PUBLIC_API_URL ?? 'https://leonheu.fr').replace(
  /\/+$/,
  '',
);

export type ApiProject = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
  imageGradient: string;
};

export type ApiProjectDetail = ApiProject & { content?: string };

export async function fetchProjects(
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProject[]> {
  const res = await fetchImpl(`${BASE}/api/projects`);
  if (!res.ok) throw new Error(`API /projects ${res.status}`);
  const data = (await res.json()) as { projects?: ApiProject[] };
  return Array.isArray(data?.projects) ? data.projects : [];
}

export async function fetchProject(
  slug: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProjectDetail | null> {
  const res = await fetchImpl(
    `${BASE}/api/projects/${encodeURIComponent(slug)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API /projects/${slug} ${res.status}`);
  const data = (await res.json()) as { project?: ApiProjectDetail };
  return data?.project ?? null;
}
