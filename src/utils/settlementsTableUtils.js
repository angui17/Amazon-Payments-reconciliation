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

// Reconciled helpers (robustos)
export const isReconciledBool = (v) => {
  if (v === true) return true;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes" || s === "y";
};

export const isReconciled = (v) => (isReconciledBool(v) ? "Yes" : "No");

// Status helpers
export const effectiveStatus = (_status, reconciled) =>
  isReconciledBool(reconciled) ? "C" : "P";

export const mapStatus = (status) => {
  const s = String(status || "-").trim().toUpperCase();

  if (s === "P") return { label: "Pending", className: "status-warning" };
  if (s === "C") return { label: "Completed", className: "status-success" };

  return { label: s, className: "status-neutral" };
};

export const diffClass = (diff) => {
  const d = Number(diff ?? 0);
  if (d === 0) return "diff-ok";
  if (d < 0) return "diff-bad";
  return "diff-warn";
};

// util común para keys
export const rowKey = (r, idx = 0, fallback = "row") =>
  `${r?.settlementId ?? fallback}-${idx}`;

export const effectiveStatusFromDiff = (diff) => {
  const d = Number(diff ?? 0);
  return Math.abs(d) < 0.0001 ? "C" : "P";
};

export const effectiveStatusFromReconciledCount = (count) => {
  const n = Number(count ?? 0);
  return n > 0 ? "C" : "P";
};

export const effectiveStatusFromMonthlyRow = (r) => {
  const total = Number(r?.settlementsCount ?? 0);
  const reconciled = Number(r?.reconciledCount ?? 0);
  const notRec = Number(r?.notReconciledCount ?? 0);

  // si viene pendingCount, usalo; si no, calculalo
  const pendingRaw = r?.pendingCount;
  const pending = pendingRaw != null
    ? Number(pendingRaw)
    : Math.max(0, total - reconciled - notRec);

  return pending > 0 ? "P" : "C";
};

export const effectiveStatusFromNotReconciledCount = (notReconciledCount) => {
  const n = Number(notReconciledCount ?? 0);
  return n > 0 ? "P" : "C";
};
