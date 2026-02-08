import { dateToTs, dateToTsEnd } from "./dateUtils";

const norm = (v) => String(v ?? "").trim().toLowerCase();

export const filterRefundsSales = (rows = [], filters = {}) => {
  const {
    status = "",
    sku = "",
    orderId = "",
    settlementId = "",
    from = "",
    to = "",
  } = filters;

  const fromTs = from ? dateToTs(from) : null;
  const toTs = to ? dateToTsEnd(to) : null;

  const qSku = norm(sku);
  const qOrder = norm(orderId);
  const qSettle = norm(settlementId);

  return (rows || []).filter((r) => {
    const rowStatus = String(r?.STATUS ?? "");
    const rowSku = norm(r?.SKU);
    const rowOrder = norm(r?.order_id);
    const rowSettle = norm(r?.SETTLEMENT_ID);

    const matchStatus = !status || rowStatus === String(status);
    const matchSku = !qSku || rowSku.includes(qSku);
    const matchOrderId = !qOrder || rowOrder.includes(qOrder);
    const matchSettlement = !qSettle || rowSettle.includes(qSettle);

    const rowTs = dateToTs(r?.DATE);
    const matchFrom = !fromTs || (rowTs !== null && rowTs >= fromTs);
    const matchTo = !toTs || (rowTs !== null && rowTs <= toTs);

    return matchStatus && matchSku && matchOrderId && matchSettlement && matchFrom && matchTo;
  });
};
