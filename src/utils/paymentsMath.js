import { toNumber, formatMoney } from "./refundMath";

/* =======================
   Normalizadores
======================= */

export const getPaymentAmount = (p) =>
  toNumber(
    p.AMOUNT ??
    p.amount ??
    p["AMOUNT"] ??
    0
  );

export const getOrderId = (p) =>
  String(p.ORDER_ID || p.order_id || "").trim();

export const getAmountDescription = (p) =>
  String(p.AMOUNT_DESCRIPTION || p.description || "");

/* =======================
   KPIs Payments
======================= */

export const netPaidForOrders = (payments = []) =>
  formatMoney(
    payments.reduce((acc, p) => acc + getPaymentAmount(p), 0)
  );

export const uniqueOrdersCount = (payments = []) => {
  const set = new Set(
    payments.map(getOrderId).filter(Boolean)
  );
  return set.size;
};

export const principalTotal = (payments = []) =>
  formatMoney(
    payments.reduce((acc, p) => {
      if (getAmountDescription(p) === "Principal") {
        return acc + getPaymentAmount(p);
      }
      return acc;
    }, 0)
  );

export const amazonCommissionTotal = (payments = []) =>
  formatMoney(
    payments.reduce((acc, p) => {
      const d = getAmountDescription(p);
      if (d === "Commission" || d === "RefundCommission") {
        return acc + getPaymentAmount(p);
      }
      return acc;
    }, 0)
  );

export const fbaFulfillmentFeesTotal = (payments = []) =>
  formatMoney(
    payments.reduce((acc, p) => {
      const d = getAmountDescription(p).toLowerCase();
      if (d.includes("fulfillmentfee")) {
        return acc + getPaymentAmount(p);
      }
      return acc;
    }, 0)
  );


export const inDateRange = (day, start, end) => {
  if (!day || day === "Unknown") return false;
  const d = String(day).slice(0, 10);
  if (start && d < start) return false;
  if (end && d > end) return false;
  return true;
};