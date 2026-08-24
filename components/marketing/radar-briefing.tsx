"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, CalendarDots, CheckCircle, Factory, Pulse, ShieldCheck, Target } from "@phosphor-icons/react";

import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import { getActiveRadarBriefing } from "@/lib/operations/radar";
import { assetPath } from "@/lib/site";

export function RadarBriefing() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const { state, opportunity, profile, daily, links, marginRate } = getActiveRadarBriefing();

  return (
    <main className="operations-radar-page">
      <section className="operations-radar-hero shell">
        <div className="operations-radar-copy">
          <p className="eyebrow">{zh ? "今日 MAKER 信号" : "TODAY’S MAKER SIGNAL"}</p>
          <div className="operations-live-status"><Pulse weight="fill" /><span>{zh ? "每日更新" : "UPDATED DAILY"}</span><time dateTime={state.lastRunDate}>{state.lastRunDate}</time></div>
          <h1>{zh ? daily.headlineZh : daily.headline}</h1>
          <p>{zh ? daily.answerZh : daily.answer}</p>
          <div className="operations-radar-actions">
            <Link className="button button-primary" href={links.calculator}>{zh ? "免费测算这个产品" : "Run the free profit model"}<Calculator weight="bold" /></Link>
            <Link className="button button-ghost" href={links.idea}>{zh ? "查看完整商业指南" : "Open the full business guide"}<ArrowRight weight="bold" /></Link>
          </div>
        </div>
        <div className="operations-radar-image">
          <Image src={assetPath(opportunity.image)} alt={zh ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 760px) 100vw, 42vw" priority />
          <span>{daily.label}</span>
          <div><small>{zh ? "本周机会" : "THIS WEEK"}</small><strong>#{String(opportunity.rank).padStart(2, "0")}</strong></div>
        </div>
      </section>

      <section className="operations-score-strip shell" aria-label={zh ? "当前产品规划数据" : "Current product planning data"}>
        <div><span>{zh ? "机会评分" : "OPPORTUNITY SCORE"}</span><strong>{opportunity.score}<small>/100</small></strong></div>
        <div><span>{zh ? "典型售价" : "TYPICAL PRICE"}</span><strong>{formatCurrency(opportunity.sellingPrice, 2)}</strong></div>
        <div className="featured"><span>{zh ? "估算单件毛利" : "EST. GROSS PROFIT"}</span><strong>{formatCurrency(opportunity.grossProfit, 2)}</strong></div>
        <div><span>{zh ? "材料后毛利率" : "MATERIAL-ONLY MARGIN"}</span><strong>{marginRate}%</strong></div>
      </section>

      <section className="operations-radar-grid shell">
        <article className="operations-daily-mission">
          <header><Target weight="bold" /><div><p>{zh ? "今天只做这一件事" : "ONE ACTION FOR TODAY"}</p><h2>{zh ? "把信号变成真实证据。" : "Turn the signal into evidence."}</h2></div></header>
          <p>{zh ? daily.actionZh : daily.action}</p>
          <div className="operations-estimate-note"><ShieldCheck weight="bold" /><span>{zh ? "页面数字是规划估算，不是需求或收益承诺。单件毛利尚未扣除平台费、人工、报废、包装、物流、税费和营销。" : "Planning estimates—not a demand or earnings guarantee. Gross profit does not yet subtract selling fees, labor, failures, packaging, shipping, tax, or marketing."}</span></div>
        </article>

        <aside className="operations-week-panel">
          <CalendarDots weight="bold" />
          <p>{zh ? "本周机会" : "WEEKLY OPPORTUNITY"}</p>
          <h2>{zh ? opportunity.titleZh : opportunity.title}</h2>
          <span>{zh ? profile.seasonalWindowZh : profile.seasonalWindow}</span>
          <small>{zh ? `本周起始：${state.weekStarted}` : `Week started: ${state.weekStarted}`}</small>
        </aside>
      </section>

      <section className="operations-validation shell">
        <header><p className="eyebrow">{zh ? "7 天小步验证" : "SEVEN-DAY VALIDATION"}</p><h2>{zh ? "不靠点赞，靠付费信号。" : "Paid signals—not likes."}</h2></header>
        <div>{(zh ? profile.validationPlanZh : profile.validationPlan).map((step, index) => <article key={step}><span>0{index + 1}</span><CheckCircle weight="fill" /><p>{step}</p></article>)}</div>
      </section>

      <section className="operations-next shell">
        <Factory weight="bold" />
        <div><p className="eyebrow">{zh ? "自动运营路径" : "AUTOMATED OPERATING PATH"}</p><h2>{zh ? "先验证产品，再决定设备。" : "Prove the product, then choose equipment."}</h2></div>
        <Link href={links.profit}>{zh ? "查看利润模型" : "View profit model"}<ArrowRight weight="bold" /></Link>
        <Link href={links.equipment}>{zh ? "查看设备路径" : "View equipment path"}<ArrowRight weight="bold" /></Link>
      </section>
    </main>
  );
}
