"use client";

import { ArrowRight, Calculator, Factory } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import { opportunities } from "@/lib/opportunities/data";
import { assetPath } from "@/lib/site";
import { seoPagePath } from "@/lib/seo/opportunity-content";

export function SeoOpportunityCatalog() {
  const { locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <section className="seo-catalog shell" aria-labelledby="seo-catalog-title">
      <header>
        <p className="eyebrow">{zh ? "7 个数据化起步方向" : "7 DATA-LED STARTING DIRECTIONS"}</p>
        <h2 id="seo-catalog-title">{zh ? "从一个产品，走完商业决策闭环。" : "Take one product through the full business decision."}</h2>
        <p>{zh ? "每个方向都包含目标买家、公开市场参考、利润模型、七天验证计划和设备匹配。先验证需求，再扩大投入。" : "Every direction connects a target buyer, public market reference, profit model, seven-day validation plan, and equipment fit. Prove demand before expanding investment."}</p>
      </header>
      <div className="seo-catalog-grid">
        {opportunities.map((opportunity) => (
          <article key={opportunity.id}>
            <Link className="seo-catalog-image" href={seoPagePath("idea", opportunity.id)}>
              <Image src={assetPath(opportunity.image)} alt={zh ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span>#{String(opportunity.rank).padStart(2, "0")}</span>
            </Link>
            <div className="seo-catalog-copy">
              <small>{zh ? opportunity.processZh : opportunity.process}</small>
              <h3><Link href={seoPagePath("idea", opportunity.id)}>{zh ? opportunity.titleZh : opportunity.title}</Link></h3>
              <div><span>{zh ? "机会评分" : "SCORE"}<strong>{opportunity.score}/100</strong></span><span>{zh ? "单件毛利" : "GROSS PROFIT"}<strong>{formatCurrency(opportunity.grossProfit, 2)}</strong></span></div>
              <p>{zh ? opportunity.evidenceZh : opportunity.evidence}</p>
              <nav aria-label={zh ? `${opportunity.titleZh}页面` : `${opportunity.title} pages`}>
                <Link href={seoPagePath("idea", opportunity.id)}>{zh ? "查看商机" : "View opportunity"}<ArrowRight weight="bold" /></Link>
                <Link href={seoPagePath("profit", opportunity.id)}><Calculator weight="bold" />{zh ? "利润模型" : "Profit model"}</Link>
                <Link href={seoPagePath("equipment", opportunity.id)}><Factory weight="bold" />{zh ? "设备场景" : "Equipment fit"}</Link>
              </nav>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
