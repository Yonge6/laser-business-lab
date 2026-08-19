import type { Metadata } from "next";
import { TumblerCalculator } from "@/components/calculator/tumbler-calculator";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Tumbler Profit Calculator", description: "Estimate tumbler revenue, gross profit, production hours, and theoretical shift capacity." };

export default function TumblerProfitPage() {
  return <main><PageHero eyebrow="FREE TOOL / DRINKWARE SPEED QUEST" eyebrowZh="免费工具 / 杯子效率任务" title="How much can a tumbler business make?" titleZh="保温杯生意能赚多少钱？" description="Model your selling price, blank cost, order volume, and production time—then compare a faster workflow." descriptionZh="输入售价、杯坯成本、订单量和生产时间，再与更快的工作流程比较。" marker="02" /><TumblerCalculator /></main>;
}
