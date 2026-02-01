import React from "react";

const ReportsKpiCardsSkeleton = ({ count = 5 }) => {
  return (
    <div className="kpi-cards">
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

export default ReportsKpiCardsSkeleton;
