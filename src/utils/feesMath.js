import { sumBy, formatMoney, toNumber } from "./refundMath";

export const totalFeesNet = (fees = []) => {
  const total = sumBy(fees, (f) => f.TOTAL ?? f.total ?? 0);
  return formatMoney(total);
};

export const feeTransactionsCount = (fees = []) => {
  return fees.length.toLocaleString("en-US");
};

export const topFeeTypeByImpact = (fees = []) => {
  if (!fees.length) return "—";

  const map = fees.reduce((acc, f) => {
    const type = f.TYPE || "Unknown";
    const amount = Math.abs(toNumber(f.TOTAL ?? f.total ?? 0));

    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {});

  const top = Object.entries(map)
    .sort((a, b) => b[1] - a[1])[0];

  return top ? top[0] : "—";
};

export const avgFeePerSettlement = (fees = []) => {
  if (!fees.length) return "—";

  let absTotalSum = 0;
  const settlements = new Set();

  for (const f of fees) {
    const total = Math.abs(toNumber(f.TOTAL ?? f.total ?? 0));
    absTotalSum += total;

    const settlementId = f.SETTLEMENT_ID || f.settlement_id;
    if (settlementId) settlements.add(settlementId);
  }

  const count = settlements.size || 1; // evita división por 0
  const avg = absTotalSum / count;

  return formatMoney(avg);
};