import { opportunities, type Opportunity, type OpportunityCategory } from "@/lib/opportunities/data";

export type OpportunityAnswers = {
  interests: string[];
  method: OpportunityCategory | "not-sure";
  budget: "under-500" | "500-3k" | "3-8k" | "8k+";
  hoursPerWeek: "under-5" | "5-15" | "15-30" | "30+";
  goal: "first-sale" | "side-income" | "scale";
};

export type RankedOpportunity = Opportunity & {
  matchScore: number;
  matchReasons: string[];
  matchReasonsZh: string[];
};

const budgetCeiling: Record<OpportunityAnswers["budget"], number> = {
  "under-500": 500,
  "500-3k": 3_000,
  "3-8k": 8_000,
  "8k+": Number.POSITIVE_INFINITY,
};

const timeWeight: Record<OpportunityAnswers["hoursPerWeek"], number> = {
  "under-5": 45,
  "5-15": 120,
  "15-30": 240,
  "30+": 480,
};

export function rankOpportunities(answers: OpportunityAnswers): RankedOpportunity[] {
  const ceiling = budgetCeiling[answers.budget];
  const preferredMinutes = timeWeight[answers.hoursPerWeek];

  return opportunities
    .map((item) => {
      let score = item.score;
      const reasons: string[] = [];
      const reasonsZh: string[] = [];

      if (answers.method === "not-sure" || answers.method === item.category) {
        score += answers.method === item.category ? 12 : 4;
        reasons.push(answers.method === "not-sure" ? "Keeps your making path flexible." : "Matches your preferred making method.");
        reasonsZh.push(answers.method === "not-sure" ? "保留制造方式的灵活性。" : "符合你偏好的制造方式。");
      } else {
        score -= 10;
      }

      const matchingInterests = answers.interests.filter((interest) => item.tags.includes(interest));
      score += matchingInterests.length * 7;
      if (matchingInterests.length) {
        reasons.push(`Fits ${matchingInterests.join(" and ")} demand.`);
        reasonsZh.push(`符合${matchingInterests.join("、")}方向。`);
      }

      if (item.startingBudget <= ceiling) {
        score += 8;
        reasons.push("Can be explored within your stated starting budget.");
        reasonsZh.push("可在你设定的启动预算内探索。");
      } else {
        score -= 8;
      }

      if (item.productionMinutes <= preferredMinutes) score += 5;
      if (item.tags.includes(answers.goal)) score += 6;
      if (answers.goal === "scale" && item.speed >= 70) score += 5;

      return {
        ...item,
        matchScore: Math.max(0, Math.min(100, Math.round(score))),
        matchReasons: reasons.slice(0, 3),
        matchReasonsZh: reasonsZh.slice(0, 3),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || b.score - a.score);
}
