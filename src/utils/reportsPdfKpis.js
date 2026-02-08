import { money, int, pct } from "./kpicards";

export const buildReportsPdfKpiBlocks = (pageSummary, totalSummary) => {
  if (!pageSummary) return [];

  const totalSettlements = totalSummary?.settlementsCount ?? 0;

  return [
    {
      label: "Settlements (page / total)",
      value: `${int(pageSummary.settlementsCount)} of ${int(totalSettlements)}`,
    },
    {
      label: "Reconciled",
      value: `${int(pageSummary.reconciledCount)}`,
    },
    {
      label: "Not Reconciled",
      value: `${int(pageSummary.notReconciledCount)}`,
    },
    {
      label: "Pending",
      value: `${int(pageSummary.pendingCount)}`,
    },
    {
      label: "Reconciled %",
      value: pct(pageSummary.reconciledPct),
    },
    {
      label: "Amazon Total (page)",
      value: money(pageSummary.amazonTotal),
    },
    {
      label: "SAP Total (page)",
      value: money(pageSummary.sapTotal),
    },
    {
      label: "Difference Total (page)",
      value: money(pageSummary.differenceTotal),
    },
  ];
};
