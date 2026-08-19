"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calculator, CheckCircle, Hammer, MagnifyingGlass, ShoppingCartSimple, Target } from "@phosphor-icons/react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { opportunities } from "@/lib/opportunities/data";
import { OpportunityCard } from "@/components/marketing/opportunity-card";
import { OpportunityRadar } from "@/components/marketing/opportunity-radar";
import { assetPath } from "@/lib/site";

const copy = {
  en: {
    eyebrow: "Maker opportunity intelligence",
    heroA: "Choose your next",
    heroB: "winning product.",
    sub: "Compare real maker opportunities by demand, margin, competition and production fit.",
    find: "Find my opportunity",
    calculate: "Calculate a product",
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
      ["Laser ROI calculator", "Test margin, capacity, and payback using your numbers.", "/calculator/laser-roi"],
      ["Machine finder", "Match business needs to equipment with explainable rules.", "/calculator/machine-finder"],
    ],
    estimates: "Opportunity scores and profit figures are directional estimates. Validate demand with small tests before investing.",
  },
  zh: {
    eyebrow: "Maker 商业机会情报",
    heroA: "选择你的下一个",
    heroB: "畅销产品。",
    sub: "从需求、利润、竞争和生产适配度比较真实的 Maker 产品机会。",
    find: "寻找我的机会",
    calculate: "计算一个产品",
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
      ["激光 ROI 计算器", "用你的真实数字测试利润、产能和回本周期。", "/calculator/laser-roi"],
      ["设备匹配器", "用可解释规则把业务需求匹配到设备。", "/calculator/machine-finder"],
    ],
    estimates: "机会评分与利润数字均为方向性估算。投资前请先用小批量测试验证需求。",
  },
};

const stepIcons = [Target, MagnifyingGlass, Hammer, ShoppingCartSimple];

export function HomeExperience() {
  const { locale } = useLanguage();
  const [selected, setSelected] = useState(opportunities[0]);
  const t = copy[locale];

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

      <section className="opportunity-grid shell" aria-label={locale === "zh" ? "精选 Maker 产品机会" : "Featured maker opportunities"}>
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} active={selected.id === opportunity.id} onSelect={() => setSelected(opportunity)} />
        ))}
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
