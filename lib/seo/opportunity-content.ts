import type { Metadata } from "next";

import { opportunityById, opportunities, type Opportunity } from "@/lib/opportunities/data";
import { marketCaseByOpportunity } from "@/lib/opportunities/market-cases";

export type SeoPageKind = "idea" | "profit" | "equipment";

export type OpportunitySeoProfile = {
  id: Opportunity["id"];
  buyer: string;
  buyerZh: string;
  marketAngle: string;
  marketAngleZh: string;
  seasonalWindow: string;
  seasonalWindowZh: string;
  differentiators: string[];
  differentiatorsZh: string[];
  validationPlan: string[];
  validationPlanZh: string[];
  equipmentCriteria: string[];
  equipmentCriteriaZh: string[];
  risk: string;
  riskZh: string;
};

const profiles: OpportunitySeoProfile[] = [
  {
    id: "personalized-tumblers",
    buyer: "Gift buyers, teams, event organizers, and small companies ordering names or logos",
    buyerZh: "购买礼品的个人、团队、活动组织者，以及需要姓名或 Logo 定制的小企业",
    marketAngle: "A standardized blank keeps production repeatable while names, logos, and event themes create visible personalization value.",
    marketAngleZh: "标准化杯坯让生产可重复，而姓名、Logo 与活动主题能创造清晰的个性化价值。",
    seasonalWindow: "Graduation, team seasons, employee gifts, weddings, and year-end gifting",
    seasonalWindowZh: "毕业季、团队赛季、员工礼品、婚礼与年末送礼",
    differentiators: ["One-name fast turnaround", "Team or company batch packs", "Premium wrap designs with gift-ready packaging"],
    differentiatorsZh: ["单姓名快速交付", "团队或企业批量套装", "高端环绕图案与礼盒包装"],
    validationPlan: ["List three design styles for one 20 oz blank", "Offer single, six-piece, and 24-piece price tiers", "Measure paid orders, artwork revisions, and hands-on minutes"],
    validationPlanZh: ["围绕同一款 20 oz 杯坯上架三种设计风格", "设置单件、6 件与 24 件价格层级", "记录付费订单、改稿次数与主动人工分钟数"],
    equipmentCriteria: ["Reliable rotary workflow and repeatable alignment", "Fast cycle time for names and logos", "Material compatibility for coated drinkware"],
    equipmentCriteriaZh: ["可靠的旋转流程与重复定位", "适合姓名和 Logo 的快速单件周期", "兼容涂层杯类材料"],
    risk: "The headline price can hide artwork time, failed alignment, packaging, and shipping. Quote those costs before accepting batch work.",
    riskZh: "公开售价可能没有覆盖改稿、定位失败、包装与物流。承接批量订单前必须把这些成本计入报价。",
  },
  {
    id: "laser-leather-patches",
    buyer: "Hat makers, apparel decorators, local brands, clubs, and event merchandise sellers",
    buyerZh: "帽饰商家、服装定制店、本地品牌、俱乐部与活动周边卖家",
    marketAngle: "Low material cost and short engraving cycles make patches a practical way to test niches and repeat wholesale orders.",
    marketAngleZh: "低材料成本和短雕刻周期，让皮革章适合测试细分市场并承接重复批发订单。",
    seasonalWindow: "Team launches, local events, outdoor seasons, and holiday merchandise",
    seasonalWindowZh: "团队新品、本地活动、户外季与节日周边",
    differentiators: ["Shape and edge options", "Small-batch logo sampling", "Patch-plus-hat wholesale bundles"],
    differentiatorsZh: ["不同形状与边缘方案", "小批量 Logo 打样", "皮革章加帽子的批发组合"],
    validationPlan: ["Choose two patch materials and three standard sizes", "Ask five local apparel shops for a sample-order quote", "Track setup time separately from engraving time"],
    validationPlanZh: ["选择两种皮革材料与三个标准尺寸", "向五家本地服装店提供试单报价", "把设置时间与雕刻时间分开记录"],
    equipmentCriteria: ["Fine engraving detail at repeatable settings", "Batch fixtures for consistent placement", "Ventilation appropriate for the selected material"],
    equipmentCriteriaZh: ["可重复参数下的精细雕刻", "确保位置一致的批量治具", "适合所选材料的排烟能力"],
    risk: "Material composition varies. Confirm that every leather or leatherette blank is safe to laser before production.",
    riskZh: "不同皮革或仿皮材料成分差异很大，生产前必须确认材料适合激光加工。",
  },
  {
    id: "heat-press-tote-bags",
    buyer: "Wedding parties, school teams, local events, creators, and small brands needing short runs",
    buyerZh: "婚礼团体、学校团队、本地活动、创作者与需要小批量的品牌",
    marketAngle: "A standard tote and ready-to-press transfer create a low-complexity product that can be tested one design at a time.",
    marketAngleZh: "标准托特包配合即烫图案，能形成低复杂度产品，并可逐个设计验证需求。",
    seasonalWindow: "Weddings, school events, festivals, creator drops, and holiday gifting",
    seasonalWindowZh: "婚礼、校园活动、节庆、创作者上新与节日送礼",
    differentiators: ["Event-name personalization", "Coordinated sets for groups", "Premium heavyweight blanks and two-sided prints"],
    differentiatorsZh: ["活动名称个性化", "团队统一套装", "高克重坯料与双面图案"],
    validationPlan: ["Test one blank with three transfer styles", "Record press settings and wash-test results", "Sell a ten-piece event package before expanding the catalog"],
    validationPlanZh: ["用同一坯料测试三种转印风格", "记录热压参数与水洗测试结果", "先卖出一个 10 件活动套装，再扩展目录"],
    equipmentCriteria: ["Even heat and repeatable pressure", "A platen sized for the target tote area", "A workflow that supports 2D transfers and future product shapes"],
    equipmentCriteriaZh: ["均匀加热与可重复压力", "适合托特包图案区域的平台尺寸", "兼容二维转印并能扩展更多产品形状的流程"],
    risk: "The blank, transfer, pressure, and temperature must be tested together. A good press cannot rescue an incompatible transfer recipe.",
    riskZh: "坯料、转印膜、压力与温度必须一起测试；设备再好，也无法弥补不兼容的工艺配方。",
  },
  {
    id: "layered-wood-wall-art",
    buyer: "Home-decor shoppers, gift buyers, interior designers, and hospitality businesses",
    buyerZh: "家居装饰消费者、礼品买家、室内设计师与酒店餐饮商家",
    marketAngle: "Layer count, scale, finish, and personalization support premium versions from one repeatable design system.",
    marketAngleZh: "层数、尺寸、表面处理与个性化选项，可以让同一套可重复设计形成高端版本。",
    seasonalWindow: "Housewarming, weddings, holiday decor, cabin season, and hospitality refreshes",
    seasonalWindowZh: "乔迁、婚礼、节日装饰、度假屋季与商业空间更新",
    differentiators: ["Regional or landscape themes", "Good-better-best size tiers", "Personalized nameplates or dates"],
    differentiatorsZh: ["地域或风景主题", "基础、中档与高端尺寸层级", "姓名牌或日期个性化"],
    validationPlan: ["Prototype one design in two sizes and two finishes", "Photograph depth and edge quality in real rooms", "Pre-sell five units before building finished inventory"],
    validationPlanZh: ["用同一设计制作两种尺寸与两种表面处理", "在真实空间拍摄层次与边缘品质", "先预售 5 件，再建立成品库存"],
    equipmentCriteria: ["Work area matched to the largest sellable size", "Clean cutting across the chosen wood thickness", "Extraction, repeatable registration, and batch throughput"],
    equipmentCriteriaZh: ["工作幅面覆盖最大可售尺寸", "稳定切透所选木材厚度", "排烟、重复定位与批量产能"],
    risk: "Finishing, assembly, warping, packaging, and dimensional shipping can consume more labor than cutting. Time every step.",
    riskZh: "表面处理、组装、变形控制、包装和大件物流可能比切割更耗时，必须逐步计时。",
  },
  {
    id: "3d-desk-organizers",
    buyer: "Remote workers, gamers, hobbyists, offices, and buyers with a specific storage problem",
    buyerZh: "远程工作者、玩家、爱好者、办公室，以及有明确收纳问题的消费者",
    marketAngle: "Function, fit, and modularity give a small maker more defensible differentiation than generic decorative prints.",
    marketAngleZh: "功能、尺寸适配与模块化，比通用装饰摆件更容易形成小型 Maker 的差异化优势。",
    seasonalWindow: "Back-to-school, office refreshes, gaming upgrades, and year-end organization",
    seasonalWindowZh: "开学季、办公室焕新、游戏桌升级与年末整理",
    differentiators: ["Device-specific fit", "Modular add-on system", "Color, label, and cable-management options"],
    differentiatorsZh: ["针对具体设备的尺寸适配", "模块化扩展系统", "颜色、标签与理线选项"],
    validationPlan: ["Interview five users about one desk problem", "Print a minimum viable organizer and test fit", "List the base unit before designing optional modules"],
    validationPlanZh: ["访谈五位用户，确认一个桌面问题", "打印最小可用收纳并测试适配", "先上架基础单元，再设计可选模块"],
    equipmentCriteria: ["Reliable dimensional accuracy", "Build volume for the largest module", "Material and speed options that preserve acceptable finish"],
    equipmentCriteriaZh: ["可靠的尺寸精度", "覆盖最大模块的成型空间", "在可接受表面质量下兼顾材料与速度"],
    risk: "Long machine time and failed prints can erase apparent margin. Include failure rate, electricity, post-processing, and support time.",
    riskZh: "长时间打印和失败件会吞噬表面毛利，必须计入失败率、电费、后处理与客服时间。",
  },
  {
    id: "3d-geometric-planters",
    buyer: "Plant lovers, design-led gift buyers, florists, and independent home-decor shops",
    buyerZh: "植物爱好者、设计型礼品买家、花店与独立家居店",
    marketAngle: "Geometry, color, drainage, and size turn a printable object into a design-led home product.",
    marketAngleZh: "造型、配色、排水与尺寸选择，能把可打印物件变成设计驱动的家居产品。",
    seasonalWindow: "Spring planting, housewarming, Mother’s Day, desk refreshes, and holiday gifts",
    seasonalWindowZh: "春季种植、乔迁、母亲节、桌面焕新与节日礼品",
    differentiators: ["Plant-specific drainage inserts", "Coordinated pot-and-tray sets", "Custom colorways for shops or events"],
    differentiatorsZh: ["针对植物的排水内胆", "花盆与托盘组合", "为商店或活动定制配色"],
    validationPlan: ["Choose one plant size and solve drainage first", "Offer three colorways without changing the model", "Place samples with two local plant shops on a test basis"],
    validationPlanZh: ["先选择一种植物尺寸并解决排水", "模型不变，仅测试三种配色", "与两家本地植物店试放样品"],
    equipmentCriteria: ["Build volume and bed utilization", "Material behavior around water and sunlight", "Consistent surface quality across long prints"],
    equipmentCriteriaZh: ["成型空间与平台利用率", "材料在水分与阳光环境下的表现", "长时间打印中的表面质量一致性"],
    risk: "A decorative planter still needs functional drainage and stable geometry. Test water exposure and fit before describing it as plant-ready.",
    riskZh: "装饰花盆仍需要可靠排水与稳定结构，宣称适合植物前必须测试水环境和尺寸配合。",
  },
  {
    id: "acrylic-wedding-signs",
    buyer: "Couples, wedding planners, venues, photographers, and event-rental businesses",
    buyerZh: "新人、婚礼策划、场地方、摄影师与活动租赁商",
    marketAngle: "A higher-ticket event product rewards visual presentation, personalization, and local service partnerships.",
    marketAngleZh: "高客单活动产品更依赖视觉呈现、个性化与本地服务合作，也更能形成溢价。",
    seasonalWindow: "Engagement season, spring and autumn weddings, showers, and corporate events",
    seasonalWindowZh: "订婚季、春秋婚礼、婚前派对与企业活动",
    differentiators: ["Coordinated sign suites", "Venue delivery or rental options", "Premium color, stand, and floral-ready packages"],
    differentiatorsZh: ["统一视觉的标牌套装", "场地配送或租赁选项", "高端配色、底座与花艺组合"],
    validationPlan: ["Build one welcome-sign sample and one coordinated table sign", "Ask three planners which sizes and lead times sell", "Require a deposit before purchasing custom acrylic colors"],
    validationPlanZh: ["制作一件迎宾牌样品与一件配套桌牌", "向三位策划师了解可售尺寸与交期", "采购特殊颜色亚克力前先收订金"],
    equipmentCriteria: ["Clean acrylic cutting and polished-edge workflow", "Work area for sellable event sizes", "Accurate registration for print, engraving, or layered assembly"],
    equipmentCriteriaZh: ["干净的亚克力切割与边缘处理流程", "覆盖可售活动尺寸的工作幅面", "适合印刷、雕刻或分层组装的准确定位"],
    risk: "Custom artwork, revisions, breakage, local delivery, and rush deadlines must be priced separately from material cost.",
    riskZh: "定制设计、改稿、破损、本地配送与加急交期，必须与材料成本分开计价。",
  },
];

