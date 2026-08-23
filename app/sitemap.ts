import type { MetadataRoute } from "next";
import operationsState from "@/content/operations/state.json";
import { opportunities } from "@/lib/opportunities/data";
import { seoPagePath, type SeoPageKind } from "@/lib/seo/opportunity-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
  const updated = new Date("2026-08-22T00:00:00.000Z");
  const corePaths = ["", "/opportunities", "/ideas", "/radar", "/calculator", "/calculator/laser-roi", "/calculator/tumbler-profit", "/calculator/machine-finder", "/learn", "/about", "/privacy", "/disclaimer"];
  const core = corePaths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: path === "/radar" ? new Date(`${operationsState.lastRunDate}T00:00:00.000Z`) : updated,
    changeFrequency: (index < 8 ? "weekly" : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: path === "" ? 1 : path === "/opportunities" || path === "/ideas" || path.includes("calculator") ? .9 : .5,
  }));
  const kinds: SeoPageKind[] = ["idea", "profit", "equipment"];
  const growthPages = opportunities.flatMap((opportunity) => kinds.map((kind) => ({
    url: `${base}${seoPagePath(kind, opportunity.id)}`,
    lastModified: updated,
    changeFrequency: "weekly" as const,
    priority: kind === "idea" ? .85 : .8,
    images: [`${base}${opportunity.image}`],
  })));

  return [...core, ...growthPages];
}
