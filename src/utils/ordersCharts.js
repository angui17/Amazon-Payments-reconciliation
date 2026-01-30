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

const isoToLabel = (iso) => {
  // "2025-04-30" -> "Apr 30"
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

const isoFromDate = (d) => d.toISOString().slice(0, 10);

/* =======================
   Net total por día
======================= */

export const netTotalByDay = (orders = []) => {
  const map = new Map(); // isoDate -> sum

  for (const o of orders || []) {
    const rawDate = o.DATE || o.date || null;

    let iso = null;
    if (rawDate) {
      iso = mmddyyyyToIso(rawDate);
    } else if (o.DATE_TIME || o.date_time) {
      const dt = new Date(o.DATE_TIME || o.date_time);
      if (!Number.isNaN(dt.getTime())) {
        iso = isoFromDate(dt);
      }
    }

    if (!iso) continue;

    const total = toNumber(o.TOTAL ?? o.total ?? 0);
    map.set(iso, (map.get(iso) || 0) + total);
  }

  const sorted = Array.from(map.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

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
    const rawDate = o.DATE || o.date || null;

    let iso = null;
    if (rawDate) {
      iso = mmddyyyyToIso(rawDate);
    } else if (o.DATE_TIME || o.date_time) {
      const dt = new Date(o.DATE_TIME || o.date_time);
      if (!Number.isNaN(dt.getTime())) {
        iso = isoFromDate(dt);
      }
    }

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

  const sorted = Array.from(map.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return {
    labels: sorted.map(([iso]) => isoToLabel(iso)),
    sales: sorted.map(([, v]) => Number(v.sales.toFixed(2))),
    fees: sorted.map(([, v]) => Number(v.fees.toFixed(2))),
    tax: sorted.map(([, v]) => Number(v.tax.toFixed(2))),
  };
};

export const fulfillmentMix = (orders = [], mode = "count") => {
  const map = new Map(); // fulfillment -> value

  for (const o of orders || []) {
    const key = String(o.FULFILLMENT || o.fulfillment || "Unknown").trim() || "Unknown";

    const add =
      mode === "net"
        ? toNumber(o.TOTAL ?? o.total ?? 0)
        : 1;

    map.set(key, (map.get(key) || 0) + add);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);

  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => Number(v.toFixed(2))),
  };
};


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
