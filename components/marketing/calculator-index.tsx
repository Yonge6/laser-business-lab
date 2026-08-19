"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Crosshair, Flask } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const tools = [
  { icon: Calculator, title: "Product ROI Calculator", titleZh: "产品 ROI 计算器", description: "Calculate margin, capacity, and equipment payback for laser, 3D-printing, or heat-press products.", descriptionZh: "分别计算激光、3D 打印或热压转印产品的毛利、产能和设备回本周期。", href: "/calculator/laser-roi", marker: "01" },
  { icon: Flask, title: "Tumbler Profit Calculator", titleZh: "保温杯利润计算器", description: "Model drinkware revenue, gross profit, production hours, and speed scenarios.", descriptionZh: "模拟杯子营收、毛利润、生产工时和效率情景。", href: "/calculator/tumbler-profit", marker: "02" },
  { icon: Crosshair, title: "Maker Equipment Finder", titleZh: "Maker 设备匹配器", description: "Choose laser, 3D printing, or heat press, then get a transparent equipment-category match.", descriptionZh: "先选择激光、3D 打印或热压转印，再获得透明的设备类别匹配。", href: "/calculator/machine-finder", marker: "03" },
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
