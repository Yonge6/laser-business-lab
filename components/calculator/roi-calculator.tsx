"use client";

import { ArrowLeft, ArrowRight, Check, ShareNetwork, TrendUp, Warning } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { NumberField } from "@/components/calculator/number-field";
import { calculateRoi, type RoiInput } from "@/lib/calculators/roi";
import { formatCurrency, formatNumber } from "@/lib/format";
import { encodeReport } from "@/lib/reports/codec";
import { trackEvent } from "@/lib/analytics/client";
import { EstimateDisclaimer } from "@/components/results/estimate-disclaimer";
import { EmailCapture } from "@/components/results/email-capture";
import { opportunityById } from "@/lib/opportunities/data";

const products = ["Tumblers", "Signs", "Acrylic Products", "Awards & Trophies", "Leather Goods", "Personalized Gifts", "Wood Products", "Promotional Products", "Other"];
const productsZh = ["保温杯", "标牌", "亚克力产品", "奖杯与奖牌", "皮革制品", "个性化礼品", "木制品", "促销产品", "其他"];
const budgets = [
  ["under-3", "Under $3,000", 2_500],
  ["3-5", "$3,000–$5,000", 4_000],
  ["5-8", "$5,000–$8,000", 5_599],
  ["8-15", "$8,000–$15,000", 10_999],
  ["15+", "$15,000+", 15_000],
] as const;

const copy = {
  en: {
    steps: ["Product", "Economics", "Production", "Equipment"],
    questions: ["What do you want to make?", "What are the unit economics?", "What can your workflow support?", "What are you planning to invest?"],
    next: "Next step",
    back: "Back",
    report: "Build my report",
    live: "Live business score",
    profit: "Profit / product",
    monthly: "Monthly gross profit",
    payback: "Estimated payback",
    margin: "Gross margin",
    negative: "Your current costs meet or exceed your selling price. Raise price or reduce costs before modeling payback.",
    labels: {
      selling: "Average selling price",
      material: "Material cost per item",
      packaging: "Packaging / other cost",
      minutes: "Production time per item",
      orders: "Orders per month",
      days: "Working days per month",
      hours: "Hours available per day",
      budget: "Laser budget",
      machine: "Planned machine investment",
      current: "Current machine",
    },
    complete: "Your laser business report",
    potential: "Estimated business potential",
    annual: "Annual gross profit",
    production: "Production time",
    utilization: "Available capacity used",
    profile: "Your production profile",
    share: "Copy share link",
    copied: "Link copied",
    reset: "Edit my numbers",
  },
  zh: {
    steps: ["产品", "经济模型", "生产", "设备"],
    questions: ["你想制作什么？", "单件经济模型是什么？", "你的工作流程能支持多少？", "你计划投资多少？"],
    next: "下一步",
    back: "返回",
    report: "生成我的报告",
    live: "实时商业评分",
    profit: "单件毛利",
    monthly: "月度毛利润",
    payback: "预计回本周期",
    margin: "毛利率",
    negative: "当前成本已达到或超过售价。请先提高售价或降低成本，再计算回本周期。",
    labels: {
      selling: "平均售价",
      material: "单件材料成本",
      packaging: "包装 / 其他成本",
      minutes: "单件生产时间",
      orders: "每月订单量",
      days: "每月工作天数",
      hours: "每天可用小时",
      budget: "激光设备预算",
      machine: "计划设备投资",
      current: "当前设备",
    },
    complete: "你的激光商业报告",
    potential: "预计商业潜力",
    annual: "年度毛利润",
    production: "生产时间",
    utilization: "可用产能占用",
    profile: "你的生产画像",
    share: "复制分享链接",
    copied: "链接已复制",
    reset: "修改数字",
  },
};

const initialInput: RoiInput = {
  sellingPrice: 35,
  materialCost: 8,
  packagingCost: 2,
  productionMinutes: 10,
  monthlyOrders: 150,
  workingDays: 22,
  hoursPerDay: 6,
  machinePrice: 5_599,
};