export const opportunitySeoProfiles = Object.fromEntries(profiles.map((profile) => [profile.id, profile])) as Record<Opportunity["id"], OpportunitySeoProfile>;
export const seoOpportunityIds = opportunities.map((opportunity) => opportunity.id);

export function getSeoOpportunity(id: string) {
  const opportunity = opportunityById[id];
  const profile = opportunitySeoProfiles[id];
  const marketCase = marketCaseByOpportunity[id];
  if (!opportunity || !profile || !marketCase) return null;
  return { opportunity, profile, marketCase };
}

export function seoPagePath(kind: SeoPageKind, id: string) {
  if (kind === "profit") return `/profit-calculators/${id}`;
  if (kind === "equipment") return `/equipment/${id}`;
  return `/ideas/${id}`;
}

export function seoPageTitle(kind: SeoPageKind, opportunity: Opportunity) {
  if (kind === "profit") return `${opportunity.title} Profit Calculator & Margin Guide`;
  if (kind === "equipment") return `Best Equipment for ${opportunity.title}`;
  return `${opportunity.title} to Sell: Demand, Margin & Test Plan`;
}

export function seoPageDescription(kind: SeoPageKind, opportunity: Opportunity) {
  if (kind === "profit") return `Model price, material cost, production time, gross profit, and equipment payback for ${opportunity.title.toLowerCase()}.`;
  if (kind === "equipment") return `Choose equipment for ${opportunity.title.toLowerCase()} by workflow, material, production time, investment, and repeatability.`;
  return `Evaluate ${opportunity.title.toLowerCase()} as a maker business: target buyer, listed price signals, estimated margin, differentiation, risks, and a seven-day validation plan.`;
}

