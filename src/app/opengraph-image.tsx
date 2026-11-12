import { ImageResponse } from "next/og";

export const alt = "Fast POS Menu: any restaurant menu, into any POS, in minutes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share card for every page. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f5f1",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ff5a1f",
              color: "white",
              fontSize: 40,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            F
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#15171b" }}>Fast POS Menu</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 800, lineHeight: 1.02, color: "#15171b" }}>
          <div>Any menu. Any POS.</div>
          <div style={{ color: "#ff5a1f" }}>In minutes.</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#6b6e75" }}>Photos, PDF or spreadsheet → import file for Square, Clover or Toast</div>
      </div>
    ),
    size,
  );
}
