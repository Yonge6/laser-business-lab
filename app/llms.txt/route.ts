import { getRadarArchiveDates } from "@/lib/operations/radar-archive";
import { getActiveRadarBriefing } from "@/lib/operations/radar";
import { opportunities } from "@/lib/opportunities/data";
import { seoPagePath } from "@/lib/seo/opportunity-content";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";

export function buildLlmsText() {
  const active = getActiveRadarBriefing();
  const lines = [
    "# Maker Business Lab",
    "",
    "> Business-first product opportunity, profit, validation, and equipment guidance for makers and one-person companies.",
    "",
    "Maker Business Lab helps laser, 3D-printing, and heat-press creators decide what to sell, test unit economics, and choose equipment from the production workflow. Financial figures are planning estimates, not earnings promises.",
    "",
    "## Current signal and machine-readable data",
    "",
    `- [Current Maker Opportunity Radar](${siteUrl}/radar/): ${active.daily.headline}`,
    `- [Latest operations data](${siteUrl}/operations/latest.json): JSON with product, decision lens, estimates, caveats, and tracked distribution links.`,
    `- [Maker Opportunity Radar RSS](${siteUrl}/feed.xml): Daily archive feed.`,
    "",
    "## Product decision paths",
    "",
  ];

  for (const opportunity of opportunities) {
    lines.push(`### ${opportunity.title}`);
    lines.push(`- [What to sell](${siteUrl}${seoPagePath("idea", opportunity.id)})`);
    lines.push(`- [Profit model](${siteUrl}${seoPagePath("profit", opportunity.id)})`);
    lines.push(`- [Equipment path](${siteUrl}${seoPagePath("equipment", opportunity.id)})`);
    lines.push("");
  }

  lines.push("## Radar archive");
  lines.push("");
  for (const date of getRadarArchiveDates().slice(0, 30)) {
    lines.push(`- [${date}](${siteUrl}/radar/${date}/)`);
  }
  lines.push("");
  lines.push("## Trust and methodology");
  lines.push("");
  lines.push(`- [About the lab](${siteUrl}/about/)`);
  lines.push(`- [Method and disclaimers](${siteUrl}/disclaimer/)`);
  lines.push(`- [Privacy](${siteUrl}/privacy/)`);
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
