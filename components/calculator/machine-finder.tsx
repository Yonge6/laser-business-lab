"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Info, Target, Trophy } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { recommendMachines, type BudgetRange, type Experience, type FinderAnswers, type ProductionVolume } from "@/lib/recommendation/engine";
import { formatCurrency } from "@/lib/format";
import { TrackedMachineLink } from "@/components/results/tracked-machine-link";
import { EstimateDisclaimer } from "@/components/results/estimate-disclaimer";
import { EmailCapture } from "@/components/results/email-capture";
import { trackEvent } from "@/lib/analytics/client";

const initial: FinderAnswers = { products: [], priorities: [], volume: "10-30", budget: "5-8", experience: "growing" };

const copy = {
  en: {
    title: "Machine Match Quest",
    questions: ["What do you want to make?", "What matters most?", "How many jobs do you expect?", "What is your budget?", "Where are you in your maker journey?"],
    products: [["tumblers", "Tumblers"], ["acrylic", "Acrylic"], ["wood", "Wood"], ["leather", "Leather"], ["signs", "Signs"], ["awards", "Awards"], ["gifts", "Gifts"], ["large-format products", "Large-format"], ["production runs", "Production runs"]],
    priorities: [["speed", "Speed"], ["fine detail", "Fine detail"], ["easy setup", "Easy setup"], ["high-volume production", "High volume"], ["large work area", "Large work area"], ["drinkware", "Drinkware"], ["versatility", "Versatility"], ["lower upfront investment", "Lower investment"]],
    volumes: [["occasional", "Occasional"], ["1-10", "1–10 / day"], ["10-30", "10–30 / day"], ["30-100", "30–100 / day"], ["100+", "100+ / day"]],
    budgets: [["under-3", "Under $3K"], ["3-5", "$3K–5K"], ["5-8", "$5K–8K"], ["8-15", "$8K–15K"], ["15+", "$15K+"]],
    experience: [["first", "First laser"], ["beginner", "Beginner"], ["growing", "Growing business"], ["professional", "Professional shop"], ["production", "Production business"]],
    next: "Next match signal",
    back: "Back",
    reveal: "Reveal my match",
    best: "Your best match",
    alt: "Strong alternative",
    why: "Why this matches",
    see: "See on OneLaser",
    currentPrice: "Current starting price checked Aug 19, 2026",
    disclosure: "Recommendation is based on your selected use cases and our deterministic rules—not a paid ranking.",
    restart: "Change my answers",
  },
  zh: {
    title: "设备匹配任务",
    questions: ["你想制作什么？", "你最看重什么？", "预计每天有多少任务？", "你的预算是多少？", "你处于 Maker 旅程的哪个阶段？"],
    products: [["tumblers", "保温杯"], ["acrylic", "亚克力"], ["wood", "木材"], ["leather", "皮革"], ["signs", "标牌"], ["awards", "奖牌"], ["gifts", "礼品"], ["large-format products", "大幅面"], ["production runs", "批量生产"]],
    priorities: [["speed", "速度"], ["fine detail", "精细细节"], ["easy setup", "易于设置"], ["high-volume production", "高产量"], ["large work area", "大工作幅面"], ["drinkware", "杯子生产"], ["versatility", "多功能"], ["lower upfront investment", "较低初始投入"]],
    volumes: [["occasional", "偶尔"], ["1-10", "每天 1–10"], ["10-30", "每天 10–30"], ["30-100", "每天 30–100"], ["100+", "每天 100+"]],
    budgets: [["under-3", "低于 $3K"], ["3-5", "$3K–5K"], ["5-8", "$5K–8K"], ["8-15", "$8K–15K"], ["15+", "$15K+"]],
    experience: [["first", "第一台激光机"], ["beginner", "新手"], ["growing", "成长中业务"], ["professional", "专业工作室"], ["production", "生产型业务"]],
    next: "下一个匹配信号",
    back: "返回",
    reveal: "揭晓匹配结果",
    best: "最佳匹配",
    alt: "有力备选",
    why: "为什么匹配",
    see: "前往 OneLaser 查看",
    currentPrice: "当前起售价核对于 2026 年 8 月 19 日",
    disclosure: "推荐基于你选择的用途与确定性规则，并非付费排名。",
    restart: "修改答案",
  },
};

