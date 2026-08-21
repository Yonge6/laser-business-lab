"use client";

import { ArrowLeft, ArrowRight, ArrowSquareOut, Check, Cube, ShareNetwork, Sparkle, Target, TrendUp, TShirt, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { sitePath } from "@/lib/site";
import { OneLaserRecommendation } from "@/components/commerce/onelaser-recommendation";
import { oneLaserDestinations, oneLaserOpportunityDestinations, oneLaserOpportunityNames } from "@/lib/commerce/onelaser";
import { getRoiEquipmentRecommendation } from "@/lib/commerce/opportunity-equipment";
import { clampToBudget } from "@/lib/calculators/budget";

export type MakerMethod = "laser" | "3d-printing" | "heat-press" | "maker";

type ProductOption = { value: string; label: string; labelZh: string };
type BudgetOption = { value: string; label: string; labelZh: string; suggested: number; min: number; max?: number };
type MachineOption = readonly [string, string, string];

const productsByMethod: Record<MakerMethod, ProductOption[]> = {
  laser: [
    ["Tumblers", "Tumblers", "保温杯"], ["Signs", "Signs", "标牌"], ["Acrylic Products", "Acrylic Products", "亚克力产品"],
    ["Awards & Trophies", "Awards & Trophies", "奖杯与奖牌"], ["Leather Goods", "Leather Goods", "皮革制品"], ["Personalized Gifts", "Personalized Gifts", "个性化礼品"],
    ["Wood Products", "Wood Products", "木制品"], ["Promotional Products", "Promotional Products", "促销产品"], ["Other", "Other", "其他"],
  ].map(([value, label, labelZh]) => ({ value, label, labelZh })),
  "3d-printing": [
    ["Desk Organizers", "Desk Organizers", "桌面收纳"], ["Planters", "Planters", "花盆"], ["Tool Holders", "Tool Holders", "工具收纳"],
    ["Display Stands", "Display Stands", "展示支架"], ["Replacement Parts", "Replacement Parts", "替换零件"], ["Custom Accessories", "Custom Accessories", "定制配件"],
    ["Personalized Gifts", "Personalized Gifts", "个性化礼品"], ["Other", "Other", "其他"],
  ].map(([value, label, labelZh]) => ({ value, label, labelZh })),
  "heat-press": [
    ["Tote Bags", "Tote bags", "托特包"], ["T-Shirts", "T-shirts", "T 恤"], ["Hoodies", "Hoodies", "卫衣"],
    ["Pillow Covers", "Pillow covers", "抱枕套"], ["Mugs", "Sublimated mugs", "升华马克杯"], ["Phone Cases", "Sublimated phone cases", "升华手机壳"],
    ["Badges", "Badges", "徽章"], ["Other", "Other", "其他"],
  ].map(([value, label, labelZh]) => ({ value, label, labelZh })),
  maker: [
    ["Tumblers", "Laser-engraved tumblers", "激光雕刻保温杯"], ["Signs", "Laser-cut signs", "激光切割标牌"], ["Desk Organizers", "3D-printed desk organizers", "3D 打印桌面收纳"],
    ["Functional Parts", "3D-printed functional parts", "3D 打印功能零件"], ["Tote Bags", "Heat-pressed tote bags", "热转印托特包"], ["Personalized Gifts", "Personalized gifts", "个性化礼品"], ["Other", "Other", "其他"],
  ].map(([value, label, labelZh]) => ({ value, label, labelZh })),
};

const laserBudgets = [
  { value: "under-3", label: "Under $3,000", labelZh: "低于 $3,000", suggested: 2_500, min: 0, max: 2_999 },
  { value: "3-5", label: "$3,000–$5,000", labelZh: "$3,000–$5,000", suggested: 4_000, min: 3_000, max: 4_999 },
  { value: "5-8", label: "$5,000–$8,000", labelZh: "$5,000–$8,000", suggested: 5_599, min: 5_000, max: 7_999 },
  { value: "8-15", label: "$8,000–$15,000", labelZh: "$8,000–$15,000", suggested: 10_999, min: 8_000, max: 14_999 },
  { value: "15+", label: "$15,000+", labelZh: "$15,000 以上", suggested: 15_000, min: 15_000 },
] as const satisfies readonly BudgetOption[];

const printingBudgets = [
  { value: "under-500", label: "Under $500", labelZh: "低于 $500", suggested: 399, min: 0, max: 499 },
  { value: "500-1", label: "$500–$1,000", labelZh: "$500–$1,000", suggested: 799, min: 500, max: 999 },
  { value: "1-3", label: "$1,000–$3,000", labelZh: "$1,000–$3,000", suggested: 1_499, min: 1_000, max: 2_999 },
  { value: "3-8", label: "$3,000–$8,000", labelZh: "$3,000–$8,000", suggested: 4_999, min: 3_000, max: 7_999 },
  { value: "8+", label: "$8,000+", labelZh: "$8,000 以上", suggested: 8_000, min: 8_000 },
] as const satisfies readonly BudgetOption[];

const heatPressBudgets = [
  { value: "under-500", label: "Under $500", labelZh: "低于 $500", suggested: 349, min: 0, max: 499 },
  { value: "500-1", label: "$500–$1,000", labelZh: "$500–$1,000", suggested: 699, min: 500, max: 999 },
  { value: "1-3", label: "$1,000–$3,000", labelZh: "$1,000–$3,000", suggested: 1_499, min: 1_000, max: 2_999 },
  { value: "3+", label: "$3,000+", labelZh: "$3,000 以上", suggested: 3_000, min: 3_000 },
] as const satisfies readonly BudgetOption[];

const makerBudgets = [
  { value: "under-500", label: "Under $500", labelZh: "低于 $500", suggested: 399, min: 0, max: 499 },
  { value: "500-3", label: "$500–$3,000", labelZh: "$500–$3,000", suggested: 1_499, min: 500, max: 2_999 },
  { value: "3-8", label: "$3,000–$8,000", labelZh: "$3,000–$8,000", suggested: 5_599, min: 3_000, max: 7_999 },
  { value: "8+", label: "$8,000+", labelZh: "$8,000 以上", suggested: 8_000, min: 8_000 },
] as const satisfies readonly BudgetOption[];

const budgetsByMethod: Record<MakerMethod, readonly BudgetOption[]> = { laser: laserBudgets, "3d-printing": printingBudgets, "heat-press": heatPressBudgets, maker: makerBudgets };

const currentMachines = [
  ["none", "No laser yet", "还没有激光设备"],
  ["diode", "Entry-level diode", "入门级二极管激光机"],
  ["desktop-co2", "Desktop CO₂", "桌面式 CO₂ 激光机"],
  ["glass-co2", "Glass-tube CO₂", "玻璃管 CO₂ 激光机"],
  ["rf-co2", "RF CO₂", "RF CO₂ 激光机"],
  ["fiber", "Fiber", "光纤激光机"],
  ["other", "Other", "其他"],
] as const satisfies readonly MachineOption[];

const currentPrinters = [
  ["none", "No 3D printer yet", "还没有 3D 打印机"],
  ["open-fdm", "Open-frame FDM printer", "开放式 FDM 打印机"],
  ["enclosed-fdm", "Enclosed FDM printer", "封闭式 FDM 打印机"],
  ["multi-material", "Multi-material system", "多材料打印系统"],
  ["resin", "Resin / SLA printer", "树脂 / SLA 打印机"],
  ["farm", "Multiple printers / print farm", "多机 / 打印农场"],
  ["other", "Other", "其他"],
] as const satisfies readonly MachineOption[];

const currentHeatPresses = [
  ["none", "No heat press yet", "还没有热压设备"],
  ["portable", "Portable / handheld heat press", "便携式 / 手持热压机"],
  ["manual-flat", "Manual flat heat press", "手动平面热压机"],
  ["automatic-flat", "Automatic flat heat press", "自动平面热压机"],
  ["modular", "Modular heat and forming system", "模块化热压与成型系统"],
  ["production", "Production heat-transfer line", "热转印生产线"],
  ["other", "Other", "其他"],
] as const satisfies readonly MachineOption[];

const currentMakerEquipment = [
  ["none", "No production equipment yet", "还没有生产设备"],
  ["laser", "Laser machine", "激光设备"],
  ["3d-printer", "3D printer", "3D 打印机"],
  ["heat-press", "Heat press", "热压设备"],
  ["multiple", "Multiple maker machines", "多种 Maker 设备"],
  ["other", "Other", "其他"],
] as const satisfies readonly MachineOption[];

const machinesByMethod: Record<MakerMethod, readonly MachineOption[]> = { laser: currentMachines, "3d-printing": currentPrinters, "heat-press": currentHeatPresses, maker: currentMakerEquipment };

const profileZh: Record<string, string> = {
  "HIGH-MARGIN": "高毛利",
  "HEALTHY-MARGIN": "健康毛利",
  "MARGIN-WATCH": "关注毛利",
  "HIGH-VOLUME": "高销量",
  "MEDIUM-VOLUME": "中等销量",
  "EARLY-STAGE": "起步阶段",
  "CAPACITY-AVAILABLE": "仍有可用产能",
  "SPEED-SENSITIVE": "效率敏感",
};

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
      budget: "Equipment budget",
      machine: "Planned equipment investment",
      current: "Current equipment",
    },
    complete: "Your maker business report",
    potential: "Estimated business potential",
    annual: "Annual gross profit",
    production: "Production time",
    utilization: "Available capacity used",
    profile: "Your production profile",
    share: "Copy share link",
    copied: "Link copied",
    reset: "Edit my numbers",
    equipment: "Match equipment for this path",
    recommended: "Recommended equipment",
    mission: "MISSION COMPLETE +100 XP",
    step: "STEP",
    minute: "min",
    hour: "hrs",
    month: "mo",
    path: "Making path",
    methods: { laser: "Laser", "3d-printing": "3D printing", "heat-press": "Heat press", maker: "Maker" },
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
      budget: "设备预算",
      machine: "计划设备投资",
      current: "当前设备",
    },
    complete: "你的 Maker 商业报告",
    potential: "预计商业潜力",
    annual: "年度毛利润",
    production: "生产时间",
    utilization: "可用产能占用",
    profile: "你的生产画像",
    share: "复制分享链接",
    copied: "链接已复制",
    reset: "修改数字",
    equipment: "匹配这条路径的设备",
    recommended: "推荐设备",
    mission: "任务完成 +100 XP",
    step: "步骤",
    minute: "分钟",
    hour: "小时",
    month: "个月",
    path: "制造方式",
    methods: { laser: "激光制作", "3d-printing": "3D 打印", "heat-press": "热压转印", maker: "Maker 制作" },
  },
};

