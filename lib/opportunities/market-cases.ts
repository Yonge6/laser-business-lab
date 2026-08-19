import type { Opportunity } from "@/lib/opportunities/data";

export type MarketCase = {
  opportunityId: Opportunity["id"];
  platform: "Etsy";
  title: string;
  titleZh: string;
  signal: string;
  signalZh: string;
  price?: string;
  sourceUrl: string;
  checkedAt: string;
};

export const marketCases: MarketCase[] = [
  {
    opportunityId: "personalized-tumblers",
    platform: "Etsy",
    title: "Personalized 20 oz laser-engraved tumbler",
    titleZh: "个性化 20 oz 激光雕刻保温杯",
    signal: "2.1K item reviews · 6,192 favorites",
    signalZh: "2,100+ 条商品评价 · 6,192 次收藏",
    sourceUrl: "https://www.etsy.com/listing/1691101525/personalized-20-oz-tumbler-custom-name",
    checkedAt: "2026-08-19",
  },
  {
    opportunityId: "3d-desk-organizers",
    platform: "Etsy",
    title: "Modern 3D-printed desk organizer",
    titleZh: "现代 3D 打印桌面收纳",
    signal: "Star Seller · 5.0 rating · 328 shop sales",
    signalZh: "明星卖家 · 5.0 评分 · 店铺 328 笔销量",
    sourceUrl: "https://www.etsy.com/listing/4394931482/modern-desk-organizer-3d-printed-pen",
    checkedAt: "2026-08-19",
  },
  {
    opportunityId: "acrylic-wedding-signs",
    platform: "Etsy",
    title: "Personalized acrylic wedding welcome sign",
    titleZh: "个性化亚克力婚礼欢迎牌",
    signal: "263 item reviews · 9,165 favorites",
    signalZh: "263 条商品评价 · 9,165 次收藏",
    price: "$147.10–$196.14",
    sourceUrl: "https://www.etsy.com/listing/759547412/personalized-acrylic-wedding-welcome",
    checkedAt: "2026-08-19",
  },
];

export const marketCaseByOpportunity = Object.fromEntries(
  marketCases.map((marketCase) => [marketCase.opportunityId, marketCase]),
) as Record<Opportunity["id"], MarketCase>;
