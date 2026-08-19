"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Cube, Hammer, Sparkle, Target, TShirt } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { rankOpportunities, type OpportunityAnswers } from "@/lib/opportunities/engine";
import { formatCurrency } from "@/lib/format";
import { trackEvent } from "@/lib/analytics/client";
import { EmailCapture } from "@/components/results/email-capture";
import { EstimateDisclaimer } from "@/components/results/estimate-disclaimer";
import { assetPath } from "@/lib/site";

const initial: OpportunityAnswers = {
  interests: [],
  method: "not-sure",
  budget: "500-3k",
  hoursPerWeek: "5-15",
  goal: "first-sale",
};

const copy = {
  en: {
    title: "Opportunity Quest",
    intro: "Five choices. A ranked maker business path built around your reality.",
    questions: ["What kind of products interest you?", "How do you want to make?", "What is your starting budget?", "How much time can you commit?", "What is your next business goal?"],
    interests: [["personalized", "Personalized gifts"], ["home", "Home & desk"], ["weddings", "Weddings & events"], ["functional", "Useful products"], ["local", "Local business"], ["premium", "Premium custom work"]],
    methods: [["laser", "Laser making"], ["3d-printing", "3D printing"], ["heat-press", "Heat press & transfer"], ["not-sure", "Help me choose"]],
    budgets: [["under-500", "Under $500"], ["500-3k", "$500–$3K"], ["3-8k", "$3K–$8K"], ["8k+", "$8K+"]],
    time: [["under-5", "Under 5 hours / week"], ["5-15", "5–15 hours / week"], ["15-30", "15–30 hours / week"], ["30+", "30+ hours / week"]],
    goals: [["first-sale", "Make my first sale"], ["side-income", "Build side income"], ["scale", "Scale production"]],
    next: "Next choice",
    back: "Back",
    reveal: "Reveal my path",
    resultTitle: "Your ranked maker path",
    resultSub: "Start with the top opportunity, then validate demand before buying more equipment.",
    restart: "Run a new quest",
    calculator: "Calculate this product",
    equipment: "Match equipment",
    match: "Match score",
    why: "Why it fits",
    xp: "+100 XP — Opportunity path complete",
    level: "LEVEL 01 / DISCOVER",
    gross: "GROSS PROFIT",
    makeTime: "MAKE TIME",
    minute: "min",
  },
  zh: {
    title: "机会探索任务",
    intro: "完成五个选择，获得符合你现实条件的 Maker 商业路径。",
    questions: ["你对哪类产品感兴趣？", "你希望用什么方式制作？", "你的启动预算是多少？", "每周能投入多少时间？", "你的下一个商业目标是什么？"],
    interests: [["personalized", "个性化礼品"], ["home", "家居与桌面"], ["weddings", "婚礼与活动"], ["functional", "实用产品"], ["local", "本地商家"], ["premium", "高端定制"]],
    methods: [["laser", "激光制作"], ["3d-printing", "3D 打印"], ["heat-press", "热压转印"], ["not-sure", "帮我选择"]],
    budgets: [["under-500", "低于 $500"], ["500-3k", "$500–$3K"], ["3-8k", "$3K–$8K"], ["8k+", "$8K+"]],
    time: [["under-5", "每周少于 5 小时"], ["5-15", "每周 5–15 小时"], ["15-30", "每周 15–30 小时"], ["30+", "每周 30 小时以上"]],
    goals: [["first-sale", "完成第一单"], ["side-income", "建立副业收入"], ["scale", "扩大生产"]],
    next: "下一个选择",
    back: "返回",
    reveal: "揭晓我的路径",
    resultTitle: "你的 Maker 商业路径",
    resultSub: "从第一名机会开始，先验证需求，再追加设备投资。",
    restart: "重新探索",
    calculator: "计算这个产品",
    equipment: "匹配生产设备",
    match: "匹配分",
    why: "为什么适合",
    xp: "+100 XP — 已完成机会路径",
    level: "等级 01 / 发现",
    gross: "单件毛利",
    makeTime: "制作时间",
    minute: "分钟",
  },
};

