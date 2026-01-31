import React from "react";

const ChartCardSkeleton = ({ title }) => {
  return (
    <div className="card chart-card chart-skeleton">
      <div className="card-header">
        <div className="skeleton skeleton-title" />
      </div>

      <div className="chart-body">
        <div className="skeleton skeleton-chart" />
      </div>
    </div>
  );
};

export default ChartCardSkeleton;
