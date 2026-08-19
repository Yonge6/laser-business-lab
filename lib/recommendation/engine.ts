import { machines, type Machine, type MachineId } from "@/lib/machines/data";

export type ProductionVolume = "occasional" | "1-10" | "10-30" | "30-100" | "100+";
export type BudgetRange = "under-3" | "3-5" | "5-8" | "8-15" | "15+";
export type Experience = "first" | "beginner" | "growing" | "professional" | "production";

export type FinderAnswers = {
  products: string[];
  priorities: string[];
  volume: ProductionVolume;
  budget: BudgetRange;
  experience: Experience;
};

export type Recommendation = {
  best: Machine;
  alternative: Machine;
  reasons: string[];
  reasonsZh: string[];
  score: number;
  scores: Record<MachineId, number>;
};

const volumeLevel: Record<ProductionVolume, number> = {
  occasional: 1,
  "1-10": 2,
  "10-30": 3,
  "30-100": 4,
  "100+": 5,
};

const budgetTier: Record<BudgetRange, number> = {
  "under-3": 1,
  "3-5": 2,
  "5-8": 3,
  "8-15": 4,
  "15+": 5,
};

const experienceLevel: Record<Experience, number> = {
  first: 1,
  beginner: 2,
  growing: 3,
  professional: 4,
  production: 5,
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

const zhTerms: Record<string, string> = {
  tumblers: "保温杯",
  acrylic: "亚克力",
  wood: "木材",
  leather: "皮革",
  signs: "标牌",
  awards: "奖牌",
  gifts: "礼品",
  "large-format products": "大幅面产品",
  "production runs": "批量生产",
  speed: "速度",
  "fine detail": "精细细节",
  "easy setup": "易于设置",
  "high-volume production": "高产量",
  "large work area": "大工作幅面",
  drinkware: "杯子生产",
  versatility: "多功能",
  "lower upfront investment": "较低初始投入",
};

export function recommendMachines(answers: FinderAnswers): Recommendation {
  const products = answers.products.map(normalize);
  const priorities = answers.priorities.slice(0, 2).map(normalize);
  const desiredVolume = volumeLevel[answers.volume];
  const selectedBudget = budgetTier[answers.budget];
  const selectedExperience = experienceLevel[answers.experience];

  const ranked = machines
    .map((machine) => {
      let score = 0;
      const reasons: string[] = [];
      const reasonsZh: string[] = [];
      const tags = machine.tags.map(normalize);

      for (const product of products) {
        if (tags.includes(product)) {
          const points = product === "tumblers" && machine.id === "vertigo" ? 10 : 6;
          score += points;
          reasons.push(`${machine.name.replace("OneLaser ", "")} is configured for ${product}.`);
          reasonsZh.push(`${machine.name.replace("OneLaser ", "")} 的配置适合${zhTerms[product] ?? product}类产品。`);
        }
      }

      for (const priority of priorities) {
        if (tags.includes(priority)) {
          score += priority === "fine detail" && machine.id === "xrf" ? 7 : 5;
          reasons.push(`Its strengths align with your ${priority} priority.`);
          reasonsZh.push(`它的优势与你选择的“${zhTerms[priority] ?? priority}”优先目标一致。`);
        }
      }

      const productionGap = Math.abs(machine.productionLevel - desiredVolume);
      score += Math.max(0, 5 - productionGap * 2);
      if (productionGap <= 1) {
        reasons.push("Its production level matches your expected job volume.");
        reasonsZh.push("它的生产能力与你预计的任务量相匹配。");
      }

      const budgetGap = machine.budgetTier - selectedBudget;
      if (budgetGap <= 0) {
        score += 5;
        reasons.push("Its current starting price fits the budget range you selected.");
        reasonsZh.push("当前起售价符合你选择的预算范围。");
      } else {
        score -= budgetGap * 4;
      }

      if (selectedExperience <= 2 && ["xrf", "vertigo"].includes(machine.id)) score += 2;
      if (selectedExperience >= 4 && ["cobra", "hydra"].includes(machine.id)) score += 3;

      return { machine, score, reasons: [...new Set(reasons)].slice(0, 4), reasonsZh: [...new Set(reasonsZh)].slice(0, 4) };
    })
    .sort((a, b) => b.score - a.score || a.machine.price - b.machine.price);

  const best = ranked[0];
  const alternative = ranked[1];
  return {
    best: best.machine,
    alternative: alternative.machine,
    reasons: best.reasons.length ? best.reasons : ["This is the closest balanced match across your products, volume, and budget."],
    reasonsZh: best.reasonsZh.length ? best.reasonsZh : ["这是在产品、产量和预算之间最均衡的匹配。"],
    score: best.score,
    scores: Object.fromEntries(ranked.map((item) => [item.machine.id, item.score])) as Record<MachineId, number>,
  };
}
