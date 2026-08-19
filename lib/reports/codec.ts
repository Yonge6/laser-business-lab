import type { RoiInput, RoiResult } from "@/lib/calculators/roi";

export type SharedReport = {
  version: 1;
  kind: "roi";
  product: string;
  input: Pick<RoiInput, "sellingPrice" | "materialCost" | "packagingCost" | "monthlyOrders" | "productionMinutes" | "machinePrice">;
  result: Pick<RoiResult, "grossProfitPerItem" | "monthlyGrossProfit" | "productionHours" | "paybackMonths" | "profiles">;
};

function toBase64(value: string) {
  if (typeof Buffer !== "undefined") return Buffer.from(value, "utf8").toString("base64url");
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64(value: string) {
  if (typeof Buffer !== "undefined") return Buffer.from(value, "base64url").toString("utf8");
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

export function encodeReport(report: SharedReport) {
  return toBase64(JSON.stringify(report));
}

export function decodeReport(value: string): SharedReport | null {
  try {
    if (!value || value.length > 2_000) return null;
    const parsed = JSON.parse(fromBase64(value)) as Partial<SharedReport>;
    if (parsed.version !== 1 || parsed.kind !== "roi" || !parsed.input || !parsed.result || typeof parsed.product !== "string") return null;
    const finiteValues = [
      parsed.input.sellingPrice,
      parsed.input.materialCost,
      parsed.input.packagingCost,
      parsed.input.monthlyOrders,
      parsed.input.productionMinutes,
      parsed.input.machinePrice,
      parsed.result.grossProfitPerItem,
      parsed.result.monthlyGrossProfit,
      parsed.result.productionHours,
    ];
    if (!finiteValues.every((item) => typeof item === "number" && Number.isFinite(item) && item >= 0)) return null;
    return parsed as SharedReport;
  } catch {
    return null;
  }
}