export function seoPageMetadata(kind: SeoPageKind, id: string): Metadata {
  const content = getSeoOpportunity(id);
  if (!content) return {};
  const { opportunity } = content;
  const title = seoPageTitle(kind, opportunity);
  const description = seoPageDescription(kind, opportunity);
  const path = seoPagePath(kind, id);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "article", images: [{ url: opportunity.image, alt: opportunity.title }] },
    twitter: { card: "summary_large_image", title, description, images: [opportunity.image] },
  };
}

export function seoFaq(kind: SeoPageKind, id: string) {
  const content = getSeoOpportunity(id);
  if (!content) return [];
  const { opportunity, profile } = content;

  if (kind === "profit") {
    return [
      {
        question: `How much gross profit can ${opportunity.title.toLowerCase()} make per item?`,
        answer: `The current planning estimate is $${opportunity.grossProfit.toFixed(2)} per item from a $${opportunity.sellingPrice.toFixed(2)} selling price minus $${opportunity.materialCost.toFixed(2)} in material. Selling fees, labor, failed pieces, packaging, shipping, tax, and marketing still need to be deducted.`,
        questionZh: `${opportunity.titleZh}每件能有多少毛利？`,
        answerZh: `当前规划估算为：售价 $${opportunity.sellingPrice.toFixed(2)} 减去材料 $${opportunity.materialCost.toFixed(2)}，得到单件毛利 $${opportunity.grossProfit.toFixed(2)}。之后仍需扣除平台费、人工、报废、包装、物流、税费与营销。`,
      },
      {
        question: `What should be included in a ${opportunity.title.toLowerCase()} profit model?`,
        answer: `Include the blank or raw material, consumables, selling fees, active labor, failed units, packaging, shipping subsidies, marketing, and the monthly cost of equipment. Keep machine time separate from hands-on time.`,
        questionZh: `${opportunity.titleZh}利润模型应包含什么？`,
        answerZh: "应包含坯料或原材料、耗材、平台费、主动人工、不良品、包装、物流补贴、营销与设备月度成本，并把机器运行时间和人工操作时间分开。",
      },
      {
        question: "When is the estimate ready for an equipment decision?",
        answer: "Use paid-order evidence, not likes. Compare conservative, expected, and capacity-limit order volumes, then test whether the additional monthly contribution repays the equipment inside your acceptable window.",
        questionZh: "什么时候可以用这个估算决定购买设备？",
        answerZh: "应使用真实付费订单而不是点赞。分别比较保守、预期和产能上限订单量，再验证新增月贡献毛利能否在可接受周期内覆盖设备投资。",
      },
    ];
  }

  if (kind === "equipment") {
    return [
      {
        question: `What matters most when choosing equipment for ${opportunity.title.toLowerCase()}?`,
        answer: `${profile.equipmentCriteria.join("; ")}. Confirm the actual material, work area, safety requirements, workflow, service, and total operating cost before buying.`,
        questionZh: `为${opportunity.titleZh}选择设备时，什么最重要？`,
        answerZh: `${profile.equipmentCriteriaZh.join("；")}。购买前还需核对真实材料、工作区域、安全要求、工作流程、服务与总体运营成本。`,
      },
      {
        question: "Should a maker buy the fastest machine first?",
        answer: "No. Prove the buyer, price, and repeatable workflow first. Speed creates value only after measured demand is being delayed by a production bottleneck.",
        questionZh: "Maker 是否应该先买最快的机器？",
        answerZh: "不应该。先验证买家、售价与可重复流程；只有真实需求被可测量的生产瓶颈拖慢时，速度才创造价值。",
      },
      {
        question: "Is the matched machine a guarantee of business results?",
        answer: "No. It is a workflow-based starting point. Availability, specifications, material safety, local requirements, and business results can change and must be verified independently.",
        questionZh: "匹配设备是否保证商业结果？",
        answerZh: "不保证。它只是基于工作流程的起点；供货、规格、材料安全、本地要求与商业结果都可能变化，必须独立核验。",
      },
    ];
  }

  return [
    {
      question: `Are ${opportunity.title.toLowerCase()} a good product to sell?`,
      answer: `${profile.marketAngle} The current model estimates $${opportunity.grossProfit.toFixed(2)} gross profit before fees and labor, but the idea should be validated with paid orders before equipment or inventory is expanded.`,
      questionZh: `${opportunity.titleZh}值得拿来卖吗？`,
      answerZh: `${profile.marketAngleZh} 当前模型估算在平台费和人工前有 $${opportunity.grossProfit.toFixed(2)} 单件毛利，但扩大设备或库存前仍应先用付费订单验证。`,
    },
    {
      question: `Who buys ${opportunity.title.toLowerCase()}?`,
      answer: profile.buyer,
      questionZh: `谁会购买${opportunity.titleZh}？`,
      answerZh: profile.buyerZh,
    },
    {
      question: "What is the safest first test?",
      answer: `${profile.validationPlan.join("; ")}. The first objective is learning which buyer and offer converts, not building a large catalog.`,
      questionZh: "最稳妥的第一次测试是什么？",
      answerZh: `${profile.validationPlanZh.join("；")}。第一次测试的目标是确认哪类买家和方案会成交，而不是建立庞大目录。`,
    },
  ];
}

