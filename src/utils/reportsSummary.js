const toNum = (v) => Number(v ?? 0);

export const calculateSummary = (rows = []) => {
  if (!rows.length) return null;

  let settlementsCount = 0;
  let amazonTotal = 0;
  let sapTotal = 0;
  let differenceTotal = 0;

  let reconciledCount = 0;
  let notReconciledCount = 0;
  let pendingCount = 0;

  rows.forEach((r) => {
    settlementsCount += toNum(r.settlementsCount);

    amazonTotal += toNum(r.amazonTotal);
    sapTotal += toNum(r.sapTotal);
    differenceTotal += toNum(r.differenceTotal);

    reconciledCount += toNum(r.reconciledCount);
    notReconciledCount += toNum(r.notReconciledCount);
    pendingCount += toNum(r.pendingCount);
  });

  const reconciledPct =
    settlementsCount > 0 ? (reconciledCount / settlementsCount) * 100 : 0;

  return {
    settlementsCount,
    amazonTotal,
    sapTotal,
    differenceTotal,
    reconciledCount,
    notReconciledCount,
    pendingCount,
    reconciledPct,
  };
};
