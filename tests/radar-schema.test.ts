import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RadarPage from "@/app/radar/page";
import ArchivedRadarPage from "@/app/radar/[date]/page";
import { getActiveRadarBriefing } from "@/lib/operations/radar";
import { getArchivedRadarBriefing, getRadarArchiveDates } from "@/lib/operations/radar-archive";

const language = vi.hoisted(() => ({ locale: "en" as "en" | "zh" }));
vi.mock("@/components/providers/language-provider", () => ({
  useLanguage: () => ({ locale: language.locale }),
}));

function schemaNodes(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap(match => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });
}

beforeEach(() => { language.locale = "en"; });

describe("Radar schema follows the rendered language", () => {
  for (const locale of ["en", "zh"] as const) {
    it(`renders one matching ${locale} Article for the current daily signal`, () => {
      language.locale = locale;
      const briefing = getActiveRadarBriefing();
      const html = renderToStaticMarkup(RadarPage());
      const nodes = schemaNodes(html);
      const articles = nodes.filter(node => node["@type"] === "Article");
      expect(articles).toHaveLength(1);
      expect(articles[0]).toMatchObject({
        headline: locale === "zh" ? briefing.daily.headlineZh : briefing.daily.headline,
        description: locale === "zh" ? briefing.daily.answerZh : briefing.daily.answer,
        inLanguage: locale === "zh" ? "zh-CN" : "en-US",
        mainEntityOfPage: "https://maker.wonderelian.com/radar/",
        datePublished: briefing.state.weekStarted,
        dateModified: briefing.state.lastRunDate,
      });
      expect(html).toContain(`<h1>${articles[0].headline}</h1>`);
      const breadcrumbs = nodes.find(node => node["@type"] === "BreadcrumbList");
      expect(breadcrumbs.itemListElement[0].name).toBe(locale === "zh" ? "首页" : "Home");
    });

    for (const date of [getRadarArchiveDates()[0], getRadarArchiveDates().at(-1)!]) {
      it(`keeps the ${date} archive identity and ${locale} visible signal aligned`, async () => {
        language.locale = locale;
        const briefing = getArchivedRadarBriefing(date)!;
        const html = renderToStaticMarkup(await ArchivedRadarPage({ params: Promise.resolve({ date }) }));
        const nodes = schemaNodes(html);
        const articles = nodes.filter(node => node["@type"] === "Article");
        expect(articles).toHaveLength(1);
        expect(articles[0]).toMatchObject({
          headline: locale === "zh" ? briefing.daily.headlineZh : briefing.daily.headline,
          description: locale === "zh" ? briefing.daily.answerZh : briefing.daily.answer,
          inLanguage: locale === "zh" ? "zh-CN" : "en-US",
          "@id": `https://maker.wonderelian.com/radar/${date}/#article`,
          mainEntityOfPage: `https://maker.wonderelian.com/radar/${date}/`,
          datePublished: date,
          dateModified: date,
        });
        expect(html).toContain(`<h1>${articles[0].headline}</h1>`);
        const breadcrumbs = nodes.find(node => node["@type"] === "BreadcrumbList");
        expect(breadcrumbs.itemListElement.at(-1)).toMatchObject({ name: date, item: articles[0].mainEntityOfPage });
      });
    }
  }
});
