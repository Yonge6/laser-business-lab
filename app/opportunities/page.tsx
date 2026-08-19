import type { Metadata } from "next";
import { OpportunityFinder } from "@/components/opportunities/opportunity-finder";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = { title: "Maker Product Opportunity Finder", description: "Find and rank laser and 3D printing product opportunities by demand, margin, competition, time, and equipment fit." };

export default function OpportunitiesPage() {
  return <main><PageHero eyebrow="FREE TOOL / MAKER OPPORTUNITY FINDER" eyebrowZh="免费工具 / MAKER 产品机会发现器" title="What should you make and sell?" titleZh="你应该制作并销售什么？" description="Get a ranked starting path based on your interests, time, budget, and business goal." descriptionZh="根据你的兴趣、时间、预算和商业目标，获得排序后的起步路径。" marker="01" /><OpportunityFinder /></main>;
}