const methodCopy = {
  en: {
    laser: { complete: "Your laser business report", budget: "Laser budget", machine: "Planned laser investment", current: "Current laser machine", minutes: "Laser production time per item" },
    "3d-printing": { complete: "Your 3D-printing business report", budget: "3D-printer budget", machine: "Planned printer investment", current: "Current 3D printer", minutes: "Print time per item" },
    "heat-press": { complete: "Your heat-press business report", budget: "Heat-press budget", machine: "Planned heat-press investment", current: "Current heat-press equipment", minutes: "Pressing time per item" },
    maker: { complete: "Your maker business report", budget: "Equipment budget", machine: "Planned equipment investment", current: "Current equipment", minutes: "Production time per item" },
  },
  zh: {
    laser: { complete: "你的激光商业报告", budget: "激光设备预算", machine: "计划激光设备投资", current: "当前激光设备", minutes: "单件激光生产时间" },
    "3d-printing": { complete: "你的 3D 打印商业报告", budget: "3D 打印机预算", machine: "计划打印机投资", current: "当前 3D 打印机", minutes: "单件打印时间" },
    "heat-press": { complete: "你的热压转印商业报告", budget: "热压设备预算", machine: "计划热压设备投资", current: "当前热压设备", minutes: "单件热压制作时间" },
    maker: { complete: "你的 Maker 商业报告", budget: "设备预算", machine: "计划设备投资", current: "当前设备", minutes: "单件生产时间" },
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

export function RoiCalculator({ method = "maker" }: { method?: MakerMethod }) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const selectedOpportunity = opportunityById[searchParams.get("product") ?? ""];
  const baseProductOptions = productsByMethod[method];
  const productOptions = selectedOpportunity && !baseProductOptions.some((item) => item.value === selectedOpportunity.title)
    ? [{ value: selectedOpportunity.title, label: selectedOpportunity.title, labelZh: selectedOpportunity.titleZh }, ...baseProductOptions]
    : baseProductOptions;
  const [product, setProduct] = useState(selectedOpportunity?.title ?? productOptions[0].value);
  const [step, setStep] = useState(0);
  const budgetOptions = budgetsByMethod[method];
  const defaultBudget = method === "laser" ? "5-8" : method === "3d-printing" || method === "heat-press" ? "500-1" : "500-3";
  const opportunityBudget = selectedOpportunity
    ? budgetOptions.find((option) => selectedOpportunity.startingBudget >= option.min && (option.max === undefined || selectedOpportunity.startingBudget <= option.max))
    : undefined;
  const initialBudget = opportunityBudget ?? budgetOptions.find((option) => option.value === defaultBudget) ?? budgetOptions[0];
  const [input, setInput] = useState<RoiInput>(() => selectedOpportunity ? {
    ...initialInput,
    sellingPrice: selectedOpportunity.sellingPrice,
    materialCost: selectedOpportunity.materialCost,
    packagingCost: 0,
    productionMinutes: selectedOpportunity.productionMinutes,
    machinePrice: selectedOpportunity.startingBudget,
  } : { ...initialInput, machinePrice: initialBudget.suggested });
  const machineOptions = machinesByMethod[method];
  const [budget, setBudget] = useState(initialBudget.value);
  const [currentMachine, setCurrentMachine] = useState("none");
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateRoi(input), [input]);
  const reportId = useMemo(() => encodeReport({
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
  }), [input, product, result]);
  const t = copy[locale];
  const methodT = methodCopy[locale][method];
  const localizedProduct = locale === "zh" ? productOptions.find((item) => item.value === product)?.labelZh ?? product : productOptions.find((item) => item.value === product)?.label ?? product;
  const toolName = method === "laser" ? "laser_roi" : method === "3d-printing" ? "3d_printing_roi" : method === "heat-press" ? "heat_press_roi" : "maker_roi";
  const MethodIcon = method === "laser" ? Sparkle : method === "3d-printing" ? Cube : method === "heat-press" ? TShirt : Target;
  const activeBudget = budgetOptions.find((option) => option.value === budget) ?? initialBudget;
  const clampMachinePrice = (value: number) => clampToBudget(value, activeBudget);
  const equipmentRecommendation = getRoiEquipmentRecommendation(method, product, selectedOpportunity?.id);
  const normalizedProduct = product.toLowerCase();
  const roiOneLaserOpportunityId = selectedOpportunity?.category === "laser"
    ? selectedOpportunity.id
    : normalizedProduct.includes("tumbler")
      ? "personalized-tumblers"
      : normalizedProduct.includes("acrylic") || normalizedProduct.includes("sign")
        ? "acrylic-wedding-signs"
        : normalizedProduct.includes("wood")
          ? "layered-wood-wall-art"
          : "laser-leather-patches";
  const roiOneLaser = {
    id: `roi_${roiOneLaserOpportunityId}`,
    productName: oneLaserOpportunityNames[roiOneLaserOpportunityId] ?? "OneLaser XRF",
    destination: oneLaserOpportunityDestinations[roiOneLaserOpportunityId] ?? oneLaserDestinations.xrf,
    fit: "A direct machine checkpoint matched to this product's material, working area, production speed, and repeatability needs.",
    fitZh: "根据该产品的材料、工作区域、生产速度与重复加工需求直接匹配的设备检查点。",
  };
  const roiRecommendationId = roiOneLaser.id;
  const set = (key: keyof RoiInput) => (value: number) => setInput((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (!complete || method !== "laser") return;
    void trackEvent("recommendation_view", {
      tool: "laser_roi",
      brand: "OneLaser",
      recommendation: roiRecommendationId,
      placement: "roi_report",
    });
  }, [complete, method, roiRecommendationId]);

  async function advance() {
    if (step < 3) {
      await trackEvent("calculator_step_completed", { tool: toolName, step: step + 1, product_category: product, method });
      setStep((value) => value + 1);
      return;
    }
    setComplete(true);
    await trackEvent("calculator_complete", { tool: toolName, product_category: product, category: method, budget_range: budget, calculator_input: input, calculator_result: result });
  }

  async function share() {
    const url = new URL(sitePath("/report/"), window.location.origin);
    url.searchParams.set("id", reportId);
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url.toString();
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(true);
    await trackEvent("share_result", { tool: toolName, product_category: product, category: method });
  }

  if (complete) {
    return (
      <section className="business-report shell">
        <header className="report-header"><div><p className="eyebrow">{t.mission}</p><h2>{methodT.complete}</h2><p>{localizedProduct}</p></div><TrendUp weight="bold" /></header>
        <div className="report-grid">
          <div className="report-main">
            <span>{t.potential}</span>
            <strong>{formatCurrency(result.monthlyGrossProfit)}</strong>
            <small>{t.monthly}</small>
          </div>
          <div className="report-stat"><strong>{formatCurrency(result.grossProfitPerItem, 2)}</strong><span>{t.profit}</span></div>
          <div className="report-stat"><strong>{formatCurrency(result.annualGrossProfit)}</strong><span>{t.annual}</span></div>
          <div className="report-stat"><strong>{formatNumber(result.productionHours, 1)} {t.hour}</strong><span>{t.production}</span></div>
          <div className="report-stat"><strong>{result.paybackMonths ? `${formatNumber(result.paybackMonths, 1)} ${t.month}` : "—"}</strong><span>{t.payback}</span></div>
          <div className="report-stat"><strong>{formatNumber(result.capacityUtilization, 0)}%</strong><span>{t.utilization}</span></div>
          <a className="report-stat report-machine" href={equipmentRecommendation.url} target="_blank" rel="noreferrer"><span>{t.recommended}</span><strong>{locale === "zh" ? equipmentRecommendation.nameZh : equipmentRecommendation.name}</strong><ArrowSquareOut weight="bold" /></a>
        </div>
        {!result.isProfitable ? <div className="profit-warning"><Warning weight="bold" />{t.negative}</div> : null}
        <div className="profile-block"><span>{t.profile}</span><div>{result.profiles.map((profile) => <b key={profile}>{locale === "zh" ? profileZh[profile] ?? profile : profile}</b>)}</div></div>
        <div className="report-actions">
          <button className="button button-primary" onClick={share}>{copied ? <Check weight="bold" /> : <ShareNetwork weight="bold" />}{copied ? t.copied : t.share}</button>
          {method !== "maker" ? <Link className="button button-ghost" href={`/calculator/machine-finder?method=${method}&product=${encodeURIComponent(selectedOpportunity?.id ?? product)}`}>{t.equipment}<ArrowRight weight="bold" /></Link> : null}
          <button className="button button-ghost" onClick={() => setComplete(false)}>{t.reset}</button>
        </div>
        {method === "laser" ? <OneLaserRecommendation compact profileId={roiRecommendationId} productName={roiOneLaser.productName} destination={roiOneLaser.destination} fit={roiOneLaser.fit} fitZh={roiOneLaser.fitZh} placement="roi_report" /> : null}
        <EmailCapture tool={toolName} result={product} reportPath={`${sitePath("/report/")}?id=${reportId}`} />
        <EstimateDisclaimer />
      </section>
    );
  }

  return (
    <section className="calculator-shell shell">
      <div className="calculator-card">
        <div className={`method-context method-${method}`}><MethodIcon weight="bold" /><span>{t.path}</span><strong>{t.methods[method]}</strong></div>
        <ol className="calculator-steps">{t.steps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><span>{index < step ? <Check weight="bold" /> : index + 1}</span><b>{label}</b></li>)}</ol>
        <div className="calculator-question">
          <p className="eyebrow">{t.step} {String(step + 1).padStart(2, "0")} / 04</p>
          <h2>{t.questions[step]}</h2>
          {step === 0 ? <div className="choice-grid product-choices">{productOptions.map((item) => <button key={item.value} className={product === item.value ? "choice-card selected" : "choice-card"} onClick={() => setProduct(item.value)}><span>{product === item.value ? <Check weight="bold" /> : null}</span><strong>{locale === "zh" ? item.labelZh : item.label}</strong></button>)}</div> : null}
          {step === 1 ? <div className="field-grid"><NumberField label={t.labels.selling} value={input.sellingPrice} onChange={set("sellingPrice")} prefix="$" step={1} /><NumberField label={t.labels.material} value={input.materialCost} onChange={set("materialCost")} prefix="$" step={.5} /><NumberField label={t.labels.packaging} value={input.packagingCost} onChange={set("packagingCost")} prefix="$" step={.5} /></div> : null}
          {step === 2 ? <div className="field-grid"><NumberField label={methodT.minutes} value={input.productionMinutes} onChange={set("productionMinutes")} suffix={t.minute} min={.1} /><NumberField label={t.labels.orders} value={input.monthlyOrders} onChange={set("monthlyOrders")} min={0} /><NumberField label={t.labels.days} value={input.workingDays} onChange={set("workingDays")} max={31} /><NumberField label={t.labels.hours} value={input.hoursPerDay} onChange={set("hoursPerDay")} max={24} step={.5} /></div> : null}
          {step === 3 ? <div className="field-grid"><label className="select-field"><span className="field-label">{methodT.budget}</span><select value={budget} onChange={(event) => { const next = budgetOptions.find((item) => item.value === event.target.value)!; setBudget(next.value); set("machinePrice")(next.suggested); }}>{budgetOptions.map(({ value, label, labelZh }) => <option key={value} value={value}>{locale === "zh" ? labelZh : label}</option>)}</select></label><NumberField label={methodT.machine} value={input.machinePrice} onChange={(value) => set("machinePrice")(clampMachinePrice(value))} prefix="$" step={100} min={activeBudget.min} max={activeBudget.max} /><label className="select-field"><span className="field-label">{methodT.current}</span><select value={currentMachine} onChange={(event) => setCurrentMachine(event.target.value)}>{machineOptions.map(([value, label, labelZh]) => <option key={value} value={value}>{locale === "zh" ? labelZh : label}</option>)}</select></label></div> : null}
          <div className="quest-nav"><button className="button button-ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft weight="bold" />{t.back}</button><button className="button button-primary" onClick={advance}>{step === 3 ? t.report : t.next}<ArrowRight weight="bold" /></button></div>
        </div>
      </div>
      <aside className="live-score">
        <p>{t.live}</p>
        <div><span>{t.profit}</span><strong>{formatCurrency(result.grossProfitPerItem, 2)}</strong></div>
        <div><span>{t.monthly}</span><strong>{formatCurrency(result.monthlyGrossProfit)}</strong></div>
        <div><span>{t.payback}</span><strong>{result.paybackMonths ? `${formatNumber(result.paybackMonths, 1)} ${t.month}` : "—"}</strong></div>
        <div><span>{t.margin}</span><strong>{formatNumber(result.marginPercent, 0)}%</strong></div>
        {!result.isProfitable ? <p className="profit-warning"><Warning weight="bold" />{t.negative}</p> : null}
      </aside>
    </section>
  );
}
