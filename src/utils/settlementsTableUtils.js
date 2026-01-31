// utils/settlementsTableUtils.js

export const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const onlyYMD = (v) => {
  if (!v) return "-";
  return String(v).split(" ")[0];
};

export const formatPeriod = (start, end) =>
  `${onlyYMD(start)} → ${onlyYMD(end)}`;

export const mapStatus = (status) => {
  const s = String(status || "-").trim().toUpperCase();

  if (s === "P") {
    return { label: "Pending", className: "status-warning" };
  }

  if (s === "C") {
    return { label: "Completed", className: "status-success" };
  }

  return { label: s, className: "status-neutral" };
};

export const diffClass = (diff) => {
  const d = Number(diff ?? 0);
  if (d === 0) return "diff-ok";
  if (d < 0) return "diff-bad";
  return "diff-warn";
};

export const isReconciled = (v) => Number(v) === 1 ? "Yes" : "No";
