// utils/errorsKpis.js

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const computeErrorsKpis = (rows = []) => {
  const settlementsCount = rows.length;

  let diffCount = 0;
  let noSapCount = 0;
  let amazonInternalCount = 0;
  let differenceTotal = 0;

  for (const r of rows) {
    const diff = safeNum(r?.difference);
    const amazon = safeNum(r?.amazonTotalReported);
    const sap = safeNum(r?.sapPaymentsTotal);

    const hasDiff = safeNum(r?.flagDiff) === 1 || diff !== 0;
    const hasNoSap = safeNum(r?.flagNoSap) === 1 || (sap === 0 && amazon !== 0);
    const hasAmazonInternal =
      safeNum(r?.flagAmazonInternal) === 1 || safeNum(r?.amazonInternalDiff) !== 0;

    if (hasDiff) diffCount++;
    if (hasNoSap) noSapCount++;
    if (hasAmazonInternal) amazonInternalCount++;

    differenceTotal += diff;
  }

  return {
    exceptionsTotal: settlementsCount, 
    settlementsCount,
    diffCount,
    noSapCount,
    amazonInternalCount,
    differenceTotal,
  };
};

export const buildErrorsHeaderBlocks = (rows = []) => {
  const k = computeErrorsKpis(rows);

  return [
    { label: "Total Exceptions", value: k.exceptionsTotal },
    { label: "Settlements analyzed", value: k.settlementsCount },
    { label: "Amazon vs SAP mismatch", value: k.diffCount },
    { label: "Missing SAP payment", value: k.noSapCount },
    { label: "Amazon internal mismatch", value: k.amazonInternalCount },
    { label: "Difference total", value: money(k.differenceTotal) },
  ];
};
