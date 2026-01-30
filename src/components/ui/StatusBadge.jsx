import React from "react";
import "../../styles/status-badge.css";

const STATUS_MAP = {
  C: {
    label: "Completed",
    className: "status-success",
  },
  P: {
    label: "Pending",
    className: "status-pending",
  },
  F: {
    label: "Failed",
    className: "status-error",
  },
};

const StatusBadge = ({ status }) => {
  const value = status ?? "-";

  const config = STATUS_MAP[value] || {
    label: value,
    className: "status-default",
  };

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
