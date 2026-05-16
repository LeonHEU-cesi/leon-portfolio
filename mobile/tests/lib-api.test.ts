import { fetchProject, fetchProjects } from '@/lib/api';

function jsonRes(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body } as unknown as Response;
}

describe('fetchProjects', () => {
  it('mappe la liste depuis { projects }', async () => {
    const f = jest.fn().mockResolvedValue(jsonRes({ projects: [{ slug: 'a' }] }));
    await expect(fetchProjects(f as unknown as typeof fetch)).resolves.toEqual([
      { slug: 'a' },
    ]);
  });

  it('jette si la réponse n’est pas OK', async () => {
    const f = jest.fn().mockResolvedValue(jsonRes({}, false, 500));
    await expect(fetchProjects(f as unknown as typeof fetch)).rejects.toThrow();
  });

  it('liste vide si payload inattendu', async () => {
    const f = jest.fn().mockResolvedValue(jsonRes({}));
    await expect(fetchProjects(f as unknown as typeof fetch)).resolves.toEqual([]);
  });
});

describe('fetchProject', () => {
  it('retourne null sur 404', async () => {
    const f = jest.fn().mockResolvedValue(jsonRes({}, false, 404));
    await expect(
      fetchProject('x', f as unknown as typeof fetch),
    ).resolves.toBeNull();
  });

  it('retourne le détail depuis { project }', async () => {
    const f = jest.fn().mockResolvedValue(jsonRes({ project: { slug: 'a' } }));
    await expect(
      fetchProject('a', f as unknown as typeof fetch),
    ).resolves.toEqual({ slug: 'a' });
  });
});
