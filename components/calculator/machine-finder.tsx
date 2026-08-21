"use client";

import { ArrowLeft, ArrowRight, ArrowSquareOut, Check, Cube, Info, Sparkle, Target, Trophy, TShirt } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { recommendEquipment, type EquipmentAnswers, type EquipmentBudget, type EquipmentExperience, type EquipmentMethod, type EquipmentVolume } from "@/lib/equipment/engine";
import { EstimateDisclaimer } from "@/components/results/estimate-disclaimer";
import { EmailCapture } from "@/components/results/email-capture";
import { trackEvent } from "@/lib/analytics/client";
import { OneLaserRecommendation } from "@/components/commerce/onelaser-recommendation";
import { buildBambuUrl } from "@/lib/commerce/bambu";
import { buildXToolUrl } from "@/lib/commerce/xtool";
import { withElianSource } from "@/lib/commerce/outbound";

const initial: EquipmentAnswers = { method: "laser", products: [], priorities: [], volume: "10-30", budget: "starter", experience: "growing" };

const productAliases: Record<string, string> = {
  "personalized-tumblers": "tumblers",
  "3d-desk-organizers": "desk organizers",
  "acrylic-wedding-signs": "acrylic",
  "laser-leather-patches": "leather",
  "3d-geometric-planters": "planters",
  "layered-wood-wall-art": "wood",
  "heat-press-tote-bags": "tote bags",
};

const copy = {
  en: {
    title: "Equipment Match Quest",
    questions: ["Which making path are you equipping?", "What do you want to make?", "What matters most?", "How many jobs do you expect?", "What investment level fits?", "Where are you in your maker journey?"],
    methods: [["laser", "Laser making"], ["3d-printing", "3D printing"], ["heat-press", "Heat press & transfer"]],
    products: {
      laser: [["tumblers", "Tumblers"], ["acrylic", "Acrylic"], ["wood", "Wood"], ["leather", "Leather"], ["signs", "Signs"], ["awards", "Awards"], ["gifts", "Gifts"], ["large-format products", "Large-format"], ["production runs", "Production runs"]],
      "3d-printing": [["desk organizers", "Desk organizers"], ["planters", "Planters"], ["tool holders", "Tool holders"], ["display stands", "Display stands"], ["functional parts", "Functional parts"], ["replacement parts", "Replacement parts"], ["custom accessories", "Custom accessories"], ["personalized gifts", "Personalized gifts"], ["production runs", "Production runs"]],
      "heat-press": [["apparel", "Apparel"], ["tote bags", "Tote bags"], ["hoodies", "Hoodies"], ["pillow covers", "Pillow covers"], ["mugs", "Mugs"], ["phone cases", "Phone cases"], ["badges", "Badges"], ["sublimation blanks", "Sublimation blanks"], ["production runs", "Production runs"]],
    },
    priorities: [["speed", "Speed"], ["fine detail", "Fine detail"], ["easy setup", "Easy setup"], ["high-volume production", "High volume"], ["large work area", "Large work area"], ["versatility", "Versatility"], ["lower upfront investment", "Lower investment"]],
    volumes: [["occasional", "Occasional"], ["1-10", "1–10 / day"], ["10-30", "10–30 / day"], ["30-100", "30–100 / day"], ["100+", "100+ / day"]],
    budgets: [["entry", "Entry"], ["starter", "Starter"], ["growth", "Growth"], ["production", "Production"]],
    experience: [["first", "First machine"], ["beginner", "Beginner"], ["growing", "Growing business"], ["professional", "Professional shop"], ["production", "Production business"]],
    next: "Next match signal", back: "Back", reveal: "Reveal my match", best: "Your best-fit setup", alt: "Strong alternative", why: "Why this matches", investment: "Investment level", restart: "Change my answers", complete: "MATCH COMPLETE +100 XP", step: "EQUIPMENT MATCH / STEP",
    disclosure: "This is a category recommendation based on visible criteria—not a product endorsement or paid ranking.",
    explainer: "Scores combine making method, product fit, priorities, volume, investment level, and experience. Compare real machines on safety, materials, usable build area, workflow, support, and total operating cost before buying.",
    sidebar: "Choose your making method first. Every later question stays inside that path.",
  },
  zh: {
    title: "设备匹配任务",
    questions: ["你要配置哪种制造方式？", "你想制作什么？", "你最看重什么？", "预计每天有多少任务？", "哪种投入级别适合你？", "你处于 Maker 旅程的哪个阶段？"],
    methods: [["laser", "激光制作"], ["3d-printing", "3D 打印"], ["heat-press", "热压转印"]],
    products: {
      laser: [["tumblers", "保温杯"], ["acrylic", "亚克力"], ["wood", "木材"], ["leather", "皮革"], ["signs", "标牌"], ["awards", "奖牌"], ["gifts", "礼品"], ["large-format products", "大幅面"], ["production runs", "批量生产"]],
      "3d-printing": [["desk organizers", "桌面收纳"], ["planters", "花盆"], ["tool holders", "工具收纳"], ["display stands", "展示支架"], ["functional parts", "功能零件"], ["replacement parts", "替换零件"], ["custom accessories", "定制配件"], ["personalized gifts", "个性化礼品"], ["production runs", "批量生产"]],
      "heat-press": [["apparel", "服饰"], ["tote bags", "托特包"], ["hoodies", "卫衣"], ["pillow covers", "抱枕套"], ["mugs", "马克杯"], ["phone cases", "手机壳"], ["badges", "徽章"], ["sublimation blanks", "升华坯料"], ["production runs", "批量生产"]],
    },
    priorities: [["speed", "速度"], ["fine detail", "精细细节"], ["easy setup", "易于设置"], ["high-volume production", "高产量"], ["large work area", "大工作区域"], ["versatility", "多功能"], ["lower upfront investment", "较低初始投入"]],
    volumes: [["occasional", "偶尔"], ["1-10", "每天 1–10"], ["10-30", "每天 10–30"], ["30-100", "每天 30–100"], ["100+", "每天 100+"]],
    budgets: [["entry", "入门级"], ["starter", "起步级"], ["growth", "成长级"], ["production", "生产级"]],
    experience: [["first", "第一台设备"], ["beginner", "新手"], ["growing", "成长中业务"], ["professional", "专业工作室"], ["production", "生产型业务"]],
    next: "下一个匹配信号", back: "返回", reveal: "揭晓匹配结果", best: "最适合你的设备方案", alt: "有力备选", why: "为什么匹配", investment: "投入级别", restart: "修改答案", complete: "匹配完成 +100 XP", step: "设备匹配 / 步骤",
    disclosure: "这是基于公开匹配条件的设备类别建议，并非具体产品背书或付费排名。",
    explainer: "评分综合制造方式、产品适配、优先级、产量、投入级别和经验。购买前请比较真实设备的安全性、材料范围、可用工作区域、工作流、售后支持和总运营成本。",
    sidebar: "先选择制造方式，之后每个问题都会保持在这条路径内。",
  },
};

