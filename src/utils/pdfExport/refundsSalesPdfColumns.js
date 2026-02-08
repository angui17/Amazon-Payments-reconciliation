// src/utils/pdfExport/refundsSalesPdfColumns.js
const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const text = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const statusLabel = (s) => {
  const raw = String(s || "").toUpperCase();
  if (raw === "C") return "Completed";
  if (raw === "P") return "Pending";
  return raw || "-";
};

export const refundsSalesPdfColumns = [
  { header: "Date", accessor: (r) => text(r?.DATE) },
  { header: "Settlement ID", accessor: (r) => text(r?.SETTLEMENT_ID) },
  { header: "Order ID", accessor: (r) => text(r?.order_id) },

  { header: "SKU", accessor: (r) => text(r?.SKU) },
  { header: "Description", accessor: (r) => text(r?.DESCRIPTION) },

  { header: "Qty", accessor: (r) => r?.QUANTITY ?? "-", align: "right" },

  { header: "Product Sales", accessor: (r) => r?.PRODUCT_SALES, format: (v) => money(v), align: "right" },
  { header: "Total", accessor: (r) => r?.TOTAL, format: (v) => money(v), align: "right" },

  { header: "Status", accessor: (r) => statusLabel(r?.STATUS) },
];
