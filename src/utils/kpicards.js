// src/utils/kpicards.js

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