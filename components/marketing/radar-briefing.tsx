"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calculator, CalendarDots, CheckCircle, ClockCounterClockwise, Factory, Pulse, ShieldCheck, Target } from "@phosphor-icons/react";

import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/format";
import type { RadarArchiveSummary } from "@/lib/operations/radar-archive";
import { getActiveRadarBriefing, getRadarBriefing, type OperationsState } from "@/lib/operations/radar";
import { assetPath } from "@/lib/site";

export function RadarBriefing({ state, archiveItems = [] }: { state?: OperationsState; archiveItems?: RadarArchiveSummary[] }) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const briefing = state ? getRadarBriefing(state, `/radar/${state.lastRunDate}`) : getActiveRadarBriefing();
  const { opportunity, profile, daily, links, marginRate } = briefing;
  const archived = Boolean(state);

  return (
    <main className="operations-radar-page">
      <section className="operations-radar-hero shell">
        <div className="operations-radar-copy">
          <p className="eyebrow">{zh ? "MAKER 商机雷达" : "MAKER OPPORTUNITY RADAR"}</p>
          <p className="operations-cadence">{zh ? "每周聚焦一个产品，每天推进一步验证。" : "One product each week. One validation step each day."}</p>
          <div className="operations-live-status"><Pulse weight="fill" /><span>{archived ? (zh ? "当日验证任务" : "DAILY TASK ARCHIVE") : (zh ? "今日验证任务 · 每日更新" : "TODAY’S TASK · UPDATED DAILY")}</span><time dateTime={briefing.state.lastRunDate}>{briefing.state.lastRunDate}</time></div>
          <h1>{zh ? daily.headlineZh : daily.headline}</h1>
          <p>{zh ? daily.answerZh : daily.answer}</p>
          <div className="operations-radar-actions">
            <Link className="button button-primary" href={links.calculator}>{zh ? "免费测算这个产品" : "Run the free profit model"}<Calculator weight="bold" /></Link>
            <Link className="button button-ghost" href={links.idea}>{zh ? "查看完整商业指南" : "Open the full business guide"}<ArrowRight weight="bold" /></Link>
          </div>
        </div>
        <div className="operations-radar-image">
          <Image src={assetPath(opportunity.image)} alt={zh ? opportunity.titleZh : opportunity.title} fill sizes="(max-width: 760px) 100vw, 42vw" priority />
          <span>{zh ? daily.labelZh : daily.label}</span>
          <div><small>{archived ? (zh ? "当周产品" : "THAT WEEK’S PRODUCT") : (zh ? "本周产品" : "THIS WEEK’S PRODUCT")}</small><strong>#{String(opportunity.rank).padStart(2, "0")}</strong></div>
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
          <header><Target weight="bold" /><div><p>{archived ? (zh ? "当日验证行动" : "VALIDATION ACTION FOR THAT DAY") : (zh ? "今日验证行动" : "TODAY’S VALIDATION ACTION")}</p><h2>{zh ? "把信号变成真实证据。" : "Turn the signal into evidence."}</h2></div></header>
          <p>{zh ? daily.actionZh : daily.action}</p>
          <div className="operations-estimate-note"><ShieldCheck weight="bold" /><span>{zh ? "页面数字是规划估算，不是需求或收益承诺。单件毛利尚未扣除平台费、人工、报废、包装、物流、税费和营销。" : "Planning estimates—not a demand or earnings guarantee. Gross profit does not yet subtract selling fees, labor, failures, packaging, shipping, tax, or marketing."}</span></div>
        </article>

        <aside className="operations-week-panel">
          <CalendarDots weight="bold" />
          <p>{archived ? (zh ? "当周研究的产品" : "THAT WEEK’S PRODUCT") : (zh ? "本周研究的产品" : "THIS WEEK’S PRODUCT")}</p>
          <h2>{zh ? opportunity.titleZh : opportunity.title}</h2>
          <span>{zh ? profile.seasonalWindowZh : profile.seasonalWindow}</span>
          <small>{zh ? `研究周起始：${briefing.state.weekStarted}` : `Research week started: ${briefing.state.weekStarted}`}</small>
          <p className="operations-week-explainer">{zh ? "每周一切换研究产品，周内依次查看需求、定价、付费验证、生产、设备、风险与复盘。" : "A new product every Monday. Work through demand, pricing, paid validation, production, equipment, risk and review during the week."}</p>
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

      {archiveItems.length ? <RadarArchive key={briefing.state.lastRunDate} archiveItems={archiveItems} zh={zh} /> : null}
    </main>
  );
}

