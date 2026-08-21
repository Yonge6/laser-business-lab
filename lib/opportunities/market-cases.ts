import type { Opportunity } from "@/lib/opportunities/data";
import { withElianSource } from "@/lib/commerce/outbound";

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

const rawMarketCases: MarketCase[] = [
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
  {
    opportunityId: "laser-leather-patches",
    platform: "Etsy",
    title: "Custom laser-engraved leather patches",
    titleZh: "定制激光雕刻真皮章",
    signal: "64 item reviews · 7.8K shop sales",
    signalZh: "64 条商品评价 · 店铺 7,800+ 笔销量",
    price: "$11.00",
    sourceUrl: "https://www.etsy.com/listing/867100012/custom-leather-patches-laser-engraved",
    checkedAt: "2026-08-19",
  },
  {
    opportunityId: "3d-geometric-planters",
    platform: "Etsy",
    title: "3D-printed indoor planter with drainage",
    titleZh: "带排水结构的 3D 打印室内花盆",
    signal: "5 item reviews · 24.6K shop sales",
    signalZh: "5 条商品评价 · 店铺 24,600+ 笔销量",
    sourceUrl: "https://www.etsy.com/listing/1695765063/indoor-blue-planter-pot-3d-printed",
    checkedAt: "2026-08-19",
  },
  {
    opportunityId: "layered-wood-wall-art",
    platform: "Etsy",
    title: "Multi-layer laser-cut wood wall art",
    titleZh: "多层激光切割木艺壁饰",
    signal: "1,412 favorites · 2.4K shop sales",
    signalZh: "1,412 次收藏 · 店铺 2,400+ 笔销量",
    sourceUrl: "https://www.etsy.com/listing/4307358815/multilayer-wooden-wall-art-sunburst",
    checkedAt: "2026-08-19",
  },
  {
    opportunityId: "heat-press-tote-bags",
    platform: "Etsy",
    title: "Personalized bridesmaid tote with heat-transfer vinyl",
    titleZh: "热转印乙烯膜定制伴娘托特包",
    signal: "Star Seller · 4.9 shop rating · 38.4K reviews",
    signalZh: "明星卖家 · 店铺 4.9 评分 · 38,400+ 条评价",
    sourceUrl: "https://www.etsy.com/listing/699357267/personalized-bridesmaid-tote-bag-custom",
    checkedAt: "2026-08-19",
  },
];

export const marketCases = rawMarketCases.map((marketCase) => ({
  ...marketCase,
  sourceUrl: withElianSource(marketCase.sourceUrl),
}));

export const marketCaseByOpportunity = Object.fromEntries(
  marketCases.map((marketCase) => [marketCase.opportunityId, marketCase]),
) as Record<Opportunity["id"], MarketCase>;
