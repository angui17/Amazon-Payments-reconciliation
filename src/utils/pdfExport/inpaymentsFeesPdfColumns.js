import { onlyDate } from "../dateUtils";

const cell = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const fmtAmount = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return cell(v);
  return n.toFixed(2);
};

export const inpaymentsFeesPdfColumns = [
  { header: "Posted date", accessor: (r) => cell(r.POSTED_DATE_DATE ?? r.POSTED_DATE ?? "-") },
  { header: "Order id", accessor: (r) => cell(r.ORDER_ID ?? r.order_id ?? "-") },
  { header: "Sku", accessor: (r) => (r?.sku === "" ? "N/A" : cell(r?.sku ?? "-")) },
  { header: "Settlement ID", accessor: (r) => cell(r.id ?? "-") },
  { header: "Type", accessor: (r) => cell(r.TYPE ?? "-") },
  { header: "Amount description", accessor: (r) => cell(r.AMOUNT_DESCRIPTION ?? "-") },
  {
    header: "Amount",
    accessor: (r) => r.amount,
    format: (v) => fmtAmount(v),
    align: "right",
  },
  { header: "Status", accessor: (r) => cell(r.STATUS || r.status || "-") },
  { header: "Start date", accessor: (r) => cell(onlyDate(r["settlement-start-date"])) },
  { header: "End date", accessor: (r) => cell(onlyDate(r["settlement-end-date"])) },
];
