import { NextResponse } from "next/server";

import { getProjectBySlug } from "@/lib/projects";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// GET /api/projects/[slug] — détail public ou 404 JSON.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return NextResponse.json(
      { error: "Projet introuvable." },
      { status: 404, headers: CORS },
    );
  }

  return NextResponse.json(
    { project },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        ...CORS,
      },
    },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
