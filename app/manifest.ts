import type { MetadataRoute } from "next";
import { assetPath, sitePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maker Business Lab",
    short_name: "Maker Lab",
    description: "Find profitable maker products, validate the numbers, and choose the right production path.",
    start_url: sitePath("/?source=installed-app"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8f5ef",
    theme_color: "#e7310e",
    categories: ["business", "productivity", "education"],
    icons: [
      { src: assetPath("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: assetPath("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: assetPath("/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
