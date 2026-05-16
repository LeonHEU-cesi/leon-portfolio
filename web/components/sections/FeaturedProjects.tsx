import { getFeaturedProjects } from "@/lib/projects";

import { FeaturedProjectsView } from "./FeaturedProjectsView";

// Server Component async : lit les projets featured en base (fallback mock
// géré dans getFeaturedProjects si la DB est indisponible / build sans DB).
export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(3);
  return <FeaturedProjectsView projects={projects} />;
}
