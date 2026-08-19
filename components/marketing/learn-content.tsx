"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useLanguage } from "@/components/providers/language-provider";

const pillars = [
  { title: "Make money", titleZh: "开始赚钱", items: ["How much can a laser business make?", "How should you price laser products?", "What maker product should you sell first?"], itemsZh: ["激光生意能赚多少钱？", "激光产品应该如何定价？", "第一款 Maker 产品应该卖什么？"] },
  { title: "Choose a making path", titleZh: "选择制作路径", items: ["Laser vs 3D printing for a first product", "RF vs glass-tube CO₂", "Best setup for personalized drinkware"], itemsZh: ["首款产品选激光还是 3D 打印？", "RF 与玻璃管 CO₂ 如何选择？", "个性化杯子适合什么设备方案？"] },
  { title: "Grow production", titleZh: "扩大生产", items: ["How to reduce setup time", "Batch production without quality drift", "When faster equipment changes the economics"], itemsZh: ["如何减少设置时间？", "如何批量生产而不降低质量？", "更快的设备何时能改变利润模型？"] },
];

export function LearnContent() {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  return (
    <section className="learn-grid shell">
      {pillars.map((pillar) => (
        <article key={pillar.title}>
          <p className="eyebrow">{zh ? "内容支柱" : "CONTENT PILLAR"}</p>
          <h2>{zh ? pillar.titleZh : pillar.title}</h2>
          <ul>{(zh ? pillar.itemsZh : pillar.items).map((item) => <li key={item}>{item}</li>)}</ul>
          <Link href="/calculator">{zh ? "试用免费工具" : "Try a free tool"} <ArrowRight weight="bold" /></Link>
        </article>
      ))}
    </section>
  );
}
