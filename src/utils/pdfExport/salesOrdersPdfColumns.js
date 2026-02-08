// src/utils/pdfExport/salesOrdersPdfColumns.js

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const date = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const cityState = (r) => {
  const city = r?.ORDER_CITY || r?.city || "";
  const state = r?.ORDER_STATE || r?.state || "";
  const out = `${city}${state ? `, ${state}` : ""}`.trim();
  return out || "-";
};

export const salesOrdersPdfColumns = [
  { header: "Order ID", accessor: (r) => r?.ORDER_ID || r?.order_id || "-" },
  { header: "SKU", accessor: (r) => r?.SKU || r?.sku || "-" },
  { header: "Description", accessor: (r) => r?.DESCRIPTION || r?.description || "-" },

  { header: "Qty", accessor: (r) => r?.QUANTITY ?? r?.quantity ?? "-", align: "right" },
  { header: "Marketplace", accessor: (r) => r?.MARKETPLACE || r?.marketplace || "-" },
  { header: "Fulfillment", accessor: (r) => r?.FULFILLMENT || r?.fulfillment || "-" },

  { header: "City/State", accessor: (r) => cityState(r) },

  { header: "Product Sales", accessor: (r) => r?.PRODUCT_SALES, format: (v) => money(v), align: "right" },
  { header: "Date", accessor: (r) => r?.DATE_TIME || r?.DATE, format: (v) => date(v) },

  { header: "Total", accessor: (r) => r?.TOTAL, format: (v) => money(v), align: "right" },
  { header: "Status", accessor: (r) => r?.STATUS || r?.status || "-" },
];