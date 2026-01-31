import React from "react";

const KPICardSkeleton = () => {
  return (
    <div className="kpi-card kpi-skeleton">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-value" />
      <div className="skeleton skeleton-change" />
    </div>
  );
};

export default KPICardSkeleton;
