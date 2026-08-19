import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { LearnContent } from "@/components/marketing/learn-content";

export const metadata: Metadata = { title: "Learn", description: "Business-first guides for maker products, equipment decisions, pricing, and production." };

export default function LearnPage() {
  return <main><PageHero eyebrow="LEARN / BUSINESS-FIRST GUIDES" eyebrowZh="学习 / 商业优先指南" title="Content that ends in a decision." titleZh="让内容最终落到选择。" description="Guides connect directly to a calculator or opportunity test—not a generic buy button." descriptionZh="每篇指南都直接连接到计算器或机会测试，而不是泛泛的购买按钮。" marker="LEARN" markerZh="学习" /><LearnContent /></main>;
}