export function RoiCalculator() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const selectedOpportunity = opportunityById[searchParams.get("product") ?? ""];
  const [product, setProduct] = useState(selectedOpportunity?.title ?? "Tumblers");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<RoiInput>(() => selectedOpportunity ? {
    ...initialInput,
    sellingPrice: selectedOpportunity.sellingPrice,
    materialCost: selectedOpportunity.materialCost,
    packagingCost: 0,
    productionMinutes: selectedOpportunity.productionMinutes,
  } : initialInput);
  const [budget, setBudget] = useState("5-8");
  const [currentMachine, setCurrentMachine] = useState("No laser yet");
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateRoi(input), [input]);
  const t = copy[locale];
  const set = (key: keyof RoiInput) => (value: number) => setInput((current) => ({ ...current, [key]: value }));

  async function advance() {
    if (step < 3) {
      await trackEvent("calculator_step_completed", { tool: "laser_roi", step: step + 1, product_category: product });
      setStep((value) => value + 1);
      return;
    }
    setComplete(true);
    await trackEvent("calculator_complete", { tool: "laser_roi", product_category: product, budget_range: budget, calculator_input: input, calculator_result: result });
  }

  async function share() {
    const reportId = encodeReport({
      version: 1,
      kind: "roi",
      product,
      input: {
        sellingPrice: input.sellingPrice,
        materialCost: input.materialCost,
        packagingCost: input.packagingCost,
        monthlyOrders: input.monthlyOrders,
        productionMinutes: input.productionMinutes,
        machinePrice: input.machinePrice,
      },
      result: {
        grossProfitPerItem: result.grossProfitPerItem,
        monthlyGrossProfit: result.monthlyGrossProfit,
        productionHours: result.productionHours,
        paybackMonths: result.paybackMonths,
        profiles: result.profiles,
      },
    });
    const url = `${window.location.origin}/report/${reportId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    await trackEvent("share_result", { tool: "laser_roi", product_category: product });
  }

  if (complete) {
    return (
      <section className="business-report shell">
        <header className="report-header"><div><p className="eyebrow">MISSION COMPLETE +100 XP</p><h2>{t.complete}</h2><p>{product}</p></div><TrendUp weight="bold" /></header>
        <div className="report-grid">
          <div className="report-main">
            <span>{t.potential}</span>
            <strong>{formatCurrency(result.monthlyGrossProfit)}</strong>
            <small>{t.monthly}</small>
          </div>
          <div className="report-stat"><strong>{formatCurrency(result.grossProfitPerItem, 2)}</strong><span>{t.profit}</span></div>
          <div className="report-stat"><strong>{formatCurrency(result.annualGrossProfit)}</strong><span>{t.annual}</span></div>
          <div className="report-stat"><strong>{formatNumber(result.productionHours, 1)} hrs</strong><span>{t.production}</span></div>
          <div className="report-stat"><strong>{result.paybackMonths ? `${formatNumber(result.paybackMonths, 1)} mo` : "—"}</strong><span>{t.payback}</span></div>
          <div className="report-stat"><strong>{formatNumber(result.capacityUtilization, 0)}%</strong><span>{t.utilization}</span></div>
        </div>
        {!result.isProfitable ? <div className="profit-warning"><Warning weight="bold" />{t.negative}</div> : null}
        <div className="profile-block"><span>{t.profile}</span><div>{result.profiles.map((profile) => <b key={profile}>{profile}</b>)}</div></div>
        <div className="report-actions">
          <button className="button button-primary" onClick={share}>{copied ? <Check weight="bold" /> : <ShareNetwork weight="bold" />}{copied ? t.copied : t.share}</button>
          <button className="button button-ghost" onClick={() => setComplete(false)}>{t.reset}</button>
        </div>
        <EmailCapture tool="laser_roi" result={product} />
        <EstimateDisclaimer />
      </section>
    );
  }

  return (
    <section className="calculator-shell shell">
      <div className="calculator-card">
        <ol className="calculator-steps">{t.steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><span>{index < step ? <Check weight="bold" /> : index + 1}</span><b>{label}</b></li>)}</ol>
        <div className="calculator-question">
          <p className="eyebrow">STEP {String(step + 1).padStart(2, "0")} / 04</p>
          <h2>{t.questions[step]}</h2>
          {step === 0 ? <div className="choice-grid product-choices">{products.map((item, index) => <button key={item} className={product === item ? "choice-card selected" : "choice-card"} onClick={() => setProduct(item)}><span>{product === item ? <Check weight="bold" /> : null}</span><strong>{locale === "zh" ? productsZh[index] : item}</strong></button>)}</div> : null}
          {step === 1 ? <div className="field-grid"><NumberField label={t.labels.selling} value={input.sellingPrice} onChange={set("sellingPrice")} prefix="$" step={1} /><NumberField label={t.labels.material} value={input.materialCost} onChange={set("materialCost")} prefix="$" step={.5} /><NumberField label={t.labels.packaging} value={input.packagingCost} onChange={set("packagingCost")} prefix="$" step={.5} /></div> : null}
          {step === 2 ? <div className="field-grid"><NumberField label={t.labels.minutes} value={input.productionMinutes} onChange={set("productionMinutes")} suffix="min" min={.1} /><NumberField label={t.labels.orders} value={input.monthlyOrders} onChange={set("monthlyOrders")} min={0} /><NumberField label={t.labels.days} value={input.workingDays} onChange={set("workingDays")} max={31} /><NumberField label={t.labels.hours} value={input.hoursPerDay} onChange={set("hoursPerDay")} max={24} step={.5} /></div> : null}
          {step === 3 ? <div className="field-grid"><label className="select-field"><span className="field-label">{t.labels.budget}</span><select value={budget} onChange={(event) => { const next = budgets.find((item) => item[0] === event.target.value)!; setBudget(event.target.value); set("machinePrice")(next[2]); }}>{budgets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><NumberField label={t.labels.machine} value={input.machinePrice} onChange={set("machinePrice")} prefix="$" step={100} /><label className="select-field"><span className="field-label">{t.labels.current}</span><select value={currentMachine} onChange={(event) => setCurrentMachine(event.target.value)}>{["No laser yet", "Entry-level diode", "Desktop CO2", "Glass-tube CO2", "RF CO2", "Fiber", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label></div> : null}
          <div className="quest-nav"><button className="button button-ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft weight="bold" />{t.back}</button><button className="button button-primary" onClick={advance}>{step === 3 ? t.report : t.next}<ArrowRight weight="bold" /></button></div>
        </div>
      </div>
      <aside className="live-score">
        <p>{t.live}</p>
        <div><span>{t.profit}</span><strong>{formatCurrency(result.grossProfitPerItem, 2)}</strong></div>
        <div><span>{t.monthly}</span><strong>{formatCurrency(result.monthlyGrossProfit)}</strong></div>
        <div><span>{t.payback}</span><strong>{result.paybackMonths ? `${formatNumber(result.paybackMonths, 1)} mo` : "—"}</strong></div>
        <div><span>{t.margin}</span><strong>{formatNumber(result.marginPercent, 0)}%</strong></div>
        {!result.isProfitable ? <p className="profit-warning"><Warning weight="bold" />{t.negative}</p> : null}
      </aside>
    </section>
  );
}
