export type BudgetRange = { min: number; max?: number };

export function clampToBudget(value: number, budget: BudgetRange) {
  const safeValue = Number.isFinite(value) ? value : budget.min;
  return Math.min(budget.max ?? Number.POSITIVE_INFINITY, Math.max(budget.min, safeValue));
}
