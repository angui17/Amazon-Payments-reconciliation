export const parseWs282Item = (item) => {
  if (!item) return null;

  const safeParse = (s, fallback) => {
    try {
      if (s == null || s === "") return fallback;
      return JSON.parse(s);
    } catch {
      return fallback;
    }
  };

  const totalsArr = safeParse(item.totals, []);
  return {
    settlementId: item.settlementId ?? "-",
    totals: Array.isArray(totalsArr) ? (totalsArr[0] ?? null) : null,
    breakdown: safeParse(item.breakdown, []),
    checks: safeParse(item.checks, []),
    feesMissingAccounts: safeParse(item.feesMissingAccounts, []),
  };
};
