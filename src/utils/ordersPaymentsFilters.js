// src/utils/ordersPaymentsFilters.js
import { parseDateUTC } from "./dateUtils";

const norm = (v) => String(v ?? "").trim().toLowerCase();

const postedDayYMD = (p) =>
  String(
    p?.POSTED_DATE_DATE ??
    p?.POSTED_DATE ??
    p?.["POSTED_DATE_DATE"] ??
    p?.["POSTED_DATE"] ??
    ""
  ).slice(0, 10); 

export const getOrdersPaymentsOptions = (payments = []) => {
  const statusSet = new Set();
  const descSet = new Set();

  (payments || []).forEach((p) => {
    statusSet.add(String(p?.STATUS ?? p?.status ?? "").trim());

    descSet.add(
      String(p?.AMOUNT_DESCRIPTION ?? p?.description ?? "Unknown").trim()
    );
  });

  const statuses = Array.from(statusSet).filter(Boolean).sort();
  const descriptions = Array.from(descSet).filter(Boolean).sort();

  return { statuses, descriptions };
};

export const filterOrdersPayments = (payments = [], filters = {}) => {
  const q = norm(filters.search);

  const settlementQ = norm(filters.settlementId);
  const orderQ = norm(filters.orderId);
  const skuQ = norm(filters.sku);

  //  status multi 
  const statusSet = new Set(filters.statuses || []);

  // amount description single 
  const amountDescription = String(filters.amountDescription || "").trim();

  // date range
  const from = filters.from || "";
  const to = filters.to || "";
  const fromTs = from ? parseDateUTC(from, false) : null; // inclusive start day
  const toTs = to ? parseDateUTC(to, true) : null; // inclusive end day

  return (payments || []).filter((p) => {
    const orderId = String(p?.ORDER_ID ?? p?.order_id ?? "");
    const sku = String(p?.SKU ?? p?.sku ?? "");
    const desc = String(p?.AMOUNT_DESCRIPTION ?? p?.description ?? "Unknown").trim();
    const status = String(p?.STATUS ?? p?.status ?? "").trim();
    const settlementId = String(p?.SETTLEMENT_ID ?? p?.settlement_id ?? "");

    // 1) date range (si hay)
    if (fromTs || toTs) {
      const day = postedDayYMD(p);
      if (!day) return false;

      const ts = parseDateUTC(day, false);
      if (!ts) return false;

      if (fromTs && ts < fromTs) return false;
      if (toTs && ts > toTs) return false;
    }

    // 2) settlement contains
    if (settlementQ && !settlementId.toLowerCase().includes(settlementQ))
      return false;

    // 3) order contains
    if (orderQ && !orderId.toLowerCase().includes(orderQ)) return false;

    // 4) sku contains
    if (skuQ && !sku.toLowerCase().includes(skuQ)) return false;

    // 5) amount description single exact
    if (amountDescription && desc !== amountDescription) return false;

    // 6) statuses multi exact
    if (statusSet.size > 0 && !statusSet.has(status)) return false;

    // 7) search global (si hay)
    if (!q) return true;

    return (
      orderId.toLowerCase().includes(q) ||
      sku.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      status.toLowerCase().includes(q) ||
      settlementId.toLowerCase().includes(q)
    );
  });
};
