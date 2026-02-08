export const RULE_LABELS = {
  DIFF_AMAZON_VS_SAP: "Amazon vs SAP (diferencia)",
  NO_SAP_PAYMENT: "No hay pago SAP",
  AMAZON_INTERNAL_MISMATCH: "Amazon no cuadra internamente",
};

export const ruleLabel = (rule) => RULE_LABELS[rule] || rule;

export const money = (n) => {
  const num = Number(n ?? 0);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const truncate = (s, max = 22) => {
  const str = String(s ?? "");
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
};
