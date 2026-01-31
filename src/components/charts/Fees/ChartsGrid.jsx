import React from "react";

const ChartsGrid = ({ children }) => {
  return (
    <div
      className="charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
        marginTop: 16,
      }}
    >
      {children}
    </div>
  );
};

export default ChartsGrid;
