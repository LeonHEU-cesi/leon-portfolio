import { unstable_cache } from "next/cache";

const GITHUB_USER = "LeonHEU-cesi";
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`;
const REVALIDATE_SECONDS = 60 * 60 * 24; // 24 h

export type GitHubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  stars: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
};

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

function mapRepo(raw: RawRepo): GitHubRepo {
  return {
    name: raw.name,
    description: raw.description,
    htmlUrl: raw.html_url,
    stars: raw.stargazers_count,
    language: raw.language,
    topics: raw.topics ?? [],
    pushedAt: raw.pushed_at,
  };
}

// Récupère les repos publics. `fetchImpl` injectable pour les tests.
// Ne jette jamais : toute erreur (réseau, quota, token absent, 4xx/5xx)
// renvoie [] pour que la page ne casse pas (dégradation propre).
export async function fetchPublicRepos(
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubRepo[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetchImpl(REPOS_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "leon-portfolio",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      console.error(`[github] réponse non OK (${response.status}) — fallback []`);
      return [];
    }

    const data = (await response.json()) as RawRepo[];
    if (!Array.isArray(data)) return [];

    return data
      .filter((repo) => !repo.fork && !repo.archived)
      .map(mapRepo)
      .sort((a, b) => b.stars - a.stars);
  } catch (error) {
    console.error("[github] récupération des repos échouée — fallback []:", error);
    return [];
  }
}

// Cache ISR 24 h : 1 appel réseau / jour max, partagé entre requêtes.
export const getCachedPublicRepos = unstable_cache(
  async () => fetchPublicRepos(),
  ["github-public-repos"],
  { revalidate: REVALIDATE_SECONDS, tags: ["github-repos"] },
);
