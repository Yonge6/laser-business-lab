import { GuideShelf } from "@/components/marketing/guide-shelf";
import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { LearnContent } from "@/components/marketing/learn-content";

export const metadata: Metadata = { alternates: { canonical: "/learn/" }, title: "U.S. Maker Business Guides & Pricing", description: "Practical U.S. maker business guides: laser engraving startup costs, Etsy tumbler pricing, and 3D print costs with USD examples and free calculators." };

export default function LearnPage() {
  return <main><PageHero eyebrow="LEARN / MAKER BUSINESS PLAYBOOK" eyebrowZh="学习 / MAKER 赚钱指南" title="Pick it. Price it. Make it. Scale it." titleZh="选对产品，算清利润，再扩大生产。" description="Practical guides for choosing a product, setting a price, selecting a making path, and knowing when equipment will actually pay back." descriptionZh="从选品、定价、制作路径到设备回本，用可以直接执行的方法，帮你把 Maker 技能变成一门更清楚的生意。" marker="LEARN" markerZh="实战" /><GuideShelf /><LearnContent /></main>;
}
