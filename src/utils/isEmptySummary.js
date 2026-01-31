export const isEmptySummary = (summary) => {
  if (!summary) return true;

  // adaptá este campo al real que venga del WS
  if (typeof summary.total === "number") {
    return summary.total === 0;
  }

  // fallback genérico
  return Object.values(summary).every(
    (v) => v === 0 || v === null || v === undefined
  );
};
