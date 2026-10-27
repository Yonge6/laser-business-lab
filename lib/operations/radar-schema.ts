import type { Locale } from "@/lib/locale-preference";
import type { getRadarBriefing } from "@/lib/operations/radar";

export function radarStructuredData(
  briefing: ReturnType<typeof getRadarBriefing>,
  siteUrl: string,
  locale: Locale,
  archived: boolean,
) {
  const { state, opportunity, daily } = briefing;
  const zh = locale === "zh";
  const radarUrl = new URL("/radar/", siteUrl).href;
  const pageUrl = archived ? new URL(`/radar/${state.lastRunDate}/`, siteUrl).href : radarUrl;
  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: zh ? "首页" : "Home", item: new URL("/", siteUrl).href },
    { "@type": "ListItem", position: 2, name: zh ? "商机雷达" : "Maker Opportunity Radar", item: radarUrl },
  ];
  if (archived) breadcrumbs.push({ "@type": "ListItem", position: 3, name: state.lastRunDate, item: pageUrl });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        headline: zh ? daily.headlineZh : daily.headline,
        description: zh ? daily.answerZh : daily.answer,
        inLanguage: zh ? "zh-CN" : "en-US",
        datePublished: archived ? state.lastRunDate : state.weekStarted,
        dateModified: state.lastRunDate,
        image: new URL(opportunity.image, siteUrl).href,
        author: { "@type": "Organization", name: "Maker Business Lab", url: siteUrl },
        publisher: { "@type": "Organization", name: "Maker Business Lab", url: siteUrl },
        about: [zh ? opportunity.titleZh : opportunity.title, zh ? opportunity.processZh : opportunity.process, zh ? daily.labelZh : daily.label],
      },
      { "@type": "BreadcrumbList", itemListElement: breadcrumbs },
    ],
  };
}
