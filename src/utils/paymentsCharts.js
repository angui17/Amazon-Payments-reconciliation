import { toNumber } from "./refundMath";

// agarra amount aunque venga con distintas keys
export const getPaymentAmount = (p) =>
  toNumber(p.AMOUNT ?? p.amount ?? p["AMOUNT"] ?? 0);

// elegimos una fecha “diaria” consistente
// preferimos POSTED_DATE / POSTED_DATE_DATE (YYYY-MM-DD)
// si no, cae a algo que venga con fecha al principio
export const getPaymentDay = (p) => {
  const d =
    p.POSTED_DATE_DATE ??
    p.POSTED_DATE ??
    p["POSTED_DATE_DATE"] ??
    p["POSTED_DATE"] ??
    null;

  if (d) return String(d).slice(0, 10); // YYYY-MM-DD

  const alt = p["deposit-date"] ?? p["settlement-start-date"] ?? p["settlement-end-date"];
  if (!alt) return "Unknown";

  // "2024-11-03 17:44:52 UTC" -> "2024-11-03"
  return String(alt).split(" ")[0];
};

export const getPaymentDesc = (p) =>
  String(p.AMOUNT_DESCRIPTION ?? p.description ?? "Unknown");

// 1) Línea: net amount por día
export const buildNetByDay = (payments = []) => {
  const map = new Map(); // day -> net
  for (const p of payments) {
    const day = getPaymentDay(p);
    const amt = getPaymentAmount(p);
    map.set(day, (map.get(day) ?? 0) + amt);
  }

  return Array.from(map.entries())
    .map(([day, net]) => ({ day, net }))
    .sort((a, b) => a.day.localeCompare(b.day));
};

// 2) Barras apiladas: amount por día por AMOUNT_DESCRIPTION
// Tip: limitamos categorías para que no sea un carnaval visual: top N + Other
export const buildStackedByDay = (payments = [], topN = 8) => {
  // total abs por desc para rankear
  const descAbs = new Map();
  for (const p of payments) {
    const desc = getPaymentDesc(p);
    const amt = Math.abs(getPaymentAmount(p));
    descAbs.set(desc, (descAbs.get(desc) ?? 0) + amt);
  }

  const topDescs = Array.from(descAbs.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([d]) => d);

  // day -> { day, [desc]: sum, Other: sum }
  const dayMap = new Map();

  for (const p of payments) {
    const day = getPaymentDay(p);
    const desc = getPaymentDesc(p);
    const amt = getPaymentAmount(p);

    const bucket = topDescs.includes(desc) ? desc : "Other";

    if (!dayMap.has(day)) dayMap.set(day, { day });
    const row = dayMap.get(day);

    row[bucket] = (row[bucket] ?? 0) + amt;
  }

  const data = Array.from(dayMap.values()).sort((a, b) => a.day.localeCompare(b.day));

  // devolvemos también keys para renderizar las Bar
  const keys = [...topDescs, "Other"].filter((k) =>
    data.some((r) => (r[k] ?? 0) !== 0)
  );

  return { data, keys };
};

// 3) Pareto: top AMOUNT_DESCRIPTION por abs(amount)
// devuelve barras (absTotal) + cum% para línea
export const buildParetoByDesc = (payments = [], topN = 10) => {
  const map = new Map(); // desc -> absSum
  for (const p of payments) {
    const desc = getPaymentDesc(p);
    const absAmt = Math.abs(getPaymentAmount(p));
    map.set(desc, (map.get(desc) ?? 0) + absAmt);
  }

  const rows = Array.from(map.entries())
    .map(([desc, absTotal]) => ({ desc, absTotal }))
    .sort((a, b) => b.absTotal - a.absTotal)
    .slice(0, topN);

  const total = rows.reduce((acc, r) => acc + r.absTotal, 0) || 1;

  let running = 0;
  return rows.map((r) => {
    running += r.absTotal;
    return {
      ...r,
      cumPct: (running / total) * 100,
    };
  });
};
