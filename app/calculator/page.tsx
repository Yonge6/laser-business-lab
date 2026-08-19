import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { CalculatorIndex } from "@/components/marketing/calculator-index";

export const metadata: Metadata = { title: "Free Maker Business Calculators", description: "Free profit, ROI, tumbler, and machine fit tools for maker businesses." };

export default function CalculatorIndexPage() {
  return <main><PageHero eyebrow="FREE MAKER BUSINESS TOOLS" eyebrowZh="免费 MAKER 商业工具" title="Put your business idea through the lab." titleZh="把你的商业想法放进实验室。" description="Use your own prices, costs, time, volume, and goals. Every result stays explainable." descriptionZh="使用你自己的售价、成本、时间、产量和目标，每个结果都可以解释。" marker="TOOLS" markerZh="工具" /><CalculatorIndex /></main>;
}
