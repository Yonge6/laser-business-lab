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
      const tags = machine.tags.map(normalize);

      for (const product of products) {
        if (tags.includes(product)) {
          const points = product === "tumblers" && machine.id === "vertigo" ? 10 : 6;
          score += points;
          reasons.push(`${machine.name.replace("OneLaser ", "")} is configured for ${product}.`);
        }
      }

      for (const priority of priorities) {
        if (tags.includes(priority)) {
          score += priority === "fine detail" && machine.id === "xrf" ? 7 : 5;
          reasons.push(`Its strengths align with your ${priority} priority.`);
        }
      }

      const productionGap = Math.abs(machine.productionLevel - desiredVolume);
      score += Math.max(0, 5 - productionGap * 2);
      if (productionGap <= 1) reasons.push("Its production level matches your expected job volume.");

      const budgetGap = machine.budgetTier - selectedBudget;
      if (budgetGap <= 0) {
        score += 5;
        reasons.push("Its current starting price fits the budget range you selected.");
      } else {
        score -= budgetGap * 4;
      }

      if (selectedExperience <= 2 && ["xrf", "vertigo"].includes(machine.id)) score += 2;
      if (selectedExperience >= 4 && ["cobra", "hydra"].includes(machine.id)) score += 3;

      return { machine, score, reasons: [...new Set(reasons)].slice(0, 4) };
    })
    .sort((a, b) => b.score - a.score || a.machine.price - b.machine.price);

  const best = ranked[0];
  const alternative = ranked[1];
  return {
    best: best.machine,
    alternative: alternative.machine,
    reasons: best.reasons.length ? best.reasons : ["This is the closest balanced match across your products, volume, and budget."],
    score: best.score,
    scores: Object.fromEntries(ranked.map((item) => [item.machine.id, item.score])) as Record<MachineId, number>,
  };
}
