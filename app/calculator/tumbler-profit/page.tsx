import type { Metadata } from "next";
import { TumblerCalculator } from "@/components/calculator/tumbler-calculator";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Tumbler Profit Calculator", description: "Estimate tumbler revenue, gross profit, production hours, and theoretical shift capacity." };

export default function TumblerProfitPage() {
  return <main><PageHero eyebrow="FREE TOOL / DRINKWARE SPEED QUEST" title="How much can a tumbler business make?" description="Model your selling price, blank cost, order volume, and production time—then compare a faster workflow." marker="02" /><TumblerCalculator /></main>;
}
