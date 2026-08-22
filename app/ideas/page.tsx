import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { SeoOpportunityCatalog } from "@/components/marketing/seo-opportunity-catalog";

export const metadata: Metadata = {
  title: "Maker Product Ideas to Sell: Laser, 3D Print & Heat Press",
  description: "Compare seven maker product ideas with public market references, estimated margin, validation plans, profit calculators, and equipment-fit guides.",
  alternates: { canonical: "/ideas" },
};

export default function IdeasPage() {
  return <main><PageHero eyebrow="PRODUCT IDEAS / MARKET SIGNALS" eyebrowZh="产品创意 / 市场信号" title="Find a product worth testing." titleZh="找到值得测试的产品。" description="Explore business-first product ideas for laser engraving, 3D printing, and heat press—each with a buyer, public reference, profit model, and equipment path." descriptionZh="探索激光雕刻、3D 打印与热压转印的商业型产品机会；每个方向都有目标买家、公开参考、利润模型和设备路径。" marker="IDEAS" markerZh="创意" /><SeoOpportunityCatalog /></main>;
}
