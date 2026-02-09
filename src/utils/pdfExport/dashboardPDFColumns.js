import { money, onlyYMD, formatPeriod, mapStatus, isReconciled } from "../settlementsTableUtils";

export const settlementsPdfColumns = [
  {
    header: "Settlement ID",
    accessor: (r) => r.settlementId ?? "-",
  },
  {
    header: "Deposit Date",
    accessor: (r) => r.depositDateDate ?? onlyYMD(r.depositDate),
  },
  {
    header: "Amazon Total",
    accessor: (r) => r.amazonTotalReported,
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "SAP Total",
    accessor: (r) => r.sapPaymentsTotal,
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "Diff",
    accessor: (r) => r.difference,
    format: (v) => money(v),
    align: "right",
  },
  {
    header: "Reconciled",
    accessor: (r) => isReconciled(r.reconciled),
  },
  {
    header: "Exceptions",
    accessor: (r) => r.exceptionsCount ?? 0,
    align: "right",
  },
  {
    header: "Status",
    accessor: (r) => mapStatus(r.status).label,
  },
];
