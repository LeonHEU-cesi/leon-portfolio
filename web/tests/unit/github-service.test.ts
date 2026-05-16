import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchPublicRepos } from "@/lib/services/github";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

const RAW = [
  {
    name: "leon-portfolio",
    description: "Portfolio",
    html_url: "https://github.com/LeonHEU-cesi/leon-portfolio",
    stargazers_count: 3,
    language: "TypeScript",
    topics: ["nextjs"],
    pushed_at: "2026-05-10T00:00:00Z",
    fork: false,
    archived: false,
  },
  {
    name: "popular",
    description: null,
    html_url: "https://github.com/LeonHEU-cesi/popular",
    stargazers_count: 9,
    language: "Go",
    pushed_at: "2026-04-01T00:00:00Z",
    fork: false,
    archived: false,
  },
  {
    name: "a-fork",
    description: null,
    html_url: "x",
    stargazers_count: 99,
    language: null,
    topics: [],
    pushed_at: "2026-01-01T00:00:00Z",
    fork: true,
    archived: false,
  },
];

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("fetchPublicRepos", () => {
  it("mappe, exclut les forks/archivés et trie par stars desc", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(RAW));
    const repos = await fetchPublicRepos(fetchImpl as unknown as typeof fetch);
    expect(repos.map((r) => r.name)).toEqual(["popular", "leon-portfolio"]);
    expect(repos[0]?.topics).toEqual([]);
    expect(repos[1]?.htmlUrl).toContain("leon-portfolio");
  });

  it("ajoute l'en-tête Authorization si GITHUB_TOKEN est défini", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test");
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse([]));
    await fetchPublicRepos(fetchImpl as unknown as typeof fetch);
    const headers = (fetchImpl.mock.calls[0]?.[1] as RequestInit).headers as Record<
      string,
      string
    >;
    expect(headers.Authorization).toBe("Bearer ghp_test");
  });

  it("renvoie [] si la réponse n'est pas OK", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}, false, 403));
    expect(await fetchPublicRepos(fetchImpl as unknown as typeof fetch)).toEqual([]);
  });

  it("renvoie [] si fetch jette", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network"));
    expect(await fetchPublicRepos(fetchImpl as unknown as typeof fetch)).toEqual([]);
  });
});
