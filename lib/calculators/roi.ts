export type RoiInput = {
  sellingPrice: number;
  materialCost: number;
  packagingCost: number;
  productionMinutes: number;
  monthlyOrders: number;
  workingDays: number;
  hoursPerDay: number;
  machinePrice: number;
};

export type RoiResult = {
  grossProfitPerItem: number;
  marginPercent: number;
  monthlyRevenue: number;
  monthlyGrossProfit: number;
  annualGrossProfit: number;
  productionHours: number;
  availableHours: number;
  capacityUtilization: number;
  paybackMonths: number | null;
  isProfitable: boolean;
  profiles: string[];
};

const safeNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

export function calculateRoi(input: RoiInput): RoiResult {
  const sellingPrice = safeNumber(input.sellingPrice, 0, 1_000_000);
  const materialCost = safeNumber(input.materialCost, 0, 1_000_000);
  const packagingCost = safeNumber(input.packagingCost, 0, 1_000_000);
  const productionMinutes = safeNumber(input.productionMinutes, 0.1, 10_000);
  const monthlyOrders = safeNumber(input.monthlyOrders, 0, 1_000_000);
  const workingDays = safeNumber(input.workingDays, 1, 31);
  const hoursPerDay = safeNumber(input.hoursPerDay, 0.1, 24);
  const machinePrice = safeNumber(input.machinePrice, 0, 10_000_000);

  const rawGrossProfit = sellingPrice - materialCost - packagingCost;
  const grossProfitPerItem = Math.max(0, rawGrossProfit);
  const monthlyRevenue = sellingPrice * monthlyOrders;
  const monthlyGrossProfit = grossProfitPerItem * monthlyOrders;
  const productionHours = (monthlyOrders * productionMinutes) / 60;
  const availableHours = workingDays * hoursPerDay;
  const capacityUtilization = availableHours > 0 ? (productionHours / availableHours) * 100 : 0;
  const marginPercent = sellingPrice > 0 ? (rawGrossProfit / sellingPrice) * 100 : 0;
  const isProfitable = rawGrossProfit > 0 && monthlyOrders > 0;

  const profiles = [
    marginPercent >= 60 ? "HIGH-MARGIN" : marginPercent >= 35 ? "HEALTHY-MARGIN" : "MARGIN-WATCH",
    monthlyOrders >= 250 ? "HIGH-VOLUME" : monthlyOrders >= 80 ? "MEDIUM-VOLUME" : "EARLY-STAGE",
    capacityUtilization >= 75 ? "SPEED-SENSITIVE" : "CAPACITY-AVAILABLE",
  ];

  return {
    grossProfitPerItem,
    marginPercent,
    monthlyRevenue,
    monthlyGrossProfit,
    annualGrossProfit: monthlyGrossProfit * 12,
    productionHours,
    availableHours,
    capacityUtilization,
    paybackMonths: monthlyGrossProfit > 0 ? machinePrice / monthlyGrossProfit : null,
    isProfitable,
    profiles,
  };
}
