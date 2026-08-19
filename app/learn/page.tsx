import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { LearnContent } from "@/components/marketing/learn-content";

export const metadata: Metadata = { title: "Learn", description: "Business-first guides for maker products, equipment decisions, pricing, and production." };

export default function LearnPage() {
  return <main><PageHero eyebrow="LEARN / MAKER BUSINESS PLAYBOOK" eyebrowZh="学习 / MAKER 赚钱指南" title="Pick it. Price it. Make it. Scale it." titleZh="选对产品，算清利润，再扩大生产。" description="Practical guides for choosing a product, setting a price, selecting a making path, and knowing when equipment will actually pay back." descriptionZh="从选品、定价、制作路径到设备回本，用可以直接执行的方法，帮你把 Maker 技能变成一门更清楚的生意。" marker="LEARN" markerZh="实战" /><LearnContent /></main>;
}
