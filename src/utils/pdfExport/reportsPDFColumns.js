import { money, int, pct, formatMonth } from "../kpicards";

export const reportsMonthlyPdfColumns = [
    { header: "Month", accessor: (r) => formatMonth(r.month) },
    { header: "Settlements", accessor: (r) => r.settlementsCount, format: (v) => int(v), align: "right" },
    { header: "Amazon Total", accessor: (r) => r.amazonTotal, format: (v) => money(v), align: "right" },
    { header: "SAP Total", accessor: (r) => r.sapTotal, format: (v) => money(v), align: "right" },
    { header: "Difference", accessor: (r) => r.differenceTotal, format: (v) => money(v), align: "right" },
    { header: "Reconciled", accessor: (r) => r.reconciledCount, format: (v) => int(v), align: "right" },
    { header: "Not Reconciled", accessor: (r) => r.notReconciledCount, format: (v) => int(v), align: "right" },
    { header: "Pending", accessor: (r) => r.pendingCount, format: (v) => int(v), align: "right" },
    { header: "% Recon", accessor: (r) => r.reconciledPct, format: (v) => pct(v), align: "right" },
];
