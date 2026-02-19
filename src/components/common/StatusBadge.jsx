import React from "react";

const StatusBadge = ({ status, children }) => {
  const map = {
    success: "status-success",
    error: "status-error",
    pending: "status-pending",
  };

  return (
    <span className={`status-badge ${map[status] || ""}`}>
      {children ?? status}
    </span>
  );
};

export default StatusBadge;