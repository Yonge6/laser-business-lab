export type OpportunityCategory = "laser" | "3d-printing";

export type Opportunity = {
  id: string;
  rank: number;
  title: string;
  titleZh: string;
  category: OpportunityCategory;
  process: string;
  processZh: string;
  score: number;
  sellingPrice: number;
  materialCost: number;
  grossProfit: number;
  productionMinutes: number;
  image: string;
  demand: number;
  margin: number;
  competition: number;
  skill: number;
  speed: number;
  tags: string[];
  channels: string[];
  equipmentTags: string[];
  startingBudget: number;
  evidence: string;
  evidenceZh: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "personalized-tumblers",
    rank: 1,
    title: "Personalized Tumblers",
    titleZh: "个性化保温杯",
    category: "laser",
    process: "Laser engraving",
    processZh: "激光雕刻",
    score: 82,
    sellingPrice: 32,
    materialCost: 8.2,
    grossProfit: 23.8,
    productionMinutes: 4,
    image: "/images/personalized-tumbler.png",
    demand: 84,
    margin: 86,
    competition: 58,
    skill: 72,
    speed: 90,
    tags: ["personalized", "gifts", "events", "side-income", "repeat-orders"],
    channels: ["Etsy", "Craft fairs", "Corporate gifts"],
    equipmentTags: ["tumblers", "drinkware", "speed"],
    startingBudget: 3_000,
    evidence: "Strong personalization fit with repeatable blanks and simple price testing.",
    evidenceZh: "标准化杯坯便于测试定价，也适合个性化与重复订单。",
  },
  {
    id: "3d-desk-organizers",
    rank: 2,
    title: "3D-Printed Desk Organizers",
    titleZh: "3D 打印桌面收纳",
    category: "3d-printing",
    process: "3D printing",
    processZh: "3D 打印",
    score: 76,
    sellingPrice: 29.99,
    materialCost: 11.59,
    grossProfit: 18.4,
    productionMinutes: 210,
    image: "/images/3d-desk-organizer.png",
    demand: 76,
    margin: 72,
    competition: 62,
    skill: 66,
    speed: 44,
    tags: ["home", "desk", "functional", "first-sale", "design"],
    channels: ["Etsy", "Shopify", "Local offices"],
    equipmentTags: ["3d-printing", "functional-parts"],
    startingBudget: 500,
    evidence: "Functional products can be differentiated through size, modularity, and niche fit.",
    evidenceZh: "功能型产品可通过尺寸、模块化和细分场景形成差异。",
  },
  {
    id: "acrylic-wedding-signs",
    rank: 3,
    title: "Acrylic Wedding Signs",
    titleZh: "亚克力婚礼标牌",
    category: "laser",
    process: "Laser cutting",
    processZh: "激光切割",
    score: 73,
    sellingPrice: 59.99,
    materialCost: 32.39,
    grossProfit: 27.6,
    productionMinutes: 24,
    image: "/images/acrylic-wedding-sign.png",
    demand: 74,
    margin: 69,
    competition: 55,
    skill: 70,
    speed: 68,
    tags: ["weddings", "events", "personalized", "premium", "local"],
    channels: ["Etsy", "Wedding planners", "Local venues"],
    equipmentTags: ["acrylic", "signs", "large work area"],
    startingBudget: 5_000,
    evidence: "Higher-ticket event products reward personalization and local partnerships.",
    evidenceZh: "高客单活动产品适合个性化，并能通过本地婚庆合作获客。",
  },
];

export const opportunityById = Object.fromEntries(opportunities.map((item) => [item.id, item])) as Record<string, Opportunity>;
