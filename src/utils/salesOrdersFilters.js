// src/utils/salesOrdersFilters.js
import { dateToTs, dateToTsEnd } from "./dateUtils";

const str = (v) => String(v ?? "");
const norm = (v) => str(v).trim().toLowerCase();

export const filterSalesOrders = (orders = [], filters = {}) => {
  const {
    search = "",
    status = "",
    settlementId = "",
    orderId = "",
    sku = "",
    dateRange = { start: "", end: "" },
  } = filters;

  const fromTs = dateRange?.start ? dateToTs(dateRange.start) : null;
  const toTs = dateRange?.end ? dateToTsEnd(dateRange.end) : null;

  const q = norm(search);
  const statusWanted = str(status);

  const settlementWanted = norm(settlementId);
  const orderWanted = norm(orderId);
  const skuWanted = norm(sku);

  return (Array.isArray(orders) ? orders : []).filter((o) => {
    const statusVal = str(o?.STATUS || o?.status);
    const settlementVal = str(o?.SETTLEMENT_ID);
    const orderIdVal = str(o?.ORDER_ID || o?.order_id);
    const skuVal = str(o?.SKU || o?.sku);

    // exact status (como tenías)
    const matchStatus = !statusWanted || statusVal === statusWanted;

    const matchSettlement = !settlementWanted || norm(settlementVal).includes(settlementWanted);
    const matchOrderId = !orderWanted || norm(orderIdVal).includes(orderWanted);
    const matchSku = !skuWanted || norm(skuVal).includes(skuWanted);

    const rowTs = dateToTs(o?.DATE);
    const matchFrom = !fromTs || (rowTs !== null && rowTs >= fromTs);
    const matchTo = !toTs || (rowTs !== null && rowTs <= toTs);

    const matchSearch =
      !q ||
      norm(orderIdVal).includes(q) ||
      norm(skuVal).includes(q) ||
      norm(settlementVal).includes(q) ||
      norm(statusVal).includes(q);

    return (
      matchStatus &&
      matchSettlement &&
      matchOrderId &&
      matchSku &&
      matchFrom &&
      matchTo &&
      matchSearch
    );
  });
};
