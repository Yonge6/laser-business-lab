"use client";

import { useLanguage } from "@/components/providers/language-provider";
import Image from "next/image";
import Link from "next/link";
import { guidePath } from "@/lib/learn/guides";
import { assetPath } from "@/lib/site";

export type GuideCard = { slug: string; image: string; title: string; titleZh: string; description: string; descriptionZh: string; category: string; categoryZh: string };
export function GuideShelfView({ cards }: { cards: GuideCard[] }) {
  const { locale } = useLanguage();
  const zh = locale === "zh";
  return <section className="guide-shelf shell" lang={zh ? "zh-CN" : "en-US"} aria-labelledby="us-guides-title">
    <p className="eyebrow">{zh ? "把制作技能变成一门生意" : "THE BUSINESS SIDE OF MAKING"}</p>
    <div className="section-heading"><h2 id="us-guides-title">{zh ? "美国 Maker 商业指南" : "U.S. Maker Guides"}</h2><p>{zh ? "中英双语指南，美元成本示例。在投入之前，先把真实成本算清楚。" : "Bilingual guides. USD examples. Real costs before your next investment."}</p></div>
    <div className="guide-shelf-grid">{cards.map((guide, index) => <Link className="guide-preview" href={guidePath(guide.slug)} key={guide.slug}>
      <div className="guide-preview-image"><Image src={assetPath(guide.image)} alt="" width={640} height={420} sizes="(max-width: 760px) 100vw, 33vw" /></div>
      <div className="guide-preview-copy"><small>0{index + 1} / {zh ? guide.categoryZh : guide.category}</small><h3>{zh ? guide.titleZh : guide.title}</h3><p>{zh ? guide.descriptionZh : guide.description}</p><span>{zh ? "阅读指南" : "Read the guide"} <span aria-hidden="true">↗</span></span></div>
    </Link>)}</div>
  </section>;
}
