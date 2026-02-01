import React from "react";

const SettlementKPIsSkeleton = ({ count = 6 }) => {
  return (
    <div className="settlement-kpis-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kpi-card kpi-skeleton">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-value" />
          <div className="skeleton skeleton-change" />
        </div>
      ))}
    </div>
  );
};

export default SettlementKPIsSkeleton;
