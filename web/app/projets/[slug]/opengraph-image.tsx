import { ImageResponse } from "next/og";

import { getProjectBySlug } from "@/lib/projects";

export const alt = "Projet — Léon HEU";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const title = project?.title ?? "Projet";
  const summary = project?.summary ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.6 }}>leon HEU · Projet</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 16 }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 20,
            opacity: 0.8,
            maxWidth: 1000,
          }}
        >
          {summary.slice(0, 140)}
        </div>
      </div>
    ),
    { ...size },
  );
}
