"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowSquareOut, Calculator, CheckCircle, Hammer, MagnifyingGlass, ShoppingCartSimple, Storefront, Target } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { opportunities } from "@/lib/opportunities/data";
import { OpportunityCard } from "@/components/marketing/opportunity-card";
import { OpportunityRadar } from "@/components/marketing/opportunity-radar";
import { assetPath } from "@/lib/site";
import { formatCurrency } from "@/lib/format";
import { marketCaseByOpportunity } from "@/lib/opportunities/market-cases";

const copy = {
  en: {
    eyebrow: "Maker opportunity intelligence",
    heroA: "Choose your next",
    heroB: "winning product.",
    sub: "Compare real maker opportunities by demand, margin, competition and production fit.",
    find: "Find my opportunity",
    calculate: "Calculate a product",
    selected: "Selected opportunity",
    nextMission: "Next mission: validate the business",
    profit: "Est. gross profit / item",
    calculateSelected: "Calculate this product",
    compareAll: "Compare all opportunities",
    marketCase: "Real marketplace example",
    publicSignal: "Public market signal",
    checked: "Checked",
    viewSource: "View live listing",
    marketNote: "Marketplace signals change over time and do not guarantee demand or earnings.",
    path: "Your game path",
    steps: [
      ["Discover", "Find high-potential products."],
      ["Validate", "Confirm demand and profit potential."],
      ["Build", "Make it efficiently and consistently."],
      ["Sell", "List, market, and scale with confidence."],
    ],
    level: "Level 01",
    maker: "Beginner maker",
    xp: "250 / 1,000 XP",
    progress: "Complete steps to earn XP and level up.",
    toolkit: "Your maker business toolkit",
    toolkitSub: "Start with the decision you need to make today.",
    tools: [
      ["Product opportunity finder", "Rank products by business fit before you invest.", "/opportunities"],
      ["Product ROI calculator", "Test laser or 3D-printing margin, capacity, and payback using your numbers.", "/calculator/laser-roi"],
      ["Maker equipment finder", "Choose a making path, then match business needs to an equipment category.", "/calculator/machine-finder"],
    ],
    estimates: "Opportunity scores and profit figures are directional estimates. Validate demand with small tests before investing.",
    catalog: "6 market-tested starting ideas",
    catalogSub: "Swipe horizontally, then select any card to see its proof and continue into a method-aware ROI check.",
  },
  zh: {
    eyebrow: "Maker 商业机会情报",
    heroA: "选择你的下一个",
    heroB: "畅销产品。",
    sub: "从需求、利润、竞争和生产适配度比较真实的 Maker 产品机会。",
    find: "寻找我的机会",
    calculate: "计算一个产品",
    selected: "已选机会",
    nextMission: "下一项任务：验证商业模型",
    profit: "预计单件毛利",
    calculateSelected: "计算这个产品",
    compareAll: "查看全部机会",
    marketCase: "真实电商案例",
    publicSignal: "公开市场信号",
    checked: "核验日期",
    viewSource: "查看在售商品",
    marketNote: "平台数据会随时间变化，仅用于市场参考，不代表需求或收益承诺。",
    path: "你的游戏路径",
    steps: [
      ["发现", "寻找高潜力产品。"],
      ["验证", "确认需求与利润空间。"],
      ["生产", "稳定、高效地制造。"],
      ["销售", "上架、营销并扩大规模。"],
    ],
    level: "等级 01",
    maker: "新手 Maker",
    xp: "250 / 1,000 XP",
    progress: "完成任务获取 XP 并升级。",
    toolkit: "你的 Maker 商业工具箱",
    toolkitSub: "从今天最需要做出的决定开始。",
    tools: [
      ["产品机会发现器", "在投资前按商业适配度给产品排序。", "/opportunities"],
      ["产品 ROI 计算器", "分别用激光或 3D 打印逻辑测试利润、产能和回本周期。", "/calculator/laser-roi"],
      ["Maker 设备匹配器", "先选择制造方式，再把业务需求匹配到设备类别。", "/calculator/machine-finder"],
    ],
    estimates: "机会评分与利润数字均为方向性估算。投资前请先用小批量测试验证需求。",
    catalog: "6 个经过市场信号验证的起步方向",
    catalogSub: "左右滑动浏览，选择任一卡片查看市场证据，并继续进入对应制造方式的 ROI 测算。",
  },
};

const stepIcons = [Target, MagnifyingGlass, Hammer, ShoppingCartSimple];

