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

// "10-31-2024" -> "2024-10-31"
const mmddyyyyToIso = (mmddyyyy) => {
  const [mm, dd, yyyy] = String(mmddyyyy || "").split("-");
  if (!mm || !dd || !yyyy) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

// "2024-10-31" -> "10/31/2024"
const isoToMMDDYYYY = (iso) => {
  const [y, m, d] = String(iso || "").split("-");
  if (!y || !m || !d) return iso;
  return `${m}/${d}/${y}`;
};

// devuelve "YYYY-MM-DD" o null
const toIsoDay = (r) => {
  const raw = r?.DATE || r?.date || "";
  const s = String(raw).trim();

  // ISO: 2024-10-31 o 2024-10-31T...
  const isoMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  // MM-DD-YYYY o MM/DD/YYYY
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const mm = String(m[1]).padStart(2, "0");
    const dd = String(m[2]).padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  // fallback: DATE_TIME
  const dtRaw = r?.DATE_TIME || r?.date_time;
  if (dtRaw) {
    const dt = new Date(dtRaw);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
  }

  return null;
};

export const groupRefundsByDate = (refunds = []) => {
  const map = new Map(); // iso -> count

  for (const r of refunds || []) {
    const iso = toIsoDay(r);
    if (!iso) continue;
    map.set(iso, (map.get(iso) || 0) + 1);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, count]) => ({ date: iso, count }));
};



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
