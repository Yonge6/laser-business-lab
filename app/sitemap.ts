import type { MetadataRoute } from "next";
import operationsState from "@/content/operations/state.json";
import { getRadarArchiveDates } from "@/lib/operations/radar-archive";
import { opportunities } from "@/lib/opportunities/data";
import { seoPagePath, type SeoPageKind } from "@/lib/seo/opportunity-content";
import { makerProjects } from "@/lib/projects/project-library";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
  const updated = new Date("2026-08-22T00:00:00.000Z");
  const corePaths = ["", "/opportunities", "/ideas", "/projects", "/radar", "/calculator", "/calculator/laser-roi", "/calculator/tumbler-profit", "/calculator/machine-finder", "/learn", "/about", "/privacy", "/disclaimer"];
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
  const radarArchive = getRadarArchiveDates().map((date) => ({
    url: `${base}/radar/${date}`,
    lastModified: new Date(`${date}T00:00:00.000Z`),
    changeFrequency: "never" as const,
    priority: .65,
  }));
  const projectPages = makerProjects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: .72,
    images: [`${base}${project.imagePath}`],
  }));

  return [...core, ...growthPages, ...projectPages, ...radarArchive];
}
