"use client";

import { Lightning, TrendUp } from "@phosphor-icons/react";
import { useMemo } from "react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { NumberField } from "@/components/calculator/number-field";
import { calculateTumblerProfit, type TumblerInput } from "@/lib/calculators/tumbler";
import { formatCurrency, formatNumber } from "@/lib/format";
import { EstimateDisclaimer } from "@/components/results/estimate-disclaimer";
import { TrackedMachineLink } from "@/components/results/tracked-machine-link";

const copy = {
  en: {
    inputs: "Your tumbler numbers",
    blank: "Blank tumbler cost",
    price: "Selling price",
    time: "Engraving time",
    orders: "Orders per day",
    days: "Working days per month",
    profit: "Profit / tumbler",
    daily: "Daily revenue",
    monthly: "Monthly revenue",
    gross: "Monthly gross profit",
    hours: "Production hours",
    shift: "Theoretical output / 8-hour shift",
    faster: "What if production was 3× faster?",
    current: "Current workflow",
    efficiency: "High-efficiency scenario",
    units: "tumblers / shift",
    note: "Capacity is theoretical and does not represent expected demand or guaranteed sales.",
    cta: "See the drinkware production match",
  },
  zh: {
    inputs: "你的杯子业务数字",
    blank: "杯坯成本",
    price: "售价",
    time: "雕刻时间",
    orders: "每天订单量",
    days: "每月工作天数",
    profit: "单杯毛利",
    daily: "每日营收",
    monthly: "月度营收",
    gross: "月度毛利润",
    hours: "生产工时",
    shift: "8 小时理论产量",
    faster: "如果生产速度提高 3 倍？",
    current: "当前流程",
    efficiency: "高效率情景",
    units: "杯 / 班次",
    note: "产能为理论值，不代表预期需求或销售保证。",
    cta: "查看适合杯子生产的设备",
  },
};

export function TumblerCalculator() {
  const { locale } = useLanguage();
  const t = copy[locale];
  const [input, setInput] = useState<TumblerInput>({ blankCost: 7, sellingPrice: 32, engravingMinutes: 4, ordersPerDay: 20, workingDays: 22 });
  const result = useMemo(() => calculateTumblerProfit(input), [input]);
  const set = (key: keyof TumblerInput) => (value: number) => setInput((current) => ({ ...current, [key]: value }));

  return (
    <section className="tumbler-layout shell">
      <div className="tumbler-inputs">
        <p className="eyebrow">01 / INPUTS</p><h2>{t.inputs}</h2>
        <div className="field-grid"><NumberField label={t.blank} value={input.blankCost} onChange={set("blankCost")} prefix="$" step={.5} /><NumberField label={t.price} value={input.sellingPrice} onChange={set("sellingPrice")} prefix="$" step={1} /><NumberField label={t.time} value={input.engravingMinutes} onChange={set("engravingMinutes")} suffix="min" min={.1} step={.5} /><NumberField label={t.orders} value={input.ordersPerDay} onChange={set("ordersPerDay")} /><NumberField label={t.days} value={input.workingDays} onChange={set("workingDays")} max={31} /></div>
      </div>
      <div className="tumbler-report">
        <div className="report-main"><span>{t.profit}</span><strong>{formatCurrency(result.profitPerTumbler, 2)}</strong><small>{t.gross}</small></div>
        <div className="metric-board"><div><small>{t.daily}</small><b>{formatCurrency(result.dailyRevenue)}</b></div><div><small>{t.monthly}</small><b>{formatCurrency(result.monthlyRevenue)}</b></div><div><small>{t.gross}</small><b>{formatCurrency(result.monthlyGrossProfit)}</b></div><div><small>{t.hours}</small><b>{formatNumber(result.productionHours, 1)} h</b></div><div><small>{t.shift}</small><b>{formatNumber(result.outputPerShift)}</b></div></div>
      </div>
      <div className="speed-scenario">
        <header><Lightning weight="fill" /><div><p className="eyebrow">SPEED QUEST</p><h2>{t.faster}</h2></div></header>
        <div className="scenario-grid"><div><span>{t.current}</span><strong>{formatNumber(result.outputPerShift)}</strong><small>{t.units}</small></div><TrendUp weight="bold" /><div className="fast"><span>{t.efficiency}</span><strong>{formatNumber(result.highEfficiencyOutputPerShift)}</strong><small>{t.units}</small></div></div>
        <p>{t.note}</p>
        <TrackedMachineLink machine="vertigo" tool="tumbler_profit" result="drinkware-high-efficiency">{t.cta}</TrackedMachineLink>
      </div>
      <EstimateDisclaimer />
    </section>
  );
}
