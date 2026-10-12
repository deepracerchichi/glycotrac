import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Linda",
    short_name: "Linda",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FFFBE6",
    theme_color: "#F26534",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}