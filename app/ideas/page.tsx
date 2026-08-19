import { PageHero } from "@/components/marketing/page-hero";
import { IdeasCta } from "@/components/marketing/ideas-cta";

export default function IdeasPage() {
  return <main><PageHero eyebrow="PRODUCT IDEAS" eyebrowZh="产品创意" title="Find a product worth testing." titleZh="找到值得测试的产品。" description="Product ideas now live inside the ranked Maker Opportunity Finder." descriptionZh="产品创意现已整合到 Maker 产品机会发现器，并按商业潜力排序。" marker="IDEAS" markerZh="创意" /><IdeasCta /></main>;
}
