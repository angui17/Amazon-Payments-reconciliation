import { formatMoney } from "../refundMath";

const cell = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

export const salesFeesPdfColumns = [
  { header: "Date", accessor: (r) => r.DATE || (r.DATE_TIME ? String(r.DATE_TIME).slice(0, 10) : "-") },
  { header: "SKU", accessor: (r) => r.SKU ?? r.sku ?? "-" },
  { header: "Order ID", accessor: (r) => r.ORDER_ID ?? r.order_id ?? "-" },
  { header: "Settlement ID", accessor: (r) => r.SETTLEMENT_ID ?? "-" },
  { header: "Type", accessor: (r) => r.TYPE ?? r.type ?? "-" },
  { header: "Description", accessor: (r) => cell(r.DESCRIPTION ?? r.description ?? r.AMOUNT_DESCRIPTION ?? r.amount_description) },
  { header: "Account", accessor: (r) => r.ACCOUNT_TYPE ?? "-" },
  { header: "Marketplace", accessor: (r) => r.MARKETPLACE ?? "-" },
  {
    header: "Total",
    accessor: (r) => r.TOTAL ?? r.total ?? 0,
    format: (v) => formatMoney(v),
    align: "right",
  },
  { header: "Status", accessor: (r) => r.STATUS ?? r.status ?? "-" },
];
