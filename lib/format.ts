export const formatCurrency = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);

export const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(Number.isFinite(value) ? value : 0);
