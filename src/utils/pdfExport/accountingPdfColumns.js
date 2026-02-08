import { formatMoney } from "../numberUtils";
import { STATUS_LABELS } from "../status";

const yn = (v) => (Number(v ?? 0) === 1 ? "Yes" : "No");

export const accountingPdfColumns = [
  { header: "Settlement ID", accessor: (r) => r.settlementId ?? "-" },
  { header: "Deposit Date", accessor: (r) => r.depositDateDate ?? "-" },

  {
    header: "Amazon Total",
    accessor: (r) => r.amazonTotalReported,
    format: (v) => formatMoney(v),
    align: "right",
  },
  {
    header: "SAP Total",
    accessor: (r) => r.sapPaymentsTotal,
    format: (v) => formatMoney(v),
    align: "right",
  },
  {
    header: "Diff",
    accessor: (r) => r.diffPayments,
    format: (v) => formatMoney(v),
    align: "right",
  },

  {
    header: "JE Count",
    accessor: (r) => r.sapJournalEntriesCount ?? 0,
    align: "right",
  },
  {
    header: "JE Debit",
    accessor: (r) => r.sapJournalTotalDebit,
    format: (v) => formatMoney(v),
    align: "right",
  },
  {
    header: "JE Credit",
    accessor: (r) => r.sapJournalTotalCredit,
    format: (v) => formatMoney(v),
    align: "right",
  },
  { header: "Balanced", accessor: (r) => yn(r.journalBalanced) },

  { header: "Missing Journal", accessor: (r) => yn(r.missingJournal) },
  { header: "Missing Payments", accessor: (r) => yn(r.missingPayments) },

  {
    header: "Status",
    accessor: (r) => STATUS_LABELS?.[r.status] || r.status || "-",
  },
];
