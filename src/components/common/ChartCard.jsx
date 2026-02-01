import React from "react";

const ChartCard = ({ title, subtitle, loading, skeletonClass = "", children }) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-title">{title}</div>
          {subtitle ? <div className="chart-subtitle">{subtitle}</div> : null}
        </div>
      </div>

      <div className="chart-inner">
        {loading ? (
          <div className={`chart-skeleton ${skeletonClass}`} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