export function OpportunityFinder() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initial);
  const [complete, setComplete] = useState(false);
  const results = useMemo(() => rankOpportunities(answers), [answers]);

  const options = [t.interests, t.methods, t.budgets, t.time, t.goals][step];
  const currentValue = [answers.interests, answers.method, answers.budget, answers.hoursPerWeek, answers.goal][step];

  function choose(value: string) {
    if (step === 0) {
      setAnswers((current) => ({ ...current, interests: current.interests.includes(value) ? current.interests.filter((item) => item !== value) : [...current.interests, value].slice(-3) }));
    } else if (step === 1) setAnswers((current) => ({ ...current, method: value as OpportunityAnswers["method"] }));
    else if (step === 2) setAnswers((current) => ({ ...current, budget: value as OpportunityAnswers["budget"] }));
    else if (step === 3) setAnswers((current) => ({ ...current, hoursPerWeek: value as OpportunityAnswers["hoursPerWeek"] }));
    else setAnswers((current) => ({ ...current, goal: value as OpportunityAnswers["goal"] }));
  }

  async function advance() {
    if (step < 4) {
      await trackEvent("calculator_step_completed", { tool: "opportunity_finder", step: step + 1 });
      setStep((value) => value + 1);
      return;
    }
    setComplete(true);
    await trackEvent("opportunity_finder_complete", { tool: "opportunity_finder", recommendation: results[0].id, business_stage: answers.goal, category: answers.method });
  }

  if (complete) {
    return (
      <section className="finder-results shell">
        <div className="result-intro"><p className="eyebrow">{t.xp}</p><h2>{t.resultTitle}</h2><p>{t.resultSub}</p></div>
        <div className="ranked-results">
          {results.map((item, index) => (
            <article key={item.id} className={index === 0 ? "ranked-item top" : "ranked-item"}>
              <span className="result-rank">#{index + 1}</span>
              <div className="result-image"><Image src={assetPath(item.image)} alt={locale === "zh" ? item.titleZh : item.title} fill sizes="240px" /></div>
              <div className="result-copy">
                <span className="card-category">{item.category === "laser" ? <Sparkle weight="bold" /> : item.category === "3d-printing" ? <Cube weight="bold" /> : <TShirt weight="bold" />}{locale === "zh" ? item.processZh : item.process}</span>
                <h3>{locale === "zh" ? item.titleZh : item.title}</h3>
                <div className="result-metrics"><span><small>{t.match}</small><b>{item.matchScore}/100</b></span><span><small>{t.gross}</small><b>{formatCurrency(item.grossProfit, 2)}</b></span><span><small>{t.makeTime}</small><b>{item.productionMinutes} {t.minute}</b></span></div>
                <h4>{t.why}</h4>
                <ul>{(locale === "zh" ? item.matchReasonsZh : item.matchReasons).map((reason) => <li key={reason}><Check weight="bold" />{reason}</li>)}</ul>
                <div className="result-cta-row">
                  <Link className="button button-ghost" href={`/calculator/laser-roi?product=${item.id}`}>{t.calculator}<ArrowRight weight="bold" /></Link>
                  <Link className="result-equipment-link" href={`/calculator/machine-finder?method=${item.category}&product=${item.id}`}>{t.equipment}<Hammer weight="bold" /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="result-actions"><button className="button button-ghost" onClick={() => { setComplete(false); setStep(0); }}>{t.restart}</button></div>
        <EmailCapture tool="opportunity_finder" result={results[0].id} />
        <EstimateDisclaimer />
      </section>
    );
  }

  return (
    <section className="finder-shell shell">
      <aside className="quest-sidebar">
        <Target weight="bold" />
        <p>{t.title}</p>
        <strong>{String(step + 1).padStart(2, "0")} / 05</strong>
        <div className="quest-progress"><span style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>
        <small>{t.intro}</small>
      </aside>
      <div className="quest-question">
        <p className="eyebrow">{t.level}</p>
        <h2>{t.questions[step]}</h2>
        <div className="choice-grid">
          {options.map(([value, label]) => {
            const selected = Array.isArray(currentValue) ? currentValue.includes(value) : currentValue === value;
            return <button key={value} className={selected ? "choice-card selected" : "choice-card"} onClick={() => choose(value)}><span>{selected ? <Check weight="bold" /> : null}</span><strong>{label}</strong></button>;
          })}
        </div>
        <div className="quest-nav">
          <button className="button button-ghost" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft weight="bold" />{t.back}</button>
          <button className="button button-primary" onClick={advance} disabled={step === 0 && answers.interests.length === 0}>{step === 4 ? t.reveal : t.next}<ArrowRight weight="bold" /></button>
        </div>
      </div>
    </section>
  );
}
