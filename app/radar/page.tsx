import type { Metadata } from "next";

import { RadarBriefing } from "@/components/marketing/radar-briefing";
import { getRadarArchiveSummaries } from "@/lib/operations/radar-archive";
import { getActiveRadarBriefing } from "@/lib/operations/radar";

const briefing = getActiveRadarBriefing();

export const metadata: Metadata = {
  title: `Maker Opportunity Radar: ${briefing.opportunity.title}`,
  description: `A daily business signal and seven-day validation plan for ${briefing.opportunity.title.toLowerCase()}, with price, material, margin, production, risk, and equipment context.`,
  alternates: { canonical: "/radar" },
  openGraph: {
    title: `Maker Opportunity Radar: ${briefing.opportunity.title}`,
    description: briefing.daily.answer,
    url: "/radar",
    type: "article",
    images: [{ url: briefing.opportunity.image, alt: briefing.opportunity.title }],
  },
};

export default function RadarPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
  const archiveItems = getRadarArchiveSummaries(briefing.state.lastRunDate);
  return <RadarBriefing siteUrl={siteUrl} archiveItems={archiveItems} />;
}
