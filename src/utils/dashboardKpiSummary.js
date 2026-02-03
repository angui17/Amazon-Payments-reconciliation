import { money, int } from "./kpicards";

const normStatus = (r) => String(r?.status ?? r?.STATUS ?? r?.Status ?? "").toUpperCase();

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Ajustá keys si tu row tiene otros nombres
const getAmazonAmount = (r) => num(r.amazonTotalReported ?? r.amazonTotal ?? r.AMAZON_TOTAL ?? r.amountAmazon);
const getSapAmount = (r) => num(r.sapPaymentsTotal ?? r.sapTotal ?? r.SAP_TOTAL ?? r.amountSap);

const getAmazonInternalDiff = (r) =>
  Boolean(r.amazonInternalDiff ?? r.AMAZON_INTERNAL_DIFF ?? r.internalDiffAmazon);

const hasMissingSettlementId = (r) =>
  !String(r.settlementId ?? r.SETTLEMENT_ID ?? r.settlement_id ?? "").trim();

export const buildDashboardSummaryFromRows = (rows = []) => {
  const settlementsCount = rows.length;

  let pendingCount = 0;
  let reconciledCount = 0;
  let notReconciledCount = 0;

  let amazonTotal = 0;
  let sapTotal = 0;

  let amazonInternalDiffCount = 0;
  let missingSettlementIdCount = 0;

  for (const r of rows) {
    const s = normStatus(r);

    if (s === "PENDING" || s === "P") pendingCount++;
    else if (s === "RECONCILED" || s === "C" || s === "COMPLETED") reconciledCount++;
    else if (s === "NOT_RECONCILED" || s === "NR" || s === "NOT RECONCILED") notReconciledCount++;

    amazonTotal += getAmazonAmount(r);
    sapTotal += getSapAmount(r);

    if (getAmazonInternalDiff(r)) amazonInternalDiffCount++;
    if (hasMissingSettlementId(r)) missingSettlementIdCount++;
  }

  const differenceTotal = amazonTotal - sapTotal;

  return {
    settlementsCount,
    pendingCount,
    reconciledCount,
    notReconciledCount,
    amazonTotal,
    sapTotal,
    differenceTotal,
    amazonInternalDiffCount,
    missingSettlementIdCount,
  };
};

// ✅ Esto es lo que usa tu exportRowsToPdf (headerBlocks)
export const buildDashboardPdfKpiBlocks = (summary) => {
  if (!summary) return [];

  const {
    settlementsCount = 0,
    pendingCount = 0,
    reconciledCount = 0,
    notReconciledCount = 0,
    amazonTotal = 0,
    sapTotal = 0,
    differenceTotal = 0,
    amazonInternalDiffCount = 0,
    missingSettlementIdCount = 0,
  } = summary;

  return [
    { label: "Settlements", value: int(settlementsCount) },
    { label: "Status: Pending", value: int(pendingCount) },
    { label: "Reconciled", value: int(reconciledCount) },
    { label: "Not Reconciled", value: int(notReconciledCount) },
    { label: "Amazon Total", value: money(amazonTotal) },
    { label: "SAP Total", value: money(sapTotal) },
    { label: "Difference (Amazon - SAP)", value: money(differenceTotal) },
    { label: "Amazon Internal Diff Count", value: int(amazonInternalDiffCount) },
    { label: "Missing Settlement ID Count", value: int(missingSettlementIdCount) },
  ];
};
