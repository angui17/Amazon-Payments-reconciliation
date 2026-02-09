import { onlyDate } from "../dateUtils";

const cell = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toFixed(2)}`;
};

export const refundsPaymentsPdfColumns = [
  // Created Date
  {
    header: "Created Date",
    accessor: (p) => onlyDate(p.POSTED_DATE_DATE || p.POSTED_DATE || "-"),
  },

  // SKU
  { header: "SKU", accessor: (p) => p.sku || p.SKU || "-" },

  // Settlement ID
  {
    header: "Settlement ID",
    accessor: (p) => p.SETTLEMENT_ID || p.settlementId || p.id || "-",
  },

  // Settlement Start Date
  {
    header: "Settlement Start Date",
    accessor: (p) => onlyDate(p["settlement-start-date"] || p.settlementStartDate || "-"),
  },

  // Settlement End Date
  {
    header: "Settlement End Date",
    accessor: (p) => onlyDate(p["settlement-end-date"] || p.settlementEndDate || "-"),
  },

  // Order ID
  { header: "Order ID", accessor: (p) => p.ORDER_ID || p.order_id || "-" },

  // Reason
  { header: "Reason", accessor: (p) => p.AMOUNT_DESCRIPTION || "-" },

  // Amount
  {
    header: "Amount",
    accessor: (p) => (typeof p.amount === "number" ? p.amount : null),
    format: (v) => money(v),
    align: "right",
  },

  // Status
  {
    header: "Status",
    accessor: (p) => p.status || p.STATUS || "-",
    format: (s) => (s === "P" ? "Pending" : "Completed"),
  },
];
