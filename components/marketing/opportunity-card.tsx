"use client";

import Image from "next/image";
import { Cube, Sparkle, TShirt } from "@phosphor-icons/react";
import type { Opportunity } from "@/lib/opportunities/data";
import { formatCurrency } from "@/lib/format";
import { useLanguage } from "@/components/providers/language-provider";
import { assetPath } from "@/lib/site";

export function OpportunityCard({ opportunity, active, onSelect }: { opportunity: Opportunity; active: boolean; onSelect: () => void }) {
  const { locale } = useLanguage();
  const CategoryIcon = opportunity.category === "laser" ? Sparkle : opportunity.category === "3d-printing" ? Cube : TShirt;
  return (
    <button className={active ? "opportunity-card is-active" : "opportunity-card"} data-opportunity-id={opportunity.id} onClick={onSelect} aria-pressed={active}>
      <span className="card-rank">#{String(opportunity.rank).padStart(2, "0")}</span>
      <span className="card-media">
        <Image src={assetPath(opportunity.image)} alt={locale === "zh" ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 760px) 41vw, 400px" loading={opportunity.rank === 1 ? "eager" : "lazy"} />
      </span>
      <span className="card-body">
        <span className="card-category"><CategoryIcon weight="bold" /> {locale === "zh" ? opportunity.processZh : opportunity.process}</span>
        <strong className="card-title">{locale === "zh" ? opportunity.titleZh : opportunity.title}</strong>
        <span className="score-label">{locale === "zh" ? "机会评分" : "OPPORTUNITY SCORE"}</span>
        <span className="score-value">{opportunity.score}<small>/100</small></span>
        <span className="estimate-label">{locale === "zh" ? "估算" : "ESTIMATES"}</span>
        <span className="metric-row">
          <span><small>{locale === "zh" ? "售价减材料" : "PRICE − MATERIALS"}</small><b>{formatCurrency(opportunity.grossProfit, 2)}</b></span>
          <span><small>{locale === "zh" ? "假设售价" : "ASSUMED PRICE"}</small><b>{formatCurrency(opportunity.sellingPrice, 2)}</b></span>
          <span><small>{locale === "zh" ? "材料成本" : "MATERIAL COST"}</small><b>{formatCurrency(opportunity.materialCost, 2)}</b></span>
        </span>
      </span>
      <span className="process-tab">{locale === "zh" ? opportunity.processZh : opportunity.process}</span>
    </button>
  );
}