export function HomeExperience() {
  const { locale } = useLanguage();
  const [selected, setSelected] = useState(opportunities[0]);
  const [carouselEdges, setCarouselEdges] = useState({ atStart: true, atEnd: false });
  const carouselRef = useRef<HTMLDivElement>(null);
  const t = copy[locale];
  const marketCase = marketCaseByOpportunity[selected.id];

  const updateCarouselEdges = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const atStart = carousel.scrollLeft <= 2;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
    setCarouselEdges((current) => current.atStart === atStart && current.atEnd === atEnd ? current : { atStart, atEnd });
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateCarouselEdges();
    const resizeObserver = new ResizeObserver(updateCarouselEdges);
    resizeObserver.observe(carousel);
    carousel.addEventListener("scroll", updateCarouselEdges, { passive: true });

    return () => {
      resizeObserver.disconnect();
      carousel.removeEventListener("scroll", updateCarouselEdges);
    };
  }, [updateCarouselEdges]);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector<HTMLElement>(".opportunity-card");
    if (!carousel || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 16;
    const cardsPerMove = window.innerWidth > 1100 ? 2 : 1;
    carousel.scrollBy({ left: direction * (firstCard.offsetWidth + gap) * cardsPerMove, behavior: "smooth" });
  };

  return (
    <main>
      <section className="hero-section shell">
        <Image className="hero-racing-stripe" src={assetPath("/images/racing-header-stripe.png")} alt="" width={709} height={38} aria-hidden="true" priority />
        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.heroA}<br /><em>{t.heroB}</em></h1>
          <div className="speed-stripe" aria-hidden="true" />
          <p className="hero-sub">{t.sub}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/opportunities">{t.find}<ArrowRight weight="bold" /></Link>
            <Link className="button button-ghost" href="/calculator/laser-roi">{t.calculate}<Calculator weight="bold" /></Link>
          </div>
        </div>
        <OpportunityRadar opportunity={selected} />
      </section>

      <section className="opportunity-showcase shell" aria-label={locale === "zh" ? "精选 Maker 产品机会" : "Featured maker opportunities"}>
        <div className="opportunity-catalog-heading">
          <span>{t.catalog}</span>
          <p>{t.catalogSub}</p>
        </div>
        <div className="opportunity-carousel">
          <button className="carousel-control carousel-control-prev" type="button" onClick={() => moveCarousel(-1)} disabled={carouselEdges.atStart} aria-label={locale === "zh" ? "查看上一组产品机会" : "View previous product opportunities"} aria-controls="opportunity-carousel-track">
            <ArrowLeft weight="bold" aria-hidden="true" />
          </button>
          <div ref={carouselRef} id="opportunity-carousel-track" className="opportunity-grid" tabIndex={0} aria-label={locale === "zh" ? "横向滑动浏览 6 个产品机会" : "Swipe horizontally through 6 product opportunities"}>
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} active={selected.id === opportunity.id} onSelect={() => setSelected(opportunity)} />
            ))}
          </div>
          <button className="carousel-control carousel-control-next" type="button" onClick={() => moveCarousel(1)} disabled={carouselEdges.atEnd} aria-label={locale === "zh" ? "查看下一组产品机会" : "View next product opportunities"} aria-controls="opportunity-carousel-track">
            <ArrowRight weight="bold" aria-hidden="true" />
          </button>
        </div>
        <div className="opportunity-next-step" key={selected.id} aria-live="polite">
          <div className="selection-rank"><span>{t.selected}</span><strong>#{String(selected.rank).padStart(2, "0")}</strong></div>
          <div className="selection-copy">
            <small>{t.nextMission}</small>
            <h2>{locale === "zh" ? selected.titleZh : selected.title}</h2>
            <p>{locale === "zh" ? selected.evidenceZh : selected.evidence}</p>
          </div>
          <div className="selection-profit"><span>{t.profit}</span><strong>{formatCurrency(selected.grossProfit, 2)}</strong></div>
          <div className="selection-actions">
            <Link className="button button-primary" href={`/calculator/laser-roi?product=${selected.id}`}>{t.calculateSelected}<Calculator weight="bold" /></Link>
            <Link className="selection-more" href="/opportunities">{t.compareAll}<ArrowRight weight="bold" /></Link>
          </div>
        </div>
        <article className="market-proof" key={`market-${selected.id}`} aria-live="polite">
          <div className="market-proof-label">
            <Storefront weight="fill" />
            <span>{t.marketCase}</span>
            <strong>{marketCase.platform}</strong>
          </div>
          <div className="market-proof-case">
            <small>{t.publicSignal}</small>
            <h3>{locale === "zh" ? marketCase.titleZh : marketCase.title}</h3>
            <p>{locale === "zh" ? marketCase.signalZh : marketCase.signal}</p>
          </div>
          {marketCase.price ? <div className="market-proof-price"><span>{locale === "zh" ? "公开售价" : "LISTED PRICE"}</span><strong>{marketCase.price}</strong></div> : null}
          <div className="market-proof-source">
            <a href={marketCase.sourceUrl} target="_blank" rel="noreferrer">{t.viewSource}<ArrowSquareOut weight="bold" /></a>
            <span>{t.checked}: {marketCase.checkedAt}</span>
          </div>
          <p className="market-proof-note">{t.marketNote}</p>
        </article>
      </section>

      <section className="game-path-section">
        <div className="shell game-path-grid">
          <div className="path-flag"><span>{t.path}</span></div>
          <ol className="game-steps">
            {t.steps.map(([title, description], index) => {
              const Icon = stepIcons[index];
              return (
                <li key={title} className={index === 0 ? "active" : ""}>
                  <span className="step-number">{index + 1}</span>
                  <Icon weight="bold" />
                  <strong>{title}</strong>
                  <small>{description}</small>
                </li>
              );
            })}
          </ol>
          <div className="level-panel">
            <CheckCircle weight="fill" />
            <div><strong>{t.level}</strong><span>{t.maker}</span></div>
            <div className="xp-bar"><span /></div>
            <b>{t.xp}</b>
            <small>{t.progress}</small>
          </div>
        </div>
      </section>

      <section className="toolkit-section shell">
        <p className="eyebrow">{locale === "zh" ? "02 / 制定你的计划" : "02 / BUILD YOUR PLAN"}</p>
        <div className="section-heading">
          <h2>{t.toolkit}</h2>
          <p>{t.toolkitSub}</p>
        </div>
        <div className="tool-rows">
          {t.tools.map(([title, description, href], index) => (
            <Link href={href} key={href}>
              <span>0{index + 1}</span>
              <strong>{title}</strong>
              <p>{description}</p>
              <ArrowRight weight="bold" />
            </Link>
          ))}
        </div>
        <p className="estimate-note">{t.estimates}</p>
      </section>
    </main>
  );
}