type Option = [string, string];

export function MachineFinder() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EquipmentAnswers>(() => {
    const methodParam = searchParams.get("method");
    const method: EquipmentMethod = methodParam === "3d-printing" || methodParam === "heat-press" ? methodParam : "laser";
    const productParam = searchParams.get("product");
    const product = productParam ? (productAliases[productParam] ?? productParam) : null;
    return { ...initial, method, products: product ? [product] : [], budget: method === "laser" ? "starter" : "entry" };
  });
  const [complete, setComplete] = useState(false);
  const recommendation = useMemo(() => recommendEquipment(answers), [answers]);
  const options = [t.methods, t.products[answers.method], t.priorities, t.volumes, t.budgets, t.experience][step] as Option[];
  const current: string | string[] = [answers.method, answers.products, answers.priorities, answers.volume, answers.budget, answers.experience][step];
  const MethodIcon = answers.method === "laser" ? Sparkle : answers.method === "3d-printing" ? Cube : TShirt;
  const oneLaserMatch = recommendation.best.oneLaser;
  const referenceUrl = (profile: typeof recommendation.best) => profile.method === "3d-printing"
    ? buildBambuUrl(`machine_finder_${profile.id}`, "machine_finder_result")
    : profile.method === "heat-press"
      ? buildXToolUrl(`machine_finder_${profile.id}`, "machine_finder_result")
      : profile.referenceUrl
        ? withElianSource(profile.referenceUrl)
        : undefined;

  useEffect(() => {
    if (!complete || !oneLaserMatch) return;
    void trackEvent("recommendation_view", {
      tool: "equipment_match",
      brand: "OneLaser",
      recommendation: recommendation.best.id,
      placement: "machine_finder_result",
    });
  }, [complete, oneLaserMatch, recommendation.best.id]);

  function choose(value: string) {
    if (step === 0) setAnswers((state) => ({ ...state, method: value as EquipmentMethod, products: [], priorities: [], budget: value === "laser" ? "starter" : "entry" }));
    else if (step === 1) setAnswers((state) => ({ ...state, products: state.products.includes(value) ? state.products.filter((item) => item !== value) : [...state.products, value].slice(-4) }));
    else if (step === 2) setAnswers((state) => ({ ...state, priorities: state.priorities.includes(value) ? state.priorities.filter((item) => item !== value) : [...state.priorities, value].slice(-2) }));
    else if (step === 3) setAnswers((state) => ({ ...state, volume: value as EquipmentVolume }));
    else if (step === 4) setAnswers((state) => ({ ...state, budget: value as EquipmentBudget }));
    else setAnswers((state) => ({ ...state, experience: value as EquipmentExperience }));
  }

  async function advance() {
    if (step < 5) {
      setStep((value) => value + 1);
      return;
    }
    setComplete(true);
    await trackEvent("machine_finder_complete", { tool: "equipment_match", category: answers.method, product_category: answers.products, budget_range: answers.budget, business_stage: answers.experience, recommendation: recommendation.best.id, finder_answers: answers });
  }

  if (complete) {
    return (
      <section className="machine-results shell">
        <header className="machine-result-header"><Trophy weight="fill" /><div><p className="eyebrow">{t.complete}</p><h2>{t.best}</h2><p>{t.disclosure}</p></div></header>
        <div className="equipment-method-result"><MethodIcon weight="bold" /><span>{locale === "zh" ? "制造方式" : "MAKING PATH"}</span><strong>{answers.method === "laser" ? (locale === "zh" ? "激光制作" : "LASER") : answers.method === "3d-printing" ? (locale === "zh" ? "3D 打印" : "3D PRINTING") : (locale === "zh" ? "热压转印" : "HEAT PRESS")}</strong></div>
        <div className="machine-match-grid equipment-match-grid">
          <article className="equipment-match-card primary">
            <div className="equipment-profile-mark"><MethodIcon weight="bold" /></div>
            <div><span>{locale === "zh" ? recommendation.best.categoryZh : recommendation.best.category}</span><h3>{locale === "zh" ? recommendation.best.nameZh : recommendation.best.name}</h3><p>{locale === "zh" ? recommendation.best.descriptionZh : recommendation.best.description}</p><p className="equipment-investment"><small>{t.investment}</small><strong>{locale === "zh" ? recommendation.best.investmentZh : recommendation.best.investment}</strong></p>{referenceUrl(recommendation.best) ? <a className="equipment-reference" href={referenceUrl(recommendation.best)} target="_blank" rel="noreferrer">{locale === "zh" ? "参考设备" : "REFERENCE EXAMPLE"}: {recommendation.best.referenceName}<ArrowSquareOut weight="bold" /></a> : null}<h4>{t.why}</h4><ul>{(locale === "zh" ? recommendation.reasonsZh : recommendation.reasons).map((reason) => <li key={reason}><Check weight="bold" />{reason}</li>)}</ul></div>
          </article>
          <article className="equipment-match-card alternative">
            <div className="equipment-profile-mark"><MethodIcon weight="bold" /></div>
            <div><p className="eyebrow">{t.alt}</p><h3>{locale === "zh" ? recommendation.alternative.nameZh : recommendation.alternative.name}</h3><p>{locale === "zh" ? recommendation.alternative.descriptionZh : recommendation.alternative.description}</p><p className="equipment-investment"><small>{t.investment}</small><strong>{locale === "zh" ? recommendation.alternative.investmentZh : recommendation.alternative.investment}</strong></p>{referenceUrl(recommendation.alternative) ? <a className="equipment-reference" href={referenceUrl(recommendation.alternative)} target="_blank" rel="noreferrer">{locale === "zh" ? "参考设备" : "REFERENCE EXAMPLE"}: {recommendation.alternative.referenceName}<ArrowSquareOut weight="bold" /></a> : null}</div>
          </article>
        </div>
        {oneLaserMatch ? <OneLaserRecommendation profileId={recommendation.best.id} productName={oneLaserMatch.productName} destination={oneLaserMatch.destination} fit={oneLaserMatch.fit} fitZh={oneLaserMatch.fitZh} placement="machine_finder_result" /> : null}
        <div className="recommendation-explainer"><Info weight="bold" /><p>{t.explainer}</p></div>
        <button className="button button-ghost" onClick={() => { setComplete(false); setStep(0); }}>{t.restart}</button>
        <EmailCapture tool="equipment_match" result={recommendation.best.id} />
        <EstimateDisclaimer />
      </section>
    );
  }

  const mustChoose = (step === 1 && !answers.products.length) || (step === 2 && !answers.priorities.length);

  return (
    <section className="finder-shell shell">
      <aside className="quest-sidebar"><Target weight="bold" /><p>{t.title}</p><strong>{String(step + 1).padStart(2, "0")} / 06</strong><div className="quest-progress"><span style={{ width: `${((step + 1) / 6) * 100}%` }} /></div><small>{t.sidebar}</small></aside>
      <div className="quest-question"><p className="eyebrow">{t.step} {step + 1}</p><h2>{t.questions[step]}</h2><div className="choice-grid">{options.map(([value, label]) => { const selected = Array.isArray(current) ? current.includes(value) : current === value; return <button aria-pressed={selected} className={selected ? "choice-card selected" : "choice-card"} key={value} onClick={() => choose(value)}><span>{selected ? <Check weight="bold" /> : null}</span><strong>{label}</strong></button>; })}</div><div className="quest-nav"><button className="button button-ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft weight="bold" />{t.back}</button><button className="button button-primary" onClick={advance} disabled={mustChoose}>{step === 5 ? t.reveal : t.next}<ArrowRight weight="bold" /></button></div></div>
    </section>
  );
}
