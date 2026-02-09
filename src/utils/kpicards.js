// src/utils/kpicards.js

// ---------- formatters ----------
export const money = (n, currency = "USD", locale = "en-US") => {
  const val = Number(n);
  if (!Number.isFinite(val)) return "-";
  return val.toLocaleString(locale, { style: "currency", currency });
};

export const int = (n, locale = "en-US") => {
  const val = Number(n);
  if (!Number.isFinite(val)) return "-";
  return val.toLocaleString(locale);
};

export const pct = (n) => {
  const val = Number(n);
  if (!Number.isFinite(val)) return "-";
  return `${val.toFixed(2)}%`;
};

export const trendByDiff = (diff) => {
  const val = Number(diff);
  if (!Number.isFinite(val) || val === 0) return "neutral";
  return val < 0 ? "down" : "up";
};

export const formatMonth = (ym) => {
    if (!ym || typeof ym !== "string") return "-";
    const [y, m] = ym.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    if (Number.isNaN(date.getTime())) return ym;
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export const diffClass = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n) || n === 0) return "diff-ok";
  if (Math.abs(n) <= 1) return "diff-warn"; 
  return "diff-bad";
};

// ---------- numbers helpers ----------
export const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const sumBy = (rows, pick) =>
  (Array.isArray(rows) ? rows : []).reduce((acc, r) => acc + toNum(pick(r)), 0);

// ---------- row aggregations ----------
export const sumTaxColumns = (row) =>
  Object.entries(row || {})
    .filter(([k]) => String(k).toUpperCase().endsWith("_TAX"))
    .reduce((acc, [, v]) => acc + toNum(v), 0);

export const sumFeesColumns = (row, keys = [
  "SELLING_FEES",
  "FBA_FEES",
  "OTHER_TRANSACTION_FEES",
  "OTHER",
  "REGULATORY_FEE",
]) =>
  keys.reduce((acc, k) => acc + Math.abs(toNum(row?.[k])), 0);

// ---------- KPI builders ----------
/**
 * mode:
 *  - "PAGE": KPIs = lo que se ve en la tabla (paginated)
 *  - "FILTERED": KPIs = todos los resultados filtrados (filtered)
 */
export const pickKpiRows = ({ mode = "PAGE", paginated = [], filtered = [] }) =>
  mode === "FILTERED" ? (filtered || []) : (paginated || []);

/**
 * Calcula los KPIs para Sales Orders con una sola llamada.
 */
export const buildSalesOrdersKpis = (
  rows,
  { currency = "USD", locale = "en-US" } = {}
) => {
  const grossSales = sumBy(rows, (o) => o?.PRODUCT_SALES);
  const unitsSold = sumBy(rows, (o) => o?.QUANTITY);
  const netTotal = sumBy(rows, (o) => o?.TOTAL);
  const totalTaxes = sumBy(rows, (o) => sumTaxColumns(o));
  const totalFees = sumBy(rows, (o) => sumFeesColumns(o));

  return {
    grossSales: money(grossSales, currency, locale),
    unitsSold: int(unitsSold, locale),
    netTotal: money(netTotal, currency, locale),
    totalTaxes: money(totalTaxes, currency, locale),
    totalFees: money(totalFees, currency, locale),

    // por si querés usar valores raw en charts o tooltips
    raw: { grossSales, unitsSold, netTotal, totalTaxes, totalFees },
  };
};

/**
 * KPIs para Sales Fees
 * rows = paginated (PAGE) o filtered (FILTERED)
 */
export const buildSalesFeesKpis = (
  rows,
  { currency = "USD", locale = "en-US" } = {}
) => {
  const totalAmount = sumBy(rows, (r) => r?.TOTAL ?? r?.total ?? r?.AMOUNT ?? r?.amount);

  const reconciled = rows.filter(
    (r) => String(r?.STATUS ?? r?.status).toUpperCase() === "RECONCILED"
  ).length;

  const pending = rows.filter(
    (r) => String(r?.STATUS ?? r?.status).toUpperCase() === "PENDING"
  ).length;

  const notReconciled = rows.filter(
    (r) => String(r?.STATUS ?? r?.status).toUpperCase() === "NOT_RECONCILED"
  ).length;

  return {
    rows: int(rows.length, locale),
    totalAmount: money(totalAmount, currency, locale),
    reconciled: int(reconciled, locale),
    pending: int(pending, locale),
    notReconciled: int(notReconciled, locale),

    raw: {
      totalAmount,
      reconciled,
      pending,
      notReconciled,
    },
  };
};


// --- Orders Payments KPIs ---
// Reusa la lógica existente en paymentsMath pero lo devuelve ya listo para UI/PDF
import {
  netPaidForOrders,
  uniqueOrdersCount,
  principalTotal,
  amazonCommissionTotal,
  fbaFulfillmentFeesTotal,
} from "./paymentsMath";

export const buildOrdersPaymentsKpis = (
  rows,
  { locale = "en-US" } = {}
) => {
  const safe = Array.isArray(rows) ? rows : [];

  // Estas funciones ya devuelven strings formateados 
  const netPaid = netPaidForOrders(safe);
  const principal = principalTotal(safe);
  const amazonCommission = amazonCommissionTotal(safe);
  const fbaFees = fbaFulfillmentFeesTotal(safe);

  const uniqueOrders = uniqueOrdersCount(safe).toLocaleString(locale);

  return {
    netPaid,
    uniqueOrders,
    principal,
    amazonCommission,
    fbaFees,
  };
};


// --- Refunds Payments KPIs ---
export const buildRefundsPaymentsKpis = (
  rows,
  { currency = "USD", locale = "en-US" } = {}
) => {
  const safe = Array.isArray(rows) ? rows : [];

  const netRefundImpactRaw = sumBy(safe, (r) => r?.amount ?? r?.AMOUNT ?? 0);

  const principalRefundedRaw = sumBy(
    safe.filter((r) => String(r?.AMOUNT_DESCRIPTION ?? "").trim() === "Principal"),
    (r) => r?.amount ?? r?.AMOUNT ?? 0
  );

  const refundCommissionRaw = sumBy(
    safe.filter((r) => {
      const d = String(r?.AMOUNT_DESCRIPTION ?? "").trim();
      return d === "Commission" || d === "RefundCommission";
    }),
    (r) => r?.amount ?? r?.AMOUNT ?? 0
  );

  const taxRefundedRaw = sumBy(
    safe.filter((r) => String(r?.AMOUNT_DESCRIPTION ?? "").trim() === "Tax"),
    (r) => r?.amount ?? r?.AMOUNT ?? 0
  );

  return {
    netRefundImpact: money(netRefundImpactRaw, currency, locale),
    principalRefunded: money(principalRefundedRaw, currency, locale),
    refundCommission: money(refundCommissionRaw, currency, locale),
    taxRefunded: money(taxRefundedRaw, currency, locale),
    raw: {
      netRefundImpactRaw,
      principalRefundedRaw,
      refundCommissionRaw,
      taxRefundedRaw,
    },
  };
};
