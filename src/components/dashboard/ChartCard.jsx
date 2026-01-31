import React from "react";

const ChartCard = ({ title, rightSlot, children }) => {
  return (
    <div className="card chart-card">
      <div className="card-header">
        <h3>{title}</h3>
        {rightSlot ? rightSlot : null}
      </div>

      <div className="chart-body">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
