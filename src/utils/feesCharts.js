import { toNumber } from "./refundMath";

// Paleta 
export const ORANGE = {
  soft: "rgba(255, 107, 0, 0.35)",
  solid: "rgba(255, 107, 0, 0.85)",
  border: "rgba(255, 107, 0, 1)",
  lighter: "rgba(255, 107, 0, 0.12)",
};

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
