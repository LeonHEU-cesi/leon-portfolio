import { NextResponse } from "next/server";

import { openApiDocument } from "@/lib/openapi";

// Document OpenAPI 3.1 servi en JSON (consommé par Scalar sur /api/docs
// et par tout client souhaitant générer un SDK). Statique → cacheable.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(openApiDocument, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