export function seoJsonLd(kind: SeoPageKind, id: string, siteUrl = "https://maker.wonderelian.com") {
  const content = getSeoOpportunity(id);
  if (!content) return null;
  const { opportunity, profile } = content;
  const title = seoPageTitle(kind, opportunity);
  const description = seoPageDescription(kind, opportunity);
  const path = seoPagePath(kind, id);
  const url = `${siteUrl}${path}/`;
  const faq = seoFaq(kind, id);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: title,
      description,
      inLanguage: "en-US",
      image: `${siteUrl}${opportunity.image}`,
      isPartOf: { "@id": `${siteUrl}/#website` },
      datePublished: "2026-08-22",
      dateModified: "2026-08-22",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: kind === "idea" ? "Product ideas" : kind === "profit" ? "Profit calculators" : "Equipment guides", item: `${siteUrl}${kind === "idea" ? "/ideas/" : kind === "profit" ? "/calculator/" : "/calculator/machine-finder/"}` },
        { "@type": "ListItem", position: 3, name: opportunity.title, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
    },
  ];

  if (kind === "idea") {
    graph.push({
      "@type": "HowTo",
      name: `How to validate ${opportunity.title.toLowerCase()} in seven days`,
      description: `A small, paid-demand test for ${opportunity.title.toLowerCase()} before expanding inventory or equipment.`,
      totalTime: "P7D",
      supply: [{ "@type": "HowToSupply", name: opportunity.title }],
      step: profile.validationPlan.map((text, index) => ({ "@type": "HowToStep", position: index + 1, name: `Validation step ${index + 1}`, text })),
    });
  }

  if (kind === "profit") {
    graph.push({
      "@type": "WebApplication",
      name: `${opportunity.title} Profit Calculator`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
