import React from "react";
import "./../../../styles/settlements-table.css";

const AccountingSettlementDetailTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="card table-card" style={{ marginTop: 16 }}>
      <div className="card-header table-header">
        <h3>Settlement Accounting Detail</h3>
        <div className="table-meta">Loading…</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Posted date</th>
              <th>Order ID</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Description</th>
              <th className="th-center">Amount</th>
              <th className="th-center">Total</th>
              <th className="th-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <td key={j}>
                    <div
                      className="skeleton"
                      style={{ height: 14, width: "100%", borderRadius: 6 }}
                    />
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

export default AccountingSettlementDetailTableSkeleton;
