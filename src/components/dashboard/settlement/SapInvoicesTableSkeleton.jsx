import React from "react";
import SapInvoicesTableHeaders, { COLS } from "./SapInvoicesTableHeaders";

const SapInvoicesTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="table-card">
      <div className="table-container">
        <table className="data-table">
          <SapInvoicesTableHeaders />
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

export default SapInvoicesTableSkeleton;
