import { toNumber } from "./refundMath";

export const ORANGE = {
  main: "rgba(255, 107, 0, 0.85)",
  soft: "rgba(255, 107, 0, 0.35)",
  lighter: "rgba(255, 107, 0, 0.18)",
  border: "rgba(204, 85, 0, 1)",
};

/* =======================
   Helpers de fechas
======================= */

// "04-30-2025" -> "2025-04-30"
const mmddyyyyToIso = (mmddyyyy) => {
  const [mm, dd, yyyy] = String(mmddyyyy || "").split("-");
  if (!mm || !dd || !yyyy) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

// ISO "2025-04-30" -> label "Apr 30" (LOCAL, consistente)
const isoToLabel = (iso) => {
  const [y, m, d] = String(iso || "").split("-");
  if (!y || !m || !d) return "";
  const dt = new Date(Number(y), Number(m) - 1, Number(d)); // ✅ local-safe
  return dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

// ✅ CLAVE: fecha LOCAL en YYYY-MM-DD (NO UTC)
const isoFromDateLocal = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Saca la ISO date de una order (prioriza DATE si viene, sino DATE_TIME)
const getOrderIsoDate = (o) => {
  // 1) PRIORIDAD: DATE_TIME (lo que se ve en la tabla)
  const rawDT = o?.DATE_TIME ?? o?.date_time ?? null;
  if (rawDT) {
    const dt = new Date(rawDT);
    if (!Number.isNaN(dt.getTime())) return isoFromDateLocal(dt);
  }

  // 2) Fallback: DATE (MM-DD-YYYY)
  const rawDate = o?.DATE ?? o?.date ?? null;
  if (rawDate) {
    const iso = mmddyyyyToIso(rawDate);
    if (iso) return iso;
  }

  return null;
};

/* =======================
   Net total por día
======================= */

export const netTotalByDay = (orders = []) => {
  const map = new Map(); // isoDate -> sum

  for (const o of orders || []) {
    const iso = getOrderIsoDate(o);
    if (!iso) continue;

    const total = toNumber(o.TOTAL ?? o.total ?? 0);
    map.set(iso, (map.get(iso) || 0) + total);
  }

  const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

  return {
    labels: sorted.map(([iso]) => isoToLabel(iso)),
    values: sorted.map(([, sum]) => Number(sum.toFixed(2))),
  };
};

/* =======================
   Componentes por día
   (Sales vs Fees vs Tax)
======================= */

export const componentsByDay = (orders = []) => {
  const map = new Map(); // isoDate -> { sales, fees, tax }

  for (const o of orders || []) {
    const iso = getOrderIsoDate(o);
    if (!iso) continue;

    const sales = toNumber(o.PRODUCT_SALES);

    const fees =
      Math.abs(toNumber(o.SELLING_FEES)) +
      Math.abs(toNumber(o.FBA_FEES)) +
      Math.abs(toNumber(o.OTHER_TRANSACTION_FEES)) +
      Math.abs(toNumber(o.OTHER)) +
      Math.abs(toNumber(o.REGULATORY_FEE));

    const tax = Object.entries(o || {})
      .filter(([k]) => String(k).toUpperCase().endsWith("_TAX"))
      .reduce((acc, [, v]) => acc + Math.abs(toNumber(v)), 0);

    const prev = map.get(iso) || { sales: 0, fees: 0, tax: 0 };

    map.set(iso, {
      sales: prev.sales + sales,
      fees: prev.fees + fees,
      tax: prev.tax + tax,
    });
  }

  const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

  return {
    labels: sorted.map(([iso]) => isoToLabel(iso)),
    sales: sorted.map(([, v]) => Number(v.sales.toFixed(2))),
    fees: sorted.map(([, v]) => Number(v.fees.toFixed(2))),
    tax: sorted.map(([, v]) => Number(v.tax.toFixed(2))),
  };
};

/* =======================
   Fulfillment mix
======================= */

export const fulfillmentMix = (orders = [], mode = "count") => {
  const map = new Map(); // fulfillment -> value

  for (const o of orders || []) {
    const key = String(o.FULFILLMENT || o.fulfillment || "Unknown").trim() || "Unknown";
    const add = mode === "net" ? toNumber(o.TOTAL ?? o.total ?? 0) : 1;
    map.set(key, (map.get(key) || 0) + add);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => Number(v.toFixed(2))),
  };
};

/* =======================
   Top SKUs por sales
======================= */

export const topSkusBySales = (orders = [], limit = 5) => {
  const map = new Map(); // sku -> sales

  for (const o of orders || []) {
    const sku = String(o.SKU || o.sku || "Unknown").trim();
    const sales = toNumber(o.PRODUCT_SALES ?? 0);
    map.set(sku, (map.get(sku) || 0) + sales);
  }

  const sorted = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return {
    labels: sorted.map(([sku]) => sku),
    values: sorted.map(([, total]) => Number(total.toFixed(2))),
  };
};