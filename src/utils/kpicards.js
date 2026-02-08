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