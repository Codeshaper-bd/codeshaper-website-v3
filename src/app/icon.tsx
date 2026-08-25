import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — generated at build time from the same hexagon mark used in
 * Navbar/Footer (`M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z`),
 * so there's no separate exported PNG asset to keep in sync with the logo.
 * No favicon existed anywhere in this project before this file.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
        }}
      >
        <svg width="22" height="24" viewBox="0 0 26 28">
          <path
            d="M13 1 L24.3 7.5 L24.3 20.5 L13 27 L1.7 20.5 L1.7 7.5 Z"
            fill="none"
            stroke="#8B5FE0"
            strokeWidth="2.4"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
