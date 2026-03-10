import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Leafclutch Technologies — IT Training & Internship in Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1E293B 0%, #1C46C8 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 20,
        }}
      >
        Leafclutch Technologies
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: "#cbd5e1",
          textAlign: "center",
          lineHeight: 1.4,
          marginBottom: 32,
        }}
      >
        IT Training & Internship in Bhairahawa, Butwal, Nepal
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          "AI & ML",
          "Web Dev",
          "Cybersecurity",
          "UI/UX",
          "Graphic Design",
          "Data Science",
        ].map((tag) => (
          <div
            key={tag}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "20px",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 18,
          color: "#94a3b8",
        }}
      >
        leafclutchtech.com.np
      </div>
    </div>,
    { ...size },
  );
}
