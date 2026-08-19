"use client";

import Image from "next/image";
import { Cube, Sparkle } from "@phosphor-icons/react";
import type { Opportunity } from "@/lib/opportunities/data";
import { formatCurrency } from "@/lib/format";
import { useLanguage } from "@/components/providers/language-provider";
import { assetPath } from "@/lib/site";

export function OpportunityCard({ opportunity, active, onSelect }: { opportunity: Opportunity; active: boolean; onSelect: () => void }) {
  const { locale } = useLanguage();
  const isLaser = opportunity.category === "laser";
  return (
    <button className={active ? "opportunity-card is-active" : "opportunity-card"} onClick={onSelect} aria-pressed={active}>
      <span className="card-rank">#{String(opportunity.rank).padStart(2, "0")}</span>
      <span className="card-media">
        <Image src={assetPath(opportunity.image)} alt={locale === "zh" ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 800px) 100vw, 33vw" />
      </span>
      <span className="card-body">
        <span className="card-category">{isLaser ? <Sparkle weight="bold" /> : <Cube weight="bold" />} {locale === "zh" ? opportunity.processZh : opportunity.process}</span>
        <strong className="card-title">{locale === "zh" ? opportunity.titleZh : opportunity.title}</strong>
        <span className="score-label">{locale === "zh" ? "机会评分" : "OPPORTUNITY SCORE"}</span>
        <span className="score-value">{opportunity.score}<small>/100</small></span>
        <span className="estimate-label">{locale === "zh" ? "估算" : "ESTIMATES"}</span>
        <span className="metric-row">
          <span><small>{locale === "zh" ? "单件毛利" : "EST. GROSS PROFIT"}</small><b>{formatCurrency(opportunity.grossProfit, 2)}</b></span>
          <span><small>{locale === "zh" ? "典型售价" : "TYPICAL PRICE"}</small><b>{formatCurrency(opportunity.sellingPrice, 2)}</b></span>
          <span><small>{locale === "zh" ? "材料成本" : "MATERIAL COST"}</small><b>{formatCurrency(opportunity.materialCost, 2)}</b></span>
        </span>
      </span>
      <span className="process-tab">{locale === "zh" ? opportunity.processZh : opportunity.process}</span>
    </button>
  );
}
