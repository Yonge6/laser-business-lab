export type TumblerInput = {
  blankCost: number;
  sellingPrice: number;
  engravingMinutes: number;
  ordersPerDay: number;
  workingDays: number;
};

export type TumblerResult = {
  profitPerTumbler: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  monthlyGrossProfit: number;
  productionHours: number;
  outputPerShift: number;
  highEfficiencyOutputPerShift: number;
  isProfitable: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

export function calculateTumblerProfit(input: TumblerInput): TumblerResult {
  const blankCost = clamp(input.blankCost, 0, 100_000);
  const sellingPrice = clamp(input.sellingPrice, 0, 100_000);
  const engravingMinutes = clamp(input.engravingMinutes, 0.1, 1_440);
  const ordersPerDay = clamp(input.ordersPerDay, 0, 100_000);
  const workingDays = clamp(input.workingDays, 1, 31);
  const rawProfit = sellingPrice - blankCost;
  const profitPerTumbler = Math.max(0, rawProfit);
  const monthlyOrders = ordersPerDay * workingDays;
  const outputPerShift = Math.floor(480 / engravingMinutes);

  return {
    profitPerTumbler,
    dailyRevenue: sellingPrice * ordersPerDay,
    monthlyRevenue: sellingPrice * monthlyOrders,
    monthlyGrossProfit: profitPerTumbler * monthlyOrders,
    productionHours: (monthlyOrders * engravingMinutes) / 60,
    outputPerShift,
    highEfficiencyOutputPerShift: outputPerShift * 3,
    isProfitable: rawProfit > 0 && ordersPerDay > 0,
  };
}
