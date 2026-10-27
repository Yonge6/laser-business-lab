import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RadarBriefing } from "@/components/marketing/radar-briefing";
import { getArchivedRadarBriefing, getRadarArchiveDates, getRadarArchiveNavigation, getRadarArchiveSummaries } from "@/lib/operations/radar-archive";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRadarArchiveDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const briefing = getArchivedRadarBriefing(date);
  if (!briefing) return {};
  const title = `${briefing.opportunity.title} Maker Opportunity Radar — ${date}`;
  const description = `${briefing.daily.answer} Review the ${date} price, material, gross-profit, validation, and equipment assumptions.`;
  return {
    title,
    description,
    alternates: { canonical: `/radar/${date}` },
    openGraph: {
      title,
      description,
      url: `/radar/${date}`,
      type: "article",
      publishedTime: `${date}T00:00:00+08:00`,
      modifiedTime: `${date}T00:00:00+08:00`,
      images: [{ url: briefing.opportunity.image, alt: briefing.opportunity.title }],
    },
  };
}

export default async function ArchivedRadarPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const briefing = getArchivedRadarBriefing(date);
  if (!briefing) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";
  return <RadarBriefing siteUrl={siteUrl} state={briefing.state} archiveItems={getRadarArchiveSummaries(date)} archiveNavigation={getRadarArchiveNavigation(date)} />;
}
