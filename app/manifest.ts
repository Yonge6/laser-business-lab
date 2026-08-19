import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Laser Business Lab", short_name: "Business Lab", description: "Maker business opportunity and profit tools.", start_url: "/", display: "standalone", background_color: "#f8f5ef", theme_color: "#e7310e" };
}
