export const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;

  if (typeof v === "number") return Number.isFinite(v) ? v : 0;

  const cleaned = String(v).replace(/[^0-9.-]/g, ""); // saca $, comas, espacios, etc.
  const n = Number(cleaned);

  return Number.isFinite(n) ? n : 0;
};

export const sumBy = (arr, getValue) =>
  arr.reduce((acc, item) => acc + toNumber(getValue(item)), 0);

export const groupRefundsByReason = (refunds = []) =>
  Object.values(
    refunds.reduce((acc, r) => {
      const reason = r.TYPE || "Other";
      acc[reason] = acc[reason] || { label: reason, value: 0 };
      acc[reason].value += 1;
      return acc;
    }, {})
  );

export const groupRefundsByDate = (refunds = []) =>
  Object.values(
    refunds.reduce((acc, r) => {
      const date = r.DATE;
      if (!date) return acc;

      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

export const formatMoney = (value, symbol = "$") => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";

  return `${symbol}${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const topSkusByRefundAmount = (refunds = [], limit = 5) => {
  const map = refunds.reduce((acc, r) => {
    const sku = r.SKU || "Unknown";
    const amount = Math.abs(Number(r.PRODUCT_SALES) || 0);
    acc[sku] = (acc[sku] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(map)
    .map(([sku, total]) => ({ sku, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export const refundBreakdownTotals = (refunds = []) => {
  const principal = refunds.reduce(
    (acc, r) => acc + Math.abs(Number(r.PRODUCT_SALES) || 0),
    0
  );

  const tax = refunds.reduce((acc, r) => {
    const sumTax =
      (Number(r.PRODUCT_SALES_TAX) || 0) +
      (Number(r.SHIPPING_CREDITS_TAX) || 0) +
      (Number(r.GIFTWRAP_CREDITS_TAX) || 0) +
      (Number(r.PROMOTIONAL_REBATES_TAX) || 0) +
      (Number(r.TAX_ON_REGULATORY_FEE) || 0) +
      (Number(r.MARKETPLACE_WITHHELD_TAX) || 0);
    return acc + Math.abs(sumTax);
  }, 0);

  const fees = refunds.reduce((acc, r) => {
    const sumFees =
      (Number(r.SELLING_FEES) || 0) +
      (Number(r.FBA_FEES) || 0) +
      (Number(r.OTHER) || 0) +
      (Number(r.OTHER_TRANSACTION_FEES) || 0) +
      (Number(r.REGULATORY_FEE) || 0);
    return acc + Math.abs(sumFees);
  }, 0);

  return { principal, tax, fees };
};
