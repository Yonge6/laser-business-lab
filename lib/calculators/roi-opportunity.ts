import { opportunityById } from "@/lib/opportunities/data";

export function roiOpportunity(productId: string | null | undefined) {
  return productId && Object.hasOwn(opportunityById, productId)
    ? opportunityById[productId]
    : undefined;
}
