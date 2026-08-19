export type EquipmentMethod = "laser" | "3d-printing";
export type EquipmentBudget = "entry" | "starter" | "growth" | "production";
export type EquipmentVolume = "occasional" | "1-10" | "10-30" | "30-100" | "100+";
export type EquipmentExperience = "first" | "beginner" | "growing" | "professional" | "production";

export type EquipmentAnswers = {
  method: EquipmentMethod;
  products: string[];
  priorities: string[];
  volume: EquipmentVolume;
  budget: EquipmentBudget;
  experience: EquipmentExperience;
};

export type EquipmentProfile = {
  id: string;
  method: EquipmentMethod;
  name: string;
  nameZh: string;
  category: string;
  categoryZh: string;
  description: string;
  descriptionZh: string;
  investment: string;
  investmentZh: string;
  tags: string[];
  budgetLevel: number;
};

const profiles: EquipmentProfile[] = [
  { id: "diode-laser", method: "laser", name: "Diode laser starter setup", nameZh: "二极管激光入门方案", category: "Accessible laser entry", categoryZh: "低门槛激光入门", description: "Best for testing wood, leather, and gift demand with a lower initial commitment.", descriptionZh: "适合以较低初始投入测试木材、皮革和礼品需求。", investment: "Entry investment", investmentZh: "入门级投入", tags: ["wood", "leather", "gifts", "easy setup", "lower upfront investment", "occasional", "first", "beginner"], budgetLevel: 0 },
  { id: "desktop-co2", method: "laser", name: "Enclosed desktop CO₂ setup", nameZh: "封闭式桌面 CO₂ 方案", category: "Versatile laser production", categoryZh: "多用途激光生产", description: "A balanced path for acrylic, signs, wood, gifts, and repeatable small-batch work.", descriptionZh: "适合亚克力、标牌、木制品、礼品和可重复的小批量生产。", investment: "Starter to growth investment", investmentZh: "起步至成长级投入", tags: ["acrylic", "signs", "wood", "gifts", "versatility", "fine detail", "easy setup", "1-10", "10-30", "beginner", "growing"], budgetLevel: 1 },
  { id: "fiber-laser", method: "laser", name: "Fiber marking setup", nameZh: "光纤激光打标方案", category: "Fast metal personalization", categoryZh: "高速金属个性化", description: "Built for coated drinkware, metal awards, fine marks, and short cycle times.", descriptionZh: "适合涂层杯、金属奖牌、精细打标和短周期生产。", investment: "Growth investment", investmentZh: "成长级投入", tags: ["tumblers", "awards", "fine detail", "speed", "drinkware", "10-30", "30-100", "growing", "professional"], budgetLevel: 2 },
  { id: "production-co2", method: "laser", name: "Large-format production CO₂ setup", nameZh: "大幅面生产型 CO₂ 方案", category: "High-output laser production", categoryZh: "高产能激光生产", description: "Designed for large signs, production runs, higher throughput, and shop-scale workflows.", descriptionZh: "面向大型标牌、批量订单、更高产能和工作室级流程。", investment: "Production investment", investmentZh: "生产级投入", tags: ["large-format products", "production runs", "speed", "high-volume production", "large work area", "30-100", "100+", "professional", "production"], budgetLevel: 3 },
  { id: "open-fdm", method: "3d-printing", name: "Open-frame FDM starter setup", nameZh: "开放式 FDM 入门方案", category: "Accessible 3D-printing entry", categoryZh: "低门槛 3D 打印入门", description: "A practical way to test organizers, planters, and simple accessories before scaling.", descriptionZh: "适合在扩大投入前测试收纳、花盆和简单配件需求。", investment: "Entry investment", investmentZh: "入门级投入", tags: ["desk organizers", "planters", "custom accessories", "easy setup", "lower upfront investment", "occasional", "1-10", "first", "beginner"], budgetLevel: 0 },
  { id: "enclosed-fdm", method: "3d-printing", name: "Enclosed FDM production setup", nameZh: "封闭式 FDM 生产方案", category: "Reliable functional printing", categoryZh: "稳定的功能件打印", description: "A balanced option for functional parts, tools, replacement pieces, and consistent materials.", descriptionZh: "适合功能零件、工具、替换件和需要材料稳定性的生产。", investment: "Starter to growth investment", investmentZh: "起步至成长级投入", tags: ["functional parts", "tool holders", "replacement parts", "versatility", "fine detail", "1-10", "10-30", "beginner", "growing"], budgetLevel: 1 },
  { id: "multi-material-fdm", method: "3d-printing", name: "Multi-material FDM setup", nameZh: "多材料 FDM 方案", category: "Differentiated visual products", categoryZh: "差异化视觉产品", description: "Best when color, personalization, display value, and reduced manual assembly matter.", descriptionZh: "适合重视颜色、个性化、展示效果和减少手工装配的产品。", investment: "Growth investment", investmentZh: "成长级投入", tags: ["display stands", "personalized gifts", "custom accessories", "fine detail", "versatility", "10-30", "growing", "professional"], budgetLevel: 2 },
  { id: "resin-printing", method: "3d-printing", name: "Resin / SLA detail setup", nameZh: "树脂 / SLA 精细打印方案", category: "High-detail 3D printing", categoryZh: "高精细 3D 打印", description: "Optimized for small, detailed display products where surface finish matters most.", descriptionZh: "面向小型精细展示产品，适合把表面质量放在首位的场景。", investment: "Starter to growth investment", investmentZh: "起步至成长级投入", tags: ["display stands", "personalized gifts", "fine detail", "occasional", "1-10", "beginner", "professional"], budgetLevel: 1 },
  { id: "print-farm", method: "3d-printing", name: "Modular print-farm setup", nameZh: "模块化打印农场方案", category: "Scalable 3D-printing output", categoryZh: "可扩展 3D 打印产能", description: "Built for repeat orders, parallel output, uptime, and production-stage operations.", descriptionZh: "适合重复订单、并行产出、设备利用率和生产型运营。", investment: "Production investment", investmentZh: "生产级投入", tags: ["desk organizers", "functional parts", "production runs", "speed", "high-volume production", "30-100", "100+", "professional", "production"], budgetLevel: 3 },
];

