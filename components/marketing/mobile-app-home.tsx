"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookmarkSimple, Check, Pulse } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import { getActiveRadarBriefing } from "@/lib/operations/radar";
import {
  getSavedOpportunityServerSnapshot,
  getSavedOpportunitySnapshot,
  subscribeToSavedOpportunities,
  writeSavedOpportunityIds,
} from "@/lib/opportunities/saved";
import { assetPath } from "@/lib/site";

const copy = {
  en: {
    mission: "Your mission",
    heroA: "Find your next",
    heroB: "profitable",
    heroC: "maker product.",
    intro: "Real demand. Strong margin. Built with the equipment you have—or plan to buy.",
    signal: "Today’s maker signal",
    demand: "Demand signal",
    competition: "Competition",
    opportunityScore: "Opportunity score",
    sellingPrice: "Typical selling price",
    grossProfit: "Est. gross profit",
    materialCost: "Material cost",
    margin: "gross margin before fees and labor",
    cta: "View full opportunity",
    save: "Save opportunity",
    saved: "Saved",
    steps: ["Discover", "Validate", "Build", "Sell"],
    statement: "Make with data. Build with confidence. Profit on purpose.",
  },
  zh: {
    mission: "你的任务",
    heroA: "找到你的下一个",
    heroB: "赚钱",
    heroC: "Maker 产品。",
    intro: "看真实需求、利润空间，以及与你现有或计划购买设备的匹配度。",
    signal: "今日 Maker 信号",
    demand: "需求信号",
    competition: "竞争程度",
    opportunityScore: "机会评分",
    sellingPrice: "典型售价",
    grossProfit: "预计单件毛利",
    materialCost: "材料成本",
    margin: "未扣平台费与人工的毛利率",
    cta: "查看完整机会",
    save: "收藏这个机会",
    saved: "已收藏",
    steps: ["发现", "验证", "生产", "销售"],
    statement: "用数据做选择，用验证建立信心，再决定投入。",
  },
};

export function MobileAppHome() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const briefing = getActiveRadarBriefing();
  const { opportunity } = briefing;
  const marginRate = Math.round((opportunity.grossProfit / opportunity.sellingPrice) * 100);
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedOpportunities,
    getSavedOpportunitySnapshot,
    getSavedOpportunityServerSnapshot,
  );
  const savedIds = JSON.parse(savedSnapshot) as string[];
  const isSaved = savedIds.includes(opportunity.id);

  function saveOpportunity() {
    writeSavedOpportunityIds(isSaved ? savedIds.filter((id) => id !== opportunity.id) : [...savedIds, opportunity.id]);
  }

  return (
    <section className="mobile-app-home" aria-labelledby="mobile-home-title">
      <div className="mobile-app-hero">
        <p className="mobile-app-eyebrow">{t.mission}</p>
        <h1 id="mobile-home-title">
          <span>{t.heroA}</span>
          <em>{t.heroB}</em>
          <span>{t.heroC}</span>
        </h1>
        <div className="mobile-app-speed-stripe" aria-hidden="true" />
        <p>{t.intro}</p>
      </div>

      <article className="mobile-signal-card">
        <header>
          <Pulse weight="fill" aria-hidden="true" />
          <strong>{t.signal}</strong>
          <time dateTime={briefing.state.lastRunDate}>{briefing.state.lastRunDate}</time>
        </header>

        <div className="mobile-signal-product">
          <div className="mobile-signal-image">
            <Image
              src={assetPath("/images/mobile/leather-luggage-tag.png")}
              alt={locale === "zh" ? "激光雕刻山林图案的棕色皮革行李牌" : "Brown leather luggage tag laser engraved with a mountain and pine forest"}
              fill
              sizes="48vw"
              priority
            />
            <span>{t.demand}: {opportunity.demand}/100</span>
          </div>

          <div className="mobile-signal-details">
            <div className="mobile-signal-heading">
              <div>
                <small>{locale === "zh" ? opportunity.processZh : opportunity.process}</small>
                <h2>{locale === "zh" ? opportunity.titleZh : opportunity.title}</h2>
              </div>
              <button className={isSaved ? "is-saved" : undefined} type="button" onClick={saveOpportunity} aria-label={isSaved ? t.saved : t.save} title={isSaved ? t.saved : t.save} aria-pressed={isSaved}>
                <BookmarkSimple weight={isSaved ? "fill" : "bold"} aria-hidden="true" />
              </button>
            </div>

            <div className="mobile-signal-score">
              <span>{t.opportunityScore}</span>
              <strong>{opportunity.score}<small>/100</small></strong>
              <i aria-hidden="true"><span style={{ width: `${opportunity.score}%` }} /></i>
            </div>

            <dl>
              <div><dt>{t.sellingPrice}</dt><dd>{formatCurrency(opportunity.sellingPrice, 2)}</dd></div>
              <div><dt>{t.grossProfit}</dt><dd>{formatCurrency(opportunity.grossProfit, 2)}</dd></div>
              <div><dt>{t.materialCost}</dt><dd>{formatCurrency(opportunity.materialCost, 2)}</dd></div>
            </dl>
            <p>{marginRate}% {t.margin}</p>
          </div>
        </div>

        <Link className="mobile-signal-cta" href={briefing.links.idea}>
          {t.cta}<ArrowRight weight="bold" aria-hidden="true" />
        </Link>
      </article>

      <ol className="mobile-business-path" aria-label={locale === "zh" ? "Maker 商业路径" : "Maker business path"}>
        {t.steps.map((step, index) => (
          <li key={step} className={index === 0 ? "is-active" : undefined}>
            <span>{index === 0 ? <Check weight="bold" aria-hidden="true" /> : index + 1}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
      <p className="mobile-app-statement">{t.statement}</p>
    </section>
  );
}
