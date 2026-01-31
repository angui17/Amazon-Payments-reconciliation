export const STATUS_LABELS = {
  C: "Completed",
  P: "Pending",
};

export const FEE_STATUS_MAP = {
  P: "Pending",
  C: "Completed",
  F: "Failed",
};

export const getFeeStatusLabel = (status) =>
  FEE_STATUS_MAP[status] || status || "Unknown";

export const FEE_STATUS_LABEL_TO_CODE = {
  Pending: "P",
  Completed: "C",
  Failed: "F",
};
