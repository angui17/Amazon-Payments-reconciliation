import React from "react";
import "../../../styles/charts.css"; 

const ChartCard = ({ title, subtitle, loading, height = 260, children, span = 6 }) => {
  return (
    <div className="chart-card" style={{ gridColumn: `span ${span}` }}>
      <div className="chart-card-header">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-subtitle">{subtitle}</div>
        </div>
      </div>

      {loading ? (
        <div className="chart-skeleton chart-skeleton-bars" style={{ height }} />
      ) : (
        <div className="chart-inner" style={{ height }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ChartCard;
