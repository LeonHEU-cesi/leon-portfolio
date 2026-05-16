import { useQuery } from '@tanstack/react-query';

import { fetchProject, fetchProjects } from '@/lib/api';

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects() });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject(slug),
    enabled: Boolean(slug),
  });
}
