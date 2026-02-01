import React from "react";
import SettlementRowsTableHeaders, { COLS } from "./SettlementRowsTableHeaders";

const SettlementRowsTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <SettlementRowsTableHeaders />
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="orders-skeleton-row">
                {COLS.map((c) => (
                  <td key={c.key}>
                    <div className="orders-skeleton skeleton-w-md" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementRowsTableSkeleton;
