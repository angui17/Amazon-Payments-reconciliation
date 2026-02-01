// utils/numberUtils.js

export const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const formatMoney = (value, {
  currency = "$",
  decimals = 2,
} = {}) => {
  const num = Number(value ?? 0);

  if (!Number.isFinite(num)) {
    return `${currency}0.00`;
  }

  return `${currency}${num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};
