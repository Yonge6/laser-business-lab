import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://laserbusinesslab.com";
  return ["", "/opportunities", "/calculator", "/calculator/laser-roi", "/calculator/tumbler-profit", "/calculator/machine-finder", "/learn", "/about", "/privacy", "/disclaimer"].map((path, index) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: index < 6 ? "weekly" : "monthly", priority: path === "" ? 1 : path.includes("calculator") || path === "/opportunities" ? .9 : .5 }));
}
