import React from "react";
import "../../../styles/settlements-table.css";

const SettlementErrorsDetailTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="card table-card">
      <div className="card-header table-header">
        <h3>Settlement Errors Detail</h3>
        <div className="table-meta">Loading…</div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i}>
                  <div className="sk-line" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r} className="sk-row">
                {Array.from({ length: 9 }).map((__, c) => (
                  <td key={c}>
                    {c === 8 ? (
                      <div className="sk-pill" />
                    ) : (
                      <div className="sk-line" />
                    )}
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

export default SettlementErrorsDetailTableSkeleton;
