"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Crosshair, Flask } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const tools = [
  { icon: Calculator, title: "Laser ROI Calculator", titleZh: "激光 ROI 计算器", description: "Calculate margin, monthly gross profit, capacity, and equipment payback.", descriptionZh: "计算毛利、月度毛利润、产能和设备回本周期。", href: "/calculator/laser-roi", marker: "01" },
  { icon: Flask, title: "Tumbler Profit Calculator", titleZh: "保温杯利润计算器", description: "Model drinkware revenue, gross profit, production hours, and speed scenarios.", descriptionZh: "模拟杯子营收、毛利润、生产工时和效率情景。", href: "/calculator/tumbler-profit", marker: "02" },
  { icon: Crosshair, title: "Laser Machine Finder", titleZh: "激光设备匹配器", description: "Turn business needs into a transparent, rules-based equipment match.", descriptionZh: "把商业需求转化为透明、基于规则的设备匹配。", href: "/calculator/machine-finder", marker: "03" },
];

export function CalculatorIndex() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  return (
    <section className="tool-index shell">
      {tools.map(({ icon: Icon, ...tool }) => (
        <Link href={tool.href} key={tool.href}>
          <span>{tool.marker}</span><Icon weight="bold" />
          <h2>{zh ? tool.titleZh : tool.title}</h2>
          <p>{zh ? tool.descriptionZh : tool.description}</p>
          <b>{zh ? "开始使用" : "Start tool"} <ArrowRight weight="bold" /></b>
        </Link>
      ))}
    </section>
  );
}