export function MachineFinder() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initial);
  const [complete, setComplete] = useState(false);
  const recommendation = useMemo(() => recommendMachines(answers), [answers]);
  const options = [t.products, t.priorities, t.volumes, t.budgets, t.experience][step];
  const current = [answers.products, answers.priorities, answers.volume, answers.budget, answers.experience][step];

  function choose(value: string) {
    if (step === 0) setAnswers((state) => ({ ...state, products: state.products.includes(value) ? state.products.filter((item) => item !== value) : [...state.products, value].slice(-4) }));
    else if (step === 1) setAnswers((state) => ({ ...state, priorities: state.priorities.includes(value) ? state.priorities.filter((item) => item !== value) : [...state.priorities, value].slice(-2) }));
    else if (step === 2) setAnswers((state) => ({ ...state, volume: value as ProductionVolume }));
    else if (step === 3) setAnswers((state) => ({ ...state, budget: value as BudgetRange }));
    else setAnswers((state) => ({ ...state, experience: value as Experience }));
  }

  async function advance() {
    if (step < 4) {
      setStep((value) => value + 1);
      return;
    }
    setComplete(true);
    await trackEvent("machine_finder_complete", { tool: "machine_finder", product_category: answers.products, budget_range: answers.budget, business_stage: answers.experience, recommendation: recommendation.best.id, finder_answers: answers });
  }

  if (complete) {
    return (
      <section className="machine-results shell">
        <header className="machine-result-header"><Trophy weight="fill" /><div><p className="eyebrow">MATCH COMPLETE +100 XP</p><h2>{t.best}</h2><p>{t.disclosure}</p></div></header>
        <div className="machine-match-grid">
          <article className="machine-match primary">
            <div className="machine-image"><Image src={recommendation.best.image} alt={recommendation.best.name} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
            <div><span>{recommendation.best.category}</span><h3>{recommendation.best.name}</h3><p className="machine-price">{formatCurrency(recommendation.best.price)}<small>{t.currentPrice}</small></p><h4>{t.why}</h4><ul>{recommendation.reasons.map((reason) => <li key={reason}><Check weight="bold" />{reason}</li>)}</ul><TrackedMachineLink machine={recommendation.best.id} tool="machine_finder" result={recommendation.best.id}>{t.see}</TrackedMachineLink></div>
          </article>
          <article className="machine-match alternative">
            <div className="machine-image"><Image src={recommendation.alternative.image} alt={recommendation.alternative.name} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
            <div><p className="eyebrow">{t.alt}</p><h3>{recommendation.alternative.name}</h3><p>{recommendation.alternative.strengths.join(" · ")}</p><TrackedMachineLink machine={recommendation.alternative.id} tool="machine_finder" result={recommendation.alternative.id} className="button button-ghost">{t.see}</TrackedMachineLink></div>
          </article>
        </div>
        <div className="recommendation-explainer"><Info weight="bold" /><p>{locale === "zh" ? "分数由产品适配、优先级、产量、预算和经验共同计算。机器数据可通过配置修改，不写死在界面中。" : "Scores combine product fit, priorities, volume, budget, and experience. Machine data and rule weights are configurable outside the UI."}</p></div>
        <button className="button button-ghost" onClick={() => { setComplete(false); setStep(0); }}>{t.restart}</button>
        <EmailCapture tool="machine_finder" result={recommendation.best.id} />
        <EstimateDisclaimer />
      </section>
    );
  }

  return (
    <section className="finder-shell shell">
      <aside className="quest-sidebar"><Target weight="bold" /><p>{t.title}</p><strong>{String(step + 1).padStart(2, "0")} / 05</strong><div className="quest-progress"><span style={{ width: `${((step + 1) / 5) * 100}%` }} /></div><small>{locale === "zh" ? "选择你的业务需求，而不是品牌或型号。" : "Choose business needs—not brands or model names."}</small></aside>
      <div className="quest-question"><p className="eyebrow">EQUIPMENT MATCH / STEP {step + 1}</p><h2>{t.questions[step]}</h2><div className="choice-grid">{options.map(([value, label]) => { const selected = Array.isArray(current) ? current.includes(value) : current === value; return <button className={selected ? "choice-card selected" : "choice-card"} key={value} onClick={() => choose(value)}><span>{selected ? <Check weight="bold" /> : null}</span><strong>{label}</strong></button>; })}</div><div className="quest-nav"><button className="button button-ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft weight="bold" />{t.back}</button><button className="button button-primary" onClick={advance} disabled={(step === 0 && !answers.products.length) || (step === 1 && !answers.priorities.length)}>{step === 4 ? t.reveal : t.next}<ArrowRight weight="bold" /></button></div></div>
    </section>
  );
}