const ARCHIVE_PAGE_SIZE = 10;

function RadarArchive({ archiveItems, zh }: { archiveItems: RadarArchiveSummary[]; zh: boolean }) {
  const [page, setPage] = useState(1);
  const archiveRef = useRef<HTMLElement>(null);
  const pageCount = Math.ceil(archiveItems.length / ARCHIVE_PAGE_SIZE);
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * ARCHIVE_PAGE_SIZE;
  const pageItems = archiveItems.slice(start, start + ARCHIVE_PAGE_SIZE);

  function changePage(nextPage: number) {
    setPage(Math.max(1, Math.min(pageCount, nextPage)));
    requestAnimationFrame(() => {
      archiveRef.current?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      archiveRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  return (
    <section className="operations-archive shell" aria-labelledby="radar-archive-title" ref={archiveRef}>
      <header>
        <div><p className="eyebrow">{zh ? "往期验证记录" : "DAILY VALIDATION ARCHIVE"}</p><h2 id="radar-archive-title" tabIndex={-1}>{zh ? "回看每天的判断与行动。" : "Revisit each day’s decision and next step."}</h2></div>
        <p>{zh ? "同一周围绕同一个产品展开，每天保留当日分析、测算假设与验证任务。每页显示 10 条记录。" : "Each week follows one product. Revisit its daily analysis, planning assumptions and validation tasks, with 10 entries per page."}</p>
      </header>
      <div className="operations-archive-list" id="radar-archive-list">
        {pageItems.map((item) => (
          <Link href={item.href} key={item.date} className="operations-archive-card">
            <div><ClockCounterClockwise weight="bold" /><time dateTime={item.date}>{item.date}</time><span>{zh ? item.labelZh : item.label}</span></div>
            <h3>{zh ? item.titleZh : item.title}</h3>
            <p>{zh ? item.answerZh : item.answer}</p>
            <footer><span>{zh ? `机会评分 ${item.score}/100` : `Opportunity score ${item.score}/100`}</span><strong>{zh ? "查看当天雷达" : "Open daily radar"}<ArrowUpRight weight="bold" /></strong></footer>
          </Link>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="operations-archive-pagination" aria-label={zh ? "往期雷达分页" : "Radar archive pagination"}>
          <p role="status">{zh ? `第 ${start + 1}–${start + pageItems.length} 条，共 ${archiveItems.length} 条` : `${start + 1}–${start + pageItems.length} of ${archiveItems.length} entries`}</p>
          <div>
            <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} aria-controls="radar-archive-list">{zh ? "上一页" : "Previous"}</button>
            <label>
              <span className="archive-page-label">{zh ? "跳转页码" : "Go to page"}</span>
              <select value={currentPage} onChange={(event) => changePage(Number(event.target.value))} aria-controls="radar-archive-list">
                {Array.from({ length: pageCount }, (_, index) => <option key={index + 1} value={index + 1}>{zh ? `第 ${index + 1} / ${pageCount} 页` : `Page ${index + 1} of ${pageCount}`}</option>)}
              </select>
            </label>
            <button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} aria-controls="radar-archive-list">{zh ? "下一页" : "Next"}</button>
          </div>
        </nav>
      )}
    </section>
  );
}
