import {
  sumBy,
  toNumber,
  groupRefundsByDate,
  topSkusByRefundAmount,
  refundBreakdownTotals,
} from "./refundMath";

export const computeRefundsSalesKpis = (rows = []) => {
  const refundUnits = sumBy(rows, (r) => r.QUANTITY);
  const refundAmount = sumBy(rows, (r) => Math.abs(toNumber(r.PRODUCT_SALES)));
  const netRefundTotal = sumBy(rows, (r) => r.TOTAL);
  const fees = sumBy(rows, (r) => toNumber(r.SELLING_FEES) + toNumber(r.FBA_FEES) + toNumber(r.OTHER));

  return { refundUnits, refundAmount, netRefundTotal, fees };
};

export const computeRefundsSalesCharts = (rows = []) => {
  return {
    topSkus: topSkusByRefundAmount(rows, 5),
    refundsByDate: groupRefundsByDate(rows),
    breakdown: refundBreakdownTotals(rows),
  };
};
