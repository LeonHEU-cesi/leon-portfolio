import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroAnimated } from "@/components/sections/HeroAnimated";

// ISR : la home reste statique (hero) mais régénère périodiquement la
// section featured depuis la base. Le build sans DB retombe sur le mock.
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HeroAnimated />
      <FeaturedProjects />
    </>
  );
}
