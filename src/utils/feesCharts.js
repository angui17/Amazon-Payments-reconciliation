import { toNumber } from "./refundMath";

// Paleta 
export const ORANGE = {
  soft: "rgba(255, 107, 0, 0.35)",
  solid: "rgba(255, 107, 0, 0.85)",
  border: "rgba(255, 107, 0, 1)",
  lighter: "rgba(255, 107, 0, 0.12)",
};

export const SLATE = {
  soft: "rgba(71, 85, 105, 0.20)",
  solid: "rgba(71, 85, 105, 0.75)",
  border: "rgba(71, 85, 105, 1)",
};

// Cálculos
const absTotal = (f) => Math.abs(toNumber(f.TOTAL ?? f.total ?? 0));
const netTotal = (f) => toNumber(f.TOTAL ?? f.total ?? 0);

export const feesByTypeDoughnut = (fees = []) => {
  const map = fees.reduce((acc, f) => {
    const type = f.TYPE || "Unknown";
    acc[type] = (acc[type] || 0) + absTotal(f);
    return acc;
  }, {});

  const rows = Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return {
    labels: rows.map((r) => r.label),
    values: rows.map((r) => r.value),
  };
};

export const topDescriptionsBar = (fees = [], limit = 8) => {
  const map = fees.reduce((acc, f) => {
    const desc = f.DESCRIPTION || "Unknown";
    acc[desc] = (acc[desc] || 0) + absTotal(f);
    return acc;
  }, {});

  const rows = Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return {
    labels: rows.map((r) => r.label),
    values: rows.map((r) => r.value),
  };
};

// DATE viene "04-29-2025" (MM-DD-YYYY). Lo uso como label tal cual.
// Si algún día viene vacío, cae en "Unknown".
export const feesNetByDayLine = (fees = []) => {
  const map = fees.reduce((acc, f) => {
    const day = f.DATE || "Unknown";
    acc[day] = (acc[day] || 0) + netTotal(f);
    return acc;
  }, {});

  const rows = Object.entries(map)
    .map(([day, net]) => ({ day, net }))
    // orden por fecha MM-DD-YYYY
    .sort((a, b) => {
      const [am, ad, ay] = String(a.day).split("-").map(Number);
      const [bm, bd, by] = String(b.day).split("-").map(Number);
      return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd);
    });

  return {
    labels: rows.map((r) => r.day),
    values: rows.map((r) => r.net),
  };
};

export const feesBySettlementBar = (fees = [], limit = 12) => {
  const map = fees.reduce((acc, f) => {
    const id = f.SETTLEMENT_ID || "Unknown";
    acc[id] = (acc[id] || 0) + netTotal(f);
    return acc;
  }, {});

  const rows = Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    // por impacto absoluto para que tenga sentido visual
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, limit);

  return {
    labels: rows.map((r) => r.label),
    values: rows.map((r) => r.value),
  };
};


export const getFeeAmount = (r) =>
  toNumber(r.AMOUNT ?? r.amount ?? r.TOTAL ?? r.total ?? 0);

export const getFeeType = (r) => String(r.TYPE ?? "Unknown").trim() || "Unknown";

export const getFeeDesc = (r) =>
  String(r.AMOUNT_DESCRIPTION ?? r.DESCRIPTION ?? "Unknown").trim() || "Unknown";

export const getFeeSettlement = (r) =>
  String(r.SETTLEMENT_ID ?? r.settlement_id ?? "Unknown").trim() || "Unknown";

// Normaliza día a string comparable (YYYY-MM-DD si viene así, o MM-DD-YYYY si viene así)
export const getFeeDay = (r) => {
  const raw =
    r.POSTED_DATE_DATE ??
    r.POSTED_DATE ??
    r.DATE ??
    r.date ??
    r.DATE_TIME ??
    r.date_time ??
    "";

  const s = String(raw).trim();
  if (!s) return "Unknown";

  // si viene "APR 29, 2025..." no lo vamos a parsear fino acá; caemos a DATE si existe
  // si viene "2024-11-03 17:44:52 UTC" -> "2024-11-03"
  const first = s.split(" ")[0];

  return first;
};

// 1) Doughnut: Σ abs(amount) por TYPE
export const feesByTypeAbs = (rows = []) => {
  const map = new Map();
  for (const r of rows) {
    const key = getFeeType(r);
    const v = Math.abs(getFeeAmount(r));
    map.set(key, (map.get(key) ?? 0) + v);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => v),
  };
};

// 2) Barras: top AMOUNT_DESCRIPTION por abs(amount)
export const topFeeDescriptionsAbs = (rows = [], topN = 10) => {
  const map = new Map();
  for (const r of rows) {
    const key = getFeeDesc(r);
    const v = Math.abs(getFeeAmount(r));
    map.set(key, (map.get(key) ?? 0) + v);
  }

  const sorted = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => v),
  };
};

// 3) Línea: fees net por día (Σ amount por day)
export const feesNetByDay = (rows = []) => {
  const map = new Map();
  for (const r of rows) {
    const day = getFeeDay(r);
    const v = getFeeAmount(r);
    map.set(day, (map.get(day) ?? 0) + v);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  return {
    labels: sorted.map(([d]) => d),
    values: sorted.map(([, v]) => v),
  };
};

// 4) Barras: fees por settlement (Σ amount por SETTLEMENT_ID)
export const feesBySettlementNet = (rows = [], topN = 12) => {
  const map = new Map();
  for (const r of rows) {
    const key = getFeeSettlement(r);
    const v = getFeeAmount(r);
    map.set(key, (map.get(key) ?? 0) + v);
  }

  // para no hacer un infierno visual: topN por abs(net)
  const sorted = Array.from(map.entries())
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, topN);

  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => v),
  };
};