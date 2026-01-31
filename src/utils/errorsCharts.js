export const RULE_LABELS = {
  DIFF_AMAZON_VS_SAP: "Amazon vs SAP (diferencia)",
  NO_SAP_PAYMENT: "No hay pago SAP",
  AMAZON_INTERNAL_MISMATCH: "Amazon no cuadra internamente",
};

export const ruleLabel = (rule) => RULE_LABELS[rule] || rule;
