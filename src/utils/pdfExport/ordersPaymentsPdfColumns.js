// src/utils/pdfExport/ordersPaymentsPdfColumns.js
import { formatMoney } from "../numberUtils";
import { STATUS_LABELS } from "../status";

const onlyYMD = (v) => String(v ?? "").slice(0, 10) || "-";

export const ordersPaymentsPdfColumns = [
  {
    header: "Posted Date",
    accessor: (r) => onlyYMD(r?.POSTED_DATE_DATE ?? r?.POSTED_DATE),
  },
  {
    header: "Order ID",
    accessor: (r) => r?.ORDER_ID ?? r?.order_id ?? "-",
  },
  {
    header: "SKU",
    accessor: (r) => r?.SKU ?? r?.sku ?? "-",
  },
  {
    header: "Amount Description",
    accessor: (r) => r?.AMOUNT_DESCRIPTION ?? r?.description ?? "Unknown",
  },
  {
    header: "Status",
    accessor: (r) => STATUS_LABELS?.[r?.STATUS ?? r?.status] ?? (r?.STATUS ?? r?.status ?? "-"),
  },
  {
    header: "Settlement ID",
    accessor: (r) => r?.SETTLEMENT_ID ?? r?.settlement_id ?? "-",
  },
  {
    header: "Amount",
    accessor: (r) => r?.AMOUNT ?? r?.amount ?? 0,
    format: (v) => formatMoney(v),
    align: "right",
  },
];