const budgetLevels: Record<EquipmentBudget, number> = { entry: 0, starter: 1, growth: 2, production: 3 };

function score(profile: EquipmentProfile, answers: EquipmentAnswers) {
  const tagScore = [...answers.products, ...answers.priorities, answers.volume, answers.experience]
    .reduce((total, value) => total + (profile.tags.includes(value) ? 16 : 0), 0);
  const selectedBudget = budgetLevels[answers.budget];
  const budgetScore = profile.budgetLevel <= selectedBudget ? 18 - Math.abs(profile.budgetLevel - selectedBudget) * 3 : -24 * (profile.budgetLevel - selectedBudget);
  return 40 + tagScore + budgetScore;
}

function reasonsFor(profile: EquipmentProfile, answers: EquipmentAnswers, zh: boolean) {
  const productMatches = answers.products.filter((item) => profile.tags.includes(item));
  const priorityMatches = answers.priorities.filter((item) => profile.tags.includes(item));
  const reasons: string[] = [];
  if (productMatches.length) reasons.push(zh ? "与你选择的产品类型直接匹配。" : "Directly matches the product types you selected.");
  if (priorityMatches.length) reasons.push(zh ? "支持你最看重的生产优先级。" : "Supports the production priorities that matter most to you.");
  if (profile.tags.includes(answers.volume)) reasons.push(zh ? "适合你预期的日常产量。" : "Fits your expected daily production volume.");
  if (profile.tags.includes(answers.experience)) reasons.push(zh ? "与你当前的 Maker 阶段相符。" : "Fits your current stage as a maker.");
  if (profile.budgetLevel <= budgetLevels[answers.budget]) reasons.push(zh ? "处于你选择的投入级别内。" : "Fits within your selected investment level.");
  return reasons.slice(0, 4);
}

export function recommendEquipment(answers: EquipmentAnswers) {
  const ranked = profiles
    .filter((profile) => profile.method === answers.method)
    .map((profile) => ({ profile, score: score(profile, answers) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0].profile;
  const alternative = ranked[1].profile;
  return {
    best,
    alternative,
    reasons: reasonsFor(best, answers, false),
    reasonsZh: reasonsFor(best, answers, true),
  };
}
