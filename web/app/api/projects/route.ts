import { NextResponse } from "next/server";

import { getPublishedProjects } from "@/lib/projects";
import { parseSelectedTags } from "@/lib/tag-filter";

export const dynamic = "force-dynamic";

// API publique en lecture (consommée par l'app mobile Expo, #5.x).
// GET /api/projects[?tags=a,b] — projets PUBLISHED (fallback mock si DB KO).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tags = parseSelectedTags(searchParams.get("tags") ?? undefined);
  const projects = await getPublishedProjects(tags);

  return NextResponse.json(
    { projects },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    },
  );
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
