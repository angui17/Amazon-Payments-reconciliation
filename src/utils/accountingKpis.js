import { safeNum, formatMoney } from "./numberUtils";

const getStatus = (r) => String(r?.status ?? r?.STATUS ?? r?.Status ?? "").toUpperCase();

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const sumField = (arr, candidates) =>
  arr.reduce((acc, r) => {
    for (const k of candidates) {
      const v = r?.[k];
      if (v !== undefined && v !== null && v !== "") return acc + toNum(v);
    }
    return acc;
  }, 0);

const countTruthy = (arr, candidates) =>
  arr.reduce((acc, r) => {
    for (const k of candidates) {
      const v = r?.[k];
      if (v === true) return acc + 1;
      if (typeof v === "string" && ["1", "true", "yes", "y"].includes(v.toLowerCase())) return acc + 1;
      if (typeof v === "number" && v !== 0) return acc + 1;
    }
    return acc;
  }, 0);

export const computeAccountingKpis = ({ rows = [], summary = null }) => {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  if (hasRows) {
    const settlements = rows.length;
    const pending = rows.filter((r) => getStatus(r) === "P").length;
    const amazonTotal = sumField(rows, ["amazonTotalReported", "amazonTotal", "amazon_total", "AMAZON_TOTAL"]);
    const sapPaymentsTotal = sumField(rows, ["sapPaymentsTotal", "sap_payments_total", "SAP_PAYMENTS_TOTAL"]);
    const diffPaymentsTotal = sumField(rows, ["diffPayments", "diffPaymentsTotal", "diff_payments_total", "DIFF_PAYMENTS_TOTAL"]);
    const missingJournal = countTruthy(rows, ["missingJournal", "missing_journal", "MISSING_JOURNAL"]);
    const missingPayments = countTruthy(rows, ["missingPayments", "missing_payments", "MISSING_PAYMENTS"]);
    const unbalancedJournals = countTruthy(rows, ["unbalancedJournal", "unbalanced_journal", "UNBALANCED_JOURNAL"]);

    return {
      settlements,
      pending,
      amazonTotal,
      sapPaymentsTotal,
      diffPaymentsTotal,
      missingJournal,
      missingPayments,
      unbalancedJournals,
      formatted: {
        amazonTotal: formatMoney(amazonTotal),
        sapPaymentsTotal: formatMoney(sapPaymentsTotal),
        diffPaymentsTotal: formatMoney(diffPaymentsTotal),
      },
    };
  }

  // fallback summary
  const settlements = safeNum(summary?.settlementsCount);
  const pending = safeNum(summary?.pendingCount);
  const amazonTotal = safeNum(summary?.amazonTotal);
  const sapPaymentsTotal = safeNum(summary?.sapPaymentsTotal);
  const diffPaymentsTotal = safeNum(summary?.diffPaymentsTotal);
  const missingJournal = safeNum(summary?.missingJournalCount);
  const missingPayments = safeNum(summary?.missingPaymentsCount);
  const unbalancedJournals = safeNum(summary?.unbalancedJournalCount);

  return {
    settlements,
    pending,
    amazonTotal,
    sapPaymentsTotal,
    diffPaymentsTotal,
    missingJournal,
    missingPayments,
    unbalancedJournals,
    formatted: {
      amazonTotal: formatMoney(amazonTotal),
      sapPaymentsTotal: formatMoney(sapPaymentsTotal),
      diffPaymentsTotal: formatMoney(diffPaymentsTotal),
    },
  };
};

export const accountingKpisToHeaderBlocks = (k) => [
  { label: "Settlements", value: String(k.settlements) },
  { label: "Pending", value: String(k.pending) },
  { label: "Amazon total", value: k.formatted.amazonTotal },
  { label: "SAP payments total", value: k.formatted.sapPaymentsTotal },
  { label: "Payments diff total", value: k.formatted.diffPaymentsTotal },
  { label: "Missing Journal", value: String(k.missingJournal) },
  { label: "Missing Payments", value: String(k.missingPayments) },
  { label: "Unbalanced Journals", value: String(k.unbalancedJournals) },
];
