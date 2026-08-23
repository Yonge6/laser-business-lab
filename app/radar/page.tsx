import type { Metadata } from "next";

import { RadarBriefing } from "@/components/marketing/radar-briefing";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Maker Opportunity Radar: ${briefing.opportunity.title}`,
    description: briefing.daily.answer,
    datePublished: briefing.state.weekStarted,
    dateModified: briefing.state.lastRunDate,
    image: `${siteUrl}${briefing.opportunity.image}`,
    mainEntityOfPage: `${siteUrl}/radar/`,
    author: { "@type": "Organization", name: "Maker Business Lab", url: siteUrl },
    publisher: { "@type": "Organization", name: "Maker Business Lab", url: siteUrl },
    about: [briefing.opportunity.title, briefing.opportunity.process, "maker business"],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><RadarBriefing /></>;
}
