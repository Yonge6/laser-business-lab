"use client";

import { ArrowRight, ArrowSquareOut, Calculator, CheckCircle, Factory, MagnifyingGlass, ShieldCheck, Storefront, Target } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { TrackedExternalLink } from "@/components/analytics/tracked-external-link";
import { useLanguage } from "@/components/providers/language-provider";
import { getOpportunityEquipmentRecommendation } from "@/lib/commerce/opportunity-equipment";
import { withElianSource } from "@/lib/commerce/outbound";
import { formatCurrency } from "@/lib/format";
import { assetPath } from "@/lib/site";
import { getSeoOpportunity, seoFaq, seoPagePath, type SeoPageKind } from "@/lib/seo/opportunity-content";

const etsyTrendReport = withElianSource("https://www.etsy.com/seller-handbook/article/1473931456647");

export function SeoOpportunityLanding({ opportunityId, kind }: { opportunityId: string; kind: SeoPageKind }) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const content = getSeoOpportunity(opportunityId);
  if (!content) return null;

  const { opportunity, profile, marketCase } = content;
  const equipment = getOpportunityEquipmentRecommendation(opportunity.id, opportunity.category);
  const faq = seoFaq(kind, opportunity.id);
  const marginRate = Math.round((opportunity.grossProfit / opportunity.sellingPrice) * 100);
  const unitsInTwentyHours = Math.max(1, Math.floor((20 * 60) / opportunity.productionMinutes));
  const twentyHourProfit = unitsInTwentyHours * opportunity.grossProfit;

  const pageCopy = {
    idea: {
      eyebrow: zh ? "卖什么 / 产品机会" : "WHAT TO SELL / PRODUCT OPPORTUNITY",
      title: zh ? `${opportunity.titleZh}值得拿来卖吗？` : `Are ${opportunity.title} Worth Selling?`,
      answer: zh
        ? `${profile.marketAngleZh} 当前模型以 ${formatCurrency(opportunity.sellingPrice, 2)} 售价和 ${formatCurrency(opportunity.materialCost, 2)} 材料成本估算，单件毛利为 ${formatCurrency(opportunity.grossProfit, 2)}；在扩大库存或设备前，应先用小批量付费订单验证。`
        : `${profile.marketAngle} The current model uses a ${formatCurrency(opportunity.sellingPrice, 2)} selling price and ${formatCurrency(opportunity.materialCost, 2)} material cost for ${formatCurrency(opportunity.grossProfit, 2)} estimated gross profit per item. Validate it with a small paid-order test before expanding inventory or equipment.`,
      marker: "IDEA",
    },
    profit: {
      eyebrow: zh ? "怎么算 / 利润模型" : "HOW THE MATH WORKS / PROFIT MODEL",
      title: zh ? `${opportunity.titleZh}利润计算` : `${opportunity.title} Profit Calculator`,
      answer: zh
        ? `以 ${formatCurrency(opportunity.sellingPrice, 2)} 典型售价减去 ${formatCurrency(opportunity.materialCost, 2)} 材料成本，起始单件毛利为 ${formatCurrency(opportunity.grossProfit, 2)}，毛利率约 ${marginRate}%。这个数字还没有扣除平台费、主动人工、报废、包装、物流、税费与营销。`
        : `At a ${formatCurrency(opportunity.sellingPrice, 2)} typical selling price minus ${formatCurrency(opportunity.materialCost, 2)} in material, starting gross profit is ${formatCurrency(opportunity.grossProfit, 2)} per item, or about ${marginRate}%. This is before selling fees, active labor, failed pieces, packaging, shipping, tax, and marketing.`,
      marker: "MATH",
    },
    equipment: {
      eyebrow: zh ? "用什么做 / 设备场景" : "WHAT TO USE / EQUIPMENT FIT",
      title: zh ? `${opportunity.titleZh}需要什么设备？` : `Best Equipment for ${opportunity.title}`,
      answer: zh
        ? `设备选择应从${opportunity.titleZh}的材料、尺寸、单件周期和重复定位出发。当前匹配起点是 ${equipment.nameZh}，但购买前仍需核对工作区域、安全性、供货、售后与总体拥有成本。`
        : `Choose equipment from the material, size, cycle time, and repeatability required by ${opportunity.title.toLowerCase()}. The current matched starting point is ${equipment.name}, but confirm work area, safety, availability, service, and total ownership cost before buying.`,
      marker: "SETUP",
    },
  }[kind];

  return (
    <main className="seo-opportunity-page">
      <section className="seo-opportunity-hero shell">
        <div className="seo-opportunity-hero-copy">
          <p className="eyebrow">{pageCopy.eyebrow}</p>
          <h1>{pageCopy.title}</h1>
          <p className="seo-answer-first">{pageCopy.answer}</p>
          <div className="seo-topic-nav" aria-label={zh ? "本产品的商业决策页面" : "Business decision pages for this product"}>
            <Link className={kind === "idea" ? "active" : ""} href={seoPagePath("idea", opportunity.id)}>{zh ? "卖什么" : "What to sell"}</Link>
            <Link className={kind === "profit" ? "active" : ""} href={seoPagePath("profit", opportunity.id)}>{zh ? "怎么算" : "Profit model"}</Link>
            <Link className={kind === "equipment" ? "active" : ""} href={seoPagePath("equipment", opportunity.id)}>{zh ? "用什么做" : "Equipment"}</Link>
          </div>
        </div>
        <div className="seo-opportunity-visual">
          <span>{pageCopy.marker}</span>
          <Image src={assetPath(opportunity.image)} alt={zh ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 760px) 100vw, 42vw" priority />
          <div><small>{zh ? "机会评分" : "OPPORTUNITY SCORE"}</small><strong>{opportunity.score}<em>/100</em></strong></div>
        </div>
      </section>

      <section className="seo-data-strip shell" aria-label={zh ? "商业规划数据" : "Business planning data"}>
        <div><span>{zh ? "典型售价" : "TYPICAL PRICE"}</span><strong>{formatCurrency(opportunity.sellingPrice, 2)}</strong></div>
        <div><span>{zh ? "材料成本" : "MATERIAL COST"}</span><strong>{formatCurrency(opportunity.materialCost, 2)}</strong></div>
        <div className="featured"><span>{zh ? "估算单件毛利" : "EST. GROSS PROFIT"}</span><strong>{formatCurrency(opportunity.grossProfit, 2)}</strong></div>
        <div><span>{zh ? "制作时间" : "MAKE TIME"}</span><strong>{opportunity.productionMinutes} {zh ? "分钟" : "min"}</strong></div>
      </section>

      <section className="seo-decision-grid shell">
        <article className="seo-decision-main">
          {kind === "idea" ? (
            <>
              <ContentSection icon={<Target weight="bold" />} eyebrow={zh ? "目标买家" : "TARGET BUYER"} title={zh ? "先选买家，再做产品。" : "Choose the buyer before the product."}>
                <p>{zh ? profile.buyerZh : profile.buyer}</p>
                <p><strong>{zh ? "季节窗口：" : "Seasonal window: "}</strong>{zh ? profile.seasonalWindowZh : profile.seasonalWindow}</p>
              </ContentSection>
              <ListSection number="01" title={zh ? "形成差异，而不是堆更多款式" : "Differentiate without building a huge catalog"} items={zh ? profile.differentiatorsZh : profile.differentiators} />
              <ListSection number="02" title={zh ? "七天付费需求验证" : "A seven-day paid-demand test"} items={zh ? profile.validationPlanZh : profile.validationPlan} ordered />
            </>
          ) : kind === "profit" ? (
            <>
              <ContentSection icon={<Calculator weight="bold" />} eyebrow={zh ? "贡献毛利" : "CONTRIBUTION MODEL"} title={zh ? "先算能留下多少钱。" : "Start with what each order contributes."}>
                <p>{zh ? "基础公式：售价 − 材料 − 平台费 − 单件人工 − 报废与包装 = 单笔贡献毛利。页面顶部的单件毛利只扣除了材料，因此它是起点，不是最终净利润。" : "Base formula: selling price − material − selling fees − variable labor − failures and packaging = contribution per order. The gross-profit figure above subtracts material only, so it is a starting point—not net profit."}</p>
                <p>{zh ? `按当前制作时间，20 小时理论机器时间约能完成 ${unitsInTwentyHours} 件，对应材料前毛利 ${formatCurrency(twentyHourProfit, 0)}；实际结果必须再受设置、后处理和订单节奏约束。` : `At the current make time, 20 theoretical machine hours cover about ${unitsInTwentyHours} units and ${formatCurrency(twentyHourProfit, 0)} in gross profit before the remaining costs. Setup, finishing, and order flow will lower real capacity.`}</p>
              </ContentSection>
              <ListSection number="01" title={zh ? "三个必须测试的价格层级" : "Three price levels to test"} items={zh ? ["基础款：最少选项与标准交期", "主推款：个性化或组合套装", "高端款：材料升级、加急或更完整服务"] : ["Base: limited options and standard turnaround", "Popular: personalization or a useful bundle", "Premium: upgraded materials, rush service, or a complete package"]} />
              <ListSection number="02" title={zh ? "把这些成本加入模型" : "Add these costs before calling it profit"} items={zh ? ["平台与支付费用", "主动人工、改稿和客服", "报废、包装、物流与营销", "设备、维护、排烟和工作空间"] : ["Marketplace and payment fees", "Active labor, revisions, and support", "Failures, packaging, shipping, and marketing", "Equipment, maintenance, extraction, and workspace"]} />
            </>
          ) : (
            <>
              <ContentSection icon={<Factory weight="bold" />} eyebrow={zh ? "工作流程" : "WORKFLOW FIRST"} title={zh ? "让产品要求决定设备。" : "Let the product requirements choose the machine."}>
                <p>{zh ? profile.marketAngleZh : profile.marketAngle}</p>
                <p>{zh ? "先用真实样品验证材料、效果和单件周期，再比较设备。宣传参数不能替代你的工作流程测试。" : "Validate the material, finish, and cycle time with a real sample before comparing equipment. Headline specifications cannot replace a workflow test."}</p>
              </ContentSection>
              <ListSection number="01" title={zh ? "设备匹配检查点" : "Equipment-fit checkpoints"} items={zh ? profile.equipmentCriteriaZh : profile.equipmentCriteria} />
              <div className="seo-equipment-cta">
                <div><small>{zh ? "当前匹配起点" : "CURRENT MATCHED STARTING POINT"}</small><strong>{zh ? equipment.nameZh : equipment.name}</strong><p>{zh ? "基于产品与工作流程推荐；不是收益保证。" : "Matched from the product and workflow—not a guarantee of earnings."}</p></div>
                <TrackedExternalLink className="button button-primary" href={equipment.url} target="_blank" rel="noreferrer" analytics={{ placement: "seo_equipment_guide", opportunity: opportunity.id, recommendation: equipment.name, destination: "equipment" }}>{zh ? "查看匹配设备" : "View matched equipment"}<ArrowSquareOut weight="bold" /></TrackedExternalLink>
              </div>
            </>
          )}

          <aside className="seo-risk-note"><ShieldCheck weight="bold" /><div><strong>{zh ? "先检查这个风险" : "CHECK THIS RISK FIRST"}</strong><p>{zh ? profile.riskZh : profile.risk}</p></div></aside>
        </article>

        <aside className="seo-evidence-panel">
          <p className="eyebrow">{zh ? "公开市场参考" : "PUBLIC MARKET REFERENCE"}</p>
          <Storefront weight="fill" />
          <span>{marketCase.platform}</span>
          <h2>{zh ? marketCase.titleZh : marketCase.title}</h2>
          <p>{zh ? marketCase.signalZh : marketCase.signal}</p>
          <div><small>{zh ? "公开售价" : "LISTED PRICE"}</small><strong>{marketCase.price}</strong></div>
          <TrackedExternalLink className="evidence-primary" href={marketCase.sourceUrl} target="_blank" rel="noreferrer" analytics={{ placement: "seo_data_page", opportunity: opportunity.id, destination: "evidence_listing" }}>{zh ? "查看参考商品" : "View evidence listing"}<ArrowSquareOut weight="bold" /></TrackedExternalLink>
          <TrackedExternalLink className="evidence-secondary" href={marketCase.searchUrl} target="_blank" rel="noreferrer" analytics={{ placement: "seo_data_page", opportunity: opportunity.id, destination: "marketplace_search" }}>{zh ? "搜索 Etsy 同类商品" : "Search similar on Etsy"}<MagnifyingGlass weight="bold" /></TrackedExternalLink>
          <p className="seo-evidence-note">{zh ? "这是精选参考案例，不是畅销榜排名。平台数据会变化，不代表需求或收益承诺。" : "This is a selected reference example, not a bestseller ranking. Marketplace signals change and do not guarantee demand or earnings."}</p>
          <TrackedExternalLink className="seo-source-link" href={etsyTrendReport} target="_blank" rel="noreferrer" analytics={{ placement: "seo_data_page", opportunity: opportunity.id, destination: "etsy_trend_report" }}>{zh ? "阅读 Etsy 官方趋势报告" : "Read Etsy’s official trend report"}<ArrowSquareOut weight="bold" /></TrackedExternalLink>
        </aside>
      </section>

      <section className="seo-faq shell">
        <header><p className="eyebrow">{zh ? "清楚回答" : "DIRECT ANSWERS"}</p><h2>{zh ? "常见问题" : "Frequently asked questions"}</h2></header>
        <div>{faq.map((item) => <article key={item.question}><h3>{zh ? item.questionZh : item.question}</h3><p>{zh ? item.answerZh : item.answer}</p></article>)}</div>
      </section>

      <section className="seo-next-path shell">
        <div><p className="eyebrow">{zh ? "下一步" : "NEXT STEP"}</p><h2>{zh ? "把公开参考换成你自己的数字。" : "Replace the public reference with your own numbers."}</h2></div>
        <Link className="button button-primary" href={`/calculator/laser-roi?product=${opportunity.id}`}>{zh ? "免费测算这个产品" : "Run the free profit model"}<ArrowRight weight="bold" /></Link>
        <Link className="button button-ghost" href="/opportunities">{zh ? "寻找更多机会" : "Find more opportunities"}</Link>
      </section>
    </main>
  );
}

function ContentSection({ icon, eyebrow, title, children }: { icon: ReactNode; eyebrow: string; title: string; children: ReactNode }) {
  return <section className="seo-content-section"><div className="seo-content-heading">{icon}<div><p>{eyebrow}</p><h2>{title}</h2></div></div><div className="seo-content-body">{children}</div></section>;
}

function ListSection({ number, title, items, ordered = false }: { number: string; title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return <section className="seo-list-section"><span>{number}</span><div><h2>{title}</h2><List>{items.map((item) => <li key={item}><CheckCircle weight="fill" />{item}</li>)}</List></div></section>;
}
