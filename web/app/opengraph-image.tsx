import { ImageResponse } from "next/og";

export const alt = "Léon HEU — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #2a1d12 0%, #5a3a22 100%)",
          color: "#fcf4e6",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>Léon HEU</div>
        <div style={{ fontSize: 36, marginTop: 12, opacity: 0.9 }}>
          Développeur full-stack
        </div>
        <div style={{ fontSize: 24, marginTop: 28, opacity: 0.75 }}>
          Projets · CV · Contact — leonheu.fr
        </div>
      </div>
    ),
    { ...size },
  );
}